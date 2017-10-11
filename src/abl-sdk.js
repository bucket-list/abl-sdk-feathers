//Including independent module source code for packaging
const ablBook = require('./activity/activity-book.js');
import RxJS from 'rx';

const jQuery = window.jQuery;

import feathers from 'feathers-client';
import localstorage from 'feathers-localstorage';
import feathersRx from 'feathers-reactive';

import rxa from 'rx-angular/dist/rx.angular';

// import feathersAuthentication from './auth';
import setupUtilFunctions from './utils';

import styles from './styles.css';
import helperStyles from './lib/helper-styles.css';

import pStyles from './datePicker/picker.css';

import rest from './rest';

var sdkProvider = function (settings) {


  var endpoint = null
  var apiKey = null
  var socketOpts = null

  var feathersAuth = false
  var useSocket = true
  var authStorage = window.localStorage
  var services = [];
  //Configuration
  return {
    setAuthStorage: function (newAuthStorage) {
      authStorage = newAuthStorage
    },
    setSocketOpts: function (opts) {
      socketOpts = opts
    },
    useSocket: function (socketEnabled) {
      useSocket = !!socketEnabled
    },
    setEndpoint: function (newEndpoint) {
      endpoint = newEndpoint
    },
    setApiKey: function (key) {
      apiKey = key
    },

    setFeathersAuth: function (isFeathersAuth) {
      feathersAuth = isFeathersAuth
    },
    setServices: function (newServices) {
      services = newServices
    },
    getSettings: function () {
      return endpoint;
    },
    $get: ['$injector', '$timeout', '$log', '$mdToast', '$http',
      function ($injector, $timeout, $log, $mdToast, $http) {
        var $rootScope = $injector.get('$rootScope');
        var that = this;

        if (!endpoint) {
          this.app = {};
          return this.app;
        }

        this.app = feathers()
          .configure(feathersRx(RxJS)) //feathers-reactive
          .configure(feathers.hooks())
          .use('cache', localstorage({
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
          }
        }

        if (useSocket) {
          console.log('endpoint', endpoint)
          this.socket = io(endpoint, socketOpts)
          this.app.configure(feathers.socketio(this.socket))
        } else {
          this.app.configure(feathers.rest(endpoint).jquery(jQuery))
          this.app.rest.ajaxSetup({
            url: endpoint,
            headers: {}
          });
        }

        setupUtilFunctions(this.app, $mdToast, $rootScope);

        rest(this.app, $http);

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

        console.log('$abl', this.app)
        window.$abl = this.app;
        return this.app
      }
    ]
  }
};


//Old naming convention, left for backwards compatibility
var feathersSdk = [
  function $feathersProvider() {
    return sdkProvider('feathers');
  }
];

var ablSdk = [
  function $ablProvider() {
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
export default angular.module('abl-sdk-feathers', [
    'ngMaterial',
    'rx'
  ])
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