// show only subtrees of currently focused node that contain `regex`
function filter(regex) {

    // in case it was taken from the URL
    $("#search").val(regex);

    // update URL and title
    window.history.replaceState("","","index.html#"+regex);
    document.title = "morr.cc - "+regex;

    //$("#thetree .zoom").removeHighlight();

    if(regex.length==0){
        document.title = "morr.cc";
        //compress();
        return;
    }

    $("#thetree .zoom li").addClass("filter");
    $("#thetree .zoom li").removeClass("folded");

    var re = new RegExp(regex, "i");
    
    $("#thetree li.zoom li .text").each(function() {
        var hasMatch = re.test($(this).text());
        if (hasMatch) {
            $(this).parent().parent().addClass("filter");
            $(this).parentsUntil("#thetree .zoom", "li").removeClass("filter");
        }
    });

    $("#thetree li.zoom li").has(".filter").addClass("folded");

   // $("#thetree li.zoom").highlight(regex);
}

// show only <li> `item` and below
function zoom(item) {
    filter("");
    $("#search").val("");
    $("#thetree li").each(function() {
        $(this).removeClass("crumb zoom filter folded");
    });
    item.addClass("zoom");
    item.parentsUntil("#thetree", "li").addClass("crumb");
    //compress();
}

// fold current subtrees
function compress() {
    $(".zoom li").has("ul").addClass("folded");
    $(".zoom li").find("li").addClass("filter");
}

// open or close a tree, if possible
function foldToggle(item) {
    var li = item.parent().parent();

    if (!li.has("ul")[0]) {
        return;
    }

    if (li.hasClass("folded")) {
        li.removeClass("folded");
        li.children().children("li").removeClass("filter");
    } else {
        li.addClass("folded");
        li.children().children("li").addClass("filter");
    }
}

function init() {

}

$(function(){
    $("#thetree .text").click(function() {
        zoom($(this).parent().parent());
    });

    $("#thetree .zoom").click(function() {
        foldToggle($(this));
    });

    $("#search").keyup(function() {
        filter($(this).val());
    });

    term = window.location.hash.substr(1);
    zoom($("#thetree li").first());
    filter(term);
    //compress();
});
