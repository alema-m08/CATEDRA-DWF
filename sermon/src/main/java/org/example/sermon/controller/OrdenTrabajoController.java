package org.example.sermon.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.sermon.entity.OrdenTrabajo;
import org.example.sermon.service.OrdenTrabajoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ordenes-trabajo")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class OrdenTrabajoController {

    private final OrdenTrabajoService ordenTrabajoService;

    @GetMapping
    public ResponseEntity<List<OrdenTrabajo>> listarTodos() {
        return ResponseEntity.ok(
                ordenTrabajoService.listarTodos()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrdenTrabajo> buscarPorId(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                ordenTrabajoService.buscarPorId(id)
        );
    }

    @PostMapping
    public ResponseEntity<OrdenTrabajo> crear(
            @Valid @RequestBody OrdenTrabajo ordenTrabajo
    ) {
        return ResponseEntity.ok(
                ordenTrabajoService.crear(ordenTrabajo)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrdenTrabajo> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody OrdenTrabajo ordenTrabajo
    ) {
        return ResponseEntity.ok(
                ordenTrabajoService.actualizar(id, ordenTrabajo)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Long id
    ) {

        ordenTrabajoService.eliminar(id);

        return ResponseEntity.noContent().build();
    }
}