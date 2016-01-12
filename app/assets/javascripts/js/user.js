jQuery(function($){
		$(document).on('click','.remove-friend',function(e){ 
			if (user.id ==0) {
				$('.alert-bottom ').html('Bạn cần đăng nhập để thực hiện chức năng');
				setTimeout(function(){ $('.alert-bottom ').html('') }, 3000);
				$('#login_panel').modal();
				return false;
			}else{ 
				var userID 		= $(this).data('userid'); 
				var element = $(this);
				$.post('/api/friends',{actions: 'remove', userID:userID}).done(function(data){
			 
					if (data.status == true) {
						element.removeClass("btn-danger");
						element.removeClass("remove-friend");
						element.addClass("add-friend");
						element.addClass("btn-info");
						element.text("Thêm bạn");
					};
				});	
			}
		});

		$(document).on('click','.add-friend',function(e){ 
			if (user.id ==0) {
				$('.alert-bottom ').html('Bạn cần đăng nhập để thực hiện chức năng');
				setTimeout(function(){ $('.alert-bottom ').html('') }, 3000);
				$('#login_panel').modal();
				return false;
			}else{ 
				var userID 		= $(this).data('userid'); 
				var element = $(this);
				$.post('/api/friends',{actions: 'add', userID:userID}).done(function(data){
			 
					if (data.status == true) {
						element.addClass("btn-danger");
						element.addClass("remove-friend");
						element.removeClass("add-friend");
						element.text("Hủy bạn");
					};
				});	
			}
		});

	});