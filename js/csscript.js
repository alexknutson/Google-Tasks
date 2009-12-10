get_url = function () {
	if (localStorage['gtasks_apps_enabled'] == 'false') {
		return 'https://mail.google.com/tasks/ig';
	} else if (localStorage['gtasks_apps_enabled'] == 'true' && localStorage['gtasks_apps']=='') {
		return 'https://mail.google.com/tasks/ig';
	} else {
		return 'https://mail.google.com/tasks/a/'+localStorage['gtasks_apps']+'/ig'
	}
};

debug = {
	_this : this
}

chrome.extension.onConnect.addListener(function(p) {
	if (p.name == 'updatecs') {
		p.onMessage.addListener(function (m) {
			if (m.showbox) {
				$('#gtasks_box').show();
			} else {
				$('#gtasks_box').hide();
			}
		});
	}
});

(function init(){
	if(window.parent){
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
		if (!localStorage['gtasks_version'] || localStorage['gtasks_version']!=version) {
			localStorage['gtasks_version'] = version;
			chrome.tabs.create({
				url:'options.html'
			});
		}
		
		$('#gtasks_box').remove();
		$('body').append('<div id="gtasks_box" style="display:none;"><div id="gtasks_box_drag"></div><iframe id="gtasks_box_iframe"></iframe></div>');
		$('#gtasks_box').draggable({
			handle:'#gtasks_box_drag',
		});
		$('#gtasks_box_iframe').attr('src',get_url());
		var p = chrome.extension.connect({
			name: "updatebg"
		});
		p.postMessage({
			updatecs:true
		});
	}
})();