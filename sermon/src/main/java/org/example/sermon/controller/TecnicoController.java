package org.example.sermon.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.sermon.entity.Tecnico;
import org.example.sermon.service.TecnicoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tecnicos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class TecnicoController {

    private final TecnicoService tecnicoService;

    @GetMapping
    public ResponseEntity<List<Tecnico>> listarTodos() {
        return ResponseEntity.ok(tecnicoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tecnico> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(tecnicoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Tecnico> crear(
            @Valid @RequestBody Tecnico tecnico
    ) {
        return ResponseEntity.ok(tecnicoService.crear(tecnico));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tecnico> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody Tecnico tecnico
    ) {
        return ResponseEntity.ok(
                tecnicoService.actualizar(id, tecnico)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {

        tecnicoService.eliminar(id);

        return ResponseEntity.noContent().build();
    }
}