/*
  #!/usr/local/bin/node
  -*- coding:utf-8 -*-
 
  Copyright 2013 freedom Inc. All Rights Reserved.
 
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
 
     http://www.apache.org/licenses/LICENSE-2.0
 
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
  ---
  Created with Sublime Text 2.
  Date: 8/11/13
  Time: 14:42 PM
  Desc: initializer - the core controller of service initializer
 */

//mode
/*jslint nomen: true*/
"use strict";

var http       = require("http");
var apiInfo    = require("../../docs/apis").APIInfo;
var EventProxy = require("eventproxy");

/**
 * init app basic data
 * @param  {Function} callback the callback func
 * @return {null}            
 */
exports.initAPPBasicData = function (callback) {

    var ep = EventProxy.create();

    getPlayGategory(function () {
        ep.emitLater("after_getPlayGategory");
    })

    ep.once("after_getPlayGategory", function() {
        getPlayType(function() {
            ep.emitLater("after_getPlayType");
        });
    });

    ep.once("after_getPlayType", function() {
        getPlayTypeDetail(function() {
            ep.emitLater("after_complete");
        });
    });

    ep.once("after_complete", function() {
        if (callback) {
            callback();
        }
    });
}

/**
 * get play category from remote service
 * @param {Function} callback the callback func
 * @return {null} 
 */
function getPlayGategory (callback) {
    var url = apiInfo["category"] || "";

    if (url.length === 0) {
        console.log("error");
        return;
    }

    var data = "";

    var options = {
        hostname  : apiInfo["host"],
        port      : apiInfo["port"],
        path      : url,
        method    : 'GET'
    };

    var req = http.request(options, function (res) {
        res.on('data',function(chunk){
            data += chunk;
        }).on('end', function(){
            var categoryJSONObj = JSON.parse(JSON.parse(data));
            global.CATEGORYLIST = categoryJSONObj;
            callback();
        });
    });

    req.end();
};

/**
 * get play type from remote service
 * @param {Function} callback the callback func
 * @return {null} 
 */
function getPlayType (callback) {
    var url = apiInfo["type"] || "";

    if (url.length === 0) {
        console.log("error");
        return;
    }

    var data = "";

    var options = {
        hostname  : apiInfo["host"],
        port      : apiInfo["port"],
        path      : url,
        method    : 'GET'
    };

    var req = http.request(options, function (res) {
        res.on('data',function(chunk){
            data += chunk;
        }).on('end', function(){
            var typeJSONObj = JSON.parse(JSON.parse(data));
            global.TYPELIST = typeJSONObj;
            callback();
        });
    });

    req.end();
};

/**
 * get play type detail from remote service
 * @param {Function} callback the callback func
 * @return {null} 
 */
function getPlayTypeDetail (callback) {
    var url = apiInfo["typeDetail"] || "";

    if (url.length === 0) {
        console.log("error");
        return;
    }

    var data = "";

    var options = {
        hostname    : apiInfo["host"],
        port        : apiInfo["port"],
        path        : url,
        method      : 'GET'
    };

    var req = http.request(options, function (res) {
        res.on('data',function(chunk){
            data += chunk;
        }).on('end', function(){
            var typeDetailJSONObj = JSON.parse(JSON.parse(data));
            global.TYPEDETAILLIST = typeDetailJSONObj;
            callback();
        });
    });

    req.end();
};