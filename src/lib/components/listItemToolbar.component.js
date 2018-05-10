import template from './listItemToolbar.html';
// import controller from './goatListItem.controller';

const listItemToolbar = {
    bindings: {
        action: '@',
        actionClick: '=',
        title: '@',
        icon: '@',
        size: '@'
    },
    template: template,
    controller: function () {

        this.$onInit = function () {
            if (!this.expanded) 
                this.expanded = false;

            };
        
        this.$onChanges = (changesObj) => {};
        this.$postLink = function () {};

        this.click = function () {
            console.log('click function');
        }
    },
    controllerAs: 'vm'
};

export default listItemHeader;