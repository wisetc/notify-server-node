// @format
require('../env');
const restify = require('restify');
const { cors } = require('./config');
const { addRoutes } = require('./routes');

const server = restify.createServer();
server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

addRoutes(server);

server.listen(process.env.APP_PORT || 80, function() {
  console.log('%s listening at %s', server.name, server.url);
});
