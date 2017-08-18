    import jq from 'jquery';

    /**
     * 
     * 
     * @class api
     * @memberOf abl-sdk-feathers.$abl
     * @hidden
     */
    export default function rest(app, $http) {
        const that = {};
        const Rx = window.Rx;
        const moment = window.moment;

        app.api = {};
        /**
         * @class activity
         * @memberOf abl-sdk-feathers.$abl.api
         * @hidden
         */
        app.api.activity = {
            /**
             * @function get
             * @memberOf abl-sdk-feathers.$abl.api.activity
             */
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
            /**
             * @function find
             * @memberOf abl-sdk-feathers.$abl.api.activity
             */
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


        /**
         * @class timeslots
         * @memberOf abl-sdk-feathers.$abl.api
         * @hidden
         */
        app.api.timeslots = {
            /**
             * @function getRange
             * @memberOf abl-sdk-feathers.$abl.api.timeslots
             */
            getRange: function (d) {
                return Rx.Observable
                    .fromPromise($http({
                        method: 'GET',
                        url: app.endpoint + '/timeslots?',
                        data: d,
                        headers: app.headers
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
            /**
             * @function get
             * @memberOf abl-sdk-feathers.$abl.api.timeslots
             */
            get: function (id) {
                return Rx.Observable
                    .fromPromise($http({
                        method: 'GET',
                        url: app.endpoint + '/timeslots?id=' + id,
                        headers: app.headers

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


        //Feathers REST endpoints
        const activityService = app.service('activities');
        const activitySearchService = app.service('search');

        // activitySearchService.find({
        //     query: {
        //         "sort": "-updatedAt"
        //     }
        // });

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

        //Feathers localstorage cache service
        /**
         * @class cache
         * @memberOf abl-sdk-feathers.$abl
         * @description localstorage cache wrapped in a Feathers.js service.
         * @example   <caption>Open or Create</caption>      
         * $abl.cache.get('activities').then(function (res) {
         *   console.log(res);
         *}).catch(res => {
         *    $abl.cache.create({
         *       id: 'activities',
         *      data: {},
         *      map: []
         *  });
         *});
         * @hidden
         */
        const cache = app.service('cache');
        const max = 500;
        let cacheQuery = {
            page: 0,
            pageSize: 20,
            total: 0,
            "sort": "-updatedAt"
        }

        cache.get('activities').then(function (res) {
            console.log(res);
        }).catch(res => {
            cache.create({
                id: 'activities',
                data: {},
                map: []
            });
        });

        const updateCache = store => { // always wrap in a function so you can pass options and for consistency.
            return hook => {
                let modified = false;

                // hook.result.data.forEach(function (e, i) {
                //     cache.create({
                //         id: e._id,
                //         activity: e
                //     }).catch(res => {
                //         console.log('exists');
                //     });
                // });
                cache.get('activities').then(function (activities) {
                    activities.updated = [];

                    const acs = Rx.Observable.fromArray(hook.result.data);
                    acs.map(res => res)
                        .filter(res => activities.data[res._id] == undefined)
                        .subscribe(function (x) {
                            modified = true;
                            activities.data[x._id] = x;
                            activities.map.push(x._id);
                            activities.updated.push(x._id);
                            // console.log('creating activity', x);
                        }, function (err) {
                            return Promise.resolve(hook); // A good convention is to always return a promise.

                        }, function () {
                            if (modified) {
                                console.log('updateCache', store, activities);
                                if (activities.map.length > max) {
                                    for (var i = 0; i < activities.map.length - max; i++) {
                                        delete activities.data[activities.map[i]];
                                        console.log('deleting activity', activities.data[activities.map[0]]);

                                    }
                                    // activities.map.fill('', 0, activities.map.length - max);
                                }
                                activities.total = hook.result.total;
                                cache.update('activities', activities).then(function () {
                                    console.log('updateCache', store, hook);

                                    return Promise.resolve(hook); // A good convention is to always return a promise.
                                });
                            }
                        });
                    // acs.map(res => res)
                    //     .takeWhile(res => moment(res['updatedAt']).isAfter(moment(activities.data[res._id]['updatedAt']))) //Check if remote version of object has been recently updated
                    //     .subscribe(function (x) {
                    //         activities.data[x._id] = x;
                    //         console.log('updating activity', x);
                    //         activities.updated.push(x._id);
                    //         modified = true;
                    //     });
                });
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




        const updateCacheFromDatabase = store => { // always wrap in a function so you can pass options and for consistency.
            return hook => {
                if (hook.result.id == 'activities') {
                    cacheQuery.pageSize = 100;

                    activitySearchService.find({
                        query: cacheQuery
                    }).then(res => {
                        cacheQuery.total = res.total;
                        console.log(cacheQuery, res);
                    });

                }
                return Promise.resolve(hook); // A good convention is to always return a promise.
            }
        };
        // Set up our after hook to cache new data
        cache.after({
            create: [updateCacheFromDatabase()],
            all: [], // run hooks for all service methods
            get: [] // run hook after a find. You can chain multiple hooks.
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