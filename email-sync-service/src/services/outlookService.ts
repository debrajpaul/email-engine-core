import {AxiosInstance} from 'axios';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { IEmail, IOutlookService, ITokenData } from '../common/abstractions';

export class OutlookService implements IOutlookService {
  private static instance:OutlookService;
  private readonly httpClient:AxiosInstance;
  private constructor(httpClient:AxiosInstance){
    this.httpClient = httpClient;
  }
  static getInstance(httpClient:AxiosInstance):OutlookService {
    if(!OutlookService.instance){
      OutlookService.instance = new OutlookService(httpClient)
    }
    return OutlookService.instance
  }

  getAccessToken(token: string): ITokenData {
  const decoded: any = jwt.verify(token, `${config.jwtSecret}`);
  return {
    userId: decoded.userId,
    accessToken: decoded.accessToken
  };
  }

  async fetchEmails(accessToken: string): Promise<IEmail[]> {
    const response = await this.httpClient.get('https://outlook.office.com/api/v2.0/me/messages', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response.data.value
  }

  async fetchEmailsByEmailId(userId:string, emailId: string): Promise<IEmail[]>{
     // Implement this function to get all emails for an user
    const accessToken = "";
    return this.fetchEmails(accessToken)
  }
}