const nodeMailer = require("nodemailer");

class MailService {
  constructor() {
    this.transporeter = nodeMailer.createTransport({
      host: process.env.MAIL_SERVER,
      port: process.env.MAIL_PORT,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendActivationMail(email, activationLink) {
      const mailOptions = {
         from: process.env.MAIL_USER,
         to: email,
         subject: "Activation link" + process.env.API_URL,
         html: `<a href="${activationLink}">Activate your account</a>`,
      };
      await this.transporeter.sendMail(mailOptions);

  }
}

module.exports = new MailService();
