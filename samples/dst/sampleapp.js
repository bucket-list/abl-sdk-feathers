/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _book = __webpack_require__(1);

	var _book2 = _interopRequireDefault(_book);

	var _pricingQuote = __webpack_require__(5);

	var _pricingQuote2 = _interopRequireDefault(_pricingQuote);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	//  Build our app module, with a dependency on the new angular module.
	var app = angular.module('sampleapp', ['ui.router', 'ngAnimate', 'ngMaterial', 'rx', 'ngMdIcons', 'abl-sdk-feathers', 'activity-book']);

	app.controller('addBookingController', _book2.default);

	app.controller('SampleController', ['$scope', '$rootScope', '$abl', 'rx', 'observeOnScope', '$http', function ($scope, $rootScope, $abl, rx, observeOnScope, $http) {
	  var vm = this;
	  console.log('pricing quote', _pricingQuote2.default);

	  $scope.numValue = 1;
	  $scope.chargeGroup = [{
	    "quantity": 1,
	    "name": "an addon",
	    "price": "75.00"
	  }];
	  $scope.$watch('numValue', function (newValue, old) {
	    console.log('numValue change', newValue, old);
	  });
	  $scope.search = 'toronto';

	  $scope.testFunction = function () {
	    console.log('testFunction');
	  };

	  console.log($abl);
	  var p = {
	    "fullName": "Adam"

	    //Observable function
	  };function searchCache(term) {
	    var query = {
	      'clients': {
	        $lte: term
	      }
	    };

	    console.log('query', term);
	    return rx.Observable.fromPromise($abl.services.cache.find({ query: query })).map(function (response) {
	      console.log('response', response);

	      return response;
	    });
	  }

	  $scope.results = [];
	  /*
	    Creates a "click" function which is an observable sequence instead of just a function.
	  */
	  $scope.$createObservableFunction('click').map(function () {
	    return $scope.search;
	  }).flatMapLatest(searchCache).subscribe(function (results) {
	    $scope.results = results;
	    console.log(results);
	  });

	  // Observe and debounce an object on the $scope, can be used on a search input
	  // for example to wait before auto-sending the value
	  observeOnScope($scope, 'search').debounce(500).select(function (response) {
	    return response.newValue;
	  }).flatMap(searchCache).subscribe(function (res) {
	    console.log('search res', res);
	  });

	  //Unsubscribe observables on $scope destruction
	  $scope.$on('$destroy', function () {

	    vm.testService.unsubscribe();
	    vm.testService = null;

	    console.log('controller $destroy');
	  });
	}]).config(function ($ablProvider, $sceDelegateProvider, $httpProvider, $feathersProvider) {

	  $ablProvider.setEndpoint('https://api.ablist.win');
	  $ablProvider.useSocket(false);
	  console.log($ablProvider.getSettings());
	  $httpProvider.defaults.headers.common = {};
	  $httpProvider.defaults.headers.post = {};
	  $httpProvider.defaults.headers.put = {};
	  $httpProvider.defaults.headers.patch = {};
	  $httpProvider.defaults.headers.get = {};
	  $sceDelegateProvider.resourceUrlWhitelist([
	  // Allow loading from our assets domain. **.
	  'localhost/**', 'http://en.wikipedia.org/**']);
	}).run(function ($rootScope) {
	  $rootScope.config = {};
	});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = activityBook;

	var _activity = __webpack_require__(2);

	var _activity2 = _interopRequireDefault(_activity);

	var _timeslot = __webpack_require__(3);

	var _timeslot2 = _interopRequireDefault(_timeslot);

	var _event = __webpack_require__(4);

	var _event2 = _interopRequireDefault(_event);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// activityBook.$inject = ['$scope'];

	function activityBook($scope) {
	    var vm = this;
	    $scope.activity = _activity2.default;
	    $scope.timeslot = _timeslot2.default;
	    $scope.event = _event2.default;
	}

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = {
	    "_id": "593ed86575634652759b1461",
	    "originalTitle": "Poop Snacks",
	    "originalDescription": "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
	    "updatedAt": "2017-07-26T03:03:57.216Z",
	    "createdAt": "2017-06-12T18:07:33.614Z",
	    "location": {
	        "_id": "593ed86575634652759b145d",
	        "updatedAt": "2017-07-26T03:03:55.631Z",
	        "createdAt": "2017-06-12T18:07:33.564Z",
	        "city": "Los Altos",
	        "country": "United States",
	        "state": "California",
	        "streetAddress": "123 Main St, Los Altos, CA 94022, USA",
	        "zipCode": "94022",
	        "location": {
	            "coordinates": [-122.114632, 37.37982969999999],
	            "type": "Point"
	        },
	        "zoom": 12,
	        "tag": "Main Location",
	        "id": "593ed86575634652759b145d"
	    },
	    "oldImages": ["https://dev-images.ablsolution.com/6415504b-18fc-4ea2-ac9e-8189b394bd63.png"],
	    "images": ["https://dev-images.ablsolution.com/07b4e6f0-7f08-4aa2-b43b-1a7f57bd0379.png"],
	    "title": "1111111",
	    "description": "SHIT MIDGETS in my hair SHIT MIDGETS FUCK PIDDLES!",
	    "status": "active",
	    "widgetOrder": 2,
	    "published": true,
	    "whatToBring": ["Brown Pants"],
	    "whatIncluded": ["Awesome Sauce"],
	    "timeZone": "America/New_York",
	    "requirements": [],
	    "isListed": false,
	    "cutoff": -1,
	    "color": "336633",
	    "questions": [{
	        "_id": "5951a75e717233012fb69693",
	        "updatedAt": "2017-06-27T00:31:26.007Z",
	        "createdAt": "2017-06-27T00:31:26.007Z",
	        "questionText": "do you like poop snacks",
	        "organizations": ["5939d988fd8f030e112be7b9"],
	        "id": "5951a75e717233012fb69693",
	        "operator": "5939d988fd8f030e112be7b9",
	        "$$hashKey": "object:502"
	    }, {
	        "_id": "5956d00a660df61df2c2d6c6",
	        "updatedAt": "2017-06-30T22:26:18.882Z",
	        "createdAt": "2017-06-30T22:26:18.882Z",
	        "questionText": "I was only nine years old I loved Lightning McQueen so much, I owned all the movies and merchandise I pray to Lightning McQueen every night, thanking him for the life I have been given \"Lightning McQueen is love\", I say, \"Lightning McQueen is life\" My dad hears me",
	        "organizations": ["5939d988fd8f030e112be7b9"],
	        "id": "5956d00a660df61df2c2d6c6",
	        "operator": "5939d988fd8f030e112be7b9",
	        "$$hashKey": "object:503"
	    }],
	    "charges": [{
	        "_id": "593ed86575634652759b145e",
	        "updatedAt": "2017-06-12T18:07:33.581Z",
	        "createdAt": "2017-06-12T18:07:33.581Z",
	        "amount": 10,
	        "name": "a tax",
	        "type": "tax",
	        "status": "active",
	        "isDefault": false,
	        "frequency": "Daily",
	        "percentage": true,
	        "organizations": ["5939d988fd8f030e112be7b9"],
	        "id": "593ed86575634652759b145e",
	        "operator": "5939d988fd8f030e112be7b9"
	    }, {
	        "_id": "593ed86575634652759b145f",
	        "updatedAt": "2017-06-12T18:07:33.588Z",
	        "createdAt": "2017-06-12T18:07:33.588Z",
	        "amount": 2000,
	        "name": "a fee",
	        "type": "fee",
	        "status": "active",
	        "isDefault": false,
	        "frequency": "Daily",
	        "percentage": false,
	        "organizations": ["5939d988fd8f030e112be7b9"],
	        "id": "593ed86575634652759b145f",
	        "operator": "5939d988fd8f030e112be7b9"
	    }, {
	        "_id": "593ed86575634652759b1460",
	        "updatedAt": "2017-06-12T18:07:33.589Z",
	        "createdAt": "2017-06-12T18:07:33.589Z",
	        "amount": 7500,
	        "name": "an addon",
	        "type": "addon",
	        "status": "active",
	        "isDefault": false,
	        "frequency": "Daily",
	        "percentage": false,
	        "organizations": ["5939d988fd8f030e112be7b9"],
	        "id": "593ed86575634652759b1460",
	        "operator": "5939d988fd8f030e112be7b9",
	        "quantity": 0,
	        "$$hashKey": "object:477"
	    }],
	    "timeslots": [{
	        "_id": "593ed95375634652759b1464",
	        "eventId": "0kka3gs2pkrlt32tbvd2cemo08",
	        "originalUntilTime": "2019-06-14T06:59:00.000Z",
	        "originalEndTime": "2017-06-12T15:00:00.000Z",
	        "originalStartTime": "2017-06-12T14:00:00.000Z",
	        "originalDescription": "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
	        "originalTitle": "Poop Snacks",
	        "originalMaxOcc": 8,
	        "originalMinOcc": 2,
	        "updatedAt": "2017-07-27T21:40:41.803Z",
	        "createdAt": "2017-06-12T18:11:31.946Z",
	        "endTime": "2017-06-12T16:00:00.000Z",
	        "maxOcc": 8,
	        "startTime": "2017-06-12T14:00:00.000Z",
	        "activity": "593ed86575634652759b1461",
	        "calendarId": "37hpr1e9jfocmmlqsd8cmjgbts@group.calendar.google.com",
	        "status": "active",
	        "description": "SHIT MIDGETS in my hair SHIT MIDGETS FUCK PIDDLES!",
	        "title": "1111111",
	        "minOcc": 2,
	        "untilTime": "2019-06-15T03:59:00.000Z",
	        "daysRunning": [0, 1, 2, 3, 4, 5, 6],
	        "originalDaysRunning": [0, 1, 2, 3, 4, 5, 6],
	        "single": false,
	        "timeZone": "America/New_York",
	        "discounts": [],
	        "charges": [{
	            "_id": "593ed95375634652759b1462",
	            "updatedAt": "2017-06-12T18:11:31.933Z",
	            "createdAt": "2017-06-12T18:11:31.933Z",
	            "amount": 20000,
	            "name": "Adult",
	            "type": "aap",
	            "status": "active",
	            "isDefault": true,
	            "frequency": "Daily",
	            "percentage": false,
	            "organizations": ["5939d988fd8f030e112be7b9"],
	            "id": "593ed95375634652759b1462",
	            "operator": "5939d988fd8f030e112be7b9"
	        }, {
	            "_id": "593ed95375634652759b1463",
	            "updatedAt": "2017-06-12T18:11:31.934Z",
	            "createdAt": "2017-06-12T18:11:31.934Z",
	            "amount": 5000,
	            "name": "Youth",
	            "type": "aap",
	            "status": "active",
	            "isDefault": false,
	            "frequency": "Daily",
	            "percentage": false,
	            "organizations": ["5939d988fd8f030e112be7b9"],
	            "id": "593ed95375634652759b1463",
	            "operator": "5939d988fd8f030e112be7b9"
	        }],
	        "events": ["5941972161cbb9537b3ac8c1", "5941c0647451df3e1b7721bb", "5941efe6c0a1d42d5f9196ee", "594437a9a8779410db6314af", "5953084d4311110b1beb2d81", "59540509ad8aa062e608d9df", "595426d2ad8aa062e608dd38", "59542c3ead8aa062e608de46", "595584a8ad8aa062e608ed83", "5956d1eb32acad1e1f71f33f", "59641c1f0a0ab843c08a5181", "596435fa0a0ab843c08a5454", "596448e7260dd02d60513a6a", "59658bb656e16109a458f170", "59668ea556e16109a458fa6c", "5967d74c9718a2326c6bcb63", "5967e73bcaa067395b72b43b", "5967e854c9af3b3be865e0e8", "5967ef2c05a7a040ae4094f5", "596801eb86ac35026c2bf9bc", "5968021786ac35026c2bf9e1", "59680c155c3883227e34e5db", "596811c7335c402d489abf89", "596926ca7835b956a24d6237", "596d0bbde3ec65054c68134a", "596d0c31e3ec65054c68137c", "596d8e2d414ff80d0ed33c48", "596eba46414ff80d0ed34370", "596ecac7e994820e921f73f6", "596fb4589d76b83655e96ff6", "596fb5f39d76b83655e97015", "596fc1459d76b83655e97074", "5970039114822271ee7cda3b", "5970040b6ffbe019d53c2502", "597005736ffbe019d53c2521", "5971182c92511457960fa610", "597133cf92511457960fa717", "5971433e92511457960fa761", "59779382010aa555daafc5e5", "597a5dd9ccb2a23b516d1bf4"],
	        "guides": [],
	        "organizations": ["5939d988fd8f030e112be7b9"],
	        "id": "593ed95375634652759b1464",
	        "isMinOccChanged": false,
	        "isMaxOccChanged": false,
	        "isTitleChanged": false,
	        "isDescriptionChanged": false,
	        "operator": "5939d988fd8f030e112be7b9",
	        "isStartTimeChanged": false,
	        "isEndTimeChanged": false,
	        "isUntilTimeChanged": false,
	        "isDaysRunningChanged": false
	    }],
	    "organizations": [{
	        "_id": "5939d988fd8f030e112be7b9",
	        "calendarId": "37hpr1e9jfocmmlqsd8cmjgbts@group.calendar.google.com",
	        "updatedAt": "2017-08-25T23:57:31.056Z",
	        "createdAt": "2017-06-08T23:11:04.184Z",
	        "domainName": "http://operator38.com",
	        "location": {
	            "_id": "5939d988fd8f030e112be7b8",
	            "updatedAt": "2017-08-25T23:57:31.047Z",
	            "createdAt": "2017-06-08T23:11:04.170Z",
	            "city": "Los Altos",
	            "country": "United States",
	            "countryCode": "US",
	            "state": "California",
	            "stateCode": "CA",
	            "streetAddress": "123 Main St, Los Altos, CA 94022, USA",
	            "zipCode": "94022",
	            "location": {
	                "coordinates": [-122.11463200000003, 37.37982969999999],
	                "type": "Point"
	            },
	            "zoom": 12,
	            "tag": "Main Location",
	            "id": "5939d988fd8f030e112be7b8"
	        },
	        "role": "operator",
	        "status": "active",
	        "payments": {
	            "stripeAccount": "5994da393437054cf951846c"
	        },
	        "addRulesToPropertiesOnCreate": true,
	        "languages": {
	            "sp": false,
	            "fr": false,
	            "en": true
	        },
	        "language": "en",
	        "reminders": {
	            "email": false,
	            "sms": false,
	            "id": null
	        },
	        "primaryContact": {
	            "email": "tyler+operator38@adventurebucketlist.com",
	            "phoneNumber": "7169488938",
	            "fullName": "Operator 38"
	        },
	        "social": {
	            "tripadvisor": "https://tripa111.com",
	            "twitter": "twittah111",
	            "instagram": "insta111",
	            "facebook": "shfacebook111"
	        },
	        "preferences": {
	            "deposits": {
	                "amount": 5000,
	                "percent": null,
	                "threshold": 10000,
	                "priorDays": 30,
	                "setting": "threshold"
	            },
	            "notifications": {
	                "booking_confirmation_customer": {
	                    "terms_conditions": "",
	                    "signoff": "",
	                    "custom_field_3": "",
	                    "custom_field_2": "",
	                    "custom_field_1": ""
	                }
	            },
	            "tripadvisorReviewEmail": {
	                "delay": {
	                    "period": "hour",
	                    "number": 3
	                },
	                "active": true
	            },
	            "widget": {
	                "display": {
	                    "timeslot": {
	                        "startTime": true,
	                        "price": true,
	                        "duration": true,
	                        "availability": true
	                    },
	                    "theme": "blue",
	                    "event": {
	                        "isSiteWide": true,
	                        "cutoff": 2880
	                    }
	                }
	            },
	            "customFields": {
	                "prior": 15,
	                "notes": "Notes"
	            },
	            "affiliate": {
	                "includeAddons": false
	            },
	            "features": {
	                "affiliates": false,
	                "questions": true,
	                "guides": true,
	                "coupons": true
	            },
	            "id": null
	        },
	        "companyImage": "https://dev-images.ablsolution.com/8642ae67-cfd1-4767-82e4-e239e7d7ca24.png",
	        "companyName": "Operator 38",
	        "groups": [],
	        "applicationFee": 3,
	        "organizations": ["ffffffffffffffffffffffff"],
	        "id": "5939d988fd8f030e112be7b9",
	        "bookings": null,
	        "createdDate": "2017-06-08T23:11:04.184Z",
	        "apiKeys": null
	    }],
	    "id": "593ed86575634652759b1461",
	    "isDescriptionChanged": false,
	    "isTitleChanged": false,
	    "image": "https://dev-images.ablsolution.com/07b4e6f0-7f08-4aa2-b43b-1a7f57bd0379.png",
	    "operator": {
	        "_id": "5939d988fd8f030e112be7b9",
	        "calendarId": "37hpr1e9jfocmmlqsd8cmjgbts@group.calendar.google.com",
	        "updatedAt": "2017-08-25T23:57:31.056Z",
	        "createdAt": "2017-06-08T23:11:04.184Z",
	        "domainName": "http://operator38.com",
	        "location": {
	            "_id": "5939d988fd8f030e112be7b8",
	            "updatedAt": "2017-08-25T23:57:31.047Z",
	            "createdAt": "2017-06-08T23:11:04.170Z",
	            "city": "Los Altos",
	            "country": "United States",
	            "countryCode": "US",
	            "state": "California",
	            "stateCode": "CA",
	            "streetAddress": "123 Main St, Los Altos, CA 94022, USA",
	            "zipCode": "94022",
	            "location": {
	                "coordinates": [-122.11463200000003, 37.37982969999999],
	                "type": "Point"
	            },
	            "zoom": 12,
	            "tag": "Main Location",
	            "id": "5939d988fd8f030e112be7b8"
	        },
	        "role": "operator",
	        "status": "active",
	        "payments": {
	            "stripeAccount": "5994da393437054cf951846c"
	        },
	        "addRulesToPropertiesOnCreate": true,
	        "languages": {
	            "sp": false,
	            "fr": false,
	            "en": true
	        },
	        "language": "en",
	        "reminders": {
	            "email": false,
	            "sms": false,
	            "id": null
	        },
	        "primaryContact": {
	            "email": "tyler+operator38@adventurebucketlist.com",
	            "phoneNumber": "7169488938",
	            "fullName": "Operator 38"
	        },
	        "social": {
	            "tripadvisor": "https://tripa111.com",
	            "twitter": "twittah111",
	            "instagram": "insta111",
	            "facebook": "shfacebook111"
	        },
	        "preferences": {
	            "deposits": {
	                "amount": 5000,
	                "percent": null,
	                "threshold": 10000,
	                "priorDays": 30,
	                "setting": "threshold"
	            },
	            "notifications": {
	                "booking_confirmation_customer": {
	                    "terms_conditions": "",
	                    "signoff": "",
	                    "custom_field_3": "",
	                    "custom_field_2": "",
	                    "custom_field_1": ""
	                }
	            },
	            "tripadvisorReviewEmail": {
	                "delay": {
	                    "period": "hour",
	                    "number": 3
	                },
	                "active": true
	            },
	            "widget": {
	                "display": {
	                    "timeslot": {
	                        "startTime": true,
	                        "price": true,
	                        "duration": true,
	                        "availability": true
	                    },
	                    "theme": "blue",
	                    "event": {
	                        "isSiteWide": true,
	                        "cutoff": 2880
	                    }
	                }
	            },
	            "customFields": {
	                "prior": 15,
	                "notes": "Notes"
	            },
	            "affiliate": {
	                "includeAddons": false
	            },
	            "features": {
	                "affiliates": false,
	                "questions": true,
	                "guides": true,
	                "coupons": true
	            },
	            "id": null
	        },
	        "companyImage": "https://dev-images.ablsolution.com/8642ae67-cfd1-4767-82e4-e239e7d7ca24.png",
	        "companyName": "Operator 38",
	        "groups": [],
	        "applicationFee": 3,
	        "organizations": ["ffffffffffffffffffffffff"],
	        "id": "5939d988fd8f030e112be7b9",
	        "bookings": null,
	        "createdDate": "2017-06-08T23:11:04.184Z",
	        "apiKeys": null
	    }
	};

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = {
	    "_id": "593ed95375634652759b1464",
	    "eventId": "0kka3gs2pkrlt32tbvd2cemo08",
	    "originalUntilTime": "2019-06-14T06:59:00.000Z",
	    "originalEndTime": "2017-06-12T15:00:00.000Z",
	    "originalStartTime": "2017-06-12T14:00:00.000Z",
	    "originalDescription": "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
	    "originalTitle": "Poop Snacks",
	    "originalMaxOcc": 8,
	    "originalMinOcc": 2,
	    "updatedAt": "2017-07-27T21:40:41.803Z",
	    "createdAt": "2017-06-12T18:11:31.946Z",
	    "endTime": "2017-06-12T16:00:00.000Z",
	    "maxOcc": 8,
	    "startTime": "2017-06-12T14:00:00.000Z",
	    "activity": "593ed86575634652759b1461",
	    "calendarId": "37hpr1e9jfocmmlqsd8cmjgbts@group.calendar.google.com",
	    "status": "active",
	    "description": "SHIT MIDGETS in my hair SHIT MIDGETS FUCK PIDDLES!",
	    "title": "1111111",
	    "minOcc": 2,
	    "untilTime": "2019-06-15T03:59:00.000Z",
	    "daysRunning": [0, 1, 2, 3, 4, 5, 6],
	    "originalDaysRunning": [0, 1, 2, 3, 4, 5, 6],
	    "single": false,
	    "timeZone": "America/New_York",
	    "discounts": [],
	    "charges": [{
	        "_id": "593ed95375634652759b1462",
	        "updatedAt": "2017-06-12T18:11:31.933Z",
	        "createdAt": "2017-06-12T18:11:31.933Z",
	        "amount": 20000,
	        "name": "Adult",
	        "type": "aap",
	        "status": "active",
	        "isDefault": true,
	        "frequency": "Daily",
	        "percentage": false,
	        "organizations": ["5939d988fd8f030e112be7b9"],
	        "id": "593ed95375634652759b1462",
	        "operator": "5939d988fd8f030e112be7b9",
	        "quantity": 0,
	        "$$hashKey": "object:429"
	    }, {
	        "_id": "593ed95375634652759b1463",
	        "updatedAt": "2017-06-12T18:11:31.934Z",
	        "createdAt": "2017-06-12T18:11:31.934Z",
	        "amount": 5000,
	        "name": "Youth",
	        "type": "aap",
	        "status": "active",
	        "isDefault": false,
	        "frequency": "Daily",
	        "percentage": false,
	        "organizations": ["5939d988fd8f030e112be7b9"],
	        "id": "593ed95375634652759b1463",
	        "operator": "5939d988fd8f030e112be7b9",
	        "quantity": 0,
	        "$$hashKey": "object:430"
	    }],
	    "events": ["5941972161cbb9537b3ac8c1", "5941c0647451df3e1b7721bb", "5941efe6c0a1d42d5f9196ee", "594437a9a8779410db6314af", "5953084d4311110b1beb2d81", "59540509ad8aa062e608d9df", "595426d2ad8aa062e608dd38", "59542c3ead8aa062e608de46", "595584a8ad8aa062e608ed83", "5956d1eb32acad1e1f71f33f", "59641c1f0a0ab843c08a5181", "596435fa0a0ab843c08a5454", "596448e7260dd02d60513a6a", "59658bb656e16109a458f170", "59668ea556e16109a458fa6c", "5967d74c9718a2326c6bcb63", "5967e73bcaa067395b72b43b", "5967e854c9af3b3be865e0e8", "5967ef2c05a7a040ae4094f5", "596801eb86ac35026c2bf9bc", "5968021786ac35026c2bf9e1", "59680c155c3883227e34e5db", "596811c7335c402d489abf89", "596926ca7835b956a24d6237", "596d0bbde3ec65054c68134a", "596d0c31e3ec65054c68137c", "596d8e2d414ff80d0ed33c48", "596eba46414ff80d0ed34370", "596ecac7e994820e921f73f6", "596fb4589d76b83655e96ff6", "596fb5f39d76b83655e97015", "596fc1459d76b83655e97074", "5970039114822271ee7cda3b", "5970040b6ffbe019d53c2502", "597005736ffbe019d53c2521", "5971182c92511457960fa610", "597133cf92511457960fa717", "5971433e92511457960fa761", "59779382010aa555daafc5e5", "597a5dd9ccb2a23b516d1bf4"],
	    "guides": [],
	    "organizations": ["5939d988fd8f030e112be7b9"],
	    "id": "593ed95375634652759b1464",
	    "isMinOccChanged": false,
	    "isMaxOccChanged": false,
	    "isTitleChanged": false,
	    "isDescriptionChanged": false,
	    "operator": "5939d988fd8f030e112be7b9",
	    "isStartTimeChanged": false,
	    "isEndTimeChanged": false,
	    "isUntilTimeChanged": false,
	    "isDaysRunningChanged": false
	};

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = {
	    "attendees": 1,
	    "bookings": ["597a5dd9ccb2a23b516d1c01", "59a49eeaf91c53477f5362f3"],
	    "calendarId": "37hpr1e9jfocmmlqsd8cmjgbts@group.calendar.google.com",
	    "description": "SHIT MIDGETS in my hair SHIT MIDGETS FUCK PIDDLES!",
	    "endTime": "2017-09-01T16:00:00.000Z",
	    "eventInstanceId": "0kka3gs2pkrlt32tbvd2cemo08_20170901T140000Z",
	    "guides": [],
	    "maxOcc": 8,
	    "minOcc": 2,
	    "organizations": ["5939d988fd8f030e112be7b9"],
	    "startTime": "2017-09-01T14:00:00.000Z",
	    "status": "active",
	    "timeslot": "593ed95375634652759b1464",
	    "timeZone": "America/New_York",
	    "title": "1111111",
	    "_id": "597a5dd9ccb2a23b516d1bf4",
	    "originalEndTime": "2017-09-01T16:00:00.000Z",
	    "originalStartTime": "2017-09-01T14:00:00.000Z",
	    "originalDescription": "SHIT MIDGETS in my hair SHIT MIDGETS FUCK PIDDLES!",
	    "originalTitle": "1111111",
	    "originalMaxOcc": 8,
	    "originalMinOcc": 2,
	    "updatedAt": "2017-08-28T22:53:30.852Z",
	    "createdAt": "2017-07-27T21:40:41.774Z",
	    "id": "597a5dd9ccb2a23b516d1bf4",
	    "isMinOccChanged": false,
	    "isMaxOccChanged": false,
	    "isTitleChanged": false,
	    "isDescriptionChanged": false,
	    "operator": "5939d988fd8f030e112be7b9",
	    "isStartTimeChanged": false,
	    "isEndTimeChanged": false,
	    "details": {
	        "aap": {
	            "Adult": 2
	        },
	        "addon": {
	            "an addon": 5
	        },
	        "tax": {
	            "a tax": 2
	        },
	        "fee": {
	            "a fee": 2
	        },
	        "one_time-credit": {
	            "Refund": 1,
	            " (eeeee)": 1,
	            "Refund (qqqqq)": 1
	        },
	        "coupon": {
	            "NACHOCHEESE": 1
	        },
	        "service": {
	            "Service Fee": 1
	        }
	    }
	};

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = {
	    "items": [{
	        "name": "Adult",
	        "type": "aap",
	        "amount": 10000,
	        "price": 10000,
	        "quantity": 1
	    }, {
	        "name": "test1",
	        "type": "aap",
	        "amount": 5000,
	        "price": 5000,
	        "quantity": 1
	    }, {
	        "name": "test3",
	        "type": "aap",
	        "amount": 2000,
	        "price": 2000,
	        "quantity": 1
	    }, {
	        "name": "poster",
	        "type": "addon",
	        "amount": 33400,
	        "price": 33400,
	        "quantity": 1
	    }, {
	        "name": "cakefarts",
	        "type": "addon",
	        "amount": 400,
	        "price": 400,
	        "quantity": 1
	    }, {
	        "type": "tax",
	        "name": "GST",
	        "price": 5080,
	        "quantity": 1,
	        "percent": 10
	    }],
	    "total": 55880,
	    "coupon": null,
	    "timeSlot": {
	        "_id": "59d58be4f75bdb4b56d4a9b2",
	        "eventId": "3hcnelv717uga5cf46m1q9g0jc",
	        "originalUntilTime": "2018-11-30T07:59:00.000Z",
	        "originalEndTime": "2017-10-04T19:00:00.000Z",
	        "originalStartTime": "2017-10-04T17:00:00.000Z",
	        "originalDescription": "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
	        "originalTitle": "eeeeeeeeeeeeeeeeeeeee",
	        "originalMaxOcc": 10,
	        "originalMinOcc": 2,
	        "updatedAt": "2017-10-13T01:52:29.554Z",
	        "createdAt": "2017-10-05T01:33:24.236Z",
	        "endTime": "2017-10-04T19:00:00.000Z",
	        "maxOcc": 10,
	        "startTime": "2017-10-04T17:00:00.000Z",
	        "activity": "59d58bcff75bdb4b56d4a9ae",
	        "calendarId": "9lmnhmf79evas36ur4h7fuglh0@group.calendar.google.com",
	        "status": "active",
	        "description": "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
	        "title": "eeeeeeeeeeeeeeeeeeeee",
	        "minOcc": 2,
	        "untilTime": "2018-11-30T07:59:00.000Z",
	        "daysRunning": [0, 1, 2, 3, 4, 5, 6],
	        "originalDaysRunning": [0, 1, 2, 3, 4, 5, 6],
	        "single": false,
	        "timeZone": "America/Los_Angeles",
	        "discounts": [],
	        "charges": [{
	            "_id": "59d58be4f75bdb4b56d4a9af",
	            "updatedAt": "2017-10-05T01:33:24.215Z",
	            "createdAt": "2017-10-05T01:33:24.215Z",
	            "amount": 10000,
	            "name": "Adult",
	            "type": "aap",
	            "status": "active",
	            "isDefault": true,
	            "frequency": "Daily",
	            "percentage": false,
	            "organizations": ["5939d988fd8f030e112be7b9"],
	            "operator": "5939d988fd8f030e112be7b9",
	            "id": "59d58be4f75bdb4b56d4a9af"
	        }, {
	            "_id": "59d58be4f75bdb4b56d4a9b0",
	            "updatedAt": "2017-10-05T01:33:24.216Z",
	            "createdAt": "2017-10-05T01:33:24.216Z",
	            "amount": 5000,
	            "name": "test1",
	            "type": "aap",
	            "status": "active",
	            "isDefault": false,
	            "frequency": "Daily",
	            "percentage": false,
	            "organizations": ["5939d988fd8f030e112be7b9"],
	            "operator": "5939d988fd8f030e112be7b9",
	            "id": "59d58be4f75bdb4b56d4a9b0"
	        }, {
	            "_id": "59d58be4f75bdb4b56d4a9b1",
	            "updatedAt": "2017-10-05T01:33:24.219Z",
	            "createdAt": "2017-10-05T01:33:24.219Z",
	            "amount": 2000,
	            "name": "test3",
	            "type": "aap",
	            "status": "active",
	            "isDefault": false,
	            "frequency": "Daily",
	            "percentage": false,
	            "organizations": ["5939d988fd8f030e112be7b9"],
	            "operator": "5939d988fd8f030e112be7b9",
	            "id": "59d58be4f75bdb4b56d4a9b1"
	        }],
	        "events": ["59d58c34f75bdb4b56d4a9b3", "59d593e11627061ef786d421", "59d59b7f6022d0510de318b6", "59d6ade43f36765538bff8dd", "59d7ddbfa8eaf70f7a0af216", "59d821c225bded3c7fd6def7", "59d823fe7f435345efcb0bd2", "59d824d2a86c3748c4ac0e15", "59d82f6ca86c3748c4ac0fc4", "59db9f78b1903148e8599c43", "59dd29fab1903148e8599c62", "59dd521308ebd92d203939bd", "59dd74fbb50aee61f4ee1415", "59debe83b15be001d351c788", "59dfd67fbdf2fa31ddfc80ba", "59dfda46dcedee42c09389da", "59dfdb885226ff4aa3688e5d", "59dff0f5f404824fc1a66ac2", "59e01b306592b63f7d553b26", "59e01c5d6592b63f7d553b42"],
	        "guides": [],
	        "organizations": [{
	            "_id": "5939d988fd8f030e112be7b9",
	            "calendarId": "9lmnhmf79evas36ur4h7fuglh0@group.calendar.google.com",
	            "calendarIdOld": "37hpr1e9jfocmmlqsd8cmjgbts@group.calendar.google.com",
	            "updatedAt": "2017-10-03T20:08:04.139Z",
	            "createdAt": "2017-06-08T23:11:04.184Z",
	            "domainName": "http://operator38.com",
	            "location": "5939d988fd8f030e112be7b8",
	            "role": "operator",
	            "status": "active",
	            "payments": {
	                "stripeAccount": "5994da393437054cf951846c"
	            },
	            "addRulesToPropertiesOnCreate": true,
	            "languages": {
	                "sp": false,
	                "fr": false,
	                "en": true
	            },
	            "language": "en",
	            "reminders": {
	                "email": false,
	                "sms": false,
	                "id": null
	            },
	            "primaryContact": {
	                "email": "tyler+operator38@adventurebucketlist.com",
	                "phoneNumber": "7169488938",
	                "fullName": "Operator 38"
	            },
	            "social": {
	                "googlePlus": "https://plus.google.com/+eeeeeeeeee",
	                "tripadvisor": "https://www.tripadvisor.com/Hotel_Review-g612353-d736372-Reviews-Tamassa_Resort-" + "Bel_Ombre.html",
	                "twitter": "twittah1123",
	                "instagram": "insta111",
	                "facebook": "shfacebook111"
	            },
	            "preferences": {
	                "deposits": {
	                    "amount": 5000,
	                    "percent": null,
	                    "threshold": 10000,
	                    "priorDays": 30,
	                    "setting": "threshold"
	                },
	                "notifications": {
	                    "booking_confirmation_customer": {
	                        "terms_conditions": "",
	                        "signoff": "",
	                        "custom_field_3": "",
	                        "custom_field_2": "",
	                        "custom_field_1": ""
	                    }
	                },
	                "tripadvisorReviewEmail": {
	                    "delay": {
	                        "period": "day",
	                        "number": 3
	                    },
	                    "active": true
	                },
	                "payment": {
	                    "hideCvc": true
	                },
	                "widget": {
	                    "display": {
	                        "timeslot": {
	                            "startTime": false,
	                            "price": true,
	                            "duration": false,
	                            "availability": false
	                        },
	                        "theme": "blue",
	                        "event": {
	                            "isSiteWide": true,
	                            "cutoff": 720
	                        }
	                    }
	                },
	                "customFields": {
	                    "prior": 15,
	                    "notes": "Notes"
	                },
	                "affiliate": {
	                    "includeAddons": false
	                },
	                "features": {
	                    "affiliates": false,
	                    "questions": true,
	                    "guides": true,
	                    "coupons": true
	                },
	                "id": null
	            },
	            "companyImage": "https://dev-images.ablsolution.com/3338cb58-4d3c-49ad-9cde-92a18550c19f.png",
	            "companyName": "Operator 38",
	            "groups": ["tahit"],
	            "applicationFee": 3,
	            "organizations": ["ffffffffffffffffffffffff"],
	            "bookings": null,
	            "createdDate": "2017-06-08T23:11:04.184Z",
	            "apiKeys": null,
	            "id": "5939d988fd8f030e112be7b9"
	        }],
	        "isMinOccChanged": false,
	        "isMaxOccChanged": false,
	        "isTitleChanged": false,
	        "isDescriptionChanged": false,
	        "operator": {
	            "_id": "5939d988fd8f030e112be7b9",
	            "calendarId": "9lmnhmf79evas36ur4h7fuglh0@group.calendar.google.com",
	            "calendarIdOld": "37hpr1e9jfocmmlqsd8cmjgbts@group.calendar.google.com",
	            "updatedAt": "2017-10-03T20:08:04.139Z",
	            "createdAt": "2017-06-08T23:11:04.184Z",
	            "domainName": "http://operator38.com",
	            "location": "5939d988fd8f030e112be7b8",
	            "role": "operator",
	            "status": "active",
	            "payments": {
	                "stripeAccount": "5994da393437054cf951846c"
	            },
	            "addRulesToPropertiesOnCreate": true,
	            "languages": {
	                "sp": false,
	                "fr": false,
	                "en": true
	            },
	            "language": "en",
	            "reminders": {
	                "email": false,
	                "sms": false,
	                "id": null
	            },
	            "primaryContact": {
	                "email": "tyler+operator38@adventurebucketlist.com",
	                "phoneNumber": "7169488938",
	                "fullName": "Operator 38"
	            },
	            "social": {
	                "googlePlus": "https://plus.google.com/+eeeeeeeeee",
	                "tripadvisor": "https://www.tripadvisor.com/Hotel_Review-g612353-d736372-Reviews-Tamassa_Resort-" + "Bel_Ombre.html",
	                "twitter": "twittah1123",
	                "instagram": "insta111",
	                "facebook": "shfacebook111"
	            },
	            "preferences": {
	                "deposits": {
	                    "amount": 5000,
	                    "percent": null,
	                    "threshold": 10000,
	                    "priorDays": 30,
	                    "setting": "threshold"
	                },
	                "notifications": {
	                    "booking_confirmation_customer": {
	                        "terms_conditions": "",
	                        "signoff": "",
	                        "custom_field_3": "",
	                        "custom_field_2": "",
	                        "custom_field_1": ""
	                    }
	                },
	                "tripadvisorReviewEmail": {
	                    "delay": {
	                        "period": "day",
	                        "number": 3
	                    },
	                    "active": true
	                },
	                "payment": {
	                    "hideCvc": true
	                },
	                "widget": {
	                    "display": {
	                        "timeslot": {
	                            "startTime": false,
	                            "price": true,
	                            "duration": false,
	                            "availability": false
	                        },
	                        "theme": "blue",
	                        "event": {
	                            "isSiteWide": true,
	                            "cutoff": 720
	                        }
	                    }
	                },
	                "customFields": {
	                    "prior": 15,
	                    "notes": "Notes"
	                },
	                "affiliate": {
	                    "includeAddons": false
	                },
	                "features": {
	                    "affiliates": false,
	                    "questions": true,
	                    "guides": true,
	                    "coupons": true
	                },
	                "id": null
	            },
	            "companyImage": "https://dev-images.ablsolution.com/3338cb58-4d3c-49ad-9cde-92a18550c19f.png",
	            "companyName": "Operator 38",
	            "groups": ["tahit"],
	            "applicationFee": 3,
	            "organizations": ["ffffffffffffffffffffffff"],
	            "bookings": null,
	            "createdDate": "2017-06-08T23:11:04.184Z",
	            "apiKeys": null,
	            "id": "5939d988fd8f030e112be7b9"
	        },
	        "isStartTimeChanged": false,
	        "isEndTimeChanged": false,
	        "isUntilTimeChanged": false,
	        "isDaysRunningChanged": false,
	        "id": "59d58be4f75bdb4b56d4a9b2"
	    },
	    "activity": {
	        "_id": "59d58bcff75bdb4b56d4a9ae",
	        "originalTitle": "eeeeeeeeeeeeeeeeeeeee",
	        "originalDescription": "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
	        "updatedAt": "2017-10-13T01:52:49.064Z",
	        "createdAt": "2017-10-05T01:33:03.937Z",
	        "location": {
	            "_id": "59d58bcff75bdb4b56d4a9ad",
	            "updatedAt": "2017-10-13T01:52:49.004Z",
	            "createdAt": "2017-10-05T01:33:03.929Z",
	            "streetAddress": "123 Main St, Los Altos, CA 94022, USA",
	            "location": {
	                "coordinates": [0, 0],
	                "type": "Point"
	            },
	            "zoom": 12,
	            "tag": "Main Location",
	            "id": "59d58bcff75bdb4b56d4a9ad"
	        },
	        "images": ["https://dev-images.ablsolution.com/5525cf21-788c-48c2-854d-e1d8612d0bc4.jpg"],
	        "title": "eeeeeeeeeeeeeeeeeeeee",
	        "description": "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
	        "status": "active",
	        "widgetOrder": 1,
	        "published": true,
	        "whatToBring": ["eeeeeeeeeeeeee"],
	        "whatIncluded": ["eeeeeeeeeee"],
	        "timeZone": "America/Los_Angeles",
	        "requirements": ["eeeeee"],
	        "isListed": false,
	        "cutoff": -1,
	        "color": "336633",
	        "questions": ["5951a758717233012fb69692", "5951a76d717233012fb69694", "5951a75e717233012fb69693"],
	        "charges": [{
	            "_id": "59debe50b15be001d351c777",
	            "updatedAt": "2017-10-12T00:58:56.135Z",
	            "createdAt": "2017-10-12T00:58:56.135Z",
	            "amount": 33400,
	            "name": "poster",
	            "type": "addon",
	            "status": "active",
	            "isDefault": false,
	            "frequency": "Daily",
	            "percentage": false,
	            "organizations": [],
	            "id": "59debe50b15be001d351c777"
	        }, {
	            "_id": "59debe50b15be001d351c778",
	            "updatedAt": "2017-10-12T00:58:56.137Z",
	            "createdAt": "2017-10-12T00:58:56.137Z",
	            "amount": 400,
	            "name": "cakefarts",
	            "type": "addon",
	            "status": "active",
	            "isDefault": false,
	            "frequency": "Daily",
	            "percentage": false,
	            "organizations": [],
	            "id": "59debe50b15be001d351c778"
	        }, {
	            "_id": "59e01c71f2c4273fa1d3f2dd",
	            "updatedAt": "2017-10-13T01:52:49.042Z",
	            "createdAt": "2017-10-13T01:52:49.042Z",
	            "amount": 10,
	            "name": "GST",
	            "type": "tax",
	            "status": "active",
	            "isDefault": false,
	            "frequency": "Daily",
	            "percentage": true,
	            "organizations": [],
	            "id": "59e01c71f2c4273fa1d3f2dd"
	        }],
	        "timeslots": ["59d58be4f75bdb4b56d4a9b2"],
	        "organizations": ["5939d988fd8f030e112be7b9"],
	        "isDescriptionChanged": false,
	        "isTitleChanged": false,
	        "image": "https://dev-images.ablsolution.com/5525cf21-788c-48c2-854d-e1d8612d0bc4.jpg",
	        "operator": "5939d988fd8f030e112be7b9",
	        "id": "59d58bcff75bdb4b56d4a9ae"
	    },
	    "event": {
	        "_id": "59d58be4f75bdb4b56d4a9b2",
	        "eventId": "3hcnelv717uga5cf46m1q9g0jc",
	        "originalUntilTime": "2018-11-30T07:59:00.000Z",
	        "originalEndTime": "2017-10-04T19:00:00.000Z",
	        "originalStartTime": "2017-10-04T17:00:00.000Z",
	        "originalDescription": "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
	        "originalTitle": "eeeeeeeeeeeeeeeeeeeee",
	        "originalMaxOcc": 10,
	        "originalMinOcc": 2,
	        "updatedAt": "2017-10-13T01:52:29.554Z",
	        "createdAt": "2017-10-05T01:33:24.236Z",
	        "endTime": "2017-10-04T19:00:00.000Z",
	        "maxOcc": 10,
	        "startTime": "2017-10-04T17:00:00.000Z",
	        "activity": "59d58bcff75bdb4b56d4a9ae",
	        "calendarId": "9lmnhmf79evas36ur4h7fuglh0@group.calendar.google.com",
	        "status": "active",
	        "description": "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
	        "title": "eeeeeeeeeeeeeeeeeeeee",
	        "minOcc": 2,
	        "untilTime": "2018-11-30T07:59:00.000Z",
	        "daysRunning": [0, 1, 2, 3, 4, 5, 6],
	        "originalDaysRunning": [0, 1, 2, 3, 4, 5, 6],
	        "single": false,
	        "timeZone": "America/Los_Angeles",
	        "discounts": [],
	        "charges": [{
	            "_id": "59d58be4f75bdb4b56d4a9af",
	            "updatedAt": "2017-10-05T01:33:24.215Z",
	            "createdAt": "2017-10-05T01:33:24.215Z",
	            "amount": 10000,
	            "name": "Adult",
	            "type": "aap",
	            "status": "active",
	            "isDefault": true,
	            "frequency": "Daily",
	            "percentage": false,
	            "organizations": ["5939d988fd8f030e112be7b9"],
	            "operator": "5939d988fd8f030e112be7b9",
	            "id": "59d58be4f75bdb4b56d4a9af"
	        }, {
	            "_id": "59d58be4f75bdb4b56d4a9b0",
	            "updatedAt": "2017-10-05T01:33:24.216Z",
	            "createdAt": "2017-10-05T01:33:24.216Z",
	            "amount": 5000,
	            "name": "test1",
	            "type": "aap",
	            "status": "active",
	            "isDefault": false,
	            "frequency": "Daily",
	            "percentage": false,
	            "organizations": ["5939d988fd8f030e112be7b9"],
	            "operator": "5939d988fd8f030e112be7b9",
	            "id": "59d58be4f75bdb4b56d4a9b0"
	        }, {
	            "_id": "59d58be4f75bdb4b56d4a9b1",
	            "updatedAt": "2017-10-05T01:33:24.219Z",
	            "createdAt": "2017-10-05T01:33:24.219Z",
	            "amount": 2000,
	            "name": "test3",
	            "type": "aap",
	            "status": "active",
	            "isDefault": false,
	            "frequency": "Daily",
	            "percentage": false,
	            "organizations": ["5939d988fd8f030e112be7b9"],
	            "operator": "5939d988fd8f030e112be7b9",
	            "id": "59d58be4f75bdb4b56d4a9b1"
	        }],
	        "events": ["59d58c34f75bdb4b56d4a9b3", "59d593e11627061ef786d421", "59d59b7f6022d0510de318b6", "59d6ade43f36765538bff8dd", "59d7ddbfa8eaf70f7a0af216", "59d821c225bded3c7fd6def7", "59d823fe7f435345efcb0bd2", "59d824d2a86c3748c4ac0e15", "59d82f6ca86c3748c4ac0fc4", "59db9f78b1903148e8599c43", "59dd29fab1903148e8599c62", "59dd521308ebd92d203939bd", "59dd74fbb50aee61f4ee1415", "59debe83b15be001d351c788", "59dfd67fbdf2fa31ddfc80ba", "59dfda46dcedee42c09389da", "59dfdb885226ff4aa3688e5d", "59dff0f5f404824fc1a66ac2", "59e01b306592b63f7d553b26", "59e01c5d6592b63f7d553b42"],
	        "guides": [],
	        "organizations": [{
	            "_id": "5939d988fd8f030e112be7b9",
	            "calendarId": "9lmnhmf79evas36ur4h7fuglh0@group.calendar.google.com",
	            "calendarIdOld": "37hpr1e9jfocmmlqsd8cmjgbts@group.calendar.google.com",
	            "updatedAt": "2017-10-03T20:08:04.139Z",
	            "createdAt": "2017-06-08T23:11:04.184Z",
	            "domainName": "http://operator38.com",
	            "location": "5939d988fd8f030e112be7b8",
	            "role": "operator",
	            "status": "active",
	            "payments": {
	                "stripeAccount": "5994da393437054cf951846c"
	            },
	            "addRulesToPropertiesOnCreate": true,
	            "languages": {
	                "sp": false,
	                "fr": false,
	                "en": true
	            },
	            "language": "en",
	            "reminders": {
	                "email": false,
	                "sms": false,
	                "id": null
	            },
	            "primaryContact": {
	                "email": "tyler+operator38@adventurebucketlist.com",
	                "phoneNumber": "7169488938",
	                "fullName": "Operator 38"
	            },
	            "social": {
	                "googlePlus": "https://plus.google.com/+eeeeeeeeee",
	                "tripadvisor": "https://www.tripadvisor.com/Hotel_Review-g612353-d736372-Reviews-Tamassa_Resort-" + "Bel_Ombre.html",
	                "twitter": "twittah1123",
	                "instagram": "insta111",
	                "facebook": "shfacebook111"
	            },
	            "preferences": {
	                "deposits": {
	                    "amount": 5000,
	                    "percent": null,
	                    "threshold": 10000,
	                    "priorDays": 30,
	                    "setting": "threshold"
	                },
	                "notifications": {
	                    "booking_confirmation_customer": {
	                        "terms_conditions": "",
	                        "signoff": "",
	                        "custom_field_3": "",
	                        "custom_field_2": "",
	                        "custom_field_1": ""
	                    }
	                },
	                "tripadvisorReviewEmail": {
	                    "delay": {
	                        "period": "day",
	                        "number": 3
	                    },
	                    "active": true
	                },
	                "payment": {
	                    "hideCvc": true
	                },
	                "widget": {
	                    "display": {
	                        "timeslot": {
	                            "startTime": false,
	                            "price": true,
	                            "duration": false,
	                            "availability": false
	                        },
	                        "theme": "blue",
	                        "event": {
	                            "isSiteWide": true,
	                            "cutoff": 720
	                        }
	                    }
	                },
	                "customFields": {
	                    "prior": 15,
	                    "notes": "Notes"
	                },
	                "affiliate": {
	                    "includeAddons": false
	                },
	                "features": {
	                    "affiliates": false,
	                    "questions": true,
	                    "guides": true,
	                    "coupons": true
	                },
	                "id": null
	            },
	            "companyImage": "https://dev-images.ablsolution.com/3338cb58-4d3c-49ad-9cde-92a18550c19f.png",
	            "companyName": "Operator 38",
	            "groups": ["tahit"],
	            "applicationFee": 3,
	            "organizations": ["ffffffffffffffffffffffff"],
	            "bookings": null,
	            "createdDate": "2017-06-08T23:11:04.184Z",
	            "apiKeys": null,
	            "id": "5939d988fd8f030e112be7b9"
	        }],
	        "isMinOccChanged": false,
	        "isMaxOccChanged": false,
	        "isTitleChanged": false,
	        "isDescriptionChanged": false,
	        "operator": {
	            "_id": "5939d988fd8f030e112be7b9",
	            "calendarId": "9lmnhmf79evas36ur4h7fuglh0@group.calendar.google.com",
	            "calendarIdOld": "37hpr1e9jfocmmlqsd8cmjgbts@group.calendar.google.com",
	            "updatedAt": "2017-10-03T20:08:04.139Z",
	            "createdAt": "2017-06-08T23:11:04.184Z",
	            "domainName": "http://operator38.com",
	            "location": "5939d988fd8f030e112be7b8",
	            "role": "operator",
	            "status": "active",
	            "payments": {
	                "stripeAccount": "5994da393437054cf951846c"
	            },
	            "addRulesToPropertiesOnCreate": true,
	            "languages": {
	                "sp": false,
	                "fr": false,
	                "en": true
	            },
	            "language": "en",
	            "reminders": {
	                "email": false,
	                "sms": false,
	                "id": null
	            },
	            "primaryContact": {
	                "email": "tyler+operator38@adventurebucketlist.com",
	                "phoneNumber": "7169488938",
	                "fullName": "Operator 38"
	            },
	            "social": {
	                "googlePlus": "https://plus.google.com/+eeeeeeeeee",
	                "tripadvisor": "https://www.tripadvisor.com/Hotel_Review-g612353-d736372-Reviews-Tamassa_Resort-" + "Bel_Ombre.html",
	                "twitter": "twittah1123",
	                "instagram": "insta111",
	                "facebook": "shfacebook111"
	            },
	            "preferences": {
	                "deposits": {
	                    "amount": 5000,
	                    "percent": null,
	                    "threshold": 10000,
	                    "priorDays": 30,
	                    "setting": "threshold"
	                },
	                "notifications": {
	                    "booking_confirmation_customer": {
	                        "terms_conditions": "",
	                        "signoff": "",
	                        "custom_field_3": "",
	                        "custom_field_2": "",
	                        "custom_field_1": ""
	                    }
	                },
	                "tripadvisorReviewEmail": {
	                    "delay": {
	                        "period": "day",
	                        "number": 3
	                    },
	                    "active": true
	                },
	                "payment": {
	                    "hideCvc": true
	                },
	                "widget": {
	                    "display": {
	                        "timeslot": {
	                            "startTime": false,
	                            "price": true,
	                            "duration": false,
	                            "availability": false
	                        },
	                        "theme": "blue",
	                        "event": {
	                            "isSiteWide": true,
	                            "cutoff": 720
	                        }
	                    }
	                },
	                "customFields": {
	                    "prior": 15,
	                    "notes": "Notes"
	                },
	                "affiliate": {
	                    "includeAddons": false
	                },
	                "features": {
	                    "affiliates": false,
	                    "questions": true,
	                    "guides": true,
	                    "coupons": true
	                },
	                "id": null
	            },
	            "companyImage": "https://dev-images.ablsolution.com/3338cb58-4d3c-49ad-9cde-92a18550c19f.png",
	            "companyName": "Operator 38",
	            "groups": ["tahit"],
	            "applicationFee": 3,
	            "organizations": ["ffffffffffffffffffffffff"],
	            "bookings": null,
	            "createdDate": "2017-06-08T23:11:04.184Z",
	            "apiKeys": null,
	            "id": "5939d988fd8f030e112be7b9"
	        },
	        "isStartTimeChanged": false,
	        "isEndTimeChanged": false,
	        "isUntilTimeChanged": false,
	        "isDaysRunningChanged": false,
	        "id": "59d58be4f75bdb4b56d4a9b2"
	    }
	};

/***/ })
/******/ ]);