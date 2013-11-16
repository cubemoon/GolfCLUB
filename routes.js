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
  Desc: the url router
 */

//mode
'use strict';

var homeCtrller  = require("./controllers/home");
var loginCtrller = require("./controllers/login");


module.exports = function (app) {

    app.get("/", loginCtrller.showLogin);
    app.get("/home", homeCtrller.home);
    app.get("/captchaImg", loginCtrller.captchaImg);
    app.post("/signIn", loginCtrller.signIn);

    app.get("/game/cqticket", homeCtrller.cqticket);
    app.get("/game/fucai3D", homeCtrller.fucai3D);
    app.get("/game/tjticket", homeCtrller.tjticket);
    app.get("/game/xjticket", homeCtrller.xjticket);
    app.get("/game/array3", homeCtrller.array3);
    app.get("/game/shanghaile", homeCtrller.shanghaile);

};