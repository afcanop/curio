import { NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { usuarioActionInit } from '@redux/actions/usuario.actions';
import { tap } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgTemplateOutlet,
  ],
})
export default class LoginComponent implements OnInit {
  // KeenThemes mock, change it to:
  // defaultAuth: any = {
  //   email: '',
  //   password: '',
  // };
  loginForm: FormGroup;
  // hasError: boolean;
  // isLoading$: Observable<boolean>;
  visualizarLoader: boolean = false;
  cambiarTipoCampoClave: 'text' | 'password' = 'password';

  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _store = inject(Store);
  private _router = inject(Router);

  ngOnInit(): void {
    this.initForm();
  }

  visualizarClave() {
    // if (this.cambiarTipoCampoClave === 'password') {
    //   this.cambiarTipoCampoClave = 'text';
    // } else {
    //   this.cambiarTipoCampoClave = 'password';
    // }
  }

  initForm() {
    this.loginForm = this._formBuilder.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
          Validators.minLength(3),
          Validators.maxLength(320),
          Validators.pattern(/^[a-z-A-Z-0-9@.-_]+$/),
        ]),
      ],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
    });
  }

  submit() {
    //const tokenUrl = this.activatedRoute.snapshot.paramMap.get('token');
    if (this.loginForm.valid) {
      //this.visualizarLoader = true;
      this._authService
        .login(
          this.loginForm.get('email')?.value,
          this.loginForm.get('password')?.value
        )
        .pipe(
          tap((respuestaLogin) => {
            //actualizar el store de redux
            this._store.dispatch(
              usuarioActionInit({
                usuario: {
                  id: respuestaLogin.user.id,
                  username: respuestaLogin.user.username,
                  imagen: respuestaLogin.user.imagen,
                  nombre_corto: respuestaLogin.user.nombre_corto,
                  nombre: respuestaLogin.user.nombre,
                  apellido: respuestaLogin.user.apellido,
                  telefono: respuestaLogin.user.telefono,
                  correo: respuestaLogin.user.correo,
                  idioma: respuestaLogin.user.idioma,
                  dominio: respuestaLogin.user.dominio,
                  fecha_limite_pago: new Date(
                    respuestaLogin.user.fecha_limite_pago
                  ),
                  vr_saldo: respuestaLogin.user.vr_saldo,
                  fecha_creacion: new Date(respuestaLogin.user.fecha_creacion),
                  verificado: respuestaLogin.user.verificado,
                  es_socio: respuestaLogin.user.es_socio,
                  socio_id: respuestaLogin.user.socio_id,
                  is_active: respuestaLogin.user.is_active,
                },
              })
            );
          }),
          // switchMap(() => {
          //   if (this.subdominioService.esSubdominioActual()) {
          //     return this.contenedorServices.varios(
          //       this.subdominioService.subdominioNombre()
          //     );
          //   }
          //   return of(null);
          // }),
          tap((respuesta: any) => {
            //   if (respuesta?.empresa.acceso_restringido) {
            //     location.href = `${
            //       environment.dominioHttp
            //     }://${environment.dominioApp.slice(1)}/contenedor/lista`;
            //   } else {
            this.validarSubdominioYrediccionar(respuesta);
            //   }
          })
          // switchMap(() => {
          //   if (tokenUrl) {
          //     return this.authService.confirmarInivitacion(tokenUrl);
          //   }
          //   return of(null);
          // }),
          // tap((respuestaConfirmarInivitacion: any) => {
          //   if (tokenUrl) {
          //     if (respuestaConfirmarInivitacion.confirmar) {
          //       this.alertaService.mensajaExitoso(
          //         this.translateService.instant(
          //           'FORMULARIOS.MENSAJES.CONTENEDOR.INVITACIONACEPTADA'
          //         )
          //       );
          //     }
          //   }
          // }),
          // catchError(() => {
          //   this.visualizarLoader = false;
          //   this.changeDetectorRef.detectChanges();
          //   return of(null);
          // })
        )
        .subscribe();
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  validarSubdominioYrediccionar(respuesta: any) {
    // if (this.subdominioService.esSubdominioActual()) {
    //   const contenedor: Contenedor = {
    //     nombre: respuesta.empresa.nombre,
    //     imagen: respuesta.empresa.imagen,
    //     contenedor_id: respuesta.empresa.id,
    //     subdominio: respuesta.empresa.subdominio,
    //     id: respuesta.empresa.id,
    //     usuario_id: 1,
    //     seleccion: true,
    //     rol: respuesta.empresa.rol,
    //     plan_id: respuesta.empresa.plan_id,
    //     plan_nombre: respuesta.empresa.plan_nombre,
    //     usuarios: 1,
    //     usuarios_base: 0,
    //     ciudad: 0,
    //     correo: '',
    //     direccion: '',
    //     identificacion: 0,
    //     nombre_corto: '',
    //     numero_identificacion: 0,
    //     telefono: '',
    //     acceso_restringido: respuesta.empresa.acceso_restringido,
    //   };
    //   this.store.dispatch(ContenedorActionInit({ contenedor }));
    //   this.store.dispatch(selecionModuloAction({ seleccion: 'general' }));
    //   this.store.dispatch(
    //     configuracionVisualizarAction({
    //       configuracion: {
    //         visualizarApps: true,
    //       },
    //     })
    //   );
    //   this.router.navigate(['/dashboard']);
    // } else {
    this._router.navigate(['/dashboard']);
    // }
  }
}
