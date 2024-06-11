import { mock, MockProxy } from 'jest-mock-extended';
import nodemailer from 'nodemailer';
import { NotificationService } from './notificationService';
import { INotification,INotificationService } from '../common/abstractions';

jest.mock('nodemailer');

describe('NotificationService', () => {
  let notificationService: INotificationService;
  let transporterMock: MockProxy<nodemailer.Transporter>;

  beforeEach(() => {
    transporterMock = mock<nodemailer.Transporter>();
    (nodemailer.createTransport as jest.Mock).mockReturnValue(transporterMock);
    notificationService = NotificationService.getInstance();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('sendEmail should send an email with correct options', async () => {
    const notification: INotification = {
      userId: 'user123',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'Test Message',
    };

    transporterMock.sendMail.mockResolvedValue({} as nodemailer.SentMessageInfo);

    await notificationService.sendEmail(notification);

    expect(transporterMock.sendMail).toHaveBeenCalledWith({
      from: '"Email Engine" <sentimentTest@outlook.com>',
      to: notification.email,
      subject: notification.subject,
      text: notification.message,
    });
  });
});
