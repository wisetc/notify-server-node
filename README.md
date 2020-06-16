这是一个邮件服务，用来在自动构建成功以后发送电子邮件给选择的人。

## 支持的功能列表

- 发送构建通知邮件
- 保存构建信息到表
- 查看邮件订阅人
- 根据平台查询最新的版本信息

## API列表

请直接查看源码文件`src/routes.js`，找到对应的路由和参数。

例如：

- GET /version/latest
- GET /testconnection
- GET /subscribers

## 修改邮件模板

请找到对应的模板文件，它们放置在`emails/build`文件夹中。其中涉及到的参数由请求参数中传递进去。例如：`name, detail, commitMessage, author, version, url`。模板采用pug语法编写。

## 导入数据

数据表结构保存在 `<rootDir>/data`目录下。

## 设置服务

包含如下的环境变量。

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

设置数据库信息，服务端口，QQ邮箱配置等。可以通过在项目根目录下新建一个`.env`文件来管理环境变量的配置。

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

## 部署

可以使用pm2部署，已内置一个配置文件。
