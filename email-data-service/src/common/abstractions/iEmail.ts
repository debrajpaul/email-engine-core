export interface IEmail {
  userId: string;
  subject: string;
  body: string;
  from: string;
  to: string[];
  date: string;
} 

export interface IElasticsearchDataService {
  indexEmail(email: IEmail ):Promise<void>;
  searchEmails(userId: string, query: string):Promise<Record<string, any>>;
  getEmailById(emailId: string):Promise<Record<string, any>>;
}