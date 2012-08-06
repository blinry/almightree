// show only subtrees of currently focused node that contain `regex`
function filter(fullTerm) {
    // in case it was taken from the URL
    $("#search").val(fullTerm);

    $("#thetree li").show();

    // update URL and title
    if(window.location.pathname.match("index.html")) {
        window.history.replaceState("","","index.html#"+fullTerm);
    } else {
        window.history.replaceState("","","/"+fullTerm);
    }
    document.title = "morr.cc - "+fullTerm;

    if(fullTerm.length < 3){
        document.title = "morr.cc";
        $("#thetree").removeHighlight();
    } else {
        var terms = fullTerm.split("/");
        for (var i=0; i<terms.length; i++) {
            $("#thetree").removeHighlight();
            var term = terms[i];
            var hits = $("#thetree li:visible > .node:containsCI("+term+")");
            $("#thetree li").hide();

            hits.parentsUntil("#thetree", "li").show();
            hits.parent().find("li").show();

            $("#thetree").highlight(term);
        }
    }
    update();
    $("#search").focus();
}

function update() {
    $("#thetree li").removeClass("headline crumb");
    li = $("#thetree li").first();
    var visibleChildren = 1;
    while(visibleChildren == 1) {
        visibleChildren = li.children("ul").children(":visible").size();
        if (visibleChildren == 1) {
            li = li.children("ul").children("li:visible");
        }
    }
    li.addClass("headline");
    li.parentsUntil("#thetree", "li").addClass("crumb");
}

function zoomOnHash() {
    if(window.location.pathname.match("index.html")) {
        term = window.location.hash.substr(1);
    } else {
    term = window.location.pathname.substr(1);
    }
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

    $("#thetree .node").click(function() {
        if ($(this).parent().parent().parent().is("#thetree")) {
            filter("");
        } else {
            filter($(this).text().toLowerCase());
        }
    })

    $("#search").keyup(function(e) {
        filter($(this).val());
    });

    $(window).bind("hashchange", function() {
        zoomOnHash();
    });

    zoomOnHash();
});
