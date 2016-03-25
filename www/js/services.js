/**
 * 各种定制化的服务
 */
angular.module('purus.services', [])
  .factory('$localStorage', function ($window) {
      "use strict";
      return {
          set: function (key, data) {
              if ($window.localStorage["$" + key])
                  $window.localStorage.removeItem('$' + key);

              $window.localStorage.setItem('$' + key, JSON.stringify(data || {}));
          },
          get: function (key) {
              var data = $window.localStorage.getItem('$' + key) || "{}";
              return JSON.parse(data);
          },
          remove: function (key) {
              return $window.localStorage.removeItem('$' + key);
          },
          clear: function () {
              return $window.localStorage.clear();
          }
      };
  })
  .factory('$UserProfile', function ($localStorage) {
      "use strict";
      var factory = {};

      factory.save = function (userProfile) {
          return $localStorage.set("UserProfile", userProfile);
      };

      factory.get = function () {
          return $localStorage.get("UserProfile");
      }

      factory.userName = function () {
         return this.get().Name;
      }

      factory.userAccount = function () {
          console.log(this.get())
          return this.get().Account;
      }

      return factory;
  })
;
  