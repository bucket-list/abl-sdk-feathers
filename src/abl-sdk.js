//Including independent module source code for packaging
const ablBook = require('./activity/activity-book.js');
import RxJS from 'rx';

const jQuery = window.jQuery;

import feathers from 'feathers-client';
import localstorage from 'feathers-localstorage';
import feathersRx from 'feathers-reactive';
import superagent from 'superagent';

import rxa from 'rx-angular/dist/rx.angular';

// import feathersAuthentication from './auth';
import setupUtilFunctions from './utils';

import styles from './styles.css';
import helperStyles from './lib/helper-styles.css';
// import pStyles from './datePicker/picker.css';

import rest from './rest';

var sdkProvider = function (settings) {

  var endpoint = null
  var apiKey = null
  var socketOpts = null
  var useSocket = true
  var services = [];

  //Configuration
  return {
    useSocket: function (socketEnabled) {
      useSocket = !!socketEnabled
    },
    setSocketOpts: function (opts) {
      socketOpts = opts
    },
    setEndpoint: function (newEndpoint) {
      endpoint = newEndpoint
    },
    setApiKey: function (key) {
      apiKey = key
    },
    setServices: function (newServices) {
      services = newServices
    },
    getSettings: function () {
      return endpoint;
    },
    $get: [
      '$injector',
      '$timeout',
      '$log',
      '$mdToast',
      '$http',
      function ($injector, $timeout, $log, $mdToast, $http) {
        var $rootScope = $injector.get('$rootScope');
        var that = this;

        if (!endpoint) {
          this.app = {};
          return this.app;
        }

        console.log('config', $rootScope.config);

        this.app = feathers().configure(feathersRx(RxJS)) //feathers-reactive
          .configure(feathers.hooks())
          .use('cache', localstorage({
            name: 'abl' + ($rootScope.config.DASHBOARD
              ? '-dash'
              : ''),
            storage: window.localStorage
          }));

        this.app.endpoint = endpoint;
        this.app.apiKey = apiKey;

        var xsrfCookieIndex = document
          .cookie
          .indexOf('XSRF-TOKEN=');

        var xsrfToken = '';

        console.log(document.cookie);

        this.app.headers = {
          "Content-Type": "application/json;charset=utf-8"
        };

        if (apiKey) {
          this.app.headers = {
            'X-ABL-Access-Key': apiKey,
            'X-ABL-Date': Date.parse(new Date().toISOString()),
            "Content-Type": "application/json;charset=utf-8"
          }
        }

        // if (xsrfCookieIndex > -1) {   var nextCharacter = xsrfCookieIndex + 12;   for
        // (var i = xsrfCookieIndex + 11; i < document.cookie.length; i++) {     if
        // (document.cookie.substring(i, i + 1) == ' ' || document.cookie.substring(i, i
        // + 1) == ';')       i = document.cookie.length;     else       xsrfToken +=
        // document         .cookie         .substring(i, i + 1);     }
        // console.log('xsrf cookie', xsrfToken); }

        if (useSocket) {
          console.log('endpoint', endpoint)
          this.socket = io(endpoint, socketOpts)
          this
            .app
            .configure(feathers.socketio(this.socket))
        } else {
          this
            .app
            .configure(feathers.rest(endpoint).jquery(window.jQuery, {
              headers: that.app.headers,
              withCredentials: true
            }))
          // .configure(feathers.rest(endpoint).superagent(superagent, {   headers:
          // that.app.headers,   withCredentials: true })) Hook for adding headers to all
          // service calls
          function addHeadersHook(hook) {
            var x = document
              .cookie
              .split(";")
              .map(function (s) {
                return s.split("=")
              })
              .reduce(function (r, a) {
                r[a[0].trim()] = a[1];
                return r
              }, {});

            xsrfToken = x["XSRF-TOKEN"] || undefined
            console.log('xsrf ', xsrfToken);

            if (xsrfToken) 
              that.app.headers['X-XSRF-TOKEN'] = xsrfToken

            hook.params.headers = Object.assign({}, that.app.headers, hook.params.headers);
            hook.params.withCredentials = true;
          }

          function afterRequestHook(hook) {
            // console.log('afterRequestHook ', hook);
          }

          // Mixin automatically adds hook to all services
          this
            .app
            .mixins
            .push(function (service) {
              service.before(addHeadersHook);
              service.after(afterRequestHook);
            });

        }

        setupUtilFunctions(this.app, $mdToast, $rootScope);

        rest(this.app, $http);

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

        window.$abl = this.app;
        window.$http = $http;

        return this.app
      }
    ]
  }
};

//Old naming convention, left for backwards compatibility
var feathersSdk = [function $feathersProvider() {
    return sdkProvider('feathers');
  }
];

var ablSdk = [function $ablProvider() {
    return sdkProvider('abl');
  }
];

import toUppercase from './lib/directives/toUppercase.directive';
import formatPhone from './lib/directives/formatPhone.directive';
import onFocus from './lib/directives/focusParent.directive';
import size from './lib/directives/size.directive';

import navigatorService from './lib/services/navigator.service';

import col from './lib/components/col.component';

import progressButton from './lib/components/progressButton.component';
import progressButtonStyles from './lib/components/progressButton.css';

import listItem from './lib/components/listItem.component';
import listItemNumericControl from './lib/components/listItemNumericControl.component';
import listItemAddCharge from './lib/components/listItemAddCharge.component';
import listItemHeader from './lib/components/listItemHeader.component';

/**
 * @namespace abl-sdk-feathers
 * @requires feathers
 * @requires RxJS
 * @requires rx-angular
 * @requires socket.io-client

 */
export default angular.module('abl-sdk-feathers', ['ngMaterial', 'rx'])
/**
   * @class abl-sdk-feathers.$abl
   */
  .provider('$abl', ablSdk)
  .provider('$feathers', feathersSdk)
  .filter('startFrom', function () {
    return function (input, start) {
      start = +start; //parse to int
      return input.slice(start);
    }
  })
  .service('navigatorService', navigatorService)
  .directive('toUppercase', toUppercase)
  .directive('formatPhone', formatPhone)
  .directive('onFocus', onFocus)
  // .directive('size', size)
  .directive('formatPhone', formatPhone)
  .component('colSection', col)
  .component('progressButton', progressButton)
  .component('listItem', listItem)
  .component('listItemNumericControl', listItemNumericControl)
  .component('listItemAddCharge', listItemAddCharge)
  .component('listItemHeader', listItemHeader);