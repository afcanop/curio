import { FacturaReduxState } from '@interfaces/facturas.interface';
import { createReducer, on } from '@ngrx/store';
import {
  actualizarCantidadItemFacturaActiva,
  actualizarSubtotalItemFacturaActiva,
  agregarItemFacturaActiva,
  facturaAction,
  facturaActualizarNombreAction,
  facturaEliminarAction,
  facturaNuevaAction,
  retirarItemDeFacturaActiva,
  seleccionarFacturaActiva,
  actualizarPrecioItemFacturaActiva,
  actualizarClienteFacturaActiva,
  actualizarNombreClienteFacturaActiva
} from '@redux/actions/factura.actions';

export const initialState: FacturaReduxState = {
  facturas: [
    {
      id: 0,
      nombre: 'Factura principal',
      cliente: 0,
      cliente_nombre: '',
      data: {
        itemsAgregados: [],
      },
    },
  ],
  facturaActiva: 0,
};

export const facturaReducer = createReducer(
  initialState,
  on(facturaAction, (state) => state),
  on(facturaNuevaAction, (state, { factura }) => ({
    ...state,
    facturas: [...state.facturas, factura],
  })),
  on(facturaActualizarNombreAction, (state, { index, nombre }) => ({
    ...state,
    facturas: state.facturas.map((factura, i) =>
      i === index ? { ...factura, nombre } : factura
    ),
  })),
  on(facturaEliminarAction, (state, { index }) => ({
    ...state,
    facturas: state.facturas.filter((_, i) => i !== index),
    facturaActiva: state.facturaActiva === index ? 0 : state.facturaActiva,
  })),
  on(seleccionarFacturaActiva, (state, { id }) => ({
    ...state,
    facturaActiva: id,
  })),
  on(agregarItemFacturaActiva, (state, { item }) => ({
    ...state,
    facturas: state.facturas.map((factura, index) =>
      index === state.facturaActiva
        ? {
            ...factura,
            data: {
              ...factura.data,
              itemsAgregados: [...(factura.data?.itemsAgregados || []), item],
            },
          }
        : factura
    ),
  })),
  on(retirarItemDeFacturaActiva, (state, { itemId }) => ({
    ...state,
    facturas: state.facturas.map((factura, index) =>
      index === state.facturaActiva
        ? {
            ...factura,
            data: {
              ...factura.data,
              itemsAgregados: factura.data.itemsAgregados.filter(
                (item) => item.id !== itemId
              ),
            },
          }
        : factura
    ),
  })),
  on(actualizarCantidadItemFacturaActiva, (state, { itemId, cantidad }) => ({
    ...state,
    facturas: state.facturas.map((factura, index) =>
      index === state.facturaActiva
        ? {
            ...factura,
            data: {
              ...factura.data,
              itemsAgregados: factura.data.itemsAgregados.map((item) =>
                item.id === itemId ? { ...item, cantidad } : item
              ),
            },
          }
        : factura
    ),
  })),
  on(actualizarPrecioItemFacturaActiva, (state, { itemId, precio }) => ({
    ...state,
    facturas: state.facturas.map((factura, index) =>
      index === state.facturaActiva
        ? {
            ...factura,
            data: {
              ...factura.data,
              itemsAgregados: factura.data.itemsAgregados.map((item) =>
                item.id === itemId ? { ...item, precio } : item
              ),
            },
          }
        : factura
    ),
  })),
  on(actualizarSubtotalItemFacturaActiva, (state, { itemId }) => ({
    ...state,
    facturas: state.facturas.map((factura, index) =>
      index === state.facturaActiva
        ? {
            ...factura,
            data: {
              ...factura.data,
              itemsAgregados: factura.data.itemsAgregados.map((item) =>
                item.id === itemId
                  ? { ...item, subtotal: item.precio * item.cantidad }
                  : item
              ),
            },
          }
        : factura
    ),
  })),
  on(actualizarClienteFacturaActiva, (state, { cliente }) => ({
    ...state,
    facturas: state.facturas.map((factura, index) =>
      index === state.facturaActiva
        ? { ...factura, cliente }
        : factura
    )
  })),
  on(actualizarNombreClienteFacturaActiva, (state, { cliente_nombre }) => ({
    ...state,
    facturas: state.facturas.map((factura, index) =>
      index === state.facturaActiva
        ? { ...factura, cliente_nombre }
        : factura
    )
  }))
);
