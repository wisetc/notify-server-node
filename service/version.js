const restify = require('restify');
const sendEmail = require('../app').sendEmail;

async function respond(req, res, next) {
  const mailerList = ['zhi@uqugu.com', 'zhoutingting5542@dingtalk.com'];
  const content = await sendEmail(mailerList, req.body);
  res.json(content);
  next();
}

const server = restify.createServer();
server.use(restify.plugins.bodyParser());

server.post('/', respond);

server.listen(process.env.PORT || 80, function() {
  console.log('%s listening at %s', server.name, server.url);
});
