/******/ (function(modules) { // webpackBootstrap
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(callback) { // eslint-disable-line no-unused-vars
/******/ 		if(typeof XMLHttpRequest === "undefined")
/******/ 			return callback(new Error("No browser support"));
/******/ 		try {
/******/ 			var request = new XMLHttpRequest();
/******/ 			var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 			request.open("GET", requestPath, true);
/******/ 			request.timeout = 10000;
/******/ 			request.send(null);
/******/ 		} catch(err) {
/******/ 			return callback(err);
/******/ 		}
/******/ 		request.onreadystatechange = function() {
/******/ 			if(request.readyState !== 4) return;
/******/ 			if(request.status === 0) {
/******/ 				// timeout
/******/ 				callback(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 			} else if(request.status === 404) {
/******/ 				// no update available
/******/ 				callback();
/******/ 			} else if(request.status !== 200 && request.status !== 304) {
/******/ 				// other failure
/******/ 				callback(new Error("Manifest request to " + requestPath + " failed."));
/******/ 			} else {
/******/ 				// success
/******/ 				try {
/******/ 					var update = JSON.parse(request.responseText);
/******/ 				} catch(e) {
/******/ 					callback(e);
/******/ 					return;
/******/ 				}
/******/ 				callback(null, update);
/******/ 			}
/******/ 		};
/******/ 	}

/******/ 	
/******/ 	
/******/ 	// Copied from https://github.com/facebook/react/blob/bef45b0/src/shared/utils/canDefineProperty.js
/******/ 	var canDefineProperty = false;
/******/ 	try {
/******/ 		Object.defineProperty({}, "x", {
/******/ 			get: function() {}
/******/ 		});
/******/ 		canDefineProperty = true;
/******/ 	} catch(x) {
/******/ 		// IE will fail on defineProperty
/******/ 	}
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "89ba32d3072b2725cd77"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					if(me.children.indexOf(request) < 0)
/******/ 						me.children.push(request);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				if(canDefineProperty) {
/******/ 					Object.defineProperty(fn, name, (function(name) {
/******/ 						return {
/******/ 							configurable: true,
/******/ 							enumerable: true,
/******/ 							get: function() {
/******/ 								return __webpack_require__[name];
/******/ 							},
/******/ 							set: function(value) {
/******/ 								__webpack_require__[name] = value;
/******/ 							}
/******/ 						};
/******/ 					}(name)));
/******/ 				} else {
/******/ 					fn[name] = __webpack_require__[name];
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		function ensure(chunkId, callback) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			__webpack_require__.e(chunkId, function() {
/******/ 				try {
/******/ 					callback.call(null, fn);
/******/ 				} finally {
/******/ 					finishChunkLoading();
/******/ 				}
/******/ 	
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		}
/******/ 		if(canDefineProperty) {
/******/ 			Object.defineProperty(fn, "e", {
/******/ 				enumerable: true,
/******/ 				value: ensure
/******/ 			});
/******/ 		} else {
/******/ 			fn.e = ensure;
/******/ 		}
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback;
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback;
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 				else
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailibleFilesMap = {};
/******/ 	var hotCallback;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply, callback) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		if(typeof apply === "function") {
/******/ 			hotApplyOnUpdate = false;
/******/ 			callback = apply;
/******/ 		} else {
/******/ 			hotApplyOnUpdate = apply;
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 		hotSetStatus("check");
/******/ 		hotDownloadManifest(function(err, update) {
/******/ 			if(err) return callback(err);
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				callback(null, null);
/******/ 				return;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotAvailibleFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			for(var i = 0; i < update.c.length; i++)
/******/ 				hotAvailibleFilesMap[update.c[i]] = true;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			hotCallback = callback;
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailibleFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailibleFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var callback = hotCallback;
/******/ 		hotCallback = null;
/******/ 		if(!callback) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate, callback);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			callback(null, outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options, callback) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		if(typeof options === "function") {
/******/ 			callback = options;
/******/ 			options = {};
/******/ 		} else if(options && typeof options === "object") {
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		} else {
/******/ 			options = {};
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function getAffectedStuff(module) {
/******/ 			var outdatedModules = [module];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice();
/******/ 			while(queue.length > 0) {
/******/ 				var moduleId = queue.pop();
/******/ 				var module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return new Error("Aborted because of self decline: " + moduleId);
/******/ 				}
/******/ 				if(moduleId === 0) {
/******/ 					return;
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return new Error("Aborted because of declined dependency: " + moduleId + " in " + parentId);
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push(parentId);
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return [outdatedModules, outdatedDependencies];
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				var moduleId = toModuleId(id);
/******/ 				var result = getAffectedStuff(moduleId);
/******/ 				if(!result) {
/******/ 					if(options.ignoreUnaccepted)
/******/ 						continue;
/******/ 					hotSetStatus("abort");
/******/ 					return callback(new Error("Aborted because " + moduleId + " is not accepted"));
/******/ 				}
/******/ 				if(result instanceof Error) {
/******/ 					hotSetStatus("abort");
/******/ 					return callback(result);
/******/ 				}
/******/ 				appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 				addAllToSet(outdatedModules, result[0]);
/******/ 				for(var moduleId in result[1]) {
/******/ 					if(Object.prototype.hasOwnProperty.call(result[1], moduleId)) {
/******/ 						if(!outdatedDependencies[moduleId])
/******/ 							outdatedDependencies[moduleId] = [];
/******/ 						addAllToSet(outdatedDependencies[moduleId], result[1][moduleId]);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(var i = 0; i < outdatedModules.length; i++) {
/******/ 			var moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			var moduleId = queue.pop();
/******/ 			var module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(var j = 0; j < disposeHandlers.length; j++) {
/******/ 				var cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(var j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				var idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				for(var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 					var dependency = moduleOutdatedDependencies[j];
/******/ 					var idx = module.children.indexOf(dependency);
/******/ 					if(idx >= 0) module.children.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(var moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(var i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					var dependency = moduleOutdatedDependencies[i];
/******/ 					var cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(var i = 0; i < callbacks.length; i++) {
/******/ 					var cb = callbacks[i];
/******/ 					try {
/******/ 						cb(outdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(var i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			var moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else if(!error)
/******/ 					error = err;
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return callback(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		callback(null, outdatedModules);
/******/ 	}

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
/******/ 			loaded: false,
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: hotCurrentParents,
/******/ 			children: []
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));

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

/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };

/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _feathers = __webpack_require__(2);

	var _feathers2 = _interopRequireDefault(_feathers);

	var _feathersLocalstorage = __webpack_require__(3);

	var _feathersLocalstorage2 = _interopRequireDefault(_feathersLocalstorage);

	var _feathersReactive = __webpack_require__(16);

	var _feathersReactive2 = _interopRequireDefault(_feathersReactive);

	var _auth = __webpack_require__(21);

	var _auth2 = _interopRequireDefault(_auth);

	var _utils = __webpack_require__(22);

	var _utils2 = _interopRequireDefault(_utils);

	var _styles = __webpack_require__(23);

	var _styles2 = _interopRequireDefault(_styles);

	var _picker = __webpack_require__(28);

	var _picker2 = _interopRequireDefault(_picker);

	var _rest = __webpack_require__(30);

	var _rest2 = _interopRequireDefault(_rest);

	var _textTransforms = __webpack_require__(32);

	var _textTransforms2 = _interopRequireDefault(_textTransforms);

	var _picker3 = __webpack_require__(33);

	var _picker4 = _interopRequireDefault(_picker3);

	var _service = __webpack_require__(34);

	var _service2 = _interopRequireDefault(_service);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	//Including independent module source code for packaging
	var ablBook = __webpack_require__(35);
	var RxJS = window.Rx;

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
	    $get: ['$injector', '$rootScope', '$timeout', '$log', '$mdToast', '$http', function ($injector, $rootScope, $timeout, $log, $mdToast, $http) {
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

	      this.app = (0, _feathers2.default)().configure((0, _feathersReactive2.default)(RxJS)) //feathers-reactive
	      .configure(_feathers2.default.hooks()).use('cache', (0, _feathersLocalstorage2.default)({
	        name: 'abl-am',
	        storage: window.localStorage
	      }));

	      this.app.endpoint = endpoint;
	      this.app.apiKey = apiKey;

	      if (_useSocket) {
	        console.log('endpoint', endpoint);
	        this.socket = io(endpoint, socketOpts);
	        this.app.configure(_feathers2.default.socketio(this.socket));
	      } else {
	        this.app.configure(_feathers2.default.rest(endpoint).jquery(window.jQuery));
	        this.app.rest.ajaxSetup({
	          url: endpoint,
	          headers: {
	            'X-ABL-Access-Key': this.app.apiKey,
	            'X-ABL-Date': Date.parse(new Date().toISOString())
	          }
	        });
	      }

	      (0, _utils2.default)(this.app, $mdToast, $rootScope);

	      (0, _rest2.default)(this.app, $http);

	      if (feathersAuth) {
	        this.app = (0, _auth2.default)(this.app, that, authStorage, $rootScope);
	      }

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

	angular.module('abl-sdk-feathers', ['ngMaterial', 'rx']).provider('$abl', ablSdk).provider('$feathers', feathersSdk).directive('capitalize', _textTransforms2.default).filter('startFrom', function () {
	  return function (input, start) {
	    start = +start; //parse to int
	    return input.slice(start);
	  };
	}).directive('formatPhone', [function () {
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
	    }
	  };
	}]);

	function Calender(picker) {
	  return {
	    restrict: 'E',
	    replace: false,
	    require: ['^ngModel', 'smCalender'],
	    scope: {
	      minDate: '=',
	      maxDate: '=',
	      initialDate: '=',
	      format: '@',
	      mode: '@',
	      startView: '@',
	      weekStartDay: '@',
	      disableYearSelection: '@',
	      dateSelectCall: '&'
	    },
	    controller: ['$scope', '$timeout', 'picker', '$mdMedia', CalenderCtrl],
	    controllerAs: 'vm',
	    templateUrl: 'picker/calender-date.html',
	    link: function link(scope, element, attr, ctrls) {
	      var ngModelCtrl = ctrls[0];
	      var calCtrl = ctrls[1];
	      calCtrl.configureNgModel(ngModelCtrl);
	    }
	  };
	}

	var CalenderCtrl = function CalenderCtrl($scope, $timeout, picker, $mdMedia) {
	  var self = this;

	  self.$scope = $scope;
	  self.$timeout = $timeout;
	  self.picker = picker;
	  self.dayHeader = self.picker.dayHeader;
	  self.colorIntention = picker.colorIntention;
	  self.initialDate = $scope.initialDate;
	  self.viewModeSmall = $mdMedia('xs');
	  self.startDay = angular.isUndefined($scope.weekStartDay) || $scope.weekStartDay === '' ? 'Sunday' : $scope.weekStartDay;
	  self.minDate = $scope.minDate || undefined; //Minimum date
	  self.maxDate = $scope.maxDate || undefined; //Maximum date
	  self.mode = angular.isUndefined($scope.mode) ? 'DATE' : $scope.mode;
	  self.format = angular.isUndefined($scope.format) ? picker.format : $scope.format;
	  self.restrictToMinDate = angular.isUndefined(self.minDate) ? false : true;
	  self.restrictToMaxDate = angular.isUndefined(self.maxDate) ? false : true;
	  self.stopScrollPrevious = false;
	  self.stopScrollNext = false;
	  self.disableYearSelection = $scope.disableYearSelection;
	  self.monthCells = [];
	  self.dateCellHeader = [];
	  self.dateCells = [];
	  self.monthList = moment.monthsShort();
	  self.moveCalenderAnimation = '';

	  self.format = angular.isUndefined(self.format) ? 'MM-DD-YYYY' : self.format;
	  self.initialDate = angular.isUndefined(self.initialDate) ? moment() : moment(self.initialDate, self.format);

	  self.currentDate = self.initialDate.clone();
	  self.minYear = 1900;
	  self.maxYear = 3000;

	  if (self.restrictToMinDate) {
	    if (!moment.isMoment(self.minDate)) {
	      self.minDate = moment(self.minDate, self.format);
	    }
	    /* the below code is giving some errors. It was added by Pablo Reyes, but I still need to check what
	    he intended to fix.
	    if(moment.isMoment(self.minDate)){
	        self.minDate = self.minDate.subtract(1, 'd').startOf('day');
	    }else{
	        self.minDate = moment(self.minDate, self.format).subtract(1, 'd').startOf('day');
	    }
	    self.minYear = self.minDate.year();
	    */
	  }

	  if (self.restrictToMaxDate) {
	    if (!moment.isMoment(self.maxDate)) {
	      self.maxDate = moment(self.maxDate, self.format).startOf('day');
	      self.maxYear = self.maxDate.year();
	    }
	  }

	  self.yearItems = {
	    currentIndex_: 1,
	    PAGE_SIZE: 7,
	    START: self.minYear,
	    getItemAtIndex: function getItemAtIndex(index) {
	      if (!this.START + index <= self.maxYear) {
	        return this.START + index;
	      } else {
	        return this.START;
	      }

	      if (this.currentIndex_ < index) {
	        this.currentIndex_ = index;
	        return this.START + index;
	      }
	      if (this.currentIndex_ < index) {
	        this.currentIndex_ = index;
	      }
	      return this.START + index;
	    },
	    getLength: function getLength() {
	      return this.currentIndex_ + Math.floor(this.PAGE_SIZE / 2);
	    }
	  };

	  self.init();
	};

	CalenderCtrl.prototype.setInitDate = function (dt) {
	  var self = this;
	  self.initialDate = angular.isUndefined(dt) ? moment() : moment(dt, self.format);
	};

	CalenderCtrl.prototype.configureNgModel = function (ngModelCtrl) {
	  var self = this;
	  self.ngModelCtrl = ngModelCtrl;

	  self.ngModelCtrl.$formatters.push(function (dateValue) {

	    if (self.format) {
	      if (dateValue) {
	        if (moment.isMoment(dateValue)) {
	          self.initialDate = dateValue;
	        } else {
	          self.initialDate = moment(dateValue, self.format);
	        }
	      }
	      self.currentDate = self.initialDate.clone();
	      self.buildDateCells();
	    }
	  });
	};

	CalenderCtrl.prototype.setNgModelValue = function (date) {
	  var self = this;
	  self.ngModelCtrl.$setViewValue(date);
	  self.ngModelCtrl.$render();
	};

	CalenderCtrl.prototype.init = function () {
	  var self = this;
	  self.buildDateCells();
	  self.buildDateCellHeader();
	  self.buildMonthCells();
	  self.setView();
	  self.showYear();
	};

	CalenderCtrl.prototype.setView = function () {
	  var self = this;
	  self.headerDispalyFormat = 'ddd, MMM DD';
	  switch (self.mode) {
	    case 'date-time':
	      self.view = 'DATE';
	      self.headerDispalyFormat = 'ddd, MMM DD HH:mm';
	      break;
	    case 'time':
	      self.view = 'HOUR';
	      self.headerDispalyFormat = 'HH:mm';
	      break;
	    default:
	      self.view = 'DATE';
	  }
	};

	CalenderCtrl.prototype.showYear = function () {
	  var self = this;
	  self.yearTopIndex = self.initialDate.year() - self.yearItems.START + Math.floor(self.yearItems.PAGE_SIZE / 2);
	  self.yearItems.currentIndex_ = self.initialDate.year() - self.yearItems.START - 1;
	};

	CalenderCtrl.prototype.buildMonthCells = function () {
	  var self = this;
	  self.monthCells = moment.months();
	};

	CalenderCtrl.prototype.buildDateCells = function () {
	  var self = this;
	  var currentMonth = self.initialDate.month();
	  var calStartDate = self.initialDate.clone().date(0).day(self.startDay).startOf('day');
	  var lastDayOfMonth = self.initialDate.clone().endOf('month');
	  var weekend = false;
	  var isDisabledDate = false;
	  /*
	  Check if min date is greater than first date of month
	  if true than set stopScrollPrevious=true
	  */
	  if (!angular.isUndefined(self.minDate)) {
	    self.stopScrollPrevious = self.minDate.unix() >= calStartDate.unix();
	  }
	  self.dateCells = [];
	  for (var i = 0; i < 6; i++) {
	    var week = [];
	    for (var j = 0; j < 7; j++) {

	      var isCurrentMonth = calStartDate.month() === currentMonth;

	      isDisabledDate = isCurrentMonth ? false : true;
	      //if(isCurrentMonth){isDisabledDate=false}else{isDisabledDate=true};

	      if (self.restrictToMinDate && !angular.isUndefined(self.minDate) && !isDisabledDate) isDisabledDate = self.minDate.isAfter(calStartDate);

	      if (self.restrictToMaxDate && !angular.isUndefined(self.maxDate) && !isDisabledDate) isDisabledDate = self.maxDate.isBefore(calStartDate);

	      var day = {
	        date: calStartDate.clone(),
	        dayNum: isCurrentMonth ? calStartDate.date() : '',
	        month: calStartDate.month(),
	        today: calStartDate.isSame(moment(), 'day') && calStartDate.isSame(moment(), 'month'),
	        year: calStartDate.year(),
	        dayName: calStartDate.format('dddd'),
	        isWeekEnd: weekend,
	        isDisabledDate: isDisabledDate,
	        isCurrentMonth: isCurrentMonth
	      };
	      week.push(day);
	      calStartDate.add(1, 'd');
	    }
	    self.dateCells.push(week);
	  }
	  /*
	  Check if max date is greater than first date of month
	  if true than set stopScrollPrevious=true
	  */

	  if (self.restrictToMaxDate && !angular.isUndefined(self.maxDate)) {
	    self.stopScrollNext = self.maxDate.isBefore(lastDayOfMonth);
	  }

	  if (self.dateCells[0][6].isDisabledDate && !self.dateCells[0][6].isCurrentMonth) {
	    self.dateCells[0].splice(0);
	  }
	};

	CalenderCtrl.prototype.changePeriod = function (c) {
	  var self = this;
	  if (c === 'p') {
	    if (self.stopScrollPrevious) return;
	    self.moveCalenderAnimation = 'slideLeft';
	    self.initialDate.subtract(1, 'M');
	  } else {
	    console.log(self.stopScrollNext);
	    if (self.stopScrollNext) return;
	    self.moveCalenderAnimation = 'slideRight';
	    self.initialDate.add(1, 'M');
	  }

	  self.buildDateCells();
	  self.$timeout(function () {
	    self.moveCalenderAnimation = '';
	  }, 500);
	};

	CalenderCtrl.prototype.selectDate = function (d, isDisabled) {
	  var self = this;
	  if (isDisabled) {
	    return;
	  }
	  self.currentDate = d;
	  self.$scope.dateSelectCall({
	    date: d
	  });
	  self.setNgModelValue(d);
	  self.$scope.$emit('calender:date-selected');
	};

	CalenderCtrl.prototype.buildDateCellHeader = function (startFrom) {
	  var self = this;
	  var daysByName = self.picker.daysNames;
	  var keys = [];
	  var key;
	  for (key in daysByName) {
	    keys.push(key);
	  }

	  var startIndex = moment().day(self.startDay).day(),
	      count = 0;

	  for (key in daysByName) {
	    self.dateCellHeader.push(daysByName[keys[(count + startIndex) % keys.length]]);
	    count++; // Don't forget to increase count.
	  }
	};
	/*
	Month Picker
	*/

	CalenderCtrl.prototype.changeView = function (view) {
	  var self = this;
	  if (self.disableYearSelection) {
	    return;
	  } else {
	    if (view === 'YEAR_MONTH') {
	      self.showYear();
	    }
	    self.view = view;
	  }
	};

	/*
	Year Picker
	*/

	CalenderCtrl.prototype.changeYear = function (yr, mn) {
	  var self = this;
	  self.initialDate.year(yr).month(mn);
	  self.buildDateCells();
	  self.view = 'DATE';
	};

	/*
	Hour and Time
	*/

	CalenderCtrl.prototype.setHour = function (h) {
	  var self = this;
	  self.currentDate.hour(h);
	};

	CalenderCtrl.prototype.setMinute = function (m) {
	  var self = this;
	  self.currentDate.minute(m);
	};

	CalenderCtrl.prototype.selectedDateTime = function () {
	  var self = this;
	  self.setNgModelValue(self.currentDate);
	  if (self.mode === 'time') self.view = 'HOUR';else self.view = 'DATE';
	  self.$scope.$emit('calender:close');
	};

	CalenderCtrl.prototype.closeDateTime = function () {
	  var self = this;
	  if (self.mode === 'time') self.view = 'HOUR';else self.view = 'DATE';
	  self.$scope.$emit('calender:close');
	};

	Calender.$inject = ['picker'];

	CalenderCtrl.prototype.isPreviousDate = function (yearToCheck, monthToCheck) {
	  var self = this;
	  if (angular.isUndefined(self.minDate) || angular.isUndefined(yearToCheck) || angular.isUndefined(monthToCheck)) {
	    return false;
	  }
	  var _current_year = self.minDate.year();
	  if (yearToCheck < _current_year) {
	    return true;
	  } else if (yearToCheck === _current_year) {
	    if (monthToCheck < self.minDate.month()) {
	      return true;
	    }
	  }
	  return false;
	};

	var app = angular.module('abl-date-picker', []);
	app.directive('smCalender', Calender);

	function TimePicker() {
	  return {
	    restrict: 'E',
	    replace: true,
	    require: ['^ngModel', 'smTime'],
	    scope: {
	      initialTime: '@',
	      format: '@',
	      timeSelectCall: '&'
	    },
	    controller: ['$scope', 'picker', TimePickerCtrl],
	    controllerAs: 'vm',
	    templateUrl: 'picker/calender-hour.html',
	    link: function link(scope, element, att, ctrls) {
	      var ngModelCtrl = ctrls[0];
	      var calCtrl = ctrls[1];
	      calCtrl.configureNgModel(ngModelCtrl);
	    }
	  };
	}

	var TimePickerCtrl = function TimePickerCtrl($scope, picker) {
	  var self = this;
	  self.uid = Math.random().toString(36).substr(2, 5);
	  self.$scope = $scope;
	  self.picker = picker;
	  self.initialDate = $scope.initialTime; //if calender to be  initiated with specific date
	  self.colorIntention = picker.colorIntention;
	  self.format = $scope.format;
	  self.hourItems = [];
	  self.minuteCells = [];
	  self.format = angular.isUndefined(self.format) ? 'HH:mm' : self.format;
	  self.initialDate = angular.isUndefined(self.initialDate) ? moment() : moment(self.initialDate, self.format);
	  self.currentDate = self.initialDate.clone();
	  self.hourSet = false;
	  self.minuteSet = false;

	  self.show = true;
	  self.init();
	};

	TimePickerCtrl.prototype.init = function () {
	  var self = this;
	  self.buidHourCells();
	  self.buidMinuteCells();
	  self.headerDispalyFormat = 'HH:mm';
	  self.showHour();
	};

	TimePickerCtrl.prototype.showHour = function () {
	  var self = this;

	  self.hourTopIndex = 22;
	  self.minuteTopIndex = self.initialDate.minute() - 0 + Math.floor(7 / 2);
	  //self.yearTopIndex = (self.initialDate.year() - self.yearItems.START) + Math.floor(self.yearItems.PAGE_SIZE / 2);
	  //	self.hourItems.currentIndex_ = (self.initialDate.hour() - self.hourItems.START) + 1;
	};

	TimePickerCtrl.prototype.configureNgModel = function (ngModelCtrl) {
	  this.ngModelCtrl = ngModelCtrl;
	  var self = this;
	  ngModelCtrl.$render = function () {
	    self.ngModelCtrl.$viewValue = self.currentDate;
	  };
	};

	TimePickerCtrl.prototype.setNgModelValue = function (date) {
	  var self = this;
	  self.ngModelCtrl.$setViewValue(date);
	  self.ngModelCtrl.$render();
	};

	TimePickerCtrl.prototype.buidHourCells = function () {
	  var self = this;

	  for (var i = 0; i <= 23; i++) {
	    var hour = {
	      hour: i,
	      isCurrent: self.initialDate.hour() === i
	    };
	    self.hourItems.push(hour);
	  };
	};

	TimePickerCtrl.prototype.buidMinuteCells = function () {
	  var self = this;
	  self.minuteTopIndex = self.initialDate.minute();
	  for (var i = 0; i <= 59; i++) {
	    var minute = {
	      minute: i,
	      isCurrent: self.initialDate.minute() === i
	    };
	    self.minuteCells.push(minute);
	  };
	};

	TimePickerCtrl.prototype.selectDate = function (d, isDisabled) {
	  var self = this;
	  if (isDisabled) return;
	  self.currentDate = d;

	  self.$scope.$emit('calender:date-selected');
	};

	TimePickerCtrl.prototype.setHour = function (h) {
	  var self = this;
	  self.currentDate.hour(h);
	  self.setNgModelValue(self.currentDate);
	  self.hourSet = true;
	  if (self.hourSet && self.minuteSet) {
	    self.$scope.timeSelectCall({
	      time: self.currentDate
	    });
	    self.hourSet = false;
	    self.minuteSet = false;
	  }
	};

	TimePickerCtrl.prototype.setMinute = function (m) {
	  var self = this;
	  self.currentDate.minute(m);
	  self.setNgModelValue(self.currentDate);
	  self.minuteSet = true;
	  if (self.hourSet && self.minuteSet) {
	    self.$scope.timeSelectCall({
	      time: self.currentDate
	    });
	    self.hourSet = false;
	    self.minuteSet = false;
	  }
	};

	TimePickerCtrl.prototype.selectedDateTime = function () {
	  var self = this;
	  self.setNgModelValue(self.currentDate);
	  if (self.mode === 'time') self.view = 'HOUR';else self.view = 'DATE';
	  self.$scope.$emit('calender:close');
	};

	var app = angular.module('abl-date-picker');
	app.directive('smTime', ['$timeout', TimePicker]);

	function DatePickerDir($timeout, picker, $mdMedia, $window) {
	  return {
	    restrict: 'E',
	    require: ['^ngModel', 'smDatePicker'],
	    replace: false,
	    scope: {
	      initialDate: '=',
	      minDate: '=',
	      maxDate: '=',
	      format: '@',
	      mode: '@',
	      startDay: '@',
	      closeOnSelect: '@',
	      weekStartDay: '@',
	      disableYearSelection: '@',
	      onSelectCall: '&'
	    },
	    controller: ['$scope', 'picker', '$mdMedia', PickerCtrl],
	    controllerAs: 'vm',
	    bindToController: true,
	    templateUrl: 'picker/date-picker.html',
	    link: function link(scope, element, att, ctrls) {
	      var ngModelCtrl = ctrls[0];
	      var calCtrl = ctrls[1];
	      calCtrl.configureNgModel(ngModelCtrl);
	    }
	  };
	}

	var PickerCtrl = function PickerCtrl($scope, picker, $mdMedia) {
	  var self = this;
	  self.scope = $scope;
	  self.okLabel = picker.okLabel;
	  self.cancelLabel = picker.cancelLabel;
	  self.picker = picker;
	  self.colorIntention = picker.colorIntention;
	  self.$mdMedia = $mdMedia;
	  self.init();
	};

	PickerCtrl.prototype.init = function () {
	  var self = this;

	  if (angular.isUndefined(self.mode) || self.mode === '') {
	    self.mode = 'date';
	  }
	  self.currentDate = isNaN(self.ngModelCtrl) ? moment() : self.ngModelCtrl.$viewValue;
	  self.setViewMode(self.mode);
	};

	PickerCtrl.prototype.configureNgModel = function (ngModelCtrl) {
	  var self = this;
	  self.ngModelCtrl = ngModelCtrl;
	  self.ngModelCtrl.$render = function () {
	    self.ngModelCtrl.$viewValue = ngModelCtrl.$viewValue;
	    self.ngModelCtrl.$modelvalue = ngModelCtrl.$modelvalue;
	    self.initialDate = self.ngModelCtrl.$viewValue;
	  };
	};

	PickerCtrl.prototype.setViewMode = function (mode) {
	  var self = this;
	  switch (mode) {
	    case 'date':
	      self.view = 'DATE';
	      self.headerDispalyFormat = self.picker.customHeader.date;
	      break;
	    case 'date-time':
	      self.view = 'DATE';
	      self.headerDispalyFormat = self.picker.customHeader.dateTime;
	      break;
	    case 'time':
	      self.view = 'TIME';
	      self.headerDispalyFormat = 'HH:mm';
	      break;
	    default:
	      self.headerDispalyFormat = 'ddd, MMM DD ';
	      self.view = 'DATE';
	  }
	};

	PickerCtrl.prototype.setNextView = function () {
	  var self = this;
	  switch (self.mode) {
	    case 'date':
	      self.view = 'DATE';
	      break;
	    case 'date-time':
	      self.view = self.view === 'DATE' ? 'TIME' : 'DATE';
	      break;
	    default:
	      self.view = 'DATE';
	  }
	};

	PickerCtrl.prototype.selectedDateTime = function () {
	  var self = this;
	  var date = moment(self.selectedDate, self.format);
	  if (!date.isValid()) {
	    date = moment();
	    self.selectedDate = date;
	  }
	  if (!angular.isUndefined(self.selectedTime)) {
	    date.hour(self.selectedTime.hour()).minute(self.selectedTime.minute());
	  }
	  self.setNgModelValue(date);
	};

	PickerCtrl.prototype.dateSelected = function (date) {
	  var self = this;

	  self.currentDate.date(date.date()).month(date.month()).year(date.year());
	  self.selectedDate = self.currentDate;
	  if (self.closeOnSelect && self.mode === 'date') {
	    self.selectedDateTime();
	  } else {
	    self.setNextView();
	  }
	};

	PickerCtrl.prototype.timeSelected = function (time) {
	  var self = this;
	  self.currentDate.hours(time.hour()).minutes(time.minute());
	  self.selectedTime = self.currentDate;

	  if (self.closeOnSelect && self.mode === 'date-time') self.selectedDateTime();else self.setNextView();
	};

	PickerCtrl.prototype.setNgModelValue = function (date) {
	  var self = this;
	  self.onSelectCall({
	    date: date
	  });
	  self.ngModelCtrl.$setViewValue(date.format(self.format));
	  self.ngModelCtrl.$render();
	  self.closeDateTime();
	};

	PickerCtrl.prototype.closeDateTime = function () {
	  var self = this;
	  self.view = 'DATE';
	  self.scope.$emit('calender:close');
	};

	function TimePickerDir($timeout, picker, $mdMedia, $window) {
	  return {
	    restrict: 'E',
	    require: '^ngModel',
	    replace: true,
	    scope: {
	      initialDate: '@',
	      format: '@',
	      mode: '@',
	      closeOnSelect: '@'
	    },
	    templateUrl: 'picker/time-picker.html',
	    link: function link(scope, element, att, ngModelCtrl) {
	      setViewMode(scope.mode);

	      scope.okLabel = picker.okLabel;
	      scope.cancelLabel = picker.cancelLabel;

	      scope.currentDate = isNaN(ngModelCtrl.$viewValue) ? moment() : ngModelCtrl.$viewValue;

	      scope.$mdMedia = $mdMedia;

	      function setViewMode(mode) {
	        switch (mode) {
	          case 'date-time':
	            scope.view = 'DATE';
	            scope.headerDispalyFormat = 'ddd, MMM DD HH:mm';
	            break;
	          case 'time':
	            scope.view = 'HOUR';
	            scope.headerDispalyFormat = 'HH:mm';
	            break;
	          default:
	            scope.view = 'DATE';
	        }
	      }

	      scope.$on('calender:date-selected', function () {
	        if (scope.closeOnSelect && (scope.mode !== 'date-time' || scope.mode !== 'time')) {
	          var date = moment(scope.selectedDate, scope.format);
	          if (!date.isValid()) {
	            date = moment();
	            scope.selectedDate = date;
	          }
	          if (!angular.isUndefined(scope.selectedTime)) {
	            date.hour(scope.selectedTime.hour()).minute(scope.selectedTime.minute());
	          }
	          scope.currentDate = scope.selectedDate;
	          ngModelCtrl.$setViewValue(date.format(scope.format));
	          ngModelCtrl.$render();
	          setViewMode(scope.mode);
	          scope.$emit('calender:close');
	        }
	      });

	      scope.selectedDateTime = function () {
	        var date = moment(scope.selectedDate, scope.format);
	        if (!date.isValid()) {
	          date = moment();
	          scope.selectedDate = date;
	        }
	        if (!angular.isUndefined(scope.selectedTime)) {
	          date.hour(scope.selectedTime.hour()).minute(scope.selectedTime.minute());
	        }
	        scope.currentDate = scope.selectedDate;
	        ngModelCtrl.$setViewValue(date.format(scope.format));
	        ngModelCtrl.$render();
	        setViewMode(scope.mode);
	        scope.$emit('calender:close');
	      };

	      scope.closeDateTime = function () {
	        scope.$emit('calender:close');
	      };
	    }
	  };
	}

	var app = angular.module('abl-date-picker');
	app.directive('smDatePicker', ['$timeout', 'picker', '$mdMedia', '$window', DatePickerDir]);
	app.directive('smTimePicker', ['$timeout', 'picker', '$mdMedia', '$window', TimePickerDir]);

	var app = angular.module('abl-date-picker');

	function DatePickerServiceCtrl($scope, $mdDialog, $mdMedia, $timeout, $mdUtil, picker) {
	  var self = this;

	  if (!angular.isUndefined(self.options) && angular.isObject(self.options)) {
	    self.mode = isExist(self.options.mode, self.mode);
	    self.format = isExist(self.options.format, 'MM-DD-YYYY');
	    self.minDate = isExist(self.options.minDate, undefined);
	    self.maxDate = isExist(self.options.maxDate, undefined);
	    self.weekStartDay = isExist(self.options.weekStartDay, 'Sunday');
	    self.closeOnSelect = isExist(self.options.closeOnSelect, false);
	  }

	  if (!angular.isObject(self.initialDate)) {
	    self.initialDate = moment(self.initialDate, self.format);
	    self.selectedDate = self.initialDate;
	  }

	  self.currentDate = self.initialDate;
	  self.viewDate = self.currentDate;

	  self.view = 'DATE';
	  self.$mdMedia = $mdMedia;
	  self.$mdUtil = $mdUtil;

	  self.okLabel = picker.okLabel;
	  self.cancelLabel = picker.cancelLabel;

	  setViewMode(self.mode);

	  function isExist(val, def) {
	    return angular.isUndefined(val) ? def : val;
	  }

	  function setViewMode(mode) {
	    switch (mode) {
	      case 'date':
	        self.headerDispalyFormat = 'ddd, MMM DD ';
	        break;
	      case 'date-time':
	        self.headerDispalyFormat = 'ddd, MMM DD HH:mm';
	        break;
	      case 'time':
	        self.headerDispalyFormat = 'HH:mm';
	        break;
	      default:
	        self.headerDispalyFormat = 'ddd, MMM DD ';
	    }
	  }

	  self.autoClosePicker = function () {
	    if (self.closeOnSelect) {
	      if (angular.isUndefined(self.selectedDate)) {
	        self.selectedDate = self.initialDate;
	      }
	      //removeMask();
	      $mdDialog.hide(self.selectedDate.format(self.format));
	    }
	  };

	  self.dateSelected = function (date) {
	    self.selectedDate = date;
	    self.viewDate = date;
	    if (self.mode === 'date-time') self.view = 'HOUR';else self.autoClosePicker();
	  };

	  self.timeSelected = function (time) {
	    self.selectedDate.hour(time.hour()).minute(time.minute());
	    self.viewDate = self.selectedDate;
	    self.autoClosePicker();
	  };

	  self.closeDateTime = function () {
	    $mdDialog.cancel();
	    removeMask();
	  };
	  self.selectedDateTime = function () {
	    if (angular.isUndefined(self.selectedDate)) {
	      self.selectedDate = self.currentDate;
	    }
	    $mdDialog.hide(self.selectedDate.format(self.format));
	    removeMask();
	  };

	  function removeMask() {
	    var ele = document.getElementsByClassName('md-scroll-mask');
	    if (ele.length !== 0) {
	      angular.element(ele).remove();
	    }
	  }
	}

	app.provider('ablDateTimePicker', function () {

	  this.$get = ['$mdDialog', function ($mdDialog) {

	    var datePicker = function datePicker(initialDate, options) {
	      if (angular.isUndefined(initialDate)) initialDate = moment();

	      if (!angular.isObject(options)) options = {};

	      return $mdDialog.show({
	        controller: ['$scope', '$mdDialog', '$mdMedia', '$timeout', '$mdUtil', 'picker', DatePickerServiceCtrl],
	        controllerAs: 'vm',
	        bindToController: true,
	        clickOutsideToClose: true,
	        targetEvent: options.targetEvent,
	        templateUrl: 'picker/date-picker-service.html',
	        locals: {
	          initialDate: initialDate,
	          options: options
	        },
	        skipHide: true
	      });
	    };

	    return datePicker;
	  }];
	});

	function DateTimePicker($mdUtil, $mdMedia, $document, picker) {
	  return {
	    restrict: 'E',
	    require: ['^ngModel', 'ablDateTimePicker'],
	    scope: {
	      weekStartDay: '@',
	      startView: '@',
	      mode: '@',
	      format: '@',
	      minDate: '@',
	      maxDate: '@',
	      fname: '@',
	      label: '@',
	      isRequired: '@',
	      disable: '=',
	      noFloatingLabel: '=',
	      disableYearSelection: '@',
	      closeOnSelect: '@',
	      onDateSelectedCall: '&'
	    },
	    controller: ['$scope', '$element', '$mdUtil', '$mdMedia', '$document', '$parse', SMDateTimePickerCtrl],
	    controllerAs: 'vm',
	    bindToController: true,
	    template: function template(element, attributes) {
	      var inputType = '';
	      if (attributes.hasOwnProperty('onFocus')) {
	        // Input html
	        inputType = '<input name="{{vm.fname}}" ng-model="vm.value" ' + 'type="text" placeholder="{{vm.label}}"' + ' aria-label="{{vm.fname}}" ng-focus="vm.show()" data-ng-required="vm.isRequired"  ng-disabled="vm.disable"' + ' server-error class="abl-input-container" />';
	      } else {
	        inputType = '<input class="" name="{{vm.fname}}" ng-model="vm.value" ' + '             type="text" placeholder="{{vm.label}}" ' + '             aria-label="{{vm.fname}}" aria-hidden="true" data-ng-required="vm.isRequired" ng-disabled="vm.disable"/>' + '     <md-button tabindex="-1" class="sm-picker-icon md-icon-button" aria-label="showCalender" ng-disabled="vm.disable" aria-hidden="true" type="button" ng-click="vm.show()">' + '         <svg  fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>' + '     </md-button>';
	      }

	      return '<div class="sm-input-container md-icon-float md-block" md-no-float="vm.noFloatingLabel">' + inputType + '     <div id="picker" class="sm-calender-pane md-whiteframe-z2">' + '          <sm-date-picker ' + '              id="{{vm.fname}}Picker" ' + '              initial-date="vm.initialDate"' + '              ng-model="vm.value"' + '              mode="{{vm.mode}}" ' + '              disable-year-selection={{vm.disableYearSelection}}' + '              close-on-select="{{vm.closeOnSelect}}"' + '              start-view="{{vm.startView}}" ' + '              data-min-date="vm.minDate" ' + '              data-max-date="vm.maxDate"  ' + '              data-format="{{vm.format}}"  ' + '              data-on-select-call="vm.onDateSelected(date)"' + '              data-week-start-day="{{vm.weekStartDay}}" > ' + '         </sm-date-picker>' + '     </div>' + '     <div></div>';
	      ' </div>';
	    },
	    link: function link(scope, $element, attr, ctrl) {
	      var ngModelCtrl = ctrl[0];
	      var pickerCtrl = ctrl[1];
	      console.log(ngModelCtrl);
	      pickerCtrl.configureNgModel(ngModelCtrl);
	    }
	  };
	}
	var SMDateTimePickerCtrl = function SMDateTimePickerCtrl($scope, $element, $mdUtil, $mdMedia, $document, $parse) {
	  var self = this;
	  self.$scope = $scope;
	  self.$element = $element;
	  self.$mdUtil = $mdUtil;
	  self.$mdMedia = $mdMedia;
	  self.$document = $document;
	  self.isCalenderOpen = false;
	  self.disablePicker = $scope.disable;

	  self.calenderHeight = 320;
	  self.calenderWidth = 450;

	  //find input button and assign to variable
	  self.inputPane = $element[0].querySelector('.sm-input-container');

	  //find Calender Picker  and assign to variable
	  self.calenderPane = $element[0].querySelector('.sm-calender-pane');
	  //button to start calender
	  self.button = $element[0].querySelector('.sm-picker-icon');

	  self.calenderPan = angular.element(self.calenderPane);

	  //check if mode is undefied set to date mode
	  self.mode = angular.isUndefined($scope.mode) ? 'date' : $scope.mode;
	  // check if Pre defined format is supplied
	  self.format = angular.isUndefined($scope.format) ? 'MM-DD-YYYY' : $scope.format;

	  self.calenderPan.addClass('hide hide-animate');

	  self.bodyClickHandler = angular.bind(self, self.clickOutSideHandler);

	  self.$scope.$on('calender:close', function () {
	    self.$document.off('keydown');
	    self.hideElement();
	  });

	  self.$scope.$on('$destroy', function () {
	    self.calenderPane.parentNode.removeChild(self.calenderPane);
	  });

	  // if tab out hide key board
	  angular.element(self.inputPane).on('keydown', function (e) {
	    switch (e.which) {
	      case 27:
	      case 9:
	        self.hideElement();
	        break;
	    }
	  });
	};

	SMDateTimePickerCtrl.prototype.configureNgModel = function (ngModelCtrl) {
	  var self = this;
	  self.ngModelCtrl = ngModelCtrl;
	  self.ngModelCtrl.$formatters.push(function (dateValue) {
	    if (!dateValue && angular.isUndefined(dateValue)) {
	      self.value = '';
	      self.onDateSelectedCall({
	        date: null
	      });
	      return;
	    }
	    self.setNgModelValue(dateValue);
	  });
	};

	SMDateTimePickerCtrl.prototype.setNgModelValue = function (date) {
	  var self = this;
	  self.onDateSelectedCall({
	    date: date
	  });
	  var d = {};
	  if (moment.isMoment(date)) {
	    d = date.format(self.format);
	  } else {
	    d = moment(date, self.format).format(self.format);
	  }
	  self.ngModelCtrl.$setViewValue(d);
	  self.ngModelCtrl.$render();
	  self.value = d;
	};

	SMDateTimePickerCtrl.prototype.onDateSelected = function (date) {
	  var self = this;
	  self.setNgModelValue(date);
	};

	/*get visiable port

	@param : elementnRect

	@param : bodyRect

	*/

	SMDateTimePickerCtrl.prototype.getVisibleViewPort = function (elementRect, bodyRect) {
	  var self = this;

	  var top = elementRect.top;
	  if (elementRect.top + self.calenderHeight > bodyRect.bottom) {
	    top = elementRect.top - (elementRect.top + self.calenderHeight - (bodyRect.bottom - 20));
	  }
	  var left = elementRect.left;
	  if (elementRect.left + self.calenderWidth > bodyRect.right) {
	    left = elementRect.left - (elementRect.left + self.calenderWidth - (bodyRect.right - 10));
	  }
	  return {
	    top: top,
	    left: left
	  };
	};

	SMDateTimePickerCtrl.prototype.show = function ($event) {
	  var self = this;

	  var elementRect = self.inputPane.getBoundingClientRect();
	  var bodyRect = document.body.getBoundingClientRect();

	  self.calenderPan.removeClass('hide hide-animate');

	  if (self.$mdMedia('sm') || self.$mdMedia('xs')) {
	    self.calenderPane.style.left = (bodyRect.width - 320) / 2 + 'px';
	    self.calenderPane.style.top = (bodyRect.height - 450) / 2 + 'px';
	  } else {
	    var rect = self.getVisibleViewPort(elementRect, bodyRect);
	    self.calenderPane.style.left = rect.left + 'px';
	    self.calenderPane.style.top = rect.top + 'px';
	  }

	  document.body.appendChild(self.calenderPane);
	  angular.element(self.calenderPane).focus();

	  self.calenderPan.addClass('show');
	  self.$mdUtil.disableScrollAround(self.calenderPane);

	  self.isCalenderOpen = true;
	  self.$document.on('click', self.bodyClickHandler);
	};

	SMDateTimePickerCtrl.prototype.tabOutEvent = function (element) {
	  var self = this;
	  if (element.which === 9) {
	    self.hideElement();
	  }
	};

	SMDateTimePickerCtrl.prototype.hideElement = function () {
	  var self = this;
	  self.calenderPan.addClass('hide-animate');
	  self.calenderPan.removeClass('show');
	  self.$mdUtil.enableScrolling();

	  if (self.button) {
	    angular.element(self.button).focus();
	  }
	  self.$document.off('click');
	  self.isCalenderOpen = false;
	};

	SMDateTimePickerCtrl.prototype.clickOutSideHandler = function (e) {
	  var self = this;
	  if (!self.button) {
	    if (self.calenderPane !== e.target && self.inputPane !== e.target && !self.calenderPane.contains(e.target) && !self.inputPane.contains(e.target)) {
	      self.hideElement();
	    }
	  } else {
	    if (self.calenderPane !== e.target && self.button !== e.target && !self.calenderPane.contains(e.target) && !self.button.contains(e.target)) {
	      self.hideElement();
	    }
	  }
	};

	var app = angular.module('abl-date-picker');
	app.directive('ablDateTimePicker', ['$mdUtil', '$mdMedia', '$document', 'picker', DateTimePicker]);

	/* global moment */
	function picker() {
	  var massagePath = 'X';
	  var cancelLabel = 'Cancel';
	  var okLabel = 'Ok';
	  var clearLabel = 'Clear';
	  var customRangeLabel = 'Custom Range';
	  var format = 'MM-DD-YYYY';
	  var customHeader = {
	    date: 'ddd, MMM DD',
	    dateTime: 'ddd, MMM DD HH:mm',
	    time: 'HH:mm'

	    //date picker configuration
	  };var daysNames = [{
	    'single': 'S',
	    'shortName': 'Su',
	    'fullName': 'Su startDate:nday'
	  }, {
	    'single': 'M',
	    'shortName': 'Mo',
	    'fullName': 'MonDay'
	  }, {
	    'single': 'T',
	    'shortName': 'Tu',
	    'fullName': 'TuesDay'
	  }, {
	    'single': 'W',
	    'shortName': 'We',
	    'fullName': 'Wednesday'
	  }, {
	    'single': 'T',
	    'shortName': 'Th',
	    'fullName': 'Thursday'
	  }, {
	    'single': 'F',
	    'shortName': 'Fr',
	    'fullName': 'Friday'
	  }, {
	    'single': 'S',
	    'shortName': 'Sa',
	    'fullName': 'Saturday'
	  }];

	  var colorIntention = 'md-primary';

	  var dayHeader = 'single';

	  var monthNames = moment.months();

	  //range picker configuration
	  var rangeDivider = 'To';
	  var rangeDefaultList = [{
	    label: 'Today',
	    startDate: moment().utc().startOf('day'),
	    endDate: moment().utc().endOf('day')
	  }, {
	    label: 'Last 7 Days',
	    startDate: moment().utc().subtract(7, 'd').startOf('day'),
	    endDate: moment().utc().endOf('day')
	  }, {
	    label: 'This Month',
	    startDate: moment().utc().startOf('month'),
	    endDate: moment().utc().endOf('month')
	  }, {
	    label: 'Last Month',
	    startDate: moment().utc().subtract(1, 'month').startOf('month'),
	    endDate: moment().utc().subtract(1, 'month').endOf('month')
	  }, {
	    label: 'This Quarter',
	    startDate: moment().utc().startOf('quarter'),
	    endDate: moment().utc().endOf('quarter')
	  }, {
	    label: 'Year To Date',
	    startDate: moment().utc().startOf('year'),
	    endDate: moment().utc().endOf('day')
	  }, {
	    label: 'This Year',
	    startDate: moment().utc().startOf('year'),
	    endDate: moment().utc().endOf('year')
	  }];

	  var rangeCustomStartEnd = ['Start Date', 'End Date'];

	  return {
	    setMassagePath: function setMassagePath(param) {
	      massagePath = param;
	    },
	    setDivider: function setDivider(value) {
	      divider = value;
	    },
	    setDaysNames: function setDaysNames(array) {
	      daysNames = array;
	    },
	    setMonthNames: function setMonthNames(array) {
	      monthNames = array;
	    },
	    setDayHeader: function setDayHeader(param) {
	      dayHeader = param;
	    },
	    setOkLabel: function setOkLabel(param) {
	      okLabel = param;
	    },
	    setCancelLabel: function setCancelLabel(param) {
	      cancelLabel = param;
	    },
	    setClearLabel: function setClearLabel(param) {
	      clearLabel = param;
	    },
	    setCustomRangeLabel: function setCustomRangeLabel(param) {
	      customRangeLabel = param;
	    },
	    setRangeDefaultList: function setRangeDefaultList(array) {
	      rangeDefaultList = array;
	    },
	    setRangeCustomStartEnd: function setRangeCustomStartEnd(array) {
	      rangeCustomStartEnd = array;
	    },
	    setColorIntention: function setColorIntention(theme) {
	      colorIntention = theme;
	    },
	    setCustomHeader: function setCustomHeader(obj) {
	      if (!angular.isUndefined(obj.date)) {
	        customHeader.date = obj.date;
	      }
	      if (!angular.isUndefined(obj.dateTime)) {
	        customHeader.dateTime = obj.dateTime;
	      }
	      if (!angular.isUndefined(obj.time)) {
	        customHeader.time = obj.time;
	      }
	    },
	    $get: function $get() {
	      return {
	        massagePath: massagePath,
	        cancelLabel: cancelLabel,
	        okLabel: okLabel,
	        clearLabel: clearLabel,
	        customRangeLabel: customRangeLabel,

	        daysNames: daysNames,
	        monthNames: monthNames,
	        dayHeader: dayHeader,
	        customHeader: customHeader,

	        rangeDivider: rangeDivider,
	        rangeCustomStartEnd: rangeCustomStartEnd,
	        rangeDefaultList: rangeDefaultList,
	        format: format,
	        colorIntention: colorIntention
	      };
	    }
	  };
	}

	var app = angular.module('abl-date-picker');
	app.provider('picker', [picker]);

	function RangePickerInput($document, $mdMedia, $mdUtil, picker) {
	  return {
	    restrict: 'EA',
	    replace: true,
	    require: ['^ngModel'],
	    scope: {
	      label: '@',
	      fname: '@',
	      isRequired: '@',
	      closeOnSelect: '@',
	      disable: '=',
	      format: '@',
	      mode: '@',
	      divider: '@',
	      showCustom: '@',
	      value: '=ngModel',
	      weekStartDay: '@',
	      customToHome: '@',
	      customList: '=',
	      noFloatingLabel: '=',
	      minDate: '@',
	      maxDate: '@',
	      allowClear: '@',
	      allowEmpty: '@',
	      onRangeSelect: '&'
	    },
	    controller: ['$scope', '$element', '$mdUtil', '$mdMedia', '$document', SMRangePickerCtrl],
	    controllerAs: 'vm',
	    bindToController: true,
	    templateUrl: 'picker/range-picker-input.html',
	    link: function link(scope, $element, attr, ctrl) {

	      scope._watch_model = scope.$watch('vm.value', function (newVal, oldVal) {
	        if (newVal && (newVal !== oldVal || !scope.vm.valueAsText)) {
	          if ((typeof newVal === 'undefined' ? 'undefined' : _typeof(newVal)) === 'object') {
	            if (newVal.__$toString) {
	              scope.vm.valueAsText = newVal.__$toString;
	              delete newVal.__$toString;
	            } else {
	              var _temp = [];
	              if (newVal.startDate) {
	                _temp.push(moment(newVal.startDate).format(scope.vm.format || 'YYYY-MM-DD'));
	              } else {
	                _temp.push('Any');
	              }
	              _temp.push(scope.vm.divider);
	              if (newVal.endDate) {
	                _temp.push(moment(newVal.endDate).format(scope.vm.format || 'YYYY-MM-DD'));
	              } else {
	                _temp.push('Any');
	              }

	              scope.vm.valueAsText = _temp.join(' ');
	            }
	          } else //it must be removed in future releases once the input cannot be a string anymore.
	            {
	              scope.vm.valueAsText = scope.vm.value || '';
	            }
	        }
	      });

	      //
	    }
	  };
	}

	var SMRangePickerCtrl = function SMRangePickerCtrl($scope, $element, $mdUtil, $mdMedia, $document) {
	  var self = this;
	  self.$scope = $scope;
	  self.$element = $element;
	  self.$mdUtil = $mdUtil;
	  self.$mdMedia = $mdMedia;
	  self.$document = $document;
	  self.isCalenderOpen = false;

	  self.calenderHeight = 460;
	  self.calenderWidth = 296;

	  //find input button and assign to variable
	  self.inputPane = $element[0].querySelector('.sm-input-container');

	  //find Calender Picker  and assign to variable
	  self.calenderPane = $element[0].querySelector('.sm-calender-pane');
	  //button to start calender
	  self.button = $element[0].querySelector('.sm-picker-icon');

	  self.calenderPan = angular.element(self.calenderPane);

	  //check if mode is undefied set to date mode
	  self.mode = angular.isUndefined($scope.mode) ? 'date' : $scope.mode;
	  // check if Pre defined format is supplied
	  self.format = angular.isUndefined($scope.format) ? 'MM-DD-YYYY' : $scope.format;

	  self.calenderPan.addClass('hide hide-animate');

	  self.bodyClickHandler = angular.bind(self, self.clickOutSideHandler);

	  self.$scope.$on('range-picker:close', function () {
	    self.$document.off('keydown');
	    self.hideElement();
	  });

	  self.$scope.$on('$destroy', function () {
	    self.calenderPane.parentNode.removeChild(self.calenderPane);
	    self.$scope._watch_model();
	  });

	  // if tab out hide key board
	  angular.element(self.inputPane).on('keydown', function (e) {
	    switch (e.which) {
	      case 27:
	      case 9:
	        self.hideElement();
	        break;
	    }
	  });
	};

	/*get visiable port
	@param : elementnRect
	@param : bodyRect
	*/
	SMRangePickerCtrl.prototype.getVisibleViewPort = function (elementRect, bodyRect) {
	  var self = this;

	  var top = elementRect.top;
	  if (elementRect.top + self.calenderHeight > bodyRect.bottom) {
	    top = elementRect.top - (elementRect.top + self.calenderHeight - (bodyRect.bottom - 20));
	  }
	  var left = elementRect.left;
	  if (elementRect.left + self.calenderWidth > bodyRect.right) {
	    left = elementRect.left - (elementRect.left + self.calenderWidth - (bodyRect.right - 10));
	  }
	  return {
	    top: top,
	    left: left
	  };
	};

	SMRangePickerCtrl.prototype.rangeSelected = function (range) {
	  var self = this;
	  self.onRangeSelect({
	    range: range
	  });
	  self.value = {
	    startDate: range.startDateAsMoment,
	    endDate: range.endDateAsMoment,
	    __$toString: range.text
	  };
	};

	SMRangePickerCtrl.prototype.show = function ($event) {
	  var self = this;
	  var elementRect = self.inputPane.getBoundingClientRect();
	  var bodyRect = document.body.getBoundingClientRect();

	  self.calenderPan.removeClass('hide hide-animate');

	  if (self.$mdMedia('sm') || self.$mdMedia('xs')) {
	    self.calenderPane.style.left = (bodyRect.width - 320) / 2 + 'px';
	    self.calenderPane.style.top = (bodyRect.height - 450) / 2 + 'px';
	  } else {
	    var rect = self.getVisibleViewPort(elementRect, bodyRect);
	    self.calenderPane.style.left = rect.left + 'px';
	    self.calenderPane.style.top = rect.top + 'px';
	  }

	  document.body.appendChild(self.calenderPane);
	  angular.element(self.calenderPane).focus();

	  self.calenderPan.addClass('show');
	  self.$mdUtil.disableScrollAround(self.calenderPane);

	  self.isCalenderOpen = true;
	  self.$document.on('click', self.bodyClickHandler);
	};

	SMRangePickerCtrl.prototype.tabOutEvent = function (element) {
	  var self = this;
	  if (element.which === 9) {
	    self.hideElement();
	  }
	};

	SMRangePickerCtrl.prototype.hideElement = function () {
	  var self = this;
	  self.calenderPan.addClass('hide-animate');
	  self.calenderPan.removeClass('show');
	  self.$mdUtil.enableScrolling();

	  if (self.button) {
	    angular.element(self.button).focus();
	  }
	  self.$document.off('click');
	  self.isCalenderOpen = false;
	};

	SMRangePickerCtrl.prototype.clickOutSideHandler = function (e) {
	  var self = this;
	  if (!self.button) {
	    if (self.calenderPane !== e.target && self.inputPane !== e.target && !self.calenderPane.contains(e.target) && !self.inputPane.contains(e.target)) {
	      self.$scope.$broadcast('range-picker-input:blur');
	      self.hideElement();
	    }
	  } else {
	    if (self.calenderPane !== e.target && self.button !== e.target && !self.calenderPane.contains(e.target) && !self.button.contains(e.target)) {
	      self.hideElement();
	    }
	  }
	};

	var app = angular.module('abl-date-picker');
	app.directive('smRangePickerInput', ['$document', '$mdMedia', '$mdUtil', 'picker', RangePickerInput]);

	function smRangePicker(picker) {
	  return {
	    restrict: 'E',
	    require: ['^?ngModel', 'smRangePicker'],
	    scope: {
	      format: '@',
	      divider: '@',
	      weekStartDay: '@',
	      customToHome: '@',
	      closeOnSelect: '@',
	      mode: '@',
	      showCustom: '@',
	      customList: '=',
	      minDate: '@',
	      maxDate: '@',
	      allowClear: '@',
	      allowEmpty: '@',
	      rangeSelectCall: '&'
	    },
	    terminal: true,
	    controller: ['$scope', 'picker', RangePickerCtrl],
	    controllerAs: 'vm',
	    bindToController: true,
	    templateUrl: 'picker/range-picker.html',
	    link: function link(scope, element, att, ctrls) {
	      var ngModelCtrl = ctrls[0];
	      var calCtrl = ctrls[1];
	      calCtrl.configureNgModel(ngModelCtrl);
	    }
	  };
	}

	var RangePickerCtrl = function RangePickerCtrl($scope, picker) {
	  var self = this;
	  self.scope = $scope;
	  self.clickedButton = 0;
	  self.startShowCustomSettting = self.showCustom;

	  self.startDate = moment();
	  self.endDate = moment();

	  self.divider = angular.isUndefined(self.scope.divider) || self.scope.divider === '' ? picker.rangeDivider : $scope.divider;

	  //display the clear button?
	  self.showClearButton = self.allowClear === 'true' || false;
	  //allow set start/end date as empty value
	  self.allowEmptyDates = self.allowEmpty === 'true' || false;

	  self.okLabel = picker.okLabel;
	  self.cancelLabel = picker.cancelLabel;
	  self.clearLabel = picker.clearLabel;
	  self.customRangeLabel = picker.customRangeLabel;
	  self.view = 'DATE';

	  self.rangeCustomStartEnd = picker.rangeCustomStartEnd;
	  var defaultList = [];
	  angular.copy(picker.rangeDefaultList, defaultList);
	  self.rangeDefaultList = defaultList;
	  if (self.customList) {
	    for (var i = 0; i < self.customList.length; i++) {
	      self.rangeDefaultList[self.customList[i].position] = self.customList[i];
	    }
	  }

	  if (self.showCustom) {
	    self.selectedTabIndex = 0;
	  } else {
	    self.selectedTabIndex = $scope.selectedTabIndex;
	  }

	  $scope.$on('range-picker-input:blur', function () {
	    self.cancel();
	  });
	};

	RangePickerCtrl.prototype.configureNgModel = function (ngModelCtrl) {
	  this.ngModelCtrl = ngModelCtrl;
	  var self = this;
	  ngModelCtrl.$render = function () {
	    //self.ngModelCtrl.$viewValue= self.startDate+' '+ self.divider +' '+self.endDate;
	  };
	};

	RangePickerCtrl.prototype.setNextView = function () {
	  switch (this.mode) {
	    case 'date':
	      this.view = 'DATE';
	      if (this.selectedTabIndex === 0) {
	        this.selectedTabIndex = 1;
	      }
	      break;
	    case 'date-time':
	      if (this.view === 'DATE') {
	        this.view = 'TIME';
	      } else {
	        this.view = 'DATE';
	        if (this.selectedTabIndex === 0) {
	          this.selectedTabIndex = 1;
	        }
	      }
	      break;
	    default:
	      this.view = 'DATE';
	      if (this.selectedTabIndex === 0) {
	        this.selectedTabIndex = 1;
	      }
	  }
	};

	RangePickerCtrl.prototype.showCustomView = function () {
	  this.showCustom = true;
	  this.selectedTabIndex = 0;
	};

	RangePickerCtrl.prototype.dateRangeSelected = function () {
	  var self = this;
	  self.selectedTabIndex = 0;
	  self.view = 'DATE';
	  if (self.startShowCustomSettting) {
	    self.showCustom = true;
	  } else {
	    self.showCustom = false;
	  }
	  self.setNgModelValue(self.startDate, self.divider, self.endDate);
	};

	/* sets an empty value on dates. */
	RangePickerCtrl.prototype.clearDateRange = function () {
	  var self = this;
	  self.selectedTabIndex = 0;
	  self.view = 'DATE';
	  if (self.startShowCustomSettting) {
	    self.showCustom = true;
	  } else {
	    self.showCustom = false;
	  }
	  self.setNgModelValue('', self.divider, '');
	};

	RangePickerCtrl.prototype.startDateSelected = function (date) {
	  var _date_copy = angular.copy(date);
	  this.startDate = _date_copy;
	  this.minStartToDate = _date_copy;
	  this.scope.$emit('range-picker:startDateSelected');
	  this.setNextView();
	  if (this.endDate && this.endDate.diff(this.startDate, 'ms') < 0) {
	    this.endDate = date;
	  }
	};

	RangePickerCtrl.prototype.startTimeSelected = function (time) {

	  this.startDate.hour(time.hour()).minute(time.minute());
	  this.minStartToDate = angular.copy(this.startDate);
	  this.scope.$emit('range-picker:startTimeSelected');
	  this.setNextView();
	};

	RangePickerCtrl.prototype.endDateSelected = function (date) {
	  this.endDate = date;
	  this.scope.$emit('range-picker:endDateSelected');
	  if (this.closeOnSelect && this.mode === 'date') {
	    this.setNgModelValue(this.startDate, this.divider, this.endDate);
	  } else {
	    this.setNextView();
	  }
	};

	RangePickerCtrl.prototype.endTimeSelected = function (time) {
	  this.endDate.hour(time.hour()).minute(time.minute());
	  this.scope.$emit('range-picker:endTimeSelected');
	  if (this.closeOnSelect && this.mode === 'date-time') {
	    this.setNgModelValue(this.startDate, this.divider, this.endDate);
	  }
	};

	RangePickerCtrl.prototype.setNgModelValue = function (startDate, divider, endDate) {
	  var self = this;
	  var momentStartDate = self.startDate = startDate || null;
	  var momentEndDate = self.endDate = endDate || null;

	  if (startDate) {
	    startDate = startDate.format(self.format) || '';
	  }

	  if (endDate) {
	    endDate = endDate.format(self.format) || '';
	  }

	  var range = {
	    startDate: startDate,
	    endDate: endDate,
	    startDateAsMoment: momentStartDate,
	    endDateAsMoment: momentEndDate
	  };

	  //var range = {startDate: startDate, endDate: endDate};
	  var _ng_model_value;

	  //if no startDate && endDate, then empty the model.
	  if (!startDate && !endDate) {
	    _ng_model_value = '';
	  } else {
	    startDate = startDate || 'Any';
	    endDate = endDate || 'Any';
	    _ng_model_value = startDate + ' ' + divider + ' ' + endDate;
	  }

	  range.text = _ng_model_value;

	  self.rangeSelectCall({
	    range: range
	  });

	  /*
	  setTimeout(function()
	  {
	      self.ngModelCtrl.$setViewValue(_ng_model_value);
	      self.ngModelCtrl.$render();
	  }, 50);
	  */

	  self.selectedTabIndex = 0;
	  self.view = 'DATE';
	  self.scope.$emit('range-picker:close');
	};

	RangePickerCtrl.prototype.cancel = function () {
	  var self = this;
	  if (self.customToHome && self.showCustom) {
	    self.showCustom = false;
	  } else {
	    self.selectedTabIndex = 0;
	    self.showCustom = false;
	    self.scope.$emit('range-picker:close');
	  }
	};

	var app = angular.module('abl-date-picker');
	app.directive('smRangePicker', ['picker', smRangePicker]);

	/* global moment */
	function smTimePickerNew($mdUtil, $mdMedia, $document, $timeout, picker) {
	  return {
	    restrict: 'E',
	    replace: true,
	    scope: {
	      value: '=',
	      startDate: '@',
	      weekStartDay: '@',
	      startView: '@',
	      mode: '@',
	      format: '@',
	      minDate: '@',
	      maxDate: '@',
	      fname: '@',
	      lable: '@',
	      isRequired: '@',
	      disable: '=',
	      form: '=',
	      closeOnSelect: '@'
	    },
	    templateUrl: 'picker/sm-time-picker.html',
	    link: function link(scope, $element, attr) {
	      var inputPane = $element[0].querySelector('.sm-input-container');
	      var calenderPane = $element[0].querySelector('.sm-calender-pane');
	      var cElement = angular.element(calenderPane);
	      scope.ngMassagedTempaltePath = picker.massagePath;
	      // check if Pre defined format is supplied
	      scope.format = angular.isUndefined(scope.format) ? 'MM-DD-YYYY' : scope.format;

	      // Hide calender pane on initialization
	      cElement.addClass('hide hide-animate');

	      // set start date
	      scope.startDate = angular.isUndefined(scope.value) ? scope.startDate : scope.value;

	      // Hide Calender on click out side
	      $document.on('click', function (e) {
	        if (calenderPane !== e.target && inputPane !== e.target && !calenderPane.contains(e.target) && !inputPane.contains(e.target)) {
	          hideElement();
	        }
	      });

	      // if tab out hide key board
	      angular.element(inputPane).on('keydown', function (e) {
	        if (e.which === 9) {
	          hideElement();
	        }
	      });

	      // show calender
	      scope.show = function () {
	        var elementRect = inputPane.getBoundingClientRect();
	        var bodyRect = document.body.getBoundingClientRect();

	        cElement.removeClass('hide');
	        if ($mdMedia('sm') || $mdMedia('xs')) {
	          calenderPane.style.left = (bodyRect.width - 300) / 2 + 'px';
	          calenderPane.style.top = (bodyRect.height - 450) / 2 + 'px';
	        } else {
	          var rect = getVisibleViewPort(elementRect, bodyRect);
	          calenderPane.style.left = rect.left + 'px';
	          calenderPane.style.top = rect.top + 'px';
	        }
	        document.body.appendChild(calenderPane);
	        $mdUtil.disableScrollAround(calenderPane);
	        cElement.addClass('show');
	      };

	      // calculate visible port to display calender
	      function getVisibleViewPort(elementRect, bodyRect) {
	        var calenderHeight = 460;
	        var calenderWidth = 296;

	        var top = elementRect.top;
	        if (elementRect.top + calenderHeight > bodyRect.bottom) {
	          top = elementRect.top - (elementRect.top + calenderHeight - (bodyRect.bottom - 20));
	        }
	        var left = elementRect.left;
	        if (elementRect.left + calenderWidth > bodyRect.right) {
	          left = elementRect.left - (elementRect.left + calenderWidth - (bodyRect.right - 10));
	        }
	        return {
	          top: top,
	          left: left
	        };
	      }

	      function hideElement() {
	        cElement.addClass('hide-animate');
	        cElement.removeClass('show');
	        //this is only for animation
	        //calenderPane.parentNode.removeChild(calenderPane);
	        $mdUtil.enableScrolling();
	      }

	      scope.$on('$destroy', function () {
	        calenderPane.parentNode.removeChild(calenderPane);
	      });

	      //listen to emit for closing calender
	      scope.$on('calender:close', function () {
	        hideElement();
	      });
	    }
	  };
	}

	var app = angular.module('abl-date-picker');
	app.directive('smTimePickerNew', ['$mdUtil', '$mdMedia', '$document', '$timeout', 'picker', smTimePickerNew]);

	angular.module("abl-date-picker").run(["$templateCache", function ($templateCache) {
	  $templateCache.put("picker/calender-date.html", "<div class=\"date-picker\">\n    <div ng-class=\"{\'year-container\' : vm.view===\'YEAR_MONTH\'}\" ng-show=\"vm.view===\'YEAR_MONTH\'\" layout=\"column\">\n        <a href=\"javascript:void(0)\" class=\"cal-link\" ng-click=\"vm.view = \'DATE\'\">Back to calendar</a>\n        <md-virtual-repeat-container class=\"year-md-repeat\" id=\"year-container\" md-top-index=\"vm.yearTopIndex\">\n            <div class=\"repeated-item\" md-on-demand=\"\" md-virtual-repeat=\"yr in vm.yearItems\">\n                    <div class=\"year\" ng-class=\"{\'md-accent\': yr === vm.currentDate.year(), \'selected-year md-primary \':vm.initialDate.year()===yr}\">\n                         <span class=\"year-num\" ng-click=\"vm.changeYear(yr,vm.currentDate.month())\">{{yr}}</span> \n                         <div class=\"month-list\">\n                            <div class=\"month-row\" >\n                                <span ng-click=\"vm.changeYear(yr,0)\" class=\"month\">{{vm.monthList[0]}}</span>\n                                <span ng-click=\"vm.changeYear(yr,1)\" class=\"month\">{{vm.monthList[1]}}</span>\n                                <span ng-click=\"vm.changeYear(yr,2)\" class=\"month\">{{vm.monthList[2]}}</span>\n                                <span ng-click=\"vm.changeYear(yr,3)\" class=\"month\">{{vm.monthList[3]}}</span>\n                                <span ng-click=\"vm.changeYear(yr,4)\" class=\"month\">{{vm.monthList[4]}}</span>\n                                <span ng-click=\"vm.changeYear(yr,5)\" class=\"month\">{{vm.monthList[5]}}</span>\n                            </div>\n                                <div  class=\"month-row\">\n                                <span ng-click=\"vm.changeYear(yr,6)\" class=\"month\">{{vm.monthList[6]}}</span>\n                                <span ng-click=\"vm.changeYear(yr,7)\" class=\"month\">{{vm.monthList[7]}}</span>\n                                <span ng-click=\"vm.changeYear(yr,8)\" class=\"month\">{{vm.monthList[8]}}</span>\n                                <span ng-click=\"vm.changeYear(yr,9)\" class=\"month\">{{vm.monthList[9]}}</span>\n                                <span ng-click=\"vm.changeYear(yr,10)\" class=\"month\">{{vm.monthList[10]}}</span>\n                                <span ng-click=\"vm.changeYear(yr,11)\" class=\"month\">{{vm.monthList[11]}}</span>\n                            </div>\n                         </div>                  \n                    </div>\n                    <md-divider></md-divider>\n            </div>\n        </md-virtual-repeat-container>\n    </div>\n    <div ng-class=\"{\'date-container\' : vm.view===\'DATE\'}\" ng-show=\"vm.view===\'DATE\'\">\n        <div class=\"navigation\" layout=\"row\" layout-align=\"space-between center\">\n            <md-button aria-label=\"previous\" class=\"md-icon-button scroll-button\" ng-click=\"vm.changePeriod(\'p\')\" ng-disabled=\"vm.stopScrollPrevious\">\n                <svg height=\"18\" viewbox=\"0 0 18 18\" width=\"18\" xmlns=\"http://www.w3.org/2000/svg\">\n                    <path d=\"M15 8.25H5.87l4.19-4.19L9 3 3 9l6 6 1.06-1.06-4.19-4.19H15v-1.5z\">\n                    </path>\n                </svg>\n            </md-button>\n            <md-button aria-label=\"Change Year\" class=\"md-button\" md-no-ink=\"\" ng-class=\"vm.moveCalenderAnimation\" ng-click=\"vm.changeView(\'YEAR_MONTH\')\">\n                {{vm.monthList[vm.initialDate.month()]}}{{\' \'}}{{vm.initialDate.year()}}\n            </md-button>\n            <md-button aria-label=\"next\" class=\"md-icon-button scroll-button\" ng-click=\"vm.changePeriod(\'n\')\" ng-disabled=\"vm.stopScrollNext\">\n                <svg height=\"18\" viewbox=\"0 0 18 18\" width=\"18\" xmlns=\"http://www.w3.org/2000/svg\">\n                    <path d=\"M9 3L7.94 4.06l4.19 4.19H3v1.5h9.13l-4.19 4.19L9 15l6-6z\">\n                    </path>\n                </svg>\n            </md-button>\n        </div>\n        <div class=\"date-cell-header\">\n            <md-button class=\"md-icon-button\" ng-disabled=\"true\" ng-repeat=\"dHead in vm.dateCellHeader\">\n                {{dHead[vm.dayHeader]}}\n            </md-button>\n        </div>\n        <div class=\"date-cell-row\" md-swipe-left=\"vm.changePeriod(\'n\')\" md-swipe-right=\"vm.changePeriod(\'p\')\" ng-class=\"vm.moveCalenderAnimation\">\n            <div layout=\"row\" ng-repeat=\"w in vm.dateCells\">\n                <md-button aria-label=\"vm.currentDate\" class=\"date-cell md-icon-button\" ng-class=\"{\'{{vm.colorIntention}} sm-today\' : d.today,\n								\'active\':d.isCurrentMonth,\n								\'{{vm.colorIntention}} md-raised selected\' :d.date.isSame(vm.currentDate),\n								\'disabled\':d.isDisabledDate}\" ng-click=\"vm.selectDate(d.date,d.isDisabledDate)\" ng-disabled=\"d.isDisabledDate\" ng-repeat=\"d in w\">\n                    <span>\n                        {{d.dayNum}}\n                    </span>\n                </md-button>\n            </div>\n        </div>\n    </div>\n</div>\n");
	  $templateCache.put("picker/calender-hour.html", "<div  class=\"time-picker\" layout=\"row\" layout-align=\"center center\">\n	<div>\n		<div layout=\"row\" class=\"navigation\">\n			<span class=\"md-button\">Hour</span>\n			<span class=\"md-button\">Minute</span>\n		</div>\n		<div layout=\"row\" >\n			<md-virtual-repeat-container flex=\"50\"  id=\"hour-container{{vm.uid}}\" class=\"time-md-repeat\" md-top-index=\"vm.hourTopIndex\">\n			<div ng-repeat=\"h in vm.hourItems\" class=\"repeated-item\">\n						<md-button class=\"md-icon-button\" \n							ng-click=\"vm.setHour(h.hour)\" 							\n							ng-class=\"{\'{{vm.colorIntention}}\': h.isCurrent,\n									\'{{vm.colorIntention}} md-raised\' :h.hour===vm.currentDate.hour()}\">\n							{{h.hour}}\n						</md-button>\n			</div>\n			</md-virtual-repeat-container>		     \n			<md-virtual-repeat-container flex=\"50\" id=\"minute-container\" class=\"time-md-repeat\" md-top-index=\"vm.minuteTopIndex\">\n				<div ng-repeat=\"m in vm.minuteCells\"  class=\"repeated-item\">\n						<md-button class=\"md-icon-button\" \n							ng-click=\"vm.setMinute(m.minute)\" 							\n							ng-class=\"{\'{{vm.colorIntention}}\': m.isCurrent,\n								\'{{vm.colorIntention}} md-raised\' :m.minute===vm.currentDate.minute()}\">\n							{{m.minute}}\n						</md-button>\n				</div>\n			</md-virtual-repeat-container>		     \n		</div>	\n	</div>\n</div>");
	  $templateCache.put("picker/date-picker-service.html", _service2.default);
	  $templateCache.put("picker/date-picker.html", _picker4.default);
	  $templateCache.put("picker/range-picker-input.html", "<md-input-container md-no-float=\"vm.noFloatingLabel\">\n\n    <input name=\"{{vm.fname}}\" ng-model=\"vm.valueAsText\" ng-readonly=\"true\"\n        type=\"text\"\n        aria-label=\"{{vm.fname}}\" ng-required=\"{{vm.isRequired}}\" class=\"sm-input-container\"\n        ng-focus=\"vm.show()\" placeholder=\"{{vm.label}}\"\n    />\n    <div id=\"picker\" class=\"sm-calender-pane md-whiteframe-4dp\" ng-model=\"value\">\n        <sm-range-picker\n            ng-model=\"vm.value\"\n            custom-to-home=\"{{vm.customToHome}}\"\n            custom-list=\"vm.customList\"\n            mode=\"{{vm.mode}}\"\n            min-date=\"{{vm.minDate}}\"\n            max-date=\"{{vm.maxDate}}\"\n            range-select-call=\"vm.rangeSelected(range)\"\n            close-on-select=\"{{vm.closeOnSelect}}\"\n            show-custom=\"{{vm.showCustom}}\"\n            week-start-day=\"{{vm.weekStartDay}}\"\n            divider=\"{{vm.divider}}\"\n            format=\"{{vm.format}}\"\n            allow-clear=\"{{vm.allowClear}}\"\n            allow-empty=\"{{vm.allowEmpty}}\"\n        ></sm-range-picker>\n    </div>\n</md-input-container>\n");
	  $templateCache.put("picker/range-picker.html", "<md-content layout=\"column\"  id=\"{{id}}\" class=\"range-picker md-whiteframe-2dp\" >\n    <md-toolbar layout=\"row\"  class=\"md-primary\" >\n      	<div class=\"md-toolbar-tools\"  layout-align=\"space-around center\">\n			<div  class=\"date-display\"><span>{{vm.startDate.format(vm.format)}}</span></div>\n			<div   class=\"date-display\"><span>{{vm.endDate.format(vm.format)}}</span></div>\n		</div>\n	</md-toolbar>\n	<div  layout=\"column\" class=\"pre-select\"  role=\"button\" ng-show=\"!vm.showCustom\">\n		<md-button\n			 aria-label=\"{{list.label}}\"\n			 ng-click=\"vm.setNgModelValue(list.startDate,vm.divider,list.endDate)\"\n			 ng-repeat=\"list in vm.rangeDefaultList | limitTo:6\">{{list.label}}\n		 </md-button>\n		<md-button aria-label=\"Custom Range\"  ng-click=\"vm.showCustomView()\">{{vm.customRangeLabel}}</md-button>\n	</div>\n	<div layout=\"column\" class=\"custom-select\" ng-if=\"vm.showCustom\" ng-class=\"{\'show-calender\': vm.showCustom}\">\n		<div layout=\"row\"   class=\"tab-head\">\n			<!--<span  ng-class=\"{\'active moveLeft\':vm.selectedTabIndex===0}\">{{vm.rangeCustomStartEnd[0]}}</span>-->\n			<a class=\"start-btn\" href=\"javascript:void(0)\" ng-click=\"vm.selectedTabIndex = 0;\">\n				<span>{{vm.rangeCustomStartEnd[0]}}</span>\n			</a>\n			<span  ng-class=\"{\'active moveLeft\':vm.selectedTabIndex===1}\">{{vm.rangeCustomStartEnd[1]}}</span>\n		</div>\n		<div ng-show=\"vm.selectedTabIndex===0\" ng-model=\"vm.startDate\" >\n			<div layout=\"row\" ng-if=\"vm.allowEmptyDates\" ng-click=\"vm.startDateSelected(\'\')\">\n				<md-button class=\"md-warn\"><small>No start date</small></md-button>\n			</div>\n			<sm-calender\n				ng-show=\"vm.view===\'DATE\'\"\n				week-start-day=\"{{vm.weekStartDay}}\"\n				min-date=\"vm.minDate\"\n				max-date=\"vm.maxDate\"\n				format=\"{{vm.format}}\"\n				date-select-call=\"vm.startDateSelected(date)\">\n			</sm-calender>\n			<sm-time\n				ng-show=\"vm.view===\'TIME\'\"\n				ng-model=\"selectedStartTime\"\n				time-select-call=\"vm.startTimeSelected(time)\">\n			</sm-time>\n		</div>\n		<div ng-if=\"vm.selectedTabIndex===1\" ng-model=\"vm.endDate\" >\n			<div layout=\"row\" layout-align=\"end\" ng-if=\"vm.allowEmptyDates\" ng-click=\"vm.endDateSelected(\'\')\">\n				<md-button class=\"md-warn\"><small>No end date</small></md-button>\n			</div>\n			<sm-calender\n				format=\"{{vm.format}}\"\n				ng-show=\"vm.view===\'DATE\'\"\n				initial-date=\"vm.minStartToDate.format(vm.format)\"\n				min-date=\"vm.minStartToDate\"\n				max-date=\"vm.maxDate\"\n				week-start-day=\"{{vm.weekStartDay}}\"\n				date-select-call=\"vm.endDateSelected(date)\">\n			</sm-calender>\n			<sm-time\n				ng-show=\"vm.view===\'TIME\'\"\n				ng-model=\"selectedEndTime\"\n				time-select-call=\"vm.endTimeSelected(time)\">\n			</sm-time>\n		</div>\n	</div>\n	<div layout=\"row\" layout-align=\"end center\">\n		<md-button type=\"button\" class=\"md-warn\" ng-if=\"vm.showClearButton\" ng-click=\"vm.clearDateRange()\">{{vm.clearLabel}}</md-button>\n		<span flex></span>\n		<md-button type=\"button\" class=\"md-primary\" ng-click=\"vm.cancel()\">{{vm.cancelLabel}}</md-button>\n		<md-button type=\"button\" class=\"md-primary\" ng-click=\"vm.dateRangeSelected()\">{{vm.okLabel}}</md-button>\n	</div>\n</md-content>\n");
	  $templateCache.put("picker/sm-time-picker.html", "<md-input-container>\n    <label for=\"{{fname}}\">{{lable }}</label>\n    <input name=\"{{fname}}\" ng-model=\"value\" ng-readonly=\"true\"\n        type=\"text\" placeholde=\"{{lable}}\"\n        aria-label=\"{{fname}}\" data-ng-required=\"isRequired\"\n        ng-focus=\"show()\" server-error class=\"sm-input-container\"\n    />\n    <div ng-messages=\"form.fname.$error\" ng-if=\"form[fname].$touched\">\n        <div ng-messages-include=\"{{ngMassagedTempaltePath}}\"></div>\n    </div>\n    <div id=\"picker\" class=\"sm-calender-pane md-whiteframe-15dp\">\n        <sm-time-picker\n            id=\"{{fname}}Picker\"\n            ng-model=\"value\"\n            initial-date=\"{{value}}\"\n            mode=\"{{mode}}\"\n            close-on-select=\"{{closeOnSelect}}\"\n            start-view=\"{{startView}}\"\n            data-min-date=\"minDate\"\n            data-max-date=\"maxDate\"\n            format=\"{{format}}\"\n            start-day=\"{{weekStartDay}}\"\n        ></sm-time-picker>\n    </div>\n</md-input-container>\n");
	  $templateCache.put("picker/time-picker.html", "<div class=\"picker-container  md-whiteframe-15dp\">\n	<md-content  layout-xs=\"column\" layout=\"row\"  class=\"container\" >\n		<md-toolbar class=\"md-height\" ng-class=\"{\'portrait\': !$mdMedia(\'gt-xs\'),\'landscape\': $mdMedia(\'gt-xs\')}\" >			\n				<span class=\"year-header\" layout=\"row\" layout-xs=\"row\">{{currentDate.format(\'YYYY\')}}</span>\n				<span class=\"date-time-header\" layout=\"row\" layout-xs=\"row\">{{currentDate.format(headerDispalyFormat)}}</span>\n		</md-toolbar>\n		<div layout=\"column\" class=\"picker-container\" >\n			<sm-time\n				ng-model=\"selectedTime\"\n				data-format=\"HH:mm\">\n			</sm-time>\n			<div layout=\"row\" ng-hide=\"closeOnSelect && (mode!==\'date-time\' || mode!==\'time\')\">\n					<div ng-show=\"mode===\'date-time\'\">\n						<md-button class=\"md-icon-button\" ng-show=\"view===\'DATE\'\" ng-click=\"view=\'HOUR\'\">\n							<md-icon md-font-icon=\"material-icons md-primary\">access_time</md-icon>\n						</md-button>				\n						<md-button class=\"md-icon-button\" ng-show=\"view===\'HOUR\'\" ng-click=\"view=\'DATE\'\">\n							<md-icon md-font-icon=\"material-icons md-primary\">date_range</md-icon>\n						</md-button>\n					</div>												\n					<span flex></span>\n					<md-button class=\"md-button md-primary\" ng-click=\"closeDateTime()\">{{cancelLabel}}</md-button>\n					<md-button class=\"md-button md-primary\" ng-click=\"selectedDateTime()\">{{okLabel}}</md-button>\n			</div>\n		</div>\n	</md-content>	\n</div>");
	}]);

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	module.exports = feathers;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	exports.default = init;

	var _feathersMemory = __webpack_require__(4);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var LocalStorage = function (_Service) {
	  _inherits(LocalStorage, _Service);

	  function LocalStorage() {
	    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	    _classCallCheck(this, LocalStorage);

	    var _this = _possibleConstructorReturn(this, (LocalStorage.__proto__ || Object.getPrototypeOf(LocalStorage)).call(this, options));

	    _this._storageKey = options.name || 'feathers';
	    _this._storage = options.storage || typeof window !== 'undefined' && window.localStorage;
	    _this._throttle = options.throttle || 200;
	    _this.store = null;

	    if (!_this._storage) {
	      throw new Error('The `storage` option needs to be provided');
	    }
	    return _this;
	  }

	  _createClass(LocalStorage, [{
	    key: 'ready',
	    value: function ready() {
	      var _this2 = this;

	      if (!this.store) {
	        return Promise.resolve(this._storage.getItem(this._storageKey)).then(function (str) {
	          return JSON.parse(str || '{}');
	        }).then(function (store) {
	          var keys = Object.keys(store);
	          var last = store[keys[keys.length - 1]];

	          // Current id is the id of the last item
	          _this2._uId = keys.length && typeof last[_this2.id] !== 'undefined' ? last[_this2.id] + 1 : 0;

	          return _this2.store = store;
	        });
	      }

	      return Promise.resolve(this.store);
	    }
	  }, {
	    key: 'flush',
	    value: function flush(data) {
	      var _this3 = this;

	      if (!this._timeout) {
	        this._timeout = setTimeout(function () {
	          _this3._storage.setItem(_this3._storageKey, JSON.stringify(_this3.store));
	          delete _this3._timeout;
	        }, this.throttle);
	      }

	      return data;
	    }
	  }, {
	    key: 'execute',
	    value: function execute(method) {
	      var _this4 = this;

	      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	      }

	      return this.ready().then(function () {
	        var _get2;

	        return (_get2 = _get(LocalStorage.prototype.__proto__ || Object.getPrototypeOf(LocalStorage.prototype), method, _this4)).call.apply(_get2, [_this4].concat(args));
	      });
	    }
	  }, {
	    key: 'find',
	    value: function find() {
	      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	        args[_key2] = arguments[_key2];
	      }

	      return this.execute.apply(this, ['find'].concat(args));
	    }
	  }, {
	    key: 'get',
	    value: function get() {
	      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
	        args[_key3] = arguments[_key3];
	      }

	      return this.execute.apply(this, ['get'].concat(args));
	    }
	  }, {
	    key: 'create',
	    value: function create() {
	      var _this5 = this;

	      for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
	        args[_key4] = arguments[_key4];
	      }

	      return this.execute.apply(this, ['create'].concat(args)).then(function (data) {
	        return _this5.flush(data);
	      });
	    }
	  }, {
	    key: 'patch',
	    value: function patch() {
	      var _this6 = this;

	      for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
	        args[_key5] = arguments[_key5];
	      }

	      return this.execute.apply(this, ['patch'].concat(args)).then(function (data) {
	        return _this6.flush(data);
	      });
	    }
	  }, {
	    key: 'update',
	    value: function update() {
	      var _this7 = this;

	      for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
	        args[_key6] = arguments[_key6];
	      }

	      return this.execute.apply(this, ['update'].concat(args)).then(function (data) {
	        return _this7.flush(data);
	      });
	    }
	  }, {
	    key: 'remove',
	    value: function remove() {
	      var _this8 = this;

	      for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
	        args[_key7] = arguments[_key7];
	      }

	      return this.execute.apply(this, ['remove'].concat(args)).then(function (data) {
	        return _this8.flush(data);
	      });
	    }
	  }]);

	  return LocalStorage;
	}(_feathersMemory.Service);

	function init(options) {
	  return new LocalStorage(options);
	}

	init.Service = _feathersMemory.Service;
	module.exports = exports['default'];

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	exports.default = init;

	var _uberproto = __webpack_require__(5);

	var _uberproto2 = _interopRequireDefault(_uberproto);

	var _feathersQueryFilters = __webpack_require__(6);

	var _feathersQueryFilters2 = _interopRequireDefault(_feathersQueryFilters);

	var _feathersErrors = __webpack_require__(12);

	var _feathersErrors2 = _interopRequireDefault(_feathersErrors);

	var _feathersCommons = __webpack_require__(7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Service = function () {
	  function Service() {
	    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	    _classCallCheck(this, Service);

	    this.paginate = options.paginate || {};
	    this._id = this.id = options.idField || options.id || 'id';
	    this._uId = options.startId || 0;
	    this.store = options.store || {};
	    this.events = options.events || [];
	    this._matcher = options.matcher || _feathersCommons.matcher;
	    this._sorter = options.sorter || _feathersCommons.sorter;
	  }

	  _createClass(Service, [{
	    key: 'extend',
	    value: function extend(obj) {
	      return _uberproto2.default.extend(obj, this);
	    }

	    // Find without hooks and mixins that can be used internally and always returns
	    // a pagination object

	  }, {
	    key: '_find',
	    value: function _find(params) {
	      var getFilter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _feathersQueryFilters2.default;

	      var _getFilter = getFilter(params.query || {}),
	          query = _getFilter.query,
	          filters = _getFilter.filters;

	      var values = _feathersCommons._.values(this.store).filter(this._matcher(query));

	      var total = values.length;

	      if (filters.$sort) {
	        values.sort(this._sorter(filters.$sort));
	      }

	      if (filters.$skip) {
	        values = values.slice(filters.$skip);
	      }

	      if (typeof filters.$limit !== 'undefined') {
	        values = values.slice(0, filters.$limit);
	      }

	      if (filters.$select) {
	        values = values.map(function (value) {
	          return _feathersCommons._.pick.apply(_feathersCommons._, [value].concat(_toConsumableArray(filters.$select)));
	        });
	      }

	      return Promise.resolve({
	        total: total,
	        limit: filters.$limit,
	        skip: filters.$skip || 0,
	        data: values
	      });
	    }
	  }, {
	    key: 'find',
	    value: function find(params) {
	      var paginate = typeof params.paginate !== 'undefined' ? params.paginate : this.paginate;
	      // Call the internal find with query parameter that include pagination
	      var result = this._find(params, function (query) {
	        return (0, _feathersQueryFilters2.default)(query, paginate);
	      });

	      if (!(paginate && paginate.default)) {
	        return result.then(function (page) {
	          return page.data;
	        });
	      }

	      return result;
	    }
	  }, {
	    key: 'get',
	    value: function get(id, params) {
	      if (id in this.store) {
	        return Promise.resolve(this.store[id]).then((0, _feathersCommons.select)(params, this.id));
	      }

	      return Promise.reject(new _feathersErrors2.default.NotFound('No record found for id \'' + id + '\''));
	    }

	    // Create without hooks and mixins that can be used internally

	  }, {
	    key: '_create',
	    value: function _create(data, params) {
	      var id = data[this._id] || this._uId++;
	      var current = _feathersCommons._.extend({}, data, _defineProperty({}, this._id, id));

	      return Promise.resolve(this.store[id] = current).then((0, _feathersCommons.select)(params, this.id));
	    }
	  }, {
	    key: 'create',
	    value: function create(data, params) {
	      var _this = this;

	      if (Array.isArray(data)) {
	        return Promise.all(data.map(function (current) {
	          return _this._create(current);
	        }));
	      }

	      return this._create(data, params);
	    }

	    // Update without hooks and mixins that can be used internally

	  }, {
	    key: '_update',
	    value: function _update(id, data, params) {
	      if (id in this.store) {
	        // We don't want our id to change type if it can be coerced
	        var oldId = this.store[id][this._id];

	        id = oldId == id ? oldId : id; // eslint-disable-line

	        data = _feathersCommons._.extend({}, data, _defineProperty({}, this._id, id));
	        this.store[id] = data;

	        return Promise.resolve(this.store[id]).then((0, _feathersCommons.select)(params, this.id));
	      }

	      return Promise.reject(new _feathersErrors2.default.NotFound('No record found for id \'' + id + '\''));
	    }
	  }, {
	    key: 'update',
	    value: function update(id, data, params) {
	      if (id === null || Array.isArray(data)) {
	        return Promise.reject(new _feathersErrors2.default.BadRequest('You can not replace multiple instances. Did you mean \'patch\'?'));
	      }

	      return this._update(id, data, params);
	    }

	    // Patch without hooks and mixins that can be used internally

	  }, {
	    key: '_patch',
	    value: function _patch(id, data, params) {
	      if (id in this.store) {
	        _feathersCommons._.extend(this.store[id], _feathersCommons._.omit(data, this._id));

	        return Promise.resolve(this.store[id]).then((0, _feathersCommons.select)(params, this.id));
	      }

	      return Promise.reject(new _feathersErrors2.default.NotFound('No record found for id \'' + id + '\''));
	    }
	  }, {
	    key: 'patch',
	    value: function patch(id, data, params) {
	      var _this2 = this;

	      if (id === null) {
	        return this._find(params).then(function (page) {
	          return Promise.all(page.data.map(function (current) {
	            return _this2._patch(current[_this2._id], data, params);
	          }));
	        });
	      }

	      return this._patch(id, data, params);
	    }

	    // Remove without hooks and mixins that can be used internally

	  }, {
	    key: '_remove',
	    value: function _remove(id, params) {
	      if (id in this.store) {
	        var deleted = this.store[id];
	        delete this.store[id];

	        return Promise.resolve(deleted).then((0, _feathersCommons.select)(params, this.id));
	      }

	      return Promise.reject(new _feathersErrors2.default.NotFound('No record found for id \'' + id + '\''));
	    }
	  }, {
	    key: 'remove',
	    value: function remove(id, params) {
	      var _this3 = this;

	      if (id === null) {
	        return this._find(params).then(function (page) {
	          return Promise.all(page.data.map(function (current) {
	            return _this3._remove(current[_this3._id], params);
	          }));
	        });
	      }

	      return this._remove(id, params);
	    }
	  }]);

	  return Service;
	}();

	function init(options) {
	  return new Service(options);
	}

	init.Service = Service;
	module.exports = exports['default'];

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* global define */
	/**
	 * A base object for ECMAScript 5 style prototypal inheritance.
	 *
	 * @see https://github.com/rauschma/proto-js/
	 * @see http://ejohn.org/blog/simple-javascript-inheritance/
	 * @see http://uxebu.com/blog/2011/02/23/object-based-inheritance-for-ecmascript-5/
	 */
	(function (root, factory) {
		if (true) {
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (typeof exports === 'object') {
			module.exports = factory();
		} else {
			root.Proto = factory();
		}
	}(this, function () {

		function makeSuper(_super, old, name, fn) {
			return function () {
				var tmp = this._super;

				// Add a new ._super() method that is the same method
				// but either pointing to the prototype method
				// or to the overwritten method
				this._super = (typeof old === 'function') ? old : _super[name];

				// The method only need to be bound temporarily, so we
				// remove it when we're done executing
				var ret = fn.apply(this, arguments);
				this._super = tmp;

				return ret;
			};
		}

		function legacyMixin(prop, obj) {
			var self = obj || this;
			var fnTest = /\b_super\b/;
			var _super = Object.getPrototypeOf(self) || self.prototype;
			var _old;

			// Copy the properties over
			for (var name in prop) {
				// store the old function which would be overwritten
				_old = self[name];

				// Check if we're overwriting an existing function
				if(
						((
							typeof prop[name] === 'function' &&
							typeof _super[name] === 'function'
						) || (
							typeof _old === 'function' &&
							typeof prop[name] === 'function'
						)) && fnTest.test(prop[name])
				) {
					self[name] = makeSuper(_super, _old, name, prop[name]);
				} else {
					self[name] = prop[name];
				}
			}

			return self;
		}

		function es5Mixin(prop, obj) {
			var self = obj || this;
			var fnTest = /\b_super\b/;
			var _super = Object.getPrototypeOf(self) || self.prototype;
			var descriptors = {};
			var proto = prop;
			var processProperty = function(name) {
				if(!descriptors[name]) {
					descriptors[name] = Object.getOwnPropertyDescriptor(proto, name);
				}
			};

			// Collect all property descriptors
			do {
				Object.getOwnPropertyNames(proto).forEach(processProperty);
	    } while((proto = Object.getPrototypeOf(proto)) && Object.getPrototypeOf(proto));
			
			Object.keys(descriptors).forEach(function(name) {
				var descriptor = descriptors[name];

				if(typeof descriptor.value === 'function' && fnTest.test(descriptor.value)) {
					descriptor.value = makeSuper(_super, self[name], name, descriptor.value);
				}

				Object.defineProperty(self, name, descriptor);
			});

			return self;
		}

		return {
			/**
			 * Create a new object using Object.create. The arguments will be
			 * passed to the new instances init method or to a method name set in
			 * __init.
			 */
			create: function () {
				var instance = Object.create(this);
				var init = typeof instance.__init === 'string' ? instance.__init : 'init';

				if (typeof instance[init] === 'function') {
					instance[init].apply(instance, arguments);
				}
				return instance;
			},
			/**
			 * Mixin a given set of properties
			 * @param prop The properties to mix in
			 * @param obj [optional] The object to add the mixin
			 */
			mixin: typeof Object.defineProperty === 'function' ? es5Mixin : legacyMixin,
			/**
			 * Extend the current or a given object with the given property
			 * and return the extended object.
			 * @param prop The properties to extend with
			 * @param obj [optional] The object to extend from
			 * @returns The extended object
			 */
			extend: function (prop, obj) {
				return this.mixin(prop, Object.create(obj || this));
			},
			/**
			 * Return a callback function with this set to the current or a given context object.
			 * @param name Name of the method to proxy
			 * @param args... [optional] Arguments to use for partial application
			 */
			proxy: function (name) {
				var fn = this[name];
				var args = Array.prototype.slice.call(arguments, 1);

				args.unshift(this);
				return fn.bind.apply(fn, args);
			}
		};

	}));


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	exports.default = function (query, paginate) {
	  var filters = {
	    $sort: convertSort(query.$sort),
	    $limit: getLimit(parse(query.$limit), paginate),
	    $skip: parse(query.$skip),
	    $select: query.$select,
	    $populate: query.$populate
	  };

	  return { filters: filters, query: _feathersCommons._.omit.apply(_feathersCommons._, [query].concat(PROPERTIES)) };
	};

	var _feathersCommons = __webpack_require__(7);

	var PROPERTIES = ['$sort', '$limit', '$skip', '$select', '$populate'];

	function parse(number) {
	  if (typeof number !== 'undefined') {
	    return Math.abs(parseInt(number, 10));
	  }
	}

	function getLimit(limit, paginate) {
	  if (paginate && paginate.default) {
	    var lower = typeof limit === 'number' ? limit : paginate.default;
	    var upper = typeof paginate.max === 'number' ? paginate.max : Number.MAX_VALUE;

	    return Math.min(lower, upper);
	  }

	  return limit;
	}

	function convertSort(sort) {
	  if ((typeof sort === 'undefined' ? 'undefined' : _typeof(sort)) !== 'object') {
	    return sort;
	  }

	  var result = {};

	  Object.keys(sort).forEach(function (key) {
	    return result[key] = _typeof(sort[key]) === 'object' ? sort[key] : parseInt(sort[key], 10);
	  });

	  return result;
	}

	module.exports = exports['default'];

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _arguments = __webpack_require__(8);

	var _arguments2 = _interopRequireDefault(_arguments);

	var _utils = __webpack_require__(9);

	var _hooks = __webpack_require__(11);

	var _hooks2 = _interopRequireDefault(_hooks);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  _: _utils._,
	  getArguments: _arguments2.default,
	  stripSlashes: _utils.stripSlashes,
	  hooks: _hooks2.default,
	  matcher: _utils.matcher,
	  sorter: _utils.sorter,
	  select: _utils.select,
	  makeUrl: _utils.makeUrl,
	  // lodash functions
	  each: _utils.each,
	  some: _utils.some,
	  every: _utils.every,
	  keys: _utils.keys,
	  values: _utils.values,
	  isMatch: _utils.isMatch,
	  isEmpty: _utils.isEmpty,
	  isObject: _utils.isObject,
	  extend: _utils.extend,
	  omit: _utils.omit,
	  pick: _utils.pick,
	  merge: _utils.merge
	};
	module.exports = exports['default'];

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = getArguments;

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

	var noop = exports.noop = function noop() {};
	var getCallback = function getCallback(args) {
	  var last = args[args.length - 1];
	  return typeof last === 'function' ? last : noop;
	};
	var getParams = function getParams(args, position) {
	  return _typeof(args[position]) === 'object' ? args[position] : {};
	};

	var updateOrPatch = function updateOrPatch(name) {
	  return function (args) {
	    var id = args[0];
	    var data = args[1];
	    var callback = getCallback(args);
	    var params = getParams(args, 2);

	    if (typeof id === 'function') {
	      throw new Error('First parameter for \'' + name + '\' can not be a function');
	    }

	    if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object') {
	      throw new Error('No data provided for \'' + name + '\'');
	    }

	    if (args.length > 4) {
	      throw new Error('Too many arguments for \'' + name + '\' service method');
	    }

	    return [id, data, params, callback];
	  };
	};

	var getOrRemove = function getOrRemove(name) {
	  return function (args) {
	    var id = args[0];
	    var params = getParams(args, 1);
	    var callback = getCallback(args);

	    if (args.length > 3) {
	      throw new Error('Too many arguments for \'' + name + '\' service method');
	    }

	    if (typeof id === 'function') {
	      throw new Error('First parameter for \'' + name + '\' can not be a function');
	    }

	    return [id, params, callback];
	  };
	};

	var converters = exports.converters = {
	  find: function find(args) {
	    var callback = getCallback(args);
	    var params = getParams(args, 0);

	    if (args.length > 2) {
	      throw new Error('Too many arguments for \'find\' service method');
	    }

	    return [params, callback];
	  },
	  create: function create(args) {
	    var data = args[0];
	    var params = getParams(args, 1);
	    var callback = getCallback(args);

	    if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object') {
	      throw new Error('First parameter for \'create\' must be an object');
	    }

	    if (args.length > 3) {
	      throw new Error('Too many arguments for \'create\' service method');
	    }

	    return [data, params, callback];
	  },

	  update: updateOrPatch('update'),

	  patch: updateOrPatch('patch'),

	  get: getOrRemove('get'),

	  remove: getOrRemove('remove')
	};

	function getArguments(method, args) {
	  return converters[method](args);
	}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.stripSlashes = stripSlashes;
	exports.each = each;
	exports.some = some;
	exports.every = every;
	exports.keys = keys;
	exports.values = values;
	exports.isMatch = isMatch;
	exports.isEmpty = isEmpty;
	exports.isObject = isObject;
	exports.extend = extend;
	exports.omit = omit;
	exports.pick = pick;
	exports.merge = merge;
	exports.select = select;
	exports.matcher = matcher;
	exports.sorter = sorter;
	exports.makeUrl = makeUrl;

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function stripSlashes(name) {
	  return name.replace(/^(\/*)|(\/*)$/g, '');
	}

	function each(obj, callback) {
	  if (obj && typeof obj.forEach === 'function') {
	    obj.forEach(callback);
	  } else if (isObject(obj)) {
	    Object.keys(obj).forEach(function (key) {
	      return callback(obj[key], key);
	    });
	  }
	}

	function some(value, callback) {
	  return Object.keys(value).map(function (key) {
	    return [value[key], key];
	  }).some(function (current) {
	    return callback.apply(undefined, _toConsumableArray(current));
	  });
	}

	function every(value, callback) {
	  return Object.keys(value).map(function (key) {
	    return [value[key], key];
	  }).every(function (current) {
	    return callback.apply(undefined, _toConsumableArray(current));
	  });
	}

	function keys(obj) {
	  return Object.keys(obj);
	}

	function values(obj) {
	  return _.keys(obj).map(function (key) {
	    return obj[key];
	  });
	}

	function isMatch(obj, item) {
	  return _.keys(item).every(function (key) {
	    return obj[key] === item[key];
	  });
	}

	function isEmpty(obj) {
	  return _.keys(obj).length === 0;
	}

	function isObject(item) {
	  return (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' && !Array.isArray(item) && item !== null;
	}

	function extend() {
	  return _extends.apply(undefined, arguments);
	}

	function omit(obj) {
	  var result = _.extend({}, obj);

	  for (var _len = arguments.length, keys = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    keys[_key - 1] = arguments[_key];
	  }

	  keys.forEach(function (key) {
	    return delete result[key];
	  });
	  return result;
	}

	function pick(source) {
	  var result = {};

	  for (var _len2 = arguments.length, keys = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	    keys[_key2 - 1] = arguments[_key2];
	  }

	  keys.forEach(function (key) {
	    result[key] = source[key];
	  });
	  return result;
	}

	function merge(target, source) {
	  if (isObject(target) && isObject(source)) {
	    Object.keys(source).forEach(function (key) {
	      if (isObject(source[key])) {
	        if (!target[key]) _extends(target, _defineProperty({}, key, {}));
	        merge(target[key], source[key]);
	      } else {
	        _extends(target, _defineProperty({}, key, source[key]));
	      }
	    });
	  }
	  return target;
	}

	var _ = exports._ = {
	  each: each,
	  some: some,
	  every: every,
	  keys: keys,
	  values: values,
	  isMatch: isMatch,
	  isEmpty: isEmpty,
	  isObject: isObject,
	  extend: extend,
	  omit: omit,
	  pick: pick,
	  merge: merge
	};

	var specialFilters = exports.specialFilters = {
	  $in: function $in(key, ins) {
	    return function (current) {
	      return ins.indexOf(current[key]) !== -1;
	    };
	  },
	  $nin: function $nin(key, nins) {
	    return function (current) {
	      return nins.indexOf(current[key]) === -1;
	    };
	  },
	  $lt: function $lt(key, value) {
	    return function (current) {
	      return current[key] < value;
	    };
	  },
	  $lte: function $lte(key, value) {
	    return function (current) {
	      return current[key] <= value;
	    };
	  },
	  $gt: function $gt(key, value) {
	    return function (current) {
	      return current[key] > value;
	    };
	  },
	  $gte: function $gte(key, value) {
	    return function (current) {
	      return current[key] >= value;
	    };
	  },
	  $ne: function $ne(key, value) {
	    return function (current) {
	      return current[key] !== value;
	    };
	  }
	};

	function select(params) {
	  var fields = params && params.query && params.query.$select;

	  for (var _len3 = arguments.length, otherFields = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
	    otherFields[_key3 - 1] = arguments[_key3];
	  }

	  if (Array.isArray(fields) && otherFields.length) {
	    fields.push.apply(fields, otherFields);
	  }

	  var convert = function convert(result) {
	    if (!Array.isArray(fields)) {
	      return result;
	    }

	    return _.pick.apply(_, [result].concat(_toConsumableArray(fields)));
	  };

	  return function (result) {
	    if (Array.isArray(result)) {
	      return result.map(convert);
	    }

	    return convert(result);
	  };
	}

	function matcher(originalQuery) {
	  var query = _.omit(originalQuery, '$limit', '$skip', '$sort', '$select');

	  return function (item) {
	    if (query.$or && _.some(query.$or, function (or) {
	      return matcher(or)(item);
	    })) {
	      return true;
	    }

	    return _.every(query, function (value, key) {
	      if (value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
	        return _.every(value, function (target, filterType) {
	          if (specialFilters[filterType]) {
	            var filter = specialFilters[filterType](key, target);
	            return filter(item);
	          }

	          return false;
	        });
	      } else if (typeof item[key] !== 'undefined') {
	        return item[key] === query[key];
	      }

	      return false;
	    });
	  };
	}

	function sorter($sort) {
	  return function (first, second) {
	    var comparator = 0;
	    each($sort, function (modifier, key) {
	      modifier = parseInt(modifier, 10);

	      if (first[key] < second[key]) {
	        comparator -= 1 * modifier;
	      }

	      if (first[key] > second[key]) {
	        comparator += 1 * modifier;
	      }
	    });
	    return comparator;
	  };
	}

	function makeUrl(path) {
	  var app = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	  var get = typeof app.get === 'function' ? app.get.bind(app) : function () {};
	  var env = get('env') || process.env.NODE_ENV;
	  var host = get('host') || process.env.HOST_NAME || 'localhost';
	  var protocol = env === 'development' || env === 'test' || env === undefined ? 'http' : 'https';
	  var PORT = get('port') || process.env.PORT || 3030;
	  var port = env === 'development' || env === 'test' || env === undefined ? ':' + PORT : '';

	  path = path || '';

	  return protocol + '://' + host + port + '/' + stripSlashes(path);
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)))

/***/ }),
/* 10 */
/***/ (function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	process.prependListener = noop;
	process.prependOnceListener = noop;

	process.listeners = function (name) { return [] }

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _utils = __webpack_require__(9);

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

	function getOrRemove(args) {
	  return {
	    id: args[0],
	    params: args[1],
	    callback: args[2]
	  };
	}

	function updateOrPatch(args) {
	  return {
	    id: args[0],
	    data: args[1],
	    params: args[2],
	    callback: args[3]
	  };
	}

	var converters = {
	  find: function find(args) {
	    return {
	      params: args[0],
	      callback: args[1]
	    };
	  },
	  create: function create(args) {
	    return {
	      data: args[0],
	      params: args[1],
	      callback: args[2]
	    };
	  },
	  get: getOrRemove,
	  remove: getOrRemove,
	  update: updateOrPatch,
	  patch: updateOrPatch
	};

	function hookObject(method, type, args) {
	  var app = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

	  var hook = converters[method](args);

	  hook.method = method;
	  hook.type = type;

	  if (typeof app === 'function') {
	    hook.app = app;
	  } else {
	    _extends(hook, app);
	  }

	  return hook;
	}

	function defaultMakeArguments(hook) {
	  var result = [];
	  if (typeof hook.id !== 'undefined') {
	    result.push(hook.id);
	  }

	  if (hook.data) {
	    result.push(hook.data);
	  }

	  result.push(hook.params || {});
	  result.push(hook.callback);

	  return result;
	}

	function makeArguments(hook) {
	  if (hook.method === 'find') {
	    return [hook.params, hook.callback];
	  }

	  if (hook.method === 'get' || hook.method === 'remove') {
	    return [hook.id, hook.params, hook.callback];
	  }

	  if (hook.method === 'update' || hook.method === 'patch') {
	    return [hook.id, hook.data, hook.params, hook.callback];
	  }

	  if (hook.method === 'create') {
	    return [hook.data, hook.params, hook.callback];
	  }

	  return defaultMakeArguments(hook);
	}

	function convertHookData(obj) {
	  var hook = {};

	  if (Array.isArray(obj)) {
	    hook = { all: obj };
	  } else if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') {
	    hook = { all: [obj] };
	  } else {
	    (0, _utils.each)(obj, function (value, key) {
	      hook[key] = !Array.isArray(value) ? [value] : value;
	    });
	  }

	  return hook;
	}

	exports.default = {
	  hookObject: hookObject,
	  hook: hookObject,
	  converters: converters,
	  defaultMakeArguments: defaultMakeArguments,
	  makeArguments: makeArguments,
	  convertHookData: convertHookData
	};
	module.exports = exports['default'];

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var debug = __webpack_require__(13)('feathers-errors');

	function FeathersError(msg, name, code, className, data) {
	  msg = msg || 'Error';

	  var errors = void 0;
	  var message = void 0;
	  var newData = void 0;

	  if (msg instanceof Error) {
	    message = msg.message || 'Error';

	    // NOTE (EK): This is typically to handle validation errors
	    if (msg.errors) {
	      errors = msg.errors;
	    }
	  } else if ((typeof msg === 'undefined' ? 'undefined' : _typeof(msg)) === 'object') {
	    // Support plain old objects
	    message = msg.message || 'Error';
	    data = msg;
	  } else {
	    // message is just a string
	    message = msg;
	  }

	  if (data) {
	    // NOTE(EK): To make sure that we are not messing
	    // with immutable data, just make a copy.
	    // https://github.com/feathersjs/feathers-errors/issues/19
	    newData = JSON.parse(JSON.stringify(data));

	    if (newData.errors) {
	      errors = newData.errors;
	      delete newData.errors;
	    } else if (data.errors) {
	      // The errors property from data could be
	      // stripped away while cloning resulting newData not to have it
	      // For example: when cloning arrays this property
	      errors = JSON.parse(JSON.stringify(data.errors));
	    }
	  }

	  // NOTE (EK): Babel doesn't support this so
	  // we have to pass in the class name manually.
	  // this.name = this.constructor.name;
	  this.type = 'FeathersError';
	  this.name = name;
	  this.message = message;
	  this.code = code;
	  this.className = className;
	  this.data = newData;
	  this.errors = errors || {};

	  debug(this.name + '(' + this.code + '): ' + this.message);
	  debug(this.errors);

	  if (Error.captureStackTrace) {
	    Error.captureStackTrace(this, FeathersError);
	  } else {
	    this.stack = new Error().stack;
	  }
	}

	FeathersError.prototype = Object.create(Error.prototype);

	// NOTE (EK): A little hack to get around `message` not
	// being included in the default toJSON call.
	Object.defineProperty(FeathersError.prototype, 'toJSON', {
	  value: function value() {
	    return {
	      name: this.name,
	      message: this.message,
	      code: this.code,
	      className: this.className,
	      data: this.data,
	      errors: this.errors
	    };
	  }
	});

	// 400 - Bad Request
	function BadRequest(message, data) {
	  FeathersError.call(this, message, 'BadRequest', 400, 'bad-request', data);
	}

	BadRequest.prototype = FeathersError.prototype;

	// 401 - Not Authenticated
	function NotAuthenticated(message, data) {
	  FeathersError.call(this, message, 'NotAuthenticated', 401, 'not-authenticated', data);
	}

	NotAuthenticated.prototype = FeathersError.prototype;

	// 402 - Payment Error
	function PaymentError(message, data) {
	  FeathersError.call(this, message, 'PaymentError', 402, 'payment-error', data);
	}

	PaymentError.prototype = FeathersError.prototype;

	// 403 - Forbidden
	function Forbidden(message, data) {
	  FeathersError.call(this, message, 'Forbidden', 403, 'forbidden', data);
	}

	Forbidden.prototype = FeathersError.prototype;

	// 404 - Not Found
	function NotFound(message, data) {
	  FeathersError.call(this, message, 'NotFound', 404, 'not-found', data);
	}

	NotFound.prototype = FeathersError.prototype;

	// 405 - Method Not Allowed
	function MethodNotAllowed(message, data) {
	  FeathersError.call(this, message, 'MethodNotAllowed', 405, 'method-not-allowed', data);
	}

	MethodNotAllowed.prototype = FeathersError.prototype;

	// 406 - Not Acceptable
	function NotAcceptable(message, data) {
	  FeathersError.call(this, message, 'NotAcceptable', 406, 'not-acceptable', data);
	}

	NotAcceptable.prototype = FeathersError.prototype;

	// 408 - Timeout
	function Timeout(message, data) {
	  FeathersError.call(this, message, 'Timeout', 408, 'timeout', data);
	}

	Timeout.prototype = FeathersError.prototype;

	// 409 - Conflict
	function Conflict(message, data) {
	  FeathersError.call(this, message, 'Conflict', 409, 'conflict', data);
	}

	Conflict.prototype = FeathersError.prototype;

	// 411 - Length Required
	function LengthRequired(message, data) {
	  FeathersError.call(this, message, 'LengthRequired', 411, 'length-required', data);
	}

	LengthRequired.prototype = FeathersError.prototype;

	// 422 Unprocessable
	function Unprocessable(message, data) {
	  FeathersError.call(this, message, 'Unprocessable', 422, 'unprocessable', data);
	}

	Unprocessable.prototype = FeathersError.prototype;

	// 429 Too Many Requests
	function TooManyRequests(message, data) {
	  FeathersError.call(this, message, 'TooManyRequests', 429, 'too-many-requests', data);
	}

	TooManyRequests.prototype = FeathersError.prototype;

	// 500 - General Error
	function GeneralError(message, data) {
	  FeathersError.call(this, message, 'GeneralError', 500, 'general-error', data);
	}

	GeneralError.prototype = FeathersError.prototype;

	// 501 - Not Implemented
	function NotImplemented(message, data) {
	  FeathersError.call(this, message, 'NotImplemented', 501, 'not-implemented', data);
	}

	NotImplemented.prototype = FeathersError.prototype;

	// 502 - Bad Gateway
	function BadGateway(message, data) {
	  FeathersError.call(this, message, 'BadGateway', 502, 'bad-gateway', data);
	}

	BadGateway.prototype = FeathersError.prototype;

	// 503 - Unavailable
	function Unavailable(message, data) {
	  FeathersError.call(this, message, 'Unavailable', 503, 'unavailable', data);
	}

	Unavailable.prototype = FeathersError.prototype;

	var errors = {
	  FeathersError: FeathersError,
	  BadRequest: BadRequest,
	  NotAuthenticated: NotAuthenticated,
	  PaymentError: PaymentError,
	  Forbidden: Forbidden,
	  NotFound: NotFound,
	  MethodNotAllowed: MethodNotAllowed,
	  NotAcceptable: NotAcceptable,
	  Timeout: Timeout,
	  Conflict: Conflict,
	  LengthRequired: LengthRequired,
	  Unprocessable: Unprocessable,
	  TooManyRequests: TooManyRequests,
	  GeneralError: GeneralError,
	  NotImplemented: NotImplemented,
	  BadGateway: BadGateway,
	  Unavailable: Unavailable,
	  400: BadRequest,
	  401: NotAuthenticated,
	  402: PaymentError,
	  403: Forbidden,
	  404: NotFound,
	  405: MethodNotAllowed,
	  406: NotAcceptable,
	  408: Timeout,
	  409: Conflict,
	  411: LengthRequired,
	  422: Unprocessable,
	  429: TooManyRequests,
	  500: GeneralError,
	  501: NotImplemented,
	  502: BadGateway,
	  503: Unavailable
	};

	function convert(error) {
	  if (!error) {
	    return error;
	  }

	  var FeathersError = errors[error.name];
	  var result = FeathersError ? new FeathersError(error.message, error.data) : new Error(error.message || error);

	  if ((typeof error === 'undefined' ? 'undefined' : _typeof(error)) === 'object') {
	    _extends(result, error);
	  }

	  return result;
	}

	exports.default = _extends({
	  convert: convert,
	  types: errors,
	  errors: errors
	}, errors);
	module.exports = exports['default'];

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * This is the web browser implementation of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = __webpack_require__(14);
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.storage = 'undefined' != typeof chrome
	               && 'undefined' != typeof chrome.storage
	                  ? chrome.storage.local
	                  : localstorage();

	/**
	 * Colors.
	 */

	exports.colors = [
	  'lightseagreen',
	  'forestgreen',
	  'goldenrod',
	  'dodgerblue',
	  'darkorchid',
	  'crimson'
	];

	/**
	 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
	 * and the Firebug extension (any Firefox version) are known
	 * to support "%c" CSS customizations.
	 *
	 * TODO: add a `localStorage` variable to explicitly enable/disable colors
	 */

	function useColors() {
	  // NB: In an Electron preload script, document will be defined but not fully
	  // initialized. Since we know we're in Chrome, we'll just detect this case
	  // explicitly
	  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
	    return true;
	  }

	  // is webkit? http://stackoverflow.com/a/16459606/376773
	  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
	    // is firebug? http://stackoverflow.com/a/398120/376773
	    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
	    // is firefox >= v31?
	    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
	    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
	    // double check webkit in userAgent just in case we are in a worker
	    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
	}

	/**
	 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	 */

	exports.formatters.j = function(v) {
	  try {
	    return JSON.stringify(v);
	  } catch (err) {
	    return '[UnexpectedJSONParseError]: ' + err.message;
	  }
	};


	/**
	 * Colorize log arguments if enabled.
	 *
	 * @api public
	 */

	function formatArgs(args) {
	  var useColors = this.useColors;

	  args[0] = (useColors ? '%c' : '')
	    + this.namespace
	    + (useColors ? ' %c' : ' ')
	    + args[0]
	    + (useColors ? '%c ' : ' ')
	    + '+' + exports.humanize(this.diff);

	  if (!useColors) return;

	  var c = 'color: ' + this.color;
	  args.splice(1, 0, c, 'color: inherit')

	  // the final "%c" is somewhat tricky, because there could be other
	  // arguments passed either before or after the %c, so we need to
	  // figure out the correct index to insert the CSS into
	  var index = 0;
	  var lastC = 0;
	  args[0].replace(/%[a-zA-Z%]/g, function(match) {
	    if ('%%' === match) return;
	    index++;
	    if ('%c' === match) {
	      // we only are interested in the *last* %c
	      // (the user may have provided their own)
	      lastC = index;
	    }
	  });

	  args.splice(lastC, 0, c);
	}

	/**
	 * Invokes `console.log()` when available.
	 * No-op when `console.log` is not a "function".
	 *
	 * @api public
	 */

	function log() {
	  // this hackery is required for IE8/9, where
	  // the `console.log` function doesn't have 'apply'
	  return 'object' === typeof console
	    && console.log
	    && Function.prototype.apply.call(console.log, console, arguments);
	}

	/**
	 * Save `namespaces`.
	 *
	 * @param {String} namespaces
	 * @api private
	 */

	function save(namespaces) {
	  try {
	    if (null == namespaces) {
	      exports.storage.removeItem('debug');
	    } else {
	      exports.storage.debug = namespaces;
	    }
	  } catch(e) {}
	}

	/**
	 * Load `namespaces`.
	 *
	 * @return {String} returns the previously persisted debug modes
	 * @api private
	 */

	function load() {
	  var r;
	  try {
	    r = exports.storage.debug;
	  } catch(e) {}

	  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	  if (!r && typeof process !== 'undefined' && 'env' in process) {
	    r = process.env.DEBUG;
	  }

	  return r;
	}

	/**
	 * Enable namespaces listed in `localStorage.debug` initially.
	 */

	exports.enable(load());

	/**
	 * Localstorage attempts to return the localstorage.
	 *
	 * This is necessary because safari throws
	 * when a user disables cookies/localstorage
	 * and you attempt to access it.
	 *
	 * @return {LocalStorage}
	 * @api private
	 */

	function localstorage() {
	  try {
	    return window.localStorage;
	  } catch (e) {}
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)))

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	
	/**
	 * This is the common logic for both the Node.js and web browser
	 * implementations of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
	exports.coerce = coerce;
	exports.disable = disable;
	exports.enable = enable;
	exports.enabled = enabled;
	exports.humanize = __webpack_require__(15);

	/**
	 * The currently active debug mode names, and names to skip.
	 */

	exports.names = [];
	exports.skips = [];

	/**
	 * Map of special "%n" handling functions, for the debug "format" argument.
	 *
	 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	 */

	exports.formatters = {};

	/**
	 * Previous log timestamp.
	 */

	var prevTime;

	/**
	 * Select a color.
	 * @param {String} namespace
	 * @return {Number}
	 * @api private
	 */

	function selectColor(namespace) {
	  var hash = 0, i;

	  for (i in namespace) {
	    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
	    hash |= 0; // Convert to 32bit integer
	  }

	  return exports.colors[Math.abs(hash) % exports.colors.length];
	}

	/**
	 * Create a debugger with the given `namespace`.
	 *
	 * @param {String} namespace
	 * @return {Function}
	 * @api public
	 */

	function createDebug(namespace) {

	  function debug() {
	    // disabled?
	    if (!debug.enabled) return;

	    var self = debug;

	    // set `diff` timestamp
	    var curr = +new Date();
	    var ms = curr - (prevTime || curr);
	    self.diff = ms;
	    self.prev = prevTime;
	    self.curr = curr;
	    prevTime = curr;

	    // turn the `arguments` into a proper Array
	    var args = new Array(arguments.length);
	    for (var i = 0; i < args.length; i++) {
	      args[i] = arguments[i];
	    }

	    args[0] = exports.coerce(args[0]);

	    if ('string' !== typeof args[0]) {
	      // anything else let's inspect with %O
	      args.unshift('%O');
	    }

	    // apply any `formatters` transformations
	    var index = 0;
	    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
	      // if we encounter an escaped % then don't increase the array index
	      if (match === '%%') return match;
	      index++;
	      var formatter = exports.formatters[format];
	      if ('function' === typeof formatter) {
	        var val = args[index];
	        match = formatter.call(self, val);

	        // now we need to remove `args[index]` since it's inlined in the `format`
	        args.splice(index, 1);
	        index--;
	      }
	      return match;
	    });

	    // apply env-specific formatting (colors, etc.)
	    exports.formatArgs.call(self, args);

	    var logFn = debug.log || exports.log || console.log.bind(console);
	    logFn.apply(self, args);
	  }

	  debug.namespace = namespace;
	  debug.enabled = exports.enabled(namespace);
	  debug.useColors = exports.useColors();
	  debug.color = selectColor(namespace);

	  // env-specific initialization logic for debug instances
	  if ('function' === typeof exports.init) {
	    exports.init(debug);
	  }

	  return debug;
	}

	/**
	 * Enables a debug mode by namespaces. This can include modes
	 * separated by a colon and wildcards.
	 *
	 * @param {String} namespaces
	 * @api public
	 */

	function enable(namespaces) {
	  exports.save(namespaces);

	  exports.names = [];
	  exports.skips = [];

	  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
	  var len = split.length;

	  for (var i = 0; i < len; i++) {
	    if (!split[i]) continue; // ignore empty strings
	    namespaces = split[i].replace(/\*/g, '.*?');
	    if (namespaces[0] === '-') {
	      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
	    } else {
	      exports.names.push(new RegExp('^' + namespaces + '$'));
	    }
	  }
	}

	/**
	 * Disable debug output.
	 *
	 * @api public
	 */

	function disable() {
	  exports.enable('');
	}

	/**
	 * Returns true if the given mode name is enabled, false otherwise.
	 *
	 * @param {String} name
	 * @return {Boolean}
	 * @api public
	 */

	function enabled(name) {
	  var i, len;
	  for (i = 0, len = exports.skips.length; i < len; i++) {
	    if (exports.skips[i].test(name)) {
	      return false;
	    }
	  }
	  for (i = 0, len = exports.names.length; i < len; i++) {
	    if (exports.names[i].test(name)) {
	      return true;
	    }
	  }
	  return false;
	}

	/**
	 * Coerce `val`.
	 *
	 * @param {Mixed} val
	 * @return {Mixed}
	 * @api private
	 */

	function coerce(val) {
	  if (val instanceof Error) return val.stack || val.message;
	  return val;
	}


/***/ }),
/* 15 */
/***/ (function(module, exports) {

	/**
	 * Helpers.
	 */

	var s = 1000;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var y = d * 365.25;

	/**
	 * Parse or format the given `val`.
	 *
	 * Options:
	 *
	 *  - `long` verbose formatting [false]
	 *
	 * @param {String|Number} val
	 * @param {Object} [options]
	 * @throws {Error} throw an error if val is not a non-empty string or a number
	 * @return {String|Number}
	 * @api public
	 */

	module.exports = function(val, options) {
	  options = options || {};
	  var type = typeof val;
	  if (type === 'string' && val.length > 0) {
	    return parse(val);
	  } else if (type === 'number' && isNaN(val) === false) {
	    return options.long ? fmtLong(val) : fmtShort(val);
	  }
	  throw new Error(
	    'val is not a non-empty string or a valid number. val=' +
	      JSON.stringify(val)
	  );
	};

	/**
	 * Parse the given `str` and return milliseconds.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */

	function parse(str) {
	  str = String(str);
	  if (str.length > 100) {
	    return;
	  }
	  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
	    str
	  );
	  if (!match) {
	    return;
	  }
	  var n = parseFloat(match[1]);
	  var type = (match[2] || 'ms').toLowerCase();
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'yrs':
	    case 'yr':
	    case 'y':
	      return n * y;
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d;
	    case 'hours':
	    case 'hour':
	    case 'hrs':
	    case 'hr':
	    case 'h':
	      return n * h;
	    case 'minutes':
	    case 'minute':
	    case 'mins':
	    case 'min':
	    case 'm':
	      return n * m;
	    case 'seconds':
	    case 'second':
	    case 'secs':
	    case 'sec':
	    case 's':
	      return n * s;
	    case 'milliseconds':
	    case 'millisecond':
	    case 'msecs':
	    case 'msec':
	    case 'ms':
	      return n;
	    default:
	      return undefined;
	  }
	}

	/**
	 * Short format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function fmtShort(ms) {
	  if (ms >= d) {
	    return Math.round(ms / d) + 'd';
	  }
	  if (ms >= h) {
	    return Math.round(ms / h) + 'h';
	  }
	  if (ms >= m) {
	    return Math.round(ms / m) + 'm';
	  }
	  if (ms >= s) {
	    return Math.round(ms / s) + 's';
	  }
	  return ms + 'ms';
	}

	/**
	 * Long format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function fmtLong(ms) {
	  return plural(ms, d, 'day') ||
	    plural(ms, h, 'hour') ||
	    plural(ms, m, 'minute') ||
	    plural(ms, s, 'second') ||
	    ms + ' ms';
	}

	/**
	 * Pluralization helper.
	 */

	function plural(ms, n, name) {
	  if (ms < n) {
	    return;
	  }
	  if (ms < n * 1.5) {
	    return Math.floor(ms / n) + ' ' + name;
	  }
	  return Math.ceil(ms / n) + ' ' + name + 's';
	}


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _utils = __webpack_require__(9);

	var _resource = __webpack_require__(17);

	var _resource2 = _interopRequireDefault(_resource);

	var _list = __webpack_require__(19);

	var _list2 = _interopRequireDefault(_list);

	var _strategies = __webpack_require__(20);

	var _strategies2 = _interopRequireDefault(_strategies);

	var _utils2 = __webpack_require__(18);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var debug = __webpack_require__(13)('feathers-reactive');

	function FeathersRx(Rx, options) {
	  if (!Rx) {
	    throw new Error('You have to pass an instance of RxJS as the first paramter.');
	  }

	  if (!Rx.Observable) {
	    throw new Error('The RxJS instance does not seem to provide an `Observable` type.');
	  }

	  var listStrategies = (0, _strategies2.default)(Rx);

	  options = Object.assign({
	    idField: 'id',
	    dataField: 'data',
	    sorter: _utils2.makeSorter,
	    lazy: false,
	    matcher: _utils.matcher,
	    // Whether to requery service when a change is detected
	    listStrategy: 'smart',
	    listStrategies: listStrategies
	  }, options);

	  var mixin = function mixin(service) {
	    var app = this;
	    var mixin = {
	      rx: function rx() {
	        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	        this._rx = options;
	        return this;
	      }
	    };
	    var events = {
	      created: Rx.Observable.fromEvent(service, 'created'),
	      updated: Rx.Observable.fromEvent(service, 'updated'),
	      patched: Rx.Observable.fromEvent(service, 'patched'),
	      removed: Rx.Observable.fromEvent(service, 'removed')
	    };

	    app.methods.forEach(function (method) {
	      if (typeof service[method] === 'function') {
	        mixin[method] = method === 'find' ? (0, _list2.default)(Rx, events, options) : (0, _resource2.default)(Rx, events, options, method);
	      }
	    });

	    service.mixin(mixin);
	  };

	  return function () {
	    debug('Initializing feathers-reactive plugin');

	    this.mixins.push(mixin);
	  };
	}

	FeathersRx.strategy = _strategies2.default;

	exports.default = FeathersRx;
	module.exports = exports['default'];

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.paramsPositions = undefined;

	exports.default = function (Rx, events, settings, method) {
	  return function () {
	    var args = arguments;
	    var position = typeof paramsPositions[method] !== 'undefined' ? paramsPositions[method] : 1;
	    var params = arguments[position] || {};

	    if (this._rx === false || params.rx === false) {
	      return this._super.apply(this, _toConsumableArray(args));
	    }

	    var options = (0, _utils.getOptions)(settings, this._rx, params.rx);
	    var source = (0, _utils.getSource)(Rx, options.lazy, this._super.bind(this), args);
	    var stream = source.concat(source.exhaustMap(function (data) {
	      // Filter only data with the same id
	      var filter = function filter(current) {
	        return current[options.idField] === data[options.idField];
	      };
	      // `removed` events get special treatment
	      var filteredRemoves = events.removed.filter(filter);
	      // `created`, `updated` and `patched`
	      var filteredEvents = Rx.Observable.merge(events.created, events.updated, events.patched).filter(filter);

	      return Rx.Observable.merge(
	      // Map to a callback that merges old and new data
	      filteredEvents,
	      // filtered `removed` events always map to a function that returns `null`
	      filteredRemoves.map(function () {
	        return null;
	      }));
	    }));

	    return (0, _utils.promisify)(stream);
	  };
	};

	var _utils = __webpack_require__(18);

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	// The position of the params parameters for a service method so that we can extend them
	// default is 1
	var paramsPositions = exports.paramsPositions = {
	  update: 2,
	  patch: 2
	};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	exports.getSource = getSource;
	exports.promisify = promisify;
	exports.makeSorter = makeSorter;
	exports.getOptions = getOptions;

	var _utils = __webpack_require__(9);

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function getSource(Rx, lazy, __super, args) {
	  if (lazy === true) {
	    var _ret = function () {
	      var result = null;

	      return {
	        v: Rx.Observable.create(function (observer) {
	          var _observer = observer;

	          if (!result) {
	            result = __super.apply(undefined, _toConsumableArray(args));
	          }

	          if (!result || typeof result.then !== 'function' || typeof result.catch !== 'function') {
	            throw new Error('feathers-reactive only works with services that return a Promise');
	          }

	          result.then(function (res) {
	            _observer.next(res);
	            _observer.complete();
	          }).catch(function (e) {
	            return _observer.error(e);
	          });
	        })
	      };
	    }();

	    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	  }

	  return Rx.Observable.fromPromise(__super.apply(undefined, _toConsumableArray(args)));
	}

	function promisify(stream) {
	  return Object.assign(stream, {
	    then: function then() {
	      var _first$toPromise;

	      return (_first$toPromise = this.first().toPromise()).then.apply(_first$toPromise, arguments);
	    },
	    catch: function _catch() {
	      var _first$toPromise2;

	      return (_first$toPromise2 = this.first().toPromise()).catch.apply(_first$toPromise2, arguments);
	    }
	  });
	}

	function makeSorter(query, options) {
	  // The sort function (if $sort is set)
	  var sorter = query.$sort ? (0, _utils.sorter)(query.$sort) : (0, _utils.sorter)(_defineProperty({}, options.idField, 1));

	  return function (result) {
	    var isPaginated = !!result[options.dataField];
	    var data = isPaginated ? result[options.dataField] : result;

	    if (sorter) {
	      data = data.sort(sorter);
	    }

	    var limit = typeof result.limit === 'number' ? result.limit : parseInt(query.$limit, 10);

	    if (limit && !isNaN(limit)) {
	      data = data.slice(0, limit);
	    }

	    if (isPaginated) {
	      result[options.dataField] = data;
	    } else {
	      result = data;
	    }

	    return result;
	  };
	}

	function getOptions(base) {
	  for (var _len = arguments.length, others = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    others[_key - 1] = arguments[_key];
	  }

	  var options = Object.assign.apply(Object, [{}, base].concat(others));

	  if (typeof options.listStrategy === 'string') {
	    options.listStrategy = options.listStrategies[options.listStrategy];
	  }

	  return options;
	}

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (Rx, events, settings) {
	  return function () {
	    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	    var args = arguments;

	    if (this._rx === false || params.rx === false) {
	      return this._super.apply(this, _toConsumableArray(args));
	    }

	    var options = (0, _utils.getOptions)(settings, this._rx, params.rx);
	    var source = (0, _utils.getSource)(Rx, options.lazy, this._super.bind(this), arguments);
	    var stream = options.listStrategy.call(this, source, events, options, args);

	    return (0, _utils.promisify)(stream);
	  };
	};

	var _utils = __webpack_require__(18);

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	module.exports = exports['default'];

/***/ }),
/* 20 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (Rx) {
	  return {
	    never: function never(source) {
	      return source;
	    },
	    always: function always(source, events, options, args) {
	      var params = args[0] || {};
	      var query = Object.assign({}, params.query);
	      var _super = this._super.bind(this);

	      // A function that returns if an item matches the query
	      var matches = options.matcher(query);
	      // A function that sorts a limits a result (paginated or not)
	      var sortAndTrim = options.sorter(query, options);

	      return source.concat(source.exhaustMap(function () {
	        return Rx.Observable.merge(events.created.filter(matches), events.removed, events.updated, events.patched).flatMap(function () {
	          var source = Rx.Observable.fromPromise(_super.apply(undefined, _toConsumableArray(args)));

	          return source.map(sortAndTrim);
	        });
	      }));
	    },
	    smart: function smart(source, events, options, args) {
	      var params = args[0] || {};
	      var query = Object.assign({}, params.query);
	      // A function that returns if an item matches the query
	      var matches = options.matcher(query);
	      // A function that sorts a limits a result (paginated or not)
	      var sortAndTrim = options.sorter(query, options);
	      var onCreated = function onCreated(eventData) {
	        return function (page) {
	          var isPaginated = !!page[options.dataField];
	          var process = function process(data) {
	            return data.concat(eventData);
	          };

	          if (isPaginated) {
	            return Object.assign({}, page, _defineProperty({
	              total: page.total + 1
	            }, options.dataField, process(page[options.dataField])));
	          }

	          return process(page);
	        };
	      };
	      var onRemoved = function onRemoved(eventData) {
	        return function (page) {
	          var isPaginated = !!page[options.dataField];
	          var process = function process(data) {
	            return data.filter(function (current) {
	              return eventData[options.idField] !== current[options.idField];
	            });
	          };

	          if (isPaginated) {
	            return Object.assign({}, page, _defineProperty({
	              total: matches(eventData) ? page.total - 1 : page.total
	            }, options.dataField, process(page[options.dataField])));
	          }

	          return process(page);
	        };
	      };
	      var onUpdated = function onUpdated(eventData) {
	        return function (page) {
	          var isPaginated = !!page[options.dataField];
	          var length = isPaginated ? page[options.dataField].length : page.length;
	          var process = function process(data) {
	            return data.filter(function (current) {
	              return eventData[options.idField] !== current[options.idField];
	            }).concat(eventData).filter(matches);
	          };

	          if (isPaginated) {
	            var processed = process(page[options.dataField]);
	            return Object.assign({}, page, _defineProperty({
	              // Total can be either decreased or increased based
	              // on if the update removed or added the item to the list
	              total: page.total - (length - processed.length)
	            }, options.dataField, processed));
	          }

	          return process(page);
	        };
	      };

	      return source.concat(source.exhaustMap(function (data) {
	        return Rx.Observable.merge(events.created.filter(matches).map(onCreated), events.removed.map(onRemoved), Rx.Observable.merge(events.updated, events.patched).map(onUpdated)).scan(function (current, callback) {
	          return sortAndTrim(callback(current));
	        }, data);
	      }));
	    }
	  };
	};

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	module.exports = exports["default"];

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = feathersAuth;

	var _feathers = __webpack_require__(2);

	var _feathers2 = _interopRequireDefault(_feathers);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function feathersAuth(app, provider, authStorage, $rootScope) {
	    app.configure(_feathers2.default.authentication({
	        storage: authStorage
	    }));

	    app.tokenAuth = function () {
	        return provider.app.authenticate({
	            type: 'token',
	            'token': window.localStorage['feathers-jwt']
	        }).then(function (result) {
	            console.info('jwt authenticated at ', Date.now());
	            $rootScope.user = result.data;
	            return true;
	        }).catch(function (error) {
	            console.error('Error authenticating!', error);
	            provider.app.logout();
	            return false;
	        });
	    };

	    app.localAuth = function (user, pass) {
	        return provider.app.authenticate({
	            type: 'local',
	            'username': user,
	            'password': pass
	        }).then(function (result) {
	            console.log('Authenticated!', result);
	            $rootScope.user = result.data;
	            $rootScope.authenticated = true;
	            $rootScope.token = result['token'];
	            return result;
	        }).catch(function (error) {
	            console.error('Error authenticating!', error);
	            that.app.tokenLogout();
	            return error;
	        });
	    };

	    app.tokenLogout = function () {
	        provider.app.logout();
	        window.localStorage.removeItem('feathers-jwt');
	        $rootScope.authenticated = false;
	        $rootScope.user = null;
	        $rootScope.token = null;
	        console.log('Logged out.');
	    };

	    return app;
	}

/***/ }),
/* 22 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = setupUtilityFunctions;
	function setupUtilityFunctions(app, $mdToast, $rootScope) {

	    app.showToast = function (msg, toastClass, delay) {
	        if (!toastClass) var toastClass = '';
	        if (!delay) var delay = 3000;

	        var toast = $mdToast.simple().textContent(msg).action('Hide').hideDelay(delay).position('bottom left').highlightAction(false).toastClass(toastClass);
	        $mdToast.show(toast);
	        console.debug('showToast ', toastClass, msg);
	    };

	    //Return random integer between min and max
	    app.randomInt = function (min, max) {
	        return Math.floor(Math.random() * (max - min + 1) + min);
	    };

	    $rootScope.showToast = function (a, b, c) {
	        app.showToast(a, b, c); //Legacy support
	    };

	    // Application-wide safeApply function for usage in child controllers as
	    // better alternative to $apply();
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
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(24);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(26)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(24, function() {
				var newContent = __webpack_require__(24);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(25)(undefined);
	// imports


	// module
	exports.push([module.id, "md-list {\n    display: block;\n    padding: 0px 0px 0px 0px;\n}\n\n.list-item-48 {\n    height: 36px;\n    min-height: 36px;\n    font-size: 14px;\n    font-weight: 300;\n}\n\n.activityPaymentSummaryCard {\n    margin-bottom: 8px;\n    margin-top: 8px;\n    margin-right: 0;\n    margin-left: 0;\n    background: none;\n    box-shadow: none;\n    position: relative;\n}\n\n.activityPaymentSummaryCardMobile {}\n\n.paymentSummaryCard {\n    min-width: 100%;\n    margin-bottom: 8px;\n    margin-right: 16px;\n    margin-top: 0px;\n    background: none;\n    box-shadow: none;\n}\n\n.paymentSummaryCardLarge {\n    /*min-width: 370px;*/\n    width: 100%;\n    margin-bottom: 0;\n    margin-top: 0;\n    padding-right: 0;\n    padding-left: 0;\n}\n\n.paymentHeader p {\n    color: rgba(0, 0, 0, .8) !important;\n    font-weight: 500;\n    letter-spacing: 0.012em;\n    margin: 0 0 0 0;\n    line-height: 1.6em;\n}\n\n.paymentTitle {\n    font-size: 20px !important;\n}\n\n.paymentSubTitle {\n    font-size: 14px !important;\n    font-weight: 400;\n}\n\n.lineItemIcon {\n    width: 32px;\n    height: 32px;\n    margin: 4px 4px 4px -6px;\n    background: url('https://s3.amazonaws.com/assets.ablsolution.com/icons/stopwatch-2.svg') no-repeat;\n    background-position: center;\n    background-size: 28px 28px;\n}\n\n.headerIcon {\n    vertical-align: middle;\n    height: 36px;\n    width: 40px;\n    padding-right: 16px;\n}\n\n.headerIconRight {\n    padding-left: 16px;\n}\n\n.headerIcon svg {\n    position: absolute;\n    top: 24px;\n    bottom: 24px;\n    height: 24px;\n    width: 24px;\n}\n\n.lineItemText {\n    font-size: 14px;\n    font-weight: 500;\n    letter-spacing: 0.010em;\n    margin: 0 0 0 0;\n    line-height: 1.6em;\n    overflow: hidden;\n    white-space: nowrap;\n    text-overflow: ellipsis;\n    color: rgba(0, 0, 0, 0.54) !important;\n}\n\n.lineItemDetail {\n    background: rgba(255, 255, 255, .1);\n}\n\n.lineItemDetail p {\n    font-size: 12px;\n    color: rgba(0, 0, 0, .77);\n    font-weight: 400;\n}\n\n.lineItemHeader p {\n    font-size: 16px;\n    font-weight: 400;\n    letter-spacing: 0.010em;\n    margin: 0 0 0 0;\n    line-height: 50px;\n    overflow: hidden;\n    white-space: nowrap;\n    text-overflow: ellipsis;\n    color: rgba(0, 0, 0, 0.82) !important;\n}\n\n.lineItemSubHeader {\n    font-size: 16px;\n    font-weight: 400;\n    margin: 0 0 0 0;\n    line-height: 1.6em;\n    overflow: hidden;\n    white-space: nowrap;\n    text-overflow: ellipsis;\n    color: rgba(0, 0, 0, 0.82) !important;\n}\n\n.lineItemSubDetail {\n    font-size: 12px;\n    font-weight: 500;\n    margin: 0 0 0 0;\n    line-height: 1.6em;\n    overflow: hidden;\n    white-space: nowrap;\n    text-overflow: ellipsis;\n    color: rgba(0, 0, 0, .6);\n}\n\n.lineItemHeader {\n    background: rgba(0, 0, 0, 0);\n    color: rgba(0, 0, 0, .7) !important;\n}\n\n.addOnAdjusters {\n    width: 36px;\n    margin-right: 16px;\n}\n\n.addOnQuantityText {\n    border: none;\n    width: 40px;\n    font-weight: 500;\n    text-align: center;\n    font-size: 16px;\n    outline: none;\n}\n\n.guestIcon {\n    width: 32px;\n    height: 32px;\n    margin: 4px 4px 4px -6px;\n    background: url('https://s3.amazonaws.com/assets.ablsolution.com/icons/user-3.svg') no-repeat;\n    background-position: center;\n    background-size: 28px 28px;\n}\n\n.lineItemIconRight {\n    width: 40px;\n    height: 40px;\n    margin: 4px -6px 4px 4px;\n    background: url('https://s3.amazonaws.com/assets.ablsolution.com/icons/calendar.svg') no-repeat;\n    background-position: center;\n    background-size: 28px 28px;\n}\n\n.locationHeader {\n    font-size: 14px !important;\n    letter-spacing: 0.010em;\n    line-height: 20px;\n    color: rgba(0, 0, 0, 0.66) !important;\n}\n\n.total {\n    font-size: 16px;\n    letter-spacing: 0.01em;\n    color: rgba(0, 0, 0, 0.8);\n}\n\n.activityTotal {\n    font-size: 16px;\n    letter-spacing: 0.01em;\n    color: rgba(0, 0, 0, 0.8);\n}\n\n.spacer {\n    margin: 4px;\n    width: 8px;\n}\n\n.darkerDivider {\n    border-top-color: rgba(0, 0, 0, 0.12);\n}\n\n.totalDivider {\n    display: block;\n    border-top-width: 1px;\n}\n\n.lineItemDetailDivider {\n    border-top-color: rgba(0, 0, 0, 0.0);\n}\n\n.paymentSummaryImage {\n    height: 120px;\n    margin: 24px 12px 0 12px;\n    background-position: center center;\n    background-repeat: no-repeat;\n    border-radius: 2px;\n}\n\n.paymentSummaryImageBig {\n    height: 244px;\n    margin: 24px 12px 0 12px;\n    background-position: center center;\n    background-repeat: no-repeat;\n    border-radius: 2px;\n    /*box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .6);*/\n}\n\n.mobileList {\n    height: 100%;\n}\n\n.mobileBottomBar {\n    position: fixed;\n    bottom: 0;\n    left: 0;\n    right: 0;\n}\n\n.cardForm {\n    margin: 16px 16px 16px 16px;\n}\n\n.addonForm {\n    padding-left: 16px;\n    padding-right: 16px;\n}\n\n.activityCardForm {\n    margin: 0 16px 0 16px;\n}\n\n.activityForm {\n    padding-left: 24px;\n    padding-right: 16px;\n}\n\n.questionForm {\n    padding-left: 16px;\n    padding-right: 40px;\n}\n\n.formHeader {\n    padding: 16px 12px 16px 0;\n    margin: 0;\n    font-size: 22px;\n    font-weight: 500;\n}\n\n.paymentHeader._md-button-wrap>div.md-button:first-child {\n    font-size: 22px;\n    /*box-shadow: 0 1px rgba(0, 0, 0, .12);*/\n}\n\n.listIcon {\n    height: 24px;\n    width: 24px;\n    margin-left: 8px;\n}\n\n.listIconSub {\n    height: 20px;\n    width: 20px;\n    color: rgba(0, 0, 0, .5);\n    fill: rgba(0, 0, 0, .5);\n    outline: none;\n}\n\n.listIconSub svg {\n    height: 20px;\n    width: 20px;\n}\n\n.listIconSub:hover {\n    height: 20px;\n    width: 20px;\n    color: rgba(0, 0, 0, .86);\n    fill: rgba(0, 0, 0, .86);\n    outline: none;\n}\n\n.formButton {\n    margin-right: 0;\n}\n\n.stepStatusRow ng-md-icon svg {\n    height: 16px;\n    margin-top: 1px;\n    vertical-align: top;\n}\n\n\n/*md-list-item:disabled .md-list-item-text,\nmd-list-item[disabled=disabled] .md-list-item-text{\n    color: #ccc;\n}*/\n\nmd-list-item.addOnListItem {\n    margin-right: -24px;\n    padding-left: 0;\n}\n\nmd-list-item.listItemNotButton {\n    padding: 0 8px !important;\n}\n\n.totalListItem {\n    margin-bottom: 12px;\n}\n\n.listMessage {\n    font-size: 16px;\n    line-height: 1.6em;\n    padding: 0 4px;\n}\n\n.slideDown.ng-hide {\n    height: 0;\n    transition: height 0.35s ease;\n    overflow: hidden;\n    position: relative;\n}\n\n.slideDown {\n    transition: height 0.35s ease;\n    overflow: hidden;\n    position: relative;\n}\n\n.slideDown.ng-hide-remove,\n.slideDown.ng-hide-add {\n    /* remember, the .hg-hide class is added to element\n  when the active class is added causing it to appear\n  as hidden. Therefore set the styling to display=block\n  so that the hide animation is visible */\n    display: block!important;\n}\n\n.slideDown.ng-hide-add {\n    animation-name: hide;\n    -webkit-animation-name: hide;\n    animation-duration: .5s;\n    -webkit-animation-duration: .5s;\n    animation-timing-function: ease-in;\n    -webkit-animation-timing-function: ease-in;\n}\n\n.slideDown.ng-hide-remove {\n    animation-name: show;\n    -webkit-animation-name: show;\n    animation-duration: .5s;\n    -webkit-animation-duration: .5s;\n    animation-timing-function: ease-out;\n    -webkit-animation-timing-function: ease-out;\n}\n\nng-md-icon {\n    margin: 0 !important;\n}\n\n.couponInput {\n    width: 100%;\n    border: none;\n    /* background-color: rgba(0, 0, 0, .08); */\n    /* border-radius: 3px; */\n    padding: 12px;\n    /* width: 100%; */\n    box-shadow: none;\n    margin-left: -12px;\n    line-height: 36px;\n    outline: none;\n}\n\n.remove-coupon {\n    cursor: pointer;\n}\n\n.toUppercase {\n    text-transform: uppercase;\n}\n\n.listItemCircularProgress {\n    /*margin-right: -6px;*/\n}\n\nmd-list-item:hover {\n    background: transparent;\n}\n\nmd-list-item.md-button.md-default-theme:not([disabled]):hover,\n.md-button:not([disabled]):hover {\n    background-color: transparent;\n}\n\n.easeIn.ng-hide-add,\n.easeIn.ng-hide-remove {\n    -webkit-transition: 0.5s ease-in-out opacity;\n    -moz-transition: 0.5s ease-in-out opacity;\n    -ms-transition: 0.5s ease-in-out opacity;\n    -o-transition: 0.5s ease-in-out opacity;\n    transition: 0.5s ease-in-out opacity;\n    opacity: 1;\n}\n\n.easeIn.ng-hide {\n    -webkit-transition: 0s ease-in-out opacity;\n    -moz-transition: 0s ease-in-out opacity;\n    -ms-transition: 0s ease-in-out opacity;\n    -o-transition: 0s ease-in-out opacity;\n    transition: 0s ease-in-out opacity;\n    opacity: 0;\n}\n\n.couponText {\n    margin-left: 16px;\n}\n\n.md-button[disabled] {\n    pointer-events: none;\n}\n\n.subtotalLineItem {\n    padding: 8px 32px 8px 16px;\n}\n\n.subtotalLineItemSmall {\n    font-size: 12px;\n}\n\n.bottomTotal {\n    font-size: 16px;\n    margin-top: 8px;\n    margin-bottom: 16px;\n    font-weight: 600;\n}\n\n.inputStatusIcon {\n    height: 24px;\n    width: 24px;\n    margin-bottom: 16px !important;\n    margin-right: 12px !important\n}\n\n.payzenIframe {\n    border: none;\n    outline: none;\n    width: 100%;\n}\n\n.small-label {\n    font-size: 12px;\n    padding-left: 4px;\n}\n\n.confirmation {\n    padding: 20px 0;\n    text-align: center;\n}\n\n.confirmation h3 {\n    text-align: center;\n    margin-bottom: 20px;\n}\n\n.confirmation .margin-top {\n    margin-top: 8px;\n}\n\n.confirmation .booking-id {\n    padding: 15px;\n    color: #fff;\n    display: inline-block;\n    margin: 20px auto;\n    width: 260px;\n    opacity: 0.8;\n    font-weight: bold;\n}\n\nbody[md-theme=blue] .confirmation .booking-id {\n    background: #3F51B5;\n}\n\nbody[md-theme=blue] .confirmation .booking-id {\n    background: #009688;\n}\n\nbody[md-theme=green] .confirmation .booking-id {\n    background: #4CAF50;\n}\n\nbody[md-theme=grey] .confirmation .booking-id {\n    background: #9E9E9E;\n}\n\nbody[md-theme=blue_grey] .confirmation .booking-id {\n    background: #607D8B;\n}\n\nbody[md-theme=yellow] .confirmation .booking-id {\n    background: #FFEB3B;\n}\n\nbody[md-theme=indigo] .confirmation .booking-id {\n    background: #3F51B5;\n}\n\nbody[md-theme=red] .confirmation .booking-id {\n    background: #F44336;\n}\n\nbody[md-theme=black] .confirmation .booking-id {\n    background: #000000;\n}\n\n@media(max-width: 600px) {\n    .confirmation {\n        padding: 20px;\n        font-size: 13px;\n    }\n}\n\n.no-margin {\n    margin: 0 !important;\n}\n\n.detailsForm {\n    padding-top: 16px;\n}\n\n.picker-container {\n    border-radius: 2px;\n    background: white;\n}\n\n.bigDateToolbar {\n    background: white !important;\n    color: black !important;\n}\n\n.activity-dialog-container {\n    display: -ms-flexbox;\n    display: flex;\n    -ms-flex-pack: center;\n    justify-content: center;\n    -ms-flex-align: center;\n    align-items: center;\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    z-index: 80;\n    overflow: hidden;\n}\n\n.activity-dialog,\nmd-dialog.activity-dialog {\n    width: 80%;\n    max-height: 80%;\n    position: relative;\n    overflow: auto;\n    box-shadow: 0px 7px 8px -4px rgba(0, 0, 0, 0.2), 0px 13px 19px 2px rgba(0, 0, 0, 0.14), 0px 5px 24px 4px rgba(0, 0, 0, 0.12);\n    display: -ms-flexbox;\n    display: flex;\n    overflow-x: hidden;\n    -ms-flex-direction: column;\n    flex-direction: column;\n}\n\n.no-margin {\n    margin: 0 !important;\n}\n\n.leftCard {\n    /*background: rgba(0, 0, 0, .025);*/\n}\n\n.leftCardLarge {\n    /*border-right: 1px solid #e4e4e4 !important;\n    box-shadow: 1px 0 5px 1px rgba(0, 0, 0, 0.12) !important;*/\n    min-height: 100%;\n    height: 100%;\n}\n\n.leftCardSmall {\n    border-bottom: 1px solid #e4e4e4 !important;\n    /*box-shadow: 0 1px 5px rgba(0, 0, 0, 0.08) !important;*/\n}\n\n.rightCardLarge {\n    height: 100%;\n    min-height: 100%;\n}\n\n.addOnQuantityText {\n    border: none;\n    width: 40px;\n    font-weight: 500;\n    text-align: center;\n    font-size: 16px;\n    outline: none;\n    background: transparent;\n}\n\n.activityPaymentSummaryCard {\n    margin-bottom: 0 !important;\n    margin-top: 0 !important;\n    margin-right: 0;\n    margin-left: 0;\n    background: none;\n    box-shadow: none;\n    position: relative;\n}\n\n.activityCardForm {\n    margin: 0 16px 0 16px;\n}\n\n.detailsForm {\n    padding-left: 16px;\n    padding-right: 16px;\n}", ""]);

	// exports


/***/ }),
/* 25 */
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
/* 26 */
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
		fixUrls = __webpack_require__(27);

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
/* 27 */
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
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(29);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(26)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(29, function() {
				var newContent = __webpack_require__(29);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(25)(undefined);
	// imports


	// module
	exports.push([module.id, ".abl-input-container {\n    min-height: 36px;\n    border-color: transparent;\n    outline: none;\n}\n\n.sm-calender-pane {\n    display: block;\n    position: fixed;\n    z-index: 81;\n    overflow: hidden;\n    border-radius: 2px;\n}\n\n.sm-calender-pane.hide-animate {\n    -webkit-transition: all 1s cubic-bezier(0.04, 1.01, 0.13, 1.02);\n    -moz-transition: all 1s cubic-bezier(0.04, 1.01, 0.13, 1.02);\n    -o-transition: all 1s cubic-bezier(0.04, 1.01, 0.13, 1.02);\n    transition: all 1s cubic-bezier(0.04, 1.01, 0.13, 1.02);\n    max-height: 0px;\n    max-width: 0px;\n}\n\n.sm-calender-pane.show {\n    -webkit-transition: all 1s cubic-bezier(0.04, 1.01, 0.13, 1.02);\n    -moz-transition: all 1s cubic-bezier(0.04, 1.01, 0.13, 1.02);\n    -o-transition: all 1s cubic-bezier(0.04, 1.01, 0.13, 1.02);\n    transition: all 1s cubic-bezier(0.04, 1.01, 0.13, 1.02);\n    max-height: 500px;\n    max-width: 450px;\n}\n\n.sm-calender-pane .action {\n    height: 30px;\n    margin-bottom: 0;\n    position: absolute;\n    bottom: 0;\n    width: 100%;\n}\n\n@media only screen and (min-device-width: 0px) and (max-device-width: 960px) {\n    .sm-calender-pane {\n        overflow: hidden;\n    }\n    .sm-calender-pane.hide {\n        -webkit-animation: scaleDownCal 1s cubic-bezier(0.04, 1.01, 0.13, 1.02);\n        -moz-animation: scaleDownCal 1s cubic-bezier(0.04, 1.01, 0.13, 1.02);\n        -o-animation: scaleDownCal 1s cubic-bezier(0.04, 1.01, 0.13, 1.02);\n        animation: scaleDownCal 1s cubic-bezier(0.04, 1.01, 0.13, 1.02);\n    }\n    .sm-calender-pane.show {\n        -webkit-animation: scaleUpCal 1s cubic-bezier(0.04, 1.01, 0.13, 1.02);\n        -moz-animation: scaleUpCal 1s cubic-bezier(0.04, 1.01, 0.13, 1.02);\n        -o-animation: scaleUpCal 1s cubic-bezier(0.04, 1.01, 0.13, 1.02);\n        animation: scaleUpCal 1s cubic-bezier(0.04, 1.01, 0.13, 1.02);\n    }\n    .action {\n        height: 30px;\n        margin-bottom: 0;\n        position: absolute;\n        bottom: 0;\n        width: 100%;\n    }\n}\n\n\n/* \n\tInput container and button postion css\n */\n\n.sm-input-container .sm-picker-icon {\n    position: absolute;\n    top: 0%;\n    left: 93%;\n}\n\n.picker-container {\n    border-radius: 2px;\n}\n\n.picker-container .container {\n    border-radius: 2px;\n    overflow: hidden;\n}\n\n.picker-container .container md-toolbar {\n    word-wrap: break-word;\n}\n\n.picker-container .container md-toolbar.md-height {\n    padding: 20px 0 10px 0;\n}\n\n.picker-container .container md-toolbar.md-height.landscape {\n    width: 130px;\n}\n\n.picker-container .container md-toolbar.md-height.landscape .year-header {\n    margin: 10px;\n    font-size: 16px;\n}\n\n.picker-container .container md-toolbar.md-height.landscape .date-time-header {\n    font-size: 28px;\n    font-weight: bold;\n    text-align: left;\n    margin: 0px 0 15px 10px;\n}\n\n.picker-container .container md-toolbar.md-height {\n    padding: 5px 10px;\n}\n\n.picker-container .container md-toolbar.md-height.portrait {\n    height: 85px;\n}\n\n.picker-container .container md-toolbar.md-height.portrait .year-header {\n    margin: 10px 0;\n    font-size: 16px;\n}\n\n.picker-container .container md-toolbar.md-height.portrait .date-time-header {\n    font-size: 32px;\n    font-weight: bold;\n    text-align: left;\n}\n\n.date-picker {\n    width: 300px;\n    height: 270px;\n}\n\n.date-picker .cal-link {\n    font-size: 0.7em;\n    text-align: center;\n    margin-bottom: 10px;\n}\n\n.date-picker .year-container {\n    width: 300px;\n    animation: slideInDown 1s cubic-bezier(0.06, 0.61, 0.04, 1.03);\n    margin-top: 20px;\n}\n\n.date-picker .year-container .year-md-repeat {\n    height: 245px;\n}\n\n.date-picker .year-container .year-md-repeat .md-virtual-repeat-container {\n    width: 240px;\n    height: 239px;\n}\n\n.date-picker .year-container .year-md-repeat .repeated-item {\n    box-sizing: border-box;\n    height: 70px;\n    margin: 0 10px;\n}\n\n.date-picker .year-container .year-md-repeat .repeated-item .year {\n    margin: 0 10px;\n    display: flex;\n    height: 70px;\n    width: 30px;\n}\n\n.date-picker .year-container .year-md-repeat .repeated-item .year .year-num {\n    outline: none;\n    width: 30px;\n    height: 30px;\n    text-align: center;\n    line-height: 30px;\n    margin: 3px;\n    cursor: pointer;\n}\n\n.date-picker .year-container .year-md-repeat .repeated-item .year .year-num.disabled {\n    pointer-events: none;\n    color: rgba(0, 0, 0, 0.38);\n}\n\n.date-picker .year-container .year-md-repeat .repeated-item .year .month-list .month-row {\n    display: flex;\n    height: 35px;\n    float: right;\n}\n\n.date-picker .year-container .year-md-repeat .repeated-item .year .month-list .month-row .month {\n    outline: none;\n    width: 30px;\n    height: 30px;\n    border-radius: 50%;\n    text-align: center;\n    line-height: 30px;\n    margin: 3px;\n    font-size: 12px;\n    cursor: pointer;\n}\n\n.date-picker .year-container .year-md-repeat .repeated-item .year .month-list .month-row .month:hover {\n    background-color: #E0E0E0;\n}\n\n.date-picker .year-container .year-md-repeat .repeated-item .selected-year {\n    font-size: 18px;\n    color: blue;\n}\n\n.date-picker .date-container .navigation {\n    height: 40px;\n}\n\n.date-picker .date-container .navigation .md-button {\n    text-transform: capitalize;\n    font-weight: bold;\n}\n\n.date-picker .date-container>.date-cell-header {\n    cursor: default;\n}\n\n.date-picker .date-container>.date-cell-header>.md-button.md-icon-button {\n    opacity: 1;\n    margin: 2px 0 2px 2px;\n}\n\n.date-picker .date-container .date-cell-row .md-button.md-icon-button {\n    height: 30px;\n    width: 30px;\n    min-height: 30px;\n    padding: 0px;\n    font-size: 13px;\n}\n\n.date-picker .date-container .date-cell-row .md-button.md-icon-button[disabled] {\n    cursor: default;\n    background-color: transparent;\n}\n\n.date-picker .date-container .date-cell-row .md-button.md-icon-button:hover:not(.disabled):not(.selected) {\n    background-color: #E0E0E0;\n}\n\n.time-picker {\n    width: 300px;\n}\n\n.time-picker .navigation {\n    height: 25px;\n}\n\n.time-picker .navigation .md-button {\n    text-transform: capitalize;\n    font-weight: bold;\n    margin: 0;\n}\n\n.time-picker .time-md-repeat {\n    width: 70px;\n    height: 239px;\n}\n\n.time-picker .time-md-repeat .repeated-item {\n    width: 34px;\n    margin: 0 auto;\n}\n\n.time-picker .time-md-repeat .repeated-item>.md-button {\n    margin: 2px;\n}\n\n.time-picker .time-md-repeat .repeated-item>.md-button.md-icon-button {\n    height: 30px;\n    width: 30px;\n    min-height: 30px;\n    padding: 0px;\n    font-size: 13px;\n}\n\n.md-virtual-repeat-container .md-virtual-repeat-scroller {\n    right: -21px;\n    padding-right: 20px;\n}\n\n.slideLeft {\n    animation: slideInLeft 500ms cubic-bezier(0.06, 0.61, 0.04, 1.03);\n}\n\n.slideRight {\n    animation: slideInRight 500ms cubic-bezier(0.06, 0.61, 0.04, 1.03);\n}\n\n.range-picker {\n    width: 310px;\n    overflow-x: hidden;\n    background-color: #fff;\n}\n\n.range-picker .md-toolbar-tools {\n    font-size: calc(13px + 2);\n}\n\n.range-picker .md-toolbar-tools .date-display {\n    width: 130px;\n    padding: 2px;\n    text-align: center;\n}\n\n.range-picker .md-toolbar-tools .divider-display {\n    width: 20px;\n    font-size: 13px;\n    padding: 2px;\n}\n\n.range-picker .pre-select {\n    height: 307px;\n}\n\n.range-picker .pre-select .md-button {\n    padding: 3px;\n    margin: 0;\n}\n\n.range-picker .custom-select.show-calender>.tab-head {\n    height: 43px;\n    text-align: center;\n    line-height: 35px;\n}\n\n.range-picker .custom-select.show-calender>.tab-head .start-btn {\n    width: 50%;\n    text-decoration: inherit;\n    color: inherit;\n}\n\n.range-picker .custom-select.show-calender>.tab-head .start-btn>span {\n    color: inherit;\n}\n\n.range-picker .custom-select.show-calender>.tab-head span {\n    color: #ccc1c1;\n    width: 50%;\n}\n\n.range-picker .custom-select.show-calender>.tab-head span.active {\n    animation-property: border-bottom;\n    color: inherit;\n    border-bottom: 2px solid #FF5252;\n}\n\n.range-picker .custom-select.show-calender>.tab-head span.active.moveLeft {\n    animation: slideInLeft 1s cubic-bezier(0.06, 0.61, 0.04, 1.03);\n}\n\n.range-picker .custom-select.show-calender>.tab-head span.active.moveRight {\n    animation: slideInRight 1s cubic-bezier(0.06, 0.61, 0.04, 1.03);\n}\n\n@keyframes slideInLeft {\n    from {\n        transform: translate3d(-100%, 0, 0);\n        visibility: visible;\n    }\n    100% {\n        transform: translate3d(0, 0, 0);\n    }\n}\n\n.slideInLeft {\n    animation-name: slideInLeft;\n}\n\n@keyframes slideInRight {\n    from {\n        transform: translate3d(100%, 0, 0);\n        visibility: visible;\n    }\n    100% {\n        transform: translate3d(0, 0, 0);\n    }\n}\n\n.slideInRight {\n    animation-name: slideInRight;\n}\n\n@keyframes slideInUp {\n    from {\n        transform: translate3d(0, 100%, 0);\n        visibility: visible;\n    }\n    100% {\n        transform: translate3d(0, 0, 0);\n    }\n}\n\n.slideInUp {\n    animation-name: slideInUp;\n}\n\n@keyframes slideInDown {\n    from {\n        transform: translate3d(0, -100%, 0);\n        visibility: visible;\n    }\n    100% {\n        transform: translate3d(0, 0, 0);\n    }\n}\n\n.slideInDown {\n    animation-name: slideInDown;\n}\n\n@-webkit-keyframes scaleUpCal {\n    0% {\n        -ms-transform: scale(0.5, 0.5);\n        /* IE 9 */\n        -webkit-transform: scale(0.5, 0.5);\n        /* Safari */\n        transform: scale(0.5, 0.5);\n    }\n    100% {\n        -ms-transform: scale(1, 1);\n        /* IE 9 */\n        -webkit-transform: scale(1, 1);\n        /* Safari */\n        transform: scale(1, 1);\n    }\n}\n\n\n/* Standard syntax */\n\n@keyframes scaleUpCal {\n    0% {\n        -ms-transform: scale(0.5, 0.5);\n        /* IE 9 */\n        -webkit-transform: scale(0.5, 0.5);\n        /* Safari */\n        transform: scale(0.5, 0.5);\n    }\n    100% {\n        -ms-transform: scale(1, 1);\n        /* IE 9 */\n        -webkit-transform: scale(1, 1);\n        /* Safari */\n        transform: scale(1, 1);\n    }\n}\n\n@-webkit-keyframes scaleDownCal {\n    0% {\n        -ms-transform: scale(1, 1);\n        /* IE 9 */\n        -webkit-transform: scale(1, 1);\n        /* Safari */\n        transform: scale(1, 1);\n    }\n    100% {\n        -ms-transform: scale(0.5, 0.5);\n        /* IE 9 */\n        -webkit-transform: scale(0.5, 0.5);\n        /* Safari */\n        transform: scale(0.5, 0.5);\n    }\n}\n\n\n/* Standard syntax */\n\n@keyframes scaleDownCal {\n    0% {\n        -ms-transform: scale(1, 1);\n        /* IE 9 */\n        -webkit-transform: scale(1, 1);\n        /* Safari */\n        transform: scale(1, 1);\n    }\n    100% {\n        -ms-transform: scale(0.5, 0.5);\n        /* IE 9 */\n        -webkit-transform: scale(0.5, 0.5);\n        /* Safari */\n        transform: scale(0.5, 0.5);\n    }\n}\n\n@-webkit-keyframes moveUp {\n    0% {\n        -ms-transform: top;\n        /* IE 9 */\n        -webkit-transform: top;\n        /* Safari */\n        transform: top;\n    }\n    100% {\n        -ms-transform: top;\n        /* IE 9 */\n        -webkit-transform: top;\n        /* Safari */\n        transform: top;\n    }\n}\n\n\n/* Standard syntax */\n\n@keyframes moveUp {\n    0% {\n        -ms-transform: top;\n        /* IE 9 */\n        -webkit-transform: top;\n        /* Safari */\n        transform: top;\n    }\n    100% {\n        -ms-transform: top;\n        /* IE 9 */\n        -webkit-transform: top;\n        /* Safari */\n        transform: top;\n    }\n}", ""]);

	// exports


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = rest;

	var _jquery = __webpack_require__(31);

	var _jquery2 = _interopRequireDefault(_jquery);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function rest(app, $http) {
	    var that = {};
	    var Rx = window.Rx;
	    var moment = window.moment;

	    app.api = {};

	    app.api.activity = {
	        get: function get(query) {
	            return Rx.Observable.fromPromise(activityService.find(query || {})).catch(function (response) {
	                console.log('$abl.api.GET ERROR', response);
	                return Rx.Observable.empty();
	            }).select(function (response) {
	                return response.list;
	            });
	        },
	        find: function find(query) {
	            return Rx.Observable.fromPromise(activitySearchService.find(query || {})).catch(function (response) {
	                console.log('$abl.api.activity.FIND ERROR', response);
	                return Rx.Observable.empty();
	            }).select(function (response) {
	                return response;
	            });
	        }
	    };

	    app.api.timeslots = {
	        getRange: function getRange(d) {
	            return Rx.Observable.fromPromise($http({
	                method: 'GET',
	                url: app.endpoint + '/timeslots?',
	                data: d,
	                headers: {
	                    'X-ABL-Access-Key': app.apiKey,
	                    'X-ABL-Date': Date.parse(new Date().toISOString())
	                }
	            })).catch(function (response) {
	                console.log('$abl.api.timeslots.GETRANGE ERROR', response);
	                return Rx.Observable.empty();
	            }).select(function (response) {
	                console.log('$abl.api.timeslots.GETRANGE SUCCESS', response);
	                return response.data.list;
	            });
	        },
	        get: function get(id) {
	            return Rx.Observable.fromPromise($http({
	                method: 'GET',
	                url: app.endpoint + '/timeslots?id=' + id,
	                headers: {
	                    'X-ABL-Access-Key': app.apiKey,
	                    'X-ABL-Date': Date.parse(new Date().toISOString())
	                }
	            })).catch(function (response) {
	                console.log('$abl.api.timeslots.GET ERROR', response);
	                return Rx.Observable.empty();
	            }).select(function (response) {
	                console.log('$abl.api.timeslots.GET SUCCESS', response);
	                return response;
	            });
	        }

	        //Feathers localstorage cache service
	    };var cache = app.service('cache');
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
	    //Feathers REST endpoints
	    var activityService = app.service('activities');
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

	    var timeslotService = app.service('timeslots');

	    var updateCache = function updateCache(store) {
	        // always wrap in a function so you can pass options and for consistency.
	        return function (hook) {
	            var modified = false;

	            // hook.result.data.forEach(function (e, i) {
	            //     cache.create({
	            //         id: e._id,
	            //         activity: e
	            //     }).catch(res => {
	            //         console.log('exists');
	            //     });
	            // });
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

	                // acs.map(res => res)
	                //     .takeWhile(res => moment(res['updatedAt']).isAfter(moment(activities.data[res._id]['updatedAt']))) //Check if remote version of object has been recently updated
	                //     .subscribe(function (x) {
	                //         activities.data[x._id] = x;
	                //         console.log('updating activity', x);
	                //         activities.updated.push(x._id);
	                //         modified = true;
	                //     });

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

	    var updateCacheFromDatabase = function updateCacheFromDatabase(store) {
	        // always wrap in a function so you can pass options and for consistency.
	        return function (hook) {
	            //         let modified = false;

	            //         // cache.get('activities').then(function (activities) {
	            //         //     activities.updated = [];

	            //         // });
	            //         if (hook.result.map) {
	            //             console.log('fill cache', hook, store, hook.result.map.length);
	            //             if ((hook.result.map.length < cacheQuery.max)) {
	            //                 activitySearchService.find({
	            //                     query: cacheQuery
	            //                 }).then(res => {
	            //                     cacheQuery.page += 1;
	            //                     cacheQuery.total = res.total;

	            //                     console.log(cacheQuery, res);
	            //                     return Promise.resolve(hook); // A good convention is to always return a promise.
	            //                 });
	            //             }
	            //         }
	            // console.log(hook);
	            if (hook.result.id == 'activities') {
	                cacheQuery.pageSize = 100;

	                activitySearchService.find({
	                    query: cacheQuery
	                }).then(function (res) {
	                    cacheQuery.total = res.total;
	                    console.log(cacheQuery, res);
	                });
	            }

	            return Promise.resolve(hook); // A good convention is to always return a promise.
	        };
	    };
	    // Set up our after hook to cache new data
	    cache.after({
	        create: [updateCacheFromDatabase()],
	        all: [], // run hooks for all service methods
	        get: [] // run hook after a find. You can chain multiple hooks.
	    });

	    // cache.on('created', function (message) {
	    //     console.log('$abl.cache.CREATE', message);
	    // });

	    // cache.on('updated', function (res) {
	    //     console.log('$abl.cache.UPDATED', res);
	    // });

	    app.cache = cache;

	    return app;
	}

/***/ }),
/* 31 */
/***/ (function(module, exports) {

	module.exports = jQuery;

/***/ }),
/* 32 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = toUpper;
	function toUpper() {
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
/* 33 */
/***/ (function(module, exports) {

	module.exports = "<div class=\"picker-container\" flex>\n    <md-content layout-xs=\"column\" layout=\"row\" class=\"container\">\n        <md-toolbar class=\"md-height {{vm.colorIntention}} bigDateToolbar\" ng-class=\"{'portrait': !vm.$mdMedia('gt-xs'),'landscape': vm.$mdMedia('gt-xs')} \">\n            <span class=\"year-header\" layout=\"row\" layout-xs=\"row\">{{vm.currentDate.format('YYYY')}}</span>\n            <span class=\"date-time-header\" layout=\"row\" layout-xs=\"row\">{{vm.currentDate.format(vm.headerDispalyFormat)}}</span>\n        </md-toolbar>\n        <div layout=\"column\" class=\"picker-container\">\n            <div ng-show=\"vm.view==='DATE'\">\n                <sm-calender data-initial-date=\"vm.initialDate\" data-id=\"{{vm.fname}}Picker\" data-mode=\"{{vm.mode}}\" data-min-date=\"vm.minDate\"\n                    data-max-date=\"vm.maxDate\" data-close-on-select=\"{{vm.closeOnSelect}}\" data-format=\"{{vm.format}}\" data-disable-year-selection=\"{{vm.disableYearSelection}}\"\n                    data-week-start-day=\"{{vm.weekStartDay}}\" data-date-select-call=\"vm.dateSelected(date)\"> </sm-calender>\n            </div>\n            <div ng-show=\"vm.view==='TIME'\">\n                <sm-time data-ng-model=\"vm.selectedTime\" data-format=\"HH:mm\" data-time-select-call=\"vm.timeSelected(time)\"> </sm-time>\n            </div>\n            <div layout=\"row\" ng-hide=\"vm.closeOnSelect\"> <span flex></span>\n                <md-button class=\"md-button buttonSelect {{vm.colorIntention}}\" ng-click=\"vm.closeDateTime()\">{{vm.cancelLabel}}</md-button>\n                <md-button class=\"md-button buttonCancel {{vm.colorIntention}}\" ng-click=\"vm.selectedDateTime()\">{{vm.okLabel}}</md-button>\n            </div>\n        </div>\n    </md-content>\n</div>";

/***/ }),
/* 34 */
/***/ (function(module, exports) {

	module.exports = "<md-dialog class=\"picker-container  md-whiteframe-15dp\" aria-label=\"picker\">\n    <md-content layout-xs=\"column\" layout=\"row\" class=\"container\">\n        <md-toolbar class=\"md-height\" ng-class=\"{'portrait': !vm.$mdMedia('gt-xs'),'landscape': vm.$mdMedia('gt-xs')}\">\n            <span class=\"year-header\" layout=\"row\" layout-xs=\"row\">{{vm.viewDate.format('YYYY')}}</span>\n            <span class=\"date-time-header\" layout=\"row\" layout-xs=\"row\">Fuck{{vm.viewDate.format(vm.headerDispalyFormat)}}</span>\n        </md-toolbar>\n        <div layout=\"column\" class=\"picker-container\">\n            <div ng-show=\"vm.view==='DATE'\">\n                <sm-calender ng-model=\"vm.selectedDate\" initial-date=\"vm.initialDate\" id=\"{{vm.fname}}Picker\" data-mode=\"{{vm.mode}}\" data-min-date=\"vm.minDate\"\n                    data-max-date=\"vm.maxDate\" close-on-select=\"{{vm.closeOnSelect}}\" data-format=\"{{vm.format}}\" data-week-start-day=\"{{vm.weekStartDay}}\"\n                    date-select-call=\"vm.dateSelected(date)\"> </sm-calender>\n            </div>\n            <div ng-show=\"vm.view==='HOUR'\">\n                <sm-time ng-model=\"vm.selectedTime\" data-format=\"HH:mm\" time-select-call=\"vm.timeSelected(time)\"> </sm-time>\n            </div>\n            <div layout=\"row\" ng-hide=\"vm.closeOnSelect && (vm.mode!=='date-time' || vm.mode!=='time')\">\n\n\n\n                <div ng-show=\"vm.mode==='date-time'\">\n                    <md-button class=\"md-icon-button\" ng-show=\"vm.view==='DATE'\" ng-click=\"vm.view='HOUR'\">\n                        <md-icon md-font-icon=\"material-icons md-primary\">access_time</md-icon>\n                    </md-button>\n                    <md-button class=\"md-icon-button\" ng-show=\"vm.view==='HOUR'\" ng-click=\"vm.view='DATE'\">\n                        <md-icon md-font-icon=\"material-icons md-primary\">date_range</md-icon>\n                    </md-button>\n                </div>\n\n\n                <span flex></span>\n                <md-button class=\"md-button md-primary\" ng-click=\"vm.closeDateTime()\">{{vm.cancelLabel}}</md-button>\n                <md-button class=\"md-button md-primary\" ng-click=\"vm.selectedDateTime()\">{{vm.okLabel}}</md-button>\n            </div>\n        </div>\n    </md-content>\n</md-dialog>";

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _activityTotal = __webpack_require__(36);

	var _activityTotal2 = _interopRequireDefault(_activityTotal);

	var _activityForms = __webpack_require__(37);

	var _activityForms2 = _interopRequireDefault(_activityForms);

	var _activityBook = __webpack_require__(38);

	var _activityBook2 = _interopRequireDefault(_activityBook);

	var _activityBookValidators = __webpack_require__(39);

	var _activityBookValidators2 = _interopRequireDefault(_activityBookValidators);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = angular.module('activity-book', ['ngMaterial', 'rx']).run(["$templateCache", function ($templateCache) {
	    $templateCache.put('activity-forms.html', _activityForms2.default);
	    $templateCache.put('activity-book.html', _activityBook2.default);
	    $templateCache.put('activity-total.html', _activityTotal2.default);
	}]).directive('ablActivityBook', ['$rootScope', '$sce', '$compile', '$mdMedia', '$mdDialog', '$mdToast', '$log', '$window', '$http', 'rx', 'observeOnScope', '$stateParams', '$state', function ($rootScope, $sce, $compile, $mdMedia, $mdDialog, $mdToast, $log, $window, $http, rx, observeOnScope, $stateParams, $state) {
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

	            //Environment is configured differently across apps so get config from the $rootScope for now
	            var config = $rootScope.config;
	            var headers = {};
	            //Activity dash needs no headers
	            if (!config.DASHBOARD) headers = {
	                'x-abl-access-key': $stateParams.merchant || 'tLVVsHUlBAweKP2ZOofhRBCFFP54hX9CfmQ9EsDlyLfN6DYHY5k8VzpuiUxjNO5L', //$stateParams.merchant || config.ABL_ACCESS_KEY,
	                'x-abl-date': Date.parse(new Date().toISOString())
	            };

	            console.log('abl-activity-book $scope', $scope);

	            this.formWasBlocked = false;
	            this.guestDetailsExpanded = true;
	            this.attendeesExpanded = false;
	            this.addonsExpanded = false;
	            this.questionsExpanded = false;
	            this.stripePaymentExpanded = false;
	            this.stripeCardIsValid = false;
	            this.paymentExpanded = false;
	            this.paymentWasSent = false;
	            this.waitingForResponse = false;
	            vm.validStepsForPayment = {
	                'guest': false,
	                'attendees': false,
	                'addons': true,
	                'bookingQuestions': false
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

	            $scope.paymentResponse = '';

	            this.validateStep = function (currentStepName, form) {
	                console.log('validateStep:switch', currentStepName, form);
	                switch (currentStepName) {
	                    case 'guestDetailsStep':
	                        //goes to attendees
	                        vm.toggleGuestDetails();
	                        vm.toggleAttendees();
	                        break;
	                    case 'attendeesStep':
	                        //goes to addons || booking || pay
	                        console.log('validateStep:attendeesStep');
	                        if (vm.validStepsForPayment.addons) {
	                            vm.toggleAttendees(); //close current
	                            vm.toggleAddons(); //open addons if exist
	                        } else {
	                            vm.validateStep('addonsStep', form); //validate next step if no addons exist
	                        }
	                        break;
	                    case 'addonsStep':
	                        //goes to addons || booking || pay
	                        console.log('validateStep:addonsStep');
	                        if (vm.validStepsForPayment.addons) {
	                            vm.toggleAddons();
	                            vm.toggleQuestions();
	                        } else {
	                            vm.validateStep('questionsStep', form); //validate if no addons
	                        }
	                        break;
	                    case 'questionsStep':
	                        //goes to addons || booking || pay
	                        console.log('validateStep:questionsStep');
	                        if (vm.validStepsForPayment.bookingQuestions) {
	                            vm.toggleQuestions();
	                            vm.toggleStripePay();
	                            vm.validateStep('paymentStep', form);
	                        } else {
	                            vm.validateStep('paymentStep', form);
	                        }
	                        break;
	                    case 'paymentStep':
	                        //goes to addons || booking || pay
	                        if (vm.isPaymentValid()) {
	                            //if guests and attendees are valid
	                            vm.guestDetailsExpanded = false;
	                            vm.attendeesExpanded = false;
	                            vm.addonsExpanded = false;
	                            vm.questionsExpanded = false;
	                            vm.stripePaymentExpanded = true;
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
	                $state.go('home', {
	                    merchant: $stateParams.merchant
	                });
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

	                //console.log('adjust addons', vm.addons);
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
	                if (mode == 'up' && vm.countAttendees() > 0) vm.attendees[i].quantity++;
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
	                if (vm.attendees[$index].quantity > vm.countAttendees()) {
	                    vm.attendees[$index].quantity = 0;
	                    vm.attendees[$index].quantity = vm.countAttendees();
	                }
	                if (vm.attendees[$index].quantity < 0) vm.attendees[$index].quantity = 0;

	                $scope.safeApply();
	                //console.log('attendees added', vm.countAttendees(), vm.attendees[$index].quantity);
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
	                            price: addon.addons[0].amount,
	                            amount: addon.addons[0].amount * addon.addons.length,
	                            quantity: addon.addons.length
	                        };
	                        vm.addonTotal += addon.addons[0].amount * addon.addons.length;
	                        vm.addonSubtotals.push(obj);
	                    });

	                    vm.attendeeTotal = response.data.items.filter(function (item) {
	                        return item.type == "aap";
	                    }).reduce(function (result, att) {
	                        return result + att.amount;
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
	                            price: aap.aaps[0].amount,
	                            amount: aap.aaps[0].amount * aap.aaps.length,
	                            quantity: aap.aaps.length
	                        };
	                        vm.attendeeSubtotals.push(obj);
	                    });

	                    vm.taxTotal = response.data.items.filter(function (item) {
	                        return item.type == "tax" || item.type == "fee";
	                    }).reduce(function (result, tax) {
	                        return result + tax.amount;
	                    }, 0);

	                    //console.log('getPricingQuotes', response);
	                    //console.log('taxTotal', vm.taxTotal);
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
	                    //console.log('getPossibleCoupons success', response);
	                }, function errorCallback(response) {
	                    vm.possibleCoupons = [];
	                    vm.taxTotal = 0;
	                    //console.log('getPossibleCoupons error!', response);
	                });
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
	            };

	            vm.removeCoupon = function () {
	                vm.couponQuery = '';
	                delete data['couponId'];
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
	                    vm.questions = $scope.addBookingController.activity.questions;
	                    if (!vm.questions || vm.questions.length === 0) {
	                        delete vm.validStepsForPayment.bookingQuestions;
	                    }

	                    vm.addons = $scope.addBookingController.activity.charges.filter(function (charge) {
	                        return charge.type == 'addon' && charge.status == 'active';
	                    });
	                    if (!vm.addons || vm.addons.length === 0) {
	                        delete vm.validStepsForPayment.addons;
	                    }
	                    vm.addons.forEach(function (e, i) {
	                        if (!angular.isDefined(e.quantity)) e.quantity = 0;
	                    });

	                    vm.taxes = $scope.addBookingController.activity.charges.filter(function (charge) {
	                        return charge.type == 'tax';
	                    });
	                    $scope.safeApply();
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
	                // //console.log('count attendees', $scope.addBookingController.event.maxOcc, attendeesAdded);
	                if ($scope.addBookingController.event) {
	                    if (vm.attendees) {
	                        return ($scope.addBookingController.event.maxOcc || $scope.addBookingController.timeslot.maxOcc) - vm.attendees.map(function (att) {
	                            return att.quantity;
	                        }).reduce(function (a, b) {
	                            return a + b;
	                        }, 0);
	                    } else {
	                        return 0;
	                    }
	                }
	                return 0;
	            };

	            vm.countAttendeesAdded = function () {
	                // //console.log('count attendees', $scope.addBookingController.event.maxOcc, attendeesAdded);
	                if ($scope.addBookingController.event) {
	                    if (vm.attendees) {
	                        return vm.attendees.map(function (att) {
	                            return att.quantity;
	                        }).reduce(function (a, b) {
	                            return a + b;
	                        }, 0);
	                    } else {
	                        return 0;
	                    }
	                }
	                return 0;
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
	                return vm.validStepsForPayment.bookingQuestions;
	            };

	            this.isPaymentValid = function () {
	                var isValid = [];
	                console.log('isPaymentValid', vm.validStepsForPayment);
	                angular.forEach(vm.validStepsForPayment, function (step, key) {
	                    if (!step) {
	                        isValid.push(step);
	                    }
	                });
	                return isValid.length > 0 ? false : true;
	            };

	            this.isNextStepPayment = function (step) {
	                if (step === 'attendees') {
	                    console.log('isNextStepPayment', vm.addons, vm.questions);
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

	            vm.goToPay = function () {
	                vm.guestDetailsExpanded = false;
	                vm.attendeesExpanded = false;
	                vm.addonsExpanded = false;
	                vm.questionsExpanded = false;
	                vm.stripePaymentExpanded = true;

	                vm.paymentWasSent = true;
	                this.formWasBlocked = true;
	                $scope.makeBooking();
	                console.log('stripePaymentExpanded', vm.stripePaymentExpanded);
	            };

	            vm.bookingQuestions = [];
	            vm.getBookingData = function () {
	                var bookingData = angular.copy(data);
	                bookingData['eventInstanceId'] = $scope.addBookingController.event['eventInstanceId'] || $scope.addBookingController.event;
	                bookingData['answers'] = {};
	                bookingData['email'] = vm.formData['mail'];
	                bookingData['phoneNumber'] = vm.formData['phoneNumber'];
	                bookingData['fullName'] = vm.formData['fullName'];
	                bookingData['notes'] = vm.formData['notes'];
	                bookingData['skipConfirmation'] = false;
	                bookingData['operator'] = $scope.addBookingController.activity.operator || $scope.addBookingController.activity.organizations[0];
	                angular.forEach(vm.questions, function (e, i) {
	                    console.log('vm.questions', vm.questions);
	                    console.log('vm.bookingQuestions', vm.bookingQuestions);
	                    bookingData['answers'][e._id ? e._id : e] = vm.bookingQuestions[i];
	                });

	                bookingData['paymentMethod'] = 'credit';
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
	                        //console.log('Booking success', response);
	                        vm.waitingForResponse = false;
	                        validatePayment(response);
	                    }, function errorCallback(response) {
	                        var errorElement = document.getElementById('card-errors');
	                        errorElement.textContent = response.data.errors[0];
	                        vm.paymentWasSent = false;
	                        vm.waitingForResponse = false;
	                    });
	                };

	                function validatePayment(response) {
	                    console.log('validatePayment', response);
	                    if (config.APP_TYPE === 'CALENDAR') {
	                        if (response.data.status === 'paid') {
	                            $scope.paymentResponse = response.data.status; //processing, failed
	                            $scope.bookingSuccessResponse = response.data;
	                            $scope.paymentSuccessful = true;
	                            $scope.safeApply();
	                            console.log('validatePayment:success!', $scope.paymentResponse);
	                        }
	                        angular.element(document).find('#view-container').animate({
	                            scrollTop: 0
	                        }, 0);
	                        $window.parent.postMessage(['scrollToTopCalendar'], '*');
	                        //Each app can handle the reponse on their own
	                        $rootScope.$broadcast('paymentResponse', response);
	                    }
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
	                    console.log(response);
	                    initStripe(response.data.publicKey);
	                }, function errorCallback(response) {
	                    var errorElement = document.getElementById('card-errors');
	                    errorElement.textContent = response.error.message;
	                });
	            }

	            makeStripeBooking();

	            var lpad = function lpad(numberStr, padString, length) {
	                while (numberStr.length < length) {
	                    numberStr = padString + numberStr;
	                }
	                return numberStr;
	            };

	            $scope.showPayzenDialog = function (ev) {
	                $log.debug("SHOW PAYZEN DIALOG");
	                vm.paymentExpanded = true;
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
/* 36 */
/***/ (function(module, exports) {

	module.exports = "<md-card class=\"paymentSummaryCard\" ng-show=\"paymentResponse != 'success'\">\n  <md-list flex>\n\n    <md-list-item class=\"lineItemHeader \" ng-if=\"vm.base \" ng-click=\"null\">\n      <div class=\"md-list-item-text  \" layout=\"row \" flex>\n        <div layout=\"row \" layout-align=\"start center \" flex=\"50 \">\n          <p class=\" \">Base Price </p>\n        </div>\n        <div layout=\"row \" layout-align=\"end center \" flex=\"50 \">\n          <p class=\" \">{{vm.base() / 100}} CFP</p>\n        </div>\n      </div>\n    </md-list-item>\n\n    <!--Coupons-->\n\n    <md-list-item class=\"paymentHeader md-2-line md-primary\" ng-disabled=\"detailsForm.$invalid\">\n      <div layout=\"row\" class=\"md-list-item-text \" flex>\n        <div layout=\"row\" layout-align=\"start center\" flex>\n          <ng-md-icon class=\"headerIcon\" icon=\"local_offer\" class=\"listIcon\" ng-if=\"vm.couponStatus !='valid'\"></ng-md-icon>\n          <ng-md-icon icon=\"clear\" class=\"listIcon remove-coupon\" ng-click=\"vm.removeCoupon();\" ng-if=\"vm.couponStatus =='valid'\"></ng-md-icon>\n\n          <span class=\"paymentSubTitle  couponText\" ng-if=\"vm.couponStatus =='valid'\" flex>{{vm.appliedCoupon.couponId}} - {{vm.appliedCoupon.percentage ? '' : '$'}}{{vm.appliedCoupon.amount}}{{vm.appliedCoupon.percentage ? '%' : ''}} Off</span>\n          <span class=\"paymentSubTitle total\">\n            <input ng-model=\"vm.couponQuery\" type=\"text\" class=\"couponInput\" ng-if=\"vm.couponStatus =='untouched' || vm.couponStatus =='invalid'\" ng-change=\"vm.checkingCoupon = true\" placeholder=\"Enter Coupon\" capitalize/>\n            </span>\n        </div>\n        <div layout=\"row \" layout-align=\"end center \">\n          <span class=\"paymentSubTitle total\" ng-if=\"vm.pricing.couponDeduction[0]\">-${{(-1 * vm.pricing.couponDeduction[0].amount / 100) | number : 2}}</span>\n          <md-progress-circular md-mode=\"indeterminate\" ng-show=\"vm.checkingCoupon && vm.couponQuery.length > 0\" class=\"listItemCircularProgress easeIn\" md-diameter=\"24px\"></md-progress-circular>\n        </div>\n      </div>\n    </md-list-item>\n\n    <md-list-item ng-show=\"vm.couponStatus =='invalid' && vm.couponQuery.length > 0 && !vm.checkingCoupon\" class=\"paymentHeader md-2-line md-primary easeIn\">\n      <div layout=\"row\" class=\"md-list-item-text \" flex>\n        <div layout=\"row\" layout-align=\"start center\" flex>\n          <ng-md-icon class=\"headerIcon\" icon=\"error_outline\" class=\"listIcon\" ng-if=\"vm.couponStatus !='valid'\" style=\"fill: rgba(255,87,87,0.8)\"></ng-md-icon>\n          <span class=\"paymentSubTitle total\">\n            Invalid Coupon\n          </span>\n        </div>\n        <div layout=\"row\" layout-align=\"end center\" flex>\n          <ng-md-icon icon=\"clear\" class=\"listIcon\" ng-click=\"vm.couponQuery = '';\"></ng-md-icon>\n        </div>\n      </div>\n    </md-list-item>\n\n    <div ng-if=\"vm.attendeeTotal > 0\">\n      <div class=\"md-list-item-text subtotalLineItem\" layout=\"row \" flex>\n        <div layout=\"row\" layout-align=\"start center \" flex=\"50 \">\n          <span class=\"total\">Attendees </span>\n        </div>\n        <div layout=\"row \" layout-align=\"end center \" flex=\"50 \">\n          <span class=\"activityTotal\">${{vm.attendeeTotal / 100 | number:2}}</span>\n        </div>\n      </div>\n\n      <div ng-repeat=\"(key, value) in vm.attendeeSubtotals\" layout=\"row\" flex class=\"subtotalLineItem subtotalLineItemSmall\">\n        <div layout=\"row\" layout-align=\"start center\" flex=\"50\">\n          {{value.quantity}} x {{value.name}} @ ${{value.price/100}} each\n        </div>\n        <div layout=\"row\" layout-align=\"end center\" flex=\"50\">\n          ${{value.amount / 100 | number:2}}\n        </div>\n      </div>\n    </div>\n    <div ng-if=\"vm.addonTotal > 0\">\n      <div class=\"md-list-item-text subtotalLineItem\" layout=\"row \" flex>\n        <div layout=\"row\" layout-align=\"start center \" flex=\"50 \">\n          <span class=\"total\">Add-ons </span>\n        </div>\n        <div layout=\"row \" layout-align=\"end center \" flex=\"50 \">\n          <span class=\"activityTotal\">${{vm.addonTotal / 100 | number:2}}</span>\n        </div>\n      </div>\n\n      <div ng-repeat=\"addon in vm.addonSubtotals\" layout=\"row\" flex class=\"subtotalLineItem subtotalLineItemSmall\">\n        <div layout=\"row\" layout-align=\"start center\" flex=\"50\">\n          {{addon.quantity}} x {{addon.name}} @ ${{addon.price/100}} each\n        </div>\n        <div layout=\"row\" layout-align=\"end center\" flex=\"50\">\n          ${{addon.amount / 100 | number:2}}\n        </div>\n      </div>\n    </div>\n\n    <div ng-if=\"vm.taxTotal > 0\">\n      <div class=\"md-list-item-text subtotalLineItem\" layout=\"row \" flex>\n        <div layout=\"row\" layout-align=\"start center \" flex=\"50 \">\n          <span class=\"total\">Taxes and Fees </span>\n        </div>\n        <div layout=\"row \" layout-align=\"end center \" flex=\"50 \">\n          <span class=\"activityTotal\">${{vm.taxTotal / 100 | number:2}}</span>\n        </div>\n      </div>\n    </div>\n\n    <div>\n      <div class=\"md-list-item-text subtotalLineItem bottomTotal\" layout=\"row \" layout-align=\"space-between center \" flex>\n        <div layout=\"row \" layout-align=\"start center \" flex=\"50 \">\n          <span class=\"\">Total </span>\n        </div>\n        <div layout=\"row \" layout-align=\"end center \" flex=\"50 \">\n          <span class=\"\">${{(vm.pricing.total || 0) / 100  | number:2}}</span>\n        </div>\n      </div>\n    </div>\n  </md-list>\n</md-card>\n";

/***/ }),
/* 37 */
/***/ (function(module, exports) {

	module.exports = "<div ng-if=\"paymentResponse != 'success'\">\n  <md-card class=\"activityPaymentSummaryCard leftCard\" after-render>\n    <md-list class=\"\" flex>\n\n      <!-- Guests -->\n      <md-list-item class=\"paymentHeader md-2-line\" ng-click=\"vm.toggleGuestDetails()\" ng-init=\"guestDetailsHover=0\">\n        <div layout=\"row\" class=\"md-list-item-text\" flex>\n          <div layout=\"row\" layout-align=\"start center\" flex=\"80\">\n            <div layout=\"column\" class=\"formHeader\">\n              <div layout=\"row\" layout-align=\"start center\" flex=\"50\">\n                <ng-md-icon class=\"headerIcon\" icon=\"filter_1\" class=\"listIcon\"></ng-md-icon>\n                <span class=\"paymentSubTitle\">Guest Details</span>\n              </div>\n            </div>\n          </div>\n\n          <div layout=\"row\" layout-align=\"end center\" flex=\"20\">\n            <div layout=\"column\" layout-align=\"center end\" flex>\n              <ng-md-icon icon=\"{{vm.guestDetailsExpanded ? 'expand_less' : 'expand_more'}}\" class=\"listIcon\"></ng-md-icon>\n              <ng-md-icon ng-show=\"!guestDetailsHover && detailsForm.$valid\" icon=\"check\" class=\"listIcon\"></ng-md-icon>\n            </div>\n          </div>\n        </div>\n      </md-list-item>\n\n      <div ng-show=\"vm.guestDetailsExpanded\">\n        <form name=\"guestDetailsForm\" novalidate>\n          <div class=\"detailsForm slideDown\" layout-padding>\n            <md-input-container class=\"md-block\">\n              <label>Full Name</label>\n              <input name=\"fullName\" ng-model=\"vm.formData.fullName\" required type=\"text\" md-maxlength=\"100\" ng-minlength=\"3\" />\n              <div ng-messages=\"guestDetailsForm.fullName.$error\">\n                <div ng-message=\"required\">This is required.</div>\n                <div ng-message=\"minlength\">The name must be at least 3 characters long.</div>\n                <div ng-message=\"md-maxlength\">The name must be less than 100 characters long.</div>\n              </div>\n            </md-input-container>\n\n            <md-input-container class=\"md-block\">\n              <label>E-mail</label>\n              <input name=\"mail\" ng-model=\"vm.formData.mail\" required type=\"email\" md-maxlength=\"100\" ng-minlength=\"3\" />\n              <div ng-messages=\"guestDetailsForm.mail.$error\">\n                <div ng-message=\"required\">This is required.</div>\n                <div ng-message=\"email\">Please enter a valid e-mail address.</div>\n                <div ng-message=\"minlength\">The e-mail must be at least 3 characters long.</div>\n                <div ng-message=\"md-maxlength\">The e-mail must be less than 100 characters long.</div>\n              </div>\n            </md-input-container>\n            <md-input-container class=\"md-block\">\n              <label>Phone</label>\n              <input name=\"phone\" ng-model=\"vm.formData.phoneNumber\" required type=\"text\" />\n              <div ng-messages=\"guestDetailsForm.phone.$error\">\n                <div ng-message=\"required\">This is required.</div>\n              </div>\n            </md-input-container>\n\n            <md-input-container class=\"md-block\">\n              <label>Notes</label>\n              <textarea ng-model=\"vm.formData.notes\" md-maxlength=\"300\" rows=\"1\"></textarea>\n            </md-input-container>\n\n            <div layout=\"row\" layout-align=\"end center\">\n              <md-button class=\"md-raised md-primary md-hue-2\" ng-disabled=\"!vm.areGuestDetailsValid(guestDetailsForm)\" ng-click=\"vm.validateStep('guestDetailsStep')\">Next</md-button>\n            </div>\n          </div>\n        </form>\n      </div>\n      <md-divider class=\"no-margin\"></md-divider>\n    </md-list>\n\n    <!-- Attendees -->\n    <md-list flex>\n      <md-list-item class=\"paymentHeader md-2-line\" ng-click=\"vm.toggleAttendees()\" ng-disabled=\"!vm.guestDetailsAreValid\">\n        <div layout=\"row\" class=\"md-list-item-text\" flex>\n          <div layout=\"row\" layout-align=\"start center\" class=\"formHeader\" flex>\n            <ng-md-icon class=\"headerIcon\" icon=\"filter_2\" class=\"listIcon\"></ng-md-icon>\n            <span class=\"paymentSubTitle\" ng-if=\"vm.countAttendees() > 0\" flex>Attendees <span ng-show=\"vm.countAttendees() < 4\"> <i class=\"fa fa-angle-right\" aria-hidden=\"true\"></i> {{vm.countAttendees()}} spots remaining</span></span>\n            <span class=\"paymentSubTitle\" ng-if=\"vm.countAttendees() < 1\" flex>Attendees <i class=\"fa fa-angle-right\" aria-hidden=\"true\"></i> No spots remaining</span>\n          </div>\n\n          <div layout=\"row\" layout-align=\"end center\">\n            <div layout=\"column\" layout-align=\"center end\">\n              <ng-md-icon icon=\"{{vm.attendeesExpanded ? 'expand_less' : 'expand_more'}}\" class=\"listIcon\"></ng-md-icon>\n            </div>\n          </div>\n        </div>\n      </md-list-item>\n\n      <div class=\"activityForm slideDown\" ng-show=\"vm.attendeesExpanded\" ng-class=\"vm.areAttendeesValid()\">\n        <div ng-repeat=\"attendee in vm.attendees\">\n          <md-list-item class=\"md-2-line addOnListItem\">\n            <div layout=\"row\" class=\"md-list-item-text\" flex>\n              <div layout=\"row\" layout-align=\"start center\" flex=\"80\">\n                <div layout=\"column\" class=\"\">\n                  <span class=\"lineItemSubHeader\">{{attendee.name}}</span>\n\n                  <div layout=\"row\">\n                    <span class=\"lineItemSubDetail\">${{attendee.amount/ 100  | number:2}}</span>\n                  </div>\n\n                </div>\n              </div>\n\n              <div layout=\"row\" layout-align=\"end center\" flex=\"20\">\n                <div layout=\"column\" class=\"addOnAdjusters\" layout-align=\"center end\" flex layout-grow>\n                  <ng-md-icon icon=\"add_circle_outline\" class=\"listIconSub\" ng-click=\"vm.adjustAttendee($index,'up');\"> </ng-md-icon>\n                  <ng-md-icon icon=\" remove_circle_outline\" class=\"listIconSub\" ng-click=\"vm.adjustAttendee($index,'down');\"></ng-md-icon>\n                </div>\n\n                <div layout=\"column\" layout-align=\"end end\">\n                  <input class='addOnQuantityText' ng-model=\"attendee.quantity\" ng-change=\"vm.checkAdjustAttendee($index);\" md-select-on-focus></input>\n                </div>\n              </div>\n            </div>\n          </md-list-item>\n        </div>\n        <md-list-item>\n          <div layout=\"row\" flex layout-padding>\n            <div layout=\"row\" layout-align=\"start center\" flex=\"80\">\n            </div>\n            <div layout=\"row\" layout-align=\"end center\" flex=\"20\">\n              <div layout=\"column\" layout-align=\"center end\" flex>\n                <md-button ng-if=\"vm.isNextStepPayment('attendees')\" class=\"md-raised md-primary md-hue-2\" ng-disabled=\"!vm.areAttendeesValid()\"\n                  ng-click=\"vm.validateStep('attendeesStep')\">Next</md-button>\n              </div>\n            </div>\n          </div>\n        </md-list-item>\n      </div>\n\n      <md-divider class=\"no-margin\"></md-divider>\n\n      <!-- Add ons -->\n      <div ng-if=\"vm.addons.length > 0\">\n        <md-list-item class=\"paymentHeader md-2-line\" ng-disabled=\"vm.countAttendeesAdded() < 1 || guestDetailsForm.$invalid\" ng-click=\"vm.toggleAddons()\">\n          <div layout=\"row\" class=\"md-list-item-text\" flex>\n            <div layout=\"row\" layout-align=\"start center\" flex=\"80\">\n              <div layout=\"column\" class=\"formHeader\">\n                <div layout=\"row\" layout-align=\"start center\" flex=\"50\">\n                  <ng-md-icon class=\"headerIcon\" icon=\"filter_3\" class=\"listIcon\"></ng-md-icon>\n                  <span class=\"paymentSubTitle\">Add-ons</span>\n                </div>\n              </div>\n            </div>\n\n            <div layout=\"row\" layout-align=\"end center\" flex=\"20\">\n              <div layout=\"column\" layout-align=\"center end\" flex>\n                <ng-md-icon ng-show=\"vm.addOnsSelected == 1\" icon=\"check\" class=\"listIcon\"></ng-md-icon>\n                <ng-md-icon icon=\"{{vm.addonsExpanded ? 'expand_less' : 'expand_more'}}\" class=\"listIcon\"></ng-md-icon>\n              </div>\n            </div>\n          </div>\n        </md-list-item>\n        <div class=\"activityForm slideDown\" ng-show=\"vm.addonsExpanded\" ng-class=\"vm.areAddonsValid()\">\n          <div ng-repeat=\"addon in vm.addons\">\n            <md-list-item class=\"md-2-line addOnListItem\">\n              <div layout=\"row\" class=\"md-list-item-text\" flex>\n                <div layout=\"row\" layout-align=\"start center\" flex=\"80\">\n                  <div layout=\"column\" class=\"\">\n                    <span class=\"lineItemSubHeader\">{{addon.name}}</span>\n                    <div layout=\"row\" class=\"\">\n                      <span class=\"lineItemSubDetail\">${{addon.amount/ 100  | number:2}}</span>\n                    </div>\n                  </div>\n                </div>\n\n                <div layout=\"row\" layout-align=\"end center\" flex=\"20\">\n                  <div layout=\"column\" class=\"addOnAdjusters\" layout-align=\"center end\" flex layout-grow>\n                    <ng-md-icon icon=\"add_circle_outline\" class=\"listIconSub\" ng-click=\"vm.adjustAddon($index,'up');\"> </ng-md-icon>\n                    <ng-md-icon icon=\" remove_circle_outline\" class=\"listIconSub\" ng-click=\"vm.adjustAddon($index,'down');\"></ng-md-icon>\n                  </div>\n\n                  <div layout=\"column\" layout-align=\"end end\">\n                    <input class='addOnQuantityText' ng-model=\"addon.quantity\" ng-change=\"vm.getPricingQuote();\" md-select-on-focus></input>\n                  </div>\n                </div>\n              </div>\n            </md-list-item>\n          </div>\n          <md-list-item>\n            <div layout=\"row\" flex layout-padding>\n              <div layout=\"row\" layout-align=\"start center\" flex=\"80\">\n              </div>\n              <div layout=\"row\" layout-align=\"end center\" flex=\"20\">\n                <div layout=\"column\" layout-align=\"center end\" flex>\n                  <md-button ng-if=\"vm.isNextStepPayment('addons')\" class=\"md-raised md-primary md-hue-2\" ng-click=\"vm.validateStep('addonsStep')\">Next</md-button>\n                </div>\n              </div>\n            </div>\n          </md-list-item>\n        </div>\n        <md-divider class=\"no-margin\"></md-divider>\n      </div>\n\n      <!--Questions-->\n      <div ng-if=\"vm.questions.length > 0\">\n        <md-list-item class=\"paymentHeader md-2-line\" ng-disabled=\"guestDetailsForm.$invalid || vm.countAttendeesAdded() < 1\" ng-click=\"vm.toggleQuestions()\">\n          <div layout=\"row\" class=\"md-list-item-text\" flex>\n            <div layout=\"row\" layout-align=\"start center\" flex>\n              <div layout=\"column\" class=\"formHeader\">\n                <div layout=\"row\" layout-align=\"start center\" flex>\n                  <ng-md-icon class=\"headerIcon\" icon=\"filter_4\" class=\"listIcon\" ng-if=\"vm.addons.length > 0\"></ng-md-icon>\n                  <ng-md-icon class=\"headerIcon\" icon=\"filter_3\" class=\"listIcon\" ng-if=\"vm.addons.length == 0\"></ng-md-icon>\n                  <span class=\"paymentSubTitle\">Booking Questions <i class=\"fa fa-angle-right\" aria-hidden=\"true\"></i> {{vm.bookingQuestionsCompleted()}}/{{vm.questions.length}}</span>\n                </div>\n              </div>\n            </div>\n\n            <div layout=\"row\" layout-align=\"end center\">\n              <div layout=\"column\" layout-align=\"center end\" flex>\n                <ng-md-icon icon=\"{{vm.questionsExpanded ? 'expand_less' : 'expand_more'}}\" class=\"listIcon\"></ng-md-icon>\n              </div>\n            </div>\n          </div>\n        </md-list-item>\n        <div ng-show=\"vm.questionsExpanded\" ng-class=\"!vm.areBookingQuestionsValid()\">\n          <div class=\"questionForm slideDown\">\n            <div ng-repeat=\"question in vm.questions\">\n              <md-list-item class=\"md-2-line addOnListItem\">\n                <div layout=\"row\" class=\"md-list-item-text\" flex>\n                  <div layout=\"column\" layout-align=\"center stretch\" flex>\n                    <label class=\"small-label\">{{question.questionText}}</label>\n                    <div layout=\"row\" layout-align=\"start center\">\n                      <ng-md-icon icon=\"{{vm.bookingQuestions[$index].length > 0 ? 'done' : 'priority_high'}}\" class=\"inputStatusIcon\"></ng-md-icon>\n                      <md-input-container flex>\n                        <textarea name=\"question\" ng-model=\"vm.bookingQuestions[$index]\" md-maxlength=\"300\" rows=\"1\"></textarea>\n                      </md-input-container>\n                    </div>\n                  </div>\n                </div>\n              </md-list-item>\n            </div>\n          </div>\n          <md-list-item class=\"activityForm\">\n            <div layout=\"row\" flex layout-padding>\n              <div layout=\"row\" layout-align=\"start center\" flex=\"80\">\n              </div>\n              <div layout=\"row\" layout-align=\"end center\" flex=\"20\">\n                <div layout=\"column\" layout-align=\"center end\" flex>\n                  <md-button ng-disabled=\"!vm.areBookingQuestionsValid()\" ng-if=\"vm.isNextStepPayment('payment')\" class=\"md-raised md-primary md-hue-2\"\n                    ng-click=\"vm.validateStep('questionsStep')\">Next</md-button>\n                </div>\n              </div>\n            </div>\n          </md-list-item>\n        </div>\n        <md-divider class=\"no-margin\" ng-if=\"!vm.addonsExpanded\"></md-divider>\n      </div>\n\n      <!-- Payment Stripe -->\n      <div>\n        <md-list-item class=\"paymentHeader md-2-line\" ng-disabled=\"!vm.isPaymentValid()\">\n          <div layout=\"row\" class=\"md-list-item-text\" flex>\n            <div layout=\"row\" layout-align=\"start center\" flex=\"80\">\n              <div layout=\"column\" class=\"formHeader\">\n                <div layout=\"row\" layout-align=\"start center\" flex=\"50\">\n                  <ng-md-icon class=\"headerIcon\" icon=\"filter_5\" class=\"listIcon\" ng-if=\"vm.addons.length > 0 && vm.questions.length > 0\"></ng-md-icon>\n                  <ng-md-icon class=\"headerIcon\" icon=\"filter_4\" class=\"listIcon\" ng-if=\"vm.addons.length > 0 && vm.questions.length == 0 || vm.addons.length == 0 && vm.questions.length > 0\"></ng-md-icon>\n                  <ng-md-icon class=\"headerIcon\" icon=\"filter_3\" class=\"listIcon\" ng-if=\"vm.addons.length == 0 && vm.questions.length == 0\"></ng-md-icon>\n                  <span class=\"paymentSubTitle\">Credit Card Details</span>\n                </div>\n              </div>\n            </div>\n\n            <div layout=\"row\" layout-align=\"end center\" flex=\"20\">\n              <div layout=\"column\" layout-align=\"center end\" flex>\n                <!--<ng-md-icon icon=\"{{vm.guestDetailsExpanded ? 'expand_less' : 'expand_more'}}\" class=\"listIcon\"></ng-md-icon>\n                <ng-md-icon ng-show=\"!guestDetailsHover && detailsForm.$valid\" icon=\"check\" class=\"listIcon\"></ng-md-icon>-->\n              </div>\n            </div>\n          </div>\n        </md-list-item>\n\n        <div ng-show=\"vm.stripePaymentExpanded\">\n          <form method=\"post\" id=\"payment-form\" name=\"creditCardDetailsForm\">\n            <div class=\"form-row\" style=\"padding:0 30px 20px 20px\">\n              <div id=\"card-errors\"></div>\n              <div id=\"card-element\">\n\n              </div>\n            </div>\n            <div ng-if=\"vm.waitingForResponse\" layout=\"row\" layout-align=\"space-around center\" style=\"padding:20px\">\n              <md-progress-circular md-mode=\"indeterminate\"></md-progress-circular>\n            </div>\n\n            <md-list-item class=\"activityCardForm\" ng-hide=\"vm.paymentSuccessful\">\n              <div layout=\"row\" flex layout-padding>\n                <div layout=\"row\" layout-align=\"start center\" flex=\"50\"></div>\n                <div layout=\"row\" layout-align=\"end center\" flex=\"50\">\n                  <div layout=\"column\" layout-align=\"center end\" flex>\n                    <md-button type=\"submit\" class=\"md-raised md-primary md-hue-2\" ng-class=\"{'valid': vm.isPaymentValid() && vm.stripeCardIsValid && !vm.waitingForResponse}\" ng-disabled=\"!vm.isPaymentValid() || vm.waitingForResponse\" class=\"submitButton\"><i class=\"fa fa-credit-card\" aria-hidden=\"true\"></i> Pay</md-button>\n                  </div>\n                </div>\n              </div>\n            </md-list-item>\n\n          </form>\n        </div>\n      </div>\n\n      <!--Payment-->\n      <div class=\"activityForm slideDown\" ng-if=\"false\" ng-show=\"vm.paymentExpanded\">\n        <div ng-if=\"vm.loadingIframe\" layout=\"row\" layout-align=\"space-around center\" style=\"padding:20px\">\n          <md-progress-circular md-mode=\"indeterminate\"></md-progress-circular>\n        </div>\n        <iframe ng-style=\"{'height': vm.loadingIframe ? '0' : '100%'}\" id=\"payzenIframe\" class=\"payzenIframe\"></iframe>\n      </div>\n      <md-divider class=\"no-margin\"></md-divider>\n    </md-list>\n\n\n  </md-card>\n</div>";

/***/ }),
/* 38 */
/***/ (function(module, exports) {

	module.exports = "<div ng-show=\"paymentResponse.length == 0\" layout=\"{{screenIsBig() ? 'row' : 'column'}}\" layout-align=\"{{screenIsBig() ? 'center start' : 'center center'}}\" layout-fill class=\"columnFix\">\n  <div class=\"paymentSummaryCardLarge leftCard\" layout-padding ng-class=\"screenIsBig() ? 'leftCardLarge' : 'leftCardSmall'\">\n    <div ng-include=\"'activity-forms.html'\"></div>\n  </div>\n  <div class=\"paymentSummaryCardLarge rightCard\" layout-padding ng-class=\"screenIsBig() ? 'rightCardLarge' : 'rightCardSmall'\">\n    <div ng-include=\"'activity-total.html'\"></div>\n  </div>\n</div>\n\n<div id=\"paymentSummaryStatus\" ng-if=\"paymentResponse.length > 0\">\n  <md-card class=\"paymentSummaryCard no-margin\">\n    <md-list>\n      <div ng-show=\"paymentResponse == 'paid'\" class=\"easeIn\">\n        <md-list-item class=\"paymentHeader md-2-line md-primary\" ng-mouseleave=\"addOnsHover = 0\" ng-mouseenter=\"addOnsHover = 1\"\n          ng-init=\"addOnsHover=0\">\n          <div layout=\"row\" class=\"md-list-item-text\" flex>\n            <div layout=\"row\" layout-align=\"start center\" flex=\"70\" md-colors=\"{color: 'primary'}\">\n              <ng-md-icon flex=\"none\" class=\"headerIcon\" icon=\"payment\" class=\"listIcon\"></ng-md-icon>\n              <span flex class=\"paymentSubTitle total\">Payment Complete</span>\n            </div>\n            <div layout=\"row\" layout-align=\"end center\" flex=\"30\">\n              <span class=\"paymentSubTitle total\" md-colors=\"{color: 'green'}\"></span>\n              <ng-md-icon icon=\"check\" class=\"listIcon\" md-colors=\"{fill: 'green'}\"></ng-md-icon>\n            </div>\n          </div>\n        </md-list-item>\n        <div layout=\"row\" layout-xs=\"column\">\n          <span flex=\"30\" hide-xs></span>\n          <div flex=\"100\" flex-gt-sm=\"40\" class=\"confirmation\" layout=\"column\">\n            <h3>Congratulations!</h3>\n            <p>Your booking is confirmed.</p>\n            <p>You will receive a confirmation email at: <strong>{{bookingSuccessResponse.client.email}}</strong></p>\n            <p class=\"margin-top\">For questions about your booking, please contact:</p>\n            <p><strong>{{bookingSuccessResponse.operator.companyName}} ({{bookingSuccessResponse.operator.phoneNumber}})</strong></p>\n            <p><strong>{{bookingSuccessResponse.operator.email}}</strong></p>\n            <span class=\"booking-id\">Booking ID: {{bookingSuccessResponse.bookingId}}</span>\n            <div layout=\"row\" layout-align=\"center center\" flex>\n              <md-button class=\"md-raised md-primary\" ng-click=\"vm.returnToMainPage()\">Return</md-button>\n            </div>\n          </div>\n          <span flex=\"30\" hide-xs></span>\n        </div>\n      </div>\n\n      <div ng-show=\"paymentResponse == 'failed'\">\n\n        <md-list-item class=\"paymentHeader md-2-line md-primary\" md-colors=\"{color: 'primary'}\" ng-mouseleave=\"addOnsHover = 0\" ng-mouseenter=\"addOnsHover = 1\"\n          ng-init=\"addOnsHover=0\">\n          <div layout=\"row\" class=\"md-list-item-text\" flex>\n            <div layout=\"row\" layout-align=\"start center\" flex=\"50\" md-colors=\"{color: 'warn'}\">\n              <ng-md-icon class=\"headerIcon\" icon=\"payment\" class=\"listIcon\"></ng-md-icon>\n\n              <span class=\"paymentSubTitle total\">Payment Failed</span>\n            </div>\n            <div layout=\"row\" layout-align=\"end center\" flex=\"50\">\n              <span class=\"paymentSubTitle total\" md-colors=\"{color: 'warn'}\"></span>\n\n              <ng-md-icon icon=\"error\" class=\"listIcon\" md-colors=\"{fill: 'warn'}\"></ng-md-icon>\n\n            </div>\n          </div>\n        </md-list-item>\n\n        <md-list-item>\n          <div layout=\"row\" layout-wrap>\n\n            <p class=\"listMessage\">Your credit card has been declined. Please confirm the information you provided is correct and try again.</p>\n          </div>\n        </md-list-item>\n        <md-list-item>\n          <div layout=\"row\" layout-align=\"end center\" flex>\n            <md-button class=\"md-raised md-primary\" ng-click=\"vm.payNow();\">Try Again</md-button>\n\n          </div>\n        </md-list-item>\n      </div>\n\n\n      <div ng-show=\"paymentResponse == 'processing'\">\n\n        <md-list-item class=\"paymentHeader md-2-line md-primary\" md-colors=\"{color: 'primary'}\" ng-mouseleave=\"addOnsHover = 0\" ng-mouseenter=\"addOnsHover = 1\"\n          ng-init=\"addOnsHover=0\">\n\n          <div layout=\"row\" class=\"md-list-item-text\" flex>\n            <div layout=\"row\" layout-align=\"start center\" flex layout-grow md-colors=\"{color: 'primary'}\">\n              <ng-md-icon class=\"headerIcon\" icon=\"payment\" class=\"listIcon\"></ng-md-icon>\n\n              <span class=\"paymentSubTitle total\">Payment Processing</span>\n            </div>\n            <div layout=\"row\" layout-align=\"end center\">\n              <span class=\"paymentSubTitle total\" md-colors=\"{color: 'green'}\"></span>\n\n              <ng-md-icon icon=\"watch_later\" class=\"listIcon\" md-colors=\"{fill: 'amber'}\"></ng-md-icon>\n\n            </div>\n          </div>\n        </md-list-item>\n        <md-list-item>\n          <div layout=\"row\" layout-wrap>\n\n            <p class=\"listMessage\">Your booking payment is still processing. An e-mail will be sent to {{vm.formData.mail }} with details about\n              your reservation.</p>\n          </div>\n\n        </md-list-item>\n        <md-list-item>\n          <div layout=\"row\" layout-align=\"end center\" flex>\n            <md-button class=\"md-raised md-primary\" ng-click=\"goToState('home');\">Return</md-button>\n\n          </div>\n        </md-list-item>\n      </div>\n    </md-list>\n\n  </md-card>\n\n\n\n\n</div>";

/***/ }),
/* 39 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = activityBookValidator;
	function activityBookValidator(vm, rx, $http, $stateParams) {

	    vm.searchClients = function (query) {

	        return rx.Observable.fromPromise($http({
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

/***/ })
/******/ ]);
//# sourceMappingURL=abl-sdk.js.map