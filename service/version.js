const restify = require('restify');
const mysql = require('mysql2/promise');
const sendEmail = require('../app').sendEmail;

const config = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
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

async function createPool() {
  const pool = mysql.createPool({
    ...config,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  console.log('pool created');
  return pool;
}

async function createConnection() {
  const connection = await mysql.createConnection(config);
  console.log('msyql server connected');
  return connection;
}

let pool = null;
createPool().then(_pool => pool = _pool);

async function querySubscribers() {
  if (!pool) {
    pool = await createPool();
  }
  const [rows] = await pool.execute(`SELECT * FROM subscriber WHERE is_active=1;`);
  console.log(rows);
  return Array.isArray(rows) ? rows : [];
}

async function respond(req, res, next) {
  try {
    const subscribers = await querySubscribers();
    const mailerList = subscribers.map(p => p.email);
    const content = await sendEmail(mailerList, req.body);
    res.json(content);
  } catch (err) {
    res.json(err.message);
  }
  next();
}

async function respondTest(req, res, next) {
  await testConnection(config);
  res.json(true);
  next();
}

async function responseSubscribers(req, res, next) {
  try {
    const subscribers = await querySubscribers();
    res.json(subscribers);
  } catch (err) {
    res.json(err.message);
  } 
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
