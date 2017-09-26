import progressButtonTemplate from './progressButton.html';
const progressButton = {
    bindings: {
        loading: '<',
        class: '@',
        ngDisabled: '<',
        spinner: '<',
        stroke: '@',
        fill: '@',
        label: '@'
    },
    controller: function ($element, $scope) {
        this.$onInit = function () {
            if (this.loading)
                console.log('progressButton:loading', this.loading);

            console.log('progressButton disabled', this.ngDisabled);

        };

        this.$onChanges = (changesObj) => {
            console.log('progressButton changes ', changesObj);
            this.disabled = this.ngDisabled;
        };

        this.$postLink = function () {};
    },
    template: progressButtonTemplate,
    transclude: true,
    controllerAs: 'vm'
};


export default progressButton;