import { HttpContext, HttpContextToken, HttpHandlerFn, type HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../../shared/services/token.service';

const requiereToken = new HttpContextToken<boolean>(() => true);

export function noRequiereToken() {
  return new HttpContext().set(requiereToken, false);
}

export const tokenInterceptor: HttpInterceptorFn = (
  request,
  next: HttpHandlerFn
) => {
  const tokenService = inject(TokenService);

  if (request.context.get(requiereToken)) {
    //validar vigencia
    const tokenValido = tokenService.validarToken();
    if (tokenValido) {
      return adicionarToken(request, next);
    } else {
      // return this.actualizarTokenPorVencimiento(request, next);
    }
  }

  return next(request);
};

const adicionarToken = (request: any, next: HttpHandlerFn) => {
  const authService = inject(TokenService);
  if (request.context.get(requiereToken)) {
    const token = authService.obtenerToken();
    if (token) {
      const authReq = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`),
      });
      return next(authReq);
    }
  }
  return next(request);
};
