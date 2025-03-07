import { inject, Injectable, signal } from '@angular/core';
import { Contenedor, ContenedorDetalle } from '@interfaces/contenedores.interface';
import { Store } from '@ngrx/store';
import { ContenedorActionInit } from '@redux/actions/contenedor.actions';
import { obtenerContenedorSubdominio } from '@redux/selectors/contenedor.selectors';

@Injectable({
  providedIn: 'root'
})
export class ContenedorReduxService {
  private _store = inject(Store);
  public contendorSubdomino = signal('');

  constructor() { }

  cargarContenedor(contenedor: ContenedorDetalle){
    const nuevoContenedor: Contenedor = {
      nombre: contenedor.nombre,
      imagen: contenedor.imagen,
      contenedor_id: contenedor.id,
      subdominio: contenedor.subdominio,
      id: contenedor.id,
      usuario_id: contenedor.usuario_id,
      seleccion: true,
      rol: '',
      plan_id: contenedor.plan_id,
      plan_nombre: contenedor.plan_nombre,
      usuarios: contenedor.plan_limite_usuarios,
      usuarios_base: contenedor.plan_usuarios_base,
      reddoc: contenedor.reddoc,
      ruteo: contenedor.ruteo,
      acceso_restringido: contenedor.acceso_restringido,
    };
    this._store.dispatch(ContenedorActionInit({ contenedor: nuevoContenedor }));
  }

  obtenerContendorSubdominio(){
    return this._store.select(obtenerContenedorSubdominio).subscribe((nombre)=> this.contendorSubdomino.set(nombre))
  }
}
