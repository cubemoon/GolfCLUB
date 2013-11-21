$(function () {

    initDefaultBehavior();
    
});

/**
 * init default behavior
 * @return {null} 
 */
function initDefaultBehavior () {
    highlightDefaultPlayBtns();
}

/**
 * high light default(first) play button
 * @return {null} 
 */
function highlightDefaultPlayBtns () {
    //play category
    $("#category button").first().removeClass("btn-default").addClass("btn-primary");
}


