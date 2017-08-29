import activity from './activity';
import timeslot from './timeslot';
import event from './event';

// activityBook.$inject = ['$scope'];

export default function activityBook($scope) {
    var vm = this;
    $scope.activity = activity;
    $scope.timeslot = timeslot;
    $scope.event = event;
}