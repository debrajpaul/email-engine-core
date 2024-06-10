import { Router, Request, Response } from 'express';
import { ElasticsearchDataService } from '../services/elasticsearchService';
import { IEmail,IElasticsearchDataService } from '../common/abstractions';

const dataRouter:Router = Router();
const elasticsearchDataService:IElasticsearchDataService = ElasticsearchDataService.getInstance();


/**
 * @swagger
 *
 * /:
 *   post:
 *     description: Check sync status.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: I working a_ok.
 */

dataRouter.post("/",async (req: Request, res: Response) => { 
  const email: IEmail = req.body;
  await elasticsearchDataService.indexEmail(email);
  res.status(201).send('Email indexed');
})

/**
 * @swagger
 *
 * /:
 *   get:
 *     description: Check sync status.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: I working a_ok.
 */

dataRouter.get("/:userId",async (req: Request, res: Response) =>  {
  try {
    const userId = req.params.userId;
    const query = req.query.q as string;
    const results = await elasticsearchDataService.searchEmails(userId, query);
    res.json(results);
  } catch (error) {
    console.error(error)
    res.status(500).send('Error Search User Emails.');
  }
})

/**
 * @swagger
 *
 * /user:
 *   get:
 *     description: Check sync status.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: I working a_ok.
 */

dataRouter.get("/user/:emailId",async (req: Request, res: Response) =>{ 
  try {
    const emailId = req.params.emailId;
    const email = await elasticsearchDataService.getEmailById(emailId);
    res.json(email);
  } catch (error) {
    console.error(error)
    res.status(500).send('Error Get Email Details.');
  }
})

export default dataRouter;