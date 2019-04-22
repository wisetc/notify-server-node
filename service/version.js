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

async function createConnection() {
  const connection = await mysql.createConnection(config);
  console.log('msyql server connected');
  return connection;
}

let connection = null;
createConnection().then(_connection => connection = _connection);

async function querySubscribers() {
  if (!connection) {
    connection = await createConnection();
  }
  const [rows] = await connection.execute(`SELECT * FROM subscriber WHERE is_active=1;`);
  console.log(rows);
  return Array.isArray(rows) ? rows : [];
}

async function respond(req, res, next) {
  const subscribers = await querySubscribers();
  const mailerList = subscribers.map(p => p.email);
  const content = await sendEmail(mailerList, req.body);
  res.json(content);
  next();
}

async function respondTest(req, res, next) {
  await testConnection(config);
  res.json(true);
  next();
}

async function responseSubscribers(req, res, next) {
  const subscribers = await querySubscribers();
  res.json(subscribers);
  next();
}

const server = restify.createServer();
server.use(restify.plugins.bodyParser());

server.post('/', respond);
server.get('/testconnection', respondTest);
server.get('/subscribers', responseSubscribers);

server.listen(process.env.PORT || 80, function() {
  console.log('%s listening at %s', server.name, server.url);
});
