/**
 * Created by v-kshe on 8/4/2015.
 */

var fiew = {
    target: 0, // 0: to popup, 1: to an external page, 2: to open it directly, 3: in an external page
    viewPage: '', // href of external page
    type: 'txt',
    file: '/fiew.js/resources/test.txt',
    mask: true,
    blockUi: function () {
    },
    unblockUi: function () {
    },
    show: function (options) {
        if(arguments.length > 0) {
            fiew.extend(options);
        }

        if (!fiew.render[fiew.type]) {
            fiew.target = 2;
        }

        if (fiew.target == 0) {
            fiew.blockUi();
            fiew.prepare();
            fiew.render[fiew.type](fiew.file);
            fiew.resize();
        } else if (fiew.target == 1) {
            fiew.hide();
            window.open(fiew.viewPage + '?fileurl=' + encodeURIComponent(fiew.file) + '&filetype=' + encodeURIComponent(fiew.type));
        } else if (fiew.target == 2) {
            fiew.hide();
            window.open(fiew.file);
        } else {
            fiew.prepareViewbox();
            fiew.render[fiew.type](fiew.file);
            fiew.resize();
        }
    },
    hide: function () {
        fiew.dispose();
        fiew.unblockUi();
    },
    pdfViewer: null,
    pdfViewerId: '',
    viewboxId: 'fiewviewbox',
    overlayId: 'fiewoverlay',
    prepare: function () {
        var timestamp = (new Date().getTime()).toString();
        fiew.viewboxId = 'fiewviewbox';// + '_' + timestamp;
        fiew.prepareViewbox();
        if (fiew.mask === true) {
            fiew.overlayId = 'fiewoverlay';// + '_' + timestamp;
            fiew.prepareOverlay();
        }
    },
    prepareOverlay: function () {
        var overlay = document.getElementById(fiew.overlayId);
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = fiew.overlayId;
            overlay.className = 'fiew-overlay';
            document.body.appendChild(overlay);

            $(overlay).click(function () {
                fiew.hide();
            });
        }
        $(overlay).show();
    },
    getOriginalClassName: function () {
        return (fiew.target == 0 ? 'fiew-viewbox' : 'fiew-viewbox-inpage');
    },
    getSpecificClassName: function (type) {
        return 'fiew-viewbox-' + type;
    },
    prepareViewbox: function () {
        var viewbox = document.getElementById(fiew.viewboxId);
        if (!viewbox) {
            viewbox = document.createElement('div');
            viewbox.id = fiew.viewboxId;
            document.body.appendChild(viewbox);

            $(viewbox).click(function (e) {
                e.stopPropagation();
            });
        }
        viewbox.className = fiew.getOriginalClassName();
        $(viewbox).data('url', fiew.file);
        $(viewbox).empty();
        $(viewbox).show();
    },
    render: {
        'txt': function (fileurl) {
            var id = 'txt_' + (new Date().getTime()).toString();
            var dom = document.createElement('pre');
            dom.id = id;
            dom.className = 'txt-viewer';
            dom.setAttribute('data-url', fileurl);
            $(dom).load(fileurl, function (responseTxt, statusTxt, xhr) {
                if (statusTxt == "success") {
                    console.log("Success: " + fileurl + " is loaded~");
                } else if (statusTxt == "error") {
                    console.log("Error: " + xhr.status + ": " + xhr.statusText);
                }
            });
            $("#" + fiew.viewboxId).empty();
            $("#" + fiew.viewboxId).append($(dom));
        },
        'img': function (fileurl) {
            var id = 'img_' + (new Date().getTime()).toString();
            var dom = document.createElement('img');
            dom.id = id;
            dom.src = fileurl;
            $("#" + fiew.viewboxId).empty();
            $("#" + fiew.viewboxId).append($(dom));
        },
        'pdf': function (fileurl) {
            // forbid viewing pdf in a pop-up:
            if(fiew.target == 0) {
                fiew.target = 1;
                fiew.show();
                return;
            }

            fiew.pdfViewerId = 'pdf_' + (new Date().getTime()).toString();
            var dom = document.createElement('div');
            dom.id = fiew.pdfViewerId;
            dom.className = 'pdf-viewer';
            dom.setAttribute('data-url', fileurl);
            $("#" + fiew.viewboxId).empty();
            $("#" + fiew.viewboxId).append($(dom));
            setTimeout(function () {
                fiew.pdfViewer = new PDFViewer($("#" + fiew.pdfViewerId));
            }, 2000);
        },
        'mp3': function (fileurl) {
            var id = 'mp3_' + (new Date().getTime()).toString();
            $("#" + fiew.viewboxId).empty();
            var style = (fiew.target == 0 ? 'width:100%;' : '');
            $("#" + fiew.viewboxId).html('<audio class="audio" style="' + style + '" id="' + id + '" src="' + fileurl + '" controls autoplay loop></audio>');
        },
        'mp4': function (fileurl) {
            var id = 'mp4_' + (new Date().getTime()).toString();
            var width = (fiew.target == 0 ? '100%' : 'auto'), height = 'auto';
            $("#" + fiew.viewboxId).empty();
            $("#" + fiew.viewboxId).html('<video class="video" id="' + id + '" src="' + fileurl + '" width="' + width + '" height="' + height + '" controls autoplay loop></video>');
        },
        'flv': function (fileurl) {
            var id = 'flv_' + (new Date().getTime()).toString();
            var width = (fiew.target == 0 ? '100%' : 'auto'), height = 'auto';
            $("#" + fiew.viewboxId).empty();
            $("#" + fiew.viewboxId).html('<a class="media" id="' + id + '" href="' + fileurl + '"></a>');

            $('.media').media({
                width: width,
                height: height,
                autoplay: true,
                caption: false
            });
        }
    },
    setFlvPlayer: function (flvplayer) {
        $.fn.media.defaults.flvPlayer = flvplayer;
    },
    resize: function () {
        /*
         var outerW = $('#' + fiew.overlayId).width();
         var outerH = $('#' + fiew.overlayId).height();
         var innerW = $('#' + fiew.viewboxId).width();
         var innerH = $('#' + fiew.viewboxId).height();
         var innerWhRadio = innerW / innerH;
         if(innerH > outerH) innerH = outerH;
         if(innerW > outerW) innerW = outerW;
         if(innerW / innerH > innerWhRadio) innerW = innerH * innerWhRadio;
         else innerH = innerW / innerWhRadio;
         $('#' + fiew.viewboxId).width(innerW);
         $('#' + fiew.viewboxId).height(innerH);
         */
        /*
        var fileNode = $("#" + fiew.viewboxId).children().first();
        var fileTag = fileNode.prop('tagName').toLowerCase();
        if(fileTag == 'audio' || fileTag == 'video') {
            $('#' + fiew.viewboxId).height(fileNode.height());
        }
        */
        $('#' + fiew.viewboxId).addClass(fiew.getSpecificClassName(fiew.type));
    },
    dispose: function () {
        var viewbox = document.getElementById(fiew.viewboxId);
        if (!viewbox) return;
        $(viewbox).hide();
        viewbox.className = fiew.getOriginalClassName();
        $(viewbox).empty();
        if (fiew.mask === true) $('#' + fiew.overlayId).hide();
    },
    extend: function (option) {
        $.extend(fiew, option);
        if(option['flvPlayer']) fiew.setFlvPlayer(option['flvPlayer']);
    },
    getURLParameter: function (name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
    },
    init: function () {
        var fileurl = fiew.getURLParameter('fileurl');
        if (!fileurl) return;
        fiew.file = fileurl;
        fiew.target = 3;
        fiew.viewPage = window.location;
        var filetype = fiew.getURLParameter('filetype');
        if (!filetype) {
            var tmparr = fileurl.split(".");
            if (tmparr.length <= 0) return;
            filetype = tmparr[tmparr.length - 1];
        }
        /*
        if (!fiew.render[filetype]) {
            window.location.href = fileurl;
            return;
        }
        */
        fiew.type = filetype;
        fiew.show();
    }
};

$(function () {
    fiew.init();
});