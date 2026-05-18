package org.example.sermon.service;

import org.example.sermon.entity.Cliente;

import java.util.List;

public interface ClienteService {

    List<Cliente> listarTodos();

    Cliente buscarPorId(Long id);

    Cliente crear(Cliente cliente);

    Cliente actualizar(Long id, Cliente cliente);

    void eliminar(Long id);
}