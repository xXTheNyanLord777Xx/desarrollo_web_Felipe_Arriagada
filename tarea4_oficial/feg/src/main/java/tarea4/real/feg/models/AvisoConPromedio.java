package tarea4.real.feg.models;

import java.time.LocalDateTime;

//trait de aviso con el promedio añadido
public interface AvisoConPromedio {

    Long getId();

    LocalDateTime getFechaIngreso();

    String getSector();

    Integer getCantidad();

    String getTipo();

    Integer getEdad();

    String getComunaNombre();

    Double getPromedioNota();
}
