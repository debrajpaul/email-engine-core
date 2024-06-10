import { Client } from '@elastic/elasticsearch';
import { config } from '../config';
import { IEmail,IElasticsearchDataService } from '../common/abstractions';


export class ElasticsearchDataService implements IElasticsearchDataService {

  private static instance:ElasticsearchDataService;
  private readonly httpClient:Client;

  private constructor(){
    this.httpClient = new Client({
      node: config.elasticsearch.node
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
  return body.hits.hits;
 }

 async getEmailById(emailId: string): Promise<Record<string, any>> {
  const {body}  = await this.httpClient.get({
    index: 'emails',
    id:emailId
  });
  return body._source;
 }
}