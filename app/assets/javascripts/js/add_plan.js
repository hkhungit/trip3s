var tripPlan = {

    tripName: 'Du lịch trip3s',
    dayNumber: 2,
    userNumber: 1,
    planStart: null,
    moneyNumber: 1,
    placeBegin: null,
    planEnd: null,
    planEnd: null,
    placeBegin: null,
    placeEnd: null,
    planStart: null,
    placeIds: [],
    placeLists: [],
    placeNotSchedule: [],
    schedules: []
};

function decrypt_time(time) {
    var dece = Math.floor(time);
    return dece + ":" + Math.ceil((time % dece) * 60);
}

function encrypt_time(time) {
    if (typeof time === 'undefined') return 0;
    try {
        time = time.split(":");
    } catch (e) {
        //console.log(time);
    }
    time[0] = (typeof time[0] == 'undefined') ? 0 : time[0];
    time[1] = (typeof time[1] == 'undefined') ? 0 : time[1];
    return parseFloat(time[0]) + (parseFloat(time[1]) / 60);
}
jQuery(function($) {
    "use strict";
    var items;

    //Restone tripPlan from session
    $.getJSON('/api/trip3sPlan')
        .done(function(data) {
            tripPlan = data.plan;
            var obj = window.javo_map_box_func;
            obj.ajax_favorite(tripPlan.placeLists, 2);
            if (typeof tripPlan.schedules["Day_1"] !== 'undefined') {
                if (tripPlan.schedules["Day_1"].placeLists.length > 0) {
                    update_time_comings(tripPlan.schedules, 7.5);
                    update_sidebar_plan(tripPlan, 1);
                    $('.btn-box-plan').trigger('click');
                };
            }
            obj.resize();
            $("ul#schedule-day-boby").sortable({
                update: function(event, ui) {
                    $('ul#schedule-day-boby li').each(function(e) {
                        var place = $(this).data('place');
                        $(this).find('.number').text(e + 1);
                        tripPlan.placeIds[e] = place.id;
                        tripPlan.placeLists[e] = place;
                    });
                }
            });
        });
    $('select[name^="plan[plan_city"]').chosen({
        width: '100%',
        search_contains: 1,
        no_results_text: "Chọn 1 tỉnh thành đến"
    });
    $('select[name^="plan[plan_cate"]').chosen({
        width: '100%',
        search_contains: 1,
        no_results_text: "Chọn 1 danh mục"
    });

    function removeDuplicate(arr) {
        var resultsaa = [],
            arrbk = [];
        for (var i = 0; i < arr.length; i++) {
            if (typeof arr[i] !== 'undefined') {
                if (resultsaa.indexOf(arr[i].place_id) < 0) {
                    resultsaa.push(arr[i].place_id);
                    arrbk.push(arr[i]);
                }
            };
        }
        return arrbk;
    }

    function showSave(display) {
        if (typeof display == 'undefined') {
            display == false
        };
        if (display) {
            $('.manage-btn').fadeIn()
        } else {
            $('.manage-btn').fadeOut();
        };

    }

    function removeDuplicate2(arr) {
        var resultsaa = [],
            arrbk = [];
        for (var i = 0; i < arr.length; i++) {
            if (resultsaa.indexOf(arr[i].place_id) < 0) {
                resultsaa.push(arr[i].place_id);
                arrbk.push(arr[i]);
            }
        }
        return {
            placeLists: arrbk,
            placeIds: resultsaa
        };
    }

    $(document).on('change', '.btn-file :file', function() {
        $('#upload_form').ajaxSubmit({
            beforeSubmit: function(a, f, o) {
                o.dataType = 'json';
            },
            complete: function(data) {
                data = data.responseJSON;
                if (data.status == true) {
                    $('.uploadimg-responsive').attr('src', data.image.image_url.url)
                    $('#file-upload-to-responsive').val(data.image.image_url.url);
                    $('#file-upload-to-responsive-id').val(data.image.id);
                };
            }
        });
    });


    /*Add the place to places in plan*/
    $(document).on('keypress', '#tripPlan-dayNumbers', function() {
        if ($('.setting-day').is(":visible")) {
            $('.setting-day').slideUp();
        };
    })
    /*Add the place to places in plan*/
    $(document).on('click', '[btn-add-place-plan]', function() {
        try {
            var itemSelected = $(this).parent().parent().parent().data('place');

            if (tripPlan.placeIds.indexOf(itemSelected.place_id) == -1) {
                tripPlan.placeIds.push(itemSelected.place_id);
                itemSelected.place_note = '';
                itemSelected.place_time1 = itemSelected.place_time;
                tripPlan.placeLists.push(itemSelected);
            };
            var antVectors = tripPlan.vectorDistances,
                _places = merge_places(tripPlan);

            tripPlan.vectorDistances = getArrayDistances({
                placeLists: _saveArray(_places),
                placeBegin: tripPlan.placeBegin,
                placeEnd: tripPlan.placeEnd
            }, antVectors);


            $.post('/api/trip3sPlan', {
                plan: JSON.stringify(tripPlan)
            }, function(data) {
                reload_plan();
            });


            $("ul#schedule-day-boby").sortable({
                update: function(event, ui) {
                    $('ul#schedule-day-boby li').each(function(e) {
                        var place = $(this).data('place');
                        $(this).find('.number').text(e + 1);
                        tripPlan.placeIds[e] = place.id;
                        tripPlan.placeLists[e] = place;
                    });
                }
            });

        } catch (e) {

        }

        $(this).parent().parent().parent().parent().remove();
    });
    /*Add event when set a place number 1 of a day in schedule */
    $(document).on('click', '.select-home', function() {
        var itemSelected = $(this).parent().parent().data('place');
        var indexPlace = tripPlan.placeIds.indexOf(itemSelected.place_id);
        if (typeof tripPlan.placeBegin == 'undefined' || tripPlan.placeBegin == "") {
            tripPlan.placeIds.splice(indexPlace, 1);
            tripPlan.placeLists.splice(indexPlace, 1);
            tripPlan.placeEnd = tripPlan.placeBegin = itemSelected;
        } else {
            var temp = tripPlan.placeBegin;
            if (temp.place_id == tripPlan.placeEnd.place_id) {
                tripPlan.placeEnd = itemSelected;
            };
            tripPlan.placeBegin = itemSelected;
            tripPlan.placeIds[indexPlace] = temp.place_id;
            tripPlan.placeLists[indexPlace] = temp;
        };

        $.post('/api/trip3sPlan', {
            plan: JSON.stringify(tripPlan)
        }, function(data) {
            console.log(data);
        });

        var obj = window.javo_map_box_func;
        obj.ajax_favorite(tripPlan.placeLists, 2);
        obj.resize();
        $("ul#schedule-day-boby").sortable({
            update: function(event, ui) {
                $('ul#schedule-day-boby li').each(function(e) {
                    var place = $(this).data('place');
                    $(this).find('.number').text(e + 1);
                    tripPlan.placeIds[e] = place.id;
                    tripPlan.placeLists[e] = place;
                });
            }
        });
    });

    $(document).on('click', '#add-day-to-plan', function() {
        $.post('/api/add_day', {
            add_day: true
        }, function(data) {
            if (data.dayNumber != 0) {
                tripPlan.dayNumber = data.dayNumber;
                console.log(tripPlan);
                console.log("Added a day to plan");
            };

        });
        console.log("Added a day to plan 1");
        update_list_day();
    });
    $(document).on('click', '#back-to-plan', function() {

        var obj = window.javo_map_box_func;
        obj.ajax_favorite(tripPlan.placeLists, 2);
        obj.resize();
        $("ul#schedule-day-boby").sortable({
            update: function(event, ui) {
                $('ul#schedule-day-boby li').each(function(e) {
                    var place = $(this).data('place');
                    $(this).find('.number').text(e + 1);
                    tripPlan.placeIds[e] = place.id;
                    tripPlan.placeLists[e] = place;
                });
            }
        });
    });
    $(document).on('click', '#back-to-day', function() {
        $('.javo_mhome_sidebar').removeClass('all_day');
        var strHtml = $('#load-schedule-day-header-control-2').html(),
            current_day = 1;

        update_sidebar_header_control({
            currDay: current_day,
            indexControl: 2,
            numDay: tripPlan.dayNumber
        });

        $('#dropdown-select-days').html('Ngày ' + current_day + ' <span class="caret"></span>');
        $('#dropdown-select-days').attr("data-place_id", current_day);
        update_sidebar_boby(tripPlan, parseInt(current_day));

        var obj = window.javo_map_box_func;
        obj.resize();

        update_list_day(tripPlan.dayNumber);
    });
    $(document).on('click', '#all-to-plan', function() {
        var obj = window.javo_map_box_func;
        var html_header = $('#load-schedule-day-header-control-3').html();
        $('#sidebar-plans .schedule-day-header-control').html(html_header);
        if ($('.javo_mhome_sidebar').hasClass('all_day')) {
            $(this).text("Tất cả");
        } else {
            $(this).text("Thu lại");
            var _width = $('.schedule-day-boby-detail:first-child').outerWidth() + 5;
            if (typeof tripPlan.schedules["Day_Not"] == 'undefined') {
                _width = _width * (tripPlan.schedules.length);
            } else if (tripPlan.schedules["Day_Not"].placeLists.length > 0) {
                _width = _width * (tripPlan.schedules.length + 1);
            } else {
                _width = (_width * tripPlan.schedules.length);
            };
            $('.full-detail ').css('width', _width);

        }
        obj.resize();

        $('.javo_mhome_sidebar').toggleClass('all_day');
        update_list_day();
    });

    function enable_sortable(_class, class2) {
        //"ul.schedule-day-boby"
        $(_class + "," + class2).sortable({
            connectWith: _class + "," + class2,
            start: function(event, ui) {
                if (ui.item == 0) {
                    alert("Bạn không thể di chuyển nơi xuất phát");
                };
            },
            update: function(event, ui) {
                for (var i = 0; i <= tripPlan.dayNumber; i++) {
                    if (typeof tripPlan.schedules["Day_" + (i + 1)] != 'undefined') {
                        tripPlan.schedules["Day_" + (i + 1)].placeLists = [];
                        tripPlan.schedules["Day_" + (i + 1)].placeIds = [];
                        $('ul#schedule-day-boby-' + (i + 1) + ' li').each(function(e) {
                            var place = $(this).data('place');
                            tripPlan.schedules["Day_" + (i + 1)].placeLists.push(place);
                            tripPlan.schedules["Day_" + (i + 1)].placeIds.push(place.place_id);
                        });
                        update_sidebar_header_bar(tripPlan.schedules["Day_" + (i + 1)], (i + 1));
                    };
                };

                tripPlan.schedules["Day_Not"] = {
                    placeIds: [],
                    placeLists: []
                };
                $('ul.schedule-day-boby-bk li').each(function(e) {
                    var place = $(this).data('place');
                    tripPlan.schedules["Day_Not"].placeLists.push(place);
                });
                var choice = $('#dropdown-select-days').data('place_id');
                update_sidebar_boby(tripPlan, choice);

                $.post('/api/trip3sPlan', {
                    plan: JSON.stringify(tripPlan)
                }, function(data) {});
                var obj = window.javo_map_box_func;
                obj.resize();
            }
        });
    }


    function update_duration(schedule) {
        if (typeof schedule === 'object') {
            var _schPlaces = schedule.placeLists;
            var _duration = schedule.timeStart,
                _distance = 0,
                _money = 0;
            schedule.placeBegin.next_time = parseFloat(tripPlan.vectorDistances["T" + schedule.placeBegin.place_id.toString()]["T" + _schPlaces[0].place_id.toString()].duration);
            schedule.placeBegin.next_distance = parseFloat(tripPlan.vectorDistances["T" + schedule.placeBegin.place_id.toString()]["T" + _schPlaces[0].place_id.toString()].distance);


            _duration += schedule.placeBegin.next_time;
            _distance += schedule.placeBegin.next_distance;

            for (var i = 0; i < _schPlaces.length - 1; i++) {
                _schPlaces[i].next_time = parseFloat(tripPlan.vectorDistances["T" + _schPlaces[i].place_id.toString()]["T" + _schPlaces[i + 1].place_id.toString()].duration);
                _schPlaces[i].next_distance = parseFloat(tripPlan.vectorDistances["T" + _schPlaces[i].place_id.toString()]["T" + _schPlaces[i + 1].place_id.toString()].distance);

                _duration += _schPlaces[i].next_time + parseFloat(_schPlaces[i].place_time);
                _distance += _schPlaces[i].next_distance;
                _money += 0;
            };
            schedule.placeEnd.next_time = parseFloat(tripPlan.vectorDistances["T" + _schPlaces[_schPlaces.length - 1].place_id.toString()]["T" + schedule.placeEnd.place_id.toString()].duration);
            schedule.placeEnd.next_distance = parseFloat(tripPlan.vectorDistances["T" + _schPlaces[_schPlaces.length - 1].place_id.toString()]["T" + schedule.placeEnd.place_id.toString()].distance);

            _duration += schedule.placeEnd.next_time + parseFloat(_schPlaces[_schPlaces.length - 1].place_time);
            _distance += schedule.placeEnd.next_distance;

            schedule.duration = _duration;
            schedule.distance = _distance;
            schedule.money = _money;
        };
        return schedule;
    }

    function reload_plan() {
        $('.review_plans').css('height', '0');
        $.get('/api/get_plan', function(data) {
            if (data.plans.length > 0) {
                var strFull = '';
                $.each(data.plans, function(index, value) {
                    var strLi = $('#load-plans-match-places').html();
                    strLi = strLi.replace(/{{plan_id}}/g, value.id || '0');
                    strLi = strLi.replace(/{{plan_day}}/g, value.plan_day || '');
                    strLi = strLi.replace(/{{plan_user}}/g, value.plan_spend || '');
                    strLi = strLi.replace(/{{plan_money}}/g, value.plan_money || '');
                    strLi = strLi.replace(/{{plan_thumbnail}}/g, value.plan_thumbnail || '');
                    strLi = strLi.replace(/{{plan_title}}/g, value.plan_title || '');
                    strFull += strLi;
                });

                $('.review_plans').css('height', '100px');
                $('ul.plans-list').html(strFull);
            };
        });
        var obj = window.javo_map_box_func;
        obj.ajax_favorite(tripPlan.placeLists, 2);
        obj.resize();
    }

    function update_list_day(day_number) {
        var strFull = '';
        if (typeof day_number === 'undefined') {
            day_number = tripPlan.dayNumber;
        };
        for (var i = 1; i <= day_number; i++) {
            var str = '';
            str = $('#trip3s-list-day').html();
            str = str.replace(/{{data_day}}/g, i);
            strFull += str;
        };
        $('ul#list-day').html(strFull);

        console.log("Updates day lists");
        //update_selected();
    }
    jQuery.fn.slideLeftHide = function(speed, callback, options) {
        var defaults = {
            width: "0",
            paddingLeft: "0",
            paddingRight: "0",
            marginLeft: "0",
            marginRight: "0"
        }
        defaults = jQuery.extend(defaults, options);
        this.animate({
            width: defaults.width,
            paddingLeft: defaults.paddingLeft,
            paddingRight: defaults.paddingRight,
            marginLeft: defaults.marginLeft,
            marginRight: defaults.marginRight
        }, speed, callback);
    }

    jQuery.fn.slideLeftShow = function(speed, callback, options) {
        var defaults = {
            width: "50%",
            paddingLeft: "0",
            paddingRight: "0",
            marginLeft: "0",
            marginRight: "0"
        };
        defaults = jQuery.extend(defaults, options);
        this.animate({
            width: defaults.width,
            paddingLeft: defaults.paddingLeft,
            paddingRight: defaults.paddingRight,
            marginLeft: defaults.marginLeft,
            marginRight: defaults.marginRight
        }, speed, callback);
    }
    $(document).on('click', '[place_note]', function(e) {
        $('.place_note_value').toggle();
    });
    $(document).on('click', '.btn-box-description', function(e) {
        $('.javo_mhome_sidebar_wrap').fadeOut();
        $('#sidebar-desciption').toggle();
    });
    $(document).on('click', '.update-place-time', function(e) {
        var modal = $(this).parent().parent();

        var place_time = modal.find('.place_time_update').val();
        var place_note = modal.find('.description-note').val();
        modal.find('.place_time_updated').html(place_time);

        var place_id = $(this).data('place_id');
        var schedule_id = $(this).data('schedule_id');
        var data = $('.place-num-' + place_id).data('place');
        data.place_time = place_time;
        data.place_note = place_note;
        $('.place_note_value').attr('data-value', place_note).text(place_note);
        $('.place-num-' + place_id).attr('data-place', JSON.stringify(data));
        //$('.place-num-'+place_id).find('.place_time').attr('data-value',place_time).text(place_time);
        $('.place-num-' + place_id).find('.place_time').attr('data-value', place_time).text(place_time);


        console.log(schedule_id);
        if (schedule_id == '{{schedule_id}}' || schedule_id == undefined || schedule_id == 'undefined') {
            console.log("sdsdsd");
            for (var i = 0; i < tripPlan.placeLists.length; i++) {
                if (tripPlan.placeLists[i].place_id == place_id) {
                    tripPlan.placeLists[i].place_time = place_time;
                    tripPlan.placeLists[i].place_time1 = place_time;
                    tripPlan.placeLists[i].place_note = place_note;

                    $.post('/api/trip3sPlan', {
                        plan: JSON.stringify(tripPlan)
                    }, function(data) {
                        console.log("updated !!");
                    });
                };
            };
        } else {
            if (!isNaN(schedule_id)) {

                for (var i = 0; i < tripPlan.schedules["Day_" + schedule_id].placeLists.length; i++) {
                    if (tripPlan.schedules["Day_" + schedule_id].placeLists[i].place_id == place_id) {
                        tripPlan.schedules["Day_" + schedule_id].placeLists[i].place_time = place_time;
                        tripPlan.schedules["Day_" + schedule_id].placeLists[i].place_time1 = place_time;
                        tripPlan.schedules["Day_" + schedule_id].placeLists[i].place_note = place_note;

                    };
                };

                update_sidebar_boby(tripPlan, parseInt(schedule_id));

                tripPlan.schedules["Day_" + schedule_id] = updatePlaceCome(tripPlan.schedules["Day_" + schedule_id]);

                console.log(tripPlan.schedules["Day_" + schedule_id]);
                $.post('/api/trip3sPlan', {
                    plan: JSON.stringify(tripPlan)
                }, function(data) {
                    console.log("updated !!");
                });

            };
        };


    });

    $(document).on('click', '.edit-item-place', function(e) {
        console.log("df");

        var strFull = $('#load-model-edit-place').html();
        var data = $(this).parent().parent().data('place'),
            schedule_id = $(this).parent().parent().parent().data('index');
        strFull = strFull.replace(/{{schedule_id}}/g, schedule_id);
        strFull = strFull.replace(/{{place_id}}/g, data.place_id || '');
        strFull = strFull.replace(/{{place_name}}/g, data.post_title || '');
        strFull = strFull.replace(/{{place_expert}}/g, data.post_content || '');
        strFull = strFull.replace(/{{place_address}}/g, data.location || '');
        strFull = strFull.replace(/{{place_open}}/g, data.place_open || '');
        strFull = strFull.replace(/{{place_close}}/g, data.place_close || '');
        strFull = strFull.replace(/{{place_min}}/g, data.place_min || '');
        strFull = strFull.replace(/{{place_max}}/g, data.place_max || '');
        strFull = strFull.replace(/{{place_category}}/g, data.category || '');
        strFull = strFull.replace(/{{place_time}}/g, data.place_time || '');
        strFull = strFull.replace(/{{post_view}}/g, data.post_view || '');
        strFull = strFull.replace(/{{post_rating}}/g, data.post_rating || '');
        strFull = strFull.replace(/{{place_note}}/g, data.place_note || '');


        $('#place_detail_panel').html(strFull).modal();
        //return false;
    });
    $(document).on('click', '.three-inner-detail', function(e) {
        var strFull = $('#load-model-detail-place').html();
        var data = $(this).parent().parent().parent().data('place');
        strFull = strFull.replace(/{{place_id}}/g, data.place_id || '');
        strFull = strFull.replace(/{{place_name}}/g, data.post_title || '');
        strFull = strFull.replace(/{{place_expert}}/g, data.post_content || '');
        strFull = strFull.replace(/{{place_address}}/g, data.location || '');
        strFull = strFull.replace(/{{place_open}}/g, data.place_open || '');
        strFull = strFull.replace(/{{place_close}}/g, data.place_close || '');
        strFull = strFull.replace(/{{place_min}}/g, data.place_min || '');
        strFull = strFull.replace(/{{place_max}}/g, data.place_max || '');
        strFull = strFull.replace(/{{place_category}}/g, data.category || '');
        strFull = strFull.replace(/{{place_time}}/g, data.place_time || '');
        strFull = strFull.replace(/{{post_view}}/g, data.post_view || '');
        strFull = strFull.replace(/{{post_rating}}/g, data.post_rating || '');

        $('#place_detail_panel').html(strFull).modal();
        return false;
    });
    $(document).on('click', '.btn-box-filter', function(e) {
        //$('.javo_mhome_sidebar_wrap').fadeOut();
        if ($('.javo_mhome_map_lists').is(":visible")) {
            $('.javo_mhome_map_lists').slideLeftHide(1000);
            $('div.javo_mhome_wrap .javo_mhome_map_area').slideLeftShow(1000, function() {}, {
                width: "100%"
            });

            $('.javo_mhome_map_lists').fadeOut(1000);
        } else {
            $('.javo_mhome_map_lists').fadeIn();
            //$('div.javo_mhome_wrap .javo_mhome_map_area').css('width','45%');

            $('div.javo_mhome_wrap .javo_mhome_map_area').slideLeftShow(1000, function() {}, {
                width: "50%"
            });
            $('.javo_mhome_map_lists').slideLeftShow(1000);
        };
    });

    $(document).on('click', '.remove-friend-to-plan', function(e) {
        var userID = $(this).data('userid');
        if (typeof tripPlan.userList !== 'undefined') {
            var index = tripPlan.userList.indexOf(userID);
            tripPlan.userList.splice(index, 1);

            $.post('/api/trip3sPlan', {
                plan: JSON.stringify(tripPlan)
            }, function(data) {});
        };
        $(this).parent().remove();
    });
    $(document).on('click', '.trans-detail', function(e) {

        //$('.content-detail-next-place').slideUp();
        $(this).parent().parent().find('.content-detail-next-place').stop().toggle();
    });

    $(document).on('click', '.add-friend-to-plan', function(e) {
        var userID = $(this).data('userid');
        var userName = $(this).data('username');
        var user = $(this).data('user');


        var check = false;
        if ($('ul.result-added-friend li').length > 0) {
            $('ul.result-added-friend li').each(function(e) {
                if (parseFloat($(this).data('userid')) == parseFloat(userID))
                    check = true;
            });
        };

        if (!check) {
            var textAdded = $('#load-added-friend').html();
            textAdded = textAdded.replace(/{{user-user}}/g, user);
            textAdded = textAdded.replace(/{{user-name}}/g, userName || '');
            textAdded = textAdded.replace(/{{user-id}}/g, userID || 0);
            $('.result-added-friend').append(textAdded);
            if (typeof tripPlan.userList == 'undefined') {
                tripPlan.userList = [];

            };
            tripPlan.userList.push(userID);
            $.post('/api/trip3sPlan', {
                plan: JSON.stringify(tripPlan)
            }, function(data) {

                console.log(data);
            });
        };
    });

    $(document).on('click', '.btn-view-location', function(e) {
        var arrUsers = [];
        $('ul.result-added-friend li').each(function(e) {
            var _user = JSON.parse(unescape($(this).data('user')));
            if (_user.location != "") {
                _user.location = JSON.parse(_user.location);
                arrUsers.push(_user);
            };
        });
        console.log(arrUsers);
        var obj = window.javo_map_box_func;
        obj.setMarkerUsers(arrUsers);

    });
    $(document).on('keypress', '#tripPlan-user-friend', function(e) {
        var inputText = $(this).val();
        $.post('/api/response_user', {
            username: inputText
        }).done(function(data) {
            var strFull = '';
            if (data.status) {
                $.each(data.users, function(index, key) {
                    var strCurr = $('#load-item-friend').html();
                    strCurr = strCurr.replace(/{{data-user}}/, escape(JSON.stringify(key)));
                    strCurr = strCurr.replace(/{{user-name}}/, key.user_display || key.user_name);
                    strCurr = strCurr.replace(/{{user-namea}}/, key.user_display || key.user_name);

                    strCurr = strCurr.replace(/{{user-id}}/, key.id || '0');
                    strFull += strCurr;
                });
            };
            $('.result-search-friend').html(strFull)
        });
    });
    $(document).on('click', '.btn-box-place', function(e) {
        $('.javo_mhome_sidebar_wrap').fadeOut();
        $('#sidebar-places').toggle();

        if ($('#sidebar-places').is(":visible")) {
            $('.javo_mhome_map_lists').fadeIn();
            //$('div.javo_mhome_wrap .javo_mhome_map_area').css('width','45%');

            $('div.javo_mhome_wrap .javo_mhome_map_area').slideLeftShow(1000, function() {}, {
                width: "50%"
            });
            $('.javo_mhome_map_lists').slideLeftShow(1000);
        } else {
            $('.javo_mhome_map_lists').slideLeftHide(1000);
            $('div.javo_mhome_wrap .javo_mhome_map_area').slideLeftShow(1000, function() {}, {
                width: "100%"
            });

            $('.javo_mhome_map_lists').fadeOut(1000);
        };

    });
    /*Add the place to places in plan*/

    $(document).on('change', "select[name='filter[item_city]']", function(e) {
        var cityIds = $(this).val();
        if (cityIds == null) {
            $("select[name='filter[item_city]']  option[value='123']").prop("selected", true);
            $('select[name="filter[item_city]"').trigger("chosen:updated");
        } else {
            $('select[name="filter[item_district]"').parent().hide();
            $('select[name="filter[item_area]"').parent().hide();
            $('select[name="filter[item_district]"').html('');
            $.post('/api/item_district', {
                cityIds: cityIds
            }).done(function(data) {
                var cate = data.cate;
                if (cate.length > 0) {
                    var strOptions = '<option value="0" disabled>Quận/Huyện</option>';

                    for (var i = 0; i < cate.length; i++) {
                        strOptions += ' <option value="' + cate[i].id + '"> ' + cate[i].cate_name + ' </option> ';
                    };
                    $('select[name="filter[item_district]"').html(strOptions);
                    $('select[name="filter[item_district]"').trigger("chosen:updated");
                    $('select[name="filter[item_district]"').parent().show();
                };
            });

        };
    });
    $(document).on('change', "select[name='filter[item_district]']", function(e) {
        var districtIds = $(this).val();
        if (districtIds == null) {

        } else {
            $('select[name="filter[item_area]"').parent().hide();
            $('select[name="filter[item_area]"').html('');
            $.post('/api/item_area', {
                districtIds: districtIds
            }).done(function(data) {
                var cate = data.cate;
                if (cate.length > 0) {
                    var strOptions = '<option value="0" disabled>Quận/Huyện</option>';

                    for (var i = 0; i < cate.length; i++) {
                        strOptions += ' <option value="' + cate[i].id + '"> ' + cate[i].cate_name + ' </option> ';
                    };
                    $('select[name="filter[item_area]"').html(strOptions);
                    $('select[name="filter[item_area]"').trigger("chosen:updated");
                    $('select[name="filter[item_area]"').parent().show();
                };
            });

        };
    });
    $(document).on('change', "select[name='filter[item_city2]']", function(e) {

        var value_url = $("select[name='filter[item_city2]'] >option:selected").data('url');
        value_url = value_url.replace(/dia-diem/g, '');
        value_url = value_url.replace(/[/-]/g, '');
        var location = value_url + ',vn';

        var baseUrl = 'http://query.yahooapis.com/v1/public/yql?q=',
            q = 'use "http://github.com/yql/yql-tables/raw/master/weather/weather.bylocation.xml" as we;' +
            'select * from we where location ="' + location + '" and unit="c"',
            url = baseUrl + encodeURIComponent(q) + '&lang=vi-VN&format=json&diagnostics=false&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';

        $.ajax({
            url: url,
            dataType: 'jsonp',
            cache: true,
            jsonpCallback: 'callbackWeather'
        });

    });
    $(document).on('click', '.btn-box-weather', function(e) {
        $('.javo_mhome_sidebar_wrap').fadeOut();
        $('#sidebar-weather').toggle();
        if ($('#sidebar-weather').is(":visible")) {
            $("select[name='filter[item_city2]']").trigger('change');
        };
    });

    window['callbackWeather'] = function(data) {
        var strHtml = $('#loading-place-weather-1').html();
        $('#responsive-weather-info').html('');
        try {
            var info = data.query.results.weather.rss.channel.item.condition;
            var channel = data.query.results.weather.rss.channel;

            var channel = data.query.results.weather.rss.channel,

                img = channel.item.description.match(/http:\/\/[^"']*/),
                html = '<img style="vertical-align:bottom" height="52" width="52" src="' + img + '" /> <span style="font-size:44px">' + channel.item.condition.temp + '&deg;C</span><br />' +
                '<strong>Độ ẩm:</strong> ' + channel.atmosphere.humidity + '%<br />' +
                '<strong>Tốc độ gió:</strong> ' + channel.wind.speed + ' km/h<br />';


            strHtml = strHtml.replace(/{{label-location}}/g, channel.location.city || '');
            strHtml = strHtml.replace(/{{weather-location}}/g, html || '');

            $('#responsive-weather-info').html(strHtml);
        } catch (e) {
            $('#responsive-weather-info').html("Error!");
        }

    }

    $(document).on('click', '.btn-box-seting', function(e) {
        $('.javo_mhome_sidebar_wrap').fadeOut();
        var _places = merge_places(tripPlan);
        if ($('#sidebar-setups').is(":visible")) {
            $('#sidebar-setups').fadeOut();
        } else {
            $('#sidebar-setups').fadeIn();
            if (tripPlan.placeBegin == '' || typeof tripPlan.placeBegin == 'undefined') {
                $('[name="tripPlan[placeBegin]"]').html(load_place_lists(_places));
            } else {
                $('[name="tripPlan[placeBegin]"]').html(load_place_lists(_places, tripPlan.placeBegin));
            }
            tripPlan.moneyNumber = (tripPlan.moneyNumber == null) ? 0 : parseFloat(tripPlan.moneyNumber);
            $('#tripPlan-tripName').val(tripPlan.tripName);
            $('#tripPlan-dayNumbers').val(tripPlan.dayNumber);
            $('#tripPlan-userNumbers').val(tripPlan.userNumber);
            $('#tripPlan-moneyNumbers').val(tripPlan.moneyNumber);
            $('#tripPlan-planStart').val(tripPlan.planStart);
            $('#tripPlan-timeStart').val(tripPlan.timeStart);
            $('#tripPlan-timeEnd').val(tripPlan.timeEnd);

            var nowTemp = new Date();
            var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);

            $('#tripPlan-planStart').datepicker({
                onRender: function(date) {
                    return date.valueOf() < now.valueOf() ? 'disabled' : '';
                }
            });
        };
        if ($(this).data('next') !== undefined) {
            $('.javo_mhome_map_lists').slideLeftHide(1000);
            $('div.javo_mhome_wrap .javo_mhome_map_area').slideLeftShow(1000, function() {}, {
                width: "100%"
            });
            $('.javo_mhome_map_lists').fadeOut(500);
        };
    });

    $(document).on('click', '.btn-box-users', function(e) {
        $('.javo_mhome_sidebar_wrap').fadeOut();
        $('#sidebar-users').toggle();

    });
    $(document).on('click', '.btn-box-cancel', function(e) {
        $('.javo_mhome_sidebar_wrap').fadeOut();
    });
    $(document).on('click', '.btn-off-on', function(e) {
        console.log("dd");
        if ($('.btn-default .btn-string').is(":visible")) {
            $('.btn-off-on-control').html('<i class="fa fa-forward"></i>');
            $('.sidebar_control').css('width', '40px');
            $('.javo_mhome_sidebar_wrap').css('left', '41px');

            $('.btn-default .btn-string').stop().fadeOut();

        } else {
            $('.btn-default .btn-string').stop().fadeIn();
            $('.btn-off-on-control').html('<i class="fa fa-fast-backward"></i>');
            $('.sidebar_control').css('width', '100px');
            $('.javo_mhome_sidebar_wrap').css('left', '101px');
        };
    });
    $(document).on('click', '.preview-to-plan', function() {

        var strCurrDayDetail = '',
            allPlace = 0,
            allMoney = 0,
            allDistance = 0;
        for (var day = 1; day <= tripPlan.dayNumber; day++) {

            var strFullDayDetail = $('#loading-preview-detail-day').html(),
                money = 0,
                distance = 0,
                place = 0;
            var strFullScheduleDetail1 = $('#loading-preview-detail-schedule').html(),
                user_count = 1,
                place_count = 0,
                money_count = 0,
                distance_count = 0;
            var schedule = tripPlan.schedules["Day_" + day];
            place_count = schedule.placeLists.length + 1;
            if (schedule.placeBegin.place_id != schedule.placeEnd.place_id) {
                place_count++
            };
            money_count = schedule.money;
            allMoney += parseFloat(money_count);
            user_count = schedule.userNumber;
            distance_count = schedule.distance;
            allDistance += parseFloat(distance_count);
            allPlace += parseFloat(place_count);

            strFullScheduleDetail1 = strFullScheduleDetail1.replace(/{{day-index}}/g, day || '');
            strFullScheduleDetail1 = strFullScheduleDetail1.replace(/{{place-count}}/g, place_count || '0');
            strFullScheduleDetail1 = strFullScheduleDetail1.replace(/{{user-count}}/g, user_count || '1');
            strFullScheduleDetail1 = strFullScheduleDetail1.replace(/{{money-count}}/g, money_count || '0');
            strFullScheduleDetail1 = strFullScheduleDetail1.replace(/{{distance-count}}/g, distance_count || '0');

            var strFullScheduleDetailB = $('#loading-preview-detail-day').html(),
                begin = tripPlan.schedules["Day_" + day].placeBegin,
                strDetail = '';

            strFullScheduleDetailB = strFullScheduleDetailB.replace(/{{place_time}}/g, begin.place_time || '');
            strFullScheduleDetailB = strFullScheduleDetailB.replace(/{{place_come}}/g, begin.place_come || '');
            strFullScheduleDetailB = strFullScheduleDetailB.replace(/{{place_open}}/g, begin.place_open || '');
            strFullScheduleDetailB = strFullScheduleDetailB.replace(/{{place_close}}/g, begin.place_close || '');
            strFullScheduleDetailB = strFullScheduleDetailB.replace(/{{place_note}}/g, begin.place_note || '');
            strFullScheduleDetailB = strFullScheduleDetailB.replace(/{{place_thumbnail}}/g, begin.post_thumbnail || '');
            strFullScheduleDetailB = strFullScheduleDetailB.replace(/{{place_name}}/g, begin.post_title || '');
            strFullScheduleDetailB = strFullScheduleDetailB.replace(/{{next_distance}}/g, begin.next_distance || '');
            strFullScheduleDetailB = strFullScheduleDetailB.replace(/{{next_time}}/g, begin.next_time || '');
            strFullScheduleDetailB = strFullScheduleDetailB.replace(/{{place_id}}/g, begin.place_id || '');

            if (tripPlan.schedules["Day_" + day].placeLists.length > 0) {
                strFullScheduleDetailB = strFullScheduleDetailB.replace(/{{place_next}}/g, tripPlan.schedules["Day_" + day].placeLists[0].post_title || '');
            };

            strFullScheduleDetailB = strFullScheduleDetailB.replace(/{{day-index}}/g, day || 1);

            strDetail += strFullScheduleDetailB;
            for (var i = 0; i < tripPlan.schedules["Day_" + day].placeLists.length; i++) {
                var strFullScheduleDetailB = $('#loading-preview-detail-day').html();
                begin = tripPlan.schedules["Day_" + day].placeLists[i];
                strFullScheduleDetailB = strFullScheduleDetailB.replace(/{{place_time}}/g, begin.place_time || '');
                strFullScheduleDetailB = strFullScheduleDetailB.replace(/{{place_come}}/g, begin.place_come || '');
                strFullScheduleDetailB = strFullScheduleDetailB.replace(/{{place_open}}/g, begin.place_open || '');
                strFullScheduleDetailB = strFullScheduleDetailB.replace(/{{place_close}}/g, begin.place_close || '');
                strFullScheduleDetailB = strFullScheduleDetailB.replace(/{{place_note}}/g, begin.place_note || '');
                strFullScheduleDetailB = strFullScheduleDetailB.replace(/{{place_thumbnail}}/g, begin.post_thumbnail || '');
                strFullScheduleDetailB = strFullScheduleDetailB.replace(/{{place_name}}/g, begin.post_title || '');
                strFullScheduleDetailB = strFullScheduleDetailB.replace(/{{next_distance}}/g, begin.next_distance || '');
                strFullScheduleDetailB = strFullScheduleDetailB.replace(/{{next_time}}/g, begin.next_time || '');
                strFullScheduleDetailB = strFullScheduleDetailB.replace(/{{place_id}}/g, begin.place_id || '');
                if (tripPlan.schedules["Day_" + day].placeLists.length - 1 > i) {
                    strFullScheduleDetailB = strFullScheduleDetailB.replace(/{{place_next}}/g, tripPlan.schedules["Day_" + day].placeLists[i + 1].post_title || '');
                } else {
                    strFullScheduleDetailB = strFullScheduleDetailB.replace(/{{place_next}}/g, tripPlan.schedules["Day_" + day].placeEnd.post_title || '');
                };

                strFullScheduleDetailB = strFullScheduleDetailB.replace(/{{day-index}}/g, day || 1);
                strDetail += strFullScheduleDetailB;
            };

            var strFullScheduleDetailE = $('#loading-preview-detail-day').html(),
                end = tripPlan.schedules["Day_" + day].placeEnd;

            strFullScheduleDetailB = strFullScheduleDetailB.replace(/{{place_id}}/g, begin.place_id || '');
            strFullScheduleDetailE = strFullScheduleDetailE.replace(/{{place_time}}/g, end.place_time || '');
            strFullScheduleDetailE = strFullScheduleDetailE.replace(/{{place_come}}/g, end.place_come || '');
            strFullScheduleDetailE = strFullScheduleDetailE.replace(/{{place_open}}/g, end.place_open || '');
            strFullScheduleDetailE = strFullScheduleDetailE.replace(/{{place_close}}/g, end.place_close || '');
            strFullScheduleDetailE = strFullScheduleDetailE.replace(/{{place_note}}/g, end.place_note || '');
            strFullScheduleDetailE = strFullScheduleDetailE.replace(/{{place_thumbnail}}/g, end.post_thumbnail || '');
            strFullScheduleDetailE = strFullScheduleDetailE.replace(/{{place_name}}/g, end.post_title || '');
            strFullScheduleDetailE = strFullScheduleDetailE.replace(/{{next_distance}}/g, end.next_distance || '');
            strFullScheduleDetailE = strFullScheduleDetailE.replace(/{{next_time}}/g, end.next_time || '');
            strFullScheduleDetailE = strFullScheduleDetailE.replace(/{{place_next}}/g, '' || '');

            strFullScheduleDetailE = strFullScheduleDetailE.replace(/{{day-index}}/g, day || 1);


            strDetail += strFullScheduleDetailE;

            strFullScheduleDetail1 = strFullScheduleDetail1.replace(/{{section_detail}}/g, strDetail || '');

            strCurrDayDetail += strFullScheduleDetail1;

        };
        tripPlan.distance = allDistance;
        tripPlan.money = allMoney;

        var strFull = $('#loading-preview-plan').html();
        strFull = strFull.replace(/{{plan_name}}/g, '' || '');
        strFull = strFull.replace(/{{plan_day}}/g, tripPlan.dayNumber || '1');
        strFull = strFull.replace(/{{plan_all_money}}/g, allMoney || '0');
        strFull = strFull.replace(/{{plan_all_distance}}/g, tripPlan.distance.toFixed(2) || '0');
        strFull = strFull.replace(/{{plan_all_place}}/g, allPlace || '0');
        strFull = strFull.replace(/{{plan_all_detail}}/g, strCurrDayDetail || '');





        $('#preview_detail_panel').html(strFull);
        $('#preview_detail_panel').modal();
        setTimeout(function() {
            var obj = window.javo_map_box_func;



            for (var day = 1; day <= tripPlan.dayNumber; day++) {
                $('#map-schedule-' + day).gmap3(obj.options.map_init);
                var map = $('#map-schedule-' + day).gmap3('get');
                tripPlan.schedules["Day_" + day].currentNumber = day;
                obj.drawRoutePreview(tripPlan.schedules["Day_" + day], map);
            }

        }, 1500);

        $.post('/api/trip3sPlan', {
            plan: stringify(tripPlan)
        }, function(data) {
            console.log("Preview");
            console.log(data);
        });
    });


    $(document).on('click', '.btn-printf', function() {



    });
    $(document).on('click', '.submit-to-plan', function() {
        if (user.id < 1) {
            $('#login_panel').modal();
            return false;
        };
        $('#new_plan').submit();
    })
    $(document).on('click', '.save-to-plan', function() {
        if (user.id < 1) {
            $('#login_panel').modal();
            return false;
        };
        $.post('/plans/createPlan', {}, function(data) {
            if (data.status == true) {
                window.location.href = "/plans/" + data.plan;
            };
        });
    });
    $(document).on('click', '.cancel-to-plan', function() {
        $.post('/api/trip3sReset', {}, function(data) {
            console.log("Reset trip");
            tripPlan = data.plan;
            var obj = window.javo_map_box_func;
            $('.btn-box-place').trigger('click');
            obj.ajax_favorite(tripPlan.placeLists, 2);

            obj.resize();
        });
    });
    $(document).on('click', '.trigger-create', function() {
        if (typeof tripPlan.placeBegin == 'undefined' || tripPlan.placeBegin == "") {
            alert('Chọn 1 địa điểm bạn ở lại trong hành trình');

            $('#register_waiting_create').removeClass('active_wait');
            return false;
        }
        var antVectors = tripPlan.vectorDistances,
            _places = _places = merge_places(tripPlan);

        tripPlan.vectorDistances = getArrayDistances({
            placeLists: _saveArray(_places),
            placeBegin: tripPlan.placeBegin,
            placeEnd: tripPlan.placeEnd
        }, antVectors);
        tripPlan.schedules["Day_Not"] = {
            placeNumber: 0,
            placeLists: [],
            placeIds: []
        };
        var optionsToPlan = {
            dayNumber: tripPlan.dayNumber,
            placeLists: tripPlan.placeLists,
            placeBegin: tripPlan.placeBegin,
            placeEnd: tripPlan.placeEnd,
            timeStart: tripPlan.timeStart,
            timeEnd: tripPlan.timeEnd,
            antVectorDistance: tripPlan.vectorDistances,
            schedules: tripPlan.schedules
        }

        optionsToPlan = acoCreateSchedule(optionsToPlan);


        optionsToPlan.schedules = cloneObject(optionsToPlan.schedules);
        if (!$.isArray(optionsToPlan.schedules["Day_1"].placeLists) || optionsToPlan.schedules["Day_1"].placeLists.length < 1) {
            alert("Sắp lịch thất bại. \nBạn hãy xem cài đặt lại thông số và sắp lịch lại");
            return;
        };
        for (var ik = 1; ik <= tripPlan.dayNumber; ik++) {
            optionsToPlan.schedules["Day_" + ik] = updatePlaceCome(optionsToPlan.schedules["Day_" + ik]);
        }

        tripPlan.schedules = cloneObject(optionsToPlan.schedules);



        $.post('/api/trip3sPlan', {
            plan: stringify(tripPlan)
        }, function(data) {
            console.log("Created the trip successfully");
            $('#register_waiting_create').removeClass('active_wait');
        });
        var obj = window.javo_map_box_func;
        obj.resize();
        update_sidebar_plan(tripPlan);

    });

    $(document).on('click', '.btn-optimize', function() {
        $('#register_waiting_create').addClass('active_wait');
        var day = $(this).data('day');
        if (typeof tripPlan.schedules["Day_" + day] == 'object') {
            var tmpCluster = _saveArray(tripPlan.schedules["Day_" + day].placeLists);
            var _tmpSchedule = cloneObject(tripPlan.schedules["Day_" + day]);
            var _tmpRs = acoAlgorithm({
                placeLists: tmpCluster,
                check: true,
                timeStart: _tmpSchedule.timeStart,
                userNumber: _tmpSchedule.userNumber,
                moneyNumber: _tmpSchedule.moneyNumber,
                placeBegin: _tmpSchedule.placeBegin,
                placeEnd: _tmpSchedule.placeEnd,
                antVectorDistance: tripPlan.vectorDistances
            });

            _tmpRs = updatePlaceCome(_tmpRs);

            tripPlan.schedules["Day_" + day] = _tmpRs;


            update_sidebar_header_control({
                currDay: day,
                indexControl: 2,
                numDay: tripPlan.dayNumber
            });

            update_sidebar_boby(tripPlan, parseInt(day));
            $.post('/api/trip3sPlan', {
                plan: stringify(tripPlan)
            }, function(data) {
                console.log("Updated !!!");
                $('#register_waiting_create').removeClass('active_wait');

            });
            var obj = window.javo_map_box_func;
            obj.resize();
        };

    });
    $(document).on('click', '.create-trip', function() {
        $('#register_waiting_create').addClass('active_wait');
        $('.trigger-create').trigger('click');
    });

    function update_time_coming(_schedule, timeStart) {
        if (typeof timeStart == 'undefined' || !$.isNumeric(timeStart)) {
            console.log("timeStart: 7.5");
            timeStart = 7.5;
        };
        var vectorDistances = tripPlan.vectorDistances;

        _schedule.placeBegin.place_come = decrypt_time(timeStart);
        timeStart += parseFloat(_schedule.placeBegin.next_time);
        for (var i = 0; i < _schedule.placeLists.length; i++) {
            _schedule.placeLists[i].place_come = decrypt_time(timeStart);
            timeStart += parseFloat(_schedule.placeLists[i].place_time);
            timeStart += parseFloat(_schedule.placeLists[i].next_time);
        };
        timeStart += parseFloat(_schedule.placeLists[(_schedule.placeLists.length - 1)].next_time);
        _schedule.placeEnd.place_come = decrypt_time(timeStart);
        return _schedule;
    }

    function update_time_comings(_schedules, timeStart) {

        for (var i = 0; i < _schedules.length; i++) {
            _schedules[i] = update_time_coming(_schedules[i], timeStart);
        };
        showSave(true);
        return _schedules;
    }


    // Convert array to object
    var convArrToObj = function(array) {
            var thisEleObj = new Object();
            if (typeof array == "object") {
                for (var i in array) {
                    var thisEle = convArrToObj(array[i]);
                    thisEleObj[i] = thisEle;
                }
            } else {
                thisEleObj = array;
            }
            return thisEleObj;
        }
        // Convert array to object
    var stringify = function(tripPlan) {
        var thisEleObj = new Object(),
            array = tripPlan.vectorDistances;
        if (typeof array == "object") {
            for (var i in array) {
                var thisEle = convArrToObj(array[i]);
                thisEleObj[i] = thisEle;
            }
        } else {
            thisEleObj = array;
        }
        tripPlan.vectorDistances = thisEleObj;
        return JSON.stringify(tripPlan);
    };


    $(document).on('click', '.k-means', function() {
        $.get(
            '/api/k_mean', {},
            function(response) {
                var _rs = antCycle(tripPlan.placeLists),
                    _tempPlaceLists = [];
            });

    });
    //Devide places to n cluster from input
    function findCluster(placeLists, nCluster) {
        var Clusters = [];

        for (var i = 0; i < placeLists.length; i++) {
            placeLists[i]
        };
    }

    //Update side left bar
    function update_sidebar_plan(tripPlan) {
        update_sidebar_header_control({
            currDay: 1,
            indexControl: 2,
            numDay: tripPlan.dayNumber
        });
        //update_sidebar_header_bar();
        update_sidebar_boby(tripPlan, 1);

    }


    //Update header sidebar control
    function update_sidebar_header_control(data) {

        var strHtml = $('#load-schedule-day-header-control-' + data.indexControl).html();
        strHtml = strHtml.replace(/{{current_day}}/, data.currDay || 1);

        $('#schedule-day-header-control-2').html(strHtml);
        update_list_day(tripPlan.dayNumber);

        var currSchedule = tripPlan.schedules["Day_" + data.currDay];

        update_bar_day({
            index: 1,
            distance: ((currSchedule.distance).toFixed(2)),
            placeNumber: currSchedule.placeLists.length,
            dayNumber: ((currSchedule.duration).toFixed(2)),
            moneyNumber: currSchedule.money,
            userNumber: currSchedule.userNumber
        });
    }

    function update_sidebar_header_bar(data, index) {
        var strAttr = $("#trip3s-attribute-schedule-1").html(),
            strNull = '0';
        strAttr = strAttr.replace(/{{data-index}}/g, index || strNull);
        strAttr = strAttr.replace(/{{data-distance}}/g, data.distance || strNull);
        strAttr = strAttr.replace(/{{data-place}}/g, (data.placeLists.length + 2) || strNull);
        strAttr = strAttr.replace(/{{data-time}}/g, data.duration || strNull);
        strAttr = strAttr.replace(/{{data-user}}/g, data.userNumber || strNull);
        strAttr = strAttr.replace(/{{data-money}}/g, data.money || strNull);
        $('#attribute-schedule-' + index).html(strAttr);
    }

    function string_placelist(place, i, ik) {
        var str = '',
            nstr = "";
        str = $("#trip3s-place-in-schedule").html();

        if (encrypt_time(place.place_come) > encrypt_time(place.place_late)) {
            str = str.replace(/{{truetime}}/g, "overtime");
        } else {
            str = str.replace(/{{truetime}}/g, "truetime");
        };
        if (ik == 0 || ik == '0') {
            str = str.replace(/{{schedule_id}}/g, ik);
            str = str.replace(/{{class_begin}}/g, ' none');

        };
        str = str.replace(/{{post_thumbnail}}/g, place.post_thumbnail || nstr);
        str = str.replace(/{{place_id}}/g, place.place_id || nstr);
        str = str.replace(/{{post_id}}/g, place.post_id || nstr);
        str = str.replace(/{{current_place}}/g, JSON.stringify(place) || nstr);
        str = str.replace(/{{post_title}}/g, place.post_title || nstr);
        str = str.replace(/{{place_come}}/g, place.place_come || "00:00");
        str = str.replace(/{{post_excerpt}}/g, place.phone || nstr);
        str = str.replace(/{{place_time}}/g, place.place_time || nstr);
        str = str.replace(/{{sort_thumbnail}}/g, i || nstr);
        str = str.replace(/{{place_ticket}}/g, place.place_ticket || nstr);
        str = str.replace(/{{place_note}}/g, place.place_note || nstr);
        str = str.replace(/{{next_distance}}/g, place.next_distance || nstr);
        str = str.replace(/{{next_time}}/g, place.next_time || nstr);
        str = str.replace(/{{next_detail}}/g, place.next_detail || nstr);
        return str;
    }

    function update_sidebar_boby(tripPlan, choice) {
        if (typeof choice == 'undefined' || !$.isNumeric(choice)) {
            choice = 0;
        }
        var strFull = "<div class=\"full-detail \">",
            nstr = '',
            strNull = '0',
            strCurr = '';
        console.log("tripPlan in update sidebar body");


        $('#body-detail-review-plan').html('');
        for (var ik = 1; ik <= tripPlan.dayNumber; ik++) {
            tripPlan.schedules["Day_" + ik] = updatePlaceCome(tripPlan.schedules["Day_" + ik]);

            var _place = _saveArray(tripPlan.schedules["Day_" + ik].placeLists),
                cls = "notselect",
                data = tripPlan.schedules["Day_" + ik];
            if (choice === ik) {
                cls = "_selected";
            };

            strFull += html_body(tripPlan.schedules["Day_" + ik], cls, ik);
        };
        //check places are not in schedule
        if (typeof tripPlan.schedules["Day_Not"] !== 'undefined' && tripPlan.schedules["Day_Not"].placeLists.length > 0) {
            strFull += html_body2(tripPlan.schedules["Day_Not"].placeLists);
        };
        strFull += "</div>";

        $('#body-detail-review-plan').html(strFull);
        for (var ik = 1; ik <= tripPlan.dayNumber; ik++) {
            update_sidebar_header_bar(tripPlan.schedules["Day_" + ik], ik);
        }
        enable_sortable("ul.schedule-day-boby", "ul.schedule-day-boby-bk");
        var obj = window.javo_map_box_func;
        obj.resize();

    }

    function html_body(_schedule, cls, ik) {
        var strFull = "<div class=\"row schedule-day-boby-detail " + cls + " \">",
            places = _SaveArray(_schedule.placeLists);
        strFull += "<div class=\"schedule-day-header-bar attribute-schedule\" id=\"attribute-schedule-" + ik + "\"  data-index=\"" + ik + "\"></div> ";
        strFull += "<div class=\"schedule-day-boby-detail-fix  scrollbar style-3\">";
        strFull += "<div class=\"schedule-day-boby-fixed\">" + string_placelist(_schedule.placeBegin, 1, 0) + "</div> ";
        strFull += "<ul class=\"schedule-day-boby\" data-index=\"" + ik + "\" id=\"schedule-day-boby-" + ik + "\" >";
        for (var i = 0; i < places.length; i++) {
            strFull += string_placelist(places[i], (i + 2), ik);
        };
        strFull += "</ul>";

        strFull += "<div class=\"schedule-day-boby-fixed\">" + string_placelist(_schedule.placeEnd, places.length + 2, 0) + "</div> ";
        strFull += "</div></div>";

        return strFull;
    }

    function html_body2(_schedule) {
        var strFull = "<div class=\"row schedule-day-boby-detail notselect \">",
            strAttr = "";

        strAttr = $("#trip3s-attribute-schedule-3").html();
        strAttr = strAttr.replace(/{{data-index}}/g, _schedule.length || "0");

        strFull += "<div class=\"schedule-day-header-bar attribute-schedule\">" + strAttr + "</div> ";
        strFull += "<div class=\"schedule-day-boby-detail-fix  scrollbar style-3\">";
        strFull += "<ul class=\"schedule-day-boby-bk \">";
        for (var i = 0; i < _schedule.length; i++) {
            strFull += string_placelist(_schedule[i], (i + 1));
        };
        strFull += "</ul>";
        strFull += "</div></div>";

        return strFull;
    }
    $(document).on('click', '#list-day li', function() {


        var schedule_day = $(this).find('a').attr('data');

        update_sidebar_header_control({
            currDay: schedule_day,
            indexControl: 2,
            numDay: tripPlan.dayNumber
        });

        $('#dropdown-select-days').html('Ngày ' + schedule_day + ' <span class="caret"></span>');
        $('#dropdown-select-days').attr("data-place_id", schedule_day);
        update_sidebar_boby(tripPlan, parseInt(schedule_day));

        var obj = window.javo_map_box_func;
        obj.resize();
    });

    function update_bar_day(data) {
        if (typeof data === 'undefined') {
            return;
        };
        var strNull = '0';
        var str = $("#trip3s-attribute-schedule-" + data.index).html();
        str = str.replace(/{{data-distance}}/g, data.distance || strNull);
        str = str.replace(/{{data-place}}/g, data.placeNumber || strNull);
        str = str.replace(/{{data-time}}/g, data.dayNumber || strNull);
        str = str.replace(/{{data-user}}/g, data.userNumber || strNull);
        str = str.replace(/{{data-money}}/g, data.moneyNumber || strNull);

        $('#attribute-schedule').html(str);
        $('#attribute-schedule-2').html(str);
    }

    function update_selected() {
        $.get(
            '/api/return_day', {},
            function(response) {
                $('[list-day-in-plan]').each(function(e) {
                    var max_day = response.day_number;

                    var str_li = '';
                    for (var i = 1; i <= max_day; i++) {
                        var str = '',
                            cls_return_day = 'fa fa-check-circle-o';
                        try {
                            if (response.schedule[i].place_ids.indexOf(parseInt($(this).attr('place_id'))) > -1 &&
                                response.schedule[i].day == i
                            ) {
                                cls_return_day = 'fa selected fa-times';
                            };
                        } catch (err) {
                            //console.log('error');
                        };


                        str = $("#trip3s-item-day").html();
                        str = str.replace(/{{item_day}}/g, i);
                        str = str.replace(/{{item_day_number}}/g, cls_return_day);
                        str_li += str;
                    };

                    $(this).html(str_li);
                })
            });
    }

    $(document).on('click', '[list-day-in-plan] li a', function() {
        var place = $(this).parent().parent().parent().parent().parent().data('place');
        var schedule_day = $(this).attr('day');
        $('[javo-current-day]').val(schedule_day);
        var action = 'add_place';
        if (!$(this).hasClass("selected")) {
            $(this).addClass('selected fa-times').removeClass('fa-check-circle-o');
            $('.list-announcement').append('<li>Thêm địa điểm thành công</li>');
        } else {
            $(this).removeClass('selected  fa-times').addClass('fa-check-circle-o');
            $('.list-announcement').append('<li>Xóa địa điểm thành công</li>');
            action = 'remove_place';
        }
        update_listPlaces(place, schedule_day);

        update_announcement();
    });

    function update_listPlaces(place, schedule_day) {
        if (typeof tripPlan.schedules["Day_" + schedule_day] == 'undefined') {
            tripPlan.schedules["Day_" + schedule_day] = {
                timeTemp: 7.5,
                moneyNumber: 0,
                currentNumber: schedule_day,
                placeBegin: tripPlan.placeBegin,
                placeEnd: tripPlan.placeEnd,
                placeLists: [],
                placeIds: []
            }
        };
        try {
            if (tripPlan.schedules["Day_" + schedule_day].placeIds.indexOf(place.place_id) < 0) {
                tripPlan.schedules["Day_" + schedule_day].placeLists.push(place);
                tripPlan.schedules["Day_" + schedule_day].placeIds.push(place.place_id);
            };
        } catch (e) {
            tripPlan.schedules["Day_" + schedule_day].placeLists = [];
            tripPlan.schedules["Day_" + schedule_day].placeIds = [];
            tripPlan.schedules["Day_" + schedule_day].placeLists.push(place);
            tripPlan.schedules["Day_" + schedule_day].placeIds.push(place.place_id);
        }



        $.post('/api/trip3sPlan', {
            plan: stringify(tripPlan)
        }, function(data) {});
        console.log(tripPlan);
        return tripPlan;
    }

    function load_place_lists(data, selected) {
        var strFull = '';
        if (data[0] == '') {
            return strFull;
        };
        for (var i = 0; i < data.length; i++) {
            if (data[i] !== "") {
                if (typeof selected == "undefined")
                    strFull += "<option value='" + data[i].place_id + "'>" + data[i].post_title + "</option>";
                else if (data[i].place_id === selected.place_id)
                    strFull += "<option selected value='" + data[i].place_id + "'>" + data[i].post_title + "</option>";
                else
                    strFull += "<option value='" + data[i].place_id + "'>" + data[i].post_title + "</option>";
            };
        };
        return strFull;
    }

    function load_place_selected(data, selected) {
        for (var i = 0; i < data.length; i++) {
            if (typeof selected == "undefined") {
                return data[i];
            } else if (parseFloat(data[i].place_id) == parseFloat(selected)) {
                return data[i];
            }
        };
        return data[0]
    }

    function update_day_in_place(tripPlan, id) {
        var strFull = '';
        for (var j = 1; j <= tripPlan.dayNumber; j++) {
            var strTmp = $('#load-day-in-place').html();
            if (typeof tripPlan.schedules["Day_" + j] == 'undefined') {
                strTmp = strTmp.replace(/{{index-number}}/g, j);
                strTmp = strTmp.replace(/{{index-class}}/g, 'fa-check-circle-o');

            } else {
                var schedule = tripPlan.schedules["Day_" + j];
                if (schedule.placeLists.length > 0) {
                    for (var i = 0; i < schedule.placeLists.length; i++) {
                        if (schedule.placeLists[i].place_id == id) {
                            strTmp = strTmp.replace(/{{index-number}}/g, j);
                            strTmp = strTmp.replace(/{{index-class}}/g, ' selected fa-times');
                        } else {
                            strTmp = strTmp.replace(/{{index-number}}/g, j);
                            strTmp = strTmp.replace(/{{index-class}}/g, 'fa-check-circle-o');
                        }
                    };
                } else {
                    strTmp = strTmp.replace(/{{index-number}}/g, j);
                    strTmp = strTmp.replace(/{{index-class}}/g, 'fa-check-circle-o');
                }
            }
            strFull += strTmp;
        }
        return strFull;
    }
    $(document).on('click', 'i.remove-place', function(e) {
        var place_id = $(this).data('place_id');
        var schedule_id = $(this).parent().parent().parent().data('index');
        var indexPlace = tripPlan.placeIds.indexOf(place_id);
        if (indexPlace > -1) {
            tripPlan.placeIds.splice(indexPlace, 1);
            tripPlan.placeLists.splice(indexPlace, 1);
            if (typeof schedule_id != 'undefined') {
                tripPlan.schedules["Day_" + schedule_id].placeIds.splice(indexPlace, 1);
                tripPlan.schedules["Day_" + schedule_id].placeLists.splice(indexPlace, 1);
            };
        } else {
            var indexPlace = tripPlan.placeIds.indexOf(null);
            if (indexPlace > -1) {
                tripPlan.placeIds.splice(indexPlace, 1);
                tripPlan.placeLists.splice(indexPlace, 1);
            }
        };

        $(this).parent().parent().remove();
        console.log(tripPlan);
        //remove place 
        $.post('/api/trip3sPlan', {
            plan: stringify(tripPlan)
        }, function(data) {
            console.log(data);
        });
    });



    $(document).on('change', '[name="tripPlan[placeBegin]"]', function(e) {
        tripPlan.placeBegin = load_place_selected(tripPlan.placeLists, $(this).val());
        tripPlan.placeEnd = load_place_selected(tripPlan.placeLists, $(this).val());
    });
    $(document).on('change', 'select[name^="tripPlan_placeBegin_"]', function(e) {

    });

    function hide_setting() {
        $('#body-detail-create-plan').hide();
        console.log("Hide");
    }
    $(document).on('click', '.btn-box-plan', function(e) {
        $('.javo_mhome_sidebar_wrap').fadeOut();
        $('#sidebar-plans').fadeIn();

        for (var i = 1; i <= tripPlan.dayNumber; i++) {
            if (typeof tripPlan.schedules["Day_" + i] !== 'undefined') {

                if (tripPlan.schedules["Day_" + i].placeLists.length > 0) {
                    update_time_comings(tripPlan.schedules, 7.5);
                    update_sidebar_plan(tripPlan, i);
                    break;
                };
            }
        };
        var obj = window.javo_map_box_func;
        obj.resize();
    });
    $(document).on('click', '.btn-box-reset', function(e) {
        $.post('/api/trip3sReset', {}, function(data) {
            console.log("Reset trip");
            tripPlan = data.plan;
            var obj = window.javo_map_box_func;
            $('.btn-box-place').trigger('click');
            obj.ajax_favorite(tripPlan.placeLists, 2);

            obj.resize();
        });
    });

    $(document).on('click', '.view-trip-down', function(e) {
        hide_setting();
        for (var i = 1; i <= tripPlan.dayNumber; i++) {
            if (typeof tripPlan.schedules["Day_" + i] !== 'undefined') {
                console.log("d");
                if (tripPlan.schedules["Day_" + i].placeLists.length > 0) {
                    update_time_comings(tripPlan.schedules, 7.5);
                    update_sidebar_plan(tripPlan, i);
                    break;
                };
            }
        };
        var obj = window.javo_map_box_func;
        obj.resize();
    });

    function merge_places(tripPlan) {
        var _places = _saveArray(tripPlan.placeLists);

        _places.push(tripPlan.placeBegin);


        for (var i = 1; i <= tripPlan.dayNumber; i++) {
            if (typeof tripPlan.schedules["Day_" + i] !== 'undefined') {
                if (tripPlan.schedules["Day_" + i].placeBegin !== '' || typeof tripPlan.schedules["Day_" + i] !== 'undefined') {
                    if (i == 1) {
                        _places.push(tripPlan.schedules["Day_" + i].placeBegin);
                    };
                    _places.push(tripPlan.schedules["Day_" + i].placeEnd);
                };
            };
        }
        _places = removeDuplicate(_places);

        return _places;

    }

    function devide_places(tripPlan, _places) {
        for (var i = 0; i < _places.length; i++) {
            if (_places[i] == "" || typeof _places[i] == "string" || typeof _places[i] == "undefined") {
                _places.splice(i, 1)
            };
        }
        for (var i = 1; i <= tripPlan.dayNumber; i++) {
            if (typeof tripPlan.schedules["Day_" + i] !== 'undefined') {
                if (tripPlan.schedules["Day_" + i].placeBegin !== '' || typeof tripPlan.schedules["Day_" + i] !== 'undefined') {

                    if (i == 1) {
                        _places = removePlace(_places, tripPlan.schedules["Day_" + i].placeBegin);
                    };
                    _places = removePlace(_places, tripPlan.schedules["Day_" + i].placeEnd);
                };
            };
        };
        var _placeIds = [];


        for (var i = 0; i < _places.length; i++) {
            _placeIds.push(_places[i].place_id);
        };
        return {
            placeLists: _places,
            placeIds: _placeIds
        }
    }
    $(document).on('click', '.detail-next', function(e) {
        var place_id = $(this).data('place_id');
        if ($('#router-panel-' + place_id).is(":visible")) {
            $('.place-router-detail').fadeOut();
        } else {
            $('#router-panel-' + place_id).fadeIn();
        };

    });

    $(document).on('click', '.open-advance', function(e) {

        $('.btn-save-detail-advance-plan').toggle();
        $('.btn-save-detail-plan').toggle();


        var dayNumbers = $('#tripPlan-dayNumbers').val() == '' ? 1 : $('#tripPlan-dayNumbers').val();
        dayNumbers = parseFloat(dayNumbers);
        if ($('.btn-save-detail-advance-plan').is(":visible")) {
            var strFull = '',
                _places = merge_places(tripPlan);
            for (var i = 1; i <= dayNumbers; i++) {
                if (i === 1) {
                    var strCurr = $('#loading-place-start-1').html();
                } else {
                    var strCurr = $('#loading-place-start-2').html();
                };
                strCurr = strCurr.replace(/{{dayNumber}}/g, i);
                if (typeof tripPlan.schedules["Day_" + i] !== 'undefined') {
                    strCurr = strCurr.replace(/{{places-list-start}}/g, load_place_lists(_places, tripPlan.schedules["Day_" + i].placeBegin));
                    strCurr = strCurr.replace(/{{places-list-end}}/g, load_place_lists(_places, tripPlan.schedules["Day_" + i].placeEnd));
                } else {
                    strCurr = strCurr.replace(/{{places-list-start}}/g, load_place_lists(_places));
                    strCurr = strCurr.replace(/{{places-list-end}}/g, load_place_lists(_places));
                };
                strFull += strCurr;
            };
            $('.setting-day').slideDown();
            $('.setting-day').html(strFull);

            for (var i = 1; i <= dayNumbers; i++) {
                if (typeof tripPlan.schedules["Day_" + i] !== 'undefined') {
                    tripPlan.schedules["Day_" + i].moneyNumber = (tripPlan.schedules["Day_" + i].moneyNumber == null) ? 0 : tripPlan.schedules["Day_" + i].moneyNumber;
                    tripPlan.schedules["Day_" + i].timeEnd = (tripPlan.schedules["Day_" + i].timeEnd == null) ? tripPlan.timeEnd : tripPlan.schedules["Day_" + i].timeEnd;

                    tripPlan.schedules["Day_" + i].timeEnd = (parseFloat(tripPlan.schedules["Day_" + i].timeEnd) == NaN || parseFloat(tripPlan.schedules["Day_" + i].timeEnd) == 0) ? 24 : tripPlan.schedules["Day_" + i].timeEnd;

                    $('.setting-day').find('#tripPlan_placeMoney_' + i).val(tripPlan.schedules["Day_" + i].moneyNumber);
                    $('.setting-day').find('#tripPlan_timeBegin_' + i).val(tripPlan.schedules["Day_" + i].timeStart);
                    $('.setting-day').find('#tripPlan_placeUser_' + i).val(tripPlan.schedules["Day_" + i].userNumber);
                    $('.setting-day').find('#tripPlan_timeEnd_' + i).val(tripPlan.schedules["Day_" + i].timeEnd);
                };
            }

        } else {
            $('.setting-day').slideUp();
        };
    });
    $(document).on('click', '.btn-save-detail-plan', function(e) {

        $('#register_waiting_create').addClass('active_wait');

        var date = new Date();
        date.setDate(date.getDate() + 7);
        var timeCurrent = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

        var dayNumbers = ($('#tripPlan-dayNumbers').val() == '') ? 1 : $('#tripPlan-dayNumbers').val(),
            nameTrip = ($('#tripPlan-tripName').val() == '') ? 'Du lịch trip3s' : $('#tripPlan-tripName').val(),
            userNumbers = ($('#tripPlan-userNumbers').val() == '') ? 1 : $('#tripPlan-userNumbers').val(),
            planStart = ($('#tripPlan-planStart').val() == '') ? timeCurrent : $('#tripPlan-planStart').val(),
            timeStart = ($('#tripPlan-timeStart').val() == '') ? timeCurrent : $('#tripPlan-timeStart').val(),
            timeEnd = ($('#tripPlan-timeEnd').val() == '') ? timeCurrent : $('#tripPlan-timeEnd').val(),
            moneyNumbers = ($('#tripPlan-moneyNumbers').val() == '') ? 1 : $('#tripPlan-moneyNumbers').val(),
            ignoreFee = ($('#tripPlan-ignoreFee').is(":checked")) ? true : false;

        tripPlan.dayNumber = parseFloat(dayNumbers),
        tripPlan.moneyNumber = parseFloat(moneyNumbers),
        tripPlan.userNumber = parseFloat(userNumbers);
        tripPlan.tripName = nameTrip;
        tripPlan.timeStart = timeStart;
        tripPlan.timeEnd = timeEnd;
        tripPlan.ignoreFee = ignoreFee;
        tripPlan.planStart = planStart;

        var _placeBegin = $('select[name="tripPlan[placeBegin]"]').val();

        var _places = merge_places(tripPlan);


        tripPlan.placeBegin = tripPlan.placeEnd = load_place_selected(_places, _placeBegin);

        for (var i = 1; i <= tripPlan.dayNumber; i++) {

            tripPlan.schedules["Day_" + i] = {
                timeTemp: timeStart,
                timeStart: timeStart,
                userNumber: parseFloat(userNumbers),
                timeEnd: timeEnd,
                ignoreFee: ignoreFee,
                moneyNumber: (parseFloat(moneyNumbers) / tripPlan.dayNumber).toFixed(2),
                currentNumber: i,
                placeBegin: tripPlan.placeBegin,
                placeEnd: tripPlan.placeBegin,
                placeLists: [],
                placeIds: []
            }
        };

        tripPlan.schedules = convArrToObj(tripPlan.schedules);


        var devide = devide_places(tripPlan, _places);
        tripPlan.placeLists = devide.placeLists;
        tripPlan.placeIds = devide.placeIds;
        var obj = window.javo_map_box_func;

        obj.ajax_favoriteu(tripPlan.placeLists);

        //remove place 
        $.post('/api/trip3sPlan', {
            plan: stringify(tripPlan)
        }, function(data) {
            tripPlan = data.plan;
            $('#register_waiting_create').removeClass('active_wait');
            $('.btn-box-plan').trigger('click');
        });
    });
    $(document).on('click', '.btn-save-detail-advance-plan', function(e) {
        $('#register_waiting_create').addClass('active_wait');

        var date = new Date();
        date.setDate(date.getDate() + 7);
        var timeCurrent = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

        var dayNumbers = ($('#tripPlan-dayNumbers').val() == '') ? 1 : $('#tripPlan-dayNumbers').val(),
            userNumbers = ($('#tripPlan-userNumbers').val() == '') ? 1 : $('#tripPlan-userNumbers').val(),
            planStart = ($('#tripPlan-planStart').val() == '') ? timeCurrent : $('#tripPlan-planStart').val();

        tripPlan.planStart = planStart;
        tripPlan.dayNumber = parseFloat(dayNumbers),
        tripPlan.userNumber = parseFloat(userNumbers);

        var _placeBegin = $('select[name="tripPlan[placeBegin]"]').val();

        var _places = merge_places(tripPlan),
            moneyNumbers = 0;


        tripPlan.placeBegin = tripPlan.placeEnd = load_place_selected(_places, _placeBegin);

        tripPlan.schedules = [];
        tripPlan.schedules = {};
        for (var i = 1; i <= tripPlan.dayNumber; i++) {

            var userNumbers = ($('input[name="tripPlan_placeUser_' + i + '"]').val() == '') ? 1 : $('input[name="tripPlan_placeUser_' + i + '"]').val(),
                timeStart = ($('input[name="tripPlan_timeBegin_' + i + '"]').val() == '') ? tripPlan.timeStart : $('input[name="tripPlan_timeBegin_' + i + '"]').val(),
                timeEnd = ($('input[name="tripPlan_timeEnd_' + i + '"]').val() == '') ? tripPlan.timeEnd : $('input[name="tripPlan_timeEnd_' + i + '"]').val(),
                moneyNumber = ($('input[name="tripPlan_placeMoney_' + i + '"]').val() == '') ? 0 : $('input[name="tripPlan_placeMoney_' + i + '"]').val(),

                ignoreFee = ($('#tripPlan_ignoreFee_' + i).is(":checked")) ? true : false,

                _placeBegin = $('select[name="tripPlan_placeBegin_' + i + '"]').val(),
                _placeEnd = $('select[name="tripPlan_placeEnd_' + i + '"]').val();

            if (typeof _placeBegin == 'undefined') {
                _placeBegin = $('select[name="tripPlan_placeEnd_' + (i - 1) + '"]').val()
            };

            moneyNumbers += parseFloat(moneyNumber);
            $('input[name="tripPlan_placeMoney_' + i + '"]').val(parseFloat(moneyNumber));
            if (timeStart == 0) timeStart = 7.5;
            if (timeEnd == 0) timeEnd = 24;
            tripPlan.schedules["Day_" + i] = {
                timeTemp: timeStart,
                timeStart: timeStart,
                timeEnd: timeEnd,
                userNumber: userNumbers,
                moneyNumber: moneyNumber,
                currentNumber: i,
                ignoreFee: ignoreFee,
                placeBegin: load_place_selected(_places, _placeBegin),
                placeEnd: load_place_selected(_places, _placeEnd),
                placeLists: [],
                placeIds: []
            }
        };

        tripPlan.moneyNumber = parseFloat(moneyNumbers);
        $('#tripPlan-moneyNumbers').val(parseFloat(moneyNumbers));
        tripPlan.schedules["Day_Not"] = {

            placeLists: [],
            placeIds: []
        }

        tripPlan.schedules = convArrToObj(tripPlan.schedules);
        var devide = devide_places(tripPlan, _places);
        tripPlan.placeLists = devide.placeLists;
        tripPlan.placeIds = devide.placeIds;

        var obj = window.javo_map_box_func;

        obj.ajax_favoriteu(tripPlan.placeLists);


        //remove place 
        $.post('/api/trip3sPlan', {
            plan: stringify(tripPlan)
        }, function(data) {
            console.log("Successfully!");
            tripPlan = data.plan;
            $('#register_waiting_create').removeClass('active_wait');
            $('.btn-box-plan').trigger('click');
        });
    });

    function removePlace(places, element) {
        for (var i = 0; i < places.length; i++) {
            if (places[i].place_id == element.place_id) {
                places.splice(i, 1);
            };
        };
        return places;
    }
    $(document).on('click', '.javo-mhome-onoff-sidebar', function(e) {

        if ($('.javo_mhome_sidebar').css('width') == "300px") {
            $('.javo_mhome_sidebar').css("width", "0px");
            $('.javo_mhome_sidebar .well-default').fadeOut();
            $(this).html('<i class="fa fa-chevron-circle-right"></i>');
        } else {
            $('.javo_mhome_sidebar').css("width", "300px");
            $('.javo_mhome_sidebar .well-default').fadeIn();
            $(this).html('<i class="fa fa-chevron-circle-left"></i>');
        };
        hide_setting();
    });

    function update_announcement() {
        $('.list-announcement li').each(function() {
            $(this).fadeOut(7000, function() {
                $(this).slideUp(3000).remove();
            });
        });
    }
    var BTN_OK = $('[javo-alert-ok]').val();
    var ERR_LOC_ACCESS = $('[javo-location-access-fail]').val();
    var arrPolylineOptions = [],
        arrDirectionsDisplay = [];
    window.javo_map_box_func = {

        options: {

            // Javo Configuration
            config: {
                items_per: $('[name="javo-box-map-item-count"]').val()
            }

            // Google Map Parameter Initialize
            ,
            map_init: {
                map: {
                    options: {
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        mapTypeControl: true,
                        panControl: false,
                        scrollwheel: true,
                        streetViewControl: true,
                        zoomControl: true,
                        zoomControlOptions: {
                            position: google.maps.ControlPosition.RIGHT_BOTTOM,
                            style: google.maps.ZoomControlStyle.SMALL
                        }
                    },
                    events: {
                        click: function() {
                            var obj = window.javo_map_box_func;
                            obj.close_ib_box();
                        }
                    }
                },
                panel: {
                    options: {
                        content: $('#javo-map-inner-control-template').html()
                    }
                }
            }

            // Javo Ajax MAIL
            ,
            javo_mail: {
                subject: $("input[name='contact_name']"),
                from: $("input[name='contact_email']"),
                content: $("textarea[name='contact_content']"),
                to_null_msg: "Please, insert recipient's email address.",
                from_null_msg: "Please, insert sender's email address.",
                subject_null_msg: "Please, insert your name.",
                content_null_msg: "Please, insert message content.",
                successMsg: "Successfully sent!",
                failMsg: "Sorry, your message could not be sent.",
                confirmMsg: "Do you want to send this message?",
                url: "http://javothemes.com/directory/demo2/wp-admin/admin-ajax.php"
            }

            // Google Point Of Item(POI) Option
            ,
            map_style: [{
                featureType: "poi",
                elementType: "labels",
                stylers: [{
                    visibility: "off"
                }]
            }],
            // Google Array polyline option
        } // End Options,
        ,
        variable: {
            top_offset: parseInt($('header > nav').outerHeight() || 0) +
                parseInt($('#wpadminbar').outerHeight() || 0)

            // Topbar is entered into Header Navigation.
            // + $('.javo-topbar').outerHeight()

        }
        // Javo Maps Initialize
        ,
        init: function() {

            /*
             *	Initialize Variables
             */
            var obj = this;

            // Map Element
            this.el = $('.javo_mhome_map_area');

            // Google Map Bind
            this.el.gmap3(this.options.map_init);
            this.map = this.el.gmap3('get');

            this.tags = $('[javo-map-all-tags]').val().toLowerCase().split('|');

            // Layout
            this.layout();

            // Trigger Resize
            this.resize();

            // Setup Distance Bar
            this.setDistanceBar();

            // Setup Auto Complete
            this.setAutoComplete();

            // Hidden Footer
            $('.container.footer-top').remove();

            // Set Google Information Box( InfoBubble )
            this.setInfoBubble();

            // Ajax
            this.ajaxurl = $("[javo-ajax-url]").val();

            var is_cross_domain = $("[javo-cross-domain]").val();
            var json_ajax_url = $("[javo-map-all-items]").val();
            var parse_json_url = json_ajax_url;

            if (is_cross_domain) {

                parse_json_url = this.ajaxurl;
                parse_json_url += "?action=javo_get_json";
                parse_json_url += "&fn=" + json_ajax_url;
                parse_json_url += "&callback=?";
            }

            // Events
            ;
            $(document)
                .on('click', '.javo-hmap-marker-trigger', this.marker_on_list)
                .on('click', '.showMap-place', this.showmap_place)
                .on('click', '.btn-filter-place', this.filter_trigger)
                .on('click', '.btn-filter-remove', this.filter_remove)
                .on('click', '.btn-filter-my-location', this.filter_mylocation)
                .on('click', '[data-javo-map-load-more]', this.load_more)
                .on('click', '[data-javo-hmap-sort]', this.order_switcher)
                .on('click', '[data-map-move-allow]', this.map_locker)
                .on('click', '#javo-map-box-search-button', this.search_button)
                .on('click', 'li[data-javo-hmap-ppp]', this.trigger_ppp)
                .on('click', '#contact_submit', this.submit_contact)
                .on('click', '.javo-mhome-sidebar-onoff', this.trigger_favorite)
                .on('click', '.javo-my-position', this.getMyPosition)
                .on('click', '#showMap-plan', this.drawRoute)


            ;
            $(window)
                .on('resize', this.resize);


        } // End Initialize Function
        ,
        drawRoutePreview: function(schedule, map) {
            var myLatlng = {
                lat: -25.363,
                lng: 131.044
            };
            var obj = window.javo_map_box_func,
                currDay = $("#dropdown-select-days").attr("data-place_id");
            var _schedule = schedule;
            var items = _SaveArray(_schedule.placeLists);
            if (items.length < 1) {
                return;
            };

            items.unshift(_schedule.placeBegin);
            if (_schedule.placeBegin.place_id != _schedule.placeEnd.place_id) {
                items.push(_schedule.placeEnd);
            };


            obj.setMarkersPreview(items, true, true, $('#map-schedule-' + schedule.currentNumber));
            var lengthItems = items.length;
            var arrRequest = [],
                strHtml = '';

            for (var i = 0; i < lengthItems; i++) {
                if (i < lengthItems - 1) {
                    obj.drawRoutePointPreview(items[i], items[i + 1], schedule.currentNumber, map);
                } else {
                    obj.drawRoutePointPreview(items[i], items[0], schedule.currentNumber, map);
                };
            };
        },
        drawRoutePointPreview: function(place1, place2, index, map) {
            var obj = window.javo_map_box_func;
            var color = '#ec' + Math.floor((Math.random() * 10) + 1) + '71f'
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
                suppressMarkers: true,
                polylineOptions: polylineOptionsActual
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

                    directionsDisplay.setPanel(document.getElementById("content-detail-next-place-" + place1.place_id + "-" + index));
                }
            });
        }
        // End Initialize Function
        ,
        drawRoute: function() {
            var myLatlng = {
                lat: -25.363,
                lng: 131.044
            };
            var obj = window.javo_map_box_func,
                currDay = $(this).data('day');
            var _schedule = tripPlan.schedules["Day_" + currDay];
            var items = _SaveArray(_schedule.placeLists);
            if (items.length < 1) {
                return;
            };
            items.unshift(_schedule.placeBegin);
            if (_schedule.placeBegin.place_id != _schedule.placeEnd.place_id) {
                items.push(_schedule.placeEnd);
            };
            obj.items = items;
            obj.setMarkers(items, true, true);
            var lengthItems = items.length;
            var arrRequest = [],
                strHtml = '';
            tripPlan.schedules["Day_" + currDay].distance = 0;

            for (var i = 0; i < lengthItems; i++) {
                if (i < lengthItems - 1) {
                    obj.drawRoutePoint(items[i], items[i + 1]);
                } else {
                    obj.drawRoutePoint(items[i], items[0]);
                };
            };
        } //End draw route
        ,
        drawRoutePoint: function(place1, place2) {
            var obj = window.javo_map_box_func,
                currDay = $("#dropdown-select-days").attr("data-place_id");
            var color = '#ec' + Math.floor((Math.random() * 10) + 1) + '71f'
                //Set up options color in road result
            var polylineOptionsActual = new google.maps.Polyline({
                strokeColor: color,
                strokeOpacity: 1,
                strokeWeight: 5
            });
            arrPolylineOptions.push(polylineOptionsActual);

            var directionsService = new google.maps.DirectionsService();
            var directionsDisplay;
            //remove icon start and end of result
            var rendererOptions = {
                map: obj.map,
                suppressMarkers: true,
                polylineOptions: polylineOptionsActual
            }
            directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
            arrDirectionsDisplay.push(directionsDisplay);
            var request = {
                origin: new google.maps.LatLng(place1.place_lat, place1.place_lng),
                destination: new google.maps.LatLng(place2.place_lat, place2.place_lng),
                travelMode: google.maps.TravelMode.DRIVING
            };
            //distance of 2 position in map
            var distance = google.maps.geometry.spherical.computeDistanceBetween(request.origin, request.destination);
            //tripPlan.schedules[currDay-1].distance +=distance.toFixed(2);;
            //console.log("Distance: " + distance.toFixed(2) + " m");

            directionsService.route(request, function(result, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(result);
                    directionsDisplay.setPanel(document.getElementById("router-panel-" + place1.place_id));
                }
            });
        },
        getDistancePoint: function(place1, place2) {
            var directionsService = new google.maps.DirectionsService(),
                directionsDisplay;
            var obj = window.javo_map_box_func;
            //remove icon start and end of result
            var rendererOptions = {
                map: obj.map,
                suppressMarkers: false
            }
            directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);

            var request = {
                origin: new google.maps.LatLng(place1.place_lat, place1.place_lng),
                destination: new google.maps.LatLng(place2.place_lat, place2.place_lng),
                travelMode: google.maps.TravelMode.DRIVING
            };
            directionsService.route(request, function(result, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    return {
                        distance: parseFloat((result.routes[0].legs[0].distance.value / 1000).toFixed(2)),
                        duration: parseFloat((result.routes[0].legs[0].duration.value / 3600).toFixed(2))
                    };
                }
                /*else {    
			            setTimeout(function() {
			            	tripPlan.vectorDistances["T"+_places[i].place_id.toString()]["T"+_places[j].place_id.toString()] = obj.getDistancePoint(place1,place2);
			            }, 200);
			        }*/
                console.log(status);
            });

            var d = parseFloat((google.maps.geometry.spherical.computeDistanceBetween(request.origin, request.destination) / 1000).toFixed(2));
            return {
                distance: d,
                duration: parseFloat((d / 40).toFixed(2))
            };
        },
        clear_map: function() {
            //
            this.el.gmap3({
                clear: {
                    name: ['marker', 'circle']
                }
            });
            this.close_ib_box();
            if (arrPolylineOptions.length > 0) {
                for (var i = 0; i < arrPolylineOptions.length; i++) {
                    arrPolylineOptions[i].setMap(null);
                };
            };
            if (arrDirectionsDisplay.length > 0) {
                for (var i = 0; i < arrDirectionsDisplay.length; i++) {
                    arrDirectionsDisplay[i].setMap(null);
                };
            };

        }

        ,
        close_ib_box: function() {
            if (typeof this.infoWindo != "undefined") {
                this.infoWindo.close();
            }
        }

        ,
        filter_trigger: function(e) {
            var obj = window.javo_map_box_func;

            obj.filter();

        }


        ,
        layout: function() {

            var obj = window.javo_map_box_func;

            // Initalize DOC
            $('body').css('overflow', 'hidden');

            // POI Setup
            if ($('[name="javo_google_map_poi"]').val() == "off") {
                // Map Style
                this.map_style = new google.maps.StyledMapType(this.options.map_style, {
                    name: 'Javo Box Map'
                });
                this.map.mapTypes.set('map_style', this.map_style);
                this.map.setMapTypeId('map_style');
            }

            // Show Loading

            this.loading(true);

            $(window).load(function() {
                /*
					$('.javo_mhome_sidebar')
						.removeClass('hidden')
						.css({
							marginLeft:  (-$('.javo_mhome_sidebar').outerWidth()) + 'px'
							, marginTop: obj.variable.top_offset + 'px'
						});*/
            });

        } // End Set Layout

        ,
        resize: function() {
            var obj = window.javo_map_box_func;
            var winX = $(window).width();
            var winYz = $(window).height();
            var winY = 0;
            var header_sidebar = 86,
                javo_mhome_sidebar = 300,
                content_sidebar = 0;
            var bottom_review = 0;
            bottom_review = $('#review_plans').outerHeight(true)
            winY += $('header.main').outerHeight(true);
            winY += $('#wpadminbar').outerHeight(true);
            winYz -= winY + 1;
            //header_sidebar = $('.panel-heading.header-detail-add-plan').outerHeight(true);
            //javo_mhome_sidebar = $('.javo_mhome_sidebar').outerHeight(true);
            //content_sidebar =parseFloat(javo_mhome_sidebar) -parseFloat(header_sidebar) -winY - 110;
            // Topbar is entered into Header Navigation.
            // winY += $('div.javo-topbar').outerHeight(true);

            //$('.body-detail-add-plan').css( 'height', content_sidebar);
            //$('.body-detail-add-plan').css( 'top', winY);
            //$('.body-detail-add-plan').css( 'height', (content_sidebar + 130));
            //$('div.schedule-day-boby-detail').css( 'height', content_sidebar);
            //$('div.schedule-day-boby-detail-fix').css( 'height', content_sidebar);
            //$('div.body-detail-create-plan').css( 'height', content_sidebar + 100);

            //$('ul.schedule-day-boby.scrollbar').css( 'height', content_sidebar+40);

            $('.schedule-day-boby-detail .schedule-day-boby-detail-fix ').css('height', winYz - 120 - bottom_review);
            $('.schedule-day-boby-detail .schedule-day-boby').css('height', winYz - 110 - bottom_review);

            $('.schedule-day-boby-detail .schedule-day-boby-detail-fix .schedule-day-boby').css('height', 'auto');
            $('#sidebar-desciption .panel-body-nopadding').css('height', winYz - 80 - bottom_review);
            $('#sidebar-setups .panel-body-nopadding').css('height', winYz - 80 - bottom_review);

            //$('.javo_mhome_sidebar_wrap').css( 'height', winYz );

            $('.javo_mhome_map_lists').css('height', winYz - bottom_review);

            if (parseInt(winX) >= 1120) {
                $('html, body').css('overflowY', 'hidden');
            } else {
                $('html, body').css('overflowY', 'auto');
            }

            // Setup Map Height
            obj.el.height($(window).height() - winY - bottom_review);

            if (winX > 1500) {
                $('.body-content').find('.item').addClass('col-lg-4');
            } else {
                $('.body-content').find('.item').removeClass('col-lg-4');
            };

        } // End Responsive( Resize );

        ,
        loading: function(on) {
            this.login_cover = $('.javo_mhome_wrap > .map_cover');
            if (on) {
                this.login_cover.addClass('active');
            } else {
                this.login_cover.removeClass('active');
            }

        } // End Loading View

        ,
        setDistanceBar: function() {
            var obj = this;
            var _unit = $("[javo-distance-unit]").val() || 'km';
            var unitcon = _unit != 'km' ? 1609.344 : 1000;
            var _max = $("[javo-distance-max]").val() || 1000;
            var cur, step, max;

            max = parseInt(_max) * unitcon;
            step = parseInt(max) / 100;
            cur = parseInt(max) / 2;

            var el = $(".javo-geoloc-slider");
            var opt = {
                start: cur,
                step: step,
                connect: 'lower',
                range: {
                    'min': 0,
                    'max': max
                },
                serialization: {
                    lower: [
                        $.Link({
                            target: '-tooltip-<div class="javo-slider-tooltip"></div>',
                            method: function(v) {
                                $(this).html('<span>' + v + '&nbsp;' + _unit + '</span>');
                            },
                            format: {
                                decimals: 0,
                                thousand: ',',
                                encoder: function(a) {
                                    return a / unitcon;
                                }
                            }
                        })
                    ]
                }
            };
            el
                .noUiSlider(opt)
                .on('set', function(e) {
                    if (!$('.javo-my-position').hasClass('active')) return false;

                    var distance = parseInt($(this).val());

                    obj.el.gmap3({
                        getgeoloc: {
                            callback: function(latlng) {

                                if (!latlng) {
                                    $.javo_msg({
                                        content: ERR_LOC_ACCESS,
                                        button: BTN_OK
                                    });
                                    return false;
                                };

                                var result = [];
                                var data = obj.items;

                                $.each(obj.items, function(i, k) {
                                    var c = obj.setCompareDistance(new google.maps.LatLng(k.lat, k.lng), latlng);

                                    if ((c * unitcon) <= distance) {
                                        result.push(data[i]);
                                    }
                                });

                                window.__JAVO_MAP_BOX_TEMP__ = result
                                obj.filter(result);

                                obj.map_clear(false);
                                obj.el.gmap3({
                                    clear: {
                                        name: 'circle'
                                    }
                                });

                                $(this).gmap3({
                                    circle: {
                                        options: {
                                            center: latlng,
                                            radius: distance,
                                            fillColor: '#000000',
                                            strokeColor: '#1A759C'
                                        }
                                    }
                                }, {
                                    get: {
                                        name: 'circle',
                                        callback: function(c) {
                                            $(this).gmap3('get').fitBounds(c.getBounds());
                                        }
                                    }
                                });
                            }
                        }
                    });
                }) // End

            .prop('disabled', true)
                .addClass('disabled');


        } // End Setup Distance noUISlider

        ,
        setAutoComplete: function() {
            $('[name^="filter"]').chosen({
                width: '100%',
                search_contains: 1
            });

        } // End Setup AutoComplete Chosen Apply

        ,
        setRating: function() {
            $('.javo-rating-registed-score').each(function(k, v) {
                $(this).raty({
                    starOff: '/assets/images/star-off-s.png',
                    starOn: '/assets/images/star-on-s.png',
                    starHalf: '/assets/images/star-half-s.png',
                    half: true,
                    readOnly: true,
                    score: $(this).data('score')
                }).css('width', '');
            });
        }

        ,
        map_locker: function(e) {
            e.preventDefault();

            var obj = window.javo_map_box_func;

            $(this).toggleClass('active');
            if ($(this).hasClass('active')) {
                // Allow
                obj.map.setOptions({
                    draggable: true,
                    scrollwheel: true
                });
                $(this).find('i').removeClass('fa fa-lock').addClass('fa fa-unlock');
            } else {
                // Not Allowed
                obj.map.setOptions({
                    draggable: false,
                    scrollwheel: false
                });
                $(this).find('i').removeClass('fa fa-unlock').addClass('fa fa-lock');
            }
        }



        /** GOOGLE MAP TRIGGER				*/

        ,
        setInfoBubble: function() {
            this.infoWindo = new InfoBubble({
                minWidth: 362,
                minHeight: 225,
                overflow: true,
                shadowStyle: 1,
                padding: 5,
                borderRadius: 10,
                arrowSize: 20,
                borderWidth: 1,
                disableAutoPan: false,
                hideCloseButton: false,
                arrowPosition: 50,
                arrowStyle: 0
            });
        } // End Setup InfoBubble

        ,
        trigger_ppp: function(e) {
            e.preventDefault();
            var obj = window.javo_map_box_func;
            obj.filter();
        }

        ,
        search_button: function(e) {
            e.preventDefault();
            var obj = window.javo_map_box_func;
            obj.filter();
        }

        ,
        keywordMatchesCallback: function(tags) {
            return function keywordFindMatches(q, cb) {
                var matches, substrRegex;

                substrRegex = new RegExp(q, 'i');
                matches = [];

                $.each(tags, function(i, tag) {
                    if (substrRegex.test(tag)) {
                        matches.push({
                            value: tag
                        });
                    }
                });
                cb(matches);
            }
        },
        setKeywordAutoComplete: function() {
            this.el_keyword = $('#javo-map-box-auto-tag');

            this.el_keyword.typeahead({
                hint: false,
                highlight: true,
                minLength: 1
            }, {
                name: 'tags',
                displayKey: 'value',
                source: this.keywordMatchesCallback(this.tags)
            }).closest('span').css({
                width: '100%'
            });
        },
        append_load_more: function() {
            var obj = window.javo_map_box_func;
            obj.apply_filters();
        },
        showmap_place: function() {
            var obj = window.javo_map_box_func;
            obj.clear_map();
            obj.loading(true);
            obj.clear_map();
            obj.items = tripPlan.placeIds;
            obj.setMarkers(tripPlan.placeLists, false, true);
            obj.append_list_items(tripPlan.placeLists);
            $("ol#schedule-day-boby").sortable();
        },
        filter_mylocation: function() {

        },
        filter_remove: function() {
            var obj = window.javo_map_box_func;
            $('.javo_mhome_map_output #products').empty();
            $('[data-javo-map-load-more]').attr('data-javo-map-load-more', 0);
            obj.loading(true);
            obj.clear_map();
            obj.items = [];
            $(".input-filter-text").val("");
            $('select[name^="filter"]').val('').trigger('chosen:updated');
        },
        filter: function(data) {
            var obj = window.javo_map_box_func;
            $('.javo_mhome_map_output #products').empty();
            $('[data-javo-map-load-more]').attr('data-javo-map-load-more', 0);
            obj.loading(true);
            obj.clear_map();
            obj.items = [];
            obj.apply_filters();
        },
        apply_filters: function() {
            console.log("start apply");
            var obj = window.javo_map_box_func;
            var btn = $('[data-javo-map-load-more]');
            var _limit = parseInt($("#javo-map-box-ppp").val()) || 12;

            var _offset = parseInt(btn.attr('data-javo-map-load-more')) * _limit;

            var result = {};
            var cate_ids = {},
                pro_ids = {},
                cui_ids = {},
                did_ids = {},
                pur_ids = {},
                city_ids = {},
                dis_ids = {},
                area_ids = {},
                fl_keyword = '',
                userId = 0;
            fl_keyword = $("input[name='fl_keyword']").val();
            cate_ids = $("select[name='filter[item_category]']").val();
            city_ids = $("select[name='filter[item_city]']").val();
            dis_ids = $("select[name='filter[item_district]']").val();
            area_ids = $("select[name='filter[item_area]']").val();
            pro_ids = $("select[name='filter[item_property]']").val();
            cui_ids = $("select[name='filter[item_cuisine]']").val();
            did_ids = $("select[name='filter[item_diding]']").val();
            pur_ids = $("select[name='filter[item_purpose]']").val();
            if ($(".btn-filter-my-location").is(":checked")) {

                if (user.id == 0 || user.id < 1) {
                    alert("Bạn phải đăng nhập trước.!");
                    return false;
                };
                userId = user.id;
            };
            // DATA
            btn.prop('disabled', true).find('i').addClass('fa-spin');
            $.getJSON('/api/load_place_filter', {
                keyword: fl_keyword,
                cityIds: city_ids,
                districtIds: dis_ids,
                areaIds: area_ids,
                cateIds: cate_ids,
                proIds: pro_ids,
                cuiIds: cui_ids,
                didIds: did_ids,
                purIds: pur_ids,
                userId: userId,
                offset: _offset,
                limit: _limit
            })
                .done(function(data) {
                    console.log("success load");
                    obj.apply_item = data.places;
                    obj.items = obj.items.concat(data.places);
                    if ($('.javo-my-position').hasClass('active')) {
                        var items = window.__JAVO_MAP_BOX_TEMP__ || obj.items;
                    } else {
                        var items = obj.items
                    }
                    obj.setMarkers(items, false, true);
                    obj.append_list_items(data.places);

                }).fail(function(jqxhr, textStatus, error) {

                    console.log('error 1');
                });
            return obj.apply_item;
        },
        tag_matche: function(str, keyword) {
            var i = 0;
            if (str != "") {
                for (i in str) {
                    // In Tags ?
                    if (str[i].toLowerCase().match(keyword)) {
                        return true;
                    }
                }
            }
            return false;
        }

        ,
        setMarkers: function(response, clear, icon) {
            var item_markers = new Array();
            var obj = window.javo_map_box_func;
            if (typeof clear != 'Undefined' && clear == true) {
                obj.clear_map();
            };

            $.each(response, function(i, item) {

                if (item.lat != "" && item.lng != "") {
                    var k = 1;
                    if (i == response.length - 1) {
                        k = 0
                    } else {
                        k = i + 1
                    };
                    /*
						var dis = obj.setCompareDistance(new google.maps.LatLng( item.place_lat, item.place_lng ),
							new google.maps.LatLng( response[k].place_lat, response[k].place_lng ) );
						console.log(dis);*/

                    var icon_content = '';
                    if (typeof icon !== 'undefined' && icon == true) {
                        icon_content = '<span class="icon-item-place-number" >' + (i + 1) + '</span>';
                    };

                    item_markers.push({
                        //latLng		: new google.maps.LatLng( item.lat, item.lng )
                        lat: item.place_lat,
                        lng: item.place_lng,
                        thumbnail: item.post_thumbnail

                        ,
                        options: {
                            icon: item.post_thumbnail,
                            content: icon_content + '<img src="' + item.post_thumbnail + '"  width="40" height="40" class="icon-item-place"  />'
                        },
                        id: "mid_" + item.post_id,
                        data: item
                    });
                }
            });

            if (item_markers.length > 0) {

                var _opt = {
                    marker: {
                        values: item_markers,
                        events: {
                            click: function(m, e, c) {

                                var map = $(this).gmap3('get');


                                $.get(
                                    '/api/trip3s_place_by_id', {
                                        post_id: c.data.post_id
                                    }, function(response) {
                                        var str = '',
                                            nstr = '';

                                        if (response.state == "success") {

                                            str = $('#javo-map-box-infobx-content').html();
                                            str = str.replace(/{post_id}/g, response.post_id);
                                            str = str.replace(/{post_title}/g, response.post_title);
                                            str = str.replace(/{permalink}/g, response.permalink);
                                            str = str.replace(/{thumbnail}/g, response.thumbnail);
                                            str = str.replace(/{category}/g, response.category);
                                            str = str.replace(/{location}/g, response.location);
                                            str = str.replace(/{phone}/g, response.phone || nstr);
                                            str = str.replace(/{mobile}/g, response.mobile || nstr);
                                            str = str.replace(/{website}/g, response.website || nstr);
                                            str = str.replace(/{email}/g, response.email || nstr);
                                            str = str.replace(/{address}/g, response.address || nstr);
                                            str = str.replace(/{author_name}/g, response.author_name || nstr);

                                        } else {
                                            str = "error";
                                        }
                                        obj.infoWindo.setContent(str);
                                        obj.infoWindo.open(map, m);
                                        map.setCenter(m.getPosition());
                                        $("#javo-map-info-w-content").html(str);
                                    }, "json"
                                )
                                    .fail(function(response) {

                                        $.javo_msg({
                                            content: $("[javo-server-error]").val(),
                                            delay: 10000
                                        });
                                        console.log(response.responseText);

                                    });
                            } // End Click
                        } // End Event
                    } // End Marker
                }


                if ($("[javo-cluster-onoff]").val() != "disable") {

                    _opt.marker.cluster = {
                        radius: parseInt($("[javo-cluster-level]").val()) || 100,
                        0: {
                            content: '<div class="javo-map-cluster admin-color-setting">CLUSTER_COUNT</div>',
                            width: 52,
                            height: 52
                        },
                        events: {
                            click: function(c, e, d) {
                                var $map = $(this).gmap3('get');
                                var maxZoom = new google.maps.MaxZoomService();
                                var c_bound = new google.maps.LatLngBounds();

                                // IF Cluster Max Zoom ?
                                maxZoom.getMaxZoomAtLatLng(d.data.latLng, function(response) {
                                    if (response.zoom <= $map.getZoom() && d.data.markers.length > 0) {
                                        var str = '';

                                        str += "<ul class='list-group'>";

                                        str += "<li class='list-group-item disabled text-center'>";
                                        str += "<strong>";
                                        str += $("[javo-cluster-multiple]").val();
                                        str += "</strong>";
                                        str += "</li>";

                                        $.each(d.data.markers, function(i, k) {
                                            str += "<a onclick=\"window.javo_map_box_func.marker_trigger('" + k.id + "');\" ";
                                            str += "class='list-group-item'>";
                                            str += k.data.post_title;
                                            str += "</a>";
                                        });

                                        str += "</ul>";
                                        var hMarker = new google.maps.Marker({
                                            position: c.main.getPosition(),
                                            map: $map,
                                            icon: ''
                                        });

                                        obj.infoWindo.setContent(str);
                                        obj.infoWindo.open($map, hMarker);
                                        hMarker.setMap(null);

                                    } else {
                                        $map.setCenter(c.main.getPosition());
                                        $map.setZoom($map.getZoom() + 2);
                                    }
                                }); // End Get Max Zoom
                            } // End Click
                        } // End Event
                    } // End Cluster
                } // End If

                this.el.gmap3(_opt, "autofit");
            }
        },
        setMarkerUsers: function(response) {
            var item_markers = new Array();
            var obj = window.javo_map_box_func;
            obj.clear_map();
            $.each(response, function(i, item) {

                if (item.lat != "" && item.lng != "") {
                    var k = 1;
                    if (i == response.length - 1) {
                        k = 0
                    } else {
                        k = i + 1
                    };

                    var icon_content = '';
                    icon_content = '<span class="icon-item-place-number" >' + (i + 1) + '</span>';

                    item_markers.push({
                        //latLng		: new google.maps.LatLng( item.lat, item.lng )
                        lat: item.location.lat,
                        lng: item.location.lng,
                        thumbnail: item.user_thumbnail

                        ,
                        options: {
                            icon: item.user_thumbnail,
                            content: icon_content + '<img src="' + item.user_thumbnail + '"  width="40" height="40" class="icon-item-place"  />'
                        },
                        id: "user_" + item.id,
                        data: item
                    });
                }
            });

            if (item_markers.length > 0) {

                var _opt = {
                    marker: {
                        values: item_markers,
                        events: {
                            click: function(m, e, c) {

                                var map = $(this).gmap3('get');


                                $.get(
                                    '/api/trip3s_user_by_id', {
                                        user_id: c.data.id
                                    }, function(response) {

                                        var str = '',
                                            nstr = '';

                                        if (response.state == "success") {

                                            str = $('#javo-map-box-infobx-content-2').html();
                                            str = str.replace(/{{user-id}}/g, response.user.id);
                                            str = str.replace(/{{user-display}}/g, response.user.user_display);
                                            str = str.replace(/{{user-address}}/g, response.user.address);
                                            str = str.replace(/{{user-thumbnail}}/g, response.user.user_thumbnail);

                                        } else {
                                            str = "error";
                                        }
                                        obj.infoWindo.setContent(str);
                                        obj.infoWindo.open(map, m);
                                        map.setCenter(m.getPosition());
                                        $("#javo-map-info-w-content").html(str);
                                    }, "json"
                                )
                                    .fail(function(response) {

                                        $.javo_msg({
                                            content: $("[javo-server-error]").val(),
                                            delay: 10000
                                        });
                                        console.log(response.responseText);

                                    });
                            } // End Click
                        } // End Event
                    } // End Marker
                }


                if ($("[javo-cluster-onoff]").val() != "disable") {

                    _opt.marker.cluster = {
                        radius: parseInt($("[javo-cluster-level]").val()) || 100,
                        0: {
                            content: '<div class="javo-map-cluster admin-color-setting">CLUSTER_COUNT</div>',
                            width: 52,
                            height: 52
                        },
                        events: {
                            click: function(c, e, d) {
                                var $map = $(this).gmap3('get');
                                var maxZoom = new google.maps.MaxZoomService();
                                var c_bound = new google.maps.LatLngBounds();

                                // IF Cluster Max Zoom ?
                                maxZoom.getMaxZoomAtLatLng(d.data.latLng, function(response) {
                                    if (response.zoom <= $map.getZoom() && d.data.markers.length > 0) {
                                        var str = '';

                                        str += "<ul class='list-group'>";

                                        str += "<li class='list-group-item disabled text-center'>";
                                        str += "<strong>";
                                        str += $("[javo-cluster-multiple]").val();
                                        str += "</strong>";
                                        str += "</li>";

                                        $.each(d.data.markers, function(i, k) {
                                            str += "<a onclick=\"window.javo_map_box_func.marker_trigger('" + k.id + "');\" ";
                                            str += "class='list-group-item'>";
                                            str += k.data.post_title;
                                            str += "</a>";
                                        });

                                        str += "</ul>";
                                        var hMarker = new google.maps.Marker({
                                            position: c.main.getPosition(),
                                            map: $map,
                                            icon: ''
                                        });

                                        obj.infoWindo.setContent(str);
                                        obj.infoWindo.open($map, hMarker);
                                        hMarker.setMap(null);

                                    } else {
                                        $map.setCenter(c.main.getPosition());
                                        $map.setZoom($map.getZoom() + 2);
                                    }
                                }); // End Get Max Zoom
                            } // End Click
                        } // End Event
                    } // End Cluster
                } // End If
                console.log(_opt);
                this.el.gmap3(_opt, "autofit");
            }
        },
        setMarkersPreview: function(response, clear, icon, element) {
            var item_markers = new Array();
            var obj = window.javo_map_box_func;


            $.each(response, function(i, item) {

                if (item.lat != "" && item.lng != "") {
                    var k = 1;
                    if (i == response.length - 1) {
                        k = 0
                    } else {
                        k = i + 1
                    };

                    var icon_content = '';
                    if (typeof icon !== 'undefined' && icon == true) {
                        icon_content = '<span class="icon-item-place-number" >' + (i + 1) + '</span>';
                    };

                    item_markers.push({
                        //latLng		: new google.maps.LatLng( item.lat, item.lng )
                        lat: item.place_lat,
                        lng: item.place_lng,
                        thumbnail: item.post_thumbnail

                        ,
                        options: {
                            icon: item.post_thumbnail,
                            content: icon_content + '<img src="' + item.post_thumbnail + '"  width="40" height="40" class="icon-item-place"  />'
                        },
                        id: "mid_" + item.post_id,
                        data: item
                    });
                }
            });

            if (item_markers.length > 0) {

                var _opt = {
                    marker: {
                        values: item_markers,
                        events: {
                            click: function(m, e, c) {

                                var map = element.gmap3('get');


                                $.get(
                                    '/api/trip3s_place_by_id', {
                                        post_id: c.data.post_id
                                    }, function(response) {
                                        var str = '',
                                            nstr = '';

                                        if (response.state == "success") {

                                            str = $('#javo-map-box-infobx-content').html();
                                            str = str.replace(/{post_id}/g, response.post_id);
                                            str = str.replace(/{post_title}/g, response.post_title);
                                            str = str.replace(/{permalink}/g, response.permalink);
                                            str = str.replace(/{thumbnail}/g, response.thumbnail);
                                            str = str.replace(/{category}/g, response.category);
                                            str = str.replace(/{location}/g, response.location);
                                            str = str.replace(/{phone}/g, response.phone || nstr);
                                            str = str.replace(/{mobile}/g, response.mobile || nstr);
                                            str = str.replace(/{website}/g, response.website || nstr);
                                            str = str.replace(/{email}/g, response.email || nstr);
                                            str = str.replace(/{address}/g, response.address || nstr);
                                            str = str.replace(/{author_name}/g, response.author_name || nstr);

                                        } else {
                                            str = "error";
                                        }
                                        obj.infoWindo.setContent(str);
                                        obj.infoWindo.open(map, m);
                                        map.setCenter(m.getPosition());
                                        $("#javo-map-info-w-content").html(str);
                                    }, "json"
                                )
                                    .fail(function(response) {

                                        $.javo_msg({
                                            content: $("[javo-server-error]").val(),
                                            delay: 10000
                                        });
                                        console.log(response.responseText);

                                    });
                            } // End Click
                        } // End Event
                    } // End Marker
                }


                if ($("[javo-cluster-onoff]").val() != "disable") {

                    _opt.marker.cluster = {
                        radius: parseInt($("[javo-cluster-level]").val()) || 100,
                        0: {
                            content: '<div class="javo-map-cluster admin-color-setting">CLUSTER_COUNT</div>',
                            width: 52,
                            height: 52
                        },
                        events: {
                            click: function(c, e, d) {
                                var $map = $(this).gmap3('get');
                                var maxZoom = new google.maps.MaxZoomService();
                                var c_bound = new google.maps.LatLngBounds();

                                // IF Cluster Max Zoom ?
                                maxZoom.getMaxZoomAtLatLng(d.data.latLng, function(response) {
                                    if (response.zoom <= $map.getZoom() && d.data.markers.length > 0) {
                                        var str = '';

                                        str += "<ul class='list-group'>";

                                        str += "<li class='list-group-item disabled text-center'>";
                                        str += "<strong>";
                                        str += $("[javo-cluster-multiple]").val();
                                        str += "</strong>";
                                        str += "</li>";

                                        $.each(d.data.markers, function(i, k) {
                                            str += "<a onclick=\"window.javo_map_box_func.marker_trigger('" + k.id + "');\" ";
                                            str += "class='list-group-item'>";
                                            str += k.data.post_title;
                                            str += "</a>";
                                        });

                                        str += "</ul>";
                                        var hMarker = new google.maps.Marker({
                                            position: c.main.getPosition(),
                                            map: $map,
                                            icon: ''
                                        });

                                        obj.infoWindo.setContent(str);
                                        obj.infoWindo.open($map, hMarker);
                                        hMarker.setMap(null);

                                    } else {
                                        $map.setCenter(c.main.getPosition());
                                        $map.setZoom($map.getZoom() + 2);
                                    }
                                }); // End Get Max Zoom
                            } // End Click
                        } // End Event
                    } // End Cluster
                } // End If

                element.gmap3(_opt, "autofit");
            }
        }

        ,
        map_clear: function(marker_with) {
            var elements = new Array('rectangle');
            if (!$('.javo-my-position').hasClass('active'))
                elements.push('circle');

            if (marker_with)
                elements.push('marker');

            this.el.gmap3({
                clear: {
                    name: elements
                }
            });
            this.iw_close();
        }

        ,
        iw_close: function() {
            if (typeof this.infoWindo != "undefined") {
                this.infoWindo.close();
            }
        },
        load_more: function(e) {
            e.preventDefault();

            var obj = window.javo_map_box_func;
            obj.append_load_more();
        },
        append_list_items: function(data) {

            var btn = $('[data-javo-map-load-more]');
            var response = data;
            var buf = "";
            if (response.length > 0) {

                $.each(response, function(index, data) {
                    var str = "";
                    var dataStr = JSON.stringify(data);
                    dataStr = dataStr.replace(/[']/g, '');

                    str = $('#javo-map-box-panel-content').html();
                    str = str.replace(/{{day_in_place}}/g, update_day_in_place(tripPlan, data.place_id));
                    str = str.replace(/{place_full}/g, dataStr);
                    str = str.replace(/{post_id}/g, data.post_id);
                    str = str.replace(/{place_id}/g, data.place_id);
                    str = str.replace(/{post_title}/g, data.post_title || '');
                    str = str.replace(/{excerpt}/g, data.post_content || '');
                    str = str.replace(/{thumbnail_large}/g, data.post_thumbnail || '');
                    str = str.replace(/{permalink}/g, data.permalink || '');
                    str = str.replace(/{avatar}/g, data.avatar || '');
                    str = str.replace(/{rating}/g, data.rating || 0);
                    str = str.replace(/{favorite}/g, data.favorite || '');
                    str = str.replace(/{category}/g, data.category || '');
                    str = str.replace(/{place_lat}/g, data.place_lat || '');
                    str = str.replace(/{place_lng}/g, data.place_lng || '');
                    str = str.replace(/{location}/g, data.location || '');
                    buf += str;
                });

                $('.javo_mhome_map_output #products').append(buf);

                var page_ = parseInt(btn.attr('data-javo-map-load-more')) + 1;
                btn.attr('data-javo-map-load-more', page_);

                btn.prop('disabled', false).find('i').removeClass('fa-spin');

                // Apply Rating
                $('.javo-rating-registed-score').each(function(k, v) {
                    $(this).raty({
                        starOff: '/assets/images/star-off-s.png',
                        starOn: '/assets/images/star-on-s.png',
                        starHalf: '/assets/images/star-half-s.png',
                        half: true,
                        readOnly: true,
                        score: $(this).data('score')
                    }).css('width', '');
                });
            } else {
                $.javo_msg({
                    content: $("[javo-map-item-not-found]").val(),
                    delay: 1000,
                    close: false
                });
            }

            $("[name='btn_viewtype_switch']:checked").parent('label').trigger('click');

            btn.prop('disabled', false).find('i').removeClass('fa-spin');

        },
        trigger_marker: function(e) {
            var obj = window.javo_map_box_func;
            obj.el.gmap3({
                map: {
                    options: {
                        zoom: parseInt($("[javo-marker-trigger-zoom]").val())
                    }
                }
            }, {
                get: {
                    name: "marker",
                    id: $(this).data('id'),
                    callback: function(m) {
                        google.maps.event.trigger(m, 'click');
                    }
                }
            });
        },
        order_switcher: function(e) {
            e.preventDefault();
            var obj = window.javo_map_box_func;
            var ico = $(this).children('span');

            if ($(this).data('order') == 'desc') {
                $(this).data('order', 'asc');
                ico
                    .removeClass('glyphicon-open')
                    .addClass('glyphicon-save');
            } else {
                $(this).data('order', 'desc');
                ico
                    .removeClass('glyphicon-save')
                    .addClass('glyphicon-open');
            }
            obj.filter();
        }

        ,
        trigger_favorite: function(e) {
            var obj = window.javo_map_box_func;

            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
                obj.side_out();
            } else {
                $(this).addClass('active');
                obj.side_move();
                obj.ajax_favorite();
            }
        },
        send_plan: function(_tripPlan) {
            $.post('/api/trip3sPlan', {
                plan: JSON.stringify(_tripPlan)
            }, function(data) {
                _tripPlan = data.plan;
            });
            return _tripPlan;
        },
        side_out: function() {
            var panel = $(".javo_mhome_sidebar");
            var btn = $(".javo-mhome-sidebar-onoff");
            var panel_x = -(panel.outerWidth()) + 'px';
            var btn_x = 0 + 'px';

            panel.animate({
                marginLeft: panel_x
            }, 300);
            btn.animate({
                marginLeft: btn_x
            }, 300);
        }

        ,
        side_move: function() {
            var panel = $(".javo_mhome_sidebar");
            var btn = $(".javo-mhome-sidebar-onoff");
            var panel_x = 0 + 'px';
            var btn_x = panel.outerWidth() + 'px';
            panel.animate({
                marginLeft: panel_x
            }, 300);
            btn.animate({
                marginLeft: btn_x
            }, 300);
        }

        ,
        ajax_favorite: function(places, index) {
            var obj = this;
            var panel = $('#sidebar-places .javo_mhome_sidebar');

            panel = $('#sidebar-places .javo_mhome_sidebar');
            panel.html($('#loading-list-place-plan').html());
            var schedule_day = $('[javo-current-day]').val();

            var strFull = '',
                nstr = '',
                placeLength = 0;
            placeLength = places.length;
            var strAttr = $("#trip3s-attribute-schedule-2").html(),
                strCurr = '';
            strAttr = strAttr.replace(/{{data-place}}/g, tripPlan.placeIds.length || '0');
            strAttr = strAttr.replace(/{{data-time}}/g, tripPlan.dayNumber || '0');
            strAttr = strAttr.replace(/{{data-user}}/g, tripPlan.userNumber || '0');

            strFull += "<div class=\"row schedule-day-boby-detail \">";
            strFull += "<div class=\"schedule-day-header-bar attribute-schedule\">" + strAttr + "</div> ";
            strFull += '<ul class="schedule-day-boby scrollbar style-3">';
            $('#body-detail-add-plan').html('');
            if (typeof places != "undefined" && places.length > 0) {

                for (var i = 0; i < placeLength; i++) {
                    tripPlan
                    var str = '';
                    str = $("#trip3s-place-in-schedule").html();
                    str = str.replace(/{{current_place}}/g, JSON.stringify(places[i]) || '{}');
                    str = str.replace(/{{post_thumbnail}}/g, places[i].post_thumbnail || nstr);
                    str = str.replace(/{{place_id}}/g, places[i].place_id || nstr);
                    str = str.replace(/{{post_title}}/g, places[i].post_title || nstr);
                    str = str.replace(/{{post_excerpt}}/g, places[i].phone || nstr);
                    str = str.replace(/{{place_time}}/g, places[i].place_time || nstr);
                    str = str.replace(/{{sort_thumbnail}}/g, (i + 1) || nstr);
                    str = str.replace(/{{place_ticket}}/g, places[i].place_ticket || nstr);
                    str = str.replace(/{{place_note}}/g, places[i].place_note || nstr);
                    str = str.replace(/{{next_distance}}/g, places[i].next_distance || nstr);
                    str = str.replace(/{{next_time}}/g, places[i].next_time || nstr);
                    str = str.replace(/{{next_detail}}/g, places[i].next_detail || nstr);
                    strFull += str;
                };
            };
            strFull += "</ul></div>";

            var _index = 1;
            $('#body-detail-add-plan').html(strFull);
            if (typeof index !== 'undefined') {
                _index = index;
            };
            showSave(false);
            update_bar_day({
                index: _index,
                distance: 0,
                placeNumber: placeLength,
                dayNumber: tripPlan.dayNumber,
                moneyNumber: tripPlan.moneyNumber,
                userNumber: tripPlan.userNumber
            });
        },
        ajax_favoriteu: function(places, index) {
            var obj = this;
            var panel = $('#sidebar-plans .javo_mhome_sidebar');

            panel = $('#sidebar-plans .javo_mhome_sidebar');
            panel.html($('#loading-list-review-plan').html());
            var schedule_day = $('[javo-current-day]').val();

            var strFull = '',
                nstr = '',
                placeLength = 0;
            placeLength = places.length;
            var strAttr = $("#trip3s-attribute-schedule-4").html(),
                strCurr = '';
            strAttr = strAttr.replace(/{{data-place}}/g, tripPlan.placeIds.length || '0');
            strAttr = strAttr.replace(/{{data-time}}/g, tripPlan.dayNumber || '0');
            strAttr = strAttr.replace(/{{data-user}}/g, tripPlan.userNumber || '0');
            strAttr = strAttr.replace(/{{data-money}}/g, tripPlan.moneyNumber || '0');

            strFull += "<div class=\"row schedule-day-boby-detail \">";
            strFull += "<div class=\"schedule-day-header-bar attribute-schedule\">" + strAttr + "</div> ";
            strFull += '<ul class="schedule-day-boby scrollbar style-3">';
            $('#body-detail-review-plan').html('');
            if (typeof places != "undefined" && places.length > 0) {

                for (var i = 0; i < placeLength; i++) {
                    tripPlan
                    var str = '';
                    str = $("#trip3s-place-in-schedule").html();
                    str = str.replace(/{{current_place}}/g, JSON.stringify(places[i]) || '{}');
                    str = str.replace(/{{post_thumbnail}}/g, places[i].post_thumbnail || nstr);
                    str = str.replace(/{{place_id}}/g, places[i].place_id || nstr);
                    str = str.replace(/{{post_title}}/g, places[i].post_title || nstr);
                    str = str.replace(/{{post_excerpt}}/g, places[i].phone || nstr);
                    str = str.replace(/{{place_time}}/g, places[i].place_time || nstr);
                    str = str.replace(/{{sort_thumbnail}}/g, (i + 1) || nstr);
                    str = str.replace(/{{place_ticket}}/g, places[i].place_ticket || nstr);
                    str = str.replace(/{{place_note}}/g, places[i].place_note || nstr);
                    str = str.replace(/{{next_distance}}/g, places[i].next_distance || nstr);
                    str = str.replace(/{{next_time}}/g, places[i].next_time || nstr);
                    str = str.replace(/{{next_detail}}/g, places[i].next_detail || nstr);
                    strFull += str;
                };
            };
            strFull += "</ul></div>";

            var _index = 1;
            $('#body-detail-review-plan').html(strFull);
            if (typeof index !== 'undefined') {
                _index = index;
            };
            showSave(false);
            update_bar_day({
                index: _index,
                distance: 0,
                placeNumber: placeLength,
                dayNumber: tripPlan.dayNumber,
                moneyNumber: tripPlan.moneyNumber,
                userNumber: tripPlan.userNumber
            });
        }

        ,
        apply_order: function(data) {
            var result = [];
            var obj = window.javo_map_box_func;
            var o = $("[data-javo-hmap-sort]").data('order');

            for (var i in data)
                result.push(data[i]);

            if (typeof result != "undefined") {
                result.sort(function(a, b) {
                    var c = parseInt(a.post_id),
                        d = parseInt(b.post_id);
                    return c < d ? -1 : c > d ? 1 : 0;
                });
            } else {
                result = {}
            }

            return result;
        }

        ,
        marker_on_list: function(e) {
            e.preventDefault();

            var obj = window.javo_map_box_func;

            obj.marker_trigger($(this).data('id'));
            obj.map.setZoom(parseInt($("[javo-marker-trigger-zoom]").val()));

        }

        ,
        marker_trigger: function(marker_id) {
            this.el.gmap3({
                get: {
                    name: "marker",
                    id: marker_id,
                    callback: function(m) {
                        google.maps.event.trigger(m, 'click');
                    }
                }
            });
        } // End Cluster Trigger

        ,
        setGetLocationKeyword: function(e) {
            var obj = window.javo_map_box_func;
            var data = obj.items;

            var el = $("input#javo-map-box-location-ac");

            if (e.keyCode == 13) {

                if (el.val() != "") {

                    obj.el.gmap3({
                        getlatlng: {
                            address: el.val(),
                            callback: function(response) {
                                var sanitize_result, metry;
                                var map = $(this).gmap3('get');

                                if (!response) {
                                    $.javo_msg({
                                        content: $("[javo-bad-location]").val(),
                                        delay: 1000,
                                        close: false
                                    });
                                    return false;
                                }

                                metry = response[0].geometry;

                                if (metry.viewport) {
                                    var xx = metry.viewport.getSouthWest().lat();
                                    var xy = metry.viewport.getNorthEast().lat();
                                    var yx = metry.viewport.getSouthWest().lng();
                                    var yy = metry.viewport.getNorthEast().lng();

                                    map.fitBounds(metry.viewport);
                                    sanitize_result = obj.latlng_calc(xx, xy, yx, yy, data);
                                }

                                obj.filter(sanitize_result);
                            }
                        }
                    });
                } else {
                    obj.filter(data);
                }
                e.preventDefault();
            }
        }

        ,
        latlng_calc: function(s, e, n, w, item) {

            var result = [];

            $.each(item, function(i, k) {

                if (
                    (s <= parseFloat(k.lat) && e >= parseFloat(k.lat)) &&
                    (n <= parseFloat(k.lng) && w >= parseFloat(k.lng))
                ) {
                    result.push(item[i]);
                }
            });
            return result;
        }

        ,
        brief_run: function(e) {

            var brief_option = {};
            brief_option.type = "post";
            brief_option.dataType = "json";
            brief_option.url = "http://javothemes.com/directory/demo2/wp-admin/admin-ajax.php";
            brief_option.data = {
                "post_id": $(e).data('id'),
                "action": "javo_map_brief"
            };
            brief_option.error = function(e) {
                console.log(e.responseText);
            };
            brief_option.success = function(db) {
                $(".javo_map_breif_modal_content").html(db.html);
                $("#map_breif").modal("show");
                $(e).button('reset');
            };
            $(e).button('loading');
            $.ajax(brief_option);
        },
        contact_run: function(e) {
            $('.javo-contact-user-name').html($(e).data('username'));
            $('input[name="contact_item_name"]').val($(e).data('itemname'))
            $('input[name="contact_this_from"]').val($(e).data('to'));
            $("#author_contact").modal('show');
        }

        ,
        submit_contact: function(e) {
            e.preventDefault();

            var obj = window.javo_map_box_func;
            var el = $(this);
            var frm = el.closest('form');


            var options_ = {
                subject: $("input[name='contact_name']"),
                url: $("[javo-ajax-url]").val(),
                from: $("input[name='contact_email']"),
                content: $("textarea[name='contact_content']"),
                to: frm.find('input[name="contact_this_from"]').val(),
                item_name: frm.find('input[name="contact_item_name"]').val(),
                to_null_msg: "Please, insert recipient's email address.",
                from_null_msg: "Please, insert sender's email address.",
                subject_null_msg: "Please, insert your name.",
                content_null_msg: "Please, insert message content.",
                successMsg: "Successfully sent!",
                failMsg: "Sorry, your message could not be sent.",
                confirmMsg: "Do you want to send this message?"
            };

            $.javo_mail(options_, function() {
                el.button('loading');
            }, function() {
                $('#author_contact').modal('hide');
                el.button('reset');
            });
        }

        ,
        setCompareDistance: function(p1, p2) {
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

        ,
        getMyPosition: function(e) {
            var obj = window.javo_map_box_func;
            var el_slier = $(".javo-geoloc-slider");

            if ($(this).hasClass('active')) {
                $(this)
                    .removeClass('active')
                    .find('i').removeClass('fa-spin');
                el_slier
                    .trigger('set')
                    .prop('disabled', true)
                    .addClass('disabled')
            } else {
                $(this)
                    .addClass('active')
                    .find('i').addClass('fa-spin');
                el_slier
                    .trigger('set')
                    .prop('disabled', false)
                    .removeClass('disabled')
            }
            obj.map_clear(false);
        }
    }
    window.javo_map_box_func.init();
});

