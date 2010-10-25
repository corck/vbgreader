function initList() {
    $('#ajax-loader').hide();
    $('.entry').delegate("a", "click", function(e){
        e.preventDefault; // prevent default link behaviour
        id = this.id.replace(/feed-entry-/, ''); // get id
        localStorage.setItem("feed-entry", id); // set storage
        jQT.goTo('#article','slide');
    });
}


$(document).ready(function () {
    //getFeed('http://www.vol.at/rss.aspx/page/vol-article-index-rss-page/dc/tp:vol:vorarlberg');
    localStorage.setItem("news-source", 'http://www.vol.at/rss.aspx/page/vol-article-index-rss-page/dc/tp:vol:musik-cds');
    $('#feed-list').bind('pageAnimationStart', function(event, info){
        $('#feed').hide();
        $('#ajax-loader').show();
        source = localStorage.getItem("news-source");
        $('#feed').rssfeed(source, {
            limit: 10
        }, initList);

    });

    $('#feed-list').bind('pageAnimationEnd', function(event, info){
        $('#feed').show();//
    });


    // sets id for news category
    $('.news-source').delegate('a', 'click', (function(e){
        source = localStorage.setItem("news-source", this.getAttribute("data-src"));
    }));
});
                      
