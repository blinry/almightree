// show only subtrees of currently focused node that contain `regex`
function filter(fullTerm) {
    // in case it was taken from the URL
    $("#search").val(fullTerm);

    $("#almightree li").show();

    // update URL and title
    if(window.location.pathname.match("index.html")) {
        window.history.replaceState("","","index.html#"+fullTerm);
    } else {
        window.history.replaceState("","","/"+fullTerm);
    }
    document.title = originalTitle+" - "+fullTerm;

    fullTerm = fullTerm.replace(/-/g, "[^a-z0-9üöäßÜÖÄẞ]*");

    $("#almightree").removeHighlight();
    if(fullTerm.length < 3){
        document.title = originalTitle;
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
        $("#almightree").highlight(lastValidTerm);
    }
    update();
    //$("#search").focus();
}

function filterTerm(term) {
    var hits = $("#almightree li:visible > .node:containsCI("+term+")");
    $("#almightree li").hide();

    hits.parentsUntil("#almightree", "li").show();
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
    $("#almightree li").removeClass("headline crumb");
    li = $("#almightree li").first();
    var visibleChildren = 1;
    while(visibleChildren == 1) {
        visibleChildren = li.children("ul").children(":visible").size();
        if (visibleChildren == 1) {
            li = li.children("ul").children("li:visible");
        }
    }
    li.addClass("headline");
    li.parentsUntil("#almightree", "li").addClass("crumb");
}

function zoomOnHash() {
    if(window.location.pathname.match("index.html")) {
        term = window.location.hash.substr(1);
    } else {
        term = window.location.pathname.substr(1);
    }
    term = decodeURIComponent(term);
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
    //surround each li's text with a span for easier access
    $("#almightree li").each(function(){
        $(this.firstChild).wrap('<span class="node"></span>');
    });

    jQuery.extend (
        jQuery.expr[':'].containsCI = function (a, i, m) {
            //-- faster than jQuery(a).text()
            var sText   = (a.textContent || a.innerText || "");     
            var zRegExp = new RegExp (m[3], 'i');
            return zRegExp.test (sText);
        }
    );

    $("#almightree .node").click(function() {
        if ($(this).parent().parent().is("#almightree")) {
            filter("");
        } else {
            filter(stringToSlug($(this).text()));
        }
    })

    $("#almightree-clear").click(function(e) {
        filter("");
        e.preventDefault();
    });

    var timer;
    $("#search").keyup(function(e) {
        clearTimeout(timer);
        timer = setTimeout(function(){filter($("#search").val())}, 250);
    });

    $(window).bind("hashchange", function() {
        zoomOnHash();
    });

    originalTitle = document.title;
    zoomOnHash();
});
