import { Component, computed, inject, OnInit, output } from '@angular/core';
import { FacturaReduxService } from '../../../services/factura-redux.service';
import { DecimalPipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormErrorComponent } from '../../../../../shared/components/form/form-error/form-error.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FacturaApiService } from '../../../services/factura-api.service';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-factura-medio-pago-efectivo',
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    ReactiveFormsModule,
    FormErrorComponent,
    NgSelectModule,
  ],
  templateUrl: './factura-medio-pago-efectivo.component.html',
  styleUrl: './factura-medio-pago-efectivo.component.scss',
})
export class FacturaMedioPagoEfectivoComponent implements OnInit {
  private _facturaReduxService = inject(FacturaReduxService);
  private _facturaApiService = inject(FacturaApiService);

  private _formBuilder = inject(FormBuilder);

  public totalSubtotalSignal = this._facturaReduxService.totalSubtotalSignal;
  public emitirMedio = output<string>();
  public emitirPagoExito = output<boolean>();

  public formularioMedioPagoEfectivo!: FormGroup;
  public valorRestante = computed(
    () =>
      this.totalSubtotalSignal() -
      (this.formularioMedioPagoEfectivo?.get('valor')?.value || 0)
  );

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  private inicializarFormulario(): void {
    this.formularioMedioPagoEfectivo = this._formBuilder.group({
      asesor: [null, Validators.required],
      valor: [
        this.totalSubtotalSignal(),
        [Validators.required, Validators.min(0)],
      ],
    });

    this.formularioMedioPagoEfectivo
      .get('valor')
      ?.valueChanges.subscribe((value) => {
        if (isNaN(value) || value < 0) {
          this.formularioMedioPagoEfectivo
            .get('valor')
            ?.setValue(this.totalSubtotalSignal(), { emitEvent: false });
        }
        this.valorRestante = computed(
          () =>
            this.totalSubtotalSignal() -
            (this.formularioMedioPagoEfectivo?.get('valor')?.value || 0)
        );
      });
  }

  submit() {
    this._facturaReduxService
      .obtenerDataFactura()
      .pipe(
        switchMap((data) =>
          this._facturaApiService.nuevo({
            ...data,
            documento_tipo: 1,
            numero: null,
            empresa: 1,
            contacto: data.contacto_id,
          })
        ),
        tap(() => this.emitirPagoExito.emit(true))
      )
      .subscribe();
  }

  regresarAmedioPagos() {
    this.emitirMedio.emit(null);
  }
}
