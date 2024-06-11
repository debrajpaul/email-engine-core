import { ElasticsearchDataService } from './elasticsearchService';
import { IEmail, IElasticsearchDataService } from '../common/abstractions';

jest.mock('@elastic/elasticsearch');

describe('ElasticsearchDataService', () => {
  let elasticsearchDataService: IElasticsearchDataService;

  beforeEach(() => {
    elasticsearchDataService = ElasticsearchDataService.getInstance();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getInstance should return a singleton instance', () => {
    const instance1 = ElasticsearchDataService.getInstance();
    const instance2 = ElasticsearchDataService.getInstance();
    expect(instance1).toBe(instance2);
  });
});
