jQuery(function($){
		$(document).on('click','.remove-friend',function(e){
			var userID 		= $(this).data('userid');
			$.post('/api/friends',{actions: 'remove', userID:userID},function(data){ });
		});

		$(document).on('click','.add-friend',function(e){ 
			if (user.id ==0) {
				$('.alert-bottom ').html('Bạn cần đăng nhập để thực hiện chức năng');
				setTimeout(function(){ $('.alert-bottom ').html('') }, 3000);
				$('#login_panel').modal();
				return false;
			}else{

				var userID 		= $(this).data('userid');
				console.log(userID);
				$.post('/api/friends',{actions: 'add', userID:userID}).done(function(data){
					console.log(data);
					if (data.status == true) {
						$(this).remove();
					};
				});	
			}
		});

	});