import { IGeography } from 'mf_mesacyc_dashboards_common/Geography';
import { IWeek } from 'mf_mesacyc_dashboards_common/Week';

export interface IGlobalRepository {      
    getGeographies(token: string): Promise<{status: number, data: IGeography}>;
    getWeeks(token: string): Promise<{status: number, data: IWeek}>;
}