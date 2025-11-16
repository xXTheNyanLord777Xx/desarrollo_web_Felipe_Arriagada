package tarea4.real.feg.models;

import java.time.LocalDateTime;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.persistence.Column;

@Entity
@Table(name = "aviso_adopcion") 
public class AvisoAdopcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Long id;

    @Column(name = "fecha_ingreso", nullable = false)
    private LocalDateTime fechaIngreso;

    @Column(name = "sector", nullable = true)
    private String sector;

    @NotNull
    @Column(name = "cantidad")
    private Integer cantidad;

    @NotNull
    @Column(name = "tipo", length = 10)
    private String tipo; 

    @NotNull
    @Column(name = "edad")
    private Integer edad;

    @NotNull
    @Column(name = "comuna_id")
    private Integer comunaId; 

    
    public AvisoAdopcion() {}

    public AvisoAdopcion(LocalDateTime fechaIngreso, String sector, Integer cantidad, String tipo, Integer edad, Integer comunaId) {
        this.fechaIngreso = fechaIngreso;
        this.sector = sector;
        this.cantidad = cantidad;
        this.tipo = tipo;
        this.edad = edad;
        this.comunaId = comunaId;
    }

    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getFechaIngreso() { return fechaIngreso; }
    public void setFechaIngreso(LocalDateTime fechaIngreso) { this.fechaIngreso = fechaIngreso; }

    public String getSector() { return sector; }
    public void setSector(String sector) { this.sector = sector; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public Integer getEdad() { return edad; }
    public void setEdad(Integer edad) { this.edad = edad; }

    public Integer getComunaId() { return comunaId; }
    public void setComunaId(Integer comunaId) { this.comunaId = comunaId; }
}

