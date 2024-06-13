// consumer.ts
import { Kafka } from 'kafkajs';
import { ElasticSearchService } from './elasticsearchService';
import { IEmail,IElasticSearchService,IOutlookService } from '../common/abstractions';

const kafka = new Kafka({
  clientId: 'email-sync-worker',
  brokers: ['localhost:9092']
});
const elasticSearchService:IElasticSearchService = ElasticSearchService.getInstance();
const consumer = kafka.consumer({ groupId: 'email-sync-group' });

const processMessage = async ( message:any ) => {
  const { userId, emails } = JSON.parse(message.value.toString());
  console.log("userId:--> ",userId," emails-->",JSON.stringify(emails.slice(1,2)))

  try {
    const formattedEmails: IEmail[] = emails.map((email: any) => ({
        id: email.Id,
        userId,
        subject: email.Subject,
        body: email.BodyPreview,
        from: email.From.EmailAddress.Address,
        to: email.ToRecipients.map((recipient: any) => recipient.EmailAddress.Address),
        date: email.ReceivedDateTime
      }));
      console.log("formattedEmails--> ",JSON.stringify(formattedEmails.slice(1,2)))
      await elasticSearchService.indexEmails(formattedEmails);
    console.log(`Processed email sync task for user ${userId}`);
  } catch (error) {
    console.error(`Failed to process email sync task for user ${userId}:`, error);
  }
};

export const startConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'email-sync', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
        console.log("i am in")
      await processMessage(message);
    },
  });
};

startConsumer().catch(e=> console.error(e));
