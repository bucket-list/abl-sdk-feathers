    export default function size() {
        return {
            link: function (scope, element, attrs, modelCtrl) {
                console.log(element);
                console.log(attrs);

                if (attrs.size) {
                    let elem = $(element[0].children[0]);
                    elem.addClass(attrs.size);
                }


            }
        };
    }