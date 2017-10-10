 import template from './listItemHeader.html';
 // import controller from './goatListItem.controller';  

 const listItemHeader = {
     bindings: {
         collapsed: '<',
         title: '@',
         icon: '@',
         size: '@'
     },
     template: template,
     controller: function () {

         this.$onInit = function () {
             if (!this.collapsed) this.collapsed = false;

         };

         this.$onChanges = (changesObj) => {};
         this.$postLink = function () {};
     },
     controllerAs: 'vm'
 };


 export default listItemHeader;