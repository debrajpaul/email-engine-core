import { Client } from '@elastic/elasticsearch';
import { config } from '../config';
import { IEmail,IElasticSearchService,IErroredDocuments } from '../common/abstractions';


export class ElasticSearchService implements IElasticSearchService {

  private static instance:ElasticSearchService;
  private readonly httpClient:Client;

  private constructor(){
    this.httpClient = new Client({
      node: config.elasticsearch.node
    });
  }

  static getInstance():ElasticSearchService {
    if(!ElasticSearchService.instance){
      ElasticSearchService.instance = new ElasticSearchService()
    }
    return ElasticSearchService.instance
  }

  async indexEmails(emails: IEmail[]): Promise<void> {
    try {
      const operations = emails.flatMap(email => [
        { index: { _index: 'emails', _id: email.id } },
        email
      ]);
    
      const bulkResponse:any = await this.httpClient.bulk({
        body: operations
      });
    
      if (bulkResponse.errors) {
        const erroredDocuments: IErroredDocuments[] = [];
        bulkResponse.items.forEach((action: any, i: number) => {
          const operation = Object.keys(action)[0];
          if (action[operation].error) {
            erroredDocuments.push({
              status: action[operation].status,
              error: action[operation].error,
              operation: operations[i * 2],
              document: operations[i * 2 + 1]
            });
          }
        });
        console.error('Error indexing some documents:', erroredDocuments);
      } else {
        console.log('All emails indexed successfully');
      }
    } catch (error) {
      console.error('Failed to sync emails:', error);
    }
  }

  async searchEmails(userId: string, query: string): Promise<Record<string, any>> {
    const {body} = await this.httpClient.search({
      index: 'emails',
      body: {
        query: {
          bool: {
            must: [
              { match: { userId } },
              { match: { subject: query } }
            ]
          }
        }
      }
    });
    return body.hits.hits;
  }

  async getUserIds():Promise<string[]> {
    // Implement this function to get all user IDs
    return [""]
  }

  async getEmailIdsForUser (userId: string): Promise<string[]> {
    const result = await this.httpClient.search({
      index: 'emails', // Ensure this matches the index name used in your Elasticsearch setup
      body: {
        query: {
          match: {
            userId: userId
          }
        },
        _source: false, // We don't need the actual documents, just the IDs
        fields: [], // This helps to reduce the payload size
      }
    });
    return result.body.hits.hits.map((hit: any) => hit._id);
  };
  
}