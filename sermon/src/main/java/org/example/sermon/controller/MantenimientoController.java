package org.example.sermon.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.sermon.entity.Mantenimiento;
import org.example.sermon.service.MantenimientoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mantenimientos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class MantenimientoController {

    private final MantenimientoService mantenimientoService;

    @GetMapping
    public ResponseEntity<List<Mantenimiento>> listarTodos() {
        return ResponseEntity.ok(
                mantenimientoService.listarTodos()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Mantenimiento> buscarPorId(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                mantenimientoService.buscarPorId(id)
        );
    }

    @PostMapping
    public ResponseEntity<Mantenimiento> crear(
            @Valid @RequestBody Mantenimiento mantenimiento
    ) {
        return ResponseEntity.ok(
                mantenimientoService.crear(mantenimiento)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Mantenimiento> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody Mantenimiento mantenimiento
    ) {
        return ResponseEntity.ok(
                mantenimientoService.actualizar(id, mantenimiento)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Long id
    ) {

        mantenimientoService.eliminar(id);

        return ResponseEntity.noContent().build();
    }
}