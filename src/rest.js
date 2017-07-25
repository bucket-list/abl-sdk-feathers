    import jq from 'jquery';

    export default function rest(app, $http) {
        const that = {};
        const Rx = window.Rx;
        const moment = window.moment;

        app.api = {};

        app.api.activity = {
            get: function (query) {
                return Rx.Observable
                    .fromPromise(activityService.find(
                        query || {}
                    ))
                    .catch((response) => {
                        console.log('$abl.api.GET ERROR', response);
                        return Rx.Observable.empty();
                    })
                    .select(function (response) {
                        return response.list;
                    });
            },
            find: function (query) {
                return Rx.Observable
                    .fromPromise(activitySearchService.find(
                        query || {}
                    ))
                    .catch((response) => {
                        console.log('$abl.api.activity.FIND ERROR', response);
                        return Rx.Observable.empty();
                    })
                    .select(function (response) {
                        return response;
                    });
            }
        }



        app.api.timeslots = {
            getRange: function (d) {
                return Rx.Observable
                    .fromPromise($http({
                        method: 'GET',
                        url: app.endpoint + '/timeslots?',
                        data: d,
                        headers: {
                            'X-ABL-Access-Key': app.apiKey,
                            'X-ABL-Date': Date.parse(new Date().toISOString())
                        }
                    }))
                    .catch((response) => {
                        console.log('$abl.api.timeslots.GETRANGE ERROR', response);
                        return Rx.Observable.empty();
                    })
                    .select(function (response) {
                        console.log('$abl.api.timeslots.GETRANGE SUCCESS', response);
                        return response.data.list;
                    });
            },
            get: function (id) {
                return Rx.Observable
                    .fromPromise($http({
                        method: 'GET',
                        url: app.endpoint + '/timeslots?id=' + id,
                        headers: {
                            'X-ABL-Access-Key': app.apiKey,
                            'X-ABL-Date': Date.parse(new Date().toISOString())
                        }
                    }))
                    .catch((response) => {
                        console.log('$abl.api.timeslots.GET ERROR', response);
                        return Rx.Observable.empty();
                    })
                    .select(function (response) {
                        console.log('$abl.api.timeslots.GET SUCCESS', response);
                        return response;
                    });
            }
        }

        //Feathers localstorage cache service
        const cache = app.service('cache');
        cache.get('activities').catch(function (res) {
            cache.create({
                id: 'activities',
                data: {},
                map: []
            });

            console.log('create cache');
        });
        //Feathers REST endpoints
        const activityService = app.service('activities');
        const activitySearchService = app.service('search');

        activitySearchService.find({
            query: {
                "sort": "-updatedAt"
            }
        });

        app.activitySearchInterval = function (t) {
            return setInterval(() => {
                activitySearchService.find({
                    query: {
                        "sort": "-updatedAt"
                    }
                });
            }, t);
        }

        const timeslotService = app.service('timeslots');

        const updateCache = store => { // always wrap in a function so you can pass options and for consistency.
            return hook => {
                console.log('updateCache', store, hook);
                let modified = false;

                cache.get('activities').then(function (activities) {
                    activities.updated = [];

                    const acs = Rx.Observable.fromArray(hook.result.data);
                    acs.map(res => res)
                        .filter(res => activities.data[res._id] == undefined)
                        .subscribe(function (x) {
                            activities.data[x._id] = x;
                            modified = true;
                            activities.updated.push(x._id);
                            console.log('creating activity', x);
                        })

                    acs.map(res => res)
                        .takeWhile(res => moment(res['updatedAt']).isAfter(moment(activities.data[res._id]['updatedAt']))) //Check if remote version of object has been recently updated
                        .subscribe(function (x) {
                            activities.data[x._id] = x;
                            console.log('updating activity', x);
                            activities.updated.push(x._id);
                            modified = true;
                        });

                    if (modified) {
                        cache.update('activities', activities);
                    }
                });

                return Promise.resolve(hook); // A good convention is to always return a promise.
            };
        };

        function getObjectIndex(id, arr) {
            for (var i = 0; i < arr.length - 1; i++) {
                if (arr[i].id == id)
                    return i;
            }
            return -1;
        }

        // Set up our after hook to cache new data
        activitySearchService.after({
            all: [], // run hooks for all service methods
            find: [updateCache()] // run hook after a find. You can chain multiple hooks.
        });

        // cache.on('created', function (message) {
        //     console.log('$abl.cache.CREATE', message);
        // });

        // cache.on('updated', function (res) {
        //     console.log('$abl.cache.UPDATED', res);
        // });

        app.cache = cache;

        return app;


    }