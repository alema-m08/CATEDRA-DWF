package org.example.sermon.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.sermon.dto.DashboardResponse;
import org.example.sermon.repository.*;
import org.example.sermon.service.DashboardService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final ClienteRepository clienteRepository;
    private final EquipoRepository equipoRepository;
    private final TecnicoRepository tecnicoRepository;
    private final MantenimientoRepository mantenimientoRepository;
    private final OrdenTrabajoRepository ordenTrabajoRepository;

    @Override
    public DashboardResponse obtenerResumen() {
        return new DashboardResponse(
                clienteRepository.count(),
                equipoRepository.count(),
                tecnicoRepository.count(),
                mantenimientoRepository.count(),
                mantenimientoRepository.countByCompletado(false),
                mantenimientoRepository.countByCompletado(true),
                ordenTrabajoRepository.count(),
                ordenTrabajoRepository.countByEstado("PENDIENTE")
        );
    }
}