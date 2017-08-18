 /**
  * @class abl-sdk-feathers.directives
  * @hidden
  */

 /**
  * @function formatPhone
  * @memberOf abl-sdk-feathers.directives
  * @description Formats a phone number nicely.
  * @example <input type="text" id="phonenumber" ng-model="phonenumber" format-phone>
  */
 export default function formatPhone() {
     return {
         require: 'ngModel',
         restrict: 'A',
         link: function (scope, elem, attrs, ctrl, ngModel) {
             elem.add(phonenumber).on('keyup', function () {
                 var origVal = elem.val().replace(/[^\w\s]/gi, '');
                 if (origVal.length === 10) {
                     var str = origVal.replace(/(.{3})/g, "$1-");
                     var phone = str.slice(0, -2) + str.slice(-1);
                     jQuery("#phonenumber").val(phone);
                 }

             });
             console.log('format-phone', scope);
         }
     };
 }