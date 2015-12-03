;(function($){
	jQuery('.javo-vc-row').each(function(){
		var $this = $(this);
		$this
			.css('background-attachment', 'fixed')
			.css('position', 'absolute');
		if( typeof($this.data('background') ) != 'undefined') {
			if( $this.data('background') != '' ){
				$this.css({
					'background-image':'url(' + $this.data('background') + ')'
					, 'background-size':'cover'
				});
			};
		};
		if( typeof($this.data('background-color') ) != 'undefined') {
			if( $this.data('background-color') != ''){
				$this.css('background-color', $this.data('background-color'));
			};
		};
		if( $this.data('background-type') != 'parallax') {
			$this
				.css('background-position', '0px 0px')
				.css('background-attachment', '')
		};

		if(
			typeof($this.data('box-shadow') ) != 'undefined' ||
			typeof($this.data('box-shadow-color') ) != 'undefined'
		) {
			if( $this.data('box-shadow') == 'use' ){
				$this.css('box-shadow', '0px 2px 5px '+ $this.data('box-shadow-color'));
			};
		};


		var javo_row_resize = function (){
			var w, h;
			var $hWnd = $(window);
			var content_wrap = {};
			w = $hWnd.width();
			$this
				.css('min-width', w + 'px')
				.css('width', w +'px')
				.css('top', 0)
				.css('left', -$this.closest('.vc_row-fluid').offset().left + 'px' )
				.css('min-height', $this.closest('.vc_row-fluid').outerHeight() + 'px');
			if( typeof( $this.data('target') ) != 'undefined' ){
				if(
					!(
						$( $this.data('target') ).hasClass('single-item-intro') ||
						$( $this.data('target') ).hasClass('single-item-navi')
					) && $( $this.data('target') ).hasClass('javo-single-section')
				){
					content_wrap.minHeight = $(window).height() + 'px';
					/*
					$( $this.data('target') )
						.find('.wpb_wrapper')
						.css('min-height', $(window).height() + 'px');
					*/
				};
			};
			if( $this.data('content-full-width') == "yes" ){
				content_wrap.position		= 'relative';
				content_wrap.minWidth		= w + 'px';
				content_wrap.width			= w + 'px';
				content_wrap.top			= 0;
				content_wrap.left			= -$this.closest('.vc_row-fluid').offset().left + 'px';
				$this.parent().find('.wpb_column').css('padding', 0);



				/*
				$this.parent().find('.wpb_wrapper')
					.css('position', 'relative')
					.css('min-width', w + 'px')
					.css('width', w +'px')
					.css('top', 0)
					.css('left', -$this.closest('.vc_row-fluid').offset().left + 'px');
				*/
			}
			$this.parent().find('.vc_column_container > .wpb_wrapper').css(content_wrap);
		};
		$('.wpb_row').css({ position: 'relative' });
		$('.upb_row_bg').css({
			width:'100%'
			, height:'100%'
			, height:'100%'
			, top: 0
			, bottom: 0
			, right: 0
			, left: 0
			, overflow: 'hidden'
		});
		javo_row_resize();
		jQuery(window).resize(function(){
			javo_row_resize();
		});
	});

	// Wordpress media upload button command.
	// Required: library/enqueue.php:  wp_media_enqueue();
	$("body").on("click", ".javo-fileupload", function(e){
		e.preventDefault();
		var $this = $(this);
		var file_frame;
		if(file_frame){ file_frame.open(); return; }
		file_frame = wp.media.frames.file_frame = wp.media({
			title: $this.data('title'),
			multiple: $this.data('multiple')
		});
		file_frame.on( 'select', function(){
			var attachment;
			if( $this.data('multiple') ){
				var selection = file_frame.state().get('selection');
				selection.map(function(attachment){
					var output = "";
					attachment = attachment.toJSON();
					output += "<div class='col-md-4 javo_dim_div'>";
					output += "		<div class='col-md-12' style='overflow:hidden;'><img src='" + attachment.url + "' style='height:150px;'></div>";
					output += "		<div class='row'><div class='col-md-12' align='center'>";
					output += "			<input type='hidden' name='javo_dim_detail[]' value='" + attachment.id + "'>";
					output += "			<input type='button' value='Delete' class='btn btn-danger btn-xs javo_detail_image_del'>";
					output += "		</div>";
					output += "</div>";
					$( $this.data('preview') ).append( output );
				});

			}else{
				attachment = file_frame.state().get('selection').first().toJSON();
				$( $this.data('input')).val(attachment.id);
				$( $this.data('preview') ).prop("src", attachment.url );
			};
		});
		file_frame.open();
		// Upload field reset button
	}).on('click', '.javo-fileupload-cancel', function(){
		$($(this).data('preview')).prop('src', '');
		$($(this).data('input')).prop('value', '');
	}).on("click", ".javo_detail_image_del", function(){
		var tar = $(this).data("id");
		$(this).parents(".javo_dim_div").remove();
		$("input[name^='javo_dim_detail'][value='" + tar + "']").remove();
	});
	jQuery('.javo-color-picker').each(function(i, v){
		$(this).spectrum({
			clickoutFiresChange:true
			, showInitial: true
			, preferredFormat:'hex'
			, showInput: true
			, chooseText: 'Select'
		});
	});

	var sns_con = { setTitle: "", setUrl: "",
		getLink: function(d){
			var url ="";
			switch(d){
				case "twitter":
					url = "http://twitter.com/share?url=" + this.setUrl + "&text=" + this.setTitle; break;
				case "facebook":
					url = "http://www.facebook.com/sharer.php?u=" + this.setUrl + "&t=" + this.setTitle; break;
				case "google":
					url = "https://plus.google.com/share?url=" + this.setUrl;break;
				default:
					alert("Error");
					return false;
			};
			window.open(url);
		}
	};
	$("body").on("click", "i.sns-facebook", function(){
		sns_con.setTitle = $(this).data("title");
		sns_con.setUrl = $(this).data("url");
		sns_con.getLink("facebook");
	});
	$("body").on("click", "i.sns-twitter", function(){
		sns_con.setTitle = $(this).data("title");
		sns_con.setUrl = $(this).data("url");
		sns_con.getLink("twitter");
	});
	$("body").on("click", "i.sns-google", function(){
		sns_con.setTitle = $(this).data("title");
		sns_con.setUrl = $(this).data("url");
		sns_con.getLink("google");
	});
	$('.javo-tooltip').each(function(i, e){
		var options = {};
		if( typeof( $(this).data('direction') ) != 'undefined' ){
			options.placement = $(this).data('direction');
		};
		$(this).tooltip(options);
	});

	$(window).scroll(function () {
		if ($(this).scrollTop() > 50) {
			$('#back-to-top').fadeIn();
		} else {
			$('#back-to-top').fadeOut();
		}
		});
		// scroll body to 0px on click
		$('#back-to-top').click(function () {
			$('#back-to-top').tooltip('hide');
			$('body,html').animate({
			scrollTop: 0
		}, 800);
		return false;
	});


	$(window).load(function(){
		$(this).trigger('resize');
	});
})(jQuery);