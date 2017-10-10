webpackJsonp([0],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _rx = __webpack_require__(2);

	var _rx2 = _interopRequireDefault(_rx);

	var _feathersClient = __webpack_require__(5);

	var _feathersClient2 = _interopRequireDefault(_feathersClient);

	var _feathersLocalstorage = __webpack_require__(58);

	var _feathersLocalstorage2 = _interopRequireDefault(_feathersLocalstorage);

	var _feathersReactive = __webpack_require__(71);

	var _feathersReactive2 = _interopRequireDefault(_feathersReactive);

	var _rx3 = __webpack_require__(76);

	var _rx4 = _interopRequireDefault(_rx3);

	var _utils = __webpack_require__(78);

	var _utils2 = _interopRequireDefault(_utils);

	var _styles = __webpack_require__(79);

	var _styles2 = _interopRequireDefault(_styles);

	var _helperStyles = __webpack_require__(84);

	var _helperStyles2 = _interopRequireDefault(_helperStyles);

	var _picker = __webpack_require__(86);

	var _picker2 = _interopRequireDefault(_picker);

	var _rest = __webpack_require__(88);

	var _rest2 = _interopRequireDefault(_rest);

	var _toUppercase = __webpack_require__(89);

	var _toUppercase2 = _interopRequireDefault(_toUppercase);

	var _formatPhone = __webpack_require__(90);

	var _formatPhone2 = _interopRequireDefault(_formatPhone);

	var _focusParent = __webpack_require__(91);

	var _focusParent2 = _interopRequireDefault(_focusParent);

	var _size = __webpack_require__(92);

	var _size2 = _interopRequireDefault(_size);

	var _navigator = __webpack_require__(93);

	var _navigator2 = _interopRequireDefault(_navigator);

	var _col = __webpack_require__(94);

	var _col2 = _interopRequireDefault(_col);

	var _progressButton = __webpack_require__(96);

	var _progressButton2 = _interopRequireDefault(_progressButton);

	var _progressButton3 = __webpack_require__(98);

	var _progressButton4 = _interopRequireDefault(_progressButton3);

	var _listItem = __webpack_require__(100);

	var _listItem2 = _interopRequireDefault(_listItem);

	var _listItemNumericControl = __webpack_require__(102);

	var _listItemNumericControl2 = _interopRequireDefault(_listItemNumericControl);

	var _listItemAddCharge = __webpack_require__(104);

	var _listItemAddCharge2 = _interopRequireDefault(_listItemAddCharge);

	var _listItemHeader = __webpack_require__(108);

	var _listItemHeader2 = _interopRequireDefault(_listItemHeader);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	//Including independent module source code for packaging
	var ablBook = __webpack_require__(110);


	var jQuery = window.jQuery;

	// import feathersAuthentication from './auth';


	var sdkProvider = function sdkProvider(settings) {

	  var endpoint = null;
	  var apiKey = null;
	  var socketOpts = null;

	  var feathersAuth = false;
	  var _useSocket = true;
	  var authStorage = window.localStorage;
	  var services = [];
	  //Configuration
	  return {
	    setAuthStorage: function setAuthStorage(newAuthStorage) {
	      authStorage = newAuthStorage;
	    },
	    setSocketOpts: function setSocketOpts(opts) {
	      socketOpts = opts;
	    },
	    useSocket: function useSocket(socketEnabled) {
	      _useSocket = !!socketEnabled;
	    },
	    setEndpoint: function setEndpoint(newEndpoint) {
	      endpoint = newEndpoint;
	    },
	    setApiKey: function setApiKey(key) {
	      apiKey = key;
	    },

	    setFeathersAuth: function setFeathersAuth(isFeathersAuth) {
	      feathersAuth = isFeathersAuth;
	    },
	    setServices: function setServices(newServices) {
	      services = newServices;
	    },
	    getSettings: function getSettings() {
	      return endpoint;
	    },
	    $get: ['$injector', '$timeout', '$log', '$mdToast', '$http', function ($injector, $timeout, $log, $mdToast, $http) {
	      var $rootScope = $injector.get('$rootScope');
	      var that = this;

	      if (!endpoint) {
	        this.app = {};
	        return this.app;
	      }

	      this.app = (0, _feathersClient2.default)().configure((0, _feathersReactive2.default)(_rx2.default)) //feathers-reactive
	      .configure(_feathersClient2.default.hooks()).use('cache', (0, _feathersLocalstorage2.default)({
	        name: 'abl' + ($rootScope.config.DASHBOARD ? '-dash' : ''),
	        storage: window.localStorage
	      }));

	      this.app.endpoint = endpoint;
	      this.app.apiKey = apiKey;

	      this.app.headers = {};
	      if (apiKey) {
	        this.app.headers = {
	          'X-ABL-Access-Key': apiKey,
	          'X-ABL-Date': Date.parse(new Date().toISOString())
	        };
	      }

	      if (_useSocket) {
	        console.log('endpoint', endpoint);
	        this.socket = io(endpoint, socketOpts);
	        this.app.configure(_feathersClient2.default.socketio(this.socket));
	      } else {
	        this.app.configure(_feathersClient2.default.rest(endpoint).jquery(jQuery));
	        this.app.rest.ajaxSetup({
	          url: endpoint,
	          headers: {}
	        });
	      }

	      (0, _utils2.default)(this.app, $mdToast, $rootScope);

	      (0, _rest2.default)(this.app, $http);

	      // if (feathersAuth) {
	      //   this.app = feathersAuthentication(this.app, that, authStorage, $rootScope);
	      // }

	      $rootScope.loading = true;
	      this.app.loadingTimeout = null;

	      this.app.loadingTimeout = $timeout(function () {
	        $rootScope.loading = false;
	      }, 1500);

	      //Add timeout
	      $rootScope.afterRender = function (current, total) {
	        $timeout.cancel(this.loadingTimeout);
	        this.loadingTimeout = $timeout(function () {
	          $rootScope.loading = false;
	        }, 1500);
	      };

	      console.log('$abl', this.app);
	      window.$abl = this.app;
	      return this.app;
	    }]
	  };
	};

	//Old naming convention, left for backwards compatibility
	var feathersSdk = [function $feathersProvider() {
	  return sdkProvider('feathers');
	}];

	var ablSdk = [function $ablProvider() {
	  return sdkProvider('abl');
	}];

	/**
	 * @namespace abl-sdk-feathers
	 * @requires feathers
	 * @requires RxJS
	 * @requires rx-angular
	 * @requires socket.io-client

	 */
	exports.default = angular.module('abl-sdk-feathers', ['ngMaterial', 'rx'])
	/**
	 * @class abl-sdk-feathers.$abl
	 */
	.provider('$abl', ablSdk).provider('$feathers', feathersSdk).filter('startFrom', function () {
	  return function (input, start) {
	    start = +start; //parse to int
	    return input.slice(start);
	  };
	}).service('navigatorService', _navigator2.default).directive('toUppercase', _toUppercase2.default).directive('formatPhone', _formatPhone2.default).directive('onFocus', _focusParent2.default)
	// .directive('size', size)

	.directive('formatPhone', _formatPhone2.default).component('colSection', _col2.default).component('progressButton', _progressButton2.default).component('listItem', _listItem2.default).component('listItemNumericControl', _listItemNumericControl2.default).component('listItemAddCharge', _listItemAddCharge2.default).component('listItemHeader', _listItemHeader2.default);

/***/ }),
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = setupUtilityFunctions;
	function setupUtilityFunctions(app, $mdToast, $rootScope) {

	    /**
	     * @name $abl.showToast
	     * @function showToast
	     * @memberOf abl-sdk-feathers.$abl
	     * @description Show an Angular Material toast.
	     * @param {string} message - The message to display.
	     * @param {string} [class] - The CSS class to apply to the toast.
	     * @param {number} [timeout=3000] - The length of time (ms) for the toast to remain visible. 
	     */
	    app.showToast = function (msg, toastClass, delay) {
	        if (!toastClass) var toastClass = '';
	        if (!delay) var delay = 3000;

	        var toast = $mdToast.simple().toastClass(toastClass).textContent(msg).action('Hide').hideDelay(delay).position('bottom left').highlightAction(false);
	        $mdToast.show(toast);
	        console.debug('showToast ', toastClass, msg);
	    };

	    /**
	     * @name $abl.randomInt
	     * @function randomInt
	     * @memberOf abl-sdk-feathers.$abl
	     * @description Returns random integer between min and max.
	     * @param {number} min - The upper bound of the random calculation.
	     * @param {number} max - The lower bound of the random calculation.
	     * @returns {number} between min and max.
	     */
	    //
	    app.randomInt = function (min, max) {
	        return Math.floor(Math.random() * (max - min + 1) + min);
	    };

	    /**
	     * @class abl-sdk-feathers.$rootScope
	     * @hidden
	     */

	    /**
	     * @name $rootScope.showToast
	     * @function showToast
	     * @memberOf abl-sdk-feathers.$rootScope
	     * @description Show an Angular Material toast.
	     * @param {string} message - The message to display.
	     * @param {string} [class] - The CSS class to apply to the toast.
	     * @param {number} [timeout=3000] - The length of time (ms) for the toast to remain visible. 
	     */
	    $rootScope.showToast = function (a, b, c) {
	        app.showToast(a, b, c); //Legacy support
	    };

	    /**
	     * @name $rootScope.safeApply
	     * @function safeApply
	     * @memberOf abl-sdk-feathers.$rootScope
	     * @description App-wide safeApply function for usage in app controllers as a safer alternative to $apply().
	     */
	    $rootScope.safeApply = function (fn) {
	        if (this.$root) {
	            var phase = this.$root.$$phase;
	            if (phase === '$apply' || phase === '$digest') {
	                if (fn && typeof fn === 'function') {
	                    fn();
	                }
	            } else {
	                this.$apply(fn);
	            }
	        } else {
	            this.$apply(fn);
	        }
	    };

	    return app;
	}

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(80);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(82)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(80, function() {
				var newContent = __webpack_require__(80);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(81)(undefined);
	// imports


	// module
	exports.push([module.id, "    md-list {\n        display: block;\n        padding: 0px 0px 0px 0px;\n    }\n\n    .list-item-48 {\n        height: 36px;\n        min-height: 36px;\n        font-size: 14px;\n        font-weight: 300;\n    }\n\n    .red {\n        color: rgb(221, 44, 0);\n    }\n\n    .activityPaymentSummaryCard {\n        margin-bottom: 8px;\n        margin-top: 8px;\n        margin-right: 0;\n        margin-left: 0;\n        background: none;\n        box-shadow: none;\n        position: relative;\n    }\n\n    .activityPaymentSummaryCardMobile {}\n\n    .paymentSummaryCard {\n        min-width: 100%;\n        margin-bottom: 8px;\n        margin-right: 16px;\n        margin-top: 0;\n        background: none;\n        box-shadow: none;\n    }\n\n    .paymentSummaryCardLarge {\n        /*min-width: 370px;*/\n        width: 100%;\n        margin-bottom: 0;\n        margin-top: 0;\n        padding-right: 0;\n        padding-left: 0;\n    }\n\n    .paymentHeader p {\n        color: rgba(0, 0, 0, .8) !important;\n        font-weight: 500;\n        letter-spacing: 0.012em;\n        margin: 0 0 0 0;\n        line-height: 1.6em;\n    }\n\n    .paymentTitle {\n        font-size: 20px !important;\n    }\n\n    .paymentSubTitle {\n        font-size: 14px !important;\n        font-weight: 400;\n    }\n\n    .lineItemIcon {\n        width: 32px;\n        height: 32px;\n        margin: 4px 4px 4px -6px;\n        background: url('https://s3.amazonaws.com/assets.ablsolution.com/icons/stopwatch-2.svg') no-repeat;\n        background-position: center;\n        background-size: 28px 28px;\n    }\n\n    .headerIcon {\n        vertical-align: middle;\n        height: 36px;\n        width: 40px;\n        padding-right: 16px;\n    }\n\n    .headerIconRight {\n        padding-left: 16px;\n    }\n\n    .headerIcon svg {\n        position: absolute;\n        top: 24px;\n        bottom: 24px;\n        height: 24px;\n        width: 24px;\n    }\n\n    .lineItemText {\n        font-size: 14px;\n        font-weight: 500;\n        letter-spacing: 0.010em;\n        margin: 0 0 0 0;\n        line-height: 1.6em;\n        overflow: hidden;\n        white-space: nowrap;\n        text-overflow: ellipsis;\n        color: rgba(0, 0, 0, 0.54) !important;\n    }\n\n    .lineItemDetail {\n        background: rgba(255, 255, 255, .1);\n    }\n\n    .lineItemDetail p {\n        font-size: 12px;\n        color: rgba(0, 0, 0, .77);\n        font-weight: 400;\n    }\n\n    .lineItemHeader p {\n        font-size: 16px;\n        font-weight: 400;\n        letter-spacing: 0.010em;\n        margin: 0 0 0 0;\n        line-height: 50px;\n        overflow: hidden;\n        white-space: nowrap;\n        text-overflow: ellipsis;\n        color: rgba(0, 0, 0, 0.82) !important;\n    }\n\n    .lineItemSubHeader {\n        font-size: 16px;\n        font-weight: 400;\n        margin: 0 0 0 0;\n        line-height: 1.6em;\n        overflow: hidden;\n        white-space: nowrap;\n        text-overflow: ellipsis;\n        color: rgba(0, 0, 0, 0.82) !important;\n    }\n\n    .lineItemSubDetail {\n        font-size: 12px;\n        font-weight: 500;\n        margin: 0 0 0 0;\n        line-height: 1.6em;\n        overflow: hidden;\n        white-space: nowrap;\n        text-overflow: ellipsis;\n        color: rgba(0, 0, 0, .6);\n    }\n\n    .lineItemHeader {\n        background: rgba(0, 0, 0, 0);\n        color: rgba(0, 0, 0, .7) !important;\n    }\n\n    .addOnAdjusters {\n        width: 36px;\n        margin-right: 0;\n    }\n\n    .addOnQuantityText {\n        border: none;\n        width: 40px;\n        font-weight: 500;\n        text-align: center;\n        font-size: 16px;\n        outline: none;\n    }\n\n    .guestIcon {\n        width: 32px;\n        height: 32px;\n        margin: 4px 4px 4px -6px;\n        background: url('https://s3.amazonaws.com/assets.ablsolution.com/icons/user-3.svg') no-repeat;\n        background-position: center;\n        background-size: 28px 28px;\n    }\n\n    .lineItemIconRight {\n        width: 40px;\n        height: 40px;\n        margin: 4px -6px 4px 4px;\n        background: url('https://s3.amazonaws.com/assets.ablsolution.com/icons/calendar.svg') no-repeat;\n        background-position: center;\n        background-size: 28px 28px;\n    }\n\n    .locationHeader {\n        font-size: 14px !important;\n        letter-spacing: 0.010em;\n        line-height: 20px;\n        color: rgba(0, 0, 0, 0.66) !important;\n    }\n\n    .total {\n        font-size: 16px;\n        letter-spacing: 0.01em;\n        color: rgba(0, 0, 0, 0.8);\n    }\n\n    .activityTotal {\n        font-size: 16px;\n        letter-spacing: 0.01em;\n        color: rgba(0, 0, 0, 0.8);\n    }\n\n    .spacer {\n        margin: 4px;\n        width: 8px;\n    }\n\n    .darkerDivider {\n        border-top-color: rgba(0, 0, 0, 0.12);\n    }\n\n    .totalDivider {\n        display: block;\n        border-top-width: 1px;\n    }\n\n    .lineItemDetailDivider {\n        border-top-color: rgba(0, 0, 0, 0.0);\n    }\n\n    .paymentSummaryImage {\n        height: 120px;\n        margin: 24px 12px 0 12px;\n        background-position: center center;\n        background-repeat: no-repeat;\n        border-radius: 2px;\n    }\n\n    .paymentSummaryImageBig {\n        height: 244px;\n        margin: 24px 12px 0 12px;\n        background-position: center center;\n        background-repeat: no-repeat;\n        border-radius: 2px;\n        /*box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .6);*/\n    }\n\n    .mobileList {\n        height: 100%;\n    }\n\n    .mobileBottomBar {\n        position: fixed;\n        bottom: 0;\n        left: 0;\n        right: 0;\n    }\n\n    .cardForm {\n        margin: 16px 16px 16px 16px;\n    }\n\n    .addonForm {\n        padding-left: 16px;\n        padding-right: 16px;\n    }\n\n    .activityCardForm {\n        margin: 0 16px 0 16px;\n    }\n\n    .paymentHeader._md-button-wrap>div.md-button:first-child {\n        font-size: 22px;\n        /*box-shadow: 0 1px rgba(0, 0, 0, .12);*/\n    }\n\n    .listIcon {\n        padding: 0 0px 0 0;\n    }\n\n    .listIconSub {\n        height: 20px;\n        width: 20px;\n        color: rgba(0, 0, 0, .5);\n        fill: rgba(0, 0, 0, .5);\n        outline: none;\n    }\n\n    .listIconSub svg {\n        height: 20px;\n        width: 20px;\n    }\n\n    .listIconSub:hover {\n        height: 20px;\n        width: 20px;\n        color: rgba(0, 0, 0, .86);\n        fill: rgba(0, 0, 0, .86);\n        outline: none;\n    }\n\n    .formButton {\n        margin-right: 0;\n    }\n\n    .stepStatusRow ng-md-icon svg {\n        height: 16px;\n        margin-top: 1px;\n        vertical-align: top;\n    }\n    /*md-list-item:disabled .md-list-item-text,\nmd-list-item[disabled=disabled] .md-list-item-text{\n    color: #ccc;\n}*/\n\n    md-list-item.addOnListItem {\n        margin-right: -24px;\n        padding-left: 0;\n    }\n\n    md-list-item.listItemNotButton {\n        padding: 0 8px !important;\n    }\n\n    .totalListItem {\n        margin-bottom: 12px;\n    }\n\n    .listMessage {\n        font-size: 16px;\n        line-height: 1.6em;\n        padding: 0 4px;\n    }\n\n    .slideDown.ng-hide {\n        height: 0;\n        transition: height 0.35s ease;\n        overflow: hidden;\n        position: relative;\n    }\n\n    .slideDown {\n        transition: height 0.35s ease;\n        overflow: hidden;\n        position: relative;\n    }\n\n    .slideDown.ng-hide-remove,\n    .slideDown.ng-hide-add {\n        /* remember, the .hg-hide class is added to element\n  when the active class is added causing it to appear\n  as hidden. Therefore set the styling to display=block\n  so that the hide animation is visible */\n        display: block!important;\n    }\n\n    .slideDown.ng-hide-add {\n        animation-name: hide;\n        -webkit-animation-name: hide;\n        animation-duration: .5s;\n        -webkit-animation-duration: .5s;\n        animation-timing-function: ease-in;\n        -webkit-animation-timing-function: ease-in;\n    }\n\n    .slideDown.ng-hide-remove {\n        animation-name: show;\n        -webkit-animation-name: show;\n        animation-duration: .5s;\n        -webkit-animation-duration: .5s;\n        animation-timing-function: ease-out;\n        -webkit-animation-timing-function: ease-out;\n    }\n\n    ng-md-icon {}\n\n    .couponInput {\n        width: 100%;\n        border: none;\n        /* background-color: rgba(0, 0, 0, .08); */\n        /* border-radius: 3px; */\n        padding: 12px;\n        /* width: 100%; */\n        box-shadow: none;\n        margin-left: -12px;\n        line-height: 36px;\n        outline: none;\n    }\n\n    .remove-coupon {\n        cursor: pointer;\n    }\n\n    .toUppercase {\n        text-transform: uppercase;\n    }\n\n    .listItemCircularProgress {\n        /*margin-right: -6px;*/\n    }\n\n    md-list-item:hover {\n        background: transparent;\n    }\n\n    md-list-item.md-button.md-default-theme:not([disabled]):hover,\n    .md-button:not([disabled]):hover {\n        background-color: transparent;\n    }\n\n    .easeIn.ng-hide-add,\n    .easeIn.ng-hide-remove {\n        -webkit-transition: 0.5s ease-in-out opacity;\n        -moz-transition: 0.5s ease-in-out opacity;\n        -ms-transition: 0.5s ease-in-out opacity;\n        -o-transition: 0.5s ease-in-out opacity;\n        transition: 0.5s ease-in-out opacity;\n        opacity: 1;\n    }\n\n    .easeIn.ng-hide {\n        -webkit-transition: 0s ease-in-out opacity;\n        -moz-transition: 0s ease-in-out opacity;\n        -ms-transition: 0s ease-in-out opacity;\n        -o-transition: 0s ease-in-out opacity;\n        transition: 0s ease-in-out opacity;\n        opacity: 0;\n    }\n\n    .couponText {\n        margin-left: 16px;\n    }\n\n    .md-button[disabled] {\n        pointer-events: none;\n    }\n\n    .subtotalLineItem {\n        padding: 8px 32px 8px 16px;\n    }\n\n    .subtotalLineItemSmall {\n        font-size: 12px;\n    }\n\n    .bottomTotal {\n        font-size: 16px;\n        margin-top: 8px;\n        margin-bottom: 16px;\n        font-weight: 600;\n    }\n\n    .inputStatusIcon {\n        height: 24px;\n        width: 24px;\n        margin-bottom: 24px !important;\n        margin-right: 4px !important;\n    }\n\n    .payzenIframe {\n        border: none;\n        outline: none;\n        width: 100%;\n    }\n\n    .small-label {\n        font-size: 12px;\n        padding-left: 4px;\n    }\n\n    .confirmation {\n        padding: 20px 0;\n        text-align: center;\n    }\n\n    .confirmation h3 {\n        text-align: center;\n        margin-bottom: 20px;\n    }\n\n    .confirmation .margin-top {\n        margin-top: 8px;\n    }\n\n    .confirmation .booking-id {\n        padding: 15px;\n        display: inline-block;\n        margin: 0 auto;\n        width: 260px;\n        opacity: 0.8;\n        font-weight: bold;\n    }\n\n    body[md-theme=blue] .confirmation .booking-id {\n        background: #3F51B5;\n    }\n\n    body[md-theme=blue] .confirmation .booking-id {\n        background: #009688;\n    }\n\n    body[md-theme=green] .confirmation .booking-id {\n        background: #4CAF50;\n    }\n\n    body[md-theme=grey] .confirmation .booking-id {\n        background: #9E9E9E;\n    }\n\n    body[md-theme=blue_grey] .confirmation .booking-id {\n        background: #607D8B;\n    }\n\n    body[md-theme=yellow] .confirmation .booking-id {\n        background: #FFEB3B;\n    }\n\n    body[md-theme=indigo] .confirmation .booking-id {\n        background: #3F51B5;\n    }\n\n    body[md-theme=red] .confirmation .booking-id {\n        background: #F44336;\n    }\n\n    body[md-theme=black] .confirmation .booking-id {\n        background: #000000;\n    }\n\n    @media(max-width: 600px) {\n        .confirmation {\n            padding: 20px;\n            font-size: 13px;\n        }\n    }\n\n    .no-margin {\n        margin: 0 !important;\n    }\n\n    .picker-container {\n        border-radius: 2px;\n        background: white;\n    }\n\n    .bigDateToolbar {\n        background: white !important;\n        color: black !important;\n    }\n\n    .activity-dialog-container {\n        display: -ms-flexbox;\n        display: flex;\n        -ms-flex-pack: center;\n        justify-content: center;\n        -ms-flex-align: center;\n        align-items: center;\n        position: fixed;\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n        z-index: 80;\n        overflow: hidden;\n    }\n\n    .activity-dialog,\n    md-dialog.activity-dialog {\n        max-height: 80%;\n        max-width: 90%;\n        position: relative;\n        overflow: auto;\n        box-shadow: 0px 7px 8px -4px rgba(0, 0, 0, 0.2), 0px 13px 19px 2px rgba(0, 0, 0, 0.14), 0px 5px 24px 4px rgba(0, 0, 0, 0.12);\n        display: -ms-flexbox;\n        display: flex;\n        overflow-x: hidden;\n        -ms-flex-direction: column;\n        flex-direction: column;\n    }\n\n    .activity-dialog,\n    md-dialog md-dialog-content {\n        padding: 0;\n        overflow-x: hidden;\n    }\n\n    .no-margin {\n        margin: 0 !important;\n    }\n\n    .leftCard {\n        background: rgba(0, 0, 0, .025);\n    }\n\n    .activityBookDialogLarge {\n        width: 840px;\n        min-height: 600px;\n        height: 100%;\n    }\n\n    .leftCardLarge {\n        border-right: 1px solid #e4e4e4 !important;\n        box-shadow: 1px 0 5px 1px rgba(0, 0, 0, 0.12) !important;\n        min-height: 100%;\n        min-width: 420px;\n        width: 50%;\n        height: 100%;\n    }\n\n    .leftCardSmall {\n        border-bottom: 1px solid #e4e4e4 !important;\n        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.08) !important;\n    }\n\n    .rightCardLarge {\n        position: absolute;\n        right: 0;\n        padding-right: 24px;\n        min-width: 420px;\n        width: 50%;\n        display: block;\n    }\n\n    .couponText {\n        font-size: 16px;\n    }\n\n    .couponTextTotal {\n        font-size: 16px;\n        padding-right: 12px;\n    }\n\n    .listItemAutocomplete {\n        padding-left: 0 !important;\n    }\n\n    .addOnQuantityText {\n        border: none;\n        width: 40px;\n        font-weight: 500;\n        text-align: center;\n        font-size: 16px;\n        margin-right: -8px;\n        outline: none;\n        background: transparent;\n    }\n\n    .activityPaymentSummaryCard {\n        margin-bottom: 0 !important;\n        margin-top: 0 !important;\n        margin-right: 0;\n        margin-left: 0;\n        background: none;\n        box-shadow: none;\n        position: relative;\n    }\n\n    .activityCardForm {\n        margin: 0 16px 0 16px;\n    }\n\n    .detailsForm {\n        padding-left: 16px;\n        padding-right: 16px;\n    }\n\n    .listItemInputContainer {\n        margin: 24px 16px !important;\n    }", ""]);

	// exports


/***/ }),
/* 81 */
/***/ (function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function(useSourceMap) {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			return this.map(function (item) {
				var content = cssWithMappingToString(item, useSourceMap);
				if(item[2]) {
					return "@media " + item[2] + "{" + content + "}";
				} else {
					return content;
				}
			}).join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};

	function cssWithMappingToString(item, useSourceMap) {
		var content = item[1] || '';
		var cssMapping = item[3];
		if (!cssMapping) {
			return content;
		}

		if (useSourceMap && typeof btoa === 'function') {
			var sourceMapping = toComment(cssMapping);
			var sourceURLs = cssMapping.sources.map(function (source) {
				return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
			});

			return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
		}

		return [content].join('\n');
	}

	// Adapted from convert-source-map (MIT)
	function toComment(sourceMap) {
		// eslint-disable-next-line no-undef
		var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
		var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

		return '/*# ' + data + ' */';
	}


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			// Test for IE <= 9 as proposed by Browserhacks
			// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
			// Tests for existence of standard globals is to allow style-loader 
			// to operate correctly into non-standard environments
			// @see https://github.com/webpack-contrib/style-loader/issues/177
			return window && document && document.all && !window.atob;
		}),
		getElement = (function(fn) {
			var memo = {};
			return function(selector) {
				if (typeof memo[selector] === "undefined") {
					memo[selector] = fn.call(this, selector);
				}
				return memo[selector]
			};
		})(function (styleTarget) {
			return document.querySelector(styleTarget)
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [],
		fixUrls = __webpack_require__(83);

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		options.attrs = typeof options.attrs === "object" ? options.attrs : {};

		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the <head> element
		if (typeof options.insertInto === "undefined") options.insertInto = "head";

		// By default, add <style> tags to the bottom of the target
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	};

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var styleTarget = getElement(options.insertInto)
		if (!styleTarget) {
			throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
		}
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				styleTarget.insertBefore(styleElement, styleTarget.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				styleTarget.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				styleTarget.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			styleTarget.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		options.attrs.type = "text/css";

		attachTagAttrs(styleElement, options.attrs);
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		options.attrs.type = "text/css";
		options.attrs.rel = "stylesheet";

		attachTagAttrs(linkElement, options.attrs);
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function attachTagAttrs(element, attrs) {
		Object.keys(attrs).forEach(function (key) {
			element.setAttribute(key, attrs[key]);
		});
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement, options);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, options, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		/* If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
		*/
		var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

		if (options.convertToAbsoluteUrls || autoFixUrls){
			css = fixUrls(css);
		}

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }),
/* 83 */
/***/ (function(module, exports) {

	
	/**
	 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
	 * embed the css on the page. This breaks all relative urls because now they are relative to a
	 * bundle instead of the current page.
	 *
	 * One solution is to only use full urls, but that may be impossible.
	 *
	 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
	 *
	 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
	 *
	 */

	module.exports = function (css) {
	  // get current location
	  var location = typeof window !== "undefined" && window.location;

	  if (!location) {
	    throw new Error("fixUrls requires window.location");
	  }

		// blank or null?
		if (!css || typeof css !== "string") {
		  return css;
	  }

	  var baseUrl = location.protocol + "//" + location.host;
	  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

		// convert each url(...)
		/*
		This regular expression is just a way to recursively match brackets within
		a string.

		 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
		   (  = Start a capturing group
		     (?:  = Start a non-capturing group
		         [^)(]  = Match anything that isn't a parentheses
		         |  = OR
		         \(  = Match a start parentheses
		             (?:  = Start another non-capturing groups
		                 [^)(]+  = Match anything that isn't a parentheses
		                 |  = OR
		                 \(  = Match a start parentheses
		                     [^)(]*  = Match anything that isn't a parentheses
		                 \)  = Match a end parentheses
		             )  = End Group
	              *\) = Match anything and then a close parens
	          )  = Close non-capturing group
	          *  = Match anything
	       )  = Close capturing group
		 \)  = Match a close parens

		 /gi  = Get all matches, not the first.  Be case insensitive.
		 */
		var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
			// strip quotes (if they exist)
			var unquotedOrigUrl = origUrl
				.trim()
				.replace(/^"(.*)"$/, function(o, $1){ return $1; })
				.replace(/^'(.*)'$/, function(o, $1){ return $1; });

			// already a full url? no change
			if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
			  return fullMatch;
			}

			// convert the url to a full url
			var newUrl;

			if (unquotedOrigUrl.indexOf("//") === 0) {
			  	//TODO: should we add protocol?
				newUrl = unquotedOrigUrl;
			} else if (unquotedOrigUrl.indexOf("/") === 0) {
				// path should be relative to the base url
				newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
			} else {
				// path should be relative to current directory
				newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
			}

			// send back the fixed url(...)
			return "url(" + JSON.stringify(newUrl) + ")";
		});

		// send back the fixed css
		return fixedCss;
	};


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(85);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(82)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(85, function() {
				var newContent = __webpack_require__(85);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(81)(undefined);
	// imports


	// module
	exports.push([module.id, ".no-margin-top {\n    margin-top: 0 !important;\n}\n\n.no-margin-bottom {\n    margin-bottom: 0 !important;\n}\n\n.no-margin-right {\n    margin-right: 0 !important;\n}\n\n.no-margin-left {\n    margin-left: 0 !important;\n}\n\n.margin-right-30 {\n    margin-right: 30px;\n}", ""]);

	// exports


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(87);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(82)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(87, function() {
				var newContent = __webpack_require__(87);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(81)(undefined);
	// imports


	// module
	exports.push([module.id, ".abl-input-container {\n    min-height: 36px;\n    border-color: transparent;\n    outline: none;\n}\n\n.sm-calender-pane {\n    display: block;\n    position: fixed;\n    z-index: 81;\n    overflow: hidden;\n    border-radius: 2px;\n}\n\n.sm-calender-pane.hide-animate {\n    -webkit-transition: all 1s cubic-bezier(0.04, 1.01, 0.13, 1.02);\n    -moz-transition: all 1s cubic-bezier(0.04, 1.01, 0.13, 1.02);\n    -o-transition: all 1s cubic-bezier(0.04, 1.01, 0.13, 1.02);\n    transition: all 1s cubic-bezier(0.04, 1.01, 0.13, 1.02);\n    max-height: 0px;\n    max-width: 0px;\n}\n\n.sm-calender-pane.show {\n    -webkit-transition: all 1s cubic-bezier(0.04, 1.01, 0.13, 1.02);\n    -moz-transition: all 1s cubic-bezier(0.04, 1.01, 0.13, 1.02);\n    -o-transition: all 1s cubic-bezier(0.04, 1.01, 0.13, 1.02);\n    transition: all 1s cubic-bezier(0.04, 1.01, 0.13, 1.02);\n    max-height: 500px;\n    max-width: 450px;\n}\n\n.sm-calender-pane .action {\n    height: 30px;\n    margin-bottom: 0;\n    position: absolute;\n    bottom: 0;\n    width: 100%;\n}\n\n@media only screen and (min-device-width: 0px) and (max-device-width: 960px) {\n    .sm-calender-pane {\n        overflow: hidden;\n    }\n    .sm-calender-pane.hide {\n        -webkit-animation: scaleDownCal 1s cubic-bezier(0.04, 1.01, 0.13, 1.02);\n        -moz-animation: scaleDownCal 1s cubic-bezier(0.04, 1.01, 0.13, 1.02);\n        -o-animation: scaleDownCal 1s cubic-bezier(0.04, 1.01, 0.13, 1.02);\n        animation: scaleDownCal 1s cubic-bezier(0.04, 1.01, 0.13, 1.02);\n    }\n    .sm-calender-pane.show {\n        -webkit-animation: scaleUpCal 1s cubic-bezier(0.04, 1.01, 0.13, 1.02);\n        -moz-animation: scaleUpCal 1s cubic-bezier(0.04, 1.01, 0.13, 1.02);\n        -o-animation: scaleUpCal 1s cubic-bezier(0.04, 1.01, 0.13, 1.02);\n        animation: scaleUpCal 1s cubic-bezier(0.04, 1.01, 0.13, 1.02);\n    }\n    .action {\n        height: 30px;\n        margin-bottom: 0;\n        position: absolute;\n        bottom: 0;\n        width: 100%;\n    }\n}\n\n\n/* \n\tInput container and button postion css\n */\n\n.sm-input-container .sm-picker-icon {\n    position: absolute;\n    top: 0%;\n    left: 93%;\n}\n\n.picker-container {\n    border-radius: 2px;\n}\n\n.picker-container .container {\n    border-radius: 2px;\n    overflow: hidden;\n}\n\n.picker-container .container md-toolbar {\n    word-wrap: break-word;\n}\n\n.picker-container .container md-toolbar.md-height {\n    padding: 20px 0 10px 0;\n}\n\n.picker-container .container md-toolbar.md-height.landscape {\n    width: 130px;\n}\n\n.picker-container .container md-toolbar.md-height.landscape .year-header {\n    margin: 10px;\n    font-size: 16px;\n}\n\n.picker-container .container md-toolbar.md-height.landscape .date-time-header {\n    font-size: 28px;\n    font-weight: bold;\n    text-align: left;\n    margin: 0px 0 15px 10px;\n}\n\n.picker-container .container md-toolbar.md-height {\n    padding: 5px 10px;\n}\n\n.picker-container .container md-toolbar.md-height.portrait {\n    height: 85px;\n}\n\n.picker-container .container md-toolbar.md-height.portrait .year-header {\n    margin: 10px 0;\n    font-size: 16px;\n}\n\n.picker-container .container md-toolbar.md-height.portrait .date-time-header {\n    font-size: 32px;\n    font-weight: bold;\n    text-align: left;\n}\n\n.date-picker {\n    width: 300px;\n    height: 270px;\n}\n\n.date-picker .cal-link {\n    font-size: 0.7em;\n    text-align: center;\n    margin-bottom: 10px;\n}\n\n.date-picker .year-container {\n    width: 300px;\n    animation: slideInDown 1s cubic-bezier(0.06, 0.61, 0.04, 1.03);\n    margin-top: 20px;\n}\n\n.date-picker .year-container .year-md-repeat {\n    height: 245px;\n}\n\n.date-picker .year-container .year-md-repeat .md-virtual-repeat-container {\n    width: 240px;\n    height: 239px;\n}\n\n.date-picker .year-container .year-md-repeat .repeated-item {\n    box-sizing: border-box;\n    height: 70px;\n    margin: 0 10px;\n}\n\n.date-picker .year-container .year-md-repeat .repeated-item .year {\n    margin: 0 10px;\n    display: flex;\n    height: 70px;\n    width: 30px;\n}\n\n.date-picker .year-container .year-md-repeat .repeated-item .year .year-num {\n    outline: none;\n    width: 30px;\n    height: 30px;\n    text-align: center;\n    line-height: 30px;\n    margin: 3px;\n    cursor: pointer;\n}\n\n.date-picker .year-container .year-md-repeat .repeated-item .year .year-num.disabled {\n    pointer-events: none;\n    color: rgba(0, 0, 0, 0.38);\n}\n\n.date-picker .year-container .year-md-repeat .repeated-item .year .month-list .month-row {\n    display: flex;\n    height: 35px;\n    float: right;\n}\n\n.date-picker .year-container .year-md-repeat .repeated-item .year .month-list .month-row .month {\n    outline: none;\n    width: 30px;\n    height: 30px;\n    border-radius: 50%;\n    text-align: center;\n    line-height: 30px;\n    margin: 3px;\n    font-size: 12px;\n    cursor: pointer;\n}\n\n.date-picker .year-container .year-md-repeat .repeated-item .year .month-list .month-row .month:hover {\n    background-color: #E0E0E0;\n}\n\n.date-picker .year-container .year-md-repeat .repeated-item .selected-year {\n    font-size: 18px;\n    color: blue;\n}\n\n.date-picker .date-container .navigation {\n    height: 40px;\n}\n\n.date-picker .date-container .navigation .md-button {\n    text-transform: capitalize;\n    font-weight: bold;\n}\n\n.date-picker .date-container>.date-cell-header {\n    cursor: default;\n}\n\n.date-picker .date-container>.date-cell-header>.md-button.md-icon-button {\n    opacity: 1;\n    margin: 2px 0 2px 2px;\n}\n\n.date-picker .date-container .date-cell-row .md-button.md-icon-button {\n    height: 30px;\n    width: 30px;\n    min-height: 30px;\n    padding: 0px;\n    font-size: 13px;\n}\n\n.date-picker .date-container .date-cell-row .md-button.md-icon-button[disabled] {\n    cursor: default;\n    background-color: transparent;\n}\n\n.date-picker .date-container .date-cell-row .md-button.md-icon-button:hover:not(.disabled):not(.selected) {\n    background-color: #E0E0E0;\n}\n\n.time-picker {\n    width: 300px;\n}\n\n.time-picker .navigation {\n    height: 25px;\n}\n\n.time-picker .navigation .md-button {\n    text-transform: capitalize;\n    font-weight: bold;\n    margin: 0;\n}\n\n.time-picker .time-md-repeat {\n    width: 70px;\n    height: 239px;\n}\n\n.time-picker .time-md-repeat .repeated-item {\n    width: 34px;\n    margin: 0 auto;\n}\n\n.time-picker .time-md-repeat .repeated-item>.md-button {\n    margin: 2px;\n}\n\n.time-picker .time-md-repeat .repeated-item>.md-button.md-icon-button {\n    height: 30px;\n    width: 30px;\n    min-height: 30px;\n    padding: 0px;\n    font-size: 13px;\n}\n\n.md-virtual-repeat-container .md-virtual-repeat-scroller {\n    right: -21px;\n    padding-right: 20px;\n}\n\n.slideLeft {\n    animation: slideInLeft 500ms cubic-bezier(0.06, 0.61, 0.04, 1.03);\n}\n\n.slideRight {\n    animation: slideInRight 500ms cubic-bezier(0.06, 0.61, 0.04, 1.03);\n}\n\n.range-picker {\n    width: 310px;\n    overflow-x: hidden;\n    background-color: #fff;\n}\n\n.range-picker .md-toolbar-tools {\n    font-size: calc(13px + 2);\n}\n\n.range-picker .md-toolbar-tools .date-display {\n    width: 130px;\n    padding: 2px;\n    text-align: center;\n}\n\n.range-picker .md-toolbar-tools .divider-display {\n    width: 20px;\n    font-size: 13px;\n    padding: 2px;\n}\n\n.range-picker .pre-select {\n    height: 307px;\n}\n\n.range-picker .pre-select .md-button {\n    padding: 3px;\n    margin: 0;\n}\n\n.range-picker .custom-select.show-calender>.tab-head {\n    height: 43px;\n    text-align: center;\n    line-height: 35px;\n}\n\n.range-picker .custom-select.show-calender>.tab-head .start-btn {\n    width: 50%;\n    text-decoration: inherit;\n    color: inherit;\n}\n\n.range-picker .custom-select.show-calender>.tab-head .start-btn>span {\n    color: inherit;\n}\n\n.range-picker .custom-select.show-calender>.tab-head span {\n    color: #ccc1c1;\n    width: 50%;\n}\n\n.range-picker .custom-select.show-calender>.tab-head span.active {\n    animation-property: border-bottom;\n    color: inherit;\n    border-bottom: 2px solid #FF5252;\n}\n\n.range-picker .custom-select.show-calender>.tab-head span.active.moveLeft {\n    animation: slideInLeft 1s cubic-bezier(0.06, 0.61, 0.04, 1.03);\n}\n\n.range-picker .custom-select.show-calender>.tab-head span.active.moveRight {\n    animation: slideInRight 1s cubic-bezier(0.06, 0.61, 0.04, 1.03);\n}\n\n@keyframes slideInLeft {\n    from {\n        transform: translate3d(-100%, 0, 0);\n        visibility: visible;\n    }\n    100% {\n        transform: translate3d(0, 0, 0);\n    }\n}\n\n.slideInLeft {\n    animation-name: slideInLeft;\n}\n\n@keyframes slideInRight {\n    from {\n        transform: translate3d(100%, 0, 0);\n        visibility: visible;\n    }\n    100% {\n        transform: translate3d(0, 0, 0);\n    }\n}\n\n.slideInRight {\n    animation-name: slideInRight;\n}\n\n@keyframes slideInUp {\n    from {\n        transform: translate3d(0, 100%, 0);\n        visibility: visible;\n    }\n    100% {\n        transform: translate3d(0, 0, 0);\n    }\n}\n\n.slideInUp {\n    animation-name: slideInUp;\n}\n\n@keyframes slideInDown {\n    from {\n        transform: translate3d(0, -100%, 0);\n        visibility: visible;\n    }\n    100% {\n        transform: translate3d(0, 0, 0);\n    }\n}\n\n.slideInDown {\n    animation-name: slideInDown;\n}\n\n@-webkit-keyframes scaleUpCal {\n    0% {\n        -ms-transform: scale(0.5, 0.5);\n        /* IE 9 */\n        -webkit-transform: scale(0.5, 0.5);\n        /* Safari */\n        transform: scale(0.5, 0.5);\n    }\n    100% {\n        -ms-transform: scale(1, 1);\n        /* IE 9 */\n        -webkit-transform: scale(1, 1);\n        /* Safari */\n        transform: scale(1, 1);\n    }\n}\n\n\n/* Standard syntax */\n\n@keyframes scaleUpCal {\n    0% {\n        -ms-transform: scale(0.5, 0.5);\n        /* IE 9 */\n        -webkit-transform: scale(0.5, 0.5);\n        /* Safari */\n        transform: scale(0.5, 0.5);\n    }\n    100% {\n        -ms-transform: scale(1, 1);\n        /* IE 9 */\n        -webkit-transform: scale(1, 1);\n        /* Safari */\n        transform: scale(1, 1);\n    }\n}\n\n@-webkit-keyframes scaleDownCal {\n    0% {\n        -ms-transform: scale(1, 1);\n        /* IE 9 */\n        -webkit-transform: scale(1, 1);\n        /* Safari */\n        transform: scale(1, 1);\n    }\n    100% {\n        -ms-transform: scale(0.5, 0.5);\n        /* IE 9 */\n        -webkit-transform: scale(0.5, 0.5);\n        /* Safari */\n        transform: scale(0.5, 0.5);\n    }\n}\n\n\n/* Standard syntax */\n\n@keyframes scaleDownCal {\n    0% {\n        -ms-transform: scale(1, 1);\n        /* IE 9 */\n        -webkit-transform: scale(1, 1);\n        /* Safari */\n        transform: scale(1, 1);\n    }\n    100% {\n        -ms-transform: scale(0.5, 0.5);\n        /* IE 9 */\n        -webkit-transform: scale(0.5, 0.5);\n        /* Safari */\n        transform: scale(0.5, 0.5);\n    }\n}\n\n@-webkit-keyframes moveUp {\n    0% {\n        -ms-transform: top;\n        /* IE 9 */\n        -webkit-transform: top;\n        /* Safari */\n        transform: top;\n    }\n    100% {\n        -ms-transform: top;\n        /* IE 9 */\n        -webkit-transform: top;\n        /* Safari */\n        transform: top;\n    }\n}\n\n\n/* Standard syntax */\n\n@keyframes moveUp {\n    0% {\n        -ms-transform: top;\n        /* IE 9 */\n        -webkit-transform: top;\n        /* Safari */\n        transform: top;\n    }\n    100% {\n        -ms-transform: top;\n        /* IE 9 */\n        -webkit-transform: top;\n        /* Safari */\n        transform: top;\n    }\n}", ""]);

	// exports


/***/ }),
/* 88 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = rest;
	// Use RxJS in a Service

	// What about in a situation where you have a Service that's holding state for example. How could I push changes to that Service, and other random components on the page be aware of such a change? Been struggling with tackling this problem lately
	// Build a service with RxJS Extensions for Angular.

	// <script src="//unpkg.com/angular/angular.js"></script>
	// <script src="//unpkg.com/rx/dist/rx.all.js"></script>
	// <script src="//unpkg.com/rx-angular/dist/rx.angular.js"></script>
	// var app = angular.module('myApp', ['rx']);

	// app.factory("DataService", function(rx) {
	//   var subject = new rx.Subject(); 
	//   var data = "Initial";

	//   return {
	//       set: function set(d){
	//         data = d;
	//         subject.onNext(d);
	//       },
	//       get: function get() {
	//         return data;
	//       },
	//       subscribe: function (o) {
	//          return subject.subscribe(o);
	//       }
	//   };
	// });
	// Then simply subscribe to the changes.

	// app.controller('displayCtrl', function(DataService) {
	//   var $ctrl = this;

	//   $ctrl.data = DataService.get();
	//   var subscription = DataService.subscribe(function onNext(d) {
	//       $ctrl.data = d;
	//   });

	//   this.$onDestroy = function() {
	//       subscription.dispose();
	//   };
	// });

	/**
	 * 
	 * 
	 * @class api
	 * @memberOf abl-sdk-feathers.$abl
	 * @hidden
	 */
	function rest(app, $http) {
	    var that = {};
	    var Rx = window.Rx;
	    var moment = window.moment;

	    app.api = {};
	    /**
	     * @class activity
	     * @memberOf abl-sdk-feathers.$abl.api
	     * @hidden
	     */
	    app.api.activity = {
	        /**
	         * @function get
	         * @memberOf abl-sdk-feathers.$abl.api.activity
	         */
	        get: function get(query) {
	            return Rx.Observable.fromPromise(activityService.find(query || {})).catch(function (response) {
	                console.log('$abl.api.GET ERROR', response);
	                return Rx.Observable.empty();
	            }).select(function (response) {
	                return response.list;
	            });
	        },
	        /**
	         * @function find
	         * @memberOf abl-sdk-feathers.$abl.api.activity
	         */
	        find: function find(query) {
	            return Rx.Observable.fromPromise(activitySearchService.find(query || {})).catch(function (response) {
	                console.log('$abl.api.activity.FIND ERROR', response);
	                return Rx.Observable.empty();
	            }).select(function (response) {
	                return response;
	            });
	        }

	        /**
	         * @class timeslots
	         * @memberOf abl-sdk-feathers.$abl.api
	         * @hidden
	         */
	    };app.api.timeslots = {
	        /**
	         * @function getRange
	         * @memberOf abl-sdk-feathers.$abl.api.timeslots
	         */
	        getRange: function getRange(d) {
	            return Rx.Observable.fromPromise($http({
	                method: 'GET',
	                url: app.endpoint + '/timeslots?',
	                data: d,
	                headers: app.headers
	            })).catch(function (response) {
	                console.log('$abl.api.timeslots.GETRANGE ERROR', response);
	                return Rx.Observable.empty();
	            }).select(function (response) {
	                console.log('$abl.api.timeslots.GETRANGE SUCCESS', response);
	                return response.data.list;
	            });
	        },
	        /**
	         * @function get
	         * @memberOf abl-sdk-feathers.$abl.api.timeslots
	         */
	        get: function get(id) {
	            return Rx.Observable.fromPromise($http({
	                method: 'GET',
	                url: app.endpoint + '/timeslots?id=' + id,
	                headers: app.headers

	            })).catch(function (response) {
	                console.log('$abl.api.timeslots.GET ERROR', response);
	                return Rx.Observable.empty();
	            }).select(function (response) {
	                console.log('$abl.api.timeslots.GET SUCCESS', response);
	                return response;
	            });
	        }

	        //Feathers REST endpoints
	    };var activityService = app.service('activities');
	    var eventService = app.service('events');
	    var timeslotService = app.service('timeslots');

	    var activitySearchService = app.service('search');

	    // activitySearchService.find({
	    //     query: {
	    //         "sort": "-updatedAt"
	    //     }
	    // });

	    app.activitySearchInterval = function (t) {
	        return setInterval(function () {
	            activitySearchService.find({
	                query: {
	                    "sort": "-updatedAt"
	                }
	            });
	        }, t);
	    };

	    //Feathers localstorage cache service
	    /**
	     * @class cache
	     * @memberOf abl-sdk-feathers.$abl
	     * @description localstorage cache wrapped in a Feathers.js service.
	     * @example   <caption>Open or Create</caption>      
	     * $abl.cache.get('activities').then(function (res) {
	     *   console.log(res);
	     *}).catch(res => {
	     *    $abl.cache.create({
	     *       id: 'activities',
	     *      data: {},
	     *      map: []
	     *  });
	     *});
	     * @hidden
	     */
	    var cache = app.service('cache');
	    var max = 500;
	    var cacheQuery = {
	        page: 0,
	        pageSize: 20,
	        total: 0,
	        "sort": "-updatedAt"
	    };

	    cache.get('activities').then(function (res) {
	        console.log(res);
	    }).catch(function (res) {
	        cache.create({
	            id: 'activities',
	            data: {},
	            map: []
	        });
	    });

	    var updateCache = function updateCache(store) {
	        // always wrap in a function so you can pass options and for consistency.
	        return function (hook) {
	            var modified = false;

	            cache.get('activities').then(function (activities) {
	                activities.updated = [];

	                var acs = Rx.Observable.fromArray(hook.result.data);
	                acs.map(function (res) {
	                    return res;
	                }).filter(function (res) {
	                    return activities.data[res._id] == undefined;
	                }).subscribe(function (x) {
	                    modified = true;
	                    activities.data[x._id] = x;
	                    activities.map.push(x._id);
	                    activities.updated.push(x._id);
	                    // console.log('creating activity', x);
	                }, function (err) {
	                    return Promise.resolve(hook); // A good convention is to always return a promise.
	                }, function () {
	                    if (modified) {
	                        console.log('updateCache', store, activities);
	                        if (activities.map.length > max) {
	                            for (var i = 0; i < activities.map.length - max; i++) {
	                                delete activities.data[activities.map[i]];
	                                console.log('deleting activity', activities.data[activities.map[0]]);
	                            }
	                            // activities.map.fill('', 0, activities.map.length - max);
	                        }
	                        activities.total = hook.result.total;
	                        cache.update('activities', activities).then(function () {
	                            console.log('updateCache', store, hook);

	                            return Promise.resolve(hook); // A good convention is to always return a promise.
	                        });
	                    }
	                });
	            });
	        };
	    };

	    function getObjectIndex(id, arr) {
	        for (var i = 0; i < arr.length - 1; i++) {
	            if (arr[i].id == id) return i;
	        }
	        return -1;
	    }

	    // Set up our after hook to cache new data
	    activitySearchService.after({
	        all: [], // run hooks for all service methods
	        find: [updateCache()] // run hook after a find. You can chain multiple hooks.
	    });

	    app.cache = cache;
	    return app;
	}

/***/ }),
/* 89 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = toUppercase;
	/**
	 * @function toUppercase
	 * @memberOf abl-sdk-feathers.directives
	 * @description Transforms input text to all uppercase characters.
	 * @example   <input type="text" ng-model="name" to-uppercase>
	 */
	function toUppercase() {
	    return {
	        require: 'ngModel',
	        link: function link(scope, element, attrs, modelCtrl) {
	            var capitalize = function capitalize(inputValue) {
	                if (inputValue == undefined) inputValue = '';
	                var capitalized = inputValue.toUpperCase();
	                if (capitalized !== inputValue) {
	                    modelCtrl.$setViewValue(capitalized);
	                    modelCtrl.$render();
	                }
	                return capitalized;
	            };

	            modelCtrl.$parsers.push(capitalize);
	            capitalize(scope[attrs.ngModel]); // capitalize initial value
	        }
	    };
	}

