import progressButtonTemplate from './progressButton.html';
const progressButton = {
    bindings: {
        loading: '<',
        class: '@',
        ngDisabled: '<',
        spinner: '<',
        stroke: '@',
        fill: '@',
        label: '@',
        onClick: '&'
    },
    controller: function ($element, $scope, $log) {
        this.$onInit = function () {
            $log.debug('progressButton', this);
            if (this.loading)
                $log.debug('progressButton:loading', this.loading);

            $log.debug('progressButton disabled', this.ngDisabled);

        };

        this.$onChanges = (changesObj) => {
            $log.debug('progressButton changes ', changesObj);
            this.disabled = this.ngDisabled;
        };

        this.$postLink = function () {};
    },
    template: progressButtonTemplate,
    transclude: true,
    controllerAs: 'vm'
};


export default progressButton;