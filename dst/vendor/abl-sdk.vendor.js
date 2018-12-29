/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	var parentJsonpFunction = window["webpackJsonp"];
/******/ 	window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules) {
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, callbacks = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId])
/******/ 				callbacks.push.apply(callbacks, installedChunks[chunkId]);
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules);
/******/ 		while(callbacks.length)
/******/ 			callbacks.shift().call(null, __webpack_require__);
/******/ 		if(moreModules[0]) {
/******/ 			installedModules[0] = 0;
/******/ 			return __webpack_require__(0);
/******/ 		}
/******/ 	};
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
/******/ 	var hotCurrentHash = "6bc19fade8e4a162853b"; // eslint-disable-line no-unused-vars
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
/******/ 			for(var chunkId in installedChunks)
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

/******/ 	// object to store loaded and loading chunks
/******/ 	// "0" means "already loaded"
/******/ 	// Array means "loading", array contains callbacks
/******/ 	var installedChunks = {
/******/ 		1:0
/******/ 	};

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

/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId, callback) {
/******/ 		// "0" is the signal for "already loaded"
/******/ 		if(installedChunks[chunkId] === 0)
/******/ 			return callback.call(null, __webpack_require__);

/******/ 		// an array means "currently loading".
/******/ 		if(installedChunks[chunkId] !== undefined) {
/******/ 			installedChunks[chunkId].push(callback);
/******/ 		} else {
/******/ 			// start chunk loading
/******/ 			installedChunks[chunkId] = [callback];
/******/ 			var head = document.getElementsByTagName('head')[0];
/******/ 			var script = document.createElement('script');
/******/ 			script.type = 'text/javascript';
/******/ 			script.charset = 'utf-8';
/******/ 			script.async = true;

/******/ 			script.src = __webpack_require__.p + "" + chunkId + ".abl-sdk.js";
/******/ 			head.appendChild(script);
/******/ 		}
/******/ 	};

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

	__webpack_require__(211);
	__webpack_require__(79);
	__webpack_require__(147);
	__webpack_require__(133);
	__webpack_require__(78);
	module.exports = __webpack_require__(162);


/***/ }),
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */
/***/ (function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ }),
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
/* 15 */
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
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {"use strict";

	function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

	/* eslint-env browser */

	/**
	 * This is the web browser implementation of `debug()`.
	 */
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.storage = localstorage();
	/**
	 * Colors.
	 */

	exports.colors = ['#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC', '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF', '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC', '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF', '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC', '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033', '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366', '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933', '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC', '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF', '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'];
	/**
	 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
	 * and the Firebug extension (any Firefox version) are known
	 * to support "%c" CSS customizations.
	 *
	 * TODO: add a `localStorage` variable to explicitly enable/disable colors
	 */
	// eslint-disable-next-line complexity

	function useColors() {
	  // NB: In an Electron preload script, document will be defined but not fully
	  // initialized. Since we know we're in Chrome, we'll just detect this case
	  // explicitly
	  if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
	    return true;
	  } // Internet Explorer and Edge do not support colors.


	  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
	    return false;
	  } // Is webkit? http://stackoverflow.com/a/16459606/376773
	  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632


	  return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
	  typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
	  // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
	  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
	  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
	}
	/**
	 * Colorize log arguments if enabled.
	 *
	 * @api public
	 */


	function formatArgs(args) {
	  args[0] = (this.useColors ? '%c' : '') + this.namespace + (this.useColors ? ' %c' : ' ') + args[0] + (this.useColors ? '%c ' : ' ') + '+' + module.exports.humanize(this.diff);

	  if (!this.useColors) {
	    return;
	  }

	  var c = 'color: ' + this.color;
	  args.splice(1, 0, c, 'color: inherit'); // The final "%c" is somewhat tricky, because there could be other
	  // arguments passed either before or after the %c, so we need to
	  // figure out the correct index to insert the CSS into

	  var index = 0;
	  var lastC = 0;
	  args[0].replace(/%[a-zA-Z%]/g, function (match) {
	    if (match === '%%') {
	      return;
	    }

	    index++;

	    if (match === '%c') {
	      // We only are interested in the *last* %c
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
	  var _console;

	  // This hackery is required for IE8/9, where
	  // the `console.log` function doesn't have 'apply'
	  return (typeof console === "undefined" ? "undefined" : _typeof(console)) === 'object' && console.log && (_console = console).log.apply(_console, arguments);
	}
	/**
	 * Save `namespaces`.
	 *
	 * @param {String} namespaces
	 * @api private
	 */


	function save(namespaces) {
	  try {
	    if (namespaces) {
	      exports.storage.setItem('debug', namespaces);
	    } else {
	      exports.storage.removeItem('debug');
	    }
	  } catch (error) {// Swallow
	    // XXX (@Qix-) should we be logging these?
	  }
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
	    r = exports.storage.getItem('debug');
	  } catch (error) {} // Swallow
	  // XXX (@Qix-) should we be logging these?
	  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG


	  if (!r && typeof process !== 'undefined' && 'env' in process) {
	    r = process.env.DEBUG;
	  }

	  return r;
	}
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
	    // TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
	    // The Browser also has localStorage in the global context.
	    return localStorage;
	  } catch (error) {// Swallow
	    // XXX (@Qix-) should we be logging these?
	  }
	}

	module.exports = __webpack_require__(24)(exports);
	var formatters = module.exports.formatters;
	/**
	 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	 */

	formatters.j = function (v) {
	  try {
	    return JSON.stringify(v);
	  } catch (error) {
	    return '[UnexpectedJSONParseError]: ' + error.message;
	  }
	};


	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * This is the common logic for both the Node.js and web browser
	 * implementations of `debug()`.
	 */
	function setup(env) {
	  createDebug.debug = createDebug;
	  createDebug.default = createDebug;
	  createDebug.coerce = coerce;
	  createDebug.disable = disable;
	  createDebug.enable = enable;
	  createDebug.enabled = enabled;
	  createDebug.humanize = __webpack_require__(25);
	  Object.keys(env).forEach(function (key) {
	    createDebug[key] = env[key];
	  });
	  /**
	  * Active `debug` instances.
	  */

	  createDebug.instances = [];
	  /**
	  * The currently active debug mode names, and names to skip.
	  */

	  createDebug.names = [];
	  createDebug.skips = [];
	  /**
	  * Map of special "%n" handling functions, for the debug "format" argument.
	  *
	  * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	  */

	  createDebug.formatters = {};
	  /**
	  * Selects a color for a debug namespace
	  * @param {String} namespace The namespace string for the for the debug instance to be colored
	  * @return {Number|String} An ANSI color code for the given namespace
	  * @api private
	  */

	  function selectColor(namespace) {
	    var hash = 0;

	    for (var i = 0; i < namespace.length; i++) {
	      hash = (hash << 5) - hash + namespace.charCodeAt(i);
	      hash |= 0; // Convert to 32bit integer
	    }

	    return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	  }

	  createDebug.selectColor = selectColor;
	  /**
	  * Create a debugger with the given `namespace`.
	  *
	  * @param {String} namespace
	  * @return {Function}
	  * @api public
	  */

	  function createDebug(namespace) {
	    var prevTime;

	    function debug() {
	      // Disabled?
	      if (!debug.enabled) {
	        return;
	      }

	      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }

	      var self = debug; // Set `diff` timestamp

	      var curr = Number(new Date());
	      var ms = curr - (prevTime || curr);
	      self.diff = ms;
	      self.prev = prevTime;
	      self.curr = curr;
	      prevTime = curr;
	      args[0] = createDebug.coerce(args[0]);

	      if (typeof args[0] !== 'string') {
	        // Anything else let's inspect with %O
	        args.unshift('%O');
	      } // Apply any `formatters` transformations


	      var index = 0;
	      args[0] = args[0].replace(/%([a-zA-Z%])/g, function (match, format) {
	        // If we encounter an escaped % then don't increase the array index
	        if (match === '%%') {
	          return match;
	        }

	        index++;
	        var formatter = createDebug.formatters[format];

	        if (typeof formatter === 'function') {
	          var val = args[index];
	          match = formatter.call(self, val); // Now we need to remove `args[index]` since it's inlined in the `format`

	          args.splice(index, 1);
	          index--;
	        }

	        return match;
	      }); // Apply env-specific formatting (colors, etc.)

	      createDebug.formatArgs.call(self, args);
	      var logFn = self.log || createDebug.log;
	      logFn.apply(self, args);
	    }

	    debug.namespace = namespace;
	    debug.enabled = createDebug.enabled(namespace);
	    debug.useColors = createDebug.useColors();
	    debug.color = selectColor(namespace);
	    debug.destroy = destroy;
	    debug.extend = extend; // Debug.formatArgs = formatArgs;
	    // debug.rawLog = rawLog;
	    // env-specific initialization logic for debug instances

	    if (typeof createDebug.init === 'function') {
	      createDebug.init(debug);
	    }

	    createDebug.instances.push(debug);
	    return debug;
	  }

	  function destroy() {
	    var index = createDebug.instances.indexOf(this);

	    if (index !== -1) {
	      createDebug.instances.splice(index, 1);
	      return true;
	    }

	    return false;
	  }

	  function extend(namespace, delimiter) {
	    return createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
	  }
	  /**
	  * Enables a debug mode by namespaces. This can include modes
	  * separated by a colon and wildcards.
	  *
	  * @param {String} namespaces
	  * @api public
	  */


	  function enable(namespaces) {
	    createDebug.save(namespaces);
	    createDebug.names = [];
	    createDebug.skips = [];
	    var i;
	    var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
	    var len = split.length;

	    for (i = 0; i < len; i++) {
	      if (!split[i]) {
	        // ignore empty strings
	        continue;
	      }

	      namespaces = split[i].replace(/\*/g, '.*?');

	      if (namespaces[0] === '-') {
	        createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
	      } else {
	        createDebug.names.push(new RegExp('^' + namespaces + '$'));
	      }
	    }

	    for (i = 0; i < createDebug.instances.length; i++) {
	      var instance = createDebug.instances[i];
	      instance.enabled = createDebug.enabled(instance.namespace);
	    }
	  }
	  /**
	  * Disable debug output.
	  *
	  * @api public
	  */


	  function disable() {
	    createDebug.enable('');
	  }
	  /**
	  * Returns true if the given mode name is enabled, false otherwise.
	  *
	  * @param {String} name
	  * @return {Boolean}
	  * @api public
	  */


	  function enabled(name) {
	    if (name[name.length - 1] === '*') {
	      return true;
	    }

	    var i;
	    var len;

	    for (i = 0, len = createDebug.skips.length; i < len; i++) {
	      if (createDebug.skips[i].test(name)) {
	        return false;
	      }
	    }

	    for (i = 0, len = createDebug.names.length; i < len; i++) {
	      if (createDebug.names[i].test(name)) {
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
	    if (val instanceof Error) {
	      return val.stack || val.message;
	    }

	    return val;
	  }

	  createDebug.enable(createDebug.load());
	  return createDebug;
	}

	module.exports = setup;



/***/ }),
/* 25 */
/***/ (function(module, exports) {

	/**
	 * Helpers.
	 */

	var s = 1000;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var w = d * 7;
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
	  var match = /^((?:\d+)?\-?\d?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
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
	    case 'weeks':
	    case 'week':
	    case 'w':
	      return n * w;
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
	  var msAbs = Math.abs(ms);
	  if (msAbs >= d) {
	    return Math.round(ms / d) + 'd';
	  }
	  if (msAbs >= h) {
	    return Math.round(ms / h) + 'h';
	  }
	  if (msAbs >= m) {
	    return Math.round(ms / m) + 'm';
	  }
	  if (msAbs >= s) {
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
	  var msAbs = Math.abs(ms);
	  if (msAbs >= d) {
	    return plural(ms, msAbs, d, 'day');
	  }
	  if (msAbs >= h) {
	    return plural(ms, msAbs, h, 'hour');
	  }
	  if (msAbs >= m) {
	    return plural(ms, msAbs, m, 'minute');
	  }
	  if (msAbs >= s) {
	    return plural(ms, msAbs, s, 'second');
	  }
	  return ms + ' ms';
	}

	/**
	 * Pluralization helper.
	 */

	function plural(ms, msAbs, n, name) {
	  var isPlural = msAbs >= n * 1.5;
	  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
	}


/***/ }),
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
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global, process) {// Copyright (c) Microsoft, All rights reserved. See License.txt in the project root for license information.

	;(function (undefined) {

	  var objectTypes = {
	    'function': true,
	    'object': true
	  };

	  function checkGlobal(value) {
	    return (value && value.Object === Object) ? value : null;
	  }

	  var freeExports = (objectTypes[typeof exports] && exports && !exports.nodeType) ? exports : null;
	  var freeModule = (objectTypes[typeof module] && module && !module.nodeType) ? module : null;
	  var freeGlobal = checkGlobal(freeExports && freeModule && typeof global === 'object' && global);
	  var freeSelf = checkGlobal(objectTypes[typeof self] && self);
	  var freeWindow = checkGlobal(objectTypes[typeof window] && window);
	  var moduleExports = (freeModule && freeModule.exports === freeExports) ? freeExports : null;
	  var thisGlobal = checkGlobal(objectTypes[typeof this] && this);
	  var root = freeGlobal || ((freeWindow !== (thisGlobal && thisGlobal.window)) && freeWindow) || freeSelf || thisGlobal || Function('return this')();

	  var Rx = {
	    internals: {},
	    config: {
	      Promise: root.Promise
	    },
	    helpers: { }
	  };

	  // Defaults
	  var noop = Rx.helpers.noop = function () { },
	    identity = Rx.helpers.identity = function (x) { return x; },
	    defaultNow = Rx.helpers.defaultNow = Date.now,
	    defaultComparer = Rx.helpers.defaultComparer = function (x, y) { return isEqual(x, y); },
	    defaultSubComparer = Rx.helpers.defaultSubComparer = function (x, y) { return x > y ? 1 : (x < y ? -1 : 0); },
	    defaultKeySerializer = Rx.helpers.defaultKeySerializer = function (x) { return x.toString(); },
	    defaultError = Rx.helpers.defaultError = function (err) { throw err; },
	    isPromise = Rx.helpers.isPromise = function (p) { return !!p && typeof p.subscribe !== 'function' && typeof p.then === 'function'; },
	    isFunction = Rx.helpers.isFunction = (function () {

	      var isFn = function (value) {
	        return typeof value == 'function' || false;
	      };

	      // fallback for older versions of Chrome and Safari
	      if (isFn(/x/)) {
	        isFn = function(value) {
	          return typeof value == 'function' && toString.call(value) == '[object Function]';
	        };
	      }

	      return isFn;
	    }());

	  function cloneArray(arr) { for(var a = [], i = 0, len = arr.length; i < len; i++) { a.push(arr[i]); } return a;}

	  var errorObj = {e: {}};
	  
	  function tryCatcherGen(tryCatchTarget) {
	    return function tryCatcher() {
	      try {
	        return tryCatchTarget.apply(this, arguments);
	      } catch (e) {
	        errorObj.e = e;
	        return errorObj;
	      }
	    };
	  }

	  var tryCatch = Rx.internals.tryCatch = function tryCatch(fn) {
	    if (!isFunction(fn)) { throw new TypeError('fn must be a function'); }
	    return tryCatcherGen(fn);
	  };

	  function thrower(e) {
	    throw e;
	  }

	  Rx.config.longStackSupport = false;
	  var hasStacks = false, stacks = tryCatch(function () { throw new Error(); })();
	  hasStacks = !!stacks.e && !!stacks.e.stack;

	  // All code after this point will be filtered from stack traces reported by RxJS
	  var rStartingLine = captureLine(), rFileName;

	  var STACK_JUMP_SEPARATOR = 'From previous event:';

	  function makeStackTraceLong(error, observable) {
	    // If possible, transform the error stack trace by removing Node and RxJS
	    // cruft, then concatenating with the stack trace of `observable`.
	    if (hasStacks &&
	        observable.stack &&
	        typeof error === 'object' &&
	        error !== null &&
	        error.stack &&
	        error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1
	    ) {
	      var stacks = [];
	      for (var o = observable; !!o; o = o.source) {
	        if (o.stack) {
	          stacks.unshift(o.stack);
	        }
	      }
	      stacks.unshift(error.stack);

	      var concatedStacks = stacks.join('\n' + STACK_JUMP_SEPARATOR + '\n');
	      error.stack = filterStackString(concatedStacks);
	    }
	  }

	  function filterStackString(stackString) {
	    var lines = stackString.split('\n'), desiredLines = [];
	    for (var i = 0, len = lines.length; i < len; i++) {
	      var line = lines[i];

	      if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
	        desiredLines.push(line);
	      }
	    }
	    return desiredLines.join('\n');
	  }

	  function isInternalFrame(stackLine) {
	    var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);
	    if (!fileNameAndLineNumber) {
	      return false;
	    }
	    var fileName = fileNameAndLineNumber[0], lineNumber = fileNameAndLineNumber[1];

	    return fileName === rFileName &&
	      lineNumber >= rStartingLine &&
	      lineNumber <= rEndingLine;
	  }

	  function isNodeFrame(stackLine) {
	    return stackLine.indexOf('(module.js:') !== -1 ||
	      stackLine.indexOf('(node.js:') !== -1;
	  }

	  function captureLine() {
	    if (!hasStacks) { return; }

	    try {
	      throw new Error();
	    } catch (e) {
	      var lines = e.stack.split('\n');
	      var firstLine = lines[0].indexOf('@') > 0 ? lines[1] : lines[2];
	      var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
	      if (!fileNameAndLineNumber) { return; }

	      rFileName = fileNameAndLineNumber[0];
	      return fileNameAndLineNumber[1];
	    }
	  }

	  function getFileNameAndLineNumber(stackLine) {
	    // Named functions: 'at functionName (filename:lineNumber:columnNumber)'
	    var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
	    if (attempt1) { return [attempt1[1], Number(attempt1[2])]; }

	    // Anonymous functions: 'at filename:lineNumber:columnNumber'
	    var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
	    if (attempt2) { return [attempt2[1], Number(attempt2[2])]; }

	    // Firefox style: 'function@filename:lineNumber or @filename:lineNumber'
	    var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
	    if (attempt3) { return [attempt3[1], Number(attempt3[2])]; }
	  }

	  var EmptyError = Rx.EmptyError = function() {
	    this.message = 'Sequence contains no elements.';
	    Error.call(this);
	  };
	  EmptyError.prototype = Object.create(Error.prototype);
	  EmptyError.prototype.name = 'EmptyError';

	  var ObjectDisposedError = Rx.ObjectDisposedError = function() {
	    this.message = 'Object has been disposed';
	    Error.call(this);
	  };
	  ObjectDisposedError.prototype = Object.create(Error.prototype);
	  ObjectDisposedError.prototype.name = 'ObjectDisposedError';

	  var ArgumentOutOfRangeError = Rx.ArgumentOutOfRangeError = function () {
	    this.message = 'Argument out of range';
	    Error.call(this);
	  };
	  ArgumentOutOfRangeError.prototype = Object.create(Error.prototype);
	  ArgumentOutOfRangeError.prototype.name = 'ArgumentOutOfRangeError';

	  var NotSupportedError = Rx.NotSupportedError = function (message) {
	    this.message = message || 'This operation is not supported';
	    Error.call(this);
	  };
	  NotSupportedError.prototype = Object.create(Error.prototype);
	  NotSupportedError.prototype.name = 'NotSupportedError';

	  var NotImplementedError = Rx.NotImplementedError = function (message) {
	    this.message = message || 'This operation is not implemented';
	    Error.call(this);
	  };
	  NotImplementedError.prototype = Object.create(Error.prototype);
	  NotImplementedError.prototype.name = 'NotImplementedError';

	  var notImplemented = Rx.helpers.notImplemented = function () {
	    throw new NotImplementedError();
	  };

	  var notSupported = Rx.helpers.notSupported = function () {
	    throw new NotSupportedError();
	  };

	  // Shim in iterator support
	  var $iterator$ = (typeof Symbol === 'function' && Symbol.iterator) ||
	    '_es6shim_iterator_';
	  // Bug for mozilla version
	  if (root.Set && typeof new root.Set()['@@iterator'] === 'function') {
	    $iterator$ = '@@iterator';
	  }

	  var doneEnumerator = Rx.doneEnumerator = { done: true, value: undefined };

	  var isIterable = Rx.helpers.isIterable = function (o) {
	    return o && o[$iterator$] !== undefined;
	  };

	  var isArrayLike = Rx.helpers.isArrayLike = function (o) {
	    return o && o.length !== undefined;
	  };

	  Rx.helpers.iterator = $iterator$;

	  var bindCallback = Rx.internals.bindCallback = function (func, thisArg, argCount) {
	    if (typeof thisArg === 'undefined') { return func; }
	    switch(argCount) {
	      case 0:
	        return function() {
	          return func.call(thisArg)
	        };
	      case 1:
	        return function(arg) {
	          return func.call(thisArg, arg);
	        };
	      case 2:
	        return function(value, index) {
	          return func.call(thisArg, value, index);
	        };
	      case 3:
	        return function(value, index, collection) {
	          return func.call(thisArg, value, index, collection);
	        };
	    }

	    return function() {
	      return func.apply(thisArg, arguments);
	    };
	  };

	  /** Used to determine if values are of the language type Object */
	  var dontEnums = ['toString',
	    'toLocaleString',
	    'valueOf',
	    'hasOwnProperty',
	    'isPrototypeOf',
	    'propertyIsEnumerable',
	    'constructor'],
	  dontEnumsLength = dontEnums.length;

	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    funcTag = '[object Function]',
	    mapTag = '[object Map]',
	    numberTag = '[object Number]',
	    objectTag = '[object Object]',
	    regexpTag = '[object RegExp]',
	    setTag = '[object Set]',
	    stringTag = '[object String]',
	    weakMapTag = '[object WeakMap]';

	var arrayBufferTag = '[object ArrayBuffer]',
	    float32Tag = '[object Float32Array]',
	    float64Tag = '[object Float64Array]',
	    int8Tag = '[object Int8Array]',
	    int16Tag = '[object Int16Array]',
	    int32Tag = '[object Int32Array]',
	    uint8Tag = '[object Uint8Array]',
	    uint8ClampedTag = '[object Uint8ClampedArray]',
	    uint16Tag = '[object Uint16Array]',
	    uint32Tag = '[object Uint32Array]';

	var typedArrayTags = {};
	typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
	typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
	typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
	typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
	typedArrayTags[uint32Tag] = true;
	typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
	typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
	typedArrayTags[dateTag] = typedArrayTags[errorTag] =
	typedArrayTags[funcTag] = typedArrayTags[mapTag] =
	typedArrayTags[numberTag] = typedArrayTags[objectTag] =
	typedArrayTags[regexpTag] = typedArrayTags[setTag] =
	typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

	var objectProto = Object.prototype,
	    hasOwnProperty = objectProto.hasOwnProperty,
	    objToString = objectProto.toString,
	    MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

	var keys = Object.keys || (function() {
	    var hasOwnProperty = Object.prototype.hasOwnProperty,
	        hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
	        dontEnums = [
	          'toString',
	          'toLocaleString',
	          'valueOf',
	          'hasOwnProperty',
	          'isPrototypeOf',
	          'propertyIsEnumerable',
	          'constructor'
	        ],
	        dontEnumsLength = dontEnums.length;

	    return function(obj) {
	      if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
	        throw new TypeError('Object.keys called on non-object');
	      }

	      var result = [], prop, i;

	      for (prop in obj) {
	        if (hasOwnProperty.call(obj, prop)) {
	          result.push(prop);
	        }
	      }

	      if (hasDontEnumBug) {
	        for (i = 0; i < dontEnumsLength; i++) {
	          if (hasOwnProperty.call(obj, dontEnums[i])) {
	            result.push(dontEnums[i]);
	          }
	        }
	      }
	      return result;
	    };
	  }());

	function equalObjects(object, other, equalFunc, isLoose, stackA, stackB) {
	  var objProps = keys(object),
	      objLength = objProps.length,
	      othProps = keys(other),
	      othLength = othProps.length;

	  if (objLength !== othLength && !isLoose) {
	    return false;
	  }
	  var index = objLength, key;
	  while (index--) {
	    key = objProps[index];
	    if (!(isLoose ? key in other : hasOwnProperty.call(other, key))) {
	      return false;
	    }
	  }
	  var skipCtor = isLoose;
	  while (++index < objLength) {
	    key = objProps[index];
	    var objValue = object[key],
	        othValue = other[key],
	        result;

	    if (!(result === undefined ? equalFunc(objValue, othValue, isLoose, stackA, stackB) : result)) {
	      return false;
	    }
	    skipCtor || (skipCtor = key === 'constructor');
	  }
	  if (!skipCtor) {
	    var objCtor = object.constructor,
	        othCtor = other.constructor;

	    if (objCtor !== othCtor &&
	        ('constructor' in object && 'constructor' in other) &&
	        !(typeof objCtor === 'function' && objCtor instanceof objCtor &&
	          typeof othCtor === 'function' && othCtor instanceof othCtor)) {
	      return false;
	    }
	  }
	  return true;
	}

	function equalByTag(object, other, tag) {
	  switch (tag) {
	    case boolTag:
	    case dateTag:
	      return +object === +other;

	    case errorTag:
	      return object.name === other.name && object.message === other.message;

	    case numberTag:
	      return (object !== +object) ?
	        other !== +other :
	        object === +other;

	    case regexpTag:
	    case stringTag:
	      return object === (other + '');
	  }
	  return false;
	}

	var isObject = Rx.internals.isObject = function(value) {
	  var type = typeof value;
	  return !!value && (type === 'object' || type === 'function');
	};

	function isObjectLike(value) {
	  return !!value && typeof value === 'object';
	}

	function isLength(value) {
	  return typeof value === 'number' && value > -1 && value % 1 === 0 && value <= MAX_SAFE_INTEGER;
	}

	var isHostObject = (function() {
	  try {
	    Object({ 'toString': 0 } + '');
	  } catch(e) {
	    return function() { return false; };
	  }
	  return function(value) {
	    return typeof value.toString !== 'function' && typeof (value + '') === 'string';
	  };
	}());

	function isTypedArray(value) {
	  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objToString.call(value)];
	}

	var isArray = Array.isArray || function(value) {
	  return isObjectLike(value) && isLength(value.length) && objToString.call(value) === arrayTag;
	};

	function arraySome (array, predicate) {
	  var index = -1,
	      length = array.length;

	  while (++index < length) {
	    if (predicate(array[index], index, array)) {
	      return true;
	    }
	  }
	  return false;
	}

	function equalArrays(array, other, equalFunc, isLoose, stackA, stackB) {
	  var index = -1,
	      arrLength = array.length,
	      othLength = other.length;

	  if (arrLength !== othLength && !(isLoose && othLength > arrLength)) {
	    return false;
	  }
	  // Ignore non-index properties.
	  while (++index < arrLength) {
	    var arrValue = array[index],
	        othValue = other[index],
	        result;

	    if (result !== undefined) {
	      if (result) {
	        continue;
	      }
	      return false;
	    }
	    // Recursively compare arrays (susceptible to call stack limits).
	    if (isLoose) {
	      if (!arraySome(other, function(othValue) {
	            return arrValue === othValue || equalFunc(arrValue, othValue, isLoose, stackA, stackB);
	          })) {
	        return false;
	      }
	    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, isLoose, stackA, stackB))) {
	      return false;
	    }
	  }
	  return true;
	}

	function baseIsEqualDeep(object, other, equalFunc, isLoose, stackA, stackB) {
	  var objIsArr = isArray(object),
	      othIsArr = isArray(other),
	      objTag = arrayTag,
	      othTag = arrayTag;

	  if (!objIsArr) {
	    objTag = objToString.call(object);
	    if (objTag === argsTag) {
	      objTag = objectTag;
	    } else if (objTag !== objectTag) {
	      objIsArr = isTypedArray(object);
	    }
	  }
	  if (!othIsArr) {
	    othTag = objToString.call(other);
	    if (othTag === argsTag) {
	      othTag = objectTag;
	    }
	  }
	  var objIsObj = objTag === objectTag && !isHostObject(object),
	      othIsObj = othTag === objectTag && !isHostObject(other),
	      isSameTag = objTag === othTag;

	  if (isSameTag && !(objIsArr || objIsObj)) {
	    return equalByTag(object, other, objTag);
	  }
	  if (!isLoose) {
	    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
	        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

	    if (objIsWrapped || othIsWrapped) {
	      return equalFunc(objIsWrapped ? object.value() : object, othIsWrapped ? other.value() : other, isLoose, stackA, stackB);
	    }
	  }
	  if (!isSameTag) {
	    return false;
	  }
	  // Assume cyclic values are equal.
	  // For more information on detecting circular references see https://es5.github.io/#JO.
	  stackA || (stackA = []);
	  stackB || (stackB = []);

	  var length = stackA.length;
	  while (length--) {
	    if (stackA[length] === object) {
	      return stackB[length] === other;
	    }
	  }
	  // Add `object` and `other` to the stack of traversed objects.
	  stackA.push(object);
	  stackB.push(other);

	  var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, isLoose, stackA, stackB);

	  stackA.pop();
	  stackB.pop();

	  return result;
	}

	function baseIsEqual(value, other, isLoose, stackA, stackB) {
	  if (value === other) {
	    return true;
	  }
	  if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
	    return value !== value && other !== other;
	  }
	  return baseIsEqualDeep(value, other, baseIsEqual, isLoose, stackA, stackB);
	}

	var isEqual = Rx.internals.isEqual = function (value, other) {
	  return baseIsEqual(value, other);
	};

	  var hasProp = {}.hasOwnProperty,
	      slice = Array.prototype.slice;

	  var inherits = Rx.internals.inherits = function (child, parent) {
	    function __() { this.constructor = child; }
	    __.prototype = parent.prototype;
	    child.prototype = new __();
	  };

	  var addProperties = Rx.internals.addProperties = function (obj) {
	    for(var sources = [], i = 1, len = arguments.length; i < len; i++) { sources.push(arguments[i]); }
	    for (var idx = 0, ln = sources.length; idx < ln; idx++) {
	      var source = sources[idx];
	      for (var prop in source) {
	        obj[prop] = source[prop];
	      }
	    }
	  };

	  // Rx Utils
	  var addRef = Rx.internals.addRef = function (xs, r) {
	    return new AnonymousObservable(function (observer) {
	      return new BinaryDisposable(r.getDisposable(), xs.subscribe(observer));
	    });
	  };

	  function arrayInitialize(count, factory) {
	    var a = new Array(count);
	    for (var i = 0; i < count; i++) {
	      a[i] = factory();
	    }
	    return a;
	  }

	  function IndexedItem(id, value) {
	    this.id = id;
	    this.value = value;
	  }

	  IndexedItem.prototype.compareTo = function (other) {
	    var c = this.value.compareTo(other.value);
	    c === 0 && (c = this.id - other.id);
	    return c;
	  };

	  var PriorityQueue = Rx.internals.PriorityQueue = function (capacity) {
	    this.items = new Array(capacity);
	    this.length = 0;
	  };

	  var priorityProto = PriorityQueue.prototype;
	  priorityProto.isHigherPriority = function (left, right) {
	    return this.items[left].compareTo(this.items[right]) < 0;
	  };

	  priorityProto.percolate = function (index) {
	    if (index >= this.length || index < 0) { return; }
	    var parent = index - 1 >> 1;
	    if (parent < 0 || parent === index) { return; }
	    if (this.isHigherPriority(index, parent)) {
	      var temp = this.items[index];
	      this.items[index] = this.items[parent];
	      this.items[parent] = temp;
	      this.percolate(parent);
	    }
	  };

	  priorityProto.heapify = function (index) {
	    +index || (index = 0);
	    if (index >= this.length || index < 0) { return; }
	    var left = 2 * index + 1,
	        right = 2 * index + 2,
	        first = index;
	    if (left < this.length && this.isHigherPriority(left, first)) {
	      first = left;
	    }
	    if (right < this.length && this.isHigherPriority(right, first)) {
	      first = right;
	    }
	    if (first !== index) {
	      var temp = this.items[index];
	      this.items[index] = this.items[first];
	      this.items[first] = temp;
	      this.heapify(first);
	    }
	  };

	  priorityProto.peek = function () { return this.items[0].value; };

	  priorityProto.removeAt = function (index) {
	    this.items[index] = this.items[--this.length];
	    this.items[this.length] = undefined;
	    this.heapify();
	  };

	  priorityProto.dequeue = function () {
	    var result = this.peek();
	    this.removeAt(0);
	    return result;
	  };

	  priorityProto.enqueue = function (item) {
	    var index = this.length++;
	    this.items[index] = new IndexedItem(PriorityQueue.count++, item);
	    this.percolate(index);
	  };

	  priorityProto.remove = function (item) {
	    for (var i = 0; i < this.length; i++) {
	      if (this.items[i].value === item) {
	        this.removeAt(i);
	        return true;
	      }
	    }
	    return false;
	  };
	  PriorityQueue.count = 0;

	  /**
	   * Represents a group of disposable resources that are disposed together.
	   * @constructor
	   */
	  var CompositeDisposable = Rx.CompositeDisposable = function () {
	    var args = [], i, len;
	    if (Array.isArray(arguments[0])) {
	      args = arguments[0];
	    } else {
	      len = arguments.length;
	      args = new Array(len);
	      for(i = 0; i < len; i++) { args[i] = arguments[i]; }
	    }
	    this.disposables = args;
	    this.isDisposed = false;
	    this.length = args.length;
	  };

	  var CompositeDisposablePrototype = CompositeDisposable.prototype;

	  /**
	   * Adds a disposable to the CompositeDisposable or disposes the disposable if the CompositeDisposable is disposed.
	   * @param {Mixed} item Disposable to add.
	   */
	  CompositeDisposablePrototype.add = function (item) {
	    if (this.isDisposed) {
	      item.dispose();
	    } else {
	      this.disposables.push(item);
	      this.length++;
	    }
	  };

	  /**
	   * Removes and disposes the first occurrence of a disposable from the CompositeDisposable.
	   * @param {Mixed} item Disposable to remove.
	   * @returns {Boolean} true if found; false otherwise.
	   */
	  CompositeDisposablePrototype.remove = function (item) {
	    var shouldDispose = false;
	    if (!this.isDisposed) {
	      var idx = this.disposables.indexOf(item);
	      if (idx !== -1) {
	        shouldDispose = true;
	        this.disposables.splice(idx, 1);
	        this.length--;
	        item.dispose();
	      }
	    }
	    return shouldDispose;
	  };

	  /**
	   *  Disposes all disposables in the group and removes them from the group.
	   */
	  CompositeDisposablePrototype.dispose = function () {
	    if (!this.isDisposed) {
	      this.isDisposed = true;
	      var len = this.disposables.length, currentDisposables = new Array(len);
	      for(var i = 0; i < len; i++) { currentDisposables[i] = this.disposables[i]; }
	      this.disposables = [];
	      this.length = 0;

	      for (i = 0; i < len; i++) {
	        currentDisposables[i].dispose();
	      }
	    }
	  };

	  /**
	   * Provides a set of static methods for creating Disposables.
	   * @param {Function} dispose Action to run during the first call to dispose. The action is guaranteed to be run at most once.
	   */
	  var Disposable = Rx.Disposable = function (action) {
	    this.isDisposed = false;
	    this.action = action || noop;
	  };

	  /** Performs the task of cleaning up resources. */
	  Disposable.prototype.dispose = function () {
	    if (!this.isDisposed) {
	      this.action();
	      this.isDisposed = true;
	    }
	  };

	  /**
	   * Creates a disposable object that invokes the specified action when disposed.
	   * @param {Function} dispose Action to run during the first call to dispose. The action is guaranteed to be run at most once.
	   * @return {Disposable} The disposable object that runs the given action upon disposal.
	   */
	  var disposableCreate = Disposable.create = function (action) { return new Disposable(action); };

	  /**
	   * Gets the disposable that does nothing when disposed.
	   */
	  var disposableEmpty = Disposable.empty = { dispose: noop };

	  /**
	   * Validates whether the given object is a disposable
	   * @param {Object} Object to test whether it has a dispose method
	   * @returns {Boolean} true if a disposable object, else false.
	   */
	  var isDisposable = Disposable.isDisposable = function (d) {
	    return d && isFunction(d.dispose);
	  };

	  var checkDisposed = Disposable.checkDisposed = function (disposable) {
	    if (disposable.isDisposed) { throw new ObjectDisposedError(); }
	  };

	  var disposableFixup = Disposable._fixup = function (result) {
	    return isDisposable(result) ? result : disposableEmpty;
	  };

	  // Single assignment
	  var SingleAssignmentDisposable = Rx.SingleAssignmentDisposable = function () {
	    this.isDisposed = false;
	    this.current = null;
	  };
	  SingleAssignmentDisposable.prototype.getDisposable = function () {
	    return this.current;
	  };
	  SingleAssignmentDisposable.prototype.setDisposable = function (value) {
	    if (this.current) { throw new Error('Disposable has already been assigned'); }
	    var shouldDispose = this.isDisposed;
	    !shouldDispose && (this.current = value);
	    shouldDispose && value && value.dispose();
	  };
	  SingleAssignmentDisposable.prototype.dispose = function () {
	    if (!this.isDisposed) {
	      this.isDisposed = true;
	      var old = this.current;
	      this.current = null;
	      old && old.dispose();
	    }
	  };

	  // Multiple assignment disposable
	  var SerialDisposable = Rx.SerialDisposable = function () {
	    this.isDisposed = false;
	    this.current = null;
	  };
	  SerialDisposable.prototype.getDisposable = function () {
	    return this.current;
	  };
	  SerialDisposable.prototype.setDisposable = function (value) {
	    var shouldDispose = this.isDisposed;
	    if (!shouldDispose) {
	      var old = this.current;
	      this.current = value;
	    }
	    old && old.dispose();
	    shouldDispose && value && value.dispose();
	  };
	  SerialDisposable.prototype.dispose = function () {
	    if (!this.isDisposed) {
	      this.isDisposed = true;
	      var old = this.current;
	      this.current = null;
	    }
	    old && old.dispose();
	  };

	  var BinaryDisposable = Rx.BinaryDisposable = function (first, second) {
	    this._first = first;
	    this._second = second;
	    this.isDisposed = false;
	  };

	  BinaryDisposable.prototype.dispose = function () {
	    if (!this.isDisposed) {
	      this.isDisposed = true;
	      var old1 = this._first;
	      this._first = null;
	      old1 && old1.dispose();
	      var old2 = this._second;
	      this._second = null;
	      old2 && old2.dispose();
	    }
	  };

	  var NAryDisposable = Rx.NAryDisposable = function (disposables) {
	    this._disposables = disposables;
	    this.isDisposed = false;
	  };

	  NAryDisposable.prototype.dispose = function () {
	    if (!this.isDisposed) {
	      this.isDisposed = true;
	      for (var i = 0, len = this._disposables.length; i < len; i++) {
	        this._disposables[i].dispose();
	      }
	      this._disposables.length = 0;
	    }
	  };

	  /**
	   * Represents a disposable resource that only disposes its underlying disposable resource when all dependent disposable objects have been disposed.
	   */
	  var RefCountDisposable = Rx.RefCountDisposable = (function () {

	    function InnerDisposable(disposable) {
	      this.disposable = disposable;
	      this.disposable.count++;
	      this.isInnerDisposed = false;
	    }

	    InnerDisposable.prototype.dispose = function () {
	      if (!this.disposable.isDisposed && !this.isInnerDisposed) {
	        this.isInnerDisposed = true;
	        this.disposable.count--;
	        if (this.disposable.count === 0 && this.disposable.isPrimaryDisposed) {
	          this.disposable.isDisposed = true;
	          this.disposable.underlyingDisposable.dispose();
	        }
	      }
	    };

	    /**
	     * Initializes a new instance of the RefCountDisposable with the specified disposable.
	     * @constructor
	     * @param {Disposable} disposable Underlying disposable.
	      */
	    function RefCountDisposable(disposable) {
	      this.underlyingDisposable = disposable;
	      this.isDisposed = false;
	      this.isPrimaryDisposed = false;
	      this.count = 0;
	    }

	    /**
	     * Disposes the underlying disposable only when all dependent disposables have been disposed
	     */
	    RefCountDisposable.prototype.dispose = function () {
	      if (!this.isDisposed && !this.isPrimaryDisposed) {
	        this.isPrimaryDisposed = true;
	        if (this.count === 0) {
	          this.isDisposed = true;
	          this.underlyingDisposable.dispose();
	        }
	      }
	    };

	    /**
	     * Returns a dependent disposable that when disposed decreases the refcount on the underlying disposable.
	     * @returns {Disposable} A dependent disposable contributing to the reference count that manages the underlying disposable's lifetime.
	     */
	    RefCountDisposable.prototype.getDisposable = function () {
	      return this.isDisposed ? disposableEmpty : new InnerDisposable(this);
	    };

	    return RefCountDisposable;
	  })();

	  function ScheduledDisposable(scheduler, disposable) {
	    this.scheduler = scheduler;
	    this.disposable = disposable;
	    this.isDisposed = false;
	  }

	  function scheduleItem(s, self) {
	    if (!self.isDisposed) {
	      self.isDisposed = true;
	      self.disposable.dispose();
	    }
	  }

	  ScheduledDisposable.prototype.dispose = function () {
	    this.scheduler.schedule(this, scheduleItem);
	  };

	  var ScheduledItem = Rx.internals.ScheduledItem = function (scheduler, state, action, dueTime, comparer) {
	    this.scheduler = scheduler;
	    this.state = state;
	    this.action = action;
	    this.dueTime = dueTime;
	    this.comparer = comparer || defaultSubComparer;
	    this.disposable = new SingleAssignmentDisposable();
	  };

	  ScheduledItem.prototype.invoke = function () {
	    this.disposable.setDisposable(this.invokeCore());
	  };

	  ScheduledItem.prototype.compareTo = function (other) {
	    return this.comparer(this.dueTime, other.dueTime);
	  };

	  ScheduledItem.prototype.isCancelled = function () {
	    return this.disposable.isDisposed;
	  };

	  ScheduledItem.prototype.invokeCore = function () {
	    return disposableFixup(this.action(this.scheduler, this.state));
	  };

	  /** Provides a set of static properties to access commonly used schedulers. */
	  var Scheduler = Rx.Scheduler = (function () {

	    function Scheduler() { }

	    /** Determines whether the given object is a scheduler */
	    Scheduler.isScheduler = function (s) {
	      return s instanceof Scheduler;
	    };

	    var schedulerProto = Scheduler.prototype;

	    /**
	   * Schedules an action to be executed.
	   * @param state State passed to the action to be executed.
	   * @param {Function} action Action to be executed.
	   * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	   */
	    schedulerProto.schedule = function (state, action) {
	      throw new NotImplementedError();
	    };

	  /**
	   * Schedules an action to be executed after dueTime.
	   * @param state State passed to the action to be executed.
	   * @param {Function} action Action to be executed.
	   * @param {Number} dueTime Relative time after which to execute the action.
	   * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	   */
	    schedulerProto.scheduleFuture = function (state, dueTime, action) {
	      var dt = dueTime;
	      dt instanceof Date && (dt = dt - this.now());
	      dt = Scheduler.normalize(dt);

	      if (dt === 0) { return this.schedule(state, action); }

	      return this._scheduleFuture(state, dt, action);
	    };

	    schedulerProto._scheduleFuture = function (state, dueTime, action) {
	      throw new NotImplementedError();
	    };

	    /** Gets the current time according to the local machine's system clock. */
	    Scheduler.now = defaultNow;

	    /** Gets the current time according to the local machine's system clock. */
	    Scheduler.prototype.now = defaultNow;

	    /**
	     * Normalizes the specified TimeSpan value to a positive value.
	     * @param {Number} timeSpan The time span value to normalize.
	     * @returns {Number} The specified TimeSpan value if it is zero or positive; otherwise, 0
	     */
	    Scheduler.normalize = function (timeSpan) {
	      timeSpan < 0 && (timeSpan = 0);
	      return timeSpan;
	    };

	    return Scheduler;
	  }());

	  var normalizeTime = Scheduler.normalize, isScheduler = Scheduler.isScheduler;

	  (function (schedulerProto) {

	    function invokeRecImmediate(scheduler, pair) {
	      var state = pair[0], action = pair[1], group = new CompositeDisposable();
	      action(state, innerAction);
	      return group;

	      function innerAction(state2) {
	        var isAdded = false, isDone = false;

	        var d = scheduler.schedule(state2, scheduleWork);
	        if (!isDone) {
	          group.add(d);
	          isAdded = true;
	        }

	        function scheduleWork(_, state3) {
	          if (isAdded) {
	            group.remove(d);
	          } else {
	            isDone = true;
	          }
	          action(state3, innerAction);
	          return disposableEmpty;
	        }
	      }
	    }

	    function invokeRecDate(scheduler, pair) {
	      var state = pair[0], action = pair[1], group = new CompositeDisposable();
	      action(state, innerAction);
	      return group;

	      function innerAction(state2, dueTime1) {
	        var isAdded = false, isDone = false;

	        var d = scheduler.scheduleFuture(state2, dueTime1, scheduleWork);
	        if (!isDone) {
	          group.add(d);
	          isAdded = true;
	        }

	        function scheduleWork(_, state3) {
	          if (isAdded) {
	            group.remove(d);
	          } else {
	            isDone = true;
	          }
	          action(state3, innerAction);
	          return disposableEmpty;
	        }
	      }
	    }

	    /**
	     * Schedules an action to be executed recursively.
	     * @param {Mixed} state State passed to the action to be executed.
	     * @param {Function} action Action to execute recursively. The last parameter passed to the action is used to trigger recursive scheduling of the action, passing in recursive invocation state.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */
	    schedulerProto.scheduleRecursive = function (state, action) {
	      return this.schedule([state, action], invokeRecImmediate);
	    };

	    /**
	     * Schedules an action to be executed recursively after a specified relative or absolute due time.
	     * @param {Mixed} state State passed to the action to be executed.
	     * @param {Function} action Action to execute recursively. The last parameter passed to the action is used to trigger recursive scheduling of the action, passing in the recursive due time and invocation state.
	     * @param {Number | Date} dueTime Relative or absolute time after which to execute the action for the first time.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */
	    schedulerProto.scheduleRecursiveFuture = function (state, dueTime, action) {
	      return this.scheduleFuture([state, action], dueTime, invokeRecDate);
	    };

	  }(Scheduler.prototype));

	  (function (schedulerProto) {

	    /**
	     * Schedules a periodic piece of work by dynamically discovering the scheduler's capabilities. The periodic task will be scheduled using window.setInterval for the base implementation.
	     * @param {Mixed} state Initial state passed to the action upon the first iteration.
	     * @param {Number} period Period for running the work periodically.
	     * @param {Function} action Action to be executed, potentially updating the state.
	     * @returns {Disposable} The disposable object used to cancel the scheduled recurring action (best effort).
	     */
	    schedulerProto.schedulePeriodic = function(state, period, action) {
	      if (typeof root.setInterval === 'undefined') { throw new NotSupportedError(); }
	      period = normalizeTime(period);
	      var s = state, id = root.setInterval(function () { s = action(s); }, period);
	      return disposableCreate(function () { root.clearInterval(id); });
	    };

	  }(Scheduler.prototype));

	  (function (schedulerProto) {
	    /**
	     * Returns a scheduler that wraps the original scheduler, adding exception handling for scheduled actions.
	     * @param {Function} handler Handler that's run if an exception is caught. The exception will be rethrown if the handler returns false.
	     * @returns {Scheduler} Wrapper around the original scheduler, enforcing exception handling.
	     */
	    schedulerProto.catchError = schedulerProto['catch'] = function (handler) {
	      return new CatchScheduler(this, handler);
	    };
	  }(Scheduler.prototype));

	  var SchedulePeriodicRecursive = Rx.internals.SchedulePeriodicRecursive = (function () {
	    function createTick(self) {
	      return function tick(command, recurse) {
	        recurse(0, self._period);
	        var state = tryCatch(self._action)(self._state);
	        if (state === errorObj) {
	          self._cancel.dispose();
	          thrower(state.e);
	        }
	        self._state = state;
	      };
	    }

	    function SchedulePeriodicRecursive(scheduler, state, period, action) {
	      this._scheduler = scheduler;
	      this._state = state;
	      this._period = period;
	      this._action = action;
	    }

	    SchedulePeriodicRecursive.prototype.start = function () {
	      var d = new SingleAssignmentDisposable();
	      this._cancel = d;
	      d.setDisposable(this._scheduler.scheduleRecursiveFuture(0, this._period, createTick(this)));

	      return d;
	    };

	    return SchedulePeriodicRecursive;
	  }());

	  /** Gets a scheduler that schedules work immediately on the current thread. */
	   var ImmediateScheduler = (function (__super__) {
	    inherits(ImmediateScheduler, __super__);
	    function ImmediateScheduler() {
	      __super__.call(this);
	    }

	    ImmediateScheduler.prototype.schedule = function (state, action) {
	      return disposableFixup(action(this, state));
	    };

	    return ImmediateScheduler;
	  }(Scheduler));

	  var immediateScheduler = Scheduler.immediate = new ImmediateScheduler();

	  /**
	   * Gets a scheduler that schedules work as soon as possible on the current thread.
	   */
	  var CurrentThreadScheduler = (function (__super__) {
	    var queue;

	    function runTrampoline () {
	      while (queue.length > 0) {
	        var item = queue.dequeue();
	        !item.isCancelled() && item.invoke();
	      }
	    }

	    inherits(CurrentThreadScheduler, __super__);
	    function CurrentThreadScheduler() {
	      __super__.call(this);
	    }

	    CurrentThreadScheduler.prototype.schedule = function (state, action) {
	      var si = new ScheduledItem(this, state, action, this.now());

	      if (!queue) {
	        queue = new PriorityQueue(4);
	        queue.enqueue(si);

	        var result = tryCatch(runTrampoline)();
	        queue = null;
	        if (result === errorObj) { thrower(result.e); }
	      } else {
	        queue.enqueue(si);
	      }
	      return si.disposable;
	    };

	    CurrentThreadScheduler.prototype.scheduleRequired = function () { return !queue; };

	    return CurrentThreadScheduler;
	  }(Scheduler));

	  var currentThreadScheduler = Scheduler.currentThread = new CurrentThreadScheduler();

	  var scheduleMethod, clearMethod;

	  var localTimer = (function () {
	    var localSetTimeout, localClearTimeout = noop;
	    if (!!root.setTimeout) {
	      localSetTimeout = root.setTimeout;
	      localClearTimeout = root.clearTimeout;
	    } else if (!!root.WScript) {
	      localSetTimeout = function (fn, time) {
	        root.WScript.Sleep(time);
	        fn();
	      };
	    } else {
	      throw new NotSupportedError();
	    }

	    return {
	      setTimeout: localSetTimeout,
	      clearTimeout: localClearTimeout
	    };
	  }());
	  var localSetTimeout = localTimer.setTimeout,
	    localClearTimeout = localTimer.clearTimeout;

	  (function () {

	    var nextHandle = 1, tasksByHandle = {}, currentlyRunning = false;

	    clearMethod = function (handle) {
	      delete tasksByHandle[handle];
	    };

	    function runTask(handle) {
	      if (currentlyRunning) {
	        localSetTimeout(function () { runTask(handle); }, 0);
	      } else {
	        var task = tasksByHandle[handle];
	        if (task) {
	          currentlyRunning = true;
	          var result = tryCatch(task)();
	          clearMethod(handle);
	          currentlyRunning = false;
	          if (result === errorObj) { thrower(result.e); }
	        }
	      }
	    }

	    var reNative = new RegExp('^' +
	      String(toString)
	        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	        .replace(/toString| for [^\]]+/g, '.*?') + '$'
	    );

	    var setImmediate = typeof (setImmediate = freeGlobal && moduleExports && freeGlobal.setImmediate) == 'function' &&
	      !reNative.test(setImmediate) && setImmediate;

	    function postMessageSupported () {
	      // Ensure not in a worker
	      if (!root.postMessage || root.importScripts) { return false; }
	      var isAsync = false, oldHandler = root.onmessage;
	      // Test for async
	      root.onmessage = function () { isAsync = true; };
	      root.postMessage('', '*');
	      root.onmessage = oldHandler;

	      return isAsync;
	    }

	    // Use in order, setImmediate, nextTick, postMessage, MessageChannel, script readystatechanged, setTimeout
	    if (isFunction(setImmediate)) {
	      scheduleMethod = function (action) {
	        var id = nextHandle++;
	        tasksByHandle[id] = action;
	        setImmediate(function () { runTask(id); });

	        return id;
	      };
	    } else if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
	      scheduleMethod = function (action) {
	        var id = nextHandle++;
	        tasksByHandle[id] = action;
	        process.nextTick(function () { runTask(id); });

	        return id;
	      };
	    } else if (postMessageSupported()) {
	      var MSG_PREFIX = 'ms.rx.schedule' + Math.random();

	      var onGlobalPostMessage = function (event) {
	        // Only if we're a match to avoid any other global events
	        if (typeof event.data === 'string' && event.data.substring(0, MSG_PREFIX.length) === MSG_PREFIX) {
	          runTask(event.data.substring(MSG_PREFIX.length));
	        }
	      };

	      root.addEventListener('message', onGlobalPostMessage, false);

	      scheduleMethod = function (action) {
	        var id = nextHandle++;
	        tasksByHandle[id] = action;
	        root.postMessage(MSG_PREFIX + id, '*');
	        return id;
	      };
	    } else if (!!root.MessageChannel) {
	      var channel = new root.MessageChannel();

	      channel.port1.onmessage = function (e) { runTask(e.data); };

	      scheduleMethod = function (action) {
	        var id = nextHandle++;
	        tasksByHandle[id] = action;
	        channel.port2.postMessage(id);
	        return id;
	      };
	    } else if ('document' in root && 'onreadystatechange' in root.document.createElement('script')) {

	      scheduleMethod = function (action) {
	        var scriptElement = root.document.createElement('script');
	        var id = nextHandle++;
	        tasksByHandle[id] = action;

	        scriptElement.onreadystatechange = function () {
	          runTask(id);
	          scriptElement.onreadystatechange = null;
	          scriptElement.parentNode.removeChild(scriptElement);
	          scriptElement = null;
	        };
	        root.document.documentElement.appendChild(scriptElement);
	        return id;
	      };

	    } else {
	      scheduleMethod = function (action) {
	        var id = nextHandle++;
	        tasksByHandle[id] = action;
	        localSetTimeout(function () {
	          runTask(id);
	        }, 0);

	        return id;
	      };
	    }
	  }());

	  /**
	   * Gets a scheduler that schedules work via a timed callback based upon platform.
	   */
	   var DefaultScheduler = (function (__super__) {
	     inherits(DefaultScheduler, __super__);
	     function DefaultScheduler() {
	       __super__.call(this);
	     }

	     function scheduleAction(disposable, action, scheduler, state) {
	       return function schedule() {
	         disposable.setDisposable(Disposable._fixup(action(scheduler, state)));
	       };
	     }

	     function ClearDisposable(id) {
	       this._id = id;
	       this.isDisposed = false;
	     }

	     ClearDisposable.prototype.dispose = function () {
	       if (!this.isDisposed) {
	         this.isDisposed = true;
	         clearMethod(this._id);
	       }
	     };

	     function LocalClearDisposable(id) {
	       this._id = id;
	       this.isDisposed = false;
	     }

	     LocalClearDisposable.prototype.dispose = function () {
	       if (!this.isDisposed) {
	         this.isDisposed = true;
	         localClearTimeout(this._id);
	       }
	     };

	    DefaultScheduler.prototype.schedule = function (state, action) {
	      var disposable = new SingleAssignmentDisposable(),
	          id = scheduleMethod(scheduleAction(disposable, action, this, state));
	      return new BinaryDisposable(disposable, new ClearDisposable(id));
	    };

	    DefaultScheduler.prototype._scheduleFuture = function (state, dueTime, action) {
	      if (dueTime === 0) { return this.schedule(state, action); }
	      var disposable = new SingleAssignmentDisposable(),
	          id = localSetTimeout(scheduleAction(disposable, action, this, state), dueTime);
	      return new BinaryDisposable(disposable, new LocalClearDisposable(id));
	    };

	    function scheduleLongRunning(state, action, disposable) {
	      return function () { action(state, disposable); };
	    }

	    DefaultScheduler.prototype.scheduleLongRunning = function (state, action) {
	      var disposable = disposableCreate(noop);
	      scheduleMethod(scheduleLongRunning(state, action, disposable));
	      return disposable;
	    };

	    return DefaultScheduler;
	  }(Scheduler));

	  var defaultScheduler = Scheduler['default'] = Scheduler.async = new DefaultScheduler();

	  var CatchScheduler = (function (__super__) {
	    inherits(CatchScheduler, __super__);

	    function CatchScheduler(scheduler, handler) {
	      this._scheduler = scheduler;
	      this._handler = handler;
	      this._recursiveOriginal = null;
	      this._recursiveWrapper = null;
	      __super__.call(this);
	    }

	    CatchScheduler.prototype.schedule = function (state, action) {
	      return this._scheduler.schedule(state, this._wrap(action));
	    };

	    CatchScheduler.prototype._scheduleFuture = function (state, dueTime, action) {
	      return this._scheduler.schedule(state, dueTime, this._wrap(action));
	    };

	    CatchScheduler.prototype.now = function () { return this._scheduler.now(); };

	    CatchScheduler.prototype._clone = function (scheduler) {
	        return new CatchScheduler(scheduler, this._handler);
	    };

	    CatchScheduler.prototype._wrap = function (action) {
	      var parent = this;
	      return function (self, state) {
	        var res = tryCatch(action)(parent._getRecursiveWrapper(self), state);
	        if (res === errorObj) {
	          if (!parent._handler(res.e)) { thrower(res.e); }
	          return disposableEmpty;
	        }
	        return disposableFixup(res);
	      };
	    };

	    CatchScheduler.prototype._getRecursiveWrapper = function (scheduler) {
	      if (this._recursiveOriginal !== scheduler) {
	        this._recursiveOriginal = scheduler;
	        var wrapper = this._clone(scheduler);
	        wrapper._recursiveOriginal = scheduler;
	        wrapper._recursiveWrapper = wrapper;
	        this._recursiveWrapper = wrapper;
	      }
	      return this._recursiveWrapper;
	    };

	    CatchScheduler.prototype.schedulePeriodic = function (state, period, action) {
	      var self = this, failed = false, d = new SingleAssignmentDisposable();

	      d.setDisposable(this._scheduler.schedulePeriodic(state, period, function (state1) {
	        if (failed) { return null; }
	        var res = tryCatch(action)(state1);
	        if (res === errorObj) {
	          failed = true;
	          if (!self._handler(res.e)) { thrower(res.e); }
	          d.dispose();
	          return null;
	        }
	        return res;
	      }));

	      return d;
	    };

	    return CatchScheduler;
	  }(Scheduler));

	  /**
	   *  Represents a notification to an observer.
	   */
	  var Notification = Rx.Notification = (function () {
	    function Notification() {

	    }

	    Notification.prototype._accept = function (onNext, onError, onCompleted) {
	      throw new NotImplementedError();
	    };

	    Notification.prototype._acceptObserver = function (onNext, onError, onCompleted) {
	      throw new NotImplementedError();
	    };

	    /**
	     * Invokes the delegate corresponding to the notification or the observer's method corresponding to the notification and returns the produced result.
	     * @param {Function | Observer} observerOrOnNext Function to invoke for an OnNext notification or Observer to invoke the notification on..
	     * @param {Function} onError Function to invoke for an OnError notification.
	     * @param {Function} onCompleted Function to invoke for an OnCompleted notification.
	     * @returns {Any} Result produced by the observation.
	     */
	    Notification.prototype.accept = function (observerOrOnNext, onError, onCompleted) {
	      return observerOrOnNext && typeof observerOrOnNext === 'object' ?
	        this._acceptObserver(observerOrOnNext) :
	        this._accept(observerOrOnNext, onError, onCompleted);
	    };

	    /**
	     * Returns an observable sequence with a single notification.
	     *
	     * @memberOf Notifications
	     * @param {Scheduler} [scheduler] Scheduler to send out the notification calls on.
	     * @returns {Observable} The observable sequence that surfaces the behavior of the notification upon subscription.
	     */
	    Notification.prototype.toObservable = function (scheduler) {
	      var self = this;
	      isScheduler(scheduler) || (scheduler = immediateScheduler);
	      return new AnonymousObservable(function (o) {
	        return scheduler.schedule(self, function (_, notification) {
	          notification._acceptObserver(o);
	          notification.kind === 'N' && o.onCompleted();
	        });
	      });
	    };

	    return Notification;
	  })();

	  var OnNextNotification = (function (__super__) {
	    inherits(OnNextNotification, __super__);
	    function OnNextNotification(value) {
	      this.value = value;
	      this.kind = 'N';
	    }

	    OnNextNotification.prototype._accept = function (onNext) {
	      return onNext(this.value);
	    };

	    OnNextNotification.prototype._acceptObserver = function (o) {
	      return o.onNext(this.value);
	    };

	    OnNextNotification.prototype.toString = function () {
	      return 'OnNext(' + this.value + ')';
	    };

	    return OnNextNotification;
	  }(Notification));

	  var OnErrorNotification = (function (__super__) {
	    inherits(OnErrorNotification, __super__);
	    function OnErrorNotification(error) {
	      this.error = error;
	      this.kind = 'E';
	    }

	    OnErrorNotification.prototype._accept = function (onNext, onError) {
	      return onError(this.error);
	    };

	    OnErrorNotification.prototype._acceptObserver = function (o) {
	      return o.onError(this.error);
	    };

	    OnErrorNotification.prototype.toString = function () {
	      return 'OnError(' + this.error + ')';
	    };

	    return OnErrorNotification;
	  }(Notification));

	  var OnCompletedNotification = (function (__super__) {
	    inherits(OnCompletedNotification, __super__);
	    function OnCompletedNotification() {
	      this.kind = 'C';
	    }

	    OnCompletedNotification.prototype._accept = function (onNext, onError, onCompleted) {
	      return onCompleted();
	    };

	    OnCompletedNotification.prototype._acceptObserver = function (o) {
	      return o.onCompleted();
	    };

	    OnCompletedNotification.prototype.toString = function () {
	      return 'OnCompleted()';
	    };

	    return OnCompletedNotification;
	  }(Notification));

	  /**
	   * Creates an object that represents an OnNext notification to an observer.
	   * @param {Any} value The value contained in the notification.
	   * @returns {Notification} The OnNext notification containing the value.
	   */
	  var notificationCreateOnNext = Notification.createOnNext = function (value) {
	    return new OnNextNotification(value);
	  };

	  /**
	   * Creates an object that represents an OnError notification to an observer.
	   * @param {Any} error The exception contained in the notification.
	   * @returns {Notification} The OnError notification containing the exception.
	   */
	  var notificationCreateOnError = Notification.createOnError = function (error) {
	    return new OnErrorNotification(error);
	  };

	  /**
	   * Creates an object that represents an OnCompleted notification to an observer.
	   * @returns {Notification} The OnCompleted notification.
	   */
	  var notificationCreateOnCompleted = Notification.createOnCompleted = function () {
	    return new OnCompletedNotification();
	  };

	  /**
	   * Supports push-style iteration over an observable sequence.
	   */
	  var Observer = Rx.Observer = function () { };

	  /**
	   *  Creates a notification callback from an observer.
	   * @returns The action that forwards its input notification to the underlying observer.
	   */
	  Observer.prototype.toNotifier = function () {
	    var observer = this;
	    return function (n) { return n.accept(observer); };
	  };

	  /**
	   *  Hides the identity of an observer.
	   * @returns An observer that hides the identity of the specified observer.
	   */
	  Observer.prototype.asObserver = function () {
	    var self = this;
	    return new AnonymousObserver(
	      function (x) { self.onNext(x); },
	      function (err) { self.onError(err); },
	      function () { self.onCompleted(); });
	  };

	  /**
	   *  Checks access to the observer for grammar violations. This includes checking for multiple OnError or OnCompleted calls, as well as reentrancy in any of the observer methods.
	   *  If a violation is detected, an Error is thrown from the offending observer method call.
	   * @returns An observer that checks callbacks invocations against the observer grammar and, if the checks pass, forwards those to the specified observer.
	   */
	  Observer.prototype.checked = function () { return new CheckedObserver(this); };

	  /**
	   *  Creates an observer from the specified OnNext, along with optional OnError, and OnCompleted actions.
	   * @param {Function} [onNext] Observer's OnNext action implementation.
	   * @param {Function} [onError] Observer's OnError action implementation.
	   * @param {Function} [onCompleted] Observer's OnCompleted action implementation.
	   * @returns {Observer} The observer object implemented using the given actions.
	   */
	  var observerCreate = Observer.create = function (onNext, onError, onCompleted) {
	    onNext || (onNext = noop);
	    onError || (onError = defaultError);
	    onCompleted || (onCompleted = noop);
	    return new AnonymousObserver(onNext, onError, onCompleted);
	  };

	  /**
	   *  Creates an observer from a notification callback.
	   * @param {Function} handler Action that handles a notification.
	   * @returns The observer object that invokes the specified handler using a notification corresponding to each message it receives.
	   */
	  Observer.fromNotifier = function (handler, thisArg) {
	    var cb = bindCallback(handler, thisArg, 1);
	    return new AnonymousObserver(function (x) {
	      return cb(notificationCreateOnNext(x));
	    }, function (e) {
	      return cb(notificationCreateOnError(e));
	    }, function () {
	      return cb(notificationCreateOnCompleted());
	    });
	  };

	  /**
	   * Schedules the invocation of observer methods on the given scheduler.
	   * @param {Scheduler} scheduler Scheduler to schedule observer messages on.
	   * @returns {Observer} Observer whose messages are scheduled on the given scheduler.
	   */
	  Observer.prototype.notifyOn = function (scheduler) {
	    return new ObserveOnObserver(scheduler, this);
	  };

	  Observer.prototype.makeSafe = function(disposable) {
	    return new AnonymousSafeObserver(this._onNext, this._onError, this._onCompleted, disposable);
	  };

	  /**
	   * Abstract base class for implementations of the Observer class.
	   * This base class enforces the grammar of observers where OnError and OnCompleted are terminal messages.
	   */
	  var AbstractObserver = Rx.internals.AbstractObserver = (function (__super__) {
	    inherits(AbstractObserver, __super__);

	    /**
	     * Creates a new observer in a non-stopped state.
	     */
	    function AbstractObserver() {
	      this.isStopped = false;
	    }

	    // Must be implemented by other observers
	    AbstractObserver.prototype.next = notImplemented;
	    AbstractObserver.prototype.error = notImplemented;
	    AbstractObserver.prototype.completed = notImplemented;

	    /**
	     * Notifies the observer of a new element in the sequence.
	     * @param {Any} value Next element in the sequence.
	     */
	    AbstractObserver.prototype.onNext = function (value) {
	      !this.isStopped && this.next(value);
	    };

	    /**
	     * Notifies the observer that an exception has occurred.
	     * @param {Any} error The error that has occurred.
	     */
	    AbstractObserver.prototype.onError = function (error) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.error(error);
	      }
	    };

	    /**
	     * Notifies the observer of the end of the sequence.
	     */
	    AbstractObserver.prototype.onCompleted = function () {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.completed();
	      }
	    };

	    /**
	     * Disposes the observer, causing it to transition to the stopped state.
	     */
	    AbstractObserver.prototype.dispose = function () { this.isStopped = true; };

	    AbstractObserver.prototype.fail = function (e) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.error(e);
	        return true;
	      }

	      return false;
	    };

	    return AbstractObserver;
	  }(Observer));

	  /**
	   * Class to create an Observer instance from delegate-based implementations of the on* methods.
	   */
	  var AnonymousObserver = Rx.AnonymousObserver = (function (__super__) {
	    inherits(AnonymousObserver, __super__);

	    /**
	     * Creates an observer from the specified OnNext, OnError, and OnCompleted actions.
	     * @param {Any} onNext Observer's OnNext action implementation.
	     * @param {Any} onError Observer's OnError action implementation.
	     * @param {Any} onCompleted Observer's OnCompleted action implementation.
	     */
	    function AnonymousObserver(onNext, onError, onCompleted) {
	      __super__.call(this);
	      this._onNext = onNext;
	      this._onError = onError;
	      this._onCompleted = onCompleted;
	    }

	    /**
	     * Calls the onNext action.
	     * @param {Any} value Next element in the sequence.
	     */
	    AnonymousObserver.prototype.next = function (value) {
	      this._onNext(value);
	    };

	    /**
	     * Calls the onError action.
	     * @param {Any} error The error that has occurred.
	     */
	    AnonymousObserver.prototype.error = function (error) {
	      this._onError(error);
	    };

	    /**
	     *  Calls the onCompleted action.
	     */
	    AnonymousObserver.prototype.completed = function () {
	      this._onCompleted();
	    };

	    return AnonymousObserver;
	  }(AbstractObserver));

	  var CheckedObserver = (function (__super__) {
	    inherits(CheckedObserver, __super__);

	    function CheckedObserver(observer) {
	      __super__.call(this);
	      this._observer = observer;
	      this._state = 0; // 0 - idle, 1 - busy, 2 - done
	    }

	    var CheckedObserverPrototype = CheckedObserver.prototype;

	    CheckedObserverPrototype.onNext = function (value) {
	      this.checkAccess();
	      var res = tryCatch(this._observer.onNext).call(this._observer, value);
	      this._state = 0;
	      res === errorObj && thrower(res.e);
	    };

	    CheckedObserverPrototype.onError = function (err) {
	      this.checkAccess();
	      var res = tryCatch(this._observer.onError).call(this._observer, err);
	      this._state = 2;
	      res === errorObj && thrower(res.e);
	    };

	    CheckedObserverPrototype.onCompleted = function () {
	      this.checkAccess();
	      var res = tryCatch(this._observer.onCompleted).call(this._observer);
	      this._state = 2;
	      res === errorObj && thrower(res.e);
	    };

	    CheckedObserverPrototype.checkAccess = function () {
	      if (this._state === 1) { throw new Error('Re-entrancy detected'); }
	      if (this._state === 2) { throw new Error('Observer completed'); }
	      if (this._state === 0) { this._state = 1; }
	    };

	    return CheckedObserver;
	  }(Observer));

	  var ScheduledObserver = Rx.internals.ScheduledObserver = (function (__super__) {
	    inherits(ScheduledObserver, __super__);

	    function ScheduledObserver(scheduler, observer) {
	      __super__.call(this);
	      this.scheduler = scheduler;
	      this.observer = observer;
	      this.isAcquired = false;
	      this.hasFaulted = false;
	      this.queue = [];
	      this.disposable = new SerialDisposable();
	    }

	    function enqueueNext(observer, x) { return function () { observer.onNext(x); }; }
	    function enqueueError(observer, e) { return function () { observer.onError(e); }; }
	    function enqueueCompleted(observer) { return function () { observer.onCompleted(); }; }

	    ScheduledObserver.prototype.next = function (x) {
	      this.queue.push(enqueueNext(this.observer, x));
	    };

	    ScheduledObserver.prototype.error = function (e) {
	      this.queue.push(enqueueError(this.observer, e));
	    };

	    ScheduledObserver.prototype.completed = function () {
	      this.queue.push(enqueueCompleted(this.observer));
	    };


	    function scheduleMethod(state, recurse) {
	      var work;
	      if (state.queue.length > 0) {
	        work = state.queue.shift();
	      } else {
	        state.isAcquired = false;
	        return;
	      }
	      var res = tryCatch(work)();
	      if (res === errorObj) {
	        state.queue = [];
	        state.hasFaulted = true;
	        return thrower(res.e);
	      }
	      recurse(state);
	    }

	    ScheduledObserver.prototype.ensureActive = function () {
	      var isOwner = false;
	      if (!this.hasFaulted && this.queue.length > 0) {
	        isOwner = !this.isAcquired;
	        this.isAcquired = true;
	      }
	      isOwner &&
	        this.disposable.setDisposable(this.scheduler.scheduleRecursive(this, scheduleMethod));
	    };

	    ScheduledObserver.prototype.dispose = function () {
	      __super__.prototype.dispose.call(this);
	      this.disposable.dispose();
	    };

	    return ScheduledObserver;
	  }(AbstractObserver));

	  var ObserveOnObserver = (function (__super__) {
	    inherits(ObserveOnObserver, __super__);

	    function ObserveOnObserver(scheduler, observer, cancel) {
	      __super__.call(this, scheduler, observer);
	      this._cancel = cancel;
	    }

	    ObserveOnObserver.prototype.next = function (value) {
	      __super__.prototype.next.call(this, value);
	      this.ensureActive();
	    };

	    ObserveOnObserver.prototype.error = function (e) {
	      __super__.prototype.error.call(this, e);
	      this.ensureActive();
	    };

	    ObserveOnObserver.prototype.completed = function () {
	      __super__.prototype.completed.call(this);
	      this.ensureActive();
	    };

	    ObserveOnObserver.prototype.dispose = function () {
	      __super__.prototype.dispose.call(this);
	      this._cancel && this._cancel.dispose();
	      this._cancel = null;
	    };

	    return ObserveOnObserver;
	  })(ScheduledObserver);

	  var observableProto;

	  /**
	   * Represents a push-style collection.
	   */
	  var Observable = Rx.Observable = (function () {

	    function makeSubscribe(self, subscribe) {
	      return function (o) {
	        var oldOnError = o.onError;
	        o.onError = function (e) {
	          makeStackTraceLong(e, self);
	          oldOnError.call(o, e);
	        };

	        return subscribe.call(self, o);
	      };
	    }

	    function Observable() {
	      if (Rx.config.longStackSupport && hasStacks) {
	        var oldSubscribe = this._subscribe;
	        var e = tryCatch(thrower)(new Error()).e;
	        this.stack = e.stack.substring(e.stack.indexOf('\n') + 1);
	        this._subscribe = makeSubscribe(this, oldSubscribe);
	      }
	    }

	    observableProto = Observable.prototype;

	    /**
	    * Determines whether the given object is an Observable
	    * @param {Any} An object to determine whether it is an Observable
	    * @returns {Boolean} true if an Observable, else false.
	    */
	    Observable.isObservable = function (o) {
	      return o && isFunction(o.subscribe);
	    };

	    /**
	     *  Subscribes an o to the observable sequence.
	     *  @param {Mixed} [oOrOnNext] The object that is to receive notifications or an action to invoke for each element in the observable sequence.
	     *  @param {Function} [onError] Action to invoke upon exceptional termination of the observable sequence.
	     *  @param {Function} [onCompleted] Action to invoke upon graceful termination of the observable sequence.
	     *  @returns {Diposable} A disposable handling the subscriptions and unsubscriptions.
	     */
	    observableProto.subscribe = observableProto.forEach = function (oOrOnNext, onError, onCompleted) {
	      return this._subscribe(typeof oOrOnNext === 'object' ?
	        oOrOnNext :
	        observerCreate(oOrOnNext, onError, onCompleted));
	    };

	    /**
	     * Subscribes to the next value in the sequence with an optional "this" argument.
	     * @param {Function} onNext The function to invoke on each element in the observable sequence.
	     * @param {Any} [thisArg] Object to use as this when executing callback.
	     * @returns {Disposable} A disposable handling the subscriptions and unsubscriptions.
	     */
	    observableProto.subscribeOnNext = function (onNext, thisArg) {
	      return this._subscribe(observerCreate(typeof thisArg !== 'undefined' ? function(x) { onNext.call(thisArg, x); } : onNext));
	    };

	    /**
	     * Subscribes to an exceptional condition in the sequence with an optional "this" argument.
	     * @param {Function} onError The function to invoke upon exceptional termination of the observable sequence.
	     * @param {Any} [thisArg] Object to use as this when executing callback.
	     * @returns {Disposable} A disposable handling the subscriptions and unsubscriptions.
	     */
	    observableProto.subscribeOnError = function (onError, thisArg) {
	      return this._subscribe(observerCreate(null, typeof thisArg !== 'undefined' ? function(e) { onError.call(thisArg, e); } : onError));
	    };

	    /**
	     * Subscribes to the next value in the sequence with an optional "this" argument.
	     * @param {Function} onCompleted The function to invoke upon graceful termination of the observable sequence.
	     * @param {Any} [thisArg] Object to use as this when executing callback.
	     * @returns {Disposable} A disposable handling the subscriptions and unsubscriptions.
	     */
	    observableProto.subscribeOnCompleted = function (onCompleted, thisArg) {
	      return this._subscribe(observerCreate(null, null, typeof thisArg !== 'undefined' ? function() { onCompleted.call(thisArg); } : onCompleted));
	    };

	    return Observable;
	  })();

	  var ObservableBase = Rx.ObservableBase = (function (__super__) {
	    inherits(ObservableBase, __super__);

	    function fixSubscriber(subscriber) {
	      return subscriber && isFunction(subscriber.dispose) ? subscriber :
	        isFunction(subscriber) ? disposableCreate(subscriber) : disposableEmpty;
	    }

	    function setDisposable(s, state) {
	      var ado = state[0], self = state[1];
	      var sub = tryCatch(self.subscribeCore).call(self, ado);
	      if (sub === errorObj && !ado.fail(errorObj.e)) { thrower(errorObj.e); }
	      ado.setDisposable(fixSubscriber(sub));
	    }

	    function ObservableBase() {
	      __super__.call(this);
	    }

	    ObservableBase.prototype._subscribe = function (o) {
	      var ado = new AutoDetachObserver(o), state = [ado, this];

	      if (currentThreadScheduler.scheduleRequired()) {
	        currentThreadScheduler.schedule(state, setDisposable);
	      } else {
	        setDisposable(null, state);
	      }
	      return ado;
	    };

	    ObservableBase.prototype.subscribeCore = notImplemented;

	    return ObservableBase;
	  }(Observable));

	var FlatMapObservable = Rx.FlatMapObservable = (function(__super__) {

	    inherits(FlatMapObservable, __super__);

	    function FlatMapObservable(source, selector, resultSelector, thisArg) {
	      this.resultSelector = isFunction(resultSelector) ? resultSelector : null;
	      this.selector = bindCallback(isFunction(selector) ? selector : function() { return selector; }, thisArg, 3);
	      this.source = source;
	      __super__.call(this);
	    }

	    FlatMapObservable.prototype.subscribeCore = function(o) {
	      return this.source.subscribe(new InnerObserver(o, this.selector, this.resultSelector, this));
	    };

	    inherits(InnerObserver, AbstractObserver);
	    function InnerObserver(observer, selector, resultSelector, source) {
	      this.i = 0;
	      this.selector = selector;
	      this.resultSelector = resultSelector;
	      this.source = source;
	      this.o = observer;
	      AbstractObserver.call(this);
	    }

	    InnerObserver.prototype._wrapResult = function(result, x, i) {
	      return this.resultSelector ?
	        result.map(function(y, i2) { return this.resultSelector(x, y, i, i2); }, this) :
	        result;
	    };

	    InnerObserver.prototype.next = function(x) {
	      var i = this.i++;
	      var result = tryCatch(this.selector)(x, i, this.source);
	      if (result === errorObj) { return this.o.onError(result.e); }

	      isPromise(result) && (result = observableFromPromise(result));
	      (isArrayLike(result) || isIterable(result)) && (result = Observable.from(result));
	      this.o.onNext(this._wrapResult(result, x, i));
	    };

	    InnerObserver.prototype.error = function(e) { this.o.onError(e); };

	    InnerObserver.prototype.completed = function() { this.o.onCompleted(); };

	    return FlatMapObservable;

	}(ObservableBase));

	  var Enumerable = Rx.internals.Enumerable = function () { };

	  function IsDisposedDisposable(state) {
	    this._s = state;
	    this.isDisposed = false;
	  }

	  IsDisposedDisposable.prototype.dispose = function () {
	    if (!this.isDisposed) {
	      this.isDisposed = true;
	      this._s.isDisposed = true;
	    }
	  };

	  var ConcatEnumerableObservable = (function(__super__) {
	    inherits(ConcatEnumerableObservable, __super__);
	    function ConcatEnumerableObservable(sources) {
	      this.sources = sources;
	      __super__.call(this);
	    }

	    function scheduleMethod(state, recurse) {
	      if (state.isDisposed) { return; }
	      var currentItem = tryCatch(state.e.next).call(state.e);
	      if (currentItem === errorObj) { return state.o.onError(currentItem.e); }
	      if (currentItem.done) { return state.o.onCompleted(); }

	      // Check if promise
	      var currentValue = currentItem.value;
	      isPromise(currentValue) && (currentValue = observableFromPromise(currentValue));

	      var d = new SingleAssignmentDisposable();
	      state.subscription.setDisposable(d);
	      d.setDisposable(currentValue.subscribe(new InnerObserver(state, recurse)));
	    }

	    ConcatEnumerableObservable.prototype.subscribeCore = function (o) {
	      var subscription = new SerialDisposable();
	      var state = {
	        isDisposed: false,
	        o: o,
	        subscription: subscription,
	        e: this.sources[$iterator$]()
	      };

	      var cancelable = currentThreadScheduler.scheduleRecursive(state, scheduleMethod);
	      return new NAryDisposable([subscription, cancelable, new IsDisposedDisposable(state)]);
	    };

	    function InnerObserver(state, recurse) {
	      this._state = state;
	      this._recurse = recurse;
	      AbstractObserver.call(this);
	    }

	    inherits(InnerObserver, AbstractObserver);

	    InnerObserver.prototype.next = function (x) { this._state.o.onNext(x); };
	    InnerObserver.prototype.error = function (e) { this._state.o.onError(e); };
	    InnerObserver.prototype.completed = function () { this._recurse(this._state); };

	    return ConcatEnumerableObservable;
	  }(ObservableBase));

	  Enumerable.prototype.concat = function () {
	    return new ConcatEnumerableObservable(this);
	  };

	  var CatchErrorObservable = (function(__super__) {
	    function CatchErrorObservable(sources) {
	      this.sources = sources;
	      __super__.call(this);
	    }

	    inherits(CatchErrorObservable, __super__);

	    function scheduleMethod(state, recurse) {
	      if (state.isDisposed) { return; }
	      var currentItem = tryCatch(state.e.next).call(state.e);
	      if (currentItem === errorObj) { return state.o.onError(currentItem.e); }
	      if (currentItem.done) { return state.lastError !== null ? state.o.onError(state.lastError) : state.o.onCompleted(); }

	      var currentValue = currentItem.value;
	      isPromise(currentValue) && (currentValue = observableFromPromise(currentValue));

	      var d = new SingleAssignmentDisposable();
	      state.subscription.setDisposable(d);
	      d.setDisposable(currentValue.subscribe(new InnerObserver(state, recurse)));
	    }

	    CatchErrorObservable.prototype.subscribeCore = function (o) {
	      var subscription = new SerialDisposable();
	      var state = {
	        isDisposed: false,
	        e: this.sources[$iterator$](),
	        subscription: subscription,
	        lastError: null,
	        o: o
	      };

	      var cancelable = currentThreadScheduler.scheduleRecursive(state, scheduleMethod);
	      return new NAryDisposable([subscription, cancelable, new IsDisposedDisposable(state)]);
	    };

	    function InnerObserver(state, recurse) {
	      this._state = state;
	      this._recurse = recurse;
	      AbstractObserver.call(this);
	    }

	    inherits(InnerObserver, AbstractObserver);

	    InnerObserver.prototype.next = function (x) { this._state.o.onNext(x); };
	    InnerObserver.prototype.error = function (e) { this._state.lastError = e; this._recurse(this._state); };
	    InnerObserver.prototype.completed = function () { this._state.o.onCompleted(); };

	    return CatchErrorObservable;
	  }(ObservableBase));

	  Enumerable.prototype.catchError = function () {
	    return new CatchErrorObservable(this);
	  };

	  var RepeatEnumerable = (function (__super__) {
	    inherits(RepeatEnumerable, __super__);
	    function RepeatEnumerable(v, c) {
	      this.v = v;
	      this.c = c == null ? -1 : c;
	    }

	    RepeatEnumerable.prototype[$iterator$] = function () {
	      return new RepeatEnumerator(this);
	    };

	    function RepeatEnumerator(p) {
	      this.v = p.v;
	      this.l = p.c;
	    }

	    RepeatEnumerator.prototype.next = function () {
	      if (this.l === 0) { return doneEnumerator; }
	      if (this.l > 0) { this.l--; }
	      return { done: false, value: this.v };
	    };

	    return RepeatEnumerable;
	  }(Enumerable));

	  var enumerableRepeat = Enumerable.repeat = function (value, repeatCount) {
	    return new RepeatEnumerable(value, repeatCount);
	  };

	  var OfEnumerable = (function(__super__) {
	    inherits(OfEnumerable, __super__);
	    function OfEnumerable(s, fn, thisArg) {
	      this.s = s;
	      this.fn = fn ? bindCallback(fn, thisArg, 3) : null;
	    }
	    OfEnumerable.prototype[$iterator$] = function () {
	      return new OfEnumerator(this);
	    };

	    function OfEnumerator(p) {
	      this.i = -1;
	      this.s = p.s;
	      this.l = this.s.length;
	      this.fn = p.fn;
	    }

	    OfEnumerator.prototype.next = function () {
	     return ++this.i < this.l ?
	       { done: false, value: !this.fn ? this.s[this.i] : this.fn(this.s[this.i], this.i, this.s) } :
	       doneEnumerator;
	    };

	    return OfEnumerable;
	  }(Enumerable));

	  var enumerableOf = Enumerable.of = function (source, selector, thisArg) {
	    return new OfEnumerable(source, selector, thisArg);
	  };

	var ObserveOnObservable = (function (__super__) {
	  inherits(ObserveOnObservable, __super__);
	  function ObserveOnObservable(source, s) {
	    this.source = source;
	    this._s = s;
	    __super__.call(this);
	  }

	  ObserveOnObservable.prototype.subscribeCore = function (o) {
	    return this.source.subscribe(new ObserveOnObserver(this._s, o));
	  };

	  return ObserveOnObservable;
	}(ObservableBase));

	   /**
	   *  Wraps the source sequence in order to run its observer callbacks on the specified scheduler.
	   *
	   *  This only invokes observer callbacks on a scheduler. In case the subscription and/or unsubscription actions have side-effects
	   *  that require to be run on a scheduler, use subscribeOn.
	   *
	   *  @param {Scheduler} scheduler Scheduler to notify observers on.
	   *  @returns {Observable} The source sequence whose observations happen on the specified scheduler.
	   */
	  observableProto.observeOn = function (scheduler) {
	    return new ObserveOnObservable(this, scheduler);
	  };

	  var SubscribeOnObservable = (function (__super__) {
	    inherits(SubscribeOnObservable, __super__);
	    function SubscribeOnObservable(source, s) {
	      this.source = source;
	      this._s = s;
	      __super__.call(this);
	    }

	    function scheduleMethod(scheduler, state) {
	      var source = state[0], d = state[1], o = state[2];
	      d.setDisposable(new ScheduledDisposable(scheduler, source.subscribe(o)));
	    }

	    SubscribeOnObservable.prototype.subscribeCore = function (o) {
	      var m = new SingleAssignmentDisposable(), d = new SerialDisposable();
	      d.setDisposable(m);
	      m.setDisposable(this._s.schedule([this.source, d, o], scheduleMethod));
	      return d;
	    };

	    return SubscribeOnObservable;
	  }(ObservableBase));

	   /**
	   *  Wraps the source sequence in order to run its subscription and unsubscription logic on the specified scheduler. This operation is not commonly used;
	   *  see the remarks section for more information on the distinction between subscribeOn and observeOn.

	   *  This only performs the side-effects of subscription and unsubscription on the specified scheduler. In order to invoke observer
	   *  callbacks on a scheduler, use observeOn.

	   *  @param {Scheduler} scheduler Scheduler to perform subscription and unsubscription actions on.
	   *  @returns {Observable} The source sequence whose subscriptions and unsubscriptions happen on the specified scheduler.
	   */
	  observableProto.subscribeOn = function (scheduler) {
	    return new SubscribeOnObservable(this, scheduler);
	  };

	  var FromPromiseObservable = (function(__super__) {
	    inherits(FromPromiseObservable, __super__);
	    function FromPromiseObservable(p, s) {
	      this._p = p;
	      this._s = s;
	      __super__.call(this);
	    }

	    function scheduleNext(s, state) {
	      var o = state[0], data = state[1];
	      o.onNext(data);
	      o.onCompleted();
	    }

	    function scheduleError(s, state) {
	      var o = state[0], err = state[1];
	      o.onError(err);
	    }

	    FromPromiseObservable.prototype.subscribeCore = function(o) {
	      var sad = new SingleAssignmentDisposable(), self = this, p = this._p;

	      if (isFunction(p)) {
	        p = tryCatch(p)();
	        if (p === errorObj) {
	          o.onError(p.e);
	          return sad;
	        }
	      }

	      p
	        .then(function (data) {
	          sad.setDisposable(self._s.schedule([o, data], scheduleNext));
	        }, function (err) {
	          sad.setDisposable(self._s.schedule([o, err], scheduleError));
	        });

	      return sad;
	    };

	    return FromPromiseObservable;
	  }(ObservableBase));

	  /**
	  * Converts a Promise to an Observable sequence
	  * @param {Promise} An ES6 Compliant promise.
	  * @returns {Observable} An Observable sequence which wraps the existing promise success and failure.
	  */
	  var observableFromPromise = Observable.fromPromise = function (promise, scheduler) {
	    scheduler || (scheduler = defaultScheduler);
	    return new FromPromiseObservable(promise, scheduler);
	  };

	  /*
	   * Converts an existing observable sequence to an ES6 Compatible Promise
	   * @example
	   * var promise = Rx.Observable.return(42).toPromise(RSVP.Promise);
	   *
	   * // With config
	   * Rx.config.Promise = RSVP.Promise;
	   * var promise = Rx.Observable.return(42).toPromise();
	   * @param {Function} [promiseCtor] The constructor of the promise. If not provided, it looks for it in Rx.config.Promise.
	   * @returns {Promise} An ES6 compatible promise with the last value from the observable sequence.
	   */
	  observableProto.toPromise = function (promiseCtor) {
	    promiseCtor || (promiseCtor = Rx.config.Promise);
	    if (!promiseCtor) { throw new NotSupportedError('Promise type not provided nor in Rx.config.Promise'); }
	    var source = this;
	    return new promiseCtor(function (resolve, reject) {
	      // No cancellation can be done
	      var value;
	      source.subscribe(function (v) {
	        value = v;
	      }, reject, function () {
	        resolve(value);
	      });
	    });
	  };

	  var ToArrayObservable = (function(__super__) {
	    inherits(ToArrayObservable, __super__);
	    function ToArrayObservable(source) {
	      this.source = source;
	      __super__.call(this);
	    }

	    ToArrayObservable.prototype.subscribeCore = function(o) {
	      return this.source.subscribe(new InnerObserver(o));
	    };

	    inherits(InnerObserver, AbstractObserver);
	    function InnerObserver(o) {
	      this.o = o;
	      this.a = [];
	      AbstractObserver.call(this);
	    }
	    
	    InnerObserver.prototype.next = function (x) { this.a.push(x); };
	    InnerObserver.prototype.error = function (e) { this.o.onError(e);  };
	    InnerObserver.prototype.completed = function () { this.o.onNext(this.a); this.o.onCompleted(); };

	    return ToArrayObservable;
	  }(ObservableBase));

	  /**
	  * Creates an array from an observable sequence.
	  * @returns {Observable} An observable sequence containing a single element with a list containing all the elements of the source sequence.
	  */
	  observableProto.toArray = function () {
	    return new ToArrayObservable(this);
	  };

	  /**
	   *  Creates an observable sequence from a specified subscribe method implementation.
	   * @example
	   *  var res = Rx.Observable.create(function (observer) { return function () { } );
	   *  var res = Rx.Observable.create(function (observer) { return Rx.Disposable.empty; } );
	   *  var res = Rx.Observable.create(function (observer) { } );
	   * @param {Function} subscribe Implementation of the resulting observable sequence's subscribe method, returning a function that will be wrapped in a Disposable.
	   * @returns {Observable} The observable sequence with the specified implementation for the Subscribe method.
	   */
	  Observable.create = function (subscribe, parent) {
	    return new AnonymousObservable(subscribe, parent);
	  };

	  var Defer = (function(__super__) {
	    inherits(Defer, __super__);
	    function Defer(factory) {
	      this._f = factory;
	      __super__.call(this);
	    }

	    Defer.prototype.subscribeCore = function (o) {
	      var result = tryCatch(this._f)();
	      if (result === errorObj) { return observableThrow(result.e).subscribe(o);}
	      isPromise(result) && (result = observableFromPromise(result));
	      return result.subscribe(o);
	    };

	    return Defer;
	  }(ObservableBase));

	  /**
	   *  Returns an observable sequence that invokes the specified factory function whenever a new observer subscribes.
	   *
	   * @example
	   *  var res = Rx.Observable.defer(function () { return Rx.Observable.fromArray([1,2,3]); });
	   * @param {Function} observableFactory Observable factory function to invoke for each observer that subscribes to the resulting sequence or Promise.
	   * @returns {Observable} An observable sequence whose observers trigger an invocation of the given observable factory function.
	   */
	  var observableDefer = Observable.defer = function (observableFactory) {
	    return new Defer(observableFactory);
	  };

	  var EmptyObservable = (function(__super__) {
	    inherits(EmptyObservable, __super__);
	    function EmptyObservable(scheduler) {
	      this.scheduler = scheduler;
	      __super__.call(this);
	    }

	    EmptyObservable.prototype.subscribeCore = function (observer) {
	      var sink = new EmptySink(observer, this.scheduler);
	      return sink.run();
	    };

	    function EmptySink(observer, scheduler) {
	      this.observer = observer;
	      this.scheduler = scheduler;
	    }

	    function scheduleItem(s, state) {
	      state.onCompleted();
	      return disposableEmpty;
	    }

	    EmptySink.prototype.run = function () {
	      var state = this.observer;
	      return this.scheduler === immediateScheduler ?
	        scheduleItem(null, state) :
	        this.scheduler.schedule(state, scheduleItem);
	    };

	    return EmptyObservable;
	  }(ObservableBase));

	  var EMPTY_OBSERVABLE = new EmptyObservable(immediateScheduler);

	  /**
	   *  Returns an empty observable sequence, using the specified scheduler to send out the single OnCompleted message.
	   *
	   * @example
	   *  var res = Rx.Observable.empty();
	   *  var res = Rx.Observable.empty(Rx.Scheduler.timeout);
	   * @param {Scheduler} [scheduler] Scheduler to send the termination call on.
	   * @returns {Observable} An observable sequence with no elements.
	   */
	  var observableEmpty = Observable.empty = function (scheduler) {
	    isScheduler(scheduler) || (scheduler = immediateScheduler);
	    return scheduler === immediateScheduler ? EMPTY_OBSERVABLE : new EmptyObservable(scheduler);
	  };

	  var FromObservable = (function(__super__) {
	    inherits(FromObservable, __super__);
	    function FromObservable(iterable, fn, scheduler) {
	      this._iterable = iterable;
	      this._fn = fn;
	      this._scheduler = scheduler;
	      __super__.call(this);
	    }

	    function createScheduleMethod(o, it, fn) {
	      return function loopRecursive(i, recurse) {
	        var next = tryCatch(it.next).call(it);
	        if (next === errorObj) { return o.onError(next.e); }
	        if (next.done) { return o.onCompleted(); }

	        var result = next.value;

	        if (isFunction(fn)) {
	          result = tryCatch(fn)(result, i);
	          if (result === errorObj) { return o.onError(result.e); }
	        }

	        o.onNext(result);
	        recurse(i + 1);
	      };
	    }

	    FromObservable.prototype.subscribeCore = function (o) {
	      var list = Object(this._iterable),
	          it = getIterable(list);

	      return this._scheduler.scheduleRecursive(0, createScheduleMethod(o, it, this._fn));
	    };

	    return FromObservable;
	  }(ObservableBase));

	  var maxSafeInteger = Math.pow(2, 53) - 1;

	  function StringIterable(s) {
	    this._s = s;
	  }

	  StringIterable.prototype[$iterator$] = function () {
	    return new StringIterator(this._s);
	  };

	  function StringIterator(s) {
	    this._s = s;
	    this._l = s.length;
	    this._i = 0;
	  }

	  StringIterator.prototype[$iterator$] = function () {
	    return this;
	  };

	  StringIterator.prototype.next = function () {
	    return this._i < this._l ? { done: false, value: this._s.charAt(this._i++) } : doneEnumerator;
	  };

	  function ArrayIterable(a) {
	    this._a = a;
	  }

	  ArrayIterable.prototype[$iterator$] = function () {
	    return new ArrayIterator(this._a);
	  };

	  function ArrayIterator(a) {
	    this._a = a;
	    this._l = toLength(a);
	    this._i = 0;
	  }

	  ArrayIterator.prototype[$iterator$] = function () {
	    return this;
	  };

	  ArrayIterator.prototype.next = function () {
	    return this._i < this._l ? { done: false, value: this._a[this._i++] } : doneEnumerator;
	  };

	  function numberIsFinite(value) {
	    return typeof value === 'number' && root.isFinite(value);
	  }

	  function isNan(n) {
	    return n !== n;
	  }

	  function getIterable(o) {
	    var i = o[$iterator$], it;
	    if (!i && typeof o === 'string') {
	      it = new StringIterable(o);
	      return it[$iterator$]();
	    }
	    if (!i && o.length !== undefined) {
	      it = new ArrayIterable(o);
	      return it[$iterator$]();
	    }
	    if (!i) { throw new TypeError('Object is not iterable'); }
	    return o[$iterator$]();
	  }

	  function sign(value) {
	    var number = +value;
	    if (number === 0) { return number; }
	    if (isNaN(number)) { return number; }
	    return number < 0 ? -1 : 1;
	  }

	  function toLength(o) {
	    var len = +o.length;
	    if (isNaN(len)) { return 0; }
	    if (len === 0 || !numberIsFinite(len)) { return len; }
	    len = sign(len) * Math.floor(Math.abs(len));
	    if (len <= 0) { return 0; }
	    if (len > maxSafeInteger) { return maxSafeInteger; }
	    return len;
	  }

	  /**
	  * This method creates a new Observable sequence from an array-like or iterable object.
	  * @param {Any} arrayLike An array-like or iterable object to convert to an Observable sequence.
	  * @param {Function} [mapFn] Map function to call on every element of the array.
	  * @param {Any} [thisArg] The context to use calling the mapFn if provided.
	  * @param {Scheduler} [scheduler] Optional scheduler to use for scheduling.  If not provided, defaults to Scheduler.currentThread.
	  */
	  var observableFrom = Observable.from = function (iterable, mapFn, thisArg, scheduler) {
	    if (iterable == null) {
	      throw new Error('iterable cannot be null.')
	    }
	    if (mapFn && !isFunction(mapFn)) {
	      throw new Error('mapFn when provided must be a function');
	    }
	    if (mapFn) {
	      var mapper = bindCallback(mapFn, thisArg, 2);
	    }
	    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
	    return new FromObservable(iterable, mapper, scheduler);
	  }

	  var FromArrayObservable = (function(__super__) {
	    inherits(FromArrayObservable, __super__);
	    function FromArrayObservable(args, scheduler) {
	      this._args = args;
	      this._scheduler = scheduler;
	      __super__.call(this);
	    }

	    function scheduleMethod(o, args) {
	      var len = args.length;
	      return function loopRecursive (i, recurse) {
	        if (i < len) {
	          o.onNext(args[i]);
	          recurse(i + 1);
	        } else {
	          o.onCompleted();
	        }
	      };
	    }

	    FromArrayObservable.prototype.subscribeCore = function (o) {
	      return this._scheduler.scheduleRecursive(0, scheduleMethod(o, this._args));
	    };

	    return FromArrayObservable;
	  }(ObservableBase));

	  /**
	  *  Converts an array to an observable sequence, using an optional scheduler to enumerate the array.
	  * @deprecated use Observable.from or Observable.of
	  * @param {Scheduler} [scheduler] Scheduler to run the enumeration of the input sequence on.
	  * @returns {Observable} The observable sequence whose elements are pulled from the given enumerable sequence.
	  */
	  var observableFromArray = Observable.fromArray = function (array, scheduler) {
	    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
	    return new FromArrayObservable(array, scheduler)
	  };

	  var GenerateObservable = (function (__super__) {
	    inherits(GenerateObservable, __super__);
	    function GenerateObservable(state, cndFn, itrFn, resFn, s) {
	      this._initialState = state;
	      this._cndFn = cndFn;
	      this._itrFn = itrFn;
	      this._resFn = resFn;
	      this._s = s;
	      __super__.call(this);
	    }

	    function scheduleRecursive(state, recurse) {
	      if (state.first) {
	        state.first = false;
	      } else {
	        state.newState = tryCatch(state.self._itrFn)(state.newState);
	        if (state.newState === errorObj) { return state.o.onError(state.newState.e); }
	      }
	      var hasResult = tryCatch(state.self._cndFn)(state.newState);
	      if (hasResult === errorObj) { return state.o.onError(hasResult.e); }
	      if (hasResult) {
	        var result = tryCatch(state.self._resFn)(state.newState);
	        if (result === errorObj) { return state.o.onError(result.e); }
	        state.o.onNext(result);
	        recurse(state);
	      } else {
	        state.o.onCompleted();
	      }
	    }

	    GenerateObservable.prototype.subscribeCore = function (o) {
	      var state = {
	        o: o,
	        self: this,
	        first: true,
	        newState: this._initialState
	      };
	      return this._s.scheduleRecursive(state, scheduleRecursive);
	    };

	    return GenerateObservable;
	  }(ObservableBase));

	  /**
	   *  Generates an observable sequence by running a state-driven loop producing the sequence's elements, using the specified scheduler to send out observer messages.
	   *
	   * @example
	   *  var res = Rx.Observable.generate(0, function (x) { return x < 10; }, function (x) { return x + 1; }, function (x) { return x; });
	   *  var res = Rx.Observable.generate(0, function (x) { return x < 10; }, function (x) { return x + 1; }, function (x) { return x; }, Rx.Scheduler.timeout);
	   * @param {Mixed} initialState Initial state.
	   * @param {Function} condition Condition to terminate generation (upon returning false).
	   * @param {Function} iterate Iteration step function.
	   * @param {Function} resultSelector Selector function for results produced in the sequence.
	   * @param {Scheduler} [scheduler] Scheduler on which to run the generator loop. If not provided, defaults to Scheduler.currentThread.
	   * @returns {Observable} The generated sequence.
	   */
	  Observable.generate = function (initialState, condition, iterate, resultSelector, scheduler) {
	    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
	    return new GenerateObservable(initialState, condition, iterate, resultSelector, scheduler);
	  };

	  function observableOf (scheduler, array) {
	    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
	    return new FromArrayObservable(array, scheduler);
	  }

	  /**
	  *  This method creates a new Observable instance with a variable number of arguments, regardless of number or type of the arguments.
	  * @returns {Observable} The observable sequence whose elements are pulled from the given arguments.
	  */
	  Observable.of = function () {
	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    return new FromArrayObservable(args, currentThreadScheduler);
	  };

	  /**
	  *  This method creates a new Observable instance with a variable number of arguments, regardless of number or type of the arguments.
	  * @param {Scheduler} scheduler A scheduler to use for scheduling the arguments.
	  * @returns {Observable} The observable sequence whose elements are pulled from the given arguments.
	  */
	  Observable.ofWithScheduler = function (scheduler) {
	    var len = arguments.length, args = new Array(len - 1);
	    for(var i = 1; i < len; i++) { args[i - 1] = arguments[i]; }
	    return new FromArrayObservable(args, scheduler);
	  };

	  /**
	   * Creates an Observable sequence from changes to an array using Array.observe.
	   * @param {Array} array An array to observe changes.
	   * @returns {Observable} An observable sequence containing changes to an array from Array.observe.
	   */
	  Observable.ofArrayChanges = function(array) {
	    if (!Array.isArray(array)) { throw new TypeError('Array.observe only accepts arrays.'); }
	    if (typeof Array.observe !== 'function' && typeof Array.unobserve !== 'function') { throw new TypeError('Array.observe is not supported on your platform') }
	    return new AnonymousObservable(function(observer) {
	      function observerFn(changes) {
	        for(var i = 0, len = changes.length; i < len; i++) {
	          observer.onNext(changes[i]);
	        }
	      }
	      
	      Array.observe(array, observerFn);

	      return function () {
	        Array.unobserve(array, observerFn);
	      };
	    });
	  };

	  /**
	   * Creates an Observable sequence from changes to an object using Object.observe.
	   * @param {Object} obj An object to observe changes.
	   * @returns {Observable} An observable sequence containing changes to an object from Object.observe.
	   */
	  Observable.ofObjectChanges = function(obj) {
	    if (obj == null) { throw new TypeError('object must not be null or undefined.'); }
	    if (typeof Object.observe !== 'function' && typeof Object.unobserve !== 'function') { throw new TypeError('Object.observe is not supported on your platform') }
	    return new AnonymousObservable(function(observer) {
	      function observerFn(changes) {
	        for(var i = 0, len = changes.length; i < len; i++) {
	          observer.onNext(changes[i]);
	        }
	      }

	      Object.observe(obj, observerFn);

	      return function () {
	        Object.unobserve(obj, observerFn);
	      };
	    });
	  };

	  var NeverObservable = (function(__super__) {
	    inherits(NeverObservable, __super__);
	    function NeverObservable() {
	      __super__.call(this);
	    }

	    NeverObservable.prototype.subscribeCore = function (observer) {
	      return disposableEmpty;
	    };

	    return NeverObservable;
	  }(ObservableBase));

	  var NEVER_OBSERVABLE = new NeverObservable();

	  /**
	   * Returns a non-terminating observable sequence, which can be used to denote an infinite duration (e.g. when using reactive joins).
	   * @returns {Observable} An observable sequence whose observers will never get called.
	   */
	  var observableNever = Observable.never = function () {
	    return NEVER_OBSERVABLE;
	  };

	  var PairsObservable = (function(__super__) {
	    inherits(PairsObservable, __super__);
	    function PairsObservable(o, scheduler) {
	      this._o = o;
	      this._keys = Object.keys(o);
	      this._scheduler = scheduler;
	      __super__.call(this);
	    }

	    function scheduleMethod(o, obj, keys) {
	      return function loopRecursive(i, recurse) {
	        if (i < keys.length) {
	          var key = keys[i];
	          o.onNext([key, obj[key]]);
	          recurse(i + 1);
	        } else {
	          o.onCompleted();
	        }
	      };
	    }

	    PairsObservable.prototype.subscribeCore = function (o) {
	      return this._scheduler.scheduleRecursive(0, scheduleMethod(o, this._o, this._keys));
	    };

	    return PairsObservable;
	  }(ObservableBase));

	  /**
	   * Convert an object into an observable sequence of [key, value] pairs.
	   * @param {Object} obj The object to inspect.
	   * @param {Scheduler} [scheduler] Scheduler to run the enumeration of the input sequence on.
	   * @returns {Observable} An observable sequence of [key, value] pairs from the object.
	   */
	  Observable.pairs = function (obj, scheduler) {
	    scheduler || (scheduler = currentThreadScheduler);
	    return new PairsObservable(obj, scheduler);
	  };

	    var RangeObservable = (function(__super__) {
	    inherits(RangeObservable, __super__);
	    function RangeObservable(start, count, scheduler) {
	      this.start = start;
	      this.rangeCount = count;
	      this.scheduler = scheduler;
	      __super__.call(this);
	    }

	    function loopRecursive(start, count, o) {
	      return function loop (i, recurse) {
	        if (i < count) {
	          o.onNext(start + i);
	          recurse(i + 1);
	        } else {
	          o.onCompleted();
	        }
	      };
	    }

	    RangeObservable.prototype.subscribeCore = function (o) {
	      return this.scheduler.scheduleRecursive(
	        0,
	        loopRecursive(this.start, this.rangeCount, o)
	      );
	    };

	    return RangeObservable;
	  }(ObservableBase));

	  /**
	  *  Generates an observable sequence of integral numbers within a specified range, using the specified scheduler to send out observer messages.
	  * @param {Number} start The value of the first integer in the sequence.
	  * @param {Number} count The number of sequential integers to generate.
	  * @param {Scheduler} [scheduler] Scheduler to run the generator loop on. If not specified, defaults to Scheduler.currentThread.
	  * @returns {Observable} An observable sequence that contains a range of sequential integral numbers.
	  */
	  Observable.range = function (start, count, scheduler) {
	    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
	    return new RangeObservable(start, count, scheduler);
	  };

	  var RepeatObservable = (function(__super__) {
	    inherits(RepeatObservable, __super__);
	    function RepeatObservable(value, repeatCount, scheduler) {
	      this.value = value;
	      this.repeatCount = repeatCount == null ? -1 : repeatCount;
	      this.scheduler = scheduler;
	      __super__.call(this);
	    }

	    RepeatObservable.prototype.subscribeCore = function (observer) {
	      var sink = new RepeatSink(observer, this);
	      return sink.run();
	    };

	    return RepeatObservable;
	  }(ObservableBase));

	  function RepeatSink(observer, parent) {
	    this.observer = observer;
	    this.parent = parent;
	  }

	  RepeatSink.prototype.run = function () {
	    var observer = this.observer, value = this.parent.value;
	    function loopRecursive(i, recurse) {
	      if (i === -1 || i > 0) {
	        observer.onNext(value);
	        i > 0 && i--;
	      }
	      if (i === 0) { return observer.onCompleted(); }
	      recurse(i);
	    }

	    return this.parent.scheduler.scheduleRecursive(this.parent.repeatCount, loopRecursive);
	  };

	  /**
	   *  Generates an observable sequence that repeats the given element the specified number of times, using the specified scheduler to send out observer messages.
	   * @param {Mixed} value Element to repeat.
	   * @param {Number} repeatCount [Optiona] Number of times to repeat the element. If not specified, repeats indefinitely.
	   * @param {Scheduler} scheduler Scheduler to run the producer loop on. If not specified, defaults to Scheduler.immediate.
	   * @returns {Observable} An observable sequence that repeats the given element the specified number of times.
	   */
	  Observable.repeat = function (value, repeatCount, scheduler) {
	    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
	    return new RepeatObservable(value, repeatCount, scheduler);
	  };

	  var JustObservable = (function(__super__) {
	    inherits(JustObservable, __super__);
	    function JustObservable(value, scheduler) {
	      this._value = value;
	      this._scheduler = scheduler;
	      __super__.call(this);
	    }

	    JustObservable.prototype.subscribeCore = function (o) {
	      var state = [this._value, o];
	      return this._scheduler === immediateScheduler ?
	        scheduleItem(null, state) :
	        this._scheduler.schedule(state, scheduleItem);
	    };

	    function scheduleItem(s, state) {
	      var value = state[0], observer = state[1];
	      observer.onNext(value);
	      observer.onCompleted();
	      return disposableEmpty;
	    }

	    return JustObservable;
	  }(ObservableBase));

	  /**
	   *  Returns an observable sequence that contains a single element, using the specified scheduler to send out observer messages.
	   *  There is an alias called 'just' or browsers <IE9.
	   * @param {Mixed} value Single element in the resulting observable sequence.
	   * @param {Scheduler} scheduler Scheduler to send the single element on. If not specified, defaults to Scheduler.immediate.
	   * @returns {Observable} An observable sequence containing the single specified element.
	   */
	  var observableReturn = Observable['return'] = Observable.just = function (value, scheduler) {
	    isScheduler(scheduler) || (scheduler = immediateScheduler);
	    return new JustObservable(value, scheduler);
	  };

	  var ThrowObservable = (function(__super__) {
	    inherits(ThrowObservable, __super__);
	    function ThrowObservable(error, scheduler) {
	      this._error = error;
	      this._scheduler = scheduler;
	      __super__.call(this);
	    }

	    ThrowObservable.prototype.subscribeCore = function (o) {
	      var state = [this._error, o];
	      return this._scheduler === immediateScheduler ?
	        scheduleItem(null, state) :
	        this._scheduler.schedule(state, scheduleItem);
	    };

	    function scheduleItem(s, state) {
	      var e = state[0], o = state[1];
	      o.onError(e);
	      return disposableEmpty;
	    }

	    return ThrowObservable;
	  }(ObservableBase));

	  /**
	   *  Returns an observable sequence that terminates with an exception, using the specified scheduler to send out the single onError message.
	   *  There is an alias to this method called 'throwError' for browsers <IE9.
	   * @param {Mixed} error An object used for the sequence's termination.
	   * @param {Scheduler} scheduler Scheduler to send the exceptional termination call on. If not specified, defaults to Scheduler.immediate.
	   * @returns {Observable} The observable sequence that terminates exceptionally with the specified exception object.
	   */
	  var observableThrow = Observable['throw'] = function (error, scheduler) {
	    isScheduler(scheduler) || (scheduler = immediateScheduler);
	    return new ThrowObservable(error, scheduler);
	  };

	  var UsingObservable = (function (__super__) {
	    inherits(UsingObservable, __super__);
	    function UsingObservable(resFn, obsFn) {
	      this._resFn = resFn;
	      this._obsFn = obsFn;
	      __super__.call(this);
	    }

	    UsingObservable.prototype.subscribeCore = function (o) {
	      var disposable = disposableEmpty;
	      var resource = tryCatch(this._resFn)();
	      if (resource === errorObj) {
	        return new BinaryDisposable(observableThrow(resource.e).subscribe(o), disposable);
	      }
	      resource && (disposable = resource);
	      var source = tryCatch(this._obsFn)(resource);
	      if (source === errorObj) {
	        return new BinaryDisposable(observableThrow(source.e).subscribe(o), disposable);
	      }
	      return new BinaryDisposable(source.subscribe(o), disposable);
	    };

	    return UsingObservable;
	  }(ObservableBase));

	  /**
	   * Constructs an observable sequence that depends on a resource object, whose lifetime is tied to the resulting observable sequence's lifetime.
	   * @param {Function} resourceFactory Factory function to obtain a resource object.
	   * @param {Function} observableFactory Factory function to obtain an observable sequence that depends on the obtained resource.
	   * @returns {Observable} An observable sequence whose lifetime controls the lifetime of the dependent resource object.
	   */
	  Observable.using = function (resourceFactory, observableFactory) {
	    return new UsingObservable(resourceFactory, observableFactory);
	  };

	  /**
	   * Propagates the observable sequence or Promise that reacts first.
	   * @param {Observable} rightSource Second observable sequence or Promise.
	   * @returns {Observable} {Observable} An observable sequence that surfaces either of the given sequences, whichever reacted first.
	   */
	  observableProto.amb = function (rightSource) {
	    var leftSource = this;
	    return new AnonymousObservable(function (observer) {
	      var choice,
	        leftChoice = 'L', rightChoice = 'R',
	        leftSubscription = new SingleAssignmentDisposable(),
	        rightSubscription = new SingleAssignmentDisposable();

	      isPromise(rightSource) && (rightSource = observableFromPromise(rightSource));

	      function choiceL() {
	        if (!choice) {
	          choice = leftChoice;
	          rightSubscription.dispose();
	        }
	      }

	      function choiceR() {
	        if (!choice) {
	          choice = rightChoice;
	          leftSubscription.dispose();
	        }
	      }

	      var leftSubscribe = observerCreate(
	        function (left) {
	          choiceL();
	          choice === leftChoice && observer.onNext(left);
	        },
	        function (e) {
	          choiceL();
	          choice === leftChoice && observer.onError(e);
	        },
	        function () {
	          choiceL();
	          choice === leftChoice && observer.onCompleted();
	        }
	      );
	      var rightSubscribe = observerCreate(
	        function (right) {
	          choiceR();
	          choice === rightChoice && observer.onNext(right);
	        },
	        function (e) {
	          choiceR();
	          choice === rightChoice && observer.onError(e);
	        },
	        function () {
	          choiceR();
	          choice === rightChoice && observer.onCompleted();
	        }
	      );

	      leftSubscription.setDisposable(leftSource.subscribe(leftSubscribe));
	      rightSubscription.setDisposable(rightSource.subscribe(rightSubscribe));

	      return new BinaryDisposable(leftSubscription, rightSubscription);
	    });
	  };

	  function amb(p, c) { return p.amb(c); }

	  /**
	   * Propagates the observable sequence or Promise that reacts first.
	   * @returns {Observable} An observable sequence that surfaces any of the given sequences, whichever reacted first.
	   */
	  Observable.amb = function () {
	    var acc = observableNever(), items;
	    if (Array.isArray(arguments[0])) {
	      items = arguments[0];
	    } else {
	      var len = arguments.length;
	      items = new Array(items);
	      for(var i = 0; i < len; i++) { items[i] = arguments[i]; }
	    }
	    for (var i = 0, len = items.length; i < len; i++) {
	      acc = amb(acc, items[i]);
	    }
	    return acc;
	  };

	  var CatchObservable = (function (__super__) {
	    inherits(CatchObservable, __super__);
	    function CatchObservable(source, fn) {
	      this.source = source;
	      this._fn = fn;
	      __super__.call(this);
	    }

	    CatchObservable.prototype.subscribeCore = function (o) {
	      var d1 = new SingleAssignmentDisposable(), subscription = new SerialDisposable();
	      subscription.setDisposable(d1);
	      d1.setDisposable(this.source.subscribe(new CatchObserver(o, subscription, this._fn)));
	      return subscription;
	    };

	    return CatchObservable;
	  }(ObservableBase));

	  var CatchObserver = (function(__super__) {
	    inherits(CatchObserver, __super__);
	    function CatchObserver(o, s, fn) {
	      this._o = o;
	      this._s = s;
	      this._fn = fn;
	      __super__.call(this);
	    }

	    CatchObserver.prototype.next = function (x) { this._o.onNext(x); };
	    CatchObserver.prototype.completed = function () { return this._o.onCompleted(); };
	    CatchObserver.prototype.error = function (e) {
	      var result = tryCatch(this._fn)(e);
	      if (result === errorObj) { return this._o.onError(result.e); }
	      isPromise(result) && (result = observableFromPromise(result));

	      var d = new SingleAssignmentDisposable();
	      this._s.setDisposable(d);
	      d.setDisposable(result.subscribe(this._o));
	    };

	    return CatchObserver;
	  }(AbstractObserver));

	  /**
	   * Continues an observable sequence that is terminated by an exception with the next observable sequence.
	   * @param {Mixed} handlerOrSecond Exception handler function that returns an observable sequence given the error that occurred in the first sequence, or a second observable sequence used to produce results when an error occurred in the first sequence.
	   * @returns {Observable} An observable sequence containing the first sequence's elements, followed by the elements of the handler sequence in case an exception occurred.
	   */
	  observableProto['catch'] = function (handlerOrSecond) {
	    return isFunction(handlerOrSecond) ? new CatchObservable(this, handlerOrSecond) : observableCatch([this, handlerOrSecond]);
	  };

	  /**
	   * Continues an observable sequence that is terminated by an exception with the next observable sequence.
	   * @param {Array | Arguments} args Arguments or an array to use as the next sequence if an error occurs.
	   * @returns {Observable} An observable sequence containing elements from consecutive source sequences until a source sequence terminates successfully.
	   */
	  var observableCatch = Observable['catch'] = function () {
	    var items;
	    if (Array.isArray(arguments[0])) {
	      items = arguments[0];
	    } else {
	      var len = arguments.length;
	      items = new Array(len);
	      for(var i = 0; i < len; i++) { items[i] = arguments[i]; }
	    }
	    return enumerableOf(items).catchError();
	  };

	  /**
	   * Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences or Promises produces an element.
	   * This can be in the form of an argument list of observables or an array.
	   *
	   * @example
	   * 1 - obs = observable.combineLatest(obs1, obs2, obs3, function (o1, o2, o3) { return o1 + o2 + o3; });
	   * 2 - obs = observable.combineLatest([obs1, obs2, obs3], function (o1, o2, o3) { return o1 + o2 + o3; });
	   * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
	   */
	  observableProto.combineLatest = function () {
	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    if (Array.isArray(args[0])) {
	      args[0].unshift(this);
	    } else {
	      args.unshift(this);
	    }
	    return combineLatest.apply(this, args);
	  };

	  function falseFactory() { return false; }
	  function argumentsToArray() {
	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    return args;
	  }

	  var CombineLatestObservable = (function(__super__) {
	    inherits(CombineLatestObservable, __super__);
	    function CombineLatestObservable(params, cb) {
	      this._params = params;
	      this._cb = cb;
	      __super__.call(this);
	    }

	    CombineLatestObservable.prototype.subscribeCore = function(observer) {
	      var len = this._params.length,
	          subscriptions = new Array(len);

	      var state = {
	        hasValue: arrayInitialize(len, falseFactory),
	        hasValueAll: false,
	        isDone: arrayInitialize(len, falseFactory),
	        values: new Array(len)
	      };

	      for (var i = 0; i < len; i++) {
	        var source = this._params[i], sad = new SingleAssignmentDisposable();
	        subscriptions[i] = sad;
	        isPromise(source) && (source = observableFromPromise(source));
	        sad.setDisposable(source.subscribe(new CombineLatestObserver(observer, i, this._cb, state)));
	      }

	      return new NAryDisposable(subscriptions);
	    };

	    return CombineLatestObservable;
	  }(ObservableBase));

	  var CombineLatestObserver = (function (__super__) {
	    inherits(CombineLatestObserver, __super__);
	    function CombineLatestObserver(o, i, cb, state) {
	      this._o = o;
	      this._i = i;
	      this._cb = cb;
	      this._state = state;
	      __super__.call(this);
	    }

	    function notTheSame(i) {
	      return function (x, j) {
	        return j !== i;
	      };
	    }

	    CombineLatestObserver.prototype.next = function (x) {
	      this._state.values[this._i] = x;
	      this._state.hasValue[this._i] = true;
	      if (this._state.hasValueAll || (this._state.hasValueAll = this._state.hasValue.every(identity))) {
	        var res = tryCatch(this._cb).apply(null, this._state.values);
	        if (res === errorObj) { return this._o.onError(res.e); }
	        this._o.onNext(res);
	      } else if (this._state.isDone.filter(notTheSame(this._i)).every(identity)) {
	        this._o.onCompleted();
	      }
	    };

	    CombineLatestObserver.prototype.error = function (e) {
	      this._o.onError(e);
	    };

	    CombineLatestObserver.prototype.completed = function () {
	      this._state.isDone[this._i] = true;
	      this._state.isDone.every(identity) && this._o.onCompleted();
	    };

	    return CombineLatestObserver;
	  }(AbstractObserver));

	  /**
	  * Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences or Promises produces an element.
	  *
	  * @example
	  * 1 - obs = Rx.Observable.combineLatest(obs1, obs2, obs3, function (o1, o2, o3) { return o1 + o2 + o3; });
	  * 2 - obs = Rx.Observable.combineLatest([obs1, obs2, obs3], function (o1, o2, o3) { return o1 + o2 + o3; });
	  * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
	  */
	  var combineLatest = Observable.combineLatest = function () {
	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    var resultSelector = isFunction(args[len - 1]) ? args.pop() : argumentsToArray;
	    Array.isArray(args[0]) && (args = args[0]);
	    return new CombineLatestObservable(args, resultSelector);
	  };

	  /**
	   * Concatenates all the observable sequences.  This takes in either an array or variable arguments to concatenate.
	   * @returns {Observable} An observable sequence that contains the elements of each given sequence, in sequential order.
	   */
	  observableProto.concat = function () {
	    for(var args = [], i = 0, len = arguments.length; i < len; i++) { args.push(arguments[i]); }
	    args.unshift(this);
	    return observableConcat.apply(null, args);
	  };

	  var ConcatObserver = (function(__super__) {
	    inherits(ConcatObserver, __super__);
	    function ConcatObserver(s, fn) {
	      this._s = s;
	      this._fn = fn;
	      __super__.call(this);
	    }

	    ConcatObserver.prototype.next = function (x) { this._s.o.onNext(x); };
	    ConcatObserver.prototype.error = function (e) { this._s.o.onError(e); };
	    ConcatObserver.prototype.completed = function () { this._s.i++; this._fn(this._s); };

	    return ConcatObserver;
	  }(AbstractObserver));

	  var ConcatObservable = (function(__super__) {
	    inherits(ConcatObservable, __super__);
	    function ConcatObservable(sources) {
	      this._sources = sources;
	      __super__.call(this);
	    }

	    function scheduleRecursive (state, recurse) {
	      if (state.disposable.isDisposed) { return; }
	      if (state.i === state.sources.length) { return state.o.onCompleted(); }

	      // Check if promise
	      var currentValue = state.sources[state.i];
	      isPromise(currentValue) && (currentValue = observableFromPromise(currentValue));

	      var d = new SingleAssignmentDisposable();
	      state.subscription.setDisposable(d);
	      d.setDisposable(currentValue.subscribe(new ConcatObserver(state, recurse)));
	    }

	    ConcatObservable.prototype.subscribeCore = function(o) {
	      var subscription = new SerialDisposable();
	      var disposable = disposableCreate(noop);
	      var state = {
	        o: o,
	        i: 0,
	        subscription: subscription,
	        disposable: disposable,
	        sources: this._sources
	      };

	      var cancelable = immediateScheduler.scheduleRecursive(state, scheduleRecursive);
	      return new NAryDisposable([subscription, disposable, cancelable]);
	    };

	    return ConcatObservable;
	  }(ObservableBase));

	  /**
	   * Concatenates all the observable sequences.
	   * @param {Array | Arguments} args Arguments or an array to concat to the observable sequence.
	   * @returns {Observable} An observable sequence that contains the elements of each given sequence, in sequential order.
	   */
	  var observableConcat = Observable.concat = function () {
	    var args;
	    if (Array.isArray(arguments[0])) {
	      args = arguments[0];
	    } else {
	      args = new Array(arguments.length);
	      for(var i = 0, len = arguments.length; i < len; i++) { args[i] = arguments[i]; }
	    }
	    return new ConcatObservable(args);
	  };

	  /**
	   * Concatenates an observable sequence of observable sequences.
	   * @returns {Observable} An observable sequence that contains the elements of each observed inner sequence, in sequential order.
	   */
	  observableProto.concatAll = function () {
	    return this.merge(1);
	  };

	  var MergeObservable = (function (__super__) {
	    inherits(MergeObservable, __super__);

	    function MergeObservable(source, maxConcurrent) {
	      this.source = source;
	      this.maxConcurrent = maxConcurrent;
	      __super__.call(this);
	    }

	    MergeObservable.prototype.subscribeCore = function(observer) {
	      var g = new CompositeDisposable();
	      g.add(this.source.subscribe(new MergeObserver(observer, this.maxConcurrent, g)));
	      return g;
	    };

	    return MergeObservable;

	  }(ObservableBase));

	  var MergeObserver = (function (__super__) {
	    function MergeObserver(o, max, g) {
	      this.o = o;
	      this.max = max;
	      this.g = g;
	      this.done = false;
	      this.q = [];
	      this.activeCount = 0;
	      __super__.call(this);
	    }

	    inherits(MergeObserver, __super__);

	    MergeObserver.prototype.handleSubscribe = function (xs) {
	      var sad = new SingleAssignmentDisposable();
	      this.g.add(sad);
	      isPromise(xs) && (xs = observableFromPromise(xs));
	      sad.setDisposable(xs.subscribe(new InnerObserver(this, sad)));
	    };

	    MergeObserver.prototype.next = function (innerSource) {
	      if(this.activeCount < this.max) {
	        this.activeCount++;
	        this.handleSubscribe(innerSource);
	      } else {
	        this.q.push(innerSource);
	      }
	    };
	    MergeObserver.prototype.error = function (e) { this.o.onError(e); };
	    MergeObserver.prototype.completed = function () { this.done = true; this.activeCount === 0 && this.o.onCompleted(); };

	    function InnerObserver(parent, sad) {
	      this.parent = parent;
	      this.sad = sad;
	      __super__.call(this);
	    }

	    inherits(InnerObserver, __super__);

	    InnerObserver.prototype.next = function (x) { this.parent.o.onNext(x); };
	    InnerObserver.prototype.error = function (e) { this.parent.o.onError(e); };
	    InnerObserver.prototype.completed = function () {
	      this.parent.g.remove(this.sad);
	      if (this.parent.q.length > 0) {
	        this.parent.handleSubscribe(this.parent.q.shift());
	      } else {
	        this.parent.activeCount--;
	        this.parent.done && this.parent.activeCount === 0 && this.parent.o.onCompleted();
	      }
	    };

	    return MergeObserver;
	  }(AbstractObserver));

	  /**
	  * Merges an observable sequence of observable sequences into an observable sequence, limiting the number of concurrent subscriptions to inner sequences.
	  * Or merges two observable sequences into a single observable sequence.
	  * @param {Mixed} [maxConcurrentOrOther] Maximum number of inner observable sequences being subscribed to concurrently or the second observable sequence.
	  * @returns {Observable} The observable sequence that merges the elements of the inner sequences.
	  */
	  observableProto.merge = function (maxConcurrentOrOther) {
	    return typeof maxConcurrentOrOther !== 'number' ?
	      observableMerge(this, maxConcurrentOrOther) :
	      new MergeObservable(this, maxConcurrentOrOther);
	  };

	  /**
	   * Merges all the observable sequences into a single observable sequence.
	   * The scheduler is optional and if not specified, the immediate scheduler is used.
	   * @returns {Observable} The observable sequence that merges the elements of the observable sequences.
	   */
	  var observableMerge = Observable.merge = function () {
	    var scheduler, sources = [], i, len = arguments.length;
	    if (!arguments[0]) {
	      scheduler = immediateScheduler;
	      for(i = 1; i < len; i++) { sources.push(arguments[i]); }
	    } else if (isScheduler(arguments[0])) {
	      scheduler = arguments[0];
	      for(i = 1; i < len; i++) { sources.push(arguments[i]); }
	    } else {
	      scheduler = immediateScheduler;
	      for(i = 0; i < len; i++) { sources.push(arguments[i]); }
	    }
	    if (Array.isArray(sources[0])) {
	      sources = sources[0];
	    }
	    return observableOf(scheduler, sources).mergeAll();
	  };

	  var MergeAllObservable = (function (__super__) {
	    inherits(MergeAllObservable, __super__);

	    function MergeAllObservable(source) {
	      this.source = source;
	      __super__.call(this);
	    }

	    MergeAllObservable.prototype.subscribeCore = function (o) {
	      var g = new CompositeDisposable(), m = new SingleAssignmentDisposable();
	      g.add(m);
	      m.setDisposable(this.source.subscribe(new MergeAllObserver(o, g)));
	      return g;
	    };

	    return MergeAllObservable;
	  }(ObservableBase));

	  var MergeAllObserver = (function (__super__) {
	    function MergeAllObserver(o, g) {
	      this.o = o;
	      this.g = g;
	      this.done = false;
	      __super__.call(this);
	    }

	    inherits(MergeAllObserver, __super__);

	    MergeAllObserver.prototype.next = function(innerSource) {
	      var sad = new SingleAssignmentDisposable();
	      this.g.add(sad);
	      isPromise(innerSource) && (innerSource = observableFromPromise(innerSource));
	      sad.setDisposable(innerSource.subscribe(new InnerObserver(this, sad)));
	    };

	    MergeAllObserver.prototype.error = function (e) {
	      this.o.onError(e);
	    };

	    MergeAllObserver.prototype.completed = function () {
	      this.done = true;
	      this.g.length === 1 && this.o.onCompleted();
	    };

	    function InnerObserver(parent, sad) {
	      this.parent = parent;
	      this.sad = sad;
	      __super__.call(this);
	    }

	    inherits(InnerObserver, __super__);

	    InnerObserver.prototype.next = function (x) {
	      this.parent.o.onNext(x);
	    };
	    InnerObserver.prototype.error = function (e) {
	      this.parent.o.onError(e);
	    };
	    InnerObserver.prototype.completed = function () {
	      this.parent.g.remove(this.sad);
	      this.parent.done && this.parent.g.length === 1 && this.parent.o.onCompleted();
	    };

	    return MergeAllObserver;
	  }(AbstractObserver));

	  /**
	  * Merges an observable sequence of observable sequences into an observable sequence.
	  * @returns {Observable} The observable sequence that merges the elements of the inner sequences.
	  */
	  observableProto.mergeAll = function () {
	    return new MergeAllObservable(this);
	  };

	  var CompositeError = Rx.CompositeError = function(errors) {
	    this.innerErrors = errors;
	    this.message = 'This contains multiple errors. Check the innerErrors';
	    Error.call(this);
	  };
	  CompositeError.prototype = Object.create(Error.prototype);
	  CompositeError.prototype.name = 'CompositeError';

	  var MergeDelayErrorObservable = (function(__super__) {
	    inherits(MergeDelayErrorObservable, __super__);
	    function MergeDelayErrorObservable(source) {
	      this.source = source;
	      __super__.call(this);
	    }

	    MergeDelayErrorObservable.prototype.subscribeCore = function (o) {
	      var group = new CompositeDisposable(),
	        m = new SingleAssignmentDisposable(),
	        state = { isStopped: false, errors: [], o: o };

	      group.add(m);
	      m.setDisposable(this.source.subscribe(new MergeDelayErrorObserver(group, state)));

	      return group;
	    };

	    return MergeDelayErrorObservable;
	  }(ObservableBase));

	  var MergeDelayErrorObserver = (function(__super__) {
	    inherits(MergeDelayErrorObserver, __super__);
	    function MergeDelayErrorObserver(group, state) {
	      this._group = group;
	      this._state = state;
	      __super__.call(this);
	    }

	    function setCompletion(o, errors) {
	      if (errors.length === 0) {
	        o.onCompleted();
	      } else if (errors.length === 1) {
	        o.onError(errors[0]);
	      } else {
	        o.onError(new CompositeError(errors));
	      }
	    }

	    MergeDelayErrorObserver.prototype.next = function (x) {
	      var inner = new SingleAssignmentDisposable();
	      this._group.add(inner);

	      // Check for promises support
	      isPromise(x) && (x = observableFromPromise(x));
	      inner.setDisposable(x.subscribe(new InnerObserver(inner, this._group, this._state)));
	    };

	    MergeDelayErrorObserver.prototype.error = function (e) {
	      this._state.errors.push(e);
	      this._state.isStopped = true;
	      this._group.length === 1 && setCompletion(this._state.o, this._state.errors);
	    };

	    MergeDelayErrorObserver.prototype.completed = function () {
	      this._state.isStopped = true;
	      this._group.length === 1 && setCompletion(this._state.o, this._state.errors);
	    };

	    inherits(InnerObserver, __super__);
	    function InnerObserver(inner, group, state) {
	      this._inner = inner;
	      this._group = group;
	      this._state = state;
	      __super__.call(this);
	    }

	    InnerObserver.prototype.next = function (x) { this._state.o.onNext(x); };
	    InnerObserver.prototype.error = function (e) {
	      this._state.errors.push(e);
	      this._group.remove(this._inner);
	      this._state.isStopped && this._group.length === 1 && setCompletion(this._state.o, this._state.errors);
	    };
	    InnerObserver.prototype.completed = function () {
	      this._group.remove(this._inner);
	      this._state.isStopped && this._group.length === 1 && setCompletion(this._state.o, this._state.errors);
	    };

	    return MergeDelayErrorObserver;
	  }(AbstractObserver));

	  /**
	  * Flattens an Observable that emits Observables into one Observable, in a way that allows an Observer to
	  * receive all successfully emitted items from all of the source Observables without being interrupted by
	  * an error notification from one of them.
	  *
	  * This behaves like Observable.prototype.mergeAll except that if any of the merged Observables notify of an
	  * error via the Observer's onError, mergeDelayError will refrain from propagating that
	  * error notification until all of the merged Observables have finished emitting items.
	  * @param {Array | Arguments} args Arguments or an array to merge.
	  * @returns {Observable} an Observable that emits all of the items emitted by the Observables emitted by the Observable
	  */
	  Observable.mergeDelayError = function() {
	    var args;
	    if (Array.isArray(arguments[0])) {
	      args = arguments[0];
	    } else {
	      var len = arguments.length;
	      args = new Array(len);
	      for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    }
	    var source = observableOf(null, args);
	    return new MergeDelayErrorObservable(source);
	  };

	  /**
	   * Continues an observable sequence that is terminated normally or by an exception with the next observable sequence.
	   * @param {Observable} second Second observable sequence used to produce results after the first sequence terminates.
	   * @returns {Observable} An observable sequence that concatenates the first and second sequence, even if the first sequence terminates exceptionally.
	   */
	  observableProto.onErrorResumeNext = function (second) {
	    if (!second) { throw new Error('Second observable is required'); }
	    return onErrorResumeNext([this, second]);
	  };

	  var OnErrorResumeNextObservable = (function(__super__) {
	    inherits(OnErrorResumeNextObservable, __super__);
	    function OnErrorResumeNextObservable(sources) {
	      this.sources = sources;
	      __super__.call(this);
	    }

	    function scheduleMethod(state, recurse) {
	      if (state.pos < state.sources.length) {
	        var current = state.sources[state.pos++];
	        isPromise(current) && (current = observableFromPromise(current));
	        var d = new SingleAssignmentDisposable();
	        state.subscription.setDisposable(d);
	        d.setDisposable(current.subscribe(new OnErrorResumeNextObserver(state, recurse)));
	      } else {
	        state.o.onCompleted();
	      }
	    }

	    OnErrorResumeNextObservable.prototype.subscribeCore = function (o) {
	      var subscription = new SerialDisposable(),
	          state = {pos: 0, subscription: subscription, o: o, sources: this.sources },
	          cancellable = immediateScheduler.scheduleRecursive(state, scheduleMethod);

	      return new BinaryDisposable(subscription, cancellable);
	    };

	    return OnErrorResumeNextObservable;
	  }(ObservableBase));

	  var OnErrorResumeNextObserver = (function(__super__) {
	    inherits(OnErrorResumeNextObserver, __super__);
	    function OnErrorResumeNextObserver(state, recurse) {
	      this._state = state;
	      this._recurse = recurse;
	      __super__.call(this);
	    }

	    OnErrorResumeNextObserver.prototype.next = function (x) { this._state.o.onNext(x); };
	    OnErrorResumeNextObserver.prototype.error = function () { this._recurse(this._state); };
	    OnErrorResumeNextObserver.prototype.completed = function () { this._recurse(this._state); };

	    return OnErrorResumeNextObserver;
	  }(AbstractObserver));

	  /**
	   * Continues an observable sequence that is terminated normally or by an exception with the next observable sequence.
	   * @returns {Observable} An observable sequence that concatenates the source sequences, even if a sequence terminates exceptionally.
	   */
	  var onErrorResumeNext = Observable.onErrorResumeNext = function () {
	    var sources = [];
	    if (Array.isArray(arguments[0])) {
	      sources = arguments[0];
	    } else {
	      var len = arguments.length;
	      sources = new Array(len);
	      for(var i = 0; i < len; i++) { sources[i] = arguments[i]; }
	    }
	    return new OnErrorResumeNextObservable(sources);
	  };

	  var SkipUntilObservable = (function(__super__) {
	    inherits(SkipUntilObservable, __super__);

	    function SkipUntilObservable(source, other) {
	      this._s = source;
	      this._o = isPromise(other) ? observableFromPromise(other) : other;
	      this._open = false;
	      __super__.call(this);
	    }

	    SkipUntilObservable.prototype.subscribeCore = function(o) {
	      var leftSubscription = new SingleAssignmentDisposable();
	      leftSubscription.setDisposable(this._s.subscribe(new SkipUntilSourceObserver(o, this)));

	      isPromise(this._o) && (this._o = observableFromPromise(this._o));

	      var rightSubscription = new SingleAssignmentDisposable();
	      rightSubscription.setDisposable(this._o.subscribe(new SkipUntilOtherObserver(o, this, rightSubscription)));

	      return new BinaryDisposable(leftSubscription, rightSubscription);
	    };

	    return SkipUntilObservable;
	  }(ObservableBase));

	  var SkipUntilSourceObserver = (function(__super__) {
	    inherits(SkipUntilSourceObserver, __super__);
	    function SkipUntilSourceObserver(o, p) {
	      this._o = o;
	      this._p = p;
	      __super__.call(this);
	    }

	    SkipUntilSourceObserver.prototype.next = function (x) {
	      this._p._open && this._o.onNext(x);
	    };

	    SkipUntilSourceObserver.prototype.error = function (err) {
	      this._o.onError(err);
	    };

	    SkipUntilSourceObserver.prototype.onCompleted = function () {
	      this._p._open && this._o.onCompleted();
	    };

	    return SkipUntilSourceObserver;
	  }(AbstractObserver));

	  var SkipUntilOtherObserver = (function(__super__) {
	    inherits(SkipUntilOtherObserver, __super__);
	    function SkipUntilOtherObserver(o, p, r) {
	      this._o = o;
	      this._p = p;
	      this._r = r;
	      __super__.call(this);
	    }

	    SkipUntilOtherObserver.prototype.next = function () {
	      this._p._open = true;
	      this._r.dispose();
	    };

	    SkipUntilOtherObserver.prototype.error = function (err) {
	      this._o.onError(err);
	    };

	    SkipUntilOtherObserver.prototype.onCompleted = function () {
	      this._r.dispose();
	    };

	    return SkipUntilOtherObserver;
	  }(AbstractObserver));

	  /**
	   * Returns the values from the source observable sequence only after the other observable sequence produces a value.
	   * @param {Observable | Promise} other The observable sequence or Promise that triggers propagation of elements of the source sequence.
	   * @returns {Observable} An observable sequence containing the elements of the source sequence starting from the point the other sequence triggered propagation.
	   */
	  observableProto.skipUntil = function (other) {
	    return new SkipUntilObservable(this, other);
	  };

	  var SwitchObservable = (function(__super__) {
	    inherits(SwitchObservable, __super__);
	    function SwitchObservable(source) {
	      this.source = source;
	      __super__.call(this);
	    }

	    SwitchObservable.prototype.subscribeCore = function (o) {
	      var inner = new SerialDisposable(), s = this.source.subscribe(new SwitchObserver(o, inner));
	      return new BinaryDisposable(s, inner);
	    };

	    inherits(SwitchObserver, AbstractObserver);
	    function SwitchObserver(o, inner) {
	      this.o = o;
	      this.inner = inner;
	      this.stopped = false;
	      this.latest = 0;
	      this.hasLatest = false;
	      AbstractObserver.call(this);
	    }

	    SwitchObserver.prototype.next = function (innerSource) {
	      var d = new SingleAssignmentDisposable(), id = ++this.latest;
	      this.hasLatest = true;
	      this.inner.setDisposable(d);
	      isPromise(innerSource) && (innerSource = observableFromPromise(innerSource));
	      d.setDisposable(innerSource.subscribe(new InnerObserver(this, id)));
	    };

	    SwitchObserver.prototype.error = function (e) {
	      this.o.onError(e);
	    };

	    SwitchObserver.prototype.completed = function () {
	      this.stopped = true;
	      !this.hasLatest && this.o.onCompleted();
	    };

	    inherits(InnerObserver, AbstractObserver);
	    function InnerObserver(parent, id) {
	      this.parent = parent;
	      this.id = id;
	      AbstractObserver.call(this);
	    }
	    InnerObserver.prototype.next = function (x) {
	      this.parent.latest === this.id && this.parent.o.onNext(x);
	    };

	    InnerObserver.prototype.error = function (e) {
	      this.parent.latest === this.id && this.parent.o.onError(e);
	    };

	    InnerObserver.prototype.completed = function () {
	      if (this.parent.latest === this.id) {
	        this.parent.hasLatest = false;
	        this.parent.stopped && this.parent.o.onCompleted();
	      }
	    };

	    return SwitchObservable;
	  }(ObservableBase));

	  /**
	  * Transforms an observable sequence of observable sequences into an observable sequence producing values only from the most recent observable sequence.
	  * @returns {Observable} The observable sequence that at any point in time produces the elements of the most recent inner observable sequence that has been received.
	  */
	  observableProto['switch'] = observableProto.switchLatest = function () {
	    return new SwitchObservable(this);
	  };

	  var TakeUntilObservable = (function(__super__) {
	    inherits(TakeUntilObservable, __super__);

	    function TakeUntilObservable(source, other) {
	      this.source = source;
	      this.other = isPromise(other) ? observableFromPromise(other) : other;
	      __super__.call(this);
	    }

	    TakeUntilObservable.prototype.subscribeCore = function(o) {
	      return new BinaryDisposable(
	        this.source.subscribe(o),
	        this.other.subscribe(new TakeUntilObserver(o))
	      );
	    };

	    return TakeUntilObservable;
	  }(ObservableBase));

	  var TakeUntilObserver = (function(__super__) {
	    inherits(TakeUntilObserver, __super__);
	    function TakeUntilObserver(o) {
	      this._o = o;
	      __super__.call(this);
	    }

	    TakeUntilObserver.prototype.next = function () {
	      this._o.onCompleted();
	    };

	    TakeUntilObserver.prototype.error = function (err) {
	      this._o.onError(err);
	    };

	    TakeUntilObserver.prototype.onCompleted = noop;

	    return TakeUntilObserver;
	  }(AbstractObserver));

	  /**
	   * Returns the values from the source observable sequence until the other observable sequence produces a value.
	   * @param {Observable | Promise} other Observable sequence or Promise that terminates propagation of elements of the source sequence.
	   * @returns {Observable} An observable sequence containing the elements of the source sequence up to the point the other sequence interrupted further propagation.
	   */
	  observableProto.takeUntil = function (other) {
	    return new TakeUntilObservable(this, other);
	  };

	  function falseFactory() { return false; }
	  function argumentsToArray() {
	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    return args;
	  }

	  var WithLatestFromObservable = (function(__super__) {
	    inherits(WithLatestFromObservable, __super__);
	    function WithLatestFromObservable(source, sources, resultSelector) {
	      this._s = source;
	      this._ss = sources;
	      this._cb = resultSelector;
	      __super__.call(this);
	    }

	    WithLatestFromObservable.prototype.subscribeCore = function (o) {
	      var len = this._ss.length;
	      var state = {
	        hasValue: arrayInitialize(len, falseFactory),
	        hasValueAll: false,
	        values: new Array(len)
	      };

	      var n = this._ss.length, subscriptions = new Array(n + 1);
	      for (var i = 0; i < n; i++) {
	        var other = this._ss[i], sad = new SingleAssignmentDisposable();
	        isPromise(other) && (other = observableFromPromise(other));
	        sad.setDisposable(other.subscribe(new WithLatestFromOtherObserver(o, i, state)));
	        subscriptions[i] = sad;
	      }

	      var outerSad = new SingleAssignmentDisposable();
	      outerSad.setDisposable(this._s.subscribe(new WithLatestFromSourceObserver(o, this._cb, state)));
	      subscriptions[n] = outerSad;

	      return new NAryDisposable(subscriptions);
	    };

	    return WithLatestFromObservable;
	  }(ObservableBase));

	  var WithLatestFromOtherObserver = (function (__super__) {
	    inherits(WithLatestFromOtherObserver, __super__);
	    function WithLatestFromOtherObserver(o, i, state) {
	      this._o = o;
	      this._i = i;
	      this._state = state;
	      __super__.call(this);
	    }

	    WithLatestFromOtherObserver.prototype.next = function (x) {
	      this._state.values[this._i] = x;
	      this._state.hasValue[this._i] = true;
	      this._state.hasValueAll = this._state.hasValue.every(identity);
	    };

	    WithLatestFromOtherObserver.prototype.error = function (e) {
	      this._o.onError(e);
	    };

	    WithLatestFromOtherObserver.prototype.completed = noop;

	    return WithLatestFromOtherObserver;
	  }(AbstractObserver));

	  var WithLatestFromSourceObserver = (function (__super__) {
	    inherits(WithLatestFromSourceObserver, __super__);
	    function WithLatestFromSourceObserver(o, cb, state) {
	      this._o = o;
	      this._cb = cb;
	      this._state = state;
	      __super__.call(this);
	    }

	    WithLatestFromSourceObserver.prototype.next = function (x) {
	      var allValues = [x].concat(this._state.values);
	      if (!this._state.hasValueAll) { return; }
	      var res = tryCatch(this._cb).apply(null, allValues);
	      if (res === errorObj) { return this._o.onError(res.e); }
	      this._o.onNext(res);
	    };

	    WithLatestFromSourceObserver.prototype.error = function (e) {
	      this._o.onError(e);
	    };

	    WithLatestFromSourceObserver.prototype.completed = function () {
	      this._o.onCompleted();
	    };

	    return WithLatestFromSourceObserver;
	  }(AbstractObserver));

	  /**
	   * Merges the specified observable sequences into one observable sequence by using the selector function only when the (first) source observable sequence produces an element.
	   * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
	   */
	  observableProto.withLatestFrom = function () {
	    if (arguments.length === 0) { throw new Error('invalid arguments'); }

	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    var resultSelector = isFunction(args[len - 1]) ? args.pop() : argumentsToArray;
	    Array.isArray(args[0]) && (args = args[0]);

	    return new WithLatestFromObservable(this, args, resultSelector);
	  };

	  function falseFactory() { return false; }
	  function emptyArrayFactory() { return []; }

	  var ZipObservable = (function(__super__) {
	    inherits(ZipObservable, __super__);
	    function ZipObservable(sources, resultSelector) {
	      this._s = sources;
	      this._cb = resultSelector;
	      __super__.call(this);
	    }

	    ZipObservable.prototype.subscribeCore = function(observer) {
	      var n = this._s.length,
	          subscriptions = new Array(n),
	          done = arrayInitialize(n, falseFactory),
	          q = arrayInitialize(n, emptyArrayFactory);

	      for (var i = 0; i < n; i++) {
	        var source = this._s[i], sad = new SingleAssignmentDisposable();
	        subscriptions[i] = sad;
	        isPromise(source) && (source = observableFromPromise(source));
	        sad.setDisposable(source.subscribe(new ZipObserver(observer, i, this, q, done)));
	      }

	      return new NAryDisposable(subscriptions);
	    };

	    return ZipObservable;
	  }(ObservableBase));

	  var ZipObserver = (function (__super__) {
	    inherits(ZipObserver, __super__);
	    function ZipObserver(o, i, p, q, d) {
	      this._o = o;
	      this._i = i;
	      this._p = p;
	      this._q = q;
	      this._d = d;
	      __super__.call(this);
	    }

	    function notEmpty(x) { return x.length > 0; }
	    function shiftEach(x) { return x.shift(); }
	    function notTheSame(i) {
	      return function (x, j) {
	        return j !== i;
	      };
	    }

	    ZipObserver.prototype.next = function (x) {
	      this._q[this._i].push(x);
	      if (this._q.every(notEmpty)) {
	        var queuedValues = this._q.map(shiftEach);
	        var res = tryCatch(this._p._cb).apply(null, queuedValues);
	        if (res === errorObj) { return this._o.onError(res.e); }
	        this._o.onNext(res);
	      } else if (this._d.filter(notTheSame(this._i)).every(identity)) {
	        this._o.onCompleted();
	      }
	    };

	    ZipObserver.prototype.error = function (e) {
	      this._o.onError(e);
	    };

	    ZipObserver.prototype.completed = function () {
	      this._d[this._i] = true;
	      this._d.every(identity) && this._o.onCompleted();
	    };

	    return ZipObserver;
	  }(AbstractObserver));

	  /**
	   * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences or an array have produced an element at a corresponding index.
	   * The last element in the arguments must be a function to invoke for each series of elements at corresponding indexes in the args.
	   * @returns {Observable} An observable sequence containing the result of combining elements of the args using the specified result selector function.
	   */
	  observableProto.zip = function () {
	    if (arguments.length === 0) { throw new Error('invalid arguments'); }

	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    var resultSelector = isFunction(args[len - 1]) ? args.pop() : argumentsToArray;
	    Array.isArray(args[0]) && (args = args[0]);

	    var parent = this;
	    args.unshift(parent);

	    return new ZipObservable(args, resultSelector);
	  };

	  /**
	   * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences have produced an element at a corresponding index.
	   * @param arguments Observable sources.
	   * @param {Function} resultSelector Function to invoke for each series of elements at corresponding indexes in the sources.
	   * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
	   */
	  Observable.zip = function () {
	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    if (Array.isArray(args[0])) {
	      args = isFunction(args[1]) ? args[0].concat(args[1]) : args[0];
	    }
	    var first = args.shift();
	    return first.zip.apply(first, args);
	  };

	function falseFactory() { return false; }
	function emptyArrayFactory() { return []; }
	function argumentsToArray() {
	  var len = arguments.length, args = new Array(len);
	  for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	  return args;
	}

	var ZipIterableObservable = (function(__super__) {
	  inherits(ZipIterableObservable, __super__);
	  function ZipIterableObservable(sources, cb) {
	    this.sources = sources;
	    this._cb = cb;
	    __super__.call(this);
	  }

	  ZipIterableObservable.prototype.subscribeCore = function (o) {
	    var sources = this.sources, len = sources.length, subscriptions = new Array(len);

	    var state = {
	      q: arrayInitialize(len, emptyArrayFactory),
	      done: arrayInitialize(len, falseFactory),
	      cb: this._cb,
	      o: o
	    };

	    for (var i = 0; i < len; i++) {
	      (function (i) {
	        var source = sources[i], sad = new SingleAssignmentDisposable();
	        (isArrayLike(source) || isIterable(source)) && (source = observableFrom(source));

	        subscriptions[i] = sad;
	        sad.setDisposable(source.subscribe(new ZipIterableObserver(state, i)));
	      }(i));
	    }

	    return new NAryDisposable(subscriptions);
	  };

	  return ZipIterableObservable;
	}(ObservableBase));

	var ZipIterableObserver = (function (__super__) {
	  inherits(ZipIterableObserver, __super__);
	  function ZipIterableObserver(s, i) {
	    this._s = s;
	    this._i = i;
	    __super__.call(this);
	  }

	  function notEmpty(x) { return x.length > 0; }
	  function shiftEach(x) { return x.shift(); }
	  function notTheSame(i) {
	    return function (x, j) {
	      return j !== i;
	    };
	  }

	  ZipIterableObserver.prototype.next = function (x) {
	    this._s.q[this._i].push(x);
	    if (this._s.q.every(notEmpty)) {
	      var queuedValues = this._s.q.map(shiftEach),
	          res = tryCatch(this._s.cb).apply(null, queuedValues);
	      if (res === errorObj) { return this._s.o.onError(res.e); }
	      this._s.o.onNext(res);
	    } else if (this._s.done.filter(notTheSame(this._i)).every(identity)) {
	      this._s.o.onCompleted();
	    }
	  };

	  ZipIterableObserver.prototype.error = function (e) { this._s.o.onError(e); };

	  ZipIterableObserver.prototype.completed = function () {
	    this._s.done[this._i] = true;
	    this._s.done.every(identity) && this._s.o.onCompleted();
	  };

	  return ZipIterableObserver;
	}(AbstractObserver));

	/**
	 * Merges the specified observable sequences into one observable sequence by using the selector function whenever all of the observable sequences or an array have produced an element at a corresponding index.
	 * The last element in the arguments must be a function to invoke for each series of elements at corresponding indexes in the args.
	 * @returns {Observable} An observable sequence containing the result of combining elements of the args using the specified result selector function.
	 */
	observableProto.zipIterable = function () {
	  if (arguments.length === 0) { throw new Error('invalid arguments'); }

	  var len = arguments.length, args = new Array(len);
	  for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	  var resultSelector = isFunction(args[len - 1]) ? args.pop() : argumentsToArray;

	  var parent = this;
	  args.unshift(parent);
	  return new ZipIterableObservable(args, resultSelector);
	};

	  function asObservable(source) {
	    return function subscribe(o) { return source.subscribe(o); };
	  }

	  /**
	   *  Hides the identity of an observable sequence.
	   * @returns {Observable} An observable sequence that hides the identity of the source sequence.
	   */
	  observableProto.asObservable = function () {
	    return new AnonymousObservable(asObservable(this), this);
	  };

	  function toArray(x) { return x.toArray(); }
	  function notEmpty(x) { return x.length > 0; }

	  /**
	   *  Projects each element of an observable sequence into zero or more buffers which are produced based on element count information.
	   * @param {Number} count Length of each buffer.
	   * @param {Number} [skip] Number of elements to skip between creation of consecutive buffers. If not provided, defaults to the count.
	   * @returns {Observable} An observable sequence of buffers.
	   */
	  observableProto.bufferWithCount = observableProto.bufferCount = function (count, skip) {
	    typeof skip !== 'number' && (skip = count);
	    return this.windowWithCount(count, skip)
	      .flatMap(toArray)
	      .filter(notEmpty);
	  };

	  var DematerializeObservable = (function (__super__) {
	    inherits(DematerializeObservable, __super__);
	    function DematerializeObservable(source) {
	      this.source = source;
	      __super__.call(this);
	    }

	    DematerializeObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new DematerializeObserver(o));
	    };

	    return DematerializeObservable;
	  }(ObservableBase));

	  var DematerializeObserver = (function (__super__) {
	    inherits(DematerializeObserver, __super__);

	    function DematerializeObserver(o) {
	      this._o = o;
	      __super__.call(this);
	    }

	    DematerializeObserver.prototype.next = function (x) { x.accept(this._o); };
	    DematerializeObserver.prototype.error = function (e) { this._o.onError(e); };
	    DematerializeObserver.prototype.completed = function () { this._o.onCompleted(); };

	    return DematerializeObserver;
	  }(AbstractObserver));

	  /**
	   * Dematerializes the explicit notification values of an observable sequence as implicit notifications.
	   * @returns {Observable} An observable sequence exhibiting the behavior corresponding to the source sequence's notification values.
	   */
	  observableProto.dematerialize = function () {
	    return new DematerializeObservable(this);
	  };

	  var DistinctUntilChangedObservable = (function(__super__) {
	    inherits(DistinctUntilChangedObservable, __super__);
	    function DistinctUntilChangedObservable(source, keyFn, comparer) {
	      this.source = source;
	      this.keyFn = keyFn;
	      this.comparer = comparer;
	      __super__.call(this);
	    }

	    DistinctUntilChangedObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new DistinctUntilChangedObserver(o, this.keyFn, this.comparer));
	    };

	    return DistinctUntilChangedObservable;
	  }(ObservableBase));

	  var DistinctUntilChangedObserver = (function(__super__) {
	    inherits(DistinctUntilChangedObserver, __super__);
	    function DistinctUntilChangedObserver(o, keyFn, comparer) {
	      this.o = o;
	      this.keyFn = keyFn;
	      this.comparer = comparer;
	      this.hasCurrentKey = false;
	      this.currentKey = null;
	      __super__.call(this);
	    }

	    DistinctUntilChangedObserver.prototype.next = function (x) {
	      var key = x, comparerEquals;
	      if (isFunction(this.keyFn)) {
	        key = tryCatch(this.keyFn)(x);
	        if (key === errorObj) { return this.o.onError(key.e); }
	      }
	      if (this.hasCurrentKey) {
	        comparerEquals = tryCatch(this.comparer)(this.currentKey, key);
	        if (comparerEquals === errorObj) { return this.o.onError(comparerEquals.e); }
	      }
	      if (!this.hasCurrentKey || !comparerEquals) {
	        this.hasCurrentKey = true;
	        this.currentKey = key;
	        this.o.onNext(x);
	      }
	    };
	    DistinctUntilChangedObserver.prototype.error = function(e) {
	      this.o.onError(e);
	    };
	    DistinctUntilChangedObserver.prototype.completed = function () {
	      this.o.onCompleted();
	    };

	    return DistinctUntilChangedObserver;
	  }(AbstractObserver));

	  /**
	  *  Returns an observable sequence that contains only distinct contiguous elements according to the keyFn and the comparer.
	  * @param {Function} [keyFn] A function to compute the comparison key for each element. If not provided, it projects the value.
	  * @param {Function} [comparer] Equality comparer for computed key values. If not provided, defaults to an equality comparer function.
	  * @returns {Observable} An observable sequence only containing the distinct contiguous elements, based on a computed key value, from the source sequence.
	  */
	  observableProto.distinctUntilChanged = function (keyFn, comparer) {
	    comparer || (comparer = defaultComparer);
	    return new DistinctUntilChangedObservable(this, keyFn, comparer);
	  };

	  var TapObservable = (function(__super__) {
	    inherits(TapObservable,__super__);
	    function TapObservable(source, observerOrOnNext, onError, onCompleted) {
	      this.source = source;
	      this._oN = observerOrOnNext;
	      this._oE = onError;
	      this._oC = onCompleted;
	      __super__.call(this);
	    }

	    TapObservable.prototype.subscribeCore = function(o) {
	      return this.source.subscribe(new InnerObserver(o, this));
	    };

	    inherits(InnerObserver, AbstractObserver);
	    function InnerObserver(o, p) {
	      this.o = o;
	      this.t = !p._oN || isFunction(p._oN) ?
	        observerCreate(p._oN || noop, p._oE || noop, p._oC || noop) :
	        p._oN;
	      this.isStopped = false;
	      AbstractObserver.call(this);
	    }
	    InnerObserver.prototype.next = function(x) {
	      var res = tryCatch(this.t.onNext).call(this.t, x);
	      if (res === errorObj) { this.o.onError(res.e); }
	      this.o.onNext(x);
	    };
	    InnerObserver.prototype.error = function(err) {
	      var res = tryCatch(this.t.onError).call(this.t, err);
	      if (res === errorObj) { return this.o.onError(res.e); }
	      this.o.onError(err);
	    };
	    InnerObserver.prototype.completed = function() {
	      var res = tryCatch(this.t.onCompleted).call(this.t);
	      if (res === errorObj) { return this.o.onError(res.e); }
	      this.o.onCompleted();
	    };

	    return TapObservable;
	  }(ObservableBase));

	  /**
	  *  Invokes an action for each element in the observable sequence and invokes an action upon graceful or exceptional termination of the observable sequence.
	  *  This method can be used for debugging, logging, etc. of query behavior by intercepting the message stream to run arbitrary actions for messages on the pipeline.
	  * @param {Function | Observer} observerOrOnNext Action to invoke for each element in the observable sequence or an o.
	  * @param {Function} [onError]  Action to invoke upon exceptional termination of the observable sequence. Used if only the observerOrOnNext parameter is also a function.
	  * @param {Function} [onCompleted]  Action to invoke upon graceful termination of the observable sequence. Used if only the observerOrOnNext parameter is also a function.
	  * @returns {Observable} The source sequence with the side-effecting behavior applied.
	  */
	  observableProto['do'] = observableProto.tap = observableProto.doAction = function (observerOrOnNext, onError, onCompleted) {
	    return new TapObservable(this, observerOrOnNext, onError, onCompleted);
	  };

	  /**
	  *  Invokes an action for each element in the observable sequence.
	  *  This method can be used for debugging, logging, etc. of query behavior by intercepting the message stream to run arbitrary actions for messages on the pipeline.
	  * @param {Function} onNext Action to invoke for each element in the observable sequence.
	  * @param {Any} [thisArg] Object to use as this when executing callback.
	  * @returns {Observable} The source sequence with the side-effecting behavior applied.
	  */
	  observableProto.doOnNext = observableProto.tapOnNext = function (onNext, thisArg) {
	    return this.tap(typeof thisArg !== 'undefined' ? function (x) { onNext.call(thisArg, x); } : onNext);
	  };

	  /**
	  *  Invokes an action upon exceptional termination of the observable sequence.
	  *  This method can be used for debugging, logging, etc. of query behavior by intercepting the message stream to run arbitrary actions for messages on the pipeline.
	  * @param {Function} onError Action to invoke upon exceptional termination of the observable sequence.
	  * @param {Any} [thisArg] Object to use as this when executing callback.
	  * @returns {Observable} The source sequence with the side-effecting behavior applied.
	  */
	  observableProto.doOnError = observableProto.tapOnError = function (onError, thisArg) {
	    return this.tap(noop, typeof thisArg !== 'undefined' ? function (e) { onError.call(thisArg, e); } : onError);
	  };

	  /**
	  *  Invokes an action upon graceful termination of the observable sequence.
	  *  This method can be used for debugging, logging, etc. of query behavior by intercepting the message stream to run arbitrary actions for messages on the pipeline.
	  * @param {Function} onCompleted Action to invoke upon graceful termination of the observable sequence.
	  * @param {Any} [thisArg] Object to use as this when executing callback.
	  * @returns {Observable} The source sequence with the side-effecting behavior applied.
	  */
	  observableProto.doOnCompleted = observableProto.tapOnCompleted = function (onCompleted, thisArg) {
	    return this.tap(noop, null, typeof thisArg !== 'undefined' ? function () { onCompleted.call(thisArg); } : onCompleted);
	  };

	  var FinallyObservable = (function (__super__) {
	    inherits(FinallyObservable, __super__);
	    function FinallyObservable(source, fn, thisArg) {
	      this.source = source;
	      this._fn = bindCallback(fn, thisArg, 0);
	      __super__.call(this);
	    }

	    FinallyObservable.prototype.subscribeCore = function (o) {
	      var d = tryCatch(this.source.subscribe).call(this.source, o);
	      if (d === errorObj) {
	        this._fn();
	        thrower(d.e);
	      }

	      return new FinallyDisposable(d, this._fn);
	    };

	    function FinallyDisposable(s, fn) {
	      this.isDisposed = false;
	      this._s = s;
	      this._fn = fn;
	    }
	    FinallyDisposable.prototype.dispose = function () {
	      if (!this.isDisposed) {
	        var res = tryCatch(this._s.dispose).call(this._s);
	        this._fn();
	        res === errorObj && thrower(res.e);
	      }
	    };

	    return FinallyObservable;

	  }(ObservableBase));

	  /**
	   *  Invokes a specified action after the source observable sequence terminates gracefully or exceptionally.
	   * @param {Function} finallyAction Action to invoke after the source observable sequence terminates.
	   * @returns {Observable} Source sequence with the action-invoking termination behavior applied.
	   */
	  observableProto['finally'] = function (action, thisArg) {
	    return new FinallyObservable(this, action, thisArg);
	  };

	  var IgnoreElementsObservable = (function(__super__) {
	    inherits(IgnoreElementsObservable, __super__);

	    function IgnoreElementsObservable(source) {
	      this.source = source;
	      __super__.call(this);
	    }

	    IgnoreElementsObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new InnerObserver(o));
	    };

	    function InnerObserver(o) {
	      this.o = o;
	      this.isStopped = false;
	    }
	    InnerObserver.prototype.onNext = noop;
	    InnerObserver.prototype.onError = function (err) {
	      if(!this.isStopped) {
	        this.isStopped = true;
	        this.o.onError(err);
	      }
	    };
	    InnerObserver.prototype.onCompleted = function () {
	      if(!this.isStopped) {
	        this.isStopped = true;
	        this.o.onCompleted();
	      }
	    };
	    InnerObserver.prototype.dispose = function() { this.isStopped = true; };
	    InnerObserver.prototype.fail = function (e) {
	      if (!this.isStopped) {
	        this.isStopped = true;
	        this.observer.onError(e);
	        return true;
	      }

	      return false;
	    };

	    return IgnoreElementsObservable;
	  }(ObservableBase));

	  /**
	   *  Ignores all elements in an observable sequence leaving only the termination messages.
	   * @returns {Observable} An empty observable sequence that signals termination, successful or exceptional, of the source sequence.
	   */
	  observableProto.ignoreElements = function () {
	    return new IgnoreElementsObservable(this);
	  };

	  var MaterializeObservable = (function (__super__) {
	    inherits(MaterializeObservable, __super__);
	    function MaterializeObservable(source, fn) {
	      this.source = source;
	      __super__.call(this);
	    }

	    MaterializeObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new MaterializeObserver(o));
	    };

	    return MaterializeObservable;
	  }(ObservableBase));

	  var MaterializeObserver = (function (__super__) {
	    inherits(MaterializeObserver, __super__);

	    function MaterializeObserver(o) {
	      this._o = o;
	      __super__.call(this);
	    }

	    MaterializeObserver.prototype.next = function (x) { this._o.onNext(notificationCreateOnNext(x)) };
	    MaterializeObserver.prototype.error = function (e) { this._o.onNext(notificationCreateOnError(e)); this._o.onCompleted(); };
	    MaterializeObserver.prototype.completed = function () { this._o.onNext(notificationCreateOnCompleted()); this._o.onCompleted(); };

	    return MaterializeObserver;
	  }(AbstractObserver));

	  /**
	   *  Materializes the implicit notifications of an observable sequence as explicit notification values.
	   * @returns {Observable} An observable sequence containing the materialized notification values from the source sequence.
	   */
	  observableProto.materialize = function () {
	    return new MaterializeObservable(this);
	  };

	  /**
	   *  Repeats the observable sequence a specified number of times. If the repeat count is not specified, the sequence repeats indefinitely.
	   * @param {Number} [repeatCount]  Number of times to repeat the sequence. If not provided, repeats the sequence indefinitely.
	   * @returns {Observable} The observable sequence producing the elements of the given sequence repeatedly.
	   */
	  observableProto.repeat = function (repeatCount) {
	    return enumerableRepeat(this, repeatCount).concat();
	  };

	  /**
	   *  Repeats the source observable sequence the specified number of times or until it successfully terminates. If the retry count is not specified, it retries indefinitely.
	   *  Note if you encounter an error and want it to retry once, then you must use .retry(2);
	   *
	   * @example
	   *  var res = retried = retry.repeat();
	   *  var res = retried = retry.repeat(2);
	   * @param {Number} [retryCount]  Number of times to retry the sequence. If not provided, retry the sequence indefinitely.
	   * @returns {Observable} An observable sequence producing the elements of the given sequence repeatedly until it terminates successfully.
	   */
	  observableProto.retry = function (retryCount) {
	    return enumerableRepeat(this, retryCount).catchError();
	  };

	  function repeat(value) {
	    return {
	      '@@iterator': function () {
	        return {
	          next: function () {
	            return { done: false, value: value };
	          }
	        };
	      }
	    };
	  }

	  var RetryWhenObservable = (function(__super__) {
	    function createDisposable(state) {
	      return {
	        isDisposed: false,
	        dispose: function () {
	          if (!this.isDisposed) {
	            this.isDisposed = true;
	            state.isDisposed = true;
	          }
	        }
	      };
	    }

	    function RetryWhenObservable(source, notifier) {
	      this.source = source;
	      this._notifier = notifier;
	      __super__.call(this);
	    }

	    inherits(RetryWhenObservable, __super__);

	    RetryWhenObservable.prototype.subscribeCore = function (o) {
	      var exceptions = new Subject(),
	        notifier = new Subject(),
	        handled = this._notifier(exceptions),
	        notificationDisposable = handled.subscribe(notifier);

	      var e = this.source['@@iterator']();

	      var state = { isDisposed: false },
	        lastError,
	        subscription = new SerialDisposable();
	      var cancelable = currentThreadScheduler.scheduleRecursive(null, function (_, recurse) {
	        if (state.isDisposed) { return; }
	        var currentItem = e.next();

	        if (currentItem.done) {
	          if (lastError) {
	            o.onError(lastError);
	          } else {
	            o.onCompleted();
	          }
	          return;
	        }

	        // Check if promise
	        var currentValue = currentItem.value;
	        isPromise(currentValue) && (currentValue = observableFromPromise(currentValue));

	        var outer = new SingleAssignmentDisposable();
	        var inner = new SingleAssignmentDisposable();
	        subscription.setDisposable(new BinaryDisposable(inner, outer));
	        outer.setDisposable(currentValue.subscribe(
	          function(x) { o.onNext(x); },
	          function (exn) {
	            inner.setDisposable(notifier.subscribe(recurse, function(ex) {
	              o.onError(ex);
	            }, function() {
	              o.onCompleted();
	            }));

	            exceptions.onNext(exn);
	            outer.dispose();
	          },
	          function() { o.onCompleted(); }));
	      });

	      return new NAryDisposable([notificationDisposable, subscription, cancelable, createDisposable(state)]);
	    };

	    return RetryWhenObservable;
	  }(ObservableBase));

	  observableProto.retryWhen = function (notifier) {
	    return new RetryWhenObservable(repeat(this), notifier);
	  };

	  function repeat(value) {
	    return {
	      '@@iterator': function () {
	        return {
	          next: function () {
	            return { done: false, value: value };
	          }
	        };
	      }
	    };
	  }

	  var RepeatWhenObservable = (function(__super__) {
	    function createDisposable(state) {
	      return {
	        isDisposed: false,
	        dispose: function () {
	          if (!this.isDisposed) {
	            this.isDisposed = true;
	            state.isDisposed = true;
	          }
	        }
	      };
	    }

	    function RepeatWhenObservable(source, notifier) {
	      this.source = source;
	      this._notifier = notifier;
	      __super__.call(this);
	    }

	    inherits(RepeatWhenObservable, __super__);

	    RepeatWhenObservable.prototype.subscribeCore = function (o) {
	      var completions = new Subject(),
	        notifier = new Subject(),
	        handled = this._notifier(completions),
	        notificationDisposable = handled.subscribe(notifier);

	      var e = this.source['@@iterator']();

	      var state = { isDisposed: false },
	        lastError,
	        subscription = new SerialDisposable();
	      var cancelable = currentThreadScheduler.scheduleRecursive(null, function (_, recurse) {
	        if (state.isDisposed) { return; }
	        var currentItem = e.next();

	        if (currentItem.done) {
	          if (lastError) {
	            o.onError(lastError);
	          } else {
	            o.onCompleted();
	          }
	          return;
	        }

	        // Check if promise
	        var currentValue = currentItem.value;
	        isPromise(currentValue) && (currentValue = observableFromPromise(currentValue));

	        var outer = new SingleAssignmentDisposable();
	        var inner = new SingleAssignmentDisposable();
	        subscription.setDisposable(new BinaryDisposable(inner, outer));
	        outer.setDisposable(currentValue.subscribe(
	          function(x) { o.onNext(x); },
	          function (exn) { o.onError(exn); },
	          function() {
	            inner.setDisposable(notifier.subscribe(recurse, function(ex) {
	              o.onError(ex);
	            }, function() {
	              o.onCompleted();
	            }));

	            completions.onNext(null);
	            outer.dispose();
	          }));
	      });

	      return new NAryDisposable([notificationDisposable, subscription, cancelable, createDisposable(state)]);
	    };

	    return RepeatWhenObservable;
	  }(ObservableBase));

	  observableProto.repeatWhen = function (notifier) {
	    return new RepeatWhenObservable(repeat(this), notifier);
	  };

	  var ScanObservable = (function(__super__) {
	    inherits(ScanObservable, __super__);
	    function ScanObservable(source, accumulator, hasSeed, seed) {
	      this.source = source;
	      this.accumulator = accumulator;
	      this.hasSeed = hasSeed;
	      this.seed = seed;
	      __super__.call(this);
	    }

	    ScanObservable.prototype.subscribeCore = function(o) {
	      return this.source.subscribe(new ScanObserver(o,this));
	    };

	    return ScanObservable;
	  }(ObservableBase));

	  var ScanObserver = (function (__super__) {
	    inherits(ScanObserver, __super__);
	    function ScanObserver(o, parent) {
	      this._o = o;
	      this._p = parent;
	      this._fn = parent.accumulator;
	      this._hs = parent.hasSeed;
	      this._s = parent.seed;
	      this._ha = false;
	      this._a = null;
	      this._hv = false;
	      this._i = 0;
	      __super__.call(this);
	    }

	    ScanObserver.prototype.next = function (x) {
	      !this._hv && (this._hv = true);
	      if (this._ha) {
	        this._a = tryCatch(this._fn)(this._a, x, this._i, this._p);
	      } else {
	        this._a = this._hs ? tryCatch(this._fn)(this._s, x, this._i, this._p) : x;
	        this._ha = true;
	      }
	      if (this._a === errorObj) { return this._o.onError(this._a.e); }
	      this._o.onNext(this._a);
	      this._i++;
	    };

	    ScanObserver.prototype.error = function (e) {
	      this._o.onError(e);
	    };

	    ScanObserver.prototype.completed = function () {
	      !this._hv && this._hs && this._o.onNext(this._s);
	      this._o.onCompleted();
	    };

	    return ScanObserver;
	  }(AbstractObserver));

	  /**
	  *  Applies an accumulator function over an observable sequence and returns each intermediate result. The optional seed value is used as the initial accumulator value.
	  *  For aggregation behavior with no intermediate results, see Observable.aggregate.
	  * @param {Mixed} [seed] The initial accumulator value.
	  * @param {Function} accumulator An accumulator function to be invoked on each element.
	  * @returns {Observable} An observable sequence containing the accumulated values.
	  */
	  observableProto.scan = function () {
	    var hasSeed = false, seed, accumulator = arguments[0];
	    if (arguments.length === 2) {
	      hasSeed = true;
	      seed = arguments[1];
	    }
	    return new ScanObservable(this, accumulator, hasSeed, seed);
	  };

	  var SkipLastObservable = (function (__super__) {
	    inherits(SkipLastObservable, __super__);
	    function SkipLastObservable(source, c) {
	      this.source = source;
	      this._c = c;
	      __super__.call(this);
	    }

	    SkipLastObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new SkipLastObserver(o, this._c));
	    };

	    return SkipLastObservable;
	  }(ObservableBase));

	  var SkipLastObserver = (function (__super__) {
	    inherits(SkipLastObserver, __super__);
	    function SkipLastObserver(o, c) {
	      this._o = o;
	      this._c = c;
	      this._q = [];
	      __super__.call(this);
	    }

	    SkipLastObserver.prototype.next = function (x) {
	      this._q.push(x);
	      this._q.length > this._c && this._o.onNext(this._q.shift());
	    };

	    SkipLastObserver.prototype.error = function (e) {
	      this._o.onError(e);
	    };

	    SkipLastObserver.prototype.completed = function () {
	      this._o.onCompleted();
	    };

	    return SkipLastObserver;
	  }(AbstractObserver));

	  /**
	   *  Bypasses a specified number of elements at the end of an observable sequence.
	   * @description
	   *  This operator accumulates a queue with a length enough to store the first `count` elements. As more elements are
	   *  received, elements are taken from the front of the queue and produced on the result sequence. This causes elements to be delayed.
	   * @param count Number of elements to bypass at the end of the source sequence.
	   * @returns {Observable} An observable sequence containing the source sequence elements except for the bypassed ones at the end.
	   */
	  observableProto.skipLast = function (count) {
	    if (count < 0) { throw new ArgumentOutOfRangeError(); }
	    return new SkipLastObservable(this, count);
	  };

	  /**
	   *  Prepends a sequence of values to an observable sequence with an optional scheduler and an argument list of values to prepend.
	   *  @example
	   *  var res = source.startWith(1, 2, 3);
	   *  var res = source.startWith(Rx.Scheduler.timeout, 1, 2, 3);
	   * @param {Arguments} args The specified values to prepend to the observable sequence
	   * @returns {Observable} The source sequence prepended with the specified values.
	   */
	  observableProto.startWith = function () {
	    var values, scheduler, start = 0;
	    if (!!arguments.length && isScheduler(arguments[0])) {
	      scheduler = arguments[0];
	      start = 1;
	    } else {
	      scheduler = immediateScheduler;
	    }
	    for(var args = [], i = start, len = arguments.length; i < len; i++) { args.push(arguments[i]); }
	    return observableConcat.apply(null, [observableFromArray(args, scheduler), this]);
	  };

	  var TakeLastObserver = (function (__super__) {
	    inherits(TakeLastObserver, __super__);
	    function TakeLastObserver(o, c) {
	      this._o = o;
	      this._c = c;
	      this._q = [];
	      __super__.call(this);
	    }

	    TakeLastObserver.prototype.next = function (x) {
	      this._q.push(x);
	      this._q.length > this._c && this._q.shift();
	    };

	    TakeLastObserver.prototype.error = function (e) {
	      this._o.onError(e);
	    };

	    TakeLastObserver.prototype.completed = function () {
	      while (this._q.length > 0) { this._o.onNext(this._q.shift()); }
	      this._o.onCompleted();
	    };

	    return TakeLastObserver;
	  }(AbstractObserver));

	  /**
	   *  Returns a specified number of contiguous elements from the end of an observable sequence.
	   * @description
	   *  This operator accumulates a buffer with a length enough to store elements count elements. Upon completion of
	   *  the source sequence, this buffer is drained on the result sequence. This causes the elements to be delayed.
	   * @param {Number} count Number of elements to take from the end of the source sequence.
	   * @returns {Observable} An observable sequence containing the specified number of elements from the end of the source sequence.
	   */
	  observableProto.takeLast = function (count) {
	    if (count < 0) { throw new ArgumentOutOfRangeError(); }
	    var source = this;
	    return new AnonymousObservable(function (o) {
	      return source.subscribe(new TakeLastObserver(o, count));
	    }, source);
	  };

	  var TakeLastBufferObserver = (function (__super__) {
	    inherits(TakeLastBufferObserver, __super__);
	    function TakeLastBufferObserver(o, c) {
	      this._o = o;
	      this._c = c;
	      this._q = [];
	      __super__.call(this);
	    }

	    TakeLastBufferObserver.prototype.next = function (x) {
	      this._q.push(x);
	      this._q.length > this._c && this._q.shift();
	    };

	    TakeLastBufferObserver.prototype.error = function (e) {
	      this._o.onError(e);
	    };

	    TakeLastBufferObserver.prototype.completed = function () {
	      this._o.onNext(this._q);
	      this._o.onCompleted();
	    };

	    return TakeLastBufferObserver;
	  }(AbstractObserver));

	  /**
	   *  Returns an array with the specified number of contiguous elements from the end of an observable sequence.
	   *
	   * @description
	   *  This operator accumulates a buffer with a length enough to store count elements. Upon completion of the
	   *  source sequence, this buffer is produced on the result sequence.
	   * @param {Number} count Number of elements to take from the end of the source sequence.
	   * @returns {Observable} An observable sequence containing a single array with the specified number of elements from the end of the source sequence.
	   */
	  observableProto.takeLastBuffer = function (count) {
	    if (count < 0) { throw new ArgumentOutOfRangeError(); }
	    var source = this;
	    return new AnonymousObservable(function (o) {
	      return source.subscribe(new TakeLastBufferObserver(o, count));
	    }, source);
	  };

	  /**
	   *  Projects each element of an observable sequence into zero or more windows which are produced based on element count information.
	   * @param {Number} count Length of each window.
	   * @param {Number} [skip] Number of elements to skip between creation of consecutive windows. If not specified, defaults to the count.
	   * @returns {Observable} An observable sequence of windows.
	   */
	  observableProto.windowWithCount = observableProto.windowCount = function (count, skip) {
	    var source = this;
	    +count || (count = 0);
	    Math.abs(count) === Infinity && (count = 0);
	    if (count <= 0) { throw new ArgumentOutOfRangeError(); }
	    skip == null && (skip = count);
	    +skip || (skip = 0);
	    Math.abs(skip) === Infinity && (skip = 0);

	    if (skip <= 0) { throw new ArgumentOutOfRangeError(); }
	    return new AnonymousObservable(function (observer) {
	      var m = new SingleAssignmentDisposable(),
	        refCountDisposable = new RefCountDisposable(m),
	        n = 0,
	        q = [];

	      function createWindow () {
	        var s = new Subject();
	        q.push(s);
	        observer.onNext(addRef(s, refCountDisposable));
	      }

	      createWindow();

	      m.setDisposable(source.subscribe(
	        function (x) {
	          for (var i = 0, len = q.length; i < len; i++) { q[i].onNext(x); }
	          var c = n - count + 1;
	          c >= 0 && c % skip === 0 && q.shift().onCompleted();
	          ++n % skip === 0 && createWindow();
	        },
	        function (e) {
	          while (q.length > 0) { q.shift().onError(e); }
	          observer.onError(e);
	        },
	        function () {
	          while (q.length > 0) { q.shift().onCompleted(); }
	          observer.onCompleted();
	        }
	      ));
	      return refCountDisposable;
	    }, source);
	  };

	  function concatMap(source, selector, thisArg) {
	    var selectorFunc = bindCallback(selector, thisArg, 3);
	    return source.map(function (x, i) {
	      var result = selectorFunc(x, i, source);
	      isPromise(result) && (result = observableFromPromise(result));
	      (isArrayLike(result) || isIterable(result)) && (result = observableFrom(result));
	      return result;
	    }).concatAll();
	  }

	  /**
	   *  One of the Following:
	   *  Projects each element of an observable sequence to an observable sequence and merges the resulting observable sequences into one observable sequence.
	   *
	   * @example
	   *  var res = source.concatMap(function (x) { return Rx.Observable.range(0, x); });
	   *  Or:
	   *  Projects each element of an observable sequence to an observable sequence, invokes the result selector for the source element and each of the corresponding inner sequence's elements, and merges the results into one observable sequence.
	   *
	   *  var res = source.concatMap(function (x) { return Rx.Observable.range(0, x); }, function (x, y) { return x + y; });
	   *  Or:
	   *  Projects each element of the source observable sequence to the other observable sequence and merges the resulting observable sequences into one observable sequence.
	   *
	   *  var res = source.concatMap(Rx.Observable.fromArray([1,2,3]));
	   * @param {Function} selector A transform function to apply to each element or an observable sequence to project each element from the
	   * source sequence onto which could be either an observable or Promise.
	   * @param {Function} [resultSelector]  A transform function to apply to each element of the intermediate sequence.
	   * @returns {Observable} An observable sequence whose elements are the result of invoking the one-to-many transform function collectionSelector on each element of the input sequence and then mapping each of those sequence elements and their corresponding source element to a result element.
	   */
	  observableProto.selectConcat = observableProto.concatMap = function (selector, resultSelector, thisArg) {
	    if (isFunction(selector) && isFunction(resultSelector)) {
	      return this.concatMap(function (x, i) {
	        var selectorResult = selector(x, i);
	        isPromise(selectorResult) && (selectorResult = observableFromPromise(selectorResult));
	        (isArrayLike(selectorResult) || isIterable(selectorResult)) && (selectorResult = observableFrom(selectorResult));

	        return selectorResult.map(function (y, i2) {
	          return resultSelector(x, y, i, i2);
	        });
	      });
	    }
	    return isFunction(selector) ?
	      concatMap(this, selector, thisArg) :
	      concatMap(this, function () { return selector; });
	  };

	  /**
	   * Projects each notification of an observable sequence to an observable sequence and concats the resulting observable sequences into one observable sequence.
	   * @param {Function} onNext A transform function to apply to each element; the second parameter of the function represents the index of the source element.
	   * @param {Function} onError A transform function to apply when an error occurs in the source sequence.
	   * @param {Function} onCompleted A transform function to apply when the end of the source sequence is reached.
	   * @param {Any} [thisArg] An optional "this" to use to invoke each transform.
	   * @returns {Observable} An observable sequence whose elements are the result of invoking the one-to-many transform function corresponding to each notification in the input sequence.
	   */
	  observableProto.concatMapObserver = observableProto.selectConcatObserver = function(onNext, onError, onCompleted, thisArg) {
	    var source = this,
	        onNextFunc = bindCallback(onNext, thisArg, 2),
	        onErrorFunc = bindCallback(onError, thisArg, 1),
	        onCompletedFunc = bindCallback(onCompleted, thisArg, 0);
	    return new AnonymousObservable(function (observer) {
	      var index = 0;
	      return source.subscribe(
	        function (x) {
	          var result;
	          try {
	            result = onNextFunc(x, index++);
	          } catch (e) {
	            observer.onError(e);
	            return;
	          }
	          isPromise(result) && (result = observableFromPromise(result));
	          observer.onNext(result);
	        },
	        function (err) {
	          var result;
	          try {
	            result = onErrorFunc(err);
	          } catch (e) {
	            observer.onError(e);
	            return;
	          }
	          isPromise(result) && (result = observableFromPromise(result));
	          observer.onNext(result);
	          observer.onCompleted();
	        },
	        function () {
	          var result;
	          try {
	            result = onCompletedFunc();
	          } catch (e) {
	            observer.onError(e);
	            return;
	          }
	          isPromise(result) && (result = observableFromPromise(result));
	          observer.onNext(result);
	          observer.onCompleted();
	        });
	    }, this).concatAll();
	  };

	  var DefaultIfEmptyObserver = (function (__super__) {
	    inherits(DefaultIfEmptyObserver, __super__);
	    function DefaultIfEmptyObserver(o, d) {
	      this._o = o;
	      this._d = d;
	      this._f = false;
	      __super__.call(this);
	    }

	    DefaultIfEmptyObserver.prototype.next = function (x) {
	      this._f = true;
	      this._o.onNext(x);
	    };

	    DefaultIfEmptyObserver.prototype.error = function (e) {
	      this._o.onError(e);
	    };

	    DefaultIfEmptyObserver.prototype.completed = function () {
	      !this._f && this._o.onNext(this._d);
	      this._o.onCompleted();
	    };

	    return DefaultIfEmptyObserver;
	  }(AbstractObserver));

	  /**
	   *  Returns the elements of the specified sequence or the specified value in a singleton sequence if the sequence is empty.
	   *
	   *  var res = obs = xs.defaultIfEmpty();
	   *  2 - obs = xs.defaultIfEmpty(false);
	   *
	   * @memberOf Observable#
	   * @param defaultValue The value to return if the sequence is empty. If not provided, this defaults to null.
	   * @returns {Observable} An observable sequence that contains the specified default value if the source is empty; otherwise, the elements of the source itself.
	   */
	    observableProto.defaultIfEmpty = function (defaultValue) {
	      var source = this;
	      defaultValue === undefined && (defaultValue = null);
	      return new AnonymousObservable(function (o) {
	        return source.subscribe(new DefaultIfEmptyObserver(o, defaultValue));
	      }, source);
	    };

	  // Swap out for Array.findIndex
	  function arrayIndexOfComparer(array, item, comparer) {
	    for (var i = 0, len = array.length; i < len; i++) {
	      if (comparer(array[i], item)) { return i; }
	    }
	    return -1;
	  }

	  function HashSet(comparer) {
	    this.comparer = comparer;
	    this.set = [];
	  }
	  HashSet.prototype.push = function(value) {
	    var retValue = arrayIndexOfComparer(this.set, value, this.comparer) === -1;
	    retValue && this.set.push(value);
	    return retValue;
	  };

	  var DistinctObservable = (function (__super__) {
	    inherits(DistinctObservable, __super__);
	    function DistinctObservable(source, keyFn, cmpFn) {
	      this.source = source;
	      this._keyFn = keyFn;
	      this._cmpFn = cmpFn;
	      __super__.call(this);
	    }

	    DistinctObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new DistinctObserver(o, this._keyFn, this._cmpFn));
	    };

	    return DistinctObservable;
	  }(ObservableBase));

	  var DistinctObserver = (function (__super__) {
	    inherits(DistinctObserver, __super__);
	    function DistinctObserver(o, keyFn, cmpFn) {
	      this._o = o;
	      this._keyFn = keyFn;
	      this._h = new HashSet(cmpFn);
	      __super__.call(this);
	    }

	    DistinctObserver.prototype.next = function (x) {
	      var key = x;
	      if (isFunction(this._keyFn)) {
	        key = tryCatch(this._keyFn)(x);
	        if (key === errorObj) { return this._o.onError(key.e); }
	      }
	      this._h.push(key) && this._o.onNext(x);
	    };

	    DistinctObserver.prototype.error = function (e) { this._o.onError(e); };
	    DistinctObserver.prototype.completed = function () { this._o.onCompleted(); };

	    return DistinctObserver;
	  }(AbstractObserver));

	  /**
	   *  Returns an observable sequence that contains only distinct elements according to the keySelector and the comparer.
	   *  Usage of this operator should be considered carefully due to the maintenance of an internal lookup structure which can grow large.
	   *
	   * @example
	   *  var res = obs = xs.distinct();
	   *  2 - obs = xs.distinct(function (x) { return x.id; });
	   *  2 - obs = xs.distinct(function (x) { return x.id; }, function (a,b) { return a === b; });
	   * @param {Function} [keySelector]  A function to compute the comparison key for each element.
	   * @param {Function} [comparer]  Used to compare items in the collection.
	   * @returns {Observable} An observable sequence only containing the distinct elements, based on a computed key value, from the source sequence.
	   */
	  observableProto.distinct = function (keySelector, comparer) {
	    comparer || (comparer = defaultComparer);
	    return new DistinctObservable(this, keySelector, comparer);
	  };

	  /**
	   *  Groups the elements of an observable sequence according to a specified key selector function and comparer and selects the resulting elements by using a specified function.
	   *
	   * @example
	   *  var res = observable.groupBy(function (x) { return x.id; });
	   *  2 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; });
	   *  3 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; }, function (x) { return x.toString(); });
	   * @param {Function} keySelector A function to extract the key for each element.
	   * @param {Function} [elementSelector]  A function to map each source element to an element in an observable group.
	   * @returns {Observable} A sequence of observable groups, each of which corresponds to a unique key value, containing all elements that share that same key value.
	   */
	  observableProto.groupBy = function (keySelector, elementSelector) {
	    return this.groupByUntil(keySelector, elementSelector, observableNever);
	  };

	    /**
	     *  Groups the elements of an observable sequence according to a specified key selector function.
	     *  A duration selector function is used to control the lifetime of groups. When a group expires, it receives an OnCompleted notification. When a new element with the same
	     *  key value as a reclaimed group occurs, the group will be reborn with a new lifetime request.
	     *
	     * @example
	     *  var res = observable.groupByUntil(function (x) { return x.id; }, null,  function () { return Rx.Observable.never(); });
	     *  2 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; },  function () { return Rx.Observable.never(); });
	     *  3 - observable.groupBy(function (x) { return x.id; }), function (x) { return x.name; },  function () { return Rx.Observable.never(); }, function (x) { return x.toString(); });
	     * @param {Function} keySelector A function to extract the key for each element.
	     * @param {Function} durationSelector A function to signal the expiration of a group.
	     * @returns {Observable}
	     *  A sequence of observable groups, each of which corresponds to a unique key value, containing all elements that share that same key value.
	     *  If a group's lifetime expires, a new group with the same key value can be created once an element with such a key value is encoutered.
	     *
	     */
	    observableProto.groupByUntil = function (keySelector, elementSelector, durationSelector) {
	      var source = this;
	      return new AnonymousObservable(function (o) {
	        var map = new Map(),
	          groupDisposable = new CompositeDisposable(),
	          refCountDisposable = new RefCountDisposable(groupDisposable),
	          handleError = function (e) { return function (item) { item.onError(e); }; };

	        groupDisposable.add(
	          source.subscribe(function (x) {
	            var key = tryCatch(keySelector)(x);
	            if (key === errorObj) {
	              map.forEach(handleError(key.e));
	              return o.onError(key.e);
	            }

	            var fireNewMapEntry = false, writer = map.get(key);
	            if (writer === undefined) {
	              writer = new Subject();
	              map.set(key, writer);
	              fireNewMapEntry = true;
	            }

	            if (fireNewMapEntry) {
	              var group = new GroupedObservable(key, writer, refCountDisposable),
	                durationGroup = new GroupedObservable(key, writer);
	              var duration = tryCatch(durationSelector)(durationGroup);
	              if (duration === errorObj) {
	                map.forEach(handleError(duration.e));
	                return o.onError(duration.e);
	              }

	              o.onNext(group);

	              var md = new SingleAssignmentDisposable();
	              groupDisposable.add(md);

	              md.setDisposable(duration.take(1).subscribe(
	                noop,
	                function (e) {
	                  map.forEach(handleError(e));
	                  o.onError(e);
	                },
	                function () {
	                  if (map['delete'](key)) { writer.onCompleted(); }
	                  groupDisposable.remove(md);
	                }));
	            }

	            var element = x;
	            if (isFunction(elementSelector)) {
	              element = tryCatch(elementSelector)(x);
	              if (element === errorObj) {
	                map.forEach(handleError(element.e));
	                return o.onError(element.e);
	              }
	            }

	            writer.onNext(element);
	        }, function (e) {
	          map.forEach(handleError(e));
	          o.onError(e);
	        }, function () {
	          map.forEach(function (item) { item.onCompleted(); });
	          o.onCompleted();
	        }));

	      return refCountDisposable;
	    }, source);
	  };

	  var MapObservable = (function (__super__) {
	    inherits(MapObservable, __super__);

	    function MapObservable(source, selector, thisArg) {
	      this.source = source;
	      this.selector = bindCallback(selector, thisArg, 3);
	      __super__.call(this);
	    }

	    function innerMap(selector, self) {
	      return function (x, i, o) { return selector.call(this, self.selector(x, i, o), i, o); };
	    }

	    MapObservable.prototype.internalMap = function (selector, thisArg) {
	      return new MapObservable(this.source, innerMap(selector, this), thisArg);
	    };

	    MapObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new InnerObserver(o, this.selector, this));
	    };

	    inherits(InnerObserver, AbstractObserver);
	    function InnerObserver(o, selector, source) {
	      this.o = o;
	      this.selector = selector;
	      this.source = source;
	      this.i = 0;
	      AbstractObserver.call(this);
	    }

	    InnerObserver.prototype.next = function(x) {
	      var result = tryCatch(this.selector)(x, this.i++, this.source);
	      if (result === errorObj) { return this.o.onError(result.e); }
	      this.o.onNext(result);
	    };

	    InnerObserver.prototype.error = function (e) {
	      this.o.onError(e);
	    };

	    InnerObserver.prototype.completed = function () {
	      this.o.onCompleted();
	    };

	    return MapObservable;

	  }(ObservableBase));

	  /**
	  * Projects each element of an observable sequence into a new form by incorporating the element's index.
	  * @param {Function} selector A transform function to apply to each source element; the second parameter of the function represents the index of the source element.
	  * @param {Any} [thisArg] Object to use as this when executing callback.
	  * @returns {Observable} An observable sequence whose elements are the result of invoking the transform function on each element of source.
	  */
	  observableProto.map = observableProto.select = function (selector, thisArg) {
	    var selectorFn = typeof selector === 'function' ? selector : function () { return selector; };
	    return this instanceof MapObservable ?
	      this.internalMap(selectorFn, thisArg) :
	      new MapObservable(this, selectorFn, thisArg);
	  };

	  function plucker(args, len) {
	    return function mapper(x) {
	      var currentProp = x;
	      for (var i = 0; i < len; i++) {
	        var p = currentProp[args[i]];
	        if (typeof p !== 'undefined') {
	          currentProp = p;
	        } else {
	          return undefined;
	        }
	      }
	      return currentProp;
	    };
	  }

	  /**
	   * Retrieves the value of a specified nested property from all elements in
	   * the Observable sequence.
	   * @param {Arguments} arguments The nested properties to pluck.
	   * @returns {Observable} Returns a new Observable sequence of property values.
	   */
	  observableProto.pluck = function () {
	    var len = arguments.length, args = new Array(len);
	    if (len === 0) { throw new Error('List of properties cannot be empty.'); }
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    return this.map(plucker(args, len));
	  };

	observableProto.flatMap = observableProto.selectMany = observableProto.mergeMap = function(selector, resultSelector, thisArg) {
	    return new FlatMapObservable(this, selector, resultSelector, thisArg).mergeAll();
	};

	  /**
	   * Projects each notification of an observable sequence to an observable sequence and merges the resulting observable sequences into one observable sequence.
	   * @param {Function} onNext A transform function to apply to each element; the second parameter of the function represents the index of the source element.
	   * @param {Function} onError A transform function to apply when an error occurs in the source sequence.
	   * @param {Function} onCompleted A transform function to apply when the end of the source sequence is reached.
	   * @param {Any} [thisArg] An optional "this" to use to invoke each transform.
	   * @returns {Observable} An observable sequence whose elements are the result of invoking the one-to-many transform function corresponding to each notification in the input sequence.
	   */
	  observableProto.flatMapObserver = observableProto.selectManyObserver = function (onNext, onError, onCompleted, thisArg) {
	    var source = this;
	    return new AnonymousObservable(function (observer) {
	      var index = 0;

	      return source.subscribe(
	        function (x) {
	          var result;
	          try {
	            result = onNext.call(thisArg, x, index++);
	          } catch (e) {
	            observer.onError(e);
	            return;
	          }
	          isPromise(result) && (result = observableFromPromise(result));
	          observer.onNext(result);
	        },
	        function (err) {
	          var result;
	          try {
	            result = onError.call(thisArg, err);
	          } catch (e) {
	            observer.onError(e);
	            return;
	          }
	          isPromise(result) && (result = observableFromPromise(result));
	          observer.onNext(result);
	          observer.onCompleted();
	        },
	        function () {
	          var result;
	          try {
	            result = onCompleted.call(thisArg);
	          } catch (e) {
	            observer.onError(e);
	            return;
	          }
	          isPromise(result) && (result = observableFromPromise(result));
	          observer.onNext(result);
	          observer.onCompleted();
	        });
	    }, source).mergeAll();
	  };

	observableProto.flatMapLatest = observableProto.switchMap = function(selector, resultSelector, thisArg) {
	    return new FlatMapObservable(this, selector, resultSelector, thisArg).switchLatest();
	};

	  var SkipObservable = (function(__super__) {
	    inherits(SkipObservable, __super__);
	    function SkipObservable(source, count) {
	      this.source = source;
	      this._count = count;
	      __super__.call(this);
	    }

	    SkipObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new SkipObserver(o, this._count));
	    };

	    function SkipObserver(o, c) {
	      this._o = o;
	      this._r = c;
	      AbstractObserver.call(this);
	    }

	    inherits(SkipObserver, AbstractObserver);

	    SkipObserver.prototype.next = function (x) {
	      if (this._r <= 0) {
	        this._o.onNext(x);
	      } else {
	        this._r--;
	      }
	    };
	    SkipObserver.prototype.error = function(e) { this._o.onError(e); };
	    SkipObserver.prototype.completed = function() { this._o.onCompleted(); };

	    return SkipObservable;
	  }(ObservableBase));

	  /**
	   * Bypasses a specified number of elements in an observable sequence and then returns the remaining elements.
	   * @param {Number} count The number of elements to skip before returning the remaining elements.
	   * @returns {Observable} An observable sequence that contains the elements that occur after the specified index in the input sequence.
	   */
	  observableProto.skip = function (count) {
	    if (count < 0) { throw new ArgumentOutOfRangeError(); }
	    return new SkipObservable(this, count);
	  };

	  var SkipWhileObservable = (function (__super__) {
	    inherits(SkipWhileObservable, __super__);
	    function SkipWhileObservable(source, fn) {
	      this.source = source;
	      this._fn = fn;
	      __super__.call(this);
	    }

	    SkipWhileObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new SkipWhileObserver(o, this));
	    };

	    return SkipWhileObservable;
	  }(ObservableBase));

	  var SkipWhileObserver = (function (__super__) {
	    inherits(SkipWhileObserver, __super__);

	    function SkipWhileObserver(o, p) {
	      this._o = o;
	      this._p = p;
	      this._i = 0;
	      this._r = false;
	      __super__.call(this);
	    }

	    SkipWhileObserver.prototype.next = function (x) {
	      if (!this._r) {
	        var res = tryCatch(this._p._fn)(x, this._i++, this._p);
	        if (res === errorObj) { return this._o.onError(res.e); }
	        this._r = !res;
	      }
	      this._r && this._o.onNext(x);
	    };
	    SkipWhileObserver.prototype.error = function (e) { this._o.onError(e); };
	    SkipWhileObserver.prototype.completed = function () { this._o.onCompleted(); };

	    return SkipWhileObserver;
	  }(AbstractObserver));

	  /**
	   *  Bypasses elements in an observable sequence as long as a specified condition is true and then returns the remaining elements.
	   *  The element's index is used in the logic of the predicate function.
	   *
	   *  var res = source.skipWhile(function (value) { return value < 10; });
	   *  var res = source.skipWhile(function (value, index) { return value < 10 || index < 10; });
	   * @param {Function} predicate A function to test each element for a condition; the second parameter of the function represents the index of the source element.
	   * @param {Any} [thisArg] Object to use as this when executing callback.
	   * @returns {Observable} An observable sequence that contains the elements from the input sequence starting at the first element in the linear series that does not pass the test specified by predicate.
	   */
	  observableProto.skipWhile = function (predicate, thisArg) {
	    var fn = bindCallback(predicate, thisArg, 3);
	    return new SkipWhileObservable(this, fn);
	  };

	  var TakeObservable = (function(__super__) {
	    inherits(TakeObservable, __super__);
	    function TakeObservable(source, count) {
	      this.source = source;
	      this._count = count;
	      __super__.call(this);
	    }

	    TakeObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new TakeObserver(o, this._count));
	    };

	    function TakeObserver(o, c) {
	      this._o = o;
	      this._c = c;
	      this._r = c;
	      AbstractObserver.call(this);
	    }

	    inherits(TakeObserver, AbstractObserver);

	    TakeObserver.prototype.next = function (x) {
	      if (this._r-- > 0) {
	        this._o.onNext(x);
	        this._r <= 0 && this._o.onCompleted();
	      }
	    };

	    TakeObserver.prototype.error = function (e) { this._o.onError(e); };
	    TakeObserver.prototype.completed = function () { this._o.onCompleted(); };

	    return TakeObservable;
	  }(ObservableBase));

	  /**
	   *  Returns a specified number of contiguous elements from the start of an observable sequence, using the specified scheduler for the edge case of take(0).
	   * @param {Number} count The number of elements to return.
	   * @param {Scheduler} [scheduler] Scheduler used to produce an OnCompleted message in case <paramref name="count count</paramref> is set to 0.
	   * @returns {Observable} An observable sequence that contains the specified number of elements from the start of the input sequence.
	   */
	  observableProto.take = function (count, scheduler) {
	    if (count < 0) { throw new ArgumentOutOfRangeError(); }
	    if (count === 0) { return observableEmpty(scheduler); }
	    return new TakeObservable(this, count);
	  };

	  var TakeWhileObservable = (function (__super__) {
	    inherits(TakeWhileObservable, __super__);
	    function TakeWhileObservable(source, fn) {
	      this.source = source;
	      this._fn = fn;
	      __super__.call(this);
	    }

	    TakeWhileObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new TakeWhileObserver(o, this));
	    };

	    return TakeWhileObservable;
	  }(ObservableBase));

	  var TakeWhileObserver = (function (__super__) {
	    inherits(TakeWhileObserver, __super__);

	    function TakeWhileObserver(o, p) {
	      this._o = o;
	      this._p = p;
	      this._i = 0;
	      this._r = true;
	      __super__.call(this);
	    }

	    TakeWhileObserver.prototype.next = function (x) {
	      if (this._r) {
	        this._r = tryCatch(this._p._fn)(x, this._i++, this._p);
	        if (this._r === errorObj) { return this._o.onError(this._r.e); }
	      }
	      if (this._r) {
	        this._o.onNext(x);
	      } else {
	        this._o.onCompleted();
	      }
	    };
	    TakeWhileObserver.prototype.error = function (e) { this._o.onError(e); };
	    TakeWhileObserver.prototype.completed = function () { this._o.onCompleted(); };

	    return TakeWhileObserver;
	  }(AbstractObserver));

	  /**
	   *  Returns elements from an observable sequence as long as a specified condition is true.
	   *  The element's index is used in the logic of the predicate function.
	   * @param {Function} predicate A function to test each element for a condition; the second parameter of the function represents the index of the source element.
	   * @param {Any} [thisArg] Object to use as this when executing callback.
	   * @returns {Observable} An observable sequence that contains the elements from the input sequence that occur before the element at which the test no longer passes.
	   */
	  observableProto.takeWhile = function (predicate, thisArg) {
	    var fn = bindCallback(predicate, thisArg, 3);
	    return new TakeWhileObservable(this, fn);
	  };

	  var FilterObservable = (function (__super__) {
	    inherits(FilterObservable, __super__);

	    function FilterObservable(source, predicate, thisArg) {
	      this.source = source;
	      this.predicate = bindCallback(predicate, thisArg, 3);
	      __super__.call(this);
	    }

	    FilterObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new InnerObserver(o, this.predicate, this));
	    };

	    function innerPredicate(predicate, self) {
	      return function(x, i, o) { return self.predicate(x, i, o) && predicate.call(this, x, i, o); }
	    }

	    FilterObservable.prototype.internalFilter = function(predicate, thisArg) {
	      return new FilterObservable(this.source, innerPredicate(predicate, this), thisArg);
	    };

	    inherits(InnerObserver, AbstractObserver);
	    function InnerObserver(o, predicate, source) {
	      this.o = o;
	      this.predicate = predicate;
	      this.source = source;
	      this.i = 0;
	      AbstractObserver.call(this);
	    }

	    InnerObserver.prototype.next = function(x) {
	      var shouldYield = tryCatch(this.predicate)(x, this.i++, this.source);
	      if (shouldYield === errorObj) {
	        return this.o.onError(shouldYield.e);
	      }
	      shouldYield && this.o.onNext(x);
	    };

	    InnerObserver.prototype.error = function (e) {
	      this.o.onError(e);
	    };

	    InnerObserver.prototype.completed = function () {
	      this.o.onCompleted();
	    };

	    return FilterObservable;

	  }(ObservableBase));

	  /**
	  *  Filters the elements of an observable sequence based on a predicate by incorporating the element's index.
	  * @param {Function} predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element.
	  * @param {Any} [thisArg] Object to use as this when executing callback.
	  * @returns {Observable} An observable sequence that contains elements from the input sequence that satisfy the condition.
	  */
	  observableProto.filter = observableProto.where = function (predicate, thisArg) {
	    return this instanceof FilterObservable ? this.internalFilter(predicate, thisArg) :
	      new FilterObservable(this, predicate, thisArg);
	  };

	  var ExtremaByObservable = (function (__super__) {
	    inherits(ExtremaByObservable, __super__);
	    function ExtremaByObservable(source, k, c) {
	      this.source = source;
	      this._k = k;
	      this._c = c;
	      __super__.call(this);
	    }

	    ExtremaByObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new ExtremaByObserver(o, this._k, this._c));
	    };

	    return ExtremaByObservable;
	  }(ObservableBase));

	  var ExtremaByObserver = (function (__super__) {
	    inherits(ExtremaByObserver, __super__);
	    function ExtremaByObserver(o, k, c) {
	      this._o = o;
	      this._k = k;
	      this._c = c;
	      this._v = null;
	      this._hv = false;
	      this._l = [];
	      __super__.call(this);
	    }

	    ExtremaByObserver.prototype.next = function (x) {
	      var key = tryCatch(this._k)(x);
	      if (key === errorObj) { return this._o.onError(key.e); }
	      var comparison = 0;
	      if (!this._hv) {
	        this._hv = true;
	        this._v = key;
	      } else {
	        comparison = tryCatch(this._c)(key, this._v);
	        if (comparison === errorObj) { return this._o.onError(comparison.e); }
	      }
	      if (comparison > 0) {
	        this._v = key;
	        this._l = [];
	      }
	      if (comparison >= 0) { this._l.push(x); }
	    };

	    ExtremaByObserver.prototype.error = function (e) {
	      this._o.onError(e);
	    };

	    ExtremaByObserver.prototype.completed = function () {
	      this._o.onNext(this._l);
	      this._o.onCompleted();
	    };

	    return ExtremaByObserver;
	  }(AbstractObserver));

	  function firstOnly(x) {
	    if (x.length === 0) { throw new EmptyError(); }
	    return x[0];
	  }

	  var ReduceObservable = (function(__super__) {
	    inherits(ReduceObservable, __super__);
	    function ReduceObservable(source, accumulator, hasSeed, seed) {
	      this.source = source;
	      this.accumulator = accumulator;
	      this.hasSeed = hasSeed;
	      this.seed = seed;
	      __super__.call(this);
	    }

	    ReduceObservable.prototype.subscribeCore = function(observer) {
	      return this.source.subscribe(new ReduceObserver(observer,this));
	    };

	    return ReduceObservable;
	  }(ObservableBase));

	  var ReduceObserver = (function (__super__) {
	    inherits(ReduceObserver, __super__);
	    function ReduceObserver(o, parent) {
	      this._o = o;
	      this._p = parent;
	      this._fn = parent.accumulator;
	      this._hs = parent.hasSeed;
	      this._s = parent.seed;
	      this._ha = false;
	      this._a = null;
	      this._hv = false;
	      this._i = 0;
	      __super__.call(this);
	    }

	    ReduceObserver.prototype.next = function (x) {
	      !this._hv && (this._hv = true);
	      if (this._ha) {
	        this._a = tryCatch(this._fn)(this._a, x, this._i, this._p);
	      } else {
	        this._a = this._hs ? tryCatch(this._fn)(this._s, x, this._i, this._p) : x;
	        this._ha = true;
	      }
	      if (this._a === errorObj) { return this._o.onError(this._a.e); }
	      this._i++;
	    };

	    ReduceObserver.prototype.error = function (e) {
	      this._o.onError(e);
	    };

	    ReduceObserver.prototype.completed = function () {
	      this._hv && this._o.onNext(this._a);
	      !this._hv && this._hs && this._o.onNext(this._s);
	      !this._hv && !this._hs && this._o.onError(new EmptyError());
	      this._o.onCompleted();
	    };

	    return ReduceObserver;
	  }(AbstractObserver));

	  /**
	  * Applies an accumulator function over an observable sequence, returning the result of the aggregation as a single element in the result sequence. The specified seed value is used as the initial accumulator value.
	  * For aggregation behavior with incremental intermediate results, see Observable.scan.
	  * @param {Function} accumulator An accumulator function to be invoked on each element.
	  * @param {Any} [seed] The initial accumulator value.
	  * @returns {Observable} An observable sequence containing a single element with the final accumulator value.
	  */
	  observableProto.reduce = function () {
	    var hasSeed = false, seed, accumulator = arguments[0];
	    if (arguments.length === 2) {
	      hasSeed = true;
	      seed = arguments[1];
	    }
	    return new ReduceObservable(this, accumulator, hasSeed, seed);
	  };

	  var SomeObservable = (function (__super__) {
	    inherits(SomeObservable, __super__);
	    function SomeObservable(source, fn) {
	      this.source = source;
	      this._fn = fn;
	      __super__.call(this);
	    }

	    SomeObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new SomeObserver(o, this._fn, this.source));
	    };

	    return SomeObservable;
	  }(ObservableBase));

	  var SomeObserver = (function (__super__) {
	    inherits(SomeObserver, __super__);

	    function SomeObserver(o, fn, s) {
	      this._o = o;
	      this._fn = fn;
	      this._s = s;
	      this._i = 0;
	      __super__.call(this);
	    }

	    SomeObserver.prototype.next = function (x) {
	      var result = tryCatch(this._fn)(x, this._i++, this._s);
	      if (result === errorObj) { return this._o.onError(result.e); }
	      if (Boolean(result)) {
	        this._o.onNext(true);
	        this._o.onCompleted();
	      }
	    };
	    SomeObserver.prototype.error = function (e) { this._o.onError(e); };
	    SomeObserver.prototype.completed = function () {
	      this._o.onNext(false);
	      this._o.onCompleted();
	    };

	    return SomeObserver;
	  }(AbstractObserver));

	  /**
	   * Determines whether any element of an observable sequence satisfies a condition if present, else if any items are in the sequence.
	   * @param {Function} [predicate] A function to test each element for a condition.
	   * @returns {Observable} An observable sequence containing a single element determining whether any elements in the source sequence pass the test in the specified predicate if given, else if any items are in the sequence.
	   */
	  observableProto.some = function (predicate, thisArg) {
	    var fn = bindCallback(predicate, thisArg, 3);
	    return new SomeObservable(this, fn);
	  };

	  var IsEmptyObservable = (function (__super__) {
	    inherits(IsEmptyObservable, __super__);
	    function IsEmptyObservable(source) {
	      this.source = source;
	      __super__.call(this);
	    }

	    IsEmptyObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new IsEmptyObserver(o));
	    };

	    return IsEmptyObservable;
	  }(ObservableBase));

	  var IsEmptyObserver = (function(__super__) {
	    inherits(IsEmptyObserver, __super__);
	    function IsEmptyObserver(o) {
	      this._o = o;
	      __super__.call(this);
	    }

	    IsEmptyObserver.prototype.next = function () {
	      this._o.onNext(false);
	      this._o.onCompleted();
	    };
	    IsEmptyObserver.prototype.error = function (e) { this._o.onError(e); };
	    IsEmptyObserver.prototype.completed = function () {
	      this._o.onNext(true);
	      this._o.onCompleted();
	    };

	    return IsEmptyObserver;
	  }(AbstractObserver));

	  /**
	   * Determines whether an observable sequence is empty.
	   * @returns {Observable} An observable sequence containing a single element determining whether the source sequence is empty.
	   */
	  observableProto.isEmpty = function () {
	    return new IsEmptyObservable(this);
	  };

	  var EveryObservable = (function (__super__) {
	    inherits(EveryObservable, __super__);
	    function EveryObservable(source, fn) {
	      this.source = source;
	      this._fn = fn;
	      __super__.call(this);
	    }

	    EveryObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new EveryObserver(o, this._fn, this.source));
	    };

	    return EveryObservable;
	  }(ObservableBase));

	  var EveryObserver = (function (__super__) {
	    inherits(EveryObserver, __super__);

	    function EveryObserver(o, fn, s) {
	      this._o = o;
	      this._fn = fn;
	      this._s = s;
	      this._i = 0;
	      __super__.call(this);
	    }

	    EveryObserver.prototype.next = function (x) {
	      var result = tryCatch(this._fn)(x, this._i++, this._s);
	      if (result === errorObj) { return this._o.onError(result.e); }
	      if (!Boolean(result)) {
	        this._o.onNext(false);
	        this._o.onCompleted();
	      }
	    };
	    EveryObserver.prototype.error = function (e) { this._o.onError(e); };
	    EveryObserver.prototype.completed = function () {
	      this._o.onNext(true);
	      this._o.onCompleted();
	    };

	    return EveryObserver;
	  }(AbstractObserver));

	  /**
	   * Determines whether all elements of an observable sequence satisfy a condition.
	   * @param {Function} [predicate] A function to test each element for a condition.
	   * @param {Any} [thisArg] Object to use as this when executing callback.
	   * @returns {Observable} An observable sequence containing a single element determining whether all elements in the source sequence pass the test in the specified predicate.
	   */
	  observableProto.every = function (predicate, thisArg) {
	    var fn = bindCallback(predicate, thisArg, 3);
	    return new EveryObservable(this, fn);
	  };

	  var IncludesObservable = (function (__super__) {
	    inherits(IncludesObservable, __super__);
	    function IncludesObservable(source, elem, idx) {
	      var n = +idx || 0;
	      Math.abs(n) === Infinity && (n = 0);

	      this.source = source;
	      this._elem = elem;
	      this._n = n;
	      __super__.call(this);
	    }

	    IncludesObservable.prototype.subscribeCore = function (o) {
	      if (this._n < 0) {
	        o.onNext(false);
	        o.onCompleted();
	        return disposableEmpty;
	      }

	      return this.source.subscribe(new IncludesObserver(o, this._elem, this._n));
	    };

	    return IncludesObservable;
	  }(ObservableBase));

	  var IncludesObserver = (function (__super__) {
	    inherits(IncludesObserver, __super__);
	    function IncludesObserver(o, elem, n) {
	      this._o = o;
	      this._elem = elem;
	      this._n = n;
	      this._i = 0;
	      __super__.call(this);
	    }

	    function comparer(a, b) {
	      return (a === 0 && b === 0) || (a === b || (isNaN(a) && isNaN(b)));
	    }

	    IncludesObserver.prototype.next = function (x) {
	      if (this._i++ >= this._n && comparer(x, this._elem)) {
	        this._o.onNext(true);
	        this._o.onCompleted();
	      }
	    };
	    IncludesObserver.prototype.error = function (e) { this._o.onError(e); };
	    IncludesObserver.prototype.completed = function () { this._o.onNext(false); this._o.onCompleted(); };

	    return IncludesObserver;
	  }(AbstractObserver));

	  /**
	   * Determines whether an observable sequence includes a specified element with an optional equality comparer.
	   * @param searchElement The value to locate in the source sequence.
	   * @param {Number} [fromIndex] An equality comparer to compare elements.
	   * @returns {Observable} An observable sequence containing a single element determining whether the source sequence includes an element that has the specified value from the given index.
	   */
	  observableProto.includes = function (searchElement, fromIndex) {
	    return new IncludesObservable(this, searchElement, fromIndex);
	  };

	  var CountObservable = (function (__super__) {
	    inherits(CountObservable, __super__);
	    function CountObservable(source, fn) {
	      this.source = source;
	      this._fn = fn;
	      __super__.call(this);
	    }

	    CountObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new CountObserver(o, this._fn, this.source));
	    };

	    return CountObservable;
	  }(ObservableBase));

	  var CountObserver = (function (__super__) {
	    inherits(CountObserver, __super__);

	    function CountObserver(o, fn, s) {
	      this._o = o;
	      this._fn = fn;
	      this._s = s;
	      this._i = 0;
	      this._c = 0;
	      __super__.call(this);
	    }

	    CountObserver.prototype.next = function (x) {
	      if (this._fn) {
	        var result = tryCatch(this._fn)(x, this._i++, this._s);
	        if (result === errorObj) { return this._o.onError(result.e); }
	        Boolean(result) && (this._c++);
	      } else {
	        this._c++;
	      }
	    };
	    CountObserver.prototype.error = function (e) { this._o.onError(e); };
	    CountObserver.prototype.completed = function () {
	      this._o.onNext(this._c);
	      this._o.onCompleted();
	    };

	    return CountObserver;
	  }(AbstractObserver));

	  /**
	   * Returns an observable sequence containing a value that represents how many elements in the specified observable sequence satisfy a condition if provided, else the count of items.
	   * @example
	   * res = source.count();
	   * res = source.count(function (x) { return x > 3; });
	   * @param {Function} [predicate]A function to test each element for a condition.
	   * @param {Any} [thisArg] Object to use as this when executing callback.
	   * @returns {Observable} An observable sequence containing a single element with a number that represents how many elements in the input sequence satisfy the condition in the predicate function if provided, else the count of items in the sequence.
	   */
	  observableProto.count = function (predicate, thisArg) {
	    var fn = bindCallback(predicate, thisArg, 3);
	    return new CountObservable(this, fn);
	  };

	  var IndexOfObservable = (function (__super__) {
	    inherits(IndexOfObservable, __super__);
	    function IndexOfObservable(source, e, n) {
	      this.source = source;
	      this._e = e;
	      this._n = n;
	      __super__.call(this);
	    }

	    IndexOfObservable.prototype.subscribeCore = function (o) {
	      if (this._n < 0) {
	        o.onNext(-1);
	        o.onCompleted();
	        return disposableEmpty;
	      }

	      return this.source.subscribe(new IndexOfObserver(o, this._e, this._n));
	    };

	    return IndexOfObservable;
	  }(ObservableBase));

	  var IndexOfObserver = (function (__super__) {
	    inherits(IndexOfObserver, __super__);
	    function IndexOfObserver(o, e, n) {
	      this._o = o;
	      this._e = e;
	      this._n = n;
	      this._i = 0;
	      __super__.call(this);
	    }

	    IndexOfObserver.prototype.next = function (x) {
	      if (this._i >= this._n && x === this._e) {
	        this._o.onNext(this._i);
	        this._o.onCompleted();
	      }
	      this._i++;
	    };
	    IndexOfObserver.prototype.error = function (e) { this._o.onError(e); };
	    IndexOfObserver.prototype.completed = function () { this._o.onNext(-1); this._o.onCompleted(); };

	    return IndexOfObserver;
	  }(AbstractObserver));

	  /**
	   * Returns the first index at which a given element can be found in the observable sequence, or -1 if it is not present.
	   * @param {Any} searchElement Element to locate in the array.
	   * @param {Number} [fromIndex] The index to start the search.  If not specified, defaults to 0.
	   * @returns {Observable} And observable sequence containing the first index at which a given element can be found in the observable sequence, or -1 if it is not present.
	   */
	  observableProto.indexOf = function(searchElement, fromIndex) {
	    var n = +fromIndex || 0;
	    Math.abs(n) === Infinity && (n = 0);
	    return new IndexOfObservable(this, searchElement, n);
	  };

	  var SumObservable = (function (__super__) {
	    inherits(SumObservable, __super__);
	    function SumObservable(source, fn) {
	      this.source = source;
	      this._fn = fn;
	      __super__.call(this);
	    }

	    SumObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new SumObserver(o, this._fn, this.source));
	    };

	    return SumObservable;
	  }(ObservableBase));

	  var SumObserver = (function (__super__) {
	    inherits(SumObserver, __super__);

	    function SumObserver(o, fn, s) {
	      this._o = o;
	      this._fn = fn;
	      this._s = s;
	      this._i = 0;
	      this._c = 0;
	      __super__.call(this);
	    }

	    SumObserver.prototype.next = function (x) {
	      if (this._fn) {
	        var result = tryCatch(this._fn)(x, this._i++, this._s);
	        if (result === errorObj) { return this._o.onError(result.e); }
	        this._c += result;
	      } else {
	        this._c += x;
	      }
	    };
	    SumObserver.prototype.error = function (e) { this._o.onError(e); };
	    SumObserver.prototype.completed = function () {
	      this._o.onNext(this._c);
	      this._o.onCompleted();
	    };

	    return SumObserver;
	  }(AbstractObserver));

	  /**
	   * Computes the sum of a sequence of values that are obtained by invoking an optional transform function on each element of the input sequence, else if not specified computes the sum on each item in the sequence.
	   * @param {Function} [selector] A transform function to apply to each element.
	   * @param {Any} [thisArg] Object to use as this when executing callback.
	   * @returns {Observable} An observable sequence containing a single element with the sum of the values in the source sequence.
	   */
	  observableProto.sum = function (keySelector, thisArg) {
	    var fn = bindCallback(keySelector, thisArg, 3);
	    return new SumObservable(this, fn);
	  };

	  /**
	   * Returns the elements in an observable sequence with the minimum key value according to the specified comparer.
	   * @example
	   * var res = source.minBy(function (x) { return x.value; });
	   * var res = source.minBy(function (x) { return x.value; }, function (x, y) { return x - y; });
	   * @param {Function} keySelector Key selector function.
	   * @param {Function} [comparer] Comparer used to compare key values.
	   * @returns {Observable} An observable sequence containing a list of zero or more elements that have a minimum key value.
	   */
	  observableProto.minBy = function (keySelector, comparer) {
	    comparer || (comparer = defaultSubComparer);
	    return new ExtremaByObservable(this, keySelector, function (x, y) { return comparer(x, y) * -1; });
	  };

	  /**
	   * Returns the minimum element in an observable sequence according to the optional comparer else a default greater than less than check.
	   * @example
	   * var res = source.min();
	   * var res = source.min(function (x, y) { return x.value - y.value; });
	   * @param {Function} [comparer] Comparer used to compare elements.
	   * @returns {Observable} An observable sequence containing a single element with the minimum element in the source sequence.
	   */
	  observableProto.min = function (comparer) {
	    return this.minBy(identity, comparer).map(firstOnly);
	  };

	  /**
	   * Returns the elements in an observable sequence with the maximum  key value according to the specified comparer.
	   * @example
	   * var res = source.maxBy(function (x) { return x.value; });
	   * var res = source.maxBy(function (x) { return x.value; }, function (x, y) { return x - y;; });
	   * @param {Function} keySelector Key selector function.
	   * @param {Function} [comparer]  Comparer used to compare key values.
	   * @returns {Observable} An observable sequence containing a list of zero or more elements that have a maximum key value.
	   */
	  observableProto.maxBy = function (keySelector, comparer) {
	    comparer || (comparer = defaultSubComparer);
	    return new ExtremaByObservable(this, keySelector, comparer);
	  };

	  /**
	   * Returns the maximum value in an observable sequence according to the specified comparer.
	   * @example
	   * var res = source.max();
	   * var res = source.max(function (x, y) { return x.value - y.value; });
	   * @param {Function} [comparer] Comparer used to compare elements.
	   * @returns {Observable} An observable sequence containing a single element with the maximum element in the source sequence.
	   */
	  observableProto.max = function (comparer) {
	    return this.maxBy(identity, comparer).map(firstOnly);
	  };

	  var AverageObservable = (function (__super__) {
	    inherits(AverageObservable, __super__);
	    function AverageObservable(source, fn) {
	      this.source = source;
	      this._fn = fn;
	      __super__.call(this);
	    }

	    AverageObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new AverageObserver(o, this._fn, this.source));
	    };

	    return AverageObservable;
	  }(ObservableBase));

	  var AverageObserver = (function(__super__) {
	    inherits(AverageObserver, __super__);
	    function AverageObserver(o, fn, s) {
	      this._o = o;
	      this._fn = fn;
	      this._s = s;
	      this._c = 0;
	      this._t = 0;
	      __super__.call(this);
	    }

	    AverageObserver.prototype.next = function (x) {
	      if(this._fn) {
	        var r = tryCatch(this._fn)(x, this._c++, this._s);
	        if (r === errorObj) { return this._o.onError(r.e); }
	        this._t += r;
	      } else {
	        this._c++;
	        this._t += x;
	      }
	    };
	    AverageObserver.prototype.error = function (e) { this._o.onError(e); };
	    AverageObserver.prototype.completed = function () {
	      if (this._c === 0) { return this._o.onError(new EmptyError()); }
	      this._o.onNext(this._t / this._c);
	      this._o.onCompleted();
	    };

	    return AverageObserver;
	  }(AbstractObserver));

	  /**
	   * Computes the average of an observable sequence of values that are in the sequence or obtained by invoking a transform function on each element of the input sequence if present.
	   * @param {Function} [selector] A transform function to apply to each element.
	   * @param {Any} [thisArg] Object to use as this when executing callback.
	   * @returns {Observable} An observable sequence containing a single element with the average of the sequence of values.
	   */
	  observableProto.average = function (keySelector, thisArg) {
	    var source = this, fn;
	    if (isFunction(keySelector)) {
	      fn = bindCallback(keySelector, thisArg, 3);
	    }
	    return new AverageObservable(source, fn);
	  };

	  /**
	   *  Determines whether two sequences are equal by comparing the elements pairwise using a specified equality comparer.
	   *
	   * @example
	   * var res = res = source.sequenceEqual([1,2,3]);
	   * var res = res = source.sequenceEqual([{ value: 42 }], function (x, y) { return x.value === y.value; });
	   * 3 - res = source.sequenceEqual(Rx.Observable.returnValue(42));
	   * 4 - res = source.sequenceEqual(Rx.Observable.returnValue({ value: 42 }), function (x, y) { return x.value === y.value; });
	   * @param {Observable} second Second observable sequence or array to compare.
	   * @param {Function} [comparer] Comparer used to compare elements of both sequences.
	   * @returns {Observable} An observable sequence that contains a single element which indicates whether both sequences are of equal length and their corresponding elements are equal according to the specified equality comparer.
	   */
	  observableProto.sequenceEqual = function (second, comparer) {
	    var first = this;
	    comparer || (comparer = defaultComparer);
	    return new AnonymousObservable(function (o) {
	      var donel = false, doner = false, ql = [], qr = [];
	      var subscription1 = first.subscribe(function (x) {
	        if (qr.length > 0) {
	          var v = qr.shift();
	          var equal = tryCatch(comparer)(v, x);
	          if (equal === errorObj) { return o.onError(equal.e); }
	          if (!equal) {
	            o.onNext(false);
	            o.onCompleted();
	          }
	        } else if (doner) {
	          o.onNext(false);
	          o.onCompleted();
	        } else {
	          ql.push(x);
	        }
	      }, function(e) { o.onError(e); }, function () {
	        donel = true;
	        if (ql.length === 0) {
	          if (qr.length > 0) {
	            o.onNext(false);
	            o.onCompleted();
	          } else if (doner) {
	            o.onNext(true);
	            o.onCompleted();
	          }
	        }
	      });

	      (isArrayLike(second) || isIterable(second)) && (second = observableFrom(second));
	      isPromise(second) && (second = observableFromPromise(second));
	      var subscription2 = second.subscribe(function (x) {
	        if (ql.length > 0) {
	          var v = ql.shift();
	          var equal = tryCatch(comparer)(v, x);
	          if (equal === errorObj) { return o.onError(equal.e); }
	          if (!equal) {
	            o.onNext(false);
	            o.onCompleted();
	          }
	        } else if (donel) {
	          o.onNext(false);
	          o.onCompleted();
	        } else {
	          qr.push(x);
	        }
	      }, function(e) { o.onError(e); }, function () {
	        doner = true;
	        if (qr.length === 0) {
	          if (ql.length > 0) {
	            o.onNext(false);
	            o.onCompleted();
	          } else if (donel) {
	            o.onNext(true);
	            o.onCompleted();
	          }
	        }
	      });
	      return new BinaryDisposable(subscription1, subscription2);
	    }, first);
	  };

	  var ElementAtObservable = (function (__super__) {
	    inherits(ElementAtObservable, __super__);
	    function ElementAtObservable(source, i, d) {
	      this.source = source;
	      this._i = i;
	      this._d = d;
	      __super__.call(this);
	    }

	    ElementAtObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new ElementAtObserver(o, this._i, this._d));
	    };

	    return ElementAtObservable;
	  }(ObservableBase));

	  var ElementAtObserver = (function (__super__) {
	    inherits(ElementAtObserver, __super__);

	    function ElementAtObserver(o, i, d) {
	      this._o = o;
	      this._i = i;
	      this._d = d;
	      __super__.call(this);
	    }

	    ElementAtObserver.prototype.next = function (x) {
	      if (this._i-- === 0) {
	        this._o.onNext(x);
	        this._o.onCompleted();
	      }
	    };
	    ElementAtObserver.prototype.error = function (e) { this._o.onError(e); };
	    ElementAtObserver.prototype.completed = function () {
	      if (this._d === undefined) {
	        this._o.onError(new ArgumentOutOfRangeError());
	      } else {
	        this._o.onNext(this._d);
	        this._o.onCompleted();
	      }
	    };

	    return ElementAtObserver;
	  }(AbstractObserver));

	  /**
	   * Returns the element at a specified index in a sequence or default value if not found.
	   * @param {Number} index The zero-based index of the element to retrieve.
	   * @param {Any} [defaultValue] The default value to use if elementAt does not find a value.
	   * @returns {Observable} An observable sequence that produces the element at the specified position in the source sequence.
	   */
	  observableProto.elementAt =  function (index, defaultValue) {
	    if (index < 0) { throw new ArgumentOutOfRangeError(); }
	    return new ElementAtObservable(this, index, defaultValue);
	  };

	  var SingleObserver = (function(__super__) {
	    inherits(SingleObserver, __super__);
	    function SingleObserver(o, obj, s) {
	      this._o = o;
	      this._obj = obj;
	      this._s = s;
	      this._i = 0;
	      this._hv = false;
	      this._v = null;
	      __super__.call(this);
	    }

	    SingleObserver.prototype.next = function (x) {
	      var shouldYield = false;
	      if (this._obj.predicate) {
	        var res = tryCatch(this._obj.predicate)(x, this._i++, this._s);
	        if (res === errorObj) { return this._o.onError(res.e); }
	        Boolean(res) && (shouldYield = true);
	      } else if (!this._obj.predicate) {
	        shouldYield = true;
	      }
	      if (shouldYield) {
	        if (this._hv) {
	          return this._o.onError(new Error('Sequence contains more than one matching element'));
	        }
	        this._hv = true;
	        this._v = x;
	      }
	    };
	    SingleObserver.prototype.error = function (e) { this._o.onError(e); };
	    SingleObserver.prototype.completed = function () {
	      if (this._hv) {
	        this._o.onNext(this._v);
	        this._o.onCompleted();
	      }
	      else if (this._obj.defaultValue === undefined) {
	        this._o.onError(new EmptyError());
	      } else {
	        this._o.onNext(this._obj.defaultValue);
	        this._o.onCompleted();
	      }
	    };

	    return SingleObserver;
	  }(AbstractObserver));


	    /**
	     * Returns the only element of an observable sequence that satisfies the condition in the optional predicate, and reports an exception if there is not exactly one element in the observable sequence.
	     * @returns {Observable} Sequence containing the single element in the observable sequence that satisfies the condition in the predicate.
	     */
	    observableProto.single = function (predicate, thisArg) {
	      var obj = {}, source = this;
	      if (typeof arguments[0] === 'object') {
	        obj = arguments[0];
	      } else {
	        obj = {
	          predicate: arguments[0],
	          thisArg: arguments[1],
	          defaultValue: arguments[2]
	        };
	      }
	      if (isFunction (obj.predicate)) {
	        var fn = obj.predicate;
	        obj.predicate = bindCallback(fn, obj.thisArg, 3);
	      }
	      return new AnonymousObservable(function (o) {
	        return source.subscribe(new SingleObserver(o, obj, source));
	      }, source);
	    };

	  var FirstObservable = (function (__super__) {
	    inherits(FirstObservable, __super__);
	    function FirstObservable(source, obj) {
	      this.source = source;
	      this._obj = obj;
	      __super__.call(this);
	    }

	    FirstObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new FirstObserver(o, this._obj, this.source));
	    };

	    return FirstObservable;
	  }(ObservableBase));

	  var FirstObserver = (function(__super__) {
	    inherits(FirstObserver, __super__);
	    function FirstObserver(o, obj, s) {
	      this._o = o;
	      this._obj = obj;
	      this._s = s;
	      this._i = 0;
	      __super__.call(this);
	    }

	    FirstObserver.prototype.next = function (x) {
	      if (this._obj.predicate) {
	        var res = tryCatch(this._obj.predicate)(x, this._i++, this._s);
	        if (res === errorObj) { return this._o.onError(res.e); }
	        if (Boolean(res)) {
	          this._o.onNext(x);
	          this._o.onCompleted();
	        }
	      } else if (!this._obj.predicate) {
	        this._o.onNext(x);
	        this._o.onCompleted();
	      }
	    };
	    FirstObserver.prototype.error = function (e) { this._o.onError(e); };
	    FirstObserver.prototype.completed = function () {
	      if (this._obj.defaultValue === undefined) {
	        this._o.onError(new EmptyError());
	      } else {
	        this._o.onNext(this._obj.defaultValue);
	        this._o.onCompleted();
	      }
	    };

	    return FirstObserver;
	  }(AbstractObserver));

	  /**
	   * Returns the first element of an observable sequence that satisfies the condition in the predicate if present else the first item in the sequence.
	   * @returns {Observable} Sequence containing the first element in the observable sequence that satisfies the condition in the predicate if provided, else the first item in the sequence.
	   */
	  observableProto.first = function () {
	    var obj = {}, source = this;
	    if (typeof arguments[0] === 'object') {
	      obj = arguments[0];
	    } else {
	      obj = {
	        predicate: arguments[0],
	        thisArg: arguments[1],
	        defaultValue: arguments[2]
	      };
	    }
	    if (isFunction (obj.predicate)) {
	      var fn = obj.predicate;
	      obj.predicate = bindCallback(fn, obj.thisArg, 3);
	    }
	    return new FirstObservable(this, obj);
	  };

	  var LastObservable = (function (__super__) {
	    inherits(LastObservable, __super__);
	    function LastObservable(source, obj) {
	      this.source = source;
	      this._obj = obj;
	      __super__.call(this);
	    }

	    LastObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new LastObserver(o, this._obj, this.source));
	    };

	    return LastObservable;
	  }(ObservableBase));

	  var LastObserver = (function(__super__) {
	    inherits(LastObserver, __super__);
	    function LastObserver(o, obj, s) {
	      this._o = o;
	      this._obj = obj;
	      this._s = s;
	      this._i = 0;
	      this._hv = false;
	      this._v = null;
	      __super__.call(this);
	    }

	    LastObserver.prototype.next = function (x) {
	      var shouldYield = false;
	      if (this._obj.predicate) {
	        var res = tryCatch(this._obj.predicate)(x, this._i++, this._s);
	        if (res === errorObj) { return this._o.onError(res.e); }
	        Boolean(res) && (shouldYield = true);
	      } else if (!this._obj.predicate) {
	        shouldYield = true;
	      }
	      if (shouldYield) {
	        this._hv = true;
	        this._v = x;
	      }
	    };
	    LastObserver.prototype.error = function (e) { this._o.onError(e); };
	    LastObserver.prototype.completed = function () {
	      if (this._hv) {
	        this._o.onNext(this._v);
	        this._o.onCompleted();
	      }
	      else if (this._obj.defaultValue === undefined) {
	        this._o.onError(new EmptyError());
	      } else {
	        this._o.onNext(this._obj.defaultValue);
	        this._o.onCompleted();
	      }
	    };

	    return LastObserver;
	  }(AbstractObserver));

	  /**
	   * Returns the last element of an observable sequence that satisfies the condition in the predicate if specified, else the last element.
	   * @returns {Observable} Sequence containing the last element in the observable sequence that satisfies the condition in the predicate.
	   */
	  observableProto.last = function () {
	    var obj = {}, source = this;
	    if (typeof arguments[0] === 'object') {
	      obj = arguments[0];
	    } else {
	      obj = {
	        predicate: arguments[0],
	        thisArg: arguments[1],
	        defaultValue: arguments[2]
	      };
	    }
	    if (isFunction (obj.predicate)) {
	      var fn = obj.predicate;
	      obj.predicate = bindCallback(fn, obj.thisArg, 3);
	    }
	    return new LastObservable(this, obj);
	  };

	  var FindValueObserver = (function(__super__) {
	    inherits(FindValueObserver, __super__);
	    function FindValueObserver(observer, source, callback, yieldIndex) {
	      this._o = observer;
	      this._s = source;
	      this._cb = callback;
	      this._y = yieldIndex;
	      this._i = 0;
	      __super__.call(this);
	    }

	    FindValueObserver.prototype.next = function (x) {
	      var shouldRun = tryCatch(this._cb)(x, this._i, this._s);
	      if (shouldRun === errorObj) { return this._o.onError(shouldRun.e); }
	      if (shouldRun) {
	        this._o.onNext(this._y ? this._i : x);
	        this._o.onCompleted();
	      } else {
	        this._i++;
	      }
	    };

	    FindValueObserver.prototype.error = function (e) {
	      this._o.onError(e);
	    };

	    FindValueObserver.prototype.completed = function () {
	      this._y && this._o.onNext(-1);
	      this._o.onCompleted();
	    };

	    return FindValueObserver;
	  }(AbstractObserver));

	  function findValue (source, predicate, thisArg, yieldIndex) {
	    var callback = bindCallback(predicate, thisArg, 3);
	    return new AnonymousObservable(function (o) {
	      return source.subscribe(new FindValueObserver(o, source, callback, yieldIndex));
	    }, source);
	  }

	  /**
	   * Searches for an element that matches the conditions defined by the specified predicate, and returns the first occurrence within the entire Observable sequence.
	   * @param {Function} predicate The predicate that defines the conditions of the element to search for.
	   * @param {Any} [thisArg] Object to use as `this` when executing the predicate.
	   * @returns {Observable} An Observable sequence with the first element that matches the conditions defined by the specified predicate, if found; otherwise, undefined.
	   */
	  observableProto.find = function (predicate, thisArg) {
	    return findValue(this, predicate, thisArg, false);
	  };

	  /**
	   * Searches for an element that matches the conditions defined by the specified predicate, and returns
	   * an Observable sequence with the zero-based index of the first occurrence within the entire Observable sequence.
	   * @param {Function} predicate The predicate that defines the conditions of the element to search for.
	   * @param {Any} [thisArg] Object to use as `this` when executing the predicate.
	   * @returns {Observable} An Observable sequence with the zero-based index of the first occurrence of an element that matches the conditions defined by match, if found; otherwise, –1.
	  */
	  observableProto.findIndex = function (predicate, thisArg) {
	    return findValue(this, predicate, thisArg, true);
	  };

	  var ToSetObservable = (function (__super__) {
	    inherits(ToSetObservable, __super__);
	    function ToSetObservable(source) {
	      this.source = source;
	      __super__.call(this);
	    }

	    ToSetObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new ToSetObserver(o));
	    };

	    return ToSetObservable;
	  }(ObservableBase));

	  var ToSetObserver = (function (__super__) {
	    inherits(ToSetObserver, __super__);
	    function ToSetObserver(o) {
	      this._o = o;
	      this._s = new root.Set();
	      __super__.call(this);
	    }

	    ToSetObserver.prototype.next = function (x) {
	      this._s.add(x);
	    };

	    ToSetObserver.prototype.error = function (e) {
	      this._o.onError(e);
	    };

	    ToSetObserver.prototype.completed = function () {
	      this._o.onNext(this._s);
	      this._o.onCompleted();
	    };

	    return ToSetObserver;
	  }(AbstractObserver));

	  /**
	   * Converts the observable sequence to a Set if it exists.
	   * @returns {Observable} An observable sequence with a single value of a Set containing the values from the observable sequence.
	   */
	  observableProto.toSet = function () {
	    if (typeof root.Set === 'undefined') { throw new TypeError(); }
	    return new ToSetObservable(this);
	  };

	  var ToMapObservable = (function (__super__) {
	    inherits(ToMapObservable, __super__);
	    function ToMapObservable(source, k, e) {
	      this.source = source;
	      this._k = k;
	      this._e = e;
	      __super__.call(this);
	    }

	    ToMapObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new ToMapObserver(o, this._k, this._e));
	    };

	    return ToMapObservable;
	  }(ObservableBase));

	  var ToMapObserver = (function (__super__) {
	    inherits(ToMapObserver, __super__);
	    function ToMapObserver(o, k, e) {
	      this._o = o;
	      this._k = k;
	      this._e = e;
	      this._m = new root.Map();
	      __super__.call(this);
	    }

	    ToMapObserver.prototype.next = function (x) {
	      var key = tryCatch(this._k)(x);
	      if (key === errorObj) { return this._o.onError(key.e); }
	      var elem = x;
	      if (this._e) {
	        elem = tryCatch(this._e)(x);
	        if (elem === errorObj) { return this._o.onError(elem.e); }
	      }

	      this._m.set(key, elem);
	    };

	    ToMapObserver.prototype.error = function (e) {
	      this._o.onError(e);
	    };

	    ToMapObserver.prototype.completed = function () {
	      this._o.onNext(this._m);
	      this._o.onCompleted();
	    };

	    return ToMapObserver;
	  }(AbstractObserver));

	  /**
	  * Converts the observable sequence to a Map if it exists.
	  * @param {Function} keySelector A function which produces the key for the Map.
	  * @param {Function} [elementSelector] An optional function which produces the element for the Map. If not present, defaults to the value from the observable sequence.
	  * @returns {Observable} An observable sequence with a single value of a Map containing the values from the observable sequence.
	  */
	  observableProto.toMap = function (keySelector, elementSelector) {
	    if (typeof root.Map === 'undefined') { throw new TypeError(); }
	    return new ToMapObservable(this, keySelector, elementSelector);
	  };

	  var SliceObservable = (function (__super__) {
	    inherits(SliceObservable, __super__);
	    function SliceObservable(source, b, e) {
	      this.source = source;
	      this._b = b;
	      this._e = e;
	      __super__.call(this);
	    }

	    SliceObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new SliceObserver(o, this._b, this._e));
	    };

	    return SliceObservable;
	  }(ObservableBase));

	  var SliceObserver = (function (__super__) {
	    inherits(SliceObserver, __super__);

	    function SliceObserver(o, b, e) {
	      this._o = o;
	      this._b = b;
	      this._e = e;
	      this._i = 0;
	      __super__.call(this);
	    }

	    SliceObserver.prototype.next = function (x) {
	      if (this._i >= this._b) {
	        if (this._e === this._i) {
	          this._o.onCompleted();
	        } else {
	          this._o.onNext(x);
	        }
	      }
	      this._i++;
	    };
	    SliceObserver.prototype.error = function (e) { this._o.onError(e); };
	    SliceObserver.prototype.completed = function () { this._o.onCompleted(); };

	    return SliceObserver;
	  }(AbstractObserver));

	  /*
	  * The slice() method returns a shallow copy of a portion of an Observable into a new Observable object.
	  * Unlike the array version, this does not support negative numbers for being or end.
	  * @param {Number} [begin] Zero-based index at which to begin extraction. If omitted, this will default to zero.
	  * @param {Number} [end] Zero-based index at which to end extraction. slice extracts up to but not including end.
	  * If omitted, this will emit the rest of the Observable object.
	  * @returns {Observable} A shallow copy of a portion of an Observable into a new Observable object.
	  */
	  observableProto.slice = function (begin, end) {
	    var start = begin || 0;
	    if (start < 0) { throw new Rx.ArgumentOutOfRangeError(); }
	    if (typeof end === 'number' && end < start) {
	      throw new Rx.ArgumentOutOfRangeError();
	    }
	    return new SliceObservable(this, start, end);
	  };

	  var LastIndexOfObservable = (function (__super__) {
	    inherits(LastIndexOfObservable, __super__);
	    function LastIndexOfObservable(source, e, n) {
	      this.source = source;
	      this._e = e;
	      this._n = n;
	      __super__.call(this);
	    }

	    LastIndexOfObservable.prototype.subscribeCore = function (o) {
	      if (this._n < 0) {
	        o.onNext(-1);
	        o.onCompleted();
	        return disposableEmpty;
	      }

	      return this.source.subscribe(new LastIndexOfObserver(o, this._e, this._n));
	    };

	    return LastIndexOfObservable;
	  }(ObservableBase));

	  var LastIndexOfObserver = (function (__super__) {
	    inherits(LastIndexOfObserver, __super__);
	    function LastIndexOfObserver(o, e, n) {
	      this._o = o;
	      this._e = e;
	      this._n = n;
	      this._v = 0;
	      this._hv = false;
	      this._i = 0;
	      __super__.call(this);
	    }

	    LastIndexOfObserver.prototype.next = function (x) {
	      if (this._i >= this._n && x === this._e) {
	        this._hv = true;
	        this._v = this._i;
	      }
	      this._i++;
	    };
	    LastIndexOfObserver.prototype.error = function (e) { this._o.onError(e); };
	    LastIndexOfObserver.prototype.completed = function () {
	      if (this._hv) {
	        this._o.onNext(this._v);
	      } else {
	        this._o.onNext(-1);
	      }
	      this._o.onCompleted();
	    };

	    return LastIndexOfObserver;
	  }(AbstractObserver));

	  /**
	   * Returns the last index at which a given element can be found in the observable sequence, or -1 if it is not present.
	   * @param {Any} searchElement Element to locate in the array.
	   * @param {Number} [fromIndex] The index to start the search.  If not specified, defaults to 0.
	   * @returns {Observable} And observable sequence containing the last index at which a given element can be found in the observable sequence, or -1 if it is not present.
	   */
	  observableProto.lastIndexOf = function(searchElement, fromIndex) {
	    var n = +fromIndex || 0;
	    Math.abs(n) === Infinity && (n = 0);
	    return new LastIndexOfObservable(this, searchElement, n);
	  };

	  Observable.wrap = function (fn) {
	    function createObservable() {
	      return Observable.spawn.call(this, fn.apply(this, arguments));
	    }

	    createObservable.__generatorFunction__ = fn;
	    return createObservable;
	  };

	  var spawn = Observable.spawn = function () {
	    var gen = arguments[0], self = this, args = [];
	    for (var i = 1, len = arguments.length; i < len; i++) { args.push(arguments[i]); }

	    return new AnonymousObservable(function (o) {
	      var g = new CompositeDisposable();

	      if (isFunction(gen)) { gen = gen.apply(self, args); }
	      if (!gen || !isFunction(gen.next)) {
	        o.onNext(gen);
	        return o.onCompleted();
	      }

	      function processGenerator(res) {
	        var ret = tryCatch(gen.next).call(gen, res);
	        if (ret === errorObj) { return o.onError(ret.e); }
	        next(ret);
	      }

	      processGenerator();

	      function onError(err) {
	        var ret = tryCatch(gen.next).call(gen, err);
	        if (ret === errorObj) { return o.onError(ret.e); }
	        next(ret);
	      }

	      function next(ret) {
	        if (ret.done) {
	          o.onNext(ret.value);
	          o.onCompleted();
	          return;
	        }
	        var obs = toObservable.call(self, ret.value);
	        var value = null;
	        var hasValue = false;
	        if (Observable.isObservable(obs)) {
	          g.add(obs.subscribe(function(val) {
	            hasValue = true;
	            value = val;
	          }, onError, function() {
	            hasValue && processGenerator(value);
	          }));
	        } else {
	          onError(new TypeError('type not supported'));
	        }
	      }

	      return g;
	    });
	  };

	  function toObservable(obj) {
	    if (!obj) { return obj; }
	    if (Observable.isObservable(obj)) { return obj; }
	    if (isPromise(obj)) { return Observable.fromPromise(obj); }
	    if (isGeneratorFunction(obj) || isGenerator(obj)) { return spawn.call(this, obj); }
	    if (isFunction(obj)) { return thunkToObservable.call(this, obj); }
	    if (isArrayLike(obj) || isIterable(obj)) { return arrayToObservable.call(this, obj); }
	    if (isObject(obj)) {return objectToObservable.call(this, obj);}
	    return obj;
	  }

	  function arrayToObservable (obj) {
	    return Observable.from(obj).concatMap(function(o) {
	      if(Observable.isObservable(o) || isObject(o)) {
	        return toObservable.call(null, o);
	      } else {
	        return Rx.Observable.just(o);
	      }
	    }).toArray();
	  }

	  function objectToObservable (obj) {
	    var results = new obj.constructor(), keys = Object.keys(obj), observables = [];
	    for (var i = 0, len = keys.length; i < len; i++) {
	      var key = keys[i];
	      var observable = toObservable.call(this, obj[key]);

	      if(observable && Observable.isObservable(observable)) {
	        defer(observable, key);
	      } else {
	        results[key] = obj[key];
	      }
	    }

	    return Observable.forkJoin.apply(Observable, observables).map(function() {
	      return results;
	    });


	    function defer (observable, key) {
	      results[key] = undefined;
	      observables.push(observable.map(function (next) {
	        results[key] = next;
	      }));
	    }
	  }

	  function thunkToObservable(fn) {
	    var self = this;
	    return new AnonymousObservable(function (o) {
	      fn.call(self, function () {
	        var err = arguments[0], res = arguments[1];
	        if (err) { return o.onError(err); }
	        if (arguments.length > 2) {
	          var args = [];
	          for (var i = 1, len = arguments.length; i < len; i++) { args.push(arguments[i]); }
	          res = args;
	        }
	        o.onNext(res);
	        o.onCompleted();
	      });
	    });
	  }

	  function isGenerator(obj) {
	    return isFunction (obj.next) && isFunction (obj['throw']);
	  }

	  function isGeneratorFunction(obj) {
	    var ctor = obj.constructor;
	    if (!ctor) { return false; }
	    if (ctor.name === 'GeneratorFunction' || ctor.displayName === 'GeneratorFunction') { return true; }
	    return isGenerator(ctor.prototype);
	  }

	  function isObject(val) {
	    return Object == val.constructor;
	  }

	  /**
	   * Invokes the specified function asynchronously on the specified scheduler, surfacing the result through an observable sequence.
	   *
	   * @example
	   * var res = Rx.Observable.start(function () { console.log('hello'); });
	   * var res = Rx.Observable.start(function () { console.log('hello'); }, Rx.Scheduler.timeout);
	   * var res = Rx.Observable.start(function () { this.log('hello'); }, Rx.Scheduler.timeout, console);
	   *
	   * @param {Function} func Function to run asynchronously.
	   * @param {Scheduler} [scheduler]  Scheduler to run the function on. If not specified, defaults to Scheduler.timeout.
	   * @param [context]  The context for the func parameter to be executed.  If not specified, defaults to undefined.
	   * @returns {Observable} An observable sequence exposing the function's result value, or an exception.
	   *
	   * Remarks
	   * * The function is called immediately, not during the subscription of the resulting sequence.
	   * * Multiple subscriptions to the resulting sequence can observe the function's result.
	   */
	  Observable.start = function (func, context, scheduler) {
	    return observableToAsync(func, context, scheduler)();
	  };

	  /**
	   * Converts the function into an asynchronous function. Each invocation of the resulting asynchronous function causes an invocation of the original synchronous function on the specified scheduler.
	   * @param {Function} function Function to convert to an asynchronous function.
	   * @param {Scheduler} [scheduler] Scheduler to run the function on. If not specified, defaults to Scheduler.timeout.
	   * @param {Mixed} [context] The context for the func parameter to be executed.  If not specified, defaults to undefined.
	   * @returns {Function} Asynchronous function.
	   */
	  var observableToAsync = Observable.toAsync = function (func, context, scheduler) {
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    return function () {
	      var args = arguments,
	        subject = new AsyncSubject();

	      scheduler.schedule(null, function () {
	        var result;
	        try {
	          result = func.apply(context, args);
	        } catch (e) {
	          subject.onError(e);
	          return;
	        }
	        subject.onNext(result);
	        subject.onCompleted();
	      });
	      return subject.asObservable();
	    };
	  };

	function createCbObservable(fn, ctx, selector, args) {
	  var o = new AsyncSubject();

	  args.push(createCbHandler(o, ctx, selector));
	  fn.apply(ctx, args);

	  return o.asObservable();
	}

	function createCbHandler(o, ctx, selector) {
	  return function handler () {
	    var len = arguments.length, results = new Array(len);
	    for(var i = 0; i < len; i++) { results[i] = arguments[i]; }

	    if (isFunction(selector)) {
	      results = tryCatch(selector).apply(ctx, results);
	      if (results === errorObj) { return o.onError(results.e); }
	      o.onNext(results);
	    } else {
	      if (results.length <= 1) {
	        o.onNext(results[0]);
	      } else {
	        o.onNext(results);
	      }
	    }

	    o.onCompleted();
	  };
	}

	/**
	 * Converts a callback function to an observable sequence.
	 *
	 * @param {Function} fn Function with a callback as the last parameter to convert to an Observable sequence.
	 * @param {Mixed} [ctx] The context for the func parameter to be executed.  If not specified, defaults to undefined.
	 * @param {Function} [selector] A selector which takes the arguments from the callback to produce a single item to yield on next.
	 * @returns {Function} A function, when executed with the required parameters minus the callback, produces an Observable sequence with a single value of the arguments to the callback as an array.
	 */
	Observable.fromCallback = function (fn, ctx, selector) {
	  return function () {
	    typeof ctx === 'undefined' && (ctx = this); 

	    var len = arguments.length, args = new Array(len)
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    return createCbObservable(fn, ctx, selector, args);
	  };
	};

	function createNodeObservable(fn, ctx, selector, args) {
	  var o = new AsyncSubject();

	  args.push(createNodeHandler(o, ctx, selector));
	  fn.apply(ctx, args);

	  return o.asObservable();
	}

	function createNodeHandler(o, ctx, selector) {
	  return function handler () {
	    var err = arguments[0];
	    if (err) { return o.onError(err); }

	    var len = arguments.length, results = [];
	    for(var i = 1; i < len; i++) { results[i - 1] = arguments[i]; }

	    if (isFunction(selector)) {
	      var results = tryCatch(selector).apply(ctx, results);
	      if (results === errorObj) { return o.onError(results.e); }
	      o.onNext(results);
	    } else {
	      if (results.length <= 1) {
	        o.onNext(results[0]);
	      } else {
	        o.onNext(results);
	      }
	    }

	    o.onCompleted();
	  };
	}

	/**
	 * Converts a Node.js callback style function to an observable sequence.  This must be in function (err, ...) format.
	 * @param {Function} fn The function to call
	 * @param {Mixed} [ctx] The context for the func parameter to be executed.  If not specified, defaults to undefined.
	 * @param {Function} [selector] A selector which takes the arguments from the callback minus the error to produce a single item to yield on next.
	 * @returns {Function} An async function which when applied, returns an observable sequence with the callback arguments as an array.
	 */
	Observable.fromNodeCallback = function (fn, ctx, selector) {
	  return function () {
	    typeof ctx === 'undefined' && (ctx = this); 
	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    return createNodeObservable(fn, ctx, selector, args);
	  };
	};

	  function isNodeList(el) {
	    if (root.StaticNodeList) {
	      // IE8 Specific
	      // instanceof is slower than Object#toString, but Object#toString will not work as intended in IE8
	      return el instanceof root.StaticNodeList || el instanceof root.NodeList;
	    } else {
	      return Object.prototype.toString.call(el) === '[object NodeList]';
	    }
	  }

	  function ListenDisposable(e, n, fn) {
	    this._e = e;
	    this._n = n;
	    this._fn = fn;
	    this._e.addEventListener(this._n, this._fn, false);
	    this.isDisposed = false;
	  }
	  ListenDisposable.prototype.dispose = function () {
	    if (!this.isDisposed) {
	      this._e.removeEventListener(this._n, this._fn, false);
	      this.isDisposed = true;
	    }
	  };

	  function createEventListener (el, eventName, handler) {
	    var disposables = new CompositeDisposable();

	    // Asume NodeList or HTMLCollection
	    var elemToString = Object.prototype.toString.call(el);
	    if (isNodeList(el) || elemToString === '[object HTMLCollection]') {
	      for (var i = 0, len = el.length; i < len; i++) {
	        disposables.add(createEventListener(el.item(i), eventName, handler));
	      }
	    } else if (el) {
	      disposables.add(new ListenDisposable(el, eventName, handler));
	    }

	    return disposables;
	  }

	  /**
	   * Configuration option to determine whether to use native events only
	   */
	  Rx.config.useNativeEvents = false;

	  var EventObservable = (function(__super__) {
	    inherits(EventObservable, __super__);
	    function EventObservable(el, name, fn) {
	      this._el = el;
	      this._n = name;
	      this._fn = fn;
	      __super__.call(this);
	    }

	    function createHandler(o, fn) {
	      return function handler () {
	        var results = arguments[0];
	        if (isFunction(fn)) {
	          results = tryCatch(fn).apply(null, arguments);
	          if (results === errorObj) { return o.onError(results.e); }
	        }
	        o.onNext(results);
	      };
	    }

	    EventObservable.prototype.subscribeCore = function (o) {
	      return createEventListener(
	        this._el,
	        this._n,
	        createHandler(o, this._fn));
	    };

	    return EventObservable;
	  }(ObservableBase));

	  /**
	   * Creates an observable sequence by adding an event listener to the matching DOMElement or each item in the NodeList.
	   * @param {Object} element The DOMElement or NodeList to attach a listener.
	   * @param {String} eventName The event name to attach the observable sequence.
	   * @param {Function} [selector] A selector which takes the arguments from the event handler to produce a single item to yield on next.
	   * @returns {Observable} An observable sequence of events from the specified element and the specified event.
	   */
	  Observable.fromEvent = function (element, eventName, selector) {
	    // Node.js specific
	    if (element.addListener) {
	      return fromEventPattern(
	        function (h) { element.addListener(eventName, h); },
	        function (h) { element.removeListener(eventName, h); },
	        selector);
	    }

	    // Use only if non-native events are allowed
	    if (!Rx.config.useNativeEvents) {
	      // Handles jq, Angular.js, Zepto, Marionette, Ember.js
	      if (typeof element.on === 'function' && typeof element.off === 'function') {
	        return fromEventPattern(
	          function (h) { element.on(eventName, h); },
	          function (h) { element.off(eventName, h); },
	          selector);
	      }
	    }

	    return new EventObservable(element, eventName, selector).publish().refCount();
	  };

	  var EventPatternObservable = (function(__super__) {
	    inherits(EventPatternObservable, __super__);
	    function EventPatternObservable(add, del, fn) {
	      this._add = add;
	      this._del = del;
	      this._fn = fn;
	      __super__.call(this);
	    }

	    function createHandler(o, fn) {
	      return function handler () {
	        var results = arguments[0];
	        if (isFunction(fn)) {
	          results = tryCatch(fn).apply(null, arguments);
	          if (results === errorObj) { return o.onError(results.e); }
	        }
	        o.onNext(results);
	      };
	    }

	    EventPatternObservable.prototype.subscribeCore = function (o) {
	      var fn = createHandler(o, this._fn);
	      var returnValue = this._add(fn);
	      return new EventPatternDisposable(this._del, fn, returnValue);
	    };

	    function EventPatternDisposable(del, fn, ret) {
	      this._del = del;
	      this._fn = fn;
	      this._ret = ret;
	      this.isDisposed = false;
	    }

	    EventPatternDisposable.prototype.dispose = function () {
	      if(!this.isDisposed) {
	        isFunction(this._del) && this._del(this._fn, this._ret);
	        this.isDisposed = true;
	      }
	    };

	    return EventPatternObservable;
	  }(ObservableBase));

	  /**
	   * Creates an observable sequence from an event emitter via an addHandler/removeHandler pair.
	   * @param {Function} addHandler The function to add a handler to the emitter.
	   * @param {Function} [removeHandler] The optional function to remove a handler from an emitter.
	   * @param {Function} [selector] A selector which takes the arguments from the event handler to produce a single item to yield on next.
	   * @returns {Observable} An observable sequence which wraps an event from an event emitter
	   */
	  var fromEventPattern = Observable.fromEventPattern = function (addHandler, removeHandler, selector) {
	    return new EventPatternObservable(addHandler, removeHandler, selector).publish().refCount();
	  };

	  /**
	   * Invokes the asynchronous function, surfacing the result through an observable sequence.
	   * @param {Function} functionAsync Asynchronous function which returns a Promise to run.
	   * @returns {Observable} An observable sequence exposing the function's result value, or an exception.
	   */
	  Observable.startAsync = function (functionAsync) {
	    var promise = tryCatch(functionAsync)();
	    if (promise === errorObj) { return observableThrow(promise.e); }
	    return observableFromPromise(promise);
	  };

	  var PausableObservable = (function (__super__) {
	    inherits(PausableObservable, __super__);
	    function PausableObservable(source, pauser) {
	      this.source = source;
	      this.controller = new Subject();
	      this.paused = true;

	      if (pauser && pauser.subscribe) {
	        this.pauser = this.controller.merge(pauser);
	      } else {
	        this.pauser = this.controller;
	      }

	      __super__.call(this);
	    }

	    PausableObservable.prototype._subscribe = function (o) {
	      var conn = this.source.publish(),
	        subscription = conn.subscribe(o),
	        connection = disposableEmpty;

	      var pausable = this.pauser.startWith(!this.paused).distinctUntilChanged().subscribe(function (b) {
	        if (b) {
	          connection = conn.connect();
	        } else {
	          connection.dispose();
	          connection = disposableEmpty;
	        }
	      });

	      return new NAryDisposable([subscription, connection, pausable]);
	    };

	    PausableObservable.prototype.pause = function () {
	      this.paused = true;
	      this.controller.onNext(false);
	    };

	    PausableObservable.prototype.resume = function () {
	      this.paused = false;
	      this.controller.onNext(true);
	    };

	    return PausableObservable;

	  }(Observable));

	  /**
	   * Pauses the underlying observable sequence based upon the observable sequence which yields true/false.
	   * @example
	   * var pauser = new Rx.Subject();
	   * var source = Rx.Observable.interval(100).pausable(pauser);
	   * @param {Observable} pauser The observable sequence used to pause the underlying sequence.
	   * @returns {Observable} The observable sequence which is paused based upon the pauser.
	   */
	  observableProto.pausable = function (pauser) {
	    return new PausableObservable(this, pauser);
	  };

	  function combineLatestSource(source, subject, resultSelector) {
	    return new AnonymousObservable(function (o) {
	      var hasValue = [false, false],
	        hasValueAll = false,
	        isDone = false,
	        values = new Array(2),
	        err;

	      function next(x, i) {
	        values[i] = x;
	        hasValue[i] = true;
	        if (hasValueAll || (hasValueAll = hasValue.every(identity))) {
	          if (err) { return o.onError(err); }
	          var res = tryCatch(resultSelector).apply(null, values);
	          if (res === errorObj) { return o.onError(res.e); }
	          o.onNext(res);
	        }
	        isDone && values[1] && o.onCompleted();
	      }

	      return new BinaryDisposable(
	        source.subscribe(
	          function (x) {
	            next(x, 0);
	          },
	          function (e) {
	            if (values[1]) {
	              o.onError(e);
	            } else {
	              err = e;
	            }
	          },
	          function () {
	            isDone = true;
	            values[1] && o.onCompleted();
	          }),
	        subject.subscribe(
	          function (x) {
	            next(x, 1);
	          },
	          function (e) { o.onError(e); },
	          function () {
	            isDone = true;
	            next(true, 1);
	          })
	        );
	    }, source);
	  }

	  var PausableBufferedObservable = (function (__super__) {
	    inherits(PausableBufferedObservable, __super__);
	    function PausableBufferedObservable(source, pauser) {
	      this.source = source;
	      this.controller = new Subject();
	      this.paused = true;

	      if (pauser && pauser.subscribe) {
	        this.pauser = this.controller.merge(pauser);
	      } else {
	        this.pauser = this.controller;
	      }

	      __super__.call(this);
	    }

	    PausableBufferedObservable.prototype._subscribe = function (o) {
	      var q = [], previousShouldFire;

	      function drainQueue() { while (q.length > 0) { o.onNext(q.shift()); } }

	      var subscription =
	        combineLatestSource(
	          this.source,
	          this.pauser.startWith(!this.paused).distinctUntilChanged(),
	          function (data, shouldFire) {
	            return { data: data, shouldFire: shouldFire };
	          })
	          .subscribe(
	            function (results) {
	              if (previousShouldFire !== undefined && results.shouldFire !== previousShouldFire) {
	                previousShouldFire = results.shouldFire;
	                // change in shouldFire
	                if (results.shouldFire) { drainQueue(); }
	              } else {
	                previousShouldFire = results.shouldFire;
	                // new data
	                if (results.shouldFire) {
	                  o.onNext(results.data);
	                } else {
	                  q.push(results.data);
	                }
	              }
	            },
	            function (err) {
	              drainQueue();
	              o.onError(err);
	            },
	            function () {
	              drainQueue();
	              o.onCompleted();
	            }
	          );
	      return subscription;      
	    };

	    PausableBufferedObservable.prototype.pause = function () {
	      this.paused = true;
	      this.controller.onNext(false);
	    };

	    PausableBufferedObservable.prototype.resume = function () {
	      this.paused = false;
	      this.controller.onNext(true);
	    };

	    return PausableBufferedObservable;

	  }(Observable));

	  /**
	   * Pauses the underlying observable sequence based upon the observable sequence which yields true/false,
	   * and yields the values that were buffered while paused.
	   * @example
	   * var pauser = new Rx.Subject();
	   * var source = Rx.Observable.interval(100).pausableBuffered(pauser);
	   * @param {Observable} pauser The observable sequence used to pause the underlying sequence.
	   * @returns {Observable} The observable sequence which is paused based upon the pauser.
	   */
	  observableProto.pausableBuffered = function (pauser) {
	    return new PausableBufferedObservable(this, pauser);
	  };

	  var ControlledObservable = (function (__super__) {
	    inherits(ControlledObservable, __super__);
	    function ControlledObservable (source, enableQueue, scheduler) {
	      __super__.call(this);
	      this.subject = new ControlledSubject(enableQueue, scheduler);
	      this.source = source.multicast(this.subject).refCount();
	    }

	    ControlledObservable.prototype._subscribe = function (o) {
	      return this.source.subscribe(o);
	    };

	    ControlledObservable.prototype.request = function (numberOfItems) {
	      return this.subject.request(numberOfItems == null ? -1 : numberOfItems);
	    };

	    return ControlledObservable;

	  }(Observable));

	  var ControlledSubject = (function (__super__) {
	    inherits(ControlledSubject, __super__);
	    function ControlledSubject(enableQueue, scheduler) {
	      enableQueue == null && (enableQueue = true);

	      __super__.call(this);
	      this.subject = new Subject();
	      this.enableQueue = enableQueue;
	      this.queue = enableQueue ? [] : null;
	      this.requestedCount = 0;
	      this.requestedDisposable = null;
	      this.error = null;
	      this.hasFailed = false;
	      this.hasCompleted = false;
	      this.scheduler = scheduler || currentThreadScheduler;
	    }

	    addProperties(ControlledSubject.prototype, Observer, {
	      _subscribe: function (o) {
	        return this.subject.subscribe(o);
	      },
	      onCompleted: function () {
	        this.hasCompleted = true;
	        if (!this.enableQueue || this.queue.length === 0) {
	          this.subject.onCompleted();
	          this.disposeCurrentRequest();
	        } else {
	          this.queue.push(Notification.createOnCompleted());
	        }
	      },
	      onError: function (error) {
	        this.hasFailed = true;
	        this.error = error;
	        if (!this.enableQueue || this.queue.length === 0) {
	          this.subject.onError(error);
	          this.disposeCurrentRequest();
	        } else {
	          this.queue.push(Notification.createOnError(error));
	        }
	      },
	      onNext: function (value) {
	        if (this.requestedCount <= 0) {
	          this.enableQueue && this.queue.push(Notification.createOnNext(value));
	        } else {
	          (this.requestedCount-- === 0) && this.disposeCurrentRequest();
	          this.subject.onNext(value);
	        }
	      },
	      _processRequest: function (numberOfItems) {
	        if (this.enableQueue) {
	          while (this.queue.length > 0 && (numberOfItems > 0 || this.queue[0].kind !== 'N')) {
	            var first = this.queue.shift();
	            first.accept(this.subject);
	            if (first.kind === 'N') {
	              numberOfItems--;
	            } else {
	              this.disposeCurrentRequest();
	              this.queue = [];
	            }
	          }
	        }

	        return numberOfItems;
	      },
	      request: function (number) {
	        this.disposeCurrentRequest();
	        var self = this;

	        this.requestedDisposable = this.scheduler.schedule(number,
	        function(s, i) {
	          var remaining = self._processRequest(i);
	          var stopped = self.hasCompleted || self.hasFailed;
	          if (!stopped && remaining > 0) {
	            self.requestedCount = remaining;

	            return disposableCreate(function () {
	              self.requestedCount = 0;
	            });
	              // Scheduled item is still in progress. Return a new
	              // disposable to allow the request to be interrupted
	              // via dispose.
	          }
	        });

	        return this.requestedDisposable;
	      },
	      disposeCurrentRequest: function () {
	        if (this.requestedDisposable) {
	          this.requestedDisposable.dispose();
	          this.requestedDisposable = null;
	        }
	      }
	    });

	    return ControlledSubject;
	  }(Observable));

	  /**
	   * Attaches a controller to the observable sequence with the ability to queue.
	   * @example
	   * var source = Rx.Observable.interval(100).controlled();
	   * source.request(3); // Reads 3 values
	   * @param {bool} enableQueue truthy value to determine if values should be queued pending the next request
	   * @param {Scheduler} scheduler determines how the requests will be scheduled
	   * @returns {Observable} The observable sequence which only propagates values on request.
	   */
	  observableProto.controlled = function (enableQueue, scheduler) {

	    if (enableQueue && isScheduler(enableQueue)) {
	      scheduler = enableQueue;
	      enableQueue = true;
	    }

	    if (enableQueue == null) {  enableQueue = true; }
	    return new ControlledObservable(this, enableQueue, scheduler);
	  };

	  var StopAndWaitObservable = (function (__super__) {
	    inherits(StopAndWaitObservable, __super__);
	    function StopAndWaitObservable (source) {
	      __super__.call(this);
	      this.source = source;
	    }

	    function scheduleMethod(s, self) {
	      return self.source.request(1);
	    }

	    StopAndWaitObservable.prototype._subscribe = function (o) {
	      this.subscription = this.source.subscribe(new StopAndWaitObserver(o, this, this.subscription));
	      return new BinaryDisposable(
	        this.subscription,
	        defaultScheduler.schedule(this, scheduleMethod)
	      );
	    };

	    var StopAndWaitObserver = (function (__sub__) {
	      inherits(StopAndWaitObserver, __sub__);
	      function StopAndWaitObserver (observer, observable, cancel) {
	        __sub__.call(this);
	        this.observer = observer;
	        this.observable = observable;
	        this.cancel = cancel;
	        this.scheduleDisposable = null;
	      }

	      StopAndWaitObserver.prototype.completed = function () {
	        this.observer.onCompleted();
	        this.dispose();
	      };

	      StopAndWaitObserver.prototype.error = function (error) {
	        this.observer.onError(error);
	        this.dispose();
	      };

	      function innerScheduleMethod(s, self) {
	        return self.observable.source.request(1);
	      }

	      StopAndWaitObserver.prototype.next = function (value) {
	        this.observer.onNext(value);
	        this.scheduleDisposable = defaultScheduler.schedule(this, innerScheduleMethod);
	      };

	      StopAndWaitObserver.dispose = function () {
	        this.observer = null;
	        if (this.cancel) {
	          this.cancel.dispose();
	          this.cancel = null;
	        }
	        if (this.scheduleDisposable) {
	          this.scheduleDisposable.dispose();
	          this.scheduleDisposable = null;
	        }
	        __sub__.prototype.dispose.call(this);
	      };

	      return StopAndWaitObserver;
	    }(AbstractObserver));

	    return StopAndWaitObservable;
	  }(Observable));


	  /**
	   * Attaches a stop and wait observable to the current observable.
	   * @returns {Observable} A stop and wait observable.
	   */
	  ControlledObservable.prototype.stopAndWait = function () {
	    return new StopAndWaitObservable(this);
	  };

	  var WindowedObservable = (function (__super__) {
	    inherits(WindowedObservable, __super__);
	    function WindowedObservable(source, windowSize) {
	      __super__.call(this);
	      this.source = source;
	      this.windowSize = windowSize;
	    }

	    function scheduleMethod(s, self) {
	      return self.source.request(self.windowSize);
	    }

	    WindowedObservable.prototype._subscribe = function (o) {
	      this.subscription = this.source.subscribe(new WindowedObserver(o, this, this.subscription));
	      return new BinaryDisposable(
	        this.subscription,
	        defaultScheduler.schedule(this, scheduleMethod)
	      );
	    };

	    var WindowedObserver = (function (__sub__) {
	      inherits(WindowedObserver, __sub__);
	      function WindowedObserver(observer, observable, cancel) {
	        this.observer = observer;
	        this.observable = observable;
	        this.cancel = cancel;
	        this.received = 0;
	        this.scheduleDisposable = null;
	        __sub__.call(this);
	      }

	      WindowedObserver.prototype.completed = function () {
	        this.observer.onCompleted();
	        this.dispose();
	      };

	      WindowedObserver.prototype.error = function (error) {
	        this.observer.onError(error);
	        this.dispose();
	      };

	      function innerScheduleMethod(s, self) {
	        return self.observable.source.request(self.observable.windowSize);
	      }

	      WindowedObserver.prototype.next = function (value) {
	        this.observer.onNext(value);
	        this.received = ++this.received % this.observable.windowSize;
	        this.received === 0 && (this.scheduleDisposable = defaultScheduler.schedule(this, innerScheduleMethod));
	      };

	      WindowedObserver.prototype.dispose = function () {
	        this.observer = null;
	        if (this.cancel) {
	          this.cancel.dispose();
	          this.cancel = null;
	        }
	        if (this.scheduleDisposable) {
	          this.scheduleDisposable.dispose();
	          this.scheduleDisposable = null;
	        }
	        __sub__.prototype.dispose.call(this);
	      };

	      return WindowedObserver;
	    }(AbstractObserver));

	    return WindowedObservable;
	  }(Observable));

	  /**
	   * Creates a sliding windowed observable based upon the window size.
	   * @param {Number} windowSize The number of items in the window
	   * @returns {Observable} A windowed observable based upon the window size.
	   */
	  ControlledObservable.prototype.windowed = function (windowSize) {
	    return new WindowedObservable(this, windowSize);
	  };

	  /**
	   * Pipes the existing Observable sequence into a Node.js Stream.
	   * @param {Stream} dest The destination Node.js stream.
	   * @returns {Stream} The destination stream.
	   */
	  observableProto.pipe = function (dest) {
	    var source = this.pausableBuffered();

	    function onDrain() {
	      source.resume();
	    }

	    dest.addListener('drain', onDrain);

	    source.subscribe(
	      function (x) {
	        !dest.write(x) && source.pause();
	      },
	      function (err) {
	        dest.emit('error', err);
	      },
	      function () {
	        // Hack check because STDIO is not closable
	        !dest._isStdio && dest.end();
	        dest.removeListener('drain', onDrain);
	      });

	    source.resume();

	    return dest;
	  };

	  var MulticastObservable = (function (__super__) {
	    inherits(MulticastObservable, __super__);
	    function MulticastObservable(source, fn1, fn2) {
	      this.source = source;
	      this._fn1 = fn1;
	      this._fn2 = fn2;
	      __super__.call(this);
	    }

	    MulticastObservable.prototype.subscribeCore = function (o) {
	      var connectable = this.source.multicast(this._fn1());
	      return new BinaryDisposable(this._fn2(connectable).subscribe(o), connectable.connect());
	    };

	    return MulticastObservable;
	  }(ObservableBase));

	  /**
	   * Multicasts the source sequence notifications through an instantiated subject into all uses of the sequence within a selector function. Each
	   * subscription to the resulting sequence causes a separate multicast invocation, exposing the sequence resulting from the selector function's
	   * invocation. For specializations with fixed subject types, see Publish, PublishLast, and Replay.
	   *
	   * @example
	   * 1 - res = source.multicast(observable);
	   * 2 - res = source.multicast(function () { return new Subject(); }, function (x) { return x; });
	   *
	   * @param {Function|Subject} subjectOrSubjectSelector
	   * Factory function to create an intermediate subject through which the source sequence's elements will be multicast to the selector function.
	   * Or:
	   * Subject to push source elements into.
	   *
	   * @param {Function} [selector] Optional selector function which can use the multicasted source sequence subject to the policies enforced by the created subject. Specified only if <paramref name="subjectOrSubjectSelector" is a factory function.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
	   */
	  observableProto.multicast = function (subjectOrSubjectSelector, selector) {
	    return isFunction(subjectOrSubjectSelector) ?
	      new MulticastObservable(this, subjectOrSubjectSelector, selector) :
	      new ConnectableObservable(this, subjectOrSubjectSelector);
	  };

	  /**
	   * Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence.
	   * This operator is a specialization of Multicast using a regular Subject.
	   *
	   * @example
	   * var resres = source.publish();
	   * var res = source.publish(function (x) { return x; });
	   *
	   * @param {Function} [selector] Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will receive all notifications of the source from the time of the subscription on.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
	   */
	  observableProto.publish = function (selector) {
	    return selector && isFunction(selector) ?
	      this.multicast(function () { return new Subject(); }, selector) :
	      this.multicast(new Subject());
	  };

	  /**
	   * Returns an observable sequence that shares a single subscription to the underlying sequence.
	   * This operator is a specialization of publish which creates a subscription when the number of observers goes from zero to one, then shares that subscription with all subsequent observers until the number of observers returns to zero, at which point the subscription is disposed.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence.
	   */
	  observableProto.share = function () {
	    return this.publish().refCount();
	  };

	  /**
	   * Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence containing only the last notification.
	   * This operator is a specialization of Multicast using a AsyncSubject.
	   *
	   * @example
	   * var res = source.publishLast();
	   * var res = source.publishLast(function (x) { return x; });
	   *
	   * @param selector [Optional] Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will only receive the last notification of the source.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
	   */
	  observableProto.publishLast = function (selector) {
	    return selector && isFunction(selector) ?
	      this.multicast(function () { return new AsyncSubject(); }, selector) :
	      this.multicast(new AsyncSubject());
	  };

	  /**
	   * Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence and starts with initialValue.
	   * This operator is a specialization of Multicast using a BehaviorSubject.
	   *
	   * @example
	   * var res = source.publishValue(42);
	   * var res = source.publishValue(function (x) { return x.select(function (y) { return y * y; }) }, 42);
	   *
	   * @param {Function} [selector] Optional selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will receive immediately receive the initial value, followed by all notifications of the source from the time of the subscription on.
	   * @param {Mixed} initialValue Initial value received by observers upon subscription.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
	   */
	  observableProto.publishValue = function (initialValueOrSelector, initialValue) {
	    return arguments.length === 2 ?
	      this.multicast(function () {
	        return new BehaviorSubject(initialValue);
	      }, initialValueOrSelector) :
	      this.multicast(new BehaviorSubject(initialValueOrSelector));
	  };

	  /**
	   * Returns an observable sequence that shares a single subscription to the underlying sequence and starts with an initialValue.
	   * This operator is a specialization of publishValue which creates a subscription when the number of observers goes from zero to one, then shares that subscription with all subsequent observers until the number of observers returns to zero, at which point the subscription is disposed.
	   * @param {Mixed} initialValue Initial value received by observers upon subscription.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence.
	   */
	  observableProto.shareValue = function (initialValue) {
	    return this.publishValue(initialValue).refCount();
	  };

	  /**
	   * Returns an observable sequence that is the result of invoking the selector on a connectable observable sequence that shares a single subscription to the underlying sequence replaying notifications subject to a maximum time length for the replay buffer.
	   * This operator is a specialization of Multicast using a ReplaySubject.
	   *
	   * @example
	   * var res = source.replay(null, 3);
	   * var res = source.replay(null, 3, 500);
	   * var res = source.replay(null, 3, 500, scheduler);
	   * var res = source.replay(function (x) { return x.take(6).repeat(); }, 3, 500, scheduler);
	   *
	   * @param selector [Optional] Selector function which can use the multicasted source sequence as many times as needed, without causing multiple subscriptions to the source sequence. Subscribers to the given source will receive all the notifications of the source subject to the specified replay buffer trimming policy.
	   * @param bufferSize [Optional] Maximum element count of the replay buffer.
	   * @param windowSize [Optional] Maximum time length of the replay buffer.
	   * @param scheduler [Optional] Scheduler where connected observers within the selector function will be invoked on.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
	   */
	  observableProto.replay = function (selector, bufferSize, windowSize, scheduler) {
	    return selector && isFunction(selector) ?
	      this.multicast(function () { return new ReplaySubject(bufferSize, windowSize, scheduler); }, selector) :
	      this.multicast(new ReplaySubject(bufferSize, windowSize, scheduler));
	  };

	  /**
	   * Returns an observable sequence that shares a single subscription to the underlying sequence replaying notifications subject to a maximum time length for the replay buffer.
	   * This operator is a specialization of replay which creates a subscription when the number of observers goes from zero to one, then shares that subscription with all subsequent observers until the number of observers returns to zero, at which point the subscription is disposed.
	   *
	   * @example
	   * var res = source.shareReplay(3);
	   * var res = source.shareReplay(3, 500);
	   * var res = source.shareReplay(3, 500, scheduler);
	   *

	   * @param bufferSize [Optional] Maximum element count of the replay buffer.
	   * @param window [Optional] Maximum time length of the replay buffer.
	   * @param scheduler [Optional] Scheduler where connected observers within the selector function will be invoked on.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence.
	   */
	  observableProto.shareReplay = function (bufferSize, windowSize, scheduler) {
	    return this.replay(null, bufferSize, windowSize, scheduler).refCount();
	  };

	  var InnerSubscription = function (s, o) {
	    this._s = s;
	    this._o = o;
	  };

	  InnerSubscription.prototype.dispose = function () {
	    if (!this._s.isDisposed && this._o !== null) {
	      var idx = this._s.observers.indexOf(this._o);
	      this._s.observers.splice(idx, 1);
	      this._o = null;
	    }
	  };

	  var RefCountObservable = (function (__super__) {
	    inherits(RefCountObservable, __super__);
	    function RefCountObservable(source) {
	      this.source = source;
	      this._count = 0;
	      this._connectableSubscription = null;
	      __super__.call(this);
	    }

	    RefCountObservable.prototype.subscribeCore = function (o) {
	      var subscription = this.source.subscribe(o);
	      ++this._count === 1 && (this._connectableSubscription = this.source.connect());
	      return new RefCountDisposable(this, subscription);
	    };

	    function RefCountDisposable(p, s) {
	      this._p = p;
	      this._s = s;
	      this.isDisposed = false;
	    }

	    RefCountDisposable.prototype.dispose = function () {
	      if (!this.isDisposed) {
	        this.isDisposed = true;
	        this._s.dispose();
	        --this._p._count === 0 && this._p._connectableSubscription.dispose();
	      }
	    };

	    return RefCountObservable;
	  }(ObservableBase));

	  var ConnectableObservable = Rx.ConnectableObservable = (function (__super__) {
	    inherits(ConnectableObservable, __super__);
	    function ConnectableObservable(source, subject) {
	      this.source = source;
	      this._connection = null;
	      this._source = source.asObservable();
	      this._subject = subject;
	      __super__.call(this);
	    }

	    function ConnectDisposable(parent, subscription) {
	      this._p = parent;
	      this._s = subscription;
	    }

	    ConnectDisposable.prototype.dispose = function () {
	      if (this._s) {
	        this._s.dispose();
	        this._s = null;
	        this._p._connection = null;
	      }
	    };

	    ConnectableObservable.prototype.connect = function () {
	      if (!this._connection) {
	        if (this._subject.isStopped) {
	          return disposableEmpty;
	        }
	        var subscription = this._source.subscribe(this._subject);
	        this._connection = new ConnectDisposable(this, subscription);
	      }
	      return this._connection;
	    };

	    ConnectableObservable.prototype._subscribe = function (o) {
	      return this._subject.subscribe(o);
	    };

	    ConnectableObservable.prototype.refCount = function () {
	      return new RefCountObservable(this);
	    };

	    return ConnectableObservable;
	  }(Observable));

	  /**
	   * Returns an observable sequence that shares a single subscription to the underlying sequence. This observable sequence
	   * can be resubscribed to, even if all prior subscriptions have ended. (unlike `.publish().refCount()`)
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source.
	   */
	  observableProto.singleInstance = function() {
	    var source = this, hasObservable = false, observable;

	    function getObservable() {
	      if (!hasObservable) {
	        hasObservable = true;
	        observable = source['finally'](function() { hasObservable = false; }).publish().refCount();
	      }
	      return observable;
	    }

	    return new AnonymousObservable(function(o) {
	      return getObservable().subscribe(o);
	    });
	  };

	  /**
	   *  Correlates the elements of two sequences based on overlapping durations.
	   *
	   *  @param {Observable} right The right observable sequence to join elements for.
	   *  @param {Function} leftDurationSelector A function to select the duration (expressed as an observable sequence) of each element of the left observable sequence, used to determine overlap.
	   *  @param {Function} rightDurationSelector A function to select the duration (expressed as an observable sequence) of each element of the right observable sequence, used to determine overlap.
	   *  @param {Function} resultSelector A function invoked to compute a result element for any two overlapping elements of the left and right observable sequences. The parameters passed to the function correspond with the elements from the left and right source sequences for which overlap occurs.
	   *  @returns {Observable} An observable sequence that contains result elements computed from source elements that have an overlapping duration.
	   */
	  observableProto.join = function (right, leftDurationSelector, rightDurationSelector, resultSelector) {
	    var left = this;
	    return new AnonymousObservable(function (o) {
	      var group = new CompositeDisposable();
	      var leftDone = false, rightDone = false;
	      var leftId = 0, rightId = 0;
	      var leftMap = new Map(), rightMap = new Map();
	      var handleError = function (e) { o.onError(e); };

	      group.add(left.subscribe(
	        function (value) {
	          var id = leftId++, md = new SingleAssignmentDisposable();

	          leftMap.set(id, value);
	          group.add(md);

	          var duration = tryCatch(leftDurationSelector)(value);
	          if (duration === errorObj) { return o.onError(duration.e); }

	          md.setDisposable(duration.take(1).subscribe(
	            noop,
	            handleError,
	            function () {
	              leftMap['delete'](id) && leftMap.size === 0 && leftDone && o.onCompleted();
	              group.remove(md);
	            }));

	          rightMap.forEach(function (v) {
	            var result = tryCatch(resultSelector)(value, v);
	            if (result === errorObj) { return o.onError(result.e); }
	            o.onNext(result);
	          });
	        },
	        handleError,
	        function () {
	          leftDone = true;
	          (rightDone || leftMap.size === 0) && o.onCompleted();
	        })
	      );

	      group.add(right.subscribe(
	        function (value) {
	          var id = rightId++, md = new SingleAssignmentDisposable();

	          rightMap.set(id, value);
	          group.add(md);

	          var duration = tryCatch(rightDurationSelector)(value);
	          if (duration === errorObj) { return o.onError(duration.e); }

	          md.setDisposable(duration.take(1).subscribe(
	            noop,
	            handleError,
	            function () {
	              rightMap['delete'](id) && rightMap.size === 0 && rightDone && o.onCompleted();
	              group.remove(md);
	            }));

	          leftMap.forEach(function (v) {
	            var result = tryCatch(resultSelector)(v, value);
	            if (result === errorObj) { return o.onError(result.e); }
	            o.onNext(result);
	          });
	        },
	        handleError,
	        function () {
	          rightDone = true;
	          (leftDone || rightMap.size === 0) && o.onCompleted();
	        })
	      );
	      return group;
	    }, left);
	  };

	  /**
	   *  Correlates the elements of two sequences based on overlapping durations, and groups the results.
	   *
	   *  @param {Observable} right The right observable sequence to join elements for.
	   *  @param {Function} leftDurationSelector A function to select the duration (expressed as an observable sequence) of each element of the left observable sequence, used to determine overlap.
	   *  @param {Function} rightDurationSelector A function to select the duration (expressed as an observable sequence) of each element of the right observable sequence, used to determine overlap.
	   *  @param {Function} resultSelector A function invoked to compute a result element for any element of the left sequence with overlapping elements from the right observable sequence. The first parameter passed to the function is an element of the left sequence. The second parameter passed to the function is an observable sequence with elements from the right sequence that overlap with the left sequence's element.
	   *  @returns {Observable} An observable sequence that contains result elements computed from source elements that have an overlapping duration.
	   */
	  observableProto.groupJoin = function (right, leftDurationSelector, rightDurationSelector, resultSelector) {
	    var left = this;
	    return new AnonymousObservable(function (o) {
	      var group = new CompositeDisposable();
	      var r = new RefCountDisposable(group);
	      var leftMap = new Map(), rightMap = new Map();
	      var leftId = 0, rightId = 0;
	      var handleError = function (e) { return function (v) { v.onError(e); }; };

	      function handleError(e) { };

	      group.add(left.subscribe(
	        function (value) {
	          var s = new Subject();
	          var id = leftId++;
	          leftMap.set(id, s);

	          var result = tryCatch(resultSelector)(value, addRef(s, r));
	          if (result === errorObj) {
	            leftMap.forEach(handleError(result.e));
	            return o.onError(result.e);
	          }
	          o.onNext(result);

	          rightMap.forEach(function (v) { s.onNext(v); });

	          var md = new SingleAssignmentDisposable();
	          group.add(md);

	          var duration = tryCatch(leftDurationSelector)(value);
	          if (duration === errorObj) {
	            leftMap.forEach(handleError(duration.e));
	            return o.onError(duration.e);
	          }

	          md.setDisposable(duration.take(1).subscribe(
	            noop,
	            function (e) {
	              leftMap.forEach(handleError(e));
	              o.onError(e);
	            },
	            function () {
	              leftMap['delete'](id) && s.onCompleted();
	              group.remove(md);
	            }));
	        },
	        function (e) {
	          leftMap.forEach(handleError(e));
	          o.onError(e);
	        },
	        function () { o.onCompleted(); })
	      );

	      group.add(right.subscribe(
	        function (value) {
	          var id = rightId++;
	          rightMap.set(id, value);

	          var md = new SingleAssignmentDisposable();
	          group.add(md);

	          var duration = tryCatch(rightDurationSelector)(value);
	          if (duration === errorObj) {
	            leftMap.forEach(handleError(duration.e));
	            return o.onError(duration.e);
	          }

	          md.setDisposable(duration.take(1).subscribe(
	            noop,
	            function (e) {
	              leftMap.forEach(handleError(e));
	              o.onError(e);
	            },
	            function () {
	              rightMap['delete'](id);
	              group.remove(md);
	            }));

	          leftMap.forEach(function (v) { v.onNext(value); });
	        },
	        function (e) {
	          leftMap.forEach(handleError(e));
	          o.onError(e);
	        })
	      );

	      return r;
	    }, left);
	  };

	  function toArray(x) { return x.toArray(); }

	  /**
	   *  Projects each element of an observable sequence into zero or more buffers.
	   *  @param {Mixed} bufferOpeningsOrClosingSelector Observable sequence whose elements denote the creation of new windows, or, a function invoked to define the boundaries of the produced windows (a new window is started when the previous one is closed, resulting in non-overlapping windows).
	   *  @param {Function} [bufferClosingSelector] A function invoked to define the closing of each produced window. If a closing selector function is specified for the first parameter, this parameter is ignored.
	   *  @returns {Observable} An observable sequence of windows.
	   */
	  observableProto.buffer = function () {
	    return this.window.apply(this, arguments)
	      .flatMap(toArray);
	  };

	  /**
	   *  Projects each element of an observable sequence into zero or more windows.
	   *
	   *  @param {Mixed} windowOpeningsOrClosingSelector Observable sequence whose elements denote the creation of new windows, or, a function invoked to define the boundaries of the produced windows (a new window is started when the previous one is closed, resulting in non-overlapping windows).
	   *  @param {Function} [windowClosingSelector] A function invoked to define the closing of each produced window. If a closing selector function is specified for the first parameter, this parameter is ignored.
	   *  @returns {Observable} An observable sequence of windows.
	   */
	  observableProto.window = function (windowOpeningsOrClosingSelector, windowClosingSelector) {
	    if (arguments.length === 1 && typeof arguments[0] !== 'function') {
	      return observableWindowWithBoundaries.call(this, windowOpeningsOrClosingSelector);
	    }
	    return typeof windowOpeningsOrClosingSelector === 'function' ?
	      observableWindowWithClosingSelector.call(this, windowOpeningsOrClosingSelector) :
	      observableWindowWithOpenings.call(this, windowOpeningsOrClosingSelector, windowClosingSelector);
	  };

	  function observableWindowWithOpenings(windowOpenings, windowClosingSelector) {
	    return windowOpenings.groupJoin(this, windowClosingSelector, observableEmpty, function (_, win) {
	      return win;
	    });
	  }

	  function observableWindowWithBoundaries(windowBoundaries) {
	    var source = this;
	    return new AnonymousObservable(function (observer) {
	      var win = new Subject(),
	        d = new CompositeDisposable(),
	        r = new RefCountDisposable(d);

	      observer.onNext(addRef(win, r));

	      d.add(source.subscribe(function (x) {
	        win.onNext(x);
	      }, function (err) {
	        win.onError(err);
	        observer.onError(err);
	      }, function () {
	        win.onCompleted();
	        observer.onCompleted();
	      }));

	      isPromise(windowBoundaries) && (windowBoundaries = observableFromPromise(windowBoundaries));

	      d.add(windowBoundaries.subscribe(function (w) {
	        win.onCompleted();
	        win = new Subject();
	        observer.onNext(addRef(win, r));
	      }, function (err) {
	        win.onError(err);
	        observer.onError(err);
	      }, function () {
	        win.onCompleted();
	        observer.onCompleted();
	      }));

	      return r;
	    }, source);
	  }

	  function observableWindowWithClosingSelector(windowClosingSelector) {
	    var source = this;
	    return new AnonymousObservable(function (observer) {
	      var m = new SerialDisposable(),
	        d = new CompositeDisposable(m),
	        r = new RefCountDisposable(d),
	        win = new Subject();
	      observer.onNext(addRef(win, r));
	      d.add(source.subscribe(function (x) {
	          win.onNext(x);
	      }, function (err) {
	          win.onError(err);
	          observer.onError(err);
	      }, function () {
	          win.onCompleted();
	          observer.onCompleted();
	      }));

	      function createWindowClose () {
	        var windowClose;
	        try {
	          windowClose = windowClosingSelector();
	        } catch (e) {
	          observer.onError(e);
	          return;
	        }

	        isPromise(windowClose) && (windowClose = observableFromPromise(windowClose));

	        var m1 = new SingleAssignmentDisposable();
	        m.setDisposable(m1);
	        m1.setDisposable(windowClose.take(1).subscribe(noop, function (err) {
	          win.onError(err);
	          observer.onError(err);
	        }, function () {
	          win.onCompleted();
	          win = new Subject();
	          observer.onNext(addRef(win, r));
	          createWindowClose();
	        }));
	      }

	      createWindowClose();
	      return r;
	    }, source);
	  }

	  var PairwiseObservable = (function (__super__) {
	    inherits(PairwiseObservable, __super__);
	    function PairwiseObservable(source) {
	      this.source = source;
	      __super__.call(this);
	    }

	    PairwiseObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new PairwiseObserver(o));
	    };

	    return PairwiseObservable;
	  }(ObservableBase));

	  var PairwiseObserver = (function(__super__) {
	    inherits(PairwiseObserver, __super__);
	    function PairwiseObserver(o) {
	      this._o = o;
	      this._p = null;
	      this._hp = false;
	      __super__.call(this);
	    }

	    PairwiseObserver.prototype.next = function (x) {
	      if (this._hp) {
	        this._o.onNext([this._p, x]);
	      } else {
	        this._hp = true;
	      }
	      this._p = x;
	    };
	    PairwiseObserver.prototype.error = function (err) { this._o.onError(err); };
	    PairwiseObserver.prototype.completed = function () { this._o.onCompleted(); };

	    return PairwiseObserver;
	  }(AbstractObserver));

	  /**
	   * Returns a new observable that triggers on the second and subsequent triggerings of the input observable.
	   * The Nth triggering of the input observable passes the arguments from the N-1th and Nth triggering as a pair.
	   * The argument passed to the N-1th triggering is held in hidden internal state until the Nth triggering occurs.
	   * @returns {Observable} An observable that triggers on successive pairs of observations from the input observable as an array.
	   */
	  observableProto.pairwise = function () {
	    return new PairwiseObservable(this);
	  };

	  /**
	   * Returns two observables which partition the observations of the source by the given function.
	   * The first will trigger observations for those values for which the predicate returns true.
	   * The second will trigger observations for those values where the predicate returns false.
	   * The predicate is executed once for each subscribed observer.
	   * Both also propagate all error observations arising from the source and each completes
	   * when the source completes.
	   * @param {Function} predicate
	   *    The function to determine which output Observable will trigger a particular observation.
	   * @returns {Array}
	   *    An array of observables. The first triggers when the predicate returns true,
	   *    and the second triggers when the predicate returns false.
	  */
	  observableProto.partition = function(predicate, thisArg) {
	    var fn = bindCallback(predicate, thisArg, 3);
	    return [
	      this.filter(predicate, thisArg),
	      this.filter(function (x, i, o) { return !fn(x, i, o); })
	    ];
	  };

	  var WhileEnumerable = (function(__super__) {
	    inherits(WhileEnumerable, __super__);
	    function WhileEnumerable(c, s) {
	      this.c = c;
	      this.s = s;
	    }
	    WhileEnumerable.prototype[$iterator$] = function () {
	      var self = this;
	      return {
	        next: function () {
	          return self.c() ?
	           { done: false, value: self.s } :
	           { done: true, value: void 0 };
	        }
	      };
	    };
	    return WhileEnumerable;
	  }(Enumerable));
	  
	  function enumerableWhile(condition, source) {
	    return new WhileEnumerable(condition, source);
	  }  

	   /**
	   *  Returns an observable sequence that is the result of invoking the selector on the source sequence, without sharing subscriptions.
	   *  This operator allows for a fluent style of writing queries that use the same sequence multiple times.
	   *
	   * @param {Function} selector Selector function which can use the source sequence as many times as needed, without sharing subscriptions to the source sequence.
	   * @returns {Observable} An observable sequence that contains the elements of a sequence produced by multicasting the source sequence within a selector function.
	   */
	  observableProto.letBind = observableProto['let'] = function (func) {
	    return func(this);
	  };

	   /**
	   *  Determines whether an observable collection contains values. 
	   *
	   * @example
	   *  1 - res = Rx.Observable.if(condition, obs1);
	   *  2 - res = Rx.Observable.if(condition, obs1, obs2);
	   *  3 - res = Rx.Observable.if(condition, obs1, scheduler);
	   * @param {Function} condition The condition which determines if the thenSource or elseSource will be run.
	   * @param {Observable} thenSource The observable sequence or Promise that will be run if the condition function returns true.
	   * @param {Observable} [elseSource] The observable sequence or Promise that will be run if the condition function returns false. If this is not provided, it defaults to Rx.Observabe.Empty with the specified scheduler.
	   * @returns {Observable} An observable sequence which is either the thenSource or elseSource.
	   */
	  Observable['if'] = function (condition, thenSource, elseSourceOrScheduler) {
	    return observableDefer(function () {
	      elseSourceOrScheduler || (elseSourceOrScheduler = observableEmpty());

	      isPromise(thenSource) && (thenSource = observableFromPromise(thenSource));
	      isPromise(elseSourceOrScheduler) && (elseSourceOrScheduler = observableFromPromise(elseSourceOrScheduler));

	      // Assume a scheduler for empty only
	      typeof elseSourceOrScheduler.now === 'function' && (elseSourceOrScheduler = observableEmpty(elseSourceOrScheduler));
	      return condition() ? thenSource : elseSourceOrScheduler;
	    });
	  };

	   /**
	   *  Concatenates the observable sequences obtained by running the specified result selector for each element in source.
	   * There is an alias for this method called 'forIn' for browsers <IE9
	   * @param {Array} sources An array of values to turn into an observable sequence.
	   * @param {Function} resultSelector A function to apply to each item in the sources array to turn it into an observable sequence.
	   * @returns {Observable} An observable sequence from the concatenated observable sequences.
	   */
	  Observable['for'] = Observable.forIn = function (sources, resultSelector, thisArg) {
	    return enumerableOf(sources, resultSelector, thisArg).concat();
	  };

	   /**
	   *  Repeats source as long as condition holds emulating a while loop.
	   * There is an alias for this method called 'whileDo' for browsers <IE9
	   *
	   * @param {Function} condition The condition which determines if the source will be repeated.
	   * @param {Observable} source The observable sequence that will be run if the condition function returns true.
	   * @returns {Observable} An observable sequence which is repeated as long as the condition holds.
	   */
	  var observableWhileDo = Observable['while'] = Observable.whileDo = function (condition, source) {
	    isPromise(source) && (source = observableFromPromise(source));
	    return enumerableWhile(condition, source).concat();
	  };

	   /**
	   *  Repeats source as long as condition holds emulating a do while loop.
	   *
	   * @param {Function} condition The condition which determines if the source will be repeated.
	   * @param {Observable} source The observable sequence that will be run if the condition function returns true.
	   * @returns {Observable} An observable sequence which is repeated as long as the condition holds.
	   */
	  observableProto.doWhile = function (condition) {
	    return observableConcat([this, observableWhileDo(condition, this)]);
	  };

	   /**
	   *  Uses selector to determine which source in sources to use.
	   * @param {Function} selector The function which extracts the value for to test in a case statement.
	   * @param {Array} sources A object which has keys which correspond to the case statement labels.
	   * @param {Observable} [elseSource] The observable sequence or Promise that will be run if the sources are not matched. If this is not provided, it defaults to Rx.Observabe.empty with the specified scheduler.
	   *
	   * @returns {Observable} An observable sequence which is determined by a case statement.
	   */
	  Observable['case'] = function (selector, sources, defaultSourceOrScheduler) {
	    return observableDefer(function () {
	      isPromise(defaultSourceOrScheduler) && (defaultSourceOrScheduler = observableFromPromise(defaultSourceOrScheduler));
	      defaultSourceOrScheduler || (defaultSourceOrScheduler = observableEmpty());

	      isScheduler(defaultSourceOrScheduler) && (defaultSourceOrScheduler = observableEmpty(defaultSourceOrScheduler));

	      var result = sources[selector()];
	      isPromise(result) && (result = observableFromPromise(result));

	      return result || defaultSourceOrScheduler;
	    });
	  };

	  var ExpandObservable = (function(__super__) {
	    inherits(ExpandObservable, __super__);
	    function ExpandObservable(source, fn, scheduler) {
	      this.source = source;
	      this._fn = fn;
	      this._scheduler = scheduler;
	      __super__.call(this);
	    }

	    function scheduleRecursive(args, recurse) {
	      var state = args[0], self = args[1];
	      var work;
	      if (state.q.length > 0) {
	        work = state.q.shift();
	      } else {
	        state.isAcquired = false;
	        return;
	      }
	      var m1 = new SingleAssignmentDisposable();
	      state.d.add(m1);
	      m1.setDisposable(work.subscribe(new ExpandObserver(state, self, m1)));
	      recurse([state, self]);
	    }

	    ExpandObservable.prototype._ensureActive = function (state) {
	      var isOwner = false;
	      if (state.q.length > 0) {
	        isOwner = !state.isAcquired;
	        state.isAcquired = true;
	      }
	      isOwner && state.m.setDisposable(this._scheduler.scheduleRecursive([state, this], scheduleRecursive));
	    };

	    ExpandObservable.prototype.subscribeCore = function (o) {
	      var m = new SerialDisposable(),
	        d = new CompositeDisposable(m),
	        state = {
	          q: [],
	          m: m,
	          d: d,
	          activeCount: 0,
	          isAcquired: false,
	          o: o
	        };

	      state.q.push(this.source);
	      state.activeCount++;
	      this._ensureActive(state);
	      return d;
	    };

	    return ExpandObservable;
	  }(ObservableBase));

	  var ExpandObserver = (function(__super__) {
	    inherits(ExpandObserver, __super__);
	    function ExpandObserver(state, parent, m1) {
	      this._s = state;
	      this._p = parent;
	      this._m1 = m1;
	      __super__.call(this);
	    }

	    ExpandObserver.prototype.next = function (x) {
	      this._s.o.onNext(x);
	      var result = tryCatch(this._p._fn)(x);
	      if (result === errorObj) { return this._s.o.onError(result.e); }
	      this._s.q.push(result);
	      this._s.activeCount++;
	      this._p._ensureActive(this._s);
	    };

	    ExpandObserver.prototype.error = function (e) {
	      this._s.o.onError(e);
	    };

	    ExpandObserver.prototype.completed = function () {
	      this._s.d.remove(this._m1);
	      this._s.activeCount--;
	      this._s.activeCount === 0 && this._s.o.onCompleted();
	    };

	    return ExpandObserver;
	  }(AbstractObserver));

	   /**
	   *  Expands an observable sequence by recursively invoking selector.
	   *
	   * @param {Function} selector Selector function to invoke for each produced element, resulting in another sequence to which the selector will be invoked recursively again.
	   * @param {Scheduler} [scheduler] Scheduler on which to perform the expansion. If not provided, this defaults to the current thread scheduler.
	   * @returns {Observable} An observable sequence containing all the elements produced by the recursive expansion.
	   */
	  observableProto.expand = function (selector, scheduler) {
	    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
	    return new ExpandObservable(this, selector, scheduler);
	  };

	  function argumentsToArray() {
	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    return args;
	  }

	  var ForkJoinObservable = (function (__super__) {
	    inherits(ForkJoinObservable, __super__);
	    function ForkJoinObservable(sources, cb) {
	      this._sources = sources;
	      this._cb = cb;
	      __super__.call(this);
	    }

	    ForkJoinObservable.prototype.subscribeCore = function (o) {
	      if (this._sources.length === 0) {
	        o.onCompleted();
	        return disposableEmpty;
	      }

	      var count = this._sources.length;
	      var state = {
	        finished: false,
	        hasResults: new Array(count),
	        hasCompleted: new Array(count),
	        results: new Array(count)
	      };

	      var subscriptions = new CompositeDisposable();
	      for (var i = 0, len = this._sources.length; i < len; i++) {
	        var source = this._sources[i];
	        isPromise(source) && (source = observableFromPromise(source));
	        subscriptions.add(source.subscribe(new ForkJoinObserver(o, state, i, this._cb, subscriptions)));
	      }

	      return subscriptions;
	    };

	    return ForkJoinObservable;
	  }(ObservableBase));

	  var ForkJoinObserver = (function(__super__) {
	    inherits(ForkJoinObserver, __super__);
	    function ForkJoinObserver(o, s, i, cb, subs) {
	      this._o = o;
	      this._s = s;
	      this._i = i;
	      this._cb = cb;
	      this._subs = subs;
	      __super__.call(this);
	    }

	    ForkJoinObserver.prototype.next = function (x) {
	      if (!this._s.finished) {
	        this._s.hasResults[this._i] = true;
	        this._s.results[this._i] = x;
	      }
	    };

	    ForkJoinObserver.prototype.error = function (e) {
	      this._s.finished = true;
	      this._o.onError(e);
	      this._subs.dispose();
	    };

	    ForkJoinObserver.prototype.completed = function () {
	      if (!this._s.finished) {
	        if (!this._s.hasResults[this._i]) {
	          return this._o.onCompleted();
	        }
	        this._s.hasCompleted[this._i] = true;
	        for (var i = 0; i < this._s.results.length; i++) {
	          if (!this._s.hasCompleted[i]) { return; }
	        }
	        this._s.finished = true;

	        var res = tryCatch(this._cb).apply(null, this._s.results);
	        if (res === errorObj) { return this._o.onError(res.e); }

	        this._o.onNext(res);
	        this._o.onCompleted();
	      }
	    };

	    return ForkJoinObserver;
	  }(AbstractObserver));

	   /**
	   *  Runs all observable sequences in parallel and collect their last elements.
	   *
	   * @example
	   *  1 - res = Rx.Observable.forkJoin([obs1, obs2]);
	   *  1 - res = Rx.Observable.forkJoin(obs1, obs2, ...);
	   * @returns {Observable} An observable sequence with an array collecting the last elements of all the input sequences.
	   */
	  Observable.forkJoin = function () {
	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    var resultSelector = isFunction(args[len - 1]) ? args.pop() : argumentsToArray;
	    Array.isArray(args[0]) && (args = args[0]);
	    return new ForkJoinObservable(args, resultSelector);
	  };

	   /**
	   *  Runs two observable sequences in parallel and combines their last elemenets.
	   * @param {Observable} second Second observable sequence.
	   * @param {Function} resultSelector Result selector function to invoke with the last elements of both sequences.
	   * @returns {Observable} An observable sequence with the result of calling the selector function with the last elements of both input sequences.
	   */
	  observableProto.forkJoin = function () {
	    var len = arguments.length, args = new Array(len);
	    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
	    if (Array.isArray(args[0])) {
	      args[0].unshift(this);
	    } else {
	      args.unshift(this);
	    }
	    return Observable.forkJoin.apply(null, args);
	  };

	  /**
	   * Comonadic bind operator.
	   * @param {Function} selector A transform function to apply to each element.
	   * @param {Object} scheduler Scheduler used to execute the operation. If not specified, defaults to the ImmediateScheduler.
	   * @returns {Observable} An observable sequence which results from the comonadic bind operation.
	   */
	  observableProto.manySelect = observableProto.extend = function (selector, scheduler) {
	    isScheduler(scheduler) || (scheduler = Rx.Scheduler.immediate);
	    var source = this;
	    return observableDefer(function () {
	      var chain;

	      return source
	        .map(function (x) {
	          var curr = new ChainObservable(x);

	          chain && chain.onNext(x);
	          chain = curr;

	          return curr;
	        })
	        .tap(
	          noop,
	          function (e) { chain && chain.onError(e); },
	          function () { chain && chain.onCompleted(); }
	        )
	        .observeOn(scheduler)
	        .map(selector);
	    }, source);
	  };

	  var ChainObservable = (function (__super__) {
	    inherits(ChainObservable, __super__);
	    function ChainObservable(head) {
	      __super__.call(this);
	      this.head = head;
	      this.tail = new AsyncSubject();
	    }

	    addProperties(ChainObservable.prototype, Observer, {
	      _subscribe: function (o) {
	        var g = new CompositeDisposable();
	        g.add(currentThreadScheduler.schedule(this, function (_, self) {
	          o.onNext(self.head);
	          g.add(self.tail.mergeAll().subscribe(o));
	        }));

	        return g;
	      },
	      onCompleted: function () {
	        this.onNext(Observable.empty());
	      },
	      onError: function (e) {
	        this.onNext(Observable['throw'](e));
	      },
	      onNext: function (v) {
	        this.tail.onNext(v);
	        this.tail.onCompleted();
	      }
	    });

	    return ChainObservable;

	  }(Observable));

	  var Map = root.Map || (function () {
	    function Map() {
	      this.size = 0;
	      this._values = [];
	      this._keys = [];
	    }

	    Map.prototype['delete'] = function (key) {
	      var i = this._keys.indexOf(key);
	      if (i === -1) { return false; }
	      this._values.splice(i, 1);
	      this._keys.splice(i, 1);
	      this.size--;
	      return true;
	    };

	    Map.prototype.get = function (key) {
	      var i = this._keys.indexOf(key);
	      return i === -1 ? undefined : this._values[i];
	    };

	    Map.prototype.set = function (key, value) {
	      var i = this._keys.indexOf(key);
	      if (i === -1) {
	        this._keys.push(key);
	        this._values.push(value);
	        this.size++;
	      } else {
	        this._values[i] = value;
	      }
	      return this;
	    };

	    Map.prototype.forEach = function (cb, thisArg) {
	      for (var i = 0; i < this.size; i++) {
	        cb.call(thisArg, this._values[i], this._keys[i]);
	      }
	    };

	    return Map;
	  }());

	  /**
	   * @constructor
	   * Represents a join pattern over observable sequences.
	   */
	  function Pattern(patterns) {
	    this.patterns = patterns;
	  }

	  /**
	   *  Creates a pattern that matches the current plan matches and when the specified observable sequences has an available value.
	   *  @param other Observable sequence to match in addition to the current pattern.
	   *  @return {Pattern} Pattern object that matches when all observable sequences in the pattern have an available value.
	   */
	  Pattern.prototype.and = function (other) {
	    return new Pattern(this.patterns.concat(other));
	  };

	  /**
	   *  Matches when all observable sequences in the pattern (specified using a chain of and operators) have an available value and projects the values.
	   *  @param {Function} selector Selector that will be invoked with available values from the source sequences, in the same order of the sequences in the pattern.
	   *  @return {Plan} Plan that produces the projected values, to be fed (with other plans) to the when operator.
	   */
	  Pattern.prototype.thenDo = function (selector) {
	    return new Plan(this, selector);
	  };

	  function Plan(expression, selector) {
	    this.expression = expression;
	    this.selector = selector;
	  }

	  function handleOnError(o) { return function (e) { o.onError(e); }; }
	  function handleOnNext(self, observer) {
	    return function onNext () {
	      var result = tryCatch(self.selector).apply(self, arguments);
	      if (result === errorObj) { return observer.onError(result.e); }
	      observer.onNext(result);
	    };
	  }

	  Plan.prototype.activate = function (externalSubscriptions, observer, deactivate) {
	    var joinObservers = [], errHandler = handleOnError(observer);
	    for (var i = 0, len = this.expression.patterns.length; i < len; i++) {
	      joinObservers.push(planCreateObserver(externalSubscriptions, this.expression.patterns[i], errHandler));
	    }
	    var activePlan = new ActivePlan(joinObservers, handleOnNext(this, observer), function () {
	      for (var j = 0, jlen = joinObservers.length; j < jlen; j++) {
	        joinObservers[j].removeActivePlan(activePlan);
	      }
	      deactivate(activePlan);
	    });
	    for (i = 0, len = joinObservers.length; i < len; i++) {
	      joinObservers[i].addActivePlan(activePlan);
	    }
	    return activePlan;
	  };

	  function planCreateObserver(externalSubscriptions, observable, onError) {
	    var entry = externalSubscriptions.get(observable);
	    if (!entry) {
	      var observer = new JoinObserver(observable, onError);
	      externalSubscriptions.set(observable, observer);
	      return observer;
	    }
	    return entry;
	  }

	  function ActivePlan(joinObserverArray, onNext, onCompleted) {
	    this.joinObserverArray = joinObserverArray;
	    this.onNext = onNext;
	    this.onCompleted = onCompleted;
	    this.joinObservers = new Map();
	    for (var i = 0, len = this.joinObserverArray.length; i < len; i++) {
	      var joinObserver = this.joinObserverArray[i];
	      this.joinObservers.set(joinObserver, joinObserver);
	    }
	  }

	  ActivePlan.prototype.dequeue = function () {
	    this.joinObservers.forEach(function (v) { v.queue.shift(); });
	  };

	  ActivePlan.prototype.match = function () {
	    var i, len, hasValues = true;
	    for (i = 0, len = this.joinObserverArray.length; i < len; i++) {
	      if (this.joinObserverArray[i].queue.length === 0) {
	        hasValues = false;
	        break;
	      }
	    }
	    if (hasValues) {
	      var firstValues = [],
	          isCompleted = false;
	      for (i = 0, len = this.joinObserverArray.length; i < len; i++) {
	        firstValues.push(this.joinObserverArray[i].queue[0]);
	        this.joinObserverArray[i].queue[0].kind === 'C' && (isCompleted = true);
	      }
	      if (isCompleted) {
	        this.onCompleted();
	      } else {
	        this.dequeue();
	        var values = [];
	        for (i = 0, len = firstValues.length; i < firstValues.length; i++) {
	          values.push(firstValues[i].value);
	        }
	        this.onNext.apply(this, values);
	      }
	    }
	  };

	  var JoinObserver = (function (__super__) {
	    inherits(JoinObserver, __super__);

	    function JoinObserver(source, onError) {
	      __super__.call(this);
	      this.source = source;
	      this.onError = onError;
	      this.queue = [];
	      this.activePlans = [];
	      this.subscription = new SingleAssignmentDisposable();
	      this.isDisposed = false;
	    }

	    var JoinObserverPrototype = JoinObserver.prototype;

	    JoinObserverPrototype.next = function (notification) {
	      if (!this.isDisposed) {
	        if (notification.kind === 'E') {
	          return this.onError(notification.error);
	        }
	        this.queue.push(notification);
	        var activePlans = this.activePlans.slice(0);
	        for (var i = 0, len = activePlans.length; i < len; i++) {
	          activePlans[i].match();
	        }
	      }
	    };

	    JoinObserverPrototype.error = noop;
	    JoinObserverPrototype.completed = noop;

	    JoinObserverPrototype.addActivePlan = function (activePlan) {
	      this.activePlans.push(activePlan);
	    };

	    JoinObserverPrototype.subscribe = function () {
	      this.subscription.setDisposable(this.source.materialize().subscribe(this));
	    };

	    JoinObserverPrototype.removeActivePlan = function (activePlan) {
	      this.activePlans.splice(this.activePlans.indexOf(activePlan), 1);
	      this.activePlans.length === 0 && this.dispose();
	    };

	    JoinObserverPrototype.dispose = function () {
	      __super__.prototype.dispose.call(this);
	      if (!this.isDisposed) {
	        this.isDisposed = true;
	        this.subscription.dispose();
	      }
	    };

	    return JoinObserver;
	  } (AbstractObserver));

	  /**
	   *  Creates a pattern that matches when both observable sequences have an available value.
	   *
	   *  @param right Observable sequence to match with the current sequence.
	   *  @return {Pattern} Pattern object that matches when both observable sequences have an available value.
	   */
	  observableProto.and = function (right) {
	    return new Pattern([this, right]);
	  };

	  /**
	   *  Matches when the observable sequence has an available value and projects the value.
	   *
	   *  @param {Function} selector Selector that will be invoked for values in the source sequence.
	   *  @returns {Plan} Plan that produces the projected values, to be fed (with other plans) to the when operator.
	   */
	  observableProto.thenDo = function (selector) {
	    return new Pattern([this]).thenDo(selector);
	  };

	  /**
	   *  Joins together the results from several patterns.
	   *
	   *  @param plans A series of plans (specified as an Array of as a series of arguments) created by use of the Then operator on patterns.
	   *  @returns {Observable} Observable sequence with the results form matching several patterns.
	   */
	  Observable.when = function () {
	    var len = arguments.length, plans;
	    if (Array.isArray(arguments[0])) {
	      plans = arguments[0];
	    } else {
	      plans = new Array(len);
	      for(var i = 0; i < len; i++) { plans[i] = arguments[i]; }
	    }
	    return new AnonymousObservable(function (o) {
	      var activePlans = [],
	          externalSubscriptions = new Map();
	      var outObserver = observerCreate(
	        function (x) { o.onNext(x); },
	        function (err) {
	          externalSubscriptions.forEach(function (v) { v.onError(err); });
	          o.onError(err);
	        },
	        function (x) { o.onCompleted(); }
	      );
	      try {
	        for (var i = 0, len = plans.length; i < len; i++) {
	          activePlans.push(plans[i].activate(externalSubscriptions, outObserver, function (activePlan) {
	            var idx = activePlans.indexOf(activePlan);
	            activePlans.splice(idx, 1);
	            activePlans.length === 0 && o.onCompleted();
	          }));
	        }
	      } catch (e) {
	        return observableThrow(e).subscribe(o);
	      }
	      var group = new CompositeDisposable();
	      externalSubscriptions.forEach(function (joinObserver) {
	        joinObserver.subscribe();
	        group.add(joinObserver);
	      });

	      return group;
	    });
	  };

	  var TimerObservable = (function(__super__) {
	    inherits(TimerObservable, __super__);
	    function TimerObservable(dt, s) {
	      this._dt = dt;
	      this._s = s;
	      __super__.call(this);
	    }

	    TimerObservable.prototype.subscribeCore = function (o) {
	      return this._s.scheduleFuture(o, this._dt, scheduleMethod);
	    };

	    function scheduleMethod(s, o) {
	      o.onNext(0);
	      o.onCompleted();
	    }

	    return TimerObservable;
	  }(ObservableBase));

	  function _observableTimer(dueTime, scheduler) {
	    return new TimerObservable(dueTime, scheduler);
	  }

	  function observableTimerDateAndPeriod(dueTime, period, scheduler) {
	    return new AnonymousObservable(function (observer) {
	      var d = dueTime, p = normalizeTime(period);
	      return scheduler.scheduleRecursiveFuture(0, d, function (count, self) {
	        if (p > 0) {
	          var now = scheduler.now();
	          d = new Date(d.getTime() + p);
	          d.getTime() <= now && (d = new Date(now + p));
	        }
	        observer.onNext(count);
	        self(count + 1, new Date(d));
	      });
	    });
	  }

	  function observableTimerTimeSpanAndPeriod(dueTime, period, scheduler) {
	    return dueTime === period ?
	      new AnonymousObservable(function (observer) {
	        return scheduler.schedulePeriodic(0, period, function (count) {
	          observer.onNext(count);
	          return count + 1;
	        });
	      }) :
	      observableDefer(function () {
	        return observableTimerDateAndPeriod(new Date(scheduler.now() + dueTime), period, scheduler);
	      });
	  }

	  /**
	   *  Returns an observable sequence that produces a value after each period.
	   *
	   * @example
	   *  1 - res = Rx.Observable.interval(1000);
	   *  2 - res = Rx.Observable.interval(1000, Rx.Scheduler.timeout);
	   *
	   * @param {Number} period Period for producing the values in the resulting sequence (specified as an integer denoting milliseconds).
	   * @param {Scheduler} [scheduler] Scheduler to run the timer on. If not specified, Rx.Scheduler.timeout is used.
	   * @returns {Observable} An observable sequence that produces a value after each period.
	   */
	  var observableinterval = Observable.interval = function (period, scheduler) {
	    return observableTimerTimeSpanAndPeriod(period, period, isScheduler(scheduler) ? scheduler : defaultScheduler);
	  };

	  /**
	   *  Returns an observable sequence that produces a value after dueTime has elapsed and then after each period.
	   * @param {Number} dueTime Absolute (specified as a Date object) or relative time (specified as an integer denoting milliseconds) at which to produce the first value.
	   * @param {Mixed} [periodOrScheduler]  Period to produce subsequent values (specified as an integer denoting milliseconds), or the scheduler to run the timer on. If not specified, the resulting timer is not recurring.
	   * @param {Scheduler} [scheduler]  Scheduler to run the timer on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} An observable sequence that produces a value after due time has elapsed and then each period.
	   */
	  var observableTimer = Observable.timer = function (dueTime, periodOrScheduler, scheduler) {
	    var period;
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    if (periodOrScheduler != null && typeof periodOrScheduler === 'number') {
	      period = periodOrScheduler;
	    } else if (isScheduler(periodOrScheduler)) {
	      scheduler = periodOrScheduler;
	    }
	    if ((dueTime instanceof Date || typeof dueTime === 'number') && period === undefined) {
	      return _observableTimer(dueTime, scheduler);
	    }
	    if (dueTime instanceof Date && period !== undefined) {
	      return observableTimerDateAndPeriod(dueTime, periodOrScheduler, scheduler);
	    }
	    return observableTimerTimeSpanAndPeriod(dueTime, period, scheduler);
	  };

	  function observableDelayRelative(source, dueTime, scheduler) {
	    return new AnonymousObservable(function (o) {
	      var active = false,
	        cancelable = new SerialDisposable(),
	        exception = null,
	        q = [],
	        running = false,
	        subscription;
	      subscription = source.materialize().timestamp(scheduler).subscribe(function (notification) {
	        var d, shouldRun;
	        if (notification.value.kind === 'E') {
	          q = [];
	          q.push(notification);
	          exception = notification.value.error;
	          shouldRun = !running;
	        } else {
	          q.push({ value: notification.value, timestamp: notification.timestamp + dueTime });
	          shouldRun = !active;
	          active = true;
	        }
	        if (shouldRun) {
	          if (exception !== null) {
	            o.onError(exception);
	          } else {
	            d = new SingleAssignmentDisposable();
	            cancelable.setDisposable(d);
	            d.setDisposable(scheduler.scheduleRecursiveFuture(null, dueTime, function (_, self) {
	              var e, recurseDueTime, result, shouldRecurse;
	              if (exception !== null) {
	                return;
	              }
	              running = true;
	              do {
	                result = null;
	                if (q.length > 0 && q[0].timestamp - scheduler.now() <= 0) {
	                  result = q.shift().value;
	                }
	                if (result !== null) {
	                  result.accept(o);
	                }
	              } while (result !== null);
	              shouldRecurse = false;
	              recurseDueTime = 0;
	              if (q.length > 0) {
	                shouldRecurse = true;
	                recurseDueTime = Math.max(0, q[0].timestamp - scheduler.now());
	              } else {
	                active = false;
	              }
	              e = exception;
	              running = false;
	              if (e !== null) {
	                o.onError(e);
	              } else if (shouldRecurse) {
	                self(null, recurseDueTime);
	              }
	            }));
	          }
	        }
	      });
	      return new BinaryDisposable(subscription, cancelable);
	    }, source);
	  }

	  function observableDelayAbsolute(source, dueTime, scheduler) {
	    return observableDefer(function () {
	      return observableDelayRelative(source, dueTime - scheduler.now(), scheduler);
	    });
	  }

	  function delayWithSelector(source, subscriptionDelay, delayDurationSelector) {
	    var subDelay, selector;
	    if (isFunction(subscriptionDelay)) {
	      selector = subscriptionDelay;
	    } else {
	      subDelay = subscriptionDelay;
	      selector = delayDurationSelector;
	    }
	    return new AnonymousObservable(function (o) {
	      var delays = new CompositeDisposable(), atEnd = false, subscription = new SerialDisposable();

	      function start() {
	        subscription.setDisposable(source.subscribe(
	          function (x) {
	            var delay = tryCatch(selector)(x);
	            if (delay === errorObj) { return o.onError(delay.e); }
	            var d = new SingleAssignmentDisposable();
	            delays.add(d);
	            d.setDisposable(delay.subscribe(
	              function () {
	                o.onNext(x);
	                delays.remove(d);
	                done();
	              },
	              function (e) { o.onError(e); },
	              function () {
	                o.onNext(x);
	                delays.remove(d);
	                done();
	              }
	            ));
	          },
	          function (e) { o.onError(e); },
	          function () {
	            atEnd = true;
	            subscription.dispose();
	            done();
	          }
	        ));
	      }

	      function done () {
	        atEnd && delays.length === 0 && o.onCompleted();
	      }

	      if (!subDelay) {
	        start();
	      } else {
	        subscription.setDisposable(subDelay.subscribe(start, function (e) { o.onError(e); }, start));
	      }

	      return new BinaryDisposable(subscription, delays);
	    }, source);
	  }

	  /**
	   *  Time shifts the observable sequence by dueTime.
	   *  The relative time intervals between the values are preserved.
	   *
	   * @param {Number} dueTime Absolute (specified as a Date object) or relative time (specified as an integer denoting milliseconds) by which to shift the observable sequence.
	   * @param {Scheduler} [scheduler] Scheduler to run the delay timers on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} Time-shifted sequence.
	   */
	  observableProto.delay = function () {
	    var firstArg = arguments[0];
	    if (typeof firstArg === 'number' || firstArg instanceof Date) {
	      var dueTime = firstArg, scheduler = arguments[1];
	      isScheduler(scheduler) || (scheduler = defaultScheduler);
	      return dueTime instanceof Date ?
	        observableDelayAbsolute(this, dueTime, scheduler) :
	        observableDelayRelative(this, dueTime, scheduler);
	    } else if (Observable.isObservable(firstArg) || isFunction(firstArg)) {
	      return delayWithSelector(this, firstArg, arguments[1]);
	    } else {
	      throw new Error('Invalid arguments');
	    }
	  };

	  var DebounceObservable = (function (__super__) {
	    inherits(DebounceObservable, __super__);
	    function DebounceObservable(source, dt, s) {
	      isScheduler(s) || (s = defaultScheduler);
	      this.source = source;
	      this._dt = dt;
	      this._s = s;
	      __super__.call(this);
	    }

	    DebounceObservable.prototype.subscribeCore = function (o) {
	      var cancelable = new SerialDisposable();
	      return new BinaryDisposable(
	        this.source.subscribe(new DebounceObserver(o, this._dt, this._s, cancelable)),
	        cancelable);
	    };

	    return DebounceObservable;
	  }(ObservableBase));

	  var DebounceObserver = (function (__super__) {
	    inherits(DebounceObserver, __super__);
	    function DebounceObserver(observer, dueTime, scheduler, cancelable) {
	      this._o = observer;
	      this._d = dueTime;
	      this._scheduler = scheduler;
	      this._c = cancelable;
	      this._v = null;
	      this._hv = false;
	      this._id = 0;
	      __super__.call(this);
	    }

	    function scheduleFuture(s, state) {
	      state.self._hv && state.self._id === state.currentId && state.self._o.onNext(state.x);
	      state.self._hv = false;
	    }

	    DebounceObserver.prototype.next = function (x) {
	      this._hv = true;
	      this._v = x;
	      var currentId = ++this._id, d = new SingleAssignmentDisposable();
	      this._c.setDisposable(d);
	      d.setDisposable(this._scheduler.scheduleFuture(this, this._d, function (_, self) {
	        self._hv && self._id === currentId && self._o.onNext(x);
	        self._hv = false;
	      }));
	    };

	    DebounceObserver.prototype.error = function (e) {
	      this._c.dispose();
	      this._o.onError(e);
	      this._hv = false;
	      this._id++;
	    };

	    DebounceObserver.prototype.completed = function () {
	      this._c.dispose();
	      this._hv && this._o.onNext(this._v);
	      this._o.onCompleted();
	      this._hv = false;
	      this._id++;
	    };

	    return DebounceObserver;
	  }(AbstractObserver));

	  function debounceWithSelector(source, durationSelector) {
	    return new AnonymousObservable(function (o) {
	      var value, hasValue = false, cancelable = new SerialDisposable(), id = 0;
	      var subscription = source.subscribe(
	        function (x) {
	          var throttle = tryCatch(durationSelector)(x);
	          if (throttle === errorObj) { return o.onError(throttle.e); }

	          isPromise(throttle) && (throttle = observableFromPromise(throttle));

	          hasValue = true;
	          value = x;
	          id++;
	          var currentid = id, d = new SingleAssignmentDisposable();
	          cancelable.setDisposable(d);
	          d.setDisposable(throttle.subscribe(
	            function () {
	              hasValue && id === currentid && o.onNext(value);
	              hasValue = false;
	              d.dispose();
	            },
	            function (e) { o.onError(e); },
	            function () {
	              hasValue && id === currentid && o.onNext(value);
	              hasValue = false;
	              d.dispose();
	            }
	          ));
	        },
	        function (e) {
	          cancelable.dispose();
	          o.onError(e);
	          hasValue = false;
	          id++;
	        },
	        function () {
	          cancelable.dispose();
	          hasValue && o.onNext(value);
	          o.onCompleted();
	          hasValue = false;
	          id++;
	        }
	      );
	      return new BinaryDisposable(subscription, cancelable);
	    }, source);
	  }

	  observableProto.debounce = function () {
	    if (isFunction (arguments[0])) {
	      return debounceWithSelector(this, arguments[0]);
	    } else if (typeof arguments[0] === 'number') {
	      return new DebounceObservable(this, arguments[0], arguments[1]);
	    } else {
	      throw new Error('Invalid arguments');
	    }
	  };

	  /**
	   *  Projects each element of an observable sequence into zero or more windows which are produced based on timing information.
	   * @param {Number} timeSpan Length of each window (specified as an integer denoting milliseconds).
	   * @param {Mixed} [timeShiftOrScheduler]  Interval between creation of consecutive windows (specified as an integer denoting milliseconds), or an optional scheduler parameter. If not specified, the time shift corresponds to the timeSpan parameter, resulting in non-overlapping adjacent windows.
	   * @param {Scheduler} [scheduler]  Scheduler to run windowing timers on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} An observable sequence of windows.
	   */
	  observableProto.windowWithTime = observableProto.windowTime = function (timeSpan, timeShiftOrScheduler, scheduler) {
	    var source = this, timeShift;
	    timeShiftOrScheduler == null && (timeShift = timeSpan);
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    if (typeof timeShiftOrScheduler === 'number') {
	      timeShift = timeShiftOrScheduler;
	    } else if (isScheduler(timeShiftOrScheduler)) {
	      timeShift = timeSpan;
	      scheduler = timeShiftOrScheduler;
	    }
	    return new AnonymousObservable(function (observer) {
	      var groupDisposable,
	        nextShift = timeShift,
	        nextSpan = timeSpan,
	        q = [],
	        refCountDisposable,
	        timerD = new SerialDisposable(),
	        totalTime = 0;
	        groupDisposable = new CompositeDisposable(timerD),
	        refCountDisposable = new RefCountDisposable(groupDisposable);

	       function createTimer () {
	        var m = new SingleAssignmentDisposable(),
	          isSpan = false,
	          isShift = false;
	        timerD.setDisposable(m);
	        if (nextSpan === nextShift) {
	          isSpan = true;
	          isShift = true;
	        } else if (nextSpan < nextShift) {
	            isSpan = true;
	        } else {
	          isShift = true;
	        }
	        var newTotalTime = isSpan ? nextSpan : nextShift,
	          ts = newTotalTime - totalTime;
	        totalTime = newTotalTime;
	        if (isSpan) {
	          nextSpan += timeShift;
	        }
	        if (isShift) {
	          nextShift += timeShift;
	        }
	        m.setDisposable(scheduler.scheduleFuture(null, ts, function () {
	          if (isShift) {
	            var s = new Subject();
	            q.push(s);
	            observer.onNext(addRef(s, refCountDisposable));
	          }
	          isSpan && q.shift().onCompleted();
	          createTimer();
	        }));
	      };
	      q.push(new Subject());
	      observer.onNext(addRef(q[0], refCountDisposable));
	      createTimer();
	      groupDisposable.add(source.subscribe(
	        function (x) {
	          for (var i = 0, len = q.length; i < len; i++) { q[i].onNext(x); }
	        },
	        function (e) {
	          for (var i = 0, len = q.length; i < len; i++) { q[i].onError(e); }
	          observer.onError(e);
	        },
	        function () {
	          for (var i = 0, len = q.length; i < len; i++) { q[i].onCompleted(); }
	          observer.onCompleted();
	        }
	      ));
	      return refCountDisposable;
	    }, source);
	  };

	  /**
	   *  Projects each element of an observable sequence into a window that is completed when either it's full or a given amount of time has elapsed.
	   * @param {Number} timeSpan Maximum time length of a window.
	   * @param {Number} count Maximum element count of a window.
	   * @param {Scheduler} [scheduler]  Scheduler to run windowing timers on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} An observable sequence of windows.
	   */
	  observableProto.windowWithTimeOrCount = observableProto.windowTimeOrCount = function (timeSpan, count, scheduler) {
	    var source = this;
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    return new AnonymousObservable(function (observer) {
	      var timerD = new SerialDisposable(),
	          groupDisposable = new CompositeDisposable(timerD),
	          refCountDisposable = new RefCountDisposable(groupDisposable),
	          n = 0,
	          windowId = 0,
	          s = new Subject();

	      function createTimer(id) {
	        var m = new SingleAssignmentDisposable();
	        timerD.setDisposable(m);
	        m.setDisposable(scheduler.scheduleFuture(null, timeSpan, function () {
	          if (id !== windowId) { return; }
	          n = 0;
	          var newId = ++windowId;
	          s.onCompleted();
	          s = new Subject();
	          observer.onNext(addRef(s, refCountDisposable));
	          createTimer(newId);
	        }));
	      }

	      observer.onNext(addRef(s, refCountDisposable));
	      createTimer(0);

	      groupDisposable.add(source.subscribe(
	        function (x) {
	          var newId = 0, newWindow = false;
	          s.onNext(x);
	          if (++n === count) {
	            newWindow = true;
	            n = 0;
	            newId = ++windowId;
	            s.onCompleted();
	            s = new Subject();
	            observer.onNext(addRef(s, refCountDisposable));
	          }
	          newWindow && createTimer(newId);
	        },
	        function (e) {
	          s.onError(e);
	          observer.onError(e);
	        }, function () {
	          s.onCompleted();
	          observer.onCompleted();
	        }
	      ));
	      return refCountDisposable;
	    }, source);
	  };

	  function toArray(x) { return x.toArray(); }

	  /**
	   *  Projects each element of an observable sequence into zero or more buffers which are produced based on timing information.
	   * @param {Number} timeSpan Length of each buffer (specified as an integer denoting milliseconds).
	   * @param {Mixed} [timeShiftOrScheduler]  Interval between creation of consecutive buffers (specified as an integer denoting milliseconds), or an optional scheduler parameter. If not specified, the time shift corresponds to the timeSpan parameter, resulting in non-overlapping adjacent buffers.
	   * @param {Scheduler} [scheduler]  Scheduler to run buffer timers on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} An observable sequence of buffers.
	   */
	  observableProto.bufferWithTime = observableProto.bufferTime = function (timeSpan, timeShiftOrScheduler, scheduler) {
	    return this.windowWithTime(timeSpan, timeShiftOrScheduler, scheduler).flatMap(toArray);
	  };

	  function toArray(x) { return x.toArray(); }

	  /**
	   *  Projects each element of an observable sequence into a buffer that is completed when either it's full or a given amount of time has elapsed.
	   * @param {Number} timeSpan Maximum time length of a buffer.
	   * @param {Number} count Maximum element count of a buffer.
	   * @param {Scheduler} [scheduler]  Scheduler to run bufferin timers on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} An observable sequence of buffers.
	   */
	  observableProto.bufferWithTimeOrCount = observableProto.bufferTimeOrCount = function (timeSpan, count, scheduler) {
	    return this.windowWithTimeOrCount(timeSpan, count, scheduler).flatMap(toArray);
	  };

	  var TimeIntervalObservable = (function (__super__) {
	    inherits(TimeIntervalObservable, __super__);
	    function TimeIntervalObservable(source, s) {
	      this.source = source;
	      this._s = s;
	      __super__.call(this);
	    }

	    TimeIntervalObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new TimeIntervalObserver(o, this._s));
	    };

	    return TimeIntervalObservable;
	  }(ObservableBase));

	  var TimeIntervalObserver = (function (__super__) {
	    inherits(TimeIntervalObserver, __super__);

	    function TimeIntervalObserver(o, s) {
	      this._o = o;
	      this._s = s;
	      this._l = s.now();
	      __super__.call(this);
	    }

	    TimeIntervalObserver.prototype.next = function (x) {
	      var now = this._s.now(), span = now - this._l;
	      this._l = now;
	      this._o.onNext({ value: x, interval: span });
	    };
	    TimeIntervalObserver.prototype.error = function (e) { this._o.onError(e); };
	    TimeIntervalObserver.prototype.completed = function () { this._o.onCompleted(); };

	    return TimeIntervalObserver;
	  }(AbstractObserver));

	  /**
	   *  Records the time interval between consecutive values in an observable sequence.
	   *
	   * @example
	   *  1 - res = source.timeInterval();
	   *  2 - res = source.timeInterval(Rx.Scheduler.timeout);
	   *
	   * @param [scheduler]  Scheduler used to compute time intervals. If not specified, the timeout scheduler is used.
	   * @returns {Observable} An observable sequence with time interval information on values.
	   */
	  observableProto.timeInterval = function (scheduler) {
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    return new TimeIntervalObservable(this, scheduler);
	  };

	  var TimestampObservable = (function (__super__) {
	    inherits(TimestampObservable, __super__);
	    function TimestampObservable(source, s) {
	      this.source = source;
	      this._s = s;
	      __super__.call(this);
	    }

	    TimestampObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new TimestampObserver(o, this._s));
	    };

	    return TimestampObservable;
	  }(ObservableBase));

	  var TimestampObserver = (function (__super__) {
	    inherits(TimestampObserver, __super__);
	    function TimestampObserver(o, s) {
	      this._o = o;
	      this._s = s;
	      __super__.call(this);
	    }

	    TimestampObserver.prototype.next = function (x) {
	      this._o.onNext({ value: x, timestamp: this._s.now() });
	    };

	    TimestampObserver.prototype.error = function (e) {
	      this._o.onError(e);
	    };

	    TimestampObserver.prototype.completed = function () {
	      this._o.onCompleted();
	    };

	    return TimestampObserver;
	  }(AbstractObserver));

	  /**
	   *  Records the timestamp for each value in an observable sequence.
	   *
	   * @example
	   *  1 - res = source.timestamp(); // produces { value: x, timestamp: ts }
	   *  2 - res = source.timestamp(Rx.Scheduler.default);
	   *
	   * @param {Scheduler} [scheduler]  Scheduler used to compute timestamps. If not specified, the default scheduler is used.
	   * @returns {Observable} An observable sequence with timestamp information on values.
	   */
	  observableProto.timestamp = function (scheduler) {
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    return new TimestampObservable(this, scheduler);
	  };

	  var SampleObservable = (function(__super__) {
	    inherits(SampleObservable, __super__);
	    function SampleObservable(source, sampler) {
	      this.source = source;
	      this._sampler = sampler;
	      __super__.call(this);
	    }

	    SampleObservable.prototype.subscribeCore = function (o) {
	      var state = {
	        o: o,
	        atEnd: false,
	        value: null,
	        hasValue: false,
	        sourceSubscription: new SingleAssignmentDisposable()
	      };

	      state.sourceSubscription.setDisposable(this.source.subscribe(new SampleSourceObserver(state)));
	      return new BinaryDisposable(
	        state.sourceSubscription,
	        this._sampler.subscribe(new SamplerObserver(state))
	      );
	    };

	    return SampleObservable;
	  }(ObservableBase));

	  var SamplerObserver = (function(__super__) {
	    inherits(SamplerObserver, __super__);
	    function SamplerObserver(s) {
	      this._s = s;
	      __super__.call(this);
	    }

	    SamplerObserver.prototype._handleMessage = function () {
	      if (this._s.hasValue) {
	        this._s.hasValue = false;
	        this._s.o.onNext(this._s.value);
	      }
	      this._s.atEnd && this._s.o.onCompleted();
	    };

	    SamplerObserver.prototype.next = function () { this._handleMessage(); };
	    SamplerObserver.prototype.error = function (e) { this._s.onError(e); };
	    SamplerObserver.prototype.completed = function () { this._handleMessage(); };

	    return SamplerObserver;
	  }(AbstractObserver));

	  var SampleSourceObserver = (function(__super__) {
	    inherits(SampleSourceObserver, __super__);
	    function SampleSourceObserver(s) {
	      this._s = s;
	      __super__.call(this);
	    }

	    SampleSourceObserver.prototype.next = function (x) {
	      this._s.hasValue = true;
	      this._s.value = x;
	    };
	    SampleSourceObserver.prototype.error = function (e) { this._s.o.onError(e); };
	    SampleSourceObserver.prototype.completed = function () {
	      this._s.atEnd = true;
	      this._s.sourceSubscription.dispose();
	    };

	    return SampleSourceObserver;
	  }(AbstractObserver));

	  /**
	   *  Samples the observable sequence at each interval.
	   *
	   * @example
	   *  1 - res = source.sample(sampleObservable); // Sampler tick sequence
	   *  2 - res = source.sample(5000); // 5 seconds
	   *  2 - res = source.sample(5000, Rx.Scheduler.timeout); // 5 seconds
	   *
	   * @param {Mixed} intervalOrSampler Interval at which to sample (specified as an integer denoting milliseconds) or Sampler Observable.
	   * @param {Scheduler} [scheduler]  Scheduler to run the sampling timer on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} Sampled observable sequence.
	   */
	  observableProto.sample = function (intervalOrSampler, scheduler) {
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    return typeof intervalOrSampler === 'number' ?
	      new SampleObservable(this, observableinterval(intervalOrSampler, scheduler)) :
	      new SampleObservable(this, intervalOrSampler);
	  };

	  var TimeoutError = Rx.TimeoutError = function(message) {
	    this.message = message || 'Timeout has occurred';
	    this.name = 'TimeoutError';
	    Error.call(this);
	  };
	  TimeoutError.prototype = Object.create(Error.prototype);

	  function timeoutWithSelector(source, firstTimeout, timeoutDurationSelector, other) {
	    if (isFunction(firstTimeout)) {
	      other = timeoutDurationSelector;
	      timeoutDurationSelector = firstTimeout;
	      firstTimeout = observableNever();
	    }
	    Observable.isObservable(other) || (other = observableThrow(new TimeoutError()));
	    return new AnonymousObservable(function (o) {
	      var subscription = new SerialDisposable(),
	        timer = new SerialDisposable(),
	        original = new SingleAssignmentDisposable();

	      subscription.setDisposable(original);

	      var id = 0, switched = false;

	      function setTimer(timeout) {
	        var myId = id, d = new SingleAssignmentDisposable();

	        function timerWins() {
	          switched = (myId === id);
	          return switched;
	        }

	        timer.setDisposable(d);
	        d.setDisposable(timeout.subscribe(function () {
	          timerWins() && subscription.setDisposable(other.subscribe(o));
	          d.dispose();
	        }, function (e) {
	          timerWins() && o.onError(e);
	        }, function () {
	          timerWins() && subscription.setDisposable(other.subscribe(o));
	        }));
	      };

	      setTimer(firstTimeout);

	      function oWins() {
	        var res = !switched;
	        if (res) { id++; }
	        return res;
	      }

	      original.setDisposable(source.subscribe(function (x) {
	        if (oWins()) {
	          o.onNext(x);
	          var timeout = tryCatch(timeoutDurationSelector)(x);
	          if (timeout === errorObj) { return o.onError(timeout.e); }
	          setTimer(isPromise(timeout) ? observableFromPromise(timeout) : timeout);
	        }
	      }, function (e) {
	        oWins() && o.onError(e);
	      }, function () {
	        oWins() && o.onCompleted();
	      }));
	      return new BinaryDisposable(subscription, timer);
	    }, source);
	  }

	  function timeout(source, dueTime, other, scheduler) {
	    if (isScheduler(other)) {
	      scheduler = other;
	      other = observableThrow(new TimeoutError());
	    }
	    if (other instanceof Error) { other = observableThrow(other); }
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    Observable.isObservable(other) || (other = observableThrow(new TimeoutError()));
	    return new AnonymousObservable(function (o) {
	      var id = 0,
	        original = new SingleAssignmentDisposable(),
	        subscription = new SerialDisposable(),
	        switched = false,
	        timer = new SerialDisposable();

	      subscription.setDisposable(original);

	      function createTimer() {
	        var myId = id;
	        timer.setDisposable(scheduler.scheduleFuture(null, dueTime, function () {
	          switched = id === myId;
	          if (switched) {
	            isPromise(other) && (other = observableFromPromise(other));
	            subscription.setDisposable(other.subscribe(o));
	          }
	        }));
	      }

	      createTimer();

	      original.setDisposable(source.subscribe(function (x) {
	        if (!switched) {
	          id++;
	          o.onNext(x);
	          createTimer();
	        }
	      }, function (e) {
	        if (!switched) {
	          id++;
	          o.onError(e);
	        }
	      }, function () {
	        if (!switched) {
	          id++;
	          o.onCompleted();
	        }
	      }));
	      return new BinaryDisposable(subscription, timer);
	    }, source);
	  }

	  observableProto.timeout = function () {
	    var firstArg = arguments[0];
	    if (firstArg instanceof Date || typeof firstArg === 'number') {
	      return timeout(this, firstArg, arguments[1], arguments[2]);
	    } else if (Observable.isObservable(firstArg) || isFunction(firstArg)) {
	      return timeoutWithSelector(this, firstArg, arguments[1], arguments[2]);
	    } else {
	      throw new Error('Invalid arguments');
	    }
	  };

	  var GenerateAbsoluteObservable = (function (__super__) {
	    inherits(GenerateAbsoluteObservable, __super__);
	    function GenerateAbsoluteObservable(state, cndFn, itrFn, resFn, timeFn, s) {
	      this._state = state;
	      this._cndFn = cndFn;
	      this._itrFn = itrFn;
	      this._resFn = resFn;
	      this._timeFn = timeFn;
	      this._s = s;
	      __super__.call(this);
	    }

	    function scheduleRecursive(state, recurse) {
	      state.hasResult && state.o.onNext(state.result);

	      if (state.first) {
	        state.first = false;
	      } else {
	        state.newState = tryCatch(state.self._itrFn)(state.newState);
	        if (state.newState === errorObj) { return state.o.onError(state.newState.e); }
	      }
	      state.hasResult = tryCatch(state.self._cndFn)(state.newState);
	      if (state.hasResult === errorObj) { return state.o.onError(state.hasResult.e); }
	      if (state.hasResult) {
	        state.result = tryCatch(state.self._resFn)(state.newState);
	        if (state.result === errorObj) { return state.o.onError(state.result.e); }
	        var time = tryCatch(state.self._timeFn)(state.newState);
	        if (time === errorObj) { return state.o.onError(time.e); }
	        recurse(state, time);
	      } else {
	        state.o.onCompleted();
	      }
	    }

	    GenerateAbsoluteObservable.prototype.subscribeCore = function (o) {
	      var state = {
	        o: o,
	        self: this,
	        newState: this._state,
	        first: true,
	        hasResult: false
	      };
	      return this._s.scheduleRecursiveFuture(state, new Date(this._s.now()), scheduleRecursive);
	    };

	    return GenerateAbsoluteObservable;
	  }(ObservableBase));

	  /**
	   *  GenerateAbsolutes an observable sequence by iterating a state from an initial state until the condition fails.
	   *
	   * @example
	   *  res = source.generateWithAbsoluteTime(0,
	   *      function (x) { return return true; },
	   *      function (x) { return x + 1; },
	   *      function (x) { return x; },
	   *      function (x) { return new Date(); }
	   *  });
	   *
	   * @param {Mixed} initialState Initial state.
	   * @param {Function} condition Condition to terminate generation (upon returning false).
	   * @param {Function} iterate Iteration step function.
	   * @param {Function} resultSelector Selector function for results produced in the sequence.
	   * @param {Function} timeSelector Time selector function to control the speed of values being produced each iteration, returning Date values.
	   * @param {Scheduler} [scheduler]  Scheduler on which to run the generator loop. If not specified, the timeout scheduler is used.
	   * @returns {Observable} The generated sequence.
	   */
	  Observable.generateWithAbsoluteTime = function (initialState, condition, iterate, resultSelector, timeSelector, scheduler) {
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    return new GenerateAbsoluteObservable(initialState, condition, iterate, resultSelector, timeSelector, scheduler);
	  };

	  var GenerateRelativeObservable = (function (__super__) {
	    inherits(GenerateRelativeObservable, __super__);
	    function GenerateRelativeObservable(state, cndFn, itrFn, resFn, timeFn, s) {
	      this._state = state;
	      this._cndFn = cndFn;
	      this._itrFn = itrFn;
	      this._resFn = resFn;
	      this._timeFn = timeFn;
	      this._s = s;
	      __super__.call(this);
	    }

	    function scheduleRecursive(state, recurse) {
	      state.hasResult && state.o.onNext(state.result);

	      if (state.first) {
	        state.first = false;
	      } else {
	        state.newState = tryCatch(state.self._itrFn)(state.newState);
	        if (state.newState === errorObj) { return state.o.onError(state.newState.e); }
	      }

	      state.hasResult = tryCatch(state.self._cndFn)(state.newState);
	      if (state.hasResult === errorObj) { return state.o.onError(state.hasResult.e); }
	      if (state.hasResult) {
	        state.result = tryCatch(state.self._resFn)(state.newState);
	        if (state.result === errorObj) { return state.o.onError(state.result.e); }
	        var time = tryCatch(state.self._timeFn)(state.newState);
	        if (time === errorObj) { return state.o.onError(time.e); }
	        recurse(state, time);
	      } else {
	        state.o.onCompleted();
	      }
	    }

	    GenerateRelativeObservable.prototype.subscribeCore = function (o) {
	      var state = {
	        o: o,
	        self: this,
	        newState: this._state,
	        first: true,
	        hasResult: false
	      };
	      return this._s.scheduleRecursiveFuture(state, 0, scheduleRecursive);
	    };

	    return GenerateRelativeObservable;
	  }(ObservableBase));

	  /**
	   *  Generates an observable sequence by iterating a state from an initial state until the condition fails.
	   *
	   * @example
	   *  res = source.generateWithRelativeTime(0,
	   *      function (x) { return return true; },
	   *      function (x) { return x + 1; },
	   *      function (x) { return x; },
	   *      function (x) { return 500; }
	   *  );
	   *
	   * @param {Mixed} initialState Initial state.
	   * @param {Function} condition Condition to terminate generation (upon returning false).
	   * @param {Function} iterate Iteration step function.
	   * @param {Function} resultSelector Selector function for results produced in the sequence.
	   * @param {Function} timeSelector Time selector function to control the speed of values being produced each iteration, returning integer values denoting milliseconds.
	   * @param {Scheduler} [scheduler]  Scheduler on which to run the generator loop. If not specified, the timeout scheduler is used.
	   * @returns {Observable} The generated sequence.
	   */
	  Observable.generateWithRelativeTime = function (initialState, condition, iterate, resultSelector, timeSelector, scheduler) {
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    return new GenerateRelativeObservable(initialState, condition, iterate, resultSelector, timeSelector, scheduler);
	  };

	  var DelaySubscription = (function(__super__) {
	    inherits(DelaySubscription, __super__);
	    function DelaySubscription(source, dt, s) {
	      this.source = source;
	      this._dt = dt;
	      this._s = s;
	      __super__.call(this);
	    }

	    DelaySubscription.prototype.subscribeCore = function (o) {
	      var d = new SerialDisposable();

	      d.setDisposable(this._s.scheduleFuture([this.source, o, d], this._dt, scheduleMethod));

	      return d;
	    };

	    function scheduleMethod(s, state) {
	      var source = state[0], o = state[1], d = state[2];
	      d.setDisposable(source.subscribe(o));
	    }

	    return DelaySubscription;
	  }(ObservableBase));

	  /**
	   *  Time shifts the observable sequence by delaying the subscription with the specified relative time duration, using the specified scheduler to run timers.
	   *
	   * @example
	   *  1 - res = source.delaySubscription(5000); // 5s
	   *  2 - res = source.delaySubscription(5000, Rx.Scheduler.default); // 5 seconds
	   *
	   * @param {Number} dueTime Relative or absolute time shift of the subscription.
	   * @param {Scheduler} [scheduler]  Scheduler to run the subscription delay timer on. If not specified, the timeout scheduler is used.
	   * @returns {Observable} Time-shifted sequence.
	   */
	  observableProto.delaySubscription = function (dueTime, scheduler) {
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    return new DelaySubscription(this, dueTime, scheduler);
	  };

	  var SkipLastWithTimeObservable = (function (__super__) {
	    inherits(SkipLastWithTimeObservable, __super__);
	    function SkipLastWithTimeObservable(source, d, s) {
	      this.source = source;
	      this._d = d;
	      this._s = s;
	      __super__.call(this);
	    }

	    SkipLastWithTimeObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new SkipLastWithTimeObserver(o, this));
	    };

	    return SkipLastWithTimeObservable;
	  }(ObservableBase));

	  var SkipLastWithTimeObserver = (function (__super__) {
	    inherits(SkipLastWithTimeObserver, __super__);

	    function SkipLastWithTimeObserver(o, p) {
	      this._o = o;
	      this._s = p._s;
	      this._d = p._d;
	      this._q = [];
	      __super__.call(this);
	    }

	    SkipLastWithTimeObserver.prototype.next = function (x) {
	      var now = this._s.now();
	      this._q.push({ interval: now, value: x });
	      while (this._q.length > 0 && now - this._q[0].interval >= this._d) {
	        this._o.onNext(this._q.shift().value);
	      }
	    };
	    SkipLastWithTimeObserver.prototype.error = function (e) { this._o.onError(e); };
	    SkipLastWithTimeObserver.prototype.completed = function () {
	      var now = this._s.now();
	      while (this._q.length > 0 && now - this._q[0].interval >= this._d) {
	        this._o.onNext(this._q.shift().value);
	      }
	      this._o.onCompleted();
	    };

	    return SkipLastWithTimeObserver;
	  }(AbstractObserver));

	  /**
	   *  Skips elements for the specified duration from the end of the observable source sequence, using the specified scheduler to run timers.
	   * @description
	   *  This operator accumulates a queue with a length enough to store elements received during the initial duration window.
	   *  As more elements are received, elements older than the specified duration are taken from the queue and produced on the
	   *  result sequence. This causes elements to be delayed with duration.
	   * @param {Number} duration Duration for skipping elements from the end of the sequence.
	   * @param {Scheduler} [scheduler]  Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout
	   * @returns {Observable} An observable sequence with the elements skipped during the specified duration from the end of the source sequence.
	   */
	  observableProto.skipLastWithTime = function (duration, scheduler) {
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    return new SkipLastWithTimeObservable(this, duration, scheduler);
	  };

	  var TakeLastWithTimeObservable = (function (__super__) {
	    inherits(TakeLastWithTimeObservable, __super__);
	    function TakeLastWithTimeObservable(source, d, s) {
	      this.source = source;
	      this._d = d;
	      this._s = s;
	      __super__.call(this);
	    }

	    TakeLastWithTimeObservable.prototype.subscribeCore = function (o) {
	      return this.source.subscribe(new TakeLastWithTimeObserver(o, this._d, this._s));
	    };

	    return TakeLastWithTimeObservable;
	  }(ObservableBase));

	  var TakeLastWithTimeObserver = (function (__super__) {
	    inherits(TakeLastWithTimeObserver, __super__);

	    function TakeLastWithTimeObserver(o, d, s) {
	      this._o = o;
	      this._d = d;
	      this._s = s;
	      this._q = [];
	      __super__.call(this);
	    }

	    TakeLastWithTimeObserver.prototype.next = function (x) {
	      var now = this._s.now();
	      this._q.push({ interval: now, value: x });
	      while (this._q.length > 0 && now - this._q[0].interval >= this._d) {
	        this._q.shift();
	      }
	    };
	    TakeLastWithTimeObserver.prototype.error = function (e) { this._o.onError(e); };
	    TakeLastWithTimeObserver.prototype.completed = function () {
	      var now = this._s.now();
	      while (this._q.length > 0) {
	        var next = this._q.shift();
	        if (now - next.interval <= this._d) { this._o.onNext(next.value); }
	      }
	      this._o.onCompleted();
	    };

	    return TakeLastWithTimeObserver;
	  }(AbstractObserver));

	  /**
	   *  Returns elements within the specified duration from the end of the observable source sequence, using the specified schedulers to run timers and to drain the collected elements.
	   * @description
	   *  This operator accumulates a queue with a length enough to store elements received during the initial duration window.
	   *  As more elements are received, elements older than the specified duration are taken from the queue and produced on the
	   *  result sequence. This causes elements to be delayed with duration.
	   * @param {Number} duration Duration for taking elements from the end of the sequence.
	   * @param {Scheduler} [scheduler]  Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
	   * @returns {Observable} An observable sequence with the elements taken during the specified duration from the end of the source sequence.
	   */
	  observableProto.takeLastWithTime = function (duration, scheduler) {
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    return new TakeLastWithTimeObservable(this, duration, scheduler);
	  };

	  /**
	   *  Returns an array with the elements within the specified duration from the end of the observable source sequence, using the specified scheduler to run timers.
	   * @description
	   *  This operator accumulates a queue with a length enough to store elements received during the initial duration window.
	   *  As more elements are received, elements older than the specified duration are taken from the queue and produced on the
	   *  result sequence. This causes elements to be delayed with duration.
	   * @param {Number} duration Duration for taking elements from the end of the sequence.
	   * @param {Scheduler} scheduler Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
	   * @returns {Observable} An observable sequence containing a single array with the elements taken during the specified duration from the end of the source sequence.
	   */
	  observableProto.takeLastBufferWithTime = function (duration, scheduler) {
	    var source = this;
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    return new AnonymousObservable(function (o) {
	      var q = [];
	      return source.subscribe(function (x) {
	        var now = scheduler.now();
	        q.push({ interval: now, value: x });
	        while (q.length > 0 && now - q[0].interval >= duration) {
	          q.shift();
	        }
	      }, function (e) { o.onError(e); }, function () {
	        var now = scheduler.now(), res = [];
	        while (q.length > 0) {
	          var next = q.shift();
	          now - next.interval <= duration && res.push(next.value);
	        }
	        o.onNext(res);
	        o.onCompleted();
	      });
	    }, source);
	  };

	  var TakeWithTimeObservable = (function (__super__) {
	    inherits(TakeWithTimeObservable, __super__);
	    function TakeWithTimeObservable(source, d, s) {
	      this.source = source;
	      this._d = d;
	      this._s = s;
	      __super__.call(this);
	    }

	    function scheduleMethod(s, o) {
	      o.onCompleted();
	    }

	    TakeWithTimeObservable.prototype.subscribeCore = function (o) {
	      return new BinaryDisposable(
	        this._s.scheduleFuture(o, this._d, scheduleMethod),
	        this.source.subscribe(o)
	      );
	    };

	    return TakeWithTimeObservable;
	  }(ObservableBase));

	  /**
	   *  Takes elements for the specified duration from the start of the observable source sequence, using the specified scheduler to run timers.
	   *
	   * @example
	   *  1 - res = source.takeWithTime(5000,  [optional scheduler]);
	   * @description
	   *  This operator accumulates a queue with a length enough to store elements received during the initial duration window.
	   *  As more elements are received, elements older than the specified duration are taken from the queue and produced on the
	   *  result sequence. This causes elements to be delayed with duration.
	   * @param {Number} duration Duration for taking elements from the start of the sequence.
	   * @param {Scheduler} scheduler Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
	   * @returns {Observable} An observable sequence with the elements taken during the specified duration from the start of the source sequence.
	   */
	  observableProto.takeWithTime = function (duration, scheduler) {
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    return new TakeWithTimeObservable(this, duration, scheduler);
	  };

	  var SkipWithTimeObservable = (function (__super__) {
	    inherits(SkipWithTimeObservable, __super__);
	    function SkipWithTimeObservable(source, d, s) {
	      this.source = source;
	      this._d = d;
	      this._s = s;
	      this._open = false;
	      __super__.call(this);
	    }

	    function scheduleMethod(s, self) {
	      self._open = true;
	    }

	    SkipWithTimeObservable.prototype.subscribeCore = function (o) {
	      return new BinaryDisposable(
	        this._s.scheduleFuture(this, this._d, scheduleMethod),
	        this.source.subscribe(new SkipWithTimeObserver(o, this))
	      );
	    };

	    return SkipWithTimeObservable;
	  }(ObservableBase));

	  var SkipWithTimeObserver = (function (__super__) {
	    inherits(SkipWithTimeObserver, __super__);

	    function SkipWithTimeObserver(o, p) {
	      this._o = o;
	      this._p = p;
	      __super__.call(this);
	    }

	    SkipWithTimeObserver.prototype.next = function (x) { this._p._open && this._o.onNext(x); };
	    SkipWithTimeObserver.prototype.error = function (e) { this._o.onError(e); };
	    SkipWithTimeObserver.prototype.completed = function () { this._o.onCompleted(); };

	    return SkipWithTimeObserver;
	  }(AbstractObserver));

	  /**
	   *  Skips elements for the specified duration from the start of the observable source sequence, using the specified scheduler to run timers.
	   * @description
	   *  Specifying a zero value for duration doesn't guarantee no elements will be dropped from the start of the source sequence.
	   *  This is a side-effect of the asynchrony introduced by the scheduler, where the action that causes callbacks from the source sequence to be forwarded
	   *  may not execute immediately, despite the zero due time.
	   *
	   *  Errors produced by the source sequence are always forwarded to the result sequence, even if the error occurs before the duration.
	   * @param {Number} duration Duration for skipping elements from the start of the sequence.
	   * @param {Scheduler} scheduler Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
	   * @returns {Observable} An observable sequence with the elements skipped during the specified duration from the start of the source sequence.
	   */
	  observableProto.skipWithTime = function (duration, scheduler) {
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    return new SkipWithTimeObservable(this, duration, scheduler);
	  };

	  var SkipUntilWithTimeObservable = (function (__super__) {
	    inherits(SkipUntilWithTimeObservable, __super__);
	    function SkipUntilWithTimeObservable(source, startTime, scheduler) {
	      this.source = source;
	      this._st = startTime;
	      this._s = scheduler;
	      __super__.call(this);
	    }

	    function scheduleMethod(s, state) {
	      state._open = true;
	    }

	    SkipUntilWithTimeObservable.prototype.subscribeCore = function (o) {
	      this._open = false;
	      return new BinaryDisposable(
	        this._s.scheduleFuture(this, this._st, scheduleMethod),
	        this.source.subscribe(new SkipUntilWithTimeObserver(o, this))
	      );
	    };

	    return SkipUntilWithTimeObservable;
	  }(ObservableBase));

	  var SkipUntilWithTimeObserver = (function (__super__) {
	    inherits(SkipUntilWithTimeObserver, __super__);

	    function SkipUntilWithTimeObserver(o, p) {
	      this._o = o;
	      this._p = p;
	      __super__.call(this);
	    }

	    SkipUntilWithTimeObserver.prototype.next = function (x) { this._p._open && this._o.onNext(x); };
	    SkipUntilWithTimeObserver.prototype.error = function (e) { this._o.onError(e); };
	    SkipUntilWithTimeObserver.prototype.completed = function () { this._o.onCompleted(); };

	    return SkipUntilWithTimeObserver;
	  }(AbstractObserver));


	  /**
	   *  Skips elements from the observable source sequence until the specified start time, using the specified scheduler to run timers.
	   *  Errors produced by the source sequence are always forwarded to the result sequence, even if the error occurs before the start time.
	   *
	   * @examples
	   *  1 - res = source.skipUntilWithTime(new Date(), [scheduler]);
	   *  2 - res = source.skipUntilWithTime(5000, [scheduler]);
	   * @param {Date|Number} startTime Time to start taking elements from the source sequence. If this value is less than or equal to Date(), no elements will be skipped.
	   * @param {Scheduler} [scheduler] Scheduler to run the timer on. If not specified, defaults to Rx.Scheduler.timeout.
	   * @returns {Observable} An observable sequence with the elements skipped until the specified start time.
	   */
	  observableProto.skipUntilWithTime = function (startTime, scheduler) {
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    return new SkipUntilWithTimeObservable(this, startTime, scheduler);
	  };

	  /**
	   *  Takes elements for the specified duration until the specified end time, using the specified scheduler to run timers.
	   * @param {Number | Date} endTime Time to stop taking elements from the source sequence. If this value is less than or equal to new Date(), the result stream will complete immediately.
	   * @param {Scheduler} [scheduler] Scheduler to run the timer on.
	   * @returns {Observable} An observable sequence with the elements taken until the specified end time.
	   */
	  observableProto.takeUntilWithTime = function (endTime, scheduler) {
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    var source = this;
	    return new AnonymousObservable(function (o) {
	      return new BinaryDisposable(
	        scheduler.scheduleFuture(o, endTime, function (_, o) { o.onCompleted(); }),
	        source.subscribe(o));
	    }, source);
	  };

	  /**
	   * Returns an Observable that emits only the first item emitted by the source Observable during sequential time windows of a specified duration.
	   * @param {Number} windowDuration time to wait before emitting another item after emitting the last item
	   * @param {Scheduler} [scheduler] the Scheduler to use internally to manage the timers that handle timeout for each item. If not provided, defaults to Scheduler.timeout.
	   * @returns {Observable} An Observable that performs the throttle operation.
	   */
	  observableProto.throttle = function (windowDuration, scheduler) {
	    isScheduler(scheduler) || (scheduler = defaultScheduler);
	    var duration = +windowDuration || 0;
	    if (duration <= 0) { throw new RangeError('windowDuration cannot be less or equal zero.'); }
	    var source = this;
	    return new AnonymousObservable(function (o) {
	      var lastOnNext = 0;
	      return source.subscribe(
	        function (x) {
	          var now = scheduler.now();
	          if (lastOnNext === 0 || now - lastOnNext >= duration) {
	            lastOnNext = now;
	            o.onNext(x);
	          }
	        },function (e) { o.onError(e); }, function () { o.onCompleted(); }
	      );
	    }, source);
	  };

	  var TransduceObserver = (function (__super__) {
	    inherits(TransduceObserver, __super__);
	    function TransduceObserver(o, xform) {
	      this._o = o;
	      this._xform = xform;
	      __super__.call(this);
	    }

	    TransduceObserver.prototype.next = function (x) {
	      var res = tryCatch(this._xform['@@transducer/step']).call(this._xform, this._o, x);
	      if (res === errorObj) { this._o.onError(res.e); }
	    };

	    TransduceObserver.prototype.error = function (e) { this._o.onError(e); };

	    TransduceObserver.prototype.completed = function () {
	      this._xform['@@transducer/result'](this._o);
	    };

	    return TransduceObserver;
	  }(AbstractObserver));

	  function transformForObserver(o) {
	    return {
	      '@@transducer/init': function() {
	        return o;
	      },
	      '@@transducer/step': function(obs, input) {
	        return obs.onNext(input);
	      },
	      '@@transducer/result': function(obs) {
	        return obs.onCompleted();
	      }
	    };
	  }

	  /**
	   * Executes a transducer to transform the observable sequence
	   * @param {Transducer} transducer A transducer to execute
	   * @returns {Observable} An Observable sequence containing the results from the transducer.
	   */
	  observableProto.transduce = function(transducer) {
	    var source = this;
	    return new AnonymousObservable(function(o) {
	      var xform = transducer(transformForObserver(o));
	      return source.subscribe(new TransduceObserver(o, xform));
	    }, source);
	  };

	  var SwitchFirstObservable = (function (__super__) {
	    inherits(SwitchFirstObservable, __super__);
	    function SwitchFirstObservable(source) {
	      this.source = source;
	      __super__.call(this);
	    }

	    SwitchFirstObservable.prototype.subscribeCore = function (o) {
	      var m = new SingleAssignmentDisposable(),
	        g = new CompositeDisposable(),
	        state = {
	          hasCurrent: false,
	          isStopped: false,
	          o: o,
	          g: g
	        };

	      g.add(m);
	      m.setDisposable(this.source.subscribe(new SwitchFirstObserver(state)));
	      return g;
	    };

	    return SwitchFirstObservable;
	  }(ObservableBase));

	  var SwitchFirstObserver = (function(__super__) {
	    inherits(SwitchFirstObserver, __super__);
	    function SwitchFirstObserver(state) {
	      this._s = state;
	      __super__.call(this);
	    }

	    SwitchFirstObserver.prototype.next = function (x) {
	      if (!this._s.hasCurrent) {
	        this._s.hasCurrent = true;
	        isPromise(x) && (x = observableFromPromise(x));
	        var inner = new SingleAssignmentDisposable();
	        this._s.g.add(inner);
	        inner.setDisposable(x.subscribe(new InnerObserver(this._s, inner)));
	      }
	    };

	    SwitchFirstObserver.prototype.error = function (e) {
	      this._s.o.onError(e);
	    };

	    SwitchFirstObserver.prototype.completed = function () {
	      this._s.isStopped = true;
	      !this._s.hasCurrent && this._s.g.length === 1 && this._s.o.onCompleted();
	    };

	    inherits(InnerObserver, __super__);
	    function InnerObserver(state, inner) {
	      this._s = state;
	      this._i = inner;
	      __super__.call(this);
	    }

	    InnerObserver.prototype.next = function (x) { this._s.o.onNext(x); };
	    InnerObserver.prototype.error = function (e) { this._s.o.onError(e); };
	    InnerObserver.prototype.completed = function () {
	      this._s.g.remove(this._i);
	      this._s.hasCurrent = false;
	      this._s.isStopped && this._s.g.length === 1 && this._s.o.onCompleted();
	    };

	    return SwitchFirstObserver;
	  }(AbstractObserver));

	  /**
	   * Performs a exclusive waiting for the first to finish before subscribing to another observable.
	   * Observables that come in between subscriptions will be dropped on the floor.
	   * @returns {Observable} A exclusive observable with only the results that happen when subscribed.
	   */
	  observableProto.switchFirst = function () {
	    return new SwitchFirstObservable(this);
	  };

	observableProto.flatMapFirst = observableProto.exhaustMap = function(selector, resultSelector, thisArg) {
	    return new FlatMapObservable(this, selector, resultSelector, thisArg).switchFirst();
	};

	observableProto.flatMapWithMaxConcurrent = observableProto.flatMapMaxConcurrent = function(limit, selector, resultSelector, thisArg) {
	    return new FlatMapObservable(this, selector, resultSelector, thisArg).merge(limit);
	};

	  /** Provides a set of extension methods for virtual time scheduling. */
	  var VirtualTimeScheduler = Rx.VirtualTimeScheduler = (function (__super__) {
	    inherits(VirtualTimeScheduler, __super__);

	    /**
	     * Creates a new virtual time scheduler with the specified initial clock value and absolute time comparer.
	     *
	     * @constructor
	     * @param {Number} initialClock Initial value for the clock.
	     * @param {Function} comparer Comparer to determine causality of events based on absolute time.
	     */
	    function VirtualTimeScheduler(initialClock, comparer) {
	      this.clock = initialClock;
	      this.comparer = comparer;
	      this.isEnabled = false;
	      this.queue = new PriorityQueue(1024);
	      __super__.call(this);
	    }

	    var VirtualTimeSchedulerPrototype = VirtualTimeScheduler.prototype;

	    VirtualTimeSchedulerPrototype.now = function () {
	      return this.toAbsoluteTime(this.clock);
	    };

	    VirtualTimeSchedulerPrototype.schedule = function (state, action) {
	      return this.scheduleAbsolute(state, this.clock, action);
	    };

	    VirtualTimeSchedulerPrototype.scheduleFuture = function (state, dueTime, action) {
	      var dt = dueTime instanceof Date ?
	        this.toRelativeTime(dueTime - this.now()) :
	        this.toRelativeTime(dueTime);

	      return this.scheduleRelative(state, dt, action);
	    };

	    /**
	     * Adds a relative time value to an absolute time value.
	     * @param {Number} absolute Absolute virtual time value.
	     * @param {Number} relative Relative virtual time value to add.
	     * @return {Number} Resulting absolute virtual time sum value.
	     */
	    VirtualTimeSchedulerPrototype.add = notImplemented;

	    /**
	     * Converts an absolute time to a number
	     * @param {Any} The absolute time.
	     * @returns {Number} The absolute time in ms
	     */
	    VirtualTimeSchedulerPrototype.toAbsoluteTime = notImplemented;

	    /**
	     * Converts the TimeSpan value to a relative virtual time value.
	     * @param {Number} timeSpan TimeSpan value to convert.
	     * @return {Number} Corresponding relative virtual time value.
	     */
	    VirtualTimeSchedulerPrototype.toRelativeTime = notImplemented;

	    /**
	     * Schedules a periodic piece of work by dynamically discovering the scheduler's capabilities. The periodic task will be emulated using recursive scheduling.
	     * @param {Mixed} state Initial state passed to the action upon the first iteration.
	     * @param {Number} period Period for running the work periodically.
	     * @param {Function} action Action to be executed, potentially updating the state.
	     * @returns {Disposable} The disposable object used to cancel the scheduled recurring action (best effort).
	     */
	    VirtualTimeSchedulerPrototype.schedulePeriodic = function (state, period, action) {
	      var s = new SchedulePeriodicRecursive(this, state, period, action);
	      return s.start();
	    };

	    /**
	     * Schedules an action to be executed after dueTime.
	     * @param {Mixed} state State passed to the action to be executed.
	     * @param {Number} dueTime Relative time after which to execute the action.
	     * @param {Function} action Action to be executed.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */
	    VirtualTimeSchedulerPrototype.scheduleRelative = function (state, dueTime, action) {
	      var runAt = this.add(this.clock, dueTime);
	      return this.scheduleAbsolute(state, runAt, action);
	    };

	    /**
	     * Starts the virtual time scheduler.
	     */
	    VirtualTimeSchedulerPrototype.start = function () {
	      if (!this.isEnabled) {
	        this.isEnabled = true;
	        do {
	          var next = this.getNext();
	          if (next !== null) {
	            this.comparer(next.dueTime, this.clock) > 0 && (this.clock = next.dueTime);
	            next.invoke();
	          } else {
	            this.isEnabled = false;
	          }
	        } while (this.isEnabled);
	      }
	    };

	    /**
	     * Stops the virtual time scheduler.
	     */
	    VirtualTimeSchedulerPrototype.stop = function () {
	      this.isEnabled = false;
	    };

	    /**
	     * Advances the scheduler's clock to the specified time, running all work till that point.
	     * @param {Number} time Absolute time to advance the scheduler's clock to.
	     */
	    VirtualTimeSchedulerPrototype.advanceTo = function (time) {
	      var dueToClock = this.comparer(this.clock, time);
	      if (this.comparer(this.clock, time) > 0) { throw new ArgumentOutOfRangeError(); }
	      if (dueToClock === 0) { return; }
	      if (!this.isEnabled) {
	        this.isEnabled = true;
	        do {
	          var next = this.getNext();
	          if (next !== null && this.comparer(next.dueTime, time) <= 0) {
	            this.comparer(next.dueTime, this.clock) > 0 && (this.clock = next.dueTime);
	            next.invoke();
	          } else {
	            this.isEnabled = false;
	          }
	        } while (this.isEnabled);
	        this.clock = time;
	      }
	    };

	    /**
	     * Advances the scheduler's clock by the specified relative time, running all work scheduled for that timespan.
	     * @param {Number} time Relative time to advance the scheduler's clock by.
	     */
	    VirtualTimeSchedulerPrototype.advanceBy = function (time) {
	      var dt = this.add(this.clock, time),
	          dueToClock = this.comparer(this.clock, dt);
	      if (dueToClock > 0) { throw new ArgumentOutOfRangeError(); }
	      if (dueToClock === 0) {  return; }

	      this.advanceTo(dt);
	    };

	    /**
	     * Advances the scheduler's clock by the specified relative time.
	     * @param {Number} time Relative time to advance the scheduler's clock by.
	     */
	    VirtualTimeSchedulerPrototype.sleep = function (time) {
	      var dt = this.add(this.clock, time);
	      if (this.comparer(this.clock, dt) >= 0) { throw new ArgumentOutOfRangeError(); }

	      this.clock = dt;
	    };

	    /**
	     * Gets the next scheduled item to be executed.
	     * @returns {ScheduledItem} The next scheduled item.
	     */
	    VirtualTimeSchedulerPrototype.getNext = function () {
	      while (this.queue.length > 0) {
	        var next = this.queue.peek();
	        if (next.isCancelled()) {
	          this.queue.dequeue();
	        } else {
	          return next;
	        }
	      }
	      return null;
	    };

	    /**
	     * Schedules an action to be executed at dueTime.
	     * @param {Mixed} state State passed to the action to be executed.
	     * @param {Number} dueTime Absolute time at which to execute the action.
	     * @param {Function} action Action to be executed.
	     * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
	     */
	    VirtualTimeSchedulerPrototype.scheduleAbsolute = function (state, dueTime, action) {
	      var self = this;

	      function run(scheduler, state1) {
	        self.queue.remove(si);
	        return action(scheduler, state1);
	      }

	      var si = new ScheduledItem(this, state, run, dueTime, this.comparer);
	      this.queue.enqueue(si);

	      return si.disposable;
	    };

	    return VirtualTimeScheduler;
	  }(Scheduler));

	  /** Provides a virtual time scheduler that uses Date for absolute time and number for relative time. */
	  Rx.HistoricalScheduler = (function (__super__) {
	    inherits(HistoricalScheduler, __super__);

	    /**
	     * Creates a new historical scheduler with the specified initial clock value.
	     * @constructor
	     * @param {Number} initialClock Initial value for the clock.
	     * @param {Function} comparer Comparer to determine causality of events based on absolute time.
	     */
	    function HistoricalScheduler(initialClock, comparer) {
	      var clock = initialClock == null ? 0 : initialClock;
	      var cmp = comparer || defaultSubComparer;
	      __super__.call(this, clock, cmp);
	    }

	    var HistoricalSchedulerProto = HistoricalScheduler.prototype;

	    /**
	     * Adds a relative time value to an absolute time value.
	     * @param {Number} absolute Absolute virtual time value.
	     * @param {Number} relative Relative virtual time value to add.
	     * @return {Number} Resulting absolute virtual time sum value.
	     */
	    HistoricalSchedulerProto.add = function (absolute, relative) {
	      return absolute + relative;
	    };

	    HistoricalSchedulerProto.toAbsoluteTime = function (absolute) {
	      return new Date(absolute).getTime();
	    };

	    /**
	     * Converts the TimeSpan value to a relative virtual time value.
	     * @memberOf HistoricalScheduler
	     * @param {Number} timeSpan TimeSpan value to convert.
	     * @return {Number} Corresponding relative virtual time value.
	     */
	    HistoricalSchedulerProto.toRelativeTime = function (timeSpan) {
	      return timeSpan;
	    };

	    return HistoricalScheduler;
	  }(Rx.VirtualTimeScheduler));

	function OnNextPredicate(predicate) {
	    this.predicate = predicate;
	}

	OnNextPredicate.prototype.equals = function (other) {
	  if (other === this) { return true; }
	  if (other == null) { return false; }
	  if (other.kind !== 'N') { return false; }
	  return this.predicate(other.value);
	};

	function OnErrorPredicate(predicate) {
	  this.predicate = predicate;
	}

	OnErrorPredicate.prototype.equals = function (other) {
	  if (other === this) { return true; }
	  if (other == null) { return false; }
	  if (other.kind !== 'E') { return false; }
	  return this.predicate(other.error);
	};

	var ReactiveTest = Rx.ReactiveTest = {
	  /** Default virtual time used for creation of observable sequences in unit tests. */
	  created: 100,
	  /** Default virtual time used to subscribe to observable sequences in unit tests. */
	  subscribed: 200,
	  /** Default virtual time used to dispose subscriptions in unit tests. */
	  disposed: 1000,

	  /**
	   * Factory method for an OnNext notification record at a given time with a given value or a predicate function.
	   *
	   * 1 - ReactiveTest.onNext(200, 42);
	   * 2 - ReactiveTest.onNext(200, function (x) { return x.length == 2; });
	   *
	   * @param ticks Recorded virtual time the OnNext notification occurs.
	   * @param value Recorded value stored in the OnNext notification or a predicate.
	   * @return Recorded OnNext notification.
	   */
	  onNext: function (ticks, value) {
	    return typeof value === 'function' ?
	      new Recorded(ticks, new OnNextPredicate(value)) :
	      new Recorded(ticks, Notification.createOnNext(value));
	  },
	  /**
	   * Factory method for an OnError notification record at a given time with a given error.
	   *
	   * 1 - ReactiveTest.onNext(200, new Error('error'));
	   * 2 - ReactiveTest.onNext(200, function (e) { return e.message === 'error'; });
	   *
	   * @param ticks Recorded virtual time the OnError notification occurs.
	   * @param exception Recorded exception stored in the OnError notification.
	   * @return Recorded OnError notification.
	   */
	  onError: function (ticks, error) {
	    return typeof error === 'function' ?
	      new Recorded(ticks, new OnErrorPredicate(error)) :
	      new Recorded(ticks, Notification.createOnError(error));
	  },
	  /**
	   * Factory method for an OnCompleted notification record at a given time.
	   *
	   * @param ticks Recorded virtual time the OnCompleted notification occurs.
	   * @return Recorded OnCompleted notification.
	   */
	  onCompleted: function (ticks) {
	    return new Recorded(ticks, Notification.createOnCompleted());
	  },
	  /**
	   * Factory method for a subscription record based on a given subscription and disposal time.
	   *
	   * @param start Virtual time indicating when the subscription was created.
	   * @param end Virtual time indicating when the subscription was disposed.
	   * @return Subscription object.
	   */
	  subscribe: function (start, end) {
	    return new Subscription(start, end);
	  }
	};

	  /**
	   * Creates a new object recording the production of the specified value at the given virtual time.
	   *
	   * @constructor
	   * @param {Number} time Virtual time the value was produced on.
	   * @param {Mixed} value Value that was produced.
	   * @param {Function} comparer An optional comparer.
	   */
	  var Recorded = Rx.Recorded = function (time, value, comparer) {
	    this.time = time;
	    this.value = value;
	    this.comparer = comparer || defaultComparer;
	  };

	  /**
	   * Checks whether the given recorded object is equal to the current instance.
	   *
	   * @param {Recorded} other Recorded object to check for equality.
	   * @returns {Boolean} true if both objects are equal; false otherwise.
	   */
	  Recorded.prototype.equals = function (other) {
	    return this.time === other.time && this.comparer(this.value, other.value);
	  };

	  /**
	   * Returns a string representation of the current Recorded value.
	   *
	   * @returns {String} String representation of the current Recorded value.
	   */
	  Recorded.prototype.toString = function () {
	    return this.value.toString() + '@' + this.time;
	  };

	  /**
	   * Creates a new subscription object with the given virtual subscription and unsubscription time.
	   *
	   * @constructor
	   * @param {Number} subscribe Virtual time at which the subscription occurred.
	   * @param {Number} unsubscribe Virtual time at which the unsubscription occurred.
	   */
	  var Subscription = Rx.Subscription = function (start, end) {
	    this.subscribe = start;
	    this.unsubscribe = end || Number.MAX_VALUE;
	  };

	  /**
	   * Checks whether the given subscription is equal to the current instance.
	   * @param other Subscription object to check for equality.
	   * @returns {Boolean} true if both objects are equal; false otherwise.
	   */
	  Subscription.prototype.equals = function (other) {
	    return this.subscribe === other.subscribe && this.unsubscribe === other.unsubscribe;
	  };

	  /**
	   * Returns a string representation of the current Subscription value.
	   * @returns {String} String representation of the current Subscription value.
	   */
	  Subscription.prototype.toString = function () {
	    return '(' + this.subscribe + ', ' + (this.unsubscribe === Number.MAX_VALUE ? 'Infinite' : this.unsubscribe) + ')';
	  };

	  var MockDisposable = Rx.MockDisposable = function (scheduler) {
	    this.scheduler = scheduler;
	    this.disposes = [];
	    this.disposes.push(this.scheduler.clock);
	  };

	  MockDisposable.prototype.dispose = function () {
	    this.disposes.push(this.scheduler.clock);
	  };

	  var MockObserver = (function (__super__) {
	    inherits(MockObserver, __super__);

	    function MockObserver(scheduler) {
	      __super__.call(this);
	      this.scheduler = scheduler;
	      this.messages = [];
	    }

	    var MockObserverPrototype = MockObserver.prototype;

	    MockObserverPrototype.onNext = function (value) {
	      this.messages.push(new Recorded(this.scheduler.clock, Notification.createOnNext(value)));
	    };

	    MockObserverPrototype.onError = function (e) {
	      this.messages.push(new Recorded(this.scheduler.clock, Notification.createOnError(e)));
	    };

	    MockObserverPrototype.onCompleted = function () {
	      this.messages.push(new Recorded(this.scheduler.clock, Notification.createOnCompleted()));
	    };

	    return MockObserver;
	  })(Observer);

	  function MockPromise(scheduler, messages) {
	    var self = this;
	    this.scheduler = scheduler;
	    this.messages = messages;
	    this.subscriptions = [];
	    this.observers = [];
	    for (var i = 0, len = this.messages.length; i < len; i++) {
	      var message = this.messages[i],
	          notification = message.value;
	      (function (innerNotification) {
	        scheduler.scheduleAbsolute(null, message.time, function () {
	          var obs = self.observers.slice(0);

	          for (var j = 0, jLen = obs.length; j < jLen; j++) {
	            innerNotification.accept(obs[j]);
	          }
	          return disposableEmpty;
	        });
	      })(notification);
	    }
	  }

	  MockPromise.prototype.then = function (onResolved, onRejected) {
	    var self = this;

	    this.subscriptions.push(new Subscription(this.scheduler.clock));
	    var index = this.subscriptions.length - 1;

	    var newPromise;

	    var observer = Rx.Observer.create(
	      function (x) {
	        var retValue = onResolved(x);
	        if (retValue && typeof retValue.then === 'function') {
	          newPromise = retValue;
	        } else {
	          var ticks = self.scheduler.clock;
	          newPromise = new MockPromise(self.scheduler, [Rx.ReactiveTest.onNext(ticks, undefined), Rx.ReactiveTest.onCompleted(ticks)]);
	        }
	        var idx = self.observers.indexOf(observer);
	        self.observers.splice(idx, 1);
	        self.subscriptions[index] = new Subscription(self.subscriptions[index].subscribe, self.scheduler.clock);
	      },
	      function (err) {
	        onRejected(err);
	        var idx = self.observers.indexOf(observer);
	        self.observers.splice(idx, 1);
	        self.subscriptions[index] = new Subscription(self.subscriptions[index].subscribe, self.scheduler.clock);
	      }
	    );
	    this.observers.push(observer);

	    return newPromise || new MockPromise(this.scheduler, this.messages);
	  };

	  var HotObservable = (function (__super__) {
	    inherits(HotObservable, __super__);

	    function HotObservable(scheduler, messages) {
	      __super__.call(this);
	      var message, notification, observable = this;
	      this.scheduler = scheduler;
	      this.messages = messages;
	      this.subscriptions = [];
	      this.observers = [];
	      for (var i = 0, len = this.messages.length; i < len; i++) {
	        message = this.messages[i];
	        notification = message.value;
	        (function (innerNotification) {
	          scheduler.scheduleAbsolute(null, message.time, function () {
	            var obs = observable.observers.slice(0);

	            for (var j = 0, jLen = obs.length; j < jLen; j++) {
	              innerNotification.accept(obs[j]);
	            }
	            return disposableEmpty;
	          });
	        })(notification);
	      }
	    }

	    HotObservable.prototype._subscribe = function (o) {
	      var observable = this;
	      this.observers.push(o);
	      this.subscriptions.push(new Subscription(this.scheduler.clock));
	      var index = this.subscriptions.length - 1;
	      return disposableCreate(function () {
	        var idx = observable.observers.indexOf(o);
	        observable.observers.splice(idx, 1);
	        observable.subscriptions[index] = new Subscription(observable.subscriptions[index].subscribe, observable.scheduler.clock);
	      });
	    };

	    return HotObservable;
	  })(Observable);

	  var ColdObservable = (function (__super__) {
	    inherits(ColdObservable, __super__);

	    function ColdObservable(scheduler, messages) {
	      __super__.call(this);
	      this.scheduler = scheduler;
	      this.messages = messages;
	      this.subscriptions = [];
	    }

	    ColdObservable.prototype._subscribe = function (o) {
	      var message, notification, observable = this;
	      this.subscriptions.push(new Subscription(this.scheduler.clock));
	      var index = this.subscriptions.length - 1;
	      var d = new CompositeDisposable();
	      for (var i = 0, len = this.messages.length; i < len; i++) {
	        message = this.messages[i];
	        notification = message.value;
	        (function (innerNotification) {
	          d.add(observable.scheduler.scheduleRelative(null, message.time, function () {
	            innerNotification.accept(o);
	            return disposableEmpty;
	          }));
	        })(notification);
	      }
	      return disposableCreate(function () {
	        observable.subscriptions[index] = new Subscription(observable.subscriptions[index].subscribe, observable.scheduler.clock);
	        d.dispose();
	      });
	    };

	    return ColdObservable;
	  })(Observable);

	  /** Virtual time scheduler used for testing applications and libraries built using Reactive Extensions. */
	  Rx.TestScheduler = (function (__super__) {
	    inherits(TestScheduler, __super__);

	    function baseComparer(x, y) {
	      return x > y ? 1 : (x < y ? -1 : 0);
	    }

	    function TestScheduler() {
	      __super__.call(this, 0, baseComparer);
	    }

	    /**
	     * Schedules an action to be executed at the specified virtual time.
	     *
	     * @param state State passed to the action to be executed.
	     * @param dueTime Absolute virtual time at which to execute the action.
	     * @param action Action to be executed.
	     * @return Disposable object used to cancel the scheduled action (best effort).
	     */
	    TestScheduler.prototype.scheduleAbsolute = function (state, dueTime, action) {
	      dueTime <= this.clock && (dueTime = this.clock + 1);
	      return __super__.prototype.scheduleAbsolute.call(this, state, dueTime, action);
	    };
	    /**
	     * Adds a relative virtual time to an absolute virtual time value.
	     *
	     * @param absolute Absolute virtual time value.
	     * @param relative Relative virtual time value to add.
	     * @return Resulting absolute virtual time sum value.
	     */
	    TestScheduler.prototype.add = function (absolute, relative) {
	      return absolute + relative;
	    };
	    /**
	     * Converts the absolute virtual time value to a DateTimeOffset value.
	     *
	     * @param absolute Absolute virtual time value to convert.
	     * @return Corresponding DateTimeOffset value.
	     */
	    TestScheduler.prototype.toAbsoluteTime = function (absolute) {
	      return new Date(absolute).getTime();
	    };
	    /**
	     * Converts the TimeSpan value to a relative virtual time value.
	     *
	     * @param timeSpan TimeSpan value to convert.
	     * @return Corresponding relative virtual time value.
	     */
	    TestScheduler.prototype.toRelativeTime = function (timeSpan) {
	      return timeSpan;
	    };
	    /**
	     * Starts the test scheduler and uses the specified virtual times to invoke the factory function, subscribe to the resulting sequence, and dispose the subscription.
	     *
	     * @param create Factory method to create an observable sequence.
	     * @param created Virtual time at which to invoke the factory to create an observable sequence.
	     * @param subscribed Virtual time at which to subscribe to the created observable sequence.
	     * @param disposed Virtual time at which to dispose the subscription.
	     * @return Observer with timestamped recordings of notification messages that were received during the virtual time window when the subscription to the source sequence was active.
	     */
	    TestScheduler.prototype.startScheduler = function (createFn, settings) {
	      settings || (settings = {});
	      settings.created == null && (settings.created = ReactiveTest.created);
	      settings.subscribed == null && (settings.subscribed = ReactiveTest.subscribed);
	      settings.disposed == null && (settings.disposed = ReactiveTest.disposed);

	      var observer = this.createObserver(), source, subscription;

	      this.scheduleAbsolute(null, settings.created, function () {
	        source = createFn();
	        return disposableEmpty;
	      });

	      this.scheduleAbsolute(null, settings.subscribed, function () {
	        subscription = source.subscribe(observer);
	        return disposableEmpty;
	      });

	      this.scheduleAbsolute(null, settings.disposed, function () {
	        subscription.dispose();
	        return disposableEmpty;
	      });

	      this.start();

	      return observer;
	    };

	    /**
	     * Creates a hot observable using the specified timestamped notification messages either as an array or arguments.
	     * @param messages Notifications to surface through the created sequence at their specified absolute virtual times.
	     * @return Hot observable sequence that can be used to assert the timing of subscriptions and notifications.
	     */
	    TestScheduler.prototype.createHotObservable = function () {
	      var len = arguments.length, args;
	      if (Array.isArray(arguments[0])) {
	        args = arguments[0];
	      } else {
	        args = new Array(len);
	        for (var i = 0; i < len; i++) { args[i] = arguments[i]; }
	      }
	      return new HotObservable(this, args);
	    };

	    /**
	     * Creates a cold observable using the specified timestamped notification messages either as an array or arguments.
	     * @param messages Notifications to surface through the created sequence at their specified virtual time offsets from the sequence subscription time.
	     * @return Cold observable sequence that can be used to assert the timing of subscriptions and notifications.
	     */
	    TestScheduler.prototype.createColdObservable = function () {
	      var len = arguments.length, args;
	      if (Array.isArray(arguments[0])) {
	        args = arguments[0];
	      } else {
	        args = new Array(len);
	        for (var i = 0; i < len; i++) { args[i] = arguments[i]; }
	      }
	      return new ColdObservable(this, args);
	    };

	    /**
	     * Creates a resolved promise with the given value and ticks
	     * @param {Number} ticks The absolute time of the resolution.
	     * @param {Any} value The value to yield at the given tick.
	     * @returns {MockPromise} A mock Promise which fulfills with the given value.
	     */
	    TestScheduler.prototype.createResolvedPromise = function (ticks, value) {
	      return new MockPromise(this, [Rx.ReactiveTest.onNext(ticks, value), Rx.ReactiveTest.onCompleted(ticks)]);
	    };

	    /**
	     * Creates a rejected promise with the given reason and ticks
	     * @param {Number} ticks The absolute time of the resolution.
	     * @param {Any} reason The reason for rejection to yield at the given tick.
	     * @returns {MockPromise} A mock Promise which rejects with the given reason.
	     */
	    TestScheduler.prototype.createRejectedPromise = function (ticks, reason) {
	      return new MockPromise(this, [Rx.ReactiveTest.onError(ticks, reason)]);
	    };

	    /**
	     * Creates an observer that records received notification messages and timestamps those.
	     * @return Observer that can be used to assert the timing of received notifications.
	     */
	    TestScheduler.prototype.createObserver = function () {
	      return new MockObserver(this);
	    };

	    return TestScheduler;
	  })(VirtualTimeScheduler);

	  var AnonymousObservable = Rx.AnonymousObservable = (function (__super__) {
	    inherits(AnonymousObservable, __super__);

	    // Fix subscriber to check for undefined or function returned to decorate as Disposable
	    function fixSubscriber(subscriber) {
	      return subscriber && isFunction(subscriber.dispose) ? subscriber :
	        isFunction(subscriber) ? disposableCreate(subscriber) : disposableEmpty;
	    }

	    function setDisposable(s, state) {
	      var ado = state[0], self = state[1];
	      var sub = tryCatch(self.__subscribe).call(self, ado);
	      if (sub === errorObj && !ado.fail(errorObj.e)) { thrower(errorObj.e); }
	      ado.setDisposable(fixSubscriber(sub));
	    }

	    function AnonymousObservable(subscribe, parent) {
	      this.source = parent;
	      this.__subscribe = subscribe;
	      __super__.call(this);
	    }

	    AnonymousObservable.prototype._subscribe = function (o) {
	      var ado = new AutoDetachObserver(o), state = [ado, this];

	      if (currentThreadScheduler.scheduleRequired()) {
	        currentThreadScheduler.schedule(state, setDisposable);
	      } else {
	        setDisposable(null, state);
	      }
	      return ado;
	    };

	    return AnonymousObservable;

	  }(Observable));

	  var AutoDetachObserver = (function (__super__) {
	    inherits(AutoDetachObserver, __super__);

	    function AutoDetachObserver(observer) {
	      __super__.call(this);
	      this.observer = observer;
	      this.m = new SingleAssignmentDisposable();
	    }

	    var AutoDetachObserverPrototype = AutoDetachObserver.prototype;

	    AutoDetachObserverPrototype.next = function (value) {
	      var result = tryCatch(this.observer.onNext).call(this.observer, value);
	      if (result === errorObj) {
	        this.dispose();
	        thrower(result.e);
	      }
	    };

	    AutoDetachObserverPrototype.error = function (err) {
	      var result = tryCatch(this.observer.onError).call(this.observer, err);
	      this.dispose();
	      result === errorObj && thrower(result.e);
	    };

	    AutoDetachObserverPrototype.completed = function () {
	      var result = tryCatch(this.observer.onCompleted).call(this.observer);
	      this.dispose();
	      result === errorObj && thrower(result.e);
	    };

	    AutoDetachObserverPrototype.setDisposable = function (value) { this.m.setDisposable(value); };
	    AutoDetachObserverPrototype.getDisposable = function () { return this.m.getDisposable(); };

	    AutoDetachObserverPrototype.dispose = function () {
	      __super__.prototype.dispose.call(this);
	      this.m.dispose();
	    };

	    return AutoDetachObserver;
	  }(AbstractObserver));

	  var UnderlyingObservable = (function (__super__) {
	    inherits(UnderlyingObservable, __super__);
	    function UnderlyingObservable(m, u) {
	      this._m = m;
	      this._u = u;
	      __super__.call(this);
	    }

	    UnderlyingObservable.prototype.subscribeCore = function (o) {
	      return new BinaryDisposable(this._m.getDisposable(), this._u.subscribe(o));
	    };

	    return UnderlyingObservable;
	  }(ObservableBase));

	  var GroupedObservable = (function (__super__) {
	    inherits(GroupedObservable, __super__);
	    function GroupedObservable(key, underlyingObservable, mergedDisposable) {
	      __super__.call(this);
	      this.key = key;
	      this.underlyingObservable = !mergedDisposable ?
	        underlyingObservable :
	        new UnderlyingObservable(mergedDisposable, underlyingObservable);
	    }

	    GroupedObservable.prototype._subscribe = function (o) {
	      return this.underlyingObservable.subscribe(o);
	    };

	    return GroupedObservable;
	  }(Observable));

	  /**
	   *  Represents an object that is both an observable sequence as well as an observer.
	   *  Each notification is broadcasted to all subscribed observers.
	   */
	  var Subject = Rx.Subject = (function (__super__) {
	    inherits(Subject, __super__);
	    function Subject() {
	      __super__.call(this);
	      this.isDisposed = false;
	      this.isStopped = false;
	      this.observers = [];
	      this.hasError = false;
	    }

	    addProperties(Subject.prototype, Observer.prototype, {
	      _subscribe: function (o) {
	        checkDisposed(this);
	        if (!this.isStopped) {
	          this.observers.push(o);
	          return new InnerSubscription(this, o);
	        }
	        if (this.hasError) {
	          o.onError(this.error);
	          return disposableEmpty;
	        }
	        o.onCompleted();
	        return disposableEmpty;
	      },
	      /**
	       * Indicates whether the subject has observers subscribed to it.
	       * @returns {Boolean} Indicates whether the subject has observers subscribed to it.
	       */
	      hasObservers: function () { checkDisposed(this); return this.observers.length > 0; },
	      /**
	       * Notifies all subscribed observers about the end of the sequence.
	       */
	      onCompleted: function () {
	        checkDisposed(this);
	        if (!this.isStopped) {
	          this.isStopped = true;
	          for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	            os[i].onCompleted();
	          }

	          this.observers.length = 0;
	        }
	      },
	      /**
	       * Notifies all subscribed observers about the exception.
	       * @param {Mixed} error The exception to send to all observers.
	       */
	      onError: function (error) {
	        checkDisposed(this);
	        if (!this.isStopped) {
	          this.isStopped = true;
	          this.error = error;
	          this.hasError = true;
	          for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	            os[i].onError(error);
	          }

	          this.observers.length = 0;
	        }
	      },
	      /**
	       * Notifies all subscribed observers about the arrival of the specified element in the sequence.
	       * @param {Mixed} value The value to send to all observers.
	       */
	      onNext: function (value) {
	        checkDisposed(this);
	        if (!this.isStopped) {
	          for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	            os[i].onNext(value);
	          }
	        }
	      },
	      /**
	       * Unsubscribe all observers and release resources.
	       */
	      dispose: function () {
	        this.isDisposed = true;
	        this.observers = null;
	      }
	    });

	    /**
	     * Creates a subject from the specified observer and observable.
	     * @param {Observer} observer The observer used to send messages to the subject.
	     * @param {Observable} observable The observable used to subscribe to messages sent from the subject.
	     * @returns {Subject} Subject implemented using the given observer and observable.
	     */
	    Subject.create = function (observer, observable) {
	      return new AnonymousSubject(observer, observable);
	    };

	    return Subject;
	  }(Observable));

	  /**
	   *  Represents the result of an asynchronous operation.
	   *  The last value before the OnCompleted notification, or the error received through OnError, is sent to all subscribed observers.
	   */
	  var AsyncSubject = Rx.AsyncSubject = (function (__super__) {
	    inherits(AsyncSubject, __super__);

	    /**
	     * Creates a subject that can only receive one value and that value is cached for all future observations.
	     * @constructor
	     */
	    function AsyncSubject() {
	      __super__.call(this);
	      this.isDisposed = false;
	      this.isStopped = false;
	      this.hasValue = false;
	      this.observers = [];
	      this.hasError = false;
	    }

	    addProperties(AsyncSubject.prototype, Observer.prototype, {
	      _subscribe: function (o) {
	        checkDisposed(this);

	        if (!this.isStopped) {
	          this.observers.push(o);
	          return new InnerSubscription(this, o);
	        }

	        if (this.hasError) {
	          o.onError(this.error);
	        } else if (this.hasValue) {
	          o.onNext(this.value);
	          o.onCompleted();
	        } else {
	          o.onCompleted();
	        }

	        return disposableEmpty;
	      },
	      /**
	       * Indicates whether the subject has observers subscribed to it.
	       * @returns {Boolean} Indicates whether the subject has observers subscribed to it.
	       */
	      hasObservers: function () { checkDisposed(this); return this.observers.length > 0; },
	      /**
	       * Notifies all subscribed observers about the end of the sequence, also causing the last received value to be sent out (if any).
	       */
	      onCompleted: function () {
	        var i, len;
	        checkDisposed(this);
	        if (!this.isStopped) {
	          this.isStopped = true;
	          var os = cloneArray(this.observers), len = os.length;

	          if (this.hasValue) {
	            for (i = 0; i < len; i++) {
	              var o = os[i];
	              o.onNext(this.value);
	              o.onCompleted();
	            }
	          } else {
	            for (i = 0; i < len; i++) {
	              os[i].onCompleted();
	            }
	          }

	          this.observers.length = 0;
	        }
	      },
	      /**
	       * Notifies all subscribed observers about the error.
	       * @param {Mixed} error The Error to send to all observers.
	       */
	      onError: function (error) {
	        checkDisposed(this);
	        if (!this.isStopped) {
	          this.isStopped = true;
	          this.hasError = true;
	          this.error = error;

	          for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	            os[i].onError(error);
	          }

	          this.observers.length = 0;
	        }
	      },
	      /**
	       * Sends a value to the subject. The last value received before successful termination will be sent to all subscribed and future observers.
	       * @param {Mixed} value The value to store in the subject.
	       */
	      onNext: function (value) {
	        checkDisposed(this);
	        if (this.isStopped) { return; }
	        this.value = value;
	        this.hasValue = true;
	      },
	      /**
	       * Unsubscribe all observers and release resources.
	       */
	      dispose: function () {
	        this.isDisposed = true;
	        this.observers = null;
	        this.error = null;
	        this.value = null;
	      }
	    });

	    return AsyncSubject;
	  }(Observable));

	  /**
	   *  Represents a value that changes over time.
	   *  Observers can subscribe to the subject to receive the last (or initial) value and all subsequent notifications.
	   */
	  var BehaviorSubject = Rx.BehaviorSubject = (function (__super__) {
	    inherits(BehaviorSubject, __super__);
	    function BehaviorSubject(value) {
	      __super__.call(this);
	      this.value = value;
	      this.observers = [];
	      this.isDisposed = false;
	      this.isStopped = false;
	      this.hasError = false;
	    }

	    addProperties(BehaviorSubject.prototype, Observer.prototype, {
	      _subscribe: function (o) {
	        checkDisposed(this);
	        if (!this.isStopped) {
	          this.observers.push(o);
	          o.onNext(this.value);
	          return new InnerSubscription(this, o);
	        }
	        if (this.hasError) {
	          o.onError(this.error);
	        } else {
	          o.onCompleted();
	        }
	        return disposableEmpty;
	      },
	      /**
	       * Gets the current value or throws an exception.
	       * Value is frozen after onCompleted is called.
	       * After onError is called always throws the specified exception.
	       * An exception is always thrown after dispose is called.
	       * @returns {Mixed} The initial value passed to the constructor until onNext is called; after which, the last value passed to onNext.
	       */
	      getValue: function () {
	        checkDisposed(this);
	        if (this.hasError) { thrower(this.error); }
	        return this.value;
	      },
	      /**
	       * Indicates whether the subject has observers subscribed to it.
	       * @returns {Boolean} Indicates whether the subject has observers subscribed to it.
	       */
	      hasObservers: function () { checkDisposed(this); return this.observers.length > 0; },
	      /**
	       * Notifies all subscribed observers about the end of the sequence.
	       */
	      onCompleted: function () {
	        checkDisposed(this);
	        if (this.isStopped) { return; }
	        this.isStopped = true;
	        for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	          os[i].onCompleted();
	        }

	        this.observers.length = 0;
	      },
	      /**
	       * Notifies all subscribed observers about the exception.
	       * @param {Mixed} error The exception to send to all observers.
	       */
	      onError: function (error) {
	        checkDisposed(this);
	        if (this.isStopped) { return; }
	        this.isStopped = true;
	        this.hasError = true;
	        this.error = error;

	        for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	          os[i].onError(error);
	        }

	        this.observers.length = 0;
	      },
	      /**
	       * Notifies all subscribed observers about the arrival of the specified element in the sequence.
	       * @param {Mixed} value The value to send to all observers.
	       */
	      onNext: function (value) {
	        checkDisposed(this);
	        if (this.isStopped) { return; }
	        this.value = value;
	        for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	          os[i].onNext(value);
	        }
	      },
	      /**
	       * Unsubscribe all observers and release resources.
	       */
	      dispose: function () {
	        this.isDisposed = true;
	        this.observers = null;
	        this.value = null;
	        this.error = null;
	      }
	    });

	    return BehaviorSubject;
	  }(Observable));

	  /**
	   * Represents an object that is both an observable sequence as well as an observer.
	   * Each notification is broadcasted to all subscribed and future observers, subject to buffer trimming policies.
	   */
	  var ReplaySubject = Rx.ReplaySubject = (function (__super__) {

	    var maxSafeInteger = Math.pow(2, 53) - 1;

	    function createRemovableDisposable(subject, observer) {
	      return disposableCreate(function () {
	        observer.dispose();
	        !subject.isDisposed && subject.observers.splice(subject.observers.indexOf(observer), 1);
	      });
	    }

	    inherits(ReplaySubject, __super__);

	    /**
	     *  Initializes a new instance of the ReplaySubject class with the specified buffer size, window size and scheduler.
	     *  @param {Number} [bufferSize] Maximum element count of the replay buffer.
	     *  @param {Number} [windowSize] Maximum time length of the replay buffer.
	     *  @param {Scheduler} [scheduler] Scheduler the observers are invoked on.
	     */
	    function ReplaySubject(bufferSize, windowSize, scheduler) {
	      this.bufferSize = bufferSize == null ? maxSafeInteger : bufferSize;
	      this.windowSize = windowSize == null ? maxSafeInteger : windowSize;
	      this.scheduler = scheduler || currentThreadScheduler;
	      this.q = [];
	      this.observers = [];
	      this.isStopped = false;
	      this.isDisposed = false;
	      this.hasError = false;
	      this.error = null;
	      __super__.call(this);
	    }

	    addProperties(ReplaySubject.prototype, Observer.prototype, {
	      _subscribe: function (o) {
	        checkDisposed(this);
	        var so = new ScheduledObserver(this.scheduler, o), subscription = createRemovableDisposable(this, so);

	        this._trim(this.scheduler.now());
	        this.observers.push(so);

	        for (var i = 0, len = this.q.length; i < len; i++) {
	          so.onNext(this.q[i].value);
	        }

	        if (this.hasError) {
	          so.onError(this.error);
	        } else if (this.isStopped) {
	          so.onCompleted();
	        }

	        so.ensureActive();
	        return subscription;
	      },
	      /**
	       * Indicates whether the subject has observers subscribed to it.
	       * @returns {Boolean} Indicates whether the subject has observers subscribed to it.
	       */
	      hasObservers: function () { checkDisposed(this); return this.observers.length > 0; },
	      _trim: function (now) {
	        while (this.q.length > this.bufferSize) {
	          this.q.shift();
	        }
	        while (this.q.length > 0 && (now - this.q[0].interval) > this.windowSize) {
	          this.q.shift();
	        }
	      },
	      /**
	       * Notifies all subscribed observers about the arrival of the specified element in the sequence.
	       * @param {Mixed} value The value to send to all observers.
	       */
	      onNext: function (value) {
	        checkDisposed(this);
	        if (this.isStopped) { return; }
	        var now = this.scheduler.now();
	        this.q.push({ interval: now, value: value });
	        this._trim(now);

	        for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	          var observer = os[i];
	          observer.onNext(value);
	          observer.ensureActive();
	        }
	      },
	      /**
	       * Notifies all subscribed observers about the exception.
	       * @param {Mixed} error The exception to send to all observers.
	       */
	      onError: function (error) {
	        checkDisposed(this);
	        if (this.isStopped) { return; }
	        this.isStopped = true;
	        this.error = error;
	        this.hasError = true;
	        var now = this.scheduler.now();
	        this._trim(now);
	        for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	          var observer = os[i];
	          observer.onError(error);
	          observer.ensureActive();
	        }
	        this.observers.length = 0;
	      },
	      /**
	       * Notifies all subscribed observers about the end of the sequence.
	       */
	      onCompleted: function () {
	        checkDisposed(this);
	        if (this.isStopped) { return; }
	        this.isStopped = true;
	        var now = this.scheduler.now();
	        this._trim(now);
	        for (var i = 0, os = cloneArray(this.observers), len = os.length; i < len; i++) {
	          var observer = os[i];
	          observer.onCompleted();
	          observer.ensureActive();
	        }
	        this.observers.length = 0;
	      },
	      /**
	       * Unsubscribe all observers and release resources.
	       */
	      dispose: function () {
	        this.isDisposed = true;
	        this.observers = null;
	      }
	    });

	    return ReplaySubject;
	  }(Observable));

	  var AnonymousSubject = Rx.AnonymousSubject = (function (__super__) {
	    inherits(AnonymousSubject, __super__);
	    function AnonymousSubject(observer, observable) {
	      this.observer = observer;
	      this.observable = observable;
	      __super__.call(this);
	    }

	    addProperties(AnonymousSubject.prototype, Observer.prototype, {
	      _subscribe: function (o) {
	        return this.observable.subscribe(o);
	      },
	      onCompleted: function () {
	        this.observer.onCompleted();
	      },
	      onError: function (error) {
	        this.observer.onError(error);
	      },
	      onNext: function (value) {
	        this.observer.onNext(value);
	      }
	    });

	    return AnonymousSubject;
	  }(Observable));

	  /**
	  * Used to pause and resume streams.
	  */
	  Rx.Pauser = (function (__super__) {
	    inherits(Pauser, __super__);
	    function Pauser() {
	      __super__.call(this);
	    }

	    /**
	     * Pauses the underlying sequence.
	     */
	    Pauser.prototype.pause = function () { this.onNext(false); };

	    /**
	    * Resumes the underlying sequence.
	    */
	    Pauser.prototype.resume = function () { this.onNext(true); };

	    return Pauser;
	  }(Subject));

	  if (true) {
	    root.Rx = Rx;

	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return Rx;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (freeExports && freeModule) {
	    // in Node.js or RingoJS
	    if (moduleExports) {
	      (freeModule.exports = Rx).Rx = Rx;
	    } else {
	      freeExports.Rx = Rx;
	    }
	  } else {
	    // in a browser or Rhino
	    root.Rx = Rx;
	  }

	  // All code before this point will be filtered from stack traces.
	  var rEndingLine = captureLine();

	}.call(this));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)(module), (function() { return this; }()), __webpack_require__(15)))

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _client = __webpack_require__(80);

	var _client2 = _interopRequireDefault(_client);

	var _client3 = __webpack_require__(100);

	var _client4 = _interopRequireDefault(_client3);

	var _client5 = __webpack_require__(114);

	var _client6 = _interopRequireDefault(_client5);

	var _client7 = __webpack_require__(122);

	var _client8 = _interopRequireDefault(_client7);

	var _feathersHooks = __webpack_require__(124);

	var _feathersHooks2 = _interopRequireDefault(_feathersHooks);

	var _client9 = __webpack_require__(129);

	var _client10 = _interopRequireDefault(_client9);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	Object.assign(_client2.default, { socketio: _client6.default, primus: _client8.default, rest: _client4.default, hooks: _feathersHooks2.default, authentication: _client10.default });

	exports.default = _client2.default;
	module.exports = exports['default'];

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(81);


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = createApplication;

	var _feathers = __webpack_require__(82);

	var _feathers2 = _interopRequireDefault(_feathers);

	var _express = __webpack_require__(99);

	var _express2 = _interopRequireDefault(_express);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function createApplication() {
	  return (0, _feathers2.default)(_express2.default.apply(undefined, arguments));
	}

	createApplication.version = '2.0.1';
	module.exports = exports['default'];

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = createApplication;

	var _uberproto = __webpack_require__(83);

	var _uberproto2 = _interopRequireDefault(_uberproto);

	var _application = __webpack_require__(84);

	var _application2 = _interopRequireDefault(_application);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Create a Feathers application that extends Express.
	 *
	 * @return {Function}
	 * @api public
	 */
	function createApplication(app) {
	  _uberproto2.default.mixin(_application2.default, app);
	  app.init();
	  return app;
	}
	module.exports = exports['default'];

/***/ }),
/* 83 */
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
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _debug = __webpack_require__(85);

	var _debug2 = _interopRequireDefault(_debug);

	var _feathersCommons = __webpack_require__(88);

	var _uberproto = __webpack_require__(83);

	var _uberproto2 = _interopRequireDefault(_uberproto);

	var _index = __webpack_require__(92);

	var _index2 = _interopRequireDefault(_index);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var debug = (0, _debug2.default)('feathers:application');
	var methods = ['find', 'get', 'create', 'update', 'patch', 'remove'];
	var Proto = _uberproto2.default.extend({
	  create: null
	});

	exports.default = {
	  init: function init() {
	    Object.assign(this, {
	      methods: methods,
	      mixins: (0, _index2.default)(),
	      services: {},
	      providers: [],
	      _setup: false
	    });
	  },
	  service: function service(location, _service) {
	    var _this = this;

	    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	    location = (0, _feathersCommons.stripSlashes)(location);

	    if (!_service) {
	      var current = this.services[location];

	      if (typeof current === 'undefined' && typeof this.defaultService === 'function') {
	        return this.service(location, this.defaultService(location), options);
	      }

	      return current;
	    }

	    var protoService = Proto.extend(_service);

	    debug('Registering new service at `' + location + '`');

	    // Add all the mixins
	    this.mixins.forEach(function (fn) {
	      return fn.call(_this, protoService);
	    });

	    if (typeof protoService._setup === 'function') {
	      protoService._setup(this, location);
	    }

	    // Run the provider functions to register the service
	    this.providers.forEach(function (provider) {
	      return provider.call(_this, location, protoService, options);
	    });

	    // If we ran setup already, set this service up explicitly
	    if (this._isSetup && typeof protoService.setup === 'function') {
	      debug('Setting up service for `' + location + '`');
	      protoService.setup(this, location);
	    }

	    return this.services[location] = protoService;
	  },
	  use: function use(location) {
	    var service = void 0;
	    var middleware = Array.from(arguments).slice(1).reduce(function (middleware, arg) {
	      if (typeof arg === 'function') {
	        middleware[service ? 'after' : 'before'].push(arg);
	      } else if (!service) {
	        service = arg;
	      } else {
	        throw new Error('invalid arg passed to app.use');
	      }
	      return middleware;
	    }, {
	      before: [],
	      after: []
	    });

	    var hasMethod = function hasMethod(methods) {
	      return methods.some(function (name) {
	        return service && typeof service[name] === 'function';
	      });
	    };

	    // Check for service (any object with at least one service method)
	    if (hasMethod(['handle', 'set']) || !hasMethod(this.methods.concat('setup'))) {
	      return this._super.apply(this, arguments);
	    }

	    // Any arguments left over are other middleware that we want to pass to the providers
	    this.service(location, service, { middleware: middleware });

	    return this;
	  },
	  setup: function setup() {
	    var _this2 = this;

	    // Setup each service (pass the app so that they can look up other services etc.)
	    Object.keys(this.services).forEach(function (path) {
	      var service = _this2.services[path];

	      debug('Setting up service for `' + path + '`');
	      if (typeof service.setup === 'function') {
	        service.setup(_this2, path);
	      }
	    });

	    this._isSetup = true;

	    return this;
	  },


	  // Express 3.x configure is gone in 4.x but we'll keep a more basic version
	  // That just takes a function in order to keep Feathers plugin configuration easier.
	  // Environment specific configurations should be done as suggested in the 4.x migration guide:
	  // https://github.com/visionmedia/express/wiki/Migrating-from-3.x-to-4.x
	  configure: function configure(fn) {
	    fn.call(this);

	    return this;
	  },
	  listen: function listen() {
	    var server = this._super.apply(this, arguments);

	    this.setup(server);
	    debug('Feathers application listening');

	    return server;
	  }
	};
	module.exports = exports['default'];

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * This is the web browser implementation of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = __webpack_require__(86);
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

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))

/***/ }),
/* 86 */
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
	exports.humanize = __webpack_require__(87);

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
/* 87 */
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
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _arguments = __webpack_require__(89);

	var _arguments2 = _interopRequireDefault(_arguments);

	var _utils = __webpack_require__(90);

	var _hooks = __webpack_require__(91);

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
/* 89 */
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
/* 90 */
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
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _utils = __webpack_require__(90);

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
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function () {
	  var mixins = [__webpack_require__(93), __webpack_require__(94), __webpack_require__(98)];

	  // Override push to make sure that normalize is always the last
	  mixins.push = function () {
	    var args = [this.length - 1, 0].concat(Array.from(arguments));
	    this.splice.apply(this, args);
	    return this.length;
	  };

	  return mixins;
	};

	module.exports = exports['default'];

/***/ }),
/* 93 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (service) {
	  var _this = this;

	  if (typeof service.mixin === 'function') {
	    (function () {
	      var mixin = {};

	      _this.methods.forEach(function (method) {
	        if (typeof service[method] === 'function') {
	          mixin[method] = wrapper;
	        }
	      });

	      service.mixin(mixin);
	    })();
	  }
	};

	function isPromise(result) {
	  return typeof result !== 'undefined' && typeof result.then === 'function';
	}

	function wrapper() {
	  var result = this._super.apply(this, arguments);
	  var callback = arguments[arguments.length - 1];

	  if (typeof callback === 'function' && isPromise(result)) {
	    result.then(function (data) {
	      return callback(null, data);
	    }, function (error) {
	      return callback(error);
	    });
	  }
	  return result;
	}

	module.exports = exports['default'];

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (service) {
	  var app = this;
	  var isEmitter = typeof service.on === 'function' && typeof service.emit === 'function';
	  var emitter = service._rubberDuck = _rubberduck2.default.emitter(service);

	  if (typeof service.mixin === 'function' && !isEmitter) {
	    service.mixin(_events.EventEmitter.prototype);
	  }

	  service._serviceEvents = Array.isArray(service.events) ? service.events.slice() : [];

	  // Pass the Rubberduck error event through
	  // TODO deal with error events properly
	  emitter.on('error', function (errors) {
	    service.emit('serviceError', errors[0]);
	  });

	  Object.keys(eventMappings).forEach(function (method) {
	    var event = eventMappings[method];
	    var alreadyEmits = service._serviceEvents.indexOf(event) !== -1;

	    if (typeof service[method] === 'function' && !alreadyEmits) {
	      // The Rubberduck event name (e.g. afterCreate, afterUpdate or afterDestroy)
	      var eventName = 'after' + upperCase(method);
	      service._serviceEvents.push(event);
	      // Punch the given method
	      emitter.punch(method, -1);
	      // Pass the event and error event through
	      emitter.on(eventName, function (results, args) {
	        if (!results[0]) {
	          (function () {
	            // callback without error
	            var hook = hookObject(method, 'after', args);
	            var data = Array.isArray(results[1]) ? results[1] : [results[1]];

	            hook.app = app;
	            data.forEach(function (current) {
	              return service.emit(event, current, hook);
	            });
	          })();
	        } else {
	          service.emit('serviceError', results[0]);
	        }
	      });
	    }
	  });
	};

	var _rubberduck = __webpack_require__(95);

	var _rubberduck2 = _interopRequireDefault(_rubberduck);

	var _events = __webpack_require__(96);

	var _feathersCommons = __webpack_require__(88);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var hookObject = _feathersCommons.hooks.hookObject;
	var eventMappings = {
	  create: 'created',
	  update: 'updated',
	  remove: 'removed',
	  patch: 'patched'
	};

	function upperCase(name) {
	  return name.charAt(0).toUpperCase() + name.substring(1);
	}

	module.exports = exports['default'];

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

	var events = __webpack_require__(96);
	var utils = __webpack_require__(97);
	var wrap = exports.wrap = {
	  /**
	   * Wrap an anonymous or named function to notify an Emitter and
	   * return the wrapper function.
	   * @param {events.EventEmitter} emitter The emitter to notify
	   * @param {Function} fn The function to wrap
	   * @param {String} name The optional name
	   */
	  fn: function(emitter, fn, strict, name, scope) {
	    var wrapped = function() {
	      var result;
	      utils.emitEvents(emitter, 'before', name, [arguments, this, name]);

	      try {
	        result = fn.apply(scope || this, arguments);
	      } catch (e) {
	        utils.emitEvents(emitter, 'error', name, [ e, arguments, this, name ]);
	        throw e;
	      }

	      utils.emitEvents(emitter, 'after', name, [ result, arguments, this, name ]);
	      return result;
	    };

	    if (strict) {
	      eval('wrapped = ' + utils.addArgs(wrapped.toString(), fn.length));
	    }

	    return wrapped;
	  },
	  /**
	   * Wrap an anonymous or named function that calls a callback asynchronously
	   * to notify an Emitter and return the wrapper function.
	   * @param {events.EventEmitter} emitter The emitter to notify
	   * @param {Function} fn The function to wrap
	   * @param {Integer} position The position of the callback in the arguments
	   * array (defaults to 0). Set to -1 if the callback is the last argument.
	   * @param {String} name The optional name
	   */
	  async: function(emitter, fn, position, strict, name, scope) {
	    var wrapped = function() {
	      var pos = position == -1 ? arguments.length - 1 : (position || 0);
	      var callback = arguments[pos];
	      var context = this;
	      var methodArgs = arguments;
	      var callbackWrapper = function() {
	        try {
	          callback.apply(context, arguments);
	        } catch (e) {
	          utils.emitEvents(emitter, 'error', name, [ e, methodArgs, context, name ]);
	          throw e;
	        }
	        var eventType = arguments[0] instanceof Error ? 'error' : 'after';
	        utils.emitEvents(emitter, eventType, name, [ arguments, methodArgs, context, name ]);
	      };

	      utils.emitEvents(emitter, 'before', name, [ methodArgs, this, name ]);
	      methodArgs[pos] = callbackWrapper;

	      try {
	        return fn.apply(scope || this, methodArgs);
	      } catch (e) {
	        utils.emitEvents(emitter, 'error', name, [ e, methodArgs, context, name ]);
	        throw e;
	      }
	    };

	    if (strict) {
	      eval('wrapped = ' + utils.addArgs(wrapped.toString(), fn.length));
	    }

	    return wrapped;
	  }
	};

	var Emitter = exports.Emitter = function(obj) {
	  this.obj = obj;
	};

	Emitter.prototype = Object.create(events.EventEmitter.prototype);

	/**
	 * Punch a method with the given name, with
	 * @param {String | Array} method The name of the method or a list of
	 * method names.
	 * @param {Integer} position The optional position of the asynchronous callback
	 * in the arguments list.
	 */
	Emitter.prototype.punch = function(method, position, strict) {
	  if (Array.isArray(method)) {
	    var self = this;
	    method.forEach(function(method) {
	      self.punch(method, position, strict);
	    });
	  } else {
	    var old = this.obj[method];
	    if (typeof old == 'function') {
	      this.obj[method] = (!position && position !== 0) ?
	        wrap.fn(this, old, strict, method) :
	        wrap.async(this, old, position, strict, method);
	    }
	  }
	  return this;
	};

	exports.emitter = function(obj) {
	  return new Emitter(obj);
	};


/***/ }),
/* 96 */
/***/ (function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;

	  if (!this._events)
	    this._events = {};

	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      } else {
	        // At least give some kind of context to the user
	        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
	        err.context = er;
	        throw err;
	      }
	    }
	  }

	  handler = this._events[type];

	  if (isUndefined(handler))
	    return false;

	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }

	  return true;
	};

	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events)
	    this._events = {};

	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);

	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];

	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }

	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  var fired = false;

	  function g() {
	    this.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  g.listener = listener;
	  this.on(type, g);

	  return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events || !this._events[type])
	    return this;

	  list = this._events[type];
	  length = list.length;
	  position = -1;

	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);

	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0)
	      return this;

	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }

	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;

	  if (!this._events)
	    return this;

	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }

	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }

	  listeners = this._events[type];

	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];

	  return this;
	};

	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};

	EventEmitter.prototype.listenerCount = function(type) {
	  if (this._events) {
	    var evlistener = this._events[type];

	    if (isFunction(evlistener))
	      return 1;
	    else if (evlistener)
	      return evlistener.length;
	  }
	  return 0;
	};

	EventEmitter.listenerCount = function(emitter, type) {
	  return emitter.listenerCount(type);
	};

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ }),
/* 97 */
/***/ (function(module, exports) {

	exports.toBase26 = function(num) {
	  var outString = '';
	  var letters = 'abcdefghijklmnopqrstuvwxyz';
	  while (num > 25) {
	    var remainder = num % 26;
	    outString = letters.charAt(remainder) + outString;
	    num = Math.floor(num / 26) - 1;
	  }
	  outString = letters.charAt(num) + outString;
	  return outString;
	};

	exports.makeFakeArgs = function(len) {
	  var argArr = [];
	  for (var i = 0; i < len; i++) {
	    argArr.push(exports.toBase26(i));
	  }
	  return argArr.join(",");
	};

	exports.addArgs = function(fnString, argLen) {
	  return fnString.replace(/function\s*\(\)/, 'function(' + exports.makeFakeArgs(argLen) + ')');
	};

	exports.emitEvents = function(emitter, type, name, args) {
	  var ucName = name ? name.replace(/^\w/, function(first) {
	    return first.toUpperCase();
	  }) : null;

	  emitter.emit.apply(emitter, [type].concat(args));
	  if (ucName) {
	    emitter.emit.apply(emitter, [type + ucName].concat(args));
	  }
	};


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (service) {
	  var _this = this;

	  if (typeof service.mixin === 'function') {
	    (function () {
	      var mixin = {};

	      _this.methods.forEach(function (method) {
	        if (typeof service[method] === 'function') {
	          mixin[method] = function () {
	            return this._super.apply(this, (0, _feathersCommons.getArguments)(method, arguments));
	          };
	        }
	      });

	      service.mixin(mixin);
	    })();
	  }
	};

	var _feathersCommons = __webpack_require__(88);

	module.exports = exports['default'];

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function () {
	  var app = {
	    settings: {},

	    get: function get(name) {
	      return this.settings[name];
	    },
	    set: function set(name, value) {
	      this.settings[name] = value;
	      return this;
	    },
	    disable: function disable(name) {
	      this.settings[name] = false;
	      return this;
	    },
	    disabled: function disabled(name) {
	      return !this.settings[name];
	    },
	    enable: function enable(name) {
	      this.settings[name] = true;
	      return this;
	    },
	    enabled: function enabled(name) {
	      return !!this.settings[name];
	    },
	    use: function use() {
	      throw new Error('Middleware functions can not be used in the Feathers client');
	    },
	    listen: function listen() {
	      return {};
	    }
	  };

	  _uberproto2.default.mixin(_events.EventEmitter.prototype, app);

	  return app;
	};

	var _events = __webpack_require__(96);

	var _uberproto = __webpack_require__(83);

	var _uberproto2 = _interopRequireDefault(_uberproto);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	module.exports = exports['default'];

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(101);


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function () {
	  var base = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

	  var result = {};

	  Object.keys(transports).forEach(function (key) {
	    var Service = transports[key];

	    result[key] = function (connection) {
	      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	      if (!connection) {
	        throw new Error(key + ' has to be provided to feathers-rest');
	      }

	      var defaultService = function defaultService(name) {
	        return new Service({ base: base, name: name, connection: connection, options: options });
	      };

	      var initialize = function initialize() {
	        if (typeof this.defaultService === 'function') {
	          throw new Error('Only one default client provider can be configured');
	        }

	        this.rest = connection;
	        this.defaultService = defaultService;
	      };

	      initialize.Service = Service;
	      initialize.service = defaultService;

	      return initialize;
	    };
	  });

	  return result;
	};

	var _jquery = __webpack_require__(102);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _superagent = __webpack_require__(110);

	var _superagent2 = _interopRequireDefault(_superagent);

	var _request = __webpack_require__(111);

	var _request2 = _interopRequireDefault(_request);

	var _fetch = __webpack_require__(112);

	var _fetch2 = _interopRequireDefault(_fetch);

	var _axios = __webpack_require__(113);

	var _axios2 = _interopRequireDefault(_axios);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var transports = {
	  jquery: _jquery2.default,
	  superagent: _superagent2.default,
	  request: _request2.default,
	  fetch: _fetch2.default,
	  axios: _axios2.default
	};

	module.exports = exports['default'];

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _base = __webpack_require__(103);

	var _base2 = _interopRequireDefault(_base);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Service = function (_Base) {
	  _inherits(Service, _Base);

	  function Service() {
	    _classCallCheck(this, Service);

	    return _possibleConstructorReturn(this, (Service.__proto__ || Object.getPrototypeOf(Service)).apply(this, arguments));
	  }

	  _createClass(Service, [{
	    key: 'request',
	    value: function request(options) {
	      var _this2 = this;

	      var opts = _extends({
	        dataType: options.type || 'json'
	      }, {
	        headers: this.options.headers || {}
	      }, options);

	      if (options.body) {
	        opts.data = JSON.stringify(options.body);
	        opts.contentType = 'application/json';
	      }

	      delete opts.type;
	      delete opts.body;

	      return new Promise(function (resolve, reject) {
	        _this2.connection.ajax(opts).then(resolve, function (xhr) {
	          var error = xhr.responseText;

	          try {
	            error = JSON.parse(error);
	          } catch (e) {
	            error = new Error(xhr.responseText);
	          }

	          error.xhr = error.response = xhr;

	          reject(error);
	        });
	      });
	    }
	  }]);

	  return Service;
	}(_base2.default);

	exports.default = Service;
	module.exports = exports['default'];

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _qs = __webpack_require__(104);

	var _qs2 = _interopRequireDefault(_qs);

	var _feathersCommons = __webpack_require__(88);

	var _feathersErrors = __webpack_require__(109);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function toError(error) {
	  throw (0, _feathersErrors.convert)(error);
	}

	var Base = function () {
	  function Base(settings) {
	    _classCallCheck(this, Base);

	    this.name = (0, _feathersCommons.stripSlashes)(settings.name);
	    this.options = settings.options;
	    this.connection = settings.connection;
	    this.base = settings.base + '/' + this.name;
	  }

	  _createClass(Base, [{
	    key: 'makeUrl',
	    value: function makeUrl(params, id) {
	      params = params || {};
	      var url = this.base;

	      if (typeof id !== 'undefined' && id !== null) {
	        url += '/' + id;
	      }

	      if (Object.keys(params).length !== 0) {
	        var queryString = _qs2.default.stringify(params);

	        url += '?' + queryString;
	      }

	      return url;
	    }
	  }, {
	    key: 'find',
	    value: function find() {
	      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	      return this.request({
	        url: this.makeUrl(params.query),
	        method: 'GET',
	        headers: _extends({}, params.headers)
	      }).catch(toError);
	    }
	  }, {
	    key: 'get',
	    value: function get(id) {
	      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	      if (typeof id === 'undefined') {
	        return Promise.reject(new Error('id for \'get\' can not be undefined'));
	      }

	      return this.request({
	        url: this.makeUrl(params.query, id),
	        method: 'GET',
	        headers: _extends({}, params.headers)
	      }).catch(toError);
	    }
	  }, {
	    key: 'create',
	    value: function create(body) {
	      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	      return this.request({
	        url: this.makeUrl(params.query),
	        body: body,
	        method: 'POST',
	        headers: _extends({ 'Content-Type': 'application/json' }, params.headers)
	      }).catch(toError);
	    }
	  }, {
	    key: 'update',
	    value: function update(id, body) {
	      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	      if (typeof id === 'undefined') {
	        return Promise.reject(new Error('id for \'update\' can not be undefined, only \'null\' when updating multiple entries'));
	      }

	      return this.request({
	        url: this.makeUrl(params.query, id),
	        body: body,
	        method: 'PUT',
	        headers: _extends({ 'Content-Type': 'application/json' }, params.headers)
	      }).catch(toError);
	    }
	  }, {
	    key: 'patch',
	    value: function patch(id, body) {
	      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	      if (typeof id === 'undefined') {
	        return Promise.reject(new Error('id for \'patch\' can not be undefined, only \'null\' when updating multiple entries'));
	      }

	      return this.request({
	        url: this.makeUrl(params.query, id),
	        body: body,
	        method: 'PATCH',
	        headers: _extends({ 'Content-Type': 'application/json' }, params.headers)
	      }).catch(toError);
	    }
	  }, {
	    key: 'remove',
	    value: function remove(id) {
	      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	      if (typeof id === 'undefined') {
	        return Promise.reject(new Error('id for \'remove\' can not be undefined, only \'null\' when removing multiple entries'));
	      }

	      return this.request({
	        url: this.makeUrl(params.query, id),
	        method: 'DELETE',
	        headers: _extends({}, params.headers)
	      }).catch(toError);
	    }
	  }]);

	  return Base;
	}();

	exports.default = Base;
	module.exports = exports['default'];

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var stringify = __webpack_require__(105);
	var parse = __webpack_require__(108);
	var formats = __webpack_require__(107);

	module.exports = {
	    formats: formats,
	    parse: parse,
	    stringify: stringify
	};


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(106);
	var formats = __webpack_require__(107);

	var arrayPrefixGenerators = {
	    brackets: function brackets(prefix) { // eslint-disable-line func-name-matching
	        return prefix + '[]';
	    },
	    indices: function indices(prefix, key) { // eslint-disable-line func-name-matching
	        return prefix + '[' + key + ']';
	    },
	    repeat: function repeat(prefix) { // eslint-disable-line func-name-matching
	        return prefix;
	    }
	};

	var toISO = Date.prototype.toISOString;

	var defaults = {
	    delimiter: '&',
	    encode: true,
	    encoder: utils.encode,
	    encodeValuesOnly: false,
	    serializeDate: function serializeDate(date) { // eslint-disable-line func-name-matching
	        return toISO.call(date);
	    },
	    skipNulls: false,
	    strictNullHandling: false
	};

	var stringify = function stringify( // eslint-disable-line func-name-matching
	    object,
	    prefix,
	    generateArrayPrefix,
	    strictNullHandling,
	    skipNulls,
	    encoder,
	    filter,
	    sort,
	    allowDots,
	    serializeDate,
	    formatter,
	    encodeValuesOnly
	) {
	    var obj = object;
	    if (typeof filter === 'function') {
	        obj = filter(prefix, obj);
	    } else if (obj instanceof Date) {
	        obj = serializeDate(obj);
	    } else if (obj === null) {
	        if (strictNullHandling) {
	            return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder) : prefix;
	        }

	        obj = '';
	    }

	    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean' || utils.isBuffer(obj)) {
	        if (encoder) {
	            var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder);
	            return [formatter(keyValue) + '=' + formatter(encoder(obj, defaults.encoder))];
	        }
	        return [formatter(prefix) + '=' + formatter(String(obj))];
	    }

	    var values = [];

	    if (typeof obj === 'undefined') {
	        return values;
	    }

	    var objKeys;
	    if (Array.isArray(filter)) {
	        objKeys = filter;
	    } else {
	        var keys = Object.keys(obj);
	        objKeys = sort ? keys.sort(sort) : keys;
	    }

	    for (var i = 0; i < objKeys.length; ++i) {
	        var key = objKeys[i];

	        if (skipNulls && obj[key] === null) {
	            continue;
	        }

	        if (Array.isArray(obj)) {
	            values = values.concat(stringify(
	                obj[key],
	                generateArrayPrefix(prefix, key),
	                generateArrayPrefix,
	                strictNullHandling,
	                skipNulls,
	                encoder,
	                filter,
	                sort,
	                allowDots,
	                serializeDate,
	                formatter,
	                encodeValuesOnly
	            ));
	        } else {
	            values = values.concat(stringify(
	                obj[key],
	                prefix + (allowDots ? '.' + key : '[' + key + ']'),
	                generateArrayPrefix,
	                strictNullHandling,
	                skipNulls,
	                encoder,
	                filter,
	                sort,
	                allowDots,
	                serializeDate,
	                formatter,
	                encodeValuesOnly
	            ));
	        }
	    }

	    return values;
	};

	module.exports = function (object, opts) {
	    var obj = object;
	    var options = opts ? utils.assign({}, opts) : {};

	    if (options.encoder !== null && options.encoder !== undefined && typeof options.encoder !== 'function') {
	        throw new TypeError('Encoder has to be a function.');
	    }

	    var delimiter = typeof options.delimiter === 'undefined' ? defaults.delimiter : options.delimiter;
	    var strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults.strictNullHandling;
	    var skipNulls = typeof options.skipNulls === 'boolean' ? options.skipNulls : defaults.skipNulls;
	    var encode = typeof options.encode === 'boolean' ? options.encode : defaults.encode;
	    var encoder = typeof options.encoder === 'function' ? options.encoder : defaults.encoder;
	    var sort = typeof options.sort === 'function' ? options.sort : null;
	    var allowDots = typeof options.allowDots === 'undefined' ? false : options.allowDots;
	    var serializeDate = typeof options.serializeDate === 'function' ? options.serializeDate : defaults.serializeDate;
	    var encodeValuesOnly = typeof options.encodeValuesOnly === 'boolean' ? options.encodeValuesOnly : defaults.encodeValuesOnly;
	    if (typeof options.format === 'undefined') {
	        options.format = formats['default'];
	    } else if (!Object.prototype.hasOwnProperty.call(formats.formatters, options.format)) {
	        throw new TypeError('Unknown format option provided.');
	    }
	    var formatter = formats.formatters[options.format];
	    var objKeys;
	    var filter;

	    if (typeof options.filter === 'function') {
	        filter = options.filter;
	        obj = filter('', obj);
	    } else if (Array.isArray(options.filter)) {
	        filter = options.filter;
	        objKeys = filter;
	    }

	    var keys = [];

	    if (typeof obj !== 'object' || obj === null) {
	        return '';
	    }

	    var arrayFormat;
	    if (options.arrayFormat in arrayPrefixGenerators) {
	        arrayFormat = options.arrayFormat;
	    } else if ('indices' in options) {
	        arrayFormat = options.indices ? 'indices' : 'repeat';
	    } else {
	        arrayFormat = 'indices';
	    }

	    var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];

	    if (!objKeys) {
	        objKeys = Object.keys(obj);
	    }

	    if (sort) {
	        objKeys.sort(sort);
	    }

	    for (var i = 0; i < objKeys.length; ++i) {
	        var key = objKeys[i];

	        if (skipNulls && obj[key] === null) {
	            continue;
	        }

	        keys = keys.concat(stringify(
	            obj[key],
	            key,
	            generateArrayPrefix,
	            strictNullHandling,
	            skipNulls,
	            encode ? encoder : null,
	            filter,
	            sort,
	            allowDots,
	            serializeDate,
	            formatter,
	            encodeValuesOnly
	        ));
	    }

	    var joined = keys.join(delimiter);
	    var prefix = options.addQueryPrefix === true ? '?' : '';

	    return joined.length > 0 ? prefix + joined : '';
	};


/***/ }),
/* 106 */
/***/ (function(module, exports) {

	'use strict';

	var has = Object.prototype.hasOwnProperty;

	var hexTable = (function () {
	    var array = [];
	    for (var i = 0; i < 256; ++i) {
	        array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
	    }

	    return array;
	}());

	var compactQueue = function compactQueue(queue) {
	    var obj;

	    while (queue.length) {
	        var item = queue.pop();
	        obj = item.obj[item.prop];

	        if (Array.isArray(obj)) {
	            var compacted = [];

	            for (var j = 0; j < obj.length; ++j) {
	                if (typeof obj[j] !== 'undefined') {
	                    compacted.push(obj[j]);
	                }
	            }

	            item.obj[item.prop] = compacted;
	        }
	    }

	    return obj;
	};

	var arrayToObject = function arrayToObject(source, options) {
	    var obj = options && options.plainObjects ? Object.create(null) : {};
	    for (var i = 0; i < source.length; ++i) {
	        if (typeof source[i] !== 'undefined') {
	            obj[i] = source[i];
	        }
	    }

	    return obj;
	};

	var merge = function merge(target, source, options) {
	    if (!source) {
	        return target;
	    }

	    if (typeof source !== 'object') {
	        if (Array.isArray(target)) {
	            target.push(source);
	        } else if (typeof target === 'object') {
	            if (options.plainObjects || options.allowPrototypes || !has.call(Object.prototype, source)) {
	                target[source] = true;
	            }
	        } else {
	            return [target, source];
	        }

	        return target;
	    }

	    if (typeof target !== 'object') {
	        return [target].concat(source);
	    }

	    var mergeTarget = target;
	    if (Array.isArray(target) && !Array.isArray(source)) {
	        mergeTarget = arrayToObject(target, options);
	    }

	    if (Array.isArray(target) && Array.isArray(source)) {
	        source.forEach(function (item, i) {
	            if (has.call(target, i)) {
	                if (target[i] && typeof target[i] === 'object') {
	                    target[i] = merge(target[i], item, options);
	                } else {
	                    target.push(item);
	                }
	            } else {
	                target[i] = item;
	            }
	        });
	        return target;
	    }

	    return Object.keys(source).reduce(function (acc, key) {
	        var value = source[key];

	        if (has.call(acc, key)) {
	            acc[key] = merge(acc[key], value, options);
	        } else {
	            acc[key] = value;
	        }
	        return acc;
	    }, mergeTarget);
	};

	var assign = function assignSingleSource(target, source) {
	    return Object.keys(source).reduce(function (acc, key) {
	        acc[key] = source[key];
	        return acc;
	    }, target);
	};

	var decode = function (str) {
	    try {
	        return decodeURIComponent(str.replace(/\+/g, ' '));
	    } catch (e) {
	        return str;
	    }
	};

	var encode = function encode(str) {
	    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
	    // It has been adapted here for stricter adherence to RFC 3986
	    if (str.length === 0) {
	        return str;
	    }

	    var string = typeof str === 'string' ? str : String(str);

	    var out = '';
	    for (var i = 0; i < string.length; ++i) {
	        var c = string.charCodeAt(i);

	        if (
	            c === 0x2D // -
	            || c === 0x2E // .
	            || c === 0x5F // _
	            || c === 0x7E // ~
	            || (c >= 0x30 && c <= 0x39) // 0-9
	            || (c >= 0x41 && c <= 0x5A) // a-z
	            || (c >= 0x61 && c <= 0x7A) // A-Z
	        ) {
	            out += string.charAt(i);
	            continue;
	        }

	        if (c < 0x80) {
	            out = out + hexTable[c];
	            continue;
	        }

	        if (c < 0x800) {
	            out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);
	            continue;
	        }

	        if (c < 0xD800 || c >= 0xE000) {
	            out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);
	            continue;
	        }

	        i += 1;
	        c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));
	        out += hexTable[0xF0 | (c >> 18)]
	            + hexTable[0x80 | ((c >> 12) & 0x3F)]
	            + hexTable[0x80 | ((c >> 6) & 0x3F)]
	            + hexTable[0x80 | (c & 0x3F)];
	    }

	    return out;
	};

	var compact = function compact(value) {
	    var queue = [{ obj: { o: value }, prop: 'o' }];
	    var refs = [];

	    for (var i = 0; i < queue.length; ++i) {
	        var item = queue[i];
	        var obj = item.obj[item.prop];

	        var keys = Object.keys(obj);
	        for (var j = 0; j < keys.length; ++j) {
	            var key = keys[j];
	            var val = obj[key];
	            if (typeof val === 'object' && val !== null && refs.indexOf(val) === -1) {
	                queue.push({ obj: obj, prop: key });
	                refs.push(val);
	            }
	        }
	    }

	    return compactQueue(queue);
	};

	var isRegExp = function isRegExp(obj) {
	    return Object.prototype.toString.call(obj) === '[object RegExp]';
	};

	var isBuffer = function isBuffer(obj) {
	    if (obj === null || typeof obj === 'undefined') {
	        return false;
	    }

	    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
	};

	module.exports = {
	    arrayToObject: arrayToObject,
	    assign: assign,
	    compact: compact,
	    decode: decode,
	    encode: encode,
	    isBuffer: isBuffer,
	    isRegExp: isRegExp,
	    merge: merge
	};


/***/ }),
/* 107 */
/***/ (function(module, exports) {

	'use strict';

	var replace = String.prototype.replace;
	var percentTwenties = /%20/g;

	module.exports = {
	    'default': 'RFC3986',
	    formatters: {
	        RFC1738: function (value) {
	            return replace.call(value, percentTwenties, '+');
	        },
	        RFC3986: function (value) {
	            return value;
	        }
	    },
	    RFC1738: 'RFC1738',
	    RFC3986: 'RFC3986'
	};


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(106);

	var has = Object.prototype.hasOwnProperty;

	var defaults = {
	    allowDots: false,
	    allowPrototypes: false,
	    arrayLimit: 20,
	    decoder: utils.decode,
	    delimiter: '&',
	    depth: 5,
	    parameterLimit: 1000,
	    plainObjects: false,
	    strictNullHandling: false
	};

	var parseValues = function parseQueryStringValues(str, options) {
	    var obj = {};
	    var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, '') : str;
	    var limit = options.parameterLimit === Infinity ? undefined : options.parameterLimit;
	    var parts = cleanStr.split(options.delimiter, limit);

	    for (var i = 0; i < parts.length; ++i) {
	        var part = parts[i];

	        var bracketEqualsPos = part.indexOf(']=');
	        var pos = bracketEqualsPos === -1 ? part.indexOf('=') : bracketEqualsPos + 1;

	        var key, val;
	        if (pos === -1) {
	            key = options.decoder(part, defaults.decoder);
	            val = options.strictNullHandling ? null : '';
	        } else {
	            key = options.decoder(part.slice(0, pos), defaults.decoder);
	            val = options.decoder(part.slice(pos + 1), defaults.decoder);
	        }
	        if (has.call(obj, key)) {
	            obj[key] = [].concat(obj[key]).concat(val);
	        } else {
	            obj[key] = val;
	        }
	    }

	    return obj;
	};

	var parseObject = function (chain, val, options) {
	    var leaf = val;

	    for (var i = chain.length - 1; i >= 0; --i) {
	        var obj;
	        var root = chain[i];

	        if (root === '[]') {
	            obj = [];
	            obj = obj.concat(leaf);
	        } else {
	            obj = options.plainObjects ? Object.create(null) : {};
	            var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
	            var index = parseInt(cleanRoot, 10);
	            if (
	                !isNaN(index)
	                && root !== cleanRoot
	                && String(index) === cleanRoot
	                && index >= 0
	                && (options.parseArrays && index <= options.arrayLimit)
	            ) {
	                obj = [];
	                obj[index] = leaf;
	            } else {
	                obj[cleanRoot] = leaf;
	            }
	        }

	        leaf = obj;
	    }

	    return leaf;
	};

	var parseKeys = function parseQueryStringKeys(givenKey, val, options) {
	    if (!givenKey) {
	        return;
	    }

	    // Transform dot notation to bracket notation
	    var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey;

	    // The regex chunks

	    var brackets = /(\[[^[\]]*])/;
	    var child = /(\[[^[\]]*])/g;

	    // Get the parent

	    var segment = brackets.exec(key);
	    var parent = segment ? key.slice(0, segment.index) : key;

	    // Stash the parent if it exists

	    var keys = [];
	    if (parent) {
	        // If we aren't using plain objects, optionally prefix keys
	        // that would overwrite object prototype properties
	        if (!options.plainObjects && has.call(Object.prototype, parent)) {
	            if (!options.allowPrototypes) {
	                return;
	            }
	        }

	        keys.push(parent);
	    }

	    // Loop through children appending to the array until we hit depth

	    var i = 0;
	    while ((segment = child.exec(key)) !== null && i < options.depth) {
	        i += 1;
	        if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
	            if (!options.allowPrototypes) {
	                return;
	            }
	        }
	        keys.push(segment[1]);
	    }

	    // If there's a remainder, just add whatever is left

	    if (segment) {
	        keys.push('[' + key.slice(segment.index) + ']');
	    }

	    return parseObject(keys, val, options);
	};

	module.exports = function (str, opts) {
	    var options = opts ? utils.assign({}, opts) : {};

	    if (options.decoder !== null && options.decoder !== undefined && typeof options.decoder !== 'function') {
	        throw new TypeError('Decoder has to be a function.');
	    }

	    options.ignoreQueryPrefix = options.ignoreQueryPrefix === true;
	    options.delimiter = typeof options.delimiter === 'string' || utils.isRegExp(options.delimiter) ? options.delimiter : defaults.delimiter;
	    options.depth = typeof options.depth === 'number' ? options.depth : defaults.depth;
	    options.arrayLimit = typeof options.arrayLimit === 'number' ? options.arrayLimit : defaults.arrayLimit;
	    options.parseArrays = options.parseArrays !== false;
	    options.decoder = typeof options.decoder === 'function' ? options.decoder : defaults.decoder;
	    options.allowDots = typeof options.allowDots === 'boolean' ? options.allowDots : defaults.allowDots;
	    options.plainObjects = typeof options.plainObjects === 'boolean' ? options.plainObjects : defaults.plainObjects;
	    options.allowPrototypes = typeof options.allowPrototypes === 'boolean' ? options.allowPrototypes : defaults.allowPrototypes;
	    options.parameterLimit = typeof options.parameterLimit === 'number' ? options.parameterLimit : defaults.parameterLimit;
	    options.strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults.strictNullHandling;

	    if (str === '' || str === null || typeof str === 'undefined') {
	        return options.plainObjects ? Object.create(null) : {};
	    }

	    var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
	    var obj = options.plainObjects ? Object.create(null) : {};

	    // Iterate over the keys and setup the new object

	    var keys = Object.keys(tempObj);
	    for (var i = 0; i < keys.length; ++i) {
	        var key = keys[i];
	        var newObj = parseKeys(key, tempObj[key], options);
	        obj = utils.merge(obj, newObj, options);
	    }

	    return utils.compact(obj);
	};


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var debug = __webpack_require__(23)('feathers-errors');

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
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _base = __webpack_require__(103);

	var _base2 = _interopRequireDefault(_base);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Service = function (_Base) {
	  _inherits(Service, _Base);

	  function Service() {
	    _classCallCheck(this, Service);

	    return _possibleConstructorReturn(this, (Service.__proto__ || Object.getPrototypeOf(Service)).apply(this, arguments));
	  }

	  _createClass(Service, [{
	    key: 'request',
	    value: function request(options) {
	      var superagent = this.connection(options.method, options.url).set(this.options.headers || {}).set('Accept', 'application/json').set(options.headers || {}).type(options.type || 'json');

	      return new Promise(function (resolve, reject) {
	        superagent.set(options.headers);

	        if (options.body) {
	          superagent.send(options.body);
	        }

	        superagent.end(function (error, res) {
	          if (error) {
	            try {
	              var response = error.response;
	              error = JSON.parse(error.response.text);
	              error.response = response;
	            } catch (e) {}

	            return reject(error);
	          }

	          resolve(res && res.body);
	        });
	      });
	    }
	  }]);

	  return Service;
	}(_base2.default);

	exports.default = Service;
	module.exports = exports['default'];

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _base = __webpack_require__(103);

	var _base2 = _interopRequireDefault(_base);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Service = function (_Base) {
	  _inherits(Service, _Base);

	  function Service() {
	    _classCallCheck(this, Service);

	    return _possibleConstructorReturn(this, (Service.__proto__ || Object.getPrototypeOf(Service)).apply(this, arguments));
	  }

	  _createClass(Service, [{
	    key: 'request',
	    value: function request(options) {
	      var _this2 = this;

	      return new Promise(function (resolve, reject) {
	        _this2.connection(_extends({
	          json: true
	        }, options), function (error, res, data) {
	          if (error) {
	            return reject(error);
	          }

	          if (!error && res.statusCode >= 400) {
	            if (typeof data === 'string') {
	              return reject(new Error(data));
	            }

	            data.response = res;

	            return reject(_extends(new Error(data.message), data));
	          }

	          resolve(data);
	        });
	      });
	    }
	  }]);

	  return Service;
	}(_base2.default);

	exports.default = Service;
	module.exports = exports['default'];

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _base = __webpack_require__(103);

	var _base2 = _interopRequireDefault(_base);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Service = function (_Base) {
	  _inherits(Service, _Base);

	  function Service() {
	    _classCallCheck(this, Service);

	    return _possibleConstructorReturn(this, (Service.__proto__ || Object.getPrototypeOf(Service)).apply(this, arguments));
	  }

	  _createClass(Service, [{
	    key: 'request',
	    value: function request(options) {
	      var fetchOptions = _extends({}, options);

	      fetchOptions.headers = _extends({
	        Accept: 'application/json'
	      }, this.options.headers, fetchOptions.headers);

	      if (options.body) {
	        fetchOptions.body = JSON.stringify(options.body);
	      }

	      var fetch = this.connection;

	      return fetch(options.url, fetchOptions).then(this.checkStatus).then(function (response) {
	        if (response.status === 204) {
	          return null;
	        }

	        return response.json();
	      });
	    }
	  }, {
	    key: 'checkStatus',
	    value: function checkStatus(response) {
	      if (response.ok) {
	        return response;
	      }

	      return response.json().then(function (error) {
	        error.response = response;
	        throw error;
	      });
	    }
	  }]);

	  return Service;
	}(_base2.default);

	exports.default = Service;
	module.exports = exports['default'];

/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _base = __webpack_require__(103);

	var _base2 = _interopRequireDefault(_base);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Service = function (_Base) {
	  _inherits(Service, _Base);

	  function Service() {
	    _classCallCheck(this, Service);

	    return _possibleConstructorReturn(this, (Service.__proto__ || Object.getPrototypeOf(Service)).apply(this, arguments));
	  }

	  _createClass(Service, [{
	    key: 'request',
	    value: function request(options) {
	      var config = {
	        url: options.url,
	        method: options.method,
	        data: options.body,
	        headers: _extends({
	          Accept: 'application/json'
	        }, this.options.headers, options.headers)
	      };

	      return this.connection.request(config).then(function (res) {
	        return res.data;
	      }).catch(function (error) {
	        var response = error.response || error;

	        throw response instanceof Error ? response : response.data || response;
	      });
	    }
	  }]);

	  return Service;
	}(_base2.default);

	exports.default = Service;
	module.exports = exports['default'];

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(115);


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports.default = function (connection, options) {
	  if (!connection) {
	    throw new Error('Socket.io connection needs to be provided');
	  }

	  var defaultService = function defaultService(name) {
	    var settings = _extends({}, options, {
	      name: name,
	      connection: connection,
	      method: 'emit'
	    });

	    return new _client2.default(settings);
	  };

	  var initialize = function initialize() {
	    if (typeof this.defaultService === 'function') {
	      throw new Error('Only one default client provider can be configured');
	    }

	    this.io = connection;
	    this.defaultService = defaultService;
	  };

	  initialize.Service = _client2.default;
	  initialize.service = defaultService;

	  return initialize;
	};

	var _client = __webpack_require__(116);

	var _client2 = _interopRequireDefault(_client);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	module.exports = exports['default'];

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(117);


/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _utils = __webpack_require__(118);

	var _feathersErrors = __webpack_require__(109);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var debug = __webpack_require__(119)('feathers-socket-commons:client');
	var namespacedEmitterMethods = ['addListener', 'emit', 'listenerCount', 'listeners', 'on', 'once', 'prependListener', 'prependOnceListener', 'removeAllListeners', 'removeListener'];
	var otherEmitterMethods = ['eventNames', 'getMaxListeners', 'setMaxListeners'];

	var addEmitterMethods = function addEmitterMethods(service) {
	  otherEmitterMethods.forEach(function (method) {
	    service[method] = function () {
	      var _connection;

	      if (typeof this.connection[method] !== 'function') {
	        throw new Error('Can not call \'' + method + '\' on the client service connection.');
	      }

	      return (_connection = this.connection)[method].apply(_connection, arguments);
	    };
	  });

	  namespacedEmitterMethods.forEach(function (method) {
	    service[method] = function (name) {
	      var _connection2;

	      if (typeof this.connection[method] !== 'function') {
	        throw new Error('Can not call \'' + method + '\' on the client service connection.');
	      }

	      var eventName = this.path + ' ' + name;

	      debug('Calling emitter method ' + method + ' with ' + ('namespaced event \'' + eventName + '\''));

	      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	      }

	      var result = (_connection2 = this.connection)[method].apply(_connection2, [eventName].concat(args));

	      return result === this.connection ? this : result;
	    };
	  });
	};

	var Service = function () {
	  function Service(options) {
	    _classCallCheck(this, Service);

	    this.events = _utils.events;
	    this.path = options.name;
	    this.connection = options.connection;
	    this.method = options.method;
	    this.timeout = options.timeout || 5000;

	    addEmitterMethods(this);
	  }

	  _createClass(Service, [{
	    key: 'send',
	    value: function send(method) {
	      var _this = this;

	      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	        args[_key2 - 1] = arguments[_key2];
	      }

	      var callback = null;
	      if (typeof args[args.length - 1] === 'function') {
	        callback = args.pop();
	      }

	      return new Promise(function (resolve, reject) {
	        var _connection3;

	        var event = _this.path + '::' + method;
	        var timeoutId = setTimeout(function () {
	          return reject(new Error('Timeout of ' + _this.timeout + 'ms exceeded calling ' + event));
	        }, _this.timeout);

	        args.unshift(event);
	        args.push(function (error, data) {
	          error = (0, _feathersErrors.convert)(error);
	          clearTimeout(timeoutId);

	          if (callback) {
	            callback(error, data);
	          }

	          return error ? reject(error) : resolve(data);
	        });

	        debug('Sending socket.' + _this.method, args);

	        (_connection3 = _this.connection)[_this.method].apply(_connection3, args);
	      });
	    }
	  }, {
	    key: 'find',
	    value: function find() {
	      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	      return this.send('find', params.query || {});
	    }
	  }, {
	    key: 'get',
	    value: function get(id) {
	      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	      return this.send('get', id, params.query || {});
	    }
	  }, {
	    key: 'create',
	    value: function create(data) {
	      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	      return this.send('create', data, params.query || {});
	    }
	  }, {
	    key: 'update',
	    value: function update(id, data) {
	      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	      return this.send('update', id, data, params.query || {});
	    }
	  }, {
	    key: 'patch',
	    value: function patch(id, data) {
	      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	      return this.send('patch', id, data, params.query || {});
	    }
	  }, {
	    key: 'remove',
	    value: function remove(id) {
	      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	      return this.send('remove', id, params.query || {});
	    }
	  }, {
	    key: 'off',
	    value: function off(name) {
	      for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
	        args[_key3 - 1] = arguments[_key3];
	      }

	      if (typeof this.connection.off === 'function') {
	        var _connection4;

	        return (_connection4 = this.connection).off.apply(_connection4, [this.path + ' ' + name].concat(args));
	      } else if (args.length === 0) {
	        return this.removeAllListeners(name);
	      }

	      return this.removeListener.apply(this, [name].concat(args));
	    }
	  }]);

	  return Service;
	}();

	exports.default = Service;
	module.exports = exports['default'];

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.events = exports.eventMappings = undefined;
	exports.convertFilterData = convertFilterData;
	exports.promisify = promisify;
	exports.normalizeError = normalizeError;
	exports.normalizeArgs = normalizeArgs;

	var _feathersCommons = __webpack_require__(88);

	var eventMappings = exports.eventMappings = {
	  create: 'created',
	  update: 'updated',
	  patch: 'patched',
	  remove: 'removed'
	};

	var events = exports.events = Object.keys(eventMappings).map(function (method) {
	  return eventMappings[method];
	});

	function convertFilterData(obj) {
	  return _feathersCommons.hooks.convertHookData(obj);
	}

	function promisify(method, context) {
	  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	    args[_key - 2] = arguments[_key];
	  }

	  return new Promise(function (resolve, reject) {
	    method.apply(context, args.concat(function (error, result) {
	      if (error) {
	        return reject(error);
	      }

	      resolve(result);
	    }));
	  });
	}

	function normalizeError(e) {
	  var result = {};

	  Object.getOwnPropertyNames(e).forEach(function (key) {
	    return result[key] = e[key];
	  });

	  if (process.env.NODE_ENV === 'production') {
	    delete result.stack;
	  }

	  delete result.hook;

	  return result;
	}

	function normalizeArgs(args) {
	  var ret = [];
	  if (args.length === 2 && Array.isArray(args['0'])) {
	    ret = args[0];
	    ret.push(args[1]);
	    return ret;
	  }
	  return args;
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * This is the web browser implementation of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = __webpack_require__(120);
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

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))

/***/ }),
/* 120 */
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
	exports.humanize = __webpack_require__(121);

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
/* 121 */
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
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(123);


/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (connection, options) {
	  if (!connection) {
	    throw new Error('Primus connection needs to be provided');
	  }

	  var defaultService = function defaultService(name) {
	    return new _client2.default(Object.assign({}, options, {
	      name: name,
	      connection: connection,
	      method: 'send'
	    }));
	  };

	  var initialize = function initialize() {
	    if (typeof this.defaultService === 'function') {
	      throw new Error('Only one default client provider can be configured');
	    }

	    this.primus = connection;
	    this.defaultService = defaultService;
	  };

	  initialize.Service = _client2.default;
	  initialize.service = defaultService;

	  return initialize;
	};

	var _client = __webpack_require__(116);

	var _client2 = _interopRequireDefault(_client);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	module.exports = exports['default'];

/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _uberproto = __webpack_require__(83);

	var _uberproto2 = _interopRequireDefault(_uberproto);

	var _feathersCommons = __webpack_require__(88);

	var _populate = __webpack_require__(125);

	var _bundled = __webpack_require__(127);

	var _commons = __webpack_require__(128);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function isPromise(result) {
	  return typeof result !== 'undefined' && typeof result.then === 'function';
	}

	function hookMixin(service) {
	  var app = this;
	  var methods = app.methods;
	  var old = {
	    before: service.before,
	    after: service.after
	  };
	  var mixin = (0, _commons.baseMixin)(methods, {
	    before: function before(_before) {
	      return this.hooks({ before: _before });
	    },
	    after: function after(_after) {
	      return this.hooks({ after: _after });
	    }
	  });

	  (0, _commons.addHookTypes)(service);

	  methods.forEach(function (method) {
	    if (typeof service[method] !== 'function') {
	      return;
	    }

	    mixin[method] = function () {
	      var _this = this;

	      var service = this;
	      // A reference to the original method
	      var _super = this._super.bind(this);
	      // Additional data to add to the hook object
	      var hookData = {
	        app: app,
	        service: service,
	        get path() {
	          return Object.keys(app.services).find(function (path) {
	            return app.services[path] === service;
	          });
	        }
	      };
	      // Create the hook object that gets passed through
	      var hookObject = _feathersCommons.hooks.hookObject(method, 'before', arguments, hookData);
	      // Get all hooks
	      var hooks = {
	        // For before hooks the app hooks will run first
	        before: (0, _commons.getHooks)(app, this, 'before', method),
	        // For after and error hooks the app hooks will run last
	        after: (0, _commons.getHooks)(app, this, 'after', method, true),
	        error: (0, _commons.getHooks)(app, this, 'error', method, true)
	      };

	      // Process all before hooks
	      return _commons.processHooks.call(this, hooks.before, hookObject)
	      // Use the hook object to call the original method
	      .then(function (hookObject) {
	        if (typeof hookObject.result !== 'undefined') {
	          return Promise.resolve(hookObject);
	        }

	        return new Promise(function (resolve, reject) {
	          var args = _feathersCommons.hooks.makeArguments(hookObject);
	          // The method may not be normalized yet so we have to handle both
	          // ways, either by callback or by Promise
	          var callback = function callback(error, result) {
	            if (error) {
	              reject(error);
	            } else {
	              hookObject.result = result;
	              resolve(hookObject);
	            }
	          };

	          // We replace the callback with resolving the promise
	          args.splice(args.length - 1, 1, callback);

	          var result = _super.apply(undefined, _toConsumableArray(args));

	          if (isPromise(result)) {
	            result.then(function (data) {
	              return callback(null, data);
	            }, callback);
	          }
	        });
	      })
	      // Make a copy of hookObject from `before` hooks and update type
	      .then(function (hookObject) {
	        return Object.assign({}, hookObject, { type: 'after' });
	      })
	      // Run through all `after` hooks
	      .then(_commons.processHooks.bind(this, hooks.after))
	      // Finally, return the result
	      .then(function (hookObject) {
	        return hookObject.result;
	      })
	      // Handle errors
	      .catch(function (error) {
	        var errorHook = Object.assign({}, error.hook || hookObject, {
	          type: 'error',
	          original: error.hook,
	          error: error
	        });

	        return _commons.processHooks.call(_this, hooks.error, errorHook).then(function (hook) {
	          return Promise.reject(hook.error);
	        });
	      });
	    };
	  });

	  service.mixin(mixin);

	  // Before hooks that were registered in the service
	  if (old.before) {
	    service.before(old.before);
	  }

	  // After hooks that were registered in the service
	  if (old.after) {
	    service.after(old.after);
	  }
	}

	function configure() {
	  return function () {
	    var app = this;

	    (0, _commons.addHookTypes)(app);

	    _uberproto2.default.mixin((0, _commons.baseMixin)(app.methods), app);

	    this.mixins.unshift(hookMixin);
	  };
	}

	configure.removeQuery = _bundled.removeQuery;
	configure.pluckQuery = _bundled.pluckQuery;
	configure.lowerCase = _bundled.lowerCase;
	configure.remove = _bundled.remove;
	configure.pluck = _bundled.pluck;
	configure.disable = _bundled.disable;
	configure.populate = _populate.populate;
	configure.removeField = _bundled.removeField;

	exports.default = configure;
	module.exports = exports['default'];

/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.populate = undefined;

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _feathersErrors = __webpack_require__(109);

	var _feathersErrors2 = _interopRequireDefault(_feathersErrors);

	var _utils = __webpack_require__(126);

	var _bundled = __webpack_require__(127);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var populate = exports.populate = function populate(options) {
	  for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    rest[_key - 1] = arguments[_key];
	  }

	  if (typeof options === 'string') {
	    return _bundled.legacyPopulate.apply(undefined, [options].concat(rest));
	  }

	  return function (hook) {
	    var optionsDefault = {
	      schema: {},
	      checkPermissions: function checkPermissions() {
	        return true;
	      },
	      profile: false
	    };

	    if (hook.params._populate === 'skip') {
	      // this service call made from another populate
	      return hook;
	    }

	    return Promise.resolve().then(function () {
	      // 'options.schema' resolves to { permissions: '...', include: [ ... ] }

	      var items = (0, _utils.getItems)(hook);
	      var options1 = Object.assign({}, optionsDefault, options);
	      var schema = options1.schema,
	          checkPermissions = options1.checkPermissions;

	      var schema1 = typeof schema === 'function' ? schema(hook, options1) : schema;
	      var permissions = schema1.permissions || null;

	      if (typeof checkPermissions !== 'function') {
	        throw new _feathersErrors2.default.BadRequest('Permissions param is not a function. (populate)');
	      }

	      if (permissions && !checkPermissions(hook, hook.path, permissions, 0)) {
	        throw new _feathersErrors2.default.BadRequest('Permissions do not allow this populate. (populate)');
	      }

	      if ((typeof schema1 === 'undefined' ? 'undefined' : _typeof(schema1)) !== 'object') {
	        throw new _feathersErrors2.default.BadRequest('Schema does not resolve to an object. (populate)');
	      }

	      return !schema1.include || !Object.keys(schema1.include).length ? items : populateItemArray(options1, hook, items, schema1.include, 0);
	    }).then(function (items) {
	      (0, _utils.replaceItems)(hook, items);
	      return hook;
	    });
	  };
	};

	function populateItemArray(options, hook, items, includeSchema, depth) {
	  // 'items' is an item or an array of items
	  // 'includeSchema' is like [ { nameAs: 'author', ... }, { nameAs: 'readers', ... } ]

	  if (!Array.isArray(items)) {
	    return populateItem(options, hook, items, includeSchema, depth + 1);
	  }

	  return Promise.all(items.map(function (item) {
	    return populateItem(options, hook, item, includeSchema, depth + 1);
	  }));
	}

	function populateItem(options, hook, item, includeSchema, depth) {
	  // 'item' is one item
	  // 'includeSchema' is like [ { nameAs: 'author', ... }, { nameAs: 'readers', ... } ]

	  var elapsed = {};
	  var startAtAllIncludes = process.hrtime();
	  item._include = [];

	  return Promise.all(includeSchema.map(function (childSchema) {
	    var startAtThisInclude = process.hrtime();
	    return populateAddChild(options, hook, item, childSchema, depth).then(function (result) {
	      var nameAs = childSchema.nameAs || childSchema.service;
	      elapsed[nameAs] = getElapsed(options, startAtThisInclude, depth);

	      return result;
	    });
	  })).then(function (children) {
	    // 'children' is like [{ authorInfo: {...}, readersInfo: [{...}, {...}] }]
	    if (options.profile !== false) {
	      elapsed.total = getElapsed(options, startAtAllIncludes, depth);
	      item._elapsed = elapsed;
	    }

	    return Object.assign.apply(Object, [item].concat(_toConsumableArray(children)));
	  });
	}

	function populateAddChild(options, hook, parentItem, childSchema, depth) {
	  /*
	  'parentItem' is the item we are adding children to
	  'childSchema' is like
	    { service: 'comments',
	      permissions: '...',
	      nameAs: 'comments',
	      asArray: true,
	      parentField: 'id',
	      childField: 'postId',
	      query: { $limit: 5, $select: ['title', 'content', 'postId'], $sort: { createdAt: -1 } },
	      select: (hook, parent, depth) => ({ something: { $exists: false }}),
	      include: [ ... ],
	    }
	  */

	  // note: parentField & childField are req'd, plus parentItem[parentField} !== undefined .
	  // childSchema.select may override their relationship but some relationship must be given.
	  if (!childSchema.service || !childSchema.parentField || !childSchema.childField) {
	    throw new _feathersErrors2.default.BadRequest('Child schema is missing a required property. (populate)');
	  }

	  if (childSchema.permissions && !options.checkPermissions(hook, childSchema.service, childSchema.permissions, depth)) {
	    throw new _feathersErrors2.default.BadRequest('Permissions for ' + childSchema.service + ' do not allow include. (populate)');
	  }

	  var nameAs = childSchema.nameAs || childSchema.service;
	  parentItem._include.push(nameAs);

	  var promise = Promise.resolve().then(function () {
	    return childSchema.select ? childSchema.select(hook, parentItem, depth) : {};
	  }).then(function (selectQuery) {
	    var parentVal = (0, _utils.getByDot)(parentItem, childSchema.parentField);

	    if (parentVal === undefined) {
	      throw new _feathersErrors2.default.BadRequest('ParentField ' + childSchema.parentField + ' for ' + nameAs + ' depth ' + depth + ' is undefined. (populate)');
	    }

	    var query = Object.assign({}, childSchema.query, _defineProperty({}, childSchema.childField, Array.isArray(parentVal) ? { $in: parentVal } : parentVal), selectQuery // dynamic options override static ones
	    );

	    var serviceHandle = hook.app.service(childSchema.service);

	    if (!serviceHandle) {
	      throw new _feathersErrors2.default.BadRequest('Service ' + childSchema.service + ' is not configured. (populate)');
	    }

	    return serviceHandle.find({ query: query, _populate: 'skip' });
	  }).then(function (result) {
	    result = result.data || result;

	    if (result.length === 1 && !childSchema.asArray) {
	      result = result[0];
	    }

	    return result;
	  });

	  if (childSchema.include) {
	    promise = promise.then(function (items) {
	      return populateItemArray(options, hook, items, childSchema.include, depth);
	    });
	  }

	  return promise.then(function (items) {
	    return _defineProperty({}, nameAs, items);
	  });
	}

	// Helpers

	function getElapsed(options, startHrtime, depth) {
	  if (options.profile === true) {
	    var elapsed = process.hrtime(startHrtime);
	    return elapsed[0] * 1e9 + elapsed[1];
	  } else if (options.profile !== false) {
	    return depth; // for testing _elapsed
	  }
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))

/***/ }),
/* 126 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	/* eslint no-param-reassign: 0 */

	/**
	 * Get a value from an object using dot notation, e.g. employee.address.city
	 *
	 * @param {Object} obj - The object containing the value
	 * @param {string} path - The path to the value, e.g. employee.address.city
	 * @returns {*} The value, or undefined if the path does not exist
	 *
	 * There is no way to differentiate between non-existent paths and a value of undefined
	 */
	var getByDot = exports.getByDot = function getByDot(obj, path) {
	  if (path.indexOf('.') === -1) {
	    return obj[path];
	  }

	  return path.split('.').reduce(function (obj1, part) {
	    return (typeof obj1 === 'undefined' ? 'undefined' : _typeof(obj1)) === 'object' ? obj1[part] : undefined;
	  }, obj);
	};

	/**
	 * Set a value in an object using dot notation, e.g. employee.address.city.
	 *
	 * @param {Object} obj - The object
	 * @param {string} path - The path where to place the value, e.g. employee.address.city
	 * @param {*} value - The value.
	 * @param {boolean} ifDelete - Delete the prop at path if value is undefined.
	 * @returns {Object} The modified object.
	 *
	 * To delete a prop, set value = undefined and ifDelete = true. Note that
	 * new empty inner objects will still be created,
	 * e.g. setByDot({}, 'a.b.c', undefined, true) will return {a: b: {} }
	 */
	var setByDot = exports.setByDot = function setByDot(obj, path, value, ifDelete) {
	  if (path.indexOf('.') === -1) {
	    obj[path] = value;

	    if (value === undefined && ifDelete) {
	      delete obj[path];
	    }

	    return;
	  }

	  var parts = path.split('.');
	  var lastIndex = parts.length - 1;
	  return parts.reduce(function (obj1, part, i) {
	    if (i !== lastIndex) {
	      if (!obj1.hasOwnProperty(part) || _typeof(obj1[part]) !== 'object') {
	        obj1[part] = {};
	      }
	      return obj1[part];
	    }

	    obj1[part] = value;
	    if (value === undefined && ifDelete) {
	      delete obj1[part];
	    }
	    return obj1;
	  }, obj);
	};

	/**
	 * Restrict the calling hook to a hook type (before, after) and a set of
	 * hook methods (find, get, create, update, patch, remove).
	 *
	 * @param {object} hook object
	 * @param {string|null} type permitted. 'before', 'after' or null for either.
	 * @param {array|string} methods permitted. find, get, create, update, patch, remove or null for any
	 * @param {string} label identifying hook in error messages. optional.
	 *
	 * Example:
	 * const checkContext = require('feathers-hooks-common/utils').checkContext;
	 *
	 * const includeCreatedAtHook = (options) => {
	 *   const fieldName = (options && options.as) ? options.as : 'createdAt';
	 *   return (hook) => {
	 *     checkContext(hook, 'before', 'create', 'includeCreatedAtHook');
	 *     hook.data[fieldName] = new Date());
	 *   };
	 * },
	 *
	 * Examples:
	 * checkContext(hook, 'before', ['update', 'patch'], 'hookName');
	 * checkContext(hook, null, ['update', 'patch']);
	 * checkContext(hook, 'before', null, 'hookName');
	 * checkContext(hook, 'before');
	 */

	var checkContext = exports.checkContext = function checkContext(hook) {
	  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
	  var methods = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
	  var label = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'anonymous';

	  if (type && hook.type !== type) {
	    throw new Error('The \'' + label + '\' hook can only be used as a \'' + type + '\' hook.');
	  }

	  if (!methods) {
	    return;
	  }

	  var myMethods = Array.isArray(methods) ? methods : [methods]; // safe enough for allowed values

	  if (myMethods.length > 0 && myMethods.indexOf(hook.method) === -1) {
	    var msg = JSON.stringify(myMethods);
	    throw new Error('The \'' + label + '\' hook can only be used on the \'' + msg + '\' service method(s).');
	  }
	};

	/**
	 * Return the data items in a hook.
	 * hook.data if type=before.
	 * hook.result.data if type=after, method=find with pagination.
	 * hook.result otherwise if type=after.
	 *
	 * @param {Object} hook - The hook.
	 * @returns {Object|Array.<Object>} The data item or array of data items
	 */
	var getItems = exports.getItems = function getItems(hook) {
	  var items = hook.type === 'before' ? hook.data : hook.result;
	  return items && hook.method === 'find' ? items.data || items : items;
	};

	/**
	 * Replace the data items in a hook. Companion to getItems.
	 *
	 * @param {Object} hook - The hook.
	 * @param {Object|Array.<Object>} items - The data item or array of data items
	 *
	 * If you update an after find paginated hook with an item rather than an array of items,
	 * the hook will have an array consisting of that one item.
	 */
	var replaceItems = exports.replaceItems = function replaceItems(hook, items) {
	  if (hook.type === 'before') {
	    hook.data = items;
	  } else if (hook.method === 'find' && hook.result && hook.result.data) {
	    if (Array.isArray(items)) {
	      hook.result.data = items;
	      hook.result.total = items.length;
	    } else {
	      hook.result.data = [items];
	      hook.result.total = 1;
	    }
	  } else {
	    hook.result = items;
	  }
	};

/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.lowerCase = lowerCase;
	exports.removeQuery = removeQuery;
	exports.pluckQuery = pluckQuery;
	exports.remove = remove;
	exports.pluck = pluck;
	exports.disable = disable;
	exports.legacyPopulate = legacyPopulate;

	var _utils = __webpack_require__(126);

	/* eslint-env es6, node */
	/* eslint brace-style: 0, consistent-return: 0, no-console: 0, no-param-reassign: 0, no-var: 0 */

	var errors = __webpack_require__(109).errors;


	/**
	 * Lowercase the given fields either in the data submitted (as a before hook for create,
	 * update or patch) or in the result (as an after hook). If the data is an array or
	 * a paginated find result the hook will lowercase the field for every item.
	 *
	 * @param {Array.<string|Function>} fields - Field names to lowercase. Dot notation is supported.
	 * @returns {Function} hook function(hook).
	 *
	 * DEPRECATED: The last param may be a function to determine if the current hook should be updated.
	 * Its signature is func(hook) and it returns either a boolean or a promise resolving to a boolean.
	 * This boolean determines if the hook is updated.
	 *
	 * hooks.lowerCase('group', hook => hook.data.status === 1);
	 * hooks.lowerCase('group', hook => new Promise(resolve => {
	 *   setTimeout(() => { resolve(true); }, 100)
	 * }));
	 *
	 */
	function lowerCase() {
	  for (var _len = arguments.length, fields = Array(_len), _key = 0; _key < _len; _key++) {
	    fields[_key] = arguments[_key];
	  }

	  var lowerCaseFields = function lowerCaseFields(data) {
	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;

	    try {
	      for (var _iterator = fields[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	        var field = _step.value;

	        var value = (0, _utils.getByDot)(data, field);

	        if (value !== undefined) {
	          if (typeof value !== 'string' && value !== null) {
	            throw new errors.BadRequest('Expected string data. (lowercase ' + field + ')');
	          }

	          (0, _utils.setByDot)(data, field, value ? value.toLowerCase() : value);
	        }
	      }
	    } catch (err) {
	      _didIteratorError = true;
	      _iteratorError = err;
	    } finally {
	      try {
	        if (!_iteratorNormalCompletion && _iterator.return) {
	          _iterator.return();
	        }
	      } finally {
	        if (_didIteratorError) {
	          throw _iteratorError;
	        }
	      }
	    }
	  };

	  var callback = function callback() {
	    return true;
	  };
	  if (typeof fields[fields.length - 1] === 'function') {
	    callback = fields.pop();
	    console.error('DEPRECATED Predicate func will be removed next version. (lowerCase)');
	  }

	  return function (hook) {
	    var items = hook.type === 'before' ? hook.data : hook.result;

	    var update = function update(condition) {
	      if (items && condition) {
	        if (hook.method === 'find' || Array.isArray(items)) {
	          // data.data if the find method is paginated
	          (items.data || items).forEach(lowerCaseFields);
	        } else {
	          lowerCaseFields(items);
	        }
	      }
	      return hook;
	    };

	    var check = callback(hook);

	    return check && typeof check.then === 'function' ? check.then(update) : update(check);
	  };
	}

	/**
	 * Remove the given fields from the query params.
	 * Can be used as a before hook for any service method.
	 *
	 * @param {Array.<string|Function>} fields - Field names to remove. Dot notation is supported.
	 * @returns {Function} hook function(hook)
	 *
	 * DEPRECATED: The last param may be a function to determine if the current hook should be updated.
	 * Its signature is func(hook) and it returns either a boolean or a promise resolving to a boolean.
	 * This boolean determines if the hook is updated.
	 *
	 * hooks.lowerCase('group', hook => hook.data.status === 1);
	 * hooks.lowerCase('group', hook => new Promise(resolve => {
	 *   setTimeout(() => { resolve(true); }, 100)
	 * }));
	 */
	function removeQuery() {
	  for (var _len2 = arguments.length, fields = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	    fields[_key2] = arguments[_key2];
	  }

	  var removeQueries = function removeQueries(data) {
	    var _iteratorNormalCompletion2 = true;
	    var _didIteratorError2 = false;
	    var _iteratorError2 = undefined;

	    try {
	      for (var _iterator2 = fields[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	        var field = _step2.value;

	        var value = (0, _utils.getByDot)(data, field); // prevent setByDot creating nested empty objects
	        if (value !== undefined) {
	          (0, _utils.setByDot)(data, field, undefined, true);
	        }
	      }
	    } catch (err) {
	      _didIteratorError2 = true;
	      _iteratorError2 = err;
	    } finally {
	      try {
	        if (!_iteratorNormalCompletion2 && _iterator2.return) {
	          _iterator2.return();
	        }
	      } finally {
	        if (_didIteratorError2) {
	          throw _iteratorError2;
	        }
	      }
	    }
	  };

	  var callback = function callback() {
	    return true;
	  };
	  if (typeof fields[fields.length - 1] === 'function') {
	    callback = fields.pop();
	    console.error('DEPRECATED Predicate func will be removed next version. (removeQuery)');
	  }

	  return function (hook) {
	    if (hook.type === 'after') {
	      var provider = hook.params.provider || 'server';
	      throw new errors.GeneralError('Provider \'' + provider + '\' cannot remove query params on after hook. (removeQuery)');
	    }
	    var result = hook.params.query;
	    var update = function update(condition) {
	      if (result && condition) {
	        removeQueries(result);
	      }
	      return hook;
	    };

	    var check = callback(hook);

	    return check && typeof check.then === 'function' ? check.then(update) : update(check);
	  };
	}

	/**
	 * Discard all other fields except for the given fields from the query params.
	 * Can be used as a before hook for any service method.
	 *
	 * @param {Array.<string|Function>} fields - Field names to retain. Dot notation is supported.
	 * @returns {Function} hook function(hook)
	 *
	 * DEPRECATED: The last param may be a function to determine if the current hook should be updated.
	 * Its signature is func(hook) and it returns either a boolean or a promise resolving to a boolean.
	 * This boolean determines if the hook is updated.
	 *
	 * hooks.lowerCase('group', hook => hook.data.status === 1);
	 * hooks.lowerCase('group', hook => new Promise(resolve => {
	 *   setTimeout(() => { resolve(true); }, 100)
	 * }));
	 */
	function pluckQuery() {
	  for (var _len3 = arguments.length, fields = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
	    fields[_key3] = arguments[_key3];
	  }

	  var pluckQueries = function pluckQueries(data) {
	    var plucked = {};

	    fields.forEach(function (field) {
	      var value = (0, _utils.getByDot)(data, field); // prevent setByDot creating nested empty objects
	      if (value !== undefined) {
	        (0, _utils.setByDot)(plucked, field, value);
	      }
	    });

	    return plucked;
	  };

	  var callback = function callback() {
	    return true;
	  };
	  if (typeof fields[fields.length - 1] === 'function') {
	    callback = fields.pop();
	    console.error('DEPRECATED Predicate func will be removed next version. (pluckQuery)');
	  }

	  return function (hook) {
	    if (hook.type === 'after') {
	      throw new errors.GeneralError('Provider \'' + hook.params.provider + '\' can not pluck query params on after hook. (pluckQuery)');
	    }
	    var result = hook.params.query;
	    var update = function update(condition) {
	      if (result && condition) {
	        hook.params.query = pluckQueries(result);
	      }
	      return hook;
	    };

	    var check = callback(hook);

	    return check && typeof check.then === 'function' ? check.then(update) : update(check);
	  };
	}

	/**
	 * Remove the given fields either from the data submitted (as a before hook for create,
	 * update or patch) or from the result (as an after hook). If the data is an array or
	 * a paginated find result the hook will remove the field for every item.
	 *
	 * @param {Array.<string|Function>} fields - Field names to remove. Dot notation is supported.
	 * @returns {Function} hook function(hook)
	 *
	 * The last param may be a function to determine if the current hook should be updated.
	 * Its signature is func(hook) and it returns either a boolean or a promise resolving to a boolean.
	 * This boolean determines if the hook is updated.
	 *
	 * hooks.lowerCase('group', hook => hook.data.status === 1);
	 * hooks.lowerCase('group', hook => new Promise(resolve => {
	 *   setTimeout(() => { resolve(true); }, 100)
	 * }));
	 *
	 * The items are only updated for external requests, e.g. hook.params.provider is rest or socketio,
	 * or if the decision function mentioned above returns true.
	 */
	function remove() {
	  for (var _len4 = arguments.length, fields = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
	    fields[_key4] = arguments[_key4];
	  }

	  var removeFields = function removeFields(data) {
	    var _iteratorNormalCompletion3 = true;
	    var _didIteratorError3 = false;
	    var _iteratorError3 = undefined;

	    try {
	      for (var _iterator3 = fields[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	        var field = _step3.value;

	        var value = (0, _utils.getByDot)(data, field);
	        if (value !== undefined) {
	          // prevent setByDot creating nested empty objects
	          (0, _utils.setByDot)(data, field, undefined, true);
	        }
	      }
	    } catch (err) {
	      _didIteratorError3 = true;
	      _iteratorError3 = err;
	    } finally {
	      try {
	        if (!_iteratorNormalCompletion3 && _iterator3.return) {
	          _iterator3.return();
	        }
	      } finally {
	        if (_didIteratorError3) {
	          throw _iteratorError3;
	        }
	      }
	    }
	  };

	  // when deprecating, remember hook should not run if called from server
	  var callback = function callback(hook) {
	    return !!hook.params.provider;
	  }; // important condition
	  if (typeof fields[fields.length - 1] === 'function') {
	    callback = fields.pop();
	  }

	  return function (hook) {
	    var result = hook.type === 'before' ? hook.data : hook.result;
	    var update = function update(condition) {
	      if (result && condition) {
	        if (Array.isArray(result)) {
	          result.forEach(removeFields);
	        } else {
	          removeFields(result);

	          if (result.data) {
	            if (Array.isArray(result.data)) {
	              result.data.forEach(removeFields);
	            } else {
	              removeFields(result.data);
	            }
	          }
	        }
	      }
	      return hook;
	    };

	    var check = callback(hook);

	    return check && typeof check.then === 'function' ? check.then(update) : update(check);
	  };
	}

	/**
	 * Discard all other fields except for the provided fields either from the data submitted
	 * (as a before hook for create, update or patch) or from the result (as an after hook).
	 * If the data is an array or a paginated find result the hook will remove the field for every item.
	 *
	 * @param {Array.<string|Function>} fields - Field names to remove. Dot notation is supported.
	 * @returns {Function} hook function(hook)
	 *
	 * DEPRECATED: The last param may be a function to determine if the current hook should be updated.
	 * Its signature is func(hook) and it returns either a boolean or a promise resolving to a boolean.
	 * This boolean determines if the hook is updated.
	 *
	 * hooks.lowerCase('group', hook => hook.data.status === 1);
	 * hooks.lowerCase('group', hook => new Promise(resolve => {
	 *   setTimeout(() => { resolve(true); }, 100)
	 * }));
	 *
	 * The items are only updated for external requests, e.g. hook.params.provider is rest or socketio,
	 * or if the decision function mentioned above returns true.
	 */
	function pluck() {
	  for (var _len5 = arguments.length, fields = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
	    fields[_key5] = arguments[_key5];
	  }

	  var pluckFields = function pluckFields(data) {
	    var plucked = {};

	    fields.forEach(function (field) {
	      var value = (0, _utils.getByDot)(data, field);
	      if (value !== undefined) {
	        // prevent setByDot creating nested empty objects
	        (0, _utils.setByDot)(plucked, field, value);
	      }
	    });

	    return plucked;
	  };

	  // when deprecating, remember hook should not run if called from server
	  var callback = function callback(hook) {
	    return !!hook.params.provider;
	  };
	  if (typeof fields[fields.length - 1] === 'function') {
	    callback = fields.pop();
	    console.error('DEPRECATED Predicate func will be removed next version. (pluck)');
	  }

	  return function (hook) {
	    var update = function update(condition) {
	      if (condition) {
	        var items = (0, _utils.getItems)(hook);

	        if (items) {
	          if (Array.isArray(items)) {
	            (0, _utils.replaceItems)(hook, items.map(pluckFields));
	          } else {
	            (0, _utils.replaceItems)(hook, pluckFields(items));
	          }
	        }
	      }

	      return hook;
	    };

	    var check = callback(hook);

	    return check && typeof check.then === 'function' ? check.then(update) : update(check);
	  };
	}

	/**
	 * Disable access to a service method completely, for a specific provider,
	 * or for a custom condition.
	 *
	 * @param {string|function} [realm] - Provider, or function(hook):boolean|Promise
	 *    The first provider or the custom condition.
	 *    null = disable completely,
	 *    'external' = disable external access,
	 *    string = disable that provider e.g. 'rest',
	 *    func(hook) = returns boolean or promise resolving to a boolean. false = disable access.
	 * @param {string|string[]} [args] - Additional provider names.
	 * @returns {Function} hook function(hook)
	 *
	 * The function may be invoked with
	 * - no param, or with undefined or null. All providers are disallowed, even the server.
	 * - multiple params of provider names, e.g. rest, socketio. They are all disabled.
	 * - 'external'. All client interfaces are disabled.
	 * - a function whose signature is func(hook). It returns either a boolean or a promise which
	 * resolves to a boolean. If false, the operation is disabled. This is the only way to disable
	 * calls from the server.
	 */
	function disable(realm) {
	  if (!realm) {
	    return function (hook) {
	      throw new errors.MethodNotAllowed('Calling \'' + hook.method + '\' not allowed. (disable)');
	    };
	  }

	  if (typeof realm === 'function') {
	    return function (hook) {
	      var result = realm(hook);
	      var update = function update(check) {
	        if (!check) {
	          throw new errors.MethodNotAllowed('Calling \'' + hook.method + '\' not allowed. (disable)');
	        }
	      };

	      if (result && typeof result.then === 'function') {
	        return result.then(update);
	      }

	      update(result);
	    };
	  }

	  for (var _len6 = arguments.length, args = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
	    args[_key6 - 1] = arguments[_key6];
	  }

	  var providers = [realm].concat(args);

	  return function (hook) {
	    var provider = hook.params.provider;

	    if (realm === 'external' && provider || providers.indexOf(provider) !== -1) {
	      throw new errors.MethodNotAllowed('Provider \'' + hook.params.provider + '\' can not call \'' + hook.method + '\'. (disable)\'');
	    }
	  };
	}

	/**
	 * The populate hook uses a property from the result (or every item if it is a list)
	 * to retrieve a single related object from a service and add it to the original object.
	 * It is meant to be used as an after hook on any service method.
	 *
	 * @param {string} target - The prop name to contain the populated item or array of populated items.
	 *    This is also the default for options.field if that is not specified.
	 * @param {Object} options - options
	 *    For a mongoose model, these are the options for item.toObject().
	 *    For a Sequelize model, these are the options for item.toJSON().
	 * @param {string} options.service - The service for the related object, e.g. '/messages'.
	 * @param {string|Array.<string>} options.field - The field containing the key(s)
	 *    for the item(s) in options.service.
	 * @returns {Function} hook function(hook):Promise resolving to the hook.
	 *
	 * 'options.field' is the foreign key for one related item in options.service, i.e. item[options.field] === foreignItem[idField].
	 * 'target' is set to this related item once it is read successfully.
	 *
	 * If 'options.field' is not present in the hook result item, the hook is ignored.
	 *
	 * So if the hook result has the message item
	 *    { _id: '1...1', senderId: 'a...a', text: 'Jane, are you there?' }
	 * and the /users service has the item
	 *    { _id: 'a...a', name: 'John Doe'}
	 * and then the hook is run
	 *    hooks.populate('sender', { field: 'userId', service: '/users' })
	 * the hook result will contain
	 *    { _id: '1...1', senderId : 'a...a', text: 'Jane, are you there?',
	 *      sender: { _id: 'a...a', name: 'John Doe'} }
	 *
	 * If 'senderId' is an array of keys, then 'sender' will be an array of populated items.
	 */
	function legacyPopulate(target, options) {
	  options = Object.assign({}, options);

	  console.error('Calling populate(target, options) is now DEPRECATED and will be removed in the future. ' + 'Refer to docs.feathersjs.com for more information. (legacyPopulate)');

	  if (!options.service) {
	    throw new Error('You need to provide a service. (populate)');
	  }

	  var field = options.field || target;

	  return function (hook) {
	    function populate1(item) {
	      if (!item[field]) {
	        return Promise.resolve(item);
	      }

	      // Find by the field value by default or a custom query
	      var id = item[field];

	      // If it's a mongoose model then
	      if (typeof item.toObject === 'function') {
	        item = item.toObject(options);
	      }
	      // If it's a Sequelize model
	      else if (typeof item.toJSON === 'function') {
	          item = item.toJSON(options);
	        }
	      // Remove any query from params as it's not related
	      var params = Object.assign({}, hook.params, { query: undefined });
	      // If the relationship is an array of ids, fetch and resolve an object for each,
	      // otherwise just fetch the object.
	      var promise = Array.isArray(id) ? Promise.all(id.map(function (objectID) {
	        return hook.app.service(options.service).get(objectID, params);
	      })) : hook.app.service(options.service).get(id, params);
	      return promise.then(function (relatedItem) {
	        if (relatedItem) {
	          item[target] = relatedItem;
	        }
	        return item;
	      });
	    }

	    if (hook.type !== 'after') {
	      throw new errors.GeneralError('Can not populate on before hook. (populate)');
	    }

	    var isPaginated = hook.method === 'find' && hook.result.data;
	    var data = isPaginated ? hook.result.data : hook.result;

	    if (Array.isArray(data)) {
	      return Promise.all(data.map(populate1)).then(function (results) {
	        if (isPaginated) {
	          hook.result.data = results;
	        } else {
	          hook.result = results;
	        }

	        return hook;
	      });
	    }

	    // Handle single objects.
	    return populate1(hook.result).then(function (item) {
	      hook.result = item;
	      return hook;
	    });
	  };
	}

/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	exports.isHookObject = isHookObject;
	exports.processHooks = processHooks;
	exports.addHookTypes = addHookTypes;
	exports.getHooks = getHooks;
	exports.baseMixin = baseMixin;

	var _feathersCommons = __webpack_require__(88);

	function isHookObject(hookObject) {
	  return (typeof hookObject === 'undefined' ? 'undefined' : _typeof(hookObject)) === 'object' && typeof hookObject.method === 'string' && typeof hookObject.type === 'string';
	}

	function processHooks(hooks, initialHookObject) {
	  var _this = this;

	  var hookObject = initialHookObject;
	  var updateCurrentHook = function updateCurrentHook(current) {
	    if (current) {
	      if (!isHookObject(current)) {
	        throw new Error(hookObject.type + ' hook for \'' + hookObject.method + '\' method returned invalid hook object');
	      }

	      hookObject = current;
	    }

	    return hookObject;
	  };
	  var promise = Promise.resolve(hookObject);

	  // Go through all hooks and chain them into our promise
	  hooks.forEach(function (fn) {
	    var hook = fn.bind(_this);

	    if (hook.length === 2) {
	      // function(hook, next)
	      promise = promise.then(function (hookObject) {
	        return new Promise(function (resolve, reject) {
	          hook(hookObject, function (error, result) {
	            return error ? reject(error) : resolve(result);
	          });
	        });
	      });
	    } else {
	      // function(hook)
	      promise = promise.then(hook);
	    }

	    // Use the returned hook object or the old one
	    promise = promise.then(updateCurrentHook);
	  });

	  return promise.catch(function (error) {
	    // Add the hook information to any errors
	    error.hook = hookObject;
	    throw error;
	  });
	}

	function addHookTypes(target) {
	  var types = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ['before', 'after', 'error'];

	  Object.defineProperty(target, '__hooks', {
	    value: {}
	  });

	  types.forEach(function (type) {
	    // Initialize properties where hook functions are stored
	    target.__hooks[type] = {};
	  });
	}

	function getHooks(app, service, type, method) {
	  var appLast = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

	  var appHooks = app.__hooks[type][method] || [];
	  var serviceHooks = service.__hooks[type][method] || [];

	  if (appLast) {
	    return serviceHooks.concat(appHooks);
	  }

	  return appHooks.concat(serviceHooks);
	}

	function baseMixin(methods) {
	  var mixin = {
	    hooks: function hooks(allHooks) {
	      var _this2 = this;

	      (0, _feathersCommons.each)(allHooks, function (obj, type) {
	        if (!_this2.__hooks[type]) {
	          throw new Error('\'' + type + '\' is not a valid hook type');
	        }

	        var hooks = _feathersCommons.hooks.convertHookData(obj);

	        (0, _feathersCommons.each)(hooks, function (value, method) {
	          if (method !== 'all' && methods.indexOf(method) === -1) {
	            throw new Error('\'' + method + '\' is not a valid hook method');
	          }
	        });

	        methods.forEach(function (method) {
	          if (!(hooks[method] || hooks.all)) {
	            return;
	          }

	          var myHooks = _this2.__hooks[type][method] || (_this2.__hooks[type][method] = []);

	          if (hooks.all) {
	            myHooks.push.apply(myHooks, hooks.all);
	          }

	          if (hooks[method]) {
	            myHooks.push.apply(myHooks, hooks[method]);
	          }
	        });
	      });

	      return this;
	    }
	  };

	  for (var _len = arguments.length, objs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    objs[_key - 1] = arguments[_key];
	  }

	  return Object.assign.apply(Object, [mixin].concat(objs));
	}

/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(130);


/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function () {
	  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	  var config = Object.assign({}, defaults, opts);

	  return function () {
	    var app = this;

	    if (!app.get('storage')) {
	      app.set('storage', (0, _utils.getStorage)(config.storage));
	    }

	    app.authenticate = function () {
	      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	      var storage = this.get('storage');
	      var getOptions = Promise.resolve(options);

	      // If no type was given let's try to authenticate with a stored JWT
	      if (!options.type) {
	        getOptions = (0, _utils.getJWT)(config.tokenKey, config.cookie, this.get('storage')).then(function (token) {
	          if (!token) {
	            return Promise.reject(new _feathersErrors2.default.NotAuthenticated('Could not find stored JWT and no authentication type was given'));
	          }

	          return { type: 'token', token: token };
	        });
	      }

	      var handleResponse = function handleResponse(response) {
	        app.set('token', response.token);
	        app.set('user', response.data);

	        return Promise.resolve(storage.setItem(config.tokenKey, response.token)).then(function () {
	          return response;
	        });
	      };

	      return getOptions.then(function (options) {
	        var endPoint = void 0;

	        if (options.endpoint) {
	          endPoint = options.endpoint;
	        } else if (options.type === 'local') {
	          endPoint = config.localEndpoint;
	        } else if (options.type === 'token') {
	          endPoint = config.tokenEndpoint;
	        } else {
	          throw new Error('Unsupported authentication \'type\': ' + options.type);
	        }

	        return (0, _utils.connected)(app).then(function (socket) {
	          // TODO (EK): Handle OAuth logins
	          // If we are using a REST client
	          if (app.rest) {
	            return app.service(endPoint).create(options).then(handleResponse);
	          }

	          var method = app.io ? 'emit' : 'send';

	          return (0, _utils.authenticateSocket)(options, socket, method).then(handleResponse);
	        });
	      });
	    };

	    // Set our logout method with the correct socket context
	    app.logout = function () {
	      app.set('user', null);
	      app.set('token', null);

	      (0, _utils.clearCookie)(config.cookie);

	      // remove the token from localStorage
	      return Promise.resolve(app.get('storage').removeItem(config.tokenKey)).then(function () {
	        // If using sockets de-authenticate the socket
	        if (app.io || app.primus) {
	          var method = app.io ? 'emit' : 'send';
	          var socket = app.io ? app.io : app.primus;

	          return (0, _utils.logoutSocket)(socket, method);
	        }
	      });
	    };

	    // Set up hook that adds token and user to params so that
	    // it they can be accessed by client side hooks and services
	    app.mixins.push(function (service) {
	      if (typeof service.before !== 'function' || typeof service.after !== 'function') {
	        throw new Error('It looks like feathers-hooks isn\'t configured. It is required before running feathers-authentication.');
	      }

	      service.before(hooks.populateParams(config));
	    });

	    // Set up hook that adds authorization header for REST provider
	    if (app.rest) {
	      app.mixins.push(function (service) {
	        service.before(hooks.populateHeader(config));
	      });
	    }
	  };
	};

	var _feathersErrors = __webpack_require__(109);

	var _feathersErrors2 = _interopRequireDefault(_feathersErrors);

	var _hooks = __webpack_require__(131);

	var hooks = _interopRequireWildcard(_hooks);

	var _utils = __webpack_require__(132);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var defaults = {
	  cookie: 'feathers-jwt',
	  tokenKey: 'feathers-jwt',
	  localEndpoint: '/auth/local',
	  tokenEndpoint: '/auth/token'
	};

	module.exports = exports['default'];

/***/ }),
/* 131 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.populateParams = populateParams;
	exports.populateHeader = populateHeader;

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function populateParams() {
	  return function (hook) {
	    var app = hook.app;

	    Object.assign(hook.params, {
	      user: app.get('user'),
	      token: app.get('token')
	    });
	  };
	}

	function populateHeader() {
	  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	  return function (hook) {
	    if (hook.params.token) {
	      hook.params.headers = Object.assign({}, _defineProperty({}, options.header || 'authorization', hook.params.token), hook.params.headers);
	    }
	  };
	}

/***/ }),
/* 132 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.connected = connected;
	exports.authenticateSocket = authenticateSocket;
	exports.logoutSocket = logoutSocket;
	exports.getCookie = getCookie;
	exports.clearCookie = clearCookie;
	exports.getJWT = getJWT;
	exports.getStorage = getStorage;
	// Returns a promise that resolves when the socket is connected
	function connected(app) {
	  return new Promise(function (resolve, reject) {
	    if (app.rest) {
	      return resolve();
	    }

	    var socket = app.io || app.primus;

	    if (!socket) {
	      return reject(new Error('It looks like no client connection has been configured.'));
	    }

	    // If one of those events happens before `connect` the promise will be rejected
	    // If it happens after, it will do nothing (since Promises can only resolve once)
	    socket.once('disconnect', reject);
	    socket.once('close', reject);

	    // If the socket is not connected yet we have to wait for the `connect` event
	    if (app.io && !socket.connected || app.primus && socket.readyState !== 3) {
	      var connectEvent = app.primus ? 'open' : 'connect';
	      socket.once(connectEvent, function () {
	        return resolve(socket);
	      });
	    } else {
	      resolve(socket);
	    }
	  });
	}

	// Returns a promise that authenticates a socket
	function authenticateSocket(options, socket, method) {
	  return new Promise(function (resolve, reject) {
	    socket.once('unauthorized', reject);
	    socket.once('authenticated', resolve);

	    socket[method]('authenticate', options);
	  });
	}

	// Returns a promise that de-authenticates a socket
	function logoutSocket(socket, method) {
	  return new Promise(function (resolve, reject) {
	    socket[method]('logout', function (error) {
	      if (error) {
	        reject(error);
	      }

	      resolve();
	    });
	  });
	}

	// Returns the value for a cookie
	function getCookie(name) {
	  if (typeof document !== 'undefined') {
	    var value = '; ' + document.cookie;
	    var parts = value.split('; ' + name + '=');

	    if (parts.length === 2) {
	      return parts.pop().split(';').shift();
	    }
	  }

	  return null;
	}

	// Returns the value for a cookie
	function clearCookie(name) {
	  if (typeof document !== 'undefined') {
	    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	  }

	  return null;
	}

	// Tries the JWT from the given key either from a storage or the cookie
	function getJWT(tokenKey, cookieKey, storage) {
	  return Promise.resolve(storage.getItem(tokenKey)).then(function (jwt) {
	    var cookieToken = getCookie(cookieKey);

	    if (cookieToken) {
	      return cookieToken;
	    }

	    return jwt;
	  });
	}

	// Returns a storage implementation
	function getStorage(storage) {
	  if (storage) {
	    return storage;
	  }

	  return {
	    store: {},
	    getItem: function getItem(key) {
	      return this.store[key];
	    },
	    setItem: function setItem(key, value) {
	      return this.store[key] = value;
	    },
	    removeItem: function removeItem(key) {
	      delete this.store[key];
	      return this;
	    }
	  };
	}

/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	exports.default = init;

	var _feathersMemory = __webpack_require__(134);

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
	          _this2._uId = keys.length && typeof last[_this2.id] !== 'undefined' ? last[_this2.id] + 1 : _this2._uId;

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
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	exports.default = init;

	var _uberproto = __webpack_require__(83);

	var _uberproto2 = _interopRequireDefault(_uberproto);

	var _feathersQueryFilters = __webpack_require__(135);

	var _feathersQueryFilters2 = _interopRequireDefault(_feathersQueryFilters);

	var _feathersErrors = __webpack_require__(109);

	var _feathersErrors2 = _interopRequireDefault(_feathersErrors);

	var _cloneDeep = __webpack_require__(136);

	var _cloneDeep2 = _interopRequireDefault(_cloneDeep);

	var _feathersCommons = __webpack_require__(88);

	var _sift = __webpack_require__(146);

	var _sift2 = _interopRequireDefault(_sift);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var select = function select() {
	  var base = _feathersCommons.select.apply(undefined, arguments);

	  return function (result) {
	    return base((0, _cloneDeep2.default)(result));
	  };
	};

	var Service = function () {
	  function Service() {
	    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	    _classCallCheck(this, Service);

	    this.paginate = options.paginate || {};
	    this._id = this.id = options.idField || options.id || 'id';
	    this._uId = options.startId || 0;
	    this.store = options.store || {};
	    this.events = options.events || [];
	    this._matcher = options.matcher;
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

	      var map = select(params);
	      var values = _feathersCommons._.values(this.store);

	      if (this._matcher) {
	        values = values.filter(this._matcher(query));
	      } else {
	        values = (0, _sift2.default)(query, values);
	      }

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

	      return Promise.resolve({
	        total: total,
	        limit: filters.$limit,
	        skip: filters.$skip || 0,
	        data: map(values)
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
	        return Promise.resolve(this.store[id]).then(select(params, this.id));
	      }

	      return Promise.reject(new _feathersErrors2.default.NotFound('No record found for id \'' + id + '\''));
	    }

	    // Create without hooks and mixins that can be used internally

	  }, {
	    key: '_create',
	    value: function _create(data, params) {
	      var id = data[this._id] || this._uId++;
	      var current = _feathersCommons._.extend({}, data, _defineProperty({}, this._id, id));

	      return Promise.resolve(this.store[id] = current).then(select(params, this.id));
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

	        return Promise.resolve(this.store[id]).then(select(params, this.id));
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

	        return Promise.resolve(this.store[id]).then(select(params, this.id));
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

	        return Promise.resolve(deleted).then(select(params, this.id));
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
/* 135 */
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

	var _feathersCommons = __webpack_require__(88);

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
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Module dependenices
	 */

	var isObject = __webpack_require__(137);
	var clone = __webpack_require__(139);
	var typeOf = __webpack_require__(143);
	var forOwn = __webpack_require__(144);

	/**
	 * Recursively clone native types.
	 */

	function cloneDeep(val, instanceClone) {
	  switch (typeOf(val)) {
	    case 'object':
	      return cloneObjectDeep(val, instanceClone);
	    case 'array':
	      return cloneArrayDeep(val, instanceClone);
	    default: {
	      return clone(val);
	    }
	  }
	}

	function cloneObjectDeep(obj, instanceClone) {
	  if (isObject(obj)) {
	    var res = {};
	    forOwn(obj, function(obj, key) {
	      this[key] = cloneDeep(obj, instanceClone);
	    }, res);
	    return res;
	  } else if (instanceClone) {
	    return instanceClone(obj);
	  } else {
	    return obj;
	  }
	}

	function cloneArrayDeep(arr, instanceClone) {
	  var len = arr.length, res = [];
	  var i = -1;
	  while (++i < len) {
	    res[i] = cloneDeep(arr[i], instanceClone);
	  }
	  return res;
	}

	/**
	 * Expose `cloneDeep`
	 */

	module.exports = cloneDeep;


/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

	/*!
	 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
	 *
	 * Copyright (c) 2014-2017, Jon Schlinkert.
	 * Released under the MIT License.
	 */

	'use strict';

	var isObject = __webpack_require__(138);

	function isObjectObject(o) {
	  return isObject(o) === true
	    && Object.prototype.toString.call(o) === '[object Object]';
	}

	module.exports = function isPlainObject(o) {
	  var ctor,prot;

	  if (isObjectObject(o) === false) return false;

	  // If has modified constructor
	  ctor = o.constructor;
	  if (typeof ctor !== 'function') return false;

	  // If has modified prototype
	  prot = ctor.prototype;
	  if (isObjectObject(prot) === false) return false;

	  // If constructor does not have an Object-specific method
	  if (prot.hasOwnProperty('isPrototypeOf') === false) {
	    return false;
	  }

	  // Most likely a plain Object
	  return true;
	};


/***/ }),
/* 138 */
/***/ (function(module, exports) {

	/*!
	 * isobject <https://github.com/jonschlinkert/isobject>
	 *
	 * Copyright (c) 2014-2017, Jon Schlinkert.
	 * Released under the MIT License.
	 */

	'use strict';

	module.exports = function isObject(val) {
	  return val != null && typeof val === 'object' && Array.isArray(val) === false;
	};


/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

	/*!
	 * shallow-clone <https://github.com/jonschlinkert/shallow-clone>
	 *
	 * Copyright (c) 2015-2017, Jon Schlinkert.
	 * Released under the MIT License.
	 */

	'use strict';

	var isObject = __webpack_require__(140);
	var mixin = __webpack_require__(141);
	var typeOf = __webpack_require__(143);

	/**
	 * Shallow copy an object, array or primitive.
	 *
	 * @param  {any} `val`
	 * @return {any}
	 */

	function clone(val) {
	  var type = typeOf(val);
	  if (clone.hasOwnProperty(type)) {
	    return clone[type](val);
	  }
	  return val;
	}

	clone.array = function cloneArray(arr) {
	  return arr.slice();
	};

	clone.date = function cloneDate(date) {
	  return new Date(+date);
	};

	clone.object = function cloneObject(obj) {
	  if (isObject(obj)) {
	    return mixin({}, obj);
	  } else {
	    return obj;
	  }
	};

	clone.regexp = function cloneRegExp(re) {
	  var flags = '';
	  flags += re.multiline ? 'm' : '';
	  flags += re.global ? 'g' : '';
	  flags += re.ignorecase ? 'i' : '';
	  return new RegExp(re.source, flags);
	};

	/**
	 * Expose `clone`
	 */

	module.exports = clone;


/***/ }),
/* 140 */
/***/ (function(module, exports) {

	/*!
	 * is-extendable <https://github.com/jonschlinkert/is-extendable>
	 *
	 * Copyright (c) 2015, Jon Schlinkert.
	 * Licensed under the MIT License.
	 */

	'use strict';

	module.exports = function isExtendable(val) {
	  return typeof val !== 'undefined' && val !== null
	    && (typeof val === 'object' || typeof val === 'function');
	};


/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var isObject = __webpack_require__(140);
	var forIn = __webpack_require__(142);

	function mixin(target, objects) {
	  if (!isObject(target)) {
	    throw new TypeError('mixin-object expects the first argument to be an object.');
	  }
	  var len = arguments.length, i = 0;
	  while (++i < len) {
	    var obj = arguments[i];
	    if (isObject(obj)) {
	      forIn(obj, copy, target);
	    }
	  }
	  return target;
	}

	/**
	 * copy properties from the source object to the
	 * target object.
	 *
	 * @param  {*} `value`
	 * @param  {String} `key`
	 */

	function copy(value, key) {
	  this[key] = value;
	}

	/**
	 * Expose `mixin`
	 */

	module.exports = mixin;

/***/ }),
/* 142 */
/***/ (function(module, exports) {

	/*!
	 * for-in <https://github.com/jonschlinkert/for-in>
	 *
	 * Copyright (c) 2014-2017, Jon Schlinkert.
	 * Released under the MIT License.
	 */

	'use strict';

	module.exports = function forIn(obj, fn, thisArg) {
	  for (var key in obj) {
	    if (fn.call(thisArg, obj[key], key, obj) === false) {
	      break;
	    }
	  }
	};


/***/ }),
/* 143 */
/***/ (function(module, exports) {

	var toString = Object.prototype.toString;

	/**
	 * Get the native `typeof` a value.
	 *
	 * @param  {*} `val`
	 * @return {*} Native javascript type
	 */

	module.exports = function kindOf(val) {
	  var type = typeof val;

	  // primitivies
	  if (type === 'undefined') {
	    return 'undefined';
	  }
	  if (val === null) {
	    return 'null';
	  }
	  if (val === true || val === false || val instanceof Boolean) {
	    return 'boolean';
	  }
	  if (type === 'string' || val instanceof String) {
	    return 'string';
	  }
	  if (type === 'number' || val instanceof Number) {
	    return 'number';
	  }

	  // functions
	  if (type === 'function' || val instanceof Function) {
	    if (typeof val.constructor.name !== 'undefined' && val.constructor.name.slice(0, 9) === 'Generator') {
	      return 'generatorfunction';
	    }
	    return 'function';
	  }

	  // array
	  if (typeof Array.isArray !== 'undefined' && Array.isArray(val)) {
	    return 'array';
	  }

	  // check for instances of RegExp and Date before calling `toString`
	  if (val instanceof RegExp) {
	    return 'regexp';
	  }
	  if (val instanceof Date) {
	    return 'date';
	  }

	  // other objects
	  type = toString.call(val);

	  if (type === '[object RegExp]') {
	    return 'regexp';
	  }
	  if (type === '[object Date]') {
	    return 'date';
	  }
	  if (type === '[object Arguments]') {
	    return 'arguments';
	  }
	  if (type === '[object Error]') {
	    return 'error';
	  }
	  if (type === '[object Promise]') {
	    return 'promise';
	  }

	  // buffer
	  if (isBuffer(val)) {
	    return 'buffer';
	  }

	  // es6: Map, WeakMap, Set, WeakSet
	  if (type === '[object Set]') {
	    return 'set';
	  }
	  if (type === '[object WeakSet]') {
	    return 'weakset';
	  }
	  if (type === '[object Map]') {
	    return 'map';
	  }
	  if (type === '[object WeakMap]') {
	    return 'weakmap';
	  }
	  if (type === '[object Symbol]') {
	    return 'symbol';
	  }
	  
	  if (type === '[object Map Iterator]') {
	    return 'mapiterator';
	  }
	  if (type === '[object Set Iterator]') {
	    return 'setiterator';
	  }
	  if (type === '[object String Iterator]') {
	    return 'stringiterator';
	  }
	  if (type === '[object Array Iterator]') {
	    return 'arrayiterator';
	  }
	  
	  // typed arrays
	  if (type === '[object Int8Array]') {
	    return 'int8array';
	  }
	  if (type === '[object Uint8Array]') {
	    return 'uint8array';
	  }
	  if (type === '[object Uint8ClampedArray]') {
	    return 'uint8clampedarray';
	  }
	  if (type === '[object Int16Array]') {
	    return 'int16array';
	  }
	  if (type === '[object Uint16Array]') {
	    return 'uint16array';
	  }
	  if (type === '[object Int32Array]') {
	    return 'int32array';
	  }
	  if (type === '[object Uint32Array]') {
	    return 'uint32array';
	  }
	  if (type === '[object Float32Array]') {
	    return 'float32array';
	  }
	  if (type === '[object Float64Array]') {
	    return 'float64array';
	  }

	  // must be a plain object
	  return 'object';
	};

	/**
	 * If you need to support Safari 5-7 (8-10 yr-old browser),
	 * take a look at https://github.com/feross/is-buffer
	 */

	function isBuffer(val) {
	  return val.constructor
	    && typeof val.constructor.isBuffer === 'function'
	    && val.constructor.isBuffer(val);
	}


/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

	/*!
	 * for-own <https://github.com/jonschlinkert/for-own>
	 *
	 * Copyright (c) 2014-2017, Jon Schlinkert.
	 * Released under the MIT License.
	 */

	'use strict';

	var forIn = __webpack_require__(145);
	var hasOwn = Object.prototype.hasOwnProperty;

	module.exports = function forOwn(obj, fn, thisArg) {
	  forIn(obj, function(val, key) {
	    if (hasOwn.call(obj, key)) {
	      return fn.call(thisArg, obj[key], key, obj);
	    }
	  });
	};


/***/ }),
/* 145 */
/***/ (function(module, exports) {

	/*!
	 * for-in <https://github.com/jonschlinkert/for-in>
	 *
	 * Copyright (c) 2014-2017, Jon Schlinkert.
	 * Released under the MIT License.
	 */

	'use strict';

	module.exports = function forIn(obj, fn, thisArg) {
	  for (var key in obj) {
	    if (fn.call(thisArg, obj[key], key, obj) === false) {
	      break;
	    }
	  }
	};


/***/ }),
/* 146 */
/***/ (function(module, exports) {

	/*
	 * Sift 3.x
	 *
	 * Copryright 2015, Craig Condon
	 * Licensed under MIT
	 *
	 * Filter JavaScript objects with mongodb queries
	 */

	(function() {

	  'use strict';

	  /**
	   */

	  function isFunction(value) {
	    return typeof value === 'function';
	  }

	  /**
	   */

	  function isArray(value) {
	    return Object.prototype.toString.call(value) === '[object Array]';
	  }

	  /**
	   */

	  function comparable(value) {
	    if (value instanceof Date) {
	      return value.getTime();
	    } else if (isArray(value)) {
	      return value.map(comparable);
	    } else if (value && typeof value.toJSON === 'function') {
	      return value.toJSON();
	    } else {
	      return value;
	    }
	  }

	  function get(obj, key) {
	    return isFunction(obj.get) ? obj.get(key) : obj[key];
	  }

	  /**
	   */

	  function or(validator) {
	    return function(a, b) {
	      if (!isArray(b) || !b.length) {
	        return validator(a, b);
	      }
	      for (var i = 0, n = b.length; i < n; i++) {
	        if (validator(a, get(b,i))) return true;
	      }
	      return false;
	    }
	  }

	  /**
	   */

	  function and(validator) {
	    return function(a, b) {
	      if (!isArray(b) || !b.length) {
	        return validator(a, b);
	      }
	      for (var i = 0, n = b.length; i < n; i++) {
	        if (!validator(a, get(b, i))) return false;
	      }
	      return true;
	    };
	  }

	  function validate(validator, b, k, o) {
	    return validator.v(validator.a, b, k, o);
	  }

	  var OPERATORS = {

	    /**
	     */

	    $eq: or(function(a, b) {
	      return a(b);
	    }),

	    /**
	     */

	    $ne: and(function(a, b) {
	      return !a(b);
	    }),

	    /**
	     */

	    $gt: or(function(a, b) {
	      return sift.compare(comparable(b), a) > 0;
	    }),

	    /**
	     */

	    $gte: or(function(a, b) {
	      return sift.compare(comparable(b), a) >= 0;
	    }),

	    /**
	     */

	    $lt: or(function(a, b) {
	      return sift.compare(comparable(b), a) < 0;
	    }),

	    /**
	     */

	    $lte: or(function(a, b) {
	      return sift.compare(comparable(b), a) <= 0;
	    }),

	    /**
	     */

	    $mod: or(function(a, b) {
	      return b % a[0] == a[1];
	    }),

	    /**
	     */

	    $in: function(a, b) {

	      if (b instanceof Array) {
	        for (var i = b.length; i--;) {
	          if (~a.indexOf(comparable(get(b, i)))) {
	            return true;
	          }
	        }
	      } else {
	        var comparableB = comparable(b);
	        if (comparableB === b && typeof b === 'object') {
	          for (var i = a.length; i--;) {
	            if (String(a[i]) === String(b) && String(b) !== '[object Object]') {
	              return true;
	            }
	          }
	        }

	        /*
	          Handles documents that are undefined, whilst also
	          having a 'null' element in the parameters to $in.
	        */
	        if (typeof comparableB == 'undefined') {
	          for (var i = a.length; i--;) {
	            if (a[i] == null) {
	              return true;
	            }
	          }
	        }

	        /*
	          Handles the case of {'field': {$in: [/regexp1/, /regexp2/, ...]}}
	        */
	        for (var i = a.length; i--;) {
	          var validator = createRootValidator(get(a, i), undefined);
	          var result = validate(validator, b, i, a);
	          if ((result) && (String(result) !== '[object Object]') && (String(b) !== '[object Object]')) {
	            return true;
	          }
	        }

	        return !!~a.indexOf(comparableB);
	      }

	      return false;
	    },

	    /**
	     */

	    $nin: function(a, b, k, o) {
	      return !OPERATORS.$in(a, b, k, o);
	    },

	    /**
	     */

	    $not: function(a, b, k, o) {
	      return !validate(a, b, k, o);
	    },

	    /**
	     */

	    $type: function(a, b) {
	      return b != void 0 ? b instanceof a || b.constructor == a : false;
	     },

	    /**
	     */

	    $all: function(a, b, k, o) {
	      return OPERATORS.$and(a, b, k, o);
	    },

	    /**
	     */

	    $size: function(a, b) {
	      return b ? a === b.length : false;
	    },

	    /**
	     */

	    $or: function(a, b, k, o) {
	      for (var i = 0, n = a.length; i < n; i++) if (validate(get(a, i), b, k, o)) return true;
	      return false;
	    },

	    /**
	     */

	    $nor: function(a, b, k, o) {
	      return !OPERATORS.$or(a, b, k, o);
	    },

	    /**
	     */

	    $and: function(a, b, k, o) {
	      for (var i = 0, n = a.length; i < n; i++) {
	        if (!validate(get(a, i), b, k, o)) {
	          return false;
	        }
	      }
	      return true;
	    },

	    /**
	     */

	    $regex: or(function(a, b) {
	      return typeof b === 'string' && a.test(b);
	    }),

	    /**
	     */

	    $where: function(a, b, k, o) {
	      return a.call(b, b, k, o);
	    },

	    /**
	     */

	    $elemMatch: function(a, b, k, o) {
	      if (isArray(b)) {
	        return !!~search(b, a);
	      }
	      return validate(a, b, k, o);
	    },

	    /**
	     */

	    $exists: function(a, b, k, o) {
	      return o.hasOwnProperty(k) === a;
	    }
	  };

	  /**
	   */

	  var prepare = {

	    /**
	     */

	    $eq: function(a) {

	      if (a instanceof RegExp) {
	        return function(b) {
	          return typeof b === 'string' && a.test(b);
	        };
	      } else if (a instanceof Function) {
	        return a;
	      } else if (isArray(a) && !a.length) {
	        // Special case of a == []
	        return function(b) {
	          return (isArray(b) && !b.length);
	        };
	      } else if (a === null){
	        return function(b){
	          //will match both null and undefined
	          return b == null;
	        }
	      }

	      return function(b) {
	        return sift.compare(comparable(b), a) === 0;
	      };
	    },

	    /**
	     */

	    $ne: function(a) {
	      return prepare.$eq(a);
	    },

	    /**
	     */

	    $and: function(a) {
	      return a.map(parse);
	    },

	    /**
	     */

	    $all: function(a) {
	      return prepare.$and(a);
	    },

	    /**
	     */

	    $or: function(a) {
	      return a.map(parse);
	    },

	    /**
	     */

	    $nor: function(a) {
	      return a.map(parse);
	    },

	    /**
	     */

	    $not: function(a) {
	      return parse(a);
	    },

	    /**
	     */

	    $regex: function(a, query) {
	      return new RegExp(a, query.$options);
	    },

	    /**
	     */

	    $where: function(a) {
	      return typeof a === 'string' ? new Function('obj', 'return ' + a) : a;
	    },

	    /**
	     */

	    $elemMatch: function(a) {
	      return parse(a);
	    },

	    /**
	     */

	    $exists: function(a) {
	      return !!a;
	    }
	  };

	  /**
	   */

	  function search(array, validator) {

	    for (var i = 0; i < array.length; i++) {
	      var result = get(array, i);
	      if (validate(validator, get(array, i))) {
	        return i;
	      }
	    }

	    return -1;
	  }

	  /**
	   */

	  function createValidator(a, validate) {
	    return { a: a, v: validate };
	  }

	  /**
	   */

	  function nestedValidator(a, b) {
	    var values  = [];
	    findValues(b, a.k, 0, b, values);

	    if (values.length === 1) {
	      var first = values[0];
	      return validate(a.nv, first[0], first[1], first[2]);
	    }

	    for (var i = 0; i < values.length; i++) {
	      var result = values[i];
	      if (validate(a.nv, result[0], result[1], result[2])) {
	        return true;
	      }
	    }

	    return false;
	  }

	  /**
	   */

	  function findValues(current, keypath, index, object, values) {

	    if (index === keypath.length || current == void 0) {
	      values.push([current, keypath[index - 1], object]);
	      return;
	    }

	    var k = get(keypath, index);

	    // ensure that if current is an array, that the current key
	    // is NOT an array index. This sort of thing needs to work:
	    // sift({'foo.0':42}, [{foo: [42]}]);
	    if (isArray(current) && isNaN(Number(k))) {
	      for (var i = 0, n = current.length; i < n; i++) {
	        findValues(get(current, i), keypath, index, current, values);
	      }
	    } else {
	      findValues(get(current, k), keypath, index + 1, current, values);
	    }
	  }

	  /**
	   */

	  function createNestedValidator(keypath, a) {
	    return { a: { k: keypath, nv: a }, v: nestedValidator };
	  }

	  /**
	   * flatten the query
	   */

	  function isVanillaObject(value) {
	    return value && value.constructor === Object;
	  }

	  function parse(query) {
	    query = comparable(query);

	    if (!query || !isVanillaObject(query)) { // cross browser support
	      query = { $eq: query };
	    }

	    var validators = [];

	    for (var key in query) {
	      var a = query[key];

	      if (key === '$options') {
	        continue;
	      }

	      if (OPERATORS[key]) {
	        if (prepare[key]) a = prepare[key](a, query);
	        validators.push(createValidator(comparable(a), OPERATORS[key]));
	      } else {

	        if (key.charCodeAt(0) === 36) {
	          throw new Error('Unknown operation ' + key);
	        }

	        validators.push(createNestedValidator(key.split('.'), parse(a)));
	      }
	    }

	    return validators.length === 1 ? validators[0] : createValidator(validators, OPERATORS.$and);
	  }

	  /**
	   */

	  function createRootValidator(query, getter) {
	    var validator = parse(query);
	    if (getter) {
	      validator = {
	        a: validator,
	        v: function(a, b, k, o) {
	          return validate(a, getter(b), k, o);
	        }
	      };
	    }
	    return validator;
	  }

	  /**
	   */

	  function sift(query, array, getter) {

	    if (isFunction(array)) {
	      getter = array;
	      array  = void 0;
	    }

	    var validator = createRootValidator(query, getter);

	    function filter(b, k, o) {
	      return validate(validator, b, k, o);
	    }

	    if (array) {
	      return array.filter(filter);
	    }

	    return filter;
	  }

	  /**
	   */

	  sift.use = function(plugin) {
	    if (isFunction(plugin)) return plugin(sift);
	    for (var key in plugin) {
	      /* istanbul ignore else */
	      if (key.charCodeAt(0) === 36) {
	        OPERATORS[key] = plugin[key];
	      }
	    }
	  };

	  /**
	   */

	  sift.indexOf = function(query, array, getter) {
	    return search(array, createRootValidator(query, getter));
	  };

	  /**
	   */

	  sift.compare = function(a, b) {
	    if(a===b) return 0;
	    if(typeof a === typeof b) {
	      if (a > b) {
	        return 1;
	      }
	      if (a < b) {
	        return -1;
	      }
	    }
	  };

	  /* istanbul ignore next */
	  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	    Object.defineProperty(exports, "__esModule", {
	      value: true
	    });

	    module.exports = sift;
	    exports['default'] = module.exports.default = sift;
	  }

	  /* istanbul ignore next */
	  if (typeof window !== 'undefined') {
	    window.sift = sift;
	  }
	})();


/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _utils = __webpack_require__(90);

	var _resource = __webpack_require__(148);

	var _resource2 = _interopRequireDefault(_resource);

	var _list = __webpack_require__(150);

	var _list2 = _interopRequireDefault(_list);

	var _strategies = __webpack_require__(151);

	var _strategies2 = _interopRequireDefault(_strategies);

	var _utils2 = __webpack_require__(149);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var debug = __webpack_require__(152)('feathers-reactive');

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
/* 148 */
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

	var _utils = __webpack_require__(149);

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	// The position of the params parameters for a service method so that we can extend them
	// default is 1
	var paramsPositions = exports.paramsPositions = {
	  update: 2,
	  patch: 2
	};

/***/ }),
/* 149 */
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

	var _utils = __webpack_require__(90);

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
/* 150 */
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

	var _utils = __webpack_require__(149);

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	module.exports = exports['default'];

/***/ }),
/* 151 */
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
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * This is the web browser implementation of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = __webpack_require__(153);
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

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))

/***/ }),
/* 153 */
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
	exports.humanize = __webpack_require__(154);

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
/* 154 */
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
/* 155 */,
/* 156 */,
/* 157 */,
/* 158 */,
/* 159 */,
/* 160 */,
/* 161 */,
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {// Copyright (c) Microsoft. All rights reserved. See License.txt in the project root for license information.

	;(function (root, factory) {
	  var objectTypes = {
	    'boolean': false,
	    'function': true,
	    'object': true,
	    'number': false,
	    'string': false,
	    'undefined': false
	  };

	  var root = (objectTypes[typeof window] && window) || this,
	    freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports,
	    freeModule = objectTypes[typeof module] && module && !module.nodeType && module,
	    moduleExports = freeModule && freeModule.exports === freeExports && freeExports,
	    freeGlobal = objectTypes[typeof global] && global;
	  
	  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
	    root = freeGlobal;
	  }

	  // Because of build optimizers
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(78), __webpack_require__(163), exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (Rx, angular, exports) {
	      root.Rx = factory(root, exports, Rx, angular);
	      return root.Rx;
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof module == 'object' && module && module.exports == freeExports) {
	    module.exports = factory(root, module.exports, require('rx'), require('angular'));
	  } else {
	    root.Rx = factory(root, {}, root.Rx, root.angular);
	  }
	}(this, function (global, exp, Rx, angular, undefined) {

	var errorObj = {e: {}};

	function tryCatcherGen(tryCatchTarget) {
	  return function tryCatcher() {
	    try {
	      return tryCatchTarget.apply(this, arguments);
	    } catch (e) {
	      errorObj.e = e;
	      return errorObj;
	    }
	  };
	}

	function tryCatch(fn) {
	  if (!angular.isFunction(fn)) { throw new TypeError('fn must be a function'); }
	  return tryCatcherGen(fn);
	}

	function thrower(e) {
	  throw e;
	}

	  /**
	   * @ngdoc overview
	   * @name rx
	   *
	   * @description
	   * The `rx` module contains essential components for reactive extension bindings
	   * for Angular apps.
	   *
	   * Installation of this module is just a cli command away:
	   *
	   * <pre>
	   * bower install rx-angular
	   * <pre>
	   *
	   * Simply declare it as dependency of your app like this:
	   *
	   * <pre>
	   * var app = angular.module('myApp', ['rx']);
	   * </pre>
	   */
	  var rxModule = angular.module('rx', []);

	  /**
	   * @ngdoc service
	   * @name rx.rx
	   *
	   * @requires $window
	   *
	   * @description
	   * Factory service that exposes the global `Rx` object to the Angular world.
	   */
	  rxModule.factory('rx', ['$window', function($window) {
	    $window.Rx || ($window.Rx = Rx);

	    var CreateObservableFunction = (function(__super__) {
	      Rx.internals.inherits(CreateObservableFunction, __super__);
	      function CreateObservableFunction(self, name, fn) {
	        this._self = self;
	        this._name = name;
	        this._fn = fn;
	        __super__.call(this);
	      }

	      CreateObservableFunction.prototype.subscribeCore = function (o) {
	        var fn = this._fn;
	        this._self[this._name] = function () {
	          var len = arguments.length, args = new Array(len);
	          for (var i = 0; i < len; i++) { args[i] = arguments[i]; }

	          if (angular.isFunction(fn)) {
	            var result = tryCatch(fn).apply(this, args);
	            if (result === errorObj) { return o.onError(result.e); }
	            o.onNext(result);
	          } else if (args.length === 1) {
	            o.onNext(args[0]);
	          } else {
	            o.onNext(args);
	          }
	        };

	        return new InnerDisposable(this._self, this._name);
	      };

	      function InnerDisposable(self, name) {
	        this._self = self;
	        this._name = name;
	        this.isDisposed = false;
	      }

	      InnerDisposable.prototype.dispose = function () {
	        if (!this.isDisposed) {
	          this.isDisposed = true;
	          delete this._self[this._name];
	        }
	      };

	      return CreateObservableFunction;
	    }(Rx.ObservableBase));

	    Rx.createObservableFunction = function (self, functionName, listener) {
	      return new CreateObservableFunction(self, functionName, listener).publish().refCount();
	    };

	    return $window.Rx;
	  }]);

	  /**
	  * @ngdoc service
	  * @name rx.observeOnSope
	  *
	  * @requires rx.rx
	  *
	  * @description
	  * An observer function that returns a function for a given `scope`,
	  * `watchExpression` and `objectEquality` object. The returned function
	  * delegates to an Angular watcher.
	  *
	  * @param {object} scope Scope object.
	  * @param {(string|object)} watchExpression Watch expression.
	  * @param {boolean} objectEquality Object to compare for object equality.
	  *
	  * @return {function} Factory function that creates obersables.
	  */
	  rxModule.factory('observeOnScope', ['rx', function(rx) {
	    var ObserveOnScope = (function(__super__) {
	      rx.internals.inherits(ObserveOnScope, __super__);
	      function ObserveOnScope(scope, expr, eq) {
	        this._scope = scope;
	        this._expr = expr;
	        this._eq = eq;
	        __super__.call(this);
	      }

	      function createListener(o) {
	        return function listener(newValue, oldValue) {
	          o.onNext({ oldValue: oldValue, newValue: newValue });
	        };
	      }

	      ObserveOnScope.prototype.subscribeCore = function (o) {
	        return new InnerDisposable(this._scope.$watch(this._expr, createListener(o), this._eq));
	      };

	      function InnerDisposable(fn) {
	        this._fn = fn;
	        this.isDisposed = false;
	      }

	      InnerDisposable.prototype.dispose = function () {
	        if (!this.isDisposed) {
	          this._fn();
	          this.isDisposed = true;
	        }
	      };

	      return ObserveOnScope;
	    }(rx.ObservableBase));

	    return function(scope, watchExpression, objectEquality) {
	      return new ObserveOnScope(scope, watchExpression, objectEquality);
	    };
	  }]);

	  function noop () { }

	  Rx.Observable.prototype.safeApply = function($scope, onNext, onError, onComplete){
	    onNext = angular.isFunction(onNext) ? onNext : noop;
	    onError = angular.isFunction(onError) ? onError : noop;
	    onComplete = angular.isFunction(onComplete) ? onComplete : noop;

	    return this
	      .takeWhile(function () {
	        return !$scope.$$destroyed;
	      })
	      .tap(
	        function (data){
	          ($scope.$$phase || $scope.$root.$$phase) ?
	            onNext(data) :
	            $scope.$apply(function () { onNext(data); });
	        },
	        function (error){
	          ($scope.$$phase || $scope.$root.$$phase) ?
	            onError(error) :
	            $scope.$apply(function () { onError(error); });
	        },
	        function (){
	          ($scope.$$phase || $scope.$root.$$phase) ?
	            onComplete() :
	            $scope.$apply(function () { onComplete(); });
	        });
	  };

	  rxModule.config(['$provide', function($provide) {
	    /**
	     * @ngdoc service
	     * @name rx.$rootScope
	     *
	     * @requires $delegate
	     *
	     * @description
	     * `$rootScope` decorator that extends the existing `$rootScope` service
	     * with additional methods. These methods are Rx related methods, such as
	     * methods to create observables or observable functions.
	     */
	    $provide.decorator('$rootScope', ['$delegate', 'rx', function($delegate, rx) {

	      Object.defineProperties($delegate.constructor.prototype, {
	        /**
	           * @ngdoc property
	           * @name rx.$rootScope.$toObservable
	           *
	           * @description
	           * Provides a method to create observable methods.
	           */
	          '$toObservable': {
	              /**
	               * @ngdoc function
	               * @name rx.$rootScope.$toObservable#value
	               *
	               * @description
	               * Creates an observable from a watchExpression.
	               *
	               * @param {(function|string)} watchExpression A watch expression.
	               * @param {boolean} objectEquality Compare object for equality.
	               *
	               * @return {object} Observable.
	               */
	              value: function(watchExpression, objectEquality) {
	                var scope = this;
	                return rx.Observable.create(function (observer) {
	                  // Create function to handle old and new Value
	                  function listener (newValue, oldValue) {
	                    observer.onNext({ oldValue: oldValue, newValue: newValue });
	                  }

	                  // Returns function which disconnects the $watch expression
	                  var disposable = rx.Disposable.create(scope.$watch(watchExpression, listener, objectEquality));

	                  scope.$on('$destroy', function(){
	                      disposable.dispose();
	                  });

	                  return disposable;
	                }).publish().refCount();
	              },
	              /**
	               * @ngdoc property
	               * @name rx.$rootScope.$toObservable#enumerable
	               *
	               * @description
	               * Enumerable flag.
	               */
	              enumerable: false,
	              configurable: true,
	              writable: true
	          },
	          /**
	           * @ngdoc property
	           * @name rx.$rootScope.$toObservableCollection
	           *
	           * @description
	           * Provides a method to create observable methods.
	           */
	          '$toObservableCollection': {
	              /**
	               * @ngdoc function
	               * @name rx.$rootScope.$toObservableCollection#value
	               *
	               * @description
	               * Creates an observable from a watchExpression.
	               *
	               * @param {(function|string)} watchExpression A watch expression.
	               *
	               * @return {object} Observable.
	               */
	              value: function(watchExpression) {
	                var scope = this;
	                return rx.Observable.create(function (observer) {
	                  // Create function to handle old and new Value
	                  function listener (newValue, oldValue) {
	                    observer.onNext({ oldValue: oldValue, newValue: newValue });
	                  }

	                  // Returns function which disconnects the $watch expression
	                  var disposable = rx.Disposable.create(scope.$watchCollection(watchExpression, listener));

	                  scope.$on('$destroy', function(){
	                    disposable.dispose();
	                  });

	                  return disposable;
	                }).publish().refCount();
	              },
	              /**
	               * @ngdoc property
	               * @name rx.$rootScope.$toObservableCollection#enumerable
	               *
	               * @description
	               * Enumerable flag.
	               */
	              enumerable: false,
	              configurable: true,
	              writable: true
	          },
	          /**
	           * @ngdoc property
	           * @name rx.$rootScope.$toObservableGroup
	           *
	           * @description
	           * Provides a method to create observable methods.
	           */
	          '$toObservableGroup': {
	              /**
	               * @ngdoc function
	               * @name rx.$rootScope.$toObservableGroup#value
	               *
	               * @description
	               * Creates an observable from a watchExpressions.
	               *
	               * @param {(function|string)} watchExpressions A watch expression.
	               *
	               * @return {object} Observable.
	               */
	              value: function(watchExpressions) {
	                var scope = this;
	                return rx.Observable.create(function (observer) {
	                  // Create function to handle old and new Value
	                  function listener (newValue, oldValue) {
	                    observer.onNext({ oldValue: oldValue, newValue: newValue });
	                  }

	                  // Returns function which disconnects the $watch expression
	                  var disposable = rx.Disposable.create(scope.$watchGroup(watchExpressions, listener));

	                  scope.$on('$destroy', function(){
	                    disposable.dispose();
	                  });

	                  return disposable;
	                }).publish().refCount();
	              },
	              /**
	               * @ngdoc property
	               * @name rx.$rootScope.$toObservableGroup#enumerable
	               *
	               * @description
	               * Enumerable flag.
	               */
	              enumerable: false,
	              configurable: true,
	              writable: true
	          },
	        /**
	         * @ngdoc property
	         * @name rx.$rootScope.$eventToObservable
	         *
	         * @description
	         * Provides a method to create observable methods.
	         */
	        '$eventToObservable': {
	          /**
	           * @ngdoc function
	           * @name rx.$rootScope.$eventToObservable#value
	           *
	           * @description
	           * Creates an Observable from an event which is fired on the local $scope.
	           * Expects an event name as the only input parameter.
	           *
	           * @param {string} event name
	           *
	           * @return {object} Observable object.
	           */
	          value: function(eventName, selector) {
	            var scope = this;
	            return rx.Observable.create(function (observer) {
	              function listener () {
	                var len = arguments.length, args = new Array(len);
	                for (var i = 0; i < len; i++) { args[i] = arguments[i]; }
	                if (angular.isFunction(selector)) {
	                  var result = tryCatch(selector).apply(null, args);
	                  if (result === errorObj) { return observer.onError(result.e); }
	                  observer.onNext(result);
	                } else if (args.length === 1) {
	                  observer.onNext(args[0]);
	                } else {
	                  observer.onNext(args);
	                }
	              }

	              // Returns function which disconnects from the event binding
	              var disposable = rx.Disposable.create(scope.$on(eventName, listener));

	              scope.$on('$destroy', function(){ disposable.dispose(); });

	              return disposable;
	            }).publish().refCount();
	          },
	          /**
	           * @ngdoc property
	           * @name rx.$rootScope.$eventToObservable#enumerable
	           *
	           * @description
	           * Enumerable flag.
	           */
	          enumerable: false,
	          configurable: true,
	          writable: true
	        },
	        /**
	         * @ngdoc property
	         * @name rx.$rootScope.$createObservableFunction
	         *
	         * @description
	         * Provides a method to create obsersables from functions.
	         */
	        '$createObservableFunction': {
	          /**
	           * @ngdoc function
	           * @name rx.$rootScope.$createObservableFunction#value
	           *
	           * @description
	           * Creates an observable from a given function.
	           *
	           * @param {string} functionName A function name to observe.
	           * @param {function} listener A listener function that gets executed.
	           *
	           * @return {function} Remove listener function.
	           */
	          value: function(functionName, listener) {
	            return rx.createObservableFunction(this, functionName, listener);
	          },
	          /**
	           * @ngdoc property
	           * @name rx.$rootScope.$createObservableFunction#enumerable
	           *
	           * @description
	           * Enumerable flag.
	           */
	          enumerable: false,
	          configurable: true,
	          writable: true
	        },
	        /**
	         * @ngdoc function
	         * @name rx.$rootScope.$digestObservables#value
	         *
	         * @description
	         * Digests the specified observables when they produce new values.
	         * The scope variable / assignable expression specified by the observable's key
	         *   is set to the new value.
	         *
	         * @param {object.<string, Rx.Observable>} obj A map where keys are scope properties
	         *   (assignable expressions) and values are observables.
	         *
	         * @return {Rx.Observable.<{observable: Rx.Observable, expression: string, value: object}>}
	         *   Observable of change objects.
	         */
	        '$digestObservables': {
	          value: function(observables) {
	            var scope = this;
	            return rx.Observable.pairs(observables)
	              .flatMap(function(pair) {
	                return pair[1].digest(scope, pair[0])
	                  .map(function(val) {
	                    return {
	                      observable: pair[1],
	                      expression: pair[0],
	                      value: val
	                    };
	                  });
	              }).publish().refCount();
	          },
	          /**
	           * @ngdoc property
	           * @name rx.$rootScope.digestObservables#enumerable
	           *
	           * @description
	           * Enumerable flag.
	           */
	          enumerable: false,
	          configurable: true,
	          writable: true
	        }
	      });

	      return $delegate;
	    }]);
	  }]);

	  rxModule.run(['$parse', function($parse) {

	    var DigestObservable = (function(__super__) {
	      Rx.internals.inherits(DigestObservable, __super__);
	      function DigestObservable(source, $scope, prop) {
	        this.source = source;
	        this.$scope = $scope;
	        this.prop = prop;
	        __super__.call(this);
	      }

	      DigestObservable.prototype.subscribeCore = function (o) {
	        var propSetter = $parse(this.prop).assign;
	        if (!propSetter) {
	          return o.onError(new Error('Property or expression is not assignable.'));
	        }

	        var m = new Rx.SingleAssignmentDisposable();
	        m.setDisposable(this.source.subscribe(new DigestObserver(o, this.$scope, propSetter)));
	        this.$scope.$on('$destroy', function () { m.dispose(); });

	        return m;
	      };

	      return DigestObservable;
	    }(Rx.ObservableBase));

	    var DigestObserver = (function(__super__) {
	      Rx.internals.inherits(DigestObserver, __super__);
	      function DigestObserver(o, $scope, propSetter) {
	        this.o = o;
	        this.$scope = $scope;
	        this.propSetter = propSetter;
	        __super__.call(this);
	      }

	      DigestObserver.prototype.next = function (x) {
	        if (!this.$scope.$$phase) {
	          var _this = this;
	          this.$scope.$apply(function() {
	            _this.propSetter(_this.$scope, x);
	          });
	        } else {
	          this.propSetter(this.$scope, x);
	        }
	        this.o.onNext(x);
	      };
	      DigestObserver.prototype.error = function (e) { this.o.onError(e); };
	      DigestObserver.prototype.completed = function () { this.o.onCompleted(); };

	      return DigestObserver;
	    }(Rx.internals.AbstractObserver));

	    Rx.Observable.prototype.digest = function($scope, prop) {
	      return new DigestObservable(this, $scope, prop);
	    };
	  }]);

	  var ScopeScheduler = Rx.ScopeScheduler = (function (__super__) {
	    function ScopeScheduler($scope) {
	      this.$scope = $scope;
	      __super__.call(this);
	    }

	    Rx.internals.inherits(ScopeScheduler, __super__);

	    ScopeScheduler.prototype.schedule = function (state, action) {
	      if (this.$scope.$$destroyed) { return Rx.Disposable.empty; }

	      var sad = new Rx.SingleAssignmentDisposable();
	      var $scope = this.$scope;

	      if ($scope.$$phase || $scope.$root.$$phase) {
	        sad.setDisposable(Rx.Disposable._fixup(state(action)));
	      } else {
	        $scope.$apply.call(
	          $scope,
	          function () { sad.setDisposable(Rx.Disposable._fixup(state(action))); }
	        );
	      }
	    };

	    ScopeScheduler.prototype._scheduleFuture = function (state, dueTime, action) {
	      if (this.$scope.$$destroyed) { return Rx.Disposable.empty; }

	      var sad = new Rx.SingleAssignmentDisposable();
	      var $scope = this.$scope;

	      var id = setTimeout(function () {
	        if ($scope.$$destroyed || sad.isDisposed) { return clearTimeout(id); }

	        if ($scope.$$phase || $scope.$root.$$phase) {
	          sad.setDisposable(Rx.Disposable._fixup(state(action)));
	        } else {
	          $scope.$apply.call(
	            $scope,
	            function () { sad.setDisposable(Rx.Disposable._fixup(state(action))); }
	          );
	        }
	      }, dueTime);

	      return new Rx.BinaryDisposable(
	        sad,
	        Rx.Disposable.create(function () { clearTimeout(id); })
	      );
	    };

	    ScopeScheduler.prototype.schedulePeriodic = function (state, period, action) {
	      if (this.$scope.$$destroyed) { return Rx.Disposable.empty; }

	      period = Rx.Scheduler.normalize(period);

	      var $scope = this.$scope;
	      var s = state;

	      var id = setInterval(function () {
	        if ($scope.$$destroyed) { return clearInterval(id); }

	        if ($scope.$$phase || $scope.$root.$$phase) {
	          s = action(s);
	        } else {
	          $scope.$apply.call($scope, function () { s = action(s); });
	        }
	      }, period);

	      return Rx.Disposable.create(function () { clearInterval(id); });
	    };

	    return ScopeScheduler;
	  }(Rx.Scheduler));

	  return Rx;
	}));
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)(module), (function() { return this; }())))

/***/ }),
/* 163 */
/***/ (function(module, exports) {

	module.exports = angular;

/***/ }),
/* 164 */,
/* 165 */,
/* 166 */,
/* 167 */,
/* 168 */,
/* 169 */,
/* 170 */,
/* 171 */,
/* 172 */,
/* 173 */,
/* 174 */,
/* 175 */,
/* 176 */,
/* 177 */,
/* 178 */,
/* 179 */,
/* 180 */,
/* 181 */,
/* 182 */,
/* 183 */,
/* 184 */,
/* 185 */,
/* 186 */,
/* 187 */,
/* 188 */,
/* 189 */,
/* 190 */,
/* 191 */,
/* 192 */,
/* 193 */,
/* 194 */,
/* 195 */,
/* 196 */,
/* 197 */,
/* 198 */,
/* 199 */,
/* 200 */,
/* 201 */,
/* 202 */,
/* 203 */,
/* 204 */,
/* 205 */,
/* 206 */,
/* 207 */,
/* 208 */,
/* 209 */,
/* 210 */,
/* 211 */
/***/ (function(module, exports) {

	/*! SVG Morpheus v0.3.0 License: MIT */var SVGMorpheus=function(){"use strict";function t(t,e,r){var a,s={};for(a in t)switch(a){case"fill":case"stroke":s[a]=n(t[a]),s[a].r=t[a].r+(e[a].r-t[a].r)*r,s[a].g=t[a].g+(e[a].g-t[a].g)*r,s[a].b=t[a].b+(e[a].b-t[a].b)*r,s[a].opacity=t[a].opacity+(e[a].opacity-t[a].opacity)*r;break;case"opacity":case"fill-opacity":case"stroke-opacity":case"stroke-width":s[a]=t[a]+(e[a]-t[a])*r}return s}function e(t){var e,r={};for(e in t)switch(e){case"fill":case"stroke":r[e]=F(t[e]);break;case"opacity":case"fill-opacity":case"stroke-opacity":case"stroke-width":r[e]=t[e]}return r}function r(t,e){var r,a=[{},{}];for(r in t)switch(r){case"fill":case"stroke":a[0][r]=L(t[r]),void 0===e[r]&&(a[1][r]=L(t[r]),a[1][r].opacity=0);break;case"opacity":case"fill-opacity":case"stroke-opacity":case"stroke-width":a[0][r]=t[r],void 0===e[r]&&(a[1][r]=1)}for(r in e)switch(r){case"fill":case"stroke":a[1][r]=L(e[r]),void 0===t[r]&&(a[0][r]=L(e[r]),a[0][r].opacity=0);break;case"opacity":case"fill-opacity":case"stroke-opacity":case"stroke-width":a[1][r]=e[r],void 0===t[r]&&(a[0][r]=1)}return a}function a(t,e,r){var a={};for(var s in t)switch(s){case"rotate":a[s]=[0,0,0];for(var o=0;3>o;o++)a[s][o]=t[s][o]+(e[s][o]-t[s][o])*r}return a}function s(t){var e="";return t.rotate&&(e+="rotate("+t.rotate.join(" ")+")"),e}function o(t,e,r){for(var a=[],s=0,o=t.length;o>s;s++){a.push([t[s][0]]);for(var n=1,i=t[s].length;i>n;n++)a[s].push(t[s][n]+(e[s][n]-t[s][n])*r)}return a}function n(t){var e;if(t instanceof Array){e=[];for(var r=0,a=t.length;a>r;r++)e[r]=n(t[r]);return e}if(t instanceof Object){e={};for(var s in t)t.hasOwnProperty(s)&&(e[s]=n(t[s]));return e}return t}function i(t,e,r){if(!t)throw new Error('SVGMorpheus > "element" is required');if("string"==typeof t&&(t=document.querySelector(t),!t))throw new Error('SVGMorpheus > "element" query is not related to an existing DOM node');if(e&&typeof e!=typeof{})throw new Error('SVGMorpheus > "options" parameter must be an object');if(e=e||{},r&&"function"!=typeof r)throw new Error('SVGMorpheus > "callback" parameter must be a function');var a=this;this._icons={},this._curIconId=e.iconId||"",this._toIconId="",this._curIconItems=[],this._fromIconItems=[],this._toIconItems=[],this._morphNodes=[],this._morphG,this._startTime,this._defDuration=e.duration||750,this._defEasing=e.easing||"quad-in-out",this._defRotation=e.rotation||"clock",this._defCallback=r||function(){},this._duration=this._defDuration,this._easing=this._defEasing,this._rotation=this._defRotation,this._callback=this._defCallback,this._rafid,this._fnTick=function(t){a._startTime||(a._startTime=t);var e=Math.min((t-a._startTime)/a._duration,1);a._updateAnimationProgress(e),1>e?a._rafid=h(a._fnTick):""!=a._toIconId&&a._animationEnd()},this._svgDoc="SVG"===t.nodeName.toUpperCase()?t:t.getSVGDocument(),this._svgDoc?a._init():t.addEventListener("load",function(){a._svgDoc=t.getSVGDocument(),a._init()},!1)}var c={};c["circ-in"]=function(t){return-1*(Math.sqrt(1-t*t)-1)},c["circ-out"]=function(t){return Math.sqrt(1-(t-=1)*t)},c["circ-in-out"]=function(t){return(t/=.5)<1?-0.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-=2)*t)+1)},c["cubic-in"]=function(t){return t*t*t},c["cubic-out"]=function(t){return--t*t*t+1},c["cubic-in-out"]=function(t){return.5>t?4*t*t*t:(t-1)*(2*t-2)*(2*t-2)+1},c["elastic-in"]=function(t){var e=1.70158,r=0,a=1;if(0==t)return 0;if(1==t)return 1;if(r||(r=.3),a<Math.abs(1)){a=1;var e=r/4}else var e=r/(2*Math.PI)*Math.asin(1/a);return-(a*Math.pow(2,10*(t-=1))*Math.sin(2*(t-e)*Math.PI/r))},c["elastic-out"]=function(t){var e=1.70158,r=0,a=1;if(0==t)return 0;if(1==t)return 1;if(r||(r=.3),a<Math.abs(1)){a=1;var e=r/4}else var e=r/(2*Math.PI)*Math.asin(1/a);return a*Math.pow(2,-10*t)*Math.sin(2*(t-e)*Math.PI/r)+1},c["elastic-in-out"]=function(t){var e=1.70158,r=0,a=1;if(0==t)return 0;if(2==(t/=.5))return 1;if(r||(r=.3*1.5),a<Math.abs(1)){a=1;var e=r/4}else var e=r/(2*Math.PI)*Math.asin(1/a);return 1>t?-.5*a*Math.pow(2,10*(t-=1))*Math.sin(2*(t-e)*Math.PI/r):a*Math.pow(2,-10*(t-=1))*Math.sin(2*(t-e)*Math.PI/r)*.5+1},c["expo-in"]=function(t){return 0==t?0:Math.pow(2,10*(t-1))},c["expo-out"]=function(t){return 1==t?1:1-Math.pow(2,-10*t)},c["expo-in-out"]=function(t){return 0==t?0:1==t?1:(t/=.5)<1?.5*Math.pow(2,10*(t-1)):.5*(-Math.pow(2,-10*--t)+2)},c.linear=function(t){return t},c["quad-in"]=function(t){return t*t},c["quad-out"]=function(t){return t*(2-t)},c["quad-in-out"]=function(t){return.5>t?2*t*t:-1+(4-2*t)*t},c["quart-in"]=function(t){return t*t*t*t},c["quart-out"]=function(t){return 1- --t*t*t*t},c["quart-in-out"]=function(t){return.5>t?8*t*t*t*t:1-8*--t*t*t*t},c["quint-in"]=function(t){return t*t*t*t*t},c["quint-out"]=function(t){return 1+--t*t*t*t*t},c["quint-in-out"]=function(t){return.5>t?16*t*t*t*t*t:1+16*--t*t*t*t*t},c["sine-in"]=function(t){return 1-Math.cos(t*(Math.PI/2))},c["sine-out"]=function(t){return Math.sin(t*(Math.PI/2))},c["sine-in-out"]=function(t){return.5*(1-Math.cos(Math.PI*t))};var h=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.oRequestAnimationFrame,u=window.cancelAnimationFrame||window.mozCancelAnimationFrame||window.webkitCancelAnimationFrame||window.oCancelAnimationFrame,l="	\n\f\r   ᠎             　\u2028\u2029",p=new RegExp("([a-z])["+l+",]*((-?\\d*\\.?\\d*(?:e[\\-+]?\\d+)?["+l+"]*,?["+l+"]*)+)","ig"),f=new RegExp("(-?\\d*\\.?\\d*(?:e[\\-+]?\\d+)?)["+l+"]*,?["+l+"]*","ig"),m=function(t){if(!t)return null;if(typeof t==typeof[])return t;var e={a:7,c:6,o:2,h:1,l:2,m:2,r:4,q:4,s:4,t:2,v:1,u:3,z:0},r=[];return String(t).replace(p,function(t,a,s){var o=[],n=a.toLowerCase();if(s.replace(f,function(t,e){e&&o.push(+e)}),"m"==n&&o.length>2&&(r.push([a].concat(o.splice(0,2))),n="l",a="m"==a?"l":"L"),"o"==n&&1==o.length&&r.push([a,o[0]]),"r"==n)r.push([a].concat(o));else for(;o.length>=e[n]&&(r.push([a].concat(o.splice(0,e[n]))),e[n]););}),r},y=function(t,e){for(var r=[],a=0,s=t.length;s-2*!e>a;a+=2){var o=[{x:+t[a-2],y:+t[a-1]},{x:+t[a],y:+t[a+1]},{x:+t[a+2],y:+t[a+3]},{x:+t[a+4],y:+t[a+5]}];e?a?s-4==a?o[3]={x:+t[0],y:+t[1]}:s-2==a&&(o[2]={x:+t[0],y:+t[1]},o[3]={x:+t[2],y:+t[3]}):o[0]={x:+t[s-2],y:+t[s-1]}:s-4==a?o[3]=o[2]:a||(o[0]={x:+t[a],y:+t[a+1]}),r.push(["C",(-o[0].x+6*o[1].x+o[2].x)/6,(-o[0].y+6*o[1].y+o[2].y)/6,(o[1].x+6*o[2].x-o[3].x)/6,(o[1].y+6*o[2].y-o[3].y)/6,o[2].x,o[2].y])}return r},I=function(t,e,r,a,s){if(null==s&&null==a&&(a=r),t=+t,e=+e,r=+r,a=+a,null!=s)var o=Math.PI/180,n=t+r*Math.cos(-a*o),i=t+r*Math.cos(-s*o),c=e+r*Math.sin(-a*o),h=e+r*Math.sin(-s*o),u=[["M",n,c],["A",r,r,0,+(s-a>180),0,i,h]];else u=[["M",t,e],["m",0,-a],["a",r,a,0,1,1,0,2*a],["a",r,a,0,1,1,0,-2*a],["z"]];return u},d=function(t){if(t=m(t),!t||!t.length)return[["M",0,0]];var e,r=[],a=0,s=0,o=0,n=0,i=0;"M"==t[0][0]&&(a=+t[0][1],s=+t[0][2],o=a,n=s,i++,r[0]=["M",a,s]);for(var c,h,u=3==t.length&&"M"==t[0][0]&&"R"==t[1][0].toUpperCase()&&"Z"==t[2][0].toUpperCase(),l=i,p=t.length;p>l;l++){if(r.push(c=[]),h=t[l],e=h[0],e!=e.toUpperCase())switch(c[0]=e.toUpperCase(),c[0]){case"A":c[1]=h[1],c[2]=h[2],c[3]=h[3],c[4]=h[4],c[5]=h[5],c[6]=+h[6]+a,c[7]=+h[7]+s;break;case"V":c[1]=+h[1]+s;break;case"H":c[1]=+h[1]+a;break;case"R":for(var f=[a,s].concat(h.slice(1)),d=2,_=f.length;_>d;d++)f[d]=+f[d]+a,f[++d]=+f[d]+s;r.pop(),r=r.concat(y(f,u));break;case"O":r.pop(),f=I(a,s,h[1],h[2]),f.push(f[0]),r=r.concat(f);break;case"U":r.pop(),r=r.concat(I(a,s,h[1],h[2],h[3])),c=["U"].concat(r[r.length-1].slice(-2));break;case"M":o=+h[1]+a,n=+h[2]+s;default:for(d=1,_=h.length;_>d;d++)c[d]=+h[d]+(d%2?a:s)}else if("R"==e)f=[a,s].concat(h.slice(1)),r.pop(),r=r.concat(y(f,u)),c=["R"].concat(h.slice(-2));else if("O"==e)r.pop(),f=I(a,s,h[1],h[2]),f.push(f[0]),r=r.concat(f);else if("U"==e)r.pop(),r=r.concat(I(a,s,h[1],h[2],h[3])),c=["U"].concat(r[r.length-1].slice(-2));else for(var g=0,M=h.length;M>g;g++)c[g]=h[g];if(e=e.toUpperCase(),"O"!=e)switch(c[0]){case"Z":a=+o,s=+n;break;case"H":a=c[1];break;case"V":s=c[1];break;case"M":o=c[c.length-2],n=c[c.length-1];default:a=c[c.length-2],s=c[c.length-1]}}return r},_=function(t,e,r,a){return[t,e,r,a,r,a]},g=function(t,e,r,a,s,o){var n=1/3,i=2/3;return[n*t+i*r,n*e+i*a,n*s+i*r,n*o+i*a,s,o]},M=function(t,e,r,a,s,o,n,i,c,h){var u,l=120*Math.PI/180,p=Math.PI/180*(+s||0),f=[],m=function(t,e,r){var a=t*Math.cos(r)-e*Math.sin(r),s=t*Math.sin(r)+e*Math.cos(r);return{x:a,y:s}};if(h)w=h[0],k=h[1],v=h[2],x=h[3];else{u=m(t,e,-p),t=u.x,e=u.y,u=m(i,c,-p),i=u.x,c=u.y;var y=(Math.cos(Math.PI/180*s),Math.sin(Math.PI/180*s),(t-i)/2),I=(e-c)/2,d=y*y/(r*r)+I*I/(a*a);d>1&&(d=Math.sqrt(d),r=d*r,a=d*a);var _=r*r,g=a*a,b=(o==n?-1:1)*Math.sqrt(Math.abs((_*g-_*I*I-g*y*y)/(_*I*I+g*y*y))),v=b*r*I/a+(t+i)/2,x=b*-a*y/r+(e+c)/2,w=Math.asin(((e-x)/a).toFixed(9)),k=Math.asin(((c-x)/a).toFixed(9));w=v>t?Math.PI-w:w,k=v>i?Math.PI-k:k,0>w&&(w=2*Math.PI+w),0>k&&(k=2*Math.PI+k),n&&w>k&&(w-=2*Math.PI),!n&&k>w&&(k-=2*Math.PI)}var A=k-w;if(Math.abs(A)>l){var C=k,N=i,q=c;k=w+l*(n&&k>w?1:-1),i=v+r*Math.cos(k),c=x+a*Math.sin(k),f=M(i,c,r,a,s,0,n,N,q,[k,C,v,x])}A=k-w;var P=Math.cos(w),F=Math.sin(w),E=Math.cos(k),S=Math.sin(k),G=Math.tan(A/4),D=4/3*r*G,L=4/3*a*G,T=[t,e],V=[t+D*F,e-L*P],R=[i+D*S,c-L*E],U=[i,c];if(V[0]=2*T[0]-V[0],V[1]=2*T[1]-V[1],h)return[V,R,U].concat(f);f=[V,R,U].concat(f).join().split(",");for(var z=[],O=0,j=f.length;j>O;O++)z[O]=O%2?m(f[O-1],f[O],p).y:m(f[O],f[O+1],p).x;return z},b=function(t,e){for(var r=d(t),a=e&&d(e),s={x:0,y:0,bx:0,by:0,X:0,Y:0,qx:null,qy:null},o={x:0,y:0,bx:0,by:0,X:0,Y:0,qx:null,qy:null},n=(function(t,e,r){var a,s;if(!t)return["C",e.x,e.y,e.x,e.y,e.x,e.y];switch(!(t[0]in{T:1,Q:1})&&(e.qx=e.qy=null),t[0]){case"M":e.X=t[1],e.Y=t[2];break;case"A":t=["C"].concat(M.apply(0,[e.x,e.y].concat(t.slice(1))));break;case"S":"C"==r||"S"==r?(a=2*e.x-e.bx,s=2*e.y-e.by):(a=e.x,s=e.y),t=["C",a,s].concat(t.slice(1));break;case"T":"Q"==r||"T"==r?(e.qx=2*e.x-e.qx,e.qy=2*e.y-e.qy):(e.qx=e.x,e.qy=e.y),t=["C"].concat(g(e.x,e.y,e.qx,e.qy,t[1],t[2]));break;case"Q":e.qx=t[1],e.qy=t[2],t=["C"].concat(g(e.x,e.y,t[1],t[2],t[3],t[4]));break;case"L":t=["C"].concat(_(e.x,e.y,t[1],t[2]));break;case"H":t=["C"].concat(_(e.x,e.y,t[1],e.y));break;case"V":t=["C"].concat(_(e.x,e.y,e.x,t[1]));break;case"Z":t=["C"].concat(_(e.x,e.y,e.X,e.Y))}return t}),i=function(t,e){if(t[e].length>7){t[e].shift();for(var s=t[e];s.length;)h[e]="A",a&&(u[e]="A"),t.splice(e++,0,["C"].concat(s.splice(0,6)));t.splice(e,1),m=Math.max(r.length,a&&a.length||0)}},c=function(t,e,s,o,n){t&&e&&"M"==t[n][0]&&"M"!=e[n][0]&&(e.splice(n,0,["M",o.x,o.y]),s.bx=0,s.by=0,s.x=t[n][1],s.y=t[n][2],m=Math.max(r.length,a&&a.length||0))},h=[],u=[],l="",p="",f=0,m=Math.max(r.length,a&&a.length||0);m>f;f++){r[f]&&(l=r[f][0]),"C"!=l&&(h[f]=l,f&&(p=h[f-1])),r[f]=n(r[f],s,p),"A"!=h[f]&&"C"==l&&(h[f]="C"),i(r,f),a&&(a[f]&&(l=a[f][0]),"C"!=l&&(u[f]=l,f&&(p=u[f-1])),a[f]=n(a[f],o,p),"A"!=u[f]&&"C"==l&&(u[f]="C"),i(a,f)),c(r,a,s,o,f),c(a,r,o,s,f);var y=r[f],I=a&&a[f],b=y.length,v=a&&I.length;s.x=y[b-2],s.y=y[b-1],s.bx=parseFloat(y[b-4])||s.x,s.by=parseFloat(y[b-3])||s.y,o.bx=a&&(parseFloat(I[v-4])||o.x),o.by=a&&(parseFloat(I[v-3])||o.y),o.x=a&&I[v-2],o.y=a&&I[v-1]}return a?[r,a]:r},v=function(t,e,r,a){return null==t&&(t=e=r=a=0),null==e&&(e=t.y,r=t.width,a=t.height,t=t.x),{x:t,y:e,w:r,h:a,cx:t+r/2,cy:e+a/2}},x=function(t,e,r,a,s,o,n,i){for(var c,h,u,l,p,f,m,y,I=[],d=[[],[]],_=0;2>_;++_)if(0==_?(h=6*t-12*r+6*s,c=-3*t+9*r-9*s+3*n,u=3*r-3*t):(h=6*e-12*a+6*o,c=-3*e+9*a-9*o+3*i,u=3*a-3*e),Math.abs(c)<1e-12){if(Math.abs(h)<1e-12)continue;l=-u/h,l>0&&1>l&&I.push(l)}else m=h*h-4*u*c,y=Math.sqrt(m),0>m||(p=(-h+y)/(2*c),p>0&&1>p&&I.push(p),f=(-h-y)/(2*c),f>0&&1>f&&I.push(f));for(var g,M=I.length,b=M;M--;)l=I[M],g=1-l,d[0][M]=g*g*g*t+3*g*g*l*r+3*g*l*l*s+l*l*l*n,d[1][M]=g*g*g*e+3*g*g*l*a+3*g*l*l*o+l*l*l*i;return d[0][b]=t,d[1][b]=e,d[0][b+1]=n,d[1][b+1]=i,d[0].length=d[1].length=b+2,{min:{x:Math.min.apply(0,d[0]),y:Math.min.apply(0,d[1])},max:{x:Math.max.apply(0,d[0]),y:Math.max.apply(0,d[1])}}},w=function(t){for(var e,r=0,a=0,s=[],o=[],n=0,i=t.length;i>n;n++)if(e=t[n],"M"==e[0])r=e[1],a=e[2],s.push(r),o.push(a);else{var c=x(r,a,e[1],e[2],e[3],e[4],e[5],e[6]);s=s.concat(c.min.x,c.max.x),o=o.concat(c.min.y,c.max.y),r=e[5],a=e[6]}var h=Math.min.apply(0,s),u=Math.min.apply(0,o),l=Math.max.apply(0,s),p=Math.max.apply(0,o),f=v(h,u,l-h,p-u);return f},k=/,?([a-z]),?/gi,A=function(t){return t.join(",").replace(k,"$1")},C={hs:1,rg:1},N="hasOwnProperty",q=/^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?%?)\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?%?)\s*\))\s*$/i,P=new RegExp("["+l+"]*,["+l+"]*"),F=function(t){var e=Math.round;return"rgba("+[e(t.r),e(t.g),e(t.b),+t.opacity.toFixed(2)]+")"},E=function(t){var e=window.document.getElementsByTagName("head")[0]||window.document.getElementsByTagName("svg")[0],r="rgb(255, 0, 0)";return E=function(t){if("red"==t.toLowerCase())return r;e.style.color=r,e.style.color=t;var a=window.document.defaultView.getComputedStyle(e,"").getPropertyValue("color");return a==r?null:a},E(t)},S=function(t,e,r,a){t=Math.round(255*t),e=Math.round(255*e),r=Math.round(255*r);var s={r:t,g:e,b:r,opacity:isFinite(a)?a:1};return s},G=function(t,e,r,a){typeof t==typeof{}&&"h"in t&&"s"in t&&"b"in t&&(r=t.b,e=t.s,t=t.h,a=t.o),t*=360;var s,o,n,i,c;return t=t%360/60,c=r*e,i=c*(1-Math.abs(t%2-1)),s=o=n=r-c,t=~~t,s+=[c,i,0,0,i,c][t],o+=[i,c,c,i,0,0][t],n+=[0,0,i,c,c,i][t],S(s,o,n,a)},D=function(t,e,r,a){typeof t==typeof{}&&"h"in t&&"s"in t&&"l"in t&&(r=t.l,e=t.s,t=t.h),(t>1||e>1||r>1)&&(t/=360,e/=100,r/=100),t*=360;var s,o,n,i,c;return t=t%360/60,c=2*e*(.5>r?r:1-r),i=c*(1-Math.abs(t%2-1)),s=o=n=r-c/2,t=~~t,s+=[c,i,0,0,i,c][t],o+=[i,c,c,i,0,0][t],n+=[0,0,i,c,c,i][t],S(s,o,n,a)},L=function(t){if(!t||(t=String(t)).indexOf("-")+1)return{r:-1,g:-1,b:-1,opacity:-1,error:1};if("none"==t)return{r:-1,g:-1,b:-1,opacity:-1};if(!(C[N](t.toLowerCase().substring(0,2))||"#"==t.charAt())&&(t=E(t)),!t)return{r:-1,g:-1,b:-1,opacity:-1,error:1};var e,r,a,s,o,n,i=t.match(q);return i?(i[2]&&(a=parseInt(i[2].substring(5),16),r=parseInt(i[2].substring(3,5),16),e=parseInt(i[2].substring(1,3),16)),i[3]&&(a=parseInt((o=i[3].charAt(3))+o,16),r=parseInt((o=i[3].charAt(2))+o,16),e=parseInt((o=i[3].charAt(1))+o,16)),i[4]&&(n=i[4].split(P),e=parseFloat(n[0]),"%"==n[0].slice(-1)&&(e*=2.55),r=parseFloat(n[1]),"%"==n[1].slice(-1)&&(r*=2.55),a=parseFloat(n[2]),"%"==n[2].slice(-1)&&(a*=2.55),"rgba"==i[1].toLowerCase().slice(0,4)&&(s=parseFloat(n[3])),n[3]&&"%"==n[3].slice(-1)&&(s/=100)),i[5]?(n=i[5].split(P),e=parseFloat(n[0]),"%"==n[0].slice(-1)&&(e/=100),r=parseFloat(n[1]),"%"==n[1].slice(-1)&&(r/=100),a=parseFloat(n[2]),"%"==n[2].slice(-1)&&(a/=100),("deg"==n[0].slice(-3)||"°"==n[0].slice(-1))&&(e/=360),"hsba"==i[1].toLowerCase().slice(0,4)&&(s=parseFloat(n[3])),n[3]&&"%"==n[3].slice(-1)&&(s/=100),G(e,r,a,s)):i[6]?(n=i[6].split(P),e=parseFloat(n[0]),"%"==n[0].slice(-1)&&(e/=100),r=parseFloat(n[1]),"%"==n[1].slice(-1)&&(r/=100),a=parseFloat(n[2]),"%"==n[2].slice(-1)&&(a/=100),("deg"==n[0].slice(-3)||"°"==n[0].slice(-1))&&(e/=360),"hsla"==i[1].toLowerCase().slice(0,4)&&(s=parseFloat(n[3])),n[3]&&"%"==n[3].slice(-1)&&(s/=100),D(e,r,a,s)):(e=Math.min(Math.round(e),255),r=Math.min(Math.round(r),255),a=Math.min(Math.round(a),255),s=Math.min(Math.max(s,0),1),i={r:e,g:r,b:a},i.opacity=isFinite(s)?s:1,i)):{r:-1,g:-1,b:-1,opacity:-1,error:1}};return i.prototype._init=function(){if("SVG"!==this._svgDoc.nodeName.toUpperCase()&&(this._svgDoc=this._svgDoc.getElementsByTagName("svg")[0]),this._svgDoc){var t,e,r,a,s,o,n,i,c="";for(t=this._svgDoc.childNodes.length-1;t>=0;t--){var h=this._svgDoc.childNodes[t];if("G"===h.nodeName.toUpperCase()&&(r=h.getAttribute("id"))){for(a=[],o=0,n=h.childNodes.length;n>o;o++){var u=h.childNodes[o];switch(s={path:"",attrs:{},style:{}},u.nodeName.toUpperCase()){case"PATH":s.path=u.getAttribute("d");break;case"CIRCLE":var l=1*u.getAttribute("cx"),p=1*u.getAttribute("cy"),f=1*u.getAttribute("r");s.path="M"+(l-f)+","+p+"a"+f+","+f+" 0 1,0 "+2*f+",0a"+f+","+f+" 0 1,0 -"+2*f+",0z";break;case"ELLIPSE":var l=1*u.getAttribute("cx"),p=1*u.getAttribute("cy"),m=1*u.getAttribute("rx"),y=1*u.getAttribute("ry");s.path="M"+(l-m)+","+p+"a"+m+","+y+" 0 1,0 "+2*m+",0a"+m+","+y+" 0 1,0 -"+2*m+",0z";break;case"RECT":var I=1*u.getAttribute("x"),d=1*u.getAttribute("y"),_=1*u.getAttribute("width"),g=1*u.getAttribute("height"),m=1*u.getAttribute("rx"),y=1*u.getAttribute("ry");s.path=m||y?"M"+(I+m)+","+d+"l"+(_-2*m)+",0a"+m+","+y+" 0 0,1 "+m+","+y+"l0,"+(g-2*y)+"a"+m+","+y+" 0 0,1 -"+m+","+y+"l"+(2*m-_)+",0a"+m+","+y+" 0 0,1 -"+m+",-"+y+"l0,"+(2*y-g)+"a"+m+","+y+" 0 0,1 "+m+",-"+y+"z":"M"+I+","+d+"l"+_+",0l0,"+g+"l-"+_+",0z";break;case"POLYGON":for(var M=u.getAttribute("points"),b=M.split(/\s+/),v="",x=0,e=b.length;e>x;x++)v+=(x&&"L"||"M")+b[x];s.path=v+"z";break;case"LINE":var w=1*u.getAttribute("x1"),k=1*u.getAttribute("y1"),A=1*u.getAttribute("x2"),C=1*u.getAttribute("y2");s.path="M"+w+","+k+"L"+A+","+C+"z"}if(""!=s.path){for(var x=0,N=u.attributes.length;N>x;x++){var q=u.attributes[x];if(q.specified){var P=q.name.toLowerCase();switch(P){case"fill":case"fill-opacity":case"opacity":case"stroke":case"stroke-opacity":case"stroke-width":s.attrs[P]=q.value}}}for(var F=0,E=u.style.length;E>F;F++){var S=u.style[F];switch(S){case"fill":case"fill-opacity":case"opacity":case"stroke":case"stroke-opacity":case"stroke-width":s.style[S]=u.style[S]}}a.push(s)}}a.length>0&&(i={id:r,items:a},this._icons[r]=i),this._morphG?this._svgDoc.removeChild(h):(c=r,this._morphG=document.createElementNS("http://www.w3.org/2000/svg","g"),this._svgDoc.replaceChild(this._morphG,h))}}var G=this._curIconId||c;""!==G&&(this._setupAnimation(G),this._updateAnimationProgress(1),this._animationEnd())}},i.prototype._setupAnimation=function(t){if(t&&this._icons[t]){this._toIconId=t,this._startTime=void 0;var a,s;for(this._fromIconItems=n(this._curIconItems),this._toIconItems=n(this._icons[t].items),a=0,s=this._morphNodes.length;s>a;a++){var o=this._morphNodes[a];o.fromIconItemIdx=a,o.toIconItemIdx=a}var i,c=Math.max(this._fromIconItems.length,this._toIconItems.length);for(a=0;c>a;a++)if(this._fromIconItems[a]||(this._toIconItems[a]?(i=w(b(this._toIconItems[a].path)),this._fromIconItems.push({path:"M"+i.cx+","+i.cy+"l0,0",attrs:{},style:{},trans:{rotate:[0,i.cx,i.cy]}})):this._fromIconItems.push({path:"M0,0l0,0",attrs:{},style:{},trans:{rotate:[0,0,0]}})),this._toIconItems[a]||(this._fromIconItems[a]?(i=w(b(this._fromIconItems[a].path)),this._toIconItems.push({path:"M"+i.cx+","+i.cy+"l0,0",attrs:{},style:{},trans:{rotate:[0,i.cx,i.cy]}})):this._toIconItems.push({path:"M0,0l0,0",attrs:{},style:{},trans:{rotate:[0,0,0]}})),!this._morphNodes[a]){var h=document.createElementNS("http://www.w3.org/2000/svg","path");this._morphG.appendChild(h),this._morphNodes.push({node:h,fromIconItemIdx:a,toIconItemIdx:a})}for(a=0;c>a;a++){var u=this._fromIconItems[a],l=this._toIconItems[a],p=b(this._fromIconItems[a].path,this._toIconItems[a].path);u.curve=p[0],l.curve=p[1];var f=r(this._fromIconItems[a].attrs,this._toIconItems[a].attrs);u.attrsNorm=f[0],l.attrsNorm=f[1],u.attrs=e(u.attrsNorm),l.attrs=e(l.attrsNorm);var m=r(this._fromIconItems[a].style,this._toIconItems[a].style);u.styleNorm=m[0],l.styleNorm=m[1],u.style=e(u.styleNorm),l.style=e(l.styleNorm),i=w(l.curve),l.trans={rotate:[0,i.cx,i.cy]};var y,I=this._rotation;switch("random"===I&&(I=Math.random()<.5?"counterclock":"clock"),I){case"none":u.trans.rotate&&(l.trans.rotate[0]=u.trans.rotate[0]);break;case"counterclock":u.trans.rotate?(l.trans.rotate[0]=u.trans.rotate[0]-360,y=-u.trans.rotate[0]%360,l.trans.rotate[0]+=180>y?y:y-360):l.trans.rotate[0]=-360;break;default:u.trans.rotate?(l.trans.rotate[0]=u.trans.rotate[0]+360,y=u.trans.rotate[0]%360,l.trans.rotate[0]+=180>y?-y:360-y):l.trans.rotate[0]=360}}this._curIconItems=n(this._fromIconItems)}},i.prototype._updateAnimationProgress=function(r){r=c[this._easing](r);var n,i,h,u;for(n=0,u=this._curIconItems.length;u>n;n++)this._curIconItems[n].curve=o(this._fromIconItems[n].curve,this._toIconItems[n].curve,r),this._curIconItems[n].path=A(this._curIconItems[n].curve),this._curIconItems[n].attrsNorm=t(this._fromIconItems[n].attrsNorm,this._toIconItems[n].attrsNorm,r),this._curIconItems[n].attrs=e(this._curIconItems[n].attrsNorm),this._curIconItems[n].styleNorm=t(this._fromIconItems[n].styleNorm,this._toIconItems[n].styleNorm,r),this._curIconItems[n].style=e(this._curIconItems[n].styleNorm),this._curIconItems[n].trans=a(this._fromIconItems[n].trans,this._toIconItems[n].trans,r),this._curIconItems[n].transStr=s(this._curIconItems[n].trans);for(n=0,u=this._morphNodes.length;u>n;n++){var l=this._morphNodes[n];l.node.setAttribute("d",this._curIconItems[n].path);var p=this._curIconItems[n].attrs;for(i in p)l.node.setAttribute(i,p[i]);var f=this._curIconItems[n].style;for(h in f)l.node.style[h]=f[h];l.node.setAttribute("transform",this._curIconItems[n].transStr)}},i.prototype._animationEnd=function(){for(var t=this._morphNodes.length-1;t>=0;t--){var e=this._morphNodes[t];this._icons[this._toIconId].items[t]?e.node.setAttribute("d",this._icons[this._toIconId].items[t].path):(e.node.parentNode.removeChild(e.node),this._morphNodes.splice(t,1))}this._curIconId=this._toIconId,this._toIconId="",this._callback()},i.prototype.to=function(t,e,r){if(t!==this._toIconId){if(e&&typeof e!=typeof{})throw new Error('SVGMorpheus.to() > "options" parameter must be an object');if(e=e||{},r&&"function"!=typeof r)throw new Error('SVGMorpheus.to() > "callback" parameter must be a function');u(this._rafid),this._duration=e.duration||this._defDuration,this._easing=e.easing||this._defEasing,this._rotation=e.rotation||this._defRotation,this._callback=r||this._defCallback,this._setupAnimation(t),this._rafid=h(this._fnTick)}},i.prototype.registerEasing=function(t,e){c[t]=e},i}();

/***/ })
/******/ ]);