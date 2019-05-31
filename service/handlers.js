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
  };
};
