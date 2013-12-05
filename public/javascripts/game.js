$(function () {

    initDefaultBehavior();
    
});

/**
 * init default behavior
 * @return {null} 
 */
function initDefaultBehavior () {
    $("#div_inputZone").hide();

    registerCategoryClick();
    registerSubcategoryClick();
    registerNumberBtnClick();
    registerActionBtnClick();
    registerAddBtnClick();
    registerClearBtnClick();
    registerTimeInputBlurValidate();

    //simulate click first category button
    $("#category button").first().click();

    initSlider();

}


function calcRebets () {
    
}

/**
 * init rebet button set it's useable
 * @return {null} 
 */
function initRebetButton () {
    //clear
    $("#rebate").removeClass("disabledBtn");
    $("#rebate").removeProp("disabled");

    var selectedCategory = $("#category button[class*=btn-primary]").attr("playid");
    var selectedSubcategory = $("#sub_category_" + selectedCategory + " button[class*=btn-primary]");

    var jiangjin = selectedSubcategory.attr("jj") || "";
    var fandian = $("#hid_fandian").val() || "0.00%";
    $("#rebate").text(jiangjin + " - " + fandian);

    var canChangeStr = selectedSubcategory.attr("canchange") || "false";
    var scalebase = selectedSubcategory.attr("scalebase");
    var canChange = (canChangeStr === "true");
    if (!canChange) {
        $("#rebate").addClass("disabledBtn");
        $("#rebate").prop("disabled")="disabled";
    }
}

/**
 * init slider bar
 * @return {null} 
 */
function initSlider () {
    var percentSpan = $("#percentDiv span");
    var rebeteSpan  = $("#rebeteDiv span");
    $('#rebate-slider').slider({
        min     : 0,
        max     : 10000,
        step    : 100,
        value   : 0,
        tooltip : "hide"
    }).on("slide", function (e) {
        console.log(e.value);
        rebeteSpan.text(e.value);
    });
}

/**
 * register category click event
 * @return {null} 
 */
function registerCategoryClick () {
    $("#category button").each(function() {
        $(this).click(function() {
            $("#category button .btn-primary").removeClass("btn-primary").addClass("btn-default");
            $(this).removeClass("btn-default").addClass("btn-primary");

            //show the subcategory under "this" categoty
            var playId = $(this).attr("playid");
            $("#div_subCategory_container > .isDisplay").removeClass("isDisplay").addClass("nonDisplay");
            $("#div_subCategory_container div").filter("[playid=" + playId + "]").removeClass("nonDisplay").addClass("isDisplay");
            $("#div_subCategory_container > .isDisplay button").removeClass("btn-primary").addClass("btn-default");
            //simulate click current category's first subcategory button
            $("#div_subCategory_container > .isDisplay button").first().click();
        });
    });
}

/**
 * register subcategory click event
 * @return {null} 
 */
function registerSubcategoryClick () {
    $("#div_subCategory_container div[id^=sub_category_]").each(function() {
        var currentDivJqObj = $(this);
        currentDivJqObj.children("button").each(function() {
            var currentBtnJqObj = $(this);
            currentBtnJqObj.click(function() {
                clearOperateZoneInput();
                totalCount(0);

                currentDivJqObj.children(".btn-primary").removeClass("btn-primary").addClass("btn-default");
                currentBtnJqObj.removeClass("btn-default").addClass("btn-primary");

                var betposStr = currentBtnJqObj.attr("betposition") || "";
                switchDashboardOrInput(betposStr);

                initRebetButton();
            });
        });
    });
}

/**
 * register number button click
 * @return {null} 
 */
function registerNumberBtnClick () {
    $("#div_dashborad > div[id^=line_]").each(function () {
        var currentDiv = $(this);
        currentDiv.find("ul > li > a[class^=number] ").each(function () {
            var currentA = $(this);
            currentA.click(function () {
               var selected = (currentA.attr("class").indexOf("selected") != -1);
               if (selected) {
                    currentA.removeClass("selected");
               } else {
                    currentA.addClass("selected");
               }
            });
        });
    });
}

/**
 * register action button click event
 * @return {null} 
 */
function registerActionBtnClick () {
    $("#div_dashborad > div[id^=line_]").each(function () {
        var currentDiv = $(this);
        currentDiv.find("ul > li > a[class^=char] ").each(function () {
            var currentA = $(this);

            var currentAction = currentA.attr("action");

            currentA.click(function () {
                numberHighlightHandle(currentDiv, currentA, currentAction);
            });
        });
    });
}

/**
 * register add button click
 * @return {null} 
 */
function registerAddBtnClick () {
    $("#btnAdd").click(function () {
        var betInfo = calcBetNum();

        var betNum = betInfo.betNum;
        var betStr = betInfo.betStr;

        if (betNum === 0) {
            alert("error");
        } else {
            addItemToBettingInput(betNum, betStr);
            registerInputItemDBLClick();
            totalCount(parseInt(betNum));
            clearSelectedNumBtnStyle();
        }
    });
}

/**
 * register clear button click event
 * @return {null} 
 */
