// filter by a regular experession, case-insensitive
jQuery.extend (
    jQuery.expr[':'].containsCI = jQuery.expr.createPseudo(function(arg) {
        return function(elem) {
            var sText   = (elem.textContent || elem.innerText || "");     
            var zRegExp = new RegExp (arg, 'i');
            return zRegExp.test(sText);
        }
    })
);

function search(fullTerm, undoable) {
    // by default, the search action is not undoable
    undoable = typeof undoable !== 'undefined' ? undoable : false;

    // in case it was taken from the URL, update the search box
    $("#almightree-search").val(fullTerm);

    // update URL
    if (fullTerm == "") {
        newPath = originalURL;
    } else {
        newPath = originalURL+"#"+fullTerm;
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
    if(fullTerm.length < 1){
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
    var hits = $("#almightree li li").filter(function() {
        return $(this).css("display") != "none" && $(this).children(".node").filter(":containsCI("+term+")").size() > 0;
    })
    $("#almightree li li").hide();

    hits.show();
    hits.parentsUntil("#almightree", "li").show();
    hits.children("ul").children("li").show();
    hits.children("ul").children("li").children("ul").children("li").show();
}

function update() {
    $("#almightree li").removeClass("headline crumb folded");
    li = $("#almightree li").first();
    var visibleChildren = 1;
    var containsHighlight = false;
    while(visibleChildren == 1 && !containsHighlight) {
        visibleChildren = li.children("ul").children().filter(function() {
            return $(this).css("display") != "none";
        }).size();
        if (visibleChildren == 1) {
            if (li.children(".node").find(".highlight").size() > 0) {
                break;
            }
            li = li.children("ul").children("li").filter(function() {
                return $(this).css("display") != "none";
            });
        }
    }
    li.addClass("headline");
    li.parentsUntil("#almightree", "li").addClass("crumb");

    li.find("li.foldable").each(function() {
        if ($(this).children("ul").children("li").filter(function() {
            return $(this).css("display") == "none";
            }).size() > 0) {
            $(this).addClass("folded");   
        }
    });
}

function getTermFromURL() {
    term = window.location.hash.substr(1);
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
    console.log("test2");
    $(ul).find("li").each(function() {

        // convert <li>a<ul>b</ul></li> to
        // <li>
        //     <span class="node">
        //         <span class="zoom"><i class="icon-search">s</i></span>
        //         <span class="text">a</span>
        //     </span>
        //     <ul>b</ul>
        // </li>
        $(this.firstChild).wrap('<span class="node"><span class="text"></span></span>').wrap('');
        $(this).children(".node").prepend('<span class="zoom">⚫</span>');

        // give li's with children the "foldable" class
        if ($(this).children("ul").size() > 0) {
            $(this).addClass("foldable");
        }

        var node = $(this).children(".node");

        node.children(".text").click(function(e) {
            var li = $(this).parent().parent();
            if (li.hasClass("crumb")) {
                zoomOn(li);
            } else if (li.hasClass("headline")) {
                // enjoy life
            } else {
                foldToggle(li);
            }
        });

        node.children(".zoom").click(function(e) {
            var li = $(this).parent().parent();
            zoomOn(li);
        });
    });

    originalTitle = document.title;
    originalURL = window.location.pathname;
    search(getTermFromURL());
    $(window).bind("hashchange", function() {
        search(getTermFromURL());
    });
}

function zoomOn(li) {
    window.scrollTo(0,0);
    if ($(li).parent().is("#almightree")) {
        search("", true);
    } else {
        search(stringToSlug($(li).children(".node").children(".text").text()), true);
    }
}

function initSearchbox(input) {
    var timer;
    $(input).keyup(function(e) {
        clearTimeout(timer);
        timer = setTimeout(function(){search($(input).val())}, 120);
    });
}

function initClear(a) {
    $(a).click(function(e) {
        search("", true);
        e.preventDefault();
    });
}

$(function(){
    //initTree("#almightree");
    //initSearchbox("#almightree-search");
    //initClear("#almightree-clear");
});
