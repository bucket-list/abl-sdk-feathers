export default function activityBookValidator(vm, rx, $http) {


    vm.searchClients = function (query) {

        return rx.Observable
            .fromPromise($http({
                method: 'GET',
                url: vm.ENV.apiVersion + "/clients?fullName=" + text
            }))
            .select(function (response) {
                console.log(response);
                return response;
            });

    }

    return vm;
}