function registerClearBtnClick () {
    $("#btnClear").click(function () {
        clearOperateZoneInput();
        $("#spanBetNum").text("0");
        $("#spanTotalCount").text("0");
    });
}

/**
 * register time input blur event and trigger validate
 * @return {null} 
 */
function registerTimeInputBlurValidate () {
    $("#inputTime").blur(function () {
        var currentTimeInput = $(this);
        var val = currentTimeInput.val();
        var reg = new RegExp("^[0-9]*$");
        try {
            if (!val || val.length === 0) {
                throw new Error();
            }

            if (!reg.test(val) || (parseInt(val) <= 0)) {
                throw new Error();
            }
        } catch (e) {
            currentTimeInput.val("");
            currentTimeInput.focus();
        }
    });
}

/**
 * register double click event for each added into betting input
 * @return {null} 
 */
function registerInputItemDBLClick () {
    $("#div_betting_input > p").each(function () {
        $(this).unbind("dblclick");
    });

    $("#div_betting_input > p").each(function () {
        $(this).dblclick(function () {
            var spanObj = $(this).find("span");
            var betNum  = parseInt(spanObj.attr("betnum"));
            var count   = parseInt(spanObj.attr("count"));
            var prevBetNum     = parseInt($("#spanBetNum").text());
            var prevTotalCount = parseInt($("#spanTotalCount").text());
            $("#spanBetNum").text(prevBetNum - betNum);
            $("#spanTotalCount").text(prevTotalCount - count);
            $(this).remove();
        })
    });
}

/**
 * get current bet position for judge bet type
 * @return {string} bet position string
 */
function getBetType () {
    var selectedCategory = $("#category button[class*=btn-primary]").attr("playid");
    var betpositionStr = $("#sub_category_" + selectedCategory + " button[class*=btn-primary]").attr("betposition");
    return betpositionStr;
}

/**
 * the main call for calc bet num
 * @return {object} the calc result
 */
function calcBetNum () {
    var currentBetType = getBetType();

    if (currentBetType) {
        if (currentBetType === "6") {                       //组选
            return calcForZuxuan();
        } else if (currentBetType === "7") {                //不定位
            return calcForNonlocation();
        } else if (currentBetType === "1,2,3,4,5") {        //定位
            return calcForLocation();
        } else {                                            //直选
            return calcForZhixuan();
        }
    }
}

/**
 * calc bet info for location
 * @return {object} the calc result
 */
function calcForLocation () {
    var betNum = 0;
    var betStr = "";
    $("#div_dashborad > div[id^=line_]").not("div:hidden").each(function () {
        var currentShownDiv = $(this);
        var selectedItemsPerLine = currentShownDiv.find("ul > li > a[class^=number]").filter(".selected")
        var selectedNumPerLine = selectedItemsPerLine.length;
        betNum += selectedNumPerLine;
        selectedItemsPerLine.each(function () {
            var currentItem = $(this);
            betStr += currentItem.text();
        });
        betStr += ",";
    });

    return {
        betNum  : betNum,
        betStr  : betStr
    };
}

/**
 * calc bet info for non-location
 * @return {object} the calc result
 */
function calcForNonlocation () {
    var divObj = $("#line_7");
    var selectedItems = divObj.find("ul > li > a[class^=number]").filter(".selected");
    var selectedNum = selectedItems.length;
    var betNum = selectedNum;
    var betStr = "";
    selectedItems.each(function () {
        var currentItem = $(this);
        betStr += currentItem.text();
    });

    return {
        betNum  : betNum,
        betStr  : betStr
    };
}

/**
 * calc bet info for zu xuan
 * @return {object} calc result
 */
function calcForZuxuan () {
    var divObj = $("#line_6");
    var selectedItems = divObj.find("ul > li > a[class^=number]").filter(".selected");
    var selectedNum = selectedItems.length;

    var piId = $("#div_subCategory_container > .isDisplay > button").filter(".btn-primary").attr("playinfoid");
    var betNum = 0;

    //zu 6
    if (piId === "11" || piId === "15") {
        betNum = ((selectedNum * (selectedNum - 1)) * (selectedNum - 2));
    }
    
    //zu 3
    if (piId === "12" || piId === "16") {
        betNum = ((selectedNum * (selectedNum - 1)) * 3);
    }
    
    //zu 2
    if (piId === "25" || piId === "28") {
        betNum = (selectedNum * (selectedNum - 1));
    }
    
    var betStr = "";
    selectedItems.each(function () {
        var currentItem = $(this);
        betStr += currentItem.text();
    });

    return {
        betNum  : betNum,
        betStr  : betStr
    };
}

/**
 * calc bet info for zhixuan
 * @return {object} the calc result
 */
function calcForZhixuan () {
    var betNum = 1;
    var betStr = "";
    $("#div_dashborad > div[id^=line_]").not("div:hidden").each(function () {
        var currentShownDiv = $(this);
        var selectedItemsPerLine = currentShownDiv.find("ul > li > a[class^=number]").filter(".selected")
        var selectedNumPerLine = selectedItemsPerLine.length;
        betNum *= selectedNumPerLine;
        selectedItemsPerLine.each(function () {
            var currentItem = $(this);
            betStr += currentItem.text();
        });
        betStr += ",";
    });

    return {
        betNum  : betNum,
        betStr  : betStr
    };
}

