function filter(regex) {
    $('#thetree').removeHighlight();

    if(regex.length==0){
        //$('.hoisted li').show();
        $('#thetree li').each(function() {
            $(this).toggle(true);
        });
        return;
    }

    var re = new RegExp(regex, "i");

    $('#thetree li').each(function() {
        var hasMatch = re.test($(this).text());
        //if($(this).hasClass("hoisted")) {
        $(this).toggle(hasMatch);
        //}
    });

    $('#thetree').highlight(regex);
}

function zoom(item) {
    $('#search').val("");
    $('#thetree li').each(function() {
        //$(this).removeClass("hoisted crumb header");
        $(this).removeClass("zoom");
        //$(this).addClass("hidden");
    });
    item.addClass("zoom");
    //item.find('li').addClass("hoisted").removeClass("hidden");
    //item.parentsUntil('#thetree', 'li').addClass("crumb").removeClass("hidden");
}

$(function(){
    /*
    $('#collapser').jqcollapse({
        slide: true,
    speed: 50,
    easing: 'easeOutCubic'
    });
    */

    $('#thetree li').toggle(function() {
        zoom($(this));
    },
    function() {
        zoom($(this));
    });

    /*
    $.extend($.expr[':'], {
        'containsi': function(elem, i, match, array)
    {
        return (elem.textContent || elem.innerText || '').toLowerCase()
        .indexOf((match[3] || "").toLowerCase()) >= 0;
    }
    });
    */

    $('#search').keyup(function() {
        filter($(this).val());
    });

    zoom($('#thetree li').first());
});
