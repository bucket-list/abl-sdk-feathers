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
/******/ 	var hotCurrentHash = "b7c6f3cd221a39eba261"; // eslint-disable-line no-unused-vars
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

	var _rest = __webpack_require__(28);

	var _rest2 = _interopRequireDefault(_rest);

	var _textTransforms = __webpack_require__(30);

	var _textTransforms2 = _interopRequireDefault(_textTransforms);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	//Including independent module source code for packaging
	var ablBook = __webpack_require__(31);
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

	  Error.call(this, message);

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
	}

	FeathersError.prototype = new Error();

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

	BadRequest.prototype = new FeathersError();

	// 401 - Not Authenticated
	function NotAuthenticated(message, data) {
	  FeathersError.call(this, message, 'NotAuthenticated', 401, 'not-authenticated', data);
	}

	NotAuthenticated.prototype = new FeathersError();

	// 402 - Payment Error
	function PaymentError(message, data) {
	  FeathersError.call(this, message, 'PaymentError', 402, 'payment-error', data);
	}

	PaymentError.prototype = new FeathersError();

	// 403 - Forbidden
	function Forbidden(message, data) {
	  FeathersError.call(this, message, 'Forbidden', 403, 'forbidden', data);
	}

	Forbidden.prototype = new FeathersError();

	// 404 - Not Found
	function NotFound(message, data) {
	  FeathersError.call(this, message, 'NotFound', 404, 'not-found', data);
	}

	NotFound.prototype = new FeathersError();

	// 405 - Method Not Allowed
	function MethodNotAllowed(message, data) {
	  FeathersError.call(this, message, 'MethodNotAllowed', 405, 'method-not-allowed', data);
	}

	MethodNotAllowed.prototype = new FeathersError();

	// 406 - Not Acceptable
	function NotAcceptable(message, data) {
	  FeathersError.call(this, message, 'NotAcceptable', 406, 'not-acceptable', data);
	}

	NotAcceptable.prototype = new FeathersError();

	// 408 - Timeout
	function Timeout(message, data) {
	  FeathersError.call(this, message, 'Timeout', 408, 'timeout', data);
	}

	Timeout.prototype = new FeathersError();

	// 409 - Conflict
	function Conflict(message, data) {
	  FeathersError.call(this, message, 'Conflict', 409, 'conflict', data);
	}

	Conflict.prototype = new FeathersError();

	// 411 - Length Required
	function LengthRequired(message, data) {
	  FeathersError.call(this, message, 'LengthRequired', 411, 'length-required', data);
	}

	LengthRequired.prototype = new FeathersError();

	// 422 Unprocessable
	function Unprocessable(message, data) {
	  FeathersError.call(this, message, 'Unprocessable', 422, 'unprocessable', data);
	}

	Unprocessable.prototype = new FeathersError();

	// 429 Too Many Requests
	function TooManyRequests(message, data) {
	  FeathersError.call(this, message, 'TooManyRequests', 429, 'too-many-requests', data);
	}

	TooManyRequests.prototype = new FeathersError();

	// 500 - General Error
	function GeneralError(message, data) {
	  FeathersError.call(this, message, 'GeneralError', 500, 'general-error', data);
	}

	GeneralError.prototype = new FeathersError();

	// 501 - Not Implemented
	function NotImplemented(message, data) {
	  FeathersError.call(this, message, 'NotImplemented', 501, 'not-implemented', data);
	}

	NotImplemented.prototype = new FeathersError();

	// 502 - Bad Gateway
	function BadGateway(message, data) {
	  FeathersError.call(this, message, 'BadGateway', 502, 'bad-gateway', data);
	}

	BadGateway.prototype = new FeathersError();

	// 503 - Unavailable
	function Unavailable(message, data) {
	  FeathersError.call(this, message, 'Unavailable', 503, 'unavailable', data);
	}

	Unavailable.prototype = new FeathersError();

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
	exports.push([module.id, "md-list {\n    display: block;\n    padding: 0px 0px 0px 0px;\n}\n\n.list-item-48 {\n    height: 36px;\n    min-height: 36px;\n    font-size: 14px;\n    font-weight: 300;\n}\n\n.activityPaymentSummaryCard {\n    margin-bottom: 8px;\n    margin-top: 8px;\n    background: none;\n    box-shadow: none;\n    position: relative;\n    \n}\n.activityPaymentSummaryCardMobile {\n\n    \n}\n\n.paymentSummaryCard {\n    min-width: 100%;\n    margin-bottom: 8px;\n    margin-right: 16px;\n    margin-top: 8px;\n    background: none;\n    box-shadow: none;\n}\n\n.paymentSummaryCardLarge {\n    /*min-width: 370px;*/\n    width: 100%;\n    margin-bottom: 0;\n    margin-top: 0;\n    padding-right: 16px;\n    padding-left: 16px;\n}\n\n.paymentHeader p {\n    color: rgba(0, 0, 0, .8) !important;\n    font-weight: 500;\n    letter-spacing: 0.012em;\n    margin: 0 0 0 0;\n    line-height: 1.6em;\n}\n\n.paymentTitle {\n    font-size: 20px !important;\n}\n\n.paymentSubTitle {\n    font-size: 14px !important;\n    font-weight: 400;\n}\n\n.lineItemIcon {\n    width: 32px;\n    height: 32px;\n    margin: 4px 4px 4px -6px;\n    background: url('https://s3.amazonaws.com/assets.ablsolution.com/icons/stopwatch-2.svg') no-repeat;\n    background-position: center;\n    background-size: 28px 28px;\n}\n\n.headerIcon {\n    vertical-align: middle;\n    height: 36px;\n    width: 40px;\n    padding-right: 16px;\n}\n\n.headerIconRight {\n    padding-left: 16px;\n}\n\n.headerIcon svg {\n    position: absolute;\n    top: 24px;\n    bottom: 24px;\n    height: 24px;\n    width: 24px;\n}\n\n.lineItemText {\n    font-size: 14px;\n    font-weight: 500;\n    letter-spacing: 0.010em;\n    margin: 0 0 0 0;\n    line-height: 1.6em;\n    overflow: hidden;\n    white-space: nowrap;\n    text-overflow: ellipsis;\n    color: rgba(0, 0, 0, 0.54) !important;\n}\n\n.lineItemDetail {\n    background: rgba(255, 255, 255, .1);\n}\n\n.lineItemDetail p {\n    font-size: 12px;\n    color: rgba(0, 0, 0, .77);\n    font-weight: 400;\n}\n\n.lineItemHeader p {\n    font-size: 16px;\n    font-weight: 400;\n    letter-spacing: 0.010em;\n    margin: 0 0 0 0;\n    line-height: 50px;\n    overflow: hidden;\n    white-space: nowrap;\n    text-overflow: ellipsis;\n    color: rgba(0, 0, 0, 0.82) !important;\n}\n\n.lineItemSubHeader {\n    font-size: 16px;\n    font-weight: 400;\n    margin: 0 0 0 0;\n    line-height: 1.6em;\n    overflow: hidden;\n    white-space: nowrap;\n    text-overflow: ellipsis;\n    color: rgba(0, 0, 0, 0.82) !important;\n}\n\n.lineItemSubDetail {\n    font-size: 12px;\n    font-weight: 500;\n    margin: 0 0 0 0;\n    line-height: 1.6em;\n    overflow: hidden;\n    white-space: nowrap;\n    text-overflow: ellipsis;\n    color: rgba(0, 0, 0, .6);\n}\n\n.lineItemHeader {\n    background: rgba(0, 0, 0, 0);\n    color: rgba(0, 0, 0, .7) !important;\n}\n\n.addOnAdjusters {\n    width: 36px;\n    margin-right: 16px;\n}\n\n.addOnQuantityText {\n    border: none;\n    width: 40px;\n    font-weight: 500;\n    text-align: center;\n    font-size: 16px;\n    outline: none;\n}\n\n.guestIcon {\n    width: 32px;\n    height: 32px;\n    margin: 4px 4px 4px -6px;\n    background: url('https://s3.amazonaws.com/assets.ablsolution.com/icons/user-3.svg') no-repeat;\n    background-position: center;\n    background-size: 28px 28px;\n}\n\n.lineItemIconRight {\n    width: 40px;\n    height: 40px;\n    margin: 4px -6px 4px 4px;\n    background: url('https://s3.amazonaws.com/assets.ablsolution.com/icons/calendar.svg') no-repeat;\n    background-position: center;\n    background-size: 28px 28px;\n}\n\n.locationHeader {\n    font-size: 14px !important;\n    letter-spacing: 0.010em;\n    line-height: 20px;\n    color: rgba(0, 0, 0, 0.66) !important;\n}\n\n.total {\n    font-size: 16px;\n    letter-spacing: 0.01em;\n    color: rgba(0, 0, 0, 0.8);\n}\n\n.activityTotal {\n    font-size: 16px;\n    letter-spacing: 0.01em;\n    color: rgba(0, 0, 0, 0.8);\n}\n\n.spacer {\n    margin: 4px;\n    width: 8px;\n}\n\n.darkerDivider {\n    border-top-color: rgba(0, 0, 0, 0.12);\n}\n\n.totalDivider {\n    display: block;\n    border-top-width: 1px;\n}\n\n.lineItemDetailDivider {\n    border-top-color: rgba(0, 0, 0, 0.0);\n}\n\n.paymentSummaryImage {\n    height: 120px;\n    margin: 24px 12px 0 12px;\n    background-position: center center;\n    background-repeat: no-repeat;\n    border-radius: 2px;\n}\n\n.paymentSummaryImageBig {\n    height: 244px;\n    margin: 24px 12px 0 12px;\n    background-position: center center;\n    background-repeat: no-repeat;\n    border-radius: 2px;\n    /*box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .6);*/\n}\n\n.mobileList {\n    height: 100%;\n}\n\n.mobileBottomBar {\n    position: fixed;\n    bottom: 0;\n    left: 0;\n    right: 0;\n}\n\n.cardForm {\n    margin: 16px 16px 16px 16px;\n}\n\n.addonForm {\n    padding-left: 16px;\n    padding-right: 16px;\n}\n\n.activityCardForm {\n    margin: 0 16px 0 16px;\n}\n\n.activityForm {\n    padding-left: 24px;\n    padding-right: 16px;\n}\n\n.questionForm {\n    padding-left: 16px;\n    padding-right: 40px;\n}\n\n\n\n.formHeader {\n    padding: 16px 12px 16px 0;\n    margin: 0;\n    font-size: 22px;\n    font-weight: 500;\n}\n\n.paymentHeader._md-button-wrap>div.md-button:first-child {\n    font-size: 22px;\n    /*box-shadow: 0 1px rgba(0, 0, 0, .12);*/\n}\n\n.listIcon {\n    height: 24px;\n    width: 24px;\n    margin-left: 8px;\n}\n\n.listIconSub {\n    height: 20px;\n    width: 20px;\n    color: rgba(0, 0, 0, .5);\n    fill: rgba(0, 0, 0, .5);\n    outline: none;\n}\n\n.listIconSub svg {\n    height: 20px;\n    width: 20px;\n}\n\n.listIconSub:hover {\n    height: 20px;\n    width: 20px;\n    color: rgba(0, 0, 0, .86);\n    fill: rgba(0, 0, 0, .86);\n    outline: none;\n}\n\n.formButton {\n    margin-right: 0;\n}\n\n.stepStatusRow ng-md-icon svg {\n    height: 16px;\n    margin-top: 1px;\n    vertical-align: top;\n}\n\nmd-list-item.addOnListItem {\n    margin-right: -24px;\n    padding-left: 0;\n}\n\nmd-list-item.listItemNotButton {\n    padding: 0 8px !important;\n}\n\n.totalListItem {\n    margin-bottom: 12px;\n}\n\n.listMessage {\n    font-size: 16px;\n    line-height: 1.6em;\n    padding: 0 4px;\n}\n.slideDown.ng-hide {\n    height: 0;\n    transition: height 0.35s ease;\n    overflow: hidden;\n    position: relative;\n}\n\n.slideDown {\n    transition: height 0.35s ease;\n    overflow: hidden;\n    position: relative;\n}\n\n.slideDown.ng-hide-remove,\n.slideDown.ng-hide-add {\n    /* remember, the .hg-hide class is added to element\n  when the active class is added causing it to appear\n  as hidden. Therefore set the styling to display=block\n  so that the hide animation is visible */\n    display: block!important;\n}\n\n.slideDown.ng-hide-add {\n    animation-name: hide;\n    -webkit-animation-name: hide;\n    animation-duration: .5s;\n    -webkit-animation-duration: .5s;\n    animation-timing-function: ease-in;\n    -webkit-animation-timing-function: ease-in;\n}\n\n.slideDown.ng-hide-remove {\n    animation-name: show;\n    -webkit-animation-name: show;\n    animation-duration: .5s;\n    -webkit-animation-duration: .5s;\n    animation-timing-function: ease-out;\n    -webkit-animation-timing-function: ease-out;\n}\n\nng-md-icon {\n    margin: 0 !important;\n}\n\n.couponInput {\n    width: 100%;\n    border: none;\n    /* background-color: rgba(0, 0, 0, .08); */\n    /* border-radius: 3px; */\n    padding: 12px;\n    /* width: 100%; */\n    box-shadow: none;\n    margin-left: -12px;\n    line-height: 36px;\n    outline: none;\n}\n\n.remove-coupon{\n    cursor: pointer;\n}\n\n.toUppercase {\n    text-transform: uppercase;\n}\n\n.listItemCircularProgress {\n    /*margin-right: -6px;*/\n}\n\n.easeIn.ng-hide-add,\n.easeIn.ng-hide-remove {\n    -webkit-transition: 0.5s ease-in-out opacity;\n    -moz-transition: 0.5s ease-in-out opacity;\n    -ms-transition: 0.5s ease-in-out opacity;\n    -o-transition: 0.5s ease-in-out opacity;\n    transition: 0.5s ease-in-out opacity;\n    opacity: 1;\n}\n\n.easeIn.ng-hide {\n    -webkit-transition: 0s ease-in-out opacity;\n    -moz-transition: 0s ease-in-out opacity;\n    -ms-transition: 0s ease-in-out opacity;\n    -o-transition: 0s ease-in-out opacity;\n    transition: 0s ease-in-out opacity;\n    opacity: 0;\n}\n\n.couponText {\n    margin-left: 16px;\n}\n\n.md-button[disabled] {\n    pointer-events: none;\n}\n\n.subtotalLineItem {\n    padding: 8px 16px;\n}\n\n.subtotalLineItemSmall {\n    font-size: 12px;\n}\n\n.bottomTotal {\n    font-size: 16px;\n    margin-top: 8px;\n    margin-bottom: 16px;\n    font-weight: 600;\n    \n}\n\n.inputStatusIcon {\n    height: 24px;\n    width: 24px;\n    margin-bottom: 16px !important;\n    margin-right: 12px !important    \n}\n\n.payzenIframe {\n    border: none;\n    outline: none;\n    width: 100%;\n    \n}\n\n.small-label {\n        font-size: 12px;\n    padding-left: 4px;\n}\n", ""]);

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

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = rest;

	var _jquery = __webpack_require__(29);

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
	    cache.get('activities').catch(function (res) {
	        cache.create({
	            id: 'activities',
	            data: {},
	            map: []
	        });

	        console.log('create cache');
	    });
	    //Feathers REST endpoints
	    var activityService = app.service('activities');
	    var activitySearchService = app.service('search');

	    activitySearchService.find({
	        query: {
	            "sort": "-updatedAt"
	        }
	    });

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
	            console.log('updateCache', store, hook);
	            var modified = false;

	            cache.get('activities').then(function (activities) {
	                activities.updated = [];

	                var acs = Rx.Observable.fromArray(hook.result.data);
	                acs.map(function (res) {
	                    return res;
	                }).filter(function (res) {
	                    return activities.data[res._id] == undefined;
	                }).subscribe(function (x) {
	                    activities.data[x._id] = x;
	                    modified = true;
	                    activities.updated.push(x._id);
	                    console.log('creating activity', x);
	                });

	                acs.map(function (res) {
	                    return res;
	                }).takeWhile(function (res) {
	                    return moment(res['updatedAt']).isAfter(moment(activities.data[res._id]['updatedAt']));
	                }) //Check if remote version of object has been recently updated
	                .subscribe(function (x) {
	                    activities.data[x._id] = x;
	                    console.log('updating activity', x);
	                    activities.updated.push(x._id);
	                    modified = true;
	                });

	                if (modified) {
	                    cache.update('activities', activities);
	                }
	            });

	            return Promise.resolve(hook); // A good convention is to always return a promise.
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
/* 29 */
/***/ (function(module, exports) {

	module.exports = jQuery;

/***/ }),
/* 30 */
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
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _activityTotal = __webpack_require__(32);

	var _activityTotal2 = _interopRequireDefault(_activityTotal);

	var _activityForms = __webpack_require__(33);

	var _activityForms2 = _interopRequireDefault(_activityForms);

	var _activityBook = __webpack_require__(34);

	var _activityBook2 = _interopRequireDefault(_activityBook);

	var _activityBookValidators = __webpack_require__(35);

	var _activityBookValidators2 = _interopRequireDefault(_activityBookValidators);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = angular.module('activity-book', ['ngMaterial', 'rx']).run(["$templateCache", function ($templateCache) {
	    $templateCache.put('activity-forms.html', _activityForms2.default);
	    $templateCache.put('activity-book.html', _activityBook2.default);
	    $templateCache.put('activity-total.html', _activityTotal2.default);
	}]).directive('ablActivityBook', ['$rootScope', '$sce', '$compile', '$mdMedia', '$mdDialog', '$mdToast', '$log', '$window', '$http', 'config', 'rx', 'observeOnScope', '$stateParams', '$state', function ($rootScope, $sce, $compile, $mdMedia, $mdDialog, $mdToast, $log, $window, $http, config, rx, observeOnScope, $stateParams, $state) {
	    return {
	        restrict: 'E',
	        scope: {
	            book: '='
	        },
	        template: _activityBook2.default,
	        link: function link($scope, element, attrs) {
	            // Digest on resize to recalculate $mdMedia window size
	            function onResize() {
	                console.log('resize');
	                $scope.$digest();
	            };
	            angular.element($window).on('resize', onResize);
	        },
	        controllerAs: 'vm',
	        controller: ["$scope", "$element", "$attrs", function controller($scope, $element, $attrs) {
	            console.log('ablActivityBookController', $scope, $attrs);
	            var vm = this;

	            var ENV = config;
	            var stripe = window.Stripe;

	            ENV.apiVersion = config.FEATHERS_URL;

	            this.formWasBlocked = false;
	            this.guestDetailsExpanded = true;
	            this.attendeesExpanded = false;
	            this.addonsExpanded = false;
	            this.questionsExpanded = false;
	            this.paymentExpanded = false;
	            this.paymentWasSent = false;
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

	            this.goToNextStep = function (currentStepName, form) {
	                switch (currentStepName) {
	                    case 'guestDetailsStep':
	                        //goes to attendees
	                        vm.toggleGuestDetails();
	                        vm.toggleAttendees();
	                        break;
	                    case 'attendeesStep':
	                        //goes to addons || booking || pay
	                        console.log('goToNextStep:attendeesStep', vm.attendeesAdded);
	                        if (vm.countAttendeesAdded() > 0) {
	                            //validate attendees
	                            console.log('attendeesStep', vm.addons.length, vm.questions);
	                            if (vm.addons.length > 0) {
	                                vm.toggleAttendees(); //close current
	                                vm.toggleAddons();
	                            } else if (vm.questions.length > 0) {
	                                vm.toggleAttendees(); //close current
	                                vm.toggleQuestions();
	                            }
	                        }
	                        break;
	                    case 'addonsStep':
	                        //goes to addons || booking || pay
	                        if (vm.addons.length > 0) {
	                            //validate addons
	                            if (vm.countAttendeesAdded()) {
	                                //if guests and attendees are valid
	                                if (vm.questions.length > 0) {
	                                    //go to questions if questions exist
	                                    vm.toggleAddons();
	                                    vm.toggleQuestions();
	                                } else {
	                                    //got to pay if qustions doesn't exist
	                                    vm.toggleAddons();
	                                    vm.togglePay();
	                                }
	                            }
	                        }
	                        break;
	                }
	            };

	            vm.guestDetailsFormValid = false;

	            this.toggleGuestDetails = function () {
	                console.log('toggle guest details');
	                this.guestDetailsExpanded = this.formWasBlocked ? false : !this.guestDetailsExpanded;
	            };

	            this.togglePayment = function () {
	                console.log('toggle payment');
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
	            console.log('addBookingController', $scope.addBookingController);

	            this.toggleQuestions = function () {
	                console.log('toggle questions');
	                this.questionsExpanded = this.formWasBlocked ? false : !this.questionsExpanded;
	            };

	            this.adjustAddon = function (i, mode) {
	                if (mode == 'up') vm.addons[i].quantity++;
	                if (mode == 'down' && vm.addons[i].quantity > 0) vm.addons[i].quantity--;

	                console.log('adjust addons', vm.addons);
	                vm.getPricingQuote();
	            };
	            console.log('adjustAddon:addons', vm.addons);

	            this.toggleAddons = function () {
	                console.log('toggle addons');
	                if (vm.addons.length < 1) this.questionsExpanded = this.formWasBlocked ? false : !this.questionsExpanded;else this.addonsExpanded = this.formWasBlocked ? false : !this.addonsExpanded;
	            };

	            this.togglePay = function () {
	                this.payButtonEnabled = !this.payButtonEnabled;
	            };

	            this.adjustAttendee = function (i, mode) {
	                if (mode == 'up' && vm.countAttendees() > 0) vm.attendees[i].quantity++;
	                if (mode == 'down' && vm.attendees[i].quantity > 0) vm.attendees[i].quantity--;

	                console.log('adjust attendees', vm.attendees);
	                vm.getPricingQuote();
	                vm.countAttendees();
	            };

	            this.toggleAttendees = function () {
	                console.log('toggle attendees');
	                this.attendeesExpanded = this.formWasBlocked ? false : !this.attendeesExpanded;
	            };

	            this.checkAdjustAttendee = function ($index) {
	                if (vm.attendees[$index].quantity > vm.countAttendees()) {
	                    vm.attendees[$index].quantity = 0;
	                    vm.attendees[$index].quantity = vm.countAttendees();
	                }
	                if (vm.attendees[$index].quantity < 0) vm.attendees[$index].quantity = 0;

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
	                            addonsArray[object] = { addons: [] };
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
	                            attendeesArray[object] = { aaps: [] };
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

	                    console.log('getPricingQuotes', response);
	                    console.log('taxTotal', vm.taxTotal);
	                }, function errorCallback(response) {
	                    vm.pricing = {};
	                    vm.taxTotal = 0;
	                    console.log('getPricingQuotes error!', response, vm.pricing);
	                });
	            };

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
	            };

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
	                console.log('coupon expires after today', moment(coupon.endTime).isAfter(moment()));
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
	                console.log('vm.bookingQuestions', vm.bookingQuestions, completed);
	                return completed;
	            };
	            //Observe and debounce an object on the $scope, can be used on 
	            //a search input for example to wait before auto-sending the value
	            observeOnScope($scope, 'vm.couponQuery').debounce(500).select(function (response) {
	                return response;
	            }).subscribe(function (change) {
	                console.log('search value', change);
	                if (vm.couponQuery.length > 0) vm.checkCoupon();
	            });

	            (0, _activityBookValidators2.default)(vm, rx, $http, $stateParams);

	            $scope.$watch('addBookingController.activity', function (changes) {
	                console.log('activity', changes);
	                if (angular.isDefined($scope.addBookingController.activity)) {
	                    //Get booking questions
	                    vm.questions = $scope.addBookingController.activity.questions;
	                    if (vm.questions.length === 0) {
	                        delete vm.validStepsForPayment.bookingQuestions;
	                    }
	                    console.log('booking questions', vm.questions);

	                    vm.addons = $scope.addBookingController.activity.charges.filter(function (charge) {
	                        return charge.type == 'addon' && charge.status == 'active';
	                    });
	                    if (vm.addons.length === 0) {
	                        delete vm.validStepsForPayment.addons;
	                    }
	                    vm.addons.forEach(function (e, i) {
	                        if (!angular.isDefined(e.quantity)) e.quantity = 0;
	                    });

	                    vm.taxes = $scope.addBookingController.activity.charges.filter(function (charge) {
	                        return charge.type == 'tax';
	                    });
	                    console.log('taxes', vm.taxes);
	                }
	            }, true);

	            vm.countAttendees = function () {
	                // console.log('count attendees', $scope.addBookingController.event.maxOcc, attendeesAdded);
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
	                // console.log('count attendees', $scope.addBookingController.event.maxOcc, attendeesAdded);
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
	                console.log('areAttendeesValid', vm.countAttendeesAdded());
	                vm.validStepsForPayment.attendees = vm.countAttendeesAdded() === 0 ? false : true;
	                return vm.countAttendeesAdded() === 0 ? false : true;
	            };

	            this.areAddonsValid = function () {
	                console.log('areAddonsValid', vm.countAddonsAdded());
	                if (vm.validStepsForPayment.addons != null) {
	                    vm.validStepsForPayment.addons = true;
	                }
	                return vm.countAddonsAdded() === 0 ? false : true;
	            };

	            this.areBookingQuestionsValid = function () {
	                console.log('areBookingQuestionsValid', vm.validStepsForPayment.bookingQuestions, vm.bookingQuestionsCompleted(), _typeof(vm.bookingQuestionsCompleted()), vm.bookingQuestionsCompleted() === 1);
	                if (vm.validStepsForPayment.bookingQuestions != null) {
	                    vm.validStepsForPayment.bookingQuestions = vm.bookingQuestionsCompleted() === vm.questions.length ? true : false;
	                    console.log('vm.validStepsForPayment.bookingQuestions', vm.validStepsForPayment.bookingQuestions);
	                }
	                return vm.bookingQuestionsCompleted() / vm.questions.length === 0 ? false : true;
	            };

	            this.isPaymentValid = function () {
	                var isValid = [];
	                angular.forEach(vm.validStepsForPayment, function (step, key) {
	                    console.log('isPaymentValid:foreach', step, key);
	                    if (!step) {
	                        isValid.push(step);
	                    }
	                });
	                console.log('isPaymentValid', isValid, vm.validStepsForPayment);
	                return isValid.length > 0 ? false : true;
	            };

	            this.isNextStepPayment = function (step) {
	                if (step === 'attendees') {
	                    if (vm.addons || vm.questions) {
	                        return vm.addons.length > 0 || vm.questions.length > 0 ? true : false;
	                    } else {
	                        return false;
	                    }
	                }
	                if (step === 'addons') {
	                    if (vm.questions) {
	                        return vm.questions.length > 0 ? true : false;
	                    } else {
	                        return false;
	                    }
	                }
	            };

	            vm.goToPay = function () {
	                vm.guestDetailsExpanded = false;
	                vm.attendeesExpanded = false;
	                vm.addonsExpanded = false;
	                vm.questionsExpanded = false;

	                vm.paymentWasSent = true;
	                this.formWasBlocked = true;
	                $scope.makeBooking();
	            };

	            $scope.$watch('addBookingController.timeslot', function (changes) {
	                console.log('timeslot', changes);
	                if (angular.isDefined($scope.addBookingController.timeslot)) {

	                    if (angular.isDefined($scope.addBookingController.timeslot.charges)) {
	                        vm.attendees = $scope.addBookingController.timeslot.charges.filter(function (charge) {
	                            return charge.type == 'aap' && charge.status == 'active';
	                        });
	                        vm.attendees.forEach(function (e, i) {
	                            if (!angular.isDefined(e.quantity)) e.quantity = 0;
	                        });
	                        // console.log('attendees', vm.attendees);
	                    }

	                    //Get the timeslot id and start time for the pricing quote endpoint request
	                    data['timeSlotId'] = $scope.addBookingController.timeslot._id;
	                    data['startTime'] = $scope.addBookingController.timeslot.startTime;
	                }
	            }, true);

	            vm.getBookingData = function () {
	                var bookingData = angular.copy(data);
	                bookingData['eventInstanceId'] = $scope.addBookingController.event['eventInstanceId'];
	                bookingData['answers'] = {};
	                bookingData['email'] = vm.formData['mail'];
	                bookingData['phoneNumber'] = vm.formData['phoneNumber'];
	                bookingData['fullName'] = vm.formData['fullName'];
	                bookingData['notes'] = vm.formData['notes'];
	                bookingData['skipConfirmation'] = 'false';
	                bookingData['operator'] = $scope.addBookingController.activity.operator;

	                angular.forEach(vm.questions, function (e, i) {
	                    bookingData['answers'][e._id] = vm.bookingQuestions[i];
	                });

	                bookingData['paymentMethod'] = 'credit';
	                bookingData['currency'] = 'default';

	                console.log('make booking', bookingData);

	                return bookingData;
	            };

	            var _paymentMessageHandler;
	            _paymentMessageHandler = function paymentMessageHandler(event) {
	                if (event.origin == "https://calendar.ablist.win") {
	                    // TODO add to config
	                    console.log("TRUSTED ORIGIN", event.origin);
	                    console.log("DATA", event.data);
	                    if (event.data == "payment_complete") {
	                        console.log("PAYMENT COMPLETE");
	                        $scope.paymentResponse = 'success'; //processing, failed
	                        //   $rootScope.showToast('Payment processed successfully.');

	                        window.removeEventListener("message", _paymentMessageHandler);
	                        $scope.paymentSuccessful = true;
	                        //   $scope.changeState('bookings'); //Go to bookings view if successful
	                        $scope.safeApply();
	                        //$mdDialog.hide();
	                    }
	                } else {
	                    console.log("UNTRUSTED ORIGIN", event.origin);
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

	            $scope.makeBooking = function () {
	                vm.paymentExpanded = true;
	                vm.loadingIframe = true;
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
	                    vm.loadingIframe = false;
	                    $scope.paymentSuccessful = false;
	                    $scope.bookingSuccessResponse = response.data.booking;
	                    var iframeDoc = document.getElementById("payzenIframe").contentWindow.document;
	                    iframeDoc.open();
	                    iframeDoc.write(response.data.iframeHtml);
	                    iframeDoc.close();
	                    $scope.bookingSucceeded = true;
	                }, function errorCallback(response) {
	                    $mdDialog.hide();
	                    vm.paymentWasSent = false;
	                    vm.loadingIframe = false;
	                    vm.paymentExpanded = false;
	                    $scope.bookingSucceeded = false;
	                    $mdToast.show($mdToast.simple().textContent(response.data.errors[0]).position('left bottom').hideDelay(3000));
	                    console.log('makeBooking error!', response);
	                });
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
	                $scope.paymentSuccessful = false;
	            };

	            $scope.prefill = function () {
	                vm.formData = {
	                    fullName: 'fuck',
	                    mail: 'adam@ralko.com',
	                    phoneNumber: 7783023246
	                };
	            };

	            //Merge identical items from an array into nested objects, 
	            //summing their amount properties and keeping track of quantities

	            function mergeIdenticalArrayItemsIntoObject(data, oldObject) {
	                var seen = oldObject;
	                console.log('mergeIdenticalArrayItemsIntoObject:data', data);
	                angular.forEach(data, function (e, i) {
	                    // Have we seen this item before?
	                    console.log('mergeIdenticalArrayItemsIntoObject', seen, e, seen.hasOwnProperty(e.name));
	                    if (seen.hasOwnProperty(e.name) && seen[e.name] === e.name) {
	                        seen[e['name']]['price'] = e['price']; //Sum their prices
	                        seen[e['name']]['quantity'] += 1; //Increment their quantity
	                        seen[e['name']]['amount'] = seen[e['name']]['amount'] * seen[e['name']]['quantity']; //Sum their prices
	                        console.log('merged', seen[e['name']]);
	                    } else {
	                        seen[e['name']] = {};
	                        seen[e['name']]['name'] = e['name'];
	                        seen[e['name']]['price'] = e['price'];
	                        seen[e['name']]['quantity'] = 1;
	                        seen[e['name']]['amount'] = e['amount'];
	                    }
	                });

	                console.log('mergeIdenticalArrayItems', seen);
	                return seen;
	            }
	        }]
	    };
	}]);

	// {"paymentMethod":"cash","answers":{"57336d1a3e6f0f447119989a":"100","57336d2a3e6f0f447119989b":"phone call"},"attendees":{"58eea948565d3d3aa4fae370":[null]},"addons":{"57336b293e6f0f447119987b":[null],"58252f9e98087f1c06cc15eb":[null],"57336b293e6f0f447119987c":[]},"adjustments":[],"couponId":"AIRMILES","skipConfirmation":false,"email":"kevin+test@adventurebucketlist.com","fullName":"Kevin Test","phoneNumber":"6506129331","eventInstanceId":"p836o5rvsg72nm69ia120bbdns_20170623T210000Z","currency":"default"}

