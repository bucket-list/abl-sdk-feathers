# abl-sdk-feathers

1. [About](#about)
2. [Usage](#usage)
    * [AngularJS](#angularjs) 
    * [React](#react)
    * [Services](#services)
    * [Querying](#querying)
    * [Utilities](#utilities)
3. [Developing](#developing)

## About
ABL's client-side API middleware based on the [Feathers.js](https://docs.feathersjs.com/) client. The following modules are included:

- [feathers-client](https://github.com/feathersjs/feathers) as `$abl` global
- [feathers-hooks](https://github.com/feathersjs/feathers-hooks)
- [feathers-rest](https://github.com/feathersjs/feathers-rest) 
- [feathers-socketio](https://github.com/feathersjs/feathers-socketio)
- [feathers-reactive](https://github.com/feathersjs/feathers-reactive) returns all service methods as [RxJS](https://github.com/Reactive-Extensions/RxJS) observables that automatically update on [real-time events](http://docs.feathersjs.com/real-time/events.html).

## Usage
Reference the minified scripts in index.html:

```html
<script src="node_modules/abl-sdk-feathers/dst/abl-sdk.vendor.min.js"></script>
<script src="node_modules/abl-sdk-feathers/dst/abl-sdk.min.js"></script>
```

Specify the abl-sdk-feathers module as a dependency of your AngularJS application:

```js
var app = angular.module('abl', ['abl-sdk-feathers']);
```

Configure the $ablProvider service
```js
app.config(function($ablProvider) {
    // Set the API endpoint for all requests
    $ablProvider.setEndpoint('https://api.ablist.win');
    //Set the API key to be added to REST headers for all outgoing requests
    $ablProvider.setApiKey('sk3$dlkj3Dljk3');
    // Use sockets with REST fallback
    $ablProvider.useSocket(false);
    // You can optionally provide additional opts for socket.io-client
    $ablProvider.setServices(['properties','units']);
});
```

### AngularJS 
Inject the $abl service into any controller, service or directive where you need it:
```js
app.controller('SampleController', ["$scope", "$abl", function($scope, $abl) {
  // As a Promise
  var activities = $abl.services.activities.find({})
                    .then(function(res) { 
                      console.log(res);}
                    ); 
  // As an Observable
  var activities = $abl.services.activities.find({})
                    .subscribe(function(res) { 
                      console.log(res);}
                    )); 
}]);
```

### React
The abl-sdk-feathers instance is accessible via the global variable ```$abl``` so usage is exactly the same:
```js
function findActivities(query) {  
  // As a Promise
  $abl.services.activities.find(query)
    .then(function(res) { 
        return res;
      }
  ); 
  // As an Observable
  $abl.services.activities.find(query)
    .subscribe(function(res) { 
        return res;
      }
  )); 
}
```

### Services

Services are the heart of every Feathers application and JavaScript objects (or instances of [ES6 classes](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes)) that implements [certain methods](#service-methods). Feathers itself will also add some [additional methods and functionality](#feathers-functionality) to its services.

See the Feathers.js [services documentation](https://docs.feathersjs.com/api/services.html) for more detail. 

### Service methods

Service methods are pre-defined [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) methods that your service object can implement. Below is a complete example of the Feathers *service interface*:

```js
const myService = {
  find(params) {},
  get(id, params) {},
  create(data, params) {},
  update(id, data, params) {},
  patch(id, data, params) {},
  remove(id, params) {},
  setup(app, path) {}
}

$abl.use('/my-service', myService);
```

Or as an [ES6 class](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes):

```js
'use strict';

class MyService {
  find(params) {}
  get(id, params) {}
  create(data, params) {}
  update(id, data, params) {}
  patch(id, data, params) {}
  remove(id, params) {}
  setup(app, path) {}
}

$abl.use('/my-service', new MyService());
```

### Querying

See the Feathers.js [querying documentation](https://docs.feathersjs.com/api/databases/querying.html#) for more detail. 
```js
// Find all unread messages in room #2
$abl.service('messages').find({
  query: {
    read: false,
    roomId: 2
  }
});
```
```
GET /messages?read=false&roomId=2
```

### Utilities

##### $abl.showToast(message, *cssClass*, *duration*)
Launch an Angular Material toast with an optional CSS class and display duration:
```js
$abl.showToast('Something OK happened. Nothing to see here!');
```
```js
$abl.showToast('Error! You have been bad!', 'errorToast', 5000);
```

## Developing

To work with the code, just run:

```
npm install && gulp
```

## Build

```
gulp build
```

