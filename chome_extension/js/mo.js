(function(){
   var host_url = 'http://localhost:5000';
   var u_id = 'default';
   var popover_indicators = {
      'success': '<span class="glyphicon glyphicon-ok" style="color: green"></span>',
      'warning': '<span class="glyphicon glyphicon-warning" style="color: yellow"></span>',
      'error' : '<span class="glyphicon glyphicon-remove" style="color: red"></span>' 
   };
   var popover_timeout = 2000;
   /**
    * Get the current URL.
    *
    * @param {function(string)} callback - called when the URL of the current tab
    *   is found.
    */
   function getCurrentTabUrl(callback) {
     // Query filter to be passed to chrome.tabs.query - see
     // https://developer.chrome.com/extensions/tabs#method-query
     var queryInfo = {
       currentWindow: true
     };

      chrome.tabs.query(queryInfo, function(tabs) {
         var urls = [];
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
   function gen_popover(where, what, timeout){
      where.attr('data-content', what);
      where.popover('show');
      setTimeout(function() {
         where.popover('hide');
      }, timeout);
   }

   function isURL(str) {
     var pattern = new RegExp(/\b(https?|ftp|file):\/\/[\-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[\-A-Za-z0-9+&@#\/%=~_|]/);
     return pattern.test(str);
   }
   /*
    *
    * Here comes the code that relies on a fully loaded DOM 
    *
    */
   $(document).ready(function() {
      /*
       * INITIALIZING THE SETTINGS
       */
      // restore user id from local storage or, if no id present, generate one
      chrome.storage.local.get('u_id', function(storage) {
         if(typeof storage['u_id'] == 'string'){
            $('#u_id').val(storage['u_id']);
            u_id = storage['u_id'];
         } else {
            var randomString = Math.random().toString(36).substring(2,10);
            u_id = randomString;
            $('#u_id').val(randomString);
            chrome.storage.local.set({'u_id': randomString});
         }
      });

      // restore host url from local storage. if not present localhost:5000
      // is hard-coded in the html document 
      chrome.storage.local.get('host_url', function(storage) {
         if(typeof storage['host_url'] == 'string'){
            $('#host_url').val(storage['host_url']);
            host_url = storage['host_url'];
         } else {
            $('#host_url').val(host_url);
            chrome.storage.local.set({'host_url': host_url});
         }
      });

      /*
       * BUTTONS EVENTHANDLER
       */
      // stores the current session on the host_url
      $('#store').click(function(){
         getCurrentTabUrl(function(urls){
            var request_url = host_url + '/push';
            var data = {'urls': urls};
            var store_btn = $('#store');

            data['u_id'] = u_id;
            $.post(request_url, data).done(function(data, status, xhr){
               data = JSON.parse(data);
               if(data['status'] == 'ok'){
                  gen_popover(store_btn, popover_indicators['success'], popover_timeout);
               } else if(data['status'] == 'warning'){
                  gen_popover(store_btn, popover_indicators['warning'], popover_timeout);
               } else {
                  gen_popover(store_btn, popover_indicators['error'], popover_timeout);
               }
            }).fail(function(data, status, xhr) {
               gen_popover(store_btn, popover_indicators['error'], popover_timeout);
            });
         });
      });

      // restores the latest session from host_url
      $('#restore').click(function(){
         $.post(host_url + '/pop', {'u_id': u_id}).done(function(data, status, xhr){
            parsed_data = JSON.parse(data);
            if(status == 'success' && (parsed_data['status'] == 'ok' || parsed_data['status'] == 'warning')){
               if(data['status'] == 'warning'){
                  gen_popover(store_btn, popover_indicators['warning'], popover_timeout);
                  console.log('WARNING: the website reported: ' + parsed_data['msg']);
               }
               for(var i=0; i<parsed_data['urls'].length; i++){
                  createProperty = {
                                      url: parsed_data['urls'][i],
                                      active: false
                                   };
                  chrome.tabs.create(createProperty);
               }
            } else {
               msg = 'ERROR: Couldn\'t receive open tab info. No session stored?';
               console.log(msg);
               window.alert(msg);
            }
         }).fail(function(data, status, xhr) { 
            restore_btn = $('#restore');
            gen_popover(restore_btn, popover_indicators['error'], popover_timeout);
         });
      });
      
      // hides and restores the settings widget
      $('.glyphicon-menu-up').hide();
      $('#settings').hide();
      $('#settings_btn').click(function(){
         $('#settings_btn span').each(function() {
            $(this).toggle();
         });
         $('#settings').toggle(200);
      });

      /*
       * VALUES CHANGED EVENTHANDLER
       */
      // store new u_id value
      $('#u_id').change(function() {
         var new_u_id = $('#u_id').val();
         u_id = new_u_id;
         chrome.storage.local.set({'u_id': new_u_id});
         gen_popover($('#u_id'), popover_indicators['success'], popover_timeout);
      });

      // store new host_url value
      $('#host_url').change(function() {
         var new_host_url = $('#host_url').val();
         if(isURL(new_host_url)){
            host_url = new_host_url;
            chrome.storage.local.set({'host_url': host_url});
            gen_popover($('#host_url'), popover_indicators['success'], popover_timeout);
         } else {
            chrome.storage.local.set({'host_url': host_url});
            gen_popover($('#host_url'), popover_indicators['error'], popover_timeout);
         }
      });
   });
})();
