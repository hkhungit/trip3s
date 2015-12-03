 

//Varible use ACO algorithms

var antVector 	=[], //
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
function _intACO (_Places,endplace) {
	antVector 	=[], //
	antPheromone=[],
	antUpdatePhe=[],
	antSchedule =[],
	antVisited	=[],
	antUnVisited=[];
	antCurrLoop 	= 0;antNumber	 	= 25;
	antConstant 	= 0.5;antRho 		 	= 0.8;antAlpha 	= 0.2;
	antBestDuration = antBestDistance = 10000000;
	console.log(_Places);
	antBetal = 0.3; antDelta =1; placeLength = _Places.length;
	antMaxLoop	 	= placeLength * placeLength + 25;
	console.log("placeLength: " + placeLength);
	var obj = window.javo_map_box_func;
	for (var i = 0; i < _Places.length; i++) {
		antPheromone[i] = [];
		antUpdatePhe[i] = [];
		antSchedule[i]  = i;
		for (var j = 0; j < _Places.length; j++) {
			antPheromone[i][j] = antConstant;
			antUpdatePhe[i][j] = 0;
		};
	};
	antVector = getArrayDistances(_Places,antVector,endplace);
}
function getArrayDistances(_places, arrDistances,endplace){
			var obj = window.javo_map_box_func;	
			for (var i = 0; i < _places.length; i++) {
				if (typeof arrDistances[_places[i].place_id] === 'undefined'){
					arrDistances[_places[i].place_id] = [];	
				}
				for (var j = 0; j < _places.length; j++) {
					if (typeof arrDistances[_places[j].place_id] === 'undefined'){
						arrDistances[_places[j].place_id] = [];	
					}
					if (i ==j) {
						arrDistances[_places[i].place_id][_places[j].place_id] = {
							distance: 0,
							duration: 0
						};	
					}else if (typeof arrDistances[_places[i].place_id][_places[j].place_id] === 'undefined') {
						arrDistances[_places[i].place_id][_places[j].place_id] = obj.getDistancePoint(_places[i],_places[j]);			
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
	k = antUnVisited[i];

	return k;
}

function antPheromone_Update()
{
    for (var i = 0; i < placeLength; i++) {
     	for (var j = i+1; j < placeLength + 1; j++) {
     		antPheromone[i][j] = antUpdatePhe[i][j] + antPheromone[i][j]* antRho;
     	};
     }; 
}

function antCycle(_Places,endplace){
	_intACO(_Places);
	var antRs , antBestDuration1; antBestDuration =0,antBestMoney = 0;
	while(antCurrLoop < antMaxLoop){
		for (var m = 0; m < antNumber; m++) {
			antSchedule[0] = 0;
			for (var i = 0; i < placeLength; i++) {
				antVisited[i] = false;
				//antSchedule[i] =i;
			};
			antVisited[0] = true;antCurrDistance  = 0,antBestDuration1=0;antBestMoney = 0;

			for (var i = 1; i < placeLength; i++) {
				antSchedule[i] = antLottery_Wheel(antSchedule[i]);
					antBestMoney += parseFloat(_Places[antSchedule[i]].place_ticket);
					var next_time = antVector[_Places[antSchedule[i-1]].place_id][_Places[antSchedule[i]].place_id].duration;
					var next_distance = antVector[_Places[antSchedule[i-1]].place_id][_Places[antSchedule[i]].place_id].distance
					_Places[antSchedule[i-1]].next_time =  (next_time/3600).toFixed(2);
					_Places[antSchedule[i-1]].next_distance =next_distance;
					antCurrDistance += next_distance ;
					antBestDuration1 += next_time   + (parseFloat(_Places[antSchedule[i-1]].place_time) * 3600);
					antVisited[antSchedule[i]] = true;
			}
		};

			antCurrDistance += antVector[_Places[antSchedule[placeLength-1]].place_id][_Places[antSchedule[0]].place_id].distance ;
			antBestDuration1 += antVector[_Places[antSchedule[placeLength-1]].place_id][_Places[antSchedule[0]].place_id].duration  + (parseFloat(_Places[antSchedule[placeLength-1]].place_time) * 3600);
			//antBestMoney += _Places[antSchedule[0]].place_ticket;
			if (antCurrDistance < antBestDistance) {
				antBestDistance = antCurrDistance;
				antBestDuration = antBestDuration1;
				antRs = _SaveArray(antSchedule);
				console.log("MIN: " + antSchedule + "  -- CP: " + antBestDistance  + "    AntRS" + antRs);
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
		placeLists: _SaveArrayPlaces(_Places,antRs),
		distance: antBestDistance,
		moneyNumber: antBestMoney,
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