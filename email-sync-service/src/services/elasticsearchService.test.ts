import { ElasticSearchService } from './elasticsearchService';
import { IEmail, IElasticSearchService, IErroredDocuments } from '../common/abstractions';

jest.mock('@elastic/elasticsearch');

describe('ElasticSearchService', () => {
  let elasticSearchService: IElasticSearchService;

  beforeEach(() => {
    elasticSearchService = ElasticSearchService.getInstance();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getInstance should return a singleton instance', () => {
    const instance1 = ElasticSearchService.getInstance();
    const instance2 = ElasticSearchService.getInstance();
    expect(instance1).toBe(instance2);
  });
});
