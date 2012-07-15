$(function(){

    /*
    $('#collapser').jqcollapse({
        slide: true,
    speed: 50,
    easing: 'easeOutCubic'
    });
    */

    $('li').toggle(function() {
        $('#search').val("");
        $('li').each(function() {
            $(this).removeClass("hoisted crumb header");
            $(this).addClass("hidden");
        });
        $(this).addClass("hoisted header");
        $(this).find('li').addClass("hoisted").removeClass("hidden");
        $(this).parentsUntil('#collapser', 'li').addClass("crumb").removeClass("hidden");
    },
function() {
        $('li').each(function() {
            $(this).removeClass("hoisted crumb header");
            $(this).addClass("hidden");
        });
        $(this).addClass("hoisted header");
        $(this).find('li').addClass("hoisted").removeClass("hidden");
        $(this).parentsUntil('#collapser', 'li').addClass("crumb").removeClass("hidden");
    }
    );

    $.extend($.expr[':'], {
        'containsi': function(elem, i, match, array)
    {
        return (elem.textContent || elem.innerText || '').toLowerCase()
        .indexOf((match[3] || "").toLowerCase()) >= 0;
    }
    });

    $('#search').keyup(function() {
        var searchTerms = $(this).val();

        $('#collapser').removeHighlight();

        if(searchTerms.length==0){ $('.hoisted li').show(); return; }

        var re = new RegExp(searchTerms, "i");

        $('.hoisted li').each(function() {
            var hasMatch = re.test($(this).text());
            //var hasMatch = searchTerms.length == 0 || $(this).is(':containsi(' + searchTerms  + ')');

            //if($(this).hasClass("hoisted")) {
                $(this).toggle(hasMatch);
            //}
                });

            $('#collapser').highlight(searchTerms);
            });

    $('#collapser li').addClass("hoisted");

});