/***/ }),
/* 90 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = formatPhone;
	/**
	 * @class abl-sdk-feathers.directives
	 * @hidden
	 */

	/**
	 * @function formatPhone
	 * @memberOf abl-sdk-feathers.directives
	 * @description Formats a phone number nicely.
	 * @example <input type="text" id="phonenumber" ng-model="phonenumber" format-phone>
	 */
	function formatPhone() {
	    return {
	        require: 'ngModel',
	        restrict: 'A',
	        link: function link(scope, elem, attrs, ctrl, ngModel) {
	            elem.add(phonenumber).on('keyup', function () {
	                var origVal = elem.val().replace(/[^\w\s]/gi, '');
	                if (origVal.length === 10) {
	                    var str = origVal.replace(/(.{3})/g, "$1-");
	                    var phone = str.slice(0, -2) + str.slice(-1);
	                    jQuery("#phonenumber").val(phone);
	                }
	            });
	            console.log('format-phone', scope);
	        }
	    };
	}

/***/ }),
/* 91 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = focusParent;
	/**
	 * @function toUppercase
	 * @memberOf abl-sdk-feathers.directives
	 * @description Transforms input text to all uppercase characters.
	 * @example   <input type="text" ng-model="name" to-uppercase>
	 */
	function focusParent() {
	    return {
	        require: 'ngModel',
	        link: function link(scope, element, attrs, modelCtrl) {
	            console.log(element);
	            console.log(attrs);

	            var elem = $(element[0].parentElement);
	            element.on('focus', function () {
	                console.log(elem);
	                elem.addClass(attrs.onFocus);
	            });

	            element.on('blur', function () {
	                elem.removeClass(attrs.onFocus);
	            });
	            //modelCtrl.$parsers.push(capitalize);
	            //capitalize(scope[attrs.ngModel]); // capitalize initial value
	        }
	    };
	}

