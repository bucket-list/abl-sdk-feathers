webpackJsonp([0],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	__webpack_require__(75);
	__webpack_require__(77);
	module.exports = __webpack_require__(206);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__resourceQuery) {var url = __webpack_require__(2);
	var stripAnsi = __webpack_require__(9);
	var socket = __webpack_require__(11);

	function getCurrentScriptSource() {
		// `document.currentScript` is the most accurate way to find the current script,
		// but is not supported in all browsers.
		if(document.currentScript)
			return document.currentScript.getAttribute("src");
		// Fall back to getting all scripts in the document.
		var scriptElements = document.scripts || [];
		var currentScript = scriptElements[scriptElements.length - 1];
		if(currentScript)
			return currentScript.getAttribute("src");
		// Fail as there was no script to use.
		throw new Error("[WDS] Failed to get current script source");
	}

	var urlParts;
	if(true) {
		// If this bundle is inlined, use the resource query to get the correct url.
		urlParts = url.parse(__resourceQuery.substr(1));
	} else {
		// Else, get the url from the <script> this file was called with.
		var scriptHost = getCurrentScriptSource();
		scriptHost = scriptHost.replace(/\/[^\/]+$/, "");
		urlParts = url.parse((scriptHost ? scriptHost : "/"), false, true);
	}

	var hot = false;
	var initial = true;
	var currentHash = "";
	var logLevel = "info";

	function log(level, msg) {
		if(logLevel === "info" && level === "info")
			return console.log(msg);
		if(["info", "warning"].indexOf(logLevel) >= 0 && level === "warning")
			return console.warn(msg);
		if(["info", "warning", "error"].indexOf(logLevel) >= 0 && level === "error")
			return console.error(msg);
	}

	var onSocketMsg = {
		hot: function() {
			hot = true;
			log("info", "[WDS] Hot Module Replacement enabled.");
		},
		invalid: function() {
			log("info", "[WDS] App updated. Recompiling...");
		},
		hash: function(hash) {
			currentHash = hash;
		},
		"still-ok": function() {
			log("info", "[WDS] Nothing changed.")
		},
		"log-level": function(level) {
			logLevel = level;
		},
		ok: function() {
			if(initial) return initial = false;
			reloadApp();
		},
		warnings: function(warnings) {
			log("info", "[WDS] Warnings while compiling.");
			for(var i = 0; i < warnings.length; i++)
				console.warn(stripAnsi(warnings[i]));
			if(initial) return initial = false;
			reloadApp();
		},
		errors: function(errors) {
			log("info", "[WDS] Errors while compiling.");
			for(var i = 0; i < errors.length; i++)
				console.error(stripAnsi(errors[i]));
			if(initial) return initial = false;
			reloadApp();
		},
		"proxy-error": function(errors) {
			log("info", "[WDS] Proxy error.");
			for(var i = 0; i < errors.length; i++)
				log("error", stripAnsi(errors[i]));
			if(initial) return initial = false;
		},
		error: function(error) {
			console.error(error);
		},
		close: function() {
			log("error", "[WDS] Disconnected!");
		}
	};

	var hostname = urlParts.hostname;
	var protocol = urlParts.protocol;

	if(urlParts.hostname === '0.0.0.0') {
		// why do we need this check?
		// hostname n/a for file protocol (example, when using electron, ionic)
		// see: https://github.com/webpack/webpack-dev-server/pull/384
		if(window.location.hostname && !!~window.location.protocol.indexOf('http')) {
			hostname = window.location.hostname;
		}
	}

	// `hostname` can be empty when the script path is relative. In that case, specifying
	// a protocol would result in an invalid URL.
	// When https is used in the app, secure websockets are always necessary
	// because the browser doesn't accept non-secure websockets.
	if(hostname && (window.location.protocol === "https:" || urlParts.hostname === '0.0.0.0')) {
		protocol = window.location.protocol;
	}

	var socketUrl = url.format({
		protocol: protocol,
		auth: urlParts.auth,
		hostname: hostname,
		port: (urlParts.port === '0') ? window.location.port : urlParts.port,
		pathname: urlParts.path == null || urlParts.path === '/' ? "/sockjs-node" : urlParts.path
	});

	socket(socketUrl, onSocketMsg);

	function reloadApp() {
		if(hot) {
			log("info", "[WDS] App hot update...");
			window.postMessage("webpackHotUpdate" + currentHash, "*");
		} else {
			log("info", "[WDS] App updated. Reloading...");
			window.location.reload();
		}
	}

	/* WEBPACK VAR INJECTION */}.call(exports, "?http://0.0.0.0:3234/"))

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

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

	'use strict';

	var punycode = __webpack_require__(3);
	var util = __webpack_require__(5);

	exports.parse = urlParse;
	exports.resolve = urlResolve;
	exports.resolveObject = urlResolveObject;
	exports.format = urlFormat;

	exports.Url = Url;

	function Url() {
	  this.protocol = null;
	  this.slashes = null;
	  this.auth = null;
	  this.host = null;
	  this.port = null;
	  this.hostname = null;
	  this.hash = null;
	  this.search = null;
	  this.query = null;
	  this.pathname = null;
	  this.path = null;
	  this.href = null;
	}

	// Reference: RFC 3986, RFC 1808, RFC 2396

	// define these here so at least they only have to be
	// compiled once on the first module load.
	var protocolPattern = /^([a-z0-9.+-]+:)/i,
	    portPattern = /:[0-9]*$/,

	    // Special case for a simple path URL
	    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

	    // RFC 2396: characters reserved for delimiting URLs.
	    // We actually just auto-escape these.
	    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

	    // RFC 2396: characters not allowed for various reasons.
	    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

	    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
	    autoEscape = ['\''].concat(unwise),
	    // Characters that are never ever allowed in a hostname.
	    // Note that any invalid chars are also handled, but these
	    // are the ones that are *expected* to be seen, so we fast-path
	    // them.
	    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
	    hostEndingChars = ['/', '?', '#'],
	    hostnameMaxLen = 255,
	    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
	    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
	    // protocols that can allow "unsafe" and "unwise" chars.
	    unsafeProtocol = {
	      'javascript': true,
	      'javascript:': true
	    },
	    // protocols that never have a hostname.
	    hostlessProtocol = {
	      'javascript': true,
	      'javascript:': true
	    },
	    // protocols that always contain a // bit.
	    slashedProtocol = {
	      'http': true,
	      'https': true,
	      'ftp': true,
	      'gopher': true,
	      'file': true,
	      'http:': true,
	      'https:': true,
	      'ftp:': true,
	      'gopher:': true,
	      'file:': true
	    },
	    querystring = __webpack_require__(6);

	function urlParse(url, parseQueryString, slashesDenoteHost) {
	  if (url && util.isObject(url) && url instanceof Url) return url;

	  var u = new Url;
	  u.parse(url, parseQueryString, slashesDenoteHost);
	  return u;
	}

	Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
	  if (!util.isString(url)) {
	    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
	  }

	  // Copy chrome, IE, opera backslash-handling behavior.
	  // Back slashes before the query string get converted to forward slashes
	  // See: https://code.google.com/p/chromium/issues/detail?id=25916
	  var queryIndex = url.indexOf('?'),
	      splitter =
	          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
	      uSplit = url.split(splitter),
	      slashRegex = /\\/g;
	  uSplit[0] = uSplit[0].replace(slashRegex, '/');
	  url = uSplit.join(splitter);

	  var rest = url;

	  // trim before proceeding.
	  // This is to support parse stuff like "  http://foo.com  \n"
	  rest = rest.trim();

	  if (!slashesDenoteHost && url.split('#').length === 1) {
	    // Try fast path regexp
	    var simplePath = simplePathPattern.exec(rest);
	    if (simplePath) {
	      this.path = rest;
	      this.href = rest;
	      this.pathname = simplePath[1];
	      if (simplePath[2]) {
	        this.search = simplePath[2];
	        if (parseQueryString) {
	          this.query = querystring.parse(this.search.substr(1));
	        } else {
	          this.query = this.search.substr(1);
	        }
	      } else if (parseQueryString) {
	        this.search = '';
	        this.query = {};
	      }
	      return this;
	    }
	  }

	  var proto = protocolPattern.exec(rest);
	  if (proto) {
	    proto = proto[0];
	    var lowerProto = proto.toLowerCase();
	    this.protocol = lowerProto;
	    rest = rest.substr(proto.length);
	  }

	  // figure out if it's got a host
	  // user@server is *always* interpreted as a hostname, and url
	  // resolution will treat //foo/bar as host=foo,path=bar because that's
	  // how the browser resolves relative URLs.
	  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
	    var slashes = rest.substr(0, 2) === '//';
	    if (slashes && !(proto && hostlessProtocol[proto])) {
	      rest = rest.substr(2);
	      this.slashes = true;
	    }
	  }

	  if (!hostlessProtocol[proto] &&
	      (slashes || (proto && !slashedProtocol[proto]))) {

	    // there's a hostname.
	    // the first instance of /, ?, ;, or # ends the host.
	    //
	    // If there is an @ in the hostname, then non-host chars *are* allowed
	    // to the left of the last @ sign, unless some host-ending character
	    // comes *before* the @-sign.
	    // URLs are obnoxious.
	    //
	    // ex:
	    // http://a@b@c/ => user:a@b host:c
	    // http://a@b?@c => user:a host:c path:/?@c

	    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
	    // Review our test case against browsers more comprehensively.

	    // find the first instance of any hostEndingChars
	    var hostEnd = -1;
	    for (var i = 0; i < hostEndingChars.length; i++) {
	      var hec = rest.indexOf(hostEndingChars[i]);
	      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
	        hostEnd = hec;
	    }

	    // at this point, either we have an explicit point where the
	    // auth portion cannot go past, or the last @ char is the decider.
	    var auth, atSign;
	    if (hostEnd === -1) {
	      // atSign can be anywhere.
	      atSign = rest.lastIndexOf('@');
	    } else {
	      // atSign must be in auth portion.
	      // http://a@b/c@d => host:b auth:a path:/c@d
	      atSign = rest.lastIndexOf('@', hostEnd);
	    }

	    // Now we have a portion which is definitely the auth.
	    // Pull that off.
	    if (atSign !== -1) {
	      auth = rest.slice(0, atSign);
	      rest = rest.slice(atSign + 1);
	      this.auth = decodeURIComponent(auth);
	    }

	    // the host is the remaining to the left of the first non-host char
	    hostEnd = -1;
	    for (var i = 0; i < nonHostChars.length; i++) {
	      var hec = rest.indexOf(nonHostChars[i]);
	      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
	        hostEnd = hec;
	    }
	    // if we still have not hit it, then the entire thing is a host.
	    if (hostEnd === -1)
	      hostEnd = rest.length;

	    this.host = rest.slice(0, hostEnd);
	    rest = rest.slice(hostEnd);

	    // pull out port.
	    this.parseHost();

	    // we've indicated that there is a hostname,
	    // so even if it's empty, it has to be present.
	    this.hostname = this.hostname || '';

	    // if hostname begins with [ and ends with ]
	    // assume that it's an IPv6 address.
	    var ipv6Hostname = this.hostname[0] === '[' &&
	        this.hostname[this.hostname.length - 1] === ']';

	    // validate a little.
	    if (!ipv6Hostname) {
	      var hostparts = this.hostname.split(/\./);
	      for (var i = 0, l = hostparts.length; i < l; i++) {
	        var part = hostparts[i];
	        if (!part) continue;
	        if (!part.match(hostnamePartPattern)) {
	          var newpart = '';
	          for (var j = 0, k = part.length; j < k; j++) {
	            if (part.charCodeAt(j) > 127) {
	              // we replace non-ASCII char with a temporary placeholder
	              // we need this to make sure size of hostname is not
	              // broken by replacing non-ASCII by nothing
	              newpart += 'x';
	            } else {
	              newpart += part[j];
	            }
	          }
	          // we test again with ASCII char only
	          if (!newpart.match(hostnamePartPattern)) {
	            var validParts = hostparts.slice(0, i);
	            var notHost = hostparts.slice(i + 1);
	            var bit = part.match(hostnamePartStart);
	            if (bit) {
	              validParts.push(bit[1]);
	              notHost.unshift(bit[2]);
	            }
	            if (notHost.length) {
	              rest = '/' + notHost.join('.') + rest;
	            }
	            this.hostname = validParts.join('.');
	            break;
	          }
	        }
	      }
	    }

	    if (this.hostname.length > hostnameMaxLen) {
	      this.hostname = '';
	    } else {
	      // hostnames are always lower case.
	      this.hostname = this.hostname.toLowerCase();
	    }

	    if (!ipv6Hostname) {
	      // IDNA Support: Returns a punycoded representation of "domain".
	      // It only converts parts of the domain name that
	      // have non-ASCII characters, i.e. it doesn't matter if
	      // you call it with a domain that already is ASCII-only.
	      this.hostname = punycode.toASCII(this.hostname);
	    }

	    var p = this.port ? ':' + this.port : '';
	    var h = this.hostname || '';
	    this.host = h + p;
	    this.href += this.host;

	    // strip [ and ] from the hostname
	    // the host field still retains them, though
	    if (ipv6Hostname) {
	      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
	      if (rest[0] !== '/') {
	        rest = '/' + rest;
	      }
	    }
	  }

	  // now rest is set to the post-host stuff.
	  // chop off any delim chars.
	  if (!unsafeProtocol[lowerProto]) {

	    // First, make 100% sure that any "autoEscape" chars get
	    // escaped, even if encodeURIComponent doesn't think they
	    // need to be.
	    for (var i = 0, l = autoEscape.length; i < l; i++) {
	      var ae = autoEscape[i];
	      if (rest.indexOf(ae) === -1)
	        continue;
	      var esc = encodeURIComponent(ae);
	      if (esc === ae) {
	        esc = escape(ae);
	      }
	      rest = rest.split(ae).join(esc);
	    }
	  }


	  // chop off from the tail first.
	  var hash = rest.indexOf('#');
	  if (hash !== -1) {
	    // got a fragment string.
	    this.hash = rest.substr(hash);
	    rest = rest.slice(0, hash);
	  }
	  var qm = rest.indexOf('?');
	  if (qm !== -1) {
	    this.search = rest.substr(qm);
	    this.query = rest.substr(qm + 1);
	    if (parseQueryString) {
	      this.query = querystring.parse(this.query);
	    }
	    rest = rest.slice(0, qm);
	  } else if (parseQueryString) {
	    // no query string, but parseQueryString still requested
	    this.search = '';
	    this.query = {};
	  }
	  if (rest) this.pathname = rest;
	  if (slashedProtocol[lowerProto] &&
	      this.hostname && !this.pathname) {
	    this.pathname = '/';
	  }

	  //to support http.request
	  if (this.pathname || this.search) {
	    var p = this.pathname || '';
	    var s = this.search || '';
	    this.path = p + s;
	  }

	  // finally, reconstruct the href based on what has been validated.
	  this.href = this.format();
	  return this;
	};

	// format a parsed object into a url string
	function urlFormat(obj) {
	  // ensure it's an object, and not a string url.
	  // If it's an obj, this is a no-op.
	  // this way, you can call url_format() on strings
	  // to clean up potentially wonky urls.
	  if (util.isString(obj)) obj = urlParse(obj);
	  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
	  return obj.format();
	}

	Url.prototype.format = function() {
	  var auth = this.auth || '';
	  if (auth) {
	    auth = encodeURIComponent(auth);
	    auth = auth.replace(/%3A/i, ':');
	    auth += '@';
	  }

	  var protocol = this.protocol || '',
	      pathname = this.pathname || '',
	      hash = this.hash || '',
	      host = false,
	      query = '';

	  if (this.host) {
	    host = auth + this.host;
	  } else if (this.hostname) {
	    host = auth + (this.hostname.indexOf(':') === -1 ?
	        this.hostname :
	        '[' + this.hostname + ']');
	    if (this.port) {
	      host += ':' + this.port;
	    }
	  }

	  if (this.query &&
	      util.isObject(this.query) &&
	      Object.keys(this.query).length) {
	    query = querystring.stringify(this.query);
	  }

	  var search = this.search || (query && ('?' + query)) || '';

	  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

	  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
	  // unless they had them to begin with.
	  if (this.slashes ||
	      (!protocol || slashedProtocol[protocol]) && host !== false) {
	    host = '//' + (host || '');
	    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
	  } else if (!host) {
	    host = '';
	  }

	  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
	  if (search && search.charAt(0) !== '?') search = '?' + search;

	  pathname = pathname.replace(/[?#]/g, function(match) {
	    return encodeURIComponent(match);
	  });
	  search = search.replace('#', '%23');

	  return protocol + host + pathname + search + hash;
	};

	function urlResolve(source, relative) {
	  return urlParse(source, false, true).resolve(relative);
	}

	Url.prototype.resolve = function(relative) {
	  return this.resolveObject(urlParse(relative, false, true)).format();
	};

	function urlResolveObject(source, relative) {
	  if (!source) return relative;
	  return urlParse(source, false, true).resolveObject(relative);
	}

	Url.prototype.resolveObject = function(relative) {
	  if (util.isString(relative)) {
	    var rel = new Url();
	    rel.parse(relative, false, true);
	    relative = rel;
	  }

	  var result = new Url();
	  var tkeys = Object.keys(this);
	  for (var tk = 0; tk < tkeys.length; tk++) {
	    var tkey = tkeys[tk];
	    result[tkey] = this[tkey];
	  }

	  // hash is always overridden, no matter what.
	  // even href="" will remove it.
	  result.hash = relative.hash;

	  // if the relative url is empty, then there's nothing left to do here.
	  if (relative.href === '') {
	    result.href = result.format();
	    return result;
	  }

	  // hrefs like //foo/bar always cut to the protocol.
	  if (relative.slashes && !relative.protocol) {
	    // take everything except the protocol from relative
	    var rkeys = Object.keys(relative);
	    for (var rk = 0; rk < rkeys.length; rk++) {
	      var rkey = rkeys[rk];
	      if (rkey !== 'protocol')
	        result[rkey] = relative[rkey];
	    }

	    //urlParse appends trailing / to urls like http://www.example.com
	    if (slashedProtocol[result.protocol] &&
	        result.hostname && !result.pathname) {
	      result.path = result.pathname = '/';
	    }

	    result.href = result.format();
	    return result;
	  }

	  if (relative.protocol && relative.protocol !== result.protocol) {
	    // if it's a known url protocol, then changing
	    // the protocol does weird things
	    // first, if it's not file:, then we MUST have a host,
	    // and if there was a path
	    // to begin with, then we MUST have a path.
	    // if it is file:, then the host is dropped,
	    // because that's known to be hostless.
	    // anything else is assumed to be absolute.
	    if (!slashedProtocol[relative.protocol]) {
	      var keys = Object.keys(relative);
	      for (var v = 0; v < keys.length; v++) {
	        var k = keys[v];
	        result[k] = relative[k];
	      }
	      result.href = result.format();
	      return result;
	    }

	    result.protocol = relative.protocol;
	    if (!relative.host && !hostlessProtocol[relative.protocol]) {
	      var relPath = (relative.pathname || '').split('/');
	      while (relPath.length && !(relative.host = relPath.shift()));
	      if (!relative.host) relative.host = '';
	      if (!relative.hostname) relative.hostname = '';
	      if (relPath[0] !== '') relPath.unshift('');
	      if (relPath.length < 2) relPath.unshift('');
	      result.pathname = relPath.join('/');
	    } else {
	      result.pathname = relative.pathname;
	    }
	    result.search = relative.search;
	    result.query = relative.query;
	    result.host = relative.host || '';
	    result.auth = relative.auth;
	    result.hostname = relative.hostname || relative.host;
	    result.port = relative.port;
	    // to support http.request
	    if (result.pathname || result.search) {
	      var p = result.pathname || '';
	      var s = result.search || '';
	      result.path = p + s;
	    }
	    result.slashes = result.slashes || relative.slashes;
	    result.href = result.format();
	    return result;
	  }

	  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
	      isRelAbs = (
	          relative.host ||
	          relative.pathname && relative.pathname.charAt(0) === '/'
	      ),
	      mustEndAbs = (isRelAbs || isSourceAbs ||
	                    (result.host && relative.pathname)),
	      removeAllDots = mustEndAbs,
	      srcPath = result.pathname && result.pathname.split('/') || [],
	      relPath = relative.pathname && relative.pathname.split('/') || [],
	      psychotic = result.protocol && !slashedProtocol[result.protocol];

	  // if the url is a non-slashed url, then relative
	  // links like ../.. should be able
	  // to crawl up to the hostname, as well.  This is strange.
	  // result.protocol has already been set by now.
	  // Later on, put the first path part into the host field.
	  if (psychotic) {
	    result.hostname = '';
	    result.port = null;
	    if (result.host) {
	      if (srcPath[0] === '') srcPath[0] = result.host;
	      else srcPath.unshift(result.host);
	    }
	    result.host = '';
	    if (relative.protocol) {
	      relative.hostname = null;
	      relative.port = null;
	      if (relative.host) {
	        if (relPath[0] === '') relPath[0] = relative.host;
	        else relPath.unshift(relative.host);
	      }
	      relative.host = null;
	    }
	    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
	  }

	  if (isRelAbs) {
	    // it's absolute.
	    result.host = (relative.host || relative.host === '') ?
	                  relative.host : result.host;
	    result.hostname = (relative.hostname || relative.hostname === '') ?
	                      relative.hostname : result.hostname;
	    result.search = relative.search;
	    result.query = relative.query;
	    srcPath = relPath;
	    // fall through to the dot-handling below.
	  } else if (relPath.length) {
	    // it's relative
	    // throw away the existing file, and take the new path instead.
	    if (!srcPath) srcPath = [];
	    srcPath.pop();
	    srcPath = srcPath.concat(relPath);
	    result.search = relative.search;
	    result.query = relative.query;
	  } else if (!util.isNullOrUndefined(relative.search)) {
	    // just pull out the search.
	    // like href='?foo'.
	    // Put this after the other two cases because it simplifies the booleans
	    if (psychotic) {
	      result.hostname = result.host = srcPath.shift();
	      //occationaly the auth can get stuck only in host
	      //this especially happens in cases like
	      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
	      var authInHost = result.host && result.host.indexOf('@') > 0 ?
	                       result.host.split('@') : false;
	      if (authInHost) {
	        result.auth = authInHost.shift();
	        result.host = result.hostname = authInHost.shift();
	      }
	    }
	    result.search = relative.search;
	    result.query = relative.query;
	    //to support http.request
	    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
	      result.path = (result.pathname ? result.pathname : '') +
	                    (result.search ? result.search : '');
	    }
	    result.href = result.format();
	    return result;
	  }

	  if (!srcPath.length) {
	    // no path at all.  easy.
	    // we've already handled the other stuff above.
	    result.pathname = null;
	    //to support http.request
	    if (result.search) {
	      result.path = '/' + result.search;
	    } else {
	      result.path = null;
	    }
	    result.href = result.format();
	    return result;
	  }

	  // if a url ENDs in . or .., then it must get a trailing slash.
	  // however, if it ends in anything else non-slashy,
	  // then it must NOT get a trailing slash.
	  var last = srcPath.slice(-1)[0];
	  var hasTrailingSlash = (
	      (result.host || relative.host || srcPath.length > 1) &&
	      (last === '.' || last === '..') || last === '');

	  // strip single dots, resolve double dots to parent dir
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = srcPath.length; i >= 0; i--) {
	    last = srcPath[i];
	    if (last === '.') {
	      srcPath.splice(i, 1);
	    } else if (last === '..') {
	      srcPath.splice(i, 1);
	      up++;
	    } else if (up) {
	      srcPath.splice(i, 1);
	      up--;
	    }
	  }

	  // if the path is allowed to go above the root, restore leading ..s
	  if (!mustEndAbs && !removeAllDots) {
	    for (; up--; up) {
	      srcPath.unshift('..');
	    }
	  }

	  if (mustEndAbs && srcPath[0] !== '' &&
	      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
	    srcPath.unshift('');
	  }

	  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
	    srcPath.push('');
	  }

	  var isAbsolute = srcPath[0] === '' ||
	      (srcPath[0] && srcPath[0].charAt(0) === '/');

	  // put the host back
	  if (psychotic) {
	    result.hostname = result.host = isAbsolute ? '' :
	                                    srcPath.length ? srcPath.shift() : '';
	    //occationaly the auth can get stuck only in host
	    //this especially happens in cases like
	    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
	    var authInHost = result.host && result.host.indexOf('@') > 0 ?
	                     result.host.split('@') : false;
	    if (authInHost) {
	      result.auth = authInHost.shift();
	      result.host = result.hostname = authInHost.shift();
	    }
	  }

	  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

	  if (mustEndAbs && !isAbsolute) {
	    srcPath.unshift('');
	  }

	  if (!srcPath.length) {
	    result.pathname = null;
	    result.path = null;
	  } else {
	    result.pathname = srcPath.join('/');
	  }

	  //to support request.http
	  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
	    result.path = (result.pathname ? result.pathname : '') +
	                  (result.search ? result.search : '');
	  }
	  result.auth = relative.auth || result.auth;
	  result.slashes = result.slashes || relative.slashes;
	  result.href = result.format();
	  return result;
	};

	Url.prototype.parseHost = function() {
	  var host = this.host;
	  var port = portPattern.exec(host);
	  if (port) {
	    port = port[0];
	    if (port !== ':') {
	      this.port = port.substr(1);
	    }
	    host = host.substr(0, host.length - port.length);
	  }
	  if (host) this.hostname = host;
	};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {/*! https://mths.be/punycode v1.3.2 by @mathias */
	;(function(root) {

		/** Detect free variables */
		var freeExports = typeof exports == 'object' && exports &&
			!exports.nodeType && exports;
		var freeModule = typeof module == 'object' && module &&
			!module.nodeType && module;
		var freeGlobal = typeof global == 'object' && global;
		if (
			freeGlobal.global === freeGlobal ||
			freeGlobal.window === freeGlobal ||
			freeGlobal.self === freeGlobal
		) {
			root = freeGlobal;
		}

		/**
		 * The `punycode` object.
		 * @name punycode
		 * @type Object
		 */
		var punycode,

		/** Highest positive signed 32-bit float value */
		maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

		/** Bootstring parameters */
		base = 36,
		tMin = 1,
		tMax = 26,
		skew = 38,
		damp = 700,
		initialBias = 72,
		initialN = 128, // 0x80
		delimiter = '-', // '\x2D'

		/** Regular expressions */
		regexPunycode = /^xn--/,
		regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
		regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

		/** Error messages */
		errors = {
			'overflow': 'Overflow: input needs wider integers to process',
			'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
			'invalid-input': 'Invalid input'
		},

		/** Convenience shortcuts */
		baseMinusTMin = base - tMin,
		floor = Math.floor,
		stringFromCharCode = String.fromCharCode,

		/** Temporary variable */
		key;

		/*--------------------------------------------------------------------------*/

		/**
		 * A generic error utility function.
		 * @private
		 * @param {String} type The error type.
		 * @returns {Error} Throws a `RangeError` with the applicable error message.
		 */
		function error(type) {
			throw RangeError(errors[type]);
		}

		/**
		 * A generic `Array#map` utility function.
		 * @private
		 * @param {Array} array The array to iterate over.
		 * @param {Function} callback The function that gets called for every array
		 * item.
		 * @returns {Array} A new array of values returned by the callback function.
		 */
		function map(array, fn) {
			var length = array.length;
			var result = [];
			while (length--) {
				result[length] = fn(array[length]);
			}
			return result;
		}

		/**
		 * A simple `Array#map`-like wrapper to work with domain name strings or email
		 * addresses.
		 * @private
		 * @param {String} domain The domain name or email address.
		 * @param {Function} callback The function that gets called for every
		 * character.
		 * @returns {Array} A new string of characters returned by the callback
		 * function.
		 */
		function mapDomain(string, fn) {
			var parts = string.split('@');
			var result = '';
			if (parts.length > 1) {
				// In email addresses, only the domain name should be punycoded. Leave
				// the local part (i.e. everything up to `@`) intact.
				result = parts[0] + '@';
				string = parts[1];
			}
			// Avoid `split(regex)` for IE8 compatibility. See #17.
			string = string.replace(regexSeparators, '\x2E');
			var labels = string.split('.');
			var encoded = map(labels, fn).join('.');
			return result + encoded;
		}

		/**
		 * Creates an array containing the numeric code points of each Unicode
		 * character in the string. While JavaScript uses UCS-2 internally,
		 * this function will convert a pair of surrogate halves (each of which
		 * UCS-2 exposes as separate characters) into a single code point,
		 * matching UTF-16.
		 * @see `punycode.ucs2.encode`
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode.ucs2
		 * @name decode
		 * @param {String} string The Unicode input string (UCS-2).
		 * @returns {Array} The new array of code points.
		 */
		function ucs2decode(string) {
			var output = [],
			    counter = 0,
			    length = string.length,
			    value,
			    extra;
			while (counter < length) {
				value = string.charCodeAt(counter++);
				if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
					// high surrogate, and there is a next character
					extra = string.charCodeAt(counter++);
					if ((extra & 0xFC00) == 0xDC00) { // low surrogate
						output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
					} else {
						// unmatched surrogate; only append this code unit, in case the next
						// code unit is the high surrogate of a surrogate pair
						output.push(value);
						counter--;
					}
				} else {
					output.push(value);
				}
			}
			return output;
		}

		/**
		 * Creates a string based on an array of numeric code points.
		 * @see `punycode.ucs2.decode`
		 * @memberOf punycode.ucs2
		 * @name encode
		 * @param {Array} codePoints The array of numeric code points.
		 * @returns {String} The new Unicode string (UCS-2).
		 */
		function ucs2encode(array) {
			return map(array, function(value) {
				var output = '';
				if (value > 0xFFFF) {
					value -= 0x10000;
					output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
					value = 0xDC00 | value & 0x3FF;
				}
				output += stringFromCharCode(value);
				return output;
			}).join('');
		}

		/**
		 * Converts a basic code point into a digit/integer.
		 * @see `digitToBasic()`
		 * @private
		 * @param {Number} codePoint The basic numeric code point value.
		 * @returns {Number} The numeric value of a basic code point (for use in
		 * representing integers) in the range `0` to `base - 1`, or `base` if
		 * the code point does not represent a value.
		 */
		function basicToDigit(codePoint) {
			if (codePoint - 48 < 10) {
				return codePoint - 22;
			}
			if (codePoint - 65 < 26) {
				return codePoint - 65;
			}
			if (codePoint - 97 < 26) {
				return codePoint - 97;
			}
			return base;
		}

		/**
		 * Converts a digit/integer into a basic code point.
		 * @see `basicToDigit()`
		 * @private
		 * @param {Number} digit The numeric value of a basic code point.
		 * @returns {Number} The basic code point whose value (when used for
		 * representing integers) is `digit`, which needs to be in the range
		 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
		 * used; else, the lowercase form is used. The behavior is undefined
		 * if `flag` is non-zero and `digit` has no uppercase form.
		 */
		function digitToBasic(digit, flag) {
			//  0..25 map to ASCII a..z or A..Z
			// 26..35 map to ASCII 0..9
			return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
		}

		/**
		 * Bias adaptation function as per section 3.4 of RFC 3492.
		 * http://tools.ietf.org/html/rfc3492#section-3.4
		 * @private
		 */
		function adapt(delta, numPoints, firstTime) {
			var k = 0;
			delta = firstTime ? floor(delta / damp) : delta >> 1;
			delta += floor(delta / numPoints);
			for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
				delta = floor(delta / baseMinusTMin);
			}
			return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
		}

		/**
		 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
		 * symbols.
		 * @memberOf punycode
		 * @param {String} input The Punycode string of ASCII-only symbols.
		 * @returns {String} The resulting string of Unicode symbols.
		 */
		function decode(input) {
			// Don't use UCS-2
			var output = [],
			    inputLength = input.length,
			    out,
			    i = 0,
			    n = initialN,
			    bias = initialBias,
			    basic,
			    j,
			    index,
			    oldi,
			    w,
			    k,
			    digit,
			    t,
			    /** Cached calculation results */
			    baseMinusT;

			// Handle the basic code points: let `basic` be the number of input code
			// points before the last delimiter, or `0` if there is none, then copy
			// the first basic code points to the output.

			basic = input.lastIndexOf(delimiter);
			if (basic < 0) {
				basic = 0;
			}

			for (j = 0; j < basic; ++j) {
				// if it's not a basic code point
				if (input.charCodeAt(j) >= 0x80) {
					error('not-basic');
				}
				output.push(input.charCodeAt(j));
			}

			// Main decoding loop: start just after the last delimiter if any basic code
			// points were copied; start at the beginning otherwise.

			for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

				// `index` is the index of the next character to be consumed.
				// Decode a generalized variable-length integer into `delta`,
				// which gets added to `i`. The overflow checking is easier
				// if we increase `i` as we go, then subtract off its starting
				// value at the end to obtain `delta`.
				for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

					if (index >= inputLength) {
						error('invalid-input');
					}

					digit = basicToDigit(input.charCodeAt(index++));

					if (digit >= base || digit > floor((maxInt - i) / w)) {
						error('overflow');
					}

					i += digit * w;
					t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

					if (digit < t) {
						break;
					}

					baseMinusT = base - t;
					if (w > floor(maxInt / baseMinusT)) {
						error('overflow');
					}

					w *= baseMinusT;

				}

				out = output.length + 1;
				bias = adapt(i - oldi, out, oldi == 0);

				// `i` was supposed to wrap around from `out` to `0`,
				// incrementing `n` each time, so we'll fix that now:
				if (floor(i / out) > maxInt - n) {
					error('overflow');
				}

				n += floor(i / out);
				i %= out;

				// Insert `n` at position `i` of the output
				output.splice(i++, 0, n);

			}

			return ucs2encode(output);
		}

		/**
		 * Converts a string of Unicode symbols (e.g. a domain name label) to a
		 * Punycode string of ASCII-only symbols.
		 * @memberOf punycode
		 * @param {String} input The string of Unicode symbols.
		 * @returns {String} The resulting Punycode string of ASCII-only symbols.
		 */
		function encode(input) {
			var n,
			    delta,
			    handledCPCount,
			    basicLength,
			    bias,
			    j,
			    m,
			    q,
			    k,
			    t,
			    currentValue,
			    output = [],
			    /** `inputLength` will hold the number of code points in `input`. */
			    inputLength,
			    /** Cached calculation results */
			    handledCPCountPlusOne,
			    baseMinusT,
			    qMinusT;

			// Convert the input in UCS-2 to Unicode
			input = ucs2decode(input);

			// Cache the length
			inputLength = input.length;

			// Initialize the state
			n = initialN;
			delta = 0;
			bias = initialBias;

			// Handle the basic code points
			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue < 0x80) {
					output.push(stringFromCharCode(currentValue));
				}
			}

			handledCPCount = basicLength = output.length;

			// `handledCPCount` is the number of code points that have been handled;
			// `basicLength` is the number of basic code points.

			// Finish the basic string - if it is not empty - with a delimiter
			if (basicLength) {
				output.push(delimiter);
			}

			// Main encoding loop:
			while (handledCPCount < inputLength) {

				// All non-basic code points < n have been handled already. Find the next
				// larger one:
				for (m = maxInt, j = 0; j < inputLength; ++j) {
					currentValue = input[j];
					if (currentValue >= n && currentValue < m) {
						m = currentValue;
					}
				}

				// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
				// but guard against overflow
				handledCPCountPlusOne = handledCPCount + 1;
				if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
					error('overflow');
				}

				delta += (m - n) * handledCPCountPlusOne;
				n = m;

				for (j = 0; j < inputLength; ++j) {
					currentValue = input[j];

					if (currentValue < n && ++delta > maxInt) {
						error('overflow');
					}

					if (currentValue == n) {
						// Represent delta as a generalized variable-length integer
						for (q = delta, k = base; /* no condition */; k += base) {
							t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
							if (q < t) {
								break;
							}
							qMinusT = q - t;
							baseMinusT = base - t;
							output.push(
								stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
							);
							q = floor(qMinusT / baseMinusT);
						}

						output.push(stringFromCharCode(digitToBasic(q, 0)));
						bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
						delta = 0;
						++handledCPCount;
					}
				}

				++delta;
				++n;

			}
			return output.join('');
		}

		/**
		 * Converts a Punycode string representing a domain name or an email address
		 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
		 * it doesn't matter if you call it on a string that has already been
		 * converted to Unicode.
		 * @memberOf punycode
		 * @param {String} input The Punycoded domain name or email address to
		 * convert to Unicode.
		 * @returns {String} The Unicode representation of the given Punycode
		 * string.
		 */
		function toUnicode(input) {
			return mapDomain(input, function(string) {
				return regexPunycode.test(string)
					? decode(string.slice(4).toLowerCase())
					: string;
			});
		}

		/**
		 * Converts a Unicode string representing a domain name or an email address to
		 * Punycode. Only the non-ASCII parts of the domain name will be converted,
		 * i.e. it doesn't matter if you call it with a domain that's already in
		 * ASCII.
		 * @memberOf punycode
		 * @param {String} input The domain name or email address to convert, as a
		 * Unicode string.
		 * @returns {String} The Punycode representation of the given domain name or
		 * email address.
		 */
		function toASCII(input) {
			return mapDomain(input, function(string) {
				return regexNonASCII.test(string)
					? 'xn--' + encode(string)
					: string;
			});
		}

		/*--------------------------------------------------------------------------*/

		/** Define the public API */
		punycode = {
			/**
			 * A string representing the current Punycode.js version number.
			 * @memberOf punycode
			 * @type String
			 */
			'version': '1.3.2',
			/**
			 * An object of methods to convert from JavaScript's internal character
			 * representation (UCS-2) to Unicode code points, and back.
			 * @see <https://mathiasbynens.be/notes/javascript-encoding>
			 * @memberOf punycode
			 * @type Object
			 */
			'ucs2': {
				'decode': ucs2decode,
				'encode': ucs2encode
			},
			'decode': decode,
			'encode': encode,
			'toASCII': toASCII,
			'toUnicode': toUnicode
		};

		/** Expose `punycode` */
		// Some AMD build optimizers, like r.js, check for specific condition patterns
		// like the following:
		if (
			true
		) {
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
				return punycode;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (freeExports && freeModule) {
			if (module.exports == freeExports) { // in Node.js or RingoJS v0.8.0+
				freeModule.exports = punycode;
			} else { // in Narwhal or RingoJS v0.7.0-
				for (key in punycode) {
					punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
				}
			}
		} else { // in Rhino or a web browser
			root.punycode = punycode;
		}

	}(this));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)(module), (function() { return this; }())))

/***/ }),
/* 4 */,
/* 5 */
/***/ (function(module, exports) {

	'use strict';

	module.exports = {
	  isString: function(arg) {
	    return typeof(arg) === 'string';
	  },
	  isObject: function(arg) {
	    return typeof(arg) === 'object' && arg !== null;
	  },
	  isNull: function(arg) {
	    return arg === null;
	  },
	  isNullOrUndefined: function(arg) {
	    return arg == null;
	  }
	};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	exports.decode = exports.parse = __webpack_require__(7);
	exports.encode = exports.stringify = __webpack_require__(8);


/***/ }),
/* 7 */
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

	'use strict';

	// If obj.hasOwnProperty has been overridden, then calling
	// obj.hasOwnProperty(prop) will break.
	// See: https://github.com/joyent/node/issues/1707
	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	module.exports = function(qs, sep, eq, options) {
	  sep = sep || '&';
	  eq = eq || '=';
	  var obj = {};

	  if (typeof qs !== 'string' || qs.length === 0) {
	    return obj;
	  }

	  var regexp = /\+/g;
	  qs = qs.split(sep);

	  var maxKeys = 1000;
	  if (options && typeof options.maxKeys === 'number') {
	    maxKeys = options.maxKeys;
	  }

	  var len = qs.length;
	  // maxKeys <= 0 means that we should not limit keys count
	  if (maxKeys > 0 && len > maxKeys) {
	    len = maxKeys;
	  }

	  for (var i = 0; i < len; ++i) {
	    var x = qs[i].replace(regexp, '%20'),
	        idx = x.indexOf(eq),
	        kstr, vstr, k, v;

	    if (idx >= 0) {
	      kstr = x.substr(0, idx);
	      vstr = x.substr(idx + 1);
	    } else {
	      kstr = x;
	      vstr = '';
	    }

	    k = decodeURIComponent(kstr);
	    v = decodeURIComponent(vstr);

	    if (!hasOwnProperty(obj, k)) {
	      obj[k] = v;
	    } else if (Array.isArray(obj[k])) {
	      obj[k].push(v);
	    } else {
	      obj[k] = [obj[k], v];
	    }
	  }

	  return obj;
	};


/***/ }),
/* 8 */
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

	'use strict';

	var stringifyPrimitive = function(v) {
	  switch (typeof v) {
	    case 'string':
	      return v;

	    case 'boolean':
	      return v ? 'true' : 'false';

	    case 'number':
	      return isFinite(v) ? v : '';

	    default:
	      return '';
	  }
	};

	module.exports = function(obj, sep, eq, name) {
	  sep = sep || '&';
	  eq = eq || '=';
	  if (obj === null) {
	    obj = undefined;
	  }

	  if (typeof obj === 'object') {
	    return Object.keys(obj).map(function(k) {
	      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
	      if (Array.isArray(obj[k])) {
	        return obj[k].map(function(v) {
	          return ks + encodeURIComponent(stringifyPrimitive(v));
	        }).join(sep);
	      } else {
	        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
	      }
	    }).join(sep);

	  }

	  if (!name) return '';
	  return encodeURIComponent(stringifyPrimitive(name)) + eq +
	         encodeURIComponent(stringifyPrimitive(obj));
	};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var ansiRegex = __webpack_require__(10)();

	module.exports = function (str) {
		return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
	};


/***/ }),
/* 10 */
/***/ (function(module, exports) {

	'use strict';
	module.exports = function () {
		return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g;
	};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	var SockJS = __webpack_require__(12);

	var retries = 0;
	var sock = null;

	function socket(url, handlers) {
		sock = new SockJS(url);

		sock.onopen = function() {
			retries = 0;
		}

		sock.onclose = function() {
			if(retries === 0)
				handlers.close();

			// Try to reconnect.
			sock = null;

			// After 10 retries stop trying, to prevent logspam.
			if(retries <= 10) {
				// Exponentially increase timeout to reconnect.
				// Respectfully copied from the package `got`.
				var retryInMs = 1000 * Math.pow(2, retries) + Math.random() * 100;
				retries += 1;

				setTimeout(function() {
					socket(url, handlers);
				}, retryInMs);
			}
		};

		sock.onmessage = function(e) {
			// This assumes that all data sent via the websocket is JSON.
			var msg = JSON.parse(e.data);
			if(handlers[msg.type])
				handlers[msg.type](msg.data);
		};
	}

	module.exports = socket;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var transportList = __webpack_require__(13);

	module.exports = __webpack_require__(59)(transportList);

	// TODO can't get rid of this until all servers do
	if ('_sockjs_onload' in global) {
	  setTimeout(global._sockjs_onload, 1);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = [
	  // streaming transports
	  __webpack_require__(14)
	, __webpack_require__(30)
	, __webpack_require__(40)
	, __webpack_require__(42)
	, __webpack_require__(45)(__webpack_require__(42))

	  // polling transports
	, __webpack_require__(52)
	, __webpack_require__(45)(__webpack_require__(52))
	, __webpack_require__(54)
	, __webpack_require__(55)
	, __webpack_require__(45)(__webpack_require__(54))
	, __webpack_require__(56)
	];


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var utils = __webpack_require__(16)
	  , urlUtils = __webpack_require__(19)
	  , inherits = __webpack_require__(26)
	  , EventEmitter = __webpack_require__(27).EventEmitter
	  , WebsocketDriver = __webpack_require__(29)
	  ;

	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(23)('sockjs-client:websocket');
	}

	function WebSocketTransport(transUrl, ignore, options) {
	  if (!WebSocketTransport.enabled()) {
	    throw new Error('Transport created when disabled');
	  }

	  EventEmitter.call(this);
	  debug('constructor', transUrl);

	  var self = this;
	  var url = urlUtils.addPath(transUrl, '/websocket');
	  if (url.slice(0, 5) === 'https') {
	    url = 'wss' + url.slice(5);
	  } else {
	    url = 'ws' + url.slice(4);
	  }
	  this.url = url;

	  this.ws = new WebsocketDriver(this.url, [], options);
	  this.ws.onmessage = function(e) {
	    debug('message event', e.data);
	    self.emit('message', e.data);
	  };
	  // Firefox has an interesting bug. If a websocket connection is
	  // created after onunload, it stays alive even when user
	  // navigates away from the page. In such situation let's lie -
	  // let's not open the ws connection at all. See:
	  // https://github.com/sockjs/sockjs-client/issues/28
	  // https://bugzilla.mozilla.org/show_bug.cgi?id=696085
	  this.unloadRef = utils.unloadAdd(function() {
	    debug('unload');
	    self.ws.close();
	  });
	  this.ws.onclose = function(e) {
	    debug('close event', e.code, e.reason);
	    self.emit('close', e.code, e.reason);
	    self._cleanup();
	  };
	  this.ws.onerror = function(e) {
	    debug('error event', e);
	    self.emit('close', 1006, 'WebSocket connection broken');
	    self._cleanup();
	  };
	}

	inherits(WebSocketTransport, EventEmitter);

	WebSocketTransport.prototype.send = function(data) {
	  var msg = '[' + data + ']';
	  debug('send', msg);
	  this.ws.send(msg);
	};

	WebSocketTransport.prototype.close = function() {
	  debug('close');
	  var ws = this.ws;
	  this._cleanup();
	  if (ws) {
	    ws.close();
	  }
	};

	WebSocketTransport.prototype._cleanup = function() {
	  debug('_cleanup');
	  var ws = this.ws;
	  if (ws) {
	    ws.onmessage = ws.onclose = ws.onerror = null;
	  }
	  utils.unloadDel(this.unloadRef);
	  this.unloadRef = this.ws = null;
	  this.removeAllListeners();
	};

	WebSocketTransport.enabled = function() {
	  debug('enabled');
	  return !!WebsocketDriver;
	};
	WebSocketTransport.transportName = 'websocket';

	// In theory, ws should require 1 round trip. But in chrome, this is
	// not very stable over SSL. Most likely a ws connection requires a
	// separate SSL connection, in which case 2 round trips are an
	// absolute minumum.
	WebSocketTransport.roundTrips = 2;

	module.exports = WebSocketTransport;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))

/***/ }),
/* 15 */,
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var random = __webpack_require__(17);

	var onUnload = {}
	  , afterUnload = false
	    // detect google chrome packaged apps because they don't allow the 'unload' event
	  , isChromePackagedApp = global.chrome && global.chrome.app && global.chrome.app.runtime
	  ;

	module.exports = {
	  attachEvent: function(event, listener) {
	    if (typeof global.addEventListener !== 'undefined') {
	      global.addEventListener(event, listener, false);
	    } else if (global.document && global.attachEvent) {
	      // IE quirks.
	      // According to: http://stevesouders.com/misc/test-postmessage.php
	      // the message gets delivered only to 'document', not 'window'.
	      global.document.attachEvent('on' + event, listener);
	      // I get 'window' for ie8.
	      global.attachEvent('on' + event, listener);
	    }
	  }

	, detachEvent: function(event, listener) {
	    if (typeof global.addEventListener !== 'undefined') {
	      global.removeEventListener(event, listener, false);
	    } else if (global.document && global.detachEvent) {
	      global.document.detachEvent('on' + event, listener);
	      global.detachEvent('on' + event, listener);
	    }
	  }

	, unloadAdd: function(listener) {
	    if (isChromePackagedApp) {
	      return null;
	    }

	    var ref = random.string(8);
	    onUnload[ref] = listener;
	    if (afterUnload) {
	      setTimeout(this.triggerUnloadCallbacks, 0);
	    }
	    return ref;
	  }

	, unloadDel: function(ref) {
	    if (ref in onUnload) {
	      delete onUnload[ref];
	    }
	  }

	, triggerUnloadCallbacks: function() {
	    for (var ref in onUnload) {
	      onUnload[ref]();
	      delete onUnload[ref];
	    }
	  }
	};

	var unloadTriggered = function() {
	  if (afterUnload) {
	    return;
	  }
	  afterUnload = true;
	  module.exports.triggerUnloadCallbacks();
	};

	// 'unload' alone is not reliable in opera within an iframe, but we
	// can't use `beforeunload` as IE fires it on javascript: links.
	if (!isChromePackagedApp) {
	  module.exports.attachEvent('unload', unloadTriggered);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	/* global crypto:true */
	var crypto = __webpack_require__(18);

	// This string has length 32, a power of 2, so the modulus doesn't introduce a
	// bias.
	var _randomStringChars = 'abcdefghijklmnopqrstuvwxyz012345';
	module.exports = {
	  string: function(length) {
	    var max = _randomStringChars.length;
	    var bytes = crypto.randomBytes(length);
	    var ret = [];
	    for (var i = 0; i < length; i++) {
	      ret.push(_randomStringChars.substr(bytes[i] % max, 1));
	    }
	    return ret.join('');
	  }

	, number: function(max) {
	    return Math.floor(Math.random() * max);
	  }

	, numberString: function(max) {
	    var t = ('' + (max - 1)).length;
	    var p = new Array(t + 1).join('0');
	    return (p + this.number(max)).slice(-t);
	  }
	};


/***/ }),
/* 18 */
/***/ (function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	if (global.crypto && global.crypto.getRandomValues) {
	  module.exports.randomBytes = function(length) {
	    var bytes = new Uint8Array(length);
	    global.crypto.getRandomValues(bytes);
	    return bytes;
	  };
	} else {
	  module.exports.randomBytes = function(length) {
	    var bytes = new Array(length);
	    for (var i = 0; i < length; i++) {
	      bytes[i] = Math.floor(Math.random() * 256);
	    }
	    return bytes;
	  };
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var URL = __webpack_require__(20);

	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(23)('sockjs-client:utils:url');
	}

	module.exports = {
	  getOrigin: function(url) {
	    if (!url) {
	      return null;
	    }

	    var p = new URL(url);
	    if (p.protocol === 'file:') {
	      return null;
	    }

	    var port = p.port;
	    if (!port) {
	      port = (p.protocol === 'https:') ? '443' : '80';
	    }

	    return p.protocol + '//' + p.hostname + ':' + port;
	  }

	, isOriginEqual: function(a, b) {
	    var res = this.getOrigin(a) === this.getOrigin(b);
	    debug('same', a, b, res);
	    return res;
	  }

	, isSchemeEqual: function(a, b) {
	    return (a.split(':')[0] === b.split(':')[0]);
	  }

	, addPath: function (url, path) {
	    var qs = url.split('?');
	    return qs[0] + path + (qs[1] ? '?' + qs[1] : '');
	  }

	, addQuery: function (url, q) {
	    return url + (url.indexOf('?') === -1 ? ('?' + q) : ('&' + q));
	  }
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var required = __webpack_require__(21)
	  , qs = __webpack_require__(22)
	  , slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//
	  , protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\S\s]*)/i
	  , whitespace = '[\\x09\\x0A\\x0B\\x0C\\x0D\\x20\\xA0\\u1680\\u180E\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200A\\u202F\\u205F\\u3000\\u2028\\u2029\\uFEFF]'
	  , left = new RegExp('^'+ whitespace +'+');

	/**
	 * Trim a given string.
	 *
	 * @param {String} str String to trim.
	 * @public
	 */
	function trimLeft(str) {
	  return (str ? str : '').toString().replace(left, '');
	}

	/**
	 * These are the parse rules for the URL parser, it informs the parser
	 * about:
	 *
	 * 0. The char it Needs to parse, if it's a string it should be done using
	 *    indexOf, RegExp using exec and NaN means set as current value.
	 * 1. The property we should set when parsing this value.
	 * 2. Indication if it's backwards or forward parsing, when set as number it's
	 *    the value of extra chars that should be split off.
	 * 3. Inherit from location if non existing in the parser.
	 * 4. `toLowerCase` the resulting value.
	 */
	var rules = [
	  ['#', 'hash'],                        // Extract from the back.
	  ['?', 'query'],                       // Extract from the back.
	  function sanitize(address) {          // Sanitize what is left of the address
	    return address.replace('\\', '/');
	  },
	  ['/', 'pathname'],                    // Extract from the back.
	  ['@', 'auth', 1],                     // Extract from the front.
	  [NaN, 'host', undefined, 1, 1],       // Set left over value.
	  [/:(\d+)$/, 'port', undefined, 1],    // RegExp the back.
	  [NaN, 'hostname', undefined, 1, 1]    // Set left over.
	];

	/**
	 * These properties should not be copied or inherited from. This is only needed
	 * for all non blob URL's as a blob URL does not include a hash, only the
	 * origin.
	 *
	 * @type {Object}
	 * @private
	 */
	var ignore = { hash: 1, query: 1 };

	/**
	 * The location object differs when your code is loaded through a normal page,
	 * Worker or through a worker using a blob. And with the blobble begins the
	 * trouble as the location object will contain the URL of the blob, not the
	 * location of the page where our code is loaded in. The actual origin is
	 * encoded in the `pathname` so we can thankfully generate a good "default"
	 * location from it so we can generate proper relative URL's again.
	 *
	 * @param {Object|String} loc Optional default location object.
	 * @returns {Object} lolcation object.
	 * @public
	 */
	function lolcation(loc) {
	  var globalVar;

	  if (typeof window !== 'undefined') globalVar = window;
	  else if (typeof global !== 'undefined') globalVar = global;
	  else if (typeof self !== 'undefined') globalVar = self;
	  else globalVar = {};

	  var location = globalVar.location || {};
	  loc = loc || location;

	  var finaldestination = {}
	    , type = typeof loc
	    , key;

	  if ('blob:' === loc.protocol) {
	    finaldestination = new Url(unescape(loc.pathname), {});
	  } else if ('string' === type) {
	    finaldestination = new Url(loc, {});
	    for (key in ignore) delete finaldestination[key];
	  } else if ('object' === type) {
	    for (key in loc) {
	      if (key in ignore) continue;
	      finaldestination[key] = loc[key];
	    }

	    if (finaldestination.slashes === undefined) {
	      finaldestination.slashes = slashes.test(loc.href);
	    }
	  }

	  return finaldestination;
	}

	/**
	 * @typedef ProtocolExtract
	 * @type Object
	 * @property {String} protocol Protocol matched in the URL, in lowercase.
	 * @property {Boolean} slashes `true` if protocol is followed by "//", else `false`.
	 * @property {String} rest Rest of the URL that is not part of the protocol.
	 */

	/**
	 * Extract protocol information from a URL with/without double slash ("//").
	 *
	 * @param {String} address URL we want to extract from.
	 * @return {ProtocolExtract} Extracted information.
	 * @private
	 */
	function extractProtocol(address) {
	  address = trimLeft(address);
	  var match = protocolre.exec(address);

	  return {
	    protocol: match[1] ? match[1].toLowerCase() : '',
	    slashes: !!match[2],
	    rest: match[3]
	  };
	}

	/**
	 * Resolve a relative URL pathname against a base URL pathname.
	 *
	 * @param {String} relative Pathname of the relative URL.
	 * @param {String} base Pathname of the base URL.
	 * @return {String} Resolved pathname.
	 * @private
	 */
	function resolve(relative, base) {
	  if (relative === '') return base;

	  var path = (base || '/').split('/').slice(0, -1).concat(relative.split('/'))
	    , i = path.length
	    , last = path[i - 1]
	    , unshift = false
	    , up = 0;

	  while (i--) {
	    if (path[i] === '.') {
	      path.splice(i, 1);
	    } else if (path[i] === '..') {
	      path.splice(i, 1);
	      up++;
	    } else if (up) {
	      if (i === 0) unshift = true;
	      path.splice(i, 1);
	      up--;
	    }
	  }

	  if (unshift) path.unshift('');
	  if (last === '.' || last === '..') path.push('');

	  return path.join('/');
	}

	/**
	 * The actual URL instance. Instead of returning an object we've opted-in to
	 * create an actual constructor as it's much more memory efficient and
	 * faster and it pleases my OCD.
	 *
	 * It is worth noting that we should not use `URL` as class name to prevent
	 * clashes with the global URL instance that got introduced in browsers.
	 *
	 * @constructor
	 * @param {String} address URL we want to parse.
	 * @param {Object|String} [location] Location defaults for relative paths.
	 * @param {Boolean|Function} [parser] Parser for the query string.
	 * @private
	 */
	function Url(address, location, parser) {
	  address = trimLeft(address);

	  if (!(this instanceof Url)) {
	    return new Url(address, location, parser);
	  }

	  var relative, extracted, parse, instruction, index, key
	    , instructions = rules.slice()
	    , type = typeof location
	    , url = this
	    , i = 0;

	  //
	  // The following if statements allows this module two have compatibility with
	  // 2 different API:
	  //
	  // 1. Node.js's `url.parse` api which accepts a URL, boolean as arguments
	  //    where the boolean indicates that the query string should also be parsed.
	  //
	  // 2. The `URL` interface of the browser which accepts a URL, object as
	  //    arguments. The supplied object will be used as default values / fall-back
	  //    for relative paths.
	  //
	  if ('object' !== type && 'string' !== type) {
	    parser = location;
	    location = null;
	  }

	  if (parser && 'function' !== typeof parser) parser = qs.parse;

	  location = lolcation(location);

	  //
	  // Extract protocol information before running the instructions.
	  //
	  extracted = extractProtocol(address || '');
	  relative = !extracted.protocol && !extracted.slashes;
	  url.slashes = extracted.slashes || relative && location.slashes;
	  url.protocol = extracted.protocol || location.protocol || '';
	  address = extracted.rest;

	  //
	  // When the authority component is absent the URL starts with a path
	  // component.
	  //
	  if (!extracted.slashes) instructions[3] = [/(.*)/, 'pathname'];

	  for (; i < instructions.length; i++) {
	    instruction = instructions[i];

	    if (typeof instruction === 'function') {
	      address = instruction(address);
	      continue;
	    }

	    parse = instruction[0];
	    key = instruction[1];

	    if (parse !== parse) {
	      url[key] = address;
	    } else if ('string' === typeof parse) {
	      if (~(index = address.indexOf(parse))) {
	        if ('number' === typeof instruction[2]) {
	          url[key] = address.slice(0, index);
	          address = address.slice(index + instruction[2]);
	        } else {
	          url[key] = address.slice(index);
	          address = address.slice(0, index);
	        }
	      }
	    } else if ((index = parse.exec(address))) {
	      url[key] = index[1];
	      address = address.slice(0, index.index);
	    }

	    url[key] = url[key] || (
	      relative && instruction[3] ? location[key] || '' : ''
	    );

	    //
	    // Hostname, host and protocol should be lowercased so they can be used to
	    // create a proper `origin`.
	    //
	    if (instruction[4]) url[key] = url[key].toLowerCase();
	  }

	  //
	  // Also parse the supplied query string in to an object. If we're supplied
	  // with a custom parser as function use that instead of the default build-in
	  // parser.
	  //
	  if (parser) url.query = parser(url.query);

	  //
	  // If the URL is relative, resolve the pathname against the base URL.
	  //
	  if (
	      relative
	    && location.slashes
	    && url.pathname.charAt(0) !== '/'
	    && (url.pathname !== '' || location.pathname !== '')
	  ) {
	    url.pathname = resolve(url.pathname, location.pathname);
	  }

	  //
	  // We should not add port numbers if they are already the default port number
	  // for a given protocol. As the host also contains the port number we're going
	  // override it with the hostname which contains no port number.
	  //
	  if (!required(url.port, url.protocol)) {
	    url.host = url.hostname;
	    url.port = '';
	  }

	  //
	  // Parse down the `auth` for the username and password.
	  //
	  url.username = url.password = '';
	  if (url.auth) {
	    instruction = url.auth.split(':');
	    url.username = instruction[0] || '';
	    url.password = instruction[1] || '';
	  }

	  url.origin = url.protocol && url.host && url.protocol !== 'file:'
	    ? url.protocol +'//'+ url.host
	    : 'null';

	  //
	  // The href is just the compiled result.
	  //
	  url.href = url.toString();
	}

	/**
	 * This is convenience method for changing properties in the URL instance to
	 * insure that they all propagate correctly.
	 *
	 * @param {String} part          Property we need to adjust.
	 * @param {Mixed} value          The newly assigned value.
	 * @param {Boolean|Function} fn  When setting the query, it will be the function
	 *                               used to parse the query.
	 *                               When setting the protocol, double slash will be
	 *                               removed from the final url if it is true.
	 * @returns {URL} URL instance for chaining.
	 * @public
	 */
	function set(part, value, fn) {
	  var url = this;

	  switch (part) {
	    case 'query':
	      if ('string' === typeof value && value.length) {
	        value = (fn || qs.parse)(value);
	      }

	      url[part] = value;
	      break;

	    case 'port':
	      url[part] = value;

	      if (!required(value, url.protocol)) {
	        url.host = url.hostname;
	        url[part] = '';
	      } else if (value) {
	        url.host = url.hostname +':'+ value;
	      }

	      break;

	    case 'hostname':
	      url[part] = value;

	      if (url.port) value += ':'+ url.port;
	      url.host = value;
	      break;

	    case 'host':
	      url[part] = value;

	      if (/:\d+$/.test(value)) {
	        value = value.split(':');
	        url.port = value.pop();
	        url.hostname = value.join(':');
	      } else {
	        url.hostname = value;
	        url.port = '';
	      }

	      break;

	    case 'protocol':
	      url.protocol = value.toLowerCase();
	      url.slashes = !fn;
	      break;

	    case 'pathname':
	    case 'hash':
	      if (value) {
	        var char = part === 'pathname' ? '/' : '#';
	        url[part] = value.charAt(0) !== char ? char + value : value;
	      } else {
	        url[part] = value;
	      }
	      break;

	    default:
	      url[part] = value;
	  }

	  for (var i = 0; i < rules.length; i++) {
	    var ins = rules[i];

	    if (ins[4]) url[ins[1]] = url[ins[1]].toLowerCase();
	  }

	  url.origin = url.protocol && url.host && url.protocol !== 'file:'
	    ? url.protocol +'//'+ url.host
	    : 'null';

	  url.href = url.toString();

	  return url;
	}

	/**
	 * Transform the properties back in to a valid and full URL string.
	 *
	 * @param {Function} stringify Optional query stringify function.
	 * @returns {String} Compiled version of the URL.
	 * @public
	 */
	function toString(stringify) {
	  if (!stringify || 'function' !== typeof stringify) stringify = qs.stringify;

	  var query
	    , url = this
	    , protocol = url.protocol;

	  if (protocol && protocol.charAt(protocol.length - 1) !== ':') protocol += ':';

	  var result = protocol + (url.slashes ? '//' : '');

	  if (url.username) {
	    result += url.username;
	    if (url.password) result += ':'+ url.password;
	    result += '@';
	  }

	  result += url.host + url.pathname;

	  query = 'object' === typeof url.query ? stringify(url.query) : url.query;
	  if (query) result += '?' !== query.charAt(0) ? '?'+ query : query;

	  if (url.hash) result += url.hash;

	  return result;
	}

	Url.prototype = { set: set, toString: toString };

	//
	// Expose the URL parser and some additional properties that might be useful for
	// others or testing.
	//
	Url.extractProtocol = extractProtocol;
	Url.location = lolcation;
	Url.trimLeft = trimLeft;
	Url.qs = qs;

	module.exports = Url;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 21 */
/***/ (function(module, exports) {

	'use strict';

	/**
	 * Check if we're required to add a port number.
	 *
	 * @see https://url.spec.whatwg.org/#default-port
	 * @param {Number|String} port Port number we need to check
	 * @param {String} protocol Protocol we need to check against.
	 * @returns {Boolean} Is it a default port for the given protocol
	 * @api private
	 */
	module.exports = function required(port, protocol) {
	  protocol = protocol.split(':')[0];
	  port = +port;

	  if (!port) return false;

	  switch (protocol) {
	    case 'http':
	    case 'ws':
	    return port !== 80;

	    case 'https':
	    case 'wss':
	    return port !== 443;

	    case 'ftp':
	    return port !== 21;

	    case 'gopher':
	    return port !== 70;

	    case 'file':
	    return false;
	  }

	  return port !== 0;
	};


/***/ }),
/* 22 */
/***/ (function(module, exports) {

	'use strict';

	var has = Object.prototype.hasOwnProperty
	  , undef;

	/**
	 * Decode a URI encoded string.
	 *
	 * @param {String} input The URI encoded string.
	 * @returns {String|Null} The decoded string.
	 * @api private
	 */
	function decode(input) {
	  try {
	    return decodeURIComponent(input.replace(/\+/g, ' '));
	  } catch (e) {
	    return null;
	  }
	}

	/**
	 * Attempts to encode a given input.
	 *
	 * @param {String} input The string that needs to be encoded.
	 * @returns {String|Null} The encoded string.
	 * @api private
	 */
	function encode(input) {
	  try {
	    return encodeURIComponent(input);
	  } catch (e) {
	    return null;
	  }
	}

	/**
	 * Simple query string parser.
	 *
	 * @param {String} query The query string that needs to be parsed.
	 * @returns {Object}
	 * @api public
	 */
	function querystring(query) {
	  var parser = /([^=?&]+)=?([^&]*)/g
	    , result = {}
	    , part;

	  while (part = parser.exec(query)) {
	    var key = decode(part[1])
	      , value = decode(part[2]);

	    //
	    // Prevent overriding of existing properties. This ensures that build-in
	    // methods like `toString` or __proto__ are not overriden by malicious
	    // querystrings.
	    //
	    // In the case if failed decoding, we want to omit the key/value pairs
	    // from the result.
	    //
	    if (key === null || value === null || key in result) continue;
	    result[key] = value;
	  }

	  return result;
	}

	/**
	 * Transform a query string to an object.
	 *
	 * @param {Object} obj Object that should be transformed.
	 * @param {String} prefix Optional prefix.
	 * @returns {String}
	 * @api public
	 */
	function querystringify(obj, prefix) {
	  prefix = prefix || '';

	  var pairs = []
	    , value
	    , key;

	  //
	  // Optionally prefix with a '?' if needed
	  //
	  if ('string' !== typeof prefix) prefix = '?';

	  for (key in obj) {
	    if (has.call(obj, key)) {
	      value = obj[key];

	      //
	      // Edge cases where we actually want to encode the value to an empty
	      // string instead of the stringified value.
	      //
	      if (!value && (value === null || value === undef || isNaN(value))) {
	        value = '';
	      }

	      key = encodeURIComponent(key);
	      value = encodeURIComponent(value);

	      //
	      // If we failed to encode the strings, we should bail out as we don't
	      // want to add invalid strings to the query.
	      //
	      if (key === null || value === null) continue;
	      pairs.push(key +'='+ value);
	    }
	  }

	  return pairs.length ? prefix + pairs.join('&') : '';
	}

	//
	// Expose the module.
	//
	exports.stringify = querystringify;
	exports.parse = querystring;


/***/ }),
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */
/***/ (function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var inherits = __webpack_require__(26)
	  , EventTarget = __webpack_require__(28)
	  ;

	function EventEmitter() {
	  EventTarget.call(this);
	}

	inherits(EventEmitter, EventTarget);

	EventEmitter.prototype.removeAllListeners = function(type) {
	  if (type) {
	    delete this._listeners[type];
	  } else {
	    this._listeners = {};
	  }
	};

	EventEmitter.prototype.once = function(type, listener) {
	  var self = this
	    , fired = false;

	  function g() {
	    self.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  this.on(type, g);
	};

	EventEmitter.prototype.emit = function() {
	  var type = arguments[0];
	  var listeners = this._listeners[type];
	  if (!listeners) {
	    return;
	  }
	  // equivalent of Array.prototype.slice.call(arguments, 1);
	  var l = arguments.length;
	  var args = new Array(l - 1);
	  for (var ai = 1; ai < l; ai++) {
	    args[ai - 1] = arguments[ai];
	  }
	  for (var i = 0; i < listeners.length; i++) {
	    listeners[i].apply(this, args);
	  }
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener = EventTarget.prototype.addEventListener;
	EventEmitter.prototype.removeListener = EventTarget.prototype.removeEventListener;

	module.exports.EventEmitter = EventEmitter;


/***/ }),
/* 28 */
/***/ (function(module, exports) {

	'use strict';

	/* Simplified implementation of DOM2 EventTarget.
	 *   http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget
	 */

	function EventTarget() {
	  this._listeners = {};
	}

	EventTarget.prototype.addEventListener = function(eventType, listener) {
	  if (!(eventType in this._listeners)) {
	    this._listeners[eventType] = [];
	  }
	  var arr = this._listeners[eventType];
	  // #4
	  if (arr.indexOf(listener) === -1) {
	    // Make a copy so as not to interfere with a current dispatchEvent.
	    arr = arr.concat([listener]);
	  }
	  this._listeners[eventType] = arr;
	};

	EventTarget.prototype.removeEventListener = function(eventType, listener) {
	  var arr = this._listeners[eventType];
	  if (!arr) {
	    return;
	  }
	  var idx = arr.indexOf(listener);
	  if (idx !== -1) {
	    if (arr.length > 1) {
	      // Make a copy so as not to interfere with a current dispatchEvent.
	      this._listeners[eventType] = arr.slice(0, idx).concat(arr.slice(idx + 1));
	    } else {
	      delete this._listeners[eventType];
	    }
	    return;
	  }
	};

	EventTarget.prototype.dispatchEvent = function() {
	  var event = arguments[0];
	  var t = event.type;
	  // equivalent of Array.prototype.slice.call(arguments, 0);
	  var args = arguments.length === 1 ? [event] : Array.apply(null, arguments);
	  // TODO: This doesn't match the real behavior; per spec, onfoo get
	  // their place in line from the /first/ time they're set from
	  // non-null. Although WebKit bumps it to the end every time it's
	  // set.
	  if (this['on' + t]) {
	    this['on' + t].apply(this, args);
	  }
	  if (t in this._listeners) {
	    // Grab a reference to the listeners list. removeEventListener may alter the list.
	    var listeners = this._listeners[t];
	    for (var i = 0; i < listeners.length; i++) {
	      listeners[i].apply(this, args);
	    }
	  }
	};

	module.exports = EventTarget;


/***/ }),
/* 29 */
/***/ (function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var Driver = global.WebSocket || global.MozWebSocket;
	if (Driver) {
		module.exports = function WebSocketBrowserDriver(url) {
			return new Driver(url);
		};
	} else {
		module.exports = undefined;
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var inherits = __webpack_require__(26)
	  , AjaxBasedTransport = __webpack_require__(31)
	  , XhrReceiver = __webpack_require__(35)
	  , XHRCorsObject = __webpack_require__(36)
	  , XHRLocalObject = __webpack_require__(38)
	  , browser = __webpack_require__(39)
	  ;

	function XhrStreamingTransport(transUrl) {
	  if (!XHRLocalObject.enabled && !XHRCorsObject.enabled) {
	    throw new Error('Transport created when disabled');
	  }
	  AjaxBasedTransport.call(this, transUrl, '/xhr_streaming', XhrReceiver, XHRCorsObject);
	}

	inherits(XhrStreamingTransport, AjaxBasedTransport);

	XhrStreamingTransport.enabled = function(info) {
	  if (info.nullOrigin) {
	    return false;
	  }
	  // Opera doesn't support xhr-streaming #60
	  // But it might be able to #92
	  if (browser.isOpera()) {
	    return false;
	  }

	  return XHRCorsObject.enabled;
	};

	XhrStreamingTransport.transportName = 'xhr-streaming';
	XhrStreamingTransport.roundTrips = 2; // preflight, ajax

	// Safari gets confused when a streaming ajax request is started
	// before onload. This causes the load indicator to spin indefinetely.
	// Only require body when used in a browser
	XhrStreamingTransport.needBody = !!global.document;

	module.exports = XhrStreamingTransport;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var inherits = __webpack_require__(26)
	  , urlUtils = __webpack_require__(19)
	  , SenderReceiver = __webpack_require__(32)
	  ;

	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(23)('sockjs-client:ajax-based');
	}

	function createAjaxSender(AjaxObject) {
	  return function(url, payload, callback) {
	    debug('create ajax sender', url, payload);
	    var opt = {};
	    if (typeof payload === 'string') {
	      opt.headers = {'Content-type': 'text/plain'};
	    }
	    var ajaxUrl = urlUtils.addPath(url, '/xhr_send');
	    var xo = new AjaxObject('POST', ajaxUrl, payload, opt);
	    xo.once('finish', function(status) {
	      debug('finish', status);
	      xo = null;

	      if (status !== 200 && status !== 204) {
	        return callback(new Error('http status ' + status));
	      }
	      callback();
	    });
	    return function() {
	      debug('abort');
	      xo.close();
	      xo = null;

	      var err = new Error('Aborted');
	      err.code = 1000;
	      callback(err);
	    };
	  };
	}

	function AjaxBasedTransport(transUrl, urlSuffix, Receiver, AjaxObject) {
	  SenderReceiver.call(this, transUrl, urlSuffix, createAjaxSender(AjaxObject), Receiver, AjaxObject);
	}

	inherits(AjaxBasedTransport, SenderReceiver);

	module.exports = AjaxBasedTransport;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var inherits = __webpack_require__(26)
	  , urlUtils = __webpack_require__(19)
	  , BufferedSender = __webpack_require__(33)
	  , Polling = __webpack_require__(34)
	  ;

	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(23)('sockjs-client:sender-receiver');
	}

	function SenderReceiver(transUrl, urlSuffix, senderFunc, Receiver, AjaxObject) {
	  var pollUrl = urlUtils.addPath(transUrl, urlSuffix);
	  debug(pollUrl);
	  var self = this;
	  BufferedSender.call(this, transUrl, senderFunc);

	  this.poll = new Polling(Receiver, pollUrl, AjaxObject);
	  this.poll.on('message', function(msg) {
	    debug('poll message', msg);
	    self.emit('message', msg);
	  });
	  this.poll.once('close', function(code, reason) {
	    debug('poll close', code, reason);
	    self.poll = null;
	    self.emit('close', code, reason);
	    self.close();
	  });
	}

	inherits(SenderReceiver, BufferedSender);

	SenderReceiver.prototype.close = function() {
	  BufferedSender.prototype.close.call(this);
	  debug('close');
	  this.removeAllListeners();
	  if (this.poll) {
	    this.poll.abort();
	    this.poll = null;
	  }
	};

	module.exports = SenderReceiver;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var inherits = __webpack_require__(26)
	  , EventEmitter = __webpack_require__(27).EventEmitter
	  ;

	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(23)('sockjs-client:buffered-sender');
	}

	function BufferedSender(url, sender) {
	  debug(url);
	  EventEmitter.call(this);
	  this.sendBuffer = [];
	  this.sender = sender;
	  this.url = url;
	}

	inherits(BufferedSender, EventEmitter);

	BufferedSender.prototype.send = function(message) {
	  debug('send', message);
	  this.sendBuffer.push(message);
	  if (!this.sendStop) {
	    this.sendSchedule();
	  }
	};

	// For polling transports in a situation when in the message callback,
	// new message is being send. If the sending connection was started
	// before receiving one, it is possible to saturate the network and
	// timeout due to the lack of receiving socket. To avoid that we delay
	// sending messages by some small time, in order to let receiving
	// connection be started beforehand. This is only a halfmeasure and
	// does not fix the big problem, but it does make the tests go more
	// stable on slow networks.
	BufferedSender.prototype.sendScheduleWait = function() {
	  debug('sendScheduleWait');
	  var self = this;
	  var tref;
	  this.sendStop = function() {
	    debug('sendStop');
	    self.sendStop = null;
	    clearTimeout(tref);
	  };
	  tref = setTimeout(function() {
	    debug('timeout');
	    self.sendStop = null;
	    self.sendSchedule();
	  }, 25);
	};

	BufferedSender.prototype.sendSchedule = function() {
	  debug('sendSchedule', this.sendBuffer.length);
	  var self = this;
	  if (this.sendBuffer.length > 0) {
	    var payload = '[' + this.sendBuffer.join(',') + ']';
	    this.sendStop = this.sender(this.url, payload, function(err) {
	      self.sendStop = null;
	      if (err) {
	        debug('error', err);
	        self.emit('close', err.code || 1006, 'Sending error: ' + err);
	        self.close();
	      } else {
	        self.sendScheduleWait();
	      }
	    });
	    this.sendBuffer = [];
	  }
	};

	BufferedSender.prototype._cleanup = function() {
	  debug('_cleanup');
	  this.removeAllListeners();
	};

	BufferedSender.prototype.close = function() {
	  debug('close');
	  this._cleanup();
	  if (this.sendStop) {
	    this.sendStop();
	    this.sendStop = null;
	  }
	};

	module.exports = BufferedSender;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var inherits = __webpack_require__(26)
	  , EventEmitter = __webpack_require__(27).EventEmitter
	  ;

	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(23)('sockjs-client:polling');
	}

	function Polling(Receiver, receiveUrl, AjaxObject) {
	  debug(receiveUrl);
	  EventEmitter.call(this);
	  this.Receiver = Receiver;
	  this.receiveUrl = receiveUrl;
	  this.AjaxObject = AjaxObject;
	  this._scheduleReceiver();
	}

	inherits(Polling, EventEmitter);

	Polling.prototype._scheduleReceiver = function() {
	  debug('_scheduleReceiver');
	  var self = this;
	  var poll = this.poll = new this.Receiver(this.receiveUrl, this.AjaxObject);

	  poll.on('message', function(msg) {
	    debug('message', msg);
	    self.emit('message', msg);
	  });

	  poll.once('close', function(code, reason) {
	    debug('close', code, reason, self.pollIsClosing);
	    self.poll = poll = null;

	    if (!self.pollIsClosing) {
	      if (reason === 'network') {
	        self._scheduleReceiver();
	      } else {
	        self.emit('close', code || 1006, reason);
	        self.removeAllListeners();
	      }
	    }
	  });
	};

	Polling.prototype.abort = function() {
	  debug('abort');
	  this.removeAllListeners();
	  this.pollIsClosing = true;
	  if (this.poll) {
	    this.poll.abort();
	  }
	};

	module.exports = Polling;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var inherits = __webpack_require__(26)
	  , EventEmitter = __webpack_require__(27).EventEmitter
	  ;

	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(23)('sockjs-client:receiver:xhr');
	}

	function XhrReceiver(url, AjaxObject) {
	  debug(url);
	  EventEmitter.call(this);
	  var self = this;

	  this.bufferPosition = 0;

	  this.xo = new AjaxObject('POST', url, null);
	  this.xo.on('chunk', this._chunkHandler.bind(this));
	  this.xo.once('finish', function(status, text) {
	    debug('finish', status, text);
	    self._chunkHandler(status, text);
	    self.xo = null;
	    var reason = status === 200 ? 'network' : 'permanent';
	    debug('close', reason);
	    self.emit('close', null, reason);
	    self._cleanup();
	  });
	}

	inherits(XhrReceiver, EventEmitter);

	XhrReceiver.prototype._chunkHandler = function(status, text) {
	  debug('_chunkHandler', status);
	  if (status !== 200 || !text) {
	    return;
	  }

	  for (var idx = -1; ; this.bufferPosition += idx + 1) {
	    var buf = text.slice(this.bufferPosition);
	    idx = buf.indexOf('\n');
	    if (idx === -1) {
	      break;
	    }
	    var msg = buf.slice(0, idx);
	    if (msg) {
	      debug('message', msg);
	      this.emit('message', msg);
	    }
	  }
	};

	XhrReceiver.prototype._cleanup = function() {
	  debug('_cleanup');
	  this.removeAllListeners();
	};

	XhrReceiver.prototype.abort = function() {
	  debug('abort');
	  if (this.xo) {
	    this.xo.close();
	    debug('close');
	    this.emit('close', null, 'user');
	    this.xo = null;
	  }
	  this._cleanup();
	};

	module.exports = XhrReceiver;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var inherits = __webpack_require__(26)
	  , XhrDriver = __webpack_require__(37)
	  ;

	function XHRCorsObject(method, url, payload, opts) {
	  XhrDriver.call(this, method, url, payload, opts);
	}

	inherits(XHRCorsObject, XhrDriver);

	XHRCorsObject.enabled = XhrDriver.enabled && XhrDriver.supportsCORS;

	module.exports = XHRCorsObject;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {'use strict';

	var EventEmitter = __webpack_require__(27).EventEmitter
	  , inherits = __webpack_require__(26)
	  , utils = __webpack_require__(16)
	  , urlUtils = __webpack_require__(19)
	  , XHR = global.XMLHttpRequest
	  ;

	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(23)('sockjs-client:browser:xhr');
	}

	function AbstractXHRObject(method, url, payload, opts) {
	  debug(method, url);
	  var self = this;
	  EventEmitter.call(this);

	  setTimeout(function () {
	    self._start(method, url, payload, opts);
	  }, 0);
	}

	inherits(AbstractXHRObject, EventEmitter);

	AbstractXHRObject.prototype._start = function(method, url, payload, opts) {
	  var self = this;

	  try {
	    this.xhr = new XHR();
	  } catch (x) {
	    // intentionally empty
	  }

	  if (!this.xhr) {
	    debug('no xhr');
	    this.emit('finish', 0, 'no xhr support');
	    this._cleanup();
	    return;
	  }

	  // several browsers cache POSTs
	  url = urlUtils.addQuery(url, 't=' + (+new Date()));

	  // Explorer tends to keep connection open, even after the
	  // tab gets closed: http://bugs.jquery.com/ticket/5280
	  this.unloadRef = utils.unloadAdd(function() {
	    debug('unload cleanup');
	    self._cleanup(true);
	  });
	  try {
	    this.xhr.open(method, url, true);
	    if (this.timeout && 'timeout' in this.xhr) {
	      this.xhr.timeout = this.timeout;
	      this.xhr.ontimeout = function() {
	        debug('xhr timeout');
	        self.emit('finish', 0, '');
	        self._cleanup(false);
	      };
	    }
	  } catch (e) {
	    debug('exception', e);
	    // IE raises an exception on wrong port.
	    this.emit('finish', 0, '');
	    this._cleanup(false);
	    return;
	  }

	  if ((!opts || !opts.noCredentials) && AbstractXHRObject.supportsCORS) {
	    debug('withCredentials');
	    // Mozilla docs says https://developer.mozilla.org/en/XMLHttpRequest :
	    // "This never affects same-site requests."

	    this.xhr.withCredentials = true;
	  }
	  if (opts && opts.headers) {
	    for (var key in opts.headers) {
	      this.xhr.setRequestHeader(key, opts.headers[key]);
	    }
	  }

	  this.xhr.onreadystatechange = function() {
	    if (self.xhr) {
	      var x = self.xhr;
	      var text, status;
	      debug('readyState', x.readyState);
	      switch (x.readyState) {
	      case 3:
	        // IE doesn't like peeking into responseText or status
	        // on Microsoft.XMLHTTP and readystate=3
	        try {
	          status = x.status;
	          text = x.responseText;
	        } catch (e) {
	          // intentionally empty
	        }
	        debug('status', status);
	        // IE returns 1223 for 204: http://bugs.jquery.com/ticket/1450
	        if (status === 1223) {
	          status = 204;
	        }

	        // IE does return readystate == 3 for 404 answers.
	        if (status === 200 && text && text.length > 0) {
	          debug('chunk');
	          self.emit('chunk', status, text);
	        }
	        break;
	      case 4:
	        status = x.status;
	        debug('status', status);
	        // IE returns 1223 for 204: http://bugs.jquery.com/ticket/1450
	        if (status === 1223) {
	          status = 204;
	        }
	        // IE returns this for a bad port
	        // http://msdn.microsoft.com/en-us/library/windows/desktop/aa383770(v=vs.85).aspx
	        if (status === 12005 || status === 12029) {
	          status = 0;
	        }

	        debug('finish', status, x.responseText);
	        self.emit('finish', status, x.responseText);
	        self._cleanup(false);
	        break;
	      }
	    }
	  };

	  try {
	    self.xhr.send(payload);
	  } catch (e) {
	    self.emit('finish', 0, '');
	    self._cleanup(false);
	  }
	};

	AbstractXHRObject.prototype._cleanup = function(abort) {
	  debug('cleanup');
	  if (!this.xhr) {
	    return;
	  }
	  this.removeAllListeners();
	  utils.unloadDel(this.unloadRef);

	  // IE needs this field to be a function
	  this.xhr.onreadystatechange = function() {};
	  if (this.xhr.ontimeout) {
	    this.xhr.ontimeout = null;
	  }

	  if (abort) {
	    try {
	      this.xhr.abort();
	    } catch (x) {
	      // intentionally empty
	    }
	  }
	  this.unloadRef = this.xhr = null;
	};

	AbstractXHRObject.prototype.close = function() {
	  debug('close');
	  this._cleanup(true);
	};

	AbstractXHRObject.enabled = !!XHR;
	// override XMLHttpRequest for IE6/7
	// obfuscate to avoid firewalls
	var axo = ['Active'].concat('Object').join('X');
	if (!AbstractXHRObject.enabled && (axo in global)) {
	  debug('overriding xmlhttprequest');
	  XHR = function() {
	    try {
	      return new global[axo]('Microsoft.XMLHTTP');
	    } catch (e) {
	      return null;
	    }
	  };
	  AbstractXHRObject.enabled = !!new XHR();
	}

	var cors = false;
	try {
	  cors = 'withCredentials' in new XHR();
	} catch (ignored) {
	  // intentionally empty
	}

	AbstractXHRObject.supportsCORS = cors;

	module.exports = AbstractXHRObject;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(15)))

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var inherits = __webpack_require__(26)
	  , XhrDriver = __webpack_require__(37)
	  ;

	function XHRLocalObject(method, url, payload /*, opts */) {
	  XhrDriver.call(this, method, url, payload, {
	    noCredentials: true
	  });
	}

	inherits(XHRLocalObject, XhrDriver);

	XHRLocalObject.enabled = XhrDriver.enabled;

	module.exports = XHRLocalObject;


/***/ }),
/* 39 */
/***/ (function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	module.exports = {
	  isOpera: function() {
	    return global.navigator &&
	      /opera/i.test(global.navigator.userAgent);
	  }

	, isKonqueror: function() {
	    return global.navigator &&
	      /konqueror/i.test(global.navigator.userAgent);
	  }

	  // #187 wrap document.domain in try/catch because of WP8 from file:///
	, hasDomain: function () {
	    // non-browser client always has a domain
	    if (!global.document) {
	      return true;
	    }

	    try {
	      return !!global.document.domain;
	    } catch (e) {
	      return false;
	    }
	  }
	};

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var inherits = __webpack_require__(26)
	  , AjaxBasedTransport = __webpack_require__(31)
	  , XhrReceiver = __webpack_require__(35)
	  , XDRObject = __webpack_require__(41)
	  ;

	// According to:
	//   http://stackoverflow.com/questions/1641507/detect-browser-support-for-cross-domain-xmlhttprequests
	//   http://hacks.mozilla.org/2009/07/cross-site-xmlhttprequest-with-cors/

	function XdrStreamingTransport(transUrl) {
	  if (!XDRObject.enabled) {
	    throw new Error('Transport created when disabled');
	  }
	  AjaxBasedTransport.call(this, transUrl, '/xhr_streaming', XhrReceiver, XDRObject);
	}

	inherits(XdrStreamingTransport, AjaxBasedTransport);

	XdrStreamingTransport.enabled = function(info) {
	  if (info.cookie_needed || info.nullOrigin) {
	    return false;
	  }
	  return XDRObject.enabled && info.sameScheme;
	};

	XdrStreamingTransport.transportName = 'xdr-streaming';
	XdrStreamingTransport.roundTrips = 2; // preflight, ajax

	module.exports = XdrStreamingTransport;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, global) {'use strict';

	var EventEmitter = __webpack_require__(27).EventEmitter
	  , inherits = __webpack_require__(26)
	  , eventUtils = __webpack_require__(16)
	  , browser = __webpack_require__(39)
	  , urlUtils = __webpack_require__(19)
	  ;

	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(23)('sockjs-client:sender:xdr');
	}

	// References:
	//   http://ajaxian.com/archives/100-line-ajax-wrapper
	//   http://msdn.microsoft.com/en-us/library/cc288060(v=VS.85).aspx

	function XDRObject(method, url, payload) {
	  debug(method, url);
	  var self = this;
	  EventEmitter.call(this);

	  setTimeout(function() {
	    self._start(method, url, payload);
	  }, 0);
	}

	inherits(XDRObject, EventEmitter);

	XDRObject.prototype._start = function(method, url, payload) {
	  debug('_start');
	  var self = this;
	  var xdr = new global.XDomainRequest();
	  // IE caches even POSTs
	  url = urlUtils.addQuery(url, 't=' + (+new Date()));

	  xdr.onerror = function() {
	    debug('onerror');
	    self._error();
	  };
	  xdr.ontimeout = function() {
	    debug('ontimeout');
	    self._error();
	  };
	  xdr.onprogress = function() {
	    debug('progress', xdr.responseText);
	    self.emit('chunk', 200, xdr.responseText);
	  };
	  xdr.onload = function() {
	    debug('load');
	    self.emit('finish', 200, xdr.responseText);
	    self._cleanup(false);
	  };
	  this.xdr = xdr;
	  this.unloadRef = eventUtils.unloadAdd(function() {
	    self._cleanup(true);
	  });
	  try {
	    // Fails with AccessDenied if port number is bogus
	    this.xdr.open(method, url);
	    if (this.timeout) {
	      this.xdr.timeout = this.timeout;
	    }
	    this.xdr.send(payload);
	  } catch (x) {
	    this._error();
	  }
	};

	XDRObject.prototype._error = function() {
	  this.emit('finish', 0, '');
	  this._cleanup(false);
	};

	XDRObject.prototype._cleanup = function(abort) {
	  debug('cleanup', abort);
	  if (!this.xdr) {
	    return;
	  }
	  this.removeAllListeners();
	  eventUtils.unloadDel(this.unloadRef);

	  this.xdr.ontimeout = this.xdr.onerror = this.xdr.onprogress = this.xdr.onload = null;
	  if (abort) {
	    try {
	      this.xdr.abort();
	    } catch (x) {
	      // intentionally empty
	    }
	  }
	  this.unloadRef = this.xdr = null;
	};

	XDRObject.prototype.close = function() {
	  debug('close');
	  this._cleanup(true);
	};

	// IE 8/9 if the request target uses the same scheme - #79
	XDRObject.enabled = !!(global.XDomainRequest && browser.hasDomain());

	module.exports = XDRObject;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15), (function() { return this; }())))

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var inherits = __webpack_require__(26)
	  , AjaxBasedTransport = __webpack_require__(31)
	  , EventSourceReceiver = __webpack_require__(43)
	  , XHRCorsObject = __webpack_require__(36)
	  , EventSourceDriver = __webpack_require__(44)
	  ;

	function EventSourceTransport(transUrl) {
	  if (!EventSourceTransport.enabled()) {
	    throw new Error('Transport created when disabled');
	  }

	  AjaxBasedTransport.call(this, transUrl, '/eventsource', EventSourceReceiver, XHRCorsObject);
	}

	inherits(EventSourceTransport, AjaxBasedTransport);

	EventSourceTransport.enabled = function() {
	  return !!EventSourceDriver;
	};

	EventSourceTransport.transportName = 'eventsource';
	EventSourceTransport.roundTrips = 2;

	module.exports = EventSourceTransport;


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var inherits = __webpack_require__(26)
	  , EventEmitter = __webpack_require__(27).EventEmitter
	  , EventSourceDriver = __webpack_require__(44)
	  ;

	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(23)('sockjs-client:receiver:eventsource');
	}

	function EventSourceReceiver(url) {
	  debug(url);
	  EventEmitter.call(this);

	  var self = this;
	  var es = this.es = new EventSourceDriver(url);
	  es.onmessage = function(e) {
	    debug('message', e.data);
	    self.emit('message', decodeURI(e.data));
	  };
	  es.onerror = function(e) {
	    debug('error', es.readyState, e);
	    // ES on reconnection has readyState = 0 or 1.
	    // on network error it's CLOSED = 2
	    var reason = (es.readyState !== 2 ? 'network' : 'permanent');
	    self._cleanup();
	    self._close(reason);
	  };
	}

	inherits(EventSourceReceiver, EventEmitter);

	EventSourceReceiver.prototype.abort = function() {
	  debug('abort');
	  this._cleanup();
	  this._close('user');
	};

	EventSourceReceiver.prototype._cleanup = function() {
	  debug('cleanup');
	  var es = this.es;
	  if (es) {
	    es.onmessage = es.onerror = null;
	    es.close();
	    this.es = null;
	  }
	};

	EventSourceReceiver.prototype._close = function(reason) {
	  debug('close', reason);
	  var self = this;
	  // Safari and chrome < 15 crash if we close window before
	  // waiting for ES cleanup. See:
	  // https://code.google.com/p/chromium/issues/detail?id=89155
	  setTimeout(function() {
	    self.emit('close', null, reason);
	    self.removeAllListeners();
	  }, 200);
	};

	module.exports = EventSourceReceiver;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))

/***/ }),
/* 44 */
/***/ (function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports = global.EventSource;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var inherits = __webpack_require__(26)
	  , IframeTransport = __webpack_require__(46)
	  , objectUtils = __webpack_require__(51)
	  ;

	module.exports = function(transport) {

	  function IframeWrapTransport(transUrl, baseUrl) {
	    IframeTransport.call(this, transport.transportName, transUrl, baseUrl);
	  }

	  inherits(IframeWrapTransport, IframeTransport);

	  IframeWrapTransport.enabled = function(url, info) {
	    if (!global.document) {
	      return false;
	    }

	    var iframeInfo = objectUtils.extend({}, info);
	    iframeInfo.sameOrigin = true;
	    return transport.enabled(iframeInfo) && IframeTransport.enabled();
	  };

	  IframeWrapTransport.transportName = 'iframe-' + transport.transportName;
	  IframeWrapTransport.needBody = true;
	  IframeWrapTransport.roundTrips = IframeTransport.roundTrips + transport.roundTrips - 1; // html, javascript (2) + transport - no CORS (1)

	  IframeWrapTransport.facadeTransport = transport;

	  return IframeWrapTransport;
	};

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	// Few cool transports do work only for same-origin. In order to make
	// them work cross-domain we shall use iframe, served from the
	// remote domain. New browsers have capabilities to communicate with
	// cross domain iframe using postMessage(). In IE it was implemented
	// from IE 8+, but of course, IE got some details wrong:
	//    http://msdn.microsoft.com/en-us/library/cc197015(v=VS.85).aspx
	//    http://stevesouders.com/misc/test-postmessage.php

	var inherits = __webpack_require__(26)
	  , JSON3 = __webpack_require__(47)
	  , EventEmitter = __webpack_require__(27).EventEmitter
	  , version = __webpack_require__(49)
	  , urlUtils = __webpack_require__(19)
	  , iframeUtils = __webpack_require__(50)
	  , eventUtils = __webpack_require__(16)
	  , random = __webpack_require__(17)
	  ;

	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(23)('sockjs-client:transport:iframe');
	}

	function IframeTransport(transport, transUrl, baseUrl) {
	  if (!IframeTransport.enabled()) {
	    throw new Error('Transport created when disabled');
	  }
	  EventEmitter.call(this);

	  var self = this;
	  this.origin = urlUtils.getOrigin(baseUrl);
	  this.baseUrl = baseUrl;
	  this.transUrl = transUrl;
	  this.transport = transport;
	  this.windowId = random.string(8);

	  var iframeUrl = urlUtils.addPath(baseUrl, '/iframe.html') + '#' + this.windowId;
	  debug(transport, transUrl, iframeUrl);

	  this.iframeObj = iframeUtils.createIframe(iframeUrl, function(r) {
	    debug('err callback');
	    self.emit('close', 1006, 'Unable to load an iframe (' + r + ')');
	    self.close();
	  });

	  this.onmessageCallback = this._message.bind(this);
	  eventUtils.attachEvent('message', this.onmessageCallback);
	}

	inherits(IframeTransport, EventEmitter);

	IframeTransport.prototype.close = function() {
	  debug('close');
	  this.removeAllListeners();
	  if (this.iframeObj) {
	    eventUtils.detachEvent('message', this.onmessageCallback);
	    try {
	      // When the iframe is not loaded, IE raises an exception
	      // on 'contentWindow'.
	      this.postMessage('c');
	    } catch (x) {
	      // intentionally empty
	    }
	    this.iframeObj.cleanup();
	    this.iframeObj = null;
	    this.onmessageCallback = this.iframeObj = null;
	  }
	};

	IframeTransport.prototype._message = function(e) {
	  debug('message', e.data);
	  if (!urlUtils.isOriginEqual(e.origin, this.origin)) {
	    debug('not same origin', e.origin, this.origin);
	    return;
	  }

	  var iframeMessage;
	  try {
	    iframeMessage = JSON3.parse(e.data);
	  } catch (ignored) {
	    debug('bad json', e.data);
	    return;
	  }

	  if (iframeMessage.windowId !== this.windowId) {
	    debug('mismatched window id', iframeMessage.windowId, this.windowId);
	    return;
	  }

	  switch (iframeMessage.type) {
	  case 's':
	    this.iframeObj.loaded();
	    // window global dependency
	    this.postMessage('s', JSON3.stringify([
	      version
	    , this.transport
	    , this.transUrl
	    , this.baseUrl
	    ]));
	    break;
	  case 't':
	    this.emit('message', iframeMessage.data);
	    break;
	  case 'c':
	    var cdata;
	    try {
	      cdata = JSON3.parse(iframeMessage.data);
	    } catch (ignored) {
	      debug('bad json', iframeMessage.data);
	      return;
	    }
	    this.emit('close', cdata[0], cdata[1]);
	    this.close();
	    break;
	  }
	};

	IframeTransport.prototype.postMessage = function(type, data) {
	  debug('postMessage', type, data);
	  this.iframeObj.post(JSON3.stringify({
	    windowId: this.windowId
	  , type: type
	  , data: data || ''
	  }), this.origin);
	};

	IframeTransport.prototype.send = function(message) {
	  debug('send', message);
	  this.postMessage('m', message);
	};

	IframeTransport.enabled = function() {
	  return iframeUtils.iframeEnabled;
	};

	IframeTransport.transportName = 'iframe';
	IframeTransport.roundTrips = 2;

	module.exports = IframeTransport;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {/*! JSON v3.3.2 | http://bestiejs.github.io/json3 | Copyright 2012-2014, Kit Cambridge | http://kit.mit-license.org */
	;(function () {
	  // Detect the `define` function exposed by asynchronous module loaders. The
	  // strict `define` check is necessary for compatibility with `r.js`.
	  var isLoader = "function" === "function" && __webpack_require__(48);

	  // A set of types used to distinguish objects from primitives.
	  var objectTypes = {
	    "function": true,
	    "object": true
	  };

	  // Detect the `exports` object exposed by CommonJS implementations.
	  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

	  // Use the `global` object exposed by Node (including Browserify via
	  // `insert-module-globals`), Narwhal, and Ringo as the default context,
	  // and the `window` object in browsers. Rhino exports a `global` function
	  // instead.
	  var root = objectTypes[typeof window] && window || this,
	      freeGlobal = freeExports && objectTypes[typeof module] && module && !module.nodeType && typeof global == "object" && global;

	  if (freeGlobal && (freeGlobal["global"] === freeGlobal || freeGlobal["window"] === freeGlobal || freeGlobal["self"] === freeGlobal)) {
	    root = freeGlobal;
	  }

	  // Public: Initializes JSON 3 using the given `context` object, attaching the
	  // `stringify` and `parse` functions to the specified `exports` object.
	  function runInContext(context, exports) {
	    context || (context = root["Object"]());
	    exports || (exports = root["Object"]());

	    // Native constructor aliases.
	    var Number = context["Number"] || root["Number"],
	        String = context["String"] || root["String"],
	        Object = context["Object"] || root["Object"],
	        Date = context["Date"] || root["Date"],
	        SyntaxError = context["SyntaxError"] || root["SyntaxError"],
	        TypeError = context["TypeError"] || root["TypeError"],
	        Math = context["Math"] || root["Math"],
	        nativeJSON = context["JSON"] || root["JSON"];

	    // Delegate to the native `stringify` and `parse` implementations.
	    if (typeof nativeJSON == "object" && nativeJSON) {
	      exports.stringify = nativeJSON.stringify;
	      exports.parse = nativeJSON.parse;
	    }

	    // Convenience aliases.
	    var objectProto = Object.prototype,
	        getClass = objectProto.toString,
	        isProperty, forEach, undef;

	    // Test the `Date#getUTC*` methods. Based on work by @Yaffle.
	    var isExtended = new Date(-3509827334573292);
	    try {
	      // The `getUTCFullYear`, `Month`, and `Date` methods return nonsensical
	      // results for certain dates in Opera >= 10.53.
	      isExtended = isExtended.getUTCFullYear() == -109252 && isExtended.getUTCMonth() === 0 && isExtended.getUTCDate() === 1 &&
	        // Safari < 2.0.2 stores the internal millisecond time value correctly,
	        // but clips the values returned by the date methods to the range of
	        // signed 32-bit integers ([-2 ** 31, 2 ** 31 - 1]).
	        isExtended.getUTCHours() == 10 && isExtended.getUTCMinutes() == 37 && isExtended.getUTCSeconds() == 6 && isExtended.getUTCMilliseconds() == 708;
	    } catch (exception) {}

	    // Internal: Determines whether the native `JSON.stringify` and `parse`
	    // implementations are spec-compliant. Based on work by Ken Snyder.
	    function has(name) {
	      if (has[name] !== undef) {
	        // Return cached feature test result.
	        return has[name];
	      }
	      var isSupported;
	      if (name == "bug-string-char-index") {
	        // IE <= 7 doesn't support accessing string characters using square
	        // bracket notation. IE 8 only supports this for primitives.
	        isSupported = "a"[0] != "a";
	      } else if (name == "json") {
	        // Indicates whether both `JSON.stringify` and `JSON.parse` are
	        // supported.
	        isSupported = has("json-stringify") && has("json-parse");
	      } else {
	        var value, serialized = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
	        // Test `JSON.stringify`.
	        if (name == "json-stringify") {
	          var stringify = exports.stringify, stringifySupported = typeof stringify == "function" && isExtended;
	          if (stringifySupported) {
	            // A test function object with a custom `toJSON` method.
	            (value = function () {
	              return 1;
	            }).toJSON = value;
	            try {
	              stringifySupported =
	                // Firefox 3.1b1 and b2 serialize string, number, and boolean
	                // primitives as object literals.
	                stringify(0) === "0" &&
	                // FF 3.1b1, b2, and JSON 2 serialize wrapped primitives as object
	                // literals.
	                stringify(new Number()) === "0" &&
	                stringify(new String()) == '""' &&
	                // FF 3.1b1, 2 throw an error if the value is `null`, `undefined`, or
	                // does not define a canonical JSON representation (this applies to
	                // objects with `toJSON` properties as well, *unless* they are nested
	                // within an object or array).
	                stringify(getClass) === undef &&
	                // IE 8 serializes `undefined` as `"undefined"`. Safari <= 5.1.7 and
	                // FF 3.1b3 pass this test.
	                stringify(undef) === undef &&
	                // Safari <= 5.1.7 and FF 3.1b3 throw `Error`s and `TypeError`s,
	                // respectively, if the value is omitted entirely.
	                stringify() === undef &&
	                // FF 3.1b1, 2 throw an error if the given value is not a number,
	                // string, array, object, Boolean, or `null` literal. This applies to
	                // objects with custom `toJSON` methods as well, unless they are nested
	                // inside object or array literals. YUI 3.0.0b1 ignores custom `toJSON`
	                // methods entirely.
	                stringify(value) === "1" &&
	                stringify([value]) == "[1]" &&
	                // Prototype <= 1.6.1 serializes `[undefined]` as `"[]"` instead of
	                // `"[null]"`.
	                stringify([undef]) == "[null]" &&
	                // YUI 3.0.0b1 fails to serialize `null` literals.
	                stringify(null) == "null" &&
	                // FF 3.1b1, 2 halts serialization if an array contains a function:
	                // `[1, true, getClass, 1]` serializes as "[1,true,],". FF 3.1b3
	                // elides non-JSON values from objects and arrays, unless they
	                // define custom `toJSON` methods.
	                stringify([undef, getClass, null]) == "[null,null,null]" &&
	                // Simple serialization test. FF 3.1b1 uses Unicode escape sequences
	                // where character escape codes are expected (e.g., `\b` => `\u0008`).
	                stringify({ "a": [value, true, false, null, "\x00\b\n\f\r\t"] }) == serialized &&
	                // FF 3.1b1 and b2 ignore the `filter` and `width` arguments.
	                stringify(null, value) === "1" &&
	                stringify([1, 2], null, 1) == "[\n 1,\n 2\n]" &&
	                // JSON 2, Prototype <= 1.7, and older WebKit builds incorrectly
	                // serialize extended years.
	                stringify(new Date(-8.64e15)) == '"-271821-04-20T00:00:00.000Z"' &&
	                // The milliseconds are optional in ES 5, but required in 5.1.
	                stringify(new Date(8.64e15)) == '"+275760-09-13T00:00:00.000Z"' &&
	                // Firefox <= 11.0 incorrectly serializes years prior to 0 as negative
	                // four-digit years instead of six-digit years. Credits: @Yaffle.
	                stringify(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' &&
	                // Safari <= 5.1.5 and Opera >= 10.53 incorrectly serialize millisecond
	                // values less than 1000. Credits: @Yaffle.
	                stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"';
	            } catch (exception) {
	              stringifySupported = false;
	            }
	          }
	          isSupported = stringifySupported;
	        }
	        // Test `JSON.parse`.
	        if (name == "json-parse") {
	          var parse = exports.parse;
	          if (typeof parse == "function") {
	            try {
	              // FF 3.1b1, b2 will throw an exception if a bare literal is provided.
	              // Conforming implementations should also coerce the initial argument to
	              // a string prior to parsing.
	              if (parse("0") === 0 && !parse(false)) {
	                // Simple parsing test.
	                value = parse(serialized);
	                var parseSupported = value["a"].length == 5 && value["a"][0] === 1;
	                if (parseSupported) {
	                  try {
	                    // Safari <= 5.1.2 and FF 3.1b1 allow unescaped tabs in strings.
	                    parseSupported = !parse('"\t"');
	                  } catch (exception) {}
	                  if (parseSupported) {
	                    try {
	                      // FF 4.0 and 4.0.1 allow leading `+` signs and leading
	                      // decimal points. FF 4.0, 4.0.1, and IE 9-10 also allow
	                      // certain octal literals.
	                      parseSupported = parse("01") !== 1;
	                    } catch (exception) {}
	                  }
	                  if (parseSupported) {
	                    try {
	                      // FF 4.0, 4.0.1, and Rhino 1.7R3-R4 allow trailing decimal
	                      // points. These environments, along with FF 3.1b1 and 2,
	                      // also allow trailing commas in JSON objects and arrays.
	                      parseSupported = parse("1.") !== 1;
	                    } catch (exception) {}
	                  }
	                }
	              }
	            } catch (exception) {
	              parseSupported = false;
	            }
	          }
	          isSupported = parseSupported;
	        }
	      }
	      return has[name] = !!isSupported;
	    }

	    if (!has("json")) {
	      // Common `[[Class]]` name aliases.
	      var functionClass = "[object Function]",
	          dateClass = "[object Date]",
	          numberClass = "[object Number]",
	          stringClass = "[object String]",
	          arrayClass = "[object Array]",
	          booleanClass = "[object Boolean]";

	      // Detect incomplete support for accessing string characters by index.
	      var charIndexBuggy = has("bug-string-char-index");

	      // Define additional utility methods if the `Date` methods are buggy.
	      if (!isExtended) {
	        var floor = Math.floor;
	        // A mapping between the months of the year and the number of days between
	        // January 1st and the first of the respective month.
	        var Months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
	        // Internal: Calculates the number of days between the Unix epoch and the
	        // first day of the given month.
	        var getDay = function (year, month) {
	          return Months[month] + 365 * (year - 1970) + floor((year - 1969 + (month = +(month > 1))) / 4) - floor((year - 1901 + month) / 100) + floor((year - 1601 + month) / 400);
	        };
	      }

	      // Internal: Determines if a property is a direct property of the given
	      // object. Delegates to the native `Object#hasOwnProperty` method.
	      if (!(isProperty = objectProto.hasOwnProperty)) {
	        isProperty = function (property) {
	          var members = {}, constructor;
	          if ((members.__proto__ = null, members.__proto__ = {
	            // The *proto* property cannot be set multiple times in recent
	            // versions of Firefox and SeaMonkey.
	            "toString": 1
	          }, members).toString != getClass) {
	            // Safari <= 2.0.3 doesn't implement `Object#hasOwnProperty`, but
	            // supports the mutable *proto* property.
	            isProperty = function (property) {
	              // Capture and break the object's prototype chain (see section 8.6.2
	              // of the ES 5.1 spec). The parenthesized expression prevents an
	              // unsafe transformation by the Closure Compiler.
	              var original = this.__proto__, result = property in (this.__proto__ = null, this);
	              // Restore the original prototype chain.
	              this.__proto__ = original;
	              return result;
	            };
	          } else {
	            // Capture a reference to the top-level `Object` constructor.
	            constructor = members.constructor;
	            // Use the `constructor` property to simulate `Object#hasOwnProperty` in
	            // other environments.
	            isProperty = function (property) {
	              var parent = (this.constructor || constructor).prototype;
	              return property in this && !(property in parent && this[property] === parent[property]);
	            };
	          }
	          members = null;
	          return isProperty.call(this, property);
	        };
	      }

	      // Internal: Normalizes the `for...in` iteration algorithm across
	      // environments. Each enumerated key is yielded to a `callback` function.
	      forEach = function (object, callback) {
	        var size = 0, Properties, members, property;

	        // Tests for bugs in the current environment's `for...in` algorithm. The
	        // `valueOf` property inherits the non-enumerable flag from
	        // `Object.prototype` in older versions of IE, Netscape, and Mozilla.
	        (Properties = function () {
	          this.valueOf = 0;
	        }).prototype.valueOf = 0;

	        // Iterate over a new instance of the `Properties` class.
	        members = new Properties();
	        for (property in members) {
	          // Ignore all properties inherited from `Object.prototype`.
	          if (isProperty.call(members, property)) {
	            size++;
	          }
	        }
	        Properties = members = null;

	        // Normalize the iteration algorithm.
	        if (!size) {
	          // A list of non-enumerable properties inherited from `Object.prototype`.
	          members = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"];
	          // IE <= 8, Mozilla 1.0, and Netscape 6.2 ignore shadowed non-enumerable
	          // properties.
	          forEach = function (object, callback) {
	            var isFunction = getClass.call(object) == functionClass, property, length;
	            var hasProperty = !isFunction && typeof object.constructor != "function" && objectTypes[typeof object.hasOwnProperty] && object.hasOwnProperty || isProperty;
	            for (property in object) {
	              // Gecko <= 1.0 enumerates the `prototype` property of functions under
	              // certain conditions; IE does not.
	              if (!(isFunction && property == "prototype") && hasProperty.call(object, property)) {
	                callback(property);
	              }
	            }
	            // Manually invoke the callback for each non-enumerable property.
	            for (length = members.length; property = members[--length]; hasProperty.call(object, property) && callback(property));
	          };
	        } else if (size == 2) {
	          // Safari <= 2.0.4 enumerates shadowed properties twice.
	          forEach = function (object, callback) {
	            // Create a set of iterated properties.
	            var members = {}, isFunction = getClass.call(object) == functionClass, property;
	            for (property in object) {
	              // Store each property name to prevent double enumeration. The
	              // `prototype` property of functions is not enumerated due to cross-
	              // environment inconsistencies.
	              if (!(isFunction && property == "prototype") && !isProperty.call(members, property) && (members[property] = 1) && isProperty.call(object, property)) {
	                callback(property);
	              }
	            }
	          };
	        } else {
	          // No bugs detected; use the standard `for...in` algorithm.
	          forEach = function (object, callback) {
	            var isFunction = getClass.call(object) == functionClass, property, isConstructor;
	            for (property in object) {
	              if (!(isFunction && property == "prototype") && isProperty.call(object, property) && !(isConstructor = property === "constructor")) {
	                callback(property);
	              }
	            }
	            // Manually invoke the callback for the `constructor` property due to
	            // cross-environment inconsistencies.
	            if (isConstructor || isProperty.call(object, (property = "constructor"))) {
	              callback(property);
	            }
	          };
	        }
	        return forEach(object, callback);
	      };

	      // Public: Serializes a JavaScript `value` as a JSON string. The optional
	      // `filter` argument may specify either a function that alters how object and
	      // array members are serialized, or an array of strings and numbers that
	      // indicates which properties should be serialized. The optional `width`
	      // argument may be either a string or number that specifies the indentation
	      // level of the output.
	      if (!has("json-stringify")) {
	        // Internal: A map of control characters and their escaped equivalents.
	        var Escapes = {
	          92: "\\\\",
	          34: '\\"',
	          8: "\\b",
	          12: "\\f",
	          10: "\\n",
	          13: "\\r",
	          9: "\\t"
	        };

	        // Internal: Converts `value` into a zero-padded string such that its
	        // length is at least equal to `width`. The `width` must be <= 6.
	        var leadingZeroes = "000000";
	        var toPaddedString = function (width, value) {
	          // The `|| 0` expression is necessary to work around a bug in
	          // Opera <= 7.54u2 where `0 == -0`, but `String(-0) !== "0"`.
	          return (leadingZeroes + (value || 0)).slice(-width);
	        };

	        // Internal: Double-quotes a string `value`, replacing all ASCII control
	        // characters (characters with code unit values between 0 and 31) with
	        // their escaped equivalents. This is an implementation of the
	        // `Quote(value)` operation defined in ES 5.1 section 15.12.3.
	        var unicodePrefix = "\\u00";
	        var quote = function (value) {
	          var result = '"', index = 0, length = value.length, useCharIndex = !charIndexBuggy || length > 10;
	          var symbols = useCharIndex && (charIndexBuggy ? value.split("") : value);
	          for (; index < length; index++) {
	            var charCode = value.charCodeAt(index);
	            // If the character is a control character, append its Unicode or
	            // shorthand escape sequence; otherwise, append the character as-is.
	            switch (charCode) {
	              case 8: case 9: case 10: case 12: case 13: case 34: case 92:
	                result += Escapes[charCode];
	                break;
	              default:
	                if (charCode < 32) {
	                  result += unicodePrefix + toPaddedString(2, charCode.toString(16));
	                  break;
	                }
	                result += useCharIndex ? symbols[index] : value.charAt(index);
	            }
	          }
	          return result + '"';
	        };

	        // Internal: Recursively serializes an object. Implements the
	        // `Str(key, holder)`, `JO(value)`, and `JA(value)` operations.
	        var serialize = function (property, object, callback, properties, whitespace, indentation, stack) {
	          var value, className, year, month, date, time, hours, minutes, seconds, milliseconds, results, element, index, length, prefix, result;
	          try {
	            // Necessary for host object support.
	            value = object[property];
	          } catch (exception) {}
	          if (typeof value == "object" && value) {
	            className = getClass.call(value);
	            if (className == dateClass && !isProperty.call(value, "toJSON")) {
	              if (value > -1 / 0 && value < 1 / 0) {
	                // Dates are serialized according to the `Date#toJSON` method
	                // specified in ES 5.1 section 15.9.5.44. See section 15.9.1.15
	                // for the ISO 8601 date time string format.
	                if (getDay) {
	                  // Manually compute the year, month, date, hours, minutes,
	                  // seconds, and milliseconds if the `getUTC*` methods are
	                  // buggy. Adapted from @Yaffle's `date-shim` project.
	                  date = floor(value / 864e5);
	                  for (year = floor(date / 365.2425) + 1970 - 1; getDay(year + 1, 0) <= date; year++);
	                  for (month = floor((date - getDay(year, 0)) / 30.42); getDay(year, month + 1) <= date; month++);
	                  date = 1 + date - getDay(year, month);
	                  // The `time` value specifies the time within the day (see ES
	                  // 5.1 section 15.9.1.2). The formula `(A % B + B) % B` is used
	                  // to compute `A modulo B`, as the `%` operator does not
	                  // correspond to the `modulo` operation for negative numbers.
	                  time = (value % 864e5 + 864e5) % 864e5;
	                  // The hours, minutes, seconds, and milliseconds are obtained by
	                  // decomposing the time within the day. See section 15.9.1.10.
	                  hours = floor(time / 36e5) % 24;
	                  minutes = floor(time / 6e4) % 60;
	                  seconds = floor(time / 1e3) % 60;
	                  milliseconds = time % 1e3;
	                } else {
	                  year = value.getUTCFullYear();
	                  month = value.getUTCMonth();
	                  date = value.getUTCDate();
	                  hours = value.getUTCHours();
	                  minutes = value.getUTCMinutes();
	                  seconds = value.getUTCSeconds();
	                  milliseconds = value.getUTCMilliseconds();
	                }
	                // Serialize extended years correctly.
	                value = (year <= 0 || year >= 1e4 ? (year < 0 ? "-" : "+") + toPaddedString(6, year < 0 ? -year : year) : toPaddedString(4, year)) +
	                  "-" + toPaddedString(2, month + 1) + "-" + toPaddedString(2, date) +
	                  // Months, dates, hours, minutes, and seconds should have two
	                  // digits; milliseconds should have three.
	                  "T" + toPaddedString(2, hours) + ":" + toPaddedString(2, minutes) + ":" + toPaddedString(2, seconds) +
	                  // Milliseconds are optional in ES 5.0, but required in 5.1.
	                  "." + toPaddedString(3, milliseconds) + "Z";
	              } else {
	                value = null;
	              }
	            } else if (typeof value.toJSON == "function" && ((className != numberClass && className != stringClass && className != arrayClass) || isProperty.call(value, "toJSON"))) {
	              // Prototype <= 1.6.1 adds non-standard `toJSON` methods to the
	              // `Number`, `String`, `Date`, and `Array` prototypes. JSON 3
	              // ignores all `toJSON` methods on these objects unless they are
	              // defined directly on an instance.
	              value = value.toJSON(property);
	            }
	          }
	          if (callback) {
	            // If a replacement function was provided, call it to obtain the value
	            // for serialization.
	            value = callback.call(object, property, value);
	          }
	          if (value === null) {
	            return "null";
	          }
	          className = getClass.call(value);
	          if (className == booleanClass) {
	            // Booleans are represented literally.
	            return "" + value;
	          } else if (className == numberClass) {
	            // JSON numbers must be finite. `Infinity` and `NaN` are serialized as
	            // `"null"`.
	            return value > -1 / 0 && value < 1 / 0 ? "" + value : "null";
	          } else if (className == stringClass) {
	            // Strings are double-quoted and escaped.
	            return quote("" + value);
	          }
	          // Recursively serialize objects and arrays.
	          if (typeof value == "object") {
	            // Check for cyclic structures. This is a linear search; performance
	            // is inversely proportional to the number of unique nested objects.
	            for (length = stack.length; length--;) {
	              if (stack[length] === value) {
	                // Cyclic structures cannot be serialized by `JSON.stringify`.
	                throw TypeError();
	              }
	            }
	            // Add the object to the stack of traversed objects.
	            stack.push(value);
	            results = [];
	            // Save the current indentation level and indent one additional level.
	            prefix = indentation;
	            indentation += whitespace;
	            if (className == arrayClass) {
	              // Recursively serialize array elements.
	              for (index = 0, length = value.length; index < length; index++) {
	                element = serialize(index, value, callback, properties, whitespace, indentation, stack);
	                results.push(element === undef ? "null" : element);
	              }
	              result = results.length ? (whitespace ? "[\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "]" : ("[" + results.join(",") + "]")) : "[]";
	            } else {
	              // Recursively serialize object members. Members are selected from
	              // either a user-specified list of property names, or the object
	              // itself.
	              forEach(properties || value, function (property) {
	                var element = serialize(property, value, callback, properties, whitespace, indentation, stack);
	                if (element !== undef) {
	                  // According to ES 5.1 section 15.12.3: "If `gap` {whitespace}
	                  // is not the empty string, let `member` {quote(property) + ":"}
	                  // be the concatenation of `member` and the `space` character."
	                  // The "`space` character" refers to the literal space
	                  // character, not the `space` {width} argument provided to
	                  // `JSON.stringify`.
	                  results.push(quote(property) + ":" + (whitespace ? " " : "") + element);
	                }
	              });
	              result = results.length ? (whitespace ? "{\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "}" : ("{" + results.join(",") + "}")) : "{}";
	            }
	            // Remove the object from the traversed object stack.
	            stack.pop();
	            return result;
	          }
	        };

	        // Public: `JSON.stringify`. See ES 5.1 section 15.12.3.
	        exports.stringify = function (source, filter, width) {
	          var whitespace, callback, properties, className;
	          if (objectTypes[typeof filter] && filter) {
	            if ((className = getClass.call(filter)) == functionClass) {
	              callback = filter;
	            } else if (className == arrayClass) {
	              // Convert the property names array into a makeshift set.
	              properties = {};
	              for (var index = 0, length = filter.length, value; index < length; value = filter[index++], ((className = getClass.call(value)), className == stringClass || className == numberClass) && (properties[value] = 1));
	            }
	          }
	          if (width) {
	            if ((className = getClass.call(width)) == numberClass) {
	              // Convert the `width` to an integer and create a string containing
	              // `width` number of space characters.
	              if ((width -= width % 1) > 0) {
	                for (whitespace = "", width > 10 && (width = 10); whitespace.length < width; whitespace += " ");
	              }
	            } else if (className == stringClass) {
	              whitespace = width.length <= 10 ? width : width.slice(0, 10);
	            }
	          }
	          // Opera <= 7.54u2 discards the values associated with empty string keys
	          // (`""`) only if they are used directly within an object member list
	          // (e.g., `!("" in { "": 1})`).
	          return serialize("", (value = {}, value[""] = source, value), callback, properties, whitespace, "", []);
	        };
	      }

	      // Public: Parses a JSON source string.
	      if (!has("json-parse")) {
	        var fromCharCode = String.fromCharCode;

	        // Internal: A map of escaped control characters and their unescaped
	        // equivalents.
	        var Unescapes = {
	          92: "\\",
	          34: '"',
	          47: "/",
	          98: "\b",
	          116: "\t",
	          110: "\n",
	          102: "\f",
	          114: "\r"
	        };

	        // Internal: Stores the parser state.
	        var Index, Source;

	        // Internal: Resets the parser state and throws a `SyntaxError`.
	        var abort = function () {
	          Index = Source = null;
	          throw SyntaxError();
	        };

	        // Internal: Returns the next token, or `"$"` if the parser has reached
	        // the end of the source string. A token may be a string, number, `null`
	        // literal, or Boolean literal.
	        var lex = function () {
	          var source = Source, length = source.length, value, begin, position, isSigned, charCode;
	          while (Index < length) {
	            charCode = source.charCodeAt(Index);
	            switch (charCode) {
	              case 9: case 10: case 13: case 32:
	                // Skip whitespace tokens, including tabs, carriage returns, line
	                // feeds, and space characters.
	                Index++;
	                break;
	              case 123: case 125: case 91: case 93: case 58: case 44:
	                // Parse a punctuator token (`{`, `}`, `[`, `]`, `:`, or `,`) at
	                // the current position.
	                value = charIndexBuggy ? source.charAt(Index) : source[Index];
	                Index++;
	                return value;
	              case 34:
	                // `"` delimits a JSON string; advance to the next character and
	                // begin parsing the string. String tokens are prefixed with the
	                // sentinel `@` character to distinguish them from punctuators and
	                // end-of-string tokens.
	                for (value = "@", Index++; Index < length;) {
	                  charCode = source.charCodeAt(Index);
	                  if (charCode < 32) {
	                    // Unescaped ASCII control characters (those with a code unit
	                    // less than the space character) are not permitted.
	                    abort();
	                  } else if (charCode == 92) {
	                    // A reverse solidus (`\`) marks the beginning of an escaped
	                    // control character (including `"`, `\`, and `/`) or Unicode
	                    // escape sequence.
	                    charCode = source.charCodeAt(++Index);
	                    switch (charCode) {
	                      case 92: case 34: case 47: case 98: case 116: case 110: case 102: case 114:
	                        // Revive escaped control characters.
	                        value += Unescapes[charCode];
	                        Index++;
	                        break;
	                      case 117:
	                        // `\u` marks the beginning of a Unicode escape sequence.
	                        // Advance to the first character and validate the
	                        // four-digit code point.
	                        begin = ++Index;
	                        for (position = Index + 4; Index < position; Index++) {
	                          charCode = source.charCodeAt(Index);
	                          // A valid sequence comprises four hexdigits (case-
	                          // insensitive) that form a single hexadecimal value.
	                          if (!(charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70)) {
	                            // Invalid Unicode escape sequence.
	                            abort();
	                          }
	                        }
	                        // Revive the escaped character.
	                        value += fromCharCode("0x" + source.slice(begin, Index));
	                        break;
	                      default:
	                        // Invalid escape sequence.
	                        abort();
	                    }
	                  } else {
	                    if (charCode == 34) {
	                      // An unescaped double-quote character marks the end of the
	                      // string.
	                      break;
	                    }
	                    charCode = source.charCodeAt(Index);
	                    begin = Index;
	                    // Optimize for the common case where a string is valid.
	                    while (charCode >= 32 && charCode != 92 && charCode != 34) {
	                      charCode = source.charCodeAt(++Index);
	                    }
	                    // Append the string as-is.
	                    value += source.slice(begin, Index);
	                  }
	                }
	                if (source.charCodeAt(Index) == 34) {
	                  // Advance to the next character and return the revived string.
	                  Index++;
	                  return value;
	                }
	                // Unterminated string.
	                abort();
	              default:
	                // Parse numbers and literals.
	                begin = Index;
	                // Advance past the negative sign, if one is specified.
	                if (charCode == 45) {
	                  isSigned = true;
	                  charCode = source.charCodeAt(++Index);
	                }
	                // Parse an integer or floating-point value.
	                if (charCode >= 48 && charCode <= 57) {
	                  // Leading zeroes are interpreted as octal literals.
	                  if (charCode == 48 && ((charCode = source.charCodeAt(Index + 1)), charCode >= 48 && charCode <= 57)) {
	                    // Illegal octal literal.
	                    abort();
	                  }
	                  isSigned = false;
	                  // Parse the integer component.
	                  for (; Index < length && ((charCode = source.charCodeAt(Index)), charCode >= 48 && charCode <= 57); Index++);
	                  // Floats cannot contain a leading decimal point; however, this
	                  // case is already accounted for by the parser.
	                  if (source.charCodeAt(Index) == 46) {
	                    position = ++Index;
	                    // Parse the decimal component.
	                    for (; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
	                    if (position == Index) {
	                      // Illegal trailing decimal.
	                      abort();
	                    }
	                    Index = position;
	                  }
	                  // Parse exponents. The `e` denoting the exponent is
	                  // case-insensitive.
	                  charCode = source.charCodeAt(Index);
	                  if (charCode == 101 || charCode == 69) {
	                    charCode = source.charCodeAt(++Index);
	                    // Skip past the sign following the exponent, if one is
	                    // specified.
	                    if (charCode == 43 || charCode == 45) {
	                      Index++;
	                    }
	                    // Parse the exponential component.
	                    for (position = Index; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
	                    if (position == Index) {
	                      // Illegal empty exponent.
	                      abort();
	                    }
	                    Index = position;
	                  }
	                  // Coerce the parsed value to a JavaScript number.
	                  return +source.slice(begin, Index);
	                }
	                // A negative sign may only precede numbers.
	                if (isSigned) {
	                  abort();
	                }
	                // `true`, `false`, and `null` literals.
	                if (source.slice(Index, Index + 4) == "true") {
	                  Index += 4;
	                  return true;
	                } else if (source.slice(Index, Index + 5) == "false") {
	                  Index += 5;
	                  return false;
	                } else if (source.slice(Index, Index + 4) == "null") {
	                  Index += 4;
	                  return null;
	                }
	                // Unrecognized token.
	                abort();
	            }
	          }
	          // Return the sentinel `$` character if the parser has reached the end
	          // of the source string.
	          return "$";
	        };

	        // Internal: Parses a JSON `value` token.
	        var get = function (value) {
	          var results, hasMembers;
	          if (value == "$") {
	            // Unexpected end of input.
	            abort();
	          }
	          if (typeof value == "string") {
	            if ((charIndexBuggy ? value.charAt(0) : value[0]) == "@") {
	              // Remove the sentinel `@` character.
	              return value.slice(1);
	            }
	            // Parse object and array literals.
	            if (value == "[") {
	              // Parses a JSON array, returning a new JavaScript array.
	              results = [];
	              for (;; hasMembers || (hasMembers = true)) {
	                value = lex();
	                // A closing square bracket marks the end of the array literal.
	                if (value == "]") {
	                  break;
	                }
	                // If the array literal contains elements, the current token
	                // should be a comma separating the previous element from the
	                // next.
	                if (hasMembers) {
	                  if (value == ",") {
	                    value = lex();
	                    if (value == "]") {
	                      // Unexpected trailing `,` in array literal.
	                      abort();
	                    }
	                  } else {
	                    // A `,` must separate each array element.
	                    abort();
	                  }
	                }
	                // Elisions and leading commas are not permitted.
	                if (value == ",") {
	                  abort();
	                }
	                results.push(get(value));
	              }
	              return results;
	            } else if (value == "{") {
	              // Parses a JSON object, returning a new JavaScript object.
	              results = {};
	              for (;; hasMembers || (hasMembers = true)) {
	                value = lex();
	                // A closing curly brace marks the end of the object literal.
	                if (value == "}") {
	                  break;
	                }
	                // If the object literal contains members, the current token
	                // should be a comma separator.
	                if (hasMembers) {
	                  if (value == ",") {
	                    value = lex();
	                    if (value == "}") {
	                      // Unexpected trailing `,` in object literal.
	                      abort();
	                    }
	                  } else {
	                    // A `,` must separate each object member.
	                    abort();
	                  }
	                }
	                // Leading commas are not permitted, object property names must be
	                // double-quoted strings, and a `:` must separate each property
	                // name and value.
	                if (value == "," || typeof value != "string" || (charIndexBuggy ? value.charAt(0) : value[0]) != "@" || lex() != ":") {
	                  abort();
	                }
	                results[value.slice(1)] = get(lex());
	              }
	              return results;
	            }
	            // Unexpected token encountered.
	            abort();
	          }
	          return value;
	        };

	        // Internal: Updates a traversed object member.
	        var update = function (source, property, callback) {
	          var element = walk(source, property, callback);
	          if (element === undef) {
	            delete source[property];
	          } else {
	            source[property] = element;
	          }
	        };

	        // Internal: Recursively traverses a parsed JSON object, invoking the
	        // `callback` function for each value. This is an implementation of the
	        // `Walk(holder, name)` operation defined in ES 5.1 section 15.12.2.
	        var walk = function (source, property, callback) {
	          var value = source[property], length;
	          if (typeof value == "object" && value) {
	            // `forEach` can't be used to traverse an array in Opera <= 8.54
	            // because its `Object#hasOwnProperty` implementation returns `false`
	            // for array indices (e.g., `![1, 2, 3].hasOwnProperty("0")`).
	            if (getClass.call(value) == arrayClass) {
	              for (length = value.length; length--;) {
	                update(value, length, callback);
	              }
	            } else {
	              forEach(value, function (property) {
	                update(value, property, callback);
	              });
	            }
	          }
	          return callback.call(source, property, value);
	        };

	        // Public: `JSON.parse`. See ES 5.1 section 15.12.2.
	        exports.parse = function (source, callback) {
	          var result, value;
	          Index = 0;
	          Source = "" + source;
	          result = get(lex());
	          // If a JSON string contains multiple tokens, it is invalid.
	          if (lex() != "$") {
	            abort();
	          }
	          // Reset the parser state.
	          Index = Source = null;
	          return callback && getClass.call(callback) == functionClass ? walk((value = {}, value[""] = result, value), "", callback) : result;
	        };
	      }
	    }

	    exports["runInContext"] = runInContext;
	    return exports;
	  }

	  if (freeExports && !isLoader) {
	    // Export for CommonJS environments.
	    runInContext(root, freeExports);
	  } else {
	    // Export for web browsers and JavaScript engines.
	    var nativeJSON = root.JSON,
	        previousJSON = root["JSON3"],
	        isRestored = false;

	    var JSON3 = runInContext(root, (root["JSON3"] = {
	      // Public: Restores the original value of the global `JSON` object and
	      // returns a reference to the `JSON3` object.
	      "noConflict": function () {
	        if (!isRestored) {
	          isRestored = true;
	          root.JSON = nativeJSON;
	          root["JSON3"] = previousJSON;
	          nativeJSON = previousJSON = null;
	        }
	        return JSON3;
	      }
	    }));

	    root.JSON = {
	      "parse": JSON3.parse,
	      "stringify": JSON3.stringify
	    };
	  }

	  // Export for asynchronous module loaders.
	  if (isLoader) {
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	      return JSON3;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	}).call(this);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)(module), (function() { return this; }())))

/***/ }),
/* 48 */
/***/ (function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;

	/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ }),
/* 49 */
/***/ (function(module, exports) {

	module.exports = '1.3.0';


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, global) {'use strict';

	var eventUtils = __webpack_require__(16)
	  , JSON3 = __webpack_require__(47)
	  , browser = __webpack_require__(39)
	  ;

	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(23)('sockjs-client:utils:iframe');
	}

	module.exports = {
	  WPrefix: '_jp'
	, currentWindowId: null

	, polluteGlobalNamespace: function() {
	    if (!(module.exports.WPrefix in global)) {
	      global[module.exports.WPrefix] = {};
	    }
	  }

	, postMessage: function(type, data) {
	    if (global.parent !== global) {
	      global.parent.postMessage(JSON3.stringify({
	        windowId: module.exports.currentWindowId
	      , type: type
	      , data: data || ''
	      }), '*');
	    } else {
	      debug('Cannot postMessage, no parent window.', type, data);
	    }
	  }

	, createIframe: function(iframeUrl, errorCallback) {
	    var iframe = global.document.createElement('iframe');
	    var tref, unloadRef;
	    var unattach = function() {
	      debug('unattach');
	      clearTimeout(tref);
	      // Explorer had problems with that.
	      try {
	        iframe.onload = null;
	      } catch (x) {
	        // intentionally empty
	      }
	      iframe.onerror = null;
	    };
	    var cleanup = function() {
	      debug('cleanup');
	      if (iframe) {
	        unattach();
	        // This timeout makes chrome fire onbeforeunload event
	        // within iframe. Without the timeout it goes straight to
	        // onunload.
	        setTimeout(function() {
	          if (iframe) {
	            iframe.parentNode.removeChild(iframe);
	          }
	          iframe = null;
	        }, 0);
	        eventUtils.unloadDel(unloadRef);
	      }
	    };
	    var onerror = function(err) {
	      debug('onerror', err);
	      if (iframe) {
	        cleanup();
	        errorCallback(err);
	      }
	    };
	    var post = function(msg, origin) {
	      debug('post', msg, origin);
	      setTimeout(function() {
	        try {
	          // When the iframe is not loaded, IE raises an exception
	          // on 'contentWindow'.
	          if (iframe && iframe.contentWindow) {
	            iframe.contentWindow.postMessage(msg, origin);
	          }
	        } catch (x) {
	          // intentionally empty
	        }
	      }, 0);
	    };

	    iframe.src = iframeUrl;
	    iframe.style.display = 'none';
	    iframe.style.position = 'absolute';
	    iframe.onerror = function() {
	      onerror('onerror');
	    };
	    iframe.onload = function() {
	      debug('onload');
	      // `onload` is triggered before scripts on the iframe are
	      // executed. Give it few seconds to actually load stuff.
	      clearTimeout(tref);
	      tref = setTimeout(function() {
	        onerror('onload timeout');
	      }, 2000);
	    };
	    global.document.body.appendChild(iframe);
	    tref = setTimeout(function() {
	      onerror('timeout');
	    }, 15000);
	    unloadRef = eventUtils.unloadAdd(cleanup);
	    return {
	      post: post
	    , cleanup: cleanup
	    , loaded: unattach
	    };
	  }

	/* eslint no-undef: "off", new-cap: "off" */
	, createHtmlfile: function(iframeUrl, errorCallback) {
	    var axo = ['Active'].concat('Object').join('X');
	    var doc = new global[axo]('htmlfile');
	    var tref, unloadRef;
	    var iframe;
	    var unattach = function() {
	      clearTimeout(tref);
	      iframe.onerror = null;
	    };
	    var cleanup = function() {
	      if (doc) {
	        unattach();
	        eventUtils.unloadDel(unloadRef);
	        iframe.parentNode.removeChild(iframe);
	        iframe = doc = null;
	        CollectGarbage();
	      }
	    };
	    var onerror = function(r) {
	      debug('onerror', r);
	      if (doc) {
	        cleanup();
	        errorCallback(r);
	      }
	    };
	    var post = function(msg, origin) {
	      try {
	        // When the iframe is not loaded, IE raises an exception
	        // on 'contentWindow'.
	        setTimeout(function() {
	          if (iframe && iframe.contentWindow) {
	              iframe.contentWindow.postMessage(msg, origin);
	          }
	        }, 0);
	      } catch (x) {
	        // intentionally empty
	      }
	    };

	    doc.open();
	    doc.write('<html><s' + 'cript>' +
	              'document.domain="' + global.document.domain + '";' +
	              '</s' + 'cript></html>');
	    doc.close();
	    doc.parentWindow[module.exports.WPrefix] = global[module.exports.WPrefix];
	    var c = doc.createElement('div');
	    doc.body.appendChild(c);
	    iframe = doc.createElement('iframe');
	    c.appendChild(iframe);
	    iframe.src = iframeUrl;
	    iframe.onerror = function() {
	      onerror('onerror');
	    };
	    tref = setTimeout(function() {
	      onerror('timeout');
	    }, 15000);
	    unloadRef = eventUtils.unloadAdd(cleanup);
	    return {
	      post: post
	    , cleanup: cleanup
	    , loaded: unattach
	    };
	  }
	};

	module.exports.iframeEnabled = false;
	if (global.document) {
	  // postMessage misbehaves in konqueror 4.6.5 - the messages are delivered with
	  // huge delay, or not at all.
	  module.exports.iframeEnabled = (typeof global.postMessage === 'function' ||
	    typeof global.postMessage === 'object') && (!browser.isKonqueror());
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15), (function() { return this; }())))

/***/ }),
/* 51 */
/***/ (function(module, exports) {

	'use strict';

	module.exports = {
	  isObject: function(obj) {
	    var type = typeof obj;
	    return type === 'function' || type === 'object' && !!obj;
	  }

	, extend: function(obj) {
	    if (!this.isObject(obj)) {
	      return obj;
	    }
	    var source, prop;
	    for (var i = 1, length = arguments.length; i < length; i++) {
	      source = arguments[i];
	      for (prop in source) {
	        if (Object.prototype.hasOwnProperty.call(source, prop)) {
	          obj[prop] = source[prop];
	        }
	      }
	    }
	    return obj;
	  }
	};


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var inherits = __webpack_require__(26)
	  , HtmlfileReceiver = __webpack_require__(53)
	  , XHRLocalObject = __webpack_require__(38)
	  , AjaxBasedTransport = __webpack_require__(31)
	  ;

	function HtmlFileTransport(transUrl) {
	  if (!HtmlfileReceiver.enabled) {
	    throw new Error('Transport created when disabled');
	  }
	  AjaxBasedTransport.call(this, transUrl, '/htmlfile', HtmlfileReceiver, XHRLocalObject);
	}

	inherits(HtmlFileTransport, AjaxBasedTransport);

	HtmlFileTransport.enabled = function(info) {
	  return HtmlfileReceiver.enabled && info.sameOrigin;
	};

	HtmlFileTransport.transportName = 'htmlfile';
	HtmlFileTransport.roundTrips = 2;

	module.exports = HtmlFileTransport;


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, global) {'use strict';

	var inherits = __webpack_require__(26)
	  , iframeUtils = __webpack_require__(50)
	  , urlUtils = __webpack_require__(19)
	  , EventEmitter = __webpack_require__(27).EventEmitter
	  , random = __webpack_require__(17)
	  ;

	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(23)('sockjs-client:receiver:htmlfile');
	}

	function HtmlfileReceiver(url) {
	  debug(url);
	  EventEmitter.call(this);
	  var self = this;
	  iframeUtils.polluteGlobalNamespace();

	  this.id = 'a' + random.string(6);
	  url = urlUtils.addQuery(url, 'c=' + decodeURIComponent(iframeUtils.WPrefix + '.' + this.id));

	  debug('using htmlfile', HtmlfileReceiver.htmlfileEnabled);
	  var constructFunc = HtmlfileReceiver.htmlfileEnabled ?
	      iframeUtils.createHtmlfile : iframeUtils.createIframe;

	  global[iframeUtils.WPrefix][this.id] = {
	    start: function() {
	      debug('start');
	      self.iframeObj.loaded();
	    }
	  , message: function(data) {
	      debug('message', data);
	      self.emit('message', data);
	    }
	  , stop: function() {
	      debug('stop');
	      self._cleanup();
	      self._close('network');
	    }
	  };
	  this.iframeObj = constructFunc(url, function() {
	    debug('callback');
	    self._cleanup();
	    self._close('permanent');
	  });
	}

	inherits(HtmlfileReceiver, EventEmitter);

	HtmlfileReceiver.prototype.abort = function() {
	  debug('abort');
	  this._cleanup();
	  this._close('user');
	};

	HtmlfileReceiver.prototype._cleanup = function() {
	  debug('_cleanup');
	  if (this.iframeObj) {
	    this.iframeObj.cleanup();
	    this.iframeObj = null;
	  }
	  delete global[iframeUtils.WPrefix][this.id];
	};

	HtmlfileReceiver.prototype._close = function(reason) {
	  debug('_close', reason);
	  this.emit('close', null, reason);
	  this.removeAllListeners();
	};

	HtmlfileReceiver.htmlfileEnabled = false;

	// obfuscate to avoid firewalls
	var axo = ['Active'].concat('Object').join('X');
	if (axo in global) {
	  try {
	    HtmlfileReceiver.htmlfileEnabled = !!new global[axo]('htmlfile');
	  } catch (x) {
	    // intentionally empty
	  }
	}

	HtmlfileReceiver.enabled = HtmlfileReceiver.htmlfileEnabled || iframeUtils.iframeEnabled;

	module.exports = HtmlfileReceiver;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15), (function() { return this; }())))

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var inherits = __webpack_require__(26)
	  , AjaxBasedTransport = __webpack_require__(31)
	  , XhrReceiver = __webpack_require__(35)
	  , XHRCorsObject = __webpack_require__(36)
	  , XHRLocalObject = __webpack_require__(38)
	  ;

	function XhrPollingTransport(transUrl) {
	  if (!XHRLocalObject.enabled && !XHRCorsObject.enabled) {
	    throw new Error('Transport created when disabled');
	  }
	  AjaxBasedTransport.call(this, transUrl, '/xhr', XhrReceiver, XHRCorsObject);
	}

	inherits(XhrPollingTransport, AjaxBasedTransport);

	XhrPollingTransport.enabled = function(info) {
	  if (info.nullOrigin) {
	    return false;
	  }

	  if (XHRLocalObject.enabled && info.sameOrigin) {
	    return true;
	  }
	  return XHRCorsObject.enabled;
	};

	XhrPollingTransport.transportName = 'xhr-polling';
	XhrPollingTransport.roundTrips = 2; // preflight, ajax

	module.exports = XhrPollingTransport;


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var inherits = __webpack_require__(26)
	  , AjaxBasedTransport = __webpack_require__(31)
	  , XdrStreamingTransport = __webpack_require__(40)
	  , XhrReceiver = __webpack_require__(35)
	  , XDRObject = __webpack_require__(41)
	  ;

	function XdrPollingTransport(transUrl) {
	  if (!XDRObject.enabled) {
	    throw new Error('Transport created when disabled');
	  }
	  AjaxBasedTransport.call(this, transUrl, '/xhr', XhrReceiver, XDRObject);
	}

	inherits(XdrPollingTransport, AjaxBasedTransport);

	XdrPollingTransport.enabled = XdrStreamingTransport.enabled;
	XdrPollingTransport.transportName = 'xdr-polling';
	XdrPollingTransport.roundTrips = 2; // preflight, ajax

	module.exports = XdrPollingTransport;


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	// The simplest and most robust transport, using the well-know cross
	// domain hack - JSONP. This transport is quite inefficient - one
	// message could use up to one http request. But at least it works almost
	// everywhere.
	// Known limitations:
	//   o you will get a spinning cursor
	//   o for Konqueror a dumb timer is needed to detect errors

	var inherits = __webpack_require__(26)
	  , SenderReceiver = __webpack_require__(32)
	  , JsonpReceiver = __webpack_require__(57)
	  , jsonpSender = __webpack_require__(58)
	  ;

	function JsonPTransport(transUrl) {
	  if (!JsonPTransport.enabled()) {
	    throw new Error('Transport created when disabled');
	  }
	  SenderReceiver.call(this, transUrl, '/jsonp', jsonpSender, JsonpReceiver);
	}

	inherits(JsonPTransport, SenderReceiver);

	JsonPTransport.enabled = function() {
	  return !!global.document;
	};

	JsonPTransport.transportName = 'jsonp-polling';
	JsonPTransport.roundTrips = 1;
	JsonPTransport.needBody = true;

	module.exports = JsonPTransport;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, global) {'use strict';

	var utils = __webpack_require__(50)
	  , random = __webpack_require__(17)
	  , browser = __webpack_require__(39)
	  , urlUtils = __webpack_require__(19)
	  , inherits = __webpack_require__(26)
	  , EventEmitter = __webpack_require__(27).EventEmitter
	  ;

	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(23)('sockjs-client:receiver:jsonp');
	}

	function JsonpReceiver(url) {
	  debug(url);
	  var self = this;
	  EventEmitter.call(this);

	  utils.polluteGlobalNamespace();

	  this.id = 'a' + random.string(6);
	  var urlWithId = urlUtils.addQuery(url, 'c=' + encodeURIComponent(utils.WPrefix + '.' + this.id));

	  global[utils.WPrefix][this.id] = this._callback.bind(this);
	  this._createScript(urlWithId);

	  // Fallback mostly for Konqueror - stupid timer, 35 seconds shall be plenty.
	  this.timeoutId = setTimeout(function() {
	    debug('timeout');
	    self._abort(new Error('JSONP script loaded abnormally (timeout)'));
	  }, JsonpReceiver.timeout);
	}

	inherits(JsonpReceiver, EventEmitter);

	JsonpReceiver.prototype.abort = function() {
	  debug('abort');
	  if (global[utils.WPrefix][this.id]) {
	    var err = new Error('JSONP user aborted read');
	    err.code = 1000;
	    this._abort(err);
	  }
	};

	JsonpReceiver.timeout = 35000;
	JsonpReceiver.scriptErrorTimeout = 1000;

	JsonpReceiver.prototype._callback = function(data) {
	  debug('_callback', data);
	  this._cleanup();

	  if (this.aborting) {
	    return;
	  }

	  if (data) {
	    debug('message', data);
	    this.emit('message', data);
	  }
	  this.emit('close', null, 'network');
	  this.removeAllListeners();
	};

	JsonpReceiver.prototype._abort = function(err) {
	  debug('_abort', err);
	  this._cleanup();
	  this.aborting = true;
	  this.emit('close', err.code, err.message);
	  this.removeAllListeners();
	};

	JsonpReceiver.prototype._cleanup = function() {
	  debug('_cleanup');
	  clearTimeout(this.timeoutId);
	  if (this.script2) {
	    this.script2.parentNode.removeChild(this.script2);
	    this.script2 = null;
	  }
	  if (this.script) {
	    var script = this.script;
	    // Unfortunately, you can't really abort script loading of
	    // the script.
	    script.parentNode.removeChild(script);
	    script.onreadystatechange = script.onerror =
	        script.onload = script.onclick = null;
	    this.script = null;
	  }
	  delete global[utils.WPrefix][this.id];
	};

	JsonpReceiver.prototype._scriptError = function() {
	  debug('_scriptError');
	  var self = this;
	  if (this.errorTimer) {
	    return;
	  }

	  this.errorTimer = setTimeout(function() {
	    if (!self.loadedOkay) {
	      self._abort(new Error('JSONP script loaded abnormally (onerror)'));
	    }
	  }, JsonpReceiver.scriptErrorTimeout);
	};

	JsonpReceiver.prototype._createScript = function(url) {
	  debug('_createScript', url);
	  var self = this;
	  var script = this.script = global.document.createElement('script');
	  var script2;  // Opera synchronous load trick.

	  script.id = 'a' + random.string(8);
	  script.src = url;
	  script.type = 'text/javascript';
	  script.charset = 'UTF-8';
	  script.onerror = this._scriptError.bind(this);
	  script.onload = function() {
	    debug('onload');
	    self._abort(new Error('JSONP script loaded abnormally (onload)'));
	  };

	  // IE9 fires 'error' event after onreadystatechange or before, in random order.
	  // Use loadedOkay to determine if actually errored
	  script.onreadystatechange = function() {
	    debug('onreadystatechange', script.readyState);
	    if (/loaded|closed/.test(script.readyState)) {
	      if (script && script.htmlFor && script.onclick) {
	        self.loadedOkay = true;
	        try {
	          // In IE, actually execute the script.
	          script.onclick();
	        } catch (x) {
	          // intentionally empty
	        }
	      }
	      if (script) {
	        self._abort(new Error('JSONP script loaded abnormally (onreadystatechange)'));
	      }
	    }
	  };
	  // IE: event/htmlFor/onclick trick.
	  // One can't rely on proper order for onreadystatechange. In order to
	  // make sure, set a 'htmlFor' and 'event' properties, so that
	  // script code will be installed as 'onclick' handler for the
	  // script object. Later, onreadystatechange, manually execute this
	  // code. FF and Chrome doesn't work with 'event' and 'htmlFor'
	  // set. For reference see:
	  //   http://jaubourg.net/2010/07/loading-script-as-onclick-handler-of.html
	  // Also, read on that about script ordering:
	  //   http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
	  if (typeof script.async === 'undefined' && global.document.attachEvent) {
	    // According to mozilla docs, in recent browsers script.async defaults
	    // to 'true', so we may use it to detect a good browser:
	    // https://developer.mozilla.org/en/HTML/Element/script
	    if (!browser.isOpera()) {
	      // Naively assume we're in IE
	      try {
	        script.htmlFor = script.id;
	        script.event = 'onclick';
	      } catch (x) {
	        // intentionally empty
	      }
	      script.async = true;
	    } else {
	      // Opera, second sync script hack
	      script2 = this.script2 = global.document.createElement('script');
	      script2.text = "try{var a = document.getElementById('" + script.id + "'); if(a)a.onerror();}catch(x){};";
	      script.async = script2.async = false;
	    }
	  }
	  if (typeof script.async !== 'undefined') {
	    script.async = true;
	  }

	  var head = global.document.getElementsByTagName('head')[0];
	  head.insertBefore(script, head.firstChild);
	  if (script2) {
	    head.insertBefore(script2, head.firstChild);
	  }
	};

	module.exports = JsonpReceiver;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15), (function() { return this; }())))

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, global) {'use strict';

	var random = __webpack_require__(17)
	  , urlUtils = __webpack_require__(19)
	  ;

	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(23)('sockjs-client:sender:jsonp');
	}

	var form, area;

	function createIframe(id) {
	  debug('createIframe', id);
	  try {
	    // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
	    return global.document.createElement('<iframe name="' + id + '">');
	  } catch (x) {
	    var iframe = global.document.createElement('iframe');
	    iframe.name = id;
	    return iframe;
	  }
	}

	function createForm() {
	  debug('createForm');
	  form = global.document.createElement('form');
	  form.style.display = 'none';
	  form.style.position = 'absolute';
	  form.method = 'POST';
	  form.enctype = 'application/x-www-form-urlencoded';
	  form.acceptCharset = 'UTF-8';

	  area = global.document.createElement('textarea');
	  area.name = 'd';
	  form.appendChild(area);

	  global.document.body.appendChild(form);
	}

	module.exports = function(url, payload, callback) {
	  debug(url, payload);
	  if (!form) {
	    createForm();
	  }
	  var id = 'a' + random.string(8);
	  form.target = id;
	  form.action = urlUtils.addQuery(urlUtils.addPath(url, '/jsonp_send'), 'i=' + id);

	  var iframe = createIframe(id);
	  iframe.id = id;
	  iframe.style.display = 'none';
	  form.appendChild(iframe);

	  try {
	    area.value = payload;
	  } catch (e) {
	    // seriously broken browsers get here
	  }
	  form.submit();

	  var completed = function(err) {
	    debug('completed', id, err);
	    if (!iframe.onerror) {
	      return;
	    }
	    iframe.onreadystatechange = iframe.onerror = iframe.onload = null;
	    // Opera mini doesn't like if we GC iframe
	    // immediately, thus this timeout.
	    setTimeout(function() {
	      debug('cleaning up', id);
	      iframe.parentNode.removeChild(iframe);
	      iframe = null;
	    }, 500);
	    area.value = '';
	    // It is not possible to detect if the iframe succeeded or
	    // failed to submit our form.
	    callback(err);
	  };
	  iframe.onerror = function() {
	    debug('onerror', id);
	    completed();
	  };
	  iframe.onload = function() {
	    debug('onload', id);
	    completed();
	  };
	  iframe.onreadystatechange = function(e) {
	    debug('onreadystatechange', id, iframe.readyState, e);
	    if (iframe.readyState === 'complete') {
	      completed();
	    }
	  };
	  return function() {
	    debug('aborted', id);
	    completed(new Error('Aborted'));
	  };
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15), (function() { return this; }())))

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, global) {'use strict';

	__webpack_require__(60);

	var URL = __webpack_require__(20)
	  , inherits = __webpack_require__(26)
	  , JSON3 = __webpack_require__(47)
	  , random = __webpack_require__(17)
	  , escape = __webpack_require__(61)
	  , urlUtils = __webpack_require__(19)
	  , eventUtils = __webpack_require__(16)
	  , transport = __webpack_require__(62)
	  , objectUtils = __webpack_require__(51)
	  , browser = __webpack_require__(39)
	  , log = __webpack_require__(63)
	  , Event = __webpack_require__(64)
	  , EventTarget = __webpack_require__(28)
	  , loc = __webpack_require__(65)
	  , CloseEvent = __webpack_require__(66)
	  , TransportMessageEvent = __webpack_require__(67)
	  , InfoReceiver = __webpack_require__(68)
	  ;

	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(23)('sockjs-client:main');
	}

	var transports;

	// follow constructor steps defined at http://dev.w3.org/html5/websockets/#the-websocket-interface
	function SockJS(url, protocols, options) {
	  if (!(this instanceof SockJS)) {
	    return new SockJS(url, protocols, options);
	  }
	  if (arguments.length < 1) {
	    throw new TypeError("Failed to construct 'SockJS: 1 argument required, but only 0 present");
	  }
	  EventTarget.call(this);

	  this.readyState = SockJS.CONNECTING;
	  this.extensions = '';
	  this.protocol = '';

	  // non-standard extension
	  options = options || {};
	  if (options.protocols_whitelist) {
	    log.warn("'protocols_whitelist' is DEPRECATED. Use 'transports' instead.");
	  }
	  this._transportsWhitelist = options.transports;
	  this._transportOptions = options.transportOptions || {};

	  var sessionId = options.sessionId || 8;
	  if (typeof sessionId === 'function') {
	    this._generateSessionId = sessionId;
	  } else if (typeof sessionId === 'number') {
	    this._generateSessionId = function() {
	      return random.string(sessionId);
	    };
	  } else {
	    throw new TypeError('If sessionId is used in the options, it needs to be a number or a function.');
	  }

	  this._server = options.server || random.numberString(1000);

	  // Step 1 of WS spec - parse and validate the url. Issue #8
	  var parsedUrl = new URL(url);
	  if (!parsedUrl.host || !parsedUrl.protocol) {
	    throw new SyntaxError("The URL '" + url + "' is invalid");
	  } else if (parsedUrl.hash) {
	    throw new SyntaxError('The URL must not contain a fragment');
	  } else if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
	    throw new SyntaxError("The URL's scheme must be either 'http:' or 'https:'. '" + parsedUrl.protocol + "' is not allowed.");
	  }

	  var secure = parsedUrl.protocol === 'https:';
	  // Step 2 - don't allow secure origin with an insecure protocol
	  if (loc.protocol === 'https:' && !secure) {
	    throw new Error('SecurityError: An insecure SockJS connection may not be initiated from a page loaded over HTTPS');
	  }

	  // Step 3 - check port access - no need here
	  // Step 4 - parse protocols argument
	  if (!protocols) {
	    protocols = [];
	  } else if (!Array.isArray(protocols)) {
	    protocols = [protocols];
	  }

	  // Step 5 - check protocols argument
	  var sortedProtocols = protocols.sort();
	  sortedProtocols.forEach(function(proto, i) {
	    if (!proto) {
	      throw new SyntaxError("The protocols entry '" + proto + "' is invalid.");
	    }
	    if (i < (sortedProtocols.length - 1) && proto === sortedProtocols[i + 1]) {
	      throw new SyntaxError("The protocols entry '" + proto + "' is duplicated.");
	    }
	  });

	  // Step 6 - convert origin
	  var o = urlUtils.getOrigin(loc.href);
	  this._origin = o ? o.toLowerCase() : null;

	  // remove the trailing slash
	  parsedUrl.set('pathname', parsedUrl.pathname.replace(/\/+$/, ''));

	  // store the sanitized url
	  this.url = parsedUrl.href;
	  debug('using url', this.url);

	  // Step 7 - start connection in background
	  // obtain server info
	  // http://sockjs.github.io/sockjs-protocol/sockjs-protocol-0.3.3.html#section-26
	  this._urlInfo = {
	    nullOrigin: !browser.hasDomain()
	  , sameOrigin: urlUtils.isOriginEqual(this.url, loc.href)
	  , sameScheme: urlUtils.isSchemeEqual(this.url, loc.href)
	  };

	  this._ir = new InfoReceiver(this.url, this._urlInfo);
	  this._ir.once('finish', this._receiveInfo.bind(this));
	}

	inherits(SockJS, EventTarget);

	function userSetCode(code) {
	  return code === 1000 || (code >= 3000 && code <= 4999);
	}

	SockJS.prototype.close = function(code, reason) {
	  // Step 1
	  if (code && !userSetCode(code)) {
	    throw new Error('InvalidAccessError: Invalid code');
	  }
	  // Step 2.4 states the max is 123 bytes, but we are just checking length
	  if (reason && reason.length > 123) {
	    throw new SyntaxError('reason argument has an invalid length');
	  }

	  // Step 3.1
	  if (this.readyState === SockJS.CLOSING || this.readyState === SockJS.CLOSED) {
	    return;
	  }

	  // TODO look at docs to determine how to set this
	  var wasClean = true;
	  this._close(code || 1000, reason || 'Normal closure', wasClean);
	};

	SockJS.prototype.send = function(data) {
	  // #13 - convert anything non-string to string
	  // TODO this currently turns objects into [object Object]
	  if (typeof data !== 'string') {
	    data = '' + data;
	  }
	  if (this.readyState === SockJS.CONNECTING) {
	    throw new Error('InvalidStateError: The connection has not been established yet');
	  }
	  if (this.readyState !== SockJS.OPEN) {
	    return;
	  }
	  this._transport.send(escape.quote(data));
	};

	SockJS.version = __webpack_require__(49);

	SockJS.CONNECTING = 0;
	SockJS.OPEN = 1;
	SockJS.CLOSING = 2;
	SockJS.CLOSED = 3;

	SockJS.prototype._receiveInfo = function(info, rtt) {
	  debug('_receiveInfo', rtt);
	  this._ir = null;
	  if (!info) {
	    this._close(1002, 'Cannot connect to server');
	    return;
	  }

	  // establish a round-trip timeout (RTO) based on the
	  // round-trip time (RTT)
	  this._rto = this.countRTO(rtt);
	  // allow server to override url used for the actual transport
	  this._transUrl = info.base_url ? info.base_url : this.url;
	  info = objectUtils.extend(info, this._urlInfo);
	  debug('info', info);
	  // determine list of desired and supported transports
	  var enabledTransports = transports.filterToEnabled(this._transportsWhitelist, info);
	  this._transports = enabledTransports.main;
	  debug(this._transports.length + ' enabled transports');

	  this._connect();
	};

	SockJS.prototype._connect = function() {
	  for (var Transport = this._transports.shift(); Transport; Transport = this._transports.shift()) {
	    debug('attempt', Transport.transportName);
	    if (Transport.needBody) {
	      if (!global.document.body ||
	          (typeof global.document.readyState !== 'undefined' &&
	            global.document.readyState !== 'complete' &&
	            global.document.readyState !== 'interactive')) {
	        debug('waiting for body');
	        this._transports.unshift(Transport);
	        eventUtils.attachEvent('load', this._connect.bind(this));
	        return;
	      }
	    }

	    // calculate timeout based on RTO and round trips. Default to 5s
	    var timeoutMs = (this._rto * Transport.roundTrips) || 5000;
	    this._transportTimeoutId = setTimeout(this._transportTimeout.bind(this), timeoutMs);
	    debug('using timeout', timeoutMs);

	    var transportUrl = urlUtils.addPath(this._transUrl, '/' + this._server + '/' + this._generateSessionId());
	    var options = this._transportOptions[Transport.transportName];
	    debug('transport url', transportUrl);
	    var transportObj = new Transport(transportUrl, this._transUrl, options);
	    transportObj.on('message', this._transportMessage.bind(this));
	    transportObj.once('close', this._transportClose.bind(this));
	    transportObj.transportName = Transport.transportName;
	    this._transport = transportObj;

	    return;
	  }
	  this._close(2000, 'All transports failed', false);
	};

	SockJS.prototype._transportTimeout = function() {
	  debug('_transportTimeout');
	  if (this.readyState === SockJS.CONNECTING) {
	    if (this._transport) {
	      this._transport.close();
	    }

	    this._transportClose(2007, 'Transport timed out');
	  }
	};

	SockJS.prototype._transportMessage = function(msg) {
	  debug('_transportMessage', msg);
	  var self = this
	    , type = msg.slice(0, 1)
	    , content = msg.slice(1)
	    , payload
	    ;

	  // first check for messages that don't need a payload
	  switch (type) {
	    case 'o':
	      this._open();
	      return;
	    case 'h':
	      this.dispatchEvent(new Event('heartbeat'));
	      debug('heartbeat', this.transport);
	      return;
	  }

	  if (content) {
	    try {
	      payload = JSON3.parse(content);
	    } catch (e) {
	      debug('bad json', content);
	    }
	  }

	  if (typeof payload === 'undefined') {
	    debug('empty payload', content);
	    return;
	  }

	  switch (type) {
	    case 'a':
	      if (Array.isArray(payload)) {
	        payload.forEach(function(p) {
	          debug('message', self.transport, p);
	          self.dispatchEvent(new TransportMessageEvent(p));
	        });
	      }
	      break;
	    case 'm':
	      debug('message', this.transport, payload);
	      this.dispatchEvent(new TransportMessageEvent(payload));
	      break;
	    case 'c':
	      if (Array.isArray(payload) && payload.length === 2) {
	        this._close(payload[0], payload[1], true);
	      }
	      break;
	  }
	};

	SockJS.prototype._transportClose = function(code, reason) {
	  debug('_transportClose', this.transport, code, reason);
	  if (this._transport) {
	    this._transport.removeAllListeners();
	    this._transport = null;
	    this.transport = null;
	  }

	  if (!userSetCode(code) && code !== 2000 && this.readyState === SockJS.CONNECTING) {
	    this._connect();
	    return;
	  }

	  this._close(code, reason);
	};

	SockJS.prototype._open = function() {
	  debug('_open', this._transport.transportName, this.readyState);
	  if (this.readyState === SockJS.CONNECTING) {
	    if (this._transportTimeoutId) {
	      clearTimeout(this._transportTimeoutId);
	      this._transportTimeoutId = null;
	    }
	    this.readyState = SockJS.OPEN;
	    this.transport = this._transport.transportName;
	    this.dispatchEvent(new Event('open'));
	    debug('connected', this.transport);
	  } else {
	    // The server might have been restarted, and lost track of our
	    // connection.
	    this._close(1006, 'Server lost session');
	  }
	};

	SockJS.prototype._close = function(code, reason, wasClean) {
	  debug('_close', this.transport, code, reason, wasClean, this.readyState);
	  var forceFail = false;

	  if (this._ir) {
	    forceFail = true;
	    this._ir.close();
	    this._ir = null;
	  }
	  if (this._transport) {
	    this._transport.close();
	    this._transport = null;
	    this.transport = null;
	  }

	  if (this.readyState === SockJS.CLOSED) {
	    throw new Error('InvalidStateError: SockJS has already been closed');
	  }

	  this.readyState = SockJS.CLOSING;
	  setTimeout(function() {
	    this.readyState = SockJS.CLOSED;

	    if (forceFail) {
	      this.dispatchEvent(new Event('error'));
	    }

	    var e = new CloseEvent('close');
	    e.wasClean = wasClean || false;
	    e.code = code || 1000;
	    e.reason = reason;

	    this.dispatchEvent(e);
	    this.onmessage = this.onclose = this.onerror = null;
	    debug('disconnected');
	  }.bind(this), 0);
	};

	// See: http://www.erg.abdn.ac.uk/~gerrit/dccp/notes/ccid2/rto_estimator/
	// and RFC 2988.
	SockJS.prototype.countRTO = function(rtt) {
	  // In a local environment, when using IE8/9 and the `jsonp-polling`
	  // transport the time needed to establish a connection (the time that pass
	  // from the opening of the transport to the call of `_dispatchOpen`) is
	  // around 200msec (the lower bound used in the article above) and this
	  // causes spurious timeouts. For this reason we calculate a value slightly
	  // larger than that used in the article.
	  if (rtt > 100) {
	    return 4 * rtt; // rto > 400msec
	  }
	  return 300 + rtt; // 300msec < rto <= 400msec
	};

	module.exports = function(availableTransports) {
	  transports = transport(availableTransports);
	  __webpack_require__(73)(SockJS, availableTransports);
	  return SockJS;
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15), (function() { return this; }())))

/***/ }),
/* 60 */
/***/ (function(module, exports) {

	/* eslint-disable */
	/* jscs: disable */
	'use strict';

	// pulled specific shims from https://github.com/es-shims/es5-shim

	var ArrayPrototype = Array.prototype;
	var ObjectPrototype = Object.prototype;
	var FunctionPrototype = Function.prototype;
	var StringPrototype = String.prototype;
	var array_slice = ArrayPrototype.slice;

	var _toString = ObjectPrototype.toString;
	var isFunction = function (val) {
	    return ObjectPrototype.toString.call(val) === '[object Function]';
	};
	var isArray = function isArray(obj) {
	    return _toString.call(obj) === '[object Array]';
	};
	var isString = function isString(obj) {
	    return _toString.call(obj) === '[object String]';
	};

	var supportsDescriptors = Object.defineProperty && (function () {
	    try {
	        Object.defineProperty({}, 'x', {});
	        return true;
	    } catch (e) { /* this is ES3 */
	        return false;
	    }
	}());

	// Define configurable, writable and non-enumerable props
	// if they don't exist.
	var defineProperty;
	if (supportsDescriptors) {
	    defineProperty = function (object, name, method, forceAssign) {
	        if (!forceAssign && (name in object)) { return; }
	        Object.defineProperty(object, name, {
	            configurable: true,
	            enumerable: false,
	            writable: true,
	            value: method
	        });
	    };
	} else {
	    defineProperty = function (object, name, method, forceAssign) {
	        if (!forceAssign && (name in object)) { return; }
	        object[name] = method;
	    };
	}
	var defineProperties = function (object, map, forceAssign) {
	    for (var name in map) {
	        if (ObjectPrototype.hasOwnProperty.call(map, name)) {
	          defineProperty(object, name, map[name], forceAssign);
	        }
	    }
	};

	var toObject = function (o) {
	    if (o == null) { // this matches both null and undefined
	        throw new TypeError("can't convert " + o + ' to object');
	    }
	    return Object(o);
	};

	//
	// Util
	// ======
	//

	// ES5 9.4
	// http://es5.github.com/#x9.4
	// http://jsperf.com/to-integer

	function toInteger(num) {
	    var n = +num;
	    if (n !== n) { // isNaN
	        n = 0;
	    } else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
	        n = (n > 0 || -1) * Math.floor(Math.abs(n));
	    }
	    return n;
	}

	function ToUint32(x) {
	    return x >>> 0;
	}

	//
	// Function
	// ========
	//

	// ES-5 15.3.4.5
	// http://es5.github.com/#x15.3.4.5

	function Empty() {}

	defineProperties(FunctionPrototype, {
	    bind: function bind(that) { // .length is 1
	        // 1. Let Target be the this value.
	        var target = this;
	        // 2. If IsCallable(Target) is false, throw a TypeError exception.
	        if (!isFunction(target)) {
	            throw new TypeError('Function.prototype.bind called on incompatible ' + target);
	        }
	        // 3. Let A be a new (possibly empty) internal list of all of the
	        //   argument values provided after thisArg (arg1, arg2 etc), in order.
	        // XXX slicedArgs will stand in for "A" if used
	        var args = array_slice.call(arguments, 1); // for normal call
	        // 4. Let F be a new native ECMAScript object.
	        // 11. Set the [[Prototype]] internal property of F to the standard
	        //   built-in Function prototype object as specified in 15.3.3.1.
	        // 12. Set the [[Call]] internal property of F as described in
	        //   15.3.4.5.1.
	        // 13. Set the [[Construct]] internal property of F as described in
	        //   15.3.4.5.2.
	        // 14. Set the [[HasInstance]] internal property of F as described in
	        //   15.3.4.5.3.
	        var binder = function () {

	            if (this instanceof bound) {
	                // 15.3.4.5.2 [[Construct]]
	                // When the [[Construct]] internal method of a function object,
	                // F that was created using the bind function is called with a
	                // list of arguments ExtraArgs, the following steps are taken:
	                // 1. Let target be the value of F's [[TargetFunction]]
	                //   internal property.
	                // 2. If target has no [[Construct]] internal method, a
	                //   TypeError exception is thrown.
	                // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
	                //   property.
	                // 4. Let args be a new list containing the same values as the
	                //   list boundArgs in the same order followed by the same
	                //   values as the list ExtraArgs in the same order.
	                // 5. Return the result of calling the [[Construct]] internal
	                //   method of target providing args as the arguments.

	                var result = target.apply(
	                    this,
	                    args.concat(array_slice.call(arguments))
	                );
	                if (Object(result) === result) {
	                    return result;
	                }
	                return this;

	            } else {
	                // 15.3.4.5.1 [[Call]]
	                // When the [[Call]] internal method of a function object, F,
	                // which was created using the bind function is called with a
	                // this value and a list of arguments ExtraArgs, the following
	                // steps are taken:
	                // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
	                //   property.
	                // 2. Let boundThis be the value of F's [[BoundThis]] internal
	                //   property.
	                // 3. Let target be the value of F's [[TargetFunction]] internal
	                //   property.
	                // 4. Let args be a new list containing the same values as the
	                //   list boundArgs in the same order followed by the same
	                //   values as the list ExtraArgs in the same order.
	                // 5. Return the result of calling the [[Call]] internal method
	                //   of target providing boundThis as the this value and
	                //   providing args as the arguments.

	                // equiv: target.call(this, ...boundArgs, ...args)
	                return target.apply(
	                    that,
	                    args.concat(array_slice.call(arguments))
	                );

	            }

	        };

	        // 15. If the [[Class]] internal property of Target is "Function", then
	        //     a. Let L be the length property of Target minus the length of A.
	        //     b. Set the length own property of F to either 0 or L, whichever is
	        //       larger.
	        // 16. Else set the length own property of F to 0.

	        var boundLength = Math.max(0, target.length - args.length);

	        // 17. Set the attributes of the length own property of F to the values
	        //   specified in 15.3.5.1.
	        var boundArgs = [];
	        for (var i = 0; i < boundLength; i++) {
	            boundArgs.push('$' + i);
	        }

	        // XXX Build a dynamic function with desired amount of arguments is the only
	        // way to set the length property of a function.
	        // In environments where Content Security Policies enabled (Chrome extensions,
	        // for ex.) all use of eval or Function costructor throws an exception.
	        // However in all of these environments Function.prototype.bind exists
	        // and so this code will never be executed.
	        var bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this, arguments); }')(binder);

	        if (target.prototype) {
	            Empty.prototype = target.prototype;
	            bound.prototype = new Empty();
	            // Clean up dangling references.
	            Empty.prototype = null;
	        }

	        // TODO
	        // 18. Set the [[Extensible]] internal property of F to true.

	        // TODO
	        // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
	        // 20. Call the [[DefineOwnProperty]] internal method of F with
	        //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
	        //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
	        //   false.
	        // 21. Call the [[DefineOwnProperty]] internal method of F with
	        //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
	        //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
	        //   and false.

	        // TODO
	        // NOTE Function objects created using Function.prototype.bind do not
	        // have a prototype property or the [[Code]], [[FormalParameters]], and
	        // [[Scope]] internal properties.
	        // XXX can't delete prototype in pure-js.

	        // 22. Return F.
	        return bound;
	    }
	});

	//
	// Array
	// =====
	//

	// ES5 15.4.3.2
	// http://es5.github.com/#x15.4.3.2
	// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
	defineProperties(Array, { isArray: isArray });


	var boxedString = Object('a');
	var splitString = boxedString[0] !== 'a' || !(0 in boxedString);

	var properlyBoxesContext = function properlyBoxed(method) {
	    // Check node 0.6.21 bug where third parameter is not boxed
	    var properlyBoxesNonStrict = true;
	    var properlyBoxesStrict = true;
	    if (method) {
	        method.call('foo', function (_, __, context) {
	            if (typeof context !== 'object') { properlyBoxesNonStrict = false; }
	        });

	        method.call([1], function () {
	            'use strict';
	            properlyBoxesStrict = typeof this === 'string';
	        }, 'x');
	    }
	    return !!method && properlyBoxesNonStrict && properlyBoxesStrict;
	};

	defineProperties(ArrayPrototype, {
	    forEach: function forEach(fun /*, thisp*/) {
	        var object = toObject(this),
	            self = splitString && isString(this) ? this.split('') : object,
	            thisp = arguments[1],
	            i = -1,
	            length = self.length >>> 0;

	        // If no callback function or if callback is not a callable function
	        if (!isFunction(fun)) {
	            throw new TypeError(); // TODO message
	        }

	        while (++i < length) {
	            if (i in self) {
	                // Invoke the callback function with call, passing arguments:
	                // context, property value, property key, thisArg object
	                // context
	                fun.call(thisp, self[i], i, object);
	            }
	        }
	    }
	}, !properlyBoxesContext(ArrayPrototype.forEach));

	// ES5 15.4.4.14
	// http://es5.github.com/#x15.4.4.14
	// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
	var hasFirefox2IndexOfBug = Array.prototype.indexOf && [0, 1].indexOf(1, 2) !== -1;
	defineProperties(ArrayPrototype, {
	    indexOf: function indexOf(sought /*, fromIndex */ ) {
	        var self = splitString && isString(this) ? this.split('') : toObject(this),
	            length = self.length >>> 0;

	        if (!length) {
	            return -1;
	        }

	        var i = 0;
	        if (arguments.length > 1) {
	            i = toInteger(arguments[1]);
	        }

	        // handle negative indices
	        i = i >= 0 ? i : Math.max(0, length + i);
	        for (; i < length; i++) {
	            if (i in self && self[i] === sought) {
	                return i;
	            }
	        }
	        return -1;
	    }
	}, hasFirefox2IndexOfBug);

	//
	// String
	// ======
	//

	// ES5 15.5.4.14
	// http://es5.github.com/#x15.5.4.14

	// [bugfix, IE lt 9, firefox 4, Konqueror, Opera, obscure browsers]
	// Many browsers do not split properly with regular expressions or they
	// do not perform the split correctly under obscure conditions.
	// See http://blog.stevenlevithan.com/archives/cross-browser-split
	// I've tested in many browsers and this seems to cover the deviant ones:
	//    'ab'.split(/(?:ab)*/) should be ["", ""], not [""]
	//    '.'.split(/(.?)(.?)/) should be ["", ".", "", ""], not ["", ""]
	//    'tesst'.split(/(s)*/) should be ["t", undefined, "e", "s", "t"], not
	//       [undefined, "t", undefined, "e", ...]
	//    ''.split(/.?/) should be [], not [""]
	//    '.'.split(/()()/) should be ["."], not ["", "", "."]

	var string_split = StringPrototype.split;
	if (
	    'ab'.split(/(?:ab)*/).length !== 2 ||
	    '.'.split(/(.?)(.?)/).length !== 4 ||
	    'tesst'.split(/(s)*/)[1] === 't' ||
	    'test'.split(/(?:)/, -1).length !== 4 ||
	    ''.split(/.?/).length ||
	    '.'.split(/()()/).length > 1
	) {
	    (function () {
	        var compliantExecNpcg = /()??/.exec('')[1] === void 0; // NPCG: nonparticipating capturing group

	        StringPrototype.split = function (separator, limit) {
	            var string = this;
	            if (separator === void 0 && limit === 0) {
	                return [];
	            }

	            // If `separator` is not a regex, use native split
	            if (_toString.call(separator) !== '[object RegExp]') {
	                return string_split.call(this, separator, limit);
	            }

	            var output = [],
	                flags = (separator.ignoreCase ? 'i' : '') +
	                        (separator.multiline  ? 'm' : '') +
	                        (separator.extended   ? 'x' : '') + // Proposed for ES6
	                        (separator.sticky     ? 'y' : ''), // Firefox 3+
	                lastLastIndex = 0,
	                // Make `global` and avoid `lastIndex` issues by working with a copy
	                separator2, match, lastIndex, lastLength;
	            separator = new RegExp(separator.source, flags + 'g');
	            string += ''; // Type-convert
	            if (!compliantExecNpcg) {
	                // Doesn't need flags gy, but they don't hurt
	                separator2 = new RegExp('^' + separator.source + '$(?!\\s)', flags);
	            }
	            /* Values for `limit`, per the spec:
	             * If undefined: 4294967295 // Math.pow(2, 32) - 1
	             * If 0, Infinity, or NaN: 0
	             * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
	             * If negative number: 4294967296 - Math.floor(Math.abs(limit))
	             * If other: Type-convert, then use the above rules
	             */
	            limit = limit === void 0 ?
	                -1 >>> 0 : // Math.pow(2, 32) - 1
	                ToUint32(limit);
	            while (match = separator.exec(string)) {
	                // `separator.lastIndex` is not reliable cross-browser
	                lastIndex = match.index + match[0].length;
	                if (lastIndex > lastLastIndex) {
	                    output.push(string.slice(lastLastIndex, match.index));
	                    // Fix browsers whose `exec` methods don't consistently return `undefined` for
	                    // nonparticipating capturing groups
	                    if (!compliantExecNpcg && match.length > 1) {
	                        match[0].replace(separator2, function () {
	                            for (var i = 1; i < arguments.length - 2; i++) {
	                                if (arguments[i] === void 0) {
	                                    match[i] = void 0;
	                                }
	                            }
	                        });
	                    }
	                    if (match.length > 1 && match.index < string.length) {
	                        ArrayPrototype.push.apply(output, match.slice(1));
	                    }
	                    lastLength = match[0].length;
	                    lastLastIndex = lastIndex;
	                    if (output.length >= limit) {
	                        break;
	                    }
	                }
	                if (separator.lastIndex === match.index) {
	                    separator.lastIndex++; // Avoid an infinite loop
	                }
	            }
	            if (lastLastIndex === string.length) {
	                if (lastLength || !separator.test('')) {
	                    output.push('');
	                }
	            } else {
	                output.push(string.slice(lastLastIndex));
	            }
	            return output.length > limit ? output.slice(0, limit) : output;
	        };
	    }());

	// [bugfix, chrome]
	// If separator is undefined, then the result array contains just one String,
	// which is the this value (converted to a String). If limit is not undefined,
	// then the output array is truncated so that it contains no more than limit
	// elements.
	// "0".split(undefined, 0) -> []
	} else if ('0'.split(void 0, 0).length) {
	    StringPrototype.split = function split(separator, limit) {
	        if (separator === void 0 && limit === 0) { return []; }
	        return string_split.call(this, separator, limit);
	    };
	}

	// ECMA-262, 3rd B.2.3
	// Not an ECMAScript standard, although ECMAScript 3rd Edition has a
	// non-normative section suggesting uniform semantics and it should be
	// normalized across all browsers
	// [bugfix, IE lt 9] IE < 9 substr() with negative value not working in IE
	var string_substr = StringPrototype.substr;
	var hasNegativeSubstrBug = ''.substr && '0b'.substr(-1) !== 'b';
	defineProperties(StringPrototype, {
	    substr: function substr(start, length) {
	        return string_substr.call(
	            this,
	            start < 0 ? ((start = this.length + start) < 0 ? 0 : start) : start,
	            length
	        );
	    }
	}, hasNegativeSubstrBug);


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var JSON3 = __webpack_require__(47);

	// Some extra characters that Chrome gets wrong, and substitutes with
	// something else on the wire.
	// eslint-disable-next-line no-control-regex
	var extraEscapable = /[\x00-\x1f\ud800-\udfff\ufffe\uffff\u0300-\u0333\u033d-\u0346\u034a-\u034c\u0350-\u0352\u0357-\u0358\u035c-\u0362\u0374\u037e\u0387\u0591-\u05af\u05c4\u0610-\u0617\u0653-\u0654\u0657-\u065b\u065d-\u065e\u06df-\u06e2\u06eb-\u06ec\u0730\u0732-\u0733\u0735-\u0736\u073a\u073d\u073f-\u0741\u0743\u0745\u0747\u07eb-\u07f1\u0951\u0958-\u095f\u09dc-\u09dd\u09df\u0a33\u0a36\u0a59-\u0a5b\u0a5e\u0b5c-\u0b5d\u0e38-\u0e39\u0f43\u0f4d\u0f52\u0f57\u0f5c\u0f69\u0f72-\u0f76\u0f78\u0f80-\u0f83\u0f93\u0f9d\u0fa2\u0fa7\u0fac\u0fb9\u1939-\u193a\u1a17\u1b6b\u1cda-\u1cdb\u1dc0-\u1dcf\u1dfc\u1dfe\u1f71\u1f73\u1f75\u1f77\u1f79\u1f7b\u1f7d\u1fbb\u1fbe\u1fc9\u1fcb\u1fd3\u1fdb\u1fe3\u1feb\u1fee-\u1fef\u1ff9\u1ffb\u1ffd\u2000-\u2001\u20d0-\u20d1\u20d4-\u20d7\u20e7-\u20e9\u2126\u212a-\u212b\u2329-\u232a\u2adc\u302b-\u302c\uaab2-\uaab3\uf900-\ufa0d\ufa10\ufa12\ufa15-\ufa1e\ufa20\ufa22\ufa25-\ufa26\ufa2a-\ufa2d\ufa30-\ufa6d\ufa70-\ufad9\ufb1d\ufb1f\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufb4e\ufff0-\uffff]/g
	  , extraLookup;

	// This may be quite slow, so let's delay until user actually uses bad
	// characters.
	var unrollLookup = function(escapable) {
	  var i;
	  var unrolled = {};
	  var c = [];
	  for (i = 0; i < 65536; i++) {
	    c.push( String.fromCharCode(i) );
	  }
	  escapable.lastIndex = 0;
	  c.join('').replace(escapable, function(a) {
	    unrolled[ a ] = '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	    return '';
	  });
	  escapable.lastIndex = 0;
	  return unrolled;
	};

	// Quote string, also taking care of unicode characters that browsers
	// often break. Especially, take care of unicode surrogates:
	// http://en.wikipedia.org/wiki/Mapping_of_Unicode_characters#Surrogates
	module.exports = {
	  quote: function(string) {
	    var quoted = JSON3.stringify(string);

	    // In most cases this should be very fast and good enough.
	    extraEscapable.lastIndex = 0;
	    if (!extraEscapable.test(quoted)) {
	      return quoted;
	    }

	    if (!extraLookup) {
	      extraLookup = unrollLookup(extraEscapable);
	    }

	    return quoted.replace(extraEscapable, function(a) {
	      return extraLookup[a];
	    });
	  }
	};


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(23)('sockjs-client:utils:transport');
	}

	module.exports = function(availableTransports) {
	  return {
	    filterToEnabled: function(transportsWhitelist, info) {
	      var transports = {
	        main: []
	      , facade: []
	      };
	      if (!transportsWhitelist) {
	        transportsWhitelist = [];
	      } else if (typeof transportsWhitelist === 'string') {
	        transportsWhitelist = [transportsWhitelist];
	      }

	      availableTransports.forEach(function(trans) {
	        if (!trans) {
	          return;
	        }

	        if (trans.transportName === 'websocket' && info.websocket === false) {
	          debug('disabled from server', 'websocket');
	          return;
	        }

	        if (transportsWhitelist.length &&
	            transportsWhitelist.indexOf(trans.transportName) === -1) {
	          debug('not in whitelist', trans.transportName);
	          return;
	        }

	        if (trans.enabled(info)) {
	          debug('enabled', trans.transportName);
	          transports.main.push(trans);
	          if (trans.facadeTransport) {
	            transports.facade.push(trans.facadeTransport);
	          }
	        } else {
	          debug('disabled', trans.transportName);
	        }
	      });
	      return transports;
	    }
	  };
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))

/***/ }),
/* 63 */
/***/ (function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var logObject = {};
	['log', 'debug', 'warn'].forEach(function (level) {
	  var levelExists;

	  try {
	    levelExists = global.console && global.console[level] && global.console[level].apply;
	  } catch(e) {
	    // do nothing
	  }

	  logObject[level] = levelExists ? function () {
	    return global.console[level].apply(global.console, arguments);
	  } : (level === 'log' ? function () {} : logObject.log);
	});

	module.exports = logObject;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 64 */
/***/ (function(module, exports) {

	'use strict';

	function Event(eventType) {
	  this.type = eventType;
	}

	Event.prototype.initEvent = function(eventType, canBubble, cancelable) {
	  this.type = eventType;
	  this.bubbles = canBubble;
	  this.cancelable = cancelable;
	  this.timeStamp = +new Date();
	  return this;
	};

	Event.prototype.stopPropagation = function() {};
	Event.prototype.preventDefault = function() {};

	Event.CAPTURING_PHASE = 1;
	Event.AT_TARGET = 2;
	Event.BUBBLING_PHASE = 3;

	module.exports = Event;


/***/ }),
/* 65 */
/***/ (function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	module.exports = global.location || {
	  origin: 'http://localhost:80'
	, protocol: 'http:'
	, host: 'localhost'
	, port: 80
	, href: 'http://localhost/'
	, hash: ''
	};

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var inherits = __webpack_require__(26)
	  , Event = __webpack_require__(64)
	  ;

	function CloseEvent() {
	  Event.call(this);
	  this.initEvent('close', false, false);
	  this.wasClean = false;
	  this.code = 0;
	  this.reason = '';
	}

	inherits(CloseEvent, Event);

	module.exports = CloseEvent;


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var inherits = __webpack_require__(26)
	  , Event = __webpack_require__(64)
	  ;

	function TransportMessageEvent(data) {
	  Event.call(this);
	  this.initEvent('message', false, false);
	  this.data = data;
	}

	inherits(TransportMessageEvent, Event);

	module.exports = TransportMessageEvent;


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var EventEmitter = __webpack_require__(27).EventEmitter
	  , inherits = __webpack_require__(26)
	  , urlUtils = __webpack_require__(19)
	  , XDR = __webpack_require__(41)
	  , XHRCors = __webpack_require__(36)
	  , XHRLocal = __webpack_require__(38)
	  , XHRFake = __webpack_require__(69)
	  , InfoIframe = __webpack_require__(70)
	  , InfoAjax = __webpack_require__(72)
	  ;

	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(23)('sockjs-client:info-receiver');
	}

	function InfoReceiver(baseUrl, urlInfo) {
	  debug(baseUrl);
	  var self = this;
	  EventEmitter.call(this);

	  setTimeout(function() {
	    self.doXhr(baseUrl, urlInfo);
	  }, 0);
	}

	inherits(InfoReceiver, EventEmitter);

	// TODO this is currently ignoring the list of available transports and the whitelist

	InfoReceiver._getReceiver = function(baseUrl, url, urlInfo) {
	  // determine method of CORS support (if needed)
	  if (urlInfo.sameOrigin) {
	    return new InfoAjax(url, XHRLocal);
	  }
	  if (XHRCors.enabled) {
	    return new InfoAjax(url, XHRCors);
	  }
	  if (XDR.enabled && urlInfo.sameScheme) {
	    return new InfoAjax(url, XDR);
	  }
	  if (InfoIframe.enabled()) {
	    return new InfoIframe(baseUrl, url);
	  }
	  return new InfoAjax(url, XHRFake);
	};

	InfoReceiver.prototype.doXhr = function(baseUrl, urlInfo) {
	  var self = this
	    , url = urlUtils.addPath(baseUrl, '/info')
	    ;
	  debug('doXhr', url);

	  this.xo = InfoReceiver._getReceiver(baseUrl, url, urlInfo);

	  this.timeoutRef = setTimeout(function() {
	    debug('timeout');
	    self._cleanup(false);
	    self.emit('finish');
	  }, InfoReceiver.timeout);

	  this.xo.once('finish', function(info, rtt) {
	    debug('finish', info, rtt);
	    self._cleanup(true);
	    self.emit('finish', info, rtt);
	  });
	};

	InfoReceiver.prototype._cleanup = function(wasClean) {
	  debug('_cleanup');
	  clearTimeout(this.timeoutRef);
	  this.timeoutRef = null;
	  if (!wasClean && this.xo) {
	    this.xo.close();
	  }
	  this.xo = null;
	};

	InfoReceiver.prototype.close = function() {
	  debug('close');
	  this.removeAllListeners();
	  this._cleanup(false);
	};

	InfoReceiver.timeout = 8000;

	module.exports = InfoReceiver;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var EventEmitter = __webpack_require__(27).EventEmitter
	  , inherits = __webpack_require__(26)
	  ;

	function XHRFake(/* method, url, payload, opts */) {
	  var self = this;
	  EventEmitter.call(this);

	  this.to = setTimeout(function() {
	    self.emit('finish', 200, '{}');
	  }, XHRFake.timeout);
	}

	inherits(XHRFake, EventEmitter);

	XHRFake.prototype.close = function() {
	  clearTimeout(this.to);
	};

	XHRFake.timeout = 2000;

	module.exports = XHRFake;


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, global) {'use strict';

	var EventEmitter = __webpack_require__(27).EventEmitter
	  , inherits = __webpack_require__(26)
	  , JSON3 = __webpack_require__(47)
	  , utils = __webpack_require__(16)
	  , IframeTransport = __webpack_require__(46)
	  , InfoReceiverIframe = __webpack_require__(71)
	  ;

	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(23)('sockjs-client:info-iframe');
	}

	function InfoIframe(baseUrl, url) {
	  var self = this;
	  EventEmitter.call(this);

	  var go = function() {
	    var ifr = self.ifr = new IframeTransport(InfoReceiverIframe.transportName, url, baseUrl);

	    ifr.once('message', function(msg) {
	      if (msg) {
	        var d;
	        try {
	          d = JSON3.parse(msg);
	        } catch (e) {
	          debug('bad json', msg);
	          self.emit('finish');
	          self.close();
	          return;
	        }

	        var info = d[0], rtt = d[1];
	        self.emit('finish', info, rtt);
	      }
	      self.close();
	    });

	    ifr.once('close', function() {
	      self.emit('finish');
	      self.close();
	    });
	  };

	  // TODO this seems the same as the 'needBody' from transports
	  if (!global.document.body) {
	    utils.attachEvent('load', go);
	  } else {
	    go();
	  }
	}

	inherits(InfoIframe, EventEmitter);

	InfoIframe.enabled = function() {
	  return IframeTransport.enabled();
	};

	InfoIframe.prototype.close = function() {
	  if (this.ifr) {
	    this.ifr.close();
	  }
	  this.removeAllListeners();
	  this.ifr = null;
	};

	module.exports = InfoIframe;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15), (function() { return this; }())))

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var inherits = __webpack_require__(26)
	  , EventEmitter = __webpack_require__(27).EventEmitter
	  , JSON3 = __webpack_require__(47)
	  , XHRLocalObject = __webpack_require__(38)
	  , InfoAjax = __webpack_require__(72)
	  ;

	function InfoReceiverIframe(transUrl) {
	  var self = this;
	  EventEmitter.call(this);

	  this.ir = new InfoAjax(transUrl, XHRLocalObject);
	  this.ir.once('finish', function(info, rtt) {
	    self.ir = null;
	    self.emit('message', JSON3.stringify([info, rtt]));
	  });
	}

	inherits(InfoReceiverIframe, EventEmitter);

	InfoReceiverIframe.transportName = 'iframe-info-receiver';

	InfoReceiverIframe.prototype.close = function() {
	  if (this.ir) {
	    this.ir.close();
	    this.ir = null;
	  }
	  this.removeAllListeners();
	};

	module.exports = InfoReceiverIframe;


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var EventEmitter = __webpack_require__(27).EventEmitter
	  , inherits = __webpack_require__(26)
	  , JSON3 = __webpack_require__(47)
	  , objectUtils = __webpack_require__(51)
	  ;

	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(23)('sockjs-client:info-ajax');
	}

	function InfoAjax(url, AjaxObject) {
	  EventEmitter.call(this);

	  var self = this;
	  var t0 = +new Date();
	  this.xo = new AjaxObject('GET', url);

	  this.xo.once('finish', function(status, text) {
	    var info, rtt;
	    if (status === 200) {
	      rtt = (+new Date()) - t0;
	      if (text) {
	        try {
	          info = JSON3.parse(text);
	        } catch (e) {
	          debug('bad json', text);
	        }
	      }

	      if (!objectUtils.isObject(info)) {
	        info = {};
	      }
	    }
	    self.emit('finish', info, rtt);
	    self.removeAllListeners();
	  });
	}

	inherits(InfoAjax, EventEmitter);

	InfoAjax.prototype.close = function() {
	  this.removeAllListeners();
	  this.xo.close();
	};

	module.exports = InfoAjax;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var urlUtils = __webpack_require__(19)
	  , eventUtils = __webpack_require__(16)
	  , JSON3 = __webpack_require__(47)
	  , FacadeJS = __webpack_require__(74)
	  , InfoIframeReceiver = __webpack_require__(71)
	  , iframeUtils = __webpack_require__(50)
	  , loc = __webpack_require__(65)
	  ;

	var debug = function() {};
	if (process.env.NODE_ENV !== 'production') {
	  debug = __webpack_require__(23)('sockjs-client:iframe-bootstrap');
	}

	module.exports = function(SockJS, availableTransports) {
	  var transportMap = {};
	  availableTransports.forEach(function(at) {
	    if (at.facadeTransport) {
	      transportMap[at.facadeTransport.transportName] = at.facadeTransport;
	    }
	  });

	  // hard-coded for the info iframe
	  // TODO see if we can make this more dynamic
	  transportMap[InfoIframeReceiver.transportName] = InfoIframeReceiver;
	  var parentOrigin;

	  /* eslint-disable camelcase */
	  SockJS.bootstrap_iframe = function() {
	    /* eslint-enable camelcase */
	    var facade;
	    iframeUtils.currentWindowId = loc.hash.slice(1);
	    var onMessage = function(e) {
	      if (e.source !== parent) {
	        return;
	      }
	      if (typeof parentOrigin === 'undefined') {
	        parentOrigin = e.origin;
	      }
	      if (e.origin !== parentOrigin) {
	        return;
	      }

	      var iframeMessage;
	      try {
	        iframeMessage = JSON3.parse(e.data);
	      } catch (ignored) {
	        debug('bad json', e.data);
	        return;
	      }

	      if (iframeMessage.windowId !== iframeUtils.currentWindowId) {
	        return;
	      }
	      switch (iframeMessage.type) {
	      case 's':
	        var p;
	        try {
	          p = JSON3.parse(iframeMessage.data);
	        } catch (ignored) {
	          debug('bad json', iframeMessage.data);
	          break;
	        }
	        var version = p[0];
	        var transport = p[1];
	        var transUrl = p[2];
	        var baseUrl = p[3];
	        debug(version, transport, transUrl, baseUrl);
	        // change this to semver logic
	        if (version !== SockJS.version) {
	          throw new Error('Incompatible SockJS! Main site uses:' +
	                    ' "' + version + '", the iframe:' +
	                    ' "' + SockJS.version + '".');
	        }

	        if (!urlUtils.isOriginEqual(transUrl, loc.href) ||
	            !urlUtils.isOriginEqual(baseUrl, loc.href)) {
	          throw new Error('Can\'t connect to different domain from within an ' +
	                    'iframe. (' + loc.href + ', ' + transUrl + ', ' + baseUrl + ')');
	        }
	        facade = new FacadeJS(new transportMap[transport](transUrl, baseUrl));
	        break;
	      case 'm':
	        facade._send(iframeMessage.data);
	        break;
	      case 'c':
	        if (facade) {
	          facade._close();
	        }
	        facade = null;
	        break;
	      }
	    };

	    eventUtils.attachEvent('message', onMessage);

	    // Start
	    iframeUtils.postMessage('s');
	  };
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var JSON3 = __webpack_require__(47)
	  , iframeUtils = __webpack_require__(50)
	  ;

	function FacadeJS(transport) {
	  this._transport = transport;
	  transport.on('message', this._transportMessage.bind(this));
	  transport.on('close', this._transportClose.bind(this));
	}

	FacadeJS.prototype._transportClose = function(code, reason) {
	  iframeUtils.postMessage('c', JSON3.stringify([code, reason]));
	};
	FacadeJS.prototype._transportMessage = function(frame) {
	  iframeUtils.postMessage('t', frame);
	};
	FacadeJS.prototype._send = function(data) {
	  this._transport.send(data);
	};
	FacadeJS.prototype._close = function() {
	  this._transport.close();
	  this._transport.removeAllListeners();
	};

	module.exports = FacadeJS;


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	/*globals window __webpack_hash__ */
	if(true) {
		var lastData;
		var upToDate = function upToDate() {
			return lastData.indexOf(__webpack_require__.h()) >= 0;
		};
		var check = function check() {
			module.hot.check(true, function(err, updatedModules) {
				if(err) {
					if(module.hot.status() in {
							abort: 1,
							fail: 1
						}) {
						console.warn("[HMR] Cannot apply update. Need to do a full reload!");
						console.warn("[HMR] " + err.stack || err.message);
						window.location.reload();
					} else {
						console.warn("[HMR] Update failed: " + err.stack || err.message);
					}
					return;
				}

				if(!updatedModules) {
					console.warn("[HMR] Cannot find update. Need to do a full reload!");
					console.warn("[HMR] (Probably because of restarting the webpack-dev-server)");
					window.location.reload();
					return;
				}

				if(!upToDate()) {
					check();
				}

				__webpack_require__(76)(updatedModules, updatedModules);

				if(upToDate()) {
					console.log("[HMR] App is up to date.");
				}

			});
		};
		var addEventListener = window.addEventListener ? function(eventName, listener) {
			window.addEventListener(eventName, listener, false);
		} : function(eventName, listener) {
			window.attachEvent("on" + eventName, listener);
		};
		addEventListener("message", function(event) {
			if(typeof event.data === "string" && event.data.indexOf("webpackHotUpdate") === 0) {
				lastData = event.data;
				if(!upToDate() && module.hot.status() === "idle") {
					console.log("[HMR] Checking for updates on the server...");
					check();
				}
			}
		});
		console.log("[HMR] Waiting for update signal from WDS...");
	} else {
		throw new Error("[HMR] Hot Module Replacement is disabled.");
	}


/***/ }),
/* 76 */
/***/ (function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	module.exports = function(updatedModules, renewedModules) {
		var unacceptedModules = updatedModules.filter(function(moduleId) {
			return renewedModules && renewedModules.indexOf(moduleId) < 0;
		});

		if(unacceptedModules.length > 0) {
			console.warn("[HMR] The following modules couldn't be hot updated: (They would need a full reload!)");
			unacceptedModules.forEach(function(moduleId) {
				console.warn("[HMR]  - " + moduleId);
			});
		}

		if(!renewedModules || renewedModules.length === 0) {
			console.log("[HMR] Nothing hot updated.");
		} else {
			console.log("[HMR] Updated modules:");
			renewedModules.forEach(function(moduleId) {
				console.log("[HMR]  - " + moduleId);
			});
		}
	};


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _rx = __webpack_require__(78);

	var _rx2 = _interopRequireDefault(_rx);

	var _feathersClient = __webpack_require__(79);

	var _feathersClient2 = _interopRequireDefault(_feathersClient);

	var _feathersLocalstorage = __webpack_require__(133);

	var _feathersLocalstorage2 = _interopRequireDefault(_feathersLocalstorage);

	var _feathersReactive = __webpack_require__(147);

	var _feathersReactive2 = _interopRequireDefault(_feathersReactive);

	var _superagent = __webpack_require__(155);

	var _superagent2 = _interopRequireDefault(_superagent);

	var _rx3 = __webpack_require__(162);

	var _rx4 = _interopRequireDefault(_rx3);

	var _utils = __webpack_require__(164);

	var _utils2 = _interopRequireDefault(_utils);

	var _styles = __webpack_require__(165);

	var _styles2 = _interopRequireDefault(_styles);

	var _helperStyles = __webpack_require__(170);

	var _helperStyles2 = _interopRequireDefault(_helperStyles);

	var _angularMaterialIcons = __webpack_require__(172);

	var _angularMaterialIcons2 = _interopRequireDefault(_angularMaterialIcons);

	var _rest = __webpack_require__(174);

	var _rest2 = _interopRequireDefault(_rest);

	var _toUppercase = __webpack_require__(175);

	var _toUppercase2 = _interopRequireDefault(_toUppercase);

	var _formatPhone = __webpack_require__(176);

	var _formatPhone2 = _interopRequireDefault(_formatPhone);

	var _focusParent = __webpack_require__(177);

	var _focusParent2 = _interopRequireDefault(_focusParent);

	var _size = __webpack_require__(178);

	var _size2 = _interopRequireDefault(_size);

	var _navigator = __webpack_require__(179);

	var _navigator2 = _interopRequireDefault(_navigator);

	var _col = __webpack_require__(180);

	var _col2 = _interopRequireDefault(_col);

	var _progressButton = __webpack_require__(182);

	var _progressButton2 = _interopRequireDefault(_progressButton);

	var _progressButton3 = __webpack_require__(184);

	var _progressButton4 = _interopRequireDefault(_progressButton3);

	var _listItem = __webpack_require__(186);

	var _listItem2 = _interopRequireDefault(_listItem);

	var _listItemNumericControl = __webpack_require__(188);

	var _listItemNumericControl2 = _interopRequireDefault(_listItemNumericControl);

	var _listItemAddCharge = __webpack_require__(190);

	var _listItemAddCharge2 = _interopRequireDefault(_listItemAddCharge);

	var _listItemHeader = __webpack_require__(194);

	var _listItemHeader2 = _interopRequireDefault(_listItemHeader);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	//Including independent module source code for packaging
	var ablBook = __webpack_require__(196);


	var jQuery = window.jQuery;

	// import feathersAuthentication from './auth';


	var sdkProvider = function sdkProvider(settings) {
	  var endpoint = null;
	  var apiKey = null;
	  var socketOpts = null;
	  var _useSocket = true;
	  var services = [];

	  //Configuration
	  return {
	    useSocket: function useSocket(socketEnabled) {
	      _useSocket = !!socketEnabled;
	    },
	    setSocketOpts: function setSocketOpts(opts) {
	      socketOpts = opts;
	    },
	    setEndpoint: function setEndpoint(newEndpoint) {
	      endpoint = newEndpoint;
	    },
	    setApiKey: function setApiKey(key) {
	      apiKey = key;
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

	      $log.debug('config', $rootScope.config);

	      this.app = (0, _feathersClient2.default)().configure((0, _feathersReactive2.default)(_rx2.default)) //feathers-reactive
	      .configure(_feathersClient2.default.hooks()).use('cache', (0, _feathersLocalstorage2.default)({
	        name: 'abl' + ($rootScope.config.DASHBOARD ? '-dash' : ''),
	        storage: window.localStorage
	      }));

	      this.app.endpoint = endpoint;
	      this.app.apiKey = apiKey;

	      var xsrfCookieIndex = document.cookie.indexOf('XSRF-TOKEN=');

	      var xsrfToken = '';

	      console.log(document.cookie);

	      this.app.headers = {
	        'Content-Type': 'application/json;charset=utf-8'
	      };

	      if (apiKey) {
	        this.app.headers = {
	          'X-ABL-Access-Key': apiKey,
	          'X-ABL-Date': Date.parse(new Date().toISOString()),
	          'Content-Type': 'application/json;charset=utf-8'
	        };
	      }

	      // if (xsrfCookieIndex > -1) {   var nextCharacter = xsrfCookieIndex + 12;   for
	      // (var i = xsrfCookieIndex + 11; i < document.cookie.length; i++) {     if
	      // (document.cookie.substring(i, i + 1) == ' ' || document.cookie.substring(i, i
	      // + 1) == ';')       i = document.cookie.length;     else       xsrfToken +=
	      // document         .cookie         .substring(i, i + 1);     }
	      // console.log('xsrf cookie', xsrfToken); }

	      if (_useSocket) {
	        $log.debug('endpoint', endpoint);
	        this.socket = io(endpoint, socketOpts);
	        this.app.configure(_feathersClient2.default.socketio(this.socket));
	      } else {
	        // .configure(feathers.rest(endpoint).superagent(superagent, {   headers:
	        // that.app.headers,   withCredentials: true })) Hook for adding headers to all
	        // service calls
	        var addHeadersHook = function addHeadersHook(hook) {
	          var x = document.cookie.split(';').map(function (s) {
	            return s.split('=');
	          }).reduce(function (r, a) {
	            r[a[0].trim()] = a[1];
	            return r;
	          }, {});

	          xsrfToken = x['XSRF-TOKEN'] || undefined;
	          console.log('xsrf ', xsrfToken);

	          if (xsrfToken) that.app.headers['X-XSRF-TOKEN'] = xsrfToken;

	          hook.params.headers = Object.assign({}, that.app.headers, hook.params.headers);
	          hook.params.withCredentials = true;
	        };

	        var afterRequestHook = function afterRequestHook(hook) {}
	        // console.log('afterRequestHook ', hook);


	        // Mixin automatically adds hook to all services
	        ;

	        this.app.configure(_feathersClient2.default.rest(endpoint).jquery(window.jQuery, {
	          headers: that.app.headers,
	          withCredentials: true
	        }));this.app.mixins.push(function (service) {
	          service.before(addHeadersHook);
	          service.after(afterRequestHook);
	        });
	      }

	      (0, _utils2.default)(this.app, $mdToast, $rootScope);

	      (0, _rest2.default)(this.app, $http);

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
	exports.default = angular.module('abl-sdk-feathers', ['ngMaterial', 'rx', 'currency-component'])
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
/* 78 */,
/* 79 */,
/* 80 */,
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */,
/* 112 */,
/* 113 */,
/* 114 */,
/* 115 */,
/* 116 */,
/* 117 */,
/* 118 */,
/* 119 */,
/* 120 */,
/* 121 */,
/* 122 */,
/* 123 */,
/* 124 */,
/* 125 */,
/* 126 */,
/* 127 */,
/* 128 */,
/* 129 */,
/* 130 */,
/* 131 */,
/* 132 */,
/* 133 */,
/* 134 */,
/* 135 */,
/* 136 */,
/* 137 */,
/* 138 */,
/* 139 */,
/* 140 */,
/* 141 */,
/* 142 */,
/* 143 */,
/* 144 */,
/* 145 */,
/* 146 */,
/* 147 */,
/* 148 */,
/* 149 */,
/* 150 */,
/* 151 */,
/* 152 */,
/* 153 */,
/* 154 */,
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Root reference for iframes.
	 */

	var root;
	if (typeof window !== 'undefined') { // Browser window
	  root = window;
	} else if (typeof self !== 'undefined') { // Web Worker
	  root = self;
	} else { // Other environments
	  console.warn("Using browser-only version of superagent in non-browser environment");
	  root = this;
	}

	var Emitter = __webpack_require__(156);
	var RequestBase = __webpack_require__(157);
	var isObject = __webpack_require__(158);
	var ResponseBase = __webpack_require__(159);
	var Agent = __webpack_require__(161);

	/**
	 * Noop.
	 */

	function noop(){};

	/**
	 * Expose `request`.
	 */

	var request = exports = module.exports = function(method, url) {
	  // callback
	  if ('function' == typeof url) {
	    return new exports.Request('GET', method).end(url);
	  }

	  // url first
	  if (1 == arguments.length) {
	    return new exports.Request('GET', method);
	  }

	  return new exports.Request(method, url);
	}

	exports.Request = Request;

	/**
	 * Determine XHR.
	 */

	request.getXHR = function () {
	  if (root.XMLHttpRequest
	      && (!root.location || 'file:' != root.location.protocol
	          || !root.ActiveXObject)) {
	    return new XMLHttpRequest;
	  } else {
	    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
	  }
	  throw Error("Browser-only version of superagent could not find XHR");
	};

	/**
	 * Removes leading and trailing whitespace, added to support IE.
	 *
	 * @param {String} s
	 * @return {String}
	 * @api private
	 */

	var trim = ''.trim
	  ? function(s) { return s.trim(); }
	  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };

	/**
	 * Serialize the given `obj`.
	 *
	 * @param {Object} obj
	 * @return {String}
	 * @api private
	 */

	function serialize(obj) {
	  if (!isObject(obj)) return obj;
	  var pairs = [];
	  for (var key in obj) {
	    pushEncodedKeyValuePair(pairs, key, obj[key]);
	  }
	  return pairs.join('&');
	}

	/**
	 * Helps 'serialize' with serializing arrays.
	 * Mutates the pairs array.
	 *
	 * @param {Array} pairs
	 * @param {String} key
	 * @param {Mixed} val
	 */

	function pushEncodedKeyValuePair(pairs, key, val) {
	  if (val != null) {
	    if (Array.isArray(val)) {
	      val.forEach(function(v) {
	        pushEncodedKeyValuePair(pairs, key, v);
	      });
	    } else if (isObject(val)) {
	      for(var subkey in val) {
	        pushEncodedKeyValuePair(pairs, key + '[' + subkey + ']', val[subkey]);
	      }
	    } else {
	      pairs.push(encodeURIComponent(key)
	        + '=' + encodeURIComponent(val));
	    }
	  } else if (val === null) {
	    pairs.push(encodeURIComponent(key));
	  }
	}

	/**
	 * Expose serialization method.
	 */

	request.serializeObject = serialize;

	/**
	  * Parse the given x-www-form-urlencoded `str`.
	  *
	  * @param {String} str
	  * @return {Object}
	  * @api private
	  */

	function parseString(str) {
	  var obj = {};
	  var pairs = str.split('&');
	  var pair;
	  var pos;

	  for (var i = 0, len = pairs.length; i < len; ++i) {
	    pair = pairs[i];
	    pos = pair.indexOf('=');
	    if (pos == -1) {
	      obj[decodeURIComponent(pair)] = '';
	    } else {
	      obj[decodeURIComponent(pair.slice(0, pos))] =
	        decodeURIComponent(pair.slice(pos + 1));
	    }
	  }

	  return obj;
	}

	/**
	 * Expose parser.
	 */

	request.parseString = parseString;

	/**
	 * Default MIME type map.
	 *
	 *     superagent.types.xml = 'application/xml';
	 *
	 */

	request.types = {
	  html: 'text/html',
	  json: 'application/json',
	  xml: 'text/xml',
	  urlencoded: 'application/x-www-form-urlencoded',
	  'form': 'application/x-www-form-urlencoded',
	  'form-data': 'application/x-www-form-urlencoded'
	};

	/**
	 * Default serialization map.
	 *
	 *     superagent.serialize['application/xml'] = function(obj){
	 *       return 'generated xml here';
	 *     };
	 *
	 */

	request.serialize = {
	  'application/x-www-form-urlencoded': serialize,
	  'application/json': JSON.stringify
	};

	/**
	  * Default parsers.
	  *
	  *     superagent.parse['application/xml'] = function(str){
	  *       return { object parsed from str };
	  *     };
	  *
	  */

	request.parse = {
	  'application/x-www-form-urlencoded': parseString,
	  'application/json': JSON.parse
	};

	/**
	 * Parse the given header `str` into
	 * an object containing the mapped fields.
	 *
	 * @param {String} str
	 * @return {Object}
	 * @api private
	 */

	function parseHeader(str) {
	  var lines = str.split(/\r?\n/);
	  var fields = {};
	  var index;
	  var line;
	  var field;
	  var val;

	  for (var i = 0, len = lines.length; i < len; ++i) {
	    line = lines[i];
	    index = line.indexOf(':');
	    if (index === -1) { // could be empty line, just skip it
	      continue;
	    }
	    field = line.slice(0, index).toLowerCase();
	    val = trim(line.slice(index + 1));
	    fields[field] = val;
	  }

	  return fields;
	}

	/**
	 * Check if `mime` is json or has +json structured syntax suffix.
	 *
	 * @param {String} mime
	 * @return {Boolean}
	 * @api private
	 */

	function isJSON(mime) {
	  // should match /json or +json
	  // but not /json-seq
	  return /[\/+]json($|[^-\w])/.test(mime);
	}

	/**
	 * Initialize a new `Response` with the given `xhr`.
	 *
	 *  - set flags (.ok, .error, etc)
	 *  - parse header
	 *
	 * Examples:
	 *
	 *  Aliasing `superagent` as `request` is nice:
	 *
	 *      request = superagent;
	 *
	 *  We can use the promise-like API, or pass callbacks:
	 *
	 *      request.get('/').end(function(res){});
	 *      request.get('/', function(res){});
	 *
	 *  Sending data can be chained:
	 *
	 *      request
	 *        .post('/user')
	 *        .send({ name: 'tj' })
	 *        .end(function(res){});
	 *
	 *  Or passed to `.send()`:
	 *
	 *      request
	 *        .post('/user')
	 *        .send({ name: 'tj' }, function(res){});
	 *
	 *  Or passed to `.post()`:
	 *
	 *      request
	 *        .post('/user', { name: 'tj' })
	 *        .end(function(res){});
	 *
	 * Or further reduced to a single call for simple cases:
	 *
	 *      request
	 *        .post('/user', { name: 'tj' }, function(res){});
	 *
	 * @param {XMLHTTPRequest} xhr
	 * @param {Object} options
	 * @api private
	 */

	function Response(req) {
	  this.req = req;
	  this.xhr = this.req.xhr;
	  // responseText is accessible only if responseType is '' or 'text' and on older browsers
	  this.text = ((this.req.method !='HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text')) || typeof this.xhr.responseType === 'undefined')
	     ? this.xhr.responseText
	     : null;
	  this.statusText = this.req.xhr.statusText;
	  var status = this.xhr.status;
	  // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
	  if (status === 1223) {
	    status = 204;
	  }
	  this._setStatusProperties(status);
	  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
	  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
	  // getResponseHeader still works. so we get content-type even if getting
	  // other headers fails.
	  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
	  this._setHeaderProperties(this.header);

	  if (null === this.text && req._responseType) {
	    this.body = this.xhr.response;
	  } else {
	    this.body = this.req.method != 'HEAD'
	      ? this._parseBody(this.text ? this.text : this.xhr.response)
	      : null;
	  }
	}

	ResponseBase(Response.prototype);

	/**
	 * Parse the given body `str`.
	 *
	 * Used for auto-parsing of bodies. Parsers
	 * are defined on the `superagent.parse` object.
	 *
	 * @param {String} str
	 * @return {Mixed}
	 * @api private
	 */

	Response.prototype._parseBody = function(str) {
	  var parse = request.parse[this.type];
	  if (this.req._parser) {
	    return this.req._parser(this, str);
	  }
	  if (!parse && isJSON(this.type)) {
	    parse = request.parse['application/json'];
	  }
	  return parse && str && (str.length || str instanceof Object)
	    ? parse(str)
	    : null;
	};

	/**
	 * Return an `Error` representative of this response.
	 *
	 * @return {Error}
	 * @api public
	 */

	Response.prototype.toError = function(){
	  var req = this.req;
	  var method = req.method;
	  var url = req.url;

	  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
	  var err = new Error(msg);
	  err.status = this.status;
	  err.method = method;
	  err.url = url;

	  return err;
	};

	/**
	 * Expose `Response`.
	 */

	request.Response = Response;

	/**
	 * Initialize a new `Request` with the given `method` and `url`.
	 *
	 * @param {String} method
	 * @param {String} url
	 * @api public
	 */

	function Request(method, url) {
	  var self = this;
	  this._query = this._query || [];
	  this.method = method;
	  this.url = url;
	  this.header = {}; // preserves header name case
	  this._header = {}; // coerces header names to lowercase
	  this.on('end', function(){
	    var err = null;
	    var res = null;

	    try {
	      res = new Response(self);
	    } catch(e) {
	      err = new Error('Parser is unable to parse the response');
	      err.parse = true;
	      err.original = e;
	      // issue #675: return the raw response if the response parsing fails
	      if (self.xhr) {
	        // ie9 doesn't have 'response' property
	        err.rawResponse = typeof self.xhr.responseType == 'undefined' ? self.xhr.responseText : self.xhr.response;
	        // issue #876: return the http status code if the response parsing fails
	        err.status = self.xhr.status ? self.xhr.status : null;
	        err.statusCode = err.status; // backwards-compat only
	      } else {
	        err.rawResponse = null;
	        err.status = null;
	      }

	      return self.callback(err);
	    }

	    self.emit('response', res);

	    var new_err;
	    try {
	      if (!self._isResponseOK(res)) {
	        new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
	      }
	    } catch(custom_err) {
	      new_err = custom_err; // ok() callback can throw
	    }

	    // #1000 don't catch errors from the callback to avoid double calling it
	    if (new_err) {
	      new_err.original = err;
	      new_err.response = res;
	      new_err.status = res.status;
	      self.callback(new_err, res);
	    } else {
	      self.callback(null, res);
	    }
	  });
	}

	/**
	 * Mixin `Emitter` and `RequestBase`.
	 */

	Emitter(Request.prototype);
	RequestBase(Request.prototype);

	/**
	 * Set Content-Type to `type`, mapping values from `request.types`.
	 *
	 * Examples:
	 *
	 *      superagent.types.xml = 'application/xml';
	 *
	 *      request.post('/')
	 *        .type('xml')
	 *        .send(xmlstring)
	 *        .end(callback);
	 *
	 *      request.post('/')
	 *        .type('application/xml')
	 *        .send(xmlstring)
	 *        .end(callback);
	 *
	 * @param {String} type
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.type = function(type){
	  this.set('Content-Type', request.types[type] || type);
	  return this;
	};

	/**
	 * Set Accept to `type`, mapping values from `request.types`.
	 *
	 * Examples:
	 *
	 *      superagent.types.json = 'application/json';
	 *
	 *      request.get('/agent')
	 *        .accept('json')
	 *        .end(callback);
	 *
	 *      request.get('/agent')
	 *        .accept('application/json')
	 *        .end(callback);
	 *
	 * @param {String} accept
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.accept = function(type){
	  this.set('Accept', request.types[type] || type);
	  return this;
	};

	/**
	 * Set Authorization field value with `user` and `pass`.
	 *
	 * @param {String} user
	 * @param {String} [pass] optional in case of using 'bearer' as type
	 * @param {Object} options with 'type' property 'auto', 'basic' or 'bearer' (default 'basic')
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.auth = function(user, pass, options){
	  if (1 === arguments.length) pass = '';
	  if (typeof pass === 'object' && pass !== null) { // pass is optional and can be replaced with options
	    options = pass;
	    pass = '';
	  }
	  if (!options) {
	    options = {
	      type: 'function' === typeof btoa ? 'basic' : 'auto',
	    };
	  }

	  var encoder = function(string) {
	    if ('function' === typeof btoa) {
	      return btoa(string);
	    }
	    throw new Error('Cannot use basic auth, btoa is not a function');
	  };

	  return this._auth(user, pass, options, encoder);
	};

	/**
	 * Add query-string `val`.
	 *
	 * Examples:
	 *
	 *   request.get('/shoes')
	 *     .query('size=10')
	 *     .query({ color: 'blue' })
	 *
	 * @param {Object|String} val
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.query = function(val){
	  if ('string' != typeof val) val = serialize(val);
	  if (val) this._query.push(val);
	  return this;
	};

	/**
	 * Queue the given `file` as an attachment to the specified `field`,
	 * with optional `options` (or filename).
	 *
	 * ``` js
	 * request.post('/upload')
	 *   .attach('content', new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
	 *   .end(callback);
	 * ```
	 *
	 * @param {String} field
	 * @param {Blob|File} file
	 * @param {String|Object} options
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.attach = function(field, file, options){
	  if (file) {
	    if (this._data) {
	      throw Error("superagent can't mix .send() and .attach()");
	    }

	    this._getFormData().append(field, file, options || file.name);
	  }
	  return this;
	};

	Request.prototype._getFormData = function(){
	  if (!this._formData) {
	    this._formData = new root.FormData();
	  }
	  return this._formData;
	};

	/**
	 * Invoke the callback with `err` and `res`
	 * and handle arity check.
	 *
	 * @param {Error} err
	 * @param {Response} res
	 * @api private
	 */

	Request.prototype.callback = function(err, res){
	  if (this._shouldRetry(err, res)) {
	    return this._retry();
	  }

	  var fn = this._callback;
	  this.clearTimeout();

	  if (err) {
	    if (this._maxRetries) err.retries = this._retries - 1;
	    this.emit('error', err);
	  }

	  fn(err, res);
	};

	/**
	 * Invoke callback with x-domain error.
	 *
	 * @api private
	 */

	Request.prototype.crossDomainError = function(){
	  var err = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
	  err.crossDomain = true;

	  err.status = this.status;
	  err.method = this.method;
	  err.url = this.url;

	  this.callback(err);
	};

	// This only warns, because the request is still likely to work
	Request.prototype.buffer = Request.prototype.ca = Request.prototype.agent = function(){
	  console.warn("This is not supported in browser version of superagent");
	  return this;
	};

	// This throws, because it can't send/receive data as expected
	Request.prototype.pipe = Request.prototype.write = function(){
	  throw Error("Streaming is not supported in browser version of superagent");
	};

	/**
	 * Check if `obj` is a host object,
	 * we don't want to serialize these :)
	 *
	 * @param {Object} obj
	 * @return {Boolean}
	 * @api private
	 */
	Request.prototype._isHost = function _isHost(obj) {
	  // Native objects stringify to [object File], [object Blob], [object FormData], etc.
	  return obj && 'object' === typeof obj && !Array.isArray(obj) && Object.prototype.toString.call(obj) !== '[object Object]';
	}

	/**
	 * Initiate request, invoking callback `fn(res)`
	 * with an instanceof `Response`.
	 *
	 * @param {Function} fn
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.end = function(fn){
	  if (this._endCalled) {
	    console.warn("Warning: .end() was called twice. This is not supported in superagent");
	  }
	  this._endCalled = true;

	  // store callback
	  this._callback = fn || noop;

	  // querystring
	  this._finalizeQueryString();

	  return this._end();
	};

	Request.prototype._end = function() {
	  var self = this;
	  var xhr = (this.xhr = request.getXHR());
	  var data = this._formData || this._data;

	  this._setTimeouts();

	  // state change
	  xhr.onreadystatechange = function(){
	    var readyState = xhr.readyState;
	    if (readyState >= 2 && self._responseTimeoutTimer) {
	      clearTimeout(self._responseTimeoutTimer);
	    }
	    if (4 != readyState) {
	      return;
	    }

	    // In IE9, reads to any property (e.g. status) off of an aborted XHR will
	    // result in the error "Could not complete the operation due to error c00c023f"
	    var status;
	    try { status = xhr.status } catch(e) { status = 0; }

	    if (!status) {
	      if (self.timedout || self._aborted) return;
	      return self.crossDomainError();
	    }
	    self.emit('end');
	  };

	  // progress
	  var handleProgress = function(direction, e) {
	    if (e.total > 0) {
	      e.percent = e.loaded / e.total * 100;
	    }
	    e.direction = direction;
	    self.emit('progress', e);
	  };
	  if (this.hasListeners('progress')) {
	    try {
	      xhr.onprogress = handleProgress.bind(null, 'download');
	      if (xhr.upload) {
	        xhr.upload.onprogress = handleProgress.bind(null, 'upload');
	      }
	    } catch(e) {
	      // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
	      // Reported here:
	      // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
	    }
	  }

	  // initiate request
	  try {
	    if (this.username && this.password) {
	      xhr.open(this.method, this.url, true, this.username, this.password);
	    } else {
	      xhr.open(this.method, this.url, true);
	    }
	  } catch (err) {
	    // see #1149
	    return this.callback(err);
	  }

	  // CORS
	  if (this._withCredentials) xhr.withCredentials = true;

	  // body
	  if (!this._formData && 'GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !this._isHost(data)) {
	    // serialize stuff
	    var contentType = this._header['content-type'];
	    var serialize = this._serializer || request.serialize[contentType ? contentType.split(';')[0] : ''];
	    if (!serialize && isJSON(contentType)) {
	      serialize = request.serialize['application/json'];
	    }
	    if (serialize) data = serialize(data);
	  }

	  // set header fields
	  for (var field in this.header) {
	    if (null == this.header[field]) continue;

	    if (this.header.hasOwnProperty(field))
	      xhr.setRequestHeader(field, this.header[field]);
	  }

	  if (this._responseType) {
	    xhr.responseType = this._responseType;
	  }

	  // send stuff
	  this.emit('request', this);

	  // IE11 xhr.send(undefined) sends 'undefined' string as POST payload (instead of nothing)
	  // We need null here if data is undefined
	  xhr.send(typeof data !== 'undefined' ? data : null);
	  return this;
	};

	request.agent = function() {
	  return new Agent();
	};

	["GET", "POST", "OPTIONS", "PATCH", "PUT", "DELETE"].forEach(function(method) {
	  Agent.prototype[method.toLowerCase()] = function(url, fn) {
	    var req = new request.Request(method, url);
	    this._setDefaults(req);
	    if (fn) {
	      req.end(fn);
	    }
	    return req;
	  };
	});

	Agent.prototype.del = Agent.prototype['delete'];

	/**
	 * GET `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} [data] or fn
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */

	request.get = function(url, data, fn) {
	  var req = request('GET', url);
	  if ('function' == typeof data) (fn = data), (data = null);
	  if (data) req.query(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * HEAD `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} [data] or fn
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */

	request.head = function(url, data, fn) {
	  var req = request('HEAD', url);
	  if ('function' == typeof data) (fn = data), (data = null);
	  if (data) req.query(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * OPTIONS query to `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} [data] or fn
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */

	request.options = function(url, data, fn) {
	  var req = request('OPTIONS', url);
	  if ('function' == typeof data) (fn = data), (data = null);
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * DELETE `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed} [data]
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */

	function del(url, data, fn) {
	  var req = request('DELETE', url);
	  if ('function' == typeof data) (fn = data), (data = null);
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	}

	request['del'] = del;
	request['delete'] = del;

	/**
	 * PATCH `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed} [data]
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */

	request.patch = function(url, data, fn) {
	  var req = request('PATCH', url);
	  if ('function' == typeof data) (fn = data), (data = null);
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * POST `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed} [data]
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */

	request.post = function(url, data, fn) {
	  var req = request('POST', url);
	  if ('function' == typeof data) (fn = data), (data = null);
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * PUT `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} [data] or fn
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */

	request.put = function(url, data, fn) {
	  var req = request('PUT', url);
	  if ('function' == typeof data) (fn = data), (data = null);
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};


/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

	
	/**
	 * Expose `Emitter`.
	 */

	if (true) {
	  module.exports = Emitter;
	}

	/**
	 * Initialize a new `Emitter`.
	 *
	 * @api public
	 */

	function Emitter(obj) {
	  if (obj) return mixin(obj);
	};

	/**
	 * Mixin the emitter properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */

	function mixin(obj) {
	  for (var key in Emitter.prototype) {
	    obj[key] = Emitter.prototype[key];
	  }
	  return obj;
	}

	/**
	 * Listen on the given `event` with `fn`.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.on =
	Emitter.prototype.addEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
	    .push(fn);
	  return this;
	};

	/**
	 * Adds an `event` listener that will be invoked a single
	 * time then automatically removed.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.once = function(event, fn){
	  function on() {
	    this.off(event, on);
	    fn.apply(this, arguments);
	  }

	  on.fn = fn;
	  this.on(event, on);
	  return this;
	};

	/**
	 * Remove the given callback for `event` or all
	 * registered callbacks.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.off =
	Emitter.prototype.removeListener =
	Emitter.prototype.removeAllListeners =
	Emitter.prototype.removeEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};

	  // all
	  if (0 == arguments.length) {
	    this._callbacks = {};
	    return this;
	  }

	  // specific event
	  var callbacks = this._callbacks['$' + event];
	  if (!callbacks) return this;

	  // remove all handlers
	  if (1 == arguments.length) {
	    delete this._callbacks['$' + event];
	    return this;
	  }

	  // remove specific handler
	  var cb;
	  for (var i = 0; i < callbacks.length; i++) {
	    cb = callbacks[i];
	    if (cb === fn || cb.fn === fn) {
	      callbacks.splice(i, 1);
	      break;
	    }
	  }

	  // Remove event specific arrays for event types that no
	  // one is subscribed for to avoid memory leak.
	  if (callbacks.length === 0) {
	    delete this._callbacks['$' + event];
	  }

	  return this;
	};

	/**
	 * Emit `event` with the given args.
	 *
	 * @param {String} event
	 * @param {Mixed} ...
	 * @return {Emitter}
	 */

	Emitter.prototype.emit = function(event){
	  this._callbacks = this._callbacks || {};

	  var args = new Array(arguments.length - 1)
	    , callbacks = this._callbacks['$' + event];

	  for (var i = 1; i < arguments.length; i++) {
	    args[i - 1] = arguments[i];
	  }

	  if (callbacks) {
	    callbacks = callbacks.slice(0);
	    for (var i = 0, len = callbacks.length; i < len; ++i) {
	      callbacks[i].apply(this, args);
	    }
	  }

	  return this;
	};

	/**
	 * Return array of callbacks for `event`.
	 *
	 * @param {String} event
	 * @return {Array}
	 * @api public
	 */

	Emitter.prototype.listeners = function(event){
	  this._callbacks = this._callbacks || {};
	  return this._callbacks['$' + event] || [];
	};

	/**
	 * Check if this emitter has `event` handlers.
	 *
	 * @param {String} event
	 * @return {Boolean}
	 * @api public
	 */

	Emitter.prototype.hasListeners = function(event){
	  return !! this.listeners(event).length;
	};


/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Module of mixed-in functions shared between node and client code
	 */
	var isObject = __webpack_require__(158);

	/**
	 * Expose `RequestBase`.
	 */

	module.exports = RequestBase;

	/**
	 * Initialize a new `RequestBase`.
	 *
	 * @api public
	 */

	function RequestBase(obj) {
	  if (obj) return mixin(obj);
	}

	/**
	 * Mixin the prototype properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */

	function mixin(obj) {
	  for (var key in RequestBase.prototype) {
	    obj[key] = RequestBase.prototype[key];
	  }
	  return obj;
	}

	/**
	 * Clear previous timeout.
	 *
	 * @return {Request} for chaining
	 * @api public
	 */

	RequestBase.prototype.clearTimeout = function _clearTimeout(){
	  clearTimeout(this._timer);
	  clearTimeout(this._responseTimeoutTimer);
	  delete this._timer;
	  delete this._responseTimeoutTimer;
	  return this;
	};

	/**
	 * Override default response body parser
	 *
	 * This function will be called to convert incoming data into request.body
	 *
	 * @param {Function}
	 * @api public
	 */

	RequestBase.prototype.parse = function parse(fn){
	  this._parser = fn;
	  return this;
	};

	/**
	 * Set format of binary response body.
	 * In browser valid formats are 'blob' and 'arraybuffer',
	 * which return Blob and ArrayBuffer, respectively.
	 *
	 * In Node all values result in Buffer.
	 *
	 * Examples:
	 *
	 *      req.get('/')
	 *        .responseType('blob')
	 *        .end(callback);
	 *
	 * @param {String} val
	 * @return {Request} for chaining
	 * @api public
	 */

	RequestBase.prototype.responseType = function(val){
	  this._responseType = val;
	  return this;
	};

	/**
	 * Override default request body serializer
	 *
	 * This function will be called to convert data set via .send or .attach into payload to send
	 *
	 * @param {Function}
	 * @api public
	 */

	RequestBase.prototype.serialize = function serialize(fn){
	  this._serializer = fn;
	  return this;
	};

	/**
	 * Set timeouts.
	 *
	 * - response timeout is time between sending request and receiving the first byte of the response. Includes DNS and connection time.
	 * - deadline is the time from start of the request to receiving response body in full. If the deadline is too short large files may not load at all on slow connections.
	 *
	 * Value of 0 or false means no timeout.
	 *
	 * @param {Number|Object} ms or {response, deadline}
	 * @return {Request} for chaining
	 * @api public
	 */

	RequestBase.prototype.timeout = function timeout(options){
	  if (!options || 'object' !== typeof options) {
	    this._timeout = options;
	    this._responseTimeout = 0;
	    return this;
	  }

	  for(var option in options) {
	    switch(option) {
	      case 'deadline':
	        this._timeout = options.deadline;
	        break;
	      case 'response':
	        this._responseTimeout = options.response;
	        break;
	      default:
	        console.warn("Unknown timeout option", option);
	    }
	  }
	  return this;
	};

	/**
	 * Set number of retry attempts on error.
	 *
	 * Failed requests will be retried 'count' times if timeout or err.code >= 500.
	 *
	 * @param {Number} count
	 * @param {Function} [fn]
	 * @return {Request} for chaining
	 * @api public
	 */

	RequestBase.prototype.retry = function retry(count, fn){
	  // Default to 1 if no count passed or true
	  if (arguments.length === 0 || count === true) count = 1;
	  if (count <= 0) count = 0;
	  this._maxRetries = count;
	  this._retries = 0;
	  this._retryCallback = fn;
	  return this;
	};

	var ERROR_CODES = [
	  'ECONNRESET',
	  'ETIMEDOUT',
	  'EADDRINFO',
	  'ESOCKETTIMEDOUT'
	];

	/**
	 * Determine if a request should be retried.
	 * (Borrowed from segmentio/superagent-retry)
	 *
	 * @param {Error} err
	 * @param {Response} [res]
	 * @returns {Boolean}
	 */
	RequestBase.prototype._shouldRetry = function(err, res) {
	  if (!this._maxRetries || this._retries++ >= this._maxRetries) {
	    return false;
	  }
	  if (this._retryCallback) {
	    try {
	      var override = this._retryCallback(err, res);
	      if (override === true) return true;
	      if (override === false) return false;
	      // undefined falls back to defaults
	    } catch(e) {
	      console.error(e);
	    }
	  }
	  if (res && res.status && res.status >= 500 && res.status != 501) return true;
	  if (err) {
	    if (err.code && ~ERROR_CODES.indexOf(err.code)) return true;
	    // Superagent timeout
	    if (err.timeout && err.code == 'ECONNABORTED') return true;
	    if (err.crossDomain) return true;
	  }
	  return false;
	};

	/**
	 * Retry request
	 *
	 * @return {Request} for chaining
	 * @api private
	 */

	RequestBase.prototype._retry = function() {

	  this.clearTimeout();

	  // node
	  if (this.req) {
	    this.req = null;
	    this.req = this.request();
	  }

	  this._aborted = false;
	  this.timedout = false;

	  return this._end();
	};

	/**
	 * Promise support
	 *
	 * @param {Function} resolve
	 * @param {Function} [reject]
	 * @return {Request}
	 */

	RequestBase.prototype.then = function then(resolve, reject) {
	  if (!this._fullfilledPromise) {
	    var self = this;
	    if (this._endCalled) {
	      console.warn("Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises");
	    }
	    this._fullfilledPromise = new Promise(function(innerResolve, innerReject) {
	      self.end(function(err, res) {
	        if (err) innerReject(err);
	        else innerResolve(res);
	      });
	    });
	  }
	  return this._fullfilledPromise.then(resolve, reject);
	};

	RequestBase.prototype['catch'] = function(cb) {
	  return this.then(undefined, cb);
	};

	/**
	 * Allow for extension
	 */

	RequestBase.prototype.use = function use(fn) {
	  fn(this);
	  return this;
	};

	RequestBase.prototype.ok = function(cb) {
	  if ('function' !== typeof cb) throw Error("Callback required");
	  this._okCallback = cb;
	  return this;
	};

	RequestBase.prototype._isResponseOK = function(res) {
	  if (!res) {
	    return false;
	  }

	  if (this._okCallback) {
	    return this._okCallback(res);
	  }

	  return res.status >= 200 && res.status < 300;
	};

	/**
	 * Get request header `field`.
	 * Case-insensitive.
	 *
	 * @param {String} field
	 * @return {String}
	 * @api public
	 */

	RequestBase.prototype.get = function(field){
	  return this._header[field.toLowerCase()];
	};

	/**
	 * Get case-insensitive header `field` value.
	 * This is a deprecated internal API. Use `.get(field)` instead.
	 *
	 * (getHeader is no longer used internally by the superagent code base)
	 *
	 * @param {String} field
	 * @return {String}
	 * @api private
	 * @deprecated
	 */

	RequestBase.prototype.getHeader = RequestBase.prototype.get;

	/**
	 * Set header `field` to `val`, or multiple fields with one object.
	 * Case-insensitive.
	 *
	 * Examples:
	 *
	 *      req.get('/')
	 *        .set('Accept', 'application/json')
	 *        .set('X-API-Key', 'foobar')
	 *        .end(callback);
	 *
	 *      req.get('/')
	 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
	 *        .end(callback);
	 *
	 * @param {String|Object} field
	 * @param {String} val
	 * @return {Request} for chaining
	 * @api public
	 */

	RequestBase.prototype.set = function(field, val){
	  if (isObject(field)) {
	    for (var key in field) {
	      this.set(key, field[key]);
	    }
	    return this;
	  }
	  this._header[field.toLowerCase()] = val;
	  this.header[field] = val;
	  return this;
	};

	/**
	 * Remove header `field`.
	 * Case-insensitive.
	 *
	 * Example:
	 *
	 *      req.get('/')
	 *        .unset('User-Agent')
	 *        .end(callback);
	 *
	 * @param {String} field
	 */
	RequestBase.prototype.unset = function(field){
	  delete this._header[field.toLowerCase()];
	  delete this.header[field];
	  return this;
	};

	/**
	 * Write the field `name` and `val`, or multiple fields with one object
	 * for "multipart/form-data" request bodies.
	 *
	 * ``` js
	 * request.post('/upload')
	 *   .field('foo', 'bar')
	 *   .end(callback);
	 *
	 * request.post('/upload')
	 *   .field({ foo: 'bar', baz: 'qux' })
	 *   .end(callback);
	 * ```
	 *
	 * @param {String|Object} name
	 * @param {String|Blob|File|Buffer|fs.ReadStream} val
	 * @return {Request} for chaining
	 * @api public
	 */
	RequestBase.prototype.field = function(name, val) {
	  // name should be either a string or an object.
	  if (null === name || undefined === name) {
	    throw new Error('.field(name, val) name can not be empty');
	  }

	  if (this._data) {
	    console.error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()");
	  }

	  if (isObject(name)) {
	    for (var key in name) {
	      this.field(key, name[key]);
	    }
	    return this;
	  }

	  if (Array.isArray(val)) {
	    for (var i in val) {
	      this.field(name, val[i]);
	    }
	    return this;
	  }

	  // val should be defined now
	  if (null === val || undefined === val) {
	    throw new Error('.field(name, val) val can not be empty');
	  }
	  if ('boolean' === typeof val) {
	    val = '' + val;
	  }
	  this._getFormData().append(name, val);
	  return this;
	};

	/**
	 * Abort the request, and clear potential timeout.
	 *
	 * @return {Request}
	 * @api public
	 */
	RequestBase.prototype.abort = function(){
	  if (this._aborted) {
	    return this;
	  }
	  this._aborted = true;
	  this.xhr && this.xhr.abort(); // browser
	  this.req && this.req.abort(); // node
	  this.clearTimeout();
	  this.emit('abort');
	  return this;
	};

	RequestBase.prototype._auth = function(user, pass, options, base64Encoder) {
	  switch (options.type) {
	    case 'basic':
	      this.set('Authorization', 'Basic ' + base64Encoder(user + ':' + pass));
	      break;

	    case 'auto':
	      this.username = user;
	      this.password = pass;
	      break;

	    case 'bearer': // usage would be .auth(accessToken, { type: 'bearer' })
	      this.set('Authorization', 'Bearer ' + user);
	      break;
	  }
	  return this;
	};

	/**
	 * Enable transmission of cookies with x-domain requests.
	 *
	 * Note that for this to work the origin must not be
	 * using "Access-Control-Allow-Origin" with a wildcard,
	 * and also must set "Access-Control-Allow-Credentials"
	 * to "true".
	 *
	 * @api public
	 */

	RequestBase.prototype.withCredentials = function(on) {
	  // This is browser-only functionality. Node side is no-op.
	  if (on == undefined) on = true;
	  this._withCredentials = on;
	  return this;
	};

	/**
	 * Set the max redirects to `n`. Does noting in browser XHR implementation.
	 *
	 * @param {Number} n
	 * @return {Request} for chaining
	 * @api public
	 */

	RequestBase.prototype.redirects = function(n){
	  this._maxRedirects = n;
	  return this;
	};

	/**
	 * Maximum size of buffered response body, in bytes. Counts uncompressed size.
	 * Default 200MB.
	 *
	 * @param {Number} n
	 * @return {Request} for chaining
	 */
	RequestBase.prototype.maxResponseSize = function(n){
	  if ('number' !== typeof n) {
	    throw TypeError("Invalid argument");
	  }
	  this._maxResponseSize = n;
	  return this;
	};

	/**
	 * Convert to a plain javascript object (not JSON string) of scalar properties.
	 * Note as this method is designed to return a useful non-this value,
	 * it cannot be chained.
	 *
	 * @return {Object} describing method, url, and data of this request
	 * @api public
	 */

	RequestBase.prototype.toJSON = function() {
	  return {
	    method: this.method,
	    url: this.url,
	    data: this._data,
	    headers: this._header,
	  };
	};

	/**
	 * Send `data` as the request body, defaulting the `.type()` to "json" when
	 * an object is given.
	 *
	 * Examples:
	 *
	 *       // manual json
	 *       request.post('/user')
	 *         .type('json')
	 *         .send('{"name":"tj"}')
	 *         .end(callback)
	 *
	 *       // auto json
	 *       request.post('/user')
	 *         .send({ name: 'tj' })
	 *         .end(callback)
	 *
	 *       // manual x-www-form-urlencoded
	 *       request.post('/user')
	 *         .type('form')
	 *         .send('name=tj')
	 *         .end(callback)
	 *
	 *       // auto x-www-form-urlencoded
	 *       request.post('/user')
	 *         .type('form')
	 *         .send({ name: 'tj' })
	 *         .end(callback)
	 *
	 *       // defaults to x-www-form-urlencoded
	 *      request.post('/user')
	 *        .send('name=tobi')
	 *        .send('species=ferret')
	 *        .end(callback)
	 *
	 * @param {String|Object} data
	 * @return {Request} for chaining
	 * @api public
	 */

	RequestBase.prototype.send = function(data){
	  var isObj = isObject(data);
	  var type = this._header['content-type'];

	  if (this._formData) {
	    console.error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()");
	  }

	  if (isObj && !this._data) {
	    if (Array.isArray(data)) {
	      this._data = [];
	    } else if (!this._isHost(data)) {
	      this._data = {};
	    }
	  } else if (data && this._data && this._isHost(this._data)) {
	    throw Error("Can't merge these send calls");
	  }

	  // merge
	  if (isObj && isObject(this._data)) {
	    for (var key in data) {
	      this._data[key] = data[key];
	    }
	  } else if ('string' == typeof data) {
	    // default to x-www-form-urlencoded
	    if (!type) this.type('form');
	    type = this._header['content-type'];
	    if ('application/x-www-form-urlencoded' == type) {
	      this._data = this._data
	        ? this._data + '&' + data
	        : data;
	    } else {
	      this._data = (this._data || '') + data;
	    }
	  } else {
	    this._data = data;
	  }

	  if (!isObj || this._isHost(data)) {
	    return this;
	  }

	  // default to json
	  if (!type) this.type('json');
	  return this;
	};

	/**
	 * Sort `querystring` by the sort function
	 *
	 *
	 * Examples:
	 *
	 *       // default order
	 *       request.get('/user')
	 *         .query('name=Nick')
	 *         .query('search=Manny')
	 *         .sortQuery()
	 *         .end(callback)
	 *
	 *       // customized sort function
	 *       request.get('/user')
	 *         .query('name=Nick')
	 *         .query('search=Manny')
	 *         .sortQuery(function(a, b){
	 *           return a.length - b.length;
	 *         })
	 *         .end(callback)
	 *
	 *
	 * @param {Function} sort
	 * @return {Request} for chaining
	 * @api public
	 */

	RequestBase.prototype.sortQuery = function(sort) {
	  // _sort default to true but otherwise can be a function or boolean
	  this._sort = typeof sort === 'undefined' ? true : sort;
	  return this;
	};

	/**
	 * Compose querystring to append to req.url
	 *
	 * @api private
	 */
	RequestBase.prototype._finalizeQueryString = function(){
	  var query = this._query.join('&');
	  if (query) {
	    this.url += (this.url.indexOf('?') >= 0 ? '&' : '?') + query;
	  }
	  this._query.length = 0; // Makes the call idempotent

	  if (this._sort) {
	    var index = this.url.indexOf('?');
	    if (index >= 0) {
	      var queryArr = this.url.substring(index + 1).split('&');
	      if ('function' === typeof this._sort) {
	        queryArr.sort(this._sort);
	      } else {
	        queryArr.sort();
	      }
	      this.url = this.url.substring(0, index) + '?' + queryArr.join('&');
	    }
	  }
	};

	// For backwards compat only
	RequestBase.prototype._appendQueryString = function() {console.trace("Unsupported");}

	/**
	 * Invoke callback with timeout error.
	 *
	 * @api private
	 */

	RequestBase.prototype._timeoutError = function(reason, timeout, errno){
	  if (this._aborted) {
	    return;
	  }
	  var err = new Error(reason + timeout + 'ms exceeded');
	  err.timeout = timeout;
	  err.code = 'ECONNABORTED';
	  err.errno = errno;
	  this.timedout = true;
	  this.abort();
	  this.callback(err);
	};

	RequestBase.prototype._setTimeouts = function() {
	  var self = this;

	  // deadline
	  if (this._timeout && !this._timer) {
	    this._timer = setTimeout(function(){
	      self._timeoutError('Timeout of ', self._timeout, 'ETIME');
	    }, this._timeout);
	  }
	  // response timeout
	  if (this._responseTimeout && !this._responseTimeoutTimer) {
	    this._responseTimeoutTimer = setTimeout(function(){
	      self._timeoutError('Response timeout of ', self._responseTimeout, 'ETIMEDOUT');
	    }, this._responseTimeout);
	  }
	};


/***/ }),
/* 158 */
/***/ (function(module, exports) {

	'use strict';

	/**
	 * Check if `obj` is an object.
	 *
	 * @param {Object} obj
	 * @return {Boolean}
	 * @api private
	 */

	function isObject(obj) {
	  return null !== obj && 'object' === typeof obj;
	}

	module.exports = isObject;


/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Module dependencies.
	 */

	var utils = __webpack_require__(160);

	/**
	 * Expose `ResponseBase`.
	 */

	module.exports = ResponseBase;

	/**
	 * Initialize a new `ResponseBase`.
	 *
	 * @api public
	 */

	function ResponseBase(obj) {
	  if (obj) return mixin(obj);
	}

	/**
	 * Mixin the prototype properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */

	function mixin(obj) {
	  for (var key in ResponseBase.prototype) {
	    obj[key] = ResponseBase.prototype[key];
	  }
	  return obj;
	}

	/**
	 * Get case-insensitive `field` value.
	 *
	 * @param {String} field
	 * @return {String}
	 * @api public
	 */

	ResponseBase.prototype.get = function(field) {
	  return this.header[field.toLowerCase()];
	};

	/**
	 * Set header related properties:
	 *
	 *   - `.type` the content type without params
	 *
	 * A response of "Content-Type: text/plain; charset=utf-8"
	 * will provide you with a `.type` of "text/plain".
	 *
	 * @param {Object} header
	 * @api private
	 */

	ResponseBase.prototype._setHeaderProperties = function(header){
	    // TODO: moar!
	    // TODO: make this a util

	    // content-type
	    var ct = header['content-type'] || '';
	    this.type = utils.type(ct);

	    // params
	    var params = utils.params(ct);
	    for (var key in params) this[key] = params[key];

	    this.links = {};

	    // links
	    try {
	        if (header.link) {
	            this.links = utils.parseLinks(header.link);
	        }
	    } catch (err) {
	        // ignore
	    }
	};

	/**
	 * Set flags such as `.ok` based on `status`.
	 *
	 * For example a 2xx response will give you a `.ok` of __true__
	 * whereas 5xx will be __false__ and `.error` will be __true__. The
	 * `.clientError` and `.serverError` are also available to be more
	 * specific, and `.statusType` is the class of error ranging from 1..5
	 * sometimes useful for mapping respond colors etc.
	 *
	 * "sugar" properties are also defined for common cases. Currently providing:
	 *
	 *   - .noContent
	 *   - .badRequest
	 *   - .unauthorized
	 *   - .notAcceptable
	 *   - .notFound
	 *
	 * @param {Number} status
	 * @api private
	 */

	ResponseBase.prototype._setStatusProperties = function(status){
	    var type = status / 100 | 0;

	    // status / class
	    this.status = this.statusCode = status;
	    this.statusType = type;

	    // basics
	    this.info = 1 == type;
	    this.ok = 2 == type;
	    this.redirect = 3 == type;
	    this.clientError = 4 == type;
	    this.serverError = 5 == type;
	    this.error = (4 == type || 5 == type)
	        ? this.toError()
	        : false;

	    // sugar
	    this.created = 201 == status;
	    this.accepted = 202 == status;
	    this.noContent = 204 == status;
	    this.badRequest = 400 == status;
	    this.unauthorized = 401 == status;
	    this.notAcceptable = 406 == status;
	    this.forbidden = 403 == status;
	    this.notFound = 404 == status;
	    this.unprocessableEntity = 422 == status;
	};


/***/ }),
/* 160 */
/***/ (function(module, exports) {

	'use strict';

	/**
	 * Return the mime type for the given `str`.
	 *
	 * @param {String} str
	 * @return {String}
	 * @api private
	 */

	exports.type = function(str){
	  return str.split(/ *; */).shift();
	};

	/**
	 * Return header field parameters.
	 *
	 * @param {String} str
	 * @return {Object}
	 * @api private
	 */

	exports.params = function(str){
	  return str.split(/ *; */).reduce(function(obj, str){
	    var parts = str.split(/ *= */);
	    var key = parts.shift();
	    var val = parts.shift();

	    if (key && val) obj[key] = val;
	    return obj;
	  }, {});
	};

	/**
	 * Parse Link header fields.
	 *
	 * @param {String} str
	 * @return {Object}
	 * @api private
	 */

	exports.parseLinks = function(str){
	  return str.split(/ *, */).reduce(function(obj, str){
	    var parts = str.split(/ *; */);
	    var url = parts[0].slice(1, -1);
	    var rel = parts[1].split(/ *= */)[1].slice(1, -1);
	    obj[rel] = url;
	    return obj;
	  }, {});
	};

	/**
	 * Strip content related fields from `header`.
	 *
	 * @param {Object} header
	 * @return {Object} header
	 * @api private
	 */

	exports.cleanHeader = function(header, changesOrigin){
	  delete header['content-type'];
	  delete header['content-length'];
	  delete header['transfer-encoding'];
	  delete header['host'];
	  // secuirty
	  if (changesOrigin) {
	    delete header['authorization'];
	    delete header['cookie'];
	  }
	  return header;
	};


/***/ }),
/* 161 */
/***/ (function(module, exports) {

	function Agent() {
	  this._defaults = [];
	}

	["use", "on", "once", "set", "query", "type", "accept", "auth", "withCredentials", "sortQuery", "retry", "ok", "redirects",
	 "timeout", "buffer", "serialize", "parse", "ca", "key", "pfx", "cert"].forEach(function(fn) {
	  /** Default setting for all requests from this agent */
	  Agent.prototype[fn] = function(/*varargs*/) {
	    this._defaults.push({fn:fn, arguments:arguments});
	    return this;
	  }
	});

	Agent.prototype._setDefaults = function(req) {
	    this._defaults.forEach(function(def) {
	      req[def.fn].apply(req, def.arguments);
	    });
	};

	module.exports = Agent;


/***/ }),
/* 162 */,
/* 163 */,
/* 164 */
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
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(166);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(168)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(166, function() {
				var newContent = __webpack_require__(166);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(167)(false);
	// imports


	// module
	exports.push([module.id, "md-list {\n    display: block;\n    padding: 0px 0px 0px 0px;\n}\n\n.list-item-48 {\n    height: 36px;\n    min-height: 36px;\n    font-size: 14px;\n    font-weight: 300;\n}\n\n.red {\n    color: rgb(221, 44, 0);\n}\n\n.paymentResponseContainer {\n    display: block;\n    height: auto;\n    background-color: #fff;\n    overflow-y: auto;\n}\n\n.activityPaymentSummaryCard {\n    margin-bottom: 8px;\n    margin-top: 8px;\n    margin-right: 0;\n    margin-left: 0;\n    background: none;\n    box-shadow: none;\n    position: relative;\n}\n\n.activityPaymentSummaryCardMobile {}\n\n.paymentSummaryCard {\n    min-width: 100%;\n    margin-bottom: 0px !important;\n    margin-top: 0px !important;\n    margin-right: 16px;\n    background: none;\n    box-shadow: none;\n    height: 100%;\n    padding: 20px;\n}\n\n.paymentSummaryCardNewContent{\n    background-color: #fff;\n}\n\n.paymentSummaryCardResponse{\n    padding: 8px;\n}\n\n.rightCheckoutPanel{\n    background-color: #fff !important;\n}\n\n.paymentSummaryCardLarge {\n    /*min-width: 370px;*/\n    width: 100%;\n    margin-bottom: 0;\n    margin-top: 0;\n    padding-right: 0;\n    padding-left: 0;\n}\n\n.paymentHeader p {\n    color: rgba(0, 0, 0, .8) !important;\n    font-weight: 500;\n    letter-spacing: 0.012em;\n    margin: 0 0 0 0;\n    line-height: 1.6em;\n}\n\n.paymentTitle {\n    font-size: 20px !important;\n}\n\n.paymentSubTitle {\n    font-size: 14px !important;\n    font-weight: 400;\n}\n\n.lineItemIcon {\n    width: 32px;\n    height: 32px;\n    margin: 4px 4px 4px -6px;\n    background: url('https://s3.amazonaws.com/assets.ablsolution.com/icons/stopwatch-2.svg') no-repeat;\n    background-position: center;\n    background-size: 28px 28px;\n}\n\n.headerIcon {\n    vertical-align: middle;\n    height: 36px;\n    width: 40px;\n    padding-right: 16px;\n}\n\n.headerIconRight {\n    padding-left: 16px;\n}\n\n.headerIcon svg {\n    position: absolute;\n    top: 24px;\n    bottom: 24px;\n    height: 24px;\n    width: 24px;\n}\n\n.lineItemText {\n    font-size: 14px;\n    font-weight: 500;\n    letter-spacing: 0.010em;\n    margin: 0 0 0 0;\n    line-height: 1.6em;\n    overflow: hidden;\n    white-space: nowrap;\n    text-overflow: ellipsis;\n    color: rgba(0, 0, 0, 0.54) !important;\n}\n\n.lineItemDetail {\n    background: rgba(255, 255, 255, .1);\n}\n\n.lineItemDetail p {\n    font-size: 12px;\n    color: rgba(0, 0, 0, .77);\n    font-weight: 400;\n}\n\n.lineItemHeader p {\n    font-size: 16px;\n    font-weight: 400;\n    letter-spacing: 0.010em;\n    margin: 0 0 0 0;\n    line-height: 50px;\n    overflow: hidden;\n    white-space: nowrap;\n    text-overflow: ellipsis;\n    color: rgba(0, 0, 0, 0.82) !important;\n}\n\n.lineItemSubHeader {\n    font-size: 16px;\n    font-weight: 400;\n    margin: 0 0 0 0;\n    line-height: 1.6em;\n    overflow: hidden;\n    white-space: nowrap;\n    text-overflow: ellipsis;\n    color: rgba(0, 0, 0, 0.82) !important;\n}\n\n.lineItemSubDetail {\n    font-size: 12px;\n    font-weight: 500;\n    margin: 0 0 0 0;\n    line-height: 1.6em;\n    overflow: hidden;\n    white-space: nowrap;\n    text-overflow: ellipsis;\n    color: rgba(0, 0, 0, .6);\n}\n\n.lineItemHeader {\n    background: rgba(0, 0, 0, 0);\n    color: rgba(0, 0, 0, .7) !important;\n}\n\n.addOnAdjusters {\n    width: 36px;\n    margin-right: 0;\n}\n\n.addOnQuantityText {\n    border: none;\n    width: 40px;\n    font-weight: 500;\n    text-align: center;\n    font-size: 16px;\n    outline: none;\n}\n\n.guestIcon {\n    width: 32px;\n    height: 32px;\n    margin: 4px 4px 4px -6px;\n    background: url('https://s3.amazonaws.com/assets.ablsolution.com/icons/user-3.svg') no-repeat;\n    background-position: center;\n    background-size: 28px 28px;\n}\n\n.lineItemIconRight {\n    width: 40px;\n    height: 40px;\n    margin: 4px -6px 4px 4px;\n    background: url('https://s3.amazonaws.com/assets.ablsolution.com/icons/calendar.svg') no-repeat;\n    background-position: center;\n    background-size: 28px 28px;\n}\n\n.locationHeader {\n    font-size: 14px !important;\n    letter-spacing: 0.010em;\n    line-height: 20px;\n    color: rgba(0, 0, 0, 0.66) !important;\n}\n\n.total {\n    font-size: 16px;\n    letter-spacing: 0.01em;\n    color: rgba(0, 0, 0, 0.8);\n}\n\n.activityTotal {\n    font-size: 16px;\n    letter-spacing: 0.01em;\n    color: rgba(0, 0, 0, 0.8);\n}\n\n.agentCommission {\n    font-size: 16px;\n    letter-spacing: 0.01em;\n    color: rgba(0, 0, 0, 0.8);\n}\n\n.spacer {\n    margin: 4px;\n    width: 8px;\n}\n\n.darkerDivider {\n    border-top-color: rgba(0, 0, 0, 0.12);\n}\n\n.totalDivider {\n    display: block;\n    border-top-width: 1px;\n}\n\n.lineItemDetailDivider {\n    border-top-color: rgba(0, 0, 0, 0.0);\n}\n\n.paymentSummaryImage {\n    height: 120px;\n    margin: 24px 12px 0 12px;\n    background-position: center center;\n    background-repeat: no-repeat;\n    border-radius: 2px;\n}\n\n.paymentSummaryImageBig {\n    height: 244px;\n    margin: 24px 12px 0 12px;\n    background-position: center center;\n    background-repeat: no-repeat;\n    border-radius: 2px;\n    /*box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .6);*/\n}\n\n.mobileList {\n    height: 100%;\n}\n\n.mobileBottomBar {\n    position: fixed;\n    bottom: 0;\n    left: 0;\n    right: 0;\n}\n\n.cardForm {\n    margin: 16px 16px 16px 16px;\n}\n\n.addonForm {\n    padding-left: 16px;\n    padding-right: 16px;\n}\n\n.activityCardForm {\n    margin: 0 16px 0 16px;\n}\n\n.paymentHeader._md-button-wrap>div.md-button:first-child {\n    font-size: 22px;\n    /*box-shadow: 0 1px rgba(0, 0, 0, .12);*/\n}\n\n.listIcon {\n    padding: 0 0px 0 0;\n}\n\n.listIconSub {\n    height: 20px;\n    width: 20px;\n    color: rgba(0, 0, 0, .5);\n    fill: rgba(0, 0, 0, .5);\n    outline: none;\n}\n\n.listIconSub svg {\n    height: 20px;\n    width: 20px;\n}\n\n.listIconSub:hover {\n    height: 20px;\n    width: 20px;\n    color: rgba(0, 0, 0, .86);\n    fill: rgba(0, 0, 0, .86);\n    outline: none;\n}\n\n.formButton {\n    margin-right: 0;\n}\n\n.stepStatusRow ng-md-icon svg {\n    height: 16px;\n    margin-top: 1px;\n    vertical-align: top;\n}\n\n\n/*md-list-item:disabled .md-list-item-text,\nmd-list-item[disabled=disabled] .md-list-item-text{\ncolor: #ccc;\n}*/\n\nmd-list-item.addOnListItem {\n    margin-right: -24px;\n    padding-left: 0;\n}\n\nmd-list-item.listItemNotButton {\n    padding: 0 8px !important;\n}\n\n.totalListItem {\n    margin-bottom: 12px;\n}\n\n.listMessage {\n    font-size: 16px;\n    line-height: 1.6em;\n    padding: 0 4px;\n}\n\n.slideDown.ng-hide {\n    height: 0;\n    transition: height 0.35s ease;\n    overflow: hidden;\n    position: relative;\n}\n\n.slideDown {\n    transition: height 0.35s ease;\n    overflow: hidden;\n    position: relative;\n}\n\n.slideDown.ng-hide-remove,\n.slideDown.ng-hide-add {\n    /* remember, the .hg-hide class is added to element\nwhen the active class is added causing it to appear\nas hidden. Therefore set the styling to display=block\nso that the hide animation is visible */\n    display: block!important;\n}\n\n.slideDown.ng-hide-add {\n    animation-name: hide;\n    -webkit-animation-name: hide;\n    animation-duration: .5s;\n    -webkit-animation-duration: .5s;\n    animation-timing-function: ease-in;\n    -webkit-animation-timing-function: ease-in;\n}\n\n.slideDown.ng-hide-remove {\n    animation-name: show;\n    -webkit-animation-name: show;\n    animation-duration: .5s;\n    -webkit-animation-duration: .5s;\n    animation-timing-function: ease-out;\n    -webkit-animation-timing-function: ease-out;\n}\n\n.couponInput {\n    width: 100%;\n    border: none;\n    /* background-color: rgba(0, 0, 0, .08); */\n    /* border-radius: 3px; */\n    padding: 12px;\n    /* width: 100%; */\n    box-shadow: none;\n    margin-left: -12px;\n    line-height: 36px;\n    outline: none;\n}\n\n.remove-coupon {\n    cursor: pointer;\n}\n\n.toUppercase {\n    text-transform: uppercase;\n}\n\n.listItemCircularProgress {\n    /*margin-right: -6px;*/\n}\n\nmd-list-item:hover {\n    background: transparent;\n}\n\nmd-list-item.md-button.md-default-theme:not([disabled]):hover,\n.md-button:not([disabled]):hover {\n    background-color: transparent;\n}\n\n.easeIn.ng-hide-add,\n.easeIn.ng-hide-remove {\n    -webkit-transition: 0.5s ease-in-out opacity;\n    -moz-transition: 0.5s ease-in-out opacity;\n    -ms-transition: 0.5s ease-in-out opacity;\n    -o-transition: 0.5s ease-in-out opacity;\n    transition: 0.5s ease-in-out opacity;\n    opacity: 1;\n}\n\n.easeIn.ng-hide {\n    -webkit-transition: 0s ease-in-out opacity;\n    -moz-transition: 0s ease-in-out opacity;\n    -ms-transition: 0s ease-in-out opacity;\n    -o-transition: 0s ease-in-out opacity;\n    transition: 0s ease-in-out opacity;\n    opacity: 0;\n}\n\n.couponText {\n    margin-left: 16px;\n}\n\n.agentInput {\n    width: 100%;\n    border: none;\n    /* background-color: rgba(0, 0, 0, .08); */\n    /* border-radius: 3px; */\n    padding: 12px;\n    /* width: 100%; */\n    box-shadow: none;\n    margin-left: -12px;\n    line-height: 36px;\n    outline: none;\n    margin-top: 1px;\n}\n\n.remove-agent-code {\n    cursor: pointer;\n}\n\n.md-button[disabled] {\n    pointer-events: none;\n}\n\n.subtotalLineItem {\n    padding: 8px 32px 8px 16px;\n}\n\n.subtotalLineItemSmall {\n    font-size: 12px;\n}\n\n.bottomTotal {\n    font-size: 16px;\n    margin-top: 8px;\n    margin-bottom: 16px;\n    font-weight: 600;\n}\n\n.payzenIframe {\n    border: none;\n    outline: none;\n    width: 100%;\n}\n\n.small-label {\n    font-size: 12px;\n    padding-left: 4px;\n}\n\n.confirmation {\n    padding: 20px 0;\n    text-align: center;\n}\n\n.confirmation h3 {\n    text-align: center;\n    margin-bottom: 20px;\n}\n\n.confirmation .margin-top {\n    margin-top: 8px;\n}\n\n.confirmation .booking-id {\n    padding: 15px;\n    margin: 8px auto;\n    width: 260px;\n    opacity: 0.8;\n    font-weight: bold;\n    color: #fff;\n}\n\nbody[md-theme=blue] .confirmation .booking-id {\n    background: #2196F3;\n}\n\nbody[md-theme=teal] .confirmation .booking-id {\n    background: #009688;\n}\n\nbody[md-theme=green] .confirmation .booking-id {\n    background: #4CAF50;\n}\n\nbody[md-theme=grey] .confirmation .booking-id {\n    background: #9E9E9E;\n}\n\nbody[md-theme=blue_grey] .confirmation .booking-id {\n    background: #607D8B;\n}\n\nbody[md-theme=yellow] .confirmation .booking-id {\n    background: #FFEB3B;\n    color: #000;\n}\n\nbody[md-theme=indigo] .confirmation .booking-id {\n    background: #3F51B5;\n}\n\nbody[md-theme=red] .confirmation .booking-id {\n    background: #F44336;\n}\n\nbody[md-theme=black] .confirmation .booking-id {\n    background: #000000;\n}\n\nbody[md-theme=pink] .confirmation .booking-id {\n    background: #e07bb5;\n}\n\nbody[md-theme=white] .confirmation .booking-id {\n    background: #eeeeee;\n    color: #000;\n}\n\nbody[md-theme=dark_blue] .confirmation .booking-id {\n    background: #1E88E5;\n}\n\nbody[md-theme=purple] .confirmation .booking-id {\n    background: #9C27B0;\n}\n\nbody[md-theme=orange] .confirmation .booking-id {\n    background: #FF6D00;\n}\n\n@media(max-width: 600px) {\n    .confirmation {\n        padding: 20px;\n        font-size: 13px;\n    }\n    .paymentSummaryCard{\n        margin: 0px;\n    }\n}\n\n@media(min-width: 743px) and (max-width: 1024px) {\n    .paymentSummaryCard{\n        margin-left: 0px;\n    }\n}\n\n.no-margin {\n    margin: 0 !important;\n}\n\n.picker-container {\n    border-radius: 2px;\n    background: white;\n}\n\n.bigDateToolbar {\n    background: white !important;\n    color: black !important;\n}\n\n.activity-dialog-container {\n    display: -ms-flexbox;\n    display: flex;\n    -ms-flex-pack: center;\n    justify-content: center;\n    -ms-flex-align: center;\n    align-items: center;\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    z-index: 80;\n    overflow: hidden;\n}\n\n.activity-dialog,\nmd-dialog.activity-dialog {\n    max-height: 80%;\n    max-width: 90%;\n    position: relative;\n    overflow: auto;\n    box-shadow: 0px 7px 8px -4px rgba(0, 0, 0, 0.2), 0px 13px 19px 2px rgba(0, 0, 0, 0.14), 0px 5px 24px 4px rgba(0, 0, 0, 0.12);\n    display: -ms-flexbox;\n    display: flex;\n    overflow-x: hidden;\n    overflow-y: hidden;\n    -ms-flex-direction: column;\n    flex-direction: column;\n}\n\n.activity-dialog,\nmd-dialog md-dialog-content {\n    padding: 0;\n    overflow: hidden;\n}\n\n.no-margin {\n    margin: 0 !important;\n}\n\n.leftCard {\n    background: rgba(0, 0, 0, .025);\n}\n\n.activityBookDialogLarge {\n    width: 100%;\n    min-height: 500px;\n    height: 100%;\n    background-color: #fff;\n}\n\n.leftCardLarge {\n    border-right: 1px solid #e4e4e4 !important;\n    box-shadow: 1px 0 5px 1px rgba(0, 0, 0, 0.12) !important;\n    min-height: 100%;\n    min-width: 420px;\n    width: 50%;\n    position: absolute;\n    height: 100%;\n    overflow-y: scroll;\n}\n\n.leftCardSmall {\n    border-bottom: 1px solid #e4e4e4 !important;\n    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.08) !important;\n}\n\n.rightCardLarge {\n    position: absolute;\n    right: 0;\n    min-width: 420px;\n    width: 50%;\n    display: block;\n    height: 100%;\n}\n\n.activity-total-include {\n    height: 100%;\n}\n\n.couponText {\n    font-size: 16px;\n}\n\n.couponTextTotal {\n    font-size: 16px;\n    padding-right: 12px;\n}\n\n.listItemAutocomplete {\n    padding-left: 0 !important;\n}\n\n.addOnQuantityText {\n    border: none;\n    width: 40px;\n    font-weight: 500;\n    text-align: center;\n    font-size: 16px;\n    margin-right: -8px;\n    outline: none;\n    background: transparent;\n}\n\n.activityPaymentSummaryCard {\n    margin-bottom: 0 !important;\n    margin-top: 0 !important;\n    margin-right: 0;\n    margin-left: 0;\n    background: none;\n    box-shadow: none;\n    position: relative;\n    height: 100%;\n}\n\n.activityCardForm {\n    margin: 0 16px 0 16px;\n}\n\n.detailsForm {\n    padding-left: 16px;\n    padding-right: 16px;\n}\n\n.listItemInputContainer {\n    margin: 10px 0px !important;\n    position: relative;\n    padding: 2px;\n    vertical-align: middle;\n    display: inline-block !important;\n    margin-top: -10px !important;\n    width: 100% !important;\n}\n\n.listItemInputContainerNoMargin{\n    margin-top: 0px !important;\n    margin-bottom: 0px !important;\n}\n\n.formContainer{\n    padding: 16px !important;\n    padding-top: 42px !important;\n}\n\n.formContainerQuestions{\n    padding: 16px 16px 0 16px;\n}\n\n.formContainerQuestions md-input-container{\n    margin-bottom: 0;\n    margin-top: 0px;\n}\n\nmd-input-container{\n    margin: 18px 0;\n}\n\nmd-input-container .md-input-messages-animation{\n    text-align: right;\n}", ""]);

	// exports


/***/ }),
/* 167 */
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
/* 168 */
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
		fixUrls = __webpack_require__(169);

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
/* 169 */
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
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(171);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(168)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(171, function() {
				var newContent = __webpack_require__(171);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(167)(false);
	// imports


	// module
	exports.push([module.id, ".no-margin-top {\n    margin-top: 0 !important;\n}\n\n.no-margin-bottom {\n    margin-bottom: 0 !important;\n}\n\n.no-margin-right {\n    margin-right: 0 !important;\n}\n\n.no-margin-left {\n    margin-left: 0 !important;\n}\n\n.margin-right-30 {\n    margin-right: 30px;\n}\n\n.no-padding {\n    padding: 0 !important;\n}\n\n.green {\n    color: green;\n}", ""]);

	// exports


/***/ }),
/* 172 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(173);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(168)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(173, function() {
				var newContent = __webpack_require__(173);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(167)(false);
	// imports


	// module
	exports.push([module.id, "/*!\n * Angular Material Design\n * https://github.com/angular/material\n * @license MIT\n * v0.9.7\n */\n\n\n/* mixin definition ; sets LTR and RTL within the same style call */\n\nmd-autocomplete button ng-md-icon {\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    -webkit-transform: translate3d(-50%, -50%, 0) scale(0.9);\n    transform: translate3d(-50%, -50%, 0) scale(0.9);\n}\n\nmd-autocomplete button ng-md-icon path {\n    stroke-width: 0;\n}\n\n.md-button.ng-md-icon {\n    padding: 0;\n    background: none;\n}\n\n.md-button.md-fab ng-md-icon {\n    margin-top: 0;\n}\n\nmd-checkbox .ng-md-icon {\n    transition: 240ms;\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 18px;\n    height: 18px;\n    border: 2px solid;\n    border-radius: 2px;\n}\n\nmd-checkbox.md-checked .ng-md-icon {\n    border: none;\n}\n\nmd-checkbox.md-checked .ng-md-icon:after {\n    -webkit-transform: rotate(45deg);\n    transform: rotate(45deg);\n    position: absolute;\n    left: 6px;\n    top: 2px;\n    display: table;\n    width: 6px;\n    height: 12px;\n    border: 2px solid;\n    border-top: 0;\n    border-left: 0;\n    content: '';\n}\n\n.md-chips .md-chip .md-chip-remove ng-md-icon {\n    height: 18px;\n    width: 18px;\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    -webkit-transform: translate3d(-50%, -50%, 0);\n    transform: translate3d(-50%, -50%, 0);\n}\n\nng-md-icon {\n    background-repeat: no-repeat no-repeat;\n    display: inline-block;\n    vertical-align: middle;\n    fill: currentColor;\n    height: 24px;\n    width: 24px;\n}\n\nng-md-icon svg {\n    pointer-events: none;\n    display: block;\n}\n\nng-md-icon[md-font-icon] {\n    line-height: 1;\n    width: auto;\n}\n\nmd-input-container>ng-md-icon {\n    position: absolute;\n    top: 5px;\n    left: 2px;\n}\n\nmd-input-container>ng-md-icon+input {\n    margin-left: 36px;\n}\n\nmd-input-container.md-icon-float>ng-md-icon {\n    top: 26px;\n    left: 2px;\n}\n\nmd-input-container.md-icon-float>ng-md-icon+input {\n    margin-left: 36px;\n}\n\n@media screen and (-ms-high-contrast: active) {\n    md-input-container.md-default-theme>ng-md-icon {\n        fill: #fff;\n    }\n}\n\nmd-list-item>div.md-primary>ng-md-icon,\nmd-list-item>div.md-secondary>ng-md-icon,\nmd-list-item>ng-md-icon:first-child,\nmd-list-item>ng-md-icon.md-secondary,\nmd-list-item .md-list-item-inner>div.md-primary>ng-md-icon,\nmd-list-item .md-list-item-inner>div.md-secondary>ng-md-icon,\nmd-list-item .md-list-item-inner>ng-md-icon:first-child,\nmd-list-item .md-list-item-inner>ng-md-icon.md-secondary {\n    width: 24px;\n    margin-top: 16px;\n    margin-bottom: 12px;\n    box-sizing: content-box;\n}\n\nmd-list-item>ng-md-icon:first-child,\nmd-list-item .md-list-item-inner>ng-md-icon:first-child {\n    margin-right: 32px;\n}\n\nmd-list-item.md-2-line>ng-md-icon:first-child,\nmd-list-item.md-2-line>.md-no-style>ng-md-icon:first-child {\n    -webkit-align-self: flex-start;\n    -ms-flex-item-align: start;\n    align-self: flex-start;\n}\n\nmd-list-item.md-3-line>ng-md-icon:first-child,\nmd-list-item.md-3-line>.md-no-style>ng-md-icon:first-child {\n    margin-top: 16px;\n}\n\nmd-tabs-wrapper md-prev-button ng-md-icon,\nmd-tabs-wrapper md-next-button ng-md-icon {\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    -webkit-transform: translate3d(-50%, -50%, 0);\n    transform: translate3d(-50%, -50%, 0);\n}\n\nmd-tabs-wrapper md-next-button ng-md-icon {\n    -webkit-transform: translate3d(-50%, -50%, 0) rotate(180deg);\n    transform: translate3d(-50%, -50%, 0) rotate(180deg);\n}", ""]);

	// exports


/***/ }),
/* 174 */
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
/* 175 */
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
/* 176 */
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
/* 177 */
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
/* 178 */
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
/* 179 */
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
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _column = __webpack_require__(181);

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
/* 181 */
/***/ (function(module, exports) {

	module.exports = "<div layout=\"row\" layout-align=\"{{vm.position}}\" ng-transclude flex></div>";

/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _progressButton = __webpack_require__(183);

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
	        label: '@',
	        onClick: '&'
	    },
	    controller: function controller($element, $scope, $log) {
	        var _this = this;

	        this.$onInit = function () {
	            $log.debug('progressButton', this);
	            if (this.loading) $log.debug('progressButton:loading', this.loading);

	            $log.debug('progressButton disabled', this.ngDisabled);
	        };

	        this.$onChanges = function (changesObj) {
	            $log.debug('progressButton changes ', changesObj);
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
/* 183 */
/***/ (function(module, exports) {

	module.exports = "<md-button layout=\"row\" layout-align=\"center center\" class=\"{{vm.class}}\" ng-disabled=\"vm.loading || vm.disabled\" ng-click=\"vm.onClick()\">\n    <div layout=\"row\" layout-align=\"center center\">\n        <svg ng-show=\"vm.loading && vm.spinner == 1\" version=\"1.1\" id=\"loader-1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n            x=\"0px\" y=\"0px\" width=\"24px\" height=\"24px\" viewBox=\"0 0 50 50\" style=\"enable-background:new 0 0 50 50;\" xml:space=\"preserve\">\n            <path fill=\"{{vm.fill || '#fff'}}\" stroke=\"{{vm.stroke || ''}}\" d=\"M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z\">\n                <animateTransform attributeType=\"xml\" attributeName=\"transform\" type=\"rotate\" from=\"0 25 25\" to=\"360 25 25\" dur=\"0.6s\" repeatCount=\"indefinite\"\n                />\n            </path>\n        </svg>\n\n        <svg ng-show=\"vm.loading && vm.spinner == 2\" version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n            x=\"0px\" y=\"0px\" width=\"24px\" height=\"30px\" viewBox=\"0 0 24 30\" style=\"enable-background:new 0 0 50 50;\" xml:space=\"preserve\">\n            <rect x=\"0\" y=\"0\" width=\"4\" height=\"10\" fill=\"{{vm.fill || '#fff'}}\" stroke=\"{{vm.stroke || ''}}\">\n                <animateTransform attributeType=\"xml\" attributeName=\"transform\" type=\"translate\" values=\"0 0; 0 20; 0 0\" begin=\"0\" dur=\"0.6s\"\n                    repeatCount=\"indefinite\" />\n            </rect>\n            <rect x=\"10\" y=\"0\" width=\"4\" height=\"10\" fill=\"{{vm.fill || '#fff'}}\" stroke=\"{{vm.stroke || ''}}\">\n                <animateTransform attributeType=\"xml\" attributeName=\"transform\" type=\"translate\" values=\"0 0; 0 20; 0 0\" begin=\"0.2s\" dur=\"0.6s\"\n                    repeatCount=\"indefinite\" />\n            </rect>\n            <rect x=\"20\" y=\"0\" width=\"4\" height=\"10\" fill=\"{{vm.fill || '#fff'}}\" stroke=\"{{vm.stroke || ''}}\">\n                <animateTransform attributeType=\"xml\" attributeName=\"transform\" type=\"translate\" values=\"0 0; 0 20; 0 0\" begin=\"0.4s\" dur=\"0.6s\"\n                    repeatCount=\"indefinite\" />\n            </rect>\n        </svg>\n\n        <svg ng-show=\"vm.loading && vm.spinner == 3\" version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n            x=\"0px\" y=\"0px\" width=\"24px\" height=\"30px\" viewBox=\"0 0 24 30\" style=\"enable-background:new 0 0 50 50;\" xml:space=\"preserve\">\n            <rect x=\"0\" y=\"10\" width=\"4\" height=\"10\" fill=\"{{vm.fill || '#fff'}}\" stroke=\"{{vm.stroke || ''}}\" opacity=\"0.2\">\n                <animate attributeName=\"opacity\" attributeType=\"XML\" values=\"0.2; 1; .2\" begin=\"0s\" dur=\"0.6s\" repeatCount=\"indefinite\" />\n                <animate attributeName=\"height\" attributeType=\"XML\" values=\"10; 20; 10\" begin=\"0s\" dur=\"0.6s\" repeatCount=\"indefinite\" />\n                <animate attributeName=\"y\" attributeType=\"XML\" values=\"10; 5; 10\" begin=\"0s\" dur=\"0.6s\" repeatCount=\"indefinite\" />\n            </rect>\n            <rect x=\"8\" y=\"10\" width=\"4\" height=\"10\" fill=\"{{vm.fill || '#fff'}}\" stroke=\"{{vm.stroke || ''}}\" opacity=\"0.2\">\n                <animate attributeName=\"opacity\" attributeType=\"XML\" values=\"0.2; 1; .2\" begin=\"0.15s\" dur=\"0.6s\" repeatCount=\"indefinite\"\n                />\n                <animate attributeName=\"height\" attributeType=\"XML\" values=\"10; 20; 10\" begin=\"0.15s\" dur=\"0.6s\" repeatCount=\"indefinite\"\n                />\n                <animate attributeName=\"y\" attributeType=\"XML\" values=\"10; 5; 10\" begin=\"0.15s\" dur=\"0.6s\" repeatCount=\"indefinite\" />\n            </rect>\n            <rect x=\"16\" y=\"10\" width=\"4\" height=\"10\" fill=\"{{vm.fill || '#fff'}}\" stroke=\"{{vm.stroke || ''}}\" opacity=\"0.2\">\n                <animate attributeName=\"opacity\" attributeType=\"XML\" values=\"0.2; 1; .2\" begin=\"0.3s\" dur=\"0.6s\" repeatCount=\"indefinite\"\n                />\n                <animate attributeName=\"height\" attributeType=\"XML\" values=\"10; 20; 10\" begin=\"0.3s\" dur=\"0.6s\" repeatCount=\"indefinite\"\n                />\n                <animate attributeName=\"y\" attributeType=\"XML\" values=\"10; 5; 10\" begin=\"0.3s\" dur=\"0.6s\" repeatCount=\"indefinite\" />\n            </rect>\n        </svg>\n\n\n    </div>\n    <span ng-show=\"!vm.loading\">{{vm.label}}</span>\n</md-button>";

/***/ }),
/* 184 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(185);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(168)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(185, function() {
				var newContent = __webpack_require__(185);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(167)(false);
	// imports


	// module
	exports.push([module.id, "progress-button {\n    outline: none;\n    margin: 0px 0px !important;\n    pointer-events: auto;\n}\n\nprogress-button md-button {\n    pointer-events: auto;\n}", ""]);

	// exports


/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _listItem = __webpack_require__(187);

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
/* 187 */
/***/ (function(module, exports) {

	module.exports = "<div layout=\"row\" class=\"listItem\" ng-class=\"[vm.size]\" flex=\"100\" ng-transclude>\n</div>";

/***/ }),
/* 188 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _listItemNumericControl = __webpack_require__(189);

	var _listItemNumericControl2 = _interopRequireDefault(_listItemNumericControl);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// import controller from './goatListItem.controller'; import
	// './goatListItem.scss';
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
	            if (!this.value) this.value = 0;
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
/* 189 */
/***/ (function(module, exports) {

	module.exports = "<div layout=\"row\" class=\"listItem\" ng-class=\"[vm.size]\" flex=\"100\">\n    <div layout=\"row\" layout-align=\"start center\" flex>\n        <div layout=\"column\" class=\"\">\n            <span class=\"lineItemSubHeader\">{{vm.label}}</span>\n            <div layout=\"row\">\n                <span class=\"lineItemSubDetail\">{{vm.price | ablCurrency: $root.currency}}</span>\n            </div>\n        </div>\n    </div>\n\n    <div layout=\"row\" layout-align=\"end center\">\n        <div layout=\"column\" class=\"addOnAdjusters\" layout-align=\"center end\" flex layout-grow>\n            <ng-md-icon icon=\"add_circle_outline\" class=\"listIconSub\" md-colors=\"{'fill': 'primary-A200'}\" ng-click=\"vm.increment();\">\n            </ng-md-icon>\n            <ng-md-icon icon=\" remove_circle_outline\" class=\"listIconSub\" ng-click=\"vm.decrement();\"></ng-md-icon>\n        </div>\n        <div layout=\"column\" layout-align=\"end end\">\n            <input class='addOnQuantityText' ng-model=\"vm.value\" ng-change=\"vm.checkAdjustValue();\" type=\"number\" md-select-on-focus></input>\n        </div>\n    </div>\n</div>";

/***/ }),
/* 190 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _listItemAddCharge = __webpack_require__(191);

	var _listItemAddCharge2 = _interopRequireDefault(_listItemAddCharge);

	__webpack_require__(192);

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
/* 191 */
/***/ (function(module, exports) {

	module.exports = "<md-list-item class=\"addOnListItem\">\n    <div layout=\"row\" layout-align=\"start center\" flex>\n        <md-input-container class=\"buttonInlineInput full-width \">\n            <label>Name</label>\n\n            <input class='buttonInlineInput' ng-model=\"vm.label\"></input>\n        </md-input-container>\n\n    </div>\n\n    <div layout=\"row\" layout-align=\"end center\" flex=\"20\">\n        <md-input-container class=\"buttonInlineInput full-width\">\n            <label>Price</label>\n\n            <input class='full-width buttonInlineInput' md-select-on-focus ng-model=\"vm.price\" type=\"number\" min=\"0\" step=\"0.01\"></input>\n        </md-input-container>\n    </div>\n    <div layout=\"row\">\n        <md-button ng-disabled=\"!vm.label || !vm.price\" ng-class=\"[vm.buttonClass.length > 0 ? vm.buttonClass : 'md-raised']\" ng-click=\"vm.add(vm.label, vm.price)\">\n            Add\n        </md-button>\n    </div>\n\n</md-list-item>";

/***/ }),
/* 192 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(193);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(168)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(193, function() {
				var newContent = __webpack_require__(193);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 193 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(167)(false);
	// imports


	// module
	exports.push([module.id, "    .full-width {\n        width: 100%;\n    }\n\n    .text-align-left {\n        text-align: left !important;\n    }\n\n    col-section {\n        width: 100%;\n    }\n\n    md-checkbox.listItemCheckbox .md-label {\n        margin-top: 26px;\n        margin-left: 38px;\n    }\n\n    list-item,\n    list-item-header,\n    list-item-numeric-control {\n        display: block;\n        width: 100%;\n    }\n\n    .listItem {\n        height: 72px;\n        padding: 0 16px;\n        outline: none;\n        border: none;\n        box-shadow: 0 1px 0 0 rgba(0, 0, 0, .05)\n    }\n    \n    .listItemHeader .listItem{\n        height: 40px;\n    }\n\n    .listItem md-checkbox .md-container {\n        height: 4px;\n    }\n\n    .listItem.md {\n        min-height: 56px;\n        height: 56px;\n        line-height: 56px;\n        padding: 0 16px;\n        outline: none;\n        border: none;\n        box-shadow: 0 1px 0 0 rgba(0, 0, 0, .05);\n    }\n\n    .lg.slideDown.ng-hide {\n        height: 0 !important;\n        transition: height 0.35s ease;\n        overflow: hidden;\n        position: relative;\n    }\n\n    .lg.slideDown {\n        height: 72px;\n        line-height: 72px;\n        transition: height 0.35s ease;\n        overflow: hidden;\n        position: relative;\n    }\n\n    .lg.slideDown.ng-hide-remove,\n    .lg.slideDown.ng-hide-add {\n        /* remember, the .hg-hide class is added to element\n    when the active class is added causing it to appear\n    as hidden. Therefore set the styling to display=block\n    so that the hide animation is visible */\n        display: block!important;\n    }\n\n    .lg.slideDown.ng-hide-add {\n        animation-name: hide;\n        -webkit-animation-name: hide;\n        animation-duration: .5s;\n        -webkit-animation-duration: .5s;\n        animation-timing-function: ease-in;\n        -webkit-animation-timing-function: ease-in;\n    }\n\n    .lg.slideDown.ng-hide-remove {\n        animation-name: show;\n        -webkit-animation-name: show;\n        animation-duration: .5s;\n        -webkit-animation-duration: .5s;\n        animation-timing-function: ease-out;\n        -webkit-animation-timing-function: ease-out;\n    }\n\n    .listItem.sm {\n        min-height: 36px;\n        height: 36px;\n        line-height: 36px;\n        min-height: 36px;\n        padding: 0 16px;\n        font-size: 12px;\n        outline: none;\n        border: none;\n        box-shadow: 0 1px 0 0 rgba(0, 0, 0, .05);\n    }\n\n    .listItem md-autocomplete input:not(.md-input) {\n        height: 100% !important;\n        line-height: 100% !important;\n        padding: 0;\n    }\n\n    .listItem md-autocomplete md-autocomplete-wrap {\n        box-shadow: none !important;\n        height: 100% !important;\n    }\n\n    .listItem md-autocomplete {\n        padding: 0 !important;\n    }\n\n    .listItemAutoCompleteAfterContainer {\n        margin-top: -20px !important;\n    }\n\n    .listItemFocus {\n        box-shadow: 0 1px 0 rgba(255, 152, 0, 0.4), 0 -1px 0 rgba(255, 152, 0, 0.4), inset 0px 1px 4px rgba(255, 152, 0, 0.2), inset 0px -1px 4px rgba(255, 152, 0, 0.2) !important;\n        background: white;\n    }\n\n    input.buttonInlineInput {\n        /* margin: 0px -16px;*/\n        padding: 0 0 0 0;\n        border-width: 0;\n        -ms-flex-preferred-size: 36px;\n        font-size: inherit;\n        width: 100%;\n        border: none;\n        outline: none;\n        box-sizing: border-box;\n        float: left;\n        background: transparent;\n    }\n\n    .inputStatusIcon {\n        height: 24px;\n        width: 36px;\n        margin-right: 4px !important;\n    }\n\n    .buttonInlineInput:focus {\n        /* box-shadow: inset 0px 1px 3px rgba(33, 33, 33, 0.3), inset 0px -1px 3px rgba(33, 33, 33, 0.3); */\n    }\n\n    .listItemGreyFocus {\n        box-shadow: 0 1px 0 rgba(0, 0, 0, 0.28), 0 -1px 0 rgba(0, 0, 0, 0.28), inset 0px 1px 4px rgba(0, 0, 0, 0.16), inset 1px -1px 4px rgba(0, 0, 0, 0.2) !important;\n    }\n\n    .listItemGreyFocus input,\n    textarea {\n        color: rgb(63, 81, 181);\n    }\n\n    .listItemGreyFocus ng-md-icon.listItemHeaderIcon {\n        fill: rgb(63, 81, 181);\n    }\n\n    .listItemFocusBottomBorder {\n        box-shadow: 0px 2px 0 rgba(58, 171, 56, 0.92), inset 0 -1px 3px rgba(57, 73, 171, .2), inset 0 1px rgba(0, 0, 0, .1) !important;\n    }\n\n    .listItemFocusBottomBorder input,\n    textarea {\n        color: rgb(0, 0, 0);\n    }\n\n    md-input-container.buttonInlineInput {\n        display: inline-block;\n        position: relative;\n        height: 36px;\n        padding: 5px;\n        margin: 0;\n        vertical-align: middle;\n    }\n\n    .listItemPadding {\n        padding: 0 16px;\n    }\n\n    .listItem.listItemHeader {\n        font-size: 16px;\n        margin: auto;\n        font-weight: 500;\n        cursor: unset;\n        line-height: 72px;\n        font-weight: 500;\n        cursor: unset;\n        color: white;\n    }\n\n    .listItem.listItemHeader.light {\n        color: black;\n        background: #fff;\n    }\n\n    .listItem.listItemHeader.dark {\n        color: white;\n        background: #424242;\n    }\n\n    .listItemHeaderBottomBorder {\n      box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.16), 0px 0px 1px rgba(0, 0, 0, .3);\n    }\n    .listItem .strong {\n        font-weight: 600;\n    }\n\n    .listItem.sm.listItemHeader {\n        font-size: 12px;\n        margin: 0;\n        font-weight: 500;\n        cursor: unset;\n        line-height: 36px;\n    }\n\n    .listItem.md.listItemHeader {\n        font-size: 16px;\n        margin: 0;\n        font-weight: 500;\n        cursor: unset;\n        line-height: 54px;\n    }\n\n    .leftIcon {\n        margin-right: 16px;\n    }\n    \n    ng-md-icon.listItemHeaderIcon{\n        height: 20px;\n        width: 20px;\n    }\n\n    ng-md-icon.listItemHeaderIcon.lg,\n    ng-md-icon.listItemHeaderIcon.lg svg {\n        margin: auto 0 auto 0;\n    }\n\n    ng-md-icon.listItemHeaderIcon.md,\n    ng-md-icon.listItemHeaderIcon.md svg {\n        margin: auto 0 auto 0;\n    }\n\n    ng-md-icon.listItemHeaderIcon.sm,\n    ng-md-icon.listItemHeaderIcon.sm svg {\n        margin: auto 8px auto 0;\n        height: 16px;\n        width: 16px;\n    }\n\n    .lineItemSubHeader {\n        font-size: 14px;\n        font-weight: 400;\n        padding: 0 16px 0 0;\n        line-height: 1.6em;\n        overflow: hidden;\n        white-space: nowrap;\n        text-overflow: ellipsis;\n        color: rgba(0, 0, 0, 0.92) !important;\n    }\n\n    .autocomplete-custom-template li {\n        border-bottom: 1px solid #ccc;\n        height: auto;\n        padding-top: 8px;\n        padding-bottom: 8px;\n        white-space: normal;\n    }\n\n    .autocomplete-custom-template li:last-child {\n        border-bottom-width: 0;\n    }\n\n    .autocomplete-custom-template .item-title {\n        font-weight: 600;\n    }\n\n    .autocomplete-custom-template .item-title,\n    .autocomplete-custom-template .item-metadata {\n        display: block;\n        line-height: 2;\n    }\n\n    .autocomplete-custom-template .item-title md-icon {\n        height: 18px;\n        width: 18px;\n    }\n", ""]);

	// exports


/***/ }),
/* 194 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _listItemHeader = __webpack_require__(195);

	var _listItemHeader2 = _interopRequireDefault(_listItemHeader);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// import controller from './goatListItem.controller';

	var listItemHeader = {
	    bindings: {
	        action: '@',
	        actionClick: '=',
	        expanded: '=',
	        title: '@',
	        icon: '@',
	        size: '@'
	    },
	    template: _listItemHeader2.default,
	    controller: function controller() {

	        this.$onInit = function () {
	            if (!this.expanded) this.expanded = false;
	        };

	        this.$onChanges = function (changesObj) {};
	        this.$postLink = function () {};

	        this.click = function () {
	            console.log('click function');
	            if (this.action == 'expandable') {
	                this.expanded = !this.expanded;
	            }
	        };
	    },
	    controllerAs: 'vm'
	};

	exports.default = listItemHeader;

/***/ }),
/* 195 */
/***/ (function(module, exports) {

	module.exports = "<div class=\"listItem listItemHeader\" ng-class=\"[vm.size]\" ng-disabled=\"!vm.action\" ng-click=\"vm.click()\">\n    <div layout=\"row\" flex>\n        <div layout=\"row\" layout-align=\"start center\" flex=\"80\">\n            <ng-md-icon ng-if=\"vm.icon\" icon=\"{{vm.icon}}\" class=\"headerIcon listIcon\"></ng-md-icon>\n            <div class=\"listItemHeaderText\">{{vm.title}}</div>\n        </div>\n\n        <div layout=\"row\" layout-align=\"end center\" flex=\"20\">\n            <div layout=\"column\" layout-align=\"center end\" ng-if=\"vm.action == 'expandable'\" flex>\n                <ng-md-icon icon=\"{{vm.expanded ? 'expand_less' : 'expand_more'}}\" options='{\"duration\": 500, \"rotation\": \"clock\", \"easing\":\"linear\"}'\n                    class=\"listItemHeaderIcon\"></ng-md-icon>\n            </div>\n        </div>\n    </div>\n</div>\n";

/***/ }),
/* 196 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	__webpack_require__(197);

	var _activityTotal = __webpack_require__(199);

	var _activityTotal2 = _interopRequireDefault(_activityTotal);

	var _activityForms = __webpack_require__(200);

	var _activityForms2 = _interopRequireDefault(_activityForms);

	var _activityBook = __webpack_require__(201);

	var _activityBook2 = _interopRequireDefault(_activityBook);

	var _dashboard = __webpack_require__(202);

	var _dashboard2 = _interopRequireDefault(_dashboard);

	var _noDashboard = __webpack_require__(203);

	var _noDashboard2 = _interopRequireDefault(_noDashboard);

	var _activityBookValidators = __webpack_require__(204);

	var _activityBookValidators2 = _interopRequireDefault(_activityBookValidators);

	var _activityAdjustmentControlsComponent = __webpack_require__(205);

	var _activityAdjustmentControlsComponent2 = _interopRequireDefault(_activityAdjustmentControlsComponent);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @namespace activity-book
	 */
	exports.default = angular.module('activity-book', ['ngMaterial', 'rx']).run(["$templateCache", function ($templateCache) {
	    $templateCache.put('activity-forms.html', _activityForms2.default);
	    $templateCache.put('activity-book.html', _activityBook2.default);
	    $templateCache.put('activity-total.html', _activityTotal2.default);
	    $templateCache.put('dashboard.html', _dashboard2.default);
	    $templateCache.put('no-dashboard.html', _noDashboard2.default);
	}]).factory('httpInterceptor', ['$q', '$rootScope', function ($q, $rootScope) {
	    var loadingCount = 0;
	    return {
	        request: function request(config) {
	            if (++loadingCount === 1) $rootScope.$broadcast('loading:progress', { request: config });
	            return config || $q.when(config);
	        },
	        response: function response(_response) {
	            if (--loadingCount === 0) $rootScope.$broadcast('loading:finish', { response: _response });
	            return _response || $q.when(_response);
	        },
	        responseError: function responseError(response) {
	            if (--loadingCount === 0) $rootScope.$broadcast('loading:finish', { response: response });
	            return $q.reject(response);
	        }
	    };
	}]).config(['$httpProvider', function ($httpProvider) {
	    $httpProvider.interceptors.push('httpInterceptor');
	}]).controller('activityAdjustmentController', _activityAdjustmentControlsComponent2.default).directive('ablActivityBook', ['$rootScope', '$sce', '$compile', '$mdMedia', '$mdDialog', '$mdToast', '$log', '$window', '$timeout', '$http', 'rx', 'observeOnScope', '$stateParams', '$state', '$filter', 'Analytics', '$location', function ($rootScope, $sce, $compile, $mdMedia, $mdDialog, $mdToast, $log, $window, $timeout, $http, rx, observeOnScope, $stateParams, $state, $filter, Analytics, $location) {
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
	            vm.theme = $rootScope.theme;
	            this.formWasBlocked = false;
	            this.guestDetailsExpanded = true;
	            this.attendeesExpanded = false;
	            this.addonsExpanded = false;
	            this.questionsExpanded = false;
	            this.stripePaymentExpanded = false;
	            this.stripeCardIsValid = false;
	            this.paymentExpanded = false;
	            this.showPaymentForm = false;
	            this.answerAllQuestionsChecked = false;
	            this.paymentFormIsLoading = false;
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

	            this.agentCodeStatus = 'untouched';
	            this.appliedAgentCode = {};
	            this.agentCodeQuery = '';

	            this.giftcardCodeStatus = 'untouched';
	            this.appliedGiftCardCode = {};
	            this.giftcardCodeQuery = '';

	            this.attendeeSubtotals = [];
	            this.addonSubtotals = [];

	            vm.taxes = [];
	            vm.taxTotal = 0;
	            vm.addons = [];
	            vm.questions = [];
	            vm.goToPay = goToPay;
	            vm.submitNonCreditCardBooking = submitNonCreditCardBooking;
	            vm.isFinishButtonValid = false;

	            $scope.sendConfirmationEmail = true;

	            // Environment is configured differently across apps so get config from the
	            // $rootScope for now
	            var config = $rootScope.config;
	            var headers = {};

	            //Activity dash needs no headers
	            if (!config.DASHBOARD) {
	                if (config.MARKETPLACE) {
	                    //this is for apps that set the ACCESS_KEY as .env var instead of url param
	                    headers = {
	                        'x-abl-access-key': config.ABL_ACCESS_KEY,
	                        'x-abl-date': Date.parse(new Date().toISOString()),
	                        "Content-Type": "application/json;charset=utf-8"
	                    };
	                } else {
	                    headers = {
	                        'x-abl-access-key': $stateParams.merchant || 'tLVVsHUlBAweKP2ZOofhRBCFFP54hX9CfmQ9EsDlyLfN6DYHY5k8VzpuiUxjNO5L', //$stateParams.merchant || config.ABL_ACCESS_KEY,
	                        'x-abl-date': Date.parse(new Date().toISOString()),
	                        "Content-Type": "application/json;charset=utf-8"
	                    };
	                }
	                //Require booking questions on consumer facing apps
	                vm.validStepsForPayment['bookingQuestions'] = false;
	            } else {
	                $scope.dashboard = true;
	            }

	            $log.debug('abl-activity-book $scope', $scope);

	            vm.currency = $rootScope.currency;
	            vm.eventDate = $rootScope.eventDate;
	            vm.activityImage = $rootScope.activityImage || null;
	            vm.activityLocation = $rootScope.activityLocation || null;
	            vm.eventTime = $rootScope.eventTime;

	            $scope.$watch(function () {
	                return $rootScope.currency;
	            }, function (n, o) {
	                if (n) {
	                    $log.debug('$scope.$watch:$rootScope.currency', n);
	                    vm.currency = n.toLowerCase();
	                }
	            });

	            $scope.$on('currency-updated', function (event, args) {
	                $log.debug('ablActivityBook:currency-updated', args);
	                vm.getPricingQuote(args.currency);
	            });

	            if (Raven) {
	                Raven.captureMessage('Add Booking', {
	                    level: 'info', // one of 'info', 'warning', or 'error'
	                    tags: {
	                        step: 'opened'
	                    }
	                });
	            }
	            $scope.formatDate = function (date, format) {
	                return window.moment(date).format(format);
	            };
	            $scope.paymentResponse = '';
	            $scope.paymentSuccessful = false;

	            this.goToNextStep = function (currentStepName, form) {
	                switch (currentStepName) {
	                    case 'guestDetailsStep':
	                        //goes to attendees
	                        $scope.trackEvent('Checkout: Guest Details', 'Guest Details Entered', 'Next button clicked on guest details in checkout form');
	                        vm.toggleGuestDetails();
	                        vm.toggleAttendees();
	                        break;
	                    case 'attendeesStep':
	                        //goes to addons || booking || pay
	                        //$log.debug('goToNextStep:attendeesStep', vm.attendeesAdded);
	                        $scope.trackEvent('Checkout: Attendees', 'Attendees Selected', 'Next button clicked after selecting attendees');
	                        if (vm.countAttendeesAdded() > 0) {
	                            //validate attendees
	                            //$log.debug('attendeesStep', vm.addons.length, vm.questions);
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
	                                    $log.debug('no questions, goToPay');
	                                    vm.goToNextStep('paymentStep');
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
	                                    $scope.trackEvent('Checkout: Booking Questions', 'Booking Questions Answered', 'Next button clicked after responding to booking questions');
	                                } else {
	                                    //got to pay if qustions doesn't exist
	                                    vm.addonsExpanded = false;
	                                    vm.stripePaymentExpanded = true;
	                                    $scope.trackEvent('Checkout: Addons', 'Addons Selected', 'Next button clicked after selecting addons');
	                                    if (!$scope.dashboard) {
	                                        $log.debug('no questions, goToPay');
	                                        vm.goToNextStep('paymentStep');
	                                    }
	                                }
	                            }
	                        }
	                        break;
	                    case 'paymentStep':
	                        //goes to addons || booking || pay
	                        $log.debug('goToNextStep:paymentStep', vm.isPaymentValid());
	                        if (vm.isPaymentValid() && !vm.pricingQuoteStarted) {
	                            //if guests and attendees are valid
	                            $scope.trackEvent('Checkout: Payment Form', 'Go to Payment', 'Credit card form loaded');
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
	                //$log.debug('toggle payment');
	                this.paymentExpanded = !this.paymentExpanded;
	            };

	            this.returnToMainPage = function () {

	                if ($rootScope.config.DASHBOARD) {
	                    $mdDialog.hide();
	                    $state.reload();
	                } else {
	                    $mdDialog.hide();
	                    $state.go('home', { merchant: $stateParams.merchant });
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
	            vm.addBookingController = $scope.addBookingController;
	            $log.debug('addBookingController:initialize', $scope.addBookingController);

	            $scope.addBookingController.timeslot.charges.forEach(function (item) {
	                //reset quantity to 0 for all charges for every new booking dialog open
	                item.quantity = 0;
	            });

	            this.toggleQuestions = function () {
	                //$log.debug('toggle questions');
	                this.questionsExpanded = this.formWasBlocked ? false : !this.questionsExpanded;
	            };

	            var timerAdjustingAddons = 0;
	            this.adjustAddon = function (i, mode) {
	                if (vm.pricingQuoteRequestState === 'progress') {
	                    return;
	                }
	                vm.pricingQuoteStarted = true;
	                $timeout.cancel(timerAdjustingAddons);
	                if (mode == 'up') vm.addons[i].quantity++;
	                if (mode == 'down' && vm.addons[i].quantity > 0) vm.addons[i].quantity--;

	                timerAdjustingAddons = $timeout(function () {
	                    vm.getPricingQuote();
	                }, 400);
	            };
	            //$log.debug('adjustAddon:addons', vm.addons);

	            this.toggleAddons = function () {
	                //$log.debug('toggle addons');
	                if (vm.addons.length < 1) this.questionsExpanded = this.formWasBlocked ? false : !this.questionsExpanded;else this.addonsExpanded = this.formWasBlocked ? false : !this.addonsExpanded;
	            };

	            this.toggleStripePay = function () {
	                this.paymentExpanded = !this.paymentExpanded;
	            };

	            this.togglePay = function () {
	                this.payButtonEnabled = !this.payButtonEnabled;
	            };

	            var timerAdjustingAttendee = 0;
	            this.adjustAttendee = function (i, mode) {
	                if (vm.pricingQuoteRequestState === 'progress') {
	                    return;
	                }
	                vm.pricingQuoteStarted = true;
	                $timeout.cancel(timerAdjustingAttendee);
	                //Allow dashboard users to overbook
	                if (mode == 'up' && (vm.countAttendees() > 0 || $scope.dashboard)) vm.attendees[i].quantity++;
	                if (mode == 'down' && vm.attendees[i].quantity > 0) vm.attendees[i].quantity--;

	                timerAdjustingAttendee = $timeout(function () {
	                    vm.getPricingQuote();
	                    vm.countAttendees();
	                }, 400);
	            };

	            vm.pricingQuoteRequestState = null;
	            $rootScope.$on('loading:progress', function (event, args) {
	                if (args.request.url.indexOf('pricing-quotes') !== -1) {
	                    vm.pricingQuoteRequestState = 'progress';
	                }
	            });

	            $rootScope.$on('loading:finish', function (event, args) {
	                if (args.response.config.url.indexOf('pricing-quotes') !== -1) {
	                    vm.pricingQuoteRequestState = 'finished';
	                }
	            });

	            this.toggleAttendees = function () {
	                //$log.debug('toggle attendees');
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
	                $log.debug('attendees added', vm.countAttendees(), vm.attendees[$index].quantity);
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
	                //$log.debug('pricing quote POST data', data);
	                data.currency = vm.currency.toUpperCase();
	                $log.debug('vm.appliedGiftCardCode', vm.appliedGiftCardCode);
	                if (vm.appliedGiftCardCode) {
	                    $log.debug('vm.appliedGiftCardCode', vm.appliedGiftCardCode);
	                }
	                return data;
	            }

	            vm.pricingQuoteStarted = false;
	            // Query for pricing data based on the data object used to make a booking
	            // request
	            vm.getPricingQuote = function (currency) {
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

	                    vm.pricing.agentCommission = vm.pricing.items.filter(function (item) {
	                        return item.type == 'agent_commission';
	                    }).reduce(function (result, agentCommission) {
	                        return result + (agentCommission.price.amount || agentCommission.price.price) * agentCommission.quantity;
	                    }, 0);

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
	                        if (angular.isDefined(att.amount) && att.amount > -1) {
	                            return result + att.amount * att.quantity;
	                        } else {
	                            return result + att.price * att.quantity;
	                        }
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
	                            amount: aap.aaps[0].amount * aap.aaps[0].quantity,
	                            quantity: aap.aaps[0].quantity
	                        };
	                        if (angular.isDefined(aap.aaps[0].amount)) {
	                            obj.price = aap.aaps[0].amount;
	                        } else {
	                            obj.price = aap.aaps[0].price;
	                        }
	                        vm.attendeeSubtotals.push(obj);
	                    });

	                    vm.taxTotal = response.data.items.filter(function (item) {
	                        return item.type == "tax" || item.type == "fee" || item.type == 'service';
	                    }).reduce(function (result, tax) {
	                        $log.debug('reduce.vm.taxTotal', tax);
	                        if (angular.isDefined(tax.price.amount)) {
	                            return result + tax.price.amount * tax.quantity;
	                        } else {
	                            return result + tax.price.price * tax.quantity;
	                        }
	                    }, 0);
	                    vm.taxTotal = vm.taxTotal + vm.pricing.agentCommission;

	                    $log.debug('getPricingQuotes', response);
	                    $log.debug('vm.attendeeSubtotal', vm.attendeeSubtotals);
	                    $log.debug('vm.taxTotal', vm.taxTotal, vm.taxTotal + vm.pricing.agentCommission);

	                    // Reset the payment method to prevent some valid cases affecting the payment method wrongly
	                    // e.g., agent code addition before adding attendees will amount to 0 changing the method to 'gift' but it needs to be reset when the attendees are added.
	                    if (!vm.showPaymentForm) {
	                        vm.paymentMethod = 'credit';
	                    }

	                    if (vm.pricing.total == 0 && vm.paymentMethod == 'credit') {
	                        vm.paymentMethod = 'cash';
	                    }
	                    if (vm.attendeeTotal === 0 || vm.pricing.total.amount === 0) {
	                        vm.paymentMethod = 'gift';
	                    }
	                    if (vm.pricing.total > 0 || vm.pricing.total.amount > 0) {
	                        vm.paymentMethod = 'credit';
	                    }

	                    if (currency) {
	                        vm.currency = currency;
	                    }
	                    vm.pricingQuoteStarted = false;
	                    $scope.safeApply();
	                    $log.debug('finalPricingQuote', vm.pricingQuoteStarted, vm.pricing, vm.paymentMethod, vm.attendeeTotal);
	                }, function errorCallback(response) {
	                    vm.pricing = {};
	                    vm.taxTotal = 0;
	                    vm.pricingQuoteStarted = false;
	                    $mdToast.show($mdToast.simple().textContent(response.data.errors[0]).position('left bottom').hideDelay(3000));
	                    $scope.safeApply();
	                    //$log.debug('getPricingQuotes error!', response, vm.pricing);
	                });
	            };

	            //Query for possible coupons partially matching the vm.couponQuery search string
	            vm.getPossibleCoupons = function () {
	                vm.pricingQuoteStarted = true;
	                $http({
	                    method: 'GET',
	                    url: config.FEATHERS_URL + '/coupons?bookingId=' + vm.couponQuery,
	                    headers: headers
	                }).then(function successCallback(response) {
	                    vm.possibleCoupons = response.data;
	                    $log.debug('getPossibleCoupons success', response);
	                    vm.pricingQuoteStarted = false;
	                }, function errorCallback(response) {
	                    vm.possibleCoupons = [];
	                    vm.pricingQuoteStarted = false;
	                    // vm.taxTotal = 0; $log.debug('getPossibleCoupons error!', response);
	                });
	            };

	            vm.clients = [];
	            observeOnScope($scope, 'vm.formData.fullName').map(function (data) {
	                return data;
	            }).subscribe(function (change) {
	                $log.debug('clientSearchText ', change.newValue);
	                if ($scope.dashboard) {
	                    vm.clients = $http({
	                        method: 'GET',
	                        url: config.FEATHERS_URL + '/clients?fullName=' + change.newValue,
	                        headers: headers
	                    }).then(function successCallback(response) {
	                        $log.debug('clientSearch success', response);
	                        return response.data.list;
	                    }, function errorCallback(response) {
	                        $log.debug('clientSearch error!', response);
	                        return [];
	                    });
	                }
	            });

	            vm.selectedClientChange = function (client) {
	                if (client) {
	                    vm.formData.fullName = client.primaryContact.fullName || '';
	                    vm.formData.mail = client.primaryContact.email || '';
	                    vm.formData.phoneNumber = client.primaryContact.phoneNumber || '';
	                    $log.debug('selectedClientChange', client);
	                }
	            };

	            $scope.autocomplete = {};
	            vm.couponStatus = 'untouched';

	            $scope.autocomplete.searchTextChange = function searchTextChange(text) {
	                if (!text) if (data['couponId']) delete data['couponId'];
	            };

	            $scope.autocomplete.selectedItemChange = function selectedItemChange(item) {
	                $log.debug('applied coupon', item);

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

	            var queryDebounce = false;
	            vm.coupons = [];
	            $scope.autocomplete.querySearch = function querySearch(text) {
	                if ($scope.dashboard) {
	                    text = text.toUpperCase();
	                    if (!queryDebounce && text.length !== 1) {
	                        queryDebounce = true;
	                        return $timeout(function () {
	                            return $http({
	                                method: 'GET',
	                                url: config.FEATHERS_URL + '/coupons?couponId=' + text,
	                                headers: headers
	                            }).then(function successCallback(response) {
	                                queryDebounce = false;
	                                vm.coupons = response.data.list.filter(function (item) {
	                                    $log.debug('vm.coupons', item, $scope.addBookingController, $scope.addBookingController.activity);
	                                    return item.activities.length === 0 || item.activities.length > 0 && item.activities[0] === $scope.addBookingController.activity._id;
	                                });
	                                return vm.coupons;
	                                $log.debug('getPossibleCoupons success', response.data.list);
	                            }, function errorCallback(response) {
	                                queryDebounce = false;
	                                return [];
	                                $log.debug('getPossibleCoupons error!', response);
	                            });
	                        }, 100);
	                    } else {
	                        return this;
	                    }
	                }
	            };

	            // Check whether the vm.couponQuery search string exists as a coupon, if
	            // successful, add the coupon id to the make booking request object as the
	            // 'coupon' property
	            vm.checkCoupon = function () {
	                vm.checkingCoupon = true;
	                //$log.debug('check coupon', vm.couponQuery);
	                $http({
	                    method: 'GET',
	                    url: config.FEATHERS_URL + '/coupons/' + vm.couponQuery,
	                    headers: headers
	                }).then(function successCallback(response) {
	                    $log.debug('checkCoupon success', response);
	                    data['couponId'] = response.data['couponId'];
	                    vm.appliedCoupon = response.data;
	                    $log.debug('applied coupon', vm.appliedCoupon);
	                    vm.validateCoupon(vm.appliedCoupon);
	                    vm.couponStatus = 'valid';
	                    vm.getPricingQuote();
	                    vm.checkingCoupon = false;
	                }, function errorCallback(response) {
	                    delete data['couponId'];
	                    vm.couponStatus = 'invalid';
	                    vm.appliedCoupon = {};
	                    vm.checkingCoupon = false;

	                    //$log.debug('checkCoupon error!', response);
	                });
	            };

	            vm.removeCoupon = function () {
	                vm.couponQuery = '';
	                delete data['couponId'];
	                $scope.autocomplete.selectedItem = undefined;
	                vm.couponStatus = 'untouched';
	                vm.appliedCoupon = {};
	                vm.getPricingQuote();
	                $scope.safeApply();
	            };

	            vm.pricingInformation = function (total) {
	                $log.debug('pricingInformation', total);
	            };

	            var moment = window.moment;

	            vm.validateCoupon = function (coupon) {
	                var today = moment();
	                // $log.debug('coupon expires after today',
	                // moment(coupon.endTime).isAfter(moment())); Coupon is not expired and is
	                // infinitely redeemable
	                if (moment(coupon.endTime).isAfter(moment()) && coupon.maxRedemptions == 0) return true;

	                // Coupon is not expired and has been redeemed less than the maximum allowable
	                // redemptions
	                if (coupon.maxRedemptions > 0 && moment(coupon.endTime).isAfter(moment()) && coupon.maxRedemptions - coupon.redemptions >= 0) return true;

	                //Coupon is expired or has been redeemed too many times
	                vm.couponStatus = 'invalid';
	                return false;
	            };

	            vm.appliedCouponType = function (coupon) {
	                if (coupon) {
	                    if (coupon.percentage) {
	                        return coupon.amount + '%';
	                    } else {
	                        return $filter('ablCurrency')(coupon.amount, $rootScope.currency);
	                    }
	                }
	            };

	            vm.bookingQuestionsCompleted = function () {
	                var completed = 0;
	                if (vm.bookingQuestions) {
	                    angular.forEach(vm.bookingQuestions, function (e, i) {
	                        if (e) {
	                            if (e.length > 0) completed++;
	                        }
	                    });
	                } else {
	                    completed = 0;
	                }
	                //$log.debug('vm.bookingQuestions', vm.bookingQuestions, completed);
	                return completed;
	            };
	            // Observe and debounce an object on the $scope, can be used on a search input
	            // for example to wait before auto-sending the value
	            observeOnScope($scope, 'vm.couponQuery').debounce(500).select(function (response) {
	                return response;
	            }).subscribe(function (change) {
	                //$log.debug('search value', change);
	                if (vm.couponQuery.length > 0) vm.checkCoupon();
	            });

	            // -- START - Agent code autocomplete

	            $scope.agentAutocomplete = {};
	            vm.agentCodeStatus = 'untouched';

	            $scope.agentAutocomplete.searchTextChange = function searchAgentTextChange(text) {
	                console.log("SEARCH TEXT", text);
	            };
	            $scope.agentAutocomplete.selectedItemChange = function selectedAgentItemChange(item) {
	                console.log('applied agent', item);

	                if (item) {
	                    vm.appliedAgentCode = item;
	                    data['agentCode'] = item['code'];
	                    vm.validateAgent(vm.appliedAgentCode);
	                    vm.agentCodeStatus = 'valid';
	                    vm.getPricingQuote();
	                    vm.checkingAgentCode = false;
	                    vm.checkingGiftCardsCode = false;
	                } else {
	                    vm.appliedAgentCode = undefined;
	                    vm.agentCodeStatus = 'untouched';
	                    if (data['agentCode']) delete data['agentCode'];
	                }
	            };

	            $scope.agentAutocomplete.querySearch = function querySearch(text) {
	                // text = text.toUpperCase();
	                text = !text ? "." : text;
	                return $http({
	                    method: 'GET',
	                    url: config.FEATHERS_URL + '/operators/' + $scope.orgId + '/agents?partialMatch=true&code=' + text,
	                    headers: headers
	                }).then(function successCallback(response) {
	                    return response.data;
	                    console.log('getPossibleAgent success', response.data);
	                }, function errorCallback(response) {
	                    return [];
	                    console.log('getPossibleAgentCodes error!', response);
	                });
	            };

	            // Check whether the vm.agentCodeQuery search string exists as a agent, if successful,
	            // add the agent code to the make booking request object as the 'agentCode' property
	            vm.checkAgentCode = function () {
	                vm.checkingAgentCode = true;

	                $http({
	                    method: 'GET',
	                    url: config.FEATHERS_URL + '/operators/' + $scope.orgId + '/agents?code=' + vm.agentCodeQuery,
	                    headers: headers
	                }).then(function successCallback(response) {
	                    console.log('checkAgentCode success', response);
	                    if (response.data && response.data.length == 0) {
	                        delete data['agentCode'];
	                        vm.agentCodeStatus = 'invalid';
	                        vm.appliedAgentCode = {};
	                        vm.checkingAgentCode = false;
	                        return;
	                    }
	                    data['agentCode'] = response.data[0]['code'];
	                    vm.appliedAgentCode = response.data[0];
	                    console.log('applied agent code', vm.appliedAgentCode);
	                    vm.validateAgent(vm.appliedAgentCode);
	                    vm.agentCodeStatus = 'valid';
	                    vm.getPricingQuote();
	                    vm.checkingAgentCode = false;
	                }, function errorCallback(response) {
	                    delete data['agentCode'];
	                    vm.agentCodeStatus = 'invalid';
	                    vm.appliedAgentCode = {};
	                    vm.checkingAgentCode = false;
	                });
	            };

	            vm.removeAgentCode = function () {
	                vm.agentCodeQuery = '';
	                delete data['agentCode'];
	                $scope.agentAutocomplete.selectedItem = undefined;
	                vm.agentCodeStatus = 'untouched';
	                vm.appliedAgentCode = {};
	                vm.getPricingQuote();
	            };

	            vm.validateAgent = function (agent) {
	                if (agent.active) {
	                    console.log("agent active");
	                    return true;
	                }
	                vm.agentCodeStatus = 'invalid';
	                return false;
	            };

	            //Observe and debounce an object on the $scope, can be used on 
	            //a search input for example to wait before auto-sending the value
	            observeOnScope($scope, 'vm.agentCodeQuery').debounce(500).select(function (response) {
	                return response;
	            }).subscribe(function (change) {
	                //console.log('search value', change);
	                if (vm.agentCodeQuery.length > 0) vm.checkAgentCode();
	            });

	            // -- END - Agent code autocomplete

	            // -- START - GiftCards code autocomplete
	            $scope.giftcardAutocomplete = {};
	            vm.giftcardCodeStatus = 'untouched';

	            $scope.giftcardAutocomplete.searchTextChange = function searchGiftCardTextChange(text) {
	                $log.debug("SEARCH TEXT", text);
	            };
	            $scope.giftcardAutocomplete.selectedItemChange = function selectedGiftCardItemChange(item) {
	                $log.debug('applied giftcard selectedItemChange', item);
	                if (item) {
	                    $log.debug('applied giftcard with item', item);
	                    vm.appliedGiftCardCode = item;
	                    data['giftcardNumber'] = item.redemptionNumber;
	                    vm.validateGiftCard(vm.appliedGiftCardCode);
	                    vm.giftcardCodeStatus = 'valid';
	                    vm.getPricingQuote();
	                    vm.checkingGiftCardsCode = false;
	                } else {
	                    vm.appliedGiftCardCode = {};
	                    $scope.giftcardAutocomplete.searchText = '';
	                    delete data['giftcardNumber'];
	                    vm.validateGiftCard(vm.appliedGiftCardCode);
	                    vm.giftcardCodeStatus = 'untouched';
	                    $scope.safeApply();
	                }
	            };

	            $scope.giftcardAutocomplete.querySearch = function querySearch(text) {
	                $log.debug('giftcardAutocomplete.querySearch', text);
	                if (text.length === 0) {
	                    $log.debug('giftcardAutocomplete.querySearch:empty', text.length);
	                    return [];
	                }
	                return $http({
	                    method: 'GET',
	                    url: config.FEATHERS_URL + '/giftcards/redemption-number/' + text,
	                    headers: headers
	                }).then(function successCallback(response) {
	                    vm.checkGiftCardCode(response.data);
	                    return [response.data];
	                }, function errorCallback(response) {
	                    vm.checkGiftCardCode(response);
	                    return [];
	                });
	            };

	            vm.checkGiftCardCode = function (response) {
	                vm.checkingGiftCardsCode = true;
	                $log.debug('checkGiftCardCode success', response);
	                if (response.status === 404) {
	                    delete data['giftcardNumber'];
	                    vm.giftcardCodeStatus = 'invalid';
	                    vm.appliedGiftCardCode = {};
	                    vm.checkingGiftCardsCode = false;
	                } else {
	                    data['giftcardNumber'] = response.redemptionNumber;
	                    vm.appliedGiftCardCode = response;
	                    $log.debug('applied giftcard code', vm.appliedGiftCardCode);
	                    vm.validateGiftCard(vm.appliedGiftCardCode);
	                    vm.giftcardCodeStatus = 'valid';
	                    vm.getPricingQuote();
	                    vm.checkingGiftCardsCode = false;
	                }
	            };

	            vm.removeGiftCardCode = function () {
	                vm.giftcardCodeQuery = '';
	                delete data['giftcardNumber'];
	                $scope.giftcardAutocomplete.selectedItem = '';
	                vm.giftcardCodeStatus = 'untouched';
	                vm.appliedGiftCardCode = {};
	                vm.getPricingQuote();
	            };

	            vm.validateGiftCard = function (giftcard) {
	                $log.debug('vm.validateGiftCard', giftcard);
	                if (giftcard.redemptionStatus = "active") {
	                    $log.debug("giftcard active");
	                    return true;
	                }
	                vm.giftcardCodeStatus = 'invalid';
	                return false;
	            };

	            observeOnScope($scope, 'vm.giftcardCodeQuery').debounce(500).select(function (response) {
	                return response;
	            }).subscribe(function (change) {
	                $log.debug('giftcard search value', change);
	                if (vm.giftcardCodeQuery.length > 0) vm.checkGiftCardCode();
	            });

	            // -- END - GiftCards code autocomplete

	            (0, _activityBookValidators2.default)(vm, rx, $http, $stateParams);

	            $scope.$watch('addBookingController.activity', function (changes) {
	                $log.debug('addBookingController.activity', changes);
	                if (angular.isDefined($scope.addBookingController.activity)) {

	                    // This is needed for Agent code search query
	                    $scope.orgId = $scope.addBookingController.activity.operator || $scope.addBookingController.activity.organizations[0];

	                    //Get booking questions
	                    vm.questions = $scope.addBookingController.activity.questions || [];
	                    if (!vm.questions) {
	                        delete vm.validStepsForPayment.bookingQuestions;
	                    }

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
	                }
	            }, true);

	            $scope.$watch('addBookingController.timeslot', function (changes) {
	                if (angular.isDefined($scope.addBookingController.timeslot) && angular.isDefined($scope.addBookingController.event)) {

	                    if (angular.isDefined($scope.addBookingController.timeslot.charges)) {
	                        vm.attendees = $scope.addBookingController.timeslot.charges.filter(function (charge) {
	                            return charge.type == 'aap' && charge.status == 'active';
	                        });
	                        vm.attendees.forEach(function (e, i) {
	                            if (!angular.isDefined(e.quantity)) e.quantity = 0;
	                        });
	                    }
	                    data['timeSlotId'] = $scope.addBookingController.timeslot._id;
	                    data['startTime'] = $scope.addBookingController.event.startTime;
	                }
	            }, true);

	            $scope.$watch('addBookingController.preferences', function (changes) {
	                var preferences = $scope.addBookingController.preferences;
	                $scope.agentsIsOn = preferences && preferences.features ? preferences.features.agents : false;
	                $scope.giftCardsIsOn = preferences && preferences.features ? preferences.features.giftcards : false;
	            }, true);

	            vm.countAttendees = function () {
	                var attendees = 0;
	                if ($scope.addBookingController.event) {
	                    if (vm.attendees) {
	                        attendees = ($scope.addBookingController.event.maxOcc ? $scope.addBookingController.event.maxOcc : $scope.addBookingController.timeslot.maxOcc) - vm.attendees.map(function (att) {
	                            return att.quantity;
	                        }).reduce(function (a, b) {
	                            return a + b;
	                        }, 0) - $scope.addBookingController.event.attendees;
	                    } else {
	                        attendees = 0;
	                    }
	                }
	                return attendees;
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
	                // $log.debug('countAttendeesAdded', attendeesAdded);
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
	                $log.debug('addonsChanged');
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
	                return vm.validStepsForPayment.bookingQuestions;
	            };

	            this.answerAllQuestions = function () {
	                $log.debug('answerAllQuestions', vm.answerAllQuestionsChecked, vm.bookingQuestions);
	                if (!vm.answerAllQuestionsChecked) {
	                    for (var i = 0; i < vm.bookingQuestions.length; i++) {
	                        vm.bookingQuestions[i] = 'No answer';
	                    }
	                    vm.answerAllQuestionsChecked = true;
	                } else {
	                    for (var i = 0; i < vm.bookingQuestions.length; i++) {
	                        vm.bookingQuestions[i] = '';
	                    }
	                    vm.answerAllQuestionsChecked = false;
	                }
	            };

	            this.isPaymentValid = function () {
	                var isValid = [];
	                angular.forEach(vm.validStepsForPayment, function (step, key) {
	                    if (!step) {
	                        isValid.push(step);
	                    }
	                });
	                vm.isFinishButtonValid = isValid.length === 0 && vm.pricingQuoteStarted === false;
	                return isValid.length > 0 && vm.pricingQuoteStarted === true ? false : true;
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

	            this.nextButtonLabel = function (step) {
	                var statusObj = { step: step };
	                //$log.debug('validStepsForPayment', vm.validStepsForPayment, step);
	                if (!$scope.dashboard && vm.pricing.total.amount === 0 && vm.countAttendeesAdded() > 0) {
	                    if (step === 'guest') {
	                        statusObj.label = 'Next';
	                    }
	                    if (step === 'attendees') {
	                        if (vm.addons || vm.questions) {
	                            if (vm.addons.length > 0 || vm.questions.length > 0) {
	                                statusObj.label = 'Next';
	                            } else {
	                                statusObj.label = 'Finish';
	                            }
	                        } else {
	                            statusObj.label = 'Next';
	                        }
	                    }
	                    if (step === 'addons') {
	                        if (vm.questions) {
	                            if (vm.questions.length > 0) {
	                                statusObj.label = 'Next';
	                            } else {
	                                statusObj.label = 'Finish';
	                            }
	                        } else {
	                            statusObj.label = 'Next';
	                        }
	                    }
	                    if (step === 'questions') {
	                        statusObj.label = 'Finish';
	                    }
	                } else {
	                    statusObj.label = 'Next';
	                }
	                return statusObj;
	            };

	            vm.paymentMethod = 'credit';
	            vm.bookingQuestions = [];
	            vm.getBookingData = function () {
	                var bookingData = angular.copy(data);
	                $log.debug('bookingData', bookingData);
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
	                    $log.debug('vm.questions', vm.questions);
	                    $log.debug('vm.bookingQuestions', vm.bookingQuestions);
	                    bookingData['answers'][e._id ? e._id : e] = vm.bookingQuestions[i];
	                });

	                if (vm.paymentMethod != 'reserved') bookingData['paymentMethod'] = vm.paymentMethod;else bookingData['paymentMethod'] = 'cash';

	                if (vm.paymentMethod == 'reserved') {
	                    bookingData['amount'] = 0;
	                }
	                bookingData['currency'] = 'default';

	                //add giftcard number to apply for booking
	                $log.debug('bookingData', bookingData);
	                if (bookingData.giftcardNumber) {
	                    bookingData['giftcardNumber'] = vm.appliedGiftCardCode.redemptionNumber;
	                    bookingData['paymentMethod'] = 'cash';
	                }

	                return bookingData;
	            };

	            vm.outputBookingData = function () {
	                $log.debug(vm.getBookingData());
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

	            function goToPay() {

	                vm.guestDetailsExpanded = false;
	                vm.attendeesExpanded = false;
	                vm.addonsExpanded = false;
	                vm.questionsExpanded = false;

	                vm.showPaymentForm = true;
	                vm.paymentFormIsLoading = true;
	                vm.stripePaymentExpanded = true;

	                vm.paymentWasSent = true;
	                this.formWasBlocked = true;
	                $scope.bookingSuccessResponse = 'processing';
	                $scope.safeApply();
	                $scope.makeBooking();
	            }

	            function submitNonCreditCardBooking() {
	                $log.debug('submitNonCreditCardBooking', this.pricing.total);

	                var bookingData = vm.getBookingData();
	                if (bookingData.stripeToken) delete bookingData.stripeToken;
	                bookingData.location = {};
	                bookingData.isMobile = false;
	                vm.paymentWasSent = true;
	                $scope.bookingSuccessResponse = 'processing';
	                if (Raven) {
	                    Raven.captureMessage('Submit Booking', {
	                        level: 'info', // one of 'info', 'warning', or 'error'
	                        extra: {
	                            bookingData: bookingData
	                        },
	                        tags: {
	                            step: 'pay-non-cc'
	                        }
	                    });
	                }
	                $http({
	                    method: 'POST',
	                    url: config.FEATHERS_URL + '/bookings',
	                    data: bookingData,
	                    headers: headers
	                }).then(function successCallback(response) {
	                    $log.debug('submitNonCreditCardBooking success', response);
	                    $scope.bookingSuccessResponse = response;
	                    vm.waitingForResponse = false;
	                    $rootScope.$emit('paymentResponse');
	                    validatePayment(response);
	                }, function errorCallback(response) {
	                    var errorElement = document.getElementById('card-errors');
	                    errorElement.textContent = response.data.errors[0];
	                    vm.paymentWasSent = false;
	                    $rootScope.$emit('paymentResponse');
	                    vm.waitingForResponse = false;
	                });
	            }

	            function validatePayment(response) {
	                if (response.status === 200) {
	                    $scope.paymentResponse = 'success'; //processing, failed
	                    $scope.paymentSuccessful = true;
	                    if (Raven) {
	                        Raven.captureMessage('Booking Suceeded', {
	                            level: 'info', // one of 'info', 'warning', or 'error'
	                            extra: {
	                                response: response
	                            },
	                            tags: {
	                                step: 'pay-non-cc'
	                            }
	                        });
	                    }
	                    $scope.safeApply();
	                }
	                $scope.bookingSuccessResponse = response;

	                $scope.$emit('paymentResponse', response);
	                console.log('paymentResponse', response);
	            }

	            $scope.$on('reloadPaymentForm', function (event, args) {
	                var iframe = document.getElementById("paymentIframe");
	                var iframeDoc = iframe.contentWindow.document;
	                iframeDoc.open();
	                iframeDoc.write('');
	                iframeDoc.close();
	                $scope.makeBooking();
	            });

	            $scope.makeBooking = function (data) {
	                vm.paymentExpanded = true;
	                vm.loadingIframe = true;
	                var bookingData = vm.getBookingData();
	                if (Raven) {
	                    Raven.captureMessage('Submit Booking', {
	                        level: 'info', // one of 'info', 'warning', or 'error'
	                        extra: {
	                            bookingData: bookingData
	                        },
	                        tags: {
	                            step: 'pay-cc'
	                        }
	                    });
	                }
	                $log.debug('$scope.makeBooking', data);
	                $scope.bookingResponse = $http({
	                    method: 'POST',
	                    url: config.FEATHERS_URL + '/bookings',
	                    data: bookingData,
	                    headers: headers
	                    // headers: {     "Content-Type": "application/json;charset=utf-8" }
	                }).then(function successCallback(response) {
	                    $log.debug('makeBooking success', response);
	                    if (response.data.iframeHtml) {
	                        $scope.trackEvent('Checkout: Payment Form', 'Go to Payment', 'Credit card form loaded');
	                        vm.loadingIframe = false;
	                        $scope.paymentSuccessful = false;
	                        $scope.bookingSuccessResponse = response;
	                        vm.paymentFormIsLoading = false;
	                        var iframe = document.getElementById("paymentIframe");
	                        iframe.style.display = 'block';
	                        var iframeDoc = iframe.contentWindow.document;
	                        iframeDoc.open();
	                        iframeDoc.write(response.data.iframeHtml);
	                        iframeDoc.close();
	                        $scope.bookingSucceeded = true;
	                        if (Raven) {
	                            Raven.captureMessage('Booking Succeeded', {
	                                level: 'info', // one of 'info', 'warning', or 'error'
	                                extra: {
	                                    response: response.data
	                                },
	                                tags: {
	                                    step: 'pay-cc'
	                                }
	                            });
	                        }
	                    } else if (response.data.booking.status === 'paid') {
	                        $log.debug('makeBooking success $0', response);
	                        $scope.paymentSuccessful = true;
	                        $scope.bookingSuccessResponse = response;
	                        $scope.bookingSucceeded = true;
	                        var event = {
	                            data: { type: 'payment_success' }
	                        };
	                        _paymentMessageHandler(event);
	                    }
	                }, function errorCallback(response) {
	                    $mdDialog.hide();
	                    vm.loadingIframe = false;
	                    vm.paymentFormIsLoading = false;
	                    vm.paymentExpanded = false;
	                    $scope.bookingSucceeded = false;
	                    $scope.trackEvent('Checkout: Payment Unsuccessful', 'Payment Error', 'Payment unsuccessful');
	                    if (Raven) {
	                        Raven.captureMessage('Booking Error', {
	                            level: 'error', // one of 'info', 'warning', or 'error'
	                            extra: {
	                                response: response.data
	                            },
	                            tags: {
	                                step: 'pay-cc'
	                            }
	                        });
	                    }
	                    $mdToast.show($mdToast.simple().textContent(response.data.errors[0]).position('left bottom').hideDelay(3000));
	                    $log.debug('makeBooking error!', response);
	                });
	            };

	            var lpad = function lpad(numberStr, padString, length) {
	                while (numberStr.length < length) {
	                    numberStr = padString + numberStr;
	                }
	                return numberStr;
	            };

	            var _paymentMessageHandler;
	            _paymentMessageHandler = function paymentMessageHandler(event) {
	                // if (event.origin == "https://calendar.ablist.win") { // TODO add to config
	                // $log.debug("TRUSTED ORIGIN", event.origin);
	                $log.debug("DATA", event.data);
	                if (event.data == "payment_complete" || event.data.type == "payment_success") {
	                    $scope.trackEvent('Checkout: Payment Successful', 'Payment Completed', 'Successful payment');
	                    $log.debug("PAYMENT COMPLETE");
	                    $scope.paymentResponse = 'success'; //processing, failed
	                    //   $rootScope.showToast('Payment processed successfully.');
	                    $rootScope.$broadcast('paymentWithResponse', { response: event.data });

	                    window.removeEventListener("message", _paymentMessageHandler);
	                    $scope.paymentSuccessful = true;
	                    //   $scope.changeState('bookings'); //Go to bookings view if successful
	                    $scope.safeApply();
	                    //$mdDialog.hide();
	                } else {
	                    if (event.data.message === 'Your card was declined.') {
	                        $log.debug('$scope.addBookingController.preferences', $scope.addBookingController.preferences.payment.cards);
	                        if ($scope.addBookingController.preferences.payment.cards) {
	                            var cards = [];
	                            var cardsKeys = { 'amex': 'American Express', 'discover': 'Discover', 'mastercard': 'Mastercard', 'visa': 'Visa' };
	                            angular.forEach($scope.addBookingController.preferences.payment.cards, function (value, key) {
	                                if (value === true) {
	                                    cards.push(cardsKeys[key]);
	                                }
	                            });
	                            $mdToast.show($mdToast.simple().textContent('Card Declined, please try one of the following cards: ' + cards.join(', ')).position('left bottom').hideDelay(5000));
	                        } else {
	                            $mdToast.show($mdToast.simple().textContent('Card Declined, please try one of the cards listed above').position('left bottom').hideDelay(5000));
	                        }
	                    }
	                    if (event.data.type) {
	                        if (event.data.type.indexOf('setImmediate') === -1) {
	                            if (Raven) {
	                                Raven.captureMessage('Booking Payment Error', {
	                                    level: 'error', // one of 'info', 'warning', or 'error'
	                                    extra: {
	                                        paymentMessageHandler: event.data
	                                    },
	                                    tags: {
	                                        step: 'pay-non-cc'
	                                    }
	                                });
	                            } // $rootScope.showToast(event.data.message, 'errorToast');
	                            // $rootScope.$broadcast('paymentWithResponse', { response: event.data });
	                            $scope.paymentSuccessful = false;
	                            $scope.paymentResponse = ''; //processing, failed
	                            vm.showPaymentForm = true;
	                            $scope.safeApply();
	                        }
	                    }
	                    $rootScope.$broadcast('paymentWithErrorResponse', { response: event.data });
	                }
	            };

	            $log.debug("Adding Payment Message Event Listener");
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

	            // Merge identical items from an array into nested objects, summing their amount
	            // properties and keeping track of quantities
	            function mergeIdenticalArrayItemsIntoObject(data, oldObject) {
	                var seen = oldObject;
	                //$log.debug('mergeIdenticalArrayItemsIntoObject:data', data);
	                angular.forEach(data, function (e, i) {
	                    if (seen.hasOwnProperty(e.name) && seen[e.name] === e.name) {
	                        seen[e['name']]['price'] = e['price']; //Sum their prices
	                        seen[e['name']]['quantity'] += 1; //Increment their quantity
	                        seen[e['name']]['amount'] = seen[e['name']]['amount'] * seen[e['name']]['quantity']; //Sum their prices
	                        //$log.debug('merged', seen[e['name']]);
	                    } else {
	                        seen[e['name']] = {};
	                        seen[e['name']]['name'] = e['name'];
	                        seen[e['name']]['price'] = e['price'];
	                        seen[e['name']]['quantity'] = 1;
	                        seen[e['name']]['amount'] = e['amount'];
	                    }
	                });
	                //$log.debug('mergeIdenticalArrayItems', seen);
	                return seen;
	            }

	            $scope.trackEvent = function (category, event, label) {
	                if (!config.DASHBOARD) {
	                    Analytics.trackEvent(getMainAppName($location.$$host) + ' ' + category, event, label);
	                }
	            };

	            function getMainAppName(host) {
	                return host.split('.')[0].capitalize();
	            }

	            String.prototype.capitalize = function () {
	                return this.charAt(0).toUpperCase() + this.slice(1);
	            };
	        }]
	    };
	}]).filter('imageService', function () {
	    return function (value) {
	        return value.replace(/(.png|.jpg|.jpeg)/i, '-small$1');
	    };
	});

/***/ }),
/* 197 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(198);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(168)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(198, function() {
				var newContent = __webpack_require__(198);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 198 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(167)(false);
	// imports


	// module
	exports.push([module.id, "#paymentIframe {\n    margin: 0;\n    padding: 8px 8px;\n    border: none;\n    min-height: 330px;\n    height: 100%;\n    overflow-y: hidden;\n    width: 100%;\n    display: none;\n}\n\nabl-activity-book md-card {\n    box-shadow: none !important;\n    border: none !important;\n    background: transparent;\n}\n\n.transparent {\n    background-color: transparent !important;\n}\n\nlist-item {\n    display: block !important;\n}\n\nlist-item span.currency, .subtotalLineItem span.currency{\n    text-transform: uppercase;\n    font-size: 12px;\n}\n\n.payment-section {\n  margin-bottom: 54px;\n}\n\nmd-input-container.md-white-theme:not(.md-input-invalid).md-input-focused label{\n    color: #666 !important;\n}\n\n.paymentSummaryCardNewContent .paymentSummaryCardNew{\n    margin: 0 !important;\n}\n\n.payment-icons-bar{\n    padding-top:8px;\n    padding-bottom:8px;\n    border-bottom: 1px solid rgba(0,0,0,.10);\n    background: #cccccc; \n}\n\n.payment-icons-bar img.payment-icons-bar-left{\n    height:40px;\n    padding-left:16px;\n    vertical-align:middle;\n}\n\n.payment-icons-bar img.payment-icons-bar-right{\n    height:30px;\n    padding-right:12px;\n    vertical-align:middle;\n}\n\n.left-panel{\n    background-color: #ffffff;\n    border-right: 1px solid #ddd;\n}\n\n.left-panel-no-dashboard{\n    background-color: #ffffff;\n}\n\n.left-panel > md-content,\n.left-panel-no-dashboard > md-content{\n    background-color: transparent !important;\n}\n\n.paymentSummaryCardNewContent .gradient{\n    background: rgb(0,0,0);\n    background: -webkit-linear-gradient(left, rgba(0,0,0,0.15) 0%, rgba(246,246,246,0.2049194677871149) 100%);\n    background: -moz-linear-gradient(left, rgba(0,0,0,0.15) 0%, rgba(246,246,246,0.2049194677871149) 100%);\n    background: -o-linear-gradient(left, rgba(0,0,0,0.15) 0%, rgba(246,246,246,0.2049194677871149) 100%);\n    background: linear-gradient(to right, rgba(0,0,0,0.15) 0%, rgba(246,246,246,0.2049194677871149) 100%);\n    width: 5px;\n}\n\n.paymentSummaryCardNewContent .paymentSummaryCardNew{\n    overflow-y: auto !important;\n}\n\n.payment-icons-bar {\n   padding-top: 0px;\n   padding-bottom: 0px;\n}\n\n.payment-icons-bar img.payment-icons-bar-left {\n    height: 28px;\n    margin-top: 2px;\n}\n\n.payment-icons-bar img.payment-icons-bar-right {\n   height: 25px;\n   padding-right: 15px;\n}\n\n.listItemHeader{\n    outline: none;\n    background-color: #f2f2f2;\n}\n\n.listItemContentArea{\n    background-color: #fff;\n    border-top: 1px solid #cacaca;\n}\n\n.payment-section-form .listItemContentArea .listItemInputContainer{\n    padding: 16px;\n}\n\n@media(max-width: 599px) {\n    .left-panel{\n        border-right: none;\n    }\n    .payment-icons-bar img.payment-icons-bar-left{\n        height:30px;\n        padding-left:8px;\n    }\n    \n    .payment-icons-bar img.payment-icons-bar-right{\n        height:24px;\n        padding-right:8px;\n    }\n}", ""]);

	// exports


/***/ }),
/* 199 */
/***/ (function(module, exports) {

	module.exports = "<md-content flex class=\"paymentSummaryCardNewContent\" layout=\"row\" layout-align=\"space-between stretch\">\n  <div hide-xs flex=\"none\" class=\"gradient\"></div>\n  <md-card flex class=\"paymentSummaryCardNew\" ng-show=\"paymentResponse != 'success'\">\n    <md-list>\n      <div ng-if=\"!dashboard && vm.eventDate\">\n        <div layout-padding layout-xs=\"column\" layout-gt-sm=\"row\">\n          <div flex-gt-sm=\"30\" flex ng-if=\"vm.activityImage\" style=\"max-height: 250px;overflow:hidden;margin-bottom:8px\">\n            <img style=\"width:100%\" ng-src=\"{{vm.activityImage}}\" />\n          </div>\n          <div flex=\"none\" hide-sm style=\"width:16px\"></div>\n          <div flex flex-gt-sm=\"60\">\n            <h2 style=\"font-size:17px;margin-bottom:8px\">{{vm.addBookingController.timeslot.title}}</h2>\n            <p style=\"font-size:14px\" ng-if=\"vm.activityLocation\"><ng-md-icon icon=\"place\" class=\"listIcon\" style=\"transform:scale(0.8)\"></ng-md-icon> {{vm.activityLocation}}</p>\n            <p style=\"font-size:14px\"><ng-md-icon icon=\"date_range\" class=\"listIcon\" style=\"transform:scale(0.8)\"></ng-md-icon> {{vm.eventDate}}</p>\n            <p style=\"font-size:14px\" ng-if=\"vm.eventTime\"><ng-md-icon icon=\"access_time\" class=\"listIcon\" style=\"transform:scale(0.8)\"></ng-md-icon> {{vm.eventTime}}</h4>\n          </div>\n        </div>\n        \n        <div ng-if=\"!vm.activityLocation\">\n          <md-list-item class=\"lineItemHeader\" ng-if=\"vm.base\" ng-click=\"null\">\n            <div class=\"md-list-item-text\" layout=\"row\" flex>\n              <div layout=\"row\" layout-align=\"start center\" flex=\"50\">\n                <p>Base Price </p>\n              </div>\n              <div layout=\"row\" layout-align=\"end center\" flex=\"50\">\n                <p><abl-currency-directive price=\"vm.base()\" currency=\"{{vm.currency}}\"></abl-currency-directive> {{$parent.currency | uppercase}}</p>\n              </div>\n            </div>\n          </md-list-item>\n        </div>\n      </div>\n  \n      <md-list-item class=\"lineItemHeader\" ng-if=\"vm.base\" ng-click=\"null\">\n        <div class=\"md-list-item-text \" layout=\"row\" flex>\n          <div layout=\"row\" layout-align=\"start center\" flex=\"50\">\n            <p>Base Price </p>\n          </div>\n          <div layout=\"row\" layout-align=\"end center\" flex=\"50\">\n            <p><abl-currency-directive price=\"vm.base()\" currency=\"{{vm.currency}}\"></abl-currency-directive> {{$parent.currency | uppercase}}</p>\n          </div>\n        </div>\n      </md-list-item>\n\n      <!-- BEGIN: eGiftCards Code -->\n  \n      <md-list-item ng-if=\"giftCardsIsOn\" class=\"paymentHeader md-2-line md-primary\" style=\"margin-bottom:1px;box-shadow:0 1px 0 0 rgba(0,0,0,.05)\" ng-disabled=\"detailsForm.$invalid\" ng-show=\"vm.giftcardCodeStatus == 'valid'\"> \n        <div layout=\"row\" class=\"md-list-item-text\" flex>\n          <div layout=\"row\" layout-align=\"start center\" flex>\n            <span class=\"agentCodeText total\" flex> <b>eGift-Card: </b> {{vm.appliedGiftCardCode.redemptionNumber}} </span>\n            <ng-md-icon icon=\"clear\" class=\"listIcon remove-agent-code\" ng-click=\"vm.removeGiftCardCode();\" ng-if=\"vm.giftcardCodeStatus =='valid'\" ng-hide=\"!dashboard && vm.formWasBlocked\"></ng-md-icon>\n          </div>\n          <div layout=\"row\" layout-align=\"end center\">\n            <md-progress-circular md-mode=\"indeterminate\" ng-show=\"vm.checkingGiftCardsCode && vm.giftcardCodeQuery.length > 0\" class=\"listItemCircularProgress easeIn\"\n              md-diameter=\"24px\">\n            </md-progress-circular>\n          </div>\n        </div>\n      </md-list-item>\n  \n      <list-item ng-if=\"giftCardsIsOn && !vm.showPaymentForm && paymentResponse.length <= 1\" style=\"margin-bottom:1px\" size=\"lg\" class=\"listItemAutocomplete\" ng-show=\"vm.giftcardCodeStatus == 'untouched' || vm.giftcardCodeStatus == 'invalid'\">\n        <md-autocomplete md-selected-item=\"giftcardAutocomplete.selectedItem\" md-search-text-change=\"giftcardAutocomplete.searchTextChange(giftcardAutocomplete.searchText)\"\n          md-search-text=\"giftcardAutocomplete.searchText\" md-no-cache=\"true\" md-selected-item-change=\"giftcardAutocomplete.selectedItemChange(item)\"\n          md-items=\"item in giftcardAutocomplete.querySearch(giftcardAutocomplete.searchText)\" md-item-text=\"item.code\" md-min-length=\"0\"\n          placeholder=\"e-Gift Card\" class=\"listItem\" ng-if=\"dashboard\">\n          <md-item-template>\n            <span md-highlight-text=\"ctrl.searchText\" md-highlight-flags=\"^i\">{{item.redemptionNumber}}</span>\n          </md-item-template>\n          <md-not-found>\n            e-GiftCard not found{{giftcardAutocomplete.searchText.length > 0 ? (' matching \"' + giftcardAutocomplete.searchText + '\".') : '.'}}\n          </md-not-found>\n        </md-autocomplete>\n        <span class=\"paymentSubTitle total\">\n          <input id=\"#agentCode\" ng-model=\"vm.giftcardCodeQuery\" type=\"text\" class=\"agentInput\" ng-if=\"(vm.giftcardCodeStatus =='untouched' || vm.giftcardCodeStatus == 'invalid') && !dashboard\" ng-change=\"vm.checkingGiftCardsCode = true\" placeholder=\"Enter e-Gift Card...\" ng-hide=\"vm.formWasBlocked\" to-uppercase/>\n          </span>\n      </list-item>\n  \n      <md-list-item ng-show=\"vm.giftcardCodeStatus =='invalid' && vm.agentCodeQuery.length > 0 && !vm.checkingGiftCardsCode\" class=\"paymentHeader md-2-line md-primary easeIn\" ng-if=\"!dashboard\">\n        <div layout=\"row\" class=\"md-list-item-text\" flex>\n          <div layout=\"row\" layout-align=\"start center\" flex>\n            <ng-md-icon class=\"headerIcon\" icon=\"error_outline\" class=\"listIcon\" ng-if=\"vm.giftcardCodeStatus !='valid'\" style=\"fill: rgba(255,87,87,0.8)\"></ng-md-icon>\n            <span class=\"paymentSubTitle total\">\n              Invalid e-Gift Card\n            </span>\n          </div>\n          <div layout=\"row\" layout-align=\"end center\" flex>\n            <ng-md-icon icon=\"clear\" class=\"listIcon\" ng-click=\"vm.giftcardCodeQuery = '';\"></ng-md-icon>\n          </div>\n        </div>\n      </md-list-item>\n    \n        <!-- END: eGiftCards Code -->\n  \n      <!--Coupons-->\n  \n      <md-list-item class=\"paymentHeader md-2-line md-primary\" ng-disabled=\"detailsForm.$invalid\" ng-show=\"vm.couponStatus == 'valid'\">\n        <div layout=\"row\" class=\"md-list-item-text\" flex>\n          <div layout=\"row\" layout-align=\"start center\" flex>\n            <!-- <ng-md-icon class=\"headerIcon\" icon=\"local_offer\" class=\"listIcon\" ng-if=\"vm.couponStatus !='valid'\"></ng-md-icon> -->\n            <div layout=\"column\" layout-align=\"center start\">\n              <ng-md-icon icon=\"clear\" class=\"listIcon remove-coupon\" ng-click=\"vm.removeCoupon();\" ng-if=\"vm.couponStatus =='valid'\" ng-hide=\"!dashboard && vm.formWasBlocked\"></ng-md-icon>\n            </div>\n            <span class=\"couponText total\" flex>{{vm.appliedCoupon.couponId}} - {{vm.appliedCouponType(vm.appliedCoupon)}} Off</span>\n  \n          </div>\n          <div layout=\"row\" layout-align=\"end center\">\n            <span class=\"couponTextTotal\" ng-if=\"vm.pricing.couponDeduction[0]\">-<abl-currency-directive price=\"(-1 * vm.pricing.couponDeduction[0].price.amount)\" currency=\"{{vm.currency}}\"></abl-currency-directive></span>\n            <md-progress-circular md-mode=\"indeterminate\" ng-show=\"vm.checkingCoupon && vm.couponQuery.length > 0\" class=\"listItemCircularProgress easeIn\" md-diameter=\"24px\">\n            </md-progress-circular>\n          </div>\n        </div>\n      </md-list-item>\n      \n      <list-item ng-if=\"!vm.showPaymentForm && paymentResponse.length <= 1\" style=\"margin-bottom:1px\" size=\"lg\" class=\"listItemAutocomplete\" ng-show=\"vm.couponStatus == 'untouched' || vm.couponStatus =='invalid'\">\n        <md-autocomplete md-selected-item=\"autocomplete.selectedItem\" md-search-text-change=\"autocomplete.searchTextChange(autocomplete.searchText)\" md-search-text=\"autocomplete.searchText\" md-no-cache=\"true\" md-selected-item-change=\"autocomplete.selectedItemChange(item)\"\n          md-items=\"item in autocomplete.querySearch(autocomplete.searchText)\" md-item-text=\"item.couponId\" md-min-length=\"0\" placeholder=\"{{dashboard ? 'Search coupons..' : 'Enter a coupon..'}}\" class=\"listItem\" ng-if=\"dashboard\">\n          <md-item-template>\n            <span md-highlight-text=\"ctrl.searchText\" md-highlight-flags=\"^i\">{{item.couponId}}</span>\n            <span>{{vm.appliedCouponType(item)}}</span>\n          </md-item-template>\n          <md-not-found>\n            No coupons found{{autocomplete.searchText.length > 0 ? (' matching\"' + autocomplete.searchText + '\".') : '.'}}\n          </md-not-found>\n        </md-autocomplete>\n        <span class=\"paymentSubTitle total\">\n          <input id=\"#coupon\" ng-model=\"vm.couponQuery\" type=\"text\" class=\"couponInput\" ng-if=\"(vm.couponStatus =='untouched' || vm.couponStatus =='invalid') && !dashboard\" ng-change=\"vm.checkingCoupon = true\" placeholder=\"Enter coupon..\" ng-hide=\"vm.formWasBlocked\" to-uppercase/>\n          </span>\n      </list-item>\n      \n      <md-list-item ng-show=\"vm.couponStatus =='invalid' && vm.couponQuery.length > 0 && !vm.checkingCoupon\" class=\"paymentHeader md-2-line md-primary easeIn\" ng-if=\"!dashboard\">\n        <div layout=\"row\" class=\"md-list-item-text\" flex>\n          <div layout=\"row\" layout-align=\"start center\" flex>\n            <ng-md-icon class=\"headerIcon\" icon=\"error_outline\" class=\"listIcon\" ng-if=\"vm.couponStatus !='valid'\" style=\"fill: rgba(255,87,87,0.8)\"></ng-md-icon>\n            <span class=\"paymentSubTitle total\">\n              Invalid Coupon\n            </span>\n          </div>\n          <div layout=\"row\" layout-align=\"end center\" flex>\n            <ng-md-icon icon=\"clear\" class=\"listIcon\" ng-click=\"vm.couponQuery = '';\"></ng-md-icon>\n          </div>\n        </div>\n      </md-list-item>\n  \n      <!-- BEGIN: Agent Code -->\n  \n      <md-list-item ng-if=\"agentsIsOn\" class=\"paymentHeader md-2-line md-primary\" ng-disabled=\"detailsForm.$invalid\" ng-show=\"vm.agentCodeStatus == 'valid'\"> \n        <div layout=\"row\" class=\"md-list-item-text \" flex>\n          <div layout=\"row\" layout-align=\"start center\" flex>\n            <span class=\"agentCodeText total\" flex> <b>Agent Code: </b> {{vm.appliedAgentCode.code}} </span>\n            <ng-md-icon icon=\"clear\" class=\"listIcon remove-agent-code\" ng-click=\"vm.removeAgentCode();\" ng-if=\"vm.agentCodeStatus =='valid'\" ng-hide=\"!dashboard && vm.formWasBlocked\"></ng-md-icon>\n          </div>\n          <div layout=\"row \" layout-align=\"end center \">\n            <md-progress-circular md-mode=\"indeterminate\" ng-show=\"vm.checkingAgentCode && vm.agentCodeQuery.length > 0\" class=\"listItemCircularProgress easeIn\"\n              md-diameter=\"24px\">\n            </md-progress-circular>\n          </div>\n        </div>\n      </md-list-item>\n  \n      <list-item ng-if=\"agentsIsOn && !vm.showPaymentForm && paymentResponse.length <= 1\" size=\"lg\" class=\"listItemAutocomplete\" ng-show=\"vm.agentCodeStatus == 'untouched' || vm.agentCodeStatus == 'invalid'\">\n        <md-autocomplete md-selected-item=\"agentAutocomplete.selectedItem\" md-search-text-change=\"agentAutocomplete.searchTextChange(agentAutocomplete.searchText)\"\n          md-search-text=\"agentAutocomplete.searchText\" md-no-cache=\"true\" md-selected-item-change=\"agentAutocomplete.selectedItemChange(item)\"\n          md-items=\"item in agentAutocomplete.querySearch(agentAutocomplete.searchText)\" md-item-text=\"item.code\" md-min-length=\"0\"\n          placeholder=\"Agent Code\" class=\"listItem\" ng-if=\"dashboard\">\n          <md-item-template>\n            <span md-highlight-text=\"ctrl.searchText\" md-highlight-flags=\"^i\">{{item.code}}</span>\n          </md-item-template>\n          <md-not-found>\n            Agent code not found{{agentAutocomplete.searchText.length > 0 ? (' matching \"' + agentAutocomplete.searchText + '\".') : '.'}}\n          </md-not-found>\n        </md-autocomplete>\n        <span class=\"paymentSubTitle total\">\n          <input id=\"#agentCode\" ng-model=\"vm.agentCodeQuery\" type=\"text\" class=\"agentInput\" ng-if=\"(vm.agentCodeStatus =='untouched' || vm.agentCodeStatus == 'invalid') && !dashboard\" ng-change=\"vm.checkingAgentCode = true\" placeholder=\"Enter agent code..\" ng-hide=\"vm.formWasBlocked\" to-uppercase/>\n          </span>\n      </list-item>\n  \n      <md-list-item ng-show=\"vm.agentCodeStatus =='invalid' && vm.agentCodeQuery.length > 0 && !vm.checkingAgentCode\" class=\"paymentHeader md-2-line md-primary easeIn\" ng-if=\"!dashboard\">\n        <div layout=\"row\" class=\"md-list-item-text\" flex>\n          <div layout=\"row\" layout-align=\"start center\" flex>\n            <ng-md-icon class=\"headerIcon\" icon=\"error_outline\" class=\"listIcon\" ng-if=\"vm.agentCodeStatus !='valid'\" style=\"fill: rgba(255,87,87,0.8)\"></ng-md-icon>\n            <span class=\"paymentSubTitle total\">\n              Invalid agent code\n            </span>\n          </div>\n          <div layout=\"row\" layout-align=\"end center\" flex>\n            <ng-md-icon icon=\"clear\" class=\"listIcon\" ng-click=\"vm.agentCodeQuery = '';\"></ng-md-icon>\n          </div>\n        </div>\n      </md-list-item>\n  \n      <!-- END: Agent Code -->\n  \n      <!-- <list-item size=\"lg\" class=\"listItemAutocomplete\" ng-show=\"vm.couponStatus == 'untouched'\">\n        <md-autocomplete md-selected-item=\"autocomplete.selectedItem\" md-search-text-change=\"autocomplete.searchTextChange(autocomplete.searchText)\"\n          md-search-text=\"autocomplete.searchText\" md-no-cache=\"true\" md-selected-item-change=\"autocomplete.selectedItemChange(item)\"\n          md-items=\"item in autocomplete.querySearch(autocomplete.searchText)\" md-item-text=\"item.couponId\" md-min-length=\"0\"\n          placeholder=\"Search coupons..\" class=\"listItem\">\n          <md-item-template>\n            <span md-highlight-text=\"ctrl.searchText\" md-highlight-flags=\"^i\">{{item.couponId}}</span>\n            <span>{{item.percentage ? \"\" : \"$\"}}{{item.percentage ? item.amount : (item.amount / 100)}}{{item.percentage ? \"%\" : \"\"}}</span>\n          </md-item-template>\n          <md-not-found>\n            No coupons found{{autocomplete.searchText.length > 0 ? (' matching \"' + autocomplete.searchText + '\".') : '.'}}\n          </md-not-found>\n        </md-autocomplete>\n      </list-item> -->\n  \n      <div ng-if=\"vm.attendeeSubtotals.length > 0\">\n        <div class=\"md-list-item-text subtotalLineItem\" layout=\"row \" flex>\n          <div layout=\"row\" layout-align=\"start center \" flex=\"50 \">\n            <span class=\"total\">Attendees </span>\n          </div>\n          <div layout=\"row\" layout-align=\"end center\" flex=\"50\">\n            <span class=\"activityTotal\"><abl-currency-directive price=\"vm.attendeeTotal\" currency=\"{{vm.currency}}\"></abl-currency-directive></span>\n          </div>\n        </div>\n  \n        <div ng-repeat=\"(key, value) in vm.attendeeSubtotals\" layout=\"row\" flex class=\"subtotalLineItem subtotalLineItemSmall\">\n          <div layout=\"row\" layout-align=\"start center\" flex=\"50\">\n            {{value.quantity}} x {{value.name}} @\n            <abl-currency-directive style=\"margin:0 4px\" price=\"value.price\" currency=\"{{vm.currency}}\"></abl-currency-directive> each\n          </div>\n          <div layout=\"row\" layout-align=\"end center\" flex=\"50\">\n            <abl-currency-directive price=\"value.amount\" currency=\"{{vm.currency}}\"></abl-currency-directive>\n          </div>\n        </div>\n      </div>\n      <div ng-if=\"vm.addonSubtotals.length > 0\">\n        <div class=\"md-list-item-text subtotalLineItem\" layout=\"row\" flex>\n          <div layout=\"row\" layout-align=\"start center\" flex=\"50\">\n            <span class=\"total\">Add-ons </span>\n          </div>\n          <div layout=\"row\" layout-align=\"end center\" flex=\"50\">\n            <span class=\"activityTotal\"><abl-currency-directive price=\"vm.addonTotal\" currency=\"{{vm.currency}}\"></abl-currency-directive></span>\n          </div>\n        </div>\n  \n        <div ng-repeat=\"addon in vm.addonSubtotals\" layout=\"row\" flex class=\"subtotalLineItem subtotalLineItemSmall\">\n          <div layout=\"row\" layout-align=\"start center\" flex=\"50\">\n            {{addon.quantity}} x {{addon.name}} @\n            <abl-currency-directive style=\"margin:0 4px\" price=\"addon.price\" currency=\"{{vm.currency}}\"></abl-currency-directive> each\n          </div>\n          <div layout=\"row\" layout-align=\"end center\" flex=\"50\">\n            <abl-currency-directive price=\"addon.amount\" currency=\"{{vm.currency}}\"></abl-currency-directive>\n          </div>\n        </div>\n      </div>\n  \n      <div ng-if=\"vm.taxTotal > 0\">\n        <div class=\"md-list-item-text subtotalLineItem\" layout=\"row\" flex>\n          <div layout=\"row\" layout-align=\"start center\" flex=\"50\">\n            <span class=\"total\">Taxes and Fees </span>\n          </div>\n          <div layout=\"row\" layout-align=\"end center\" flex=\"50\">\n            <span class=\"activityTotal\"><abl-currency-directive price=\"vm.taxTotal\" currency=\"{{vm.currency}}\"></abl-currency-directive></span>\n          </div>\n        </div>\n      </div>\n  \n      <div ng-if=\"false\">\n        <div class=\"md-list-item-text subtotalLineItem\" layout=\"row \" flex>\n          <div layout=\"row\" layout-align=\"start center \" flex=\"50 \">\n            <span class=\"total\">Agent Commission </span>\n          </div>\n          <div layout=\"row \" layout-align=\"end center \" flex=\"50 \">\n            <span class=\"agentCommission\">${{vm.pricing.agentCommission / 100 | number:2}}</span>\n          </div>\n        </div>\n      </div>\n  \n      <div>\n        <div class=\"md-list-item-text subtotalLineItem bottomTotal\" layout=\"row\" layout-align=\"space-between center\" flex>\n          <div layout=\"row\" layout-align=\"start center\" flex=\"50\">\n            <span class=\"\">Total </span>\n          </div>\n          <div layout=\"row\" layout-align=\"end center\" flex=\"50\">\n            <span>\n              <abl-currency-directive price=\"(vm.pricing.total.amount || 0)\" currency=\"{{vm.currency}}\"></abl-currency-directive> <span class=\"currency\">{{vm.pricing.total.originalCurrency}}</span>\n              <span class=\"pricing\" ng-show=\"vm.pricing.total.amount > 0\">\n                <ng-md-icon icon=\"information\" class=\"listIcon\"></ng-md-icon>\n                <md-tooltip md-direction=\"top\">Original price: {{vm.pricing.total.originalAmount | ablCurrency : (vm.pricing.total.originalCurrency | lowercase)}}, Original currency: {{vm.pricing.total.originalCurrency}}</md-tooltip>\n              </span>\n            </span>\n          </div>\n        </div>\n      </div>\n    </md-list>\n  </md-card>\n</md-content>\n";

/***/ }),
/* 200 */
/***/ (function(module, exports) {

	module.exports = "<md-content>\n  <div ng-if=\"paymentResponse != 'success' || !vm.showPaymentForm\">\n    <div class=\"activityPaymentSummaryCard\">\n      <!-- Guest Details -->\n      <list-item size=\"lg\" class=\"listItemHeader\" ng-click=\"vm.toggleGuestDetails()\" ng-disabled=\"!vm.guestDetailsAreValid\" layout=\"column\">\n        <div layout=\"row\" layout-align=\"start center\" flex>\n          <ng-md-icon icon=\"filter_1\" class=\"listIcon listItemHeaderIcon leftIcon\" size=\"20\"></ng-md-icon>\n          <span class=\"paymentSubTitle\" flex>Guest Details</span>\n        </div>\n        <div layout=\"row\" layout-align=\"end center\">\n          <div layout=\"column\" layout-align=\"center end\">\n            <ng-md-icon icon=\"{{vm.guestDetailsExpanded ? 'expand_less' : 'expand_more'}}\" class=\"listIcon\"></ng-md-icon>\n          </div>\n        </div>\n      </list-item>\n\n      <div ng-show=\"vm.guestDetailsExpanded\" layout=\"column\" class=\"listItemContentArea\">\n        <list-item ng-if=\"dashboard\">\n          <md-checkbox ng-model=\"sendConfirmationEmail\" class=\"listItemCheckbox\">Send confirmation e-mail to client</md-checkbox>\n        </list-item>\n        <form name=\"guestDetailsForm\" novalidate>\n          <div class=\"formContainer\">\n            <md-input-container class=\"md-block listItemInputContainer inputBottomMargin\" ng-if=\"!dashboard\">\n              <label>Full Name</label>\n              <input name=\"fullName\" ng-model=\"vm.formData.fullName\" required type=\"text\" md-maxlength=\"100\" ng-minlength=\"3\" />\n              <div ng-messages=\"guestDetailsForm.fullName.$error\" ng-if=\"screenIsBig()\">\n                <div ng-message=\"required\">This is required.</div>\n                <div ng-message=\"minlength\">The name must be at least 3 characters long.</div>\n                <div ng-message=\"md-maxlength\">The name must be less than 100 characters long.</div>\n              </div>\n              <div ng-messages=\"guestDetailsForm.fullName.$error\" ng-if=\"!screenIsBig()\">\n                <div ng-message=\"required\">This is required.</div>\n                <div ng-message=\"minlength\">Must be at least 3 chars.</div>\n                <div ng-message=\"md-maxlength\">Must be less than 100 chars.</div>\n              </div>\n            </md-input-container>\n\n\n            <md-autocomplete ng-if=\"dashboard\" required md-input-name=\"autocompleteField\" md-input-minlength=\"3\" md-input-maxlength=\"100\" md-no-cache=\"true\" md-delay=\"250\" md-selected-item=\"vm.clientSearchSelectedItem\" md-search-text=\"vm.formData.fullName\" md-items=\"item in vm.clients\"\n              md-item-text=\"item.primaryContact.fullName\" md-floating-label=\"Full Name\" md-selected-item-change=\"vm.selectedClientChange(item)\" class=\"md-block listItemInputContainer\" md-menu-class=\"autocomplete-custom-template\" md-min-length=\"2\">\n              <md-item-template>\n                <span class=\"item-title\">\n                    <ng-md-icon icon=\"person\" class=\"listItemHeaderIcon sm\"></ng-md-icon>\n                    <span> {{item.primaryContact.fullName}} </span>\n                </span>\n                <span class=\"item-metadata\">\n                    <span>\n                        <ng-md-icon icon=\"email\" class=\"listItemHeaderIcon sm\" md-colors=\"{fill: 'blue-grey-A200'}\"></ng-md-icon>\n  \n                      {{item.primaryContact.email}}\n                    </span>\n                </span>\n              </md-item-template>\n              <div ng-messages=\"guestDetailsForm.autocompleteField.$error\" ng-if=\"guestDetailsForm.autocompleteField.$touched\">\n                <div ng-message=\"required\">You <b>must</b> enter a client name.</div>\n                <div ng-message=\"minlength\">The name must be at least 3 characters long.</div>\n                <div ng-message=\"md-maxlength\">The name must be less than 100 characters long.</div>\n              </div>\n            </md-autocomplete>\n\n            <md-input-container class=\"md-block listItemInputContainer\" ng-if=\"!dashboard\">\n              <label>E-mail</label>\n              <input name=\"mail\" ng-model=\"vm.formData.mail\" required type=\"email\" md-maxlength=\"100\" ng-minlength=\"3\" ng-pattern=\"/^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$/\" />\n              <div ng-messages=\"guestDetailsForm.mail.$error\" ng-if=\"screenIsBig()\">\n                <div ng-message=\"required\">This is required.</div>\n                <div ng-message=\"pattern\">Please enter a valid e-mail address.</div>\n                <div ng-message=\"minlength\">The e-mail must be at least 3 characters long.</div>\n                <div ng-message=\"md-maxlength\">The e-mail must be less than 100 characters long.</div>\n              </div>\n              <div ng-messages=\"guestDetailsForm.mail.$error\" ng-if=\"!screenIsBig()\">\n                <div ng-message=\"required\">This is required.</div>\n                <div ng-message=\"pattern\">Invalid e-mail address</div>\n                <div ng-message=\"minlength\">Must be at least 3 chars</div>\n                <div ng-message=\"md-maxlength\">Must be less than 100 chars</div>\n              </div>\n            </md-input-container>\n            \n            <md-input-container class=\"md-block listItemInputContainer\" ng-if=\"!dashboard\">\n              <label>Phone</label>\n              <input name=\"phone\" ng-model=\"vm.formData.phoneNumber\" required type=\"text\" />\n              <div ng-messages=\"guestDetailsForm.phone.$error\">\n                <div ng-message=\"required\">This is required.</div>\n              </div>\n            </md-input-container>\n\n            <md-input-container class=\"md-block listItemInputContainer listItemAutoCompleteAfterContainer\" ng-if=\"dashboard\">\n              <label>E-mail</label>\n              <input name=\"mail\" ng-model=\"vm.formData.mail\" type=\"email\" md-maxlength=\"100\" ng-minlength=\"3\" ng-pattern=\"/^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$/\" />\n              <div ng-messages=\"guestDetailsForm.mail.$error\" ng-if=\"screenIsBig()\">\n                <div ng-message=\"pattern\">Please enter a valid e-mail address.</div>\n                <div ng-message=\"minlength\">The e-mail must be at least 3 characters long.</div>\n                <div ng-message=\"md-maxlength\">The e-mail must be less than 100 characters long.</div>\n              </div>\n              <div ng-messages=\"guestDetailsForm.mail.$error\" ng-if=\"!screenIsBig()\">\n                <div ng-message=\"pattern\">Invalid e-mail address.</div>\n                <div ng-message=\"minlength\">Must be at least 3 chars</div>\n                <div ng-message=\"md-maxlength\">Must be less than 100 chars</div>\n              </div>\n            </md-input-container>\n            \n            <md-input-container class=\"md-block listItemInputContainer\" ng-if=\"dashboard\">\n              <label>Phone</label>\n              <input name=\"phone\" ng-model=\"vm.formData.phoneNumber\" type=\"text\" />\n              <div ng-messages=\"guestDetailsForm.phone.$error\">\n              </div>\n            </md-input-container>\n\n            <md-input-container class=\"md-block listItemInputContainer\">\n              <label>Notes</label>\n              <textarea ng-model=\"vm.formData.notes\" md-maxlength=\"300\" rows=\"1\"></textarea>\n            </md-input-container>\n\n            <div layout=\"row\" layout-align=\"end center\">\n              <md-button class=\"md-raised md-primary md-hue-2\" ng-disabled=\"!vm.areGuestDetailsValid(guestDetailsForm)\" ng-click=\"vm.goToNextStep('guestDetailsStep')\">{{vm.nextButtonLabel('guest').label}}</md-button>\n            </div>\n          </div>\n        </form>\n      </div>\n      <md-divider class=\"no-margin\"></md-divider>\n\n      <!-- Attendees -->\n      <list-item size=\"lg\" class=\"listItemHeader\" ng-click=\"vm.toggleAttendees()\" ng-disabled=\"!vm.guestDetailsAreValid\" layout=\"column\">\n        <div layout=\"row\" layout-align=\"start center\" flex>\n          <ng-md-icon icon=\"filter_2\" class=\"listIcon listItemHeaderIcon leftIcon\" size=\"20\"></ng-md-icon>\n          <span class=\"paymentSubTitle\" ng-if=\"vm.countAttendees() >= 0\" flex>Attendees <span ng-show=\"vm.countAttendees() < 4\"> {{vm.countAttendees()}} spot{{vm.countAttendees() != 1 ? 's' : ''}} remaining</span></span>\n          <span class=\"paymentSubTitle\" ng-if=\"vm.countAttendees() < 0\" flex>Attendees <span class=\"red\"> <strong> {{vm.countAttendees() * -1}}</strong> spot{{((vm.countAttendees() * -1) > 1 || (vm.countAttendees() * -1) == 0) ? 's' : ''}} over maximum occupancy</span></span>\n        </div>\n        <div layout=\"row\" layout-align=\"end center\">\n          <div layout=\"column\" layout-align=\"center end\">\n            <ng-md-icon icon=\"{{vm.attendeesExpanded ? 'expand_less' : 'expand_more'}}\" class=\"listIcon\"></ng-md-icon>\n          </div>\n        </div>\n      </list-item>\n\n      <div ng-show=\"vm.attendeesExpanded\" ng-class=\"vm.areAttendeesValid()\" layout=\"column\" class=\"listItemContentArea\">\n        <div flex ng-repeat=\"attendee in vm.attendees\">\n          <list-item class=\"md-2-line addOnListItem\">\n            <div layout=\"row\" class=\"list-item-text\" flex>\n              <div layout=\"row\" layout-align=\"start center\" flex>\n                <div layout=\"column\" class=\"\">\n                  <span class=\"lineItemSubHeader\">{{attendee.name}}</span>\n\n                  <div layout=\"row\">\n                    <span class=\"lineItemSubDetail\">{{ attendee.amount | ablCurrency: vm.currency }} <span class=\"currency\">{{vm.currency}}</span></span>\n                  </div>\n\n                </div>\n              </div>\n\n              <div layout=\"row\" layout-align=\"end center\">\n                <div layout=\"column\" class=\"addOnAdjusters\" layout-align=\"center end\" flex layout-grow>\n                  <ng-md-icon icon=\"add_circle_outline\" class=\"listIconSub\" ng-click=\"vm.adjustAttendee($index,'up');\"> </ng-md-icon>\n                  <ng-md-icon icon=\" remove_circle_outline\" class=\"listIconSub\" ng-click=\"vm.adjustAttendee($index,'down');\"></ng-md-icon>\n                </div>\n\n                <div layout=\"column\" layout-align=\"end end\">\n                  <input class='addOnQuantityText' ng-model=\"attendee.quantity\" ng-change=\"vm.checkAdjustAttendee($index);\" type=\"number\" min=\"0\" md-select-on-focus></input>\n                </div>\n              </div>\n            </div>\n          </list-item>\n        </div>\n        <div flex layout=\"row\" layout-align=\"end center\" layout-margin>\n          <progress-button class=\"md-raised md-primary md-hue-2 md-{{vm.theme}}-theme\" ng-disabled=\"!vm.areAttendeesValid() || vm.pricingQuoteStarted\" loading=\"vm.pricingQuoteStarted\" on-click=\"vm.goToNextStep('attendeesStep')\" spinner=\"3\" label=\"{{vm.nextButtonLabel('attendees').label}}\"></progress-button>\n        </div>\n      </div>\n\n\n      <md-divider class=\"no-margin\"></md-divider>\n\n      <!-- Add ons -->\n      <div ng-if=\"vm.addons.length > 0\">\n        <list-item class=\"paymentHeader listItemHeader md-2-line\" ng-disabled=\"vm.countAttendeesAdded() < 1 || guestDetailsForm.$invalid\" ng-click=\"vm.toggleAddons()\" layout=\"column\" flex>\n          <div layout=\"row\" layout-align=\"start center\" flex>\n            <ng-md-icon icon=\"filter_3\" class=\"listIcon listItemHeaderIcon leftIcon\" size=\"20\"></ng-md-icon>\n            <span class=\"paymentSubTitle\">Add-ons</span>\n          </div>\n          <div layout=\"row\" layout-align=\"end center\">\n            <div layout=\"column\" layout-align=\"center end\">\n              <ng-md-icon ng-show=\"vm.addOnsSelected == 1\" icon=\"check\" class=\"listIcon\"></ng-md-icon>\n              <ng-md-icon icon=\"{{vm.addonsExpanded ? 'expand_less' : 'expand_more'}}\" class=\"listIcon\"></ng-md-icon>\n            </div>\n          </div>\n        </list-item>\n        <div layout=\"column\" ng-show=\"vm.addonsExpanded\" ng-class=\"vm.areAddonsValid()\" class=\"listItemContentArea\">\n          <div flex ng-repeat=\"addon in vm.addons\">\n            <list-item class=\"md-2-line addOnListItem\">\n              <div layout=\"row\" layout-align=\"start center\" flex>\n                <div layout=\"column\" class=\"\">\n                  <span class=\"lineItemSubHeader\">{{addon.name}}</span>\n                  <div layout=\"row\" class=\"\">\n                    <span class=\"lineItemSubDetail\">{{ addon.amount | ablCurrency: vm.currency }} <span class=\"currency\">{{vm.currency}}</span></span>\n                  </div>\n                </div>\n              </div>\n              <div layout=\"row\" layout-align=\"end center\" flex>\n                <div layout=\"column\" class=\"addOnAdjusters\" layout-align=\"center end\">\n                  <ng-md-icon icon=\"add_circle_outline\" class=\"listIconSub\" ng-click=\"vm.adjustAddon($index,'up');\"> </ng-md-icon>\n                  <ng-md-icon icon=\" remove_circle_outline\" class=\"listIconSub\" ng-click=\"vm.adjustAddon($index,'down');\"></ng-md-icon>\n                </div>\n                <div layout=\"column\" layout-align=\"end end\">\n                  <input class='addOnQuantityText' ng-model=\"addon.quantity\" ng-change=\"vm.addonsChanged();\" md-select-on-focus type=\"number\"></input>\n                </div>\n              </div>\n            </list-item>\n          </div>\n\n          <div flex layout=\"row\" layout-align=\"end center\" layout-margin>\n            <progress-button ng-if=\"vm.isNextStepPayment('addons')\" class=\"md-raised md-primary md-hue-2 md-{{vm.theme}}-theme\" ng-disabled=\"vm.pricingQuoteStarted\" loading=\"vm.pricingQuoteStarted\" on-click=\"vm.goToNextStep('addonsStep')\" spinner=\"3\" label=\"{{vm.nextButtonLabel('addons').label}}\"></progress-button>\n          </div>\n        </div>\n        <md-divider class=\"no-margin\"></md-divider>\n      </div>\n\n      <!--Questions-->\n      <div ng-if=\"vm.questions.length > 0\">\n        <list-item class=\"paymentHeader listItemHeader md-2-line\" ng-disabled=\"guestDetailsForm.$invalid || vm.countAttendeesAdded() < 1\" ng-click=\"vm.toggleQuestions()\">\n          <div layout=\"row\" class=\"list-item-text\" flex>\n            <div layout=\"row\" layout-align=\"start center\" flex>\n              <div layout=\"column\" class=\"\">\n                <div layout=\"row\" layout-align=\"start center\" flex>\n                  <ng-md-icon icon=\"filter_4\" class=\"listIcon listItemHeaderIcon leftIcon\" ng-if=\"vm.addons.length > 0\" size=\"20\"></ng-md-icon>\n                  <ng-md-icon icon=\"filter_3\" class=\"listIcon listItemHeaderIcon leftIcon\" ng-if=\"vm.addons.length == 0\" size=\"20\"></ng-md-icon>\n                  <span class=\"paymentSubTitle\">Booking Questions <i class=\"fa fa-angle-right\" aria-hidden=\"true\"></i> {{vm.bookingQuestionsCompleted()}}/{{vm.questions.length}}</span>\n                </div>\n              </div>\n            </div>\n\n            <div layout=\"row\" layout-align=\"end center\">\n              <div layout=\"column\" layout-align=\"center end\" flex>\n                <ng-md-icon icon=\"{{vm.questionsExpanded ? 'expand_less' : 'expand_more'}}\" class=\"listIcon\"></ng-md-icon>\n              </div>\n            </div>\n          </div>\n        </list-item>\n        <div ng-show=\"vm.questionsExpanded\" ng-class=\"!vm.areBookingQuestionsValid()\" class=\"listItemContentArea\" layout=\"column\">\n          <div flex class=\"questionForm slideDown\">\n            <form name=\"questionForm\" class=\"formContainerQuestions\">\n              <div ng-repeat=\"question in vm.questions\" class=\"listItemInputContainer listItemInputContainerNoMargin\">\n                <div layout=\"column\" layout-align=\"center stretch\" flex>\n                  <label class=\"small-label\">{{question.questionText}}</label>\n                  <div layout=\"row\" layout-align=\"center start\">\n                    <ng-md-icon icon=\"{{vm.bookingQuestions[$index].length > 0 ? 'done' : 'priority_high'}}\" class=\"inputStatusIcon\"></ng-md-icon>\n                    <md-input-container class=\"md-block\" flex>\n                      <textarea name=\"question{{$index}}\" ng-model=\"vm.bookingQuestions[$index]\" minlength=\"2\" maxlength=\"300\" rows=\"1\" ng-required=\"!dashboard\"></textarea>\n                      <div class=\"errors\" ng-messages=\"questionForm['question' + $index].$error\" ng-if=\"screenIsBig()\">\n                        <div ng-message=\"required\">This is required.</div>\n                        <div ng-message=\"minlength\">Must be 2 or more characters long.</div>\n                        <div ng-message=\"maxlength\">Must be 300 or fewer characters long.</div>\n                      </div>\n                      <div class=\"errors\" ng-messages=\"questionForm['question' + $index].$error\" ng-if=\"!screenIsBig()\">\n                        <div ng-message=\"required\">This is required.</div>\n                        <div ng-message=\"minlength\">Must be 2 or more chars.</div>\n                        <div ng-message=\"maxlength\">Must be 300 or fewer chars</div>\n                      </div>\n                    </md-input-container>\n                  </div>\n                </div>\n              </div>\n            </form>\n          </div>\n          <div flex layout=\"row\" layout-align=\"end center\" layout-margin>\n            <span flex style=\"text-align:right;color:red;font-size:12px\" ng-if=\"!dashboard && !vm.areBookingQuestionsValid()\">\n              Please answer all questions before proceeding to payment. Write N/A if a question does not apply \n              <md-checkbox ng-if=\"false\" ng-model=\"vm.answerAllQuestionsChecked\" ng-true-value=\"'yes'\" ng-false-value=\"'no'\" aria-label=\"\"> Answer all question ?\n  </md-checkbox>\n            </span>\n            <progress-button class=\"md-raised md-primary md-hue-2 md-{{vm.theme}}-theme\" ng-disabled=\"!dashboard && !vm.isFinishButtonValid\" loading=\"vm.pricingQuoteStarted\" on-click=\"vm.goToNextStep('paymentStep')\" spinner=\"3\" label=\"{{vm.nextButtonLabel('questions').label}}\"></progress-button>\n          </div>\n        </div>\n        <md-divider class=\"no-margin\"></md-divider>\n      </div>\n\n      <!-- Payment Stripe -->\n      <div class=\"payment-section-form\">\n        <list-item class=\"paymentHeader listItemHeader md-2-line\" ng-disabled=\"!vm.isPaymentValid()\" style=\"border-bottom:1px solid #e0e0e0\">\n          <div layout=\"row\" layout-align=\"start center\" flex=\"80\">\n            <ng-md-icon icon=\"filter_5\" class=\"listIcon listItemHeaderIcon leftIcon\" ng-if=\"vm.addons.length > 0 && vm.questions.length > 0\" size=\"20\"></ng-md-icon>\n            <ng-md-icon icon=\"filter_4\" class=\"listIcon listItemHeaderIcon leftIcon\" ng-if=\"vm.addons.length > 0 && vm.questions.length == 0 || vm.addons.length == 0 && vm.questions.length > 0\" size=\"20\"></ng-md-icon>\n            <ng-md-icon icon=\"filter_3\" class=\"listIcon listItemHeaderIcon leftIcon\" ng-if=\"vm.addons.length == 0 && vm.questions.length == 0\" size=\"20\"></ng-md-icon>\n            <span class=\"paymentSubTitle\">Payment Details</span>\n          </div>\n          <div layout=\"row\" layout-align=\"end center\" flex=\"20\">\n            <div layout=\"column\" layout-align=\"center end\" flex>\n            </div>\n          </div>\n        </list-item>\n        <div ng-show=\"vm.stripePaymentExpanded\" layout=\"column\">\n          <div class=\"listItemContentArea\" layout=\"column\" style=\"border-top: none\">\n            <div flex class=\"radioGroup listItemInputContainer listItemInputContainerNoMargin\" ng-if=\"dashboard\">\n              <md-radio-group ng-model=\"vm.paymentMethod\">\n                <md-radio-button value=\"credit\" ng-if=\"vm.pricing.total.amount > 0\"> Credit Card (Online)</md-radio-button>\n                <md-radio-button ng-if=\"vm.giftcardCodeStatus == 'valid'\" value=\"cash\"> e-Gift Card</md-radio-button>\n                <md-radio-button ng-if=\"vm.giftcardCodeStatus != 'valid'\" value=\"cash\"> Cash</md-radio-button>\n                <md-radio-button value=\"debit\"> Office Point of Sale (POS) </md-radio-button>\n                <md-radio-button value=\"gift\"> Gift Card </md-radio-button>\n                <md-radio-button value=\"transfer\"> Bank Transfer </md-radio-button>\n                <md-radio-button value=\"reserved\"> Reservation - Pay Later </md-radio-button>\n              </md-radio-group>\n            </div>\n            <div flex layout=\"row\" layout-align=\"end center\" layout-margin ng-if=\"vm.paymentMethod != 'credit' && dashboard\">\n              <progress-button class=\"md-raised md-primary md-hue-2\" ng-disabled=\"vm.countAttendeesAdded() < 1\" loading=\"bookingSuccessResponse == 'processing'\" on-click=\"vm.submitNonCreditCardBooking()\" spinner=\"3\" label=\"{{vm.paymentMethod == 'reserved' ? 'Reserve' : 'Pay' }} {{ (vm.pricing.total.amount || 0) | ablCurrency: vm.currency }}\"></progress-button>\n            </div>\n            <div flex layout=\"row\" layout-align=\"end center\" layout-margin ng-if=\"vm.paymentMethod == 'credit' && dashboard\">\n              <progress-button class=\"md-raised md-primary md-hue-2\" ng-disabled=\"vm.countAttendeesAdded() < 1\" loading=\"bookingSuccessResponse == 'processing'\" on-click=\"vm.goToPay()\" spinner=\"3\" label=\"{{vm.paymentMethod == 'reserved' ? 'Reserve' : 'Pay' }} {{ (vm.pricing.total.amount || 0) | ablCurrency: vm.currency }}\"></progress-button>\n            </div>\n            \n            <div flex ng-if=\"!dashboard\">\n              <md-card class=\"transparent no-margin\" ng-show=\"vm.showPaymentForm && paymentResponse.length < 1\">\n                <div ng-if=\"vm.loadingIframe\" layout=\"row\" layout-align=\"space-around center\" style=\"padding:20px\">\n                  <md-progress-circular md-mode=\"indeterminate\"></md-progress-circular>\n                </div>\n                <iframe id=\"paymentIframe\"></iframe>\n              </md-card>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n</md-content>\n";

/***/ }),
/* 201 */
/***/ (function(module, exports) {

	module.exports = "<div flex layout=\"column\">\n  <!-- For Dashboard -->\n  <div ng-if=\"dashboard && paymentResponse.length == 0\" flex ng-include=\"'dashboard.html'\" layout=\"column\"></div>\n  <!-- For Dashboard -->\n  \n  <!-- For No Dashboard -->\n   <div ng-if=\"!dashboard && paymentResponse.length == 0\" flex ng-include=\"'no-dashboard.html'\" layout=\"column\"></div>\n  <!-- For No Dashboard -->\n  \n  <!-- Response -->\n  <div flex ng-show=\"paymentResponse.length > 0\" class=\"paymentResponseContainer\" layout=\"column\">\n    <div flex layout=\"column\" class=\"paymentSummaryCardResponse\">\n      <div flex ng-if=\"paymentResponse == 'success'\" class=\"easeIn\">\n        <div class=\"paymentHeader md-2-line md-primary\" ng-mouseleave=\"addOnsHover = 0\" ng-mouseenter=\"addOnsHover = 1\" ng-init=\"addOnsHover=0\">\n          <div layout=\"row\" class=\"md-list-item-text\" flex>\n            <div flex layout=\"row\" layout-align=\"start center\" md-colors=\"{color: 'default-primary'}\">\n              <ng-md-icon class=\"listItemHeaderIcon listIcon\" style=\"height: 24px;width: 24px\" icon=\"payment\"></ng-md-icon>\n              <span class=\"paymentSubTitle total\" style=\"margin-left: 8px\">{{bookingSuccessResponse.data.booking.status == 'unpaid' ? 'Booking' : 'Payment'}} Complete</span>\n            </div>\n            <div layout=\"column\" flex=\"none\" style=\"width:24px\">\n              <ng-md-icon flex=\"none\" style=\"width:24px;height:24px;margin: inherit;\" icon=\"check\" class=\"listIcon\" ng-style=\"{fill: 'green'}\"></ng-md-icon>\n            </div>\n          </div>\n        </div>\n        <div class=\"paymentBody\">\n          <div class=\"confirmation\" ng-if=\"dashboard\">\n            <h3>Congratulations!</h3>\n            <p>Your {{bookingSuccessResponse.data.booking.status == 'unpaid' ? 'reservation' : 'booking'}} is confirmed.</p>\n            <p>{{vm.formData.fullName}} is attending {{bookingSuccessResponse.data.booking.title}} on {{formatDate(bookingSuccessResponse.data.booking.startTime, 'LL')}}</p>\n            <p>A confirmation email will be sent to {{bookingSuccessResponse.data.booking.organizations[0].primaryContact.email}}</p>\n            <div class=\"booking-id\">The reference ID is: {{bookingSuccessResponse.data.booking.bookingId}}</div>\n            <div layout=\"row\" layout-align=\"center center\">\n              <span flex>\n                <md-button class=\"md-raised md-primary\" ng-click=\"vm.returnToMainPage()\">Return</md-button>\n              </span>\n            </div>\n          </div>\n          <div class=\"confirmation\" ng-if=\"!dashboard\">\n            <h3>Congratulations!</h3>\n            <p>Your booking is confirmed.</p>\n            <p>You will receive a confirmation email at: <strong>{{vm.formData['mail']}}</strong></p>\n            <p class=\"margin-top\">For questions about your booking, please contact:</p>\n            <p><strong>{{bookingSuccessResponse.data.booking.organizations[0].companyName}} ({{bookingSuccessResponse.data.booking.organizations[0].primaryContact.phoneNumber}})</strong></p>\n            <p><strong>{{bookingSuccessResponse.data.booking.organizations[0].primaryContact.email}}</strong></p>\n            <div class=\"booking-id\">Booking ID: {{bookingSuccessResponse.data.booking.bookingId}}</div>\n            <div style=\"margin-top:25px\" layout=\"row\" layout-align=\"center center\">\n              <span flex>\n                <md-button class=\"md-raised md-primary\" ng-click=\"vm.returnToMainPage()\">Return</md-button>\n              </span>\n            </div>\n          </div>\n        </div>\n      </div>\n  \n      <div flex ng-if=\"paymentResponse == 'failed'\">\n        <div class=\"paymentHeader md-2-line md-primary\" ng-mouseleave=\"addOnsHover = 0\" ng-mouseenter=\"addOnsHover = 1\" ng-init=\"addOnsHover=0\">\n          <div layout=\"row\" class=\"md-list-item-text\" flex>\n            <div flex layout=\"row\" layout-align=\"start center\" md-colors=\"{color: 'default-primary'}\">\n              <ng-md-icon class=\"listItemHeaderIcon\" icon=\"payment\" class=\"listIcon \"></ng-md-icon>\n              <span class=\"paymentSubTitle total\">Payment Failed</span>\n            </div>\n            <div layout=\"column\" flex=\"none\" style=\"width:24px\">\n              <ng-md-icon flex=\"none\" style=\"width:24px;height:24px;margin: inherit;\" icon=\"error\" class=\"listIcon\" ng-style=\"{fill: 'red'}\"></ng-md-icon>\n            </div>\n          </div>\n        </div>\n  \n        <div class=\"paymentBody\">\n          <div class=\"confirmation\">\n            <p>Your credit card has been declined. Please confirm the information you provided is correct and try again.</p>\n            <div style=\"margin-top:25px\" layout=\"row\" layout-align=\"center center\">\n              <span flex>\n                <md-button class=\"md-raised md-primary\" ng-click=\"vm.payNow()\">Try Again</md-button>\n              </span>\n            </div>\n          </div>\n        </div>\n      </div>\n  \n      <div flex ng-if=\"paymentResponse == 'processing'\">\n        <div class=\"paymentHeader md-2-line md-primary\" ng-mouseleave=\"addOnsHover = 0\" ng-mouseenter=\"addOnsHover = 1\" ng-init=\"addOnsHover=0\">\n          <div layout=\"row\" class=\"md-list-item-text\" flex>\n            <div flex layout=\"row\" layout-align=\"start center\" md-colors=\"{color: 'default-primary'}\">\n              <ng-md-icon class=\"listItemHeaderIcon\" icon=\"payment\" class=\"listIcon \"></ng-md-icon>\n              <span class=\"paymentSubTitle total\">Payment Processing</span>\n            </div>\n            <div layout=\"column\" flex=\"none\" style=\"width:24px\">\n              <ng-md-icon flex=\"none\" style=\"width:24px;height:24px;margin: inherit;\" icon=\"watch_later\" class=\"listIcon\" ng-style=\"{fill: 'red'}\"></ng-md-icon>\n            </div>\n          </div>\n        </div>\n  \n        <div class=\"paymentBody\">\n          <div class=\"confirmation\">\n            <p>Your booking payment is still processing. An e-mail will be sent to {{vm.formData.mail }} with details about your reservation.</p>\n            <div style=\"margin-top:25px\" layout=\"row\" layout-align=\"center center\">\n              <span flex>\n                <md-button class=\"md-raised md-primary\" ng-click=\"goToState('home')\">Return</md-button>\n              </span>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n  \n</div>";

/***/ }),
/* 202 */
/***/ (function(module, exports) {

	module.exports = "<div flex layout=\"column\">\n  <!-- Desktop -->\n  <div flex ng-if=\"screenIsBig()\" layout=\"row\" class=\"activityBookDialogLargeNew\" ng-show=\"(paymentResponse.length <= 0 && !vm.showPaymentForm) || (!dashboard && paymentResponse.length <= 0)\">\n    <div flex layout=\"column\">\n      <div class=\"left-panel\" flex ng-include=\"'activity-forms.html'\" layout=\"column\"></div>\n    </div>\n    <div flex layout=\"column\">\n      <div flex ng-include=\"'activity-total.html'\" layout=\"column\"></div>\n    </div>\n  </div>\n  \n  <!-- Mobile -->\n  <div flex ng-if=\"!screenIsBig()\" class=\"activityBookDialogLargeNew\" ng-show=\"(paymentResponse.length <= 0 && !vm.showPaymentForm) || (!dashboard && paymentResponse.length <= 0)\">\n    <div layout=\"column\">\n      <div flex ng-include=\"'activity-forms.html'\" layout=\"column\"></div>\n    </div>\n    <div layout=\"column\">\n      <div flex ng-include=\"'activity-total.html'\" layout=\"column\"></div>\n    </div>\n  </div>\n  \n  <md-card flex layout=\"column\" style=\"min-height: 350px\" ng-show=\"vm.showPaymentForm && paymentResponse.length < 1\">\n    <div flex layout=\"column\" layout-align=\"center center\" ng-if=\"vm.paymentFormIsLoading\">\n      <md-progress-circular md-mode=\"indeterminate\" md-diameter=\"40\"></md-progress-circular>\n    </div>\n    <iframe id=\"paymentIframe\"></iframe>\n  </md-card>\n</div>";

/***/ }),
/* 203 */
/***/ (function(module, exports) {

	module.exports = "<div flex layout=\"column\">\n  <!-- Desktop -->\n  <div class=\"payment-icons-bar\" flex=\"none\" layout=\"row\" layout-align=\"center center\">\n    <div flex style=\"height:32px\">\n      <img class=\"payment-icons-bar-left\" src=\"https://s3.amazonaws.com/assets.ablsolution.com/Dashboard/ablpay2.png\" />\n    </div>\n    <div flex style=\"text-align:right\">\n      <img class=\"payment-icons-bar-right\" src=\"https://s3.amazonaws.com/assets.ablsolution.com/Dashboard/paylock.png\" />\n    </div>\n  </div>\n  <div flex ng-if=\"screenIsBig()\" layout=\"row\" class=\"activityBookDialogLargeNew\" ng-show=\"(paymentResponse.length <= 0 && !vm.showPaymentForm) || (!dashboard && paymentResponse.length <= 0)\">\n    <div flex layout=\"column\">\n      <div class=\"left-panel-no-dashboard\" flex ng-include=\"'activity-forms.html'\" layout=\"column\"></div>\n    </div>\n    <div flex layout=\"column\" class=\"rightCheckoutPanel\">\n      <div flex ng-include=\"'activity-total.html'\" layout=\"column\"></div>\n    </div>\n  </div>\n  \n  <!-- Mobile -->\n  <div flex ng-if=\"!screenIsBig()\" class=\"activityBookDialogLargeNew\" ng-show=\"(paymentResponse.length <= 0 && !vm.showPaymentForm) || (!dashboard && paymentResponse.length <= 0)\">\n    <div>\n      <div class=\"left-panel-no-dashboard\" flex ng-include=\"'activity-forms.html'\" layout=\"column\"></div>\n    </div>\n    <div class=\"rightCheckoutPanel\">\n      <div flex ng-include=\"'activity-total.html'\" layout=\"column\"></div>\n    </div>\n  </div>\n  \n</div>";

/***/ }),
/* 204 */
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
/* 205 */
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

/***/ }),
/* 206 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _pricingQuote = __webpack_require__(207);

	var _pricingQuote2 = _interopRequireDefault(_pricingQuote);

	var _activity = __webpack_require__(208);

	var _activity2 = _interopRequireDefault(_activity);

	var _event = __webpack_require__(209);

	var _event2 = _interopRequireDefault(_event);

	var _timeslot = __webpack_require__(210);

	var _timeslot2 = _interopRequireDefault(_timeslot);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var $ablMock = {
	    activity: _activity2.default,
	    event: _event2.default,
	    timeslot: _timeslot2.default,
	    'pricing-quote': _pricingQuote2.default
	};

	window.$ablMock = $ablMock;

/***/ }),
/* 207 */
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

/***/ }),
/* 208 */
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
/* 209 */
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
/* 210 */
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

/***/ })
]);