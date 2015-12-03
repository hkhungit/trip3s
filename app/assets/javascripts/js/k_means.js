



function k_means (data, nCls) {
	var centroid 	=[];
	var cluster 	=[];
 
	if (data.length < nCls) {

	console.log("Data too less");
		return false;
	};
	for (var i = 0; i < nCls; i++) {
		centroid[i] = data[i];
		cluster[i] 	= [];
	};
	cluster = lookup(data,centroid,cluster);
	return cluster;
}
function lookup(data,centroid,cluster){
	for (var i = 0; i < centroid.length; i++) {
		cluster[i] 	= [];
	};

	for (var p = 0; p < data.length; p++) {
		var min = distance(centroid[0],data[p]);
		var k=0;

		for (var i = 0; i < centroid.length; i++) {
			var _distance = distance(centroid[i],data[p]);
			if (_distance < min) {
				min = _distance;
				k 	= i;
			};
		};
		cluster[k].push(data[p]);
	}
	var f = 0;
	if (!updateCentroid(centroid,cluster)) {
		lookup(data,centroid,cluster);	
	}
	return cluster;
}

function updateCentroid (centroid,cluster) {
	var constant = true;
	for (var i = 0; i < centroid.length; i++) {
		var centroidCheck = _centroid(cluster[i]);
		if((centroid[i].place_lat != centroidCheck.place_lat) || (centroid[i].place_lng != centroidCheck.place_lng)){
			centroid[i] = centroidCheck;
			constant = false;
		}
	}
	return constant;


	if (constant) {
		console.log('done!');
		return true;
	};
	return false;
}
function _centroid (_vertor) {
	var x=0,y=0;
	for (var i = 0; i < _vertor.length; i++) {
		x += parseFloat(_vertor[i].place_lat);
		y += parseFloat(_vertor[i].place_lng);
	}
	return {place_lat: x/_vertor.length,place_lng: y/_vertor.length};
}


function distance(d,p1){
	var di=  (d.place_lng - p1.place_lng) * (d.place_lng - p1.place_lng) + (d.place_lat - p1.place_lat) * (d.place_lat  - p1.place_lat);
	return di;
}
