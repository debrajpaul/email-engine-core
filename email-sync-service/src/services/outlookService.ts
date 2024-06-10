import {AxiosInstance} from 'axios';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import {IFetchData, IOutlookService, ITokenData } from '../common/abstractions';

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
    // Logic to retrieve the user's access token
  const decoded: any = jwt.verify(token, `${config.jwtSecret}`);
  console.log("decoded--> ",decoded)
  return {
    userId: decoded.userId,
    accessToken: decoded.accessToken
  };
  }

  async fetchEmails(token: string): Promise<IFetchData> {
    const tokenData = this.getAccessToken(token);
    const response = await this.httpClient.get('https://outlook.office.com/api/v2.0/me/messages', {
      headers: { Authorization: `Bearer ${tokenData.accessToken}` }
    });
    // console.log("response--> ",response)
    return {emails: response.data.value, userId:tokenData.userId};
  }
}