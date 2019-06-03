const { has } = require('../lib/utils');

/**
 * bootstrap
 * @param {object} pool
 * @param {function} createPool
 */
module.exports = function bootstrap(pool, createPool) {
  return {
    /**
     * 得到最新的版本
     * @param {string} platform, 'dingtalk' | 'PC' | 'wechat'
     */
    getLatestVersion: async function(platform) {
      if (!pool) {
        pool = await createPool();
      }

      const allowedPlatforms = ['dingtalk', 'PC', 'wechat'];

      if (!platform) {
        throw new Error('platform 不能为空');
      } else if (!allowedPlatforms.includes(platform)) {
        throw new Error(
          `platform: ${platform} 不属于 ${allowedPlatforms.join(
            ', '
          )}中的任意一个`
        );
      }

      const sql =
        'SELECT `id`, `product`, `version`, `content`, `creator`, `create_time` FROM `build` where `product`=? ORDER BY ID DESC LIMIT 1';

      const [rows] = await pool.execute(sql, [platform]);
      if (rows.length > 0) {
        return rows[0];
      } else {
        throw new Error('查无数据');
      }
    },

    /**
     * 保存编译的版本到库
     * @param {object} version
     * @return {object}
     */
    saveBuild: async function({ content, creator, product, version }) {
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
      const result = await pool.execute(sql, [
        content,
        creator,
        product,
        version,
      ]);
      console.log(result);
      return result;
    },

    saveActivity: async function(activity) {
      if (!pool) {
        pool = await createPool();
      }

      const {
        level,
        ua = null,
        os = null,
        browser = null,
        org = null,
        ip = null,
        platform,
        message,
      } = activity;

      // validation
      const requiredKeys = ['level', 'platform', 'message'];
      for (const key of requiredKeys) {
        if (!has(activity, key)) {
          throw new Error(`${key} 不能为空`);
        }
      }

      const allowedLevels = ['info', 'warn', 'error'];
      if (!allowedLevels.includes(level)) {
        throw new Error(
          'level: ' +
            level +
            ' 不属于' +
            allowedLevels.join(', ') +
            '中的任意一个'
        );
      }

      const allowedPlatforms = ['dingtalk', 'PC', 'wechat'];
      if (!allowedPlatforms.includes(platform)) {
        throw new Error(
          `platform: ${platform} 不属于 ${allowedPlatforms.join(
            ', '
          )}中的任意一个`
        );
      }

      const sql =
        'INSERT INTO `client_activity` ( `browser`, `ip`, `level`, `message`, `org`, `os`, `platform`, `timestamp`, `ua`) VALUES ( ?, ?, ?, ?, ?, ?, ?, NOW(), ? );';

      const [rows] = await pool.execute(sql, [
        browser,
        ip,
        level,
        message,
        org,
        os,
        platform,
        ua,
      ]);
      console.log(rows);
      return rows;
    },
  };
};
