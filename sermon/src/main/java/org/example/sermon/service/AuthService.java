package org.example.sermon.service;

import org.example.sermon.dto.AuthResponse;
import org.example.sermon.dto.LoginRequest;
import org.example.sermon.dto.RegisterRequest;

public interface AuthService {

    AuthResponse registrar(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}