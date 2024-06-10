export interface IUser {
  id: string;
  username: string;
  password: string;
  outlookToken?: string;
}

export interface IOutlookToken {
  access_token: string;
  refresh_token?:string;
  id_token?:string;
}
  

export const users: { [key: string]: IUser } = {};

export interface IUserService {
  addUser(userId:string,username:string, password:string ):Promise<IUser>;
  getOutlookAuthUrl():string;
  getOutlookToken(code: string):Promise<IOutlookToken>;
}