import {AxiosInstance} from 'axios';
import { mock, MockProxy } from 'jest-mock-extended';
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

  it('getInstance should return a singleton instance', () => {
    const instance1 = UserService.getInstance(axiosMock);
    const instance2 = UserService.getInstance(axiosMock);
    expect(instance1).toBe(instance2);
  });

  it('addUser should hash the password and return the new user', async () => {
    const userId = 'user123';
    const username = 'testuser';
    const password = 'password';

    const newUser = await userService.addUser(userId, username, password);

    expect(newUser.id).toEqual(userId);
    expect(newUser.username).toEqual(username);
  });

  it('getOutlookAuthUrl should return the correct authorization URL', () => {
    const expectedUrl = `${config.outlook.baseUrl}/authorize?client_id=${config.outlook.clientId}&response_type=code&redirect_uri=${config.outlook.redirectUri}&response_mode=query&scope=openid%20profile%20offline_access%20https%3A%2F%2Foutlook.office.com%2FMail.Read`;
    
    const authUrl = userService.getOutlookAuthUrl();
    
    expect(authUrl).toBe(expectedUrl);
  });
});
