    import rx from 'rx-angular';
    import jq from 'jquery';
    export default function rest(app, $http) {
        const that = {};
        //('/api/v1/', '?clients', p);

        app.api = {
            getFromPromise: function (url, endPoint, query) {
                var searchString = jq.param(query);
                return rx.Observable
                    .fromPromise($http({
                        method: 'GET',
                        url: url + endPoint + searchString
                    }))
                    .catch((response) => {
                        console.log('error', response);

                        cacheResponse(response);
                        return rx.Observable.empty();
                    })
                    .select(function (response) {
                        console.log(response);
                        return response;
                    });
            }
        }

        app.cache = {
            put: function (d) {
                app.services['cache'].create(d)
            },
            find: function (q) {
                app.services['cache'].find(q)
            }
        }


        //         var query = {
        //   clients: {
        //     $in: ['ddddddd']
        //   }
        // }

        // $abl.services.cache.find({
        //   query
        // }).then(function (result) {
        //   console.log(result);
        // });


        return app;


    }