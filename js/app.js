/**
 * Created by v-kshe on 8/5/2015.
 */
    
// data in this session:
var SessionCache = {
    curDir: null
};

// events:
$(function () {
    $('#mainList').delegate('li', 'click', function(event) {
        // todo
    });
});

// page-load:
window.onload = function () {
    // fastclick:
    if ('addEventListener' in document) {
        document.addEventListener('DOMContentLoaded', function () {
            FastClick.attach(document.body);
        }, false);
    }

    // templates:
    document.getElementById('mainList').innerHTML = template('mainListTpl', listdata);
};