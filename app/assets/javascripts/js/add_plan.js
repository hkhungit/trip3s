var tripPlan = {
			dayNumber: 			2,
			userNumber: 		1,
			planStart: 			null,
			moneyNumber: 		1,
			placeBegin: 		null,
			planEnd: 			null,
			planEnd: 			null,
		    placeBegin: 		null,
		    placeEnd: 			null,
		    planStart: 			null,
			placeIds: 			[],
			placeLists:			[],
			placeNotSchedule : 	[],
			schedules: 			[]
		};
jQuery( function( $ ){
		"use strict";
 
		var items;
		
		//Restone tripPlan from session
		$.getJSON('/api/trip3sPlan')
				.done(function(data){
					tripPlan = data.plan;
					var obj = window.javo_map_box_func;
					console.log(tripPlan);
					obj.ajax_favorite(tripPlan.placeLists,2);
					if (tripPlan.schedules.length > 0) {
						update_sidebar_plan(tripPlan.schedules);
					}else{

						obj.ajax_favorite(tripPlan.placeLists,2);
					};
					obj.resize();
					$("ul#schedule-day-boby").sortable({
				        update: function(event, ui) {
				        	$('ul#schedule-day-boby li').each(function(e){
				        		var place = $(this).data('place');
				        		$(this).find('.number').text(e + 1);
				        		tripPlan.placeIds[e] = place.id;
								tripPlan.placeLists[e] = place;
				        	});
				        }
				    });
				});

		function removeDuplicate(arr){
			var resultsaa = [],arrbk  =[];
			for (var i = 0; i < arr.length; i++) {
			    if (resultsaa.indexOf(arr[i].place_id) < 0 ) {
			        resultsaa.push(arr[i].place_id);
			        arrbk.push(arr[i]);
			    }
			}
			return arrbk;
		}
		/*Add the place to places in plan*/
		$(document).on('click','[btn-add-place-plan]',function(){
			var itemSelected 	= 	$(this).parent().parent().parent().data('place');
			if (tripPlan.placeIds.indexOf(itemSelected.place_id) == -1) {
				tripPlan.placeIds.push(itemSelected.place_id);
				tripPlan.placeLists.push(itemSelected);
			};
			$.post('/api/trip3sPlan',{plan:JSON.stringify(tripPlan)},function(data){
				console.log(data);
			});

			var obj = window.javo_map_box_func;
			obj.ajax_favorite(tripPlan.placeLists,2);
			obj.resize();
			$("ul#schedule-day-boby").sortable({
		        update: function(event, ui) {
		        	$('ul#schedule-day-boby li').each(function(e){
		        		var place = $(this).data('place');
		        		$(this).find('.number').text(e + 1);
		        		tripPlan.placeIds[e] = place.id;
						tripPlan.placeLists[e] = place;
		        	});
		        }
		    });
		});
		/*Add event when set a place number 1 of a day in schedule */
		$(document).on('click','.select-home',function(){
			var itemSelected 	= 	$(this).parent().parent().data('place');
			var indexPlace = tripPlan.placeIds.indexOf(itemSelected.place_id) ;
			if (typeof tripPlan.placeBegin == 'undefined' || tripPlan.placeBegin == "") {
				tripPlan.placeIds.splice(indexPlace,1);
				tripPlan.placeLists.splice(indexPlace,1);
				tripPlan.placeEnd = tripPlan.placeBegin = itemSelected;
			}else{
				var temp = tripPlan.placeBegin;
				if (temp.place_id == tripPlan.placeEnd.place_id) {
					tripPlan.placeEnd = itemSelected;
				};
				tripPlan.placeBegin = itemSelected;
				tripPlan.placeIds[indexPlace] = temp.place_id;
				tripPlan.placeLists[indexPlace] = temp;
			};

			$.post('/api/trip3sPlan',{plan:JSON.stringify(tripPlan)},function(data){
				console.log(data);
			});

			var obj = window.javo_map_box_func;
			obj.ajax_favorite(tripPlan.placeLists,2);
			obj.resize();
			$("ul#schedule-day-boby").sortable({
		        update: function(event, ui) {
		        	$('ul#schedule-day-boby li').each(function(e){
		        		var place = $(this).data('place');
		        		$(this).find('.number').text(e + 1);
		        		tripPlan.placeIds[e] = place.id;
						tripPlan.placeLists[e] = place;
		        	});
		        }
		    });
		});
		
		$(document).on('click','#add-day-to-plan',function(){
			$.post('/api/add_day',{add_day:true},function(data){
				if (data.dayNumber != 0) {
					tripPlan.dayNumber = data.dayNumber;
					console.log(tripPlan);
					console.log("Added a day to plan");
				};
				
			});
			update_list_day();
		});
		$(document).on('click','#all-to-plan',function(){
			var obj = window.javo_map_box_func;
			if ($('.javo_mhome_sidebar').hasClass('all_day')) {
				$(this).text("Tất cả");
			}else{
				$(this).text("Thu lại");
				var _width = $('.schedule-day-boby-detail:first-child').outerWidth() + 5;
				_width = _width*tripPlan.schedules.length;
				$('.full-detail ').css('width',_width);
				obj.resize();
			} 

			$('.javo_mhome_sidebar').toggleClass('all_day');
			
			 $("ul.schedule-day-boby").sortable({
			 	connectWith: "ul.schedule-day-boby",
			 	start: function(event, ui){
			 		if (ui.item == 0) {
			 			alert("Bạn không thể di chuyển nơi xuất phát");
			 		};
			 	},
			 	update: function(event, ui) {
			 		for (var i = 0; i < tripPlan.dayNumber; i++) {
			 			if (typeof tripPlan.schedules[i] != 'undefined') {
			 				tripPlan.schedules[i] = {
			 					placeLists: [],
			 					placeIds: [],
								distance: 0,
								moneyNumber: 0,
								duration: 0
			 				};
					 		$('ul#schedule-day-boby-'+(i+1)+' li').each(function(e){
					 			var place = $(this).data('place');
					        	$(this).find('.number').text(e + 1);
								tripPlan.schedules[i].placeLists.push(place);	
				        	});
			        	};
				 	};
				 	$.post('/api/trip3sPlan',{plan:JSON.stringify(tripPlan)},function(data){
						console.log(data);
					});
		        }
			 });
			update_list_day();
		});
		function update_list_day(day_number){
			var strFull ='';
			for (var i = 1; i <= day_number; i++) {
				var str ='';
				str  = $('#trip3s-list-day').html();
				str  = str.replace(/{{data_day}}/g, i);
				strFull += str;
			};
			$('ul#list-day').html(strFull);

			console.log("Updates day lists");
			//update_selected();
		}
		$(document).on('click','.create-trip',function(){

			if (typeof tripPlan.placeBegin =='undefined' || tripPlan.placeBegin == "") {
				alert('Chọn 1 địa điểm bạn ở lại trong hành trình');
				return false;
			}
			var _Places = _SaveArray(tripPlan.placeLists);
			_Places.unshift(tripPlan.placeBegin);
			_Places  = removeDuplicate(_Places);
			var _rs =  antCycle(_Places,tripPlan.placeEnd,true), _tempPlaceLists =[],
			 tmpCluster =[], fullTime =36000, minTime = 0, _success = false;
			var Clusters = [], count = 0, currCluster = {
				distance: 0,duration:0,placeLists: []
			},visited = [];
			for (var i = 1; i < _rs.placeLists.length; i++) {visited[i]= false}

			while(!_success){
				Clusters = [];
				count = 0;tmpCluster =[];
				tmpCluster.push(_rs.placeLists[0]);
				for (var i = 1; i < _rs.placeLists.length; i++) {
						tmpCluster.push(_rs.placeLists[i]);

						var _tmpRs = antCycle(tmpCluster);
						if (_tmpRs.duration >= fullTime) {

							i--;count++;tmpCluster=[];
							tmpCluster.push(_rs.placeLists[0]);
							continue;
						};
						Clusters[count] = _tmpRs;
						visited[i] =true;
				};
				_success =true;

				if (Clusters.length < tripPlan.dayNumber) {
					_success = false; fullTime -= 3600;
					if (fullTime <= 0) {
						_success = true;
						fullTime =0;
						//Clusters = [];
					};
				};

			}
			tripPlan.schedules = Clusters;
			if (count > tripPlan.dayNumber-1) {
				for (var i = parseInt(tripPlan.dayNumber) ; i <= count; i++) {
					tripPlan.placeNotSchedule =
						tripPlan.placeNotSchedule.concat(tripPlan.schedules[i].placeLists);
				};
				if (tripPlan.placeNotSchedule.indexOf(tripPlan.placeBegin) > -1) {
					tripPlan.placeNotSchedule.splice(tripPlan.placeNotSchedule.indexOf(tripPlan.placeBegin),1);
				};
			}else{tripPlan.placeNotSchedule =[]};
			$.post('/api/trip3sPlan',{plan:JSON.stringify(tripPlan)},function(data){
				console.log(data);
			});

			update_sidebar_plan(Clusters);
		});
		
		$(document).on('click','.k-means',function(){
			$.get(
				'/api/k_mean'
				, {},
				function(response){
					var _rs =  antCycle(tripPlan.placeLists), _tempPlaceLists =[];
				});
			
		});
		//Devide places to n cluster from input
		function findCluster(placeLists, nCluster){
			var Clusters = [];

			for (var i = 0; i < placeLists.length; i++) {
				placeLists[i]
			};
		} 
 		 
 		//Update side left bar
 		function update_sidebar_plan(schedules){

 			update_sidebar_header_control({currDay:1, indexControl: 2,numDay:tripPlan.dayNumber});
 			//update_sidebar_header_bar();
 			update_sidebar_boby(schedules);

 		}


 		//Update header sidebar control
 		function update_sidebar_header_control(data){
 			var strHtml = $('#load-schedule-day-header-control-'+data.indexControl).html();
 			strHtml		= strHtml.replace(/{{current_day}}/, data.currDay || 1 );

 			$('#schedule-day-header-control').html(strHtml);
 			update_list_day(tripPlan.dayNumber);
 			var currSchedule = tripPlan.schedules[data.currDay - 1];
 			update_bar_day({index:1, distance: ((currSchedule.distance).toFixed(2)),
					placeNumber: currSchedule.placeLists.length,
					dayNumber: ((currSchedule.duration/3600).toFixed(2)),
					moneyNumber: currSchedule.moneyNumber,
					userNumber: tripPlan.userNumber});
 		}
 		function update_sidebar_header_bar(data,index){
 			var strAttr = $("#trip3s-attribute-schedule-1").html(),strNull='0';
				strAttr 	= strAttr.replace(/{{data-index}}/g,    (index) || strNull);
				strAttr 	= strAttr.replace(/{{data-distance}}/g, data.distance.toFixed(2) || strNull);
				strAttr 	= strAttr.replace(/{{data-place}}/g,	data.placeLists.length || strNull);
				strAttr 	= strAttr.replace(/{{data-time}}/g,		data.duration.toFixed(2) || strNull);
				strAttr 	= strAttr.replace(/{{data-user}}/g,		data.userNumber || strNull);
				strAttr 	= strAttr.replace(/{{data-money}}/g,	data.moneyNumber.toFixed(2) || strNull);
			$('#attribute-schedule-'+index).html(strAttr);
 		}
 		function update_sidebar_boby(schedules,choice){
 			if (schedules.length < 1) {
 				return false;
 			};
 			if (typeof choice == 'undefined' || !$.isNumeric(choice)) {
 				choice =0;
 			};
 			var strFull="<div class=\"full-detail \">",nstr='',strNull='0',strCurr='';

		 	$('#body-detail-add-plan').html('');
 			for(var ik=0; ik< schedules.length; ik++){
	 			var places  = schedules[ik].placeLists,cls= "notselect",data = schedules[ik];
	 			if (choice == ik) {
	 				cls= "_selected"; 
	 			};
	 			strFull +="<div class=\"row schedule-day-boby-detail "+cls+" \">";
	 			strFull +="<div class=\"schedule-day-header-bar attribute-schedule\" id=\"attribute-schedule-"+(ik+1)+"\"  data-index=\""+(ik+1)+"\"></div> ";
	 			strFull +="<ul class=\"schedule-day-boby scrollbar style-3 \" data-index=\""+(ik+1)+"\" id=\"schedule-day-boby-"+(ik+1)+"\" >";
				for (var i = 0; i < places.length; i++) {
			 		var str = '';
			 		str = $("#trip3s-place-in-schedule").html();
			 		str = str.replace( /{{post_thumbnail}}/g , places[i].post_thumbnail || nstr );
							str = str.replace( /{{place_id}}/g , places[i].place_id || nstr );
							str = str.replace( /{{current_place}}/g	 , JSON.stringify(places[i]) || nstr );
							str = str.replace( /{{post_title}}/g	 , places[i].post_title || nstr );
							str = str.replace( /{{post_excerpt}}/g	 , places[i].phone || nstr );
							str = str.replace( /{{place_time}}/g ,  places[i].place_time  || nstr );
							str = str.replace( /{{sort_thumbnail}}/g ,  (i+1)  || nstr );
							str = str.replace( /{{place_ticket}}/g ,  places[i].place_ticket  || nstr );
							str = str.replace( /{{place_note}}/g ,  places[i].place_note || nstr );
							str = str.replace( /{{next_distance}}/g ,  places[i].next_distance  || nstr );
							str = str.replace( /{{next_time}}/g ,      places[i].next_time  || nstr );
							str = str.replace( /{{next_detail}}/g ,  places[i].next_detail  || nstr );
			 		strFull +=str;
			 	};
			 	strFull +=strCurr;
			 	strFull +="</ul>";
			 	strFull +="</div>";
			 	
		 	}
		 	strFull +="</div>";
		 	$('#body-detail-add-plan').html(strFull);


		 	for(var ik=0; ik< schedules.length; ik++){
		 		update_sidebar_header_bar(schedules[ik],(ik+1));
		 	}
 		}

		$(document).on('click','#list-day li',function(){


			var schedule_day = $(this).find('a').attr('data');
			
 			update_sidebar_header_control({currDay:schedule_day, indexControl: 2,numDay:tripPlan.dayNumber});

			$('#dropdown-select-days').html('Ngày '+ schedule_day + ' <span class="caret"></span>');
			$('#dropdown-select-days').attr("data-place_id",schedule_day);
			update_sidebar_boby(tripPlan.schedules,parseInt(schedule_day));
		});

		function update_bar_day(data){
			if (typeof data === 'undefined') {
				return;
			};
			var strNull='0';
			var str = $("#trip3s-attribute-schedule-"+data.index).html();
			str 	= str.replace(/{{data-distance}}/g, data.distance || strNull);
			str 	= str.replace(/{{data-place}}/g,	data.placeNumber || strNull);
			str 	= str.replace(/{{data-time}}/g,		data.dayNumber || strNull);
			str 	= str.replace(/{{data-user}}/g,		data.userNumber || strNull);
			str 	= str.replace(/{{data-money}}/g,	data.moneyNumber || strNull);
			$('#attribute-schedule').html(str);
		}
		function update_selected(){
			$.get(
				'/api/return_day'
				, {},
				function(response){

					$('[list-day-in-plan]').each(function(e){
						var max_day =	response.day_number;

						var str_li = '';
						for (var i = 1; i <= max_day; i++) {
							var str = '', cls_return_day = 'fa fa-check-circle-o';
							try {
								if (response.schedule[i].place_ids.indexOf(parseInt($(this).attr('place_id'))) > -1 && 
										response.schedule[i].day == i
									) {

									cls_return_day = 'fa selected fa-times';
								};
							}
							catch(err) {
							    //console.log('error');
							}	;
							

							str = $("#trip3s-item-day").html();
							str = str.replace( /{{item_day}}/g , i );
							str = str.replace( /{{item_day_number}}/g , cls_return_day );
							str_li += str;
						};

						$(this).html(str_li);
					})
				});
		}

		$(document).on('click','[list-day-in-plan] li a',function(){
			//update_selected();

			var place_id = $(this).parent().parent().attr('place_id');
			var schedule_day = $(this).attr('day');
			$('[javo-current-day]').val(schedule_day);
			var action 	='add_place';
			if(!$(this).hasClass("selected")){
				$(this).addClass('selected fa-times').removeClass('fa-check-circle-o');
				$('.list-announcement').append('<li>Thêm địa điểm thành công</li>');
			}else{
				$(this).removeClass('selected  fa-times').addClass('fa-check-circle-o');
				$('.list-announcement').append('<li>Xóa địa điểm thành công</li>'); 
				action 	='remove_place';
			}	
			update_listPlaces(place_id,schedule_day,action);
			update_announcement();
		});
	
		function update_listPlaces(place_id,schedule_day,action){
			$.get(
					'/api/add_place_to_plan'
					, {
						place_id		: place_id,
						schedule_day	: schedule_day,
						action2 			: action
					}
					, function( response ){
						
						items = response.places;
						
						var strFull = '', nstr = '1';
						if (response.status = "success") {

							var places = response.places;
							
							for (var i = 0; i < places.length; i++) {
								var str = ''
								str = $("#trip3s-place-in-schedule").html();
								
								str = str.replace( /{{post_thumbnail}}/g , places[i].post_thumbnail || nstr );
								str = str.replace( /{{post_title}}/g	 , places[i].post_title || nstr );
								str = str.replace( /{{post_excerpt}}/g	 , places[i].phone || nstr );
								str = str.replace( /{{sort_thumbnail}}/g , (i + 1) || nstr );
								strFull +=str;
							};
							console.log("ddddddddddddddddddddddd");
							$('#schedule-day-boby').html(strFull);
						}
						else{
							strFull = "error";
						}
					});
		}
		function update_announcement(){
			$('.list-announcement li').each(function(){
				$(this).fadeOut(7000,function(){
					$(this).slideUp(3000).remove();
				});
			});
		}
		var BTN_OK			= $( '[javo-alert-ok]' ).val();
		var ERR_LOC_ACCESS	= $( '[javo-location-access-fail]' ).val();
		var arrPolylineOptions = [],arrDirectionsDisplay = [];
		window.javo_map_box_func = {

			options:{

				// Javo Configuration
				config:{
					items_per: $('[name="javo-box-map-item-count"]').val()
				}

				// Google Map Parameter Initialize
				, map_init:{
					map:{
						options:{
							mapTypeId: google.maps.MapTypeId.ROADMAP
							, mapTypeControl	: true
							, panControl		: false
							, scrollwheel		: true
							, streetViewControl	: true
							, zoomControl		: true
							, zoomControlOptions: {
								position: google.maps.ControlPosition.RIGHT_BOTTOM
								, style: google.maps.ZoomControlStyle.SMALL
							 }
						}
						, events:{
							click: function(){
								var obj = window.javo_map_box_func;
								obj.close_ib_box();
							}
						}
					}
					, panel:{
						options:{
							content:$('#javo-map-inner-control-template').html()
						}
					}
				}

				// Javo Ajax MAIL
				, javo_mail:{
					subject: $("input[name='contact_name']")
					, from: $("input[name='contact_email']")
					, content: $("textarea[name='contact_content']")
					, to_null_msg: "Please, insert recipient's email address."
					, from_null_msg: "Please, insert sender's email address."
					, subject_null_msg: "Please, insert your name."
					, content_null_msg: "Please, insert message content."
					, successMsg: "Successfully sent!"
					, failMsg: "Sorry, your message could not be sent."
					, confirmMsg: "Do you want to send this message?"
					, url:"http://javothemes.com/directory/demo2/wp-admin/admin-ajax.php"
				}

				// Google Point Of Item(POI) Option
				, map_style:[
					{
						featureType: "poi",
						elementType: "labels",
						stylers: [
							{ visibility: "off" }
						]
					}
				],
				// Google Array polyline option
			} // End Options,
			,variable:{
				top_offset:
					parseInt( $('header > nav').outerHeight() || 0 ) +
					parseInt( $('#wpadminbar').outerHeight() || 0 )

				// Topbar is entered into Header Navigation.
				// + $('.javo-topbar').outerHeight()

			} // End Define Variables

			// Javo Maps Initialize
			, init: function()
			{

				/*
				*	Initialize Variables
				*/
				var obj					= this;

				// Map Element
				this.el					= $('.javo_mhome_map_area');

				// Google Map Bind
				this.el.gmap3( this.options.map_init );
				this.map				= this.el.gmap3('get');

				this.tags				= $('[javo-map-all-tags]').val().toLowerCase().split( '|' );

				// Layout
				this.layout();

				// Trigger Resize
				this.resize();

				// Setup Distance Bar
				this.setDistanceBar();

				// Setup Auto Complete
				this.setAutoComplete();

				// Hidden Footer
				$('.container.footer-top').remove();

				// Set Google Information Box( InfoBubble )
				this.setInfoBubble();

				// Ajax
				this.ajaxurl			= $( "[javo-ajax-url]" ).val();

				var is_cross_domain		= $( "[javo-cross-domain]" ).val();
				var json_ajax_url		= $( "[javo-map-all-items]").val();
				var parse_json_url		= json_ajax_url;

				if( is_cross_domain )
				{

					parse_json_url = this.ajaxurl;
					parse_json_url += "?action=javo_get_json";
					parse_json_url += "&fn=" + json_ajax_url;
					parse_json_url += "&callback=?";
				}

				// Events
				; $( document )
					.on( 'click'	, '.javo-hmap-marker-trigger'				, this.marker_on_list )
					.on( 'click'	, '.showMap-place'							, this.showmap_place )
					.on( 'change'	, 'select[name^="filter"]'					, this.filter_trigger )
					.on( 'click'	, '[data-javo-map-load-more]'				, this.load_more )
					.on( 'click'	, '[data-javo-hmap-sort]'					, this.order_switcher )
					.on( 'keypress'	, '#javo-map-box-auto-tag'					, this.keyword_ )
					.on( 'click'	, '[data-map-move-allow]'					, this.map_locker )
					.on( 'click'	, '#javo-map-box-search-button'				, this.search_button )
					.on( 'click'	, 'li[data-javo-hmap-ppp]'					, this.trigger_ppp )
					.on( 'click'	, '#contact_submit'							, this.submit_contact )
					.on( 'click'	, '.javo-mhome-sidebar-onoff'				, this.trigger_favorite)
					.on( 'click'	, '.javo-my-position'						, this.getMyPosition)
					.on( 'click'	, '#showMap-plan'							, this.drawRoute)


				; $( window )
					.on( 'resize', this.resize );

				// DATA
				$.getJSON( parse_json_url, function( response )
				{
					obj.items		= response.places;
					$.each( response.places, function( index, key ){
						obj.tags.push( key.post_title );
					} );

					obj.setKeywordAutoComplete();

					if( $( "#javo-map-box-location-ac" ).val() ) {
						obj.setGetLocationKeyword( { keyCode:13, preventDefault: function(){} } );
					}else{
						if( $( "[javo-is-geoloc]" ).val() ){
							$( ".javo-my-position" ).trigger( 'click' );
						}else{
							obj.filter();
						}
					}
				});

			} // End Initialize Function
			, drawRoute:function(){
				var myLatlng	= {lat: -25.363, lng: 131.044};
 				var obj 		= window.javo_map_box_func, currDay = $("#dropdown-select-days").attr("data-place_id");

 				var items  		= tripPlan.schedules[currDay-1].placeLists;
 				if (items.length < 1) {
 					return;
 				};
				obj.items  = items;
				obj.setMarkers( items, true,true );
				var lengthItems	 = items.length;
				var arrRequest   = [];
				tripPlan.schedules[currDay-1].distance  = 0;
				for (var i = 0; i < lengthItems; i++) {
					if (i < lengthItems -1) {
						obj.drawRoutePoint(items[i],items[i+1]);
					}else{
						obj.drawRoutePoint(items[i],items[0]);
					};
				};
			}//End draw route
			, drawRoutePoint: function(place1,place2)
			{
				var obj 		= window.javo_map_box_func,currDay = $("#dropdown-select-days").attr("data-place_id");
				//Set up options color in road result
			    var polylineOptionsActual = new google.maps.Polyline({
				    strokeColor: '#ec971f',
				    strokeOpacity: 1,
				    strokeWeight: 5
			    });
			    arrPolylineOptions.push(polylineOptionsActual);

			    var directionsService = new google.maps.DirectionsService();
			    var directionsDisplay;
			    //remove icon start and end of result
			    var rendererOptions = {
			          map:obj.map,
			          suppressMarkers : true,
			          polylineOptions : polylineOptionsActual
			        }
			    directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
			    arrDirectionsDisplay.push(directionsDisplay);
			    var request = {
			        origin: new google.maps.LatLng(place1.place_lat, place1.place_lng),
			        destination: new google.maps.LatLng(place2.place_lat, place2.place_lng),
			        travelMode: google.maps.TravelMode.DRIVING
			    };
			    //distance of 2 position in map
			    var distance    = google.maps.geometry.spherical.computeDistanceBetween(request.origin,request.destination);
			    //tripPlan.schedules[currDay-1].distance +=distance.toFixed(2);;
			    //console.log("Distance: " + distance.toFixed(2) + " m");

			    directionsService.route(request, function(result, status) {
			        if (status == google.maps.DirectionsStatus.OK) {
			            directionsDisplay.setDirections(result);
			        }
			    });
			}
			, getDistancePoint: function(place1,place2){
				var directionsService = new google.maps.DirectionsService(),directionsDisplay;
				var obj 		= window.javo_map_box_func;
				//remove icon start and end of result
			    var rendererOptions = {
			          map:obj.map,
			          suppressMarkers : false
			        }
			    directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);

				var request = {
			        origin: new google.maps.LatLng(place1.place_lat, place1.place_lng),
			        destination: new google.maps.LatLng(place2.place_lat, place2.place_lng),
			        travelMode: google.maps.TravelMode.DRIVING
			    };
			    directionsService.route(request, function(result, status) {
			        if (status == google.maps.DirectionsStatus.OK) {
			        	return {
			        		distance: parseFloat((result.routes[0].legs[0].distance.value/1000).toFixed(2)),
			        		duration: result.routes[0].legs[0].duration.value
			        	};
			        }
			    });
				var d =  parseFloat((google.maps.geometry.spherical.computeDistanceBetween(request.origin,request.destination)/ 1000).toFixed(2));
				return {
					distance: d,
					duration: (3600*d)/40
				};
			}
			, clear_map: function()
			{
				//
				this.el.gmap3({
					clear:{
						name:[ 'marker', 'circle' ]
					}
				});
				this.close_ib_box();
				if (arrPolylineOptions.length > 0 ) {
					for (var i = 0; i < arrPolylineOptions.length; i++) {
						arrPolylineOptions[i].setMap(null);
					};
				};
				if (arrDirectionsDisplay.length > 0 ) {
					for (var i = 0; i < arrDirectionsDisplay.length; i++) {
						arrDirectionsDisplay[i].setMap(null);
					};
				};

			}

			, close_ib_box: function()
			{
				if( typeof this.infoWindo != "undefined" ) {
					this.infoWindo.close();
				}
			}

			, filter_trigger: function(e)
			{
				var obj = window.javo_map_box_func;

				obj.filter();

			}


			, layout: function()
			{

				var obj = window.javo_map_box_func;

				// Initalize DOC
				$('body').css('overflow', 'hidden');

				// POI Setup
				if ( $('[name="javo_google_map_poi"]').val() == "off" )
				{
					// Map Style
					this.map_style = new google.maps.StyledMapType( this.options.map_style, {name:'Javo Box Map'});
					this.map.mapTypes.set('map_style', this.map_style);
					this.map.setMapTypeId('map_style');
				}

				// Show Loading

				this.loading( true );

				$(window).load(function(){
					/*
					$('.javo_mhome_sidebar')
						.removeClass('hidden')
						.css({
							marginLeft:  (-$('.javo_mhome_sidebar').outerWidth()) + 'px'
							, marginTop: obj.variable.top_offset + 'px'
						});*/
				});

			} // End Set Layout

			, resize: function()
			{
				var obj		= window.javo_map_box_func;
				var winX	= $(window).width();
				var winY	= 0;
				var header_sidebar 	= 86,javo_mhome_sidebar = 300, content_sidebar =0;

				winY += $('header.main').outerHeight(true);
				winY += $('#wpadminbar').outerHeight(true);
				header_sidebar = $('.panel-heading.header-detail-add-plan').outerHeight(true);
				javo_mhome_sidebar = $('.javo_mhome_sidebar').outerHeight(true);
				content_sidebar =parseFloat(javo_mhome_sidebar) -parseFloat(header_sidebar) -winY - 200;
				// Topbar is entered into Header Navigation.
				// winY += $('div.javo-topbar').outerHeight(true);

				//$('.body-detail-add-plan').css( 'height', content_sidebar);
				$('.body-detail-add-plan').css( 'top', winY);
				$('.body-detail-add-plan').css( 'height', (content_sidebar + 90));
				$('ul.schedule-day-boby').css( 'height', content_sidebar);

				$('.javo_mhome_map_output').css( 'marginTop', $('.main-map-search-wrap').outerHeight(true) );

				if( parseInt( winX ) >= 1120 )
				{
					$('html, body').css( 'overflowY', 'hidden' );
				}else{
					$('html, body').css( 'overflowY', 'auto' );
				}

				// Setup Map Height
				obj.el.height( $(window).height() - winY );

				if( winX > 1500 ){
					$('.body-content').find('.item').addClass('col-lg-4');
				}else{
					$('.body-content').find('.item').removeClass('col-lg-4');
				};

			} // End Responsive( Resize );

			, loading: function( on )
			{
				this.login_cover = $('.javo_mhome_wrap > .map_cover');
				if( on )
				{
					this.login_cover.addClass('active');
				}else{
					this.login_cover.removeClass('active');
				}

			} // End Loading View

			, setDistanceBar: function()
			{
				var obj			= this;
				var _unit		= $( "[javo-distance-unit]" ).val() || 'km';
				var unitcon		= _unit != 'km' ? 1609.344 : 1000;
				var _max		= $( "[javo-distance-max]" ).val() || 1000 ;
				var cur, step, max;

				max				= parseInt( _max ) * unitcon;
				step			= parseInt( max ) / 100;
				cur				= parseInt( max ) / 2;

				var el		= $( ".javo-geoloc-slider" );
				var opt		= {
					start		: cur
					, step		: step
					, connect	: 'lower'
					, range		: { 'min': 0, 'max': max }
					, serialization:{
						lower:[
							$.Link({
								target : '-tooltip-<div class="javo-slider-tooltip"></div>'
								, method : function(v) {
									$(this).html('<span>' + v + '&nbsp;' + _unit + '</span>');
								}
								, format : {
									decimals	: 0
									, thousand	:','
									, encoder	: function( a ){
										return a / unitcon;
									}
								}
							})
						]
					}
				};
				el
					.noUiSlider( opt )
					.on( 'set', function( e )
					{
						if( ! $( '.javo-my-position' ).hasClass( 'active' ) ) return false;

						var distance	= parseInt( $( this ).val() );

						obj.el.gmap3({
							getgeoloc:{
								callback:function(latlng){

									if( !latlng ){
										$.javo_msg({content: ERR_LOC_ACCESS, button: BTN_OK });
										return false;
									};

									var result = [];
									var data	= obj.items;

									$.each( obj.items, function( i, k )
									{
										var c = obj.setCompareDistance( new google.maps.LatLng( k.lat, k.lng ), latlng );

										if( ( c * unitcon ) <= distance  )
										{
											result.push( data[i] );
										}
									} );

									window.__JAVO_MAP_BOX_TEMP__ = result
									obj.filter( result );

									obj.map_clear( false );
									obj.el.gmap3({ clear:{ name: 'circle' } });

									$(this).gmap3({
										circle:{
											options:{
												center:latlng
												, radius		: distance
												, fillColor		: '#000000'
												, strokeColor	: '#1A759C'
											}
										}
									},
									{
										get:{
											name: 'circle'
											, callback: function(c){
												$(this).gmap3('get').fitBounds( c.getBounds() );
											}
										}
									});
								}
							}
						});
					}) // End

					.prop( 'disabled', true )
					.addClass( 'disabled' );


			} // End Setup Distance noUISlider

			, setAutoComplete: function()
			{

				$('[name^="filter"]').chosen({
					width				: '100%'
					, search_contains	: 1
				});

			} // End Setup AutoComplete Chosen Apply

			, setRating: function()
			{
				$('.javo-rating-registed-score').each(function(k,v){
					$(this).raty({
						starOff: '/assets/images/star-off-s.png'
						, starOn: '/assets/images/star-on-s.png'
						, starHalf: '/assets/images/star-half-s.png'
						, half: true
						, readOnly: true
						, score: $(this).data('score')
					}).css('width', '');
				});
			}

			, map_locker: function( e )
			{
				e.preventDefault();

				var obj			= window.javo_map_box_func;

				$( this ).toggleClass('active');
				if( $( this ).hasClass('active') )
				{
					// Allow
					obj.map.setOptions({ draggable: true, scrollwheel: true });
					$( this ).find('i').removeClass('fa fa-lock').addClass('fa fa-unlock');
				}else{
					// Not Allowed
					obj.map.setOptions({ draggable:false, scrollwheel: false });
					$( this ).find('i').removeClass('fa fa-unlock').addClass('fa fa-lock');
				}
			}



			/** GOOGLE MAP TRIGGER				*/

			, setInfoBubble: function()
			{
				this.infoWindo = new InfoBubble({
					minWidth:362
					, minHeight:225
					, overflow:true
					, shadowStyle: 1
					, padding: 5
					, borderRadius: 10
					, arrowSize: 20
					, borderWidth: 1
					, disableAutoPan: false
					, hideCloseButton: false
					, arrowPosition: 50
					, arrowStyle: 0
				});
			} // End Setup InfoBubble

			, trigger_ppp: function( e )
			{
				e.preventDefault();
				var obj			= window.javo_map_box_func;
				obj				.filter();
			}

			, search_button: function( e )
			{
				e.preventDefault();
				var obj			= window.javo_map_box_func;
				obj.filter();
			}

			, keywordMatchesCallback: function( tags )
			{
				return function keywordFindMatches( q, cb )
				{
					var matches, substrRegex;

					substrRegex		= new RegExp( q, 'i');
					matches			= [];

					$.each( tags, function( i, tag ){
						if( substrRegex.test( tag ) ){
							matches.push({ value : tag });
						}
					});
					cb( matches );
				}
			}
			, setKeywordAutoComplete: function()
			{
				this.el_keyword = $( '#javo-map-box-auto-tag' );

				this.el_keyword.typeahead({
					hint			: false
					, highlight		: true
					, minLength		: 1
				}, {
					name			: 'tags'
					, displayKey	: 'value'
					, source		: this.keywordMatchesCallback( this.tags )
				}).closest('span').css({ width: '100%' });
			}
			,append_load_more: function(){
				var obj			= window.javo_map_box_func;
				obj.apply_filters();
			}
			,showmap_place: function(){
				var obj			= window.javo_map_box_func;
				obj.clear_map();
				obj.loading( true );
				obj.clear_map();
				obj.items =tripPlan.placeIds;
				obj.setMarkers( tripPlan.placeLists, false,true );	
				obj.append_list_items( tripPlan.placeLists);
				$("ol#schedule-day-boby").sortable();
			}
			, filter: function( data )
			{
				var obj			= window.javo_map_box_func;
				$('.javo_mhome_map_output #products').empty();
				$( '[data-javo-map-load-more]' ).attr('data-javo-map-load-more',0);
				obj.loading( true );
				obj.clear_map();
				obj.items =[];
				obj.apply_filters();
			}
			, apply_filters: function()
			{
				console.log("start apply");
				var obj			= window.javo_map_box_func;
				var btn			= $( '[data-javo-map-load-more]' );
				var _limit		= parseInt( $( "#javo-map-box-ppp" ).val() ) || 12;

				var _offset 		= parseInt(btn.attr('data-javo-map-load-more')) * _limit;

				var result = {};
				var cate_ids ={},pro_ids={},cui_ids={},
					did_ids={},pur_ids={},city_ids={},
					dis_ids={},area_ids={};
				cate_ids =  $("select[name='filter[item_category]']").val();
				city_ids =  $("select[name='filter[item_city]']").val();
				dis_ids =  $("select[name='filter[item_district]']").val();
				area_ids =  $("select[name='filter[item_area]']").val();
				pro_ids =  $("select[name='filter[item_property]']").val();
				cui_ids =  $("select[name='filter[item_cuisine]']").val();
				did_ids =  $("select[name='filter[item_diding]']").val();
				pur_ids =  $("select[name='filter[item_purpose]']").val();
				// DATA
				btn.prop( 'disabled', true ).find('i').addClass('fa-spin');
				$.getJSON('/api/load_place_filter', {
					cityIds 	:city_ids,
					districtIds :dis_ids,
					areaIds 	:area_ids,
					cateIds 	:cate_ids,
					proIds 		:pro_ids,
					cuiIds 		:cui_ids,
					didIds 		:did_ids,
					purIds 		:pur_ids,
					offset 		:_offset,
					limit		:_limit
				})
				.done(function(data){
					console.log("success load");
					obj.apply_item 	= data.places;
					obj.items 		= obj.items.concat(data.places);
					if( $( '.javo-my-position' ).hasClass( 'active' ) ) {
						var items	= window.__JAVO_MAP_BOX_TEMP__ || obj.items;
					}else{
						var items	= obj.items
					}
					obj.setMarkers( items, false,true );	
					obj.append_list_items( data.places);

				}).fail(function( jqxhr, textStatus, error ){

					console.log('error 1');
				});
				return obj.apply_item ;
			}
			, tag_matche: function( str, keyword )
			{
				var i = 0;
				if( str != "" )
				{
					for( i in str )
					{
						// In Tags ?
						if( str[i].toLowerCase().match( keyword ) )
						{
							return true;
						}
					}
				}
				return false;
			}

			, setMarkers: function( response,clear,icon )
			{
				var item_markers	= new Array();
				var obj				= window.javo_map_box_func;
				if (typeof clear !='Undefined' && clear == true) {
					obj.clear_map();
				};

				$.each( response, function( i, item ){

					if( item.lat != "" && item.lng != "" )
					{
						var k =1;
						if (i ==response.length - 1) {k =0}else{k = i +1};
						/*
						var dis = obj.setCompareDistance(new google.maps.LatLng( item.place_lat, item.place_lng ),
							new google.maps.LatLng( response[k].place_lat, response[k].place_lng ) );
						console.log(dis);*/

						var icon_content ='';
						if (typeof icon !=='undefined' && icon == true) {
							icon_content= '<span class="icon-item-place-number" >'+(i+1)+'</span>';
						};

						item_markers.push( {
							//latLng		: new google.maps.LatLng( item.lat, item.lng )
							lat			: item.place_lat
							, lng		: item.place_lng
							, thumbnail : item.post_thumbnail

							, options	: { icon: item.post_thumbnail , content 	: icon_content +'<img src="'+item.post_thumbnail + '"  width="40" height="40" class="icon-item-place"  />'}
							, id		: "mid_" + item.post_id
							, data		: item
						} );
					}
				});

				if( item_markers.length > 0 )
				{

					var _opt = {
						marker:{
							values:item_markers
							, events:{
								click: function( m, e, c ){

									var map = $(this).gmap3( 'get' );
									

									$.get(
										'/api/trip3s_place_by_id'
										, {
											 post_id	: c.data.post_id
										}
										, function( response )
										{
											var str = '', nstr = '';

											if( response.state == "success" )
											{
												
												str = $('#javo-map-box-infobx-content').html();
												str = str.replace( /{post_id}/g		, response.post_id );
												str = str.replace( /{post_title}/g	, response.post_title );
												str = str.replace( /{permalink}/g	, response.permalink );
												str = str.replace( /{thumbnail}/g	, response.thumbnail );
												str = str.replace( /{category}/g	, response.category );
												str = str.replace( /{location}/g	, response.location );
												str = str.replace( /{phone}/g		, response.phone || nstr );
												str = str.replace( /{mobile}/g		, response.mobile || nstr );
												str = str.replace( /{website}/g		, response.website || nstr );
												str = str.replace( /{email}/g		, response.email || nstr );
												str = str.replace( /{address}/g		, response.address || nstr );
												str = str.replace( /{author_name}/g	, response.author_name || nstr );

											}else{
												str = "error";
											}
											obj.infoWindo.setContent( str);
									obj.infoWindo.open( map, m);
									map.setCenter( m.getPosition() );
											$( "#javo-map-info-w-content" ).html( str );
										}
										, "json"
									)
									.fail( function( response ){

										$.javo_msg({ content: $( "[javo-server-error]" ).val(), delay: 10000 });
										console.log( response.responseText );

									} );
								} // End Click
							} // End Event
						} // End Marker
					}


					if( $( "[javo-cluster-onoff]" ).val() != "disable" ) {

						_opt.marker.cluster = {
							radius: parseInt( $("[javo-cluster-level]").val() ) || 100
							, 0:{ content:'<div class="javo-map-cluster admin-color-setting">CLUSTER_COUNT</div>', width:52, height:52 }
							, events:{
								click: function( c, e, d )
								{
									var $map = $(this).gmap3('get');
									var maxZoom = new google.maps.MaxZoomService();
									var c_bound = new google.maps.LatLngBounds();

									// IF Cluster Max Zoom ?
									maxZoom.getMaxZoomAtLatLng( d.data.latLng , function( response ){
										if( response.zoom <= $map.getZoom() && d.data.markers.length > 0 )
										{
											var str = '';

											str += "<ul class='list-group'>";

											str += "<li class='list-group-item disabled text-center'>";
												str += "<strong>";
													str += $("[javo-cluster-multiple]").val();
												str += "</strong>";
											str += "</li>";

											$.each( d.data.markers, function( i, k ){
												str += "<a onclick=\"window.javo_map_box_func.marker_trigger('" + k.id +"');\" ";
													str += "class='list-group-item'>";
													str += k.data.post_title;
												str += "</a>";
											});

											str += "</ul>";
											var hMarker		= new google.maps.Marker({
												position	: c.main.getPosition()
												, map		: $map
												, icon		: ''
											});

											obj.infoWindo.setContent( str );
											obj.infoWindo.open( $map, hMarker );
											hMarker.setMap( null );

										}else{
											$map.setCenter( c.main.getPosition() );
											$map.setZoom( $map.getZoom() + 2 );
										}
									} ); // End Get Max Zoom
								} // End Click
							} // End Event
						} // End Cluster
					} // End If

					this.el.gmap3( _opt , "autofit" );
				}
			}

			, map_clear: function( marker_with )
			{
				var elements = new Array( 'rectangle' );
				if( ! $( '.javo-my-position' ).hasClass( 'active' ) )
					elements.push( 'circle' );

				if( marker_with )
					elements.push( 'marker' );

				this.el.gmap3({ clear:{ name:elements } });
				this.iw_close();
			}

			, iw_close: function(){
				if( typeof this.infoWindo != "undefined" )
				{
					this.infoWindo.close();
				}
			}
			, load_more: function( e )
			{
				e.preventDefault();

				var obj			= window.javo_map_box_func;
				obj.append_load_more();
			}
			, append_list_items: function( data )
			{

				var btn			= $( '[data-javo-map-load-more]' );
					var response = data;
						var buf			= "";
						if( response.length > 0 )
						{

							$.each( response, function( index, data ){
								var str = "";

								str = $('#javo-map-box-panel-content').html();

								str = str.replace(/{place_full}/g		, JSON.stringify(data));
								str = str.replace(/{post_id}/g			, data.post_id );
								str = str.replace(/{place_id}/g			, data.place_id );
								str = str.replace(/{post_title}/g		, data.post_title || '');
								str = str.replace(/{excerpt}/g			, data.post_content || '');
								str = str.replace(/{thumbnail_large}/g	, data.post_thumbnail || '');
								str = str.replace(/{permalink}/g		, data.permalink || '');
								str = str.replace(/{avatar}/g			, data.avatar || '');
								str = str.replace(/{rating}/g			, data.rating || 0);
								str = str.replace(/{favorite}/g			, data.favorite || '' );
								str = str.replace(/{category}/g			, data.category || '');
								str = str.replace(/{place_lat}/g		, data.place_lat || '');
								str = str.replace(/{place_lng}/g		, data.place_lng || '');
								str = str.replace(/{location}/g			, data.location || '');
								buf += str;
							});

							$('.javo_mhome_map_output #products').append( buf );

							var page_ = parseInt(btn.attr('data-javo-map-load-more')) + 1;
							btn.attr('data-javo-map-load-more',page_);

							btn.prop( 'disabled', false ).find('i').removeClass('fa-spin');

							// Apply Rating
							$('.javo-rating-registed-score').each(function(k,v){
								$(this).raty({
									starOff		: '/assets/images/star-off-s.png'
									, starOn	: '/assets/images/star-on-s.png'
									, starHalf	: '/assets/images/star-half-s.png'
									, half		: true
									, readOnly	: true
									, score		: $(this).data('score')
								}).css('width', '');
							});
						}else{
							$.javo_msg({ content: $("[javo-map-item-not-found]").val(), delay: 1000, close:false });
						}

						$( "[name='btn_viewtype_switch']:checked" ).parent( 'label' ).trigger( 'click' );

						btn.prop( 'disabled', false ).find('i').removeClass('fa-spin');

			}
			,trigger_marker: function( e )
			{
				var obj = window.javo_map_box_func;
				obj.el.gmap3({
						map:{ options:{ zoom: parseInt( $("[javo-marker-trigger-zoom]").val() ) } }
					},{
					get:{
						name:"marker"
						,		id: $( this ).data('id')
						, callback: function(m){
							google.maps.event.trigger(m, 'click');
						}
					}
				});
			}
			, order_switcher: function( e )
			{
				e.preventDefault();
				var obj = window.javo_map_box_func;
				var ico = $( this ).children( 'span' );

				if( $( this ).data('order') == 'desc' )
				{
					$( this ).data( 'order', 'asc' );
					ico
						.removeClass( 'glyphicon-open' )
						.addClass( 'glyphicon-save' );
				}else{
					$( this ).data( 'order', 'desc' );
					ico
						.removeClass( 'glyphicon-save' )
						.addClass( 'glyphicon-open' );
				}
				obj.filter();
			}

			, trigger_favorite: function( e )
			{
				var obj = window.javo_map_box_func;

				if( $(this).hasClass('active') )
				{
					$(this).removeClass('active');
					obj.side_out();
				}else{
					$(this).addClass('active');
					obj.side_move();
					obj.ajax_favorite();
				}
			}

			, side_out: function()
			{
				var panel	= $( ".javo_mhome_sidebar");
				var btn		= $( ".javo-mhome-sidebar-onoff" );
				var panel_x	=  -( panel.outerWidth() ) + 'px';
				var btn_x	=  0 + 'px';

				panel.animate({ marginLeft: panel_x }, 300);
				btn.animate({ marginLeft: btn_x }, 300);
			}

			, side_move: function()
			{
				var panel	= $( ".javo_mhome_sidebar");
				var btn		= $( ".javo-mhome-sidebar-onoff" );
				var panel_x	=  0 + 'px';
				var btn_x	=  panel.outerWidth() + 'px';
				panel.animate({ marginLeft: panel_x }, 300);
				btn.animate({ marginLeft: btn_x }, 300);
			}

			, ajax_favorite:function(places,index){
				var obj			= this;
				var panel		= $('.javo_mhome_sidebar');
				
				panel = $('.javo_mhome_sidebar');
				panel.html( $('#loading-list-place-plan').html() );
				var schedule_day = $('[javo-current-day]').val();
				
				var strFull='',nstr='',placeLength = 0;
				placeLength = places.length;
				var strAttr = $("#trip3s-attribute-schedule-2").html(),strCurr='';
				strAttr 	= strAttr.replace(/{{data-place}}/g,	tripPlan.placeIds.length || '0');
				strAttr 	= strAttr.replace(/{{data-time}}/g,		tripPlan.dayNumber || '0');
				strAttr 	= strAttr.replace(/{{data-user}}/g,		tripPlan.userNumber || '0');

	 			strFull +="<div class=\"row schedule-day-boby-detail \">";
	 			strFull +="<div class=\"schedule-day-header-bar attribute-schedule\">"+strAttr+"</div> ";
	 			strFull +='<ul class="schedule-day-boby scrollbar style-3">';
				$('#body-detail-add-plan').html('');
				if (typeof places != "undefined" && places.length > 0) {
					
					for (var i = 0; i < placeLength; i++) {
						tripPlan
						var str = '';
						str = $("#trip3s-place-in-schedule").html();
						str = str.replace( /{{current_place}}/g , JSON.stringify(places[i]) || '{}' );
						str = str.replace( /{{post_thumbnail}}/g , places[i].post_thumbnail || nstr );
						str = str.replace( /{{place_id}}/g , places[i].place_id || nstr );
						str = str.replace( /{{post_title}}/g	 , places[i].post_title || nstr );
						str = str.replace( /{{post_excerpt}}/g	 , places[i].phone || nstr );
						str = str.replace( /{{place_time}}/g ,  places[i].place_time  || nstr );
						str = str.replace( /{{sort_thumbnail}}/g ,  (i+1)  || nstr );
						str = str.replace( /{{place_ticket}}/g ,  places[i].place_ticket  || nstr );
						str = str.replace( /{{place_note}}/g ,  places[i].place_note || nstr );
						str = str.replace( /{{next_distance}}/g ,  places[i].next_distance  || nstr );
						str = str.replace( /{{next_time}}/g ,  places[i].next_time  || nstr );
						str = str.replace( /{{next_detail}}/g ,  places[i].next_detail  || nstr );
						strFull +=str;
					};
				};
				strFull +="</ul></div>";

				var _index =1;
				$('#body-detail-add-plan').html(strFull);
				if (typeof index !== 'undefined') {
					_index = index;
				};
				console.log("Index: " + _index);
				update_bar_day({index:_index,distance:0,
					placeNumber:placeLength,
					dayNumber:tripPlan.dayNumber,
					moneyNumber:tripPlan.moneyNumber,
					userNumber:tripPlan.userNumber});
			}

			, apply_order: function( data )
			{
				var result = [];
				var obj = window.javo_map_box_func;
				var o		= $( "[data-javo-hmap-sort]" ).data('order');

				for( var i in data)
					result.push( data[i] );

				if( typeof result != "undefined" ) {
					result.sort( function(a,b){ var c=parseInt(a.post_id),d=parseInt(b.post_id); return c < d ? -1 : c > d ? 1: 0; } );
				}else{
					result = {}
				}

				return result;
			}

			, marker_on_list: function( e ){
				e.preventDefault();

				var obj = window.javo_map_box_func;

				obj.marker_trigger( $(this).data('id') );
				obj.map.setZoom( parseInt( $("[javo-marker-trigger-zoom]").val() ) );

			}

			, marker_trigger: function( marker_id ){
				this.el.gmap3({
					get:{
						name		: "marker"
						, id		: marker_id
						, callback	: function(m){
							google.maps.event.trigger(m, 'click');
						}
					}
				});
			} // End Cluster Trigger

			, setGetLocationKeyword: function( e )
			{
				var obj		= window.javo_map_box_func;
				var data	= obj.items;

				var el		= $("input#javo-map-box-location-ac");

				if( e.keyCode == 13 ){

					if( el.val() != "" )
					{

						obj.el.gmap3({
							getlatlng:{
								address: el.val()
								, callback: function( response )
								{
									var sanitize_result, metry;
									var map = $( this ).gmap3( 'get' );

									if( ! response ) {
										$.javo_msg({ content: $("[javo-bad-location]").val(), delay:1000, close:false });
										return false;
									}

									metry = response[0].geometry;

									if( metry.viewport ) {
										var xx = metry.viewport.getSouthWest().lat();
										var xy = metry.viewport.getNorthEast().lat();
										var yx = metry.viewport.getSouthWest().lng();
										var yy = metry.viewport.getNorthEast().lng();

										map.fitBounds( metry.viewport );
										sanitize_result = obj.latlng_calc( xx, xy, yx, yy, data );
									}

									obj.filter( sanitize_result );
								}
							}
						});
					}else{
						obj.filter( data );
					}
					e.preventDefault();
				}
			}

			, latlng_calc: function( s, e, n, w, item ){

				var result = [];

				$.each( item, function( i, k ){

					if(
						( s <= parseFloat( k.lat) && e >= parseFloat(k.lat ) ) &&
						( n <= parseFloat( k.lng) && w >= parseFloat(k.lng ) )
					){
						result.push( item[i] );
					}
				} );
				return result;
			}

			, brief_run: function(e){

				var brief_option = {};
				brief_option.type = "post";
				brief_option.dataType = "json";
				brief_option.url = "http://javothemes.com/directory/demo2/wp-admin/admin-ajax.php";
				brief_option.data = { "post_id" : $(e).data('id'), "action" : "javo_map_brief"};
				brief_option.error = function(e){ console.log( e.responseText ); };
				brief_option.success = function(db){
					$(".javo_map_breif_modal_content").html(db.html);
					$("#map_breif").modal("show");
					$(e).button('reset');
				};
				$(e).button('loading');
				$.ajax(brief_option);
			}
			, contact_run: function(e){
				$('.javo-contact-user-name').html( $(e).data('username') );
				$('input[name="contact_item_name"]').val($(e).data('itemname'))
				$('input[name="contact_this_from"]').val( $(e).data('to') );
				$("#author_contact").modal('show');
			}

			, submit_contact: function( e )
			{
				e.preventDefault();

				var obj				= window.javo_map_box_func;
				var el				= $( this );
				var frm				= el.closest( 'form' );


				var options_		= {
					subject				: $("input[name='contact_name']")
					, url				: $( "[javo-ajax-url]" ).val()
					, from				: $("input[name='contact_email']")
					, content			: $("textarea[name='contact_content']")
					, to				: frm.find('input[name="contact_this_from"]').val()
					, item_name			: frm.find('input[name="contact_item_name"]').val()
					, to_null_msg		: "Please, insert recipient's email address."
					, from_null_msg		: "Please, insert sender's email address."
					, subject_null_msg	: "Please, insert your name."
					, content_null_msg	: "Please, insert message content."
					, successMsg		: "Successfully sent!"
					, failMsg			: "Sorry, your message could not be sent."
					, confirmMsg		: "Do you want to send this message?"
				};

				$.javo_mail( options_, function(){
					el.button('loading');
				}, function(){
					$('#author_contact').modal('hide');
					el.button('reset');
				});
			}

			, setCompareDistance : function ( p1, p2 )
			{
				// Google Radius API
				var R = 6371;
				var dLat = (p2.lat() - p1.lat()) * Math.PI / 180;
				var dLon = (p2.lng() - p1.lng()) * Math.PI / 180;
				var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
				Math.cos(p1.lat() * Math.PI / 180) * Math.cos(p2.lat() * Math.PI / 180) *
				Math.sin(dLon / 2) * Math.sin(dLon / 2);
				var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
				var d = R * c;
				return d;
			}

			, getMyPosition : function( e )
			{
				var obj			= window.javo_map_box_func;
				var el_slier	= $( ".javo-geoloc-slider" );

				if( $( this ).hasClass( 'active' ) ) {
					$( this )
						.removeClass( 'active' )
						.find( 'i' ).removeClass( 'fa-spin' );
					el_slier
						.trigger( 'set' )
						.prop( 'disabled', true )
						.addClass( 'disabled' )
				}else{
					$( this )
						.addClass( 'active' )
						.find( 'i' ).addClass( 'fa-spin' );
					el_slier
						.trigger( 'set' )
						.prop( 'disabled', false )
						.removeClass( 'disabled' )
				}
				obj.map_clear( false );
			}
		}
		window.javo_map_box_func.init();
	});