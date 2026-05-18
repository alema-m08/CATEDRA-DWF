package org.example.sermon.controller;

import lombok.RequiredArgsConstructor;
import org.example.sermon.dto.ReporteResumenResponse;
import org.example.sermon.service.ReporteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ReporteController {

    private final ReporteService reporteService;

    @GetMapping("/resumen")
    public ResponseEntity<ReporteResumenResponse> obtenerResumen() {
        return ResponseEntity.ok(reporteService.obtenerResumen());
    }
}