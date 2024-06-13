import { Kafka } from 'kafkajs';
import { IEmail } from '../common/abstractions';

const kafka = new Kafka({
  clientId: 'email-sync-service',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();

export const enqueueEmailSyncTask = async (userId: string, emails: IEmail[]) => {
  await producer.connect();
  await producer.send({
    topic: 'email-sync',
    messages: [
      { value: JSON.stringify({ userId, emails }) }
    ],
  });
  console.log("done with producer")
  await producer.disconnect();
};
