$.ajaxTo = function(type, url, data) {
    var callback_data = {};
    $.ajax({
        url: url,
        async: false,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(data),
        type: type,
        dataType:'json',
        success: function(data){
          callback_data = data;
        },
        error:function(e){ 
          callback_data = e;
        }
    });
    return callback_data;
}

$(document).ready(function() {
    view.init();
    event.init();
});
var view = {
    init: function() {
        this.init_profile();
    }
    ,content_switch: function(display) {
        $("#home,#about,#profile,#contact,#profile_content").css("display","none");
        display.css("display", "block");
    }

    ,init_profile: function() {
        //local檔案改成讀檔
        if(location.toString().indexOf("file") != -1) {
            view.append_profile_list($.data_profile);
        } else {
            $.data_profile = $.ajaxTo("GET", "data/profile.json");
            view.append_profile_list($.data_profile);
        }
    }
    ,append_profile_list: function(data) {
        var profile = $("#profile");
        profile.html("");
        for(var i=0;i<data.length; i++) {
            console.log(data[i]);
            var list = $("#sample .profile_icon").clone();
            list.find("img").attr("src", data[i]['icon']);
            list.find("p").html(data[i]['project']);
            list.data("index",i);
            profile.append(list);
        }
    }
}
var event = {
    init : function() {
        $('#navbar a').click(function(e) {
            var link = $(this).attr("href").replace("./","");
            view.content_switch($("#"+link));

            $(".nav").find(".active").removeClass("active");
            $(this).parent().addClass("active");

            e.preventDefault();
        });

        $('#profile .profile_icon').click(function(e) {
            view.content_switch($("#profile_content"));
            console.log($.data_profile[$(this).data("index")]);
            //console.log(JSON.stringify($.data_profile[$(this).data("index")]));
            e.preventDefault();
        });
    }
}