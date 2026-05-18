package org.example.sermon.repository;

import org.example.sermon.entity.Equipo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface EquipoRepository extends JpaRepository<Equipo, Long> {

    List<Equipo> findByFechaVencimientoBefore(LocalDate fecha);

    List<Equipo> findByFechaVencimientoBetween(LocalDate inicio, LocalDate fin);
}