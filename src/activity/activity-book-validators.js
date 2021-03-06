export default function activityBookValidator(vm, $http, $stateParams) {


    vm.searchClients = function (query) {
        return Rx.Observable
            .fromPromise($http({
                method: 'GET',
                url: vm.config.apiVersion + "/clients?fullName=" + text,
                headers: {
                    'x-abl-access-key': $stateParams.merchant,
                    'x-abl-date': Date.parse(new Date().toISOString())
                }
            }))
            .select(function (response) {
                console.log(response);
                return response;
            });

    }

    return vm;
}