/**
 * handler line visiable
 * @param  {String} betposStr betposition string like : "1,2,3"
 * @return {null}           
 */
function lineVisiableHandle (betposStr) {
    if (betposStr.length != 0) {
        if (betposStr != "-1") {

            var betPosArr = betposStr.split(",");
            var visiable;

            for (var i = 1; i < 8; i++) {
                visiable = false;
                for (var j = 0; j < betPosArr.length; j++) {
                    if (i.toString() === betPosArr[j]) {
                        visiable = true;
                        break;
                    }
                }
                visiable ? $("#line_" + i).show() : $("#line_" + i).hide();
            }
        }
    }
}

/**
 * high light numer button
 * @param  {object} divJQObj     the jq object of current div
 * @param  {object} clickedJQObj the jq object of clicked button
 * @param  {string} action       current action
 * @return {null}              
 */
function numberHighlightHandle (divJQObj, clickedJQObj, action) {
    //clear all
    divJQObj.find("ul > li > a[class^=number]").removeClass("selected");

    if (action == "all") {
        divJQObj.find("ul > li > a[class^=number]").addClass("selected");
    } else if (action == "large") {
        divJQObj.find("ul > li > a[class^=number]").each(function () {
            var val = $(this).text() || "-1";
            if (5 <= parseInt(val) && parseInt(val) <= 9) {
                $(this).addClass("selected");
            }
        });
    } else if (action == "small") {
        divJQObj.find("ul > li > a[class^=number]").each(function () {
            var val = $(this).text() || "-1";
            if (0 <= parseInt(val) && parseInt(val) <= 4) {
                $(this).addClass("selected");
            }
        });
    } else if (action == "odd") {
        divJQObj.find("ul > li > a[class^=number]").each(function () {
            var val = $(this).text() || "-1";
            if (parseInt(val) != -1 && ((parseInt(val) % 2) != 0)) {
                $(this).addClass("selected");
            }
        });   
    } else if (action == "even") {
        divJQObj.find("ul > li > a[class^=number]").each(function () {
            var val = $(this).text() || "-1";
            if (parseInt(val) != -1 && ((parseInt(val) % 2) === 0)) {
                $(this).addClass("selected");
            }
        });
    } else {
        divJQObj.find("ul > li > a[class^=number]").removeClass("selected");
    }
}

/**
 * init dashboard (remove all high light number buttons)
 * @return {null} 
 */
function initDashboard () {
    $("#div_dashborad > div[id^=line_]").each(function () {
        var currentDiv = $(this);
        currentDiv.find("ul > li > a[class^=number] ").removeClass("selected");
    });
}

/**
 * switch dashboard or input zone
 * @param  {string} betposStr the string of betposition
 * @return {null}           
 */
function switchDashboardOrInput (betposStr) {
    initDashboard();
    if (betposStr.length != 0) {
        if (betposStr != "-1") {
            lineVisiableHandle(betposStr);
            $("#div_dashborad").show();
            $("#div_inputZone").hide();
        } else {
            $("#div_dashborad").hide();
            $("#div_inputZone").show();
        }
    }
}

/**
 * clear input in operate zone
 * @return {null} 
 */
function clearOperateZoneInput () {
    $("#div_betting_input > p").remove();
}

/**
 * clear selected num button style
 * @return {null} 
 */
function clearSelectedNumBtnStyle () {
    $("#div_dashborad > div[id^=line_]").find("ul > li > a[class^=number]").removeClass("selected");
}

/**
 * set total count
 * @param  {Integer} betNum the num value of bet
 * @return {null}        
 */
function totalCount (betNum) {
    var bn = betNum || 0;

    var prev_betNum     = parseInt($("#spanBetNum").text());
    var prev_totalCount = parseInt($("#spanTotalCount").text());

    //clear
    if (bn === 0) {
        $("#spanBetNum").text("0");
        $("#spanTotalCount").text("0");
    } else {
        var timeStr = $("#inputTime").val();
        var time = parseInt(timeStr);
        $("#spanBetNum").text(prev_betNum + betNum);
        $("#spanTotalCount").text(prev_totalCount + (time * betNum));
    }
}

/**
 * add a new item to betting input
 * @param {integer} betNum bet num
 * @param {string} betStr the string of bet
 */
function addItemToBettingInput (betNum, betStr) {
    if (betNum && betStr && betNum > 0 && betStr.length > 1) {
            betStr = betStr.substring(0, betStr.length -1);
    }
    var timeStr = $("#inputTime").val();
    var time = parseInt(timeStr);
    var count = time * betNum;
    var domObjStr = "<p><span class=\"label label-info numLbl\" betnum=\"" + betNum + "\" count=\"" + count + "\">" + betStr +"</span></p>"
    $("#div_betting_input").append(domObjStr);
}