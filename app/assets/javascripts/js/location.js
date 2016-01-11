  jQuery(function($){
      $(document).on('click','.trans-detail',function(){
        var data = $(this).data('iddetail');
          $('#next-route-detail-'+data).toggle();
      });
      $(document).on('click','#btn-plan-pdf',function(){
       
        $("#itinerary-detail").find('.iti-att-next-route-detail').show();
        $("#itinerary-detail").find('.panel-hide-print').hide();
        
         var pdf = new jsPDF('p', 'pt', 'a4');
          var options = {
                   pagesplit: true,
                   background: '#FFFFFF'
              };

          pdf.addHTML($("#itinerary-detail"), options, function()
          {
              pdf.save("chi tiet.pdf");
               $("#itinerary-detail").find('.iti-att-next-route-detail').hide();
                $("#itinerary-detail").find('.panel-hide-print').show();
          });
      });


      $('.map-in-plan').each(function(e){
        $(this).gmap3();
          var day = $(this).data('day'), schedule_id = $(this).data('scheduleid'); 
         setTimeout(function(){
        
          $.post('/api/detail_by_schedule_id',{schedule_id: schedule_id}).done(function(data){

            var obj     = window.javo_map_box_func;
            $('#map-schedule-'+day).gmap3(obj.options.map_init);
            var map = $('#map-schedule-'+day).gmap3( 'get' );
      
            obj.drawRoutePreview(data,map,day);

          });

        },500);
      });
     
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
              , mapTypeControl  : true
              , panControl    : false
              , scrollwheel   : true
              , streetViewControl : true
              , zoomControl   : true
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

      }
      
      , drawRoutePreview:function(schedule,map,day){
        var myLatlng  = {lat: -25.363, lng: 131.044};
        var obj     = window.javo_map_box_func, currDay = $("#dropdown-select-days").attr("data-place_id");

        var items     = _SaveArray(schedule);
        if (items.length < 1) {
          return; 
        };


        obj.setMarkersPreview(items,true,true,$('#map-schedule-'+day));
   
        var lengthItems  = items.length;
        var arrRequest   = [],strHtml ='';

        for (var i = 0; i < lengthItems; i++) {
          if (i < lengthItems -1) {
            obj.drawRoutePointPreview(items[i],items[i+1],day,map);
          }else{
            obj.drawRoutePointPreview(items[i],items[0],day,map);
          };
        };


      }
      , drawRoutePointPreview: function(place1,place2,index,map)
      {
        var obj     = window.javo_map_box_func;
        var color     = '#ec'+Math.floor((Math.random() * 10) + 1)+'71f'
        //Set up options color in road result
          var polylineOptionsActual = new google.maps.Polyline({
            strokeColor: color,
            strokeOpacity: 1,
            strokeWeight: 5
          });

          var directionsService = new google.maps.DirectionsService();
          var directionsDisplay;
          //remove icon start and end of result
          var rendererOptions = {
                map: map,
                suppressMarkers : true,
                polylineOptions : polylineOptionsActual
              }
          directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);

          var request = {
              origin: new google.maps.LatLng(place1.place_lat, place1.place_lng),
              destination: new google.maps.LatLng(place2.place_lat, place2.place_lng),
              travelMode: google.maps.TravelMode.DRIVING
          };

          directionsService.route(request, function(result, status) {
              if (status == google.maps.DirectionsStatus.OK) {
                  directionsDisplay.setDirections(result);
                  directionsDisplay.setPanel(document.getElementById("next-route-detail-"+place1.place_id+"-"+index));
              }
          });
      }
      
      , clear_map: function(element)
      {
        //
       element.gmap3({
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


      , getmygeoloc: function(element,fn)
      {
            element.gmap3({
              getgeoloc:{
                callback:function(latlng){
                  if(latlng ){
                    $(this).gmap3({
                        marker:{ 
                          latLng:latlng
                        },
                        map:{
                          options:{
                            zoom: 10
                          }
                        }
                      },'autofit');
                      var locationLatLng = {
                        lat: latlng.lat(),
                        lng: latlng.lng()
                      }
                      fn(locationLatLng);
                  };
                }
              }
            });
      } 



      /** GOOGLE MAP TRIGGER        */

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

      , setMarkersPreview: function( response,clear,icon, element )
      {
        var item_markers  = new Array();
        var obj       = window.javo_map_box_func;


        $.each( response, function( i, item ){
             

          if( item.place_lat != "" && item.place_lng != "" )
          {
            var k =1;
            if (i ==response.length - 1) {k =0}else{k = i +1}; 

            var icon_content ='';
            if (typeof icon !=='undefined' && icon == true) {
              icon_content= '<span class="icon-item-place-number" >'+(i+1)+'</span>';
            };

            item_markers.push( {
              //latLng    : new google.maps.LatLng( item.lat, item.lng )
              lat     : item.place_lat
              , lng   : item.place_lng
              , thumbnail : item.post_thumbnail

              , options : { icon: item.place_img , content   : icon_content +'<img src="'+item.place_img + '"  width="40" height="40" class="icon-item-place"  />'}
              , id    : "mid_" + item.place_id
              , data    : item
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

                  var map = element.gmap3( 'get' );
                  

                  $.get(
                    '/api/trip3s_place_by_id'
                    , {
                       post_id  : c.data.post_id
                    }
                    , function( response )
                    {
                      var str = '', nstr = '';

                      if( response.state == "success" )
                      {
                        
                        str = $('#javo-map-box-infobx-content').html();
                        str = str.replace( /{post_id}/g   , response.post_id );
                        str = str.replace( /{post_title}/g  , response.post_title );
                        str = str.replace( /{permalink}/g , response.permalink );
                        str = str.replace( /{thumbnail}/g , response.thumbnail );
                        str = str.replace( /{category}/g  , response.category );
                        str = str.replace( /{location}/g  , response.location );
                        str = str.replace( /{phone}/g   , response.phone || nstr );
                        str = str.replace( /{mobile}/g    , response.mobile || nstr );
                        str = str.replace( /{website}/g   , response.website || nstr );
                        str = str.replace( /{email}/g   , response.email || nstr );
                        str = str.replace( /{address}/g   , response.address || nstr );
                        str = str.replace( /{author_name}/g , response.author_name || nstr );

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
                      var hMarker   = new google.maps.Marker({
                        position  : c.main.getPosition()
                        , map   : $map
                        , icon    : ''
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

          element.gmap3( _opt , "autofit" );
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
      ,trigger_marker: function( e )
      {
        var obj = window.javo_map_box_func;
        obj.el.gmap3({
            map:{ options:{ zoom: parseInt( $("[javo-marker-trigger-zoom]").val() ) } }
          },{
          get:{
            name:"marker"
            ,   id: $( this ).data('id')
            , callback: function(m){
              google.maps.event.trigger(m, 'click');
            }
          }
        });
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
      , send_plan: function(_tripPlan){
        $.post('/api/trip3sPlan',{plan:JSON.stringify(_tripPlan)},function(data){
          _tripPlan = data.plan;
        }); 
        return _tripPlan;
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
            name    : "marker"
            , id    : marker_id
            , callback  : function(m){
              google.maps.event.trigger(m, 'click');
            }
          }
        });
      } // End Cluster Trigger


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
        var obj     = window.javo_map_box_func;
        var el_slier  = $( ".javo-geoloc-slider" );

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

window.javo_map_box_func.setInfoBubble();
  });