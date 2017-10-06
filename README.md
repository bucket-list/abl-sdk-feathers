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
```

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


## $ablDB Cache Usage

Normally, and as a recommendation, you have only one indexedDB per app.
Thus in your `app.js` where you define your module, you do:

```javascript
  .config(function ($ablDBProvider) {
    $ablDBProvider
      .connection('myablDB')
      .upgradeDatabase(1, function(event, db, tx){
        var objStore = db.createObjectStore('people', {keyPath: 'ssn'});
        objStore.createIndex('name_idx', 'name', {unique: false});
        objStore.createIndex('age_idx', 'age', {unique: false});
      });
  });
```
The connection method takes the databasename as parameter,
the upgradeCallback has 3 parameters:
function callback(event, database, transaction). AngularJS-ablDB supports incremental
upgrades.  Simply define what to do for each version incrementally:
```javascript
angular.module('myModuleName', ['ablDB'])
  .config(function ($ablDBProvider) {
    $ablDBProvider
      .connection('myablDB')
      .upgradeDatabase(1, function(event, db, tx){
        var objStore = db.createObjectStore('people', {keyPath: 'ssn'});
        objStore.createIndex('name_idx', 'name', {unique: false});
        objStore.createIndex('age_idx', 'age', {unique: false});
      });
      .upgradeDatabase(2, function(event, db, tx){
        db.createObjectStore('peoplePhones', {keyPath: 'person_ssn'});
      });
  });
```
When upgrade is required only the migrations which have not been run yet will be run.
For upgrading your db structure, see 
https://developer.mozilla.org/en-US/docs/IndexedDB/Using_IndexedDB.

You can also define your own error handlers, overwriting the default ones, which log to console.


Inside your controller you use `$ablDB` like this:

```javascript
angular.module('myModuleName')
  .controller('myControllerName', function($scope, $ablDB) {
    
    $scope.objects = [];
        
    $ablDB.openStore('people', function(store){
    
      store.insert({"ssn": "444-444-222-111","name": "John Doe", "age": 57}).then(function(e){...});
    
      store.getAll().then(function(people) {  
        // Update scope
        $scope.objects = people;
      });
    });
  });
```

## openStore

When you open a store a transaction is created for all of your actions against that store
you receive a promise for each operation within your transaction and also for the transaction
as a whole as the result of "openStore".  The transaction resolves successfully after state
has been fully persisted.

## store operations

The following operations are allowed on a store..

* getAllKeys - Returns all the primary keys on the store
```javascript
    $ablDB.openStore('people', function(store){
      store.getAllKeys().then(function(e){
        $scope.primaryKeys = e;
      });
    });
```
* clear - Deletes all items from the store
```javascript
    $ablDB.openStore('people', function(store){
      store.clear().then(function(){
        // do something
      });
    });
```
* delete - Deletes a single item from the store
```javascript
    $ablDB.openStore('people', function(store){
      store.delete($scope.personID).then(function(){
        // do something
      });
    });
```
* upsert - Upserts an item or list of items in the store
```javascript
    // build photo array to upsert
    var addToPhotos = [];
    for(var j=0; j < file.length; j++){
        var photo = {"topicID": $scope.topicID, "filetype": file[j].filetype, "content": file[j].base64}
        addToPhotos.push(photo);
    }
    
    $ablDB.openStore('people', function(store){
      
      // multiple items
      store.upsert(addToPhotos).then(function(e){
        // do something
      });
      
      // single item
      store.upsert({"id": $scope.topicID, "name": $scope.topicName}).then(function (e) {
        // do something
      });
    });
```
* insert - Inserts an item or list of items in the store
```javascript
    // build photo array to upsert
    var addToPhotos = [];
    for(var j=0; j < file.length; j++){
        var photo = {"topicID": $scope.topicID, "filetype": file[j].filetype, "content": file[j].base64}
        addToPhotos.push(photo);
    }
    
    $ablDB.openStore('people', function(store){
      
      // multiple items
      store.insert(addToPhotos).then(function(e){
        // do something
      });
      
      // single item
      store.insert({"id": $scope.topicID, "name": $scope.topicName}).then(function (e) {
        // do something
      });
    });
```
* getAll - Returns all items in the store
```javascript
    $ablDB.openStore('people', function(store){
      store.getAll().then(function(topics) {  
        // Update scope
        $scope.topics = topics;
      });
    });
```
* each - iterates over all items in the store
* eachBy - iterates over all items in the store using a named index.
* eachWhere - uses the query() to execute a find against the store
```javascript
$ablDB.openStore('photos', function(photos){
  // build query
  var find = photos.query();
  find = find.$eq($scope.topicID);
  find = find.$index("topicID_idx");
  
  // update scope
  photos.eachWhere(find).then(function(e){
      $scope.photos = e;
  });
});
```
* findWhere - an alias for eachWhere
* count - returns a count of all the items
```javascript
    $ablDB.openStore('people', function(store){
      store.count().then(function(e){
        $scope.count = e;
      });
    });
```
* find - returns a single item from the store
```javascript
$ablDB.openStore('photos', function(photos){
  photos.find($scope.key).then(function(e){
      $scope.photo = e;
  });
});
```
* findBy - searches a particular index for an item
```javascript
$ablDB.openStore('photos', function(photos){
  photos.findBy($scope.indexName, $scope.key).then(function(e){
      $scope.photo = e;
  });
});
```
* query - builds a new query obect for use against eachWhere
```javascript
var find = photos.query();
find = find.$eq($scope.topicID);
find = find.$index("topicID_idx");

// available query functions
  $lt(value) - less than
  $gt(value) - greater than
  $lte(value) - less than or equal
  $gte(value) - greater than or equal
  $eq(value) - equal
  $between(lower, upper, doNotIncludeLowerBound? true/false, doNotIncludeUpperBound true/false) - between two bounds
  $desc(unique) - descending order
  $asc(unique) - ascending order
  $index(value) - name of index
```