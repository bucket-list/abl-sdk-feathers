//Including independent module source code for packaging
const ablBook = require('./activity/activity-book.js');

import RxJS from 'rxjs/Rx';
import rx from 'rx-angular';

import feathers from 'feathers-client';
import localstorage from 'feathers-localstorage';

import feathersRx from 'feathers-reactive';
import io from 'socket.io-client';

import feathersAuthentication from './auth';
import setupUtilFunctions from './utils';

import styles from './styles.css';

var sdkProvider = function () {
  var endpoint = null
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
    setFeathersAuth: function (isFeathersAuth) {
      feathersAuth = isFeathersAuth
    },
    setServices: function (newServices) {
      services = newServices
    },
    $get: ['$injector', '$rootScope', '$timeout', '$log', '$mdToast',
      function ($injector, $rootScope, $timeout, $log, $mdToast) {
        var $rootScope = $injector.get('$rootScope');
        var that = this;

        $rootScope.loading = true;
        this.loadingTimeout = null;

        //Add timeout
        $rootScope.afterRender = function (current, total) {
          //$log.debug('after render', current, total,  Math.round(current/total * 100));
          $timeout.cancel(this.loadingTimeout);
          this.loadingTimeout = $timeout(function () {
            //$log.debug('loading', $rootScope.loading);
            $rootScope.loading = false;
          }, 1500);
        };

        if (!endpoint)
          return {};

        this.app = feathers()
          .configure(feathersRx(RxJS)) //feathers-reactive
          .configure(feathers.hooks())
          .use('messages', localstorage({
            storage: window.localStorage
          }));

        var localMessageService = this.app.service('messages');

        localMessageService.on('created', function (message) {
          console.log('Someone created a message', message);
        });

        localMessageService.create({
          text: 'Message from client'
        });

        if (useSocket) {
          console.log('endpoint', endpoint)
          this.socket = io(endpoint, socketOpts)
          this.app.configure(feathers.socketio(this.socket))
        } else {
          this.app.configure(feathers.rest(endpoint).jquery(window.jQuery))
        }

        setupUtilFunctions(this.app, $mdToast, $rootScope);


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
    return sdkProvider();
  }
];

var ablSdk = [
  function $ablProvider() {
    return sdkProvider();
  }
];


import toUpper from './helpers/text-transforms';

angular.module('abl-sdk-feathers', [
    'ngMaterial',
    'rx'
  ])
  .provider('$abl', ablSdk)
  .provider('$feathers', feathersSdk)
  .directive('capitalize', toUpper);