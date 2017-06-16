import RxJS from 'rxjs/Rx';
import rx from 'rx-angular';

// import feathers from 'feathers-client';
// import feathersRx from 'feathers-reactive';
// import io from 'socket.io-client';

// import feathersAuthentication from './auth';
// import setupUtilFunctions from './utils';

import activityTotalTemplate from './activity/activity-total.html';
import activityFormsTemplate from './activity/activity-forms.html';
import activityBookingTemplate from './activity/activity-book.html';


import styles from './abl-payment-summary.css';

// var sdkProvider = function () {
//   var endpoint = null
//   var socketOpts = null

//   var feathersAuth = false
//   var useSocket = true
//   var authStorage = window.localStorage
//   var services = [];

//   //Configuration
//   return {
//     setAuthStorage: function (newAuthStorage) {
//       authStorage = newAuthStorage
//     },
//     setSocketOpts: function (opts) {
//       socketOpts = opts
//     },
//     useSocket: function (socketEnabled) {
//       useSocket = !!socketEnabled
//     },
//     setEndpoint: function (newEndpoint) {
//       endpoint = newEndpoint
//     },
//     setFeathersAuth: function (isFeathersAuth) {
//       feathersAuth = isFeathersAuth
//     },
//     setServices: function (newServices) {
//       services = newServices
//     },
//     $get: ['$injector', '$rootScope', '$state', '$timeout', '$log', '$mdToast',
//       function ($injector, $rootScope, $state, $timeout, $log, $mdToast) {
//         var $rootScope = $injector.get('$rootScope');
//         var that = this;

//         $rootScope.loading = true;
//         this.loadingTimeout = null;

//         //Add timeout
//         $rootScope.afterRender = function (current, total) {
//           //$log.debug('after render', current, total,  Math.round(current/total * 100));
//           $timeout.cancel(this.loadingTimeout);
//           this.loadingTimeout = $timeout(function () {
//             //$log.debug('loading', $rootScope.loading);
//             $rootScope.loading = false;
//           }, 1500);
//         };

//         if (!endpoint)
//           return {};

//         this.app = feathers()
//           .configure(feathersRx(RxJS)) //feathers-reactive
//           .configure(feathers.hooks())

//         if (useSocket) {
//           console.log('endpoint', endpoint)
//           this.socket = io(endpoint, socketOpts)
//           this.app.configure(feathers.socketio(this.socket))
//         } else {
//           this.app.configure(feathers.rest(endpoint).jquery(window.jQuery))
//         }

//         setupUtilFunctions(this.app, $mdToast, $rootScope);


//         if (feathersAuth) {
//           this.app = feathersAuthentication(this.app, that, authStorage, $rootScope);
//         }

//         return this.app
//       }
//     ]
//   }
// };

// //Old naming convention, left for backwards compatibility
// var feathersSdk = [
//   function $feathersProvider() {
//     return sdkProvider();
//   }
// ];

// var ablSdk = [
//   function $ablProvider() {
//     return sdkProvider();
//   }
// ];

