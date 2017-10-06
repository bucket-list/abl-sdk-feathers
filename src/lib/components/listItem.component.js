 import listItemTemplate from './listItem.html';
 const listItem = {
     bindings: {
         size: '@',
     },
     controller: function ($element, $scope) {
         this.$onInit = function () {};

         this.$onChanges = (changesObj) => {};
         this.$postLink = function () {};
     },
     template: listItemTemplate,
     transclude: true,
     controllerAs: 'vm'
 };


 export default listItem;