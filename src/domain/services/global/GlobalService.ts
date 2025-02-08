import { GlobalRepository } from '@/data/repositories/GlobalRepository';
import {IGeography} from 'mf_mesacyc_dashboards_common/Geography';
import {IWeek} from 'mf_mesacyc_dashboards_common/Week';

type GlobalFilters = {
  geographies: {statusCode: number | null; data: IGeography};
  weeks: {statusCode: number | null; data: IWeek};
}
interface IGlobalService {
  getFilters(token: string): Promise<GlobalFilters>;
}

export default class GlobalService implements IGlobalService {
  private globalRepository: GlobalRepository;

  constructor() {
    this.globalRepository = new GlobalRepository();
  }

  async getFilters(token: string): Promise<GlobalFilters> {
    try {
      const promises = await Promise.allSettled([
        this.globalRepository.getGeographies(token),
        this.globalRepository.getWeeks(token),
      ]);
      const geographiesResponse =
        promises[0].status === 'fulfilled' ? promises[0].value : {status: null, data: null};
      const weeksResponse =
        promises[1].status === 'fulfilled' ? promises[1].value : {status: null, data: null};

      return {
        geographies: {
          statusCode: geographiesResponse.status,
          data: geographiesResponse.data,
        },
        weeks: {
          statusCode: weeksResponse.status,
          data: weeksResponse.data,
        },
      };
    } catch (error) {
      throw new Error('Error on GlobalService, method getFilters');
    }
  }
}
