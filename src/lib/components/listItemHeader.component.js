 import template from './listItemHeader.html';
 // import controller from './goatListItem.controller';  

 const listItemHeader = {
     bindings: {
         collapsed: '<',
         title: '@',
         icon: '@'
     },
     template: template,
     controller: function () {

         this.$onInit = function () {
             if (!this.collapsed) this.collapsed = false;

             console.log('listItemAddCharge', this);
         };

         this.$onChanges = (changesObj) => {};
         this.$postLink = function () {};
     },
     controllerAs: 'vm'
 };


 export default listItemHeader;