const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
    'XXXXX',
    createProxyMiddleware({
      target: 'http://localhost:8082/api/deposit_item/',
      changeOrigin: true
    })
  );
};