/***/ }),
/* 92 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = size;
	function size() {
	    return {
	        link: function link(scope, element, attrs, modelCtrl) {
	            console.log(element);
	            console.log(attrs);

	            if (attrs.size) {
	                var elem = $(element[0].children[0]);
	                elem.addClass(attrs.size);
	            }
	        }
	    };
	}

/***/ }),
/* 93 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = navigatorService;
	/**
	 * @class abl-sdk-feathers.services
	 * @hidden
	 */

	navigatorService.$inject = ["$window", "$q"];
	/**
	 * @function navigatorService
	 * @memberOf abl-sdk-feathers.services
	 * @description Requests the user's geographic coordinates using the {@link https://developer.mozilla.org/en/docs/Web/API/Navigator | Navigator Web API}.
	 * @example    navigatorService.getCurrentPosition().then(function(position) {
	 *     console.log(position);
	 *   }).catch(function(e) {
	 * });
	 * @tutorial navigator
	 * @returns {Promise} A Promise object from the {@link https://developer.mozilla.org/en/docs/Web/API/Navigator | Navigator Web API}.
	 */
	function navigatorService($window, $q) {

	    function getCurrentPosition() {
	        var deferred = $q.defer();

	        if (!$window.navigator.geolocation) {
	            deferred.reject('Geolocation not supported.');
	        } else {
	            $window.navigator.geolocation.getCurrentPosition(function (position) {
	                deferred.resolve(position);
	            }, function (err) {
	                deferred.reject();
	            });
	        }

	        return deferred.promise;
	    }

	    return {
	        getCurrentPosition: getCurrentPosition
	    };
	}

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _column = __webpack_require__(95);

	var _column2 = _interopRequireDefault(_column);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var col = {
	    bindings: {
	        pos: '@',
	        size: '@'
	    },
	    controller: function controller($element, $scope) {
	        this.$onInit = function () {
	            //  console.log('col', this);
	            if (!this.pos) this.position = 'start center';
	            if (this.pos == 'right') this.position = 'end center';else this.position = this.pos;
	        };

	        this.$onChanges = function (changesObj) {};
	        this.$postLink = function () {};
	    },
	    template: _column2.default,
	    transclude: true,
	    controllerAs: 'vm'
	};

	exports.default = col;

