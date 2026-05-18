package org.example.sermon.controller;

import lombok.RequiredArgsConstructor;
import org.example.sermon.dto.AlertaResponse;
import org.example.sermon.service.AlertaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alertas")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AlertaController {

    private final AlertaService alertaService;

    @GetMapping
    public ResponseEntity<List<AlertaResponse>> obtenerAlertas() {
        return ResponseEntity.ok(alertaService.obtenerAlertas());
    }
}