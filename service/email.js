const Email = require('email-templates');
const nodemailer = require('nodemailer');
const { email: auth } = require('../config');

function configEmail() {
  const transport = nodemailer.createTransport({
    service: 'qq', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
    secureConnection: true, // 使用了 SSL
    auth,
  });

  const email = new Email({
    message: {
      from: auth.user,
    },
    // uncomment below to send emails in development/test env:
    // send: true,
    transport,
  });

  return email;
}

const email = configEmail();

exports.sendEmail = function(to, locals) {
  return email.send({
    template: 'build',
    message: {
      to,
    },
    locals,
  });
};
