// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('purusApp', ['ionic','purusApp.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('home', {
        url: "/home",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: "MainCtrl"
    })
    .state('home.workitems', {
        url: "/workitems/:workItemType",
        views: {
            'menuContent': {
                templateUrl: "templates/WorkItems.html",
                controller: "WorkitemsCtrl"
            }
        }
    })
    .state('workitem', {
        url: "/workitem/:taskId/:workItemId/:activityId/:processId/:formId/:workItemType",
        templateUrl: "templates/WorkItem.html",
        controller: "WorkitemCtrl"
    })
    .state('home.messages', {
        url: "/messages",
        views: {
            'menuContent': {
                templateUrl: "templates/Messages.html",
                controller: "MessagesCtrl"
            }
        }
    })
    .state('message', {
        url: "/message/:id",
        templateUrl: "templates/Message.html",
        controller: "MessageCtrl"
    });

    $urlRouterProvider.otherwise("/home/workitems/");
})


