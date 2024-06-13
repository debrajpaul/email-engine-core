import Redis from 'ioredis';
import { config } from '../config';
import { Client } from '@elastic/elasticsearch';
import { IEmail,IElasticsearchDataService } from '../common/abstractions';


export class ElasticsearchDataService implements IElasticsearchDataService {

  private static instance:ElasticsearchDataService;
  private readonly httpClient:Client;
  private readonly redis:Redis;

  private constructor(){
    this.httpClient = new Client({
      node: config.elasticsearch.node
    });
    this.redis = new Redis({
      host: 'localhost', // Update with your Redis host if needed
      port: 6379, // Update with your Redis port if needed
    });
  }

  static getInstance():ElasticsearchDataService {
    if(!ElasticsearchDataService.instance){
      ElasticsearchDataService.instance = new ElasticsearchDataService()
    }
    return ElasticsearchDataService.instance
  }

 async indexEmail(email: IEmail): Promise<void> {
  await this.httpClient.index({
    index: 'emails',
    body: email
  });
 }

 async searchEmails(userId: string, query: string): Promise<Record<string, any>> {
   // if (!query) {
  //   throw new Error('Query parameter is required');
  // }
  const cacheKey = `searchEmails:${userId}`;
  const cachedData = await this.redis.get(cacheKey);
  if (cachedData) {
    console.log('Cache hit');
    return JSON.parse(cachedData);
  }
  console.log('Cache miss');
  const {body} = await this.httpClient.search({
    index: 'emails',
    body: {
      query: {
        bool: {
          must: [
            { match: { userId } },
            // { match: { subject: query } }
          ]
        }
      }
    }
  });
  await this.redis.set(cacheKey, JSON.stringify(body.hits.hits), 'EX', 600); // Cache for 10 minite
  return body.hits.hits;
 }

 async getEmailById(emailId: string): Promise<Record<string, any>> {
  const cacheKey = `getEmailById:${emailId}`;
  const cachedData = await this.redis.get(cacheKey);

  if (cachedData) {
    console.log('Cache hit');
    return JSON.parse(cachedData);
  }

  console.log('Cache miss');
  const {body}  = await this.httpClient.get({
    index: 'emails',
    id:emailId
  });

  await this.redis.set(cacheKey, JSON.stringify(body._source), 'EX',  600); // Cache for 10 minite
  return body._source;
 }
}