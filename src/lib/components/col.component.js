 import colTemplate from './column.html';
 const col = {
     bindings: {
         pos: '@',
         size: '@'
     },
     controller: function ($element, $scope) {
         this.$onInit = function () {
             //  console.log('col', this);
             if (!this.pos)
                 this.position = 'start center'
             if (this.pos == 'right')
                 this.position = 'end center';
             else
                 this.position = this.pos;

         };

         this.$onChanges = (changesObj) => {};
         this.$postLink = function () {};
     },
     template: colTemplate,
     transclude: true,
     controllerAs: 'vm'
 };


 export default col;