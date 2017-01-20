angular
  .module('abl-sdk-feathers', [])
  .factory()
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
            
            //Register services set in configuration
            if(services.length > 0) {
             for(var i=0; i < services.length; i++) {
                console.log('add service', services[i]);
                this.app.service(services[i]);
              }; 
            }
          
            return this.app
          }
        ]
      }
    }
  ]);