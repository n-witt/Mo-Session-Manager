require(['jquery', 'utilities'], function($, util){
   let popover_timeout = 2000;
   let popover_indicators = {
      'success': '<span class="glyphicon glyphicon-ok" style="color: green"></span>',
      'warning': '<span class="glyphicon glyphicon-warning" style="color: yellow"></span>',
      'error' : '<span class="glyphicon glyphicon-remove" style="color: red"></span>' 
   };
   /*
    * BUTTONS EVENTHANDLER
    */
   // stores the current session on the host_url
   $('#store').click(function(){
      util.getCurrentTabUrl(true, function(urls){
         let host_url = $('#host_url').val();
         let u_id = $('#u_id').val();
         let request_url = host_url + '/push';
         let data = {'urls': urls};
         let store_btn = $('#store');

         data['u_id'] = u_id;
         $.post(request_url, data).done(function(data, status, xhr){
            data = JSON.parse(data);
            if(data['status'] == 'ok'){
               util.gen_popover(store_btn, popover_indicators['success'], popover_timeout);
            } else if(data['status'] == 'warning'){
               util.gen_popover(store_btn, popover_indicators['warning'], popover_timeout);
            } else {
               util.gen_popover(store_btn, popover_indicators['error'], popover_timeout);
            }
         }).fail(function(data, status, xhr) {
            util.gen_popover(store_btn, popover_indicators['error'], popover_timeout);
         });
      });
   });

   // restores the latest session from host_url
   $('#restore').click(function(){
      let host_url = $('#host_url').val()
         let u_id = $('#u_id').val();
      $.post(host_url + '/pop', {'u_id': u_id}).done(function(data, status, xhr){
         parsed_data = JSON.parse(data);
         if(status == 'success' && (parsed_data['status'] == 'ok' || parsed_data['status'] == 'warning')){
            if(data['status'] == 'warning'){
               util.gen_popover(store_btn, popover_indicators['warning'], popover_timeout);
               console.log('WARNING: the website reported: ' + parsed_data['msg']);
            }
            for(let i=0; i<parsed_data['urls'].length; i++){
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
         util.gen_popover(restore_btn, popover_indicators['error'], popover_timeout);
      });
   });

   /*
    * VALUES CHANGED EVENTHANDLER
    */
   // store new u_id value
   $('#u_id').change(function() {
      let new_u_id = $('#u_id').val();
      u_id = new_u_id;
      chrome.storage.local.set({'u_id': new_u_id});
      util.gen_popover($('#u_id'), popover_indicators['success'], popover_timeout);
   });

   // store new host_url value
   $('#host_url').change(function() {
      let new_host_url = $('#host_url').val();
      if(util.isURL(new_host_url)){
         host_url = new_host_url;
         chrome.storage.local.set({'host_url': host_url});
         util.gen_popover($('#host_url'), popover_indicators['success'], popover_timeout);
      } else {
         chrome.storage.local.set({'host_url': host_url});
         util.gen_popover($('#host_url'), popover_indicators['error'], popover_timeout);
      }
   });
});
