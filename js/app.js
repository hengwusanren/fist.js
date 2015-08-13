/**
 * Created by v-kshe on 8/5/2015.
 */
    
// Data in this session:
var SessionCache = {
    folder: '',
    folderPathHash: '',
    folderPath: [''],
    file: '',
    fileList: [],
    folderList: [],
    fList: [],
    foldersReady: false,
    filesReady: false,
    init: function (path) {
        SessionCache.folder = path;
        SessionCache.folderPathHash = path.hashCode();
        SessionCache.folderPath = path.split('/');
        SessionCache.file = '';
        SessionCache.folderList = [];
        SessionCache.fileList = [];
        SessionCache.fList = [];
        SessionCache.foldersReady = false;
        SessionCache.filesReady = false;
    }
};

// Data for settings:
var Settings = {
    fakedata: true
};

// Models:
var Models = {
    MainList: function (list, folderOrFile) {
        var newList = [];
        for(var i in list) {
            newList.push({
                id: list[i]['SharedLink'].hashCode(),
                type: (folderOrFile == 1 ? '' : Util.typeOfFile(list[i]['FileName'])),
                url: list[i]['FileWebApi'],
                name: list[i]['FileName'],
                size: (folderOrFile == 1 ? '' : (list[i]['Size'].toString() + 'b'))
            });
        }
        return newList;
    },
    Path: {
        encode: function (folder) {},
        decode: function (folderPath, folderId) {}
    }
};

// Controllers:
var Controllers = {
    Cd: function (path) {
        SessionCache.init(path);
        var noNeedToGet = Controllers.GetFList(SessionCache.folderPathHash);
        if(noNeedToGet === false) {
            Controllers.GetFolderList(path);
            Controllers.GetFileList(path);
        }
    },
    GetFolderList: function (path) {
        var pathHash = path.hashCode();
        // get from sessionStorage:
        if(SessionData.has(pathHash + '_folders')) {
            return Controllers.ShowFolderList(SessionData.get(pathHash + '_folders'), path, pathHash, true);
        }
        // get from fakedata:
        if(Settings.fakedata === true) {
            return Controllers.ShowFolderList(folderListData, path, pathHash);
        }
        // get with ajax:
        // todo: ajax get and callback:

        return;
    },
    GetFileList: function (path) {
        var pathHash = path.hashCode();
        // get from sessionStorage:
        if(SessionData.has(pathHash + '_files')) {
            return Controllers.ShowFileList(SessionData.get(pathHash + '_files'), path, pathHash, true);
        }
        // get from fakedata:
        if(Settings.fakedata === true) {
            return Controllers.ShowFileList(fileListData, path, pathHash);
        }
        // get with ajax:
        // todo: ajax get and callback:

        return;
    },
    PushListData: function (listData, frontOrBack) {
        if(frontOrBack == 1) {
            for(var i = listData.length - 1; i >= 0; i--) {
                $('#mainList').prepend($(template('mainListItemTpl', listData[i])));
            }
        } else {
            for(var i = 0; i < listData.length; i++) {
                $('#mainList').append($(template('mainListItemTpl', listData[i])));
            }
        }
    },
    ShowFolderList: function (folders, path, pathHash, noNeedToSave) {
        SessionCache.folderList = Models.MainList(folders, 1);
        SessionCache.foldersReady = true;
        Controllers.PushListData(SessionCache.folderList, 1);
        if(!noNeedToSave) {
            SessionData.set(pathHash + '_folders', folders);
            Controllers.SetFList(pathHash);
        }
        return true;
    },
    ShowFileList: function (files, path, pathHash, noNeedToSave) {
        SessionCache.fileList = Models.MainList(files, 0);
        SessionCache.filesReady = true;
        Controllers.PushListData(SessionCache.fileList, 0);
        if(!noNeedToSave) {
            SessionData.set(pathHash + '_files', files);
            Controllers.SetFList(pathHash);
        }
        return true;
    },
    GetFList: function (pathHash) {
        if(!SessionData.has(pathHash + '_fs')) {
            return false;
        }
        SessionCache.fList = SessionData.get(pathHash + '_fs');
        document.getElementById('mainList').innerHTML = template('mainListTpl', SessionCache);
        return true;
    },
    SetFList: function (pathHash) {
        if(SessionCache.foldersReady && SessionCache.filesReady) {
            SessionCache.fList = SessionCache.folderList.concat(SessionCache.fileList);
            SessionData.set(pathHash + '_fs', SessionCache.fList);
        }
    },
    GoBackBy1: function () {},
    GoBackBy2: function () {}
};

// Events:
$(function () {
    $('#mainList').delegate('li', 'click', function(event) {
        if($(this).data('filetype') == '') {
            Controllers.Cd($(this).data('fileurl'));
        }
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
    //document.getElementById('mainList').innerHTML = template('mainListTpl', listData);

    Controllers.Cd('/Shared Documents');
};