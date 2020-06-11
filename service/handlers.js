const mysql = require('mysql2/promise');
const sendEmail = require('./email').sendEmail;
const bootstrap = require('./db');
const { has } = require('../lib/utils');
const logger = require('./logger');
const { db: config } = require('../config');

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

module.exports = {
  respond,
  responseSaveBuild,
  respondTest,
  responseSubscribers,
  respondLoggerServer,
  respondLog,
  respondGetLatestVersion,
}
