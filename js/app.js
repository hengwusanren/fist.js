/**
 * Created by v-kshe on 8/5/2015.
 */
    
// data in this session:
var SessionCache = {
    curLi: null,
    bottomBarDisplay: true
};

// events:
$(function(){
    $('#mainList').delegate('.operate', 'touchstart', function(event) {
        event.stopPropagation();
    });
    $('#mainList').delegate('.operate', 'touchend', function(event) {
        event.stopPropagation();
    });
    $('#mainList').delegate('.operate', 'click', function(event) {
        event.stopPropagation();
        var thisLi = $(this).closest('li.list-item')[0];
        if($(thisLi).data('operate') == '1') {
            animates.resetLi(thisLi);
            animates.hideWidgets();
            return;
        }
        if($(thisLi).data('operate') == '2') {
            animates.resetLi(thisLi);
            animates.hideWidgets();
            return;
        }

        animates.resetLi();
        animates.hideWidgets();

        animates.setLi(thisLi);
    });

    $('#mainList').delegate('.option', 'click', function(event) {
        event.stopPropagation();
        animates.unshiftLi();
        animates.highlightLi();
        var thisLi = $(this).closest('li.list-item')[0];
        $(thisLi).data('operate', 2);
        animates.showWidgets();
    });

    $('#mainList').delegate('li', 'click', function(event) {
        if($(this).data('operate') == '0') {
            // configure fiew:
            // ...
        } else {
            animates.hideWidgets();
        }
        animates.resetLi();
        SessionCache.curLi = this;
    });

    $('#mask').click(function(event) {
        event.stopPropagation();

        animates.resetLi();
        animates.hideWidgets();
    });

    /*
     $("#mainList").touchwipe({
     wipeLeft: function() { console.log("left"); },
     wipeRight: function() { console.log("right"); },
     wipeUp: function() {
     //console.log("up");
     animates.hideFooter();
     },
     wipeDown: function() { console.log("down"); },
     min_move_x: 20,
     min_move_y: 20,
     preventDefaultEvents: false
     });
     */

    function scroll( fn ) {
        var beforeScrollTop = document.getElementById('container').scrollTop,
            fn = fn || function() {};
        document.getElementById('container').addEventListener("scroll", function() {
            var afterScrollTop = document.getElementById('container').scrollTop,
                delta = afterScrollTop - beforeScrollTop;
            if( delta === 0 ) return false;
            fn( delta > 0 ? "down" : "up" );
            beforeScrollTop = afterScrollTop;
        }, false);
    }
    scroll(function(direction) {
        if(direction == "down") {
            animates.hideFooter();
        } else {
            animates.showFooter();
        }
    });

    // configure fiew:
    // ...
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