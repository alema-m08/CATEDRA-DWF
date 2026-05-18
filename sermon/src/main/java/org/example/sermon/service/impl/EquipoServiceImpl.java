package org.example.sermon.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.sermon.entity.Equipo;
import org.example.sermon.exception.ResourceNotFoundException;
import org.example.sermon.repository.EquipoRepository;
import org.example.sermon.service.EquipoService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EquipoServiceImpl implements EquipoService {

    private final EquipoRepository equipoRepository;

    @Override
    public List<Equipo> listarTodos() {
        return equipoRepository.findAll();
    }

    @Override
    public Equipo buscarPorId(Long id) {
        return equipoRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Equipo no encontrado con id: " + id
                        )
                );
    }

    @Override
    public Equipo crear(Equipo equipo) {
        equipo.setActivo(true);
        return equipoRepository.save(equipo);
    }

    @Override
    public Equipo actualizar(Long id, Equipo equipo) {

        Equipo equipoExistente = buscarPorId(id);

        equipoExistente.setCodigo(equipo.getCodigo());
        equipoExistente.setTipo(equipo.getTipo());
        equipoExistente.setMarca(equipo.getMarca());
        equipoExistente.setUbicacion(equipo.getUbicacion());
        equipoExistente.setFechaInstalacion(equipo.getFechaInstalacion());
        equipoExistente.setFechaVencimiento(equipo.getFechaVencimiento());
        equipoExistente.setActivo(equipo.getActivo());
        equipoExistente.setCliente(equipo.getCliente());

        return equipoRepository.save(equipoExistente);
    }

    @Override
    public void eliminar(Long id) {

        Equipo equipo = buscarPorId(id);

        equipoRepository.delete(equipo);
    }
}