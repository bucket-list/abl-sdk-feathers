   /**
    * @class abl-sdk-feathers.components
    * @hidden
    */

   /**
    * @function activity-AdjustmentControls
    * @memberOf abl-sdk-feathers.components
    * @description Parent component controller for shared activity adjustment functions.
    * @example  <activity-adjustment-controls></activity-adjustment-controls>
    */

   function activityAdjustmentControls() {
       var vm = this;

       this.$onInit = function () {
           console.log('activityAdjustmentControls', this);
       };

       this.$onChanges = (changesObj) => {};

       this.$postLink = function () {};

       vm.addCharge = function (label, price) {
           console.log(label, price);
       };
   };


   export default activityAdjustmentControls;