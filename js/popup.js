(function init() {
    
    if (localStorage['gtasks_canvas'] == 'ig') {
        $('#taskscontainer').attr('height',400);
        $('#taskscontainer').attr('width',300);
        $('#tasksoptions').css({right:0,top:0});
    }

    $('#tasksiframe').attr('src',get_url());
    
    $('#taskspopout').click(function() {
        window.open(get_url(),'Google Tasks','width=475');
    });
    $('#tasksapps').click(function () {
        toggle_apps();
    });
    $('#taskscanvas').click(function () {
        chrome.tabs.create({
            url:get_url_canvas()
        });
    });

    if (localStorage['gtasks_counter'] == '1') {
        loadTasks();
    } else {
        chrome.browserAction.setBadgeText({text:''});
    }
})();