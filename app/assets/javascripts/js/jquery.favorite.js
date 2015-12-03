;( function($){

	var javo_favorite_func = {

		init: function( data, el, callback )
		{
			this.DEFAULT		= {
				url				: null
				, before		: null
				, user			: 0
				, str_nologin	: "Please login"
				, str_save		: "Save"
				, str_unsave	: "UnSave"
				, str_error		: "Server Error!"
				, str_fail		: "favorite regist fail."
				, mypage		: false
			};
			this.attr			= $.extend( true, {}, this.DEFAULT, data );
			this.callback		= callback;
			this.el				= el;

			// Events
			$( document )		.on( 'click', el, this.favorite );
		}
		, action: function( callback )
		{
			if( typeof callback == 'function' )
			{
				if( false == callback() )
				{
					return false;
				}
			}
			return;
		}

		, user_check: function( user_id )
		{
			if( parseInt( user_id ) > 0 )
			{
				return true;
			}
			$.javo_msg({ content: attr.str_nologin, delay:5000 });
			return false;
		}

		, button_block: function( el, onoff )
		{
			if( onoff )
			{
				el.addClass( 'disabled' ).prop( 'disabled', true );
			}else{
				el.removeClass( 'disabled' ).prop( 'disabled', false );
			}
		}

		, favorite: function( e ){
			e.preventDefault();

			var obj		= javo_favorite_func;
			var $this	= $( this );
			var is_save	= $this.hasClass( 'saved' ) ? null : true;
			var attr	= obj.attr;

			if( false == obj.action( attr.before ) ){ return false; };

			current_user = obj.user_check( attr.user );

			if( ! current_user || $( this ).hasClass( 'disabled' ) ){ return false; }
			obj.button_block( $( this ), true );

			$.post(
				attr.url
				, { post_id: $( this ).data('post-id'), reg: is_save, action: 'favorite' }
				, function( response )
				{
					console.log( response );
					if( response.return == 'success' )
					{
						if( $this.hasClass("saved")){

							$this.removeClass("saved");

							if( ! $this.data('no-swap') ){
								$this.text(attr.str_unsave);
							}
							$.javo_msg({ content: attr.str_unsave, delay:800, close:false});


						}else{

							$this.addClass("saved");

							if( ! $this.data('no-swap') ){
								$this.text(attr.str_save);
							}
							$.javo_msg({ content: attr.str_save, delay:800, close:false });

						}
						if( typeof obj.callback == 'function' ){
							obj.callback.call( $this );
						}
					}else{
						$.javo_msg({ content: attr.str_fail, delay:5000 });
					}
				}
				, 'json'
			)
			.fail( function( response )
			{
				console.log( "Favroite Error: " + response.responseText );
				$.javo_msg({ content: attr.str_error, delay:5000 });
			})
			.always( function()
			{
				obj.button_block( $this, false );
			});

		}
	};

	jQuery.fn.javo_favorite = function(o, p)
	{
		var el = this.selector ;
		javo_favorite_func.init( o, el, p);
	}
})(jQuery);