const restify = require('restify');
const mysql = require('mysql2/promise');
const sendEmail = require('../app').sendEmail;

const { HOST, PORT, USERNAME, PASSWORD, DATABASE } = process.env;
const config = {
  host: HOST,
  port: Number(PORT),
  user: USERNAME,
  password: PASSWORD,
  database: DATABASE,
};

async function testConnection(config) {
  const connection = await mysql.createConnection(config);
  try {
    console.log('test connection\n');
  } catch (e) {
    console.log(e.message);
  } finally {
    connection.end();
  }
}

async function respond(req, res, next) {
  const mailerList = ['zhi@uqugu.com', 'zhoutingting@dexingroup.com', 'lipan@dexingroup.com', '849538010@qq.com', '1039681233@qq.com'];
  const content = await sendEmail(mailerList, req.body);
  res.json(content);
  next();
}

async function respondTest(req, res, next) {
  await testConnection(config);
  res.json(true);
  next();
}

const server = restify.createServer();
server.use(restify.plugins.bodyParser());

server.post('/', respond);
server.get('/testconnection', respondTest);

server.listen(process.env.PORT || 80, function() {
  console.log('%s listening at %s', server.name, server.url);
});
