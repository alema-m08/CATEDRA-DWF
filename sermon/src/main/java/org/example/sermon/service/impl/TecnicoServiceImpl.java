package org.example.sermon.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.sermon.entity.Tecnico;
import org.example.sermon.exception.ResourceNotFoundException;
import org.example.sermon.repository.TecnicoRepository;
import org.example.sermon.service.TecnicoService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TecnicoServiceImpl implements TecnicoService {

    private final TecnicoRepository tecnicoRepository;

    @Override
    public List<Tecnico> listarTodos() {
        return tecnicoRepository.findAll();
    }

    @Override
    public Tecnico buscarPorId(Long id) {
        return tecnicoRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Técnico no encontrado con id: " + id
                        )
                );
    }

    @Override
    public Tecnico crear(Tecnico tecnico) {

        tecnico.setDisponible(true);
        tecnico.setActivo(true);

        return tecnicoRepository.save(tecnico);
    }

    @Override
    public Tecnico actualizar(Long id, Tecnico tecnico) {

        Tecnico tecnicoExistente = buscarPorId(id);

        tecnicoExistente.setNombre(tecnico.getNombre());
        tecnicoExistente.setEspecialidad(tecnico.getEspecialidad());
        tecnicoExistente.setTelefono(tecnico.getTelefono());
        tecnicoExistente.setCorreo(tecnico.getCorreo());
        tecnicoExistente.setDisponible(tecnico.getDisponible());
        tecnicoExistente.setActivo(tecnico.getActivo());

        return tecnicoRepository.save(tecnicoExistente);
    }

    @Override
    public void eliminar(Long id) {

        Tecnico tecnico = buscarPorId(id);

        tecnicoRepository.delete(tecnico);
    }
}