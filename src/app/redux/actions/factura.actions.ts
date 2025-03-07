import { Contacto } from '@interfaces/contacto';
import { DocumentoFactura, DocumentoFacturaDetalleRespuesta } from '@interfaces/facturas.interface';
import { createAction, props } from '@ngrx/store';

export const facturaAction = createAction('[Factura] lista');

export const facturaNuevaAction = createAction(
  '[Factura] nueva',
  props<{ factura: DocumentoFactura }>()
);

export const facturaActualizarNombreAction = createAction(
  '[Factura] Actualizar Nombre',
  props<{ index: number; nombre: string }>()
);

export const facturaEliminarAction = createAction(
  '[Factura] Eliminar',
  props<{ index: number }>()
);

export const seleccionarFacturaActiva = createAction(
  '[Factura] seleccionar tab Factura',
  props<{ id: number }>()
);

export const agregarItemFacturaActiva = createAction(
  '[Factura] agregar items a la factura activa',
  props<{ item: DocumentoFacturaDetalleRespuesta }>()
);

export const retirarItemDeFacturaActiva = createAction(
  '[Factura] retirar Item de Factura activa',
  props<{ itemId: number }>()
);

export const actualizarCantidadItemFacturaActiva = createAction(
  '[Factura] Actualizar Cantidad del Item de una factura activa',
  props<{ itemId: number; cantidad: number }>()
);


export const actualizarPrecioItemFacturaActiva = createAction(
  '[Factura] Actualizar Precio del Item de una factura activa',
  props<{ itemId: number; precio: number }>()
);

export const actualizarSubtotalItemFacturaActiva = createAction(
  '[Factura] Actualizar Subtotal del Item de una factura activa',
  props<{ itemId: number; }>()
);

export const actualizarClienteFacturaActiva = createAction(
  '[Factura] Actualizar Cliente de Factura Activa',
  props<{ contacto: Contacto }>()
);

export const retirarDetallesFacturaActiva = createAction(
  '[Factura] Retirar Detalles de Factura Activa',
);

