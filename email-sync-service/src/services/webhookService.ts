import { enqueueEmailSyncTask } from './kafkaProducer';

export const handleWebhook = async (body: any) => {
  const { userId, changeType, resourceData } = body;

  switch (changeType) {
    case 'created':
    case 'updated':
    case 'deleted':
      await enqueueEmailSyncTask(userId, resourceData);
      break;
    default:
      console.log('Unknown change type');
  }
};
