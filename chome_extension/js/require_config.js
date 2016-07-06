require.config({
   baseUrl: 'js',
   paths: {
      jquery: 'jquery-2.2.4.min',
      bootstrap: 'bootstrap.min',
      init: 'init',
      util: 'utilities',
      eventhandler: 'eventhandler'
   }
});

jQuery = require(['jquery']);
$ = jQuery;
require(['init', 'bootstrap', 'eventhandler']);

