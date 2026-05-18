package org.example.sermon.service;

import org.example.sermon.entity.Mantenimiento;

import java.util.List;

public interface MantenimientoService {

    List<Mantenimiento> listarTodos();

    Mantenimiento buscarPorId(Long id);

    Mantenimiento crear(Mantenimiento mantenimiento);

    Mantenimiento actualizar(Long id, Mantenimiento mantenimiento);

    void eliminar(Long id);
}