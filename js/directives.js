var app=angular.module('tacit.directives', []);


app.directive('videoView', function ($rootScope, $timeout) {
    return {
      restrict: 'E',
      template: '<div class="video-container"></div>',
      replace: true,
      link: function (scope, element, attrs) {
        function updatePosition() {
          cordova.plugins.phonertc.setVideoView({
            container: element[0],
            local: { 
              position: [240, 240],
              size: [50, 50]
            }
          });
        }
        $timeout(updatePosition, 500);
        $rootScope.$on('videoView.updatePosition', updatePosition);
      }
    }
  });

app.directive('draw', function ($rootScope, $timeout) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        element.bind('mousedown',function(){

        })
      }
    }
});

app.directive('contextMenu', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        element.bind('contextmenu',function(event){
          console.log(event);
          event.preventDefault();
        })
      }
    }
});

app.directive('chatScroll', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        element.bind('mousedown',function(){
          console.log(attrs.chatScroll);
        })
      }
    }
});

app.directive('chatFileBox', function (socket,Auth,Friends,Chat,$ionicScrollDelegate) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        element.bind('dragover',function(){
          element.addClass('hover');
          return false;
        })
        element.bind('dragleave',function(){
          element.removeClass('hover');
          return false;
        })
        element.bind('drop',function(e){
          element.removeClass('hover');
          e.preventDefault();
          var hashkey=new Date().getTime()+'-'+Math.floor(Math.random()*5)
          var filePath=e.originalEvent.dataTransfer.files[0].path;
          console.log(filePath);
          var fileType=window.mime.lookup(filePath);
          console.log(fileType);

            if (fileType.indexOf('image')!=-1){
              window.fs.readFile(filePath,'base64',function(err, data) {
              if (err) throw err; // Fail if the file can't be read.
              var hashkey=new Date().getTime()+'-'+Math.floor(Math.random()*5);
              Friends.list[Chat.currentIndex].friendDB('chats').push({
                  hashkey:hashkey,
                  from:Auth.user,
                  content:'data:'+fileType+';base64,'+data,
                  type:'self',
                  contentType:'image',
                  sentStatus:1    // 0 for failed, 1 for pending, 2 for success
              });
              $ionicScrollDelegate.$getByHandle('chat-box').scrollBottom(true,true);
              if (Friends.list[Chat.currentIndex].name!="Tacit" && Friends.list[Chat.currentIndex].name!="xiaodoubi"){
                socket.emit('msg sent to friend',{
                    user:Auth.user,
                    hashkey:hashkey,
                    msg:data,
                    friend:Friends.list[Chat.currentIndex].name,
                    contentType:'image',
                    mime:fileType
                })
              }
            });
            // var reader = new FileReader();
            // reader.readAsDataURL(e.originalEvent.dataTransfer.files[0]);
            // console.log(reader.result);
          }
          else {
            window.fs.readFile(filePath,function(err, data) {
              if (err) throw err; // Fail if the file can't be read.
              console.log(data);
            });
          }
          
          // for (var i = 0; i < e.dataTransfer.files.length; ++i) {
          //     console.log(e.dataTransfer.files[i].path);
          // }
          return false;
        })
      }
    }
});

app.directive('recordVoice', function (Auth,Record,$document,Friends,Chat,$ionicScrollDelegate) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var recordRTC;
        element.bind('mousedown',function(){
          Record.audioZone=true;
          navigator.getUserMedia({audio: true}, function(mediaStream) {
             recordRTC = RecordRTC(mediaStream,{
              type:'audio',
              bufferSize: 256,
              sampleRate: 44100
             });
             recordRTC.startRecording();
             console.log('record started!')
          },function(err){console.log(err)});
          // console.log('hi you clicked audio record button')
        })
        element.bind('mouseout',function(){
          // console.log('moving out of the audio zone');
          Record.audioZone=false;
        })
        element.bind('mouseover',function(){
          // console.log('moving inside of the audio zone');
          Record.audioZone=true;
        })
        $document.on('mouseup',function(){
          console.log('record ended!')
          if (recordRTC){
            if (Record.audioZone==false){
              // console.log('hi you release the audio outof the zone')
              recordRTC.stopRecording(function(audioURL) {
                  // Do nothing
              });
            }
            else {
              recordRTC.stopRecording(function(audioURL) {
                  console.log(audioURL)
                  recordedBlob = recordRTC.getBlob();
                  console.log(recordedBlob);


                  var hashkey=new Date().getTime()+'-'+Math.floor(Math.random()*5);
                  Friends.list[Chat.currentIndex].friendDB('chats').push({
                      hashkey:hashkey,
                      from:Auth.user,
                      content:audioURL,
                      type:'self',
                      contentType:'audio',
                      sentStatus:1    // 0 for failed, 1 for pending, 2 for success
                  });
                  $ionicScrollDelegate.$getByHandle('chat-box').scrollBottom(true,true);
                  recordRTC.getDataURL(function(dataURL) {
                    console.log(dataURL);
                  });
             });
              // console.log('hi you release the audio in the zone')
            } 
          }
          
        })
      }
    }
});

app.directive('chatFileCompress', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        element.bind('dragover',function(){
          element.addClass('hover');
          return false;
        })
        element.bind('dragleave',function(){
          element.removeClass('hover');
          return false;
        })
        element.bind('drop',function(e){
          element.removeClass('hover');
          e.preventDefault();
          var filepath=e.originalEvent.dataTransfer.files[0].path;
          console.log(filepath);
          console.log(window.mime.lookup(filepath));
          // for (var i = 0; i < e.dataTransfer.files.length; ++i) {
          //     console.log(e.dataTransfer.files[i].path);
          // }
          return false;
        })
      }
    }
});