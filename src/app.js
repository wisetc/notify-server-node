// @format
require('../env');
const restify = require('restify');
const handlers = require('./handlers');
const { cors } = require('./config');

const server = restify.createServer();
server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.post('/sendemail', handlers.respond);
server.post('/savebuild', handlers.responseSaveBuild);
server.get('/testconnection', handlers.respondTest);
server.get('/subscribers', handlers.responseSubscribers);

server.get('/logger', handlers.respondLoggerServer);
server.post('/logger/log', handlers.respondLog);

server.get('/version/latest', handlers.respondGetLatestVersion);

server.listen(process.env.APP_PORT || 80, function() {
  console.log('%s listening at %s', server.name, server.url);
});
