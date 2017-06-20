export default function activityBookValidator(vm, rx, $http) {


    vm.searchClients = function (query) {
        //     search = {
        // item: null,
        // process: false,
        // text: "",
        // enabled: mode === 'Add',
        // change: function () {
        //   var val;
        //   search.enabled = false;
        //   search.searching = false;
        //   val = search.item;
        //   if (val == null) {
        //     return;
        //   }
        //   book.formData.fullName = val.fullName;
        //   book.formData.email = val.email;
        //   return book.formData.phoneNumber = val.phoneNumber;
        // },
        // matches: function () {
        var text, textMatch, deferred;
        text = query.toLowerCase();
        textMatch = function (client) {
            return client.text.indexOf(text) > -1;
        };
        // deferred = $q.defer();

        vm.process = true;
        vm.searching = true;
        // $http.get("clients?fullName=" + text).success(function (data) {
        //     var items;
        //     items = data.list.map(textIndex).filter(textMatch);
        //     console.log('searchClients success', data);
        //     search.searching = false;
        //     return deferred.resolve(data.list);
        // }).error(function () {
        //     console.log('searchClients error', data);

        //     return deferred.resolve([]);
        //     // })['finally'](function(){
        //     //   return search.process = false;
        // });
        // return deferred.promise;

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