/***/ }),
/* 95 */
/***/ (function(module, exports) {

	module.exports = "<div layout=\"row\" layout-align=\"{{vm.position}}\" ng-transclude></div>";

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _progressButton = __webpack_require__(97);

	var _progressButton2 = _interopRequireDefault(_progressButton);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var progressButton = {
	    bindings: {
	        loading: '<',
	        class: '@',
	        ngDisabled: '<',
	        spinner: '<',
	        stroke: '@',
	        fill: '@',
	        label: '@'
	    },
	    controller: function controller($element, $scope) {
	        var _this = this;

	        this.$onInit = function () {
	            if (this.loading) console.log('progressButton:loading', this.loading);

	            console.log('progressButton disabled', this.ngDisabled);
	        };

	        this.$onChanges = function (changesObj) {
	            console.log('progressButton changes ', changesObj);
	            _this.disabled = _this.ngDisabled;
	        };

	        this.$postLink = function () {};
	    },
	    template: _progressButton2.default,
	    transclude: true,
	    controllerAs: 'vm'
	};

	exports.default = progressButton;

/***/ }),
/* 97 */
/***/ (function(module, exports) {

	module.exports = "<md-button layout=\"row\" layout-align=\"center center\" class=\"{{vm.class}}\" ng-disabled=\"vm.loading || vm.disabled\">\n    <div layout=\"row\" layout-align=\"center center\">\n        <svg ng-show=\"vm.loading && vm.spinner == 1\" version=\"1.1\" id=\"loader-1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n            x=\"0px\" y=\"0px\" width=\"24px\" height=\"24px\" viewBox=\"0 0 50 50\" style=\"enable-background:new 0 0 50 50;\" xml:space=\"preserve\">\n            <path fill=\"{{vm.fill || '#fff'}}\" stroke=\"{{vm.stroke || ''}}\" d=\"M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z\">\n                <animateTransform attributeType=\"xml\" attributeName=\"transform\" type=\"rotate\" from=\"0 25 25\" to=\"360 25 25\" dur=\"0.6s\" repeatCount=\"indefinite\"\n                />\n            </path>\n        </svg>\n\n        <svg ng-show=\"vm.loading && vm.spinner == 2\" version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n            x=\"0px\" y=\"0px\" width=\"24px\" height=\"30px\" viewBox=\"0 0 24 30\" style=\"enable-background:new 0 0 50 50;\" xml:space=\"preserve\">\n            <rect x=\"0\" y=\"0\" width=\"4\" height=\"10\" fill=\"{{vm.fill || '#fff'}}\" stroke=\"{{vm.stroke || ''}}\">\n                <animateTransform attributeType=\"xml\" attributeName=\"transform\" type=\"translate\" values=\"0 0; 0 20; 0 0\" begin=\"0\" dur=\"0.6s\"\n                    repeatCount=\"indefinite\" />\n            </rect>\n            <rect x=\"10\" y=\"0\" width=\"4\" height=\"10\" fill=\"{{vm.fill || '#fff'}}\" stroke=\"{{vm.stroke || ''}}\">\n                <animateTransform attributeType=\"xml\" attributeName=\"transform\" type=\"translate\" values=\"0 0; 0 20; 0 0\" begin=\"0.2s\" dur=\"0.6s\"\n                    repeatCount=\"indefinite\" />\n            </rect>\n            <rect x=\"20\" y=\"0\" width=\"4\" height=\"10\" fill=\"{{vm.fill || '#fff'}}\" stroke=\"{{vm.stroke || ''}}\">\n                <animateTransform attributeType=\"xml\" attributeName=\"transform\" type=\"translate\" values=\"0 0; 0 20; 0 0\" begin=\"0.4s\" dur=\"0.6s\"\n                    repeatCount=\"indefinite\" />\n            </rect>\n        </svg>\n\n        <svg ng-show=\"vm.loading && vm.spinner == 3\" version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n            x=\"0px\" y=\"0px\" width=\"24px\" height=\"30px\" viewBox=\"0 0 24 30\" style=\"enable-background:new 0 0 50 50;\" xml:space=\"preserve\">\n            <rect x=\"0\" y=\"10\" width=\"4\" height=\"10\" fill=\"{{vm.fill || '#fff'}}\" stroke=\"{{vm.stroke || ''}}\" opacity=\"0.2\">\n                <animate attributeName=\"opacity\" attributeType=\"XML\" values=\"0.2; 1; .2\" begin=\"0s\" dur=\"0.6s\" repeatCount=\"indefinite\" />\n                <animate attributeName=\"height\" attributeType=\"XML\" values=\"10; 20; 10\" begin=\"0s\" dur=\"0.6s\" repeatCount=\"indefinite\" />\n                <animate attributeName=\"y\" attributeType=\"XML\" values=\"10; 5; 10\" begin=\"0s\" dur=\"0.6s\" repeatCount=\"indefinite\" />\n            </rect>\n            <rect x=\"8\" y=\"10\" width=\"4\" height=\"10\" fill=\"{{vm.fill || '#fff'}}\" stroke=\"{{vm.stroke || ''}}\" opacity=\"0.2\">\n                <animate attributeName=\"opacity\" attributeType=\"XML\" values=\"0.2; 1; .2\" begin=\"0.15s\" dur=\"0.6s\" repeatCount=\"indefinite\"\n                />\n                <animate attributeName=\"height\" attributeType=\"XML\" values=\"10; 20; 10\" begin=\"0.15s\" dur=\"0.6s\" repeatCount=\"indefinite\"\n                />\n                <animate attributeName=\"y\" attributeType=\"XML\" values=\"10; 5; 10\" begin=\"0.15s\" dur=\"0.6s\" repeatCount=\"indefinite\" />\n            </rect>\n            <rect x=\"16\" y=\"10\" width=\"4\" height=\"10\" fill=\"{{vm.fill || '#fff'}}\" stroke=\"{{vm.stroke || ''}}\" opacity=\"0.2\">\n                <animate attributeName=\"opacity\" attributeType=\"XML\" values=\"0.2; 1; .2\" begin=\"0.3s\" dur=\"0.6s\" repeatCount=\"indefinite\"\n                />\n                <animate attributeName=\"height\" attributeType=\"XML\" values=\"10; 20; 10\" begin=\"0.3s\" dur=\"0.6s\" repeatCount=\"indefinite\"\n                />\n                <animate attributeName=\"y\" attributeType=\"XML\" values=\"10; 5; 10\" begin=\"0.3s\" dur=\"0.6s\" repeatCount=\"indefinite\" />\n            </rect>\n        </svg>\n\n\n    </div>\n    <span ng-show=\"!vm.loading\">{{vm.label}}</span>\n</md-button>";

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(99);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(82)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(99, function() {
				var newContent = __webpack_require__(99);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(81)(undefined);
	// imports


	// module
	exports.push([module.id, "progress-button {\n    outline: none;\n    margin: 0px 0px !important;\n    pointer-events: auto;\n    cursor: pointer;\n}\n\nprogress-button md-button {\n    pointer-events: auto;\n}", ""]);

	// exports


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _listItem = __webpack_require__(101);

	var _listItem2 = _interopRequireDefault(_listItem);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var listItem = {
	    bindings: {
	        size: '@'
	    },
	    controller: function controller($element, $scope) {
	        this.$onInit = function () {};

	        this.$onChanges = function (changesObj) {};
	        this.$postLink = function () {};
	    },
	    template: _listItem2.default,
	    transclude: true,
	    controllerAs: 'vm'
	};

	exports.default = listItem;

/***/ }),
/* 101 */
/***/ (function(module, exports) {

	module.exports = "<div layout=\"row\" class=\"listItem\" ng-class=\"[vm.size]\" flex=\"100\" ng-transclude>\n</div>";

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _listItemNumericControl = __webpack_require__(103);

	var _listItemNumericControl2 = _interopRequireDefault(_listItemNumericControl);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// import controller from './goatListItem.controller';  
	// import './goatListItem.scss';
	/**
	 * @function li-NumberControl
	 * @memberOf abl-sdk-feathers.components
	 * @description List item control with +/- buttons and input to modify the value.
	 * @example  <list-item-numeric-control label="Attendee" value="numValue" min="1" max="5"></list-item-numeric-control>
	 */
	var listItemNumericControl = {
	    restrict: 'E',
	    bindings: {
	        value: '=',
	        label: '@',
	        price: '@',
	        max: '@',
	        min: '@ ',
	        size: '@'
	    },
	    template: _listItemNumericControl2.default,
	    controller: function controller($element) {
	        var _this = this;

	        this.min = 0;

	        this.$onInit = function () {
	            this.elem = $($element[0].children[0]);

	            // console.log('listItemNumericController!', this);
	        };

	        this.$onChanges = function (changesObj) {};
	        this.$postLink = function () {};

	        this.increment = function () {
	            if (this.max == undefined || this.max > this.value) this.value++;
	            // console.log('increment');
	        };

	        this.decrement = function () {
	            if (this.value > this.min) this.value--;
	            console.log('decrementer');
	        };

	        this.checkAdjustValue = function () {
	            if (_this.value > _this.max) {
	                _this.value = _this.max;
	            }
	            if (_this.value < _this.min) _this.value = _this.min;
	        };
	    },
	    controllerAs: 'vm'
	};

	exports.default = listItemNumericControl;

/***/ }),
/* 103 */
/***/ (function(module, exports) {

	module.exports = "<div layout=\"row\" class=\"listItem\" ng-class=\"[vm.size]\" flex=\"100\">\n    <div layout=\"row\" layout-align=\"start center\" flex>\n        <div layout=\"column\" class=\"\">\n            <span class=\"lineItemSubHeader\">{{vm.label}}</span>\n            <div layout=\"row\">\n                <span class=\"lineItemSubDetail\">${{vm.price / 100  | number:2}}</span>\n            </div>\n        </div>\n    </div>\n\n    <div layout=\"row\" layout-align=\"end center\">\n        <div layout=\"column\" class=\"addOnAdjusters\" layout-align=\"center end\" flex layout-grow>\n            <ng-md-icon icon=\"add_circle_outline\" class=\"listIconSub\" md-colors=\"{'fill': 'primary-A200'}\" ng-click=\"vm.increment();\">\n            </ng-md-icon>\n            <ng-md-icon icon=\" remove_circle_outline\" class=\"listIconSub\" ng-click=\"vm.decrement();\"></ng-md-icon>\n        </div>\n        <div layout=\"column\" layout-align=\"end end\">\n            <input class='addOnQuantityText' ng-model=\"vm.value\" ng-change=\"vm.checkAdjustValue();\" md-select-on-focus></input>\n        </div>\n    </div>\n</div>";

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _listItemAddCharge = __webpack_require__(105);

	var _listItemAddCharge2 = _interopRequireDefault(_listItemAddCharge);

	__webpack_require__(106);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @class abl-sdk-feathers.components
	 * @hidden
	 */

	/**
	 * @function li-AddCharge
	 * @memberOf abl-sdk-feathers.components
	 * @description List item to enter a new charge with value.
	 * @example  <list-item-add-charge group="vm.charges"></list-item-add-charge>
	 */
	var listItemAddCharge = {
	    bindings: {
	        add: '<',
	        group: '=',
	        buttonClass: '@'
	    },
	    template: _listItemAddCharge2.default,
	    controller: function controller($scope) {
	        this.price = 0;
	        this.$onInit = function () {};

	        this.$onChanges = function (changesObj) {};
	        this.$postLink = function () {};
	    },
	    controllerAs: 'vm'
	};
	// import controller from './goatListItem.controller';  
	exports.default = listItemAddCharge;

/***/ }),
/* 105 */
/***/ (function(module, exports) {

	module.exports = "<md-list-item class=\"addOnListItem\">\n    <div layout=\"row\" layout-align=\"start center\" flex>\n        <md-input-container class=\"buttonInlineInput full-width \">\n            <label>Name</label>\n\n            <input class='buttonInlineInput' ng-model=\"vm.label\"></input>\n        </md-input-container>\n\n    </div>\n\n    <div layout=\"row\" layout-align=\"end center\" flex=\"20\">\n        <md-input-container class=\"buttonInlineInput full-width\">\n            <label>Price</label>\n\n            <input class='full-width buttonInlineInput' md-select-on-focus ng-model=\"vm.price\" type=\"number\" min=\"0\" step=\"0.01\"></input>\n        </md-input-container>\n    </div>\n    <div layout=\"row\">\n        <md-button ng-disabled=\"!vm.label || !vm.price\" ng-class=\"[vm.buttonClass.length > 0 ? vm.buttonClass : 'md-raised']\" ng-click=\"vm.add(vm.label, vm.price)\">\n            Add\n        </md-button>\n    </div>\n\n</md-list-item>";

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(107);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(82)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(107, function() {
				var newContent = __webpack_require__(107);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(81)(undefined);
	// imports


	// module
	exports.push([module.id, ".full-width {\n    width: 100%;\n}\n\n.text-align-left {\n    text-align: left !important;\n}\n\ncol-section {\n    width: 100%;\n}\n\n.listItem {\n    height: 72px;\n    padding: 0 16px;\n    line-height: 72px;\n    outline: none;\n    border: none;\n    box-shadow: 0 1px 0 0 rgba(0, 0, 0, .05)\n}\n\n.listItem md-checkbox .md-container {\n    height: 4px;\n}\n\n.listItem.md {\n    height: 56px;\n    padding: 0 16px;\n    line-height: 56px;\n    outline: none;\n    border: none;\n    box-shadow: 0 1px 0 0 rgba(0, 0, 0, .05);\n}\n\n.listItem.sm {\n    height: 36px;\n    min-height: 36px;\n    padding: 0 16px;\n    line-height: 36px;\n    font-size: 12px;\n    outline: none;\n    border: none;\n    box-shadow: 0 1px 0 0 rgba(0, 0, 0, .05);\n}\n\n.listItem md-autocomplete input:not(.md-input) {\n    height: 100% !important;\n    line-height: 100% !important;\n    padding: 0;\n}\n\n.listItem md-autocomplete md-autocomplete-wrap {\n    box-shadow: none !important;\n    height: 100% !important;\n}\n\n.listItem md-autocomplete {\n    padding: 0 !important;\n    width: 100% !important;\n}\n\n.listItemAutoCompleteAfterContainer {\n    margin-top: -20px !important;\n}\n\n.listItemFocus {\n    box-shadow: 0 1px 0 rgba(255, 152, 0, 0.4), 0 -1px 0 rgba(255, 152, 0, 0.4), inset 0px 1px 4px rgba(255, 152, 0, 0.2), inset 0px -1px 4px rgba(255, 152, 0, 0.2) !important;\n    background: white;\n}\n\ninput.buttonInlineInput {\n    /* margin: 0px -16px;*/\n    padding: 0 0 0 0;\n    border-width: 0;\n    -ms-flex-preferred-size: 36px;\n    font-size: inherit;\n    width: 100%;\n    border: none;\n    outline: none;\n    box-sizing: border-box;\n    float: left;\n    background: transparent;\n}\n\nng-md-icon.listItemHeaderIcon {\n    margin: auto 16px auto 0;\n}\n\nng-md-icon.listItemHeaderIcon.md,\nng-md-icon.listItemHeaderIcon.md svg {\n    margin: auto 12px auto 0;\n    height: 20px;\n    width: 20px;\n}\n\nng-md-icon.listItemHeaderIcon.sm,\nng-md-icon.listItemHeaderIcon.sm svg {\n    margin: auto 8px auto 0;\n    height: 16px;\n    width: 16px;\n}\n\n.buttonInlineInput:focus {\n    /* box-shadow: inset 0px 1px 3px rgba(33, 33, 33, 0.3), inset 0px -1px 3px rgba(33, 33, 33, 0.3); */\n}\n\n.listItemGreyFocus {\n    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.28), 0 -1px 0 rgba(0, 0, 0, 0.28), inset 0px 1px 4px rgba(0, 0, 0, 0.16), inset 1px -1px 4px rgba(0, 0, 0, 0.2) !important;\n}\n\n.listItemGreyFocus input,\ntextarea {\n    color: rgb(63, 81, 181);\n}\n\n.listItemGreyFocus ng-md-icon.listItemHeaderIcon {\n    fill: rgb(63, 81, 181);\n}\n\n.listItemFocusBottomBorder {\n    box-shadow: 0px 2px 0 rgba(57, 73, 171, .92), inset 0 -1px 3px rgba(57, 73, 171, .2), inset 0 1px rgba(0, 0, 0, .1) !important;\n}\n\n.listItemFocusBottomBorder input,\ntextarea {\n    color: rgb(63, 81, 181);\n}\n\nmd-input-container.buttonInlineInput {\n    display: inline-block;\n    position: relative;\n    height: 36px;\n    padding: 5px;\n    margin: 0;\n    vertical-align: middle;\n}\n\n.listItemPadding {\n    padding: 0 16px;\n}\n\n.listItem.listItemHeader {\n    font-size: 16px;\n    margin: 0;\n    font-weight: 500;\n    cursor: unset;\n    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.33), 0 1px 0px rgba(0, 0, 0, 0.16), 0 -1px 0px rgba(0, 0, 0, 0.16);\n    background-color: #f3f3f3;\n}\n\n.listItem.sm.listItemHeader {\n    font-size: 12px;\n    margin: 0;\n    font-weight: 500;\n    cursor: unset;\n    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.16), 0 1px 0px rgba(0, 0, 0, 0.16), 0 -1px 0px rgba(0, 0, 0, 0.16);\n    background-color: #f3f3f3;\n}\n\n.lineItemSubHeader {\n    font-size: 14px;\n    font-weight: 400;\n    padding: 0 16px 0 0;\n    line-height: 1.6em;\n    overflow: hidden;\n    white-space: nowrap;\n    text-overflow: ellipsis;\n    color: rgba(0, 0, 0, 0.92) !important;\n}\n\n.listItemHeaderIcon {\n    margin-right: 16px;\n}\n\n.autocomplete-custom-template li {\n    border-bottom: 1px solid #ccc;\n    height: auto;\n    padding-top: 8px;\n    padding-bottom: 8px;\n    white-space: normal;\n}\n\n.autocomplete-custom-template li:last-child {\n    border-bottom-width: 0;\n}\n\n.autocomplete-custom-template .item-title {\n    font-weight: 600;\n}\n\n.autocomplete-custom-template .item-title,\n.autocomplete-custom-template .item-metadata {\n    display: block;\n    line-height: 2;\n}\n\n.autocomplete-custom-template .item-title md-icon {\n    height: 18px;\n    width: 18px;\n}", ""]);

	// exports


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _listItemHeader = __webpack_require__(109);

	var _listItemHeader2 = _interopRequireDefault(_listItemHeader);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// import controller from './goatListItem.controller';  

	var listItemHeader = {
	    bindings: {
	        collapsed: '<',
	        title: '@',
	        icon: '@',
	        size: '@'
	    },
	    template: _listItemHeader2.default,
	    controller: function controller() {

	        this.$onInit = function () {
	            if (!this.collapsed) this.collapsed = false;
	        };

	        this.$onChanges = function (changesObj) {};
	        this.$postLink = function () {};
	    },
	    controllerAs: 'vm'
	};

	exports.default = listItemHeader;

/***/ }),
/* 109 */
/***/ (function(module, exports) {

	module.exports = "<div class=\"listItem listItemHeader\" ng-class=\"[vm.size]\" ng-disabled=\"!vm.expanded.length\" ng-click=\"vm.toggle()\">\n    <div layout=\"row\" flex>\n        <div layout=\"row\" layout-align=\"start center\" flex=\"80\">\n            <div layout=\"column\">\n                <div layout=\"row\" layout-align=\"start center\" flex=\"50\">\n                    <ng-md-icon ng-if=\"vm.icon\" class=\"headerIcon\" icon=\"{{vm.icon}}\" class=\"listIcon\"></ng-md-icon>\n                    <span class=\"listItemHeader\">{{vm.title}}</span>\n                </div>\n            </div>\n        </div>\n\n        <div layout=\"row\" layout-align=\"end center\" flex=\"20\">\n            <div layout=\"column\" layout-align=\"center end\" ng-if=\"vm.collapsed.length\" flex>\n                <ng-md-icon icon=\"{{vm.expanded ? 'expand_less' : 'expand_more'}}\" class=\"listIcon\"></ng-md-icon>\n            </div>\n        </div>\n    </div>\n</div>";

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	__webpack_require__(111);

	var _activityTotal = __webpack_require__(113);

	var _activityTotal2 = _interopRequireDefault(_activityTotal);

	var _activityForms = __webpack_require__(114);

	var _activityForms2 = _interopRequireDefault(_activityForms);

	var _activityBook = __webpack_require__(115);

	var _activityBook2 = _interopRequireDefault(_activityBook);

	var _activityBookValidators = __webpack_require__(116);

	var _activityBookValidators2 = _interopRequireDefault(_activityBookValidators);

	var _activityAdjustmentControlsComponent = __webpack_require__(117);

	var _activityAdjustmentControlsComponent2 = _interopRequireDefault(_activityAdjustmentControlsComponent);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @namespace activity-book
	 */
	exports.default = angular.module('activity-book', ['ngMaterial', 'rx']).run(["$templateCache", function ($templateCache) {
	    $templateCache.put('activity-forms.html', _activityForms2.default);
	    $templateCache.put('activity-book.html', _activityBook2.default);
	    $templateCache.put('activity-total.html', _activityTotal2.default);
	}]).controller('activityAdjustmentController', _activityAdjustmentControlsComponent2.default).directive('ablActivityBook', ['$rootScope', '$sce', '$compile', '$mdMedia', '$mdDialog', '$mdToast', '$log', '$window', '$timeout', '$http', 'rx', 'observeOnScope', '$stateParams', '$state', function ($rootScope, $sce, $compile, $mdMedia, $mdDialog, $mdToast, $log, $window, $timeout, $http, rx, observeOnScope, $stateParams, $state) {
	    return {
	        restrict: 'E',
	        scope: {
	            book: '=',
	            activity: '=',
	            app: '='
	        },
	        template: _activityBook2.default,
	        link: function link($scope, element, attrs) {
	            // Digest on resize to recalculate $mdMedia window size
	            function onResize() {
	                $scope.$digest();
	            };
	            angular.element($window).on('resize', onResize);
	        },
	        controllerAs: 'vm',
	        controller: ["$scope", "$element", "$attrs", function controller($scope, $element, $attrs) {
	            var vm = this;
	            this.formWasBlocked = false;
	            this.guestDetailsExpanded = true;
	            this.attendeesExpanded = false;
	            this.addonsExpanded = false;
	            this.questionsExpanded = false;
	            this.stripePaymentExpanded = false;
	            this.stripeCardIsValid = false;
	            this.paymentExpanded = false;
	            this.showPaymentForm = false;
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

	            $scope.sendConfirmationEmail = true;
	            //Environment is configured differently across apps so get config from the $rootScope for now
	            var config = $rootScope.config;
	            var headers = {};

	            //Activity dash needs no headers
	            if (!config.DASHBOARD) {
	                headers = {
	                    'x-abl-access-key': $stateParams.merchant || 'tLVVsHUlBAweKP2ZOofhRBCFFP54hX9CfmQ9EsDlyLfN6DYHY5k8VzpuiUxjNO5L', //$stateParams.merchant || config.ABL_ACCESS_KEY,
	                    'x-abl-date': Date.parse(new Date().toISOString()),
	                    "Content-Type": "application/json;charset=utf-8"
	                };
	                //Require booking questions on consumer facing apps
	                vm.validStepsForPayment['bookingQuestions'] = false;
	            } else {
	                $scope.dashboard = true;
	            }

	            console.log('abl-activity-book $scope', $scope);

	            $scope.formatDate = function (date, format) {
	                return window.moment(date).format(format);
	            };
	            $scope.paymentResponse = '';
	            $scope.paymentSuccessful = false;

	            this.goToNextStep = function (currentStepName, form) {
	                switch (currentStepName) {
	                    case 'guestDetailsStep':
	                        //goes to attendees
	                        vm.toggleGuestDetails();
	                        vm.toggleAttendees();
	                        break;
	                    case 'attendeesStep':
	                        //goes to addons || booking || pay
	                        //console.log('goToNextStep:attendeesStep', vm.attendeesAdded);
	                        if (vm.countAttendeesAdded() > 0) {
	                            //validate attendees
	                            //console.log('attendeesStep', vm.addons.length, vm.questions);
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
	                                    console.log('no questions, goToPay');
	                                    vm.goToPay();
	                                }
	                            }
	                        }
	                        break;
	                    case 'addonsStep':
	                        //goes to addons || booking || pay
	                        if (vm.addons && vm.addons.length > 0) {
	                            //validate addons
	                            if (vm.countAttendeesAdded()) {
	                                //if guests and attendees are valid
	                                if (vm.questions.length > 0) {
	                                    //go to questions if questions exist
	                                    vm.addonsExpanded = false;
	                                    vm.questionsExpanded = true;
	                                } else {
	                                    //got to pay if qustions doesn't exist
	                                    vm.addonsExpanded = false;
	                                    vm.stripePaymentExpanded = true;
	                                    if (!$scope.dashboard) {
	                                        console.log('no questions, goToPay');
	                                        vm.goToPay();
	                                    }
	                                }
	                            }
	                        }
	                        break;
	                    case 'paymentStep':
	                        //goes to addons || booking || pay
	                        console.log('goToNextStep:paymentStep', vm.isPaymentValid());
	                        if (vm.isPaymentValid()) {
	                            //if guests and attendees are valid
	                            vm.guestDetailsExpanded = false;
	                            vm.attendeesExpanded = false;
	                            vm.addonsExpanded = false;
	                            vm.questionsExpanded = false;
	                            vm.stripePaymentExpanded = true;
	                            if (!$scope.dashboard) {
	                                vm.goToPay();
	                            }
	                        }
	                        break;
	                }
	            };

	            vm.guestDetailsFormValid = false;
	            this.toggleGuestDetails = function () {
	                //console.log('toggle guest details');
	                this.guestDetailsExpanded = this.formWasBlocked ? false : !this.guestDetailsExpanded;
	            };

	            this.togglePayment = function () {
	                //console.log('toggle payment');
	                this.paymentExpanded = !this.paymentExpanded;
	            };

	            this.returnToMainPage = function () {

	                if ($rootScope.config.DASHBOARD) {
	                    $mdDialog.hide();
	                    $state.reload();
	                } else {
	                    $mdDialog.hide();
	                    $state.go('home', {
	                        merchant: $stateParams.merchant
	                    });
	                }
	            };
	            this.pricing = {
	                total: 0
	            };
	            this.taxTotal, this.addonTotal, this.attendeeTotal = 0;

	            $scope.bookingSucceeded = false;
	            $scope.$mdMedia = $mdMedia;
	            $scope.screenIsBig = function () {
	                var w = angular.element($window);
	                return w[0].innerWidth > 742;
	            };

	            $scope.addBookingController = $scope.$parent;
	            //console.log('addBookingController', $scope.addBookingController);

	            this.toggleQuestions = function () {
	                //console.log('toggle questions');
	                this.questionsExpanded = this.formWasBlocked ? false : !this.questionsExpanded;
	            };

	            this.adjustAddon = function (i, mode) {
	                if (mode == 'up') vm.addons[i].quantity++;
	                if (mode == 'down' && vm.addons[i].quantity > 0) vm.addons[i].quantity--;

	                $scope.safeApply();
	                console.log('adjust addons', vm.addons);
	                vm.getPricingQuote();
	            };
	            //console.log('adjustAddon:addons', vm.addons);

	            this.toggleAddons = function () {
	                //console.log('toggle addons');
	                if (vm.addons.length < 1) this.questionsExpanded = this.formWasBlocked ? false : !this.questionsExpanded;else this.addonsExpanded = this.formWasBlocked ? false : !this.addonsExpanded;
	            };

	            this.toggleStripePay = function () {
	                this.paymentExpanded = !this.paymentExpanded;
	            };

	            this.togglePay = function () {
	                this.payButtonEnabled = !this.payButtonEnabled;
	            };

	            this.adjustAttendee = function (i, mode) {
	                //Allow dashboard users to overbook
	                if (mode == 'up' && (vm.countAttendees() > 0 || $scope.dashboard)) vm.attendees[i].quantity++;
	                if (mode == 'down' && vm.attendees[i].quantity > 0) vm.attendees[i].quantity--;

	                //console.log('adjust attendees', vm.attendees);
	                vm.getPricingQuote();
	                vm.countAttendees();
	            };

	            this.toggleAttendees = function () {
	                //console.log('toggle attendees');
	                this.attendeesExpanded = this.formWasBlocked ? false : !this.attendeesExpanded;
	            };

	            this.checkAdjustAttendee = function ($index) {
	                if (!$scope.dashboard && vm.attendees[$index].quantity > vm.countAttendees()) {
	                    vm.attendees[$index].quantity = 0;
	                    vm.attendees[$index].quantity = vm.countAttendees();
	                }
	                if (vm.attendees[$index].quantity < 0) vm.attendees[$index].quantity = 0;

	                vm.getPricingQuote();
	                vm.countAttendees();
	                $scope.safeApply();
	                console.log('attendees added', vm.countAttendees(), vm.attendees[$index].quantity);
	            };

	            var data = {
	                "attendees": {},
	                "addons": {}
	            };

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
	                //console.log('pricing quote POST data', data);
	                return data;
	            }

	            // Query for pricing data based on the data object used to make a booking request
	            vm.getPricingQuote = function () {
	                var query = buildQuery();
	                $http({
	                    method: 'POST',
	                    url: config.FEATHERS_URL + '/pricing-quotes',
	                    data: query,
	                    headers: headers
	                }).then(function successCallback(response) {
	                    vm.pricing = response.data;
	                    vm.pricing.couponDeduction = vm.pricing.items.filter(function (item) {
	                        return item.type == 'coupon';
	                    });

	                    var addonsFilter = response.data.items.filter(function (item) {
	                        return item.type == 'addon';
	                    });
	                    vm.addonTotal = 0;
	                    vm.addonSubtotals = [];
	                    var addonsArray = {};
	                    angular.forEach(addonsFilter, function (addon, key) {
	                        var object = addon.type + addon.name.replace(' ', '');
	                        if (!addonsArray[object]) {
	                            addonsArray[object] = {
	                                addons: []
	                            };
	                        }
	                        addonsArray[object].addons.push(addon);
	                    });
	                    angular.forEach(addonsArray, function (addon, key) {
	                        var obj = {
	                            name: addon.addons[0].name,
	                            price: addon.addons[0].amount || addon.addons[0].price,
	                            amount: (addon.addons[0].amount || addon.addons[0].price) * addon.addons[0].quantity,
	                            quantity: addon.addons[0].quantity
	                        };
	                        vm.addonTotal += (addon.addons[0].amount || addon.addons[0].price) * addon.addons[0].quantity;
	                        vm.addonSubtotals.push(obj);
	                    });

	                    vm.attendeeTotal = response.data.items.filter(function (item) {
	                        return item.type == "aap";
	                    }).reduce(function (result, att) {
	                        return result + (att.amount || att.price) * att.quantity;
	                    }, 0);

	                    var aapFilter = response.data.items.filter(function (item) {
	                        return item.type == 'aap';
	                    });
	                    vm.attendeeSubtotals = [];
	                    var attendeesArray = {};
	                    angular.forEach(aapFilter, function (aap, key) {
	                        var object = aap.type + aap.name.replace(' ', '');
	                        if (!attendeesArray[object]) {
	                            attendeesArray[object] = {
	                                aaps: []
	                            };
	                        }
	                        attendeesArray[object].aaps.push(aap);
	                    });
	                    angular.forEach(attendeesArray, function (aap, key) {
	                        var obj = {
	                            name: aap.aaps[0].name,
	                            price: aap.aaps[0].amount || aap.aaps[0].price,
	                            amount: aap.aaps[0].amount * aap.aaps[0].quantity,
	                            quantity: aap.aaps[0].quantity
	                        };
	                        vm.attendeeSubtotals.push(obj);
	                    });

	                    vm.taxTotal = response.data.items.filter(function (item) {
	                        return item.type == "tax" || item.type == "fee" || item.type == 'service';
	                    }).reduce(function (result, tax) {
	                        return result + (tax.amount || tax.price) * tax.quantity;
	                    }, 0);

	                    console.log('getPricingQuotes', response);
	                    console.log('attendeeSubtotal', vm.attendeeSubtotals);
	                    console.log('taxTotal', vm.taxTotal);
	                }, function errorCallback(response) {
	                    vm.pricing = {};
	                    vm.taxTotal = 0;
	                    $mdToast.show($mdToast.simple().textContent(response.data.errors[0]).position('left bottom').hideDelay(3000));
	                    //console.log('getPricingQuotes error!', response, vm.pricing);
	                });
	            };

	            //Query for possible coupons partially matching the vm.couponQuery search string
	            vm.getPossibleCoupons = function () {
	                $http({
	                    method: 'GET',
	                    url: config.FEATHERS_URL + '/coupons?bookingId=' + vm.couponQuery,
	                    headers: headers
	                }).then(function successCallback(response) {
	                    vm.possibleCoupons = response.data;
	                    console.log('getPossibleCoupons success', response);
	                }, function errorCallback(response) {
	                    vm.possibleCoupons = [];
	                    // vm.taxTotal = 0;
	                    //console.log('getPossibleCoupons error!', response);
	                });
	            };

	            vm.clients = [];
	            observeOnScope($scope, 'vm.formData.fullName').map(function (data) {
	                return data;
	            }).subscribe(function (change) {
	                console.log('clientSearchText ', change.newValue);
	                if ($scope.dashboard) {
	                    vm.clients = $http({
	                        method: 'GET',
	                        url: config.FEATHERS_URL + '/clients?fullName=' + change.newValue,
	                        headers: headers
	                    }).then(function successCallback(response) {
	                        console.log('clientSearch success', response);
	                        return response.data.list;
	                    }, function errorCallback(response) {
	                        console.log('clientSearch error!', response);
	                        return [];
	                    });
	                }
	            });

	            vm.selectedClientChange = function (client) {
	                if (client) {
	                    vm.formData.fullName = client.primaryContact.fullName || '';
	                    vm.formData.mail = client.primaryContact.email || '';
	                    vm.formData.phoneNumber = client.primaryContact.phoneNumber || '';
	                    console.log('selectedClientChange', client);
	                }
	            };

	            $scope.autocomplete = {};
	            vm.couponStatus = 'untouched';

	            $scope.autocomplete.searchTextChange = function searchTextChange(text) {
	                console.log("SEARCH TEXT", text);
	            };
	            $scope.autocomplete.selectedItemChange = function selectedItemChange(item) {
	                console.log('applied coupon', item);

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
	                    if (data['couponId']) delete data['couponId'];
	                }
	            };

	            $scope.autocomplete.querySearch = function querySearch(text) {
	                if ($scope.dashboard) {
	                    text = text.toUpperCase();
	                    return $http({
	                        method: 'GET',
	                        url: config.FEATHERS_URL + '/coupons?couponId=' + text,
	                        headers: headers
	                    }).then(function successCallback(response) {
	                        return response.data.list;
	                        console.log('getPossibleCoupons success', response.data.list);
	                    }, function errorCallback(response) {
	                        return [];
	                        console.log('getPossibleCoupons error!', response);
	                    });
	                }
	            };

	            // Check whether the vm.couponQuery search string exists as a coupon, if successful,
	            // add the coupon id to the make booking request object as the 'coupon' property
	            vm.checkCoupon = function () {
	                vm.checkingCoupon = true;
	                //console.log('check coupon', vm.couponQuery);
	                $http({
	                    method: 'GET',
	                    url: config.FEATHERS_URL + '/coupons/' + vm.couponQuery,
	                    headers: headers
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

	                    //console.log('checkCoupon error!', response);
	                });
	            };

	            vm.removeCoupon = function () {
	                vm.couponQuery = '';
	                delete data['couponId'];
	                $scope.autocomplete.selectedItem = undefined;
	                vm.couponStatus = 'untouched';
	                vm.appliedCoupon = {};
	                vm.getPricingQuote();
	            };

	            var moment = window.moment;

	            vm.validateCoupon = function (coupon) {
	                var today = moment();
	                //console.log('coupon expires after today', moment(coupon.endTime).isAfter(moment()));
	                //Coupon is not expired and is infinitely redeemable
	                if (moment(coupon.endTime).isAfter(moment()) && coupon.maxRedemptions == 0) return true;
	                //Coupon is not expired and has been redeemed less than the maximum allowable redemptions
	                if (coupon.maxRedemptions > 0 && moment(coupon.endTime).isAfter(moment()) && coupon.maxRedemptions - coupon.redemptions >= 0) return true;
	                //Coupon is expired or has been redeemed too many times 
	                vm.couponStatus = 'invalid';
	                return false;
	            };

	            vm.bookingQuestionsCompleted = function () {
	                var completed = 0;
	                if (vm.bookingQuestions) {
	                    angular.forEach(vm.bookingQuestions, function (e, i) {
	                        if (e.length > 0) completed++;
	                    });
	                } else {
	                    completed = 0;
	                }
	                //console.log('vm.bookingQuestions', vm.bookingQuestions, completed);
	                return completed;
	            };
	            //Observe and debounce an object on the $scope, can be used on 
	            //a search input for example to wait before auto-sending the value
	            observeOnScope($scope, 'vm.couponQuery').debounce(500).select(function (response) {
	                return response;
	            }).subscribe(function (change) {
	                //console.log('search value', change);
	                if (vm.couponQuery.length > 0) vm.checkCoupon();
	            });

	            (0, _activityBookValidators2.default)(vm, rx, $http, $stateParams);

	            $scope.$watch('addBookingController.activity', function (changes) {
	                console.log('addBookingController.activity', changes);
	                if (angular.isDefined($scope.addBookingController.activity)) {
	                    //Get booking questions
	                    vm.questions = $scope.addBookingController.activity.questions || [];
	                    if (!vm.questions) {
	                        delete vm.validStepsForPayment.bookingQuestions;
	                    }
	                    //console.log('booking questions', vm.questions);

	                    vm.addons = $scope.addBookingController.activity.charges.filter(function (charge) {
	                        return charge.type == 'addon' && charge.status == 'active';
	                    });
	                    if (!vm.addons) {
	                        delete vm.validStepsForPayment.addons;
	                    }
	                    vm.addons.forEach(function (e, i) {
	                        if (!angular.isDefined(e.quantity)) e.quantity = 0;
	                    });

	                    vm.taxes = $scope.addBookingController.activity.charges.filter(function (charge) {
	                        return charge.type == 'tax';
	                    });
	                    $scope.safeApply();
	                    //console.log('taxes', vm.taxes);
	                }
	            }, true);

	            $scope.$watch('addBookingController.timeslot', function (changes) {
	                if (angular.isDefined($scope.addBookingController.timeslot)) {
	                    console.log('addBookingController.timeslot', $scope.addBookingController.timeslot);

	                    if (angular.isDefined($scope.addBookingController.timeslot.charges)) {
	                        vm.attendees = $scope.addBookingController.timeslot.charges.filter(function (charge) {
	                            return charge.type == 'aap' && charge.status == 'active';
	                        });
	                        vm.attendees.forEach(function (e, i) {
	                            if (!angular.isDefined(e.quantity)) e.quantity = 0;
	                        });
	                    }
	                    data['timeSlotId'] = $scope.addBookingController.timeslot._id;
	                    data['startTime'] = $scope.addBookingController.timeslot.startTime;
	                }
	            }, true);

	            vm.countAttendees = function () {
	                // console.log('count attendees', $scope.addBookingController.event.maxOcc, attendeesAdded);
	                if ($scope.addBookingController.event) {
	                    console.log('addBookingController.event', $scope.addBookingController.event);
	                    if (vm.attendees) {
	                        return ($scope.addBookingController.event.maxOcc ? $scope.addBookingController.event.maxOcc : $scope.addBookingController.timeslot.maxOcc) - vm.attendees.map(function (att) {
	                            return att.quantity;
	                        }).reduce(function (a, b) {
	                            return a + b;
	                        }, 0) - $scope.addBookingController.event.attendees;
	                    } else {
	                        return 0;
	                    }
	                }
	                return 0;
	            };

	            vm.countAttendeesAdded = function () {
	                var attendeesAdded = 0;
	                if ($scope.addBookingController.event) {
	                    if (vm.attendees) {
	                        attendeesAdded = vm.attendees.map(function (att) {
	                            return att.quantity;
	                        }).reduce(function (a, b) {
	                            return a + b;
	                        }, 0);
	                    }
	                }
	                // console.log('countAttendeesAdded', attendeesAdded);
	                return attendeesAdded;
	            };

	            vm.countAddonsAdded = function () {
	                if ($scope.addBookingController.event) {
	                    if (vm.addons) {
	                        return vm.addons.map(function (add) {
	                            return add.quantity;
	                        }).reduce(function (a, b) {
	                            return a + b;
	                        }, 0);
	                    } else {
	                        return 0;
	                    }
	                }
	                return 0;
	            };

	            vm.addonsChanged = function () {
	                $scope.safeApply();
	                console.log('addonsChanged');
	                $timeout(function () {
	                    vm.getPricingQuote();
	                }, 0);
	            };

	            this.areGuestDetailsValid = function (form) {
	                if (form) {
	                    vm.guestDetailsAreValid = form.$valid;
	                    vm.validStepsForPayment.guest = vm.guestDetailsAreValid;
	                } else {
	                    vm.guestDetailsAreValid = false;
	                }
	                return vm.guestDetailsAreValid;
	            };

	            this.areAttendeesValid = function () {
	                vm.validStepsForPayment.attendees = vm.countAttendeesAdded() === 0 ? false : true;
	                return vm.countAttendeesAdded() === 0 ? false : true;
	            };

	            this.areAddonsValid = function () {
	                if (vm.validStepsForPayment.addons != null) {
	                    vm.validStepsForPayment.addons = true;
	                }
	                return vm.countAddonsAdded() === 0 ? false : true;
	            };

	            this.areBookingQuestionsValid = function () {
	                if (vm.validStepsForPayment.bookingQuestions != null) {
	                    vm.validStepsForPayment.bookingQuestions = vm.bookingQuestionsCompleted() === vm.questions.length ? true : false;
	                }
	                console.log('areBookingQuestionsValid ', vm.validStepsForPayment.bookingQuestions);

	                return vm.validStepsForPayment.bookingQuestions;
	            };

	            this.isPaymentValid = function () {
	                var isValid = [];
	                angular.forEach(vm.validStepsForPayment, function (step, key) {
	                    if (!step) {
	                        isValid.push(step);
	                    }
	                });
	                return isValid.length > 0 ? false : true;
	            };

	            this.isNextStepPayment = function (step) {
	                if (step === 'attendees') {
	                    if (vm.addons || vm.questions) {
	                        return vm.addons || vm.questions ? true : false;
	                    } else {
	                        return false;
	                    }
	                }
	                if (step === 'addons') {
	                    if (vm.questions) {
	                        return vm.questions ? true : false;
	                    } else {
	                        return false;
	                    }
	                }
	                if (step === 'payment') {
	                    return true;
	                }
	            };

	            vm.paymentMethod = 'credit';
	            vm.bookingQuestions = [];
	            vm.getBookingData = function () {
	                var bookingData = angular.copy(data);
	                if (vm.paymentMethod == 'reserved') bookingData['amount'] = 0;
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
	                    console.log('vm.questions', vm.questions);
	                    console.log('vm.bookingQuestions', vm.bookingQuestions);
	                    bookingData['answers'][e._id ? e._id : e] = vm.bookingQuestions[i];
	                });

	                if (vm.paymentMethod != 'reserved') bookingData['paymentMethod'] = vm.paymentMethod;else bookingData['paymentMethod'] = 'cash';

	                if (vm.paymentMethod == 'reserved') {
	                    bookingData['amount'] = 0;
	                }
	                bookingData['currency'] = 'default';

	                return bookingData;
	            };

	            vm.outputBookingData = function () {
	                console.log(vm.getBookingData());
	            };

	            $scope.safeApply = function (fn) {
	                var phase = this.$root.$$phase;
	                if (phase == '$apply' || phase == '$digest') {
	                    if (fn && typeof fn === 'function') {
	                        fn();
	                    }
	                } else {
	                    this.$apply(fn);
	                }
	            };

	            //Must use stripe v3 <script src="https://js.stripe.com/v3/"></script>
	            function initStripe(publicKey) {
	                // Create a Stripe client
	                var Stripe = window.Stripe;
	                var stripe = Stripe(publicKey);
	                console.log(publicKey);
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

	                var stripeTokenHandler = function stripeTokenHandler(token) {
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
	                        headers: headers
	                    }).then(function successCallback(response) {
	                        console.log('stripeTokenHandler booking success', response);
	                        $scope.bookingSuccessResponse = response;
	                        vm.waitingForResponse = false;
	                        validatePayment(response);
	                    }, function errorCallback(response) {
	                        var errorElement = document.getElementById('card-errors');
	                        errorElement.textContent = response.data.errors[0];
	                        vm.paymentWasSent = false;
	                        vm.waitingForResponse = false;
	                    });
	                };

	                vm.submitNonCreditCardBooking = function () {
	                    var bookingData = vm.getBookingData();
	                    if (bookingData.stripeToken) delete bookingData.stripeToken;
	                    bookingData.location = {};
	                    bookingData.isMobile = false;
	                    vm.paymentWasSent = true;
	                    $scope.bookingSuccessResponse = 'processing';
	                    // $scope.makeBooking(bookingData)
	                    $http({
	                        method: 'POST',
	                        url: config.FEATHERS_URL + '/bookings',
	                        data: bookingData,
	                        headers: headers
	                    }).then(function successCallback(response) {
	                        console.log('submitNonCreditCardBooking success', response);
	                        $scope.bookingSuccessResponse = response;
	                        vm.waitingForResponse = false;
	                        validatePayment(response);
	                    }, function errorCallback(response) {
	                        var errorElement = document.getElementById('card-errors');
	                        errorElement.textContent = response.data.errors[0];
	                        vm.paymentWasSent = false;
	                        vm.waitingForResponse = false;
	                    });
	                };

	                vm.goToPay = function () {
	                    vm.guestDetailsExpanded = false;
	                    vm.attendeesExpanded = false;
	                    vm.addonsExpanded = false;
	                    vm.questionsExpanded = false;

	                    vm.showPaymentForm = true;
	                    vm.stripePaymentExpanded = true;

	                    vm.paymentWasSent = true;
	                    this.formWasBlocked = true;
	                    $scope.bookingSuccessResponse = 'processing';
	                    $scope.safeApply();
	                    $scope.makeBooking();
	                };

	                $scope.makeBooking = function (data) {
	                    vm.paymentExpanded = true;
	                    vm.loadingIframe = true;

	                    var bookingData = vm.getBookingData();

	                    $scope.bookingResponse = $http({
	                        method: 'POST',
	                        url: config.FEATHERS_URL + '/bookings',
	                        data: bookingData,
	                        headers: headers
	                        // headers: {
	                        //     "Content-Type": "application/json;charset=utf-8"
	                        // }
	                    }).then(function successCallback(response) {
	                        console.log('makeBooking success', response);
	                        vm.loadingIframe = false;
	                        $scope.paymentSuccessful = false;
	                        $scope.bookingSuccessResponse = response;
	                        var iframeDoc = document.getElementById("paymentIframe").contentWindow.document;
	                        iframeDoc.open();
	                        iframeDoc.write(response.data.iframeHtml);
	                        iframeDoc.close();
	                        $scope.bookingSucceeded = true;
	                    }, function errorCallback(response) {
	                        $mdDialog.hide();
	                        vm.loadingIframe = false;
	                        vm.paymentExpanded = false;
	                        $scope.bookingSucceeded = false;
	                        $mdToast.show($mdToast.simple().textContent(response.data.errors[0]).position('left bottom').hideDelay(3000));
	                        console.log('makeBooking error!', response);
	                    });
	                };

	                function validatePayment(response) {
	                    if (response.status === 200) {
	                        $scope.paymentResponse = 'success'; //processing, failed
	                        $scope.paymentSuccessful = true;
	                        $scope.safeApply();
	                    }
	                    $scope.bookingSuccessResponse = response;

	                    $scope.$emit('paymentResponse', response);
	                    console.log('paymentResponse', response);
	                }

	                // Create a token or display an error the form is submitted.
	                var form = document.getElementById('payment-form');

	                card.addEventListener('change', function (event) {
	                    if (typeof event.error === 'undefined' && event.brand != 'unknown') {
	                        vm.stripeCardIsValid = true;
	                    } else {
	                        vm.stripeCardIsValid = false;
	                    }
	                    $scope.safeApply();
	                });

	                form.addEventListener('submit', function (event) {
	                    if (vm.paymentMethod != 'credit') {
	                        vm.submitNonCreditCardBooking();
	                    } else {
	                        event.preventDefault();
	                        vm.waitingForResponse = true;
	                        stripe.createToken(card).then(function (result) {
	                            if (result.error) {
	                                // Inform the user if there was an error
	                                var errorElement = document.getElementById('card-errors');
	                                errorElement.textContent = result.error.message;
	                                vm.waitingForResponse = false;
	                            } else {
	                                // Send the token to your server
	                                stripeTokenHandler(result.token);
	                            }
	                            $scope.safeApply();
	                        });
	                    }
	                });
	            }

	            function makeStripeBooking() {
	                $http({
	                    method: 'GET',
	                    url: config.FEATHERS_URL + '/payments/setup',
	                    data: {
	                        operator: $stateParams.merchant || config.ABL_ACCESS_KEY
	                    },
	                    headers: headers
	                }).then(function successCallback(response) {
	                    console.log('makeStripeBooking ', response);
	                    initStripe(response.data.publicKey);
	                }, function errorCallback(response) {
	                    var errorElement = document.getElementById('card-errors');
	                    errorElement.textContent = response.error.message;
	                }).catch(function (err) {
	                    console.log('makeStripeBooking error', err);
	                });
	            }

	            makeStripeBooking();

	            var lpad = function lpad(numberStr, padString, length) {
	                while (numberStr.length < length) {
	                    numberStr = padString + numberStr;
	                }
	                return numberStr;
	            };

	            var _paymentMessageHandler;
	            _paymentMessageHandler = function paymentMessageHandler(event) {
	                // if (event.origin == "https://calendar.ablist.win") { // TODO add to config
	                //     console.log("TRUSTED ORIGIN", event.origin);
	                console.log("DATA", event.data);
	                if (event.data == "payment_complete" || event.data.type == "payment_success") {
	                    console.log("PAYMENT COMPLETE");
	                    $scope.paymentResponse = 'success'; //processing, failed
	                    //   $rootScope.showToast('Payment processed successfully.');

	                    window.removeEventListener("message", _paymentMessageHandler);
	                    $scope.paymentSuccessful = true;
	                    //   $scope.changeState('bookings'); //Go to bookings view if successful
	                    $scope.safeApply();
	                    //$mdDialog.hide();
	                } else {
	                    if (event.data.type === 'payment_error') $rootScope.showToast(event.data.message, 'errorToast');

	                    $scope.paymentSuccessful = false;
	                    $scope.paymentResponse = ''; //processing, failed
	                    vm.showPaymentForm = false;
	                    $scope.safeApply();
	                }
	            };

	            console.log("Adding Payment Message Event Listener");
	            window.addEventListener("message", _paymentMessageHandler);

	            $scope.safeApply = function (fn) {
	                var phase = this.$root.$$phase;
	                if (phase == '$apply' || phase == '$digest') {
	                    if (fn && typeof fn === 'function') {
	                        fn();
	                    }
	                } else {
	                    this.$apply(fn);
	                }
	            };

	            var lpad = function lpad(numberStr, padString, length) {
	                while (numberStr.length < length) {
	                    numberStr = padString + numberStr;
	                }
	                return numberStr;
	            };

	            $scope.showPayzenDialog = function (ev) {
	                $log.debug("SHOW PAYZEN DIALOG");
	                vm.paymentExpanded = true;
	                vm.showPaymentForm = true;

	                $scope.paymentSuccessful = false;
	            };

	            //Merge identical items from an array into nested objects, 
	            //summing their amount properties and keeping track of quantities
	            function mergeIdenticalArrayItemsIntoObject(data, oldObject) {
	                var seen = oldObject;
	                //console.log('mergeIdenticalArrayItemsIntoObject:data', data);
	                angular.forEach(data, function (e, i) {
	                    // Have we seen this item before?
	                    //console.log('mergeIdenticalArrayItemsIntoObject', seen, e, seen.hasOwnProperty(e.name));
	                    if (seen.hasOwnProperty(e.name) && seen[e.name] === e.name) {
	                        seen[e['name']]['price'] = e['price']; //Sum their prices
	                        seen[e['name']]['quantity'] += 1; //Increment their quantity
	                        seen[e['name']]['amount'] = seen[e['name']]['amount'] * seen[e['name']]['quantity']; //Sum their prices
	                        //console.log('merged', seen[e['name']]);
	                    } else {
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
	        }]
	    };
	}]);

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(112);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(82)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(112, function() {
				var newContent = __webpack_require__(112);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(81)(undefined);
	// imports


	// module
	exports.push([module.id, "#paymentIframe {\n    margin: 0;\n    padding: 8px 8px;\n    border: none;\n    min-height: 234px;\n    height: 100%;\n    overflow-y: hidden;\n}\n\nabl-activity-book md-card {\n    box-shadow: none !important;\n    border: none !important;\n    background: transparent;\n}\n\n.inputBottomMargin {\n    margin-bottom: 42px !important;\n}\n\n.transparent {\n    background-color: transparent !important;\n}\n\nlist-item{\n    display: block !important;\n}", ""]);

	// exports


/***/ }),
/* 113 */
/***/ (function(module, exports) {

	module.exports = "<md-card class=\"paymentSummaryCard\" ng-show=\"paymentResponse != 'success'\">\n  <md-list flex>\n\n    <md-list-item class=\"lineItemHeader \" ng-if=\"vm.base \" ng-click=\"null\">\n      <div class=\"md-list-item-text  \" layout=\"row \" flex>\n        <div layout=\"row \" layout-align=\"start center \" flex=\"50 \">\n          <p class=\" \">Base Price </p>\n        </div>\n        <div layout=\"row \" layout-align=\"end center \" flex=\"50 \">\n          <p class=\" \">{{vm.base() / 100}} CFP</p>\n        </div>\n      </div>\n    </md-list-item>\n\n    <!--Coupons-->\n\n    <md-list-item class=\"paymentHeader md-2-line md-primary\" ng-disabled=\"detailsForm.$invalid\" ng-show=\"vm.couponStatus == 'valid'\">\n      <div layout=\"row\" class=\"md-list-item-text \" flex>\n        <div layout=\"row\" layout-align=\"start center\" flex>\n          <!-- <ng-md-icon class=\"headerIcon\" icon=\"local_offer\" class=\"listIcon\" ng-if=\"vm.couponStatus !='valid'\"></ng-md-icon> -->\n          <ng-md-icon icon=\"clear\" class=\"listIcon remove-coupon\" ng-click=\"vm.removeCoupon();\" ng-if=\"vm.couponStatus =='valid'\"></ng-md-icon>\n\n          <span class=\"couponText total\" flex>{{vm.appliedCoupon.couponId}} - {{vm.appliedCoupon.percentage ? '' : '$'}}{{vm.appliedCoupon.percentage ? vm.appliedCoupon.amount : (vm.appliedCoupon.amount / 100)}}{{vm.appliedCoupon.percentage ? '%' : ''}} Off</span>\n\n        </div>\n        <div layout=\"row \" layout-align=\"end center \">\n          <span class=\"couponTextTotal\" ng-if=\"vm.pricing.couponDeduction[0]\">-${{(-1 * vm.pricing.couponDeduction[0].price / 100) | number : 2}}</span>\n          <md-progress-circular md-mode=\"indeterminate\" ng-show=\"vm.checkingCoupon && vm.couponQuery.length > 0\" class=\"listItemCircularProgress easeIn\"\n            md-diameter=\"24px\">\n          </md-progress-circular>\n        </div>\n      </div>\n    </md-list-item>\n    <list-item size=\"lg\" class=\"listItemAutocomplete\" ng-show=\"vm.couponStatus == 'untouched' || vm.couponStatus =='invalid'\">\n      <md-autocomplete md-selected-item=\"autocomplete.selectedItem\" md-search-text-change=\"autocomplete.searchTextChange(autocomplete.searchText)\"\n        md-search-text=\"autocomplete.searchText\" md-no-cache=\"true\" md-selected-item-change=\"autocomplete.selectedItemChange(item)\"\n        md-items=\"item in autocomplete.querySearch(autocomplete.searchText)\" md-item-text=\"item.couponId\" md-min-length=\"0\"\n        placeholder=\"{{dashboard ? 'Search coupons..' : 'Enter a coupon..'}}\" class=\"listItem\" ng-if=\"dashboard\">\n        <md-item-template>\n          <span md-highlight-text=\"ctrl.searchText\" md-highlight-flags=\"^i\">{{item.couponId}}</span>\n          <span>{{item.percentage ? \"\" : \"$\"}}{{item.percentage ? item.amount : (item.amount / 100)}}{{item.percentage ? \"%\" : \"\"}}</span>\n        </md-item-template>\n        <md-not-found>\n          No coupons found{{autocomplete.searchText.length > 0 ? (' matching \"' + autocomplete.searchText + '\".') : '.'}}\n        </md-not-found>\n      </md-autocomplete>\n      <span class=\"paymentSubTitle total\">\n        <input id=\"#coupon\" ng-model=\"vm.couponQuery\" type=\"text\" class=\"couponInput\" ng-if=\"(vm.couponStatus =='untouched' || vm.couponStatus =='invalid') && !dashboard\" ng-change=\"vm.checkingCoupon = true\" placeholder=\"Enter coupon..\" to-uppercase/>\n        </span>\n    </list-item>\n    <md-list-item ng-show=\"vm.couponStatus =='invalid' && vm.couponQuery.length > 0 && !vm.checkingCoupon\" class=\"paymentHeader md-2-line md-primary easeIn\"\n      ng-if=\"!dashboard\">\n      <div layout=\"row\" class=\"md-list-item-text \" flex>\n        <div layout=\"row\" layout-align=\"start center\" flex>\n          <ng-md-icon class=\"headerIcon\" icon=\"error_outline\" class=\"listIcon\" ng-if=\"vm.couponStatus !='valid'\" style=\"fill: rgba(255,87,87,0.8)\"></ng-md-icon>\n          <span class=\"paymentSubTitle total\">\n            Invalid Coupon\n          </span>\n        </div>\n        <div layout=\"row\" layout-align=\"end center\" flex>\n          <ng-md-icon icon=\"clear\" class=\"listIcon\" ng-click=\"vm.couponQuery = '';\"></ng-md-icon>\n        </div>\n      </div>\n    </md-list-item>\n\n    <div ng-if=\"vm.attendeeTotal > 0\">\n      <div class=\"md-list-item-text subtotalLineItem\" layout=\"row \" flex>\n        <div layout=\"row\" layout-align=\"start center \" flex=\"50 \">\n          <span class=\"total\">Attendees </span>\n        </div>\n        <div layout=\"row \" layout-align=\"end center \" flex=\"50 \">\n          <span class=\"activityTotal\">${{vm.attendeeTotal / 100 | number:2}}</span>\n        </div>\n      </div>\n\n      <div ng-repeat=\"(key, value) in vm.attendeeSubtotals\" layout=\"row\" flex class=\"subtotalLineItem subtotalLineItemSmall\">\n        <div layout=\"row\" layout-align=\"start center\" flex=\"50\">\n          {{value.quantity}} x {{value.name}} @ ${{value.price/100}} each\n        </div>\n        <div layout=\"row\" layout-align=\"end center\" flex=\"50\">\n          ${{value.amount / 100 | number:2}}\n        </div>\n      </div>\n    </div>\n    <div ng-if=\"vm.addonTotal > 0\">\n      <div class=\"md-list-item-text subtotalLineItem\" layout=\"row \" flex>\n        <div layout=\"row\" layout-align=\"start center \" flex=\"50 \">\n          <span class=\"total\">Add-ons </span>\n        </div>\n        <div layout=\"row \" layout-align=\"end center \" flex=\"50 \">\n          <span class=\"activityTotal\">${{vm.addonTotal / 100 | number:2}}</span>\n        </div>\n      </div>\n\n      <div ng-repeat=\"addon in vm.addonSubtotals\" layout=\"row\" flex class=\"subtotalLineItem subtotalLineItemSmall\">\n        <div layout=\"row\" layout-align=\"start center\" flex=\"50\">\n          {{addon.quantity}} x {{addon.name}} @ ${{addon.price/100}} each\n        </div>\n        <div layout=\"row\" layout-align=\"end center\" flex=\"50\">\n          ${{addon.amount / 100 | number:2}}\n        </div>\n      </div>\n    </div>\n\n    <div ng-if=\"vm.taxTotal > 0\">\n      <div class=\"md-list-item-text subtotalLineItem\" layout=\"row \" flex>\n        <div layout=\"row\" layout-align=\"start center \" flex=\"50 \">\n          <span class=\"total\">Taxes and Fees </span>\n        </div>\n        <div layout=\"row \" layout-align=\"end center \" flex=\"50 \">\n          <span class=\"activityTotal\">${{vm.taxTotal / 100 | number:2}}</span>\n        </div>\n      </div>\n    </div>\n\n    <div>\n      <div class=\"md-list-item-text subtotalLineItem bottomTotal\" layout=\"row \" layout-align=\"space-between center \" flex>\n        <div layout=\"row \" layout-align=\"start center \" flex=\"50 \">\n          <span class=\"\">Total </span>\n        </div>\n        <div layout=\"row \" layout-align=\"end center \" flex=\"50 \">\n          <span class=\"\">${{(vm.pricing.total || 0) / 100  | number:2}}</span>\n        </div>\n      </div>\n    </div>\n  </md-list>\n</md-card>";

/***/ }),
/* 114 */
/***/ (function(module, exports) {

	module.exports = "<div ng-if=\"paymentResponse != 'success' || !vm.showPaymentForm\">\n  <div class=\"activityPaymentSummaryCard\" layout=\"column\" after-render>\n    <!-- Guest Details -->\n    <list-item size=\"lg\" class=\"listItemHeader\" ng-click=\"vm.toggleGuestDetails()\" ng-disabled=\"!vm.guestDetailsAreValid\" layout=\"column\">\n      <div layout=\"row\" layout-align=\"start center\" flex>\n        <ng-md-icon icon=\"filter_1\" class=\"listIcon listItemHeaderIcon\"></ng-md-icon>\n        <span class=\"paymentSubTitle\" flex>Guest Details</span>\n      </div>\n      <div layout=\"row\" layout-align=\"end center\">\n        <div layout=\"column\" layout-align=\"center end\" flex>\n          <ng-md-icon icon=\"{{vm.guestDetailsExpanded ? 'expand_less' : 'expand_more'}}\" class=\"listIcon\"></ng-md-icon>\n        </div>\n      </div>\n    </list-item>\n\n    <div ng-show=\"vm.guestDetailsExpanded\" layout=\"column\">\n      <list-item ng-if=\"dashboard\">\n        <md-checkbox ng-model=\"sendConfirmationEmail\">Send confirmation e-mail to client</md-checkbox>\n      </list-item>\n      <form name=\"guestDetailsForm\" novalidate>\n        <div>\n          <md-input-container class=\"md-block listItemInputContainer inputBottomMargin\" ng-if=\"!dashboard\">\n            <label>Full Name</label>\n            <input name=\"fullName\" ng-model=\"vm.formData.fullName\" required type=\"text\" md-maxlength=\"100\" ng-minlength=\"3\" />\n            <div ng-messages=\"guestDetailsForm.fullName.$error\">\n              <div ng-message=\"required\">This is required.</div>\n              <div ng-message=\"minlength\">The name must be at least 3 characters long.</div>\n              <div ng-message=\"md-maxlength\">The name must be less than 100 characters long.</div>\n            </div>\n          </md-input-container>\n\n\n          <md-autocomplete ng-if=\"dashboard\" required md-input-name=\"autocompleteField\" md-input-minlength=\"3\" md-input-maxlength=\"100\" md-no-cache=\"true\" md-delay=\"250\" md-selected-item=\"vm.clientSearchSelectedItem\" md-search-text=\"vm.formData.fullName\" md-items=\"item in vm.clients\"\n            md-item-text=\"item.primaryContact.fullName\" md-floating-label=\"Full Name\" md-selected-item-change=\"vm.selectedClientChange(item)\" class=\"md-block listItemInputContainer\" md-menu-class=\"autocomplete-custom-template\" md-min-length=\"2\">\n            <md-item-template>\n              <span class=\"item-title\">\n                  <ng-md-icon icon=\"person\" class=\"listItemHeaderIcon sm\"></ng-md-icon>\n                  <span> {{item.primaryContact.fullName}} </span>\n              </span>\n              <span class=\"item-metadata\">\n                  <span>\n                      <ng-md-icon icon=\"email\" class=\"listItemHeaderIcon sm\" md-colors=\"{fill: 'blue-grey-A200'}\"></ng-md-icon>\n                      \n                    {{item.primaryContact.email}}\n                  </span>\n              <!-- <span>\n                  <ng-md-icon icon=\"phone\" class=\"listItemHeaderIcon sm\" md-colors=\"{fill: 'blue-grey-A200'}\"></ng-md-icon>\n                  \n                    {{item.primaryContact.phoneNumber}}\n                  </span> -->\n              </span>\n            </md-item-template>\n            <div ng-messages=\"guestDetailsForm.autocompleteField.$error\" ng-if=\"guestDetailsForm.autocompleteField.$touched\">\n              <div ng-message=\"required\">You <b>must</b> enter a client name.</div>\n              <div ng-message=\"minlength\">The name must be at least 3 characters long.</div>\n              <div ng-message=\"md-maxlength\">The name must be less than 100 characters long.</div>\n            </div>\n          </md-autocomplete>\n\n\n          <md-input-container class=\"md-block listItemInputContainer listItemAutoCompleteAfterContainer\" ng-if=\"!dashboard\">\n            <label>E-mail</label>\n            <input name=\"mail\" ng-model=\"vm.formData.mail\" required type=\"email\" md-maxlength=\"100\" ng-minlength=\"3\" />\n            <div ng-messages=\"guestDetailsForm.mail.$error\">\n              <div ng-message=\"required\">This is required.</div>\n              <div ng-message=\"email\">Please enter a valid e-mail address.</div>\n              <div ng-message=\"minlength\">The e-mail must be at least 3 characters long.</div>\n              <div ng-message=\"md-maxlength\">The e-mail must be less than 100 characters long.</div>\n            </div>\n          </md-input-container>\n          <md-input-container class=\"md-block listItemInputContainer\" ng-if=\"!dashboard\">\n            <label>Phone</label>\n            <input name=\"phone\" ng-model=\"vm.formData.phoneNumber\" required type=\"text\" />\n            <div ng-messages=\"guestDetailsForm.phone.$error\">\n              <div ng-message=\"required\">This is required.</div>\n            </div>\n          </md-input-container>\n\n          <md-input-container class=\"md-block listItemInputContainer listItemAutoCompleteAfterContainer\" ng-if=\"dashboard\">\n            <label>E-mail</label>\n            <input name=\"mail\" ng-model=\"vm.formData.mail\" type=\"email\" md-maxlength=\"100\" ng-minlength=\"3\" />\n            <div ng-messages=\"guestDetailsForm.mail.$error\">\n              <div ng-message=\"email\">Please enter a valid e-mail address.</div>\n              <div ng-message=\"minlength\">The e-mail must be at least 3 characters long.</div>\n              <div ng-message=\"md-maxlength\">The e-mail must be less than 100 characters long.</div>\n            </div>\n          </md-input-container>\n          <md-input-container class=\"md-block listItemInputContainer\" ng-if=\"dashboard\">\n            <label>Phone</label>\n            <input name=\"phone\" ng-model=\"vm.formData.phoneNumber\" type=\"text\" />\n            <div ng-messages=\"guestDetailsForm.phone.$error\">\n            </div>\n          </md-input-container>\n\n          <md-input-container class=\"md-block listItemInputContainer\">\n            <label>Notes</label>\n            <textarea ng-model=\"vm.formData.notes\" md-maxlength=\"300\" rows=\"1\"></textarea>\n          </md-input-container>\n\n          <div layout=\"row\" layout-align=\"end center\" layout-margin>\n            <md-button class=\"md-raised md-primary md-hue-2\" ng-disabled=\"!vm.areGuestDetailsValid(guestDetailsForm)\" ng-click=\"vm.goToNextStep('guestDetailsStep')\">Next</md-button>\n          </div>\n        </div>\n      </form>\n    </div>\n    <md-divider class=\"no-margin\"></md-divider>\n\n    <!-- Attendees -->\n    <list-item size=\"lg\" class=\"listItemHeader\" ng-click=\"vm.toggleAttendees()\" ng-disabled=\"!vm.guestDetailsAreValid\" layout=\"column\">\n      <div layout=\"row\" layout-align=\"start center\" flex>\n        <ng-md-icon icon=\"filter_2\" class=\"listIcon listItemHeaderIcon\"></ng-md-icon>\n        <span class=\"paymentSubTitle\" ng-if=\"vm.countAttendees() >= 0\" flex>Attendees <span ng-show=\"vm.countAttendees() < 4\"> {{vm.countAttendees()}} spot{{vm.countAttendees() != 1 ? 's' : ''}} remaining</span></span>\n        <span class=\"paymentSubTitle\" ng-if=\"vm.countAttendees() < 0 \" flex>Attendees <span class=\"red\"> <strong> {{vm.countAttendees() * -1}}</strong> spot{{((vm.countAttendees() * -1) > 1 || (vm.countAttendees() * -1) == 0) ? 's' : ''}} over maximum occupancy</span></span>\n      </div>\n      <div layout=\"row\" layout-align=\"end center\">\n        <div layout=\"column\" layout-align=\"center end\" flex>\n          <ng-md-icon icon=\"{{vm.attendeesExpanded ? 'expand_less' : 'expand_more'}}\" class=\"\"></ng-md-icon>\n        </div>\n      </div>\n    </list-item>\n\n    <div ng-show=\"vm.attendeesExpanded\" ng-class=\"vm.areAttendeesValid()\" layout=\"column\">\n      <div ng-repeat=\"attendee in vm.attendees\">\n        <list-item class=\"md-2-line addOnListItem\">\n          <div layout=\"row\" class=\"list-item-text\" flex>\n            <div layout=\"row\" layout-align=\"start center\" flex>\n              <div layout=\"column\" class=\"\">\n                <span class=\"lineItemSubHeader\">{{attendee.name}}</span>\n\n                <div layout=\"row\">\n                  <span class=\"lineItemSubDetail\">${{attendee.amount/ 100  | number:2}}</span>\n                </div>\n\n              </div>\n            </div>\n\n            <div layout=\"row\" layout-align=\"end center\">\n              <div layout=\"column\" class=\"addOnAdjusters\" layout-align=\"center end\" flex layout-grow>\n                <ng-md-icon icon=\"add_circle_outline\" class=\"listIconSub\" ng-click=\"vm.adjustAttendee($index,'up');\"> </ng-md-icon>\n                <ng-md-icon icon=\" remove_circle_outline\" class=\"listIconSub\" ng-click=\"vm.adjustAttendee($index,'down');\"></ng-md-icon>\n              </div>\n\n              <div layout=\"column\" layout-align=\"end end\">\n                <input class='addOnQuantityText' ng-model=\"attendee.quantity\" ng-change=\"vm.checkAdjustAttendee($index);\" md-select-on-focus></input>\n              </div>\n            </div>\n          </div>\n        </list-item>\n      </div>\n      <div layout=\"row\" layout-align=\"end center\" layout-margin>\n        <md-button ng-if=\"vm.isNextStepPayment('attendees')\" class=\"md-raised md-primary md-hue-2\" ng-disabled=\"!vm.areAttendeesValid()\" ng-click=\"vm.goToNextStep('attendeesStep')\">Next</md-button>\n      </div>\n    </div>\n\n\n    <md-divider class=\"no-margin\"></md-divider>\n\n    <!-- Add ons -->\n    <div ng-if=\"vm.addons.length > 0\">\n      <list-item class=\"paymentHeader md-2-line\" ng-disabled=\"vm.countAttendeesAdded() < 1 || guestDetailsForm.$invalid\" ng-click=\"vm.toggleAddons()\" layout=\"column\" flex>\n        <div layout=\"row\" layout-align=\"start center\" flex>\n          <ng-md-icon icon=\"filter_3\" class=\"listIcon listItemHeaderIcon\"></ng-md-icon>\n          <span class=\"paymentSubTitle\">Add-ons</span>\n        </div>\n        <div layout=\"row\" layout-align=\"end center\">\n          <div layout=\"column\" layout-align=\"center end\" flex>\n            <ng-md-icon ng-show=\"vm.addOnsSelected == 1\" icon=\"check\" class=\"listIcon\"></ng-md-icon>\n            <ng-md-icon icon=\"{{vm.addonsExpanded ? 'expand_less' : 'expand_more'}}\" class=\"listIcon\"></ng-md-icon>\n          </div>\n        </div>\n      </list-item>\n      <md-divider class=\"no-margin\"></md-divider>\n      <div ng-show=\"vm.addonsExpanded\" ng-class=\"vm.areAddonsValid()\">\n        <div ng-repeat=\"addon in vm.addons\">\n          <list-item class=\"md-2-line addOnListItem\">\n            <div layout=\"row\" layout-align=\"start center\" flex>\n              <div layout=\"column\" class=\"\">\n                <span class=\"lineItemSubHeader\">{{addon.name}}</span>\n                <div layout=\"row\" class=\"\">\n                  <span class=\"lineItemSubDetail\">${{addon.amount/ 100  | number:2}}</span>\n                </div>\n              </div>\n            </div>\n            <div layout=\"row\" layout-align=\"end center\">\n              <div layout=\"column\" class=\"addOnAdjusters\" layout-align=\"center end\" flex layout-grow>\n                <ng-md-icon icon=\"add_circle_outline\" class=\"listIconSub\" ng-click=\"vm.adjustAddon($index,'up');\"> </ng-md-icon>\n                <ng-md-icon icon=\" remove_circle_outline\" class=\"listIconSub\" ng-click=\"vm.adjustAddon($index,'down');\"></ng-md-icon>\n              </div>\n              <div layout=\"column\" layout-align=\"end end\">\n                <input class='addOnQuantityText' ng-model=\"addon.quantity\" ng-change=\"vm.addonsChanged();\" md-select-on-focus></input>\n              </div>\n            </div>\n          </list-item>\n        </div>\n\n        <div layout=\"row\" layout-align=\"end center\" layout-margin>\n          <md-button ng-if=\"vm.isNextStepPayment('addons')\" class=\"md-raised md-primary md-hue-2\" ng-click=\"vm.goToNextStep('addonsStep')\">Next</md-button>\n        </div>\n      </div>\n    </div>\n\n    <!--Questions-->\n    <div ng-if=\"vm.questions.length > 0\">\n      <list-item class=\"paymentHeader md-2-line\" ng-disabled=\"guestDetailsForm.$invalid || vm.countAttendeesAdded() < 1\" ng-click=\"vm.toggleQuestions()\">\n        <div layout=\"row\" class=\"list-item-text\" flex>\n          <div layout=\"row\" layout-align=\"start center\" flex>\n            <div layout=\"column\" class=\"\">\n              <div layout=\"row\" layout-align=\"start center\" flex>\n                <ng-md-icon icon=\"filter_4\" class=\"listIcon listItemHeaderIcon\" ng-if=\"vm.addons.length > 0\"></ng-md-icon>\n                <ng-md-icon icon=\"filter_3\" class=\"listIcon listItemHeaderIcon\" ng-if=\"vm.addons.length == 0\"></ng-md-icon>\n                <span class=\"paymentSubTitle\">Booking Questions <i class=\"fa fa-angle-right\" aria-hidden=\"true\"></i> {{vm.bookingQuestionsCompleted()}}/{{vm.questions.length}}</span>\n              </div>\n            </div>\n          </div>\n\n          <div layout=\"row\" layout-align=\"end center\">\n            <div layout=\"column\" layout-align=\"center end\" flex>\n              <ng-md-icon icon=\"{{vm.questionsExpanded ? 'expand_less' : 'expand_more'}}\" class=\"listIcon\"></ng-md-icon>\n            </div>\n          </div>\n        </div>\n      </list-item>\n      <div ng-show=\"vm.questionsExpanded\" ng-class=\"!vm.areBookingQuestionsValid()\">\n        <div class=\"questionForm slideDown\">\n          <div ng-repeat=\"question in vm.questions\" class=\"listItemInputContainer\">\n            <div layout=\"column\" layout-align=\"center stretch\" flex>\n              <label class=\"small-label\">{{question.questionText}}</label>\n              <div layout=\"row\" layout-align=\"start center\">\n                <ng-md-icon icon=\"{{vm.bookingQuestions[$index].length > 0 ? 'done' : 'priority_high'}}\" class=\"inputStatusIcon\"></ng-md-icon>\n                <md-input-container class=\"md-block\" flex>\n                  <textarea name=\"question\" ng-model=\"vm.bookingQuestions[$index]\" md-maxlength=\"300\" rows=\"1\"></textarea>\n                </md-input-container>\n              </div>\n            </div>\n          </div>\n        </div>\n        <div layout=\"row\" layout-align=\"end center\" layout-margin>\n          <md-button class=\"md-raised md-primary md-hue-2\" ng-disabled=\"!dashboard && !vm.areBookingQuestionsValid()\" ng-click=\"vm.goToNextStep('paymentStep')\">Next</md-button>\n        </div>\n      </div>\n      <md-divider class=\"no-margin\"></md-divider>\n    </div>\n\n    <!-- Payment Stripe -->\n    <div>\n      <list-item class=\"paymentHeader md-2-line\" ng-disabled=\"!vm.isPaymentValid()\">\n        <div layout=\"row\" layout-align=\"start center\" flex=\"80\">\n          <ng-md-icon icon=\"filter_5\" class=\"listIcon listItemHeaderIcon\" ng-if=\"vm.addons.length > 0 && vm.questions.length > 0\"></ng-md-icon>\n          <ng-md-icon icon=\"filter_4\" class=\"listIcon listItemHeaderIcon\" ng-if=\"vm.addons.length > 0 && vm.questions.length == 0 || vm.addons.length == 0 && vm.questions.length > 0\"></ng-md-icon>\n          <ng-md-icon icon=\"filter_3\" class=\"listIcon listItemHeaderIcon\" ng-if=\"vm.addons.length == 0 && vm.questions.length == 0\"></ng-md-icon>\n          <span class=\"paymentSubTitle\">Payment Details</span>\n        </div>\n        <div layout=\"row\" layout-align=\"end center\" flex=\"20\">\n          <div layout=\"column\" layout-align=\"center end\" flex>\n            <!--<ng-md-icon icon=\"{{vm.guestDetailsExpanded ? 'expand_less' : 'expand_more'}}\" class=\"listIcon\"></ng-md-icon>\n                <ng-md-icon ng-show=\"!guestDetailsHover && detailsForm.$valid\" icon=\"check\" class=\"listIcon\"></ng-md-icon>-->\n          </div>\n        </div>\n      </list-item>\n      <md-divider class=\"no-margin\"></md-divider>\n      <!--<list-item class=\"activityCardForm\" ng-if=\"app == 'dashboard'\">\n          Dashboard\n        </list-item>-->\n      <!-- <div ng-show=\"vm.stripePaymentExpanded\"> -->\n      <div ng-show=\"vm.stripePaymentExpanded\">\n        <div class=\"radioGroup listItemInputContainer\" ng-if=\"dashboard\">\n          <md-radio-group ng-model=\"vm.paymentMethod\">\n            <md-radio-button value=\"credit\"> Credit Card (Online)</md-radio-button>\n            <md-radio-button value=\"cash\">Cash</md-radio-button>\n            <md-radio-button value=\"debit\"> Office Point of Sale (POS) </md-radio-button>\n            <md-radio-button value=\"gift\"> Gift Card </md-radio-button>\n            <md-radio-button value=\"transfer\"> Bank Transfer </md-radio-button>\n            <md-radio-button value=\"reserved\"> Reservation - Pay Later </md-radio-button>\n          </md-radio-group>\n        </div>\n        <div layout=\"row\" layout-align=\"end center\" layout-margin ng-if=\"vm.paymentMethod != 'credit'\">\n          <progress-button class=\"md-raised md-primary md-hue-2\" ng-disabled=\"vm.countAttendeesAdded() < 1\" loading=\"bookingSuccessResponse == 'processing'\" ng-click=\"bookingSuccessResponse == 'processing' ? null : vm.submitNonCreditCardBooking()\" spinner=\"3\" label=\"{{vm.paymentMethod == 'reserved' ? 'Reserve' : 'Pay' }}\"></progress-button>\n        </div>\n        <div layout=\"row\" layout-align=\"end center\" layout-margin ng-if=\"vm.paymentMethod == 'credit' && dashboard\">\n          <progress-button class=\"md-raised md-primary md-hue-2\" ng-disabled=\"vm.countAttendeesAdded() < 1\" loading=\"bookingSuccessResponse == 'processing'\" ng-click=\"bookingSuccessResponse == 'processing' ? null : vm.goToPay()\" spinner=\"3\" label=\"{{vm.paymentMethod == 'reserved' ? 'Reserve' : 'Pay' }}\"></progress-button>\n        </div>\n      </div>\n      <form method=\"post\" id=\"payment-form\" name=\"creditCardDetailsForm\" ng-show=\"false\">\n        <div class=\"form-row\" style=\"padding:0 30px 20px 20px\">\n          <div id=\"card-errors\"></div>\n          <div id=\"card-element\">\n          </div>\n        </div>\n        <div ng-if=\"vm.waitingForResponse\" layout=\"row\" layout-align=\"space-around center\" style=\"padding:20px\">\n          <md-progress-circular md-mode=\"indeterminate\"></md-progress-circular>\n        </div>\n\n\n        <div layout=\"row\" layout-align=\"end center\" layout-margin>\n          <md-button type=\"submit\" class=\"md-raised md-primary md-hue-2\" ng-class=\"{'valid': vm.isPaymentValid() && vm.stripeCardIsValid && !vm.waitingForResponse}\" ng-disabled=\"!vm.isPaymentValid() || vm.paymentWasSent\" class=\"submitButton\"><i class=\"fa fa-credit-card\" aria-hidden=\"true\"></i> {{vm.paymentMethod == 'reserved' ? 'Reserve' : 'Pay' }}</md-button>\n        </div>\n      </form>\n\n      <div layout=\"row\" ng-if=\"false\">\n        <md-button flex class=\"md-raised md-primary md-hue-2\" ng-disabled=\"!vm.isPaymentValid() || vm.paymentWasSent\" ng-click=\"vm.goToPay()\"><i class=\"fa fa-credit-card\" aria-hidden=\"true\"></i> {{vm.paymentMethod == 'reserved' ? 'Reserve' : 'Pay' }}</md-button>\n      </div>\n\n      <div ng-if=\"!dashboard\">\n        <md-card class=\"transparent no-margin\" ng-show=\"vm.showPaymentForm && paymentResponse.length < 1\">\n          <iframe id=\"paymentIframe\"></iframe>\n        </md-card>\n      </div>\n\n      <!--Payment-->\n      <div class=\"list-item\">\n        <div ng-if=\"vm.loadingIframe\" layout=\"row\" layout-align=\"space-around center\" style=\"padding:20px\">\n          <md-progress-circular md-mode=\"indeterminate\"></md-progress-circular>\n        </div>\n        <iframe ng-style=\"{'height': vm.loadingIframe ? '0' : '100%'}\" id=\"payzenIframe\" class=\"payzenIframe\"></iframe>\n      </div>\n      <md-divider class=\"no-margin\"></md-divider>\n    </div>\n\n\n  </div>\n</div>\n";

/***/ }),
/* 115 */
/***/ (function(module, exports) {

	module.exports = "<!--<div layout=\"row\" class=\"activityPaymentSummaryCard\" ng-class=\"{'activityPaymentSummaryCardMobile' : !screenIsBig()}\" layout-align=\"center start\" flex=\"100\">-->\n<div layout=\"{{screenIsBig() ? 'row' : 'column'}}\" layout-align=\"{{screenIsBig() ? 'start stretch' : 'center center'}}\" layout-fill\n  class=\"columnFix\" ng-class=\"screenIsBig() ? 'activityBookDialogLarge' : 'activityBookDialogSmall'\" ng-show=\"(paymentResponse.length <= 0 && !vm.showPaymentForm) || (!dashboard && paymentResponse.length <= 0)\">\n  <div class=\"paymentSummaryCardLarge leftCard \" ng-class=\"screenIsBig() ? 'leftCardLarge' : 'leftCardSmall'\" layout-align=\"start stretch\">\n    <div ng-include=\"'activity-forms.html'\"></div>\n  </div>\n  <div class=\"paymentSummaryCardLarge rightCard\" ng-class=\"screenIsBig() ? 'rightCardLarge' : 'rightCardSmall'\" layout=\"column\"\n    layout-align=\"center stretch\">\n    <div ng-include=\"'activity-total.html'\"></div>\n  </div>\n</div>\n\n<div ng-if=\"dashboard\">\n  <md-card class=\"paymentSummaryCard no-margin\" ng-show=\"vm.showPaymentForm && paymentResponse.length < 1\">\n    <iframe id=\"paymentIframe\"></iframe>\n  </md-card>\n</div>\n\n<div>\n  <md-card class=\"paymentSummaryCard no-margin\" ng-show=\"paymentResponse.length > 0\">\n    <md-list>\n      <div ng-show=\"paymentResponse == 'success'\" class=\"easeIn\">\n        <md-list-item class=\"paymentHeader md-2-line md-primary\" ng-mouseleave=\"addOnsHover = 0\" ng-mouseenter=\"addOnsHover = 1\"\n          ng-init=\"addOnsHover=0\">\n          <div layout=\"row\" class=\"md-list-item-text \" flex>\n            <div layout=\"row\" layout-align=\"start center\" flex=\"50\" md-colors=\"{color: 'default-primary'}\">\n              <ng-md-icon class=\"listItemHeaderIcon\" icon=\"payment\" class=\"listIcon \"></ng-md-icon>\n              <span class=\"paymentSubTitle total\">{{bookingSuccessResponse.data.booking.status == 'unpaid' ? 'Booking' : 'Payment'}} Complete</span>\n            </div>\n            <div layout=\"row \" layout-align=\"end center \" flex=\"50 \">\n              <span class=\"paymentSubTitle total\" ng-style=\"{color: 'green'}\"></span>\n              <ng-md-icon icon=\"check\" class=\"listIcon \" ng-style=\"{fill: 'green'}\"></ng-md-icon>\n            </div>\n          </div>\n        </md-list-item>\n        <div layout=\"column\" layout-xs=\"column\" layout-padding layout-margin>\n          <div flex=\"100\" flex-gt-sm=\"60\" class=\"confirmation\" layout=\"column\" layout-align=\"space-around center\" ng-if=\"dashboard\"\n            layout-align=\"center center\">\n            <h3>Congratulations!</h3>\n            <div layout=\"row\">Your {{bookingSuccessResponse.data.booking.status == 'unpaid' ? 'reservation' : 'booking'}} is confirmed.</div>\n            <div layout=\"row\" flex layout-wrap>\n              {{bookingSuccessResponse.data.booking.organizations[2].primaryContact.fullName}} is attending {{bookingSuccessResponse.data.booking.title}}\n              on {{formatDate(bookingSuccessResponse.data.booking.startTime, 'LL')}}\n            </div>\n            <div layout=\"row\" flex layout-wrap>\n              A confirmation email will be sent to {{bookingSuccessResponse.data.booking.organizations[0].primaryContact.email}}\n            </div>\n            <span class=\"booking-id\">The reference ID is: {{bookingSuccessResponse.data.booking.bookingId}}</span>\n            <div layout=\"row\" layout-align=\"center center\" flex>\n              <md-button class=\"md-raised md-primary\" ng-click=\"vm.returnToMainPage()\">Return</md-button>\n            </div>\n          </div>\n          <div flex=\"100\" flex-gt-sm=\"40\" class=\"confirmation\" layout=\"column\" ng-if=\"!dashboard\">\n            <h3>Congratulations!</h3>\n            <p>Your booking is confirmed.</p>\n            <p>You will receive a confirmation email at: <strong>{{vm.formData['mail']}}</strong></p>\n            <p class=\"margin-top\">For questions about your booking, please contact:</p>\n            <p><strong>{{bookingSuccessResponse.data.booking.organizations[0].companyName}} ({{bookingSuccessResponse.data.booking.organizations[0].primaryContact.phoneNumber}})</strong></p>\n            <p><strong>{{bookingSuccessResponse.data.booking.organizations[0].primaryContact.email}}</strong></p>\n            <span class=\"booking-id\">Booking ID: {{bookingSuccessResponse.data.booking.bookingId}}</span>\n            <div layout=\"row\" layout-align=\"center center\" flex>\n              <md-button class=\"md-raised md-primary\" ng-click=\"vm.returnToMainPage()\">Return</md-button>\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <div ng-show=\"paymentResponse == 'failed'\">\n\n        <md-list-item class=\"paymentHeader md-2-line md-primary\" md-colors=\"{color: 'default-primary'}\" ng-mouseleave=\"addOnsHover = 0\"\n          ng-mouseenter=\"addOnsHover = 1\" ng-init=\"addOnsHover=0\">\n          <div layout=\"row\" class=\"md-list-item-text \" flex>\n            <div layout=\"row\" layout-align=\"start center\" flex=\"50\" md-colors=\"{color: 'default-warn'}\">\n              <ng-md-icon class=\"listItemHeaderIcon\" icon=\"payment\" class=\"listIcon \"></ng-md-icon>\n\n              <span class=\"paymentSubTitle total\">Payment Failed</span>\n            </div>\n            <div layout=\"row \" layout-align=\"end center \" flex=\"50 \">\n              <span class=\"paymentSubTitle total\" md-colors=\"{color: 'default-warn'}\"></span>\n\n              <ng-md-icon icon=\"error\" class=\"listIcon \" md-colors=\"{fill: 'default-warn'}\"></ng-md-icon>\n\n            </div>\n          </div>\n        </md-list-item>\n\n        <md-list-item>\n          <div layout=\"row\" layout-wrap>\n\n            <p class=\"listMessage\">Your credit card has been declined. Please confirm the information you provided is correct and try again.</p>\n          </div>\n        </md-list-item>\n        <md-list-item>\n          <div layout=\"row\" layout-align=\"end center\" flex>\n            <md-button class=\"md-raised md-primary\" ng-click=\"vm.payNow();\">Try Again</md-button>\n\n          </div>\n        </md-list-item>\n      </div>\n\n\n      <div ng-show=\"paymentResponse == 'processing'\">\n\n        <md-list-item class=\"paymentHeader md-2-line md-primary\" md-colors=\"{color: 'default-primary'}\" ng-mouseleave=\"addOnsHover = 0\"\n          ng-mouseenter=\"addOnsHover = 1\" ng-init=\"addOnsHover=0\">\n\n          <div layout=\"row\" class=\"md-list-item-text \" flex>\n            <div layout=\"row\" layout-align=\"start center\" flex layout-grow md-colors=\"{color: 'default-primary'}\">\n              <ng-md-icon class=\"listItemHeaderIcon\" icon=\"payment\" class=\"listIcon \"></ng-md-icon>\n\n              <span class=\"paymentSubTitle total\">Payment Processing</span>\n            </div>\n            <div layout=\"row \" layout-align=\"end center \">\n              <span class=\"paymentSubTitle total\" ng-style=\"{color: 'green'}\"></span>\n\n              <ng-md-icon icon=\"watch_later\" class=\"listIcon \" ng-style=\"{fill: 'amber'}\"></ng-md-icon>\n\n            </div>\n          </div>\n        </md-list-item>\n        <md-list-item>\n          <div layout=\"row\" layout-wrap>\n\n            <p class=\"listMessage\">Your booking payment is still processing. An e-mail will be sent to {{vm.formData.mail }} with details about\n              your reservation.</p>\n          </div>\n\n        </md-list-item>\n        <md-list-item>\n          <div layout=\"row\" layout-align=\"end center\" flex>\n            <md-button class=\"md-raised md-primary\" ng-click=\"goToState('home');\">Return</md-button>\n          </div>\n        </md-list-item>\n      </div>\n    </md-list>\n  </md-card>\n</div>";

/***/ }),
/* 116 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = activityBookValidator;
	function activityBookValidator(vm, $http, $stateParams) {

	    vm.searchClients = function (query) {
	        return Rx.Observable.fromPromise($http({
	            method: 'GET',
	            url: vm.config.apiVersion + "/clients?fullName=" + text,
	            headers: {
	                'x-abl-access-key': $stateParams.merchant,
	                'x-abl-date': Date.parse(new Date().toISOString())
	            }
	        })).select(function (response) {
	            console.log(response);
	            return response;
	        });
	    };

	    return vm;
	}

/***/ }),
/* 117 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * @class abl-sdk-feathers.components
	 * @hidden
	 */

	/**
	 * @function activity-AdjustmentControls
	 * @memberOf abl-sdk-feathers.components
	 * @description Parent component controller for shared activity adjustment functions.
	 * @example  <activity-adjustment-controls></activity-adjustment-controls>
	 */

	function activityAdjustmentControls() {
	    var vm = this;

	    this.$onInit = function () {
	        console.log('activityAdjustmentControls', this);
	    };

	    this.$onChanges = function (changesObj) {};

	    this.$postLink = function () {};

	    vm.addCharge = function (label, price) {
	        console.log(label, price);
	    };
	};

	exports.default = activityAdjustmentControls;

/***/ })
]);