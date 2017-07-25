export default function setupUtilityFunctions(app, $mdToast, $rootScope) {

    app.showToast = function (msg, toastClass, delay) {
        if (!toastClass)
            var toastClass = '';
        if (!delay)
            var delay = 3000;

        var toast = $mdToast.simple()
            .textContent(msg)
            .action('Hide')
            .hideDelay(delay)
            .position('bottom left')
            .highlightAction(false)
            .toastClass(toastClass);
        $mdToast.show(toast);
        console.debug('showToast ', toastClass, msg);
    };


    $rootScope.showToast = function (a, b, c) {
        app.showToast(a, b, c); //Legacy support
    };

    // Application-wide safeApply function for usage in child controllers as
    // better alternative to $apply();
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