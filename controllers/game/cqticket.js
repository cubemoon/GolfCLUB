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
  Desc: cqticket - the controller of cqticket
 */

//mode
/*jslint nomen: true*/
"use strict";

/**
 * the main request for chong qing ticket
 * @param  {object}   req  the instance of request
 * @param  {object}   res  the instance of responce
 * @param  {Function} next the next handler
 * @return {null}        
 */
exports.cqticket = function (req, res, next) {
  if (!req.session || !req.session.user) {
        res.redirect("/");
        return;
    }

    var categoryList    = category();
    var subCategoryList = subCategory();

    console.log(subCategoryList);

    res.render("game/cqticket.html", { 
        categoryList    : categoryList,
        subCategoryList : subCategoryList
    });
};

/**
 * get category for chong qing ticket
 * @return {array} the array of category
 */
function category () {
    var categoryList = [
        "四星直选",
        "三星直选",
        "三星组选",
        "二星直选",
        "二星组选",
        "后一直选",
        "不定位胆",
        "定位胆"
    ];

    return categoryList;
};

/**
 * config sub category for chong qing ticket
 * @return {array} the array of sub category
 */
function subCategory () {
    var subCategoryList = [
        {
            items   : [
                "四星直选复式",
                "四星直选单式"
            ]
        },
        {
            items   : [
                "后三直选复式",
                "后三直选单式",
                "中三直选复式",
                "中三直选单式",
                "前三直选复式",
                "前三直选单式"
            ]
        },
        {
            items   : [
                "后三组选组六",
                "后三组选组三",
                "后三组选混合",
                "前三组选组六",
                "前三组选组三",
                "前三组选混合"
            ]
        },
        {
            items   : [
                "后二直选复式",
                "后二直选单式",
                "前二直选复式",
                "前二直选单式"
            ]
        },
        {
            items   : [
                "后二组选组二",
                "后二组选混合",
                "前二组选组二",
                "前二组选混合"
            ]
        },
        {
            items   : [
                "后一直选复式"
            ]
        },
        {
            items   : [
                "后三不定位胆",
                "前三不定位但",
                "五星不定位胆"
            ]
        },
        {
            items   : [
                "五星定位胆"
            ]
        }
    ];


    return subCategoryList;
}