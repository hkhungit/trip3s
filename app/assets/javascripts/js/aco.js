//Varible use ACO algorithms

var antVector 	={}, //
	antPheromone=[],
	antUpdatePhe=[],
	antSchedule =[],
	antVisited	=[],
	antUnVisited=[],
	antNumber,
	antConstant,
	antMaxLoop,
	antCurrLoop,
	antBestDistance,
	antBestDuration,
	antAlpha,antBetal,antDelta,antRho,placeLength,antCurrDistance;

 
// Init varible
function _intACO (options) {
	antPheromone=[],
	antUpdatePhe=[],
	antSchedule =[],
	antVisited	=[],
	antUnVisited=[];
	antCurrLoop 	= 0;antNumber	 	= 25;
	antConstant 	= 0.5;antRho 		 	= 0.8;antAlpha 	= 0.2;
	antBestDuration = antBestDistance = 10000000;
	antBetal = 0.3; antDelta =1; 
	if (options.placeBegin.place_id !== options.placeEnd.place_id) {
		placeLength = options.placeLists.length;
	}else{
		placeLength = options.placeLists.length;
	};
	
	antMaxLoop	 	= placeLength * placeLength + 25;
	var obj = window.javo_map_box_func,_Places = options.placeLists;
	for (var i = 0; i < _Places.length; i++) {
		antPheromone[i] = [];
		antUpdatePhe[i] = [];
		antSchedule[i]  = i;
		for (var j = 0; j < _Places.length; j++) {
			antPheromone[i][j] = antConstant;
			antUpdatePhe[i][j] = 0;
		};
	};
	antVector = getArrayDistances(options,antVector);
	if (typeof options.parent !== 'undefined' && options.parent ===true) {
		tripPlan.vectorDistances = antVector;
		var obj = window.javo_map_box_func;
		tripPlan = obj.send_plan(tripPlan);
	};
}

function getArrayDistances(options,arrDistances){
			var obj = window.javo_map_box_func,_places = _SaveArray(options.placeLists);	
			_places.unshift(options.placeBegin);
			_places.push(options.placeBegin);
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

function antLottery_Wheel(k){
	var _antSum1 = 0,_antSum =0, _antDem = -1; var _antP =[];
	for (var i = 0; i < placeLength ; i++) {
		_antP[i] = 0; antUnVisited[i] = 0;
	};
	for (var i = 0; i < placeLength; i++) {
		if (!antVisited[i]) {
			_antP[i] 		=  Math.pow(antPheromone[k][i],antAlpha) / Math.pow(antPheromone[k][i],antBetal);		

			_antSum1  		+= _antP[i];// sum là biến tổng các xác suất
			_antDem++;
			antUnVisited[_antDem] 	=i;
		}
	};
	for (var i = 0; i < placeLength; i++) {
		_antP[i] = _antP[i] / _antSum1;
	};
	for (var i = 0; i < placeLength; i++) {
		_antSum  		+= _antP[i];
	};
	// dùng kỹ thuật bánh xe số
	_antSum = Math.random() * _antSum; var  t = 0; i=-1;
	
	while(t <= _antSum){
		i++;
		t=t+_antP[antUnVisited[i]];
	}
	return antUnVisited[i];
}

function antPheromone_Update()
{
    for (var i = 0; i < placeLength; i++) {
     	for (var j = i+1; j < placeLength + 1; j++) {
     		antPheromone[i][j] = antUpdatePhe[i][j] + antPheromone[i][j]* antRho;
     	};
     }; 
}

function antCycle(options){
	_intACO(options);

	var _antRs , antBestDuration1; antBestDuration =0,antBestMoney = 0,_Places = options.placeLists;

	while(antCurrLoop < antMaxLoop){
		for (var m = 0; m < antNumber; m++) {
			antSchedule[0] = 0;
			for (var i = 0; i < placeLength; i++) {
				antVisited[i] = false;
			};

			antCurrDistance  = 0,antBestDuration1=0;antBestMoney = 0;
			for (var i = 0; i < options.placeLists.length; i++) {
				antSchedule[i] = antLottery_Wheel(antSchedule[i]);
				if (options.check ==true) {
				if (encrypt_time(_Places[antSchedule[i]].place_late) < antBestDuration1) {
					continue;
				};};

				antBestMoney += (typeof _Places[antSchedule[i]].place_ticket == 'undefined') ? 
						0 : parseFloat(_Places[antSchedule[i]].place_ticket) ;
				if (i == 0) {
					var next_time = antVector["T"+options.placeBegin.place_id.toString()]["T"+_Places[antSchedule[i]].place_id.toString()].duration;
					var next_distance = antVector["T"+options.placeBegin.place_id.toString()]["T"+_Places[antSchedule[i]].place_id.toString()].distance
					options.placeBegin.next_time =  next_time;
					options.placeBegin.next_distance = next_distance;
					antCurrDistance += next_distance ;
					antBestDuration1 += next_time;

				}else{
					var next_time = antVector["T"+_Places[antSchedule[i-1]].place_id.toString()]["T"+_Places[antSchedule[i]].place_id.toString()].duration;
					var next_distance = antVector["T"+_Places[antSchedule[i-1]].place_id.toString()]["T"+_Places[antSchedule[i]].place_id.toString()].distance
					_Places[antSchedule[i-1]].next_time =  (next_time/3600).toFixed(2);
					_Places[antSchedule[i-1]].next_distance =next_distance;
					antCurrDistance += next_distance ;
					antBestDuration1 += next_time   + parseFloat(_Places[antSchedule[i]].place_time);
				};
				antVisited[antSchedule[i]] = true;
			}
		};

		antCurrDistance += antVector["T"+_Places[antSchedule[placeLength-1]].place_id.toString()]["T"+options.placeEnd.place_id.toString()].distance ;
		antBestDuration1 += antVector["T"+_Places[antSchedule[placeLength-1]].place_id.toString()]["T"+options.placeEnd.place_id.toString()].duration  
							+ parseFloat(_Places[antSchedule[placeLength-1]].place_time);
			//antBestMoney += _Places[antSchedule[0]].place_ticket;
		if (antCurrDistance < antBestDistance) {
			antBestDistance = antCurrDistance;
			antBestDuration = antBestDuration1;
			_antRs = _SaveArray(antSchedule);
		};
		for (var i = 0; i < placeLength; i++) {
			for (var j = 0; j < placeLength; j++) {
				antUpdatePhe[i][j] = antUpdatePhe[i][j]  + antDelta/antCurrDistance;
			}
		};
		antPheromone_Update();
		antCurrLoop++;
	}
	return {
		placeLists: _SaveArrayPlaces(_Places,_antRs),
		distance: antBestDistance,
		moneyNumber: antBestMoney,
		placeBegin: options.placeBegin,
		placeEnd: options.placeEnd,
		duration: antBestDuration
	} ;
}

function _SaveArray(data){
	var Z = [];
	for (var i = 0; i < data.length; i++) {
		Z.push(data[i]);
	};
	return Z;
}

function _SaveArrayPlaces(_Places,data){
	var Z = [];
	for (var i = 0; i < data.length; i++) {
		Z.push(_Places[data[i]]);
	};
	return Z;
}