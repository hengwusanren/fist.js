/**
 * Created by v-kshe on 8/13/2015.
 */
/**
 * 全局静态类
 * 用于声明一个新的类并提供构造函数支持
 * @type {{create: Function}}
 */
var Class = {
    create: function () {
        return function () { // 返回一个函数，代表这个新声明的类的构造函数
            // 一个命名为 initialize 的函数将被这个类实现作为类的构造函数
            this.initialize.apply(this, arguments); // initialize 函数将在实例化一个变量的时候被调用执行
        }
    }
};

var Is = {
    types: [
        "Array",
        "Boolean",
        "Date",
        "Number",
        "Object",
        "RegExp",
        "String",
        "Window",
        "HTMLDocument"
    ]
};
for(var i = 0, c; c = Is.types[i++]; ) {
    Is[c] = (function (type) {
        return function (obj) {
            return Object.prototype.toString.call(obj) == "[object " + type + "]";
        }
    })(c);
}

String.prototype.hashCode = function() {
    var hash = 0, i, chr, len;
    if (this.length == 0) return hash;
    for (i = 0, len = this.length; i < len; i++) {
        chr   = this.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

var Util = function () {
    return {
        parseISO8601DateTime: function (string) {
            var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
                "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +
                "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
            if (string) {
                var d = string.match(new RegExp(regexp));
                var offset = 0;
                var date = new Date(d[1], 0, 1);

                if (d[3]) {
                    date.setMonth(d[3] - 1);
                }
                if (d[5]) {
                    date.setDate(d[5]);
                }
                if (d[7]) {
                    date.setHours(d[7]);
                }
                if (d[8]) {
                    date.setMinutes(d[8]);
                }
                if (d[10]) {
                    date.setSeconds(d[10]);
                }
                if (d[12]) {
                    date.setMilliseconds(Number("0." + d[12]) * 1000);
                }
                if (d[14]) {
                    offset = (Number(d[16]) * 60) + Number(d[17]);
                    offset *= ((d[15] == '-') ? 1 : -1);
                }
                offset -= date.getTimezoneOffset();
                date.setTime(Number(Number(date) + (offset * 60 * 1000)));
                return date;
            } else {
                return new Date();
            }
        },
        parseISO8601DTToString: function (string) {
            var dt = this.parseISO8601DateTime(string);
            return dt.getFullYear() + "年" + (dt.getMonth() + 1) + "月" + dt.getDate() + "日";
        },
        getURLParameter: function (name) {
            return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
        },
        getUrlHash: function () {
            var url = window.location.href;
            return url.substring(url.indexOf('#') + 1);
        },
        typeOfFile: function (url) {
            var arr = url.split('.');
            if(arr.length == 0) return 'unknown';
            return arr[arr.length - 1];
        }
    };
}();

var SessionData = function () {
    return {
        has: function (key) {
            return sessionStorage.getItem(key);
        },
        get: function (key) {
            return JSON.parse(sessionStorage.getItem(key));
        },
        getStr: function (key) {
            return sessionStorage.getItem(key);
        },
        set: function (key, value) {
            if(Is.String(value)) sessionStorage.setItem(key, value);
            else sessionStorage.setItem(key, JSON.stringify(value));
            return value;
        }
    };
}();

var LocalData = function () {
    return {
        has: function (key) {
            return localStorage.getItem(key);
        },
        get: function (key) {
            return JSON.parse(localStorage.getItem(key));
        },
        getStr: function (key) {
            return localStorage.getItem(key);
        },
        set: function (key, value) {
            if(Is.String(value)) localStorage.setItem(key, value);
            else localStorage.setItem(key, JSON.stringify(value));
            return value;
        }
    };
}();

/**
 * Below is by Dean Edwards.
 */
function addEvent (element, type, handler) {
    // 为每一个事件处理函数分派一个唯一的ID
    if (!handler.$$guid) handler.$$guid = addEvent.guid++;
    // 为元素的事件类型创建一个哈希表
    if (!element.events) element.events = {};
    // 为每一个"元素/事件"对创建一个事件处理程序的哈希表
    var handlers = element.events[type];
    if (!handlers) {
        handlers = element.events[type] = {};
        // 存储存在的事件处理函数(如果有)
        if (element["on" + type]) {
            handlers[0] = element["on" + type];
        }
    }
    // 将事件处理函数存入哈希表
    handlers[handler.$$guid] = handler;
    // 指派一个全局的事件处理函数来做所有的工作
    element["on" + type] = handleEvent;
};
// 用来创建唯一的ID的计数器
addEvent.guid = 1;
function removeEvent (element, type, handler) {
    // 从哈希表中删除事件处理函数
    if (element.events && element.events[type]) {
        delete element.events[type][handler.$$guid];
    }
};
function handleEvent (event) {
    var returnValue = true;
    // 抓获事件对象(IE使用全局事件对象)
    event = event || fixEvent(window.event);
    // 取得事件处理函数的哈希表的引用
    var handlers = this.events[event.type];
    // 执行每一个处理函数
    for (var i in handlers) {
        this.$$handleEvent = handlers[i];
        if (this.$$handleEvent(event) === false) {
            returnValue = false;
        }
    }
    return returnValue;
};
// 为IE的事件对象添加一些“缺失的”函数
function fixEvent (event) {
    // 添加标准的W3C方法
    event.preventDefault = fixEvent.preventDefault;
    event.stopPropagation = fixEvent.stopPropagation;
    return event;
};
fixEvent.preventDefault = function () {
    this.returnValue = false;
};
fixEvent.stopPropagation = function () {
    this.cancelBubble = true;
};