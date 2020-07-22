const proxy = require('http-proxy-middleware');
// YOu cannot hit the api's from plain JavaScript. Use this proxy server
module.exports = function(app) {
   app.use(
     proxy("/", {
       target: "https://niyon-be-chat.herokuapp.com/",
       secure:false,
       changeOrigin:true
     })
   );

   app.use(
    proxy("/chathistory", {
      target: "https://niyon-be-chat.herokuapp.com/",
      secure:false,
      changeOrigin:true
    })
  );
}