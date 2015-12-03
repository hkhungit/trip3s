/******************************
** javoThemes Custom Modal
** ver 1.0
******************************/
;(function($){
	"use strict";

	var javo_message_box_func = {

		init: function( attr, callback )
		{
			this.DEFAULT		= {
				content			: 'No Message'
				, delay			: 500000
				, close			: true
				, button		: "OK"
			}

			this.attr		= $.extend( true, {}, this.DEFAULT, attr );

			this.callback	= callback;
			this.button		= '<div class="text-center">';
				this.button	+= '<input type="button" id="javo-alert-box-close" class="btn btn-dark btn-sm" value="' + this.attr.button + '">'
			this.button		+= '</div>';
			this.el			= '#javo-alert-box'
			this.el_bg		= '#javo-alert-box-bg';
			this.el_button	= '#javo-alert-box-close';

			if( typeof window.javo_mbf_TimeID != "undefined" )
			{
				$( this.el_bg + ", " + this.el ).remove();
				clearInterval( window.javo_mbf_TimeID );
				window.javo_mbf_TimeID	= null;
			}

			this.open( this.attr );

			$( document ).on( 'click', this.el_button, this.close );
		}

		, open: function( attr )
		{
			var obj = javo_message_box_func;

			$( document )
				.find('body')
				.prepend( '<div id="javo-alert-box" tabindex="-1"></div><div id="javo-alert-box-bg"></div>' );

			$( this.el )
				.html( '<h5>' + attr.content + '</h5>' )
				.css({ marginLeft : -( $( this.el ).outerWidth(true) ) / 2 })
				.animate({ marginTop : -( $( this.el ).outerHeight(true) ) / 2 }, 300, function(){
					window.javo_mbf_TimeID = setInterval( obj.close, attr.delay );
				});

			if( attr.close ){
				$( this.el ).append( this.button );
			}

		}

		, close: function( e )
		{
			if( typeof e != 'undefined' ){
				e.preventDefault();
			}

			var obj = javo_message_box_func;

			if( typeof window.javo_mbf_TimeID != 'undefined')
			{
				clearInterval( window.javo_mbf_TimeID );
				obj.nTimeID == null;
			}

			$( obj.el_bg ).fadeOut('fast', function(){ $(this).remove(); });
			$( obj.el ).fadeOut('fast', function(){ $(this).remove(); });

			if( typeof obj.callback == 'function' ){
				obj.callback();
			};
		}
	};

	$.javo_msg = function( attr, callback ){
		javo_message_box_func.init( attr, callback );
	}

})(jQuery);