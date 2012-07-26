// show only subtrees of currently focused node that contain `regex`
function filter(regex) {
    $('#search').val(regex);
    window.history.replaceState("what","","index.html#"+regex);
    $('#thetree li.zoom').removeHighlight();

    $('#thetree li').each(function() {
        $(this).removeClass("filter");
        //$(this).addClass("hidden");
    });

    if(regex.length==0){
        //$('.hoisted li').show();
        /*
        $('#thetree li.zoom').each(function() {
            $(this).toggle(true);
        });
        */
        return;
    }

    var re = new RegExp(regex, "i");

    $('#thetree li.zoom li').each(function() {
        var hasMatch = re.test($(this).text());// && ($(this).hasClass("zoom") || $(this).hasClass("crumb"));
        if (!hasMatch) {
            $(this).addClass("filter");
            //$(this).css("display", "list-item !important
        }
    });

    $('#thetree li.zoom').highlight(regex);
}

// show only `item` and below
function zoom(item) {
    filter("");
    $('#search').val("");
    $('#thetree li').each(function() {
        $(this).removeClass("crumb zoom");
        //$(this).addClass("hidden");
    });
    item.addClass("zoom");
    //item.find('li').addClass("hoisted").removeClass("hidden");
    item.parentsUntil('#thetree', 'li').addClass("crumb");//.removeClass("hidden");
}

$(function(){
    term = window.location.hash.substr(1);
    /*
    $('#collapser').jqcollapse({
        slide: true,
    speed: 50,
    easing: 'easeOutCubic'
    });
    */

    $('#thetree li').toggle(function() {
        zoom($(this));
    },
    function() {
        zoom($(this));
    });

    $('#search').keyup(function() {
        filter($(this).val());
    });

    zoom($('#thetree li').first());

    if (term != "" && term != null) {
        filter(term);
    }
});
