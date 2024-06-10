// userService.test.ts
import { mock, MockProxy } from 'jest-mock-extended';
import {AxiosInstance} from 'axios';
import bcrypt from 'bcryptjs';
import { UserService } from './userService';
import { config } from '../config';
import { IUser, IOutlookToken,IUserService } from '../common/abstractions';

describe('UserService', () => {
  let userService: IUserService;
  let axiosMock:MockProxy<AxiosInstance>;

  beforeEach(() => {
    axiosMock = mock<AxiosInstance>();
    userService = UserService.getInstance(axiosMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  test('getInstance should return a singleton instance', () => {
    const instance1 = UserService.getInstance(axiosMock);
    const instance2 = UserService.getInstance(axiosMock);
    expect(instance1).toBe(instance2);
  });

  test('addUser should hash the password and return the new user', async () => {
    const userId = 'user123';
    const username = 'testuser';
    const password = 'password';

    const newUser = await userService.addUser(userId, username, password);

    expect(newUser.id).toEqual(userId);
    expect(newUser.username).toEqual(username);
  });

  test('getOutlookAuthUrl should return the correct authorization URL', () => {
    const expectedUrl = `${config.outlook.baseUrl}/authorize?client_id=${config.outlook.clientId}&response_type=code&redirect_uri=${config.outlook.redirectUri}&response_mode=query&scope=openid%20profile%20offline_access%20https%3A%2F%2Foutlook.office.com%2FMail.Read`;
    
    const authUrl = userService.getOutlookAuthUrl();
    
    expect(authUrl).toBe(expectedUrl);
  });

  // test('getOutlookToken should return the access token', async () => {
  //   const code = 'authorization_code';
  //   const tokenResponse: IOutlookToken = {
  //     access_token: 'access_token',
  //   };
  //   axiosMock.post.mockResolvedValue({ data: tokenResponse });

  //   const response = await userService.getOutlookToken(code);

  //   console.log("response--> ",response)

  //   expect(response).toStrictEqual(tokenResponse);
  //   // expect(axiosMock.post).toHaveBeenCalledWith(`${config.outlook.baseUrl}/token`, new URLSearchParams({
  //   //   client_id: config.outlook.clientId,
  //   //   client_secret: config.outlook.clientSecret,
  //   //   code,
  //   //   redirect_uri: config.outlook.redirectUri,
  //   //   grant_type: 'authorization_code'
  //   // }), {
  //   //   headers: {
  //   //     'Content-Type': 'application/x-www-form-urlencoded'
  //   //   }
  //   // });
  // });

  // test('getOutlookToken should throw an error for invalid code', async () => {
  //   const code = 'invalid_code';
  //   const errorResponse = {
  //     error: 'invalid_grant',
  //     error_description: 'Authorization code is invalid or expired.',
  //   };

  //   axiosMock.post.mockRejectedValue({ response: { status: 400, data: errorResponse } });

  //   await expect(userService.getOutlookToken(code)).rejects.toThrow('Request failed with status code 400');
  // });
});