/**
 * covert canvas to image
 * and save the image file
 */

var Canvas2Image = function() {

    // check if support sth.
    var $support = function() {
        var canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d');

        return {
            canvas: !!ctx,
            imageData: !!ctx.getImageData,
            dataURL: !!canvas.toDataURL,
            btoa: !!window.btoa
        };
    }();

    var downloadMime = 'image/octet-stream';

    function scaleCanvas(canvas, width, height) {
        var w = canvas.width,
            h = canvas.height;
        if (width == undefined) {
            width = w;
        }
        if (height == undefined) {
            height = h;
        }

        var retCanvas = document.createElement('canvas');
        var retCtx = retCanvas.getContext('2d');
        retCanvas.width = width;
        retCanvas.height = height;
        retCtx.drawImage(canvas, 0, 0, w, h, 0, 0, width, height);
        return retCanvas;
    }

    function getDataURL(canvas, type, width, height) {
        canvas = scaleCanvas(canvas, width, height);
        return canvas.toDataURL(type);
    }

    function saveFile(strData) {
        document.location.href = strData;
    }

    function genImage(strData) {
        var img = document.createElement('img');
        img.src = strData;
        return img;
    }

    function fixType(type) {
        type = type.toLowerCase().replace(/jpg/i, 'jpeg');
        var r = type.match(/png|jpeg|bmp|gif/)[0];
        return 'image/' + r;
    }

    function encodeData(data) {
        if (!window.btoa) {
            throw 'btoa undefined'
        }
        var str = '';
        if (typeof data == 'string') {
            str = data;
        } else {
            for (var i = 0; i < data.length; i++) {
                str += String.fromCharCode(data[i]);
            }
        }

        return btoa(str);
    }

    function getImageData(canvas) {
        var w = canvas.width,
            h = canvas.height;
        return canvas.getContext('2d').getImageData(0, 0, w, h);
    }

    function makeURI(strData, type) {
        return 'data:' + type + ';base64,' + strData;
    }


    /**
     * create bitmap image
     * 按照规则生成图片响应头和响应体
     */
    var genBitmapImage = function(oData) {

        //
        // BITMAPFILEHEADER: http://msdn.microsoft.com/en-us/library/windows/desktop/dd183374(v=vs.85).aspx
        // BITMAPINFOHEADER: http://msdn.microsoft.com/en-us/library/dd183376.aspx
        //

        var biWidth = oData.width;
        var biHeight = oData.height;
        var biSizeImage = biWidth * biHeight * 3;
        var bfSize = biSizeImage + 54; // total header size = 54 bytes

        //
        //  typedef struct tagBITMAPFILEHEADER {
        //  	WORD bfType;
        //  	DWORD bfSize;
        //  	WORD bfReserved1;
        //  	WORD bfReserved2;
        //  	DWORD bfOffBits;
        //  } BITMAPFILEHEADER;
        //
        var BITMAPFILEHEADER = [
            // WORD bfType -- The file type signature; must be "BM"
            0x42, 0x4D,
            // DWORD bfSize -- The size, in bytes, of the bitmap file
            bfSize & 0xff, bfSize >> 8 & 0xff, bfSize >> 16 & 0xff, bfSize >> 24 & 0xff,
            // WORD bfReserved1 -- Reserved; must be zero
            0, 0,
            // WORD bfReserved2 -- Reserved; must be zero
            0, 0,
            // DWORD bfOffBits -- The offset, in bytes, from the beginning of the BITMAPFILEHEADER structure to the bitmap bits.
            54, 0, 0, 0
        ];

        //
        //  typedef struct tagBITMAPINFOHEADER {
        //  	DWORD biSize;
        //  	LONG  biWidth;
        //  	LONG  biHeight;
        //  	WORD  biPlanes;
        //  	WORD  biBitCount;
        //  	DWORD biCompression;
        //  	DWORD biSizeImage;
        //  	LONG  biXPelsPerMeter;
        //  	LONG  biYPelsPerMeter;
        //  	DWORD biClrUsed;
        //  	DWORD biClrImportant;
        //  } BITMAPINFOHEADER, *PBITMAPINFOHEADER;
        //
        var BITMAPINFOHEADER = [
            // DWORD biSize -- The number of bytes required by the structure
            40, 0, 0, 0,
            // LONG biWidth -- The width of the bitmap, in pixels
            biWidth & 0xff, biWidth >> 8 & 0xff, biWidth >> 16 & 0xff, biWidth >> 24 & 0xff,
            // LONG biHeight -- The height of the bitmap, in pixels
            biHeight & 0xff, biHeight >> 8 & 0xff, biHeight >> 16 & 0xff, biHeight >> 24 & 0xff,
            // WORD biPlanes -- The number of planes for the target device. This value must be set to 1
            1, 0,
            // WORD biBitCount -- The number of bits-per-pixel, 24 bits-per-pixel -- the bitmap
            // has a maximum of 2^24 colors (16777216, Truecolor)
            24, 0,
            // DWORD biCompression -- The type of compression, BI_RGB (code 0) -- uncompressed
            0, 0, 0, 0,
            // DWORD biSizeImage -- The size, in bytes, of the image. This may be set to zero for BI_RGB bitmaps
            biSizeImage & 0xff, biSizeImage >> 8 & 0xff, biSizeImage >> 16 & 0xff, biSizeImage >> 24 & 0xff,
            // LONG biXPelsPerMeter, unused
            0, 0, 0, 0,
            // LONG biYPelsPerMeter, unused
            0, 0, 0, 0,
            // DWORD biClrUsed, the number of color indexes of palette, unused
            0, 0, 0, 0,
            // DWORD biClrImportant, unused
            0, 0, 0, 0
        ];

        var iPadding = (4 - ((biWidth * 3) % 4)) % 4;

        var aImgData = oData.data;

        var strPixelData = '';
        var biWidth4 = biWidth << 2;
        var y = biHeight;
        var fromCharCode = String.fromCharCode;

        do {
            var iOffsetY = biWidth4 * (y - 1);
            var strPixelRow = '';
            for (var x = 0; x < biWidth; x++) {
                var iOffsetX = x << 2;
                strPixelRow += fromCharCode(aImgData[iOffsetY + iOffsetX + 2]) +
                    fromCharCode(aImgData[iOffsetY + iOffsetX + 1]) +
                    fromCharCode(aImgData[iOffsetY + iOffsetX]);
            }

            for (var c = 0; c < iPadding; c++) {
                strPixelRow += String.fromCharCode(0);
            }

            strPixelData += strPixelRow;
        } while (--y);

        var strEncoded = encodeData(BITMAPFILEHEADER.concat(BITMAPINFOHEADER)) + encodeData(strPixelData);

        return strEncoded;
    };

    /**
     * saveAsImage
     * @param canvasElement
     * @param {String} image type
     * @param {Number} [optional] png width
     * @param {Number} [optional] png height
     */
    var saveAsImage = function(canvas, width, height, type) {
        if ($support.canvas && $support.dataURL) {
            if (typeof canvas == "string") {
                canvas = document.getElementById(canvas);
            }
            if (type == undefined) {
                type = 'png';
            }
            type = fixType(type);
            if (/bmp/.test(type)) {
                var data = getImageData(scaleCanvas(canvas, width, height));
                var strData = genBitmapImage(data);
                saveFile(makeURI(strData, downloadMime));
            } else {
                var strData = getDataURL(canvas, type, width, height);
                saveFile(strData.replace(type, downloadMime));
            }
        }
    };

    var convertToImage = function(canvas, width, height, type) {
        if ($support.canvas && $support.dataURL) {
            if (typeof canvas == "string") {
                canvas = document.getElementById(canvas);
            }
            if (type == undefined) {
                type = 'png';
            }
            type = fixType(type);

            if (/bmp/.test(type)) {
                var data = getImageData(scaleCanvas(canvas, width, height));
                var strData = genBitmapImage(data);
                return genImage(makeURI(strData, 'image/bmp'));
            } else {
                var strData = getDataURL(canvas, type, width, height);
                return genImage(strData);
            }
        }
    };



    return {
        saveAsImage: saveAsImage,
        saveAsPNG: function(canvas, width, height) {
            return saveAsImage(canvas, width, height, 'png');
        },
        saveAsJPEG: function(canvas, width, height) {
            return saveAsImage(canvas, width, height, 'jpeg');
        },
        saveAsGIF: function(canvas, width, height) {
            return saveAsImage(canvas, width, height, 'gif');
        },
        saveAsBMP: function(canvas, width, height) {
            return saveAsImage(canvas, width, height, 'bmp');
        },

        convertToImage: convertToImage,
        convertToPNG: function(canvas, width, height) {
            return convertToImage(canvas, width, height, 'png');
        },
        convertToJPEG: function(canvas, width, height) {
            return convertToImage(canvas, width, height, 'jpeg');
        },
        convertToGIF: function(canvas, width, height) {
            return convertToImage(canvas, width, height, 'gif');
        },
        convertToBMP: function(canvas, width, height) {
            return convertToImage(canvas, width, height, 'bmp');
        }
    };

}();