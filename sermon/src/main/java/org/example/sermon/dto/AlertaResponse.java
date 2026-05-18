package org.example.sermon.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AlertaResponse {

    private String tipo;
    private String titulo;
    private String descripcion;
    private String prioridad;
}