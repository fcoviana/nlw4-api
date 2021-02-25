import nodemailer, { Transporter } from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';

class SendMailService {
  private cliente: Transporter;

  constructor() {
    nodemailer.createTestAccount().then((account) => {
      const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });

      this.cliente = transporter;
    });
  }

  async execute(to: string, subject: string, variables: object, path: string) {
    const templateFileContent = fs.readFileSync(path).toString('utf-8');
    const mailTempleteParse = handlebars.compile(templateFileContent);
    const html = mailTempleteParse(variables);

    const message = await this.cliente.sendMail({
      to,
      subject,
      html,
      from: 'NPS <>noreplay@nps.com.br',
    });

    console.log('Message sent: %s', message.messageId);
    console.log('Previwe URL: %s', nodemailer.getTestMessageUrl(message));
  }
}

export default new SendMailService();
