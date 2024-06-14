import { IEmail } from "./iEmail";

export interface ITokenData{
    userId:string;
    accessToken: string;
  }
  
  export interface IOutlookService {
    getAccessToken(token: string): ITokenData;
    fetchEmails(accessToken: string): Promise<IEmail[]>;
  }