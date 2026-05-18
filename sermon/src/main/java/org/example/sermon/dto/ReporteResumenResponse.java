package org.example.sermon.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ReporteResumenResponse {

    private long totalClientes;
    private long totalEquipos;
    private long totalTecnicos;
    private long totalMantenimientos;
    private long mantenimientosCompletados;
    private long mantenimientosPendientes;
    private long totalOrdenesTrabajo;
    private long ordenesPendientes;
    private long ordenesCompletadas;
}