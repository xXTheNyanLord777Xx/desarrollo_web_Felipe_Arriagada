package tarea4.real.feg.models;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NotaRepository extends JpaRepository<Nota, Long> {
    Page<Nota> findAllByOrderByIdDesc(Pageable pageable);
    //otro query donde seleccionamos el promedio de las notas segun avisoId
    @Query("SELECT AVG(n.nota) FROM Nota n WHERE n.avisoId = :avisoId")
    Double promedioPorAviso(@Param("avisoId") Integer avisoId);

}