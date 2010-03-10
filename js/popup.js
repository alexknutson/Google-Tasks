get_url = function () {
    if (localStorage['gtasks_canvas'] == 'android') {
        return get_url_android();
    } else if (localStorage['gtasks_canvas'] == 'ig') {
        return get_url_ig();
    } else {
        return get_url_android();
    }
};

get_url_android = function () {
	if (localStorage['gtasks_apps_enabled'] == 'false') {
		return 'https://mail.google.com/tasks/android';
	} else if (localStorage['gtasks_apps_enabled'] == 'true' && localStorage['gtasks_apps']=='') {
		return 'https://mail.google.com/tasks/android';
	} else {
		return 'https://mail.google.com/tasks/a/'+localStorage['gtasks_apps']+'/android'
	}
};
get_url_canvas = function () {
	if (localStorage['gtasks_apps_enabled'] == 'false') {
		return 'https://mail.google.com/tasks/canvas';
	} else if (localStorage['gtasks_apps_enabled'] == 'true' && localStorage['gtasks_apps']=='') {
		return 'https://mail.google.com/tasks/canvas';
	} else {
		return 'https://mail.google.com/tasks/a/'+localStorage['gtasks_apps']+'/canvas'
	}
};
get_url_ig = function () {
    if (localStorage['gtasks_apps_enabled'] == 'false') {
        return 'https://mail.google.com/tasks/ig';
    } else if (localStorage['gtasks_apps_enabled'] == 'true' && localStorage['gtasks_apps']=='') {
        return 'https://mail.google.com/tasks/ig';
    } else {
        return 'https://mail.google.com/tasks/a/'+localStorage['gtasks_apps']+'/ig'
    }
};

toggle_apps = function () {
	if (localStorage['gtasks_apps_enabled'] == 'true') {
		localStorage['gtasks_apps_enabled'] = 'false';
	} else {
		localStorage['gtasks_apps_enabled'] = 'true';
	}
    $('#tasksiframe').attr('src',get_url());
    loadTasks();
};
jsdate2string = function(odate) {
    var sout = odate.getFullYear()+'';
    var month = odate.getMonth()+1;
    if (month.toString().length==1) {
        sout += '0' + month;
    } else {
        sout += ''+month;
    }
    if (odate.getDate().toString().length==1) {
        sout += '0' + odate.getDate().toString();
    } else {
        sout += odate.getDate().toString();
    }
    return sout;
};
loadTasks = function() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", get_url_ig(), true);
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            jsontxt = xhr.responseText;
            jsontxt = jsontxt.substring(jsontxt.indexOf('_init(){_setup(')+15);
            jsontxt = jsontxt.substring(0,jsontxt.lastIndexOf(')}'));
            ndelayed = 0;
            nfortoday = 0;
            var ntoday = parseInt(jsdate2string(new Date()));
            atasks = new Array();
            var myjson = JSON.parse(jsontxt);
            var mytasks = myjson.t.tasks;  
            for(var i in mytasks) {
                var otask = new Object();
                otask.sname = mytasks[i].name;
                otask.surl = '';
                if(typeof(mytasks[i].resource_link)=="object") {
                    otask.surl = mytasks[i].resource_link[0].uri;
                }
                if(typeof(mytasks[i].task_date)=="string"){
                    otask.sdate = mytasks[i].task_date;
                    var ntaskdate = parseInt(''+otask.sdate);
                    if(ntaskdate<ntoday) ndelayed++;
                    if(ntaskdate==ntoday) nfortoday++;
                }
                    
                atasks[atasks.length] = otask;
            }
            ntasks = atasks.length;
         
            if(ndelayed>0) {
                chrome.browserAction.setBadgeBackgroundColor({color:[255, 0, 0, 255]});
                chrome.browserAction.setBadgeText({text:''+ndelayed});
            } else if(nfortoday>0) {
                chrome.browserAction.setBadgeBackgroundColor({color:[255, 128, 0, 255]});
                chrome.browserAction.setBadgeText({text:''+nfortoday});
            } else {
                chrome.browserAction.setBadgeBackgroundColor({color:[130, 180, 230, 255]});
                chrome.browserAction.setBadgeText({text:''+ntasks});
            }
        }
    }
    
    window.setTimeout('loadTasks();',60*1000);
};

(function init() {
	var version='1.5.3';
	if (!localStorage['gtasks_apps']) {
		localStorage['gtasks_apps'] = '';
	}
	if (!localStorage['gtasks_apps_enabled']) {
		localStorage['gtasks_apps_enabled'] = false;
	}
	if (!localStorage['gtasks_where']) {
		localStorage['gtasks_where'] = 'popup';
	}
	if (!localStorage['gtasks_icon']) {
		localStorage['gtasks_icon'] = 'icon';
	}
	if (!localStorage['gtasks_version'] || localStorage['gtasks_version']!=version) {
		localStorage['gtasks_version'] = version;
	}
    if (!localStorage['gtasks_counter']) {
        localStorage['gtasks_counter'] = '1';
    }
    
    if (localStorage['gtasks_canvas'] == 'android') {
        $('#taskscontainer').append('<iframe id="tasksiframe" width="475" height="600" marginwidth="0" marginheight="0" frameborder="0"></iframe>');
    } else if (localStorage['gtasks_canvas'] == 'ig') {
        $('#taskscontainer').append('<iframe id="tasksiframe" width="300" height="400" marginwidth="0" marginheight="0" frameborder="0" onload="this.focus();"></iframe>');
        $('#tasksoptions').css({right:0,top:0});
    } else {
        $('#taskscontainer').append('<iframe id="tasksiframe" width="475" height="600" marginwidth="0" marginheight="0" frameborder="0"></iframe>');
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