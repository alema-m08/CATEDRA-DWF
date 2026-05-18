package org.example.sermon.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UsuarioResponse {
    private Long id;
    private String nombre;
    private String correo;
    private String rol;
    private Boolean activo;
}