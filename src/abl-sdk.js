import indexedDB from '../src/ng-indexed-db.js';

angular
  .module('abl-sdk-feathers', [indexedDB])
  .config(function ($indexedDBProvider) {
    $indexedDBProvider
      .connection('ablDB')
      .upgradeDatabase(1, function(event, db, tx){
        var objStore = db.createObjectStore('people', {keyPath: 'ssn'});
        objStore.createIndex('name_idx', 'name', {unique: false});
        objStore.createIndex('age_idx', 'age', {unique: false});
      });
  })
  .provider('$feathers', [
    function $feathersProvider() {
      //OK this works and we can still keep configuring it the same way we were before :) 
      //muy bien
      var endpoint = null
      var socketOpts = null
      var useSocket = true
      var authStorage = window.localStorage
      var services = [];

      //Configuration
      return {
        setAuthStorage: function(newAuthStorage) {
          authStorage = newAuthStorage
        },
        setSocketOpts: function(opts) {
          socketOpts = opts
        },
        useSocket: function(socketEnabled) {
          useSocket = !!socketEnabled
        },
        setEndpoint: function(newEndpoint) {
          endpoint = newEndpoint
        },
        setServices: function(newServices) {
          services = newServices
        },
        $get: [
          function() {
            this.app = feathers()
              .configure(feathers.hooks())

            if (useSocket) {
              this.socket = io(endpoint, socketOpts)
              this.app.configure(feathers.socketio(this.socket))
            }
            else {
              this.app.configure(feathers.rest(endpoint).jquery(window.jQuery))
            }

            this.app.configure(feathers.authentication({
              storage: authStorage
            }));
            
            //Register services set in $feathersProvider configuration
            if(services.length > 0) {
             for(var i=0; i < services.length; i++) {
                this.app.service(services[i]);
              }; 
            }
          
            return this.app
          }
        ]
      }
    }
  ]);

