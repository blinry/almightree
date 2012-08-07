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

    fullTerm = fullTerm.replace(/-/g, "[^a-z0-9üöäßÜÖÄẞ]*");

    $("#thetree").removeHighlight();
    if(fullTerm.length < 3){
        document.title = "morr.cc";
    } else {
        var terms = fullTerm.split("/");
        var lastValidTerm;
        for (var i=0; i<terms.length; i++) {
            var term = terms[i];
            if (term == "") {
                continue;
            }
            lastValidTerm = term;
            filterTerm(term);
        }
        $("#thetree").highlight(lastValidTerm);
    }
    update();
    //$("#search").focus();
}

function filterTerm(term) {
    var hits = $("#thetree li:visible > .node:containsCI("+term+")");
    $("#thetree li").hide();

    hits.parentsUntil("#thetree", "li").show();
    hits.parent().find("li").show();
}

function recursiveFilter(term, li) {
    var text = li.children(".node").text();
    //var hit = term.test (text);
    var hit = text.indexOf(term) == -1 ? false : true;

    if (hit) {
        return true;
    } else {
        var allChildrenFiltered = true;
        li.children("ul").children("li:visible").each(function() {
            if (recursiveFilter(term, $(this))) {
                allChildrenFiltered = false;
            }
        });
        if (allChildrenFiltered) {
            li.hide();
            return false;
        } else {
            return true;
        }
    }
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

function stringToSlug(str) {
    str = str.toLowerCase()
        .replace(/^\s+|\s+$/g, '') // trim
        .replace(/[^a-z0-9üöäßÜÖÄẞ-]/g, '-')
        .replace(/-+/g, '-') // collapse dashes
        .replace(/^-|-$/g, ''); // trim

    return str;
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
            filter(stringToSlug($(this).text()));
        }
    })

    var timer;
    $("#search").keyup(function(e) {
        clearTimeout(timer);
        timer = setTimeout(function(){filter($("#search").val())}, 250);
    });

    $(window).bind("hashchange", function() {
        zoomOnHash();
    });

    zoomOnHash();
});
