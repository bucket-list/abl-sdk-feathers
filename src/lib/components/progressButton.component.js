import progressButtonTemplate from './progressButton.html';
const progressButton = {
    bindings: {
        loading: '<',
        class: '@',
        spinner: '<',
        stroke: '@',
        fill: '@',
        label: '@'
    },
    controller: function ($element, $scope) {
        this.$onInit = function () {
            if (this.loading)
                console.log('progressButton:loading', this.loading);
        };

        this.$onChanges = (changesObj) => {};
        this.$postLink = function () {};
    },
    template: progressButtonTemplate,
    transclude: true,
    controllerAs: 'vm'
};


export default progressButton;