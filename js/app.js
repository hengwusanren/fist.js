/**
 * Created by v-kshe on 8/5/2015.
 */
    
// Data in this session:
var SessionCache = {
    folderPath: ['root'],
    folder: 'root',
    file: '',
    fileList: [],
    folderList: []
};

// Data for settings:
var Settings = {
    fakedata: true
};

// Models:
var Models = {
    MainList: function (list, folderOrFile) {},
    Path: {
        encode: function (folder) {},
        decode: function (folderPath, folderId) {}
    }
};

// Controllers:
var Controllers = {
    Cd: function (path) {

    },
    GetFolderList: function (path) {
        if(Settings.fakedata === true) {
            Controllers.SetFolderList(folderListData);
            return;
        }
        return [];
    },
    GetFileList: function (path) {
        if(Settings.fakedata === true) return fileListData;
        return [];
    },
    ShowFolderList: function () {},
    ShowFileList: function () {},
    SetFolderList: function (folders) {
        SessionCache.folderList = Models.MainList(folders, 0);
        Controllers.ShowFolderList();
    },
    SetFileList: function (files) {
        SessionCache.fileList = Models.MainList(files, 1);
        Controllers.ShowFileList();
    },
    GoBackBy1: function () {},
    GoBackBy2: function () {}
};

// Events:
$(function () {
    $('#mainList').delegate('li', 'click', function(event) {
        // todo
    });
});

// PageLoad:
window.onload = function () {
    // fastclick:
    if ('addEventListener' in document) {
        document.addEventListener('DOMContentLoaded', function () {
            FastClick.attach(document.body);
        }, false);
    }

    // templates:
    document.getElementById('mainList').innerHTML = template('mainListTpl', listData);
};