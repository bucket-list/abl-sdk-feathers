import template from './listItemHeader.html';
// import controller from './goatListItem.controller';

const listItemHeader = {
    bindings: {
        action: '@',
        actionClick: '=',
        expanded: '=',
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
            if (this.action == 'expandable') {
                this.expanded = !this.expanded;

            }
        }
    },
    controllerAs: 'vm'
};

export default listItemHeader;