import { axiosGlobal, AxiosError } from 'mf_mesacyc_dashboards_common/axios';
import { IGeography, Territorio, Geography } from 'mf_mesacyc_dashboards_common/Geography';
import { IWeek, weeks, Week } from 'mf_mesacyc_dashboards_common/Week';
import { processParams } from 'mf_mesacyc_dashboards_common/processParams';
import { IGlobalRepository } from '@/domain/repositories/IGlobalRepository';

const proxyUrl =(`https://proxy-reverse-production.up.railway.app/torre-control/cobranza-credito/investigacion-cobranza/ffm/lbd-middleware-seguridadffm/torrecontrol`);

export class GlobalRepository implements IGlobalRepository {
  private readonly apiUrl = proxyUrl

  async getGeographies(token: string): Promise<{ status: number; data: IGeography }> {
    try {

      const params = processParams(token, true)
      const baseUrl = `${this.apiUrl}/solicitudes/geografias/`;
      const body = {
        data: params
      }

      const response: { status: number; data: {resultado: Territorio[]} } = await axiosGlobal.post(
        `${baseUrl}`, body, { headers: { Authorization: `Bearer ${token}` } }
      );
      return { status: response.status, data: Geography.fromJson(response.data.resultado)};
    } catch (err: unknown) {
      const error = err as AxiosError;
      if (!error?.response?.status) {
        return { status: 500, data: null };
      }
      return { status: error.response.status, data: null };
    }
  }

  async getWeeks(token: string): Promise<{ status: number; data: IWeek }> {
    try {
      const baseUrl = `${this.apiUrl}/solicitudes/semanas/`;

      const response: { status: number; data: {resultado:weeks[]} } = await axiosGlobal.post(
        `${baseUrl}`, { data: '' },{ headers: { Authorization: `Bearer ${token}` } }
      );
      return { status: response.status, data: response.data.resultado.map(Week.fromJson) };
    } catch (err: unknown) {
      const error = err as AxiosError;
      if (!error?.response?.status) {
        return { status: 500, data: null };
      }
      return { status: error.response.status, data: null }
    }
  }
}
