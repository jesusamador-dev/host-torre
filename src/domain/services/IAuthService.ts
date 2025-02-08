import { IRequestLogin } from "@/domain/repositories/IAuthRepository";

export interface IAuthService {
  login: (request: IRequestLogin) => {}
}