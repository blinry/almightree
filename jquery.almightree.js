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

    $("#almightree").highlightRegex();
    if(fullTerm.length < 1){
        document.title = originalTitle;
        $("#almightree li").css("display", "list-item");
        $("#almightree li li li li").css("display", "none");
    } else {
        var terms = fullTerm.split("/");
        var lastValidTerm;
        $("#almightree li").css("display", "list-item");
        for (var i=0; i<terms.length; i++) {
            var term = terms[i];
            if (term == "") {
                continue;
            }
            lastValidTerm = term;
            filterTerm(term);
        }
        $("#almightree").highlightRegex(new RegExp(lastValidTerm, "i"));
    }
    update();
}

function filterTerm(term) {
    var hits = $("#almightree li li").filter(function() {
        return $(this).css("display") != "none" && $(this).children(".node").filter(":containsCI("+term+")").size() > 0;
    })
    $("#almightree li li").css("display", "none");

    hits.css("display", "list-item");
    hits.parentsUntil("#almightree", "li").css("display", "list-item");
    hits.children("ul").children("li").css("display", "list-item");
    hits.children("ul").children("li").children("ul").children("li").css("display", "list-item");
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
    li.children().children("li").css("display", "list-item");
}

function fold(li) {
    if (!li.hasClass("foldable")) {
        return;
    }

    li.addClass("folded");
    li.children().children("li").css("display", "none");
}

function initTree(ul) {
    $(ul).find("li").each(function() {

        // in the following, we convert <li>a<ul>b</ul></li> to
        // <li>
        //     <span class="node">
        //         <span class="zoom"><i class="icon-search">s</i></span>
        //         <span class="text">a</span>
        //     </span>
        //     <ul>b</ul>
        // </li>
        contents = $(this).contents();
        if (contents.slice(-2,-1).is("ul")) {
            contents = contents.slice(0,-2);
        }
        contents.wrapAll('<span class="node"><span class="text"></span></span>').wrap('');
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

(function ($) {
    $.fn.almightree = function(options) {
        var settings = $.extend({
        }, options);

        initTree(this);
        if (settings["search"]) {
            initSearchbox(settings["search"]);
        }

        return this;
    };
}(jQuery));

/*
 * jQuery Highlight Regex Plugin v0.1.2
 *
 * Based on highlight v3 by Johann Burkard
 * http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html
 *
 * (c) 2009-13 Jacob Rothstein
 * MIT license
 */

;(function( $ ) {



  var normalize = function( node ) {
    if ( ! ( node && node.childNodes )) return

    var children     = $.makeArray( node.childNodes )
    ,   prevTextNode = null

    $.each( children, function( i, child ) {
      if ( child.nodeType === 3 ) {
        if ( child.nodeValue === "" ) {

          node.removeChild( child )

        } else if ( prevTextNode !== null ) {

          prevTextNode.nodeValue += child.nodeValue;
          node.removeChild( child )

        } else {

          prevTextNode = child

        }
      } else {
        prevTextNode = null

        if ( child.childNodes ) {
          normalize( child )
        }
      }
    })
  }




  $.fn.highlightRegex = function( regex, options ) {

    if ( typeof regex === 'object' && !(regex.constructor.name == 'RegExp' || regex instanceof RegExp ) ) {
      options = regex
      regex = undefined
    }

    if ( typeof options === 'undefined' ) options = {}

    options.className = options.className || 'highlight'
    options.tagType   = options.tagType   || 'span'
    options.attrs     = options.attrs     || {}

    if ( typeof regex === 'undefined' || regex.source === '' ) {

      $( this ).find( options.tagType + '.' + options.className ).each( function() {

        $( this ).replaceWith( $( this ).text() )

        normalize( $( this ).parent().get( 0 ))

      })

    } else {

      $( this ).each( function() {

        var elt = $( this ).get( 0 )

        normalize( elt )

        $.each( $.makeArray( elt.childNodes ), function( i, searchnode ) {

          var spannode, middlebit, middleclone, pos, match, parent

          normalize( searchnode )

          if ( searchnode.nodeType == 3 ) {
            
            // don't re-highlight the same node over and over
            if ( $(searchnode).parent(options.tagType + '.' + options.className).length ) {
                return;
            }

            while ( searchnode.data &&
                    ( pos = searchnode.data.search( regex )) >= 0 ) {

              match = searchnode.data.slice( pos ).match( regex )[ 0 ]

              if ( match.length > 0 ) {

                spannode = document.createElement( options.tagType )
                spannode.className = options.className
                $(spannode).attr(options.attrs)

                parent      = searchnode.parentNode
                middlebit   = searchnode.splitText( pos )
                searchnode  = middlebit.splitText( match.length )
                middleclone = middlebit.cloneNode( true )

                spannode.appendChild( middleclone )
                parent.replaceChild( spannode, middlebit )

              } else break
            }

          } else {

            $( searchnode ).highlightRegex( regex, options )

          }
        })
      })
    }

    return $( this )
  }
})( jQuery );
