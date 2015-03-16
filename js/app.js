// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('labapp', ['tacit.directives','tacit.events','ui.bootstrap','lab.filter','lab.team.controller','lab.meeting.controller','lab.mobile.event','lab.rtc-controller','angular-datepicker','ionic', 'lab.controllers', 'lab.services','btford.socket-io','ngCordova','lab.socket'])

.run(function(Sound,$rootScope,$window,Friends,$cordovaTouchID,$cordovaFile,Device,$cordovaDevice,$ionicPlatform, socket, Auth,$localstorage,$state,$cordovaNetwork,$cordovaToast,$rootScope,$cordovaKeyboard,$cordovaStatusbar) {
  Device.width=$(window).width();
  Device.height=$(window).height();

  paper.install(window);
  window.fs = require('fs');
  window.mime = require('mime');
  window.fs.watch('./', function() {
    if (location)
      location.reload();
  });
  Sound.newmsg = new Audio("sound/new-msg.ogg");  
  // navigator.webkitGetUserMedia({video:true,audio:true}, onSuccess, onFail);

  function onSuccess(stream)
  {
    console.log('succeed!')
      // document.getElementById('camFeed').src = webkitURL.createObjectURL(stream);
  }

  function onFail()
  {
      alert('could not connect stream');
  }


  window.gui = require('nw.gui');
  window.uuid= require('node-uuid');

  Device.dataPath = window.gui.App.dataPath;
  window.path = require('path');
  window.low = require('lowdb');
  // window.Datastore = require('nedb');
  // testdb = new Datastore({ filename: window.path.join(Device.dataPath,'/test/cool.db'),autoload: true });

  

  gui.Screen.Init();

  var mb = new gui.Menu({type:"menubar"});
  var tray = new gui.Tray({icon: 'img/tray.ico' });
  var trayMenu = new gui.Menu();
  var autoUpdateItem=new gui.MenuItem({ type: 'checkbox', label: 'Auto Task' })
  var quitItem= new gui.MenuItem({
    type: "normal", 
    label: "Quit"
  });
  quitItem.click=function(){
    gui.App.quit();
  }
  var aboutItem= new gui.MenuItem({
    type: "normal", 
    label: "About BuildPro v1.4"
  });

  // 给图标menu添加项目
  trayMenu.append(autoUpdateItem);
  trayMenu.append(new gui.MenuItem({ type: 'separator' }));
  trayMenu.append(aboutItem);
  trayMenu.append(quitItem);
  tray.menu = trayMenu;
  // 给大菜单添加项目

  console.log(process.platform);
  console.log(process.platform.indexOf('win'));

  if (process.platform=="darwin") { //mac
    mb.createMacBuiltin("BuildPro");
  }
  else {
    mb.append(new gui.MenuItem({ label: 'Tacit' }));
    mb.append(new gui.MenuItem({ label: 'Edit' }));
    mb.append(new gui.MenuItem({ label: 'About' }));
  }

  


  gui.Window.get().menu = mb;

  window.win = gui.Window.get(); 

  window.win.on('resize',function(width,height){
    Device.width=$(window).width();
    Device.height=$(window).height();
    $rootScope.$apply();
  })

  win.showDevTools();


  Auth.authorize({
      type:'mobile',
      username:$localstorage.get('username'),
      token:$localstorage.get('token')
    },function(res){
      Auth.user=$localstorage.get('username');
      Auth.isLoggedIn=true;
      socket.emit('login',{username:Auth.user});
      $('.auth-mask').addClass('done');
    },function(err){
      $localstorage.set('username','');
      $localstorage.set('token','');
      $state.go('auth.login');
      // $state.go('tab.dash');
      $('.auth-mask').addClass('done');
  })

})

.config(function($cordovaInAppBrowserProvider,$ionicConfigProvider,$stateProvider, $urlRouterProvider) {
  $ionicConfigProvider.views.maxCache(20);
  var defaultOptions = {
    location: 'yes',
    clearcache: 'yes',
    toolbar: 'no'
  };
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    .state('auth', {
      url: "/auth",
      abstract: true,
      template:'<ui-view/>'
    })

    .state('auth.login', {
      url: '/login',
      views: {
        '@': {
          templateUrl: 'templates/auth/login.html',
          controller: 'AuthCtrl'
        }
      }
    })

    .state('auth.signup', {
      url: '/signup',
      views: {
        '@': {
          templateUrl: 'templates/auth/signup.html',
          controller: 'AuthCtrl'
        }
      }
    })




    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html",
      controller:'TabCtrl'
    })

    // Each tab has its own nav history stack:

    .state('tab.dash', {
      url: '/dash',
      views: {
        'tabs': {
          templateUrl: 'templates/communicate/tab-communicate.html',
          controller: 'DashCtrl'
        }
      }
    })

    .state('tab.chat', {
      url: '/chat/:friendIndex',
      views: {
        'tabs': {
          templateUrl: 'templates/communicate/tab-chat.html',
          controller: 'ChatCtrl'
        }
      }
    })

    .state('tab.setting', {
      url: '/setting',
      views: {
        'tabs': {
          templateUrl: 'templates/communicate/tab-setting.html',
          controller: 'SettingCtrl'
        }
      }
    })
    .state('tab.new-meeting', {
      url: '/new-meeting',
      views: {
        'tabs': {
          templateUrl: 'templates/cooperation/new-meeting.html',
          controller: 'NewMeetingCtrl'
        }
      }
    })
    .state('tab.meeting', {
      url: '/meeting',
      views: {
        '@': {
          templateUrl: 'templates/cooperation/meeting/meeting.html',
          controller: 'MeetingCtrl'
        }
      }
    })
    .state('tab.meetingrecordlist', {
      url: '/meeting-record-list',
      views: {
        '@': {
          templateUrl: 'templates/cooperation/meeting/meeting-record-list.html',
          controller: 'MeetingRecordListCtrl'
        }
      }
    })
    .state('tab.meetingrecord', {
      url: '/meeting-record/{meetingNum}',
      views: {
        '@': {
          templateUrl: 'templates/cooperation/meeting/meeting-record.html',
          controller: 'MeetingRecordCtrl'
        }
      }
    })
    .state('tab.meeting-call', {
      url: '/meeting-call/:contactName?isCalling',
      views: {
        'tabs': {
          templateUrl: 'templates/cooperation/meeting-call.html',
          controller: 'CallCtrl'
        }
      }
    })
    .state('tab.team', {
      url: '/team',
      views: {
        '@': {
          templateUrl: 'templates/cooperation/team.html',
          controller: 'TeamCtrl'
        }
      }
    })
    .state('tab.taskdetail', {
      url: '/task-detail/{list}/{taskNum}',
      views: {
        '@': {
          templateUrl: 'templates/cooperation/task-detail.html',
          controller: 'TaskDetailCtrl'
        }
      }
    })
    .state('tab.newtask', {
      url: '/new-task/{list}/{taskNum}',
      views: {
        '@': {
          templateUrl: 'templates/cooperation/new-task.html',
          controller: 'TaskDetailCtrl'
        }
      }
    })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/chat/0');

});

