angular.module('purus.controllers', ['ionic'])

.controller('MainCtrl', function ($scope, $UserProfile) {
    $scope.menus = [
      { name: '草稿箱', WorkItem: 'Draft', WorkItemType: 0, badge: 0 },
      { name: '待办事项', WorkItem: 'Queue', WorkItemType: 1, badge: 0 },
      { name: '待阅事项', WorkItem: 'Read', WorkItemType: 17, badge: 0 },
      { name: '我的申请', WorkItem: 'MyRequest', WorkItemType: 2, badge: 0 },
      { name: '我的处理', WorkItem: 'MyApprove', WorkItemType: 3, badge: 0 },
      { name: '我的已阅', WorkItem: 'MyRead', WorkItemType: 18, badge: 0 }
    ];

    $scope.loginUser = $UserProfile.userName();

    var workItemType = {
        Draft: 0, Queue: 1, MyRequest: 2, MyApprove: 3, Share: 4, All: 5,
        Removed: 6, Recede: 7, Run: 8, Finish: 9, Archive: 10, Agent: 11, NoReadCurTask: 12,
        ReadCurTask: 13, FinishCurTask: 14, CanRecedeTask: 15, Delay: 16, Read: 17, MyRead: 18, AllRead: 19
    };
})
.controller('WorkitemsCtrl', function ($scope, $state, $http, $q, $stateParams, $ionicLoading, $ionicModal, ENV, $seting, $UserProfile) {

    $scope.vm = {};
    $scope.vm.filter = '';
    $scope.WorkItems = [];
    $scope.loadingCompleted = false;
    $scope.workItemType = $stateParams.workItemType || 'Queue';
    $scope.title = $seting.WorkItem[$scope.workItemType];

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

    $scope.$on('$ionicView.enter', function () {
        $scope.doRefresh();
    });

    $scope.$on('$ionicView.afterEnter', function () {
        //$scope.doRefresh();
    });

    $scope.doSearch = function () {
        $scope.doRefresh();
        $scope.closeWorkItemsSearchModal();
    }

    $scope.openWorkItemsSearchModal = function () {
        $scope.searchModal.show();
    };

    $scope.closeWorkItemsSearchModal = function () {
        $scope.searchModal.hide();
    };

    //任务检索
    $ionicModal.fromTemplateUrl('templates/WorkItemsSearchModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.searchModal = modal;
    });

    //当我们用到模型时，清除它！
    $scope.$on('$destroy', function () {
        $scope.searchModal.remove();
    });

    var condition = $scope.searchCondition = {
        pageSize: 10,
        pageIndex: 0,
        account: $UserProfile.userAccount(),
        workItemType: $scope.workItemType
    };

    var loadWorkItems = function () {
        $ionicLoading.show();
        var deferred = $q.defer();
        condition.filter = $scope.vm.filter;
        $http.get(ENV.api + '/Task/WorkItems', {
            headers: {
                'Accept': 'application/json;charset=utf-8'
            },
            params: condition
        }).success(function (data) {
            deferred.resolve(data);
            $ionicLoading.hide();
        }).error(function (error) {
            deferred.reject(error);
            $ionicLoading.hide();
        });
        return deferred.promise;
    };
})
.controller('WorkitemCtrl', function ($scope, $state, $http, $q, $stateParams, $ionicHistory, $sce, $ionicLoading, $ionicModal, $ionicPopover, ENV, $UserProfile) {

    $scope.$on('$ionicView.afterEnter', function () {
        loadDetail().then(function (res) {
            $scope.formHtml = $sce.trustAsHtml(res.FormHtml);
            
        })
    });

    $ionicPopover.fromTemplateUrl('templates/WorkitemPopover.html', {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    });

    $scope.showAction = function ($event) {
        $scope.popover.show($event);
    }

    $scope.taskTrace = function () {
        if (!$scope.TaskTraces) {
            loadTaskTrace().then(function (data) {
                $scope.TaskTraces = data.TaskTraces;
                $scope.taskTraceModal.show();
            })
        } else {
            $scope.taskTraceModal.show();
        }
        $scope.popover.hide();
    }

    //任务跟踪
    $ionicModal.fromTemplateUrl('templates/TaskTraceModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.taskTraceModal = modal;
    });

    $scope.openTaskTraceModal = function () {
        $scope.taskTraceModal.show();
    };

    $scope.closeTaskTraceModal = function () {
        $scope.taskTraceModal.hide();
    };

    //当我们用到模型时，清除它！
    $scope.$on('$destroy', function () {
        $scope.popover.remove();
        $scope.taskTraceModal.remove();
    });

    $scope.goBack = function () {
        $ionicHistory.goBack();
        //$state.go('home.workitems', { workItemType: $stateParams.workItemType });
    }

    var loadDetail = function () {
        $ionicLoading.show();
        var deferred = $q.defer();

        $http.get(ENV.api + '/Task/WorkItemDetail', {
            headers: {
                'Accept': 'application/json;charset=utf-8'
            },
            params: {
                TaskId: $stateParams.taskId,
                ActivityId: $stateParams.activityId,
                WorkitemId: $stateParams.workitemId,
                ProcessId: $stateParams.processId,
                FormId: $stateParams.formId,
                Account: $UserProfile.userAccount(),
                type: getWorkitemType()
            }
        }).success(function (data) {
            deferred.resolve(data);
            $ionicLoading.hide();
        }).error(function (error) {
            $ionicLoading.hide();
            deferred.reject(error);
        });
        return deferred.promise;
    }

    var loadTaskTrace = function () {
        $ionicLoading.show();
        var deferred = $q.defer();

        $http.get(ENV.api + '/Task/Trace', {
            headers: {
                'Accept': 'application/json;charset=utf-8'
            },
            params: {
                TaskId: $stateParams.taskId
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

    var getWorkitemType = function () {

    }
})
.controller('TaskTraceCtrl', function ($scope, $state, $http, $q, $stateParams, $ionicLoading, ENV) {
    $scope.goBack = function () {
        $state.go('home.workitems', { workItemType: $stateParams.workItemType });
    }

    $scope.$on('$ionicView.afterEnter', function () {
        loadTaskTrace().then(function (data) {
            $scope.TaskTraces = data.TaskTraces;
        })
    });

    var loadTaskTrace = function () {
        $ionicLoading.show();
        var deferred = $q.defer();

        $http.get(ENV.api + '/Task/Trace', {
            headers: {
                'Accept': 'application/json;charset=utf-8'
            },
            params: {
                TaskId: $stateParams.taskId
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
.controller('MessagesCtrl', function ($scope, $state, $http, $q, $stateParams, $ionicLoading, ENV) {
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

        $http.get(ENV.api + '/Message/Messages', {
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
.controller('MessageCtrl', function ($scope, $state, $http, $q, $stateParams, $ionicHistory, $sce, $ionicLoading, ENV) {

    $scope.goBack = function () {
        $ionicHistory.goBack();
        //$state.go('home.messages');
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

        $http.get(ENV.api + '/Message/Message', {
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
.controller('LoginCtrl', function ($scope, $state, $http, $q, $stateParams, $sce, $ionicLoading, $ionicPopup, ENV, $UserProfile) {
    
    var vm = $scope.vm = {};
    vm.token = '';
    vm.account = 'admin';
    vm.password = '1';

    $scope.$on('$ionicView.enter', function () {
       
    });
    
    $scope.$on('$ionicView.afterEnter', function () {
        
    });

    $scope.doLogin = function () {
        doLogin().then(function (data) {
            if (data.result == "success") {
                $UserProfile.save(data.UserProfile);
                $state.go("home.workitems")
            } else {
                showAlert(data.msg);
            }
        }, function (res) {
        });
    }

    var showAlert = function (msg) {
        var alert = $ionicPopup.alert({
            title: '信息提示',
            template: msg,
            okText: '确定',
            okType: 'button-positive',
        });
        return alert;
    }

    var doLogin = function () {

        $ionicLoading.show();
        var deferred = $q.defer();
        $http.post(ENV.api + '/Auth/Login', $.param($scope.vm), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        }).success(function (data) {
            deferred.resolve(data);
            $ionicLoading.hide();
        }).error(function (error) {
            deferred.reject(error);
            $ionicLoading.hide();
        });
        return deferred.promise;
    };
})