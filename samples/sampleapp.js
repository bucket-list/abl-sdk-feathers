//  Build our app module, with a dependency on the new angular module.
var app = angular.module('sampleapp', ['abl-sdk-feathers', 'ngAnimate', 'ngMaterial']);

app.config(function($feathersProvider) {

    $feathersProvider.setEndpoint('https://api.ablist.win');

    // You can optionally provide additional opts for socket.io-client
    //$feathersProvider.setSocketOpts(options);
    $feathersProvider.setServices(['properties','units']);
    $feathersProvider.useSocket(false);

})
.controller('SampleController', ['$scope', '$feathers', function($scope, $feathers) {

  $scope.yesNoResult = null;
  $scope.complexResult = null;
  $scope.customResult = null;


}]);
