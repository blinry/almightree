// show only subtrees of currently focused node that contain `regex`
function search(fullTerm, undoable) {
    // by default, the search action is not undoable
    undoable = typeof undoable !== 'undefined' ? undoable : false;

    // in case it was taken from the URL
    $("#almightree-search").val(fullTerm);

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
        $("#almightree li").show();
        $("#almightree li li li li").hide();
    } else {
        var terms = fullTerm.split("/");
        var lastValidTerm;
        $("#almightree li").show();
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
    var hits = $("#almightree li li:visible > .node:containsCI("+term+")");
    $("#almightree li li").hide();

    hits.parentsUntil("#almightree", "li").show();
    hits.parent().children("ul").children("li").show();
    hits.parent().children("ul").children("li").children("ul").children("li").show();
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
    $("#almightree li").removeClass("headline crumb folded");
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

    li.find("li.foldable:has(> ul > li:hidden)").addClass("folded");   
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

// open or close a tree, if possible
function foldToggle(li) {
    if (!li.hasClass("foldable")) {
        return;
    }

    if (li.hasClass("folded")) {
        unfold(li);
    } else {
        fold(li);
    }
}

function unfold(li) {
    if (!li.hasClass("foldable")) {
        return;
    }

    li.removeClass("folded");
    li.children().children("li").show();
}

function fold(li) {
    if (!li.hasClass("foldable")) {
        return;
    }

    li.addClass("folded");
    li.children().children("li").hide();
}

function initTree(ul) {
    // surround each li's text with a span for easier access
    $(ul).find("li").each(function(){
        if ($(this).children("ul").size() > 0) {
            $(this).children("ul").wrapSides();
        } else {
            $(this).wrapInner('<span class="node"></span>');
        }
    });
    $(ul).find(".node").wrapInner('<span class="text"></span>');
    $(ul).find(".node").append(' <span class="zoom">⚓</span> ');

    $(ul).find("li:has(ul)").addClass("foldable");

    $(ul).find(".text").click(function(e) {
        var li = $(this).parent().parent();
        if (li.hasClass("crumb") || li.hasClass("headline")) {
            if ($(li).parent().is("#almightree")) {
                search("", true);
            } else {
                search(stringToSlug($(this).text()), true);
            }
        } else {
            foldToggle(li);
        }
    });

    $(ul).find(".zoom").click(function(e) {
        var li = $(this).parent().parent();
        if ($(li).parent().is("#almightree")) {
            search("", true);
        } else {
            search(stringToSlug($(this).parent().children(".text").text()), true);
        }
    });

    originalTitle = document.title;
    search(getTermFromURL());
}

function initSearchbox(input) {
    var timer;
    $(input).keyup(function(e) {
        clearTimeout(timer);
        timer = setTimeout(function(){search($(input).val())}, 250);
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
        jQuery.expr[':'].containsCI = jQuery.expr.createPseudo(function(arg) {
            return function(elem) {
                var sText   = (elem.textContent || elem.innerText || "");     
                var zRegExp = new RegExp (arg, 'i');
                return zRegExp.test(sText);
            }
        })
    );

    $.fn.wrapSides = function () {
        return this.each( function (index, el) {
           var $parent = $(el).parent(),
               contents = $.makeArray($parent.contents()),
               before, after, i, matched, build = $();

            for (i = 0; i < contents.length; i++) {
                if( contents[i] === el) {
                    before = contents.slice(0, i);
                    after = contents.slice( Math.min(contents.length - 1, i + 1), contents.length);
                    matched = contents.slice(i,i + 1);
                    break;   
                }
            };

            if (before && before.length) {
                build = build.add($("<span class=\"node\">").append(before));
            }

            build = build.add(matched);

            /*
            if (after && after.length) {
                build = build.add($("<span class=\"node\">").append(after));
            }
            */

            $parent.html( build );
        }); 
    };

    initTree("#almightree");
    initSearchbox("#almightree-search");
    initClear("#almightree-clear");
});
