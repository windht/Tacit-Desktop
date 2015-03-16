angular.module('tacit.events', [])

.run(function($rootScope,$window,Friends,$cordovaTouchID,$cordovaFile,Device,$cordovaDevice,$ionicPlatform, socket, Auth,$localstorage,$state,$cordovaNetwork,$cordovaToast,$rootScope,$cordovaKeyboard,$cordovaStatusbar) {
	window.ondragover = function(e) { e.preventDefault(); return false };
	window.ondrop = function(e) { e.preventDefault(); return false };

  var gui=require('nw.gui');
  var win = gui.Window.get();
  win.on('blur', function() {
    Device.focus=false;
  });
  win.on('focus', function() {
    Device.focus=true;
    if (Friends.selected && Friends.list[Friends.selected]) {
		if (Friends.list[Friends.selected].unread!=0) {
		    Device.toRead-=Friends.list[Friends.selected].unread;
		    Friends.list[Friends.selected].unread=0;
		    $rootScope.$apply();
		    var win = window.gui.Window.get();
		    if (Device.toRead==0) {
		    	win.setBadgeLabel('');
		    }
		    else {
		    	win.setBadgeLabel(Device.toRead);
		    }
		}
    }
  });
});

