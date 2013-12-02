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

/**
 * get play type object list
 * @param  {Array}   playTypeIDArr the array of play type id
 * @param  {Function} callback      the callback func
 * @return {null}                 
 */
exports.getPlayTypeList = function (playTypeIDArr, callback) {
    var ids = playTypeIDArr || [];

    var playTypeObjArr = [];

    for (var i = 0; i < ids.length; i++) {
        playTypeObjArr.push(getPlayTypeById(ids[i]));
    }

    if (callback) {
        callback(playTypeObjArr);
    }
};

/**
 * get play type detail with play type id
 * @param  {string} playTypeId play type id
 * @return {Array}            play type details
 */
exports.getPlayTypeDetail = function (playTypeId) {
    var typeId = playTypeId || "";

    if (typeId.length === 0) {
        return null;
    }

    var detailList = [];
    for (var i = 0; i < TYPEDETAILLIST.length; i++) {
        if (typeId == TYPEDETAILLIST[i].PlayTypeId) {
            console.log(TYPEDETAILLIST[i].BetPosition);
            if (!TYPEDETAILLIST[i].BetPosition) {
                TYPEDETAILLIST[i].BetPosition = "-1";
            }
            detailList.push(TYPEDETAILLIST[i]);
        }
    }

    return detailList;
};

/**
 * get play type by id
 * @param  {string} playTypeId play type id
 * @return {object}            the instance of play type
 */
function getPlayTypeById(playTypeId) {
    var typeId = playTypeId || "";

    if (typeId.length === 0) {
        return null;
    };

    for (var j = 0; j < TYPELIST.length; j++) {
        if (typeId == TYPELIST[j].PlayId) {
            return TYPELIST[j];
        }
    }

    return null;
}