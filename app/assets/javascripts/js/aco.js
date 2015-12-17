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
					antNumber:3,
					antConstant:0.5,
					antMaxLoop:25,
					antCurrLoop:0,
					antBestDistance:0,
					antBestDuration:0,
					antAlpha:0.2,
					antBetal:0.3,
					antDelta:1,
					antRho:0.8,
					antVectorDistance: {},
					antResult:{},
					timeStart:7.5,
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
	},
	acoCreateSchedule = function(optionsSource){
		console.log("Start");
		optionsSource  	= getOptions(optionsSource);
		var _antResult={}, _antBestDistance = 0,_antBestDuration=0, _antBestSchedule = {},
		_antBestMoney=0, _Places = _saveArray(optionsSource.placeLists), _currentLoop = optionsSource.antCurrLoop, _maxLoop = optionsSource.antMaxLoop
		,_antNumber = optionsSource.antNumber,_antCurrDistance = 0,_antCurrDuration = 0,_antCurrMoney = 0 ,timeCurrent = optionsSource.timeStart;
		while(_currentLoop < 1){

			//Loop with all ant
			for (var ant = 0; ant < _antNumber; ant++) {
				//Set Visited of ant m.
				for (var i = 0; i < _Places.length; i++) {
					optionsSource.antVisited[i] = false;
				};
				_antCurrDistance = 0,_antCurrDuration = 0,_antCurrMoney = 0 ;
				var _tmpSchedule = {};
				_tmpSchedule = cloneObject(optionsSource.schedules);

				for (var i = 0; i < _Places.length; i++) {
					//console.log("Before: "  + optionsSource.antSchedule[i]);
					optionsSource.antSchedule[i] = antLotteryWheel(optionsSource,optionsSource.antSchedule[i]);

					//console.log("After: "+ optionsSource.antSchedule[i]);
					var checkAdd = 0,tmpCluster ;
							
					for (var day = 1; day <= parseInt(optionsSource.dayNumber); day++) {
						tmpCluster = _saveArray(_tmpSchedule["Day_"+day].placeLists); // Temp Array

						tmpCluster.push(_Places[optionsSource.antSchedule[i]]);
						var _tmpRs = {};
						_tmpRs = acoAlgorithm({
								placeLists: tmpCluster, 
								placeBegin: optionsSource.schedules["Day_"+day].placeBegin, 
								placeEnd: 	optionsSource.schedules["Day_"+day].placeEnd,
								antVectorDistance:optionsSource.antVectorDistance
							});

						if ( _tmpRs.antBestDuration > 23) {
							if (day ==  parseInt(optionsSource.dayNumber)) {
								if (_tmpSchedule["Day_Not"].placeIds.indexOf(_Places[optionsSource.antSchedule[i]].place_id) < 0) {
									_tmpSchedule["Day_Not"].placeLists.push(_Places[optionsSource.antSchedule[i]]);
									_tmpSchedule["Day_Not"].placeIds.push(_Places[optionsSource.antSchedule[i]].place_id);
									_tmpSchedule["Day_Not"].placeNumber = _tmpSchedule["Day_Not"].placeLists.length;
								};
							};
							continue;

						}else{
							//console.log(tmpCluster);
							_tmpSchedule["Day_"+day] = cloneObject(_tmpRs);
							break;
							//console.log("OK");
						};
					};
					//update status of ant m in place i
					optionsSource.antVisited[optionsSource.antSchedule[i]] = true;
				};
				for (var day = 1; day <= parseInt(optionsSource.dayNumber); day++) {
					_antCurrDistance += _tmpSchedule["Day_"+day].antBestDistance;
				}
				//Save schedule with the best distance
				if ((_antCurrDistance < optionsSource.antBestDistance) ||( optionsSource.antBestDistance == 0)) {
					console.log(_antCurrDistance);
					optionsSource.antBestDistance = _antCurrDistance;
					_antBestSchedule = cloneObject(_tmpSchedule); 
					
				};
				//Update phemore
				for (var i = 0; i < _Places.length; i++) {
					for (var j = 0; j < _Places.length; j++) {
						optionsSource.antUpdatePhe[i][j] += (_antCurrDistance ==0)? 0: optionsSource.antDelta/_antCurrDistance;
					}
				};
				optionsSource = antPheromoneUpdate(optionsSource);
			};
			console.log("f");
			_currentLoop++;
		}
		for (var day = 1; day <= parseInt(optionsSource.dayNumber); day++) {
		 	//_antBestSchedule["Day_"+day] = updatePlaceCome(_antBestSchedule["Day_"+day]);
		}
		optionsSource.schedules = _antBestSchedule;
		console.log("Created schedules successful!");
		return optionsSource;
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
	,acoAlgorithm	= function(options){
		options  	= getOptions(options);
		var _antResult={}, _antBestDistance = 0,_antBestDuration=0, 
		_antBestMoney=0, _Places = _saveArray(options.placeLists), _currentLoop = options.antCurrLoop, _maxLoop = options.antMaxLoop
		,_antNumber = options.antNumber,_antCurrDistance = 0,_antCurrDuration = 0,_antCurrMoney = 0 ,timeCurrent = options.timeStart;
		while(_currentLoop < _maxLoop){
			//Loop with all ant
			for (var ant = 0; ant < _antNumber; ant++) {
				//Set Visited of ant m.
				for (var i = 0; i < _Places.length; i++) {
					options.antVisited[i] = false;
				};
				_antCurrDistance = 0,_antCurrDuration = 0,_antCurrMoney = 0 ;
				timeCurrent = options.timeStart
				for (var i = 0; i < _Places.length; i++) {
					options.antSchedule[i] = antLotteryWheel(options,options.antSchedule[i]);
					if (options.check)
						if (encryptTime(_Places[options.antSchedule[i]].place_late) < timeCurrent )
							continue;
					//Update money in schedule of day number k
					try{
						_antCurrMoney += (typeof _Places[options.antSchedule[i]].place_ticket == 'undefined' || _Places[options.antSchedule[i]].place_ticket== null || _Places[options.antSchedule[i]].place_ticket =='') ? 
							0 : parseFloat(_Places[options.antSchedule[i]].place_ticket) ;}
					catch(e){
							console.log("Error");
							console.log(options.antSchedule[i]);
							console.log(_Places);
						}
					if (i==0) {
						var _checkTmp = _checkPlace(options,{place1:options.placeBegin, place2: _Places[options.antSchedule[i]]},timeCurrent);
						options.placeBegin = _checkTmp.place1,_Places[options.antSchedule[i]] = _checkTmp.place2,timeCurrent = _checkTmp.timeOut;

						_antCurrDuration   += _checkTmp.place1.next_time ;
						_antCurrDistance   += _checkTmp.place1.next_distance;
					}else if(i==(_Places.length - 1)){
						options.placeEnd.place_time = 0;
						var _checkTmp = _checkPlace(options,{place1:_Places[options.antSchedule[i]], place2:options.placeEnd},timeCurrent);
						timeCurrent += _checkTmp.place1.next_time;

						_antCurrDuration   += _checkTmp.place1.next_time ;
						_antCurrDistance   += _checkTmp.place1.next_distance;
					}
					else{
						var _checkTmp = _checkPlace(options,{place1:_Places[options.antSchedule[i-1]], place2: _Places[options.antSchedule[i]]},timeCurrent);
						_Places[options.antSchedule[i-1]] = _checkTmp.place1,


						_Places[options.antSchedule[i]] = _checkTmp.place2,

						timeCurrent = _checkTmp.timeOut;
						_antCurrDuration   += timeCurrent;
						_antCurrDistance   += _checkTmp.place1.next_distance;
					};
					//update status of ant m in place i
					options.antVisited[options.antSchedule[i]] = true;
				};
				//Save schedule with the best distance
				if (_antCurrDistance < options.antBestDistance || options.antBestDistance == 0) {
					options.antBestDistance = _antCurrDistance;
					_antResult.Distance = _saveArray(options.antSchedule);
					options.antResult   = _saveArray(options.antSchedule);
				};
				//Save schedule with the best duration
				if (_antCurrDuration < options.antBestDuration || options.antBestDuration == 0) {
					options.antBestDuration = _antCurrDuration;
					_antResult.Duration = _saveArray(options.antSchedule);
				};
				//Update phemore
				for (var i = 0; i < _Places.length; i++) {
					for (var j = 0; j < _Places.length; j++) {
						options.antUpdatePhe[i][j] += options.antDelta/_antCurrDistance;

					}
				};
				options = antPheromoneUpdate(options);
			};

			_currentLoop++;
		}
		options.placeLists = _SaveArrayPlaces(options.placeLists,options.antResult);
		options.placeIds  = _SaveArrayplaceIds(options.placeLists);

		return options;
	}
	,updateDurarion = function(schedule){
		if (typeof schedule === 'object') {
			var _schPlaces = _saveArray(schedule.placeLists),
			_duration = 0,_distance=0,_money=0;
			schedule.placeBegin.next_time = parseFloat(tripPlan.vectorDistances["T"+schedule.placeBegin.place_id.toString()]["T"+_schPlaces[0].place_id.toString()].duration);
			schedule.placeBegin.next_distance = parseFloat(tripPlan.vectorDistances["T"+schedule.placeBegin.place_id.toString()]["T"+_schPlaces[0].place_id.toString()].distance);
			_distance 	+= schedule.placeBegin.next_distance;
			for (var i = 0; i < _schPlaces.length-1; i++) {
				_schPlaces[i].next_time = parseFloat(tripPlan.vectorDistances["T"+_schPlaces[i].place_id.toString()]["T"+_schPlaces[i+1].place_id.toString()].duration);
				_schPlaces[i].next_distance = parseFloat(tripPlan.vectorDistances["T"+_schPlaces[i].place_id.toString()]["T"+_schPlaces[i+1].place_id.toString()].distance);
					
				_duration 	+= _schPlaces[i].next_time + parseFloat(_schPlaces[i].place_time);
				_distance 	+= _schPlaces[i].next_distance;
				_money 		+= 0;
			};
			schedule.placeEnd.next_time = parseFloat(tripPlan.vectorDistances["T"+_schPlaces[_schPlaces.length-1].place_id.toString()]["T"+schedule.placeEnd.place_id.toString()].duration);
			schedule.placeEnd.next_distance = parseFloat(tripPlan.vectorDistances["T"+_schPlaces[_schPlaces.length-1].place_id.toString()]["T"+schedule.placeEnd.place_id.toString()].distance);

			_duration 	+= schedule.placeEnd.next_time + parseFloat(_schPlaces[_schPlaces.length-1].place_time);
			_distance 	+= schedule.placeEnd.next_distance;

			schedule.duration = parseFloat(_duration.toFixed(2));
			schedule.distance = parseFloat(_distance.toFixed(2));
			schedule.money = _money;
		};
		return schedule;
	}
	,updatePlaceCome = function(schedule){
		schedule.placeBegin.place_come = decryptTime(schedule.timeStart);

		var timeCurrent = schedule.timeStart + schedule.placeBegin.next_time;
		for (var i = 0; i < schedule.placeLists.length; i++) {
			schedule.placeLists[i].place_come = decryptTime(timeCurrent);
			timeCurrent += parseFloat(schedule.placeLists[i].place_time) + parseFloat(schedule.placeLists[i].next_time);
		};

		schedule.placeEnd.place_come = decryptTime(timeCurrent);

		return updateDurarion(schedule);
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
		var antVector 	=options.antVectorDistance, nextTime = 0, nextDistance = 0,timeStart = parseFloat(timeStart),timeOut =0;
		nextTime  		= parseFloat(antVector["T"+places.place1.place_id.toString()]["T"+places.place2.place_id.toString()].duration);
		nextDistance  	= parseFloat(antVector["T"+places.place1.place_id.toString()]["T"+places.place2.place_id.toString()].distance);
		var _decryptTime= timeStart + nextTime;
		places.place2.place_come 	= _decryptTime;
		places.place1.next_time 	= nextTime;
		places.place1.next_distance = nextDistance;
		timeOut			= _decryptTime + parseFloat(places.place2.place_time);
		return {
			place2: places.place2,
			place1: places.place1,
			timeOut: timeOut,
		}
	}
	,_SaveArrayplaceIds = function(places){
		var Z = [];
		for (var i = 0; i < places.length; i++) {
			Z.push(places[i].place_id);
		};
		return Z;
	}
	,_SaveArrayPlaces = function (_Places,data){
		var Z = [];
		for (var i = 0; i < data.length; i++) {
			Z.push(_Places[data[i]]);
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
		min = min <10 ? "0" + min: min;
		return dece+":"+Math.ceil((time%dece) * 60);
		;
	}
	,getArrayDistances = function (options,arrDistances){
			var obj = window.javo_map_box_func,_places = _saveArray(options.placeLists);	
			_places.unshift(options.placeBegin);
			_places.push(options.placeEnd);
			console.log(_places.length);
			for (var i = 0; i < _places.length; i++) {
				if (typeof arrDistances["T"+_places[i].place_id.toString()] === 'undefined'){
					arrDistances["T"+_places[i].place_id.toString()] = [];	
				}
				for (var j = 0; j < _places.length; j++) {
					if (typeof arrDistances["T"+_places[j].place_id.toString()] === 'undefined'){
						arrDistances["T"+_places[j].place_id.toString()] = [];	
					}
					if (i ==j) {
						arrDistances["T"+_places[i].place_id.toString()]["T"+_places[j].place_id.toString()] = {
							distance: 0,
							duration: 0
						};	
					}else if (typeof arrDistances["T"+_places[i].place_id.toString()]["T"+_places[j].place_id.toString()] === 'undefined') {
						if (typeof tripPlan.vectorDistances[_places[i].place_id.toString()] === 'undefined') {
							arrDistances["T"+_places[i].place_id.toString()]["T"+_places[j].place_id.toString()] = 
							obj.getDistancePoint(_places[i],_places[j]);			
						}else if(typeof tripPlan.vectorDistances["T"+_places[i].place_id.toString()]["T"+_places[j].place_id.toString()] === 'undefined'){
							arrDistances["T"+_places[i].place_id.toString()]["T"+_places[j].place_id.toString()] = 
							obj.getDistancePoint(_places[i],_places[j]);			
						}
						else{
							arrDistances["T"+_places[i].place_id.toString()]["T"+_places[j].place_id.toString()] =  
							tripPlan.vectorDistances["T"+_places[i].place_id.toString()]["T"+_places[j].place_id.toString()];
						};
					};
				};
			};	
			return arrDistances;			
		}
;