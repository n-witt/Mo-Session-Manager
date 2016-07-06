require(['jquery', 'utilities'], function($, util){
   let host_url = 'http://localhost:5000';
   let u_id = 'default';
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
         if(typeof storage['u_id'] === 'string'){
            $('#u_id').val(storage['u_id']);
            u_id = storage['u_id'];
         } else {
            let randomString = Math.random().toString(36).substring(2,10);
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

      
      // hides and restores the settings widget
      $('.glyphicon-menu-up').hide();
      $('#settings').hide();
      $('#settings_btn').click(function(){
         $('#settings_btn span').each(function() {
            $(this).toggle();
         });
         $('#settings').toggle(200);
      });

   });
});
