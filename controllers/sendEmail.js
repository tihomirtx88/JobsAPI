const nodemailer = require("nodemailer");

const sendEmail = async (req, res) => {
    try {
      let testAccount = await nodemailer.createTestAccount();
  
      const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
  
      let info = await transporter.sendMail({
        from: '"Coding Adict" <graciela.harber@ethereal.email>',
        to: 'graciela.harber@ethereal.email',
        subject: 'Hello',
        html: '<h2>Sending email with node.js</h2>'
      });
  
      res.json(info);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
  };

module.exports = {
    sendEmail
};