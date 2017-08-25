    /**
     * @function toUppercase
     * @memberOf abl-sdk-feathers.directives
     * @description Transforms input text to all uppercase characters.
     * @example   <input type="text" ng-model="name" to-uppercase>
     */
    export default function focusParent() {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, modelCtrl) {
                console.log(element);
                console.log(attrs);

                let elem = $(element[0].parentElement);
                element.on('focus', function () {
                    console.log(elem);
                    elem.addClass(attrs.onFocus);

                });

                element.on('blur', () => {
                    elem.removeClass(attrs.onFocus);

                })
                //modelCtrl.$parsers.push(capitalize);
                //capitalize(scope[attrs.ngModel]); // capitalize initial value
            }
        };
    }