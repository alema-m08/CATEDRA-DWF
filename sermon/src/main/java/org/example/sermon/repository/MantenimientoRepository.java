package org.example.sermon.repository;

import org.example.sermon.entity.Mantenimiento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MantenimientoRepository extends JpaRepository<Mantenimiento, Long> {

    long countByEstado(String estado);

    long countByCompletado(Boolean completado);

    List<Mantenimiento> findByCompletadoFalse();
}