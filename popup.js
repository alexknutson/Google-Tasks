get_url = function () {
	if (localStorage['gtasks_apps_enabled'] == 'false') {
		return 'https://mail.google.com/tasks/ig';
	} else if (localStorage['gtasks_apps_enabled'] == 'true' && localStorage['gtasks_apps']=='') {
		return 'https://mail.google.com/tasks/ig';
	} else {
		return 'https://mail.google.com/tasks/a/'+localStorage['gtasks_apps']+'/ig'
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
toggle_apps = function () {
	if (localStorage['gtasks_apps_enabled'] == 'true') {
		localStorage['gtasks_apps_enabled'] = 'false';
	} else {
		localStorage['gtasks_apps_enabled'] = 'true';
	}
	$('#tasksiframe').remove();
	$('#taskscontainer').append('<iframe id="tasksiframe" src="'+get_url()+'"></iframe>');
};

(function init() {
	var version='1.4.0';
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
	$('#tasksiframe').remove();
	$('#taskscontainer').append('<iframe id="tasksiframe" src="'+get_url()+'"></iframe>');
	var p = chrome.extension.connect({
		name: "updatebg"
	});
	p.postMessage({
		updatecs:true,
		showbox:false,
	});
})();

$('#tasksiframe').attr('src',get_url());
$('#taskspopout').click(function() {
	window.open(get_url(),'Google Tasks','width=320');
});
$('#taskspopin').click(function() {
	localStorage['gtasks_where'] = 'inside';
	var p = chrome.extension.connect({
		name: "updatebg"
	});
	
	p.postMessage({
		updatecs:true,
		showbox:true
	});

	window.close();
});
$('#tasksapps').click(function () {
	toggle_apps();
});
$('#taskscanvas').click(function () {
	chrome.tabs.create({
		url:get_url_canvas()
	});
});