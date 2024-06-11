import { Router, Request, Response } from 'express';
import { NotificationService } from '../services/notificationService';
import { INotification,INotificationService } from '../common/abstractions';


const notifyRouter:Router = Router();
const notificationService:INotificationService = NotificationService.getInstance();

/**
 * @swagger
 *
 * /:
 *   post:
 *     description: Send a notification.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: I working a_ok.
 */

notifyRouter.post("/",async (req: Request, res: Response) =>{
  const notification: INotification = req.body;
  
  try {
    await notificationService.sendEmail(notification);
    res.status(200).send('Notification sent successfully');
  } catch (error) {
    res.status(500).send('Error sending notification');
  }
})

export default notifyRouter;
