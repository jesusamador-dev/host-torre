export interface IRequestLogin {
  numEmpleado: string;
  perfilId: string;
}

export interface IAuthRepository {
  login: (data: IRequestLogin) => {}
}