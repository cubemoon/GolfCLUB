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
  Desc: login - the controller of login
 */

//mode
/*jslint nomen: true*/
"use strict";

var captchagen = require('captchagen');
var check      = require("validator").check;
var sanitize   = require("validator").sanitize;
var http       = require("http");
var EventProxy = require("eventproxy");
var apiInfo    = require("../docs/apis").APIInfo;

/**
 * show login page
 * @param  {object}   req  the request object
 * @param  {object}   res  the response object
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.showLogin = function (req, res, next) {
    res.render("login");
};

/**
 * handler sign in
 * @param  {object}   req  the request object
 * @param  {object}   res  the response object
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.signIn = function (req, res, next) {
    var captchaCode = req.body.auth.captchaCode || "";
    var userId      = req.body.auth.userId || "";
    var passwd      = req.body.auth.passwd || "";

    try {
        check(captchaCode).notEmpty();
        check(userId).notEmpty();
        check(passwd).notEmpty();
        captchaCode = sanitize(sanitize(captchaCode).trim()).xss();
        userId      = sanitize(sanitize(userId).trim()).xss();
        passwd      = sanitize(sanitize(passwd).trim()).xss();
    } catch (e) {
        return res.send("5");
    }

    if (!req.session || !req.session.captchaCode
          || captchaCode.length === 0  || 
       captchaCode != req.session.captchaCode) {
        return res.send("4");
    }

    var ep = EventProxy.create();

    userId = "golf168";
    passwd = "golf168";
    remoteAuth(userId, passwd, function (authReturnData) {
        if (!authReturnData) {
            return res.send("2");
        }

        ep.emitLater("after_auth", authReturnData);
    });

    ep.once("after_auth", function (authReturnData) {
        req.session.user = authReturnData;

        return res.send("1");
    });
};

/**
 * generate captcha image
 * @param  {object}   req  the instance of request
 * @param  {object}   res  the instance of response
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.captchaImg = function (req, res, next) {
    var captcha     = captchagen.create();
    var captchaCode = captcha.text();
    
    if (captchaCode) {
        req.session.captchaCode = captchaCode;
    }

    //generate
    captcha.generate();

    res.send(captcha.buffer());
};

/**
 * do remote auth
 * @param  {string}   uid      user id
 * @param  {string}   pwd      password
 * @param  {Function} callback the callback func
 * @return {null}            
 */
function remoteAuth (uid, pwd, callback) {
    var data = "";

    var options = {
        hostname  : apiInfo["host"],
        port      : apiInfo["port"],
        path      : apiInfo["auth"] + uid + "/" + pwd,
        method    : 'GET'
    };

    var req = http.request(options, function (res) {
        res.on('data',function(chunk){
            data += chunk;
        }).on('end', function(){
            var jsonObj = JSON.parse(JSON.parse(data));
            callback(jsonObj);
        });
    });

    req.end();
}