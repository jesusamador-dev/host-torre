import { IAuthRepository, IRequestLogin } from '@/domain/repositories/IAuthRepository';
// no sonar
import { axiosGlobal } from 'mf_mesacyc_dashboards_common/axios';

export class AuthRepository implements IAuthRepository {

  async login(request: IRequestLogin): Promise<String> {       
    const response: {data: String} = await axiosGlobal.post(`${process.env.REACT_APP_MIDDLEWARE}cobranza-credito/investigacion-cobranza/ffm/lbd-middleware-seguridadffm/torrecontrol/auth/token`, request, { 'Content-Type': 'application/json' });
    return response.data;
  }
}
