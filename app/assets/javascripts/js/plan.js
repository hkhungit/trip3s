jQuery(function($) {
    "use strict";
    $(document).on('click', '.btn-comment', function() {
        if (user.id < 1) {
            $('#login_panel').modal();
            return false;
        };

        $('#form-comment-new').ajaxSubmit({
            beforeSubmit: function(a, f, o) {
                o.dataType = 'json';
            },
            complete: function(data) {
                var countComment = $('#box_comment .panel-heading h2.panel-title').attr('data-count');
                countComment = parseInt(countComment);
                if (countComment < 1) {
                    $('.list-comments').html('');
                };
                data = data.responseJSON;
                if (data.status == true) {
                    var textComment = '<li>'; + '<div class="item-comment row">';
                    textComment += '<p class="item-img col-md-12">';
                    textComment += '<a href="' + data.comment.comment_author_url + '">' + data.comment.comment_author + '</a>';
                    textComment += '</p>' + '<p class="item-content  col-md-12">';
                    textComment += data.comment.comment_content + '</p>' + ' </div>' + '</li>';
                    $('.list-comments').prepend(textComment);

                    countComment++;
                };
                $('#box_comment .panel-heading h2').attr('data-count', countComment);
                $('#box_comment .panel-heading h2.panel-title').text(countComment + " Bình luận");
            }
        });
    })
    $(document).on('click', '.btn-vote', function() {
        var idPost = $(this).data('object');
        var valueObject = $(this).data('value');
        var idUSer = user.id;
        if (idUSer < 1) {
            $('#login_panel').modal();
            return;
        };
        var textVote = idUSer + "_vote",
            data = {
                idPost: idPost,
                textVote: textVote,
                value: valueObject
            }
        $.post('/api/vote', data).done(function(data) {
            if (data.status == true) {
                update_vote(idPost);
            };
        })
    });

    function update_vote(id) {
        var data = {
            idPost: id
        }
        $.get('/api/showVote', data).done(function(data) {
            if (data.status == true) {
                $('.liked-count').text(data.liked);
                $('.disliked-count').text(data.disliked);
            };
        })
    }
});