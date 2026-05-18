package org.example.sermon.service;

import org.example.sermon.dto.AuthResponse;
import org.example.sermon.dto.LoginRequest;
import org.example.sermon.dto.RegisterRequest;
import org.example.sermon.entity.Rol;
import org.example.sermon.entity.Usuario;
import org.example.sermon.repository.UsuarioRepository;
import org.example.sermon.security.JwtService;
import org.example.sermon.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthServiceImpl authService;

    @Test
    void registrar_debeCrearUsuarioYRetornarToken() {

        RegisterRequest request = new RegisterRequest();
        request.setNombre("Administrador");
        request.setCorreo("admin@sermon.com");
        request.setPassword("123456");
        request.setRol(Rol.ADMIN);

        when(usuarioRepository.existsByCorreo(request.getCorreo()))
                .thenReturn(false);

        when(passwordEncoder.encode("123456"))
                .thenReturn("password_encriptado");

        when(jwtService.generateToken(any(Usuario.class)))
                .thenReturn("jwt_token");

        AuthResponse response = authService.registrar(request);

        assertNotNull(response);
        assertEquals("jwt_token", response.getToken());
        assertEquals("ADMIN", response.getRol());

        verify(usuarioRepository).save(any(Usuario.class));
    }

    @Test
    void login_debeRetornarTokenCuandoCredencialesSonCorrectas() {

        LoginRequest request = new LoginRequest();
        request.setCorreo("admin@sermon.com");
        request.setPassword("123456");

        Usuario usuario = Usuario.builder()
                .id(1L)
                .nombre("Administrador")
                .correo("admin@sermon.com")
                .password("password_encriptado")
                .rol(Rol.ADMIN)
                .activo(true)
                .build();

        when(usuarioRepository.findByCorreo("admin@sermon.com"))
                .thenReturn(Optional.of(usuario));

        when(jwtService.generateToken(usuario))
                .thenReturn("jwt_token");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("jwt_token", response.getToken());
        assertEquals("admin@sermon.com", response.getCorreo());

        verify(usuarioRepository).findByCorreo("admin@sermon.com");
    }
}