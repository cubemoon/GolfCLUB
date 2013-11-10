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
  Time: 14:32 PM
  Desc: app - the server
 */

//mode
/*jslint nomen: true*/
"use strict";

var fs      = require("fs");
var path    = require("path");
var express = require("express");
var routes  = require("./routes");
var config  = require("./config").config;
var Loader  = require("loader");

var app     = express.createServer();

//config for all env
app.configure(function () {
    app.set('view engine', 'html');
    app.set('views', path.join(__dirname, 'views'));
    app.set("view options", {layout : false});
    app.register('.html', require('ejs'));

    //middleware
    app.use(express.logger());
    app.use(express.bodyParser());

    app.use(express.cookieParser());
    app.use(express.session({
        secret : config.session_secret
    }));
});


var maxAge = 3600000 * 24 * 30;
var staticDir = path.join(__dirname, 'public');


//config for devp env
app.configure('development', function () {
    app.use("/public", express.static(staticDir));
    app.use(express.errorHandler(
        { showStack : true, dumpException : true }
    ));
});


//set static, dynamic helpers
app.helpers({
    config: config,
    Loader: Loader
});


//config for production env
app.configure("production", function () {
    
});


routes(app);

//launch it!
app.listen(8088);
console.log("the app server run at port :8088");

module.exports = app;