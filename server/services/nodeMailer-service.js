'use strict';

const nodemailer = require('nodemailer');
require('dotenv').config();

module.exports = {
  sendEmailConfirmation,
  sendInvitaion,
  transporter
}

async function sendEmailConfirmation(user) {
  const message = {
    from: 'noreply@netSocial.com',
    to: user.email,
    subject: 'NetSocial vous remercie ',
    text: 'Plaintext version of the message',
    html: '<p>HTML version of the message</p>'
  };

  await transporter.sendMail(message, (err, info) => {
    if (err) {
      return console.log('sendMail error: %s', err);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  });

}

async function sendInvitaion(userId) {
  const user = await User.findOne({userId});

  const message = {
    from: 'noreply@netSocial.com',
    to: user.email,
    subject: 'NetSocial vous remercie ',
    text: 'Plaintext version of the message',
    html: '<p>HTML version of the message</p>'
  };

  await transporter.sendMail(message, (err, info) => {
    if (err) {
      return console.log('sendMail error: %s', err);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  });
}

const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: process.env.SG_LOGIN,
    pass: process.env.SG_PWD
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false
  }
});


var message = {
  from: 'sender@server.com',
  to: 'receiver@sender.com',
  subject: 'Message title',
  text: 'Plaintext version of the message',
  html: '<p>HTML version of the message</p>'
};
