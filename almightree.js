// show only subtrees of currently focused node that contain `regex`
function search(fullTerm, undoable) {
    // by default, the search action is not undoable
    undoable = typeof undoable !== 'undefined' ? undoable : false;

    // in case it was taken from the URL
    $("#almightree-search").val(fullTerm);

    $("#almightree li").show();

    // update URL
    if(window.location.pathname.match("index.html")) {
        newPath = "index.html#"+fullTerm;
    } else {
        newPath = "/"+fullTerm;
    }
    if (undoable) {
        window.history.pushState("", "", newPath);
    } else {
        window.history.replaceState("", "", newPath);
    }
    // ... and title
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

function getTermFromURL() {
    if(window.location.pathname.match("index.html")) {
        term = window.location.hash.substr(1);
    } else {
        term = window.location.pathname.substr(1);
    }
    return decodeURIComponent(term);
}

function stringToSlug(str) {
    str = str.toLowerCase()
        .replace(/^\s+|\s+$/g, '') // trim
        .replace(/[^a-z0-9üöäßÜÖÄẞ-]/g, '-')
        .replace(/-+/g, '-') // collapse dashes
        .replace(/^-|-$/g, ''); // trim

    return str;
}

function initTree(ul) {
    // surround each li's text with a span for easier access
    $(ul).find("li").each(function(){
        $(this.firstChild).wrap('<span class="node"></span>');
    });

    // if a node is clicked, search for it
    $(ul).find(".node").click(function(e) {
        if ($(this).parent().parent().is("#almightree")) {
            search("", true);
        } else {
            search(stringToSlug($(this).text()), true);
        }
    });

    originalTitle = document.title;
    search(getTermFromURL());
}

function initSearchbox(input) {
    var timer;
    $(input).keyup(function(e) {
        clearTimeout(timer);
        timer = setTimeout(function(){search($(input).val())}, 0);
    });
}

function initClear(a) {
    $(a).click(function(e) {
        search("", true);
        e.preventDefault();
    });
}

$(function(){
    // enable filtering by regular experession
    jQuery.extend (
        jQuery.expr[':'].containsCI = function (a, i, m) {
            var sText   = (a.textContent || a.innerText || "");     
            var zRegExp = new RegExp (m[3], 'i');
            return zRegExp.test (sText);
        }
    );

    initTree("#almightree");
    initSearchbox("#almightree-search");
    initClear("#almightree-clear");
});
