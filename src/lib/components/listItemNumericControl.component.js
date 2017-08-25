import template from './listItemNumericControl.html';
// import controller from './goatListItem.controller';  
// import './goatListItem.scss';
/**
 * @function li-NumberControl
 * @memberOf abl-sdk-feathers.components
 * @description List item control with +/- buttons and input to modify the value.
 * @example  <list-item-numeric-control label="Attendee" value="numValue" min="1" max="5"></list-item-numeric-control>
 */
const listItemNumericControl = {
    restrict: 'E',
    bindings: {
        value: '=',
        label: '@',
        price: '@',
        max: '@',
        min: '@ '
    },
    template: template,
    controller: function () {
        this.min = 0;

        this.$onInit = function () {
            console.log('listItemNumericController!', this);
        };

        this.$onChanges = (changesObj) => {};
        this.$postLink = function () {};

        this.increment = function () {
            if (this.max == undefined || this.max > this.value)
                this.value++;
            // console.log('increment');
        };

        this.decrement = function () {
            if (this.value > this.min)
                this.value--;
            console.log('decrementer');
        };

        this.checkAdjustValue = () => {
            if (this.value > this.max) {
                this.value = this.max;
            }
            if (this.value < this.min)
                this.value = this.min;
        };
    },
    controllerAs: 'vm'
};


export default listItemNumericControl;