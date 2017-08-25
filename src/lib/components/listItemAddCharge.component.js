 /**
  * @class abl-sdk-feathers.components
  * @hidden
  */



 /**
  * @function li-AddCharge
  * @memberOf abl-sdk-feathers.components
  * @description List item to enter a new charge with value.
  * @example  <list-item-add-charge group="vm.charges"></list-item-add-charge>
  */
 import template from './listItemAddCharge.html';
 // import controller from './goatListItem.controller';  
 import './listItem.css';

 const listItemAddCharge = {
     bindings: {
         add: '<',
         group: '=',
         buttonClass: '@'
     },
     template: template,
     controller: function ($scope) {
         this.price = 0;
         this.$onInit = function () {
             console.log('listItemAddCharge', this);
         };

         this.$onChanges = (changesObj) => {};
         this.$postLink = function () {};
     },
     controllerAs: 'vm'
 };


 export default listItemAddCharge;