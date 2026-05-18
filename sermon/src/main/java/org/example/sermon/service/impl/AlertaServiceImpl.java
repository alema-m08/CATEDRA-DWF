package org.example.sermon.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.sermon.dto.AlertaResponse;
import org.example.sermon.entity.Equipo;
import org.example.sermon.entity.Mantenimiento;
import org.example.sermon.entity.OrdenTrabajo;
import org.example.sermon.repository.EquipoRepository;
import org.example.sermon.repository.MantenimientoRepository;
import org.example.sermon.repository.OrdenTrabajoRepository;
import org.example.sermon.service.AlertaService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AlertaServiceImpl implements AlertaService {

    private final EquipoRepository equipoRepository;
    private final MantenimientoRepository mantenimientoRepository;
    private final OrdenTrabajoRepository ordenTrabajoRepository;

    @Override
    public List<AlertaResponse> obtenerAlertas() {
        List<AlertaResponse> alertas = new ArrayList<>();

        LocalDate hoy = LocalDate.now();
        LocalDate proximos30Dias = hoy.plusDays(30);

        List<Equipo> equiposVencidos =
                equipoRepository.findByFechaVencimientoBefore(hoy);

        for (Equipo equipo : equiposVencidos) {
            alertas.add(new AlertaResponse(
                    "EQUIPO_VENCIDO",
                    "Equipo vencido",
                    "El equipo " + equipo.getCodigo() + " - " + equipo.getTipo()
                            + " del cliente " + equipo.getCliente().getNombreEmpresa()
                            + " venció el " + equipo.getFechaVencimiento(),
                    "ALTA"
            ));
        }

        List<Equipo> equiposPorVencer =
                equipoRepository.findByFechaVencimientoBetween(hoy, proximos30Dias);

        for (Equipo equipo : equiposPorVencer) {
            alertas.add(new AlertaResponse(
                    "EQUIPO_POR_VENCER",
                    "Equipo próximo a vencer",
                    "El equipo " + equipo.getCodigo() + " - " + equipo.getTipo()
                            + " del cliente " + equipo.getCliente().getNombreEmpresa()
                            + " vence el " + equipo.getFechaVencimiento(),
                    "MEDIA"
            ));
        }

        List<Mantenimiento> mantenimientosPendientes =
                mantenimientoRepository.findByCompletadoFalse();

        for (Mantenimiento mantenimiento : mantenimientosPendientes) {
            alertas.add(new AlertaResponse(
                    "MANTENIMIENTO_PENDIENTE",
                    "Mantenimiento pendiente",
                    "El mantenimiento del equipo "
                            + mantenimiento.getEquipo().getCodigo()
                            + " está pendiente para la fecha "
                            + mantenimiento.getFechaProgramada(),
                    "MEDIA"
            ));
        }

        List<OrdenTrabajo> ordenesPendientes =
                ordenTrabajoRepository.findByEstado("PENDIENTE");

        for (OrdenTrabajo orden : ordenesPendientes) {
            alertas.add(new AlertaResponse(
                    "ORDEN_PENDIENTE",
                    "Orden de trabajo pendiente",
                    "La orden del cliente " + orden.getCliente().getNombreEmpresa()
                            + " está pendiente para " + orden.getFechaProgramada(),
                    orden.getPrioridad()
            ));
        }

        return alertas;
    }
}