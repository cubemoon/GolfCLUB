$(function () {
    selectGameMenu();

    registerAllEvents();
});

/**
 * select current game menu item
 * @return {null} 
 */
function selectGameMenu () {
    var pathname = window.location.pathname;

    if (pathname === "/home") {
        pathname = "/game/cqticket";
    }

    $(".container .row .col-md-3 .list-group a").filter(".active").removeClass("active");

    $(".container .row .col-md-3 .list-group a").filter("[href*=\'"+ pathname +"\']").addClass("active");
}

/**
 * register category click event
 * @return {null} 
 */
function registerCategoryEvent () {

    $("#category button").each(function () {
        $(this).click(function () {
            $("#category button").filter(".btn-primary").removeClass("btn-primary").addClass("btn-default");
            $(this).removeClass("btn-default").addClass("btn-primary");
        });
    });
}

/**
 * register sub cateogry click event
 * @return {null} 
 */
function registerSubCategoryEvent () {
    $("#sub_category button").each(function () {
        $(this).click(function () {
            $("#sub_category button").filter(".btn-primary").removeClass("btn-primary").addClass("btn-default");
            $(this).removeClass("btn-default").addClass("btn-primary");
        });
    });
}

/**
 * register all events
 * @return {null} 
 */
function registerAllEvents () {
    registerCategoryEvent();

    registerSubCategoryEvent();
}

