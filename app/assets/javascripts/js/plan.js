jQuery( function( $ ){
	"use strict";
	$(document).on('click','.btn-vote',function(){
		var idPost 	= $(this).data('object');
		var valueObject = $(this).data('value');
		var idUSer 		= user.id;
		if (idUSer < 1) {
			$('#login_panel').modal();
			return;
		};
		var textVote = idUSer + "_vote",
		data = {
			idPost:idPost,
			textVote:textVote,
			value:valueObject
		}
		$.post('/api/vote',data).done(function(data){ 
			if (data.status == true) {
				update_vote(idPost);
			};
		})
	});
	function update_vote(id){
		var data = {
			idPost: id 
		}
		$.get('/api/showVote',data).done(function(data){ 
			if (data.status == true) {
				 $('.liked-count').text(data.liked);
				 $('.disliked-count').text(data.disliked);
			};
		})
	}	
});