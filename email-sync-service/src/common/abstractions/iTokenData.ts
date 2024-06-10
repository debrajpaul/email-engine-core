import { IEmail } from "./iEmail";

export interface ITokenData{
    userId:string;
    accessToken: string;
  }

  export interface IFetchData{
    emails:IEmail[];
    userId: string;
  }
  
  export interface IOutlookService {
    getAccessToken(token: string): ITokenData;
    fetchEmails(token: string): Promise<IFetchData>;
  }