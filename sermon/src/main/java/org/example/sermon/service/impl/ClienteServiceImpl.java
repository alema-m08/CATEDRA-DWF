package org.example.sermon.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.sermon.entity.Cliente;
import org.example.sermon.exception.ResourceNotFoundException;
import org.example.sermon.repository.ClienteRepository;
import org.example.sermon.service.ClienteService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClienteServiceImpl implements ClienteService {

    private final ClienteRepository clienteRepository;

    @Override
    public List<Cliente> listarTodos() {
        return clienteRepository.findAll();
    }

    @Override
    public Cliente buscarPorId(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Cliente no encontrado con id: " + id)
                );
    }

    @Override
    public Cliente crear(Cliente cliente) {
        cliente.setActivo(true);
        return clienteRepository.save(cliente);
    }

    @Override
    public Cliente actualizar(Long id, Cliente cliente) {
        Cliente clienteExistente = buscarPorId(id);

        clienteExistente.setNombreEmpresa(cliente.getNombreEmpresa());
        clienteExistente.setDireccion(cliente.getDireccion());
        clienteExistente.setTelefono(cliente.getTelefono());
        clienteExistente.setContacto(cliente.getContacto());
        clienteExistente.setCorreo(cliente.getCorreo());
        clienteExistente.setActivo(cliente.getActivo());

        return clienteRepository.save(clienteExistente);
    }

    @Override
    public void eliminar(Long id) {
        Cliente cliente = buscarPorId(id);
        clienteRepository.delete(cliente);
    }
}