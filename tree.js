// show only subtrees of currently focused node that contain `regex`
function filter(regex) {
    $('#search').val(regex);
    window.history.replaceState("what","","index.html#"+regex);
    $('#thetree li.zoom').removeHighlight();

    $('#thetree li').each(function() {
        $(this).removeClass("filter folded");
    });

    if(regex.length==0){
        compress();
        return;
    }

    var re = new RegExp(regex, "i");

    $('#thetree li.zoom li').each(function() {
        var hasMatch = re.test($(this).text());
        if (!hasMatch) {
            $(this).addClass("filter");
            $(this).parent().parent().addClass("folded");
        }
    });

    $('#thetree li.zoom').highlight(regex);
}

// show only `item` and below
function zoom(item) {
    filter("");
    $('#search').val("");
    $('#thetree li').each(function() {
        $(this).removeClass("crumb zoom filter folded");
    });
    item.addClass("zoom");
    item.parentsUntil('#thetree', 'li').addClass("crumb");
    compress();
}

function compress() {
    $(".zoom").children("ul").children("li").children("ul").find("li").has("ul").addClass("folded");
    $(".zoom").children("ul").children("li").children("ul").children("li").children("ul").find("li").addClass("filter");
}

$(function(){
    term = window.location.hash.substr(1);

    /*
    $('#thetree li').toggle(function() {
        zoom($(this));
    },
    function() {
        zoom($(this));
    });
    */

    $('#thetree li').click(function(event) {
        event.stopPropagation();
        obj = $(this).has("ul");
        if (!obj[0]) {
            return;
        }

        if ($(this).hasClass("folded")) {
            $(this).removeClass("folded");
            $(this).children().children("li").removeClass("filter");
        } else {
            $(this).addClass("folded");
            $(this).children().children("li").addClass("filter");
        }
    });

    $('#search').keyup(function() {
        filter($(this).val());
    });

    zoom($('#thetree li').first());

    if (term != "" && term != null) {
        filter(term);
    }
});
