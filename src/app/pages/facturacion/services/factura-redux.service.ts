// factura.service.ts
import { computed, inject, Injectable, signal } from '@angular/core';
import { Contacto } from '@interfaces/contacto';
import {
  DocumentoFactura,
  DocumentoFacturaDetalleRespuesta,
} from '@interfaces/facturas.interface';
import { Item } from '@interfaces/item.interface';
import { Store } from '@ngrx/store';
import {
  actualizarCantidadItemFacturaActiva,
  actualizarClienteFacturaActiva,
  actualizarPrecioItemFacturaActiva,
  actualizarSubtotalItemFacturaActiva,
  agregarItemFacturaActiva,
  facturaActualizarNombreAction,
  facturaEliminarAction,
  facturaNuevaAction,
  retirarDetallesFacturaActiva,
  retirarItemDeFacturaActiva,
  seleccionarFacturaActiva,
} from '@redux/actions/factura.actions';
import {
  obtenerDataFacturaActiva,
  obtenerFacturaActiva,
  obtenerFacturas,
  obtenerItemCantidadFacturaActiva,
  obtenerItemsFacturaActiva,
  obtenerNombreFacturaActiva,
  obtenerClienteFacturaActiva
} from '@redux/selectors/factura.selectors';
import {
  documentoFacturaDetalleInit,
  facturaInit,
} from '@constantes/factura.const';
import { FechasService } from 'src/app/shared/services/fechas.service';

@Injectable({ providedIn: 'root' })
export class FacturaReduxService {
  private _store = inject(Store);
  private _fechasService = inject(FechasService);

  public facturaTabActivo = signal<number>(0);
  public arrFacturasSignal = signal<DocumentoFactura[]>([]);
  public facturaActivaNombre = signal('');
  public facturaActivaContacto = signal<number|null>(1);
  public arrItemsSignal = signal<DocumentoFacturaDetalleRespuesta[]>([]);
  public totalProductosSignal = computed(() => this.arrItemsSignal().length);
  public totalSubtotalSignal = computed(() =>
    this.arrItemsSignal().reduce(
      (acumulador, item) => (acumulador += item.subtotal),
      0
    )
  );
  public totalCantidadesSignal = computed(() =>
    this.arrItemsSignal().reduce(
      (acumulador, item) => (acumulador += item.cantidad),
      0
    )
  );

  constructor() {
    this.obtenerReduxFacturas();
    this.obtertenerTabActivoFactura();
    this.obtertenerNombreFactura();
    this.obtenerItemsFactura();
    this.obtertenerClienteFactura()
  }

  obtenerReduxFacturas() {
    this._store
      .select(obtenerFacturas)
      .subscribe((facturas) => this.arrFacturasSignal.set(facturas));
  }

  obtertenerTabActivoFactura() {
    this._store
      .select(obtenerFacturaActiva)
      .subscribe((id) => this.facturaTabActivo.set(id));
  }

  obtertenerNombreFactura() {
    this._store
      .select(obtenerNombreFacturaActiva)
      .subscribe((nombre) => this.facturaActivaNombre.set(nombre));
  }

  obtertenerClienteFactura() {
    this._store
      .select(obtenerClienteFacturaActiva)
      .subscribe((nombre) => {
        this.facturaActivaContacto.set(nombre)
      });
  }

  obtenerItemsFactura() {
    this._store
      .select(obtenerItemsFacturaActiva)
      .subscribe((items) => this.arrItemsSignal.set(items));
  }

  obtenerDataFactura() {
    return this._store.select(obtenerDataFacturaActiva);
  }

  obtenerItemCantidad(itemId: number) {
    return this._store.select(obtenerItemCantidadFacturaActiva(itemId));
  }

  nuevaFactura() {
    const fechaVencimientoInicial =
      this._fechasService.getFechaVencimientoInicial();

    this._store.dispatch(
      facturaNuevaAction({
        factura: {
          ...facturaInit,
          nombre: 'Factura',
          fecha: fechaVencimientoInicial,
          fecha_vence: fechaVencimientoInicial,
        },
      })
    );
    this.obtenerReduxFacturas();
  }

  cambiarNombre(index: number, nombre: string) {
    this._store.dispatch(
      facturaActualizarNombreAction({
        index,
        nombre,
      })
    );
    this.obtenerReduxFacturas();
  }

  retirarFactura(index: number) {
    this._store.dispatch(facturaEliminarAction({ index }));
    this.obtenerReduxFacturas();
  }

  seleccionarTabActivoFactura(id: number) {
    this._store.dispatch(seleccionarFacturaActiva({ id }));
    this.obtertenerTabActivoFactura();
  }

  nuevoItem(item: Item): DocumentoFacturaDetalleRespuesta {
    return {
      ...documentoFacturaDetalleInit,
      cantidad: 1,
      item: item.id,
      item_nombre: item.nombre,
      precio: item.precio,
    };
  }

  agregarItem(item: Item) {
    const nuevoItem = this.nuevoItem(item);
    this._store.dispatch(agregarItemFacturaActiva({ item: nuevoItem }));
  }

  retirarItem(itemId: number) {
    this._store.dispatch(retirarItemDeFacturaActiva({ itemId }));
  }

  actualizarCantidadItem(itemId: number, cantidad: number) {
    this._store.dispatch(
      actualizarCantidadItemFacturaActiva({ itemId, cantidad })
    );
  }

  actualizarPrecioItem(itemId: number, precio: number) {
    this._store.dispatch(actualizarPrecioItemFacturaActiva({ itemId, precio }));
  }

  actualizarConctato(contacto: Contacto) {
    this._store.dispatch(actualizarClienteFacturaActiva({ contacto }));
  }

  calcularSubtotal(itemId: number) {
    this._store.dispatch(actualizarSubtotalItemFacturaActiva({ itemId }));
  }

  reiniciarDetalles() {
    this._store.dispatch(retirarDetallesFacturaActiva());
  }
}
