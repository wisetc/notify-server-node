const handlers = require('./handlers');

function addRoutes(router) {
  router.post('/sendemail', handlers.respond);
  router.post('/savebuild', handlers.responseSaveBuild);
  router.get('/testconnection', handlers.respondTest);
  router.get('/subscribers', handlers.responseSubscribers);

  router.get('/logger', handlers.respondLoggerServer);
  router.post('/logger/log', handlers.respondLog);

  router.get('/version/latest', handlers.respondGetLatestVersion);
}

module.exports = {
  addRoutes,
}
