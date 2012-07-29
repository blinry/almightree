// show only subtrees of currently focused node that contain `regex`
function filter(regex) {
    $('#search').val(regex);
    window.history.replaceState("what","","index.html#"+regex);

    $('#thetree li.zoom').removeHighlight();

    $('#thetree li').removeClass("filter folded");

    if(regex.length==0){
        document.title = "morr.cc";
        compress();
        return;
    }
    document.title = "morr.cc - "+regex;

    var re = new RegExp(regex, "i");

    $('#thetree li.zoom li').each(function() {
        var hasMatch = re.test($(this).text());
        if (!hasMatch) {
            $(this).addClass("filter");
        }
    });

    $("#thetree li").has(".filter").addClass("folded");

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
    $(".zoom li").has("ul").addClass("folded");
    $(".zoom li").find("li").addClass("filter");
}

$(function(){
    term = window.location.hash.substr(1);

    $('#thetree .text').click(function() {
        zoom($(this).parent().parent());
    });

    $('#thetree .zoom').click(function(event) {
        var li = $(this).parent().parent();
        obj = li.has("ul");
        if (!obj[0] || li.hasClass("crumb") || li.hasClass("zoom")) {
            return;
        }

        if (li.hasClass("folded")) {
            li.removeClass("folded");
            li.children().children("li").removeClass("filter");
        } else {
            li.addClass("folded");
            li.children().children("li").addClass("filter");
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
