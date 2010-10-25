/**
 * Plugin: jquery.zRSSFeed
 * 
 * Version: 1.0.1
 * (c) Copyright 2010, Zazar Ltd
 * 
 * Description: jQuery plugin for display of RSS feeds via Google Feed API
 *              (Based on original plugin jGFeed by jQuery HowTo)
 * 
 * History:
 * 1.0.1 - Corrected issue with multiple instances
 *
 **/

(function($){

    var current = null;
	
    $.fn.rssfeed = function(url, options, callbackFnk) {
	
        // Set pluign defaults
        var defaults = {
            limit: 10,
            header: true,
            titletag: 'h4',
            date: true,
            content: true,
            snippet: true,
            showerror: true,
            errormsg: '',
            key: null
        };
        var options = $.extend(defaults, options);
		
        // Functions
        return this.each(function(i, e) {
            var $e = $(e);
			
            // Add feed class to user div
            if (!$e.hasClass('rssFeed')) $e.addClass('rssFeed');
			
            // Check for valid url
            if(url == null) return false;

            // Create Google Feed API address
            var api = "http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=?&q=" + url;
            if (options.limit != null) api += "&num=" + options.limit;
            if (options.key != null) api += "&key=" + options.key;

            // Send request
            $.getJSON(api, function(data){
				
                // Check for error
                if (data.responseStatus == 200) {
	
                    // Process the feeds
                    rss_feed = data.responseData.feed;
                    _callback(e, data.responseData.feed, options);


                    // now we are calling our own callback function
                    if(typeof callbackFnk == 'function'){
                        callbackFnk.call(this, data);
                    }

                } else {

                    // Handle error if required
                    if (options.showerror)
                        if (options.errormsg != '') {
                            var msg = options.errormsg;
                        } else {
                            var msg = data.responseDetails;
                        };
                    $(e).html('<div class="rssError"><p>'+ msg +'</p></div>');
                };
            });
        });
    };
	
    // Callback function to create HTML result
    var _callback = function(e, feeds, options) {
        if (!feeds) {
            return false;
        }
        var html = '';
        var row = 'odd';
		
        // Add header if required
        if (options.header)
            //			html +=	'<div class="rssHeader">' +
            //				'<a href="'+feeds.link+'" title="'+ feeds.description +'">'+ feeds.title +'</a>' +
            //				'</div>';
			
            // Add body
            html += '<ul id="feed-data" class="rounded">';
		
        // Add feeds
        for (var i=0; i<feeds.entries.length; i++) {
			
            // Get individual feed
            var entry = feeds.entries[i];
			
            // Format published date
            var entryDate = new Date(entry.publishedDate);
            var pubDate = entryDate.toLocaleDateString() + ' ' + entryDate.toLocaleTimeString();
			
            // Add feed row
            html += '<li class="entry arrow" id="feed-entry-' + i + '">' +
            '<a  href="#article" id="feed-entry-' + i + '">' + entry.title +'</a></li>'
            html += '</li>';
			
        // Alternate row classes
			
        }
		
        html += '</ul>'
		
        $(e).html(html);

    };
})(jQuery);
