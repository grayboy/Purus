// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('purus', ['ionic', 'angularMoment', 'purus.config', 'purus.services', 'purus.controllers'])

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
.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
    $ionicConfigProvider.platform.android.navBar.alignTitle('center');

    $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
    $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

    $ionicConfigProvider.platform.ios.views.transition('ios');
    $ionicConfigProvider.platform.android.views.transition('android');

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
    .state('tasktrace', {
        url: "/tasktrace/:taskId/:workItemId/:activityId/:processId/:formId/:workItemType",
        templateUrl: "templates/TaskTrace.html",
        controller: "TaskTraceCtrl"
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
    })
    .state('login', {
        url: "/login",
        templateUrl: "templates/Login.html",
        controller: "LoginCtrl"
    })

    $urlRouterProvider.otherwise("/login");
})
.constant("$ionicLoadingConfig", {
    noBackdrop : true,
    template: '<ion-spinner icon="spiral"></ion-spinner>'
})
.constant('$seting', {
    WorkItem: {
        Draft: "草稿", Queue: "我的待办", MyRequest: "我的申请", MyApprove: "我的处理", Share: "共享任务", All: "全部任务",
        Removed: "删除任务", Recede: "退回任务", Run: "运行中", Finish: "已完成", Archive: "历史", Agent: "我的委托", NoReadCurTask: "待阅",
        ReadCurTask: "已阅", FinishCurTask: "已完成", CanRecedeTask: "可退回任务", Delay: "延迟", Read: "已阅", MyRead: "我的已阅", AllRead: "全部已阅"
    },

    WorkItemType: {
        Draft: 0, Queue: 1, MyRequest: 2, MyApprove: 3, Share: 4, All: 5,
        Removed: 6, Recede: 7, Run: 8, Finish: 9, Archive: 10, Agent: 11, NoReadCurTask: 12,
        ReadCurTask: 13, FinishCurTask: 14, CanRecedeTask: 15, Delay: 16, Read: 17, MyRead: 18, AllRead: 19
    },

    FlowElementType: {
        Start: 0, Activity: 1, Condition: 2, End: 3, Transition: 4, Split: 5, Join: 6, Notification: 7, SQL: 8,
        InterfaceOut: 9, InterfaceIn: 10, Archive: 11, Auto: 12, SubProcess: 13, Wait: 14
    },

    SingleParticipant: {
        FirstUser: 0, AssignByPrevStep: 1, AutoAssignByLoadOfThisProcess: 2, AutoAssignByLoadOfAllProcess: 3, Share: 4
    },

    PathSplitType: {
        All: 0, SelectOne: 1, SelectMulti: 2
    },

    MultiParticipant: {
        All: 0, AssignByPrevStep: 1, Share: 2
    },

    ParticipantPolicy: {
        Single: 0, Multi: 1
    },

    TokenStatus: {
        All: -1, Run: 0, Finish: 1, TaskFinish: 2, Waitting: 3, RunOrWaitting: 4, AdHoc: 5,
        Share: 6, AdHocWait: 7, JointSign: 8
    },

    WorkItemDetailType: {
        Edit: 0, View: 1, Print: 2
    },

    SelectNextUserType: {
        None: 0, Single: 1, Multi: 2
    },

    Transition: {
        "Recede": "SYSTRAN_RECEDE", "Dispatch": "SYSTRAN_DISPATCH", "AdHoc": "SYSTRAN_ADHOC",
        "DirectTo": "SYSTRAN_DIRECTTO", "Reject": "SYSTRAN_REJECT", "AdHocCommit": "SYSTRAN_ADHOCCOMMIT"
    }
})


