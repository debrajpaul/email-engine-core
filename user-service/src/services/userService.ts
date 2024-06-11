import {AxiosInstance} from 'axios';
import bcrypt from 'bcryptjs';
import { config } from '../config';
import { IUserService,IUser,IOutlookToken } from "../common/abstractions";

export class UserService implements IUserService {

  private static instance:UserService;
  private readonly httpClient:AxiosInstance;

  private constructor(httpClient:AxiosInstance){
    this.httpClient =httpClient;
  }

  static getInstance(httpClient:AxiosInstance):UserService {
    if(!UserService.instance){
      UserService.instance = new UserService(httpClient)
    }
    return UserService.instance
  }
      
  async addUser(userId:string,username:string, password:string ):Promise<IUser>{
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: IUser = { id: userId, username, password: hashedPassword };
    return newUser;
  }

  getOutlookAuthUrl(): string {
    const scopes = encodeURIComponent('openid profile offline_access https://outlook.office.com/Mail.Read');
    const authUrl = `${config.outlook.baseUrl}/authorize?client_id=${config.outlook.clientId}&response_type=code&redirect_uri=${config.outlook.redirectUri}&response_mode=query&scope=${scopes}`;
    return authUrl;
  }

  async getOutlookToken(code: string):Promise<IOutlookToken> {
    const response = await this.httpClient.post(`${config.outlook.baseUrl}/token`, new URLSearchParams({
      client_id: config.outlook.clientId,
      client_secret: config.outlook.clientSecret,
      code,
      redirect_uri: config.outlook.redirectUri,
      grant_type: 'authorization_code'
    }),{
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return response?.data;
  }
}