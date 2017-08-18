export default function setupUtilityFunctions(app, $mdToast, $rootScope) {

    /**
     * @name $abl.showToast
     * @function showToast
     * @memberOf abl-sdk-feathers.$abl
     * @description Show an Angular Material toast.
     * @param {string} message - The message to display.
     * @param {string} [class] - The CSS class to apply to the toast.
     * @param {number} [timeout=3000] - The length of time (ms) for the toast to remain visible. 
     */
    app.showToast = function (msg, toastClass, delay) {
        if (!toastClass)
            var toastClass = '';
        if (!delay)
            var delay = 3000;

        var toast = $mdToast.simple()
            .toastClass(toastClass)
            .textContent(msg)
            .action('Hide')
            .hideDelay(delay)
            .position('bottom left')
            .highlightAction(false);
        $mdToast.show(toast);
        console.debug('showToast ', toastClass, msg);
    };


    /**
     * @name $abl.randomInt
     * @function randomInt
     * @memberOf abl-sdk-feathers.$abl
     * @description Returns random integer between min and max.
     * @param {number} min - The upper bound of the random calculation.
     * @param {number} max - The lower bound of the random calculation.
     * @returns {number} between min and max.
     */
    //
    app.randomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    /**
     * @class abl-sdk-feathers.$rootScope
     * @hidden
     */

    /**
     * @name $rootScope.showToast
     * @function showToast
     * @memberOf abl-sdk-feathers.$rootScope
     * @description Show an Angular Material toast.
     * @param {string} message - The message to display.
     * @param {string} [class] - The CSS class to apply to the toast.
     * @param {number} [timeout=3000] - The length of time (ms) for the toast to remain visible. 
     */
    $rootScope.showToast = function (a, b, c) {
        app.showToast(a, b, c); //Legacy support
    };

    /**
     * @name $rootScope.safeApply
     * @function safeApply
     * @memberOf abl-sdk-feathers.$rootScope
     * @description App-wide safeApply function for usage in app controllers as a safer alternative to $apply().
     */
    $rootScope.safeApply = function (fn) {
        if (this.$root) {
            var phase = this.$root.$$phase;
            if (phase === '$apply' || phase === '$digest') {
                if (fn && (typeof (fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        } else {
            this.$apply(fn);
        }
    };


    return app;

}