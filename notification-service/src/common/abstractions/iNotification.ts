export interface INotification {
  userId: string;
  email: string;
  subject: string;
  message: string;
}


export interface INotificationService {
  sendEmail(notification: INotification):Promise<void>;
}