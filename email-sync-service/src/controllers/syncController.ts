/**
 * @namespace
 * @module Routes
 * @description Route details for sync API serive.
 * */
import { Router , Request, Response } from 'express';
import { OutlookService } from '../services/outlookService';
import { ElasticSearchService } from '../services/elasticsearchService';
import { rateLimiter } from '../utils/rateLimiter';
import { IEmail,IElasticSearchService,IOutlookService } from '../common/abstractions';
import { enqueueEmailSyncTask } from '../services/kafkaProducer';
import { startConsumer } from '../services/kafkaConsumer';
import { handleWebhook } from '../services/webhookService';
import axios from 'axios';

const syncRateLimiter = rateLimiter(10, 60000); // 10 requests per minute
const syncRouter:Router = Router();
const outlookService:IOutlookService = OutlookService.getInstance(axios.create());
const elasticSearchService:IElasticSearchService = ElasticSearchService.getInstance();

/**
 * @swagger
 *
 * /:
 *   post:
 *     description: Start synchronization for a user.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: I working a_ok.
 */

syncRouter.post("/:token",async (req: Request, res: Response) =>  {
  const { token } = req.params;

  if (!syncRateLimiter()) {
    return res.status(429).send('Rate limit exceeded. Try again later.');
  }

  try {
    const {emails, userId} = await outlookService.fetchEmails(token);
    enqueueEmailSyncTask(userId,emails)
    // console.log("emails--> ",JSON.stringify(emails.slice(2)))
    // const formattedEmails: IEmail[] = emails.map((email: any) => ({
    //   id: email.Id,
    //   userId,
    //   subject: email.Subject,
    //   body: email.BodyPreview,
    //   from: email.From.EmailAddress.Address,
    //   to: email.ToRecipients.map((recipient: any) => recipient.EmailAddress.Address),
    //   date: email.ReceivedDateTime
    // }));
    // // console.log("formattedEmails--> ",JSON.stringify(formattedEmails.slice(1,2)))
    // await elasticSearchService.indexEmails(formattedEmails);

    res.status(200).send('Emails synchronized successfully.');
  } catch (error) {
    console.error(error)
    res.status(500).send('Error synchronizing emails.');
  }
})

/**
 * @swagger
 *
 * /status:
 *   get:
 *     description: Check sync status.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: I working a_ok.
 */

syncRouter.get("/status/:userId",async (req: Request, res: Response) =>  {
  // Logic to check sync status
  const { userId } = req.params;
  startConsumer().catch(e=> console.error(e));
  res.json({ status: 'In Progress', user:userId });
})

/**
 * @swagger
 *
 * /outlook-webhook:
 *   post:
 *     description: For immediate notification of changes in the mailbox.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: I working a_ok.
 */

syncRouter.post('/outlook-webhook', async (req, res) => {
  try {
    await handleWebhook(req.body);
    res.status(200).send('Event received');
  } catch (error) {
    res.status(500).send('Error processing event');
  }
});

export default syncRouter;