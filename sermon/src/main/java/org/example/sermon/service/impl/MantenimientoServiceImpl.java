package org.example.sermon.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.sermon.entity.Equipo;
import org.example.sermon.entity.Mantenimiento;
import org.example.sermon.entity.Tecnico;
import org.example.sermon.exception.ResourceNotFoundException;
import org.example.sermon.repository.EquipoRepository;
import org.example.sermon.repository.MantenimientoRepository;
import org.example.sermon.repository.TecnicoRepository;
import org.example.sermon.service.MantenimientoService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MantenimientoServiceImpl implements MantenimientoService {

    private final MantenimientoRepository mantenimientoRepository;
    private final EquipoRepository equipoRepository;
    private final TecnicoRepository tecnicoRepository;

    @Override
    public List<Mantenimiento> listarTodos() {
        return mantenimientoRepository.findAll();
    }

    @Override
    public Mantenimiento buscarPorId(Long id) {
        return mantenimientoRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Mantenimiento no encontrado con id: " + id)
                );
    }

    @Override
    public Mantenimiento crear(Mantenimiento mantenimiento) {
        Long equipoId = mantenimiento.getEquipo().getId();
        Long tecnicoId = mantenimiento.getTecnico().getId();

        Equipo equipo = equipoRepository.findById(equipoId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Equipo no encontrado con id: " + equipoId)
                );

        Tecnico tecnico = tecnicoRepository.findById(tecnicoId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Técnico no encontrado con id: " + tecnicoId)
                );

        mantenimiento.setEquipo(equipo);
        mantenimiento.setTecnico(tecnico);

        if (mantenimiento.getCompletado() == null) {
            mantenimiento.setCompletado(false);
        }

        return mantenimientoRepository.save(mantenimiento);
    }

    @Override
    public Mantenimiento actualizar(Long id, Mantenimiento mantenimiento) {
        Mantenimiento mantenimientoExistente = buscarPorId(id);

        Long equipoId = mantenimiento.getEquipo().getId();
        Long tecnicoId = mantenimiento.getTecnico().getId();

        Equipo equipo = equipoRepository.findById(equipoId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Equipo no encontrado con id: " + equipoId)
                );

        Tecnico tecnico = tecnicoRepository.findById(tecnicoId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Técnico no encontrado con id: " + tecnicoId)
                );

        mantenimientoExistente.setFechaProgramada(mantenimiento.getFechaProgramada());
        mantenimientoExistente.setFechaRealizada(mantenimiento.getFechaRealizada());
        mantenimientoExistente.setTipoServicio(mantenimiento.getTipoServicio());
        mantenimientoExistente.setEstado(mantenimiento.getEstado());
        mantenimientoExistente.setObservaciones(mantenimiento.getObservaciones());
        mantenimientoExistente.setCompletado(mantenimiento.getCompletado());
        mantenimientoExistente.setEquipo(equipo);
        mantenimientoExistente.setTecnico(tecnico);

        return mantenimientoRepository.save(mantenimientoExistente);
    }

    @Override
    public void eliminar(Long id) {
        Mantenimiento mantenimiento = buscarPorId(id);
        mantenimientoRepository.delete(mantenimiento);
    }
}