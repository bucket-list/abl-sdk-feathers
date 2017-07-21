//Including independent module source code for packaging
const ablBook = require('./activity/activity-book.js');
const RxJS = window.Rx;

import feathers from 'feathers';
import localstorage from 'feathers-localstorage';
import feathersRx from 'feathers-reactive';


import feathersAuthentication from './auth';
import setupUtilFunctions from './utils';

import styles from './styles.css';
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
    $get: ['$injector', '$rootScope', '$timeout', '$log', '$mdToast', '$http',
      function ($injector, $rootScope, $timeout, $log, $mdToast, $http) {
        var $rootScope = $injector.get('$rootScope');
        var that = this;

        $rootScope.loading = true;
        this.loadingTimeout = null;

        this.loadingTimeout = $timeout(function () {
          $rootScope.loading = false;
        }, 1500);

        //Add timeout
        $rootScope.afterRender = function (current, total) {
          $timeout.cancel(this.loadingTimeout);
          this.loadingTimeout = $timeout(function () {
            $rootScope.loading = false;
          }, 1500);
        };

        if (!endpoint) {
          this.app = {};
          return this.app;
        }

        this.app = feathers()
          .configure(feathersRx(RxJS)) //feathers-reactive
          .configure(feathers.hooks())
          .use('cache', localstorage({
            name: 'abl-am',
            storage: window.localStorage
          }));

        this.app.endpoint = endpoint;
        this.app.apiKey = apiKey;

        if (useSocket) {
          console.log('endpoint', endpoint)
          this.socket = io(endpoint, socketOpts)
          this.app.configure(feathers.socketio(this.socket))
        } else {
          this.app.configure(feathers.rest(endpoint).jquery(window.jQuery))
          this.app.rest.ajaxSetup({
            url: endpoint,
            headers: {
              'X-ABL-Access-Key': this.app.apiKey,
              'X-ABL-Date': Date.parse(new Date().toISOString())
            }
          });
        }

        setupUtilFunctions(this.app, $mdToast, $rootScope);


        rest(this.app, $http);


        if (feathersAuth) {
          this.app = feathersAuthentication(this.app, that, authStorage, $rootScope);
        }

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


import toUpper from './helpers/text-transforms';

angular.module('abl-sdk-feathers', [
    'ngMaterial',
    'rx'
  ]).provider('$abl', ablSdk)
  .provider('$feathers', feathersSdk)
  .directive('capitalize', toUpper)
  .filter('startFrom', function () {
    return function (input, start) {
      start = +start; //parse to int
      return input.slice(start);
    }
  })
  .directive('formatPhone', [
    function () {
      return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, elem, attrs, ctrl, ngModel) {
          elem.add(phonenumber).on('keyup', function () {
            var origVal = elem.val().replace(/[^\w\s]/gi, '');
            if (origVal.length === 10) {
              var str = origVal.replace(/(.{3})/g, "$1-");
              var phone = str.slice(0, -2) + str.slice(-1);
              jQuery("#phonenumber").val(phone);
            }

          });
        }
      };
    }
  ]);