// @format
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
    queueLimit: 0,
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
createPool().then(_pool => (pool = _pool));

async function querySubscribers() {
  if (!pool) {
    pool = await createPool();
  }
  const [rows] = await pool.execute(
    `SELECT * FROM subscriber WHERE is_active=1;`,
  );
  console.log(rows);
  return Array.isArray(rows) ? rows : [];
}

async function saveBuild({content, creator, product, version}) {
  if (!pool) {
    pool = await createPool();
  }
  if (!content) {
    throw new Error('content 不能为空');
  } else if (!creator) {
    throw new Error('creator 不能为空');
  } else if (!product) {
    throw new Error('product 不能为空');
  } else if (!version) {
    throw new Error('version 不能为空');
  }

  const sql =
    'INSERT INTO `build` ( `content`, `create_time`, `creator`, `product`, `version`) VALUES ( ?, NOW(), ?, ?, ? );';
  const result = await pool.execute(sql, [content, creator, product, version]);
  console.log(result);
  return result;
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

async function responseSaveBuild(req, res, next) {
  try {
    const body = req.body;
    const result = await saveBuild({
      content: body.content,
      creator: body.creator,
      product: body.product,
      version: body.version,
    });
    res.json(result);
  } catch (err) {
    res.send(400, {message: err.message, success: false});
  }
  next();
}

async function respondLoggerServer(req, res, next) {
  res.json({
    name: 'logger server'
  });
  next();
}

async function respondLog(req, res, next) {
  res.json({
    name: 'logger server log'
  });
  next();
}

const server = restify.createServer();
server.use(restify.plugins.bodyParser());

server.post('/', respond);
server.post('/savebuild', responseSaveBuild);
server.get('/testconnection', respondTest);
server.get('/subscribers', responseSubscribers);

server.get('/logger', respondLoggerServer);
server.post('/logger/log', respondLog);

server.listen(process.env.PORT || 80, function() {
  console.log('%s listening at %s', server.name, server.url);
});
