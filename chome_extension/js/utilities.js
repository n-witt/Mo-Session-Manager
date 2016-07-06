define(function(){
   module = {};

   /**
    * Get the current URL.
    *
    * @param {function(string)} callback - called when the URL of the current tab
    *   is found.
    */
   module.getCurrentTabUrl = function(current_window_only, callback) {
     // Query filter to be passed to chrome.tabs.query - see
     // https://developer.chrome.com/extensions/tabs#method-query
     let queryInfo = {};
     if(current_window_only){
        queryInfo = {
          currentWindow: true
        };
     }

     chrome.tabs.query(queryInfo, function(tabs) {
        let urls = [];
        for(i=0; i<tabs.length; i++){
           urls.push(tabs[i].url);
        }
        callback(urls);
     });
   }

   /*
    * generates a popover message or glyph indicator ('what') near 'where'.
    * the popover disappears after 'timeout' milliseconds.
    */
   module.gen_popover = function(where, what, timeout){
      where.attr('data-content', what);
      where.popover('show');
      setTimeout(function() {
         where.popover('hide');
      }, timeout);
   }

   module.isURL = function isURL(str) {
     let pattern = new RegExp(/\b(https?|ftp|file):\/\/[\-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[\-A-Za-z0-9+&@#\/%=~_|]/);
     return pattern.test(str);
   }

   return module;
});
