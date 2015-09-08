(function(){
  'use strict';

  var app = angular.module('chat-app', []);

  app.controller('chatCtrl', function($scope){
    var socket, chatwindow = document.getElementById('chat-window');

    $scope.chat = {
      remote: {
        date: new Date(),
        message: null,
        user: this.name ? this.name : generateName()
      },
      client: [], //placeholder for user and msg data
      invalid: {
        message: false, //default values
        user: false
      },
      online: []
    }

    $scope.sendMessage = function(){
      if(validateField()) {
        postNewChatMessage();
      }
    }

    function initialize(){
      socket = io();
      socket.on('chat message', function(data) {
        $scope.chat.client.push(data);
        getActiveUser(data);
        $scope.$apply();
        chatwindow.scrollTop = chatwindow.scrollHeight;
      });

      getActiveUser($scope.chat.remote.user);

    }

    function getActiveUser(user){
      if(typeof user === 'string' ) {
        $scope.chat.online.push(user)
      } else {
        if ($scope.chat.online.indexOf(user.user) === -1) {
          $scope.chat.online.push(user.user);
        }
      }
    }

    function postNewChatMessage(){
      socket.emit('chat message', $scope.chat.remote);
      $scope.chat.remote.message = null;
    }

   function validateField(){
     var inputData = $scope.chat.remote,
         invalidData = $scope.chat.invalid;
     if (!inputData.user) {
       invalidData.user = true;
       return false;
     } else if (!inputData.message) {
       invalidData.message = true;
       return false;
     } else {
       invalidData.user = false;
       invalidData.message = false;
       return true;
     }
   }

    function generateName() {
      return 'Anon' + Math.floor(Math.random()* 10000);
    }

    initialize();
  });

  app.directive('ngEnter', function () {
      return function (scope, element, attrs) {
          element.bind("keydown keypress", function (event) {
              if(event.which === 13) {
                  scope.$apply(function (){
                      scope.$eval(attrs.ngEnter);
                  });

                  event.preventDefault();
              }
          });
      };
  });
})();
