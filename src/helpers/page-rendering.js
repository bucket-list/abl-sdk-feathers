    // export default function afterRender() {
    //     return ['$timeout', function ($timeout) {
    //         var def = {
    //             restrict: 'A',
    //             terminal: true,
    //             transclude: false,
    //             link: function (scope, element, attrs) {
    //                 $timeout(scope.$eval(attrs.afterRender), 1000); //Calling a scoped method 1000ms after rendering has completed
    //             }

    //         };
    //         return def;
    //     }]
    // // };