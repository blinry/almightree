// show only subtrees of currently focused node that contain `regex`
function filter(fullTerm) {
    // in case it was taken from the URL
    $("#search").val(fullTerm);

    //$("#thetree li.zoom").removeHighlight();
    $("#thetree .zoom li").show();

    if(fullTerm.length < 1){
        document.title = "morr.cc";
    } else {
        // update URL and title
        window.history.replaceState("","","index.html#"+fullTerm);
        document.title = "morr.cc - "+fullTerm;

        var terms = fullTerm.split("/");
        for (var i=0; i<terms.length; i++) {
            var term = terms[i];
            var hits = $("#thetree li.zoom li:visible > .node > .text:containsCI("+term+")");
            $("#thetree .zoom li").hide();

            hits.parentsUntil("#thetree li.zoom", "li").show();
            hits.parent().parent().find("li").show();

            //$("#thetree li.zoom").highlight(term);
        }
        //update();
    }
}

function update() {
    $("#thetree .zoom li").removeClass("folded");
    //$("#thetree .zoom li").has("li:hidden").addClass("folded");
}

// show only <li> `item` and below
function zoom(item) {
    filter("");
    $("#thetree li").removeClass("crumb zoom folded");
    item.addClass("zoom");
    item.parentsUntil("#thetree", "li").addClass("crumb");
}

// fold current subtrees
function compress() {
    $(".zoom li").has("ul").addClass("folded");
    $(".zoom li").find("li").hide();
}

// open or close a tree, if possible
function foldToggle(item) {
    var li = item.parent().parent();

    if (!li.has("ul")[0]) {
        return;
    }

    if (li.hasClass("folded")) {
        li.removeClass("folded");
        li.children().children("li").show();
    } else {
        li.addClass("folded");
        li.children().children("li").hide();
    }
}

function zoomOnHash() {
    term = window.location.hash.substr(1);
    zoom($("#thetree li").first());
    filter(term);
}

$(function(){
    jQuery.extend (
        jQuery.expr[':'].containsCI = function (a, i, m) {
            //-- faster than jQuery(a).text()
            var sText   = (a.textContent || a.innerText || "");     
            var zRegExp = new RegExp (m[3], 'i');
            return zRegExp.test (sText);
        }
    );

    $("#thetree .text").click(function() {
        zoom($(this).parent().parent());
    })

    $("#thetree .node .zoom").click(function() {
        foldToggle($(this));
    });

    $("#search").keyup(function(e) {
        filter($(this).val());
    });

    $(window).bind("hashchange", function() {
        zoomOnHash();
    });

    zoomOnHash();
});
