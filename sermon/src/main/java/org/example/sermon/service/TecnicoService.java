package org.example.sermon.service;

import org.example.sermon.entity.Tecnico;

import java.util.List;

public interface TecnicoService {

    List<Tecnico> listarTodos();

    Tecnico buscarPorId(Long id);

    Tecnico crear(Tecnico tecnico);

    Tecnico actualizar(Long id, Tecnico tecnico);

    void eliminar(Long id);
}