package org.example.sermon.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.sermon.dto.AuthResponse;
import org.example.sermon.dto.LoginRequest;
import org.example.sermon.dto.RegisterRequest;
import org.example.sermon.entity.Rol;
import org.example.sermon.entity.Usuario;
import org.example.sermon.exception.ResourceNotFoundException;
import org.example.sermon.repository.UsuarioRepository;
import org.example.sermon.security.JwtService;
import org.example.sermon.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Override
    public AuthResponse registrar(RegisterRequest request) {

        if (usuarioRepository.existsByCorreo(request.getCorreo())) {
            throw new RuntimeException("El correo ya está registrado");
        }

        Usuario usuario = Usuario.builder()
                .nombre(request.getNombre())
                .correo(request.getCorreo())
                .password(
                        passwordEncoder.encode(request.getPassword())
                )
                .rol(
                        request.getRol() != null
                                ? request.getRol()
                                : Rol.TECNICO
                )
                .activo(true)
                .build();

        usuarioRepository.save(usuario);

        String jwtToken = jwtService.generateToken(usuario);

        return new AuthResponse(
                jwtToken,
                "Bearer",
                usuario.getCorreo(),
                usuario.getRol().name()
        );
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getCorreo(),
                        request.getPassword()
                )
        );

        Usuario usuario = usuarioRepository.findByCorreo(
                        request.getCorreo()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Usuario no encontrado"
                        )
                );

        String jwtToken = jwtService.generateToken(usuario);

        return new AuthResponse(
                jwtToken,
                "Bearer",
                usuario.getCorreo(),
                usuario.getRol().name()
        );
    }
}