angular.module('abl-sdk-feathers', ['ngMaterial', 'rx'])
  // .directive('afterRender', ['$timeout', function ($timeout) {
  //   var def = {
  //     restrict: 'A',
  //     terminal: true,
  //     transclude: false,
  //     link: function (scope, element, attrs) {
  //       $timeout(scope.$eval(attrs.afterRender), 1000); //Calling a scoped method 1000ms after rendering has completed
  //     }

  //   };
  //   return def;
  // }])
  // .provider('$abl', ablSdk)
  // .provider('$feathers', feathersSdk)
  .run(function ($templateCache) {
    $templateCache.put('activity-forms.html', activityFormsTemplate);
    $templateCache.put('activity-book.html', activityBookingTemplate);
    $templateCache.put('activity-total.html', activityTotalTemplate);

  })
  .directive('ablActivityBook', function ($sce, $compile, $mdMedia, $window, $http, ENV, observeOnScope) {
    return {
      restrict: 'E',
      scope: {
        book: '='
      },
      template: activityBookingTemplate,
      link: function ($scope, element, attrs) {
        // Digest on resize to recalculate $mdMedia window size
        function onResize() {
          console.log('resize');
          $scope.$digest();
        };

        angular.element($window).on('resize', onResize);
      },
      controllerAs: 'vm',
      controller: function ($scope, $element, $attrs) {
        console.log('ablActivityBookController', $scope, $attrs);
        var vm = this;

        this.guestDetailsExpanded = true;
        this.attendeesExpanded = true;
        this.addonsExpanded = false;
        this.questionsExpanded = false;

        this.toggleGuestDetails = function () {
          console.log('toggle guest details');
          this.guestDetailsExpanded = !this.guestDetailsExpanded;
        }

        this.pricing = {
          total: 0
        };
        this.taxTotal = 0;

        $scope.$mdMedia = $mdMedia;
        $scope.screenIsBig = function () {
          return $mdMedia('gt-sm');
        }

        $scope.addBookingController = $scope.$parent;
        console.log('addBookingController', $scope.addBookingController);

        $scope.eventInfo = $scope.$parent.parent;

        //Get taxes
        vm.taxes = $scope.eventInfo.pricing.possible.filter(function (charge) {
          return charge.type == 'tax';
        })
        console.log('taxes', vm.taxes);

        vm.taxTotal = 0;
        //Get addons
        vm.addons = $scope.eventInfo.pricing.possible.filter(function (charge) {
          return charge.type == 'addon' && charge.status == 'active';
        })
        vm.addons.forEach(function (e, i) {
          e.quantity = 0;
        });

        //Get booking questions
        vm.questions = [];
        if (angular.isDefined($scope.eventInfo.questions))
          vm.questions = $scope.eventInfo.questions;
        console.log('booking questions', vm.questions);

        this.toggleQuestions = function () {
          console.log('toggle questions');
          this.questionsExpanded = !this.questionsExpanded;
        }

        this.adjustAddon = function (i, mode) {
          if (mode == 'up')
            vm.addons[i].quantity++;
          if (mode == 'down' && vm.addons[i].quantity > 0)
            vm.addons[i].quantity--;

          console.log('adjust addons', vm.addons);
          vm.getPricingQuote();
        }
        console.log('addons', vm.addons);

        this.toggleAddons = function () {
          console.log('toggle addons');
          this.addonsExpanded = !this.addonsExpanded;
        }

        this.adjustAttendee = function (i, mode) {
          if (mode == 'up')
            $scope.addBookingController.book.calc.attendees[i].quantity++;
          if (mode == 'down' && $scope.addBookingController.book.calc.attendees[i].quantity > 0)
            $scope.addBookingController.book.calc.attendees[i].quantity--;

          console.log('adjust attendees', $scope.addBookingController.book.calc.attendees);
          vm.getPricingQuote();
        }

        this.toggleAttendees = function () {
          console.log('toggle attendees');
          this.attendeesExpanded = !this.attendeesExpanded;
        }

        function buildQuery() {
          var timeslot = $scope.addBookingController.parent.timeslot;

          var data = {
            "timeSlotId": timeslot._id,
            "attendees": {},
            "addons": {},
            "startTime": timeslot.startTime,
            "coupon": "594300a5f4ab863bd84ecff0"
          }

          //Parse attendees
          angular.forEach($scope.addBookingController.book.calc.attendees, function (e, i) {
            data["attendees"][e._id] = [];
            if (e.quantity > 0) {
              for (var i = 0; i < e.quantity; i++) {
                data["attendees"][e._id].push(null);
              }
            }
          });

          //Parse addons
          angular.forEach(vm.addons, function (e, i) {
            data["addons"][e._id] = [];
            if (e.quantity > 0) {
              for (var i = 0; i < e.quantity; i++) {
                data["addons"][e._id].push(null);
              }
            }
          });

          console.log('pricing quote POST data', data);
          //return url;
          return data;
        }

        vm.getPricingQuote = function () {
          var query = buildQuery();
          $http({
            method: 'POST',
            url: ENV.apiVersion + '/pricing-quotes',
            data: query
          }).then(function successCallback(response) {
            vm.pricing = response.data;
            vm.taxTotal = response.data.items.filter(function (item) {
              return item.type == "tax"
            }).reduce(function (result, tax) {
              return result + tax.price
            }, 0)
            console.log('getPricingQuotes', response);
            console.log('taxTotal', vm.taxTotal);

          }, function errorCallback(response) {
            vm.pricing = {};
            vm.taxTotal = 0;
            console.log('getPricingQuotes error!', response, vm.pricing);

          });
        }

        vm.getPossibleCoupons = function () {
          $http({
            method: 'GET',
            url: ENV.apiVersion + '/coupons?bookingId=' + couponQuery,
            data: query
          }).then(function successCallback(response) {
            vm.possibleCoupons = response.data;
            console.log('getPossibleCoupons', response);

          }, function errorCallback(response) {
            vm.possibleCoupons = [];
            vm.taxTotal = 0;
            console.log('getPossibleCoupons error!', response, vm.pricing);
          });
        }

        $scope.$watch('$parent.book.formData', function (changes) {
          console.log('watch book', changes);
        }, true);


        $scope.$watch('$parent.book.calc.attendees', function (changes) {
          console.log('watch book.calc.attendees', changes);
        }, true);



      }
    };
  });

// {"paymentMethod":"cash","answers":{"57336d1a3e6f0f447119989a":"100","57336d2a3e6f0f447119989b":"phone call"},"attendees":{"58eea948565d3d3aa4fae370":[null]},"addons":{"57336b293e6f0f447119987b":[null],"58252f9e98087f1c06cc15eb":[null],"57336b293e6f0f447119987c":[]},"adjustments":[],"couponId":"AIRMILES","skipConfirmation":false,"email":"kevin+test@adventurebucketlist.com","fullName":"Kevin Test","phoneNumber":"6506129331","eventInstanceId":"p836o5rvsg72nm69ia120bbdns_20170623T210000Z","currency":"default"}