/***/ }),
/* 32 */
/***/ (function(module, exports) {

	module.exports = "<md-card class=\"paymentSummaryCard\" ng-show=\"paymentResponse != 'success'\">\n  <md-list flex>\n\n    <md-list-item class=\"lineItemHeader \" ng-if=\"vm.base \" ng-click=\"null\">\n      <div class=\"md-list-item-text  \" layout=\"row \" flex>\n        <div layout=\"row \" layout-align=\"start center \" flex=\"50 \">\n          <p class=\" \">Base Price </p>\n        </div>\n        <div layout=\"row \" layout-align=\"end center \" flex=\"50 \">\n          <p class=\" \">{{vm.base() / 100}} CFP</p>\n        </div>\n      </div>\n    </md-list-item>\n\n    <!--Coupons-->\n\n    <md-list-item class=\"paymentHeader md-2-line md-primary\" ng-disabled=\"detailsForm.$invalid\">\n      <div layout=\"row\" class=\"md-list-item-text \" flex>\n        <div layout=\"row\" layout-align=\"start center\" flex>\n          <ng-md-icon class=\"headerIcon\" icon=\"local_offer\" class=\"listIcon\" ng-if=\"vm.couponStatus !='valid'\"></ng-md-icon>\n          <ng-md-icon icon=\"clear\" class=\"listIcon remove-coupon\" ng-click=\"vm.removeCoupon();\" ng-if=\"vm.couponStatus =='valid'\"></ng-md-icon>\n\n          <span class=\"paymentSubTitle  couponText\" ng-if=\"vm.couponStatus =='valid'\" flex>{{vm.appliedCoupon.couponId}} - {{vm.appliedCoupon.percentage ? '' : '$'}}{{vm.appliedCoupon.amount}}{{vm.appliedCoupon.percentage ? '%' : ''}} Off</span>\n          <span class=\"paymentSubTitle total\">\n            <input ng-model=\"vm.couponQuery\" type=\"text\" class=\"couponInput\" ng-if=\"vm.couponStatus =='untouched' || vm.couponStatus =='invalid'\" ng-change=\"vm.checkingCoupon = true\" placeholder=\"Enter Coupon\" capitalize/>\n            </span>\n        </div>\n        <div layout=\"row \" layout-align=\"end center \">\n          <span class=\"paymentSubTitle total\" ng-if=\"vm.pricing.couponDeduction[0]\">-${{(-1 * vm.pricing.couponDeduction[0].amount / 100) | number : 2}}</span>\n          <md-progress-circular md-mode=\"indeterminate\" ng-show=\"vm.checkingCoupon && vm.couponQuery.length > 0\" class=\"listItemCircularProgress easeIn\" md-diameter=\"24px\"></md-progress-circular>\n        </div>\n      </div>\n    </md-list-item>\n\n    <md-list-item ng-show=\"vm.couponStatus =='invalid' && vm.couponQuery.length > 0 && !vm.checkingCoupon\" class=\"paymentHeader md-2-line md-primary easeIn\">\n      <div layout=\"row\" class=\"md-list-item-text \" flex>\n        <div layout=\"row\" layout-align=\"start center\" flex>\n          <ng-md-icon class=\"headerIcon\" icon=\"error_outline\" class=\"listIcon\" ng-if=\"vm.couponStatus !='valid'\" style=\"fill: rgba(255,87,87,0.8)\"></ng-md-icon>\n          <span class=\"paymentSubTitle total\">\n            Invalid Coupon\n          </span>\n        </div>\n        <div layout=\"row\" layout-align=\"end center\" flex>\n          <ng-md-icon icon=\"clear\" class=\"listIcon\" ng-click=\"vm.couponQuery = '';\"></ng-md-icon>\n        </div>\n      </div>\n    </md-list-item>\n\n    <div ng-if=\"vm.attendeeTotal > 0\">\n      <div class=\"md-list-item-text subtotalLineItem\" layout=\"row \" flex>\n        <div layout=\"row\" layout-align=\"start center \" flex=\"50 \">\n          <span class=\"total\">Attendees </span>\n        </div>\n        <div layout=\"row \" layout-align=\"end center \" flex=\"50 \">\n          <span class=\"activityTotal\">${{vm.attendeeTotal / 100 | number:2}}</span>\n        </div>\n      </div>\n\n      <div ng-repeat=\"(key, value) in vm.attendeeSubtotals\" layout=\"row\" flex class=\"subtotalLineItem subtotalLineItemSmall\">\n        <div layout=\"row\" layout-align=\"start center\" flex=\"50\">\n          {{value.quantity}} x {{value.name}} @ ${{value.price/100}} each\n        </div>\n        <div layout=\"row\" layout-align=\"end center\" flex=\"50\">\n          ${{value.amount / 100 | number:2}}\n        </div>\n      </div>\n    </div>\n    <div ng-if=\"vm.addonTotal > 0\">\n      <div class=\"md-list-item-text subtotalLineItem\" layout=\"row \" flex>\n        <div layout=\"row\" layout-align=\"start center \" flex=\"50 \">\n          <span class=\"total\">Add-ons </span>\n        </div>\n        <div layout=\"row \" layout-align=\"end center \" flex=\"50 \">\n          <span class=\"activityTotal\">${{vm.addonTotal / 100 | number:2}}</span>\n        </div>\n      </div>\n\n      <div ng-repeat=\"addon in vm.addonSubtotals\" layout=\"row\" flex class=\"subtotalLineItem subtotalLineItemSmall\">\n        <div layout=\"row\" layout-align=\"start center\" flex=\"50\">\n          {{addon.quantity}} x {{addon.name}} @ ${{addon.price/100}} each\n        </div>\n        <div layout=\"row\" layout-align=\"end center\" flex=\"50\">\n          ${{addon.amount / 100 | number:2}}\n        </div>\n      </div>\n    </div>\n\n    <div ng-if=\"vm.taxTotal > 0\">\n      <div class=\"md-list-item-text subtotalLineItem\" layout=\"row \" flex>\n        <div layout=\"row\" layout-align=\"start center \" flex=\"50 \">\n          <span class=\"total\">Taxes and Fees </span>\n        </div>\n        <div layout=\"row \" layout-align=\"end center \" flex=\"50 \">\n          <span class=\"activityTotal\">${{vm.taxTotal / 100 | number:2}}</span>\n        </div>\n      </div>\n    </div>\n\n    <div>\n      <div class=\"md-list-item-text subtotalLineItem bottomTotal\" layout=\"row \" layout-align=\"space-between center \" flex>\n        <div layout=\"row \" layout-align=\"start center \" flex=\"50 \">\n          <span class=\"\">Total </span>\n        </div>\n        <div layout=\"row \" layout-align=\"end center \" flex=\"50 \">\n          <span class=\"\">${{(vm.pricing.total || 0) / 100  | number:2}}</span>\n        </div>\n      </div>\n    </div>\n  </md-list>\n</md-card>\n";

/***/ }),
/* 33 */
/***/ (function(module, exports) {

	module.exports = "<div ng-if=\"paymentResponse != 'success'\">\n  <md-card class=\"activityPaymentSummaryCard\" after-render>\n    <md-list class=\"\" flex>\n\n      <!-- Guests -->\n      <md-list-item class=\"paymentHeader md-2-line \" ng-click=\"vm.toggleGuestDetails()\" ng-init=\"guestDetailsHover=0\">\n        <div layout=\"row\" class=\"md-list-item-text \" flex>\n          <div layout=\"row\" layout-align=\"start center\" flex=\"80\">\n            <div layout=\"column\" class=\"formHeader\">\n              <div layout=\"row\" layout-align=\"start center\" flex=\"50\">\n                <ng-md-icon class=\"headerIcon\" icon=\"filter_1\" class=\"listIcon \"></ng-md-icon>\n                <span class=\"paymentSubTitle\">Guest Details</span>\n              </div>\n            </div>\n          </div>\n\n          <div layout=\"row \" layout-align=\"end center \" flex=\"20\">\n            <div layout=\"column \" layout-align=\"center end \" flex>\n              <ng-md-icon icon=\"{{vm.guestDetailsExpanded ? 'expand_less' : 'expand_more'}}\" class=\"listIcon \"></ng-md-icon>\n              <ng-md-icon ng-show=\"!guestDetailsHover && detailsForm.$valid\" icon=\"check\" class=\"listIcon \"></ng-md-icon>\n            </div>\n          </div>\n        </div>\n      </md-list-item>\n\n      <div ng-show=\"vm.guestDetailsExpanded\">\n        <form name=\"guestDetailsForm\" novalidate>\n          <div class=\"detailsForm slideDown\" layout-padding>\n            <md-input-container class=\"md-block\">\n              <label>Full Name</label>\n              <input name=\"fullName\" ng-model=\"vm.formData.fullName\" required type=\"text\" md-maxlength=\"100\" ng-minlength=\"3\" />\n              <div ng-messages=\"guestDetailsForm.fullName.$error\">\n                <div ng-message=\"required\">This is required.</div>\n                <div ng-message=\"minlength\">The name must be at least 3 characters long.</div>\n                <div ng-message=\"md-maxlength\">The name must be less than 100 characters long.</div>\n              </div>\n            </md-input-container>\n\n            <md-input-container class=\"md-block\">\n              <label>E-mail</label>\n              <input name=\"mail\" ng-model=\"vm.formData.mail\" required type=\"email\" md-maxlength=\"100\" ng-minlength=\"3\" />\n              <div ng-messages=\"guestDetailsForm.mail.$error\">\n                <div ng-message=\"required\">This is required.</div>\n                <div ng-message=\"email\">Please enter a valid e-mail address.</div>\n                <div ng-message=\"minlength\">The e-mail must be at least 3 characters long.</div>\n                <div ng-message=\"md-maxlength\">The e-mail must be less than 100 characters long.</div>\n              </div>\n            </md-input-container>\n            <md-input-container class=\"md-block\">\n              <label>Phone</label>\n              <input name=\"phone\" ng-model=\"vm.formData.phoneNumber\" required type=\"text\" />\n              <div ng-messages=\"guestDetailsForm.phone.$error\">\n                <div ng-message=\"required\">This is required.</div>\n              </div>\n            </md-input-container>\n\n            <md-input-container class=\"md-block\">\n              <label>Notes</label>\n              <textarea ng-model=\"vm.formData.notes\" md-maxlength=\"300\" rows=\"1\"></textarea>\n            </md-input-container>\n\n            <div layout=\"row\" layout-align=\"end center\">\n              <md-button class=\"md-raised\" ng-disabled=\"!vm.areGuestDetailsValid(guestDetailsForm)\" ng-click=\"vm.goToNextStep('guestDetailsStep')\">Next</md-button>\n            </div>\n          </div>\n        </form>\n      </div>\n      <md-divider></md-divider>\n    </md-list>\n\n    <!-- Attendees -->\n    <md-list flex>\n      <md-list-item class=\"paymentHeader md-2-line\" ng-click=\"vm.toggleAttendees()\" ng-disabled=\"vm.areAtendeesValid()\">\n        <div layout=\"row\" class=\"md-list-item-text\" flex>\n          <div layout=\"row\" layout-align=\"start center\" class=\"formHeader\" flex>\n            <ng-md-icon class=\"headerIcon\" icon=\"filter_2\" class=\"listIcon \"></ng-md-icon>\n            <span class=\"paymentSubTitle\" ng-if=\"vm.countAttendees() > 0\" flex>Attendees <span ng-show=\"vm.countAttendees() < 4\">  |  {{vm.countAttendees()}} spots remaining</span></span>\n            <span class=\"paymentSubTitle\" ng-if=\"vm.countAttendees() < 1\" flex>Attendees  |  No spots remaining</span>\n          </div>\n\n          <div layout=\"row \" layout-align=\"end center\">\n            <div layout=\"column \" layout-align=\"center end \">\n              <ng-md-icon icon=\"{{vm.attendeesExpanded ? 'expand_less' : 'expand_more'}}\" class=\"listIcon \"></ng-md-icon>\n            </div>\n          </div>\n        </div>\n      </md-list-item>\n\n      <div class=\"activityForm slideDown\" ng-show=\"vm.attendeesExpanded\" ng-class=\"vm.areAttendeesValid()\">\n        <div ng-repeat=\"attendee in vm.attendees\">\n          <md-list-item class=\"md-2-line addOnListItem\">\n            <div layout=\"row\" class=\"md-list-item-text\" flex>\n              <div layout=\"row\" layout-align=\"start center\" flex=\"80\">\n                <div layout=\"column\" class=\"\">\n                  <span class=\"lineItemSubHeader\">{{attendee.name}}</span>\n\n                  <div layout=\"row\">\n                    <span class=\"lineItemSubDetail\">${{attendee.amount/ 100  | number:2}}</span>\n                  </div>\n\n                </div>\n              </div>\n\n              <div layout=\"row \" layout-align=\"end center\" flex=\"20\">\n                <div layout=\"column \" class=\"addOnAdjusters\" layout-align=\"center end \" flex layout-grow>\n                  <ng-md-icon icon=\"add_circle_outline\" class=\"listIconSub\" ng-click=\"vm.adjustAttendee($index,'up');\"> </ng-md-icon>\n                  <ng-md-icon icon=\" remove_circle_outline \" class=\"listIconSub\" ng-click=\"vm.adjustAttendee($index,'down');\"></ng-md-icon>\n                </div>\n\n                <div layout=\"column\" layout-align=\"end end \">\n                  <input class='addOnQuantityText' ng-model=\"attendee.quantity\" ng-change=\"vm.checkAdjustAttendee($index);\" md-select-on-focus></input>\n                </div>\n              </div>\n            </div>\n          </md-list-item>\n        </div>\n        <md-list-item>\n          <div layout=\"row\" flex layout-padding>\n            <div layout=\"row\" layout-align=\"start center\" flex=\"80\">\n            </div>\n            <div layout=\"row\" layout-align=\"end center\" flex=\"20\">\n              <div layout=\"column \" layout-align=\"center end\" flex>\n                <md-button ng-if=\"vm.isNextStepPayment('attendees')\" class=\"md-raised\" ng-disabled=\"!vm.areAttendeesValid()\" ng-click=\"vm.goToNextStep('attendeesStep')\">Next</md-button>\n              </div>\n            </div>\n          </div>\n        </md-list-item>\n      </div>\n\n      <md-divider></md-divider>\n\n      <!-- Add ons --->\n      <div ng-if=\"vm.addons.length > 0\">\n        <md-list-item class=\"paymentHeader md-2-line\" ng-disabled=\"vm.countAttendeesAdded() < 1 || guestDetailsForm.$invalid\" ng-click=\"vm.toggleAddons()\">\n          <div layout=\"row\" class=\"md-list-item-text\" flex>\n            <div layout=\"row\" layout-align=\"start center\" flex=\"80\">\n              <div layout=\"column\" class=\"formHeader\">\n                <div layout=\"row\" layout-align=\"start center\" flex=\"50\">\n                  <ng-md-icon class=\"headerIcon\" icon=\"filter_3\" class=\"listIcon \"></ng-md-icon>\n                  <span class=\"paymentSubTitle\">Add-ons</span>\n                </div>\n              </div>\n            </div>\n\n            <div layout=\"row \" layout-align=\"end center\" flex=\"20\">\n              <div layout=\"column\" layout-align=\"center end\" flex>\n                <ng-md-icon ng-show=\"vm.addOnsSelected == 1\" icon=\"check\" class=\"listIcon\"></ng-md-icon>\n                <ng-md-icon icon=\"{{vm.addonsExpanded ? 'expand_less' : 'expand_more'}}\" class=\"listIcon\"></ng-md-icon>\n              </div>\n            </div>\n          </div>\n        </md-list-item>\n        <div class=\"activityForm slideDown\" ng-show=\"vm.addonsExpanded\" ng-class=\"vm.areAddonsValid()\">\n          <div ng-repeat=\"addon in vm.addons\">\n            <md-list-item class=\"md-2-line addOnListItem\">\n              <div layout=\"row\" class=\"md-list-item-text \" flex>\n                <div layout=\"row\" layout-align=\"start center\" flex=\"80\">\n                  <div layout=\"column\" class=\"\">\n                    <span class=\"lineItemSubHeader\">{{addon.name}}</span>\n                    <div layout=\"row\" class=\"\">\n                      <span class=\"lineItemSubDetail \">${{addon.amount/ 100  | number:2}}</span>\n                    </div>\n                  </div>\n                </div>\n\n                <div layout=\"row\" layout-align=\"end center\" flex=\"20\">\n                  <div layout=\"column \" class=\"addOnAdjusters\" layout-align=\"center end\" flex layout-grow>\n                    <ng-md-icon icon=\"add_circle_outline\" class=\"listIconSub\" ng-click=\"vm.adjustAddon($index,'up');\"> </ng-md-icon>\n                    <ng-md-icon icon=\" remove_circle_outline \" class=\"listIconSub\" ng-click=\"vm.adjustAddon($index,'down');\"></ng-md-icon>\n                  </div>\n\n                  <div layout=\"column\" layout-align=\"end end\">\n                    <input class='addOnQuantityText' ng-model=\"addon.quantity\" ng-change=\"vm.getPricingQuote();\" md-select-on-focus></input>\n                  </div>\n                </div>\n              </div>\n            </md-list-item>\n          </div>\n          <md-list-item>\n            <div layout=\"row\" flex layout-padding>\n              <div layout=\"row\" layout-align=\"start center\" flex=\"80\">\n              </div>\n              <div layout=\"row\" layout-align=\"end center\" flex=\"20\">\n                <div layout=\"column \" layout-align=\"center end\" flex>\n                  <md-button ng-if=\"vm.isNextStepPayment('addons')\" class=\"md-raised\" ng-click=\"vm.goToNextStep('addonsStep')\">Next</md-button>\n                </div>\n              </div>\n            </div>\n          </md-list-item>\n        </div>\n        <md-divider></md-divider>\n      </div>\n\n      <!--Questions-->\n      <div ng-if=\"vm.questions.length > 0\">\n        <md-list-item class=\"paymentHeader md-2-line\" ng-disabled=\"vm.countAttendeesAdded() < 1 || guestDetailsForm.$invalid\" ng-click=\"vm.toggleQuestions()\">\n          <div layout=\"row\" class=\"md-list-item-text\" flex>\n            <div layout=\"row\" layout-align=\"start center\" flex>\n              <div layout=\"column\" class=\"formHeader\">\n                <div layout=\"row\" layout-align=\"start center\" flex>\n                  <ng-md-icon class=\"headerIcon\" icon=\"filter_4\" class=\"listIcon\" ng-if=\"vm.addons.length > 0\"></ng-md-icon>\n                  <ng-md-icon class=\"headerIcon\" icon=\"filter_3\" class=\"listIcon\" ng-if=\"vm.addons.length == 0\"></ng-md-icon>\n\n                  <span class=\"paymentSubTitle\">Booking Questions | {{vm.bookingQuestionsCompleted()}}/{{vm.questions.length}}</span>\n                </div>\n              </div>\n            </div>\n\n            <div layout=\"row \" layout-align=\"end center\">\n              <div layout=\"column \" layout-align=\"center end\" flex>\n                <ng-md-icon icon=\"{{vm.questionsExpanded ? 'expand_less' : 'expand_more'}}\" class=\"listIcon \"></ng-md-icon>\n              </div>\n            </div>\n          </div>\n        </md-list-item>\n        <div class=\"questionForm slideDown\" ng-show=\"vm.questionsExpanded\" ng-class=\"!vm.areBookingQuestionsValid()\">\n          <div ng-repeat=\"question in vm.questions\">\n            <md-list-item class=\"md-2-line addOnListItem\">\n              <div layout=\"row\" class=\"md-list-item-text\" flex>\n                <div layout=\"column\" layout-align=\"center stretch\" flex>\n                  <label class=\"small-label\">{{question.questionText}}</label>\n                  <div layout=\"row\" layout-align=\"start center\">\n                    <ng-md-icon icon=\"{{vm.bookingQuestions[$index].length > 0 ? 'done' : 'priority_high'}}\" class=\"inputStatusIcon \"></ng-md-icon>\n                    <md-input-container flex>\n                      <textarea name=\"question\" ng-model=\"vm.bookingQuestions[$index]\" md-maxlength=\"300\" rows=\"1\"></textarea>\n                    </md-input-container>\n                  </div>\n                </div>\n              </div>\n            </md-list-item>\n          </div>\n        </div>\n        <md-divider ng-if=\"!vm.addonsExpanded\"></md-divider>\n      </div>\n\n      <div layout=\"row\">\n        <md-button flex class=\"md-primary md-raised\" ng-disabled=\"!vm.isPaymentValid() || vm.paymentWasSent\" ng-click=\"vm.goToPay()\"><i class=\"fa fa-credit-card\" aria-hidden=\"true\"></i> Pay</md-button>\n      </div>\n\n      <!--Payment-->\n      <div class=\"activityForm slideDown\" ng-show=\"vm.paymentExpanded\">\n        <div ng-if=\"vm.loadingIframe\" layout=\"row\" layout-align=\"space-around center\" style=\"padding:20px\">\n          <md-progress-circular md-mode=\"indeterminate\"></md-progress-circular>\n        </div>\n        <iframe ng-style=\"{'height': vm.loadingIframe ? '0' : '100%'}\" id=\"payzenIframe\" class=\"payzenIframe\"></iframe>\n      </div>\n      <md-divider></md-divider>\n    </md-list>\n\n\n  </md-card>\n</div>\n";

/***/ }),
/* 34 */
/***/ (function(module, exports) {

	module.exports = "<!--<div layout=\"row\" class=\"activityPaymentSummaryCard\" ng-class=\"{'activityPaymentSummaryCardMobile' : !screenIsBig()}\" layout-align=\"center start\" flex=\"100\">-->\n  <div layout=\"{{screenIsBig() ? 'row' : 'column'}}\" layout-align=\"{{screenIsBig() ? 'center start' : 'center center'}}\" class=\"columnFix\">\n    <div class=\"paymentSummaryCardLarge\">\n        <div ng-include=\"'activity-forms.html'\"></div>\n    </div>\n    <div class=\"paymentSummaryCardLarge\">\n      <div ng-include=\"'activity-total.html'\"></div>\n    </div>\n  </div>\n\n\n<div>\n  <md-card class=\"paymentSummaryCard\" ng-show=\"paymentResponse.length > 0\">\n  <md-list>\n\n\n    <div ng-show=\"paymentResponse == 'success'\" class=\"easeIn\">\n      <md-list-item class=\"paymentHeader md-2-line md-primary\" ng-mouseleave=\"addOnsHover = 0\" ng-mouseenter=\"addOnsHover = 1\" ng-init=\"addOnsHover=0\">\n        <div layout=\"row\" class=\"md-list-item-text \" flex>\n          <div layout=\"row\" layout-align=\"start center\" flex=\"50\" md-colors=\"{color: 'primary'}\">\n            <ng-md-icon class=\"headerIcon\" icon=\"payment\" class=\"listIcon \"></ng-md-icon>\n\n            <span class=\"paymentSubTitle total\">Payment Complete</span>\n          </div>\n          <div layout=\"row \" layout-align=\"end center \" flex=\"50 \">\n            <span class=\"paymentSubTitle total\" md-colors=\"{color: 'green'}\"></span>\n\n            <ng-md-icon icon=\"check\" class=\"listIcon \" md-colors=\"{fill: 'green'}\"></ng-md-icon>\n\n          </div>\n        </div>\n      </md-list-item>\n      <md-list-item>\n      <div layout=\"column\" layout-align=\"space-between center\">\n        <div layout=\"row\" layout-wrap>\n          <p class=\"listMessage\">An e-mail will be sent to {{vm.formData.mail }} with details about your reservation.</p>\n        </div>\n        <div layout=\"row\" layout-wrap>\n          <p flex=\"none\" class=\"listMessage\">For questions about your booking please contact: </p>\n          <p flex=\"none\" class=\"listMessage\">{{bookingSuccessResponse.operator.companyName}} (+{{bookingSuccessResponse.operator.primaryContact.phoneNumber}}) </p>\n          <p flex=\"none\" class=\"listMessage\">{{bookingSuccessResponse.operator.primaryContact.email}} </p>\n          <p flex=\"none\" class=\"listMessage\">Booking reference ID: {{bookingSuccessResponse.bookingId}} </p>\n        </div>\n        </div>\n      </md-list-item>\n      <md-list-item>\n        <div layout=\"row\" layout-align=\"end center\" flex>\n          <md-button class=\"md-raised md-primary\" ng-click=\"vm.returnToMainPage()\">Return</md-button>\n        </div>\n      </md-list-item>\n    </div>\n\n    <div ng-show=\"paymentResponse == 'failed'\">\n\n      <md-list-item class=\"paymentHeader md-2-line md-primary\" md-colors=\"{color: 'primary'}\" ng-mouseleave=\"addOnsHover = 0\" ng-mouseenter=\"addOnsHover = 1\" ng-init=\"addOnsHover=0\">\n        <div layout=\"row\" class=\"md-list-item-text \" flex>\n          <div layout=\"row\" layout-align=\"start center\" flex=\"50\" md-colors=\"{color: 'warn'}\">\n            <ng-md-icon class=\"headerIcon\" icon=\"payment\" class=\"listIcon \"></ng-md-icon>\n\n            <span class=\"paymentSubTitle total\">Payment Failed</span>\n          </div>\n          <div layout=\"row \" layout-align=\"end center \" flex=\"50 \">\n            <span class=\"paymentSubTitle total\" md-colors=\"{color: 'warn'}\"></span>\n\n            <ng-md-icon icon=\"error\" class=\"listIcon \" md-colors=\"{fill: 'warn'}\"></ng-md-icon>\n\n          </div>\n        </div>\n      </md-list-item>\n\n      <md-list-item>\n        <div layout=\"row\" layout-wrap>\n\n          <p class=\"listMessage\">Your credit card has been declined. Please confirm the information you provided is correct and try again.</p>\n        </div>\n      </md-list-item>\n      <md-list-item>\n        <div layout=\"row\" layout-align=\"end center\" flex>\n          <md-button class=\"md-raised md-primary\" ng-click=\"vm.payNow();\">Try Again</md-button>\n\n        </div>\n      </md-list-item>\n    </div>\n\n\n    <div ng-show=\"paymentResponse == 'processing'\">\n\n      <md-list-item class=\"paymentHeader md-2-line md-primary\" md-colors=\"{color: 'primary'}\" ng-mouseleave=\"addOnsHover = 0\" ng-mouseenter=\"addOnsHover = 1\" ng-init=\"addOnsHover=0\">\n\n        <div layout=\"row\" class=\"md-list-item-text \" flex>\n          <div layout=\"row\" layout-align=\"start center\" flex layout-grow md-colors=\"{color: 'primary'}\">\n            <ng-md-icon class=\"headerIcon\" icon=\"payment\" class=\"listIcon \"></ng-md-icon>\n\n            <span class=\"paymentSubTitle total\">Payment Processing</span>\n          </div>\n          <div layout=\"row \" layout-align=\"end center \">\n            <span class=\"paymentSubTitle total\" md-colors=\"{color: 'green'}\"></span>\n\n            <ng-md-icon icon=\"watch_later\" class=\"listIcon \" md-colors=\"{fill: 'amber'}\"></ng-md-icon>\n\n          </div>\n        </div>\n      </md-list-item>\n      <md-list-item>\n        <div layout=\"row\" layout-wrap>\n\n          <p class=\"listMessage\">Your booking payment is still processing. An e-mail will be sent to {{vm.formData.mail }} with details about your reservation.</p>\n        </div>\n\n      </md-list-item>\n      <md-list-item>\n        <div layout=\"row\" layout-align=\"end center\" flex>\n          <md-button class=\"md-raised md-primary\" ng-click=\"goToState('home');\">Return</md-button>\n\n        </div>\n      </md-list-item>\n    </div>\n  </md-list>\n\n</md-card>\n  \n  \n  \n  \n</div>";

/***/ }),
/* 35 */
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