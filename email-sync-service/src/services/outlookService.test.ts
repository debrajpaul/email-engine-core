import { mock, MockProxy } from 'jest-mock-extended';
import axios, { AxiosInstance } from 'axios';
import jwt from 'jsonwebtoken';
import { OutlookService } from './outlookService';
import { config } from '../config';
import { IOutlookService } from '../common/abstractions';

jest.mock('axios');
jest.mock('jsonwebtoken');

describe('OutlookService', () => {
  let outlookService: IOutlookService;
  let httpClientMock: MockProxy<AxiosInstance>;

  beforeEach(() => {
    httpClientMock = mock<AxiosInstance>();
    outlookService = OutlookService.getInstance(httpClientMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getInstance should return a singleton instance', () => {
    const instance1 = OutlookService.getInstance(httpClientMock);
    const instance2 = OutlookService.getInstance(httpClientMock);
    expect(instance1).toBe(instance2);
  });

  it('getAccessToken should decode the JWT and return token data', () => {
    const token = 'jwt-token';
    const decoded = { userId: 'user123', accessToken: 'access-token' };

    (jwt.verify as jest.Mock).mockReturnValue(decoded);

    const result = outlookService.getAccessToken(token);

    expect(result).toEqual({ userId: 'user123', accessToken: 'access-token' });
    expect(jwt.verify).toHaveBeenCalledWith(token, config.jwtSecret);
  });
});
