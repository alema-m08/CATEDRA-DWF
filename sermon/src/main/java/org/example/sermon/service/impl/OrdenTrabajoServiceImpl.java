package org.example.sermon.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.sermon.entity.Cliente;
import org.example.sermon.entity.Equipo;
import org.example.sermon.entity.OrdenTrabajo;
import org.example.sermon.entity.Tecnico;
import org.example.sermon.exception.ResourceNotFoundException;
import org.example.sermon.repository.ClienteRepository;
import org.example.sermon.repository.EquipoRepository;
import org.example.sermon.repository.OrdenTrabajoRepository;
import org.example.sermon.repository.TecnicoRepository;
import org.example.sermon.service.OrdenTrabajoService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrdenTrabajoServiceImpl implements OrdenTrabajoService {

    private final OrdenTrabajoRepository ordenTrabajoRepository;
    private final ClienteRepository clienteRepository;
    private final EquipoRepository equipoRepository;
    private final TecnicoRepository tecnicoRepository;

    @Override
    public List<OrdenTrabajo> listarTodos() {
        return ordenTrabajoRepository.findAll();
    }

    @Override
    public OrdenTrabajo buscarPorId(Long id) {
        return ordenTrabajoRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Orden de trabajo no encontrada con id: " + id
                        )
                );
    }

    @Override
    public OrdenTrabajo crear(OrdenTrabajo ordenTrabajo) {

        Long clienteId = ordenTrabajo.getCliente().getId();
        Long equipoId = ordenTrabajo.getEquipo().getId();
        Long tecnicoId = ordenTrabajo.getTecnico().getId();

        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Cliente no encontrado con id: " + clienteId
                        )
                );

        Equipo equipo = equipoRepository.findById(equipoId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Equipo no encontrado con id: " + equipoId
                        )
                );

        Tecnico tecnico = tecnicoRepository.findById(tecnicoId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Técnico no encontrado con id: " + tecnicoId
                        )
                );

        ordenTrabajo.setCliente(cliente);
        ordenTrabajo.setEquipo(equipo);
        ordenTrabajo.setTecnico(tecnico);

        if (ordenTrabajo.getFechaCreacion() == null) {
            ordenTrabajo.setFechaCreacion(LocalDate.now());
        }

        return ordenTrabajoRepository.save(ordenTrabajo);
    }

    @Override
    public OrdenTrabajo actualizar(Long id, OrdenTrabajo ordenTrabajo) {

        OrdenTrabajo ordenExistente = buscarPorId(id);

        Long clienteId = ordenTrabajo.getCliente().getId();
        Long equipoId = ordenTrabajo.getEquipo().getId();
        Long tecnicoId = ordenTrabajo.getTecnico().getId();

        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Cliente no encontrado con id: " + clienteId
                        )
                );

        Equipo equipo = equipoRepository.findById(equipoId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Equipo no encontrado con id: " + equipoId
                        )
                );

        Tecnico tecnico = tecnicoRepository.findById(tecnicoId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Técnico no encontrado con id: " + tecnicoId
                        )
                );

        ordenExistente.setFechaProgramada(
                ordenTrabajo.getFechaProgramada()
        );

        ordenExistente.setPrioridad(
                ordenTrabajo.getPrioridad()
        );

        ordenExistente.setEstado(
                ordenTrabajo.getEstado()
        );

        ordenExistente.setDescripcion(
                ordenTrabajo.getDescripcion()
        );

        ordenExistente.setCliente(cliente);
        ordenExistente.setEquipo(equipo);
        ordenExistente.setTecnico(tecnico);

        return ordenTrabajoRepository.save(ordenExistente);
    }

    @Override
    public void eliminar(Long id) {

        OrdenTrabajo ordenTrabajo = buscarPorId(id);

        ordenTrabajoRepository.delete(ordenTrabajo);
    }
}