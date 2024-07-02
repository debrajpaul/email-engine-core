// pollingService.ts
import axios from 'axios';
import { OutlookService } from './outlookService';
import { ElasticSearchService } from './elasticsearchService';
import { enqueueEmailSyncTask } from './kafkaProducer';
import { IElasticSearchService,IOutlookService } from '../common/abstractions';

const POLLING_INTERVAL = 300000; // 5 minutes
const outlookService:IOutlookService = OutlookService.getInstance(axios.create());
const elasticSearchService:IElasticSearchService = ElasticSearchService.getInstance();

export const startPolling = () => {
  setInterval(async () => {
    const userIds = await elasticSearchService.getUserIds();
    for (const userId of userIds) {
      const emailIds = await elasticSearchService.getEmailIdsForUser(userId);
      for (const emailId of emailIds) {
        enqueueEmailSyncTask(userId, await outlookService.fetchEmailsByEmailId(userId,emailId));
      }
    }
  }, POLLING_INTERVAL);
};
