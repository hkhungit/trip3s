/*
* jQuery javo Search Plugin; v1.3.1
* Last Modified	: 2015-06-24
* Copyright (C) 2014 javo
*/

(function($){

	window.javo_search_instance = false;

	var javo_search_func = {

		init: function( attr, el )
		{
			var _attr = $.extend( true, {}, {
				type				: 1
				, ppp				: 10
				, featured			: "image"
				, page				: 1
				, post_type			: "item"
				, meta_term			: false
				, success_callback	: null
				, before_callback	: null
				, start				: true
				, txtKeyword		: $( ".javo-listing-search-field" )
				, btnSubmit			: $( ".javo-listing-submit" )
				, type_toggler		: $( "[name='javo_btn_item_list_type']" )
				, views				: $( "li[data-javo-hmap-ppp]" )
				, parameters		: false
			}, attr);

			this.attr				= _attr;
			this.el					= el;

			if( this.attr.map.val() != '' )
			{
				var em				= $( this.attr.map.val()  );
				em					.height( 380 )
			}

			if( this.attr.start ){
				this.run();
			}

			; $( document )
				.on( 'change'	, this.attr.selFilter.selector		, this.trigger_filter )
				.on( 'click'	, '.page-numbers'					, this.trigger_pagination )
				.on( 'keypress'	, this.attr.txtKeyword.selector		, this.trigger_keyword )
				.on( 'click'	, this.attr.btnSubmit.selector		, this.trigger_search_button )
				.on( 'change'	, this.attr.type_toggler.selector	, this.swap_type )
				.on( 'click'	, this.attr.views.selector			, this.swap_views )
				.on( 'click'	, '[data-listing-map-move-allow]'	, this.disable_map_drag )


			; window.javo_search_instance = true;
		}

		, trigger_filter: function( e )
		{
			e.preventDefault();
			var obj = javo_search_func;
			obj.run();
		}

		, trigger_pagination: function( e )
		{
			e.preventDefault();
			var obj			= javo_search_func;
			var options		=  obj.attr.param;
			var pn			= $(this).attr("href").split("=");
			pn				= parseInt( pn[1] );

			options.page	= !isNaN( pn ) ? pn : 1;
			obj.run();
		}

		, trigger_keyword: function( e )
		{
			var obj			= javo_search_func;
			var options		=  obj.attr.param;

			if( e.keyCode == 13 )
			{
				options.page = 1;
				obj.run();
				e.preventDefault();
			}
		}

		, trigger_search_button: function( e )
		{
			e.preventDefault();

			var obj			= javo_search_func;
			var options		=  obj.attr.param;
			options.page	= 1;
			obj.run();
		}

		, swap_type: function( e )
		{
			e.preventDefault();
			var obj			= javo_search_func;
			var options		=  obj.attr.param;
			var type		= parseInt( $( this ).val() );

			if( ! isNaN( type ) )
			{
				options.type = type;
				obj.run();
			}
		}

		, swap_views: function( e )
		{
			e.preventDefault();
			var obj			= javo_search_func;
			var options		=  obj.attr.param;
			var views		= parseInt( $( this ).val() );

			if( ! isNaN( views ) )
			{
				options.ppp	= views;
				obj.run();
			}
		}

		, disable_map_drag: function( e )
		{
			e.preventDefault();
			var obj			= javo_search_func;
			var attr		= obj.attr;

			var $map = $( attr.map.val() ).gmap3('get');

			$(this).toggleClass('active');

			if( $(this).hasClass('active') )
			{
				// Allow
				$map.setOptions({draggable:true, scrollwheel: true});
				$(this).find('i').removeClass('fa fa-lock').addClass('fa fa-unlock');
			}
			else
			{
				// Not Allowed
				$map.setOptions({draggable:false, scrollwheel: false});
				$(this).find('i').removeClass('fa fa-unlock').addClass('fa fa-lock');
			}
		}

		, run: function( param )
		{
			var
				obj				= this
				, data			= {}
				, attr			= obj.attr
				, param			= param || attr.param
				, order			= $( "[key='order']", obj.attr.parameters ).val() || false
				, orderby		= $( "[key='orderby']", obj.attr.parameters ).val() || false;

			// Ajax Setup
			param.action		= 'post_list';

			if( order )
				param.order		= order;

			if( orderby )
				param.orderby	= orderby;

			console.log( param );

			if( typeof attr.before_callback == 'function' ){
				attr.before_callback();
			}

			if( typeof( attr.selFilter ) != "undefined" )
			{
				$.each( attr.selFilter, function(){
					if( this.value != "" && this.value > 0)
					{
						var n = this.name.replace("]", "").split("[")[1];
						if( typeof data[n] != 'undefined' ){
							data[n].push( this.value );
						}else{
							data[n] = Array( this.value );
						}
					};
				});
				param.tax = data;
			};
			if( typeof( attr.txtKeyword) != "undefined" )
			{
				param.keyword = attr.txtKeyword.val();
			};

			$.ajaxSetup({
				xhr: function(){

					var xhr;

					if( window.XMLHttpRequest )
					{
						xhr = new window.XMLHttpRequest();
					}else{
						xhr = new ActiveXObject( 'Microsoft.XMLHTTP' );
					}

					//Download progress
					xhr.addEventListener("progress", function(evt)
					{
						if( evt.lengthComputable ) {
						var percentComplete = evt.loaded / evt.total;
							//Do something with download progress
							console.log(percentComplete);
						}
					}, false);

					return xhr;
				}
			});

			$.post(
				obj.attr.url
				, param
				, function( response ){
					if( response.result == "success" )
					{
						var el = obj.el;

						;el
							.fadeOut('fast', function(){
								$(this).html( response.html ).fadeIn('fast');
								if( typeof attr.success_callback == 'function' ){
									attr.success_callback();
								}
							})

						if( attr.map.val() != '' )
						{
							var em			= $( attr.map.val() );
							var markers		= [];
							var map_init	= {
								map:{
									options:{
										 mapTypeId			: google.maps.MapTypeId.ROADMAP
										, mapTypeControl	: false
										, navigationControl	: true
										, scrollwheel		: true
										, streetViewControl	: true
										, styles: [
											{
												featureType: "poi",
												elementType: "labels",
												stylers: [
													  { visibility: "off" }
												]
											}
										]
									}
								}
							};

							$.each( response.markers, function(i, v){
								if(v.lat != "", v.lng != ""){
									markers.push({ id: v.id, latLng:[v.lat, v.lng], data:v.info, options:{icon:v.icon}});
								}
							});

							map_init.marker = {
								values: markers
								, events:{
									click: function(m, e, c){
										var map		= $(this).gmap3("get");
										var infoBox	= $(this).gmap3({get:{name:"infowindow"}});

										if( infoBox )
										{
											infoBox.open( map, m );
											infoBox.setContent( c.data.content );
										}else{
											$( this )
												.gmap3({ infowindow:{ anchor:m, options:{ content: c.data.content, maxWidth:500 } } });
										}
									}
								}

								, cluster:{
									radius:100
									, 0:{ content:'<div class="javo-map-cluster admin-color-setting">CLUSTER_COUNT</div>', width:52, height:52 }
									, events:{
										click:function(c, e, d){

											var $map		= $(this).gmap3('get');
											var $el			= $( window.javo_search_map_element );
											var $infoBox	= $(this).gmap3({get:{name:"infowindow"}});
											var maxZoom		= new google.maps.MaxZoomService();
											var c_bound		= new google.maps.LatLngBounds();
											var c_anchor	= new google.maps.MVCObject;

											// IF Cluster Max Zoom ?
											maxZoom.getMaxZoomAtLatLng( d.data.latLng , function( response ){
												if( response.zoom <= $map.getZoom() && d.data.markers.length > 0 )
												{
													var str = '';
													str += "<div class='list-group'>";

													str += "<a class='list-group-item disabled text-center'>";
														str += "<strong>";
															str += $("[javo-cluster-multiple]").val();
														str += "</strong>";
													str += "</a>";
													$.each( d.data.markers, function( i, k ){
														str += "<a href=\"javascript:javo_search_marker_trigger('" + k.id +"');\" ";
															str += "class='list-group-item'>";
															str += "<span class='badge pull-left'>" + parseInt( i + 1 ) +  "</span>&nbsp;&nbsp;";
															str += k.data.post_title;
														str += "</a>";
													});

													str += "</div>";

													//c_anchor.set( 'position', c.main.getPosition() );
													c_anchor.set( 'position', c.main.getPosition() );

													if( $infoBox )
													{
														$infoBox.setPosition( c.main.getPosition() );
														$infoBox.open( $map );
														$infoBox.setContent( str );

													} else {
														$el.gmap3({ infowindow:{ options:{ content: str, maxWidth:500, position: c.main.getPosition() } } });
													}

												}else{

													$.each( d.data.markers, function(i, k){
														c_bound.extend( new google.maps.LatLng( k.latLng[0], k.latLng[1] ) );
													});
													$map.fitBounds( c_bound );
												}
											} );

										// Cluster Marker Click Func Close -->

										} // End Click
									}	// End Events
								}	// End cluster
							};	// End Map init

							;em
								.gmap3({ clear:{ name:[ 'marker', 'infowindow'] }})
								.gmap3( map_init, "autofit" )

							if( $("[data-listing-map-move-allow]").length <= 0 )
							{
								var btnLock, tagLock;
								tagLock += "<div class='btn-group'>";
									tagLock += "<a class='btn btn-default active' data-listing-map-move-allow>";
										tagLock += "<i class='fa fa-unlock'></i>";
									tagLock += "</a>";
								tagLock += "</div>";

								$( tagLock ).appendTo( attr.map.val() );

								btnLock = $( '[data-listing-map-move-allow]' ).closest( '.btn-group' );
								btnLock.css({
									position	: 'absolute'
									, zIndex	: 1
									, right		: 0
									, top		: '50%'
									, marginTop	: '-17px'
								});
							}
						}
					}
				}
				, 'json'
			)
			.fail( function( response ){
				$.javo_msg({ content: "Server Error", delay:1000, close:false });

				console.log( response.responseText );
			})
		}
	};

	$.fn.javo_search = function( attr )
	{
		if( !window.javo_search_instance )
		{
			var el = $(this);
			javo_search_func.init( attr, el );
		}
	}
})(jQuery);

