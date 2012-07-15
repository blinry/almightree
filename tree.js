$(function(){

    $('#collapser').jqcollapse({
        slide: true,
    speed: 50,
    easing: 'easeOutCubic'
    });

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

        if(searchTerms.length==0){ $('li').show(); return; }

        var re = new RegExp(searchTerms, "i");

        $('li').each(function() {
            var hasMatch = re.test($(this).text());
            //var hasMatch = searchTerms.length == 0 || $(this).is(':containsi(' + searchTerms  + ')');

                $(this).toggle(hasMatch);
                });

            $('#collapser').highlight(searchTerms);
            });

        });
