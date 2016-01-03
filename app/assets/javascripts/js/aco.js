Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
var getOptions = function(options){
	defaults =  {
					placeBegin: {},
					placeEnd: {},
					placeLists:[],
					placeIds:[],
					moneySpend: 0,
					moneyPrepare:0,
					antVector:{},
					antPheromone: [],
					antUpdatePhe: [],
					antSchedule: [],
					antVisited: [],
					antUnVisited:[],
					antNumber:10,
					antConstant:0.5,
					antMaxLoop:25,
					antCurrLoop:0,
					antBestMoney: [],
					antBestDistance: [],
					antBestSchedule: [],
					antBestDuration: [],
					antAlpha:0.2,
					antBetal:0.3,
					antDelta:1,
					antRho:0.8,
					antVectorDistance: {},
					antResult:{},
					timeStart:7.5,
					timeEnd: 24,
					userNumber: 1,
					check:false
			},
			defaults = jQuery.extend(defaults,options);
			defaults.antMaxLoop = defaults.placeLists.length * defaults.placeLists.length + 25;
			for (var i = 0; i < defaults.placeLists.length; i++) {
				defaults.antPheromone[i] = []; 
				defaults.antUpdatePhe[i] = []; 
				defaults.antSchedule[i]  = i;
				for (var j = 0; j < defaults.placeLists.length; j++) {
				 	defaults.antPheromone[i][j] = defaults.antConstant; 
					defaults.antUpdatePhe[i][j] = 0; 
				 }; 
			};
		return defaults;
	},
	cloneObject = function (obj) {
	   var coppy =  jQuery.extend(true, {}, obj);
	   return coppy;
	}
	,acoCreateSchedule = function(optionsSource){
		console.log("Start ACO creative Trip");
		optionsSource  	= getOptions(optionsSource);

		var _antResult={}, _antBestDistance = 0,_antBestDuration=0, _antBestSchedule = [],
		_antBestMoney=0, _Places = _saveArray(optionsSource.placeLists), _currentLoop = optionsSource.antCurrLoop, _maxLoop = optionsSource.antMaxLoop
		,_antNumber = optionsSource.antNumber,_antCurrDistance = 0,_antCurrDuration = 0,_antCurrMoney = 0 ,timeCurrent = optionsSource.timeStart;
		timeStart = optionsSource.timeStart;
		var notScheudle = [];


		
		optionsSource.antBestDistance = [];
		console.log(optionsSource);
		while(_currentLoop < 2){

			//Loop with all ant
			for (var ant = 0; ant < _antNumber; ant++) {
				//Set Visited of ant m.
				for (var i = 0; i < _Places.length; i++) {
					optionsSource.antVisited[i] = false;
					notScheudle[i] = false;
				};
				_antCurrDistance 	= 0,_antCurrDuration = 0,_antCurrMoney = 0;


				var _tmpSchedule 	= {},maxPlaceInDay = _Places.length;
				maxPlaceInDay = maxPlaceInDay/parseInt(optionsSource.dayNumber)  + 1;
				if (maxPlaceInDay <= parseInt(optionsSource.dayNumber)) {
					maxPlaceInDay = 1;
				}

				_tmpSchedule = cloneObject(optionsSource.schedules);


				_tmpSchedule["Day_Not"].placeIds = [];
				_tmpSchedule["Day_Not"].placeLists = [];
				var notCount = 0;
				for (var i = 0; i < _Places.length; i++) {
					//console.log("Before: "  + optionsSource.antSchedule[i]);
					optionsSource.antSchedule[i] = antLotteryWheel(optionsSource,optionsSource.antSchedule[i]);
					//console.log("After: "+ optionsSource.antSchedule[i]);
				
					for (var day = 1; day <= parseInt(optionsSource.dayNumber); day++) {

						var tmpCluster = [];
						tmpCluster = _saveArray(_tmpSchedule["Day_"+day].placeLists); // Temp Array
						tmpCluster.push(_Places[optionsSource.antSchedule[i]]);

						if (tmpCluster.length > maxPlaceInDay) {
							if (day ==  parseInt(optionsSource.dayNumber)) {

									break;
								};
								continue;
						};
						var _tmpRs = acoAlgorithm({
								placeLists: tmpCluster, 
								check: true,
								timeStart: 	_tmpSchedule["Day_"+day].timeStart, 
								userNumber: _tmpSchedule["Day_"+day].userNumber,
								moneyNumber: _tmpSchedule["Day_"+day].moneyNumber, 
								placeBegin: _tmpSchedule["Day_"+day].placeBegin, 
								placeEnd: 	_tmpSchedule["Day_"+day].placeEnd,
								antVectorDistance:optionsSource.antVectorDistance
							});

						_tmpRs = updatePlaceCome(_tmpRs);
						if ((_tmpRs.money > parseFloat(optionsSource.schedules["Day_"+day].moneyNumber) && parseFloat(optionsSource.schedules["Day_"+day].moneyNumber) > 0) 
							|| _tmpRs.notPlaceLists.length > 0  
							|| _tmpRs.placeLists.length < 1 
							|| parseFloat(_tmpRs.duration) > parseFloat(optionsSource.schedules["Day_"+day].timeEnd)) {
				
							if (day ==  parseInt(optionsSource.dayNumber)) {
									if (_tmpSchedule["Day_Not"].placeIds.indexOf(_Places[optionsSource.antSchedule[i]].place_id) < 0) {
										notScheudle[optionsSource.antSchedule[i]] = true;
										notCount++;
										_tmpSchedule["Day_Not"].placeLists.push(_Places[optionsSource.antSchedule[i]]);
										_tmpSchedule["Day_Not"].placeIds.push(_Places[optionsSource.antSchedule[i]].place_id);
										_tmpSchedule["Day_Not"].placeNumber = _tmpSchedule["Day_Not"].placeLists.length;
									};
									break;
								};
								continue;
						}

						if (parseFloat(_tmpRs.duration) <= parseFloat(optionsSource.schedules["Day_"+day].timeEnd) ) {

							_tmpSchedule["Day_"+day] = cloneObject(_tmpRs);
							break;
							//console.log("OK");
						};
					};

					//update status of ant m in place i
					optionsSource.antVisited[optionsSource.antSchedule[i]] = true;
				};

				for (var day = 1; day <= parseInt(optionsSource.dayNumber); day++) {
					if (typeof _tmpSchedule["Day_"+day].distance !=='undefined') {
						_antCurrDistance += _tmpSchedule["Day_"+day].distance;
						
					};
				}

				//Save schedule with the best distance
				if ((_antCurrDistance < optionsSource.antBestDistance[notCount]) ||( optionsSource.antBestDistance[notCount] == 0)||(  typeof optionsSource.antBestDistance[notCount] == 'undefined')) {

					optionsSource.antBestDistance[notCount] = _antCurrDistance;
					for (var i = 0; i < _Places.length; i++) {
						var exist = false;
						for (var day = 1; day <= parseInt(optionsSource.dayNumber); day++) {
							if ( _tmpSchedule["Day_"+day].placeIds.indexOf(_Places[i].place_id) > -1) {
								exist = true; break;
							};
						}
						if (!exist) {
							if (_tmpSchedule["Day_Not"].placeIds.indexOf(_Places[i].place_id) < 0) {
										notScheudle[optionsSource.antSchedule[i]] = true;
										notCount++;
										_tmpSchedule["Day_Not"].placeLists.push(_Places[i]);
										_tmpSchedule["Day_Not"].placeIds.push(_Places[i].place_id);
										_tmpSchedule["Day_Not"].placeNumber = _tmpSchedule["Day_Not"].placeLists.length;
									};
						};
					}
					_antBestSchedule[notCount] = _tmpSchedule; 
				};	
				//Update phemore
				for (var i = 0; i < _Places.length; i++) {
					for (var j = 0; j < _Places.length; j++) {
						if (!notScheudle[j]) {
							optionsSource.antUpdatePhe[i][j] += (_antCurrDistance ==0)? 0: optionsSource.antDelta/_antCurrDistance;
						};	
					}
				};
				
				optionsSource = antPheromoneUpdate(optionsSource);
			};
			_currentLoop++;
		}
		console.log("Finish");
		var antBestSchedule =[]; 
		var _antCurrMoney  	= 0,_antCurrDistance  	= 0;
		for (var i = 0; i < _antBestSchedule.length; i++) {
			if (typeof _antBestSchedule[i] != 'undefined') {
				console.log("I: "+i);
				for (var day = 1; day <= parseInt(optionsSource.dayNumber); day++) {
				 	antBestSchedule["Day_"+day] = updatePlaceCome(_antBestSchedule[i]["Day_"+day]);
				 	 _antCurrMoney  	 += antBestSchedule["Day_"+day].money;
				 	 _antCurrDistance   += antBestSchedule["Day_"+day].distance;
				}
				antBestSchedule["Day_Not"] = _antBestSchedule[i]["Day_Not"];
				break;
			};
		};
		
		optionsSource.money 	= _antCurrMoney
		optionsSource.distance 	= _antCurrDistance
		optionsSource.schedules = antBestSchedule;

		return optionsSource;
	}
	,checkAvailable  = function(time,chedules,number,ignore){
		for (var i = 1; i <= number; i++) {
			if (i != ignore) {
				if (time > chedules["Day_"+i].timeStart) {
					return i;
				};
			};
		};
		return 0;
	}
	,findPlace = function(places,_tmpSchedule,optionsSource,maxPlaceInDay){
		var _rs  = _saveArray(places);
		for (var i = 0; i < _rs.length; i++) {
			var checkAdd = 0,tmpCluster ;
			for (var day = 1; day <= parseInt(optionsSource.dayNumber); day++) {
				tmpCluster = [];
				tmpCluster = _saveArray(_tmpSchedule["Day_"+day].placeLists); // Temp Array
				tmpCluster.push(_rs[i]);
				if (tmpCluster.length > maxPlaceInDay) { continue; };
				var _tmpRs = acoAlgorithm({ placeLists: tmpCluster,  check: true,
								timeStart: 	optionsSource.schedules["Day_"+day].timeStart, 
								placeBegin: optionsSource.schedules["Day_"+day].placeBegin, 
								placeEnd: 	optionsSource.schedules["Day_"+day].placeEnd,
								antVectorDistance:optionsSource.antVectorDistance
							});
				_tmpRs = updatePlaceCome(_tmpRs);
				if (parseFloat(_tmpRs.duration) > parseFloat(optionsSource.schedules["Day_"+day].timeEnd) ) {
					if (day ==  parseInt(optionsSource.dayNumber)) {
						if (_tmpSchedule["Day_Not"].placeIds.indexOf(_rs[i].place_id) < 0) {
							_tmpSchedule["Day_Not"].placeLists.push(_rs[i]);
							_tmpSchedule["Day_Not"].placeIds.push(_rs[i].place_id);
							_tmpSchedule["Day_Not"].placeNumber = _tmpSchedule["Day_Not"].placeLists.length;
							};
							break;
						};
					continue;
				}else{
					_tmpSchedule["Day_"+day] = cloneObject(_tmpRs);
						break;
								//console.log("OK");
				};
			};
		};
		return _tmpSchedule;
	}
	,filterSchedule = function(_tmpSchedule){
		return {
						distance: _tmpSchedule.antBestDistance,
						duration: _tmpSchedule.antBestDuration,
						placeBegin: _tmpSchedule.placeBegin,
						placeEnd: _tmpSchedule.placeEnd,
						timeStart: _tmpSchedule.timeStart,
						placeLists: _tmpSchedule.placeLists,
						placeIds: _tmpSchedule.placeIds,
					}
	}
	,acoAlgorithm1 	= function(options){
		var _Places = _saveArray(options.placeLists), timeCurrent = 0, distance = 0,_antCurrMoney = 0;
		var _checkTmp = _checkPlace(options,{place1:options.placeBegin, place2: _Places[0]},options.timeStart);
			_antCurrMoney 	   += parseFloat(_Places[0].place_ticket) * parseFloat(options.userNumber);
			timeCurrent = _checkTmp.timeOut;
			distance += _checkTmp.place1.next_distance
		var _checkTmp2 	= _checkPlace(options,{place1:_Places[0], place2:options.placeEnd }, timeCurrent);

			distance += _checkTmp2.place1.next_distance
			timeCurrent += _checkTmp2.place1.next_time;

			var placeIds = [];
			placeIds[0] = _Places[0].place_id;

		if (timeCurrent > parseFloat(options.timeEnd)) {
			return {
				duration: 		timeCurrent,
				distance: 		distance,
				money: 		_antCurrMoney,
				moneyNumber: options.moneyNumber,
				userNumber: 		options.userNumber,
				notPlaceLists: 	_Places,
				placeLists: 	[],
				placeIds: 		placeIds,
				notplaceIds: 	placeIds,
				timeCurrent: 	timeCurrent,
				placeBegin: 	options.placeBegin,
				placeEnd: 		options.placeEnd,
				timeStart: 		parseFloat(options.timeStart),
				timeEnd: 		options.timeEnd,
			}
		};
		return {
			duration: 		timeCurrent,
			distance: 		distance,
			money: 		_antCurrMoney,
				moneyNumber: options.moneyNumber,
			userNumber: 		options.userNumber,
			notPlaceLists: 	[],
			placeLists: 	_Places,
			placeIds: 		_Places,
			notplaceIds: 	[],
			timeCurrent: 	timeCurrent,
			placeBegin: 	options.placeBegin,
			placeEnd: 		options.placeEnd,
			timeStart: 		parseFloat(options.timeStart),
			timeEnd: 		options.timeEnd,
		}
	}
	,acoAlgorithm	= function(options){
		options  	= getOptions(options);

		var _antResult={}, _antBestDistance = 0,_antBestDuration=0, 
		_antBestMoney=0, _Places = _saveArray(options.placeLists), _currentLoop = options.antCurrLoop, _maxLoop = options.antMaxLoop
		,_antNumber = options.antNumber,_antCurrDistance = 0,_antCurrDuration = 0,_antCurrMoney = 0 ,timeCurrent = options.timeStart;
		options.notScheudle 	= [];
		options.antNotResult 	= [];
		if (_Places.length < 2) {
			return acoAlgorithm1(options);
		};

		options.bestSchedule 	= [];
		options.bestSchedule.notSchedule = _saveArray(options.notScheudle)
		var notBestSchedule = 0;
		options.bestSchedule.timeStart 		= options.timeStart;
		options.bestSchedule.timeCurrent 	= options.timeStart;

		if (_Places.length == 1) {
			//options    = _SaveArraySchedule(options);
			options.notPlaceLists =[];
			return options;
		};

				for (var i = 0; i < _Places.length; i++) {
					_Places.place_time = _Places.place_time1;
				}
		while(_currentLoop < _maxLoop){
			//Loop with all ant
			for (var ant = 0; ant < _antNumber; ant++) {
				//Set Visited of ant m.
				for (var i = 0; i < _Places.length; i++) {
					options.antVisited[i] 	= false;
					options.notScheudle[i] 	= false;
				};
				_antCurrDistance = 0,_antCurrDuration = 0,_antCurrMoney = 0 ;
				timeCurrent = options.timeStart
				var loopBack = []; var notCount = 0;
				for (var i = 0; i < _Places.length; i++) {
					options.antSchedule[i] = antLotteryWheel(options,options.antSchedule[i]);
					if (options.check == true){
						//console.log("Time Late: " + encryptTime(_Places[options.antSchedule[i]].place_late))
					
						if (encryptTime(_Places[options.antSchedule[i]].place_open) > timeCurrent ){
							for (var tt = 0; tt < _Places.length; tt++) {
									if(!options.antVisited[tt]){
										if (encryptTime(_Places[options.antSchedule[i]].place_open) > encryptTime(_Places[tt].place_open)) {
											options.antVisited[options.antSchedule[i]] = tt;
										};
									}
								}
								
							if (encryptTime(_Places[options.antSchedule[i]].place_open) > timeCurrent ){
								timeCurrent = encryptTime(_Places[options.antSchedule[i]].place_open);
							}
						}

						if (encryptTime(_Places[options.antSchedule[i]].place_late) < timeCurrent ){
							options.antVisited[options.antSchedule[i]] = true;
							options.notScheudle[options.antSchedule[i]] = true;
							notCount++;
							continue;
						}
					}

					//Update money in schedule of day number k
					try{
						var place_ticket = parseFloat(_Places[options.antSchedule[i]].place_ticket);
						if (place_ticket !== NaN) {
							_antCurrMoney 	   += place_ticket *  parseFloat(options.userNumber);
						};
					} 
					catch(e){
						console.log("Error");
						console.log(options.antSchedule[i]);
						console.log(_Places);
						//continue;
					}

					if (i==0) {
						var _checkTmp = _checkPlace(options,{place1:options.placeBegin, place2: _Places[options.antSchedule[i]]},timeCurrent);
						options.placeBegin = _checkTmp.place1,_Places[options.antSchedule[i]] = _checkTmp.place2,timeCurrent = _checkTmp.timeOut;

						_antCurrDuration   += _checkTmp.place1.next_time ;
						_antCurrDistance   += _checkTmp.place1.next_distance;
					}else if(i==(_Places.length - 1)){
						options.placeEnd.place_time = 0;
						var _checkTmp = _checkPlace(options,{place1:_Places[options.antSchedule[i]], place2:options.placeEnd},timeCurrent);
						timeCurrent += _checkTmp.place1.next_time + parseFloat(_checkTmp.place1.place_time) ;

						_antCurrDuration   = timeCurrent;
						_antCurrDistance   += _checkTmp.place1.next_distance;
					}
					else{
						var _checkTmp = _checkPlace(options,{place1:_Places[options.antSchedule[i-1]], place2: _Places[options.antSchedule[i]]},timeCurrent);
						_Places[options.antSchedule[i-1]] = _checkTmp.place1,


						_Places[options.antSchedule[i]] = _checkTmp.place2,

						timeCurrent = _checkTmp.timeOut;
						_antCurrDuration   = timeCurrent;
						_antCurrDistance   += _checkTmp.place1.next_distance;
					};
					//update status of ant m in place i
					options.antVisited[options.antSchedule[i]] = true;
				};
				//Save schedule with the best distance
				if (_antCurrDistance < options.antBestDistance[notCount] || options.antBestDistance[notCount] == 0 || typeof options.antBestDistance[notCount] == 'undefined') {
					options.antBestDistance[notCount] 	= _antCurrDistance;
					options.antBestDuration[notCount] 	= _antCurrDuration;
					options.antBestMoney[notCount] 		= _antCurrMoney;
					options.antBestSchedule[notCount] 	= _saveArray(options.antSchedule);
					
					options.bestSchedule[notCount] = {
						money: _antCurrMoney,
						moneyNumber: options.moneyNumber,
						distance: _antCurrDistance,
						duration: _antCurrDuration,
						schedule: _saveArray(options.antSchedule),
						timeCurrent: timeCurrent,
						notSchedule: _saveArray(options.notScheudle)
					}
				};

				//Update phemore

				for (var i = 0; i < _Places.length; i++) {
					for (var j = 0; j < _Places.length; j++) {
						if (!options.notScheudle[i]) {
							if (_antCurrDistance != 0) {
								options.antUpdatePhe[i][j] += options.antDelta/_antCurrDistance;
							};
						}
					}
				};

				options = antPheromoneUpdate(options);
			};

			_currentLoop++;
		}

		return _SaveArraySchedule(options);
	}
	,_SaveArraySchedule = function(options){
		var placeLists = [], notPlaceLists = [], placeIds = [],notplaceIds = [], places = options.placeLists,
		schedule =  [],bestSchedule , notSchedule = [];

		for (var i = 0; i < options.bestSchedule.length; i++) {
			if (typeof options.bestSchedule[i] != 'undefined') {
				schedule = options.bestSchedule[i].schedule, notSchedule = options.bestSchedule[i].notSchedule,
				bestSchedule = options.bestSchedule[i];
			};
		};

		if (bestSchedule.distance ==0) {
			return {
				duration: 		bestSchedule.duration,
				distance: 		bestSchedule.distance,
				money: 			bestSchedule.money,
				moneyNumber: options.moneyNumber,
				userNumber: 			options.userNumber,
				notPlaceLists: 	[],
				placeLists: 	[],
				placeIds: 		[],
				notplaceIds: 	[],
				timeCurrent: 	bestSchedule.timeCurrent,
				placeBegin: 	options.placeBegin,
				placeEnd: 		options.placeEnd,
				timeStart: 		parseFloat(options.timeStart),
				timeEnd: 		options.timeEnd,
			}
		};

		for (var i = 0; i < places.length; i++) {
			if (notSchedule[i]) {
				try{
					if (notplaceIds.indexOf(places[notSchedule[i]].place_id) > -1) {

						notPlaceLists.push(places[notSchedule[i]]);
						notplaceIds.push(places[notSchedule[i]].place_id);
					};
				}catch(e){
					//console.log(notSchedule[i] + " - " +i);
				}
			}else{
				placeLists.push(places[schedule[i]]);
				placeIds.push(places[schedule[i]].place_id);
			};
		};

		return {
			duration: 		bestSchedule.duration,
			distance: 		bestSchedule.distance,
			money: 			bestSchedule.money,
			moneyNumber: options.moneyNumber,
			userNumber: 			options.userNumber,
			notPlaceLists: 	notPlaceLists,
			placeLists: 	placeLists,
			placeIds: 		placeIds,
			notplaceIds: 	notplaceIds,
			timeCurrent: 	bestSchedule.timeCurrent,
			placeBegin: 	options.placeBegin,
			placeEnd: 		options.placeEnd,
			timeStart: 		parseFloat(options.timeStart),
			timeEnd: 		options.timeEnd,
		}
	}
	,updateDurarion = function(schedule){
		if (typeof schedule === 'object' ) {

			var _schPlaces = _saveArray(schedule.placeLists),
			_duration = 0,_distance=0,_money=0, _currentTime = 0;
			if (_schPlaces.length > 0) {
				try{

					schedule.placeBegin.next_time = parseFloat(tripPlan.vectorDistances["T"+schedule.placeBegin.place_id]["T"+_schPlaces[0].place_id].duration);
				
				}catch(r){
					console.log(_schPlaces);
				}

				schedule.placeBegin.next_distance = parseFloat(tripPlan.vectorDistances["T"+schedule.placeBegin.place_id]["T"+_schPlaces[0].place_id].distance);
				_distance 	+= schedule.placeBegin.next_distance;
				_duration   += schedule.placeBegin.next_distance;
				_currentTime = _duration;

				for (var i = 0; i < _schPlaces.length-1; i++) {
					_schPlaces[i].next_time = parseFloat(tripPlan.vectorDistances["T"+_schPlaces[i].place_id]["T"+_schPlaces[i+1].place_id].duration);
					_schPlaces[i].next_distance = parseFloat(tripPlan.vectorDistances["T"+_schPlaces[i].place_id]["T"+_schPlaces[i+1].place_id].distance);
					_duration 	+= _schPlaces[i].next_time
					if (_duration < encryptTime(_schPlaces[i].place_open) ) {
						_duration = encryptTime(_schPlaces[i].place_open) ;
					};
					_duration 	+= parseFloat(_schPlaces[i].place_time);
					_distance 	+= _schPlaces[i].next_distance;
					_money 		+= (parseFloat(_schPlaces[_schPlaces.length-1].place_ticket) * parseFloat(schedule.userNumber)); 
				};

				_schPlaces[_schPlaces.length-1].next_time = parseFloat(tripPlan.vectorDistances["T"+_schPlaces[_schPlaces.length-1].place_id]["T"+schedule.placeEnd.place_id].duration);
				_schPlaces[_schPlaces.length-1].next_distance = parseFloat(tripPlan.vectorDistances["T"+_schPlaces[_schPlaces.length-1].place_id]["T"+schedule.placeEnd.place_id].distance);
				_duration 	+= _schPlaces[_schPlaces.length-1].next_time;
				if (_duration < encryptTime(_schPlaces[_schPlaces.length-1].place_open) ) {
					_duration = encryptTime(_schPlaces[_schPlaces.length-1].place_open) ;
				};
				_money 		+= (parseFloat(_schPlaces[_schPlaces.length-1].place_ticket) * parseFloat(schedule.userNumber)); 
				_duration 	+= parseFloat(_schPlaces[_schPlaces.length-1].place_time);
				_distance 	+= _schPlaces[_schPlaces.length-1].next_distance;
			}
			schedule.duration 	= parseFloat(_duration.toFixed(2));
			schedule.money 		= parseFloat(_money);
			schedule.distance 	= parseFloat(_distance.toFixed(2));

		};
		return schedule;
	}
	,updatePlaceCome = function(schedule){
		 updateDurarion(schedule);
		schedule.placeBegin.place_come = decryptTime(schedule.timeStart);

		var timeCurrent = parseFloat(schedule.timeStart) + parseFloat(schedule.placeBegin.next_time);
		
		//console.log(timeCurrent);
		for (var i = 0; i < schedule.placeLists.length; i++) {
			if (timeCurrent < encryptTime(schedule.placeLists[i].place_open) ) {
				timeCurrent = encryptTime(schedule.placeLists[i].place_open) ;
			};
			schedule.placeLists[i].place_come = decryptTime(timeCurrent);
			timeCurrent += parseFloat(schedule.placeLists[i].place_time) + parseFloat(schedule.placeLists[i].next_time);
		};

		schedule.placeEnd.place_come = decryptTime(timeCurrent);

		//console.log(schedule);
		return schedule;
	}
	,antLotteryWheel = function(options,k){
		var _antSum1 = 0,_antSum =0, _antDem = -1, _antP =[];
		for (var i = 0; i < options.placeLists.length ; i++) {
			_antP[i] = 0; options.antUnVisited[i] = 0;
		};
		for (var i = 0; i < options.placeLists.length; i++) {
			if (!options.antVisited[i]) {
				try{
					_antP[i] 		=  Math.pow(options.antPheromone[k][i],options.antAlpha) / Math.pow(options.antPheromone[k][i],options.antBetal);
					_antSum1  		+= _antP[i];// _antSum1 là tong gia tri
					_antDem++;
					options.antUnVisited[_antDem] 	=i;	
				}catch(e){
					console.log(options);
					_antP[i] 		=  Math.pow(options.antPheromone[k][i],options.antAlpha) / Math.pow(options.antPheromone[k][i],options.antBetal);
				}
			} 
		}
		for (var i = 0; i < options.placeLists.length; i++) {
			_antP[i] = _antP[i] / _antSum1;
		}
		for (var i = 0; i < options.placeLists.length; i++) {
			_antSum  		+= _antP[i]; //_antSum là biến tổng các xác suất
		}
		// dùng kỹ thuật bánh xe số
		_antSum = Math.random() * _antSum; var  t = 0; i=-1;
		while(t <= _antSum){
			i++;
			t=t+_antP[options.antUnVisited[i]];
		}
		return options.antUnVisited[i];
	}
	,antPheromoneUpdate = function (options)
	{
		for (var i = 0; i < options.placeLists.length; i++) {
	     	for (var j = 0; j < options.placeLists.length; j++) {
	     		options.antPheromone[i][j] = options.antUpdatePhe[i][j] + options.antPheromone[i][j] * options.antRho;

	     	};
	    }; 
	    if (options.antPheromone[0][0] =='Infinity') {
	    	console.log(options);
	     			console.log("Infinity");
	     			console.log(options);
	     	};
	    return options;
	}
	,_SaveArray = function(data){
		var Z = [];
		for (var i = 0; i < data.length; i++) {
			Z.push(data[i]);
		};
		return Z;
	} 
	,_saveArray = function(data){
		var Z = [];
		for (var i = 0; i < data.length; i++) {
			Z.push(data[i]);
		};
		return Z;
	}
	,_checkPlace = function(options,places,timeStart){
		var antVector 	=options.antVectorDistance, nextTime = 0, nextDistance = 0, moneyPlace = 0,timeStart = parseFloat(timeStart),timeOut =0;

		nextTime  		= parseFloat(antVector["T"+places.place1.place_id]["T"+places.place2.place_id].duration);
		nextDistance  	= parseFloat(antVector["T"+places.place1.place_id]["T"+places.place2.place_id].distance);

		moneyPlace 		= parseFloat(places.place2.place_ticket);

		var _decryptTime = timeStart + nextTime;


		if (_decryptTime <= encryptTime(places.place2.place_open)) {
			_decryptTime = encryptTime(places.place2.place_open);
		};

		places.place2.place_come 	= _decryptTime;
		places.place1.next_time 	= nextTime;
		places.place1.next_distance = nextDistance;

		timeOut			= _decryptTime + parseFloat(places.place2.place_time);
		return {
			place2: places.place2,
			place1: places.place1,
			timeOut: timeOut,
			money: moneyPlace
		}
	}
	,_SaveArrayplaceIds = function(places){
		var Z = [];
		for (var i = 0; i < places.length; i++) {
			Z.push(places[i].place_id);
		};
		return Z;
	},
	_SaveArrayNotPlaces = function (_Places,data,not){
		var Z = [];
		for (var i = 0; i < data.length; i++) {
			if (not[i]) {
				Z.push(_Places[data[i]]);
				console.log("Save not");
			};
		};
		return Z;
	}
	,_SaveArrayPlaces = function (_Places,data,not){
		var Z = [];
		for (var i = 0; i < data.length; i++) {
			if (!not[i]) {
				Z.push(_Places[data[i]]);
			};
		};
		return Z;
	},encryptTime = function(time){
		if (typeof time === 'undefined') return 0;

		time = time.split(":");
		time[0] = (typeof time[0] =='undefined') ? 0: time[0];
		time[1] = (typeof time[1] =='undefined') ? 0: time[1];
		return parseFloat(time[0]) + (parseFloat(time[1])/60);

	},decryptTime = function(time){
		var dece =  Math.floor(time);
		var min  =  Math.ceil((time%dece) * 60);

		
		min 	= ( min < 10) ? "0" + min : min;
		dece 	= ( dece < 10) ? "0" + dece : dece;
		return dece+":"+min;
	}
	,getArrayDistances = function (options,arrDistances){
			var obj = window.javo_map_box_func,_places = _saveArray(options.placeLists),time =101;	
			if (typeof options.placeBegin != 'undefined') {_places.unshift(options.placeBegin);};
			if (typeof options.placeEnd != 'undefined' && typeof options.placeBegin != 'undefined') {
				if (options.placeEnd.place_id != options.placeBegin.place_id) {
					_places.push(options.placeEnd)}
				};
			
			if (typeof arrDistances == 'undefined') {
				arrDistances = {};
			};
			
			for (var i = 0; i < _places.length; i++) {
				
				if (typeof arrDistances["T"+_places[i].place_id] === 'undefined'){
					arrDistances["T"+_places[i].place_id] = [];	
				}
				for (var j = 0; j < _places.length; j++) {
					if (typeof arrDistances["T"+_places[j].place_id] === 'undefined'){
						arrDistances["T"+_places[j].place_id] = [];	
					}
					if (i ==j) {
						arrDistances["T"+_places[i].place_id]["T"+_places[j].place_id] = {
							distance: 0,
							duration: 0
						};	
					}else if (typeof arrDistances["T"+_places[i].place_id]["T"+_places[j].place_id] === 'undefined') {
						if (typeof tripPlan.vectorDistances[_places[i].place_id] === 'undefined') {
							arrDistances["T"+_places[i].place_id]["T"+_places[j].place_id] = 
							obj.getDistancePoint(_places[i],_places[j]);			
						}else if(typeof tripPlan.vectorDistances["T"+_places[i].place_id]["T"+_places[j].place_id] === 'undefined'){
							arrDistances["T"+_places[i].place_id]["T"+_places[j].place_id] = 
							obj.getDistancePoint(_places[i],_places[j]);			
						}
						else{
							arrDistances["T"+_places[i].place_id]["T"+_places[j].place_id] =  
							tripPlan.vectorDistances["T"+_places[i].place_id]["T"+_places[j].place_id];
						};
					};
				};
			};	
			return arrDistances;			
		}
;