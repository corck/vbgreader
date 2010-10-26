function initList() {
    $('#ajax-loader').hide();
    $('.entry').delegate("a", "click", function(e){
        e.preventDefault(); // prevent default link behaviour
        id = this.id.replace(/feed-entry-/, ''); // get id
        localStorage.setItem("feed-entry", id); // set storage
        jQT.goTo('#article','slide');
    });

}


$(document).ready(function () {
    //getFeed('http://www.vol.at/rss.aspx/page/vol-article-index-rss-page/dc/tp:vol:vorarlberg');
    localStorage.setItem("current-source", 'http://www.vol.at/rss.aspx/page/vol-article-index-rss-page/dc/tp:vol:musik-cds');
    localStorage.setItem("news-source", 'http://www.vol.at/rss.aspx/page/vol-article-index-rss-page/dc/tp:vol:musik-cds');
    $('#feed-list').bind('pageAnimationStart', function(event, info){
        if (info.direction == 'in') {
            
            //$('#feed').empty().hide();
            
            current_source = localStorage.getItem("current-source");
            source = localStorage.getItem("news-source");
            if (source != current_source) {
                $('#ajax-loader').show();
                getFeed(source);
            }
        }
    });

    $('#feed-list').bind('pageAnimationEnd', function(event, info){
        $('#feed').show();//
    });


    // sets id for news category
    $('.news-source').delegate('a', 'click', (function(e){
        source = localStorage.setItem("news-source", this.getAttribute("data-src"));
    }));
});
                      
function getFeed(src) {
    var pat = /orf/gi;
    $('#feed').empty().hide();
    if ( src.match(pat)) {
        yqlcall($("#feed"), initList);
    }else {
        $('#feed').rssfeed(src, {
            limit: 20
        }, initList);
    }
    source = localStorage.setItem("current-source", src);
}

function rssFeed() {
    this.entries = [];
}
function entry(title, content, link) {
    this.title = title;
    this.content = content;
    this.link = link;
}

function yqlcall(target, callbackFnk) {
    var t = target;
    var statement = "select * from html where url='http://vorarlberg.orf.at' and xpath='//table[@class=" +
    '"preview"' + "]//tr[td[@class=" + '"leftCol storylistPad"]]' + "'";
    $.queryYQL(statement, "json", function (data) {
        var ul = $('<ul id="feed-data" class="edgetoedge"/>');
        arr = data.query.results.tr
        rss_feed = new rssFeed();
        for (var i in arr) {
            //if (i == 10) break;
            tr = arr[i].td[2];
            li = $('<li class="entry arrow" id="feed-entry-' + i + '">');
            title = '';
            link = '';
            if(tr.a != null) {
                title = tr.a.span.content;
                link = tr.a.href;
            }
            else if (tr.div.a != null) {
                title = tr.div.a.content;
                link = tr.div.a.href;
            }
            else {
                title = tr.div.p;
                link = tr.p.strong.a.href;
            }
            c = tr.p.content;
            e = new entry(title, c, link);
            rss_feed.entries.push(e);
            html = '';
            html += '<a  href="#article" id="feed-entry-' + i + '">' + title +'</a>';
            li.append(html);
            li.appendTo(ul);
        }
        al = $(ul);
        $(t).html(al);
        //ul.appendTo(t);
        if(typeof callbackFnk == 'function'){
            callbackFnk.call(this, data);
        }

    });
};