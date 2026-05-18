package org.example.sermon.service;

import org.example.sermon.entity.Cliente;
import org.example.sermon.exception.ResourceNotFoundException;
import org.example.sermon.repository.ClienteRepository;
import org.example.sermon.service.impl.ClienteServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClienteServiceImplTest {

    @Mock
    private ClienteRepository clienteRepository;

    @InjectMocks
    private ClienteServiceImpl clienteService;

    @Test
    void listarTodos_debeRetornarListaClientes() {
        Cliente cliente = Cliente.builder()
                .id(1L)
                .nombreEmpresa("Claro El Salvador")
                .direccion("San Salvador")
                .telefono("7777-1234")
                .contacto("Carlos Ramírez")
                .correo("contacto@claro.com")
                .activo(true)
                .build();

        when(clienteRepository.findAll()).thenReturn(List.of(cliente));

        List<Cliente> resultado = clienteService.listarTodos();

        assertEquals(1, resultado.size());
        assertEquals("Claro El Salvador", resultado.get(0).getNombreEmpresa());
        verify(clienteRepository).findAll();
    }

    @Test
    void buscarPorId_cuandoExiste_debeRetornarCliente() {
        Cliente cliente = Cliente.builder()
                .id(1L)
                .nombreEmpresa("Tigo")
                .direccion("San Salvador")
                .telefono("7777-0000")
                .contacto("Ana Pérez")
                .correo("contacto@tigo.com")
                .activo(true)
                .build();

        when(clienteRepository.findById(1L)).thenReturn(Optional.of(cliente));

        Cliente resultado = clienteService.buscarPorId(1L);

        assertEquals(1L, resultado.getId());
        assertEquals("Tigo", resultado.getNombreEmpresa());
        verify(clienteRepository).findById(1L);
    }

    @Test
    void buscarPorId_cuandoNoExiste_debeLanzarExcepcion() {
        when(clienteRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            clienteService.buscarPorId(99L);
        });

        verify(clienteRepository).findById(99L);
    }

    @Test
    void crear_debeGuardarClienteActivo() {
        Cliente cliente = Cliente.builder()
                .nombreEmpresa("Digicel")
                .direccion("San Salvador")
                .telefono("7777-1111")
                .contacto("Mario López")
                .correo("contacto@digicel.com")
                .build();

        Cliente clienteGuardado = Cliente.builder()
                .id(1L)
                .nombreEmpresa("Digicel")
                .direccion("San Salvador")
                .telefono("7777-1111")
                .contacto("Mario López")
                .correo("contacto@digicel.com")
                .activo(true)
                .build();

        when(clienteRepository.save(any(Cliente.class))).thenReturn(clienteGuardado);

        Cliente resultado = clienteService.crear(cliente);

        assertNotNull(resultado.getId());
        assertTrue(resultado.getActivo());
        assertEquals("Digicel", resultado.getNombreEmpresa());
        verify(clienteRepository).save(any(Cliente.class));
    }

    @Test
    void eliminar_debeEliminarClienteExistente() {
        Cliente cliente = Cliente.builder()
                .id(1L)
                .nombreEmpresa("EMASAL")
                .activo(true)
                .build();

        when(clienteRepository.findById(1L)).thenReturn(Optional.of(cliente));

        clienteService.eliminar(1L);

        verify(clienteRepository).findById(1L);
        verify(clienteRepository).delete(cliente);
    }
}