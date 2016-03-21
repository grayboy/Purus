angular.module('purusApp.controllers', ['ionic'])

.controller('MainCtrl', function ($scope) {
    $scope.menus = [
      { name: '草稿箱', WorkItem: 'Draft', WorkItemType: 0, badge: 0 },
      { name: '待办事项', WorkItem: 'Queue', WorkItemType: 1, badge: 0 },
      { name: '待阅事项', WorkItem: 'Read', WorkItemType: 17, badge: 0 },
      { name: '我的申请', WorkItem: 'MyRequest', WorkItemType: 2, badge: 0 },
      { name: '我的处理', WorkItem: 'MyApprove', WorkItemType: 3, badge: 0 },
      { name: '我的已阅', WorkItem: 'MyRead', WorkItemType: 18, badge: 0 }
    ];

    var workItemType = {
        Draft: 0, Queue: 1, MyRequest: 2, MyApprove: 3, Share: 4, All: 5,
        Removed: 6, Recede: 7, Run: 8, Finish: 9, Archive: 10, Agent: 11, NoReadCurTask: 12,
        ReadCurTask: 13, FinishCurTask: 14, CanRecedeTask: 15, Delay: 16, Read: 17, MyRead: 18, AllRead: 19
    };
})
.controller('WorkitemsCtrl', function ($scope, $state, $http, $q, $stateParams, $ionicLoading, $ionicSideMenuDelegate) {

    var WorkItem = {
        Draft: "草稿", Queue: "我的待办", MyRequest: "我的申请", MyApprove: "我的处理", Share: "共享任务", All: "全部任务",
        Removed: "删除任务", Recede: "退回任务", Run: "运行中", Finish: "已完成", Archive: "历史", Agent: "我的委托", NoReadCurTask: "待阅",
        ReadCurTask: "已阅", FinishCurTask: "已完成", CanRecedeTask: "可退回任务", Delay: "延迟", Read: "已阅", MyRead: "我的已阅", AllRead: "全部已阅"
    };

    $scope.WorkItems = [];
    $scope.loadingCompleted = false;
    $scope.workItemType = $stateParams.workItemType || 'Queue';
    $scope.title = WorkItem[$scope.workItemType];


    $scope.doRefresh = function () {
        condition.pageIndex = 0;
        loadWorkItems().then(function (data) {

            $scope.WorkItems = data.WorkItems;
            $scope.loadingCompleted = $scope.WorkItems.length == data.RecordCount;

            $scope.$broadcast('scroll.refreshComplete');
        })
    }

    $scope.loadMore = function () {
        condition.pageIndex = condition.pageIndex + 1;
        loadWorkItems().then(function (data) {
            angular.forEach(data.WorkItems, function (item) {
                $scope.WorkItems.push(item);
            });
            $scope.loadingCompleted = $scope.WorkItems.length == data.RecordCount;
            $scope.$broadcast('scroll.refreshComplete');
        })
    }

    $scope.showDetail = function (taskId, workItemId, activityId, processId, formId) {
        $state.go("workitem", { taskId: taskId, workItemId: workItemId, activityId: activityId, processId: processId, formId: formId, workItemType: $scope.workItemType });
    }

    $scope.$on('$ionicView.afterEnter', function () {
        $scope.doRefresh();
    });

    var condition = $scope.searchCondition = {
        pageIndex: 0,
        pageSize: 10,
        account: 'admin',
        workItemType: $scope.workItemType
    };

    var loadWorkItems = function () {
        $ionicLoading.show();
        var deferred = $q.defer();

        $http.get('http://122.114.50.74/mobileservice3/api/Task/WorkItems', {
            headers: {
                'Accept': 'application/json;charset=utf-8'
            },
            params: condition
        }).success(function (data) {
            deferred.resolve(data);
            $ionicLoading.hide();
        }).error(function (error) {
            $ionicLoading.hide();
            deferred.reject(error);
        });
        return deferred.promise;
    };
})
.controller('WorkitemCtrl', function ($scope, $state, $http, $q, $stateParams, $ionicLoading, $ionicSideMenuDelegate) {
    $scope.goBack = function () {
        $state.go('home.workitems', { workItemType: $stateParams.workItemType });
    }

})
.controller('MessagesCtrl', function ($scope, $state, $http, $q, $stateParams, $ionicLoading, $ionicSideMenuDelegate) {
    $scope.Messages = [];
    $scope.loadingCompleted = false;

    $scope.doRefresh = function () {
        params.pageIndex = 0;
        loadMessages().then(function (data) {

            $scope.Messages = data.Messages;
            $scope.loadingCompleted = $scope.Messages.length == data.RecordCount;

            $scope.$broadcast('scroll.refreshComplete');
        })
    }

    $scope.loadMore = function () {
        params.pageIndex = params.pageIndex + 1;
        loadMessages().then(function (data) {
            angular.forEach(data.Messages, function (item) {
                $scope.Messages.push(item);
            });
            $scope.loadingCompleted = $scope.Messages.length == data.RecordCount;
            $scope.$broadcast('scroll.refreshComplete');
        })
    }

    $scope.showDetail = function (id) {
        $state.go("message", { id: id });
    }


    $scope.$on('$ionicView.afterEnter', function () {
        $scope.doRefresh();
    });

    var params = {
        pageIndex: 0,
        pageSize: 10,
        account: 'admin',
        catalog: '',
        filter: ''
    };

    var loadMessages = function () {
        $ionicLoading.show();
        var deferred = $q.defer();

        $http.get('http://122.114.50.74/mobileservice3/api/Message/Messages', {
            headers: {
                'Accept': 'application/json;charset=utf-8'
            },
            params: params
        }).success(function (data) {
            deferred.resolve(data);
            $ionicLoading.hide();
        }).error(function (error) {
            $ionicLoading.hide();
            deferred.reject(error);
        });
        return deferred.promise;
    };
})
.controller('MessageCtrl', function ($scope, $state, $http, $q, $stateParams, $sce, $ionicLoading, $ionicSideMenuDelegate) {

    $scope.goBack = function () {
        $state.go('home.messages');
    }

    $scope.$on('$ionicView.afterEnter', function () {
        loadMessage().then(function (data) {
            $scope.Message = data.Message;
            $scope.Message.TrustedContent = $sce.trustAsHtml(data.Message.Content);
        });
    });

    var loadMessage = function () {
        $ionicLoading.show();
        var deferred = $q.defer();

        $http.get('http://122.114.50.74/mobileservice3/api/Message/Message', {
            headers: {
                'Accept': 'application/json;charset=utf-8'
            },
            params: {
                id: $stateParams.id,
                account: 'admin'
            }
        }).success(function (data) {
            deferred.resolve(data);
            $ionicLoading.hide();
        }).error(function (error) {
            $ionicLoading.hide();
            deferred.reject(error);
        });
        return deferred.promise;
    };
})