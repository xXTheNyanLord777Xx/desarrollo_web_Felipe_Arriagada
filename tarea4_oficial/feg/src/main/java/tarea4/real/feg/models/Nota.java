package tarea4.real.feg.models;



import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.persistence.Column;

//lo mismo pero ahora con nota
@Entity
@Table(name = "nota")
public class Nota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Integer id;

    @NotNull
    @Column(name = "aviso_id", nullable = false)
    private Integer avisoId;

    @NotNull
    @Column(name = "nota", nullable = false)
    private Integer nota;   

    
    public Nota() {}


    public Nota(Integer avisoId, Integer nota) {
        this.avisoId = avisoId;
        this.nota = nota;
    }

    
    public Integer getId() {return id;}

    public void setId(Integer id) {this.id = id;}

    public Integer getAvisoId() {return avisoId;}

    public void setAvisoId(Integer avisoId) {this.avisoId = avisoId;}

    public Integer getNota() {return nota;}

    public void setNota(Integer nota) {this.nota = nota;}
}
    


