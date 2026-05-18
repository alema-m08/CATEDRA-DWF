package org.example.sermon.repository;

import org.example.sermon.entity.OrdenTrabajo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrdenTrabajoRepository extends JpaRepository<OrdenTrabajo, Long> {

    long countByEstado(String estado);

    List<OrdenTrabajo> findByEstado(String estado);
}