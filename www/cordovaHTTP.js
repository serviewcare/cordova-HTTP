/*global angular*/

/*
 * An HTTP Plugin for PhoneGap.
 */

var exec = require('cordova/exec');

// Thanks Mozilla: https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_.22Unicode_Problem.22
function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}

function mergeHeaders(globalHeaders, localHeaders) {
    var globalKeys = globalHeaders ? Object.keys(globalHeaders) : [];
    var key;
    for (var i = 0; i < globalKeys.length; i++) {
        key = globalKeys[i];
        if (!localHeaders.hasOwnProperty(key)) {
            localHeaders[key] = globalHeaders[key];
        }
    }
    return localHeaders;
}

var http = {
    headers: {},
    cacheResults: false,
    sslPinning: false,
    getBasicAuthHeader: function(username, password) {
        return {'Authorization': 'Basic ' + b64EncodeUnicode(username + ':' + password)};
    },
    useBasicAuth: function(username, password) {
        this.headers.Authorization = 'Basic ' + b64EncodeUnicode(username + ':' + password);
    },
    setHeader: function(header, value) {
        this.headers[header] = value;
    },
    setCacheResults: function(willCacheResults) {
        this.cacheResults = willCacheResults;
    },
    enableSSLPinning: function(enable, success, failure) {
        return exec(success, failure, "CordovaHttpPlugin", "enableSSLPinning", [enable]);
    },
    acceptAllCerts: function(allow, success, failure) {
        return exec(success, failure, "CordovaHttpPlugin", "acceptAllCerts", [allow]);
    },
    setTimeout: function(connectionTimeout, success, failure) {
        return exec(success, failure, "CordovaHttpPlugin", "setTimeout", [connectionTimeout]);
    },
    validateDomainName: function(validate, success, failure) {
        return exec(success, failure, "CordovaHttpPlugin", "validateDomainName", [validate]);
    },
    post: function(url, params, headers, success, failure) {
        headers = mergeHeaders(this.headers, headers);
        return exec(success, failure, "CordovaHttpPlugin", "post", [url, params, headers]);
    },
    delete: function(url, params, headers, success, failure) {
        headers = mergeHeaders(this.headers, headers);
        return exec(success, failure, "CordovaHttpPlugin", "delete", [url, params, headers]);
    },
    put: function(url, params, headers, success, failure) {
                return exec(success, failure, "CordovaHttpPlugin", "put", [url, params, headers]);
    },
    postJson: function(url, params, headers, success, failure) {
        headers = mergeHeaders(this.headers, headers);
        return exec(success, failure, "CordovaHttpPlugin", "postJson", [url, params, headers]);
    },
    get: function(url, params, headers, success, failure) {
        headers = mergeHeaders(this.headers, headers);
        return exec(success, failure, "CordovaHttpPlugin", "get", [url, params, headers, this.cacheResults]);
    },
    head: function(url, params, headers, success, failure) {
        headers = mergeHeaders(this.headers, headers);
        return exec(success, failure, "CordovaHttpPlugin", "head", [url, params, headers]);
    },
    uploadFile: function(url, params, headers, filePath, name, success, failure) {
        headers = mergeHeaders(this.headers, headers);
        return exec(success, failure, "CordovaHttpPlugin", "uploadFile", [url, params, headers, filePath, name]);
    },
    downloadFile: function(url, params, headers, filePath, success, failure) {
        /*
         *
         * Licensed to the Apache Software Foundation (ASF) under one
         * or more contributor license agreements.  See the NOTICE file
         * distributed with this work for additional information
         * regarding copyright ownership.  The ASF licenses this file
         * to you under the Apache License, Version 2.0 (the
         * "License"); you may not use this file except in compliance
         * with the License.  You may obtain a copy of the License at
         *
         *   http://www.apache.org/licenses/LICENSE-2.0
         *
         * Unless required by applicable law or agreed to in writing,
         * software distributed under the License is distributed on an
         * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
         * KIND, either express or implied.  See the License for the
         * specific language governing permissions and limitations
         * under the License.
         *
         * Modified by Andrew Stephan for Sync OnSet
         *
        */
        headers = mergeHeaders(this.headers, headers);
        var win = function(result) {
            var entry = new (require('cordova-plugin-file.FileEntry'))();
            entry.isDirectory = false;
            entry.isFile = true;
            entry.name = result.file.name;
            entry.fullPath = result.file.fullPath;
            entry.filesystem = new FileSystem(result.file.filesystemName || (result.file.filesystem == window.PERSISTENT ? 'persistent' : 'temporary'));
            entry.nativeURL = result.file.nativeURL;
            success(entry);
        };
        return exec(win, failure, "CordovaHttpPlugin", "downloadFile", [url, params, headers, filePath]);
    }
};

module.exports = http;
window.cordovaHTTP = http;
