这是一个邮件服务，用来在自动构建成功以后发送电子邮件给选择的人。

## 支持的功能列表

- 发送构建通知邮件
- 保存构建信息到表
- 查看邮件订阅人
- 根据平台查询最新的版本信息

## API列表

请直接查看源码文件`src/routes.js`，找到对应的路由和参数。

## 导入数据

数据表结构保存在 `<rootDir>/data`目录下。

## 设置服务

```
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root
DB_DATABASE=mydb

APP_PORT=7100

EMAIL_USERNAME=who@qq.com
EMAIL_PASSWORD=somepass
```

设置数据库信息，服务端口，QQ配置等。

## 启动

```bash
$ npm start
```

## 测试

### 测试 logger

使用 postman 访问 `http://localhost:7100/logger`。

运行 test

```
$ npm test
```
