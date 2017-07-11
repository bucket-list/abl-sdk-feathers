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
    .directive('ablActivityBook', ['$sce', '$compile', '$mdMedia', '$mdDialog', '$log', '$window', '$http', 'config', 'rx', 'observeOnScope', '$stateParams', function ($sce, $compile, $mdMedia, $mdDialog, $log, $window, $http, config, rx, observeOnScope, $stateParams) {
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

                const ENV = config;
                const stripe = window.Stripe;
                
                ENV.apiVersion = config.FEATHERS_URL;
                
                this.guestDetailsExpanded = true;
                this.attendeesExpanded = false;
                this.addonsExpanded = false;
                this.questionsExpanded = false;
                this.paymentExpanded = false;
                this.couponStatus = 'untouched';
                this.appliedCoupon = {};
                this.couponQuery = '';
                this.occupancyRemaining = 0;
                
                this.attendeeSubtotals = [];
                this.addonSubtotals    = [];
                $scope.paymentResponse = '';
                
                
                this.toggleGuestDetails = function () {
                    console.log('toggle guest details');
                    this.guestDetailsExpanded = !this.guestDetailsExpanded;
                }

                this.togglePayment = function () {
                    console.log('toggle payment');
                    this.paymentExpanded = !this.paymentExpanded;
                }
                
                this.pricing = {
                    total: 0
                };
                this.taxTotal, this.addonTotal, this.attendeeTotal = 0;
                
                
                $scope.bookingSucceeded = false;
                $scope.$mdMedia = $mdMedia;
                $scope.screenIsBig = function () {
                    var w = angular.element($window);
                    return w[0].innerWidth > 742;
                }

                $scope.addBookingController = $scope.$parent;
                console.log('addBookingController', $scope.addBookingController);
                // var timeslot = $scope.addBookingController.parent.timeslot;

                // $scope.eventInfo = $scope.$parent.parent;
                
                //Get taxes
                vm.taxes = [];
                vm.taxTotal = 0;
                //Get addons
                vm.addons = [];
                vm.questions = [];

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
                    if(vm.addons.length < 1)
                        this.questionsExpanded = !this.questionsExpanded;
                    else
                        this.addonsExpanded = !this.addonsExpanded;
                }

                this.adjustAttendee = function (i, mode) {
                    if (mode == 'up' && vm.countAttendees() > 0)
                        vm.attendees[i].quantity++;
                    if (mode == 'down' && vm.attendees[i].quantity > 0)
                        vm.attendees[i].quantity--;

                    console.log('adjust attendees', vm.attendees);
                    vm.getPricingQuote();
                    
                    vm.countAttendees();
                }

                this.toggleAttendees = function () {
                    console.log('toggle attendees');
                    this.attendeesExpanded = !this.attendeesExpanded;
                }
                
                this.checkAdjustAttendee = function($index) {
                    if(vm.attendees[$index].quantity > vm.countAttendees()) {
                        vm.attendees[$index].quantity = 0;
                        vm.attendees[$index].quantity = vm.countAttendees();
                    }
                    if(vm.attendees[$index].quantity < 0)
                        vm.attendees[$index].quantity = 0;
                    
                    $scope.safeApply();
                    console.log('attendees added', vm.countAttendees(), vm.attendees[$index].quantity);
                }

                var data = {
                    "attendees": {},
                    "addons": {}                
                    
                }


                function buildQuery() {

                    // Parse attendees
                    angular.forEach(vm.attendees, function (e, i) {
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
                        
                        vm.addonTotal = vm.pricing.items.filter(function(item) {
                            return item.type == 'addon';
                        }).reduce(function(result, addon) {
                            return result + addon.price
                        }, 0);
                        
                        vm.addonSubtotals = mergeIdenticalArrayItemsIntoObject(vm.pricing.items.filter(function(item) {
                            return item.type == 'addon';
                        }));
                        
                        vm.attendeeTotal = response.data.items.filter(function (item) {
                            return item.type == "aap"
                        }).reduce(function (result, att) {
                            return result + att.price
                        }, 0);
                        
                        vm.attendeeSubtotals = mergeIdenticalArrayItemsIntoObject(response.data.items.filter(function(item) {
                            return item.type == 'aap';
                        }));
                        
                        vm.taxTotal = response.data.items.filter(function (item) {
                            return item.type == "tax" || item.type == "fee"
                        }).reduce(function (result, tax) {
                            return result + tax.price
                        }, 0);
                        
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
                        url: ENV.apiVersion + '/coupons?bookingId=' + vm.couponQuery,
                        headers: {
                        'x-abl-access-key': $stateParams.merchant,
                        'x-abl-date': Date.parse(new Date().toISOString())
                    }
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
                    console.log('check coupon', vm.couponQuery);
                    $http({
                        method: 'GET',
                        url: ENV.apiVersion + '/coupons/' + vm.couponQuery,
                        headers: {
                        'x-abl-access-key': $stateParams.merchant,
                        'x-abl-date': Date.parse(new Date().toISOString())
                    }
                    }).then(function successCallback(response) {
                        console.log('checkCoupon success', response);
                        data['couponId'] = response.data['couponId'];
                        vm.appliedCoupon = response.data;
                        console.log('applied coupon', vm.appliedCoupon);
                        vm.validateCoupon(vm.appliedCoupon);
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
                
                const moment = window.moment;
                
                vm.validateCoupon = function(coupon) {
                    const today = moment();
                    console.log('coupon expires after today', moment(coupon.endTime).isAfter(moment()));
                    //Coupon is not expired and is infinitely redeemable
                    if(moment(coupon.endTime).isAfter(moment()) && coupon.maxRedemptions == 0)
                        return true;
                    //Coupon is not expired and has been redeemed less than the maximum allowable redemptions
                    if(coupon.maxRedemptions > 0 && moment(coupon.endTime).isAfter(moment()) && coupon.maxRedemptions - coupon.redemptions >= 0)
                        return true;
                    //Coupon is expired or has been redeemed too many times 
                    vm.couponStatus = 'invalid';
                    return false;
                }

                vm.bookingQuestionsCompleted = function() {
                    var completed = 0;
                    if(vm.bookingQuestions) {
                        angular.forEach(vm.bookingQuestions, function(e,i) {
                            // console.log(e);
                            if(e.length > 0)
                                completed++;
                        });
                    }
                    return completed;
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

                activityBookValidators(vm, rx, $http, $stateParams);
                //Observe and debounce an object on the $scope, can be used on 
                //a search input for example to wait before auto-sending the value
                // observeOnScope($scope, 'vm.formData.fullName')
                //     .debounce(500)
                //     .select(function (response) {
                //         return response;
                //     })
                //     .subscribe(function (change) {
                //         console.log('client name search value', change);
                //         if (change['newValue'])
                //             vm.searchClients(change.newValue).subscribe(function (results) {
                //                 $scope.results = results;
                //                 console.log(results);
                //             });
                //     });



                $scope.$watch('addBookingController.activity', function (changes) {
                    console.log('activity', changes);
                    if(angular.isDefined($scope.addBookingController.activity)) {
                        //Get booking questions
                        vm.questions = $scope.addBookingController.activity.questions;
                        console.log('booking questions', vm.questions);
    
                        vm.addons = $scope.addBookingController.activity.charges.filter(function (charge) {
                            return charge.type == 'addon' && charge.status == 'active';
                        })
                        vm.addons.forEach(function (e, i) {
                            if(!angular.isDefined(e.quantity))
                                e.quantity = 0;
                        });
                        
                        vm.taxes = $scope.addBookingController.activity.charges.filter(function (charge) {
                            return charge.type == 'tax';
                        });
                        console.log('taxes', vm.taxes);
                
                    }
                }, true);

                vm.countAttendees = function() {
                    // console.log('count attendees', $scope.addBookingController.event.maxOcc, attendeesAdded);
                    if($scope.addBookingController.event) {
                        if(vm.attendees) {
                           return ($scope.addBookingController.event.maxOcc || $scope.addBookingController.timeslot.maxOcc) - vm.attendees.map(function(att) {
                                return att.quantity;
                            }).reduce((a,b) => a + b, 0); 
                        }
                        else {
                            return 0;
                        }
                    }
                    return 0;

                }
                
                vm.countAttendeesAdded = function() {
                    // console.log('count attendees', $scope.addBookingController.event.maxOcc, attendeesAdded);
                    if($scope.addBookingController.event) {
                        if(vm.attendees) {
                           return vm.attendees.map(function(att) {
                                return att.quantity;
                            }).reduce((a,b) => a + b, 0); 
                        }
                        else {
                            return 0;
                        }
                    }
                    return 0;
                }
                
                vm.nextStep = function() {
                    // if(vm.guestDetailsExpanded) {
                    //     vm.guestDetailsExpanded = false;
                    //     vm.attendeesExpanded    = true;
                    // }
                    // if(vm.attendeesExpanded) {
                    //     vm.attendeesExpanded = false;
                    //     vm.addonsExpanded    = true;
                    // }
                    // if(vm.addonsExpanded) {
                    //     vm.addonsExpanded    = false;
                    //     vm.questionsExpanded = true;
                    // }
                    $scope.makeBooking()
                    $scope.showPayzenDialog();
                    
                    if(vm.questionsExpanded) {
                        vm.questionsExpanded = false;
                        vm.paymentExpanded   = true;
                    }
                }
                
                // $scope.$watch('addBookingController.event', function (changes) {
                //     console.log('event', changes);

                //     //vm.attendeesRemaining = changes.maxOcc -
                // }, true);
                
                // $scope.$watch('vm.bookingQuestions', function (changes) {
                //     console.log('vm.bookingQuestions', changes);
                //     console.log($scope);
                //     //vm.attendeesRemaining = changes.maxOcc -
                // }, true);
                
                $scope.$watch('addBookingController.timeslot', function (changes) {
                    console.log('timeslot', changes);
                    if(angular.isDefined($scope.addBookingController.timeslot)) {
                        
                        if(angular.isDefined($scope.addBookingController.timeslot.charges)) {
                        vm.attendees = $scope.addBookingController.timeslot.charges.filter(function (charge) {
                            return charge.type == 'aap' && charge.status == 'active';
                        });
                        vm.attendees.forEach(function (e, i) {
                            if(!angular.isDefined(e.quantity))
                                e.quantity = 0;
                        });
                        // console.log('attendees', vm.attendees);
                        }
                        
                        //Get the timeslot id and start time for the pricing quote endpoint request
                        data['timeSlotId'] = $scope.addBookingController.timeslot._id;
                        data['startTime']  = $scope.addBookingController.timeslot.startTime;
                        
                    }
                }, true);
                
                vm.getBookingData = function() {
                    const bookingData = angular.copy(data);
                    bookingData['eventInstanceId']  = $scope.addBookingController.event['eventInstanceId'];
                    bookingData['answers']          = {};
                    bookingData['email']            = vm.formData['mail'];
                    bookingData['phoneNumber']      = vm.formData['phoneNumber'];
                    bookingData['fullName']         = vm.formData['fullName'];
                    bookingData['notes']            = vm.formData['notes'];
                    bookingData['skipConfirmation'] = 'false';
                    bookingData['operator']         = $scope.addBookingController.activity.operator;
                    
                    angular.forEach(vm.questions, function(e,i) {
                        bookingData['answers'][e._id] = vm.bookingQuestions[i];
                    });
                    
                    bookingData['paymentMethod']    = 'credit';
                    bookingData['currency']         = 'default';
                    
                    console.log('make booking', bookingData);
                    
                    return bookingData;
                    // console.log(vm.bookingQuestions);
                    // console.log(vm.questions);
                }
                
        var paymentMessageHandler;
        paymentMessageHandler = function(event) {
         if (event.origin == "https://calendar.ablist.win") { // TODO add to config
            console.log("TRUSTED ORIGIN", event.origin);
            console.log("DATA", event.data);
            if (event.data == "payment_complete") {
              console.log("PAYMENT COMPLETE");
              $scope.paymentResponse = 'success'; //processing, failed
            //   $rootScope.showToast('Payment processed successfully.');
    
              window.removeEventListener("message", paymentMessageHandler);
              $scope.paymentSuccessful = true;
            //   $scope.changeState('bookings'); //Go to bookings view if successful
              $scope.safeApply();
              //$mdDialog.hide();
            }
         }
          else {
            console.log("UNTRUSTED ORIGIN", event.origin);
          }
        };
        
        console.log("Adding Payment Message Event Listener");
        window.addEventListener("message", paymentMessageHandler);
    
        $scope.safeApply = function(fn) {
          var phase = this.$root.$$phase;
          if(phase == '$apply' || phase == '$digest') {
            if(fn && (typeof(fn) === 'function')) {
              fn();
            }
          } else {
            this.$apply(fn);
          }
        };
                
                
        $scope.makeBooking = function() {
            $scope.bookingResponse = $http({
                method: 'POST',
                url: config.FEATHERS_URL + '/bookings',
                data: vm.getBookingData(),
                headers: {
                    'x-abl-access-key': $stateParams.merchant,
                    'x-abl-date': Date.parse(new Date().toISOString())
                }
            }).then(function successCallback(response) {
                console.log('makeBooking success', response);
                $scope.bookingSuccessResponse = response.data.booking;
                var iframeDoc = document.getElementById("payzenIframe").contentWindow.document;
                iframeDoc.open();
                iframeDoc.write(response.data.iframeHtml);
                iframeDoc.close();
                $scope.bookingSucceeded = true;
              
            }, function errorCallback(response) {
                $mdDialog.hide();
                $scope.bookingSucceeded = false;
                console.log('makeBooking error!', response);
            }); 
        }
    
        // function postToIframe(data,url,target){
        //   $('body')
        //     .append('<form action="'+url+'" method="post" target="'+target+'" id="postToIframe"></form>');
        //   $.each(data,function(n,v){
        //     $('#postToIframe').append('<input type="hidden" name="'+n+'" value="'+v+'" />');
        //   });
        //   $('#postToIframe').submit().remove();
        // }

        var lpad = function (numberStr, padString, length) {
        		while (numberStr.length < length) {
        			numberStr = padString + numberStr;
        		}
        		return numberStr;
        };
		
          $scope.showPayzenDialog = function(ev) {
            $log.debug("SHOW PAYZEN DIALOG");
            vm.paymentExpanded = true;
            $scope.paymentSuccessful = false;

            // $scope.$mdDialog = $mdDialog;
            // $mdDialog.show({
            //   contentElement: '#payzenDialog',
            //   parent: angular.element(document.body),
            //   targetEvent: ev,
            //   clickOutsideToClose: false
            // });
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
          function mergeIdenticalArrayItemsIntoObject(data) {
            var seen = {};
            
            angular.forEach(data, function(e,i) {
                // Have we seen this item before?
                if (seen.hasOwnProperty(e.name)) {
                    seen[e['name']]['amount']   += e['amount']; //Sum their prices
                    seen[e['name']]['quantity'] += 1;           //Increment their quantity
                }
                else {
                    seen[e['name']] = {};
                    seen[e['name']]['price']    = e['price'];
                    seen[e['name']]['quantity'] = 1;
                    seen[e['name']]['amount']   = e['amount'];
                }
            });
            
            console.log('mergeIdenticalArrayItems', seen);
            return seen;
          }
          
            }
        };
        
    }]);

// {"paymentMethod":"cash","answers":{"57336d1a3e6f0f447119989a":"100","57336d2a3e6f0f447119989b":"phone call"},"attendees":{"58eea948565d3d3aa4fae370":[null]},"addons":{"57336b293e6f0f447119987b":[null],"58252f9e98087f1c06cc15eb":[null],"57336b293e6f0f447119987c":[]},"adjustments":[],"couponId":"AIRMILES","skipConfirmation":false,"email":"kevin+test@adventurebucketlist.com","fullName":"Kevin Test","phoneNumber":"6506129331","eventInstanceId":"p836o5rvsg72nm69ia120bbdns_20170623T210000Z","currency":"default"}