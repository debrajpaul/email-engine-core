export interface IEmail {
  id: string;
  userId: string;
  subject: string;
  body: string;
  from: string;
  to: string[];
  date: string;
}

export interface IErroredDocuments {
  status: number;
  error: any;
  operation: any;
  document: any;
}

export interface IElasticSearchService {
  indexEmails(emails: IEmail[] ):Promise<void>;
  searchEmails(userId: string, query: string):Promise<Record<string, any>>;
  getUserIds():Promise<string[]>
  getEmailIdsForUser(userId: string):Promise<string[]> 
}