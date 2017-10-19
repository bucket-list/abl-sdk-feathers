//  Build our app module, with a dependency on the new angular module.
const app = angular.module('sampleapp', [
  'ui.router',
  'ngAnimate',
  'ngMaterial',
  'rx',
  'ngMdIcons',
  'abl-sdk-feathers',
  'activity-book'
]);

import ab from './activity/book';
import quote from './pricing-quote';

app.controller('addBookingController', ab);

app.controller('SampleController', [
  '$scope',
  '$rootScope',
  '$abl',
  'rx',
  'observeOnScope',
  '$http',
  function ($scope, $rootScope, $abl, rx, observeOnScope, $http) {
    const vm = this;
    console.log('pricing quote', quote);

    $scope.numValue = 1;
    $scope.chargeGroup = [
      {
        "quantity": 1,
        "name": "an addon",
        "price": "75.00"
      }
    ];
    $scope.$watch('numValue', function (newValue, old) {
      console.log('numValue change', newValue, old);
    });
    $scope.search = 'toronto';

    $scope.testFunction = function () {
      console.log('testFunction');
    }

    console.log($abl);
    const p = {
      "fullName": "Adam"
    }

    //Observable function
    function searchCache(term) {
      const query = {
        'clients': {
          $lte: term
        }
      }

      console.log('query', term);
      return rx
        .Observable
        .fromPromise($abl.services.cache.find({query}))
        .map(function (response) {
          console.log('response', response);

          return response;
        });
    }

    $scope.results = [];
    /*
      Creates a "click" function which is an observable sequence instead of just a function.
    */
    $scope
      .$createObservableFunction('click')
      .map(function () {
        return $scope.search;
      })
      .flatMapLatest(searchCache)
      .subscribe(function (results) {
        $scope.results = results;
        console.log(results);
      });

    // Observe and debounce an object on the $scope, can be used on a search input
    // for example to wait before auto-sending the value
    observeOnScope($scope, 'search')
      .debounce(500)
      .select(function (response) {
        return response.newValue;
      })
      .flatMap(searchCache)
      .subscribe(function (res) {
        console.log('search res', res);
      });

    //Unsubscribe observables on $scope destruction
    $scope.$on('$destroy', function () {

      vm
        .testService
        .unsubscribe();
      vm.testService = null;

      console.log('controller $destroy');
    });

  }
])
  .config(function ($ablProvider, $sceDelegateProvider, $httpProvider, $feathersProvider) {

    $ablProvider.setEndpoint('https://api.ablist.win');
    $ablProvider.useSocket(false);
    console.log($ablProvider.getSettings());
    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};
    $httpProvider.defaults.headers.get = {};
    $sceDelegateProvider.resourceUrlWhitelist([
      // Allow loading from our assets domain. **.
      'localhost/**',
      'http://en.wikipedia.org/**'
    ]);

  })
  .run(function ($rootScope) {
    $rootScope.config = {};
  });