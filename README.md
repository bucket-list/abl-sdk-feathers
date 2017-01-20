abl-sdk-feathers
=====================

[![Build Status](https://secure.travis-ci.org/dwmkerr/angular-modal-service.png?branch=master)](https://travis-ci.org/dwmkerr/angular-modal-service)
[![Coverage Status](https://coveralls.io/repos/dwmkerr/angular-modal-service/badge.png?branch=master)](https://coveralls.io/r/dwmkerr/angular-modal-service?branch=master)
[![Dependencies](https://david-dm.org/dwmkerr/angular-modal-service.svg?theme=shields.io)](https://david-dm.org/dwmkerr/angular-modal-service)
[![Dev Dependencies](https://david-dm.org/dwmkerr/angular-modal-service/dev-status.svg?theme=shields.io)](https://david-dm.org/dwmkerr/angular-modal-service#info=devDependencies)

1. [Usage](#usage)
2. [Developing](#developing)
3. [Tests](#tests)

Reference the minified script in index.html:

```html
<script src="node_modules/abl-sdk-feathers/dst/abl-sdk.min.js"></script>
```

Specify the modal service as a dependency of your application:

```js
var app = angular.module('abl', ['abl-sdk-feathers']);
```

Configure the $feathersProvider service
```js
app.config(function($feathersProvider) {

    $feathersProvider.setEndpoint('https://api.ablist.win');
    
    // You can optionally provide additional opts for socket.io-client
    //$feathersProvider.setSocketOpts(options);
    $feathersProvider.setServices(['properties','units']);
    $feathersProvider.useSocket(false);

});


Now just inject the service into any controller, service or directive where you need it.

```js
app.controller('SampleController', ["$scope", "$feathers", function($scope, $feathers) {

  var properties = $feathers.services.properties.find({}); // Returns all properties from properties service

}]);
```

## Developing

To work with the code, just run:

```
npm install
npm run test
npm run start
```

The dependencies will install, the tests will be run (always a useful sanity check after a clean checkout) and the code will run. You can open the browser at localhost:8080 to see the samples. As you change the code in the `src/` folder, it will be re-built and the browser will be updated.

The easiest way to adapt the code is to play with some of the examples in the ``samples`` folder.

## Build

Build the minified module with:

```
npm run build
```


## Tests

Run tests with:

```
npm run test
```

A coverage report is written to `build\coverage`.

Debug tests with:

```
npm run test-debug
```

This will run the tests in Chrome, allowing you to debug.
