$(function () {

    initDefaultBehavior();
    
});

/**
 * init default behavior
 * @return {null} 
 */
function initDefaultBehavior () {
    highlightDefaultPlayBtns();

    registerCategoryClick();

    registerSubcategoryClick();
}

/**
 * high light default(first) play button
 * @return {null} 
 */
function highlightDefaultPlayBtns () {
    $("#category button").first().removeClass("btn-default").addClass("btn-primary");
    $("#div_subCategory_container > .isDisplay button").first().removeClass("btn-default").addClass("btn-primary");
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
            $("#div_subCategory_container > .isDisplay button").first().removeClass("btn-default").addClass("btn-primary");
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
                currentDivJqObj.children(".btn-primary").removeClass("btn-primary").addClass("btn-default");
                currentBtnJqObj.removeClass("btn-default").addClass("btn-primary");
            });
        });
    });
}


