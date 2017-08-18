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
     export default function navigatorService($window, $q) {

         function getCurrentPosition() {
             var deferred = $q.defer();

             if (!$window.navigator.geolocation) {
                 deferred.reject('Geolocation not supported.');
             } else {
                 $window.navigator.geolocation.getCurrentPosition(
                     function (position) {
                         deferred.resolve(position);
                     },
                     function (err) {
                         deferred.reject();
                     });
             }

             return deferred.promise;
         }

         return {
             getCurrentPosition: getCurrentPosition
         };

     }