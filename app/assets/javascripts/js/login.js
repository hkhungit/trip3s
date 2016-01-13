				  // init the FB JS SDK 689577704510810 446637915526164
				 FB.init({
				     appId: '689577704510810', // App ID from the app dashboard
				     channelUrl: '/auth/facebook/', // Channel file for x-domain comms
				     status: true, // Check Facebook Login status
				     cookie: true,
				     xfbml: true // Look for social plugins on the page
				 });

				 (jQuery)(function($) {


				     $(document).on('click', '.signout', function(e) {
				         $.get('/signout').done(function(data) {});
				         location.reload();
				         return false;
				     });
				     $(document).on('click', '.facebook_connect', function(e) {
				         FB.getLoginStatus(function(response) {
				             if (response.status === 'connected') {

				                 LoginFb();

				             } else if (response.status === 'not_authorized') {
				                 LoginFb();

				             } else {
				                 LoginFb();
				             }
				         });
				     });

				     function updateBarLoged() {
				         var strFull = '	 <li class="right-menus javo-navi-login-button">' + '	<a href="#" class="nav-right-button dropdown-toggle" title="Login"  data-toggle="dropdown"  >' + '		<span class="glyphicon glyphicon-user"></span>' + '	</a>' + '	<ul class="dropdown-menu" role="menu">' + '		<li><a href="/users"  >Trang cá nhân</a></li> ' + '		<li><a href="/plans/new"  >Tạo mới kế hoạch</a></li> ' + '		<li><a href="/places/new"  >Thêm địa điểm</a></li> ' + '		<li><a href="/collections/new" >Thêm bộ sưu tập</a></li> ' + '		<li><a href="/signout" class="signout" >Thoát</a></li> ' + '	</ul>' + '</li> 		';
				         $('#javo-header-featured-menu').html(strFull);
				     }

				     function updateBarNotLogin() {
				         var strFull = '<li class="right-menus javo-navi-login-button">' + '<a href="#" class="nav-right-button javo-tooltip" title="Login" data-toggle="modal" data-target="#login_panel">' + '		<span class="glyphicon glyphicon-user"></span>' + '	</a>'

				         +'</li>' + '<li class="dropdown right-menus javo-navi-post-button">' + '	<a href="#" class="dropdown-toggle nav-right-button button-icon-notice" title="Write"   data-javo-hover-menu data-target="#register_panel">' + '		<span class="glyphicon glyphicon-pencil"></span>' + '	</a>' + '</li>';

				         $('#javo-header-featured-menu').html(strFull);
				     }

				     function LoginFb() {
				         $('#register_waiting_create').addClass('active_wait');
				         FB.login(function(response) {
				             var accesstoken = response.authResponse.accessToken;
				             var _url = window.location.href;
				             if (response.authResponse) {
				                 FB.api('/me?fields=name,email,picture', function(response) {

				                     var users = {
				                         id: response.id,
				                         name: response.name,
				                         email: response.email,
				                         image: response.picture.data.url,
				                         token: accesstoken
				                     }

				                     $.get('/auth/s/callback', {
				                         user: users
				                     }).done(function(data) {
				                         user = data;
				                         user.id = data.id;
				                         updateBarLoged();
				                         if ($('#login_panel').length > 0) {
				                             $('#login_panel').modal('hide');
				                             $('#register_waiting_create').removeClass('active_wait');

				                         }
				                     });

				                 });
				             } else {
				                 $('#register_waiting_create').removeClass('active_wait');
				             }
				         }, {
				             scope: 'email,user_likes,user_photos,publish_actions'
				         });
				     }
				 });