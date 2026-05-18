package org.example.sermon.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.sermon.entity.Equipo;
import org.example.sermon.service.EquipoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class EquipoController {

    private final EquipoService equipoService;

    @GetMapping
    public ResponseEntity<List<Equipo>> listarTodos() {
        return ResponseEntity.ok(equipoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Equipo> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(equipoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Equipo> crear(@Valid @RequestBody Equipo equipo) {
        return ResponseEntity.ok(equipoService.crear(equipo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Equipo> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody Equipo equipo
    ) {
        return ResponseEntity.ok(equipoService.actualizar(id, equipo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        equipoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}