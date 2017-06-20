import activityTotalTemplate from './activity-total.html';
import activityFormsTemplate from './activity-forms.html';
import activityBookingTemplate from './activity-book.html';

import activityBookValidators from './activity-book-validators';

export default angular.module('activity-book', ['ngMaterial', 'rx'])
    .run(function ($templateCache) {
        $templateCache.put('activity-forms.html', activityFormsTemplate);
        $templateCache.put('activity-book.html', activityBookingTemplate);
        $templateCache.put('activity-total.html', activityTotalTemplate);

    })
    .directive('ablActivityBook', function ($sce, $compile, $mdMedia, $window, $http, ENV, observeOnScope, rx) {
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

                this.ENV = ENV;
                this.guestDetailsExpanded = true;
                this.attendeesExpanded = true;
                this.addonsExpanded = false;
                this.questionsExpanded = false;
                this.couponStatus = 'untouched';
                this.appliedCoupon = {};
                this.couponQuery = '';

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
                var timeslot = $scope.addBookingController.parent.timeslot;

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

                var data = {
                    "timeSlotId": timeslot._id,
                    "attendees": {},
                    "addons": {},
                    "startTime": timeslot.startTime
                }


                function buildQuery() {

                    // Parse attendees
                    angular.forEach($scope.addBookingController.book.calc.attendees, function (e, i) {
                        data["attendees"][e._id] = [];
                        if (e.quantity > 0) {
                            for (var i = 0; i < e.quantity; i++) {
                                data["attendees"][e._id].push(null);
                            }
                        }
                    });

                    // Parse addons
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

                // Query for pricing data based on the data object used to make a booking request
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

                //Query for possible coupons partially matching the vm.couponQuery search string
                vm.getPossibleCoupons = function () {
                    $http({
                        method: 'GET',
                        url: ENV.apiVersion + '/coupons?bookingId=' + vm.couponQuery
                    }).then(function successCallback(response) {
                        vm.possibleCoupons = response.data;
                        console.log('getPossibleCoupons success', response);

                    }, function errorCallback(response) {
                        vm.possibleCoupons = [];
                        vm.taxTotal = 0;
                        console.log('getPossibleCoupons error!', response);
                    });
                }

                // Check whether the vm.couponQuery search string exists as a coupon, if successful,
                // add the coupon id to the make booking request object as the 'coupon' property
                vm.checkCoupon = function () {
                    vm.checkingCoupon = true;
                    $http({
                        method: 'GET',
                        url: ENV.apiVersion + '/coupons/' + vm.couponQuery
                    }).then(function successCallback(response) {
                        console.log('checkCoupon success', response);
                        data['couponId'] = response.data['couponId'];
                        vm.appliedCoupon = response.data;
                        console.log('applied coupon', vm.appliedCoupon);
                        vm.couponStatus = 'valid';
                        vm.getPricingQuote();
                        vm.checkingCoupon = false;

                    }, function errorCallback(response) {
                        delete data['couponId'];
                        vm.couponStatus = 'invalid';
                        vm.appliedCoupon = {};
                        vm.checkingCoupon = false;

                        console.log('checkCoupon error!', response);
                    });
                }

                vm.removeCoupon = function () {
                    vm.couponQuery = '';
                    delete data['couponId'];
                    vm.couponStatus = 'untouched';
                    vm.appliedCoupon = {};
                    vm.getPricingQuote();
                }


                //Observe and debounce an object on the $scope, can be used on 
                //a search input for example to wait before auto-sending the value
                observeOnScope($scope, 'vm.couponQuery')
                    .debounce(500)
                    .select(function (response) {
                        return response;
                    })
                    .subscribe(function (change) {
                        console.log('search value', change);
                        if (vm.couponQuery.length > 0)
                            vm.checkCoupon();
                    });

                activityBookValidators(vm, rx, $http);
                //Observe and debounce an object on the $scope, can be used on 
                //a search input for example to wait before auto-sending the value
                observeOnScope($scope, 'vm.formData.fullName')
                    .debounce(500)
                    .select(function (response) {
                        return response;
                    })
                    .subscribe(function (change) {
                        console.log('client name search value', change);
                        if (change['newValue'])
                            vm.searchClients(change.newValue).subscribe(function (results) {
                                $scope.results = results;
                                console.log(results);
                            });
                    });


                $scope.$watch('vm.formData', function (changes) {
                    console.log('watch vm.formData', changes);
                }, true);


                $scope.$watch('$parent.book.calc.attendees', function (changes) {
                    console.log('watch book.calc.attendees', changes);
                }, true);



            }
        };
    });

// {"paymentMethod":"cash","answers":{"57336d1a3e6f0f447119989a":"100","57336d2a3e6f0f447119989b":"phone call"},"attendees":{"58eea948565d3d3aa4fae370":[null]},"addons":{"57336b293e6f0f447119987b":[null],"58252f9e98087f1c06cc15eb":[null],"57336b293e6f0f447119987c":[]},"adjustments":[],"couponId":"AIRMILES","skipConfirmation":false,"email":"kevin+test@adventurebucketlist.com","fullName":"Kevin Test","phoneNumber":"6506129331","eventInstanceId":"p836o5rvsg72nm69ia120bbdns_20170623T210000Z","currency":"default"}