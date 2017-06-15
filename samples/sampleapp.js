//  Build our app module, with a dependency on the new angular module.
var app = angular.module('sampleapp', ['abl-sdk-feathers', 'ngAnimate', 'ngMaterial', 'rx']);

app.config(function ($ablProvider, $sceDelegateProvider, $httpProvider) {

    //$ablProvider.setEndpoint('https://api.ablist.win');

    // You can optionally provide additional opts for socket.io-client
    //$feathersProvider.setSocketOpts(options);
    //$ablProvider.setServices(['mocks']);
    //$ablProvider.useSocket(true);

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
  .controller('SampleController', ['$scope', '$abl', 'rx', 'observeOnScope', '$http', function ($scope, $abl, rx, observeOnScope, $http) {
    const vm = this;
    $scope.yesNoResult = null;
    $scope.complexResult = null;
    $scope.customResult = null;


    $scope.search = 'toronto';

    //Observable function
    function searchWikipedia(term) {
      return rx.Observable
        .fromPromise($http({
          url: "http://en.wikipedia.org/w/api.php?",
          jsonpCallbackParam: 'callback',
          method: "jsonp",
          params: {
            action: "opensearch",
            search: term,
            format: "json"
          }
        }))
        .map(function (response) {
          return response.data[1];
        });
    }

    $scope.results = [];

    /*
      Creates a "click" function which is an observable sequence instead of just a function.
    */
    $scope.$createObservableFunction('click')
      .map(function () {
        return $scope.search;
      })
      .flatMapLatest(searchWikipedia)
      .subscribe(function (results) {
        $scope.results = results;
        console.log(results);
      });

    //Observe and debounce an object on the $scope, can be used on 
    //a search input for example to wait before auto-sending the value
    observeOnScope($scope, 'search')
      .debounce(500)
      .select(function (response) {
        return response;
      })
      .subscribe(function (change) {
        console.log('search value', change);
      });


    // $scope.testService = $abl.service('mock');

    // vm.observer = Rx.Observer.create(
    //   function (x) {
    //     console.log('Next: ', x);
    //   },
    //   function (err) {
    //     console.log('Error: %s', err);
    //   },
    //   function () {
    //     console.log('Completed');
    //   });

    // //Find all documents and emit a new list every time anything changes
    // vm.testDocuments = $scope.testService.find()
    //   .throttleTime(5000)
    //   .subscribe(vm.observer);

    // //Observe a document by id in a remote feathers service
    // vm.testService = $scope.testService.get('0029bbbd-cb4b-45de-b09f-ec2aca054bcb')
    //   .throttleTime(2000)
    //   .filter(message => message.text != $scope.message)
    //   .subscribe(
    //     function (message) {
    //       console.log('document changed', message);
    //       $scope.message = message.text;
    //       $scope.safeApply();
    //     }
    //   );

    //Unsubscribe observables on $scope destruction
    $scope.$on('$destroy', function () {

      vm.testService.unsubscribe();
      vm.testService = null;

      console.log('controller $destroy');
    });

  }]);