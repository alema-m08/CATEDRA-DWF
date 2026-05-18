package org.example.sermon.service;

import org.example.sermon.dto.AlertaResponse;

import java.util.List;

public interface AlertaService {

    List<AlertaResponse> obtenerAlertas();
}