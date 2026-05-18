package org.example.sermon.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.sermon.dto.ReporteResumenResponse;
import org.example.sermon.repository.*;
import org.example.sermon.service.ReporteService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReporteServiceImpl implements ReporteService {

    private final ClienteRepository clienteRepository;
    private final EquipoRepository equipoRepository;
    private final TecnicoRepository tecnicoRepository;
    private final MantenimientoRepository mantenimientoRepository;
    private final OrdenTrabajoRepository ordenTrabajoRepository;

    @Override
    public ReporteResumenResponse obtenerResumen() {
        return new ReporteResumenResponse(
                clienteRepository.count(),
                equipoRepository.count(),
                tecnicoRepository.count(),
                mantenimientoRepository.count(),
                mantenimientoRepository.countByCompletado(true),
                mantenimientoRepository.countByCompletado(false),
                ordenTrabajoRepository.count(),
                ordenTrabajoRepository.countByEstado("PENDIENTE"),
                ordenTrabajoRepository.countByEstado("COMPLETADA")
        );
    }
}