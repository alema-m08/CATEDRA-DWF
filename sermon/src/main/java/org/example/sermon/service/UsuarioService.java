package org.example.sermon.service;

import org.example.sermon.dto.UsuarioResponse;
import org.example.sermon.entity.Usuario;

import java.util.List;

public interface UsuarioService {
    List<UsuarioResponse> listarTodos();
    UsuarioResponse buscarPorId(Long id);
    UsuarioResponse actualizar(Long id, Usuario usuario);
    void eliminar(Long id);
}