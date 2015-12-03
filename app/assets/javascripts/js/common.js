/*
This is common js
*/

;( function($){

	var javo_common_func = {

		init: function()
		{
			this
				.init_pace()
				.init_canvas()
				.init_align_gridList()
		}

		, init_pace: function()
		{
			// pace	loading

			window.paceOptions = {
				ajax				: false
				, document			: true
				, eventLag			: false
			}

			Pace.on("start", function(){
				$("div.loading-page").show();
			});
			Pace.on("done",	function(){
				$('div.loading-page').fadeOut('slow');
			});

			return this;
		}

		, init_canvas: function()
		{
			/* my page canvas for bootstrap	*/
			$( document )
				.on('click', '[data-toggle="mypage-offcanvas"]', function( e ){
					e.preventDefault();
					$('.row-offcanvas').toggleClass('active');
				});
			return this;
		}

		,init_align_gridList: function()
		{
			/* grid	/ list listing */
			$( document )
				.on( 'click', '#list', function( e ){
					e.preventDefault();
					$('#products .item').addClass('list-group-item');
				})
				.on( 'click', '#grid', function( e ){
					e.preventDefault();
					$('#products .item').removeClass('list-group-item');
					$('#products .item').addClass('grid-group-item');
				});
			return this;
		}
	};

	javo_common_func.init();


})(jQuery);




/* full	read mode */
(function($){
	$('body').on('click', '.toggle-full-mode', function(){
		$('body').toggleClass('content-full-mode');
	});

})(jQuery);


/* single spy */
jQuery(document).ready(function	($)	{
	$(window).bind('scroll',function(e){
	  dotnavigation();
	});

	function dotnavigation(){

		var	numSections	= $('.javo-single-this-nav-item').length;
		$('.javo-single-this-nav-item').each(function(i,item){

			var	ele	= $(item), nextTop;
			if (typeof ele.next().offset() != "undefined") {
			nextTop	= ele.next().offset().top;
			} else {
				nextTop	= $(document).height();
			}

			if (ele.offset() !== null) {
				thisTop	= ele.offset().top - ((nextTop - ele.offset().top) / numSections);
			} else {
				thisTop	= 0;
			}

			var	docTop = $(document).scrollTop();

			if(docTop >	thisTop	&& (docTop < nextTop)){
				$('#dot-nav	li a').removeClass('active').parent('li').removeClass('active');
				$('#dot-nav	li').eq(i).addClass('active');
			}
		});
	}

	/* get clicks working */
	$('#dot-nav	li').click(function(){

		var	id = $(this).find('a').attr("href")
			, posi
			, ele
			, padding =	0
			, bonusOffy	= 1;

		// if Div Element Exists then, results summary
		bonusOffy += $("#wpadminbar").outerHeight(true)	-4;
		if(	$('.javo-single-top-navigation').hasClass('affix') ){
			bonusOffy += $(".javo-single-top-navigation").outerHeight();
		};
		padding	= bonusOffy;
		ele	= $(id);
		posi = ($(ele).offset()||0).top	- padding;

		$('html, body').animate({scrollTop:posi}, 'slow');

		return false;
	});

/* end dot nav */
});

