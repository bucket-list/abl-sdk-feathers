/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	"use strict";
	
	var __cov_6twZqbohxsrNDrm7CU0mxA = Function('return this')();
	if (!__cov_6twZqbohxsrNDrm7CU0mxA.__coverage__) {
	   __cov_6twZqbohxsrNDrm7CU0mxA.__coverage__ = {};
	}
	__cov_6twZqbohxsrNDrm7CU0mxA = __cov_6twZqbohxsrNDrm7CU0mxA.__coverage__;
	if (!__cov_6twZqbohxsrNDrm7CU0mxA['/root/abl-sdk-feathers/src/abl-sdk.js']) {
	   __cov_6twZqbohxsrNDrm7CU0mxA['/root/abl-sdk-feathers/src/abl-sdk.js'] = { "path": "/root/abl-sdk-feathers/src/abl-sdk.js", "s": { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0, "11": 0, "12": 0, "13": 0, "14": 0, "15": 0, "16": 0, "17": 0, "18": 0, "19": 0, "20": 0, "21": 0 }, "b": { "1": [0, 0] }, "f": { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0 }, "fnMap": { "1": { "name": "$feathersProvider", "line": 3, "loc": { "start": { "line": 5, "column": 4 }, "end": { "line": 5, "column": 33 } } }, "2": { "name": "setAuthStorage", "line": 13, "loc": { "start": { "line": 15, "column": 24 }, "end": { "line": 15, "column": 49 } } }, "3": { "name": "setSocketOpts", "line": 16, "loc": { "start": { "line": 18, "column": 23 }, "end": { "line": 18, "column": 38 } } }, "4": { "name": "useSocket", "line": 19, "loc": { "start": { "line": 21, "column": 19 }, "end": { "line": 21, "column": 43 } } }, "5": { "name": "setEndpoint", "line": 22, "loc": { "start": { "line": 24, "column": 21 }, "end": { "line": 24, "column": 43 } } }, "6": { "name": "(anonymous_6)", "line": 25, "loc": { "start": { "line": 28, "column": 10 }, "end": { "line": 28, "column": 21 } } }, "7": { "name": "(anonymous_7)", "line": 43, "loc": { "start": { "line": 48, "column": 38 }, "end": { "line": 48, "column": 53 } } } }, "statementMap": { "1": { "start": { "line": 1, "column": 0 }, "end": { "line": 1, "column": 0 } }, "2": { "start": { "line": 8, "column": 6 }, "end": { "line": 8, "column": 6 } }, "3": { "start": { "line": 9, "column": 6 }, "end": { "line": 9, "column": 6 } }, "4": { "start": { "line": 10, "column": 6 }, "end": { "line": 10, "column": 6 } }, "5": { "start": { "line": 11, "column": 6 }, "end": { "line": 11, "column": 6 } }, "6": { "start": { "line": 14, "column": 6 }, "end": { "line": 14, "column": 6 } }, "7": { "start": { "line": 16, "column": 10 }, "end": { "line": 16, "column": 10 } }, "8": { "start": { "line": 19, "column": 10 }, "end": { "line": 19, "column": 10 } }, "9": { "start": { "line": 22, "column": 10 }, "end": { "line": 22, "column": 10 } }, "10": { "start": { "line": 25, "column": 10 }, "end": { "line": 25, "column": 10 } }, "11": { "start": { "line": 29, "column": 12 }, "end": { "line": 29, "column": 12 } }, "12": { "start": { "line": 32, "column": 12 }, "end": { "line": 38, "column": 13 } }, "13": { "start": { "line": 33, "column": 14 }, "end": { "line": 33, "column": 14 } }, "14": { "start": { "line": 34, "column": 14 }, "end": { "line": 34, "column": 14 } }, "15": { "start": { "line": 37, "column": 14 }, "end": { "line": 37, "column": 14 } }, "16": { "start": { "line": 40, "column": 12 }, "end": { "line": 40, "column": 12 } }, "17": { "start": { "line": 44, "column": 12 }, "end": { "line": 44, "column": 12 } }, "18": { "start": { "line": 45, "column": 12 }, "end": { "line": 45, "column": 12 } }, "19": { "start": { "line": 48, "column": 12 }, "end": { "line": 48, "column": 12 } }, "20": { "start": { "line": 49, "column": 14 }, "end": { "line": 49, "column": 14 } }, "21": { "start": { "line": 52, "column": 12 }, "end": { "line": 52, "column": 12 } } }, "branchMap": { "1": { "line": 28, "type": "if", "locations": [{ "start": { "line": 32, "column": 12 }, "end": { "line": 32, "column": 12 } }, { "start": { "line": 32, "column": 12 }, "end": { "line": 32, "column": 12 } }] } }, "code": ["angular", "  .module('abl-sdk-feathers', [])", "  .factory()", "  .provider('$feathers', [", "    function $feathersProvider() {", "      //OK this works and we can still keep configuring it the same way we were before :) ", "      //muy bien", "      var endpoint = null", "      var socketOpts = null", "      var useSocket = true", "      var authStorage = window.localStorage", "", "      //Configuration", "      return {", "        setAuthStorage: function(newAuthStorage) {", "          authStorage = newAuthStorage", "        },", "        setSocketOpts: function(opts) {", "          socketOpts = opts", "        },", "        useSocket: function(socketEnabled) {", "          useSocket = !!socketEnabled", "        },", "        setEndpoint: function(newEndpoint) {", "          endpoint = newEndpoint", "        },", "        $get: [", "          function() {", "            this.app = feathers()", "              .configure(feathers.hooks())", "", "            if (useSocket) {", "              this.socket = io(endpoint, socketOpts)", "              this.app.configure(feathers.socketio(this.socket))", "            }", "            else {", "              this.app.configure(feathers.rest(endpoint).jquery(window.jQuery))", "            }", "", "            this.app.configure(feathers.authentication({", "              storage: authStorage", "            }));", "            ", "            var unitService = this.app.service('unit-types');", "            var testService = this.app.service('testService');", "            ", "            //Okay this is working", "            unitService.on('created', function(unit) {", "              console.log('Created a unit-type: ', unit);", "            });", "", "            return this.app", "          }", "        ]", "      }", "    }", "  ]);"] };
	}
	__cov_6twZqbohxsrNDrm7CU0mxA = __cov_6twZqbohxsrNDrm7CU0mxA['/root/abl-sdk-feathers/src/abl-sdk.js'];
	__cov_6twZqbohxsrNDrm7CU0mxA.s['1']++;angular.module('abl-sdk-feathers', []).factory().provider('$feathers', [function $feathersProvider() {
	   __cov_6twZqbohxsrNDrm7CU0mxA.f['1']++;__cov_6twZqbohxsrNDrm7CU0mxA.s['2']++;var endpoint = null;__cov_6twZqbohxsrNDrm7CU0mxA.s['3']++;var socketOpts = null;__cov_6twZqbohxsrNDrm7CU0mxA.s['4']++;var _useSocket = true;__cov_6twZqbohxsrNDrm7CU0mxA.s['5']++;var authStorage = window.localStorage;__cov_6twZqbohxsrNDrm7CU0mxA.s['6']++;return { setAuthStorage: function setAuthStorage(newAuthStorage) {
	         __cov_6twZqbohxsrNDrm7CU0mxA.f['2']++;__cov_6twZqbohxsrNDrm7CU0mxA.s['7']++;authStorage = newAuthStorage;
	      }, setSocketOpts: function setSocketOpts(opts) {
	         __cov_6twZqbohxsrNDrm7CU0mxA.f['3']++;__cov_6twZqbohxsrNDrm7CU0mxA.s['8']++;socketOpts = opts;
	      }, useSocket: function useSocket(socketEnabled) {
	         __cov_6twZqbohxsrNDrm7CU0mxA.f['4']++;__cov_6twZqbohxsrNDrm7CU0mxA.s['9']++;_useSocket = !!socketEnabled;
	      }, setEndpoint: function setEndpoint(newEndpoint) {
	         __cov_6twZqbohxsrNDrm7CU0mxA.f['5']++;__cov_6twZqbohxsrNDrm7CU0mxA.s['10']++;endpoint = newEndpoint;
	      }, $get: [function () {
	         __cov_6twZqbohxsrNDrm7CU0mxA.f['6']++;__cov_6twZqbohxsrNDrm7CU0mxA.s['11']++;this.app = feathers().configure(feathers.hooks());__cov_6twZqbohxsrNDrm7CU0mxA.s['12']++;if (_useSocket) {
	            __cov_6twZqbohxsrNDrm7CU0mxA.b['1'][0]++;__cov_6twZqbohxsrNDrm7CU0mxA.s['13']++;this.socket = io(endpoint, socketOpts);__cov_6twZqbohxsrNDrm7CU0mxA.s['14']++;this.app.configure(feathers.socketio(this.socket));
	         } else {
	            __cov_6twZqbohxsrNDrm7CU0mxA.b['1'][1]++;__cov_6twZqbohxsrNDrm7CU0mxA.s['15']++;this.app.configure(feathers.rest(endpoint).jquery(window.jQuery));
	         }__cov_6twZqbohxsrNDrm7CU0mxA.s['16']++;this.app.configure(feathers.authentication({ storage: authStorage }));__cov_6twZqbohxsrNDrm7CU0mxA.s['17']++;var unitService = this.app.service('unit-types');__cov_6twZqbohxsrNDrm7CU0mxA.s['18']++;var testService = this.app.service('testService');__cov_6twZqbohxsrNDrm7CU0mxA.s['19']++;unitService.on('created', function (unit) {
	            __cov_6twZqbohxsrNDrm7CU0mxA.f['7']++;__cov_6twZqbohxsrNDrm7CU0mxA.s['20']++;console.log('Created a unit-type: ', unit);
	         });__cov_6twZqbohxsrNDrm7CU0mxA.s['21']++;return this.app;
	      }] };
	}]);

/***/ }
/******/ ]);
//# sourceMappingURL=abl-sdk.js.map