package tarea4.real.feg.models;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AvisoAdopcionRepository extends JpaRepository<AvisoAdopcion, Long> {
    Page<AvisoAdopcion> findAllByOrderByIdDesc(Pageable pageable);
    //hacemos la query :3
    @Query(
        value = """
            SELECT 
                a.id AS id,
                a.fecha_ingreso AS fechaIngreso,
                a.sector AS sector,
                a.cantidad AS cantidad,
                a.tipo AS tipo,
                a.edad AS edad,
                c.nombre AS comunaNombre,
                AVG(n.nota) AS promedioNota
            FROM aviso_adopcion a
            JOIN comuna c ON c.id = a.comuna_id
            LEFT JOIN nota n ON n.aviso_id = a.id
            GROUP BY a.id, a.fecha_ingreso, a.sector, a.cantidad, a.tipo, a.edad, c.nombre
            ORDER BY a.id DESC
        """,
        countQuery = "SELECT COUNT(*) FROM aviso_adopcion",
        nativeQuery = true
    )
    Page<AvisoConPromedio> findAvisosConPromedio(Pageable pageable);
}



