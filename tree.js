// show only subtrees of currently focused node that contain `regex`
function filter(regex) {
    $('#search').val(regex);
    window.history.replaceState("what","","index.html#"+regex);
    $('#thetree li.zoom').removeHighlight();

    $('#thetree li').each(function() {
        $(this).removeClass("filter");
    });

    if(regex.length==0){
        return;
    }

    var re = new RegExp(regex, "i");

    $('#thetree li.zoom li').each(function() {
        var hasMatch = re.test($(this).text());
        if (!hasMatch) {
            $(this).addClass("filter");
        }
    });

    $('#thetree li.zoom').highlight(regex);
}

// show only `item` and below
function zoom(item) {
    filter("");
    $('#search').val("");
    $('#thetree li').each(function() {
        $(this).removeClass("crumb zoom");
    });
    item.addClass("zoom");
    item.parentsUntil('#thetree', 'li').addClass("crumb");
}

$(function(){
    term = window.location.hash.substr(1);

    $('#thetree li').toggle(function() {
        zoom($(this));
    },
    function() {
        zoom($(this));
    });

    $('#search').keyup(function() {
        filter($(this).val());
    });

    zoom($('#thetree li').first());

    if (term != "" && term != null) {
        filter(term);
    }
});
