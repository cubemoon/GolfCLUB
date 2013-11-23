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
  Date: 17/11/13
  Time: 14:57 PM
  Desc: fucai3D - the controller of fucai3D
 */

//mode
/*jslint nomen: true*/
"use strict";

var coreDataHandler = require("../core/coreDataHandler");
var apiInfo         = require("../../docs/apis").APIInfo;
var EventProxy      = require("eventproxy");

/**
 * the main request for fu cai 3D
 * @param  {object}   req  the instance of request
 * @param  {object}   res  the instance of responce
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.fucai3D = function (req, res, next) {
    if (!req.session || !req.session.user) {
        return res.redirect("/");
    }

    var categoryList    = [];
    var subCategoryList = [];

    var ep = EventProxy.create();

    coreDataHandler.getPlayTypeList(apiInfo.threeDPlayTypeStr.split(",") , function (playTypeList) {
        categoryList = playTypeList;
        ep.emitLater("after_getCategory");
    })

    ep.once("after_getCategory", function() {
        for (var i = 0; i < categoryList.length; i++) {
            subCategoryList.push(coreDataHandler.getPlayTypeDetail(categoryList[i].PlayId));
        }
        ep.emitLater("after_getSubCategory");
    });

    ep.once("after_getSubCategory", function() {
        ep.emitLater("complete");
    });

    ep.once("complete", function() {

        res.render("game/fucai3D", { 
            categoryList    : categoryList,
            subCategoryList : subCategoryList
        });
    });

};