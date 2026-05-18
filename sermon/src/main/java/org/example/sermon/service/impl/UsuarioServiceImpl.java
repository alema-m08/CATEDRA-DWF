package org.example.sermon.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.sermon.dto.UsuarioResponse;
import org.example.sermon.entity.Usuario;
import org.example.sermon.exception.ResourceNotFoundException;
import org.example.sermon.repository.UsuarioRepository;
import org.example.sermon.service.UsuarioService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;

    @Override
    public List<UsuarioResponse> listarTodos() {
        return usuarioRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public UsuarioResponse buscarPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));

        return mapToResponse(usuario);
    }

    @Override
    public UsuarioResponse actualizar(Long id, Usuario usuario) {
        Usuario existente = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));

        existente.setNombre(usuario.getNombre());
        existente.setCorreo(usuario.getCorreo());
        existente.setRol(usuario.getRol());
        existente.setActivo(usuario.getActivo());

        Usuario actualizado = usuarioRepository.save(existente);

        return mapToResponse(actualizado);
    }

    @Override
    public void eliminar(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));

        usuarioRepository.delete(usuario);
    }

    private UsuarioResponse mapToResponse(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getCorreo(),
                usuario.getRol().name(),
                usuario.getActivo()
        );
    }
}