    /**
     * @function toUppercase
     * @memberOf abl-sdk-feathers.directives
     * @description Transforms input text to all uppercase characters.
     * @example   <input type="text" ng-model="name" to-uppercase>
     */
    export default function toUppercase() {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, modelCtrl) {
                var capitalize = function (inputValue) {
                    if (inputValue == undefined) inputValue = '';
                    var capitalized = inputValue.toUpperCase();
                    if (capitalized !== inputValue) {
                        modelCtrl.$setViewValue(capitalized);
                        modelCtrl.$render();
                    }
                    return capitalized;
                }

                modelCtrl.$parsers.push(capitalize);
                capitalize(scope[attrs.ngModel]); // capitalize initial value
            }
        };
    }