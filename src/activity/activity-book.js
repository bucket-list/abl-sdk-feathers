import './activity-book.css';

import activityTotalTemplate from './activity-total.html';
import activityFormsTemplate from './activity-forms.html';
import activityBookingTemplate from './activity-book.html';
import activityBookValidators from './activity-book-validators';

import activityAdjustmentController from './activity.adjustment.controls.component.js'
/**
 * @namespace activity-book
 */
export default angular
    .module('activity-book', ['ngMaterial', 'rx'])
    .run(function ($templateCache) {
        $templateCache.put('activity-forms.html', activityFormsTemplate);
        $templateCache.put('activity-book.html', activityBookingTemplate);
        $templateCache.put('activity-total.html', activityTotalTemplate);
    })
    .controller('activityAdjustmentController', activityAdjustmentController)
    .directive('ablActivityBook', [
        '$rootScope',
        '$sce',
        '$compile',
        '$mdMedia',
        '$mdDialog',
        '$mdToast',
        '$log',
        '$window',
        '$timeout',
        '$http',
        'rx',
        'observeOnScope',
        '$stateParams',
        '$state',
        '$filter',
        function ($rootScope, $sce, $compile, $mdMedia, $mdDialog, $mdToast, $log, $window, $timeout, $http, rx, observeOnScope, $stateParams, $state, $filter) {
            return {
                restrict: 'E',
                scope: {
                    book: '=',
                    activity: '=',
                    app: '='
                },
                template: activityBookingTemplate,
                link: function ($scope, element, attrs) {
                    // Digest on resize to recalculate $mdMedia window size
                    function onResize() {
                        $scope.$digest();
                    };
                    angular
                        .element($window)
                        .on('resize', onResize);
                },
                controllerAs: 'vm',
                controller: function ($scope, $element, $attrs) {
                    let vm = this;
                    this.formWasBlocked = false;
                    this.guestDetailsExpanded = true;
                    this.attendeesExpanded = false;
                    this.addonsExpanded = false;
                    this.questionsExpanded = false;
                    this.stripePaymentExpanded = false;
                    this.stripeCardIsValid = false;
                    this.paymentExpanded = false;
                    this.showPaymentForm = false;
                    this.paymentFormIsLoading = false;
                    this.paymentWasSent = false;
                    this.waitingForResponse = false;
                    this.validStepsForPayment = {
                        'guest': false,
                        'attendees': false
                    };

                    this.couponStatus = 'untouched';
                    this.appliedCoupon = {};
                    this.couponQuery = '';
                    this.occupancyRemaining = 0;

                    this.attendeeSubtotals = [];
                    this.addonSubtotals = [];

                    vm.taxes = [];
                    vm.taxTotal = 0;
                    vm.addons = [];
                    vm.questions = [];
                    vm.goToPay = goToPay;
                    vm.submitNonCreditCardBooking = submitNonCreditCardBooking;

                    $scope.sendConfirmationEmail = true;

                    // Environment is configured differently across apps so get config from the
                    // $rootScope for now
                    const config = $rootScope.config;
                    let headers = {};

                    //Activity dash needs no headers
                    if (!config.DASHBOARD) {
                        if(config.MARKETPLACE){//this is for apps that set the ACCESS_KEY as .env var instead of url param
                            headers = {
                                'x-abl-access-key': config.ABL_ACCESS_KEY,
                                'x-abl-date': Date.parse(new Date().toISOString()),
                                "Content-Type": "application/json;charset=utf-8"
                            };
                        }else{
                            headers = {
                                'x-abl-access-key': $stateParams.merchant || 'tLVVsHUlBAweKP2ZOofhRBCFFP54hX9CfmQ9EsDlyLfN6DYHY5k8VzpuiUxjNO5L', //$stateParams.merchant || config.ABL_ACCESS_KEY,
                                'x-abl-date': Date.parse(new Date().toISOString()),
                                "Content-Type": "application/json;charset=utf-8"
                            };
                        }
                        //Require booking questions on consumer facing apps
                        vm.validStepsForPayment['bookingQuestions'] = false;
                    } else {
                        $scope.dashboard = true;
                    }

                    $log.debug('abl-activity-book $scope', $scope);
                    
                    $scope.$watch(function(){
                        return $rootScope.currency;
                    }, function(newValue, oldValue){
                        if(newValue){
                            vm.currency = newValue;	
                        }	
                    });
                    
                    $scope.$on('currency-updated', function(event, args){
                        $log.debug('ablActivityBook:currency-updated', args);
                        vm.currency = args.currency;
                        vm.getPricingQuote();
                    });

                    if (Raven) {
                        Raven.captureMessage('Add Booking', {
                            level: 'info', // one of 'info', 'warning', or 'error'
                            tags: {
                                step: 'opened'
                            }
                        });
                    }
                    $scope.formatDate = function (date, format) {
                        return window
                            .moment(date)
                            .format(format);
                    }
                    $scope.paymentResponse = '';
                    $scope.paymentSuccessful = false;

                    this.goToNextStep = function (currentStepName, form) {
                        switch (currentStepName) {
                            case 'guestDetailsStep': //goes to attendees
                                vm.toggleGuestDetails();
                                vm.toggleAttendees();
                                break;
                            case 'attendeesStep': //goes to addons || booking || pay
                                //$log.debug('goToNextStep:attendeesStep', vm.attendeesAdded);
                                if (vm.countAttendeesAdded() > 0) { //validate attendees
                                    //$log.debug('attendeesStep', vm.addons.length, vm.questions);
                                    if (vm.addons.length > 0) {
                                        vm.attendeesExpanded = false; //close current
                                        vm.addonsExpanded = true; //close current
                                    } else if (vm.questions.length > 0) {
                                        vm.attendeesExpanded = false; //close current
                                        vm.questionsExpanded = true;
                                    } else {
                                        vm.attendeesExpanded = false; //close current
                                        vm.stripePaymentExpanded = true;
                                        if (!$scope.dashboard) {
                                            $log.debug('no questions, goToPay');
                                            vm.goToPay();
                                        }
                                    }
                                }
                                break;
                            case 'addonsStep': //goes to addons || booking || pay
                                if (vm.addons && vm.addons.length > 0) { //validate addons
                                    if (vm.countAttendeesAdded()) { //if guests and attendees are valid
                                        if (vm.questions.length > 0) { //go to questions if questions exist
                                            vm.addonsExpanded = false;
                                            vm.questionsExpanded = true;
                                        } else { //got to pay if qustions doesn't exist
                                            vm.addonsExpanded = false;
                                            vm.stripePaymentExpanded = true;
                                            if (!$scope.dashboard) {
                                                $log.debug('no questions, goToPay');
                                                vm.goToPay();
                                            }
                                        }
                                    }
                                }
                                break;
                            case 'paymentStep': //goes to addons || booking || pay
                                $log.debug('goToNextStep:paymentStep', vm.isPaymentValid());
                                if (vm.isPaymentValid()) { //if guests and attendees are valid
                                    vm.guestDetailsExpanded = false;
                                    vm.attendeesExpanded = false;
                                    vm.addonsExpanded = false;
                                    vm.questionsExpanded = false;
                                    vm.stripePaymentExpanded = true;
                                    if (!$scope.dashboard) {
                                        vm.goToPay()
                                    }
                                }
                                break;
                        }
                    }

                    vm.guestDetailsFormValid = false;

                    this.toggleGuestDetails = function () {
                        //console.log('toggle guest details');
                        this.guestDetailsExpanded = this.formWasBlocked
                            ? false
                            : !this.guestDetailsExpanded;
                    }

                    this.togglePayment = function () {
                        //$log.debug('toggle payment');
                        this.paymentExpanded = !this.paymentExpanded;
                    }

                    this.returnToMainPage = function () {

                        if ($rootScope.config.DASHBOARD) {
                            $mdDialog.hide();
                            $state.reload();
                        } else {
                            $mdDialog.hide();
                            $state.go('home', {merchant: $stateParams.merchant});
                        }
                    }
                    this.pricing = {
                        total: 0
                    };
                    this.taxTotal,
                    this.addonTotal,
                    this.attendeeTotal = 0;

                    $scope.bookingSucceeded = false;
                    $scope.$mdMedia = $mdMedia;
                    $scope.screenIsBig = function () {
                        var w = angular.element($window);
                        return w[0].innerWidth > 742;
                    }

                $scope.addBookingController = $scope.$parent;
                $log.debug('addBookingController:initialize', $scope.addBookingController);
                    
                $scope.addBookingController.timeslot.charges.forEach(function(item) { //reset quantity to 0 for all charges for every new booking dialog open
                    item.quantity = 0;
                });

                    this.toggleQuestions = function () {
                        //$log.debug('toggle questions');
                        this.questionsExpanded = this.formWasBlocked
                            ? false
                            : !this.questionsExpanded;
                    }

                    this.adjustAddon = function (i, mode) {
                        if (mode == 'up')
                            vm.addons[i].quantity++;
                        if (mode == 'down' && vm.addons[i].quantity > 0)
                            vm.addons[i].quantity--;

                        $scope.safeApply()
                        $log.debug('adjust addons', vm.addons);
                        vm.getPricingQuote();
                    }
                    //$log.debug('adjustAddon:addons', vm.addons);

                    this.toggleAddons = function () {
                        //$log.debug('toggle addons');
                        if (vm.addons.length < 1)
                            this.questionsExpanded = this.formWasBlocked
                                ? false
                                : !this.questionsExpanded;
                        else
                            this.addonsExpanded = this.formWasBlocked
                                ? false
                                : !this.addonsExpanded;
                        }

                    this.toggleStripePay = function () {
                        this.paymentExpanded = !this.paymentExpanded;
                    }

                    this.togglePay = function () {
                        this.payButtonEnabled = !this.payButtonEnabled;
                    }

                    this.adjustAttendee = function (i, mode) {
                        //Allow dashboard users to overbook
                        if (mode == 'up' && (vm.countAttendees() > 0 || $scope.dashboard))
                            vm.attendees[i].quantity++;
                        if (mode == 'down' && vm.attendees[i].quantity > 0)
                            vm.attendees[i].quantity--;

                        //$log.debug('adjust attendees', vm.attendees);
                        vm.getPricingQuote();
                        vm.countAttendees();
                    }

                    this.toggleAttendees = function () {
                        //$log.debug('toggle attendees');
                        this.attendeesExpanded = this.formWasBlocked
                            ? false
                            : !this.attendeesExpanded;
                    }

                    this.checkAdjustAttendee = function ($index) {
                        if (!$scope.dashboard && vm.attendees[$index].quantity > vm.countAttendees()) {
                            vm.attendees[$index].quantity = 0;
                            vm.attendees[$index].quantity = vm.countAttendees();
                        }
                        if (vm.attendees[$index].quantity < 0)
                            vm.attendees[$index].quantity = 0;

                        vm.getPricingQuote();
                        vm.countAttendees();
                        $scope.safeApply();
                        $log.debug('attendees added', vm.countAttendees(), vm.attendees[$index].quantity);
                    }

                    var data = {
                        "attendees": {},
                        "addons": {}
                    }

                    function buildQuery() {
                        // Parse attendees
                        angular
                            .forEach(vm.attendees, function (e, i) {
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
                        //$log.debug('pricing quote POST data', data);
                        data.currency = vm.currency.toUpperCase()
                        return data;
                    }

                    // Query for pricing data based on the data object used to make a booking
                    // request
                    vm.getPricingQuote = function () {
                        var query = buildQuery();
                        $http({
                                method: 'POST',
                                url: config.FEATHERS_URL + '/pricing-quotes',
                                data: query,
                                headers: headers
                            }).then(function successCallback(response) {
                            vm.pricing = response.data;
                            vm.pricing.couponDeduction = vm
                                .pricing
                                .items
                                .filter(function (item) {
                                    return item.type == 'coupon';
                                });

                            var addonsFilter = response
                                .data
                                .items
                                .filter(function (item) {
                                    return item.type == 'addon';
                                });
                            vm.addonTotal = 0;
                            vm.addonSubtotals = [];
                            var addonsArray = {};
                            angular.forEach(addonsFilter, function (addon, key) {
                                var object = addon.type + addon
                                    .name
                                    .replace(' ', '');
                                if (!addonsArray[object]) {
                                    addonsArray[object] = {
                                        addons: []
                                    };
                                }
                                addonsArray[object]
                                    .addons
                                    .push(addon);
                            });
                            angular.forEach(addonsArray, function (addon, key) {
                                var obj = {
                                    name: addon.addons[0].name,
                                    price: addon.addons[0].amount || addon.addons[0].price,
                                    amount: (addon.addons[0].amount || addon.addons[0].price) * addon.addons[0].quantity,
                                    quantity: addon.addons[0].quantity
                                };
                                vm.addonTotal += (addon.addons[0].amount || addon.addons[0].price) * addon.addons[0].quantity;
                                vm
                                    .addonSubtotals
                                    .push(obj);
                            });

                            vm.attendeeTotal = response
                                .data
                                .items
                                .filter(function (item) {
                                    return item.type == "aap"
                                })
                                .reduce(function (result, att) {
                                    return result + (att.amount || att.price) * att.quantity
                                }, 0);

                            var aapFilter = response
                                .data
                                .items
                                .filter(function (item) {
                                    return item.type == 'aap';
                                });
                            vm.attendeeSubtotals = [];
                            var attendeesArray = {};
                            angular.forEach(aapFilter, function (aap, key) {
                                var object = aap.type + aap
                                    .name
                                    .replace(' ', '');
                                if (!attendeesArray[object]) {
                                    attendeesArray[object] = {
                                        aaps: []
                                    };
                                }
                                attendeesArray[object]
                                    .aaps
                                    .push(aap);
                            });
                            angular.forEach(attendeesArray, function (aap, key) {
                                var obj = {
                                    name: aap.aaps[0].name,
                                    price: aap.aaps[0].amount || aap.aaps[0].price,
                                    amount: aap.aaps[0].amount * aap.aaps[0].quantity,
                                    quantity: aap.aaps[0].quantity
                                };
                                vm
                                    .attendeeSubtotals
                                    .push(obj);
                            });

                            vm.taxTotal = response
                                .data
                                .items
                                .filter(function (item) {
                                    return item.type == "tax" || item.type == "fee" || item.type == 'service'
                                })
                                .reduce(function (result, tax) {
                                    $log.debug('reduce.vm.taxTotal', tax);
                                    return result + ((tax.price.amount || tax.price.price) * tax.quantity)
                                }, 0);

                            $log.debug('getPricingQuotes', response);
                            $log.debug('vm.attendeeSubtotal', vm.attendeeSubtotals);
                            $log.debug('vm.taxTotal', vm.taxTotal);

                            if (vm.pricing.total == 0 && vm.paymentMethod == 'credit') {
                                vm.paymentMethod = 'cash';
                            }
                        }, function errorCallback(response) {
                            vm.pricing = {};
                            vm.taxTotal = 0;
                            $mdToast.show($mdToast.simple().textContent(response.data.errors[0]).position('left bottom').hideDelay(3000));
                            //$log.debug('getPricingQuotes error!', response, vm.pricing);
                        });
                    }

                    //Query for possible coupons partially matching the vm.couponQuery search string
                    vm.getPossibleCoupons = function () {
                        $http({
                                method: 'GET',
                                url: config.FEATHERS_URL + '/coupons?bookingId=' + vm.couponQuery,
                                headers: headers
                            })
                            .then(function successCallback(response) {
                                vm.possibleCoupons = response.data;
                                $log.debug('getPossibleCoupons success', response);
                            }, function errorCallback(response) {
                                vm.possibleCoupons = [];
                                // vm.taxTotal = 0; $log.debug('getPossibleCoupons error!', response);
                            });
                    }

                    vm.clients = [];
                    observeOnScope($scope, 'vm.formData.fullName').map(function (data) {
                        return data;
                    })
                        .subscribe(function (change) {
                            $log.debug('clientSearchText ', change.newValue);
                            if ($scope.dashboard) {
                                vm.clients = $http({
                                        method: 'GET',
                                        url: config.FEATHERS_URL + '/clients?fullName=' + change.newValue,
                                        headers: headers
                                    }).then(function successCallback(response) {
                                    $log.debug('clientSearch success', response);
                                    return response.data.list;
                                }, function errorCallback(response) {
                                    $log.debug('clientSearch error!', response);
                                    return [];
                                });
                            }
                        });

                    vm.selectedClientChange = function (client) {
                        if (client) {
                            vm.formData.fullName = client.primaryContact.fullName || '';
                            vm.formData.mail = client.primaryContact.email || '';
                            vm.formData.phoneNumber = client.primaryContact.phoneNumber || '';
                            $log.debug('selectedClientChange', client);
                        }
                    }

                    $scope.autocomplete = {};
                    vm.couponStatus = 'untouched';

                    $scope.autocomplete.searchTextChange = function searchTextChange(text) {
                        if (!text)
                            if (data['couponId'])
                                delete data['couponId'];
                            }

                    $scope.autocomplete.selectedItemChange = function selectedItemChange(item) {
                        $log.debug('applied coupon', item);

                        if (item) {
                            vm.appliedCoupon = item;
                            data['couponId'] = item['couponId'];
                            vm.validateCoupon(vm.appliedCoupon);
                            vm.couponStatus = 'valid';
                            vm.getPricingQuote();
                            vm.checkingCoupon = false;
                        } else {
                            vm.appliedCoupon = undefined;
                            vm.couponStatus = 'untouched';
                            if (data['couponId'])
                                delete data['couponId'];
                            }
                        }

                    var queryDebounce = false;
                    vm.coupons = [];
                    $scope.autocomplete.querySearch = function querySearch(text) {
                        if ($scope.dashboard) {
                            text = text.toUpperCase();
                            if (!queryDebounce && text.length !== 1) {
                                queryDebounce = true;
                                return $timeout(function () {
                                    return $http({
                                            method: 'GET',
                                            url: config.FEATHERS_URL + '/coupons?couponId=' + text,
                                            headers: headers
                                        }).then(function successCallback(response) {
                                        queryDebounce = false;
                                        vm.coupons = response.data.list;
                                        return vm.coupons;
                                        $log.debug('getPossibleCoupons success', response.data.list);
                                    }, function errorCallback(response) {
                                        queryDebounce = false;
                                        return [];
                                        $log.debug('getPossibleCoupons error!', response);
                                    });
                                }, 100)

                            } else {
                                return this;
                            }
                        }

                    }

                    // Check whether the vm.couponQuery search string exists as a coupon, if
                    // successful, add the coupon id to the make booking request object as the
                    // 'coupon' property
                    vm.checkCoupon = function () {
                        vm.checkingCoupon = true;
                        //$log.debug('check coupon', vm.couponQuery);
                        $http({
                                method: 'GET',
                                url: config.FEATHERS_URL + '/coupons/' + vm.couponQuery,
                                headers: headers
                            }).then(function successCallback(response) {
                            $log.debug('checkCoupon success', response);
                            data['couponId'] = response.data['couponId'];
                            vm.appliedCoupon = response.data;
                            $log.debug('applied coupon', vm.appliedCoupon);
                            vm.validateCoupon(vm.appliedCoupon);
                            vm.couponStatus = 'valid';
                            vm.getPricingQuote();
                            vm.checkingCoupon = false;

                        }, function errorCallback(response) {
                            delete data['couponId'];
                            vm.couponStatus = 'invalid';
                            vm.appliedCoupon = {};
                            vm.checkingCoupon = false;

                            //$log.debug('checkCoupon error!', response);
                        });
                    }

                    vm.removeCoupon = function () {
                        vm.couponQuery = '';
                        delete data['couponId'];
                        $scope.autocomplete.selectedItem = undefined;
                        vm.couponStatus = 'untouched';
                        vm.appliedCoupon = {};
                        vm.getPricingQuote();
                    }

                    const moment = window.moment;

                    vm.validateCoupon = function (coupon) {
                        const today = moment();
                        // $log.debug('coupon expires after today',
                        // moment(coupon.endTime).isAfter(moment())); Coupon is not expired and is
                        // infinitely redeemable
                        if (moment(coupon.endTime).isAfter(moment()) && coupon.maxRedemptions == 0)
                            return true;

                        // Coupon is not expired and has been redeemed less than the maximum allowable
                        // redemptions
                        if (coupon.maxRedemptions > 0 && moment(coupon.endTime).isAfter(moment()) && coupon.maxRedemptions - coupon.redemptions >= 0)
                            return true;

                        //Coupon is expired or has been redeemed too many times
                        vm.couponStatus = 'invalid';
                        return false;
                    }
                    
                    vm.appliedCouponType = function(coupon) {
                        if (coupon) {
                            if (coupon.percentage) {
                                return coupon.amount + '%';
                            }
                            else {
                                return $filter('ablCurrency')(coupon.amount, $rootScope.currency);
                            }
                        }
                    }

                    vm.bookingQuestionsCompleted = function () {
                        var completed = 0;
                        if (vm.bookingQuestions) {
                            angular
                                .forEach(vm.bookingQuestions, function (e, i) {
                                    if (e.length > 0)
                                        completed++;
                                    }
                                );
                        } else {
                            completed = 0;
                        }
                        //$log.debug('vm.bookingQuestions', vm.bookingQuestions, completed);
                        return completed;
                    }
                    // Observe and debounce an object on the $scope, can be used on a search input
                    // for example to wait before auto-sending the value
                    observeOnScope($scope, 'vm.couponQuery')
                        .debounce(500)
                        .select(function (response) {
                            return response;
                        })
                        .subscribe(function (change) {
                            //$log.debug('search value', change);
                            if (vm.couponQuery.length > 0)
                                vm.checkCoupon();
                            }
                        );

                    activityBookValidators(vm, rx, $http, $stateParams);

                    $scope.$watch('addBookingController.activity', function (changes) {
                        $log.debug('addBookingController.activity', changes);
                        if (angular.isDefined($scope.addBookingController.activity)) {
                            //Get booking questions
                            vm.questions = $scope.addBookingController.activity.questions || [];
                            if (!vm.questions) {
                                delete vm.validStepsForPayment.bookingQuestions;
                            }
                            //$log.debug('booking questions', vm.questions);

                            vm.addons = $scope
                                .addBookingController
                                .activity
                                .charges
                                .filter(function (charge) {
                                    return charge.type == 'addon' && charge.status == 'active';
                                });
                            if (!vm.addons) {
                                delete vm.validStepsForPayment.addons;
                            }
                            vm
                                .addons
                                .forEach(function (e, i) {
                                    if (!angular.isDefined(e.quantity))
                                        e.quantity = 0;
                                    }
                                );

                            vm.taxes = $scope
                                .addBookingController
                                .activity
                                .charges
                                .filter(function (charge) {
                                    return charge.type == 'tax';
                                });
                            $scope.safeApply();
                            //$log.debug('taxes', vm.taxes);

                        }
                    }, true);

                    $scope.$watch('addBookingController.timeslot', function (changes) {
                        if (angular.isDefined($scope.addBookingController.timeslot) && angular.isDefined($scope.addBookingController.event)) {

                            if (angular.isDefined($scope.addBookingController.timeslot.charges)) {
                                vm.attendees = $scope
                                    .addBookingController
                                    .timeslot
                                    .charges
                                    .filter(function (charge) {
                                        return charge.type == 'aap' && charge.status == 'active';
                                    });
                                vm
                                    .attendees
                                    .forEach(function (e, i) {
                                        if (!angular.isDefined(e.quantity))
                                            e.quantity = 0;
                                        }
                                    );
                            }
                            data['timeSlotId'] = $scope.addBookingController.timeslot._id;
                            data['startTime'] = $scope.addBookingController.event.startTime;

                        }
                    }, true);

                    vm.countAttendees = function () {
                        var attendees = 0;
                        if ($scope.addBookingController.event) {
                            if (vm.attendees) {
                                attendees = ($scope.addBookingController.event.maxOcc
                                    ? $scope.addBookingController.event.maxOcc
                                    : $scope.addBookingController.timeslot.maxOcc) - vm
                                    .attendees
                                    .map(function (att) {
                                        return att.quantity;
                                    })
                                    .reduce((a, b) => a + b, 0) - $scope.addBookingController.event.attendees;
                            } else {
                                attendees = 0;
                            }
                        }
                        return attendees;

                    }

                    vm.countAttendeesAdded = function () {
                        var attendeesAdded = 0;
                        if ($scope.addBookingController.event) {
                            if (vm.attendees) {
                                attendeesAdded = vm
                                    .attendees
                                    .map(function (att) {
                                        return att.quantity;
                                    })
                                    .reduce((a, b) => a + b, 0);
                            }
                        }
                        // $log.debug('countAttendeesAdded', attendeesAdded);
                        return attendeesAdded;
                    }

                    vm.countAddonsAdded = function () {
                        if ($scope.addBookingController.event) {
                            if (vm.addons) {
                                return vm
                                    .addons
                                    .map(function (add) {
                                        return add.quantity;
                                    })
                                    .reduce((a, b) => a + b, 0);
                            } else {
                                return 0;
                            }
                        }
                        return 0;
                    }

                    vm.addonsChanged = function () {
                        $scope.safeApply();
                        $log.debug('addonsChanged');
                        $timeout(function () {
                            vm.getPricingQuote();
                        }, 0);
                    }

                    this.areGuestDetailsValid = function (form) {
                        if (form) {
                            vm.guestDetailsAreValid = form.$valid;
                            vm.validStepsForPayment.guest = vm.guestDetailsAreValid;
                        } else {
                            vm.guestDetailsAreValid = false;
                        }
                        return vm.guestDetailsAreValid;
                    }

                    this.areAttendeesValid = function () {
                        vm.validStepsForPayment.attendees = vm.countAttendeesAdded() === 0
                            ? false
                            : true;
                        return vm.countAttendeesAdded() === 0
                            ? false
                            : true;
                    }

                    this.areAddonsValid = function () {
                        if (vm.validStepsForPayment.addons != null) {
                            vm.validStepsForPayment.addons = true;
                        }
                        return vm.countAddonsAdded() === 0
                            ? false
                            : true;
                    }

                    this.areBookingQuestionsValid = function () {
                        if (vm.validStepsForPayment.bookingQuestions != null) {
                            vm.validStepsForPayment.bookingQuestions = (vm.bookingQuestionsCompleted() === vm.questions.length
                                ? true
                                : false);
                        }
                        $log.debug('areBookingQuestionsValid ', vm.validStepsForPayment.bookingQuestions)

                        return vm.validStepsForPayment.bookingQuestions;
                    }

                    this.isPaymentValid = function () {
                        var isValid = [];
                        angular.forEach(vm.validStepsForPayment, function (step, key) {
                            if (!step) {
                                isValid.push(step);
                            }
                        });
                        return isValid.length > 0
                            ? false
                            : true;
                    }

                    this.isNextStepPayment = function (step) {
                        if (step === 'attendees') {
                            if (vm.addons || vm.questions) {
                                return vm.addons || vm.questions
                                    ? true
                                    : false;
                            } else {
                                return false;
                            }
                        }
                        if (step === 'addons') {
                            if (vm.questions) {
                                return vm.questions
                                    ? true
                                    : false;
                            } else {
                                return false;
                            }
                        }
                        if (step === 'payment') {
                            return true;
                        }
                    }

                    vm.paymentMethod = 'credit';
                    vm.bookingQuestions = [];
                    vm.getBookingData = function () {
                        const bookingData = angular.copy(data);
                        if (vm.paymentMethod == 'reserved')
                            bookingData['amount'] = 0;
                        bookingData['eventInstanceId'] = $scope.addBookingController.event['eventInstanceId'] || $scope.addBookingController.event;
                        bookingData['answers'] = {};

                        bookingData['sendConfirmationEmail'] = $scope.sendConfirmationEmail;
                        bookingData['skipConfirmation'] = !$scope.sendConfirmationEmail;

                        bookingData['email'] = vm.formData['mail'];
                        bookingData['phoneNumber'] = vm.formData['phoneNumber'];
                        bookingData['fullName'] = vm.formData['fullName'];
                        bookingData['notes'] = vm.formData['notes'];
                        bookingData['skipConfirmation'] = false;
                        bookingData['operator'] = $scope.addBookingController.event.operator || $scope.addBookingController.event.organizations[0] || $scope.addBookingController.activity.operator || $scope.addBookingController.activity.organizations[0];
                        angular.forEach(vm.questions, function (e, i) {
                            $log.debug('vm.questions', vm.questions);
                            $log.debug('vm.bookingQuestions', vm.bookingQuestions);
                            bookingData['answers'][e._id
                                    ? e._id
                                    : e] = vm.bookingQuestions[i];
                        });

                        if (vm.paymentMethod != 'reserved')
                            bookingData['paymentMethod'] = vm.paymentMethod;
                        else
                            bookingData['paymentMethod'] = 'cash';

                        if (vm.paymentMethod == 'reserved') {
                            bookingData['amount'] = 0;
                        }
                        bookingData['currency'] = 'default';

                        return bookingData;
                    }

                    vm.outputBookingData = function () {
                        $log.debug(vm.getBookingData());
                    }

                    $scope.safeApply = function (fn) {
                        var phase = this.$root.$$phase;
                        if (phase == '$apply' || phase == '$digest') {
                            if (fn && (typeof(fn) === 'function')) {
                                fn();
                            }
                        } else {
                            this.$apply(fn);
                        }
                    };

                    function goToPay() {

                        vm.guestDetailsExpanded = false;
                        vm.attendeesExpanded = false;
                        vm.addonsExpanded = false;
                        vm.questionsExpanded = false;

                        vm.showPaymentForm = true;
                        vm.paymentFormIsLoading = true;
                        vm.stripePaymentExpanded = true;

                        vm.paymentWasSent = true;
                        this.formWasBlocked = true;
                        $scope.bookingSuccessResponse = 'processing';
                        $scope.safeApply();
                        $scope.makeBooking();
                    }

                    function submitNonCreditCardBooking() {
                        $log.debug('submitNonCreditCardBooking', this.pricing.total);

                        var bookingData = vm.getBookingData();
                        if (bookingData.stripeToken)
                            delete bookingData.stripeToken;
                        bookingData.location = {};
                        bookingData.isMobile = false;
                        vm.paymentWasSent = true;
                        $scope.bookingSuccessResponse = 'processing';
                        if (Raven) {
                            Raven.captureMessage('Submit Booking', {
                                level: 'info', // one of 'info', 'warning', or 'error'
                                extra: {
                                    bookingData: bookingData
                                },
                                tags: {
                                    step: 'pay-non-cc'
                                }
                            });
                        }
                        $http({
                                method: 'POST',
                                url: config.FEATHERS_URL + '/bookings',
                                data: bookingData,
                                headers: headers
                            })
                            .then(function successCallback(response) {
                                $log.debug('submitNonCreditCardBooking success', response);
                                $scope.bookingSuccessResponse = response;
                                vm.waitingForResponse = false;
                                $rootScope.$emit('paymentResponse');
                                validatePayment(response);
                            }, function errorCallback(response) {
                                var errorElement = document.getElementById('card-errors');
                                errorElement.textContent = response.data.errors[0];
                                vm.paymentWasSent = false;
                                $rootScope.$emit('paymentResponse');
                                vm.waitingForResponse = false;
                            });
                    }

                    function validatePayment(response) {
                        if (response.status === 200) {
                            $scope.paymentResponse = 'success'; //processing, failed
                            $scope.paymentSuccessful = true;
                            if (Raven) {
                                Raven.captureMessage('Booking Suceeded', {
                                    level: 'info', // one of 'info', 'warning', or 'error'
                                    extra: {
                                        response: response
                                    },
                                    tags: {
                                        step: 'pay-non-cc'
                                    }
                                });
                            }
                            $scope.safeApply();
                        }
                        $scope.bookingSuccessResponse = response;

                        $scope.$emit('paymentResponse', response);
                        console.log('paymentResponse', response);
                    }

                    $scope.makeBooking = function (data) {
                        vm.paymentExpanded = true;
                        vm.loadingIframe = true;
                        var bookingData = vm.getBookingData();
                        if (Raven) {
                            Raven.captureMessage('Submit Booking', {
                                level: 'info', // one of 'info', 'warning', or 'error'
                                extra: {
                                    bookingData: bookingData
                                },
                                tags: {
                                    step: 'pay-cc'
                                }
                            });
                        }
                        $log.debug('$scope.makeBooking', data);
                        $scope.bookingResponse = $http({
                                method: 'POST',
                                url: config.FEATHERS_URL + '/bookings',
                                data: bookingData,
                                headers: headers
                                // headers: {     "Content-Type": "application/json;charset=utf-8" }
                            }).then(function successCallback(response) {
                            $log.debug('makeBooking success', response);
                            vm.loadingIframe = false;
                            $scope.paymentSuccessful = false;
                            $scope.bookingSuccessResponse = response;
                            vm.paymentFormIsLoading = false;
                            var iframe = document.getElementById("paymentIframe");
                            iframe.style.display = 'block';
                            var iframeDoc = iframe.contentWindow.document;
                            iframeDoc.open();
                            iframeDoc.write(response.data.iframeHtml);
                            iframeDoc.close();
                            $scope.bookingSucceeded = true;
                            if (Raven) {
                                Raven.captureMessage('Booking Succeeded', {
                                    level: 'info', // one of 'info', 'warning', or 'error'
                                    extra: {
                                        response: response.data
                                    },
                                    tags: {
                                        step: 'pay-cc'
                                    }
                                });
                            }
                        }, function errorCallback(response) {
                            $mdDialog.hide();
                            vm.loadingIframe = false;
                            vm.paymentFormIsLoading = false;
                            vm.paymentExpanded = false;
                            $scope.bookingSucceeded = false;
                            if (Raven) {
                                Raven.captureMessage('Booking Error', {
                                    level: 'error', // one of 'info', 'warning', or 'error'
                                    extra: {
                                        response: response.data
                                    },
                                    tags: {
                                        step: 'pay-cc'
                                    }
                                });
                            }
                            $mdToast.show($mdToast.simple().textContent(response.data.errors[0]).position('left bottom').hideDelay(3000));
                            $log.debug('makeBooking error!', response);
                        });
                    }

                    var lpad = function (numberStr, padString, length) {
                        while (numberStr.length < length) {
                            numberStr = padString + numberStr;
                        }
                        return numberStr;
                    };

                    var paymentMessageHandler;
                    paymentMessageHandler = function (event) {
                        // if (event.origin == "https://calendar.ablist.win") { // TODO add to config
                        // $log.debug("TRUSTED ORIGIN", event.origin);
                        $log.debug("DATA", event.data);
                        if (event.data == "payment_complete" || event.data.type == "payment_success") {
                            $log.debug("PAYMENT COMPLETE");
                            $scope.paymentResponse = 'success'; //processing, failed
                            //   $rootScope.showToast('Payment processed successfully.');
                            $rootScope.$broadcast('paymentWithResponse', {response: event.data});

                            window.removeEventListener("message", paymentMessageHandler);
                            $scope.paymentSuccessful = true;
                            //   $scope.changeState('bookings'); //Go to bookings view if successful
                            $scope.safeApply();
                            //$mdDialog.hide();
                        } else {
                            if (Raven) {
                                Raven.captureMessage('Booking Payment Error', {
                                    level: 'error', // one of 'info', 'warning', or 'error'
                                    extra: {
                                        paymentMessageHandler: event.data
                                    },
                                    tags: {
                                        step: 'pay-non-cc'
                                    }
                                });
                            } // $rootScope.showToast(event.data.message, 'errorToast');
                            // $rootScope.$broadcast('paymentWithResponse', { response: event.data });
                            $scope.paymentSuccessful = false;
                            $scope.paymentResponse = ''; //processing, failed
                            vm.showPaymentForm = true;
                            $scope.safeApply();
                        }
                    };

                    $log.debug("Adding Payment Message Event Listener");
                    window.addEventListener("message", paymentMessageHandler);

                    $scope.safeApply = function (fn) {
                        var phase = this.$root.$$phase;
                        if (phase == '$apply' || phase == '$digest') {
                            if (fn && (typeof(fn) === 'function')) {
                                fn();
                            }
                        } else {
                            this.$apply(fn);
                        }
                    };

                    var lpad = function (numberStr, padString, length) {
                        while (numberStr.length < length) {
                            numberStr = padString + numberStr;
                        }
                        return numberStr;
                    };

                    // Merge identical items from an array into nested objects, summing their amount
                    // properties and keeping track of quantities
                    function mergeIdenticalArrayItemsIntoObject(data, oldObject) {
                        var seen = oldObject;
                        //$log.debug('mergeIdenticalArrayItemsIntoObject:data', data);
                        angular.forEach(data, function (e, i) {
                            if (seen.hasOwnProperty(e.name) && seen[e.name] === e.name) {
                                seen[e['name']]['price'] = e['price']; //Sum their prices
                                seen[e['name']]['quantity'] += 1; //Increment their quantity
                                seen[e['name']]['amount'] = seen[e['name']]['amount'] * seen[e['name']]['quantity']; //Sum their prices
                                //$log.debug('merged', seen[e['name']]);
                            } else {
                                seen[e['name']] = {};
                                seen[e['name']]['name'] = e['name'];
                                seen[e['name']]['price'] = e['price'];
                                seen[e['name']]['quantity'] = 1;
                                seen[e['name']]['amount'] = e['amount'];
                            }
                        });
                        //$log.debug('mergeIdenticalArrayItems', seen);
                        return seen;
                    }
                }
            };
        }
    ]);
