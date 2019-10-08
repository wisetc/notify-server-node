// @format
const restify = require('restify');
const mysql = require('mysql2/promise');
const corsMiddleware = require('restify-cors-middleware');
const sendEmail = require('../app').sendEmail;
const winston = require('winston');
const { has } = require('../lib/utils');
const bootstrap = require('./handlers');
 
const config = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

const { combine, timestamp, prettyPrint } = winston.format;

const logger = winston.createLogger({
  format: combine(
    timestamp(),
    prettyPrint()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

const cors = corsMiddleware({
  preflightMaxAge: 5,
  origins: ['*'],
  allowHeaders: ['API-Token'],
  exposeHeaders: ['API-Token-Expiry'],
})

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

const handlers = bootstrap(pool, createPool);

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
    const result = await handlers.saveBuild({
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

function respondLoggerServer(req, res, next) {
  res.json({
    name: 'logger server'
  });
  next();
}

async function respondLog(req, res, next) {
  const { body } = req;
  const allowedLevels = ['info', 'warn', 'error'];

  if (!body) {
    res.send(400, {message: '未携带任何参数', success: false});
    return next();
  } else if (!has(body, 'level')) {
    res.send(400, {message: 'level 不可缺', success: false});
    return next();
  } else if (!allowedLevels.includes(body.level)) {
    res.send(400, {message: 'level: '+ body.level +' 不属于' + allowedLevels.join(', ') + '中的任意一个', success: false});
    return next();
  } else if (!has(body, 'message')) {
    res.send(400, {message: 'message 不可缺', success: false});
    return next();
  }
  
  logger.log(body);
  if (body.save) {
    try {
      await handlers.saveActivity(body);
      res.json(body);
    } catch (e) {
      res.send(400, {message: e.message, success: false});
    }
  } else {
    res.json(body);
  }

  next();
}

async function respondGetLatestVersion(req, res, next) {
  const { query } = req;

  if (!query) {
    res.send(400, {message: '未携带任何参数', success: false});
    return next();
  } else if (!has(query, 'platform')) {
    res.send(400, {message: 'platform 不可缺', success: false});
    return next();
  }

  try {
    const result = await handlers.getLatestVersion(query.platform);
    res.json({data: result, success: true});
    return next();
  } catch(e) {
    res.send(400, {message: e.message, success: false});
    return next();
  }
}

const server = restify.createServer();
server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.post('/sendemail', respond);
server.post('/savebuild', responseSaveBuild);
server.get('/testconnection', respondTest);
server.get('/subscribers', responseSubscribers);

server.get('/logger', respondLoggerServer);
server.post('/logger/log', respondLog);

server.get('/version/latest', respondGetLatestVersion);

server.listen(process.env.PORT || 80, function() {
  console.log('%s listening at %s', server.name, server.url);
});
