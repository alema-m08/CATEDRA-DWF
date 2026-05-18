package org.example.sermon.service;

import org.example.sermon.entity.Equipo;

import java.util.List;

public interface EquipoService {

    List<Equipo> listarTodos();

    Equipo buscarPorId(Long id);

    Equipo crear(Equipo equipo);

    Equipo actualizar(Long id, Equipo equipo);

    void eliminar(Long id);
}