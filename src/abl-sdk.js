angular.module('abl-sdk-feathers', [])
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
            $get: ['$injector', '$timeout', '$log',
                function($injector, $timeout, $log, $mdToast) {
                    var $rootScope = $injector.get('$rootScope');
                    
                    $rootScope.loading = true;
                    this.loadingTimeout = null;
                        
                    console.log('test');
                    //Add timeout
                    $rootScope.afterRender = function(current, total) {
                        //$log.debug('after render', current, total,  Math.round(current/total * 100));
                        $timeout.cancel(this.loadingTimeout);
                        this.loadingTimeout = $timeout(function() {
                            //$log.debug('loading', $rootScope.loading);
                            $rootScope.loading = false;
                        }, 1500);      
                    };
                    
                    
                    $rootScope.showToast = function(msg, toastClass, delay) {
                        if(!toastClass)
                        var toastClass = '';
                        if(!delay)
                        var delay = 3000;
                        
                        var toast = $mdToast.simple()
                                .textContent(msg)
                                .action('Hide')
                                .hideDelay(delay)
                                .position('bottom left')
                                .highlightAction(false)
                                .toastClass(toastClass);	
                        $mdToast.show(toast);
                        $log.debug('showToast ', toastClass, msg);
                        };
                    
                    //Show indeterminate loading animation for all state changes
                    $rootScope.$on('$stateChangeStart', 
                        function(event, toState, toParams, fromState, fromParams){
                        //Show loading only for higher level parent states..
                        // if(toState.name.split('.').length < 2)
                            $rootScope.loading = true;
                    });
                    
                    //Stop loading animation after state load success
                    $rootScope.$on('$stateChangeSuccess', 
                        function(event, toState, toParams, fromState, fromParams){
                        if($rootScope.loading)
                            $rootScope.afterRender();
                    });
                    
                    this.app = feathers()
                        .configure(feathers.hooks())
                    
                    if (useSocket) {
                        this.socket = io(endpoint, socketOpts)
                        this.app.configure(feathers.socketio(this.socket))
                    } else {
                        this.app.configure(feathers.rest(endpoint).jquery(window.jQuery))
                    }
                    
                    this.app.configure(feathers.authentication({
                        storage: authStorage
                    }));
                    

                    return this.app
                }
            ]
        }
    }
])
.directive('afterRender', ['$timeout', function ($timeout) {
    var def = {
        restrict: 'A',
        terminal: true,
        transclude: false,
        link: function (scope, element, attrs) {
                            $timeout(scope.$eval(attrs.afterRender), 1000);  //Calling a scoped method
        }
    };
    return def;
}]);