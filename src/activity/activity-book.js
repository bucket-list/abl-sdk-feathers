import activityTotalTemplate from './activity-total.html';
import activityFormsTemplate from './activity-forms.html';
import activityBookingTemplate from './activity-book.html';

import activityBookValidators from './activity-book-validators';

export default angular.module('activity-book', ['ngMaterial', 'rx'])
    .run(function($templateCache) {
        $templateCache.put('activity-forms.html', activityFormsTemplate);
        $templateCache.put('activity-book.html', activityBookingTemplate);
        $templateCache.put('activity-total.html', activityTotalTemplate);
    })
    .directive('ablActivityBook', ['$rootScope', '$sce', '$compile', '$mdMedia', '$mdDialog', '$mdToast', '$log', '$window', '$http', 'config', 'rx', 'observeOnScope', '$stateParams', '$state', function($rootScope, $sce, $compile, $mdMedia, $mdDialog, $mdToast, $log, $window, $http, config, rx, observeOnScope, $stateParams, $state) {
        return {
            restrict: 'E',
            scope: {
                book: '='
            },
            template: activityBookingTemplate,
            link: function($scope, element, attrs) {
                // Digest on resize to recalculate $mdMedia window size
                function onResize() {
                    //console.log('resize');
                    $scope.$digest();
                };
                angular.element($window).on('resize', onResize);
            },
            controllerAs: 'vm',
            controller: function($scope, $element, $attrs) {
                //console.log('ablActivityBookController', $scope, $attrs);
                var vm = this;

                const ENV = config;
                //const stripe = window.Stripe;

                ENV.apiVersion = config.FEATHERS_URL;

                this.formWasBlocked = false;
                this.guestDetailsExpanded = true;
                this.attendeesExpanded = false;
                this.addonsExpanded = false;
                this.questionsExpanded = false;
                this.stripePaymentExpanded = false;
                this.paymentExpanded = false;
                this.paymentWasSent = false;
                this.waitingForResponse = false;
                vm.validStepsForPayment = {
                    'guest': false,
                    'attendees': false,
                    'addons': false,
                    'bookingQuestions': false
                };

                this.couponStatus = 'untouched';
                this.appliedCoupon = {};
                this.couponQuery = '';
                this.occupancyRemaining = 0;

                this.attendeeSubtotals = [];
                this.addonSubtotals = [];
                //Get taxes
                vm.taxes = [];
                vm.taxTotal = 0;
                //Get addons
                vm.addons = [];
                vm.questions = [];



                $scope.paymentResponse = '';

                this.goToNextStep = function(currentStepName, form) {
                    switch (currentStepName) {
                        case 'guestDetailsStep': //goes to attendees
                            vm.toggleGuestDetails();
                            vm.toggleAttendees();
                            break;
                        case 'attendeesStep': //goes to addons || booking || pay
                            //console.log('goToNextStep:attendeesStep', vm.attendeesAdded);
                            if (vm.countAttendeesAdded() > 0) { //validate attendees
                                //console.log('attendeesStep', vm.addons.length, vm.questions);
                                if (vm.addons.length > 0) {
                                    vm.toggleAttendees(); //close current
                                    vm.toggleAddons();
                                }
                                else if (vm.questions.length > 0) {
                                    vm.toggleAttendees(); //close current
                                    vm.toggleQuestions();
                                }
                            }
                            break;
                        case 'addonsStep': //goes to addons || booking || pay
                            if (vm.addons.length > 0) { //validate addons
                                if (vm.countAttendeesAdded()) { //if guests and attendees are valid
                                    if (vm.questions.length > 0) { //go to questions if questions exist
                                        vm.toggleAddons();
                                        vm.toggleQuestions();
                                    }
                                    else { //got to pay if qustions doesn't exist
                                        vm.toggleAddons();
                                        vm.toggleStripePay();
                                    }
                                }
                            }
                            break;
                        case 'paymentStep': //goes to addons || booking || pay
                            console.log('goToNextStep:paymentStep', vm.isPaymentValid());
                            if (vm.isPaymentValid()) { //if guests and attendees are valid
                                vm.guestDetailsExpanded = false;
                                vm.attendeesExpanded = false;
                                vm.addonsExpanded = false;
                                vm.questionsExpanded = false;
                                vm.stripePaymentExpanded = true;
                            }
                            break;
                    }
                }

                vm.guestDetailsFormValid = false;

                this.toggleGuestDetails = function() {
                    //console.log('toggle guest details');
                    this.guestDetailsExpanded = this.formWasBlocked ? false : !this.guestDetailsExpanded;
                }

                this.togglePayment = function() {
                    //console.log('toggle payment');
                    this.paymentExpanded = !this.paymentExpanded;
                }

                this.returnToMainPage = function() {
                    $state.go('home', {
                        merchant: $stateParams.merchant
                    });
                }

                this.pricing = {
                    total: 0
                };
                this.taxTotal, this.addonTotal, this.attendeeTotal = 0;


                $scope.bookingSucceeded = false;
                $scope.$mdMedia = $mdMedia;
                $scope.screenIsBig = function() {
                    var w = angular.element($window);
                    return w[0].innerWidth > 742;
                }

                $scope.addBookingController = $scope.$parent;
                //console.log('addBookingController', $scope.addBookingController);

                this.toggleQuestions = function() {
                    //console.log('toggle questions');
                    this.questionsExpanded = this.formWasBlocked ? false : !this.questionsExpanded;
                }

                this.adjustAddon = function(i, mode) {
                        if (mode == 'up')
                            vm.addons[i].quantity++;
                        if (mode == 'down' && vm.addons[i].quantity > 0)
                            vm.addons[i].quantity--;

                        //console.log('adjust addons', vm.addons);
                        vm.getPricingQuote();
                    }
                    //console.log('adjustAddon:addons', vm.addons);

                this.toggleAddons = function() {
                    //console.log('toggle addons');
                    if (vm.addons.length < 1)
                        this.questionsExpanded = this.formWasBlocked ? false : !this.questionsExpanded;
                    else
                        this.addonsExpanded = this.formWasBlocked ? false : !this.addonsExpanded;
                }

                this.toggleStripePay = function() {
                    this.paymentExpanded = !this.paymentExpanded;
                }

                this.togglePay = function() {
                    this.payButtonEnabled = !this.payButtonEnabled;
                }

                this.adjustAttendee = function(i, mode) {
                    if (mode == 'up' && vm.countAttendees() > 0)
                        vm.attendees[i].quantity++;
                    if (mode == 'down' && vm.attendees[i].quantity > 0)
                        vm.attendees[i].quantity--;

                    //console.log('adjust attendees', vm.attendees);
                    vm.getPricingQuote();
                    vm.countAttendees();
                }

                this.toggleAttendees = function() {
                    //console.log('toggle attendees');
                    this.attendeesExpanded = this.formWasBlocked ? false : !this.attendeesExpanded;
                }

                this.checkAdjustAttendee = function($index) {
                    if (vm.attendees[$index].quantity > vm.countAttendees()) {
                        vm.attendees[$index].quantity = 0;
                        vm.attendees[$index].quantity = vm.countAttendees();
                    }
                    if (vm.attendees[$index].quantity < 0)
                        vm.attendees[$index].quantity = 0;

                    $scope.safeApply();
                    //console.log('attendees added', vm.countAttendees(), vm.attendees[$index].quantity);
                }

                var data = {
                    "attendees": {},
                    "addons": {}
                }


                function buildQuery() {
                    // Parse attendees
                    angular.forEach(vm.attendees, function(e, i) {
                        data["attendees"][e._id] = [];
                        if (e.quantity > 0) {
                            for (var i = 0; i < e.quantity; i++) {
                                data["attendees"][e._id].push(null);
                            }
                        }
                    });

                    // Parse addons
                    angular.forEach(vm.addons, function(e, i) {
                        data["addons"][e._id] = [];
                        if (e.quantity > 0) {
                            for (var i = 0; i < e.quantity; i++) {
                                data["addons"][e._id].push(null);
                            }
                        }
                    });
                    //console.log('pricing quote POST data', data);
                    //return url;
                    return data;
                }

                // Query for pricing data based on the data object used to make a booking request
                vm.getPricingQuote = function() {
                    var query = buildQuery();
                    $http({
                        method: 'POST',
                        url: ENV.apiVersion + '/pricing-quotes',
                        data: query,
                        headers: {
                            'x-abl-access-key': $stateParams.merchant,
                            'x-abl-date': Date.parse(new Date().toISOString())
                        }
                    }).then(function successCallback(response) {
                        vm.pricing = response.data;
                        vm.pricing.couponDeduction = vm.pricing.items.filter(function(item) {
                            return item.type == 'coupon';
                        });

                        var addonsFilter = response.data.items.filter(function(item) {
                            return item.type == 'addon';
                        });
                        vm.addonTotal = 0;
                        vm.addonSubtotals = [];
                        var addonsArray = {};
                        angular.forEach(addonsFilter, function(addon, key) {
                            var object = addon.type + addon.name.replace(' ', '');
                            if (!addonsArray[object]) {
                                addonsArray[object] = {
                                    addons: []
                                };
                            }
                            addonsArray[object].addons.push(addon);
                        });
                        angular.forEach(addonsArray, function(addon, key) {
                            var obj = {
                                name: addon.addons[0].name,
                                price: addon.addons[0].amount,
                                amount: addon.addons[0].amount * addon.addons.length,
                                quantity: addon.addons.length
                            };
                            vm.addonTotal += addon.addons[0].amount * addon.addons.length;
                            vm.addonSubtotals.push(obj);
                        });


                        vm.attendeeTotal = response.data.items.filter(function(item) {
                            return item.type == "aap"
                        }).reduce(function(result, att) {
                            return result + att.amount
                        }, 0);


                        var aapFilter = response.data.items.filter(function(item) {
                            return item.type == 'aap';
                        });
                        vm.attendeeSubtotals = [];
                        var attendeesArray = {};
                        angular.forEach(aapFilter, function(aap, key) {
                            var object = aap.type + aap.name.replace(' ', '');
                            if (!attendeesArray[object]) {
                                attendeesArray[object] = {
                                    aaps: []
                                };
                            }
                            attendeesArray[object].aaps.push(aap);
                        });
                        angular.forEach(attendeesArray, function(aap, key) {
                            var obj = {
                                name: aap.aaps[0].name,
                                price: aap.aaps[0].amount,
                                amount: aap.aaps[0].amount * aap.aaps.length,
                                quantity: aap.aaps.length
                            };
                            vm.attendeeSubtotals.push(obj);
                        });

                        vm.taxTotal = response.data.items.filter(function(item) {
                            return item.type == "tax" || item.type == "fee"
                        }).reduce(function(result, tax) {
                            return result + tax.amount
                        }, 0);

                        //console.log('getPricingQuotes', response);
                        //console.log('taxTotal', vm.taxTotal);
                    }, function errorCallback(response) {
                        vm.pricing = {};
                        vm.taxTotal = 0;
                        //console.log('getPricingQuotes error!', response, vm.pricing);
                    });
                }

                //Query for possible coupons partially matching the vm.couponQuery search string
                vm.getPossibleCoupons = function() {
                    $http({
                        method: 'GET',
                        url: ENV.apiVersion + '/coupons?bookingId=' + vm.couponQuery,
                        headers: {
                            'x-abl-access-key': $stateParams.merchant,
                            'x-abl-date': Date.parse(new Date().toISOString())
                        }
                    }).then(function successCallback(response) {
                        vm.possibleCoupons = response.data;
                        //console.log('getPossibleCoupons success', response);
                    }, function errorCallback(response) {
                        vm.possibleCoupons = [];
                        vm.taxTotal = 0;
                        //console.log('getPossibleCoupons error!', response);
                    });
                }

                // Check whether the vm.couponQuery search string exists as a coupon, if successful,
                // add the coupon id to the make booking request object as the 'coupon' property
                vm.checkCoupon = function() {
                    vm.checkingCoupon = true;
                    //console.log('check coupon', vm.couponQuery);
                    $http({
                        method: 'GET',
                        url: ENV.apiVersion + '/coupons/' + vm.couponQuery,
                        headers: {
                            'x-abl-access-key': $stateParams.merchant,
                            'x-abl-date': Date.parse(new Date().toISOString())
                        }
                    }).then(function successCallback(response) {
                        //console.log('checkCoupon success', response);
                        data['couponId'] = response.data['couponId'];
                        vm.appliedCoupon = response.data;
                        //console.log('applied coupon', vm.appliedCoupon);
                        vm.validateCoupon(vm.appliedCoupon);
                        vm.couponStatus = 'valid';
                        vm.getPricingQuote();
                        vm.checkingCoupon = false;

                    }, function errorCallback(response) {
                        delete data['couponId'];
                        vm.couponStatus = 'invalid';
                        vm.appliedCoupon = {};
                        vm.checkingCoupon = false;

                        //console.log('checkCoupon error!', response);
                    });
                }

                vm.removeCoupon = function() {
                    vm.couponQuery = '';
                    delete data['couponId'];
                    vm.couponStatus = 'untouched';
                    vm.appliedCoupon = {};
                    vm.getPricingQuote();
                }

                const moment = window.moment;

                vm.validateCoupon = function(coupon) {
                    const today = moment();
                    //console.log('coupon expires after today', moment(coupon.endTime).isAfter(moment()));
                    //Coupon is not expired and is infinitely redeemable
                    if (moment(coupon.endTime).isAfter(moment()) && coupon.maxRedemptions == 0)
                        return true;
                    //Coupon is not expired and has been redeemed less than the maximum allowable redemptions
                    if (coupon.maxRedemptions > 0 && moment(coupon.endTime).isAfter(moment()) && coupon.maxRedemptions - coupon.redemptions >= 0)
                        return true;
                    //Coupon is expired or has been redeemed too many times 
                    vm.couponStatus = 'invalid';
                    return false;
                }

                vm.bookingQuestionsCompleted = function() {
                        var completed = 0;
                        if (vm.bookingQuestions) {
                            angular.forEach(vm.bookingQuestions, function(e, i) {
                                if (e.length > 0)
                                    completed++;
                            });
                        }
                        else {
                            completed = 0;
                        }
                        //console.log('vm.bookingQuestions', vm.bookingQuestions, completed);
                        return completed;
                    }
                    //Observe and debounce an object on the $scope, can be used on 
                    //a search input for example to wait before auto-sending the value
                observeOnScope($scope, 'vm.couponQuery')
                    .debounce(500)
                    .select(function(response) {
                        return response;
                    })
                    .subscribe(function(change) {
                        //console.log('search value', change);
                        if (vm.couponQuery.length > 0)
                            vm.checkCoupon();
                    });

                activityBookValidators(vm, rx, $http, $stateParams);

                $scope.$watch('addBookingController.activity', function(changes) {
                    //console.log('activity', changes);
                    if (angular.isDefined($scope.addBookingController.activity)) {
                        //Get booking questions
                        vm.questions = $scope.addBookingController.activity.questions;
                        if (vm.questions.length === 0) {
                            delete vm.validStepsForPayment.bookingQuestions;
                        }
                        //console.log('booking questions', vm.questions);

                        vm.addons = $scope.addBookingController.activity.charges.filter(function(charge) {
                            return charge.type == 'addon' && charge.status == 'active';
                        });
                        if (vm.addons.length === 0) {
                            delete vm.validStepsForPayment.addons;
                        }
                        vm.addons.forEach(function(e, i) {
                            if (!angular.isDefined(e.quantity))
                                e.quantity = 0;
                        });

                        vm.taxes = $scope.addBookingController.activity.charges.filter(function(charge) {
                            return charge.type == 'tax';
                        });
                        //console.log('taxes', vm.taxes);

                    }
                }, true);

                vm.countAttendees = function() {
                    // //console.log('count attendees', $scope.addBookingController.event.maxOcc, attendeesAdded);
                    if ($scope.addBookingController.event) {
                        if (vm.attendees) {
                            return ($scope.addBookingController.event.maxOcc || $scope.addBookingController.timeslot.maxOcc) - vm.attendees.map(function(att) {
                                return att.quantity;
                            }).reduce((a, b) => a + b, 0);
                        }
                        else {
                            return 0;
                        }
                    }
                    return 0;

                }

                vm.countAttendeesAdded = function() {
                    // //console.log('count attendees', $scope.addBookingController.event.maxOcc, attendeesAdded);
                    if ($scope.addBookingController.event) {
                        if (vm.attendees) {
                            return vm.attendees.map(function(att) {
                                return att.quantity;
                            }).reduce((a, b) => a + b, 0);
                        }
                        else {
                            return 0;
                        }
                    }
                    return 0;
                }

                vm.countAddonsAdded = function() {
                    if ($scope.addBookingController.event) {
                        if (vm.addons) {
                            return vm.addons.map(function(add) {
                                return add.quantity;
                            }).reduce((a, b) => a + b, 0);
                        }
                        else {
                            return 0;
                        }
                    }
                    return 0;
                }

                this.areGuestDetailsValid = function(form) {
                    if (form) {
                        vm.guestDetailsAreValid = form.$valid;
                        vm.validStepsForPayment.guest = vm.guestDetailsAreValid;
                    }
                    else {
                        vm.guestDetailsAreValid = false;
                    }
                    return vm.guestDetailsAreValid;
                }

                this.areAttendeesValid = function() {
                    vm.validStepsForPayment.attendees = vm.countAttendeesAdded() === 0 ? false : true;
                    return vm.countAttendeesAdded() === 0 ? false : true;
                }

                this.areAddonsValid = function() {
                    if (vm.validStepsForPayment.addons != null) {
                        vm.validStepsForPayment.addons = true;
                    }
                    return vm.countAddonsAdded() === 0 ? false : true;
                }

                this.areBookingQuestionsValid = function() {
                    if (vm.validStepsForPayment.bookingQuestions != null) {
                        vm.validStepsForPayment.bookingQuestions = vm.bookingQuestionsCompleted() === vm.questions.length ? true : false;
                    }
                    return vm.validStepsForPayment.bookingQuestions;
                }

                this.isPaymentValid = function() {
                    var isValid = [];
                    angular.forEach(vm.validStepsForPayment, function(step, key) {
                        if (!step) {
                            isValid.push(step);
                        }
                    });
                    return isValid.length > 0 ? false : true;
                }

                this.isNextStepPayment = function(step) {
                    if (step === 'attendees') {
                        if (vm.addons || vm.questions) {
                            return vm.addons.length > 0 || vm.questions.length > 0 ? true : false;
                        }
                        else {
                            return false;
                        }
                    }
                    if (step === 'addons') {
                        if (vm.questions) {
                            return vm.questions.length > 0 ? true : false;
                        }
                        else {
                            return false;
                        }
                    }
                    if (step === 'payment') {
                        return true;
                    }
                }

                vm.goToPay = function() {
                    vm.guestDetailsExpanded = false;
                    vm.attendeesExpanded = false;
                    vm.addonsExpanded = false;
                    vm.questionsExpanded = false;
                    vm.stripePaymentExpanded = true;

                    vm.paymentWasSent = true;
                    this.formWasBlocked = true;
                    $scope.makeBooking();
                }

                $scope.$watch('addBookingController.timeslot', function(changes) {
                    if (angular.isDefined($scope.addBookingController.timeslot)) {
                        if (angular.isDefined($scope.addBookingController.timeslot.charges)) {
                            vm.attendees = $scope.addBookingController.timeslot.charges.filter(function(charge) {
                                return charge.type == 'aap' && charge.status == 'active';
                            });
                            vm.attendees.forEach(function(e, i) {
                                if (!angular.isDefined(e.quantity))
                                    e.quantity = 0;
                            });
                        }
                        data['timeSlotId'] = $scope.addBookingController.timeslot._id;
                        data['startTime'] = $scope.addBookingController.timeslot.startTime;

                    }
                }, true);

                vm.getBookingData = function() {
                    const bookingData = angular.copy(data);
                    bookingData['eventInstanceId'] = $scope.addBookingController.event['eventInstanceId'];
                    bookingData['answers'] = {};
                    bookingData['email'] = vm.formData['mail'];
                    bookingData['phoneNumber'] = vm.formData['phoneNumber'];
                    bookingData['fullName'] = vm.formData['fullName'];
                    bookingData['notes'] = vm.formData['notes'];
                    bookingData['skipConfirmation'] = 'false';
                    bookingData['operator'] = $scope.addBookingController.activity.operator;

                    angular.forEach(vm.questions, function(e, i) {
                        bookingData['answers'][e._id] = vm.bookingQuestions[i];
                    });

                    bookingData['paymentMethod'] = 'credit';
                    bookingData['currency'] = 'default';

                    return bookingData;
                }

                $scope.safeApply = function(fn) {
                    var phase = this.$root.$$phase;
                    if (phase == '$apply' || phase == '$digest') {
                        if (fn && (typeof(fn) === 'function')) {
                            fn();
                        }
                    }
                    else {
                        this.$apply(fn);
                    }
                };




                function initStripe(publicKey) {
                    // Create a Stripe client
                    var stripe = Stripe(publicKey);
                    // Create an instance of Elements
                    var elements = stripe.elements();
                    // Custom styling can be passed to options when creating an Element.
                    // (Note that this demo uses a wider set of styles than the guide below.)
                    var style = {
                        base: {
                            color: '#32325d',
                            lineHeight: '24px',
                            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                            fontSmoothing: 'antialiased',
                            fontSize: '12px',
                            '::placeholder': {
                                color: '#88929c'
                            }
                        },
                        invalid: {
                            color: '#fa755a',
                            iconColor: '#fa755a'
                        }
                    };
                    // Create an instance of the card Element
                    var card = elements.create('card', {
                        style: style
                    });
                    // Add an instance of the card Element into the `card-element` <div>
                    card.mount('#card-element');

                    var stripeTokenHandler = function(token) {
                        var errorElement = document.getElementById('card-errors');
                        errorElement.textContent = '';
                        var idempotencyKey = (Math.random() + 1).toString(36).substring(7);
                        var bookingData = vm.getBookingData();
                        bookingData.stripeToken = token.id;
                        bookingData.idempotencyKey = idempotencyKey;
                        bookingData.location = {};
                        bookingData.isMobile = false;
                        vm.paymentWasSent = true;
                        $http({
                            method: 'POST',
                            url: config.FEATHERS_URL + '/bookings',
                            data: bookingData,
                            headers: {
                                'x-abl-access-key': $stateParams.merchant,
                                'x-abl-date': Date.parse(new Date().toISOString())
                            }
                        }).then(function successCallback(response) {
                            //console.log('Booking success', response);
                            vm.waitingForResponse = false;
                            validatePayment(response);
                        }, function errorCallback(response) {
                            var errorElement = document.getElementById('card-errors');
                            errorElement.textContent = response.data.errors[0];
                            vm.paymentWasSent = false;
                            vm.waitingForResponse = false;
                        });
                    }

                    /*config.APP_TYPE = 'CALENDAR';
                    validatePayment({
                        status: 200,
                        data: {
                            bookingId: 'DFRETYU',
                            operator: {
                                companyName: 'Buendia',
                                phoneNumber: '+7789568609',
                                email: 'blake+2020@adventurebucketlist.com'
                            },
                            client: {
                                email: 'geraldo.gonzalo@gmail.com'
                            }
                        }
                    });*/

                    function validatePayment(response) {
                        if (config.APP_TYPE === 'CALENDAR') {
                            if (response.status === 200) {
                                $scope.paymentResponse = 'success'; //processing, failed
                                $scope.bookingSuccessResponse = response.data;
                                $scope.paymentSuccessful = true;
                                $scope.safeApply();
                            }
                        }
                        else {
                            $mdToast.show(
                                $mdToast.simple()
                                .textContent('UNTRUSTED ORIGIN')
                                .position('left bottom')
                                .hideDelay(3000)
                            );
                        }
                    }

                    // Create a token or display an error the form is submitted.
                    var form = document.getElementById('payment-form');
                    form.addEventListener('submit', function(event) {
                        event.preventDefault();
                        vm.waitingForResponse = true;
                        stripe.createToken(card).then(function(result) {
                            if (result.error) {
                                // Inform the user if there was an error
                                var errorElement = document.getElementById('card-errors');
                                errorElement.textContent = result.error.message;
                            }
                            else {
                                // Send the token to your server
                                stripeTokenHandler(result.token);
                            }
                        });
                    });
                }

                function makeStripeBooking() {
                    $http({
                        method: 'GET',
                        url: config.FEATHERS_URL + '/payments/setup',
                        data: {
                            operator: $stateParams.merchant
                        },
                        headers: {
                            'x-abl-access-key': $stateParams.merchant,
                            'x-abl-date': Date.parse(new Date().toISOString())
                        }
                    }).then(function successCallback(response) {
                        initStripe(response.data.publicKey);
                    }, function errorCallback(response) {
                        var errorElement = document.getElementById('card-errors');
                        errorElement.textContent = response.error.message;
                    });
                }

                makeStripeBooking();

                var lpad = function(numberStr, padString, length) {
                    while (numberStr.length < length) {
                        numberStr = padString + numberStr;
                    }
                    return numberStr;
                };

                $scope.showPayzenDialog = function(ev) {
                    $log.debug("SHOW PAYZEN DIALOG");
                    vm.paymentExpanded = true;
                    $scope.paymentSuccessful = false;
                };

                $scope.prefill = function() {
                    vm.formData = {
                        fullName: 'fuck',
                        mail: 'adam@ralko.com',
                        phoneNumber: 7783023246
                    }
                };

                //Merge identical items from an array into nested objects, 
                //summing their amount properties and keeping track of quantities

                function mergeIdenticalArrayItemsIntoObject(data, oldObject) {
                    var seen = oldObject;
                    //console.log('mergeIdenticalArrayItemsIntoObject:data', data);
                    angular.forEach(data, function(e, i) {
                        // Have we seen this item before?
                        //console.log('mergeIdenticalArrayItemsIntoObject', seen, e, seen.hasOwnProperty(e.name));
                        if (seen.hasOwnProperty(e.name) && seen[e.name] === e.name) {
                            seen[e['name']]['price'] = e['price']; //Sum their prices
                            seen[e['name']]['quantity'] += 1; //Increment their quantity
                            seen[e['name']]['amount'] = seen[e['name']]['amount'] * seen[e['name']]['quantity']; //Sum their prices
                            //console.log('merged', seen[e['name']]);
                        }
                        else {
                            seen[e['name']] = {};
                            seen[e['name']]['name'] = e['name'];
                            seen[e['name']]['price'] = e['price'];
                            seen[e['name']]['quantity'] = 1;
                            seen[e['name']]['amount'] = e['amount'];
                        }
                    });

                    //console.log('mergeIdenticalArrayItems', seen);
                    return seen;
                }

            }
        };

    }]);

// {"paymentMethod":"cash","answers":{"57336d1a3e6f0f447119989a":"100","57336d2a3e6f0f447119989b":"phone call"},"attendees":{"58eea948565d3d3aa4fae370":[null]},"addons":{"57336b293e6f0f447119987b":[null],"58252f9e98087f1c06cc15eb":[null],"57336b293e6f0f447119987c":[]},"adjustments":[],"couponId":"AIRMILES","skipConfirmation":false,"email":"kevin+test@adventurebucketlist.com","fullName":"Kevin Test","phoneNumber":"6506129331","eventInstanceId":"p836o5rvsg72nm69ia120bbdns_20170623T210000Z","currency":"default"}
