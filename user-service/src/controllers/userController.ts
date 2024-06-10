/**
 * @namespace
 * @module Routes
 * @description Route details for user API serive.
 * */
import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { config } from '../config';
import { users, IUser, IUserService,IOutlookToken } from '../common/abstractions';
import { UserService } from '../services/userService';

const userRouter:Router = Router();
const userService:IUserService = UserService.getInstance(axios.create());
/**
 * @swagger
 *
 * /:
 *   post:
 *     description: Create a new user account.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: I working a_ok.
 */

userRouter.post("/",async (req: Request, res: Response) => {
  const userId = Date.now().toString();
  const { username, password } = req.body;
  const newUser: IUser = await userService.addUser(userId,username,password)
  users[userId] = newUser;
  res.status(201).json({ userId:newUser });
})

/**
 * @swagger
 *
 * /link-outlook:
 *   post:
 *     description: Link Outlook account via OAuth.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: I working a_ok.
 */
userRouter.post("/link-outlook", async (req: Request, res: Response) => {
  const { userId } = req.body;
  if (!users[userId]) {
    return res.status(404).json({ error: 'User not found' });
  }

  const authUrl = userService.getOutlookAuthUrl();
  res.json({ authUrl });
})

/**
 * @swagger
 *
 * /outlook-callback:
 *   get:
 *     description: Get user details.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: code
 *         description: access code.
 *         in: query
 *         required: true
 *         type: string
 *       - name: userId
 *         description: user id.
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: I working a_ok.
 */
userRouter.get("/outlook-callback",async (req: Request, res: Response) => {
  const { code, userId } = req.query;

  if (!code || !userId) {
    return res.status(400).send('Invalid request');
  }

  try {
    const tokenData:IOutlookToken = await userService.getOutlookToken(code as string);
    users[userId as string].outlookToken = tokenData.access_token;

    const token = jwt.sign({ userId, accessToken:tokenData.access_token}, config.jwtSecret, { expiresIn: '3h' });
    res.json({ token });
  } catch (error) {
    console.error('Error retrieving Outlook token', error);
    res.status(500).send('Error retrieving Outlook token');
  }
})

export default userRouter;
