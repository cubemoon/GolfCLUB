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

    try {
        check(captchaCode).notEmpty();
        captchaCode = sanitize(sanitize(captchaCode).trim()).xss();
    } catch (e) {
        return res.redirect("/");
    }

    if (!req.session || !req.session.captchaCode
          || captchaCode.length === 0  || 
       captchaCode != req.session.captchaCode) {
        return res.redirect("/");
    }

    //simulate user login 
    var user         = {};
    user["userId"]   = "ygl_001";
    req.session.user = user;

    res.redirect("/home");
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