jQuery(function($){
	if(	typeof(	jQuery.fn.affix	) != "undefined" && !$("body").hasClass("no-sticky") ){
		jQuery.fn.affix.Constructor.prototype.checkPosition	= function ()
		{
			if (!this.$element.is(':visible')) return;

			this.$window	= $(window);

			var	scrollHeight = $(document).height();
			var	scrollTop	 = this.$window.scrollTop();
			var	position	 = this.$element.offset();
			var	offset		 = this.options.offset;
			var	offsetTop	 = offset.top;
			var	offsetBottom = offset.bottom;
			if(scrollTop==378)
			{
			this.$window.scrollTop('463');
			scrollTop==463;
			}
			if (typeof offset != 'object')		   offsetBottom	= offsetTop	= offset;
			if (typeof offsetTop ==	'function')	   offsetTop	= offset.top();
			if (typeof offsetBottom	== 'function') offsetBottom	= offset.bottom();

			var	affix =	this.unpin	 !=	null &&	(scrollTop + this.unpin	<= position.top) ? false :
						offsetBottom !=	null &&	(position.top +	this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' :
						offsetTop	 !=	null &&	(scrollTop <= offsetTop) ? 'top' : false;

			if(scrollTop > offsetTop) {$('#content').css('margin-top','83px'); }
			else{$('#content').css('margin-top','0');}
			if (this.affixed === affix)	return;

			if (this.unpin)	this.$element.css('top', '');

			this.affixed = affix;
			this.unpin	 = affix ==	'bottom' ? position.top	- scrollTop	: null;

			this.$element.removeClass('affix affix-top affix-bottom').addClass('affix' + (affix	? '-' +	affix :	''));

			if (affix == 'bottom') {
			  this.$element.offset({ top: document.body.offsetHeight - offsetBottom	- this.$element.height() });
			}
		}
	};
	if(	typeof(jQuery.fn.affix)	!= 'undefined' && !$("body").hasClass("no-sticky") ){

		// If Exists jQuery	Fucntion affix
		$('.navbar').each( function(i, v){
			var	offY = 0;
			if(	$(this).hasClass('javo-single-top-navigation') ){
				$(this).affix({	offset:{ top: $(window).height() - 50 }	});
			}else if( $(this).hasClass('javo-main-navbar') && !$('body').hasClass('javo-item-one-page')	){
				$(this).affix({	offset:{ top: 200 }	});
			};
		});

	};
});

jQuery(document).ready(function($){

	var	$submenu = $(".navbar");
	// To account for the affixed submenu being	pulled out of the content flow.

	$submenu.after('<div style="width:100%;height:'	+ $submenu.height()	+ ';" class="navbar	affix-placeholder"></div>');
});



jQuery(function($){

	var	javo_single_top_nav	= {
		offset:0
		, init:function(){
			this.offset	+= $("#wpadminbar").outerHeight(true);
			this.offset	+= $(".javo-single-top-navigation").outerHeight(true);
			$(window).on('scroll', this.scroll);
			$(document).on('click',	'.javo-single-nav li a', {a:'b'}, this.click);
		}
		, scroll:function(){
			var	$scrTop	= $(window).scrollTop();
			$('.javo-single-nav	li a').each(function(i,	k){
				var	$this =	$(this);
				var	$tar = $( $this.attr('href') );

				if(
					$scrTop	>= ( $tar.offset().top - javo_single_top_nav.offset	) &&
					$scrTop	< (	$tar.offset().top +	$tar.outerHeight(true) - javo_single_top_nav.offset	 )
				){

					$this
						.closest('ul')
						.find('li')
						.removeClass('active');
					$this
						.parent('li')
						.addClass('active');
				}
			});


		}
		, click:function(e){
			e.preventDefault();
			var	$this =	$(this);
			var	$tar = $( $this.attr('href') );
			$('html, body').animate({
				scrollTop: ( $tar.offset().top - javo_single_top_nav.offset	+ 4	)  + 'px'
			}, 500);
		}
	};
	javo_single_top_nav.init();


		window.javo_single_effect =	{
		winOffy: $(window).scrollTop()
		, bonus: $('#wpadminbar').outerHeight( true	) +	$('#javo-navibar').outerHeight(	true )
		,
		init:function(){
			$(window).on('scroll', this.scroll);
		}
		,
		scroll:	function(){
			var	$object	= window.javo_single_effect;
			$object.winOffy	= $(this).scrollTop();

			$('.javo-animation').each(function(k, v){

				if(	$(this).hasClass('single-item-intro') ){ return; };

				if(	$(this).offset().top < $object.winOffy + $(window).height()	 ){
					$(this).addClass('loaded');
				}
			});
		}
	};
	javo_single_effect.init();

	$("body").on("click", function(e){
		var	t =	$(e.target);
		$(".sel-content").hide();
		$(".sel-arraow").removeClass("active");
		if(t.hasClass("sel-arraow")){
			t.addClass("active");
			t.parents(".sel-box").find(".sel-content").show();
		};
	});
	$(".sel-content")
		.find("li")
		.on("click", function(){
			$(this)
				.parents(".sel-content")
				.hide()
				.parents(".sel-box")
				.find("input[type='text']")
					.val($(this).text())
				.next()
					.val($(this).val());
	});

	// Contact Us
	$('body').on('mouseup',	function(e){
		var	$this =	$(this);

		if(	$(e.target).closest('.javo-quick-contact-us-content').length ==	0 ){
			$('.javo-quick-contact-us-content').removeClass('active');
		};

		$this.on('click', '.javo-quick-contact-us',	function(){
			$('.javo-quick-contact-us-content').addClass('active');
			$('.javo-quick-contact-us-content').css({
				top: $(this).position().top	- $('.javo-quick-contact-us-content').outerHeight(true)
			});
		});
	});
});

	// javo scrollspy icon
jQuery( function($){
	 $(".javo-spyscroll-icon a").on('click', function(e) {
       // prevent default anchor click behavior
       e.preventDefault();

       // animate
       $('html, body').animate({
           scrollTop: $(this.hash).offset().top
         }, 700, function(){

           // when done, add hash to url
           // (default click behaviour)
           window.location.hash = this.hash;
         });

    });
});

////////////////////////////////////////////////////////////////////////////////
// login via google
////////////////////////////////////////////////////////////////////////////////

function login_via_google_oauth()
{
	"use strict";
	var ajaxurl, login_type;

	jQuery.ajax({
		type: 'POST'
		, url: document.ajaxurl
		, data:{ 'action': 'javo_ajax_google_login_oauth' }
		, success: function (data) {
			window.location.href = data;
		}
		, error: function (errorThrown) {}
	});//end ajax
}

jQuery(document).ready( function($) {
	"use strict";
	$('#googlelogin').click(
		function() {
			login_via_google_oauth();
		}
	);
});