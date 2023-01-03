const nodemailer = require('nodemailer');
class MailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host:"smtp.gmail.com",
            // process.env.SMTP_HOST,
            port: 587,
           // process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: "usellproject@gmail.com",
                //process.env.SMTP_USER,
                pass:"vavoonxvradsjbje"
                // process.env.SMTP_PASSWORD
            }
        })
    }

    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Aсtivation/Forget Password of account  ' + process.env.API_URL,
            text: '',
            html:
                `
                    <div>
                        <h1>To active account or reset password  go to link</h1>
                        <a href="${link}">
                        ${link}</a>
                    </div>
                `
        })
    }
    async sendTempPasswordMail(to, temppassword) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'This is your temporary password  ',
            text: '',
            html:
                `
                    <div>
                        <h1>This is your temporary password</h1>
                        ${temppassword}
                    </div>
                `
        })
    }
    
}

module.exports = new MailService();