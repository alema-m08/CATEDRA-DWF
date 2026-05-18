package org.example.sermon.controller;

import lombok.RequiredArgsConstructor;
import org.example.sermon.dto.DashboardResponse;
import org.example.sermon.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<DashboardResponse> obtenerResumen() {
        return ResponseEntity.ok(dashboardService.obtenerResumen());
    }
}