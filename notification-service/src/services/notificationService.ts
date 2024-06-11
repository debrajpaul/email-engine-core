import nodemailer,{Transporter,SentMessageInfo} from 'nodemailer';
import { config } from '../config';
import { INotification,INotificationService } from '../common/abstractions';

export class NotificationService implements INotificationService{
  private static instance:NotificationService;
  private readonly transporter:Transporter<SentMessageInfo>;

  private constructor(){
    this.transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: {
        user: config.smtp.auth.user,
        pass: config.smtp.auth.pass
      },
      debug: true
    })
  }
  static getInstance():NotificationService {
    if(!NotificationService.instance){
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  async sendEmail(notification: INotification): Promise<void> {
    try {
      const mailOptions = {
        from: '"Email Engine" <sentimentTest@outlook.com>',
        to: notification.email,
        subject: notification.subject,
        text: notification.message
      };
      const sendEmailResult = await this.transporter.sendMail(mailOptions);
      console.log(sendEmailResult);
    } catch (error) {
      console.error("somthing went wrong", error)
    }
  }
}