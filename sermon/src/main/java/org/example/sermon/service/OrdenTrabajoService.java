package org.example.sermon.service;

import org.example.sermon.entity.OrdenTrabajo;

import java.util.List;

public interface OrdenTrabajoService {

    List<OrdenTrabajo> listarTodos();

    OrdenTrabajo buscarPorId(Long id);

    OrdenTrabajo crear(OrdenTrabajo ordenTrabajo);

    OrdenTrabajo actualizar(Long id, OrdenTrabajo ordenTrabajo);

    void eliminar(Long id);
}