/*
/*
* jQuery javo Search Plugin; v1.3.0
* Last Modified	: 2015-01-02
* Copyright (C) 2014 javo


(function($){

	window.javo_search_instance = false;

	var javo_search_func = {

		init: function( attr, el )
		{
			var _attr = $.extend( true, {}, {
				type				: 1
				, ppp				: 10
				, featured			: "image"
				, page				: 1
				, post_type			: "item"
				, meta_term			: false
				, success_callback	: null
				, before_callback	: null
				, start				: true
				, txtKeyword		: $( ".javo-listing-search-field" )
				, btnSubmit			: $( ".javo-listing-submit" )
				, type_toggler		: $( "[name='javo_btn_item_list_type']" )
				, views				: $( "li[data-javo-hmap-ppp]" )
			}, attr);

			this.attr				= _attr;
			this.el					= el;

			if( this.attr.map.val() != '' )
			{
				var em				= $( this.attr.map.val() );
				em					.height( 380 )
			}

			if( this.attr.start ){
				this.run();
			}

			; $( document )
				.on( 'change'	, this.attr.selFilter.selector		, this.trigger_filter )
				.on( 'click'	, '.page-numbers'					, this.trigger_pagination )
				.on( 'keypress'	, this.attr.txtKeyword.selector		, this.trigger_keyword )
				.on( 'click'	, this.attr.btnSubmit.selector		, this.trigger_search_button )
				.on( 'change'	, this.attr.type_toggler.selector	, this.swap_type )
				.on( 'click'	, this.attr.views.selector			, this.swap_views )
				.on( 'click'	, '[data-listing-map-move-allow]'	, this.disable_map_drag )
				.on( 'javo_marker:init', this.aa() )


			; window.javo_search_instance = true;
		}

		, aa : function()
		{
		    var obj = this;

		    return function(){

    		    $( document ).on( 'click'    , '[data-javo-search-marker-trigger]' , obj.trigger_marker() );

		    }

		}

		, trigger_marker : function()
		{
		    var obj = this;
		    return function( e ){
		        e.preventDefault();
		        var marker_id = $( this ).data( 'javo-search-marker-trigger' );

		        console.log( marker_id );

		         obj.el.gmap3({
					get:{
						name:"marker"
						,		id: marker_id
						, callback: function(m){
						    console.log( m );
							google.maps.event.trigger( m, 'click' );
						}
					}
		        });
		    }
		}

		, trigger_filter: function( e )
		{
			e.preventDefault();
			var obj = javo_search_func;
			obj.run();
		}

		, trigger_pagination: function( e )
		{
			e.preventDefault();
			var obj			= javo_search_func;
			var options		=  obj.attr.param;
			var pn			= $(this).attr("href").split("=");
			pn				= parseInt( pn[1] );

			options.page	= !isNaN( pn ) ? pn : 1;
			obj.run();
		}

		, trigger_keyword: function( e )
		{
			var obj			= javo_search_func;
			var options		=  obj.attr.param;

			if( e.keyCode == 13 )
			{
				options.page = 1;
				obj.run();
				e.preventDefault();
			}
		}

		, trigger_search_button: function( e )
		{
			e.preventDefault();

			var obj			= javo_search_func;
			var options		=  obj.attr.param;
			options.page	= 1;
			obj.run();
		}

		, swap_type: function( e )
		{
			e.preventDefault();
			var obj			= javo_search_func;
			var options		=  obj.attr.param;
			var type		= parseInt( $( this ).val() );

			if( ! isNaN( type ) )
			{
				options.type = type;
				obj.run();
			}
		}

		, swap_views: function( e )
		{
			e.preventDefault();
			var obj			= javo_search_func;
			var options		=  obj.attr.param;
			var views		= parseInt( $( this ).val() );

			if( ! isNaN( views ) )
			{
				options.ppp	= views;
				obj.run();
			}
		}

		, disable_map_drag: function( e )
		{
			e.preventDefault();
			var obj			= javo_search_func;
			var attr		= obj.attr;

			var $map = $( attr.map.val() ).gmap3('get');

			$(this).toggleClass('active');

			if( $(this).hasClass('active') )
			{
				// Allow
				$map.setOptions({draggable:true, scrollwheel: true});
				$(this).find('i').removeClass('fa fa-lock').addClass('fa fa-unlock');
			}
			else
			{
				// Not Allowed
				$map.setOptions({draggable:false, scrollwheel: false});
				$(this).find('i').removeClass('fa fa-unlock').addClass('fa fa-lock');
			}
		}

		, run: function( param )
		{
			var obj			= this;
			var data		= {};
			var attr		= obj.attr;
			var param		= param || attr.param;

			// Ajax Setup
			param.action	= 'post_list';

			if( typeof attr.before_callback == 'function' ){
				attr.before_callback();
			}

			if( typeof( attr.selFilter ) != "undefined" )
			{
				$.each( attr.selFilter, function(){
					if( this.value != "" && this.value > 0)
					{
						var n = this.name.replace("]", "").split("[")[1];
						if( typeof data[n] != 'undefined' ){
							data[n].push( this.value );
						}else{
							data[n] = Array( this.value );
						}
					};
				});
				param.tax = data;
			};
			if( typeof( attr.txtKeyword) != "undefined" )
			{
				param.keyword = attr.txtKeyword.val();
			};

			$.ajaxSetup({
				xhr: function(){

					var xhr;

					if( window.XMLHttpRequest )
					{
						xhr = new window.XMLHttpRequest();
					}else{
						xhr = new ActiveXObject( 'Microsoft.XMLHTTP' );
					}

					//Download progress
					xhr.addEventListener("progress", function(evt)
					{
						if( evt.lengthComputable ) {
						var percentComplete = evt.loaded / evt.total;
							//Do something with download progress
							console.log(percentComplete);
						}
					}, false);

					return xhr;
				}
			});

			$.post(
				obj.attr.url
				, param
				, function( response ){
					if( response.result == "success" )
					{
						var el = obj.el;

						;el
							.fadeOut('fast', function(){
								$(this).html( response.html ).fadeIn('fast');
								if( typeof attr.success_callback == 'function' ){
									attr.success_callback();
								}
							})

						if( attr.map.val() != '' )
						{
							var em			= $( attr.map.val() );
							var markers		= [];
							var map_init	= {
								map:{
									options:{
										 mapTypeId			: google.maps.MapTypeId.ROADMAP
										, mapTypeControl	: false
										, navigationControl	: true
										, scrollwheel		: true
										, streetViewControl	: true
										, styles: [
											{
												featureType: "poi",
												elementType: "labels",
												stylers: [
													  { visibility: "off" }
												]
											}
										]
									}
								}
							};

							$.each( response.markers, function(i, v){
								if(v.lat != "", v.lng != ""){
									markers.push({ id: v.id, latLng:[v.lat, v.lng], data:v.info, options:{icon:v.icon}});
								}
							});

							map_init.marker = {
								values: markers
								, events:{
									click: function(m, e, c){
										var map		= $(this).gmap3("get");
										var infoBox	= $(this).gmap3({get:{name:"infowindow"}});

										if( infoBox )
										{
											infoBox.open( map, m );
											infoBox.setContent( c.data.content );
										}else{
											$( this )
												.gmap3({ infowindow:{ anchor:m, options:{ content: c.data.content, maxWidth:500 } } });
										}
									}
								}

								, cluster:{
									radius:100
									, 0:{ content:'<div class="javo-map-cluster admin-color-setting">CLUSTER_COUNT</div>', width:52, height:52 }
									, events:{
										click:function(c, e, d){

											var $map		= $(this).gmap3('get');
											var $el			= $( window.javo_search_map_element );
											var $infoBox	= $(this).gmap3({get:{name:"infowindow"}});
											var maxZoom		= new google.maps.MaxZoomService();
											var c_bound		= new google.maps.LatLngBounds();
											var c_anchor	= new google.maps.MVCObject;

											// IF Cluster Max Zoom ?
											maxZoom.getMaxZoomAtLatLng( d.data.latLng , function( response ){
												if( response.zoom <= $map.getZoom() && d.data.markers.length > 0 )
												{
													var str = '';
													str += "<div class='list-group'>";

													str += "<a class='list-group-item disabled text-center'>";
														str += "<strong>";
															str += $("[javo-cluster-multiple]").val();
														str += "</strong>";
													str += "</a>";
													$.each( d.data.markers, function( i, k ){
														str += "<a href=\"javascript\" data-javo-search-marker-trigger=\"" + k.id +"\"" + ' ';
															str += "class='list-group-item'>";
															str += "<span class='badge pull-left'>" + parseInt( i + 1 ) +  "</span>&nbsp;&nbsp;";
															str += k.data.post_title;
														str += "</a>";
													});

													str += "</div>";

													//c_anchor.set( 'position', c.main.getPosition() );
													c_anchor.set( 'position', c.main.getPosition() );

													if( $infoBox )
													{
														$infoBox.setPosition( c.main.getPosition() );
														$infoBox.open( $map );
														$infoBox.setContent( str );
													} else {
                                                        var infowindow = new google.maps.InfoWindow({ content: str });
                                                        infowindow.open( $map, c.main);
													}
												}else{

													$.each( d.data.markers, function(i, k){
														c_bound.extend( new google.maps.LatLng( k.latLng[0], k.latLng[1] ) );
													});
													$map.fitBounds( c_bound );
												}
											} );

										// Cluster Marker Click Func Close -->

										} // End Click
									}	// End Events
								}	// End cluster
							};	// End Map init

							;em
								.gmap3({ clear:{ name:[ 'marker', 'infowindow'] }})
								.gmap3( map_init, "autofit" )

							$( document ).trigger( 'javo_marker:init' );

							if( $("[data-listing-map-move-allow]").length <= 0 )
							{
								var btnLock, tagLock;
								tagLock += "<div class='btn-group'>";
									tagLock += "<a class='btn btn-default active' data-listing-map-move-allow>";
										tagLock += "<i class='fa fa-unlock'></i>";
									tagLock += "</a>";
								tagLock += "</div>";

								$( tagLock ).appendTo( attr.map.val() );

								btnLock = $( '[data-listing-map-move-allow]' ).closest( '.btn-group' );
								btnLock.css({
									position	: 'absolute'
									, zIndex	: 1
									, right		: 0
									, top		: '50%'
									, marginTop	: '-17px'
								});
							}
						}
					}
				}
				, 'json'
			)
			.fail( function( response ){
				$.javo_msg({ content: "Server Error", delay:1000, close:false });

				console.log( response.responseText );
			})
		}
	};

	$.fn.javo_search = function( attr )
	{
		if( !window.javo_search_instance )
		{
			var el = $(this);
			javo_search_func.init( attr, el );
		}
	}

})(jQuery);


*/