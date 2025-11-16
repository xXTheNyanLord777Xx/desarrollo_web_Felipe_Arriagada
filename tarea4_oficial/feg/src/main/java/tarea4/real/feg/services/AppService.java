package tarea4.real.feg.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import tarea4.real.feg.models.AvisoAdopcionRepository;
import tarea4.real.feg.models.AvisoConPromedio;
import tarea4.real.feg.models.Nota;
import tarea4.real.feg.models.NotaRepository;

@Service
public class AppService {

    private final AvisoAdopcionRepository avisoRepository;
    private final NotaRepository notaRepository;

    public AppService(AvisoAdopcionRepository avisoRepository,
                      NotaRepository notaRepository) {
        this.avisoRepository = avisoRepository;
        this.notaRepository = notaRepository;
    }

    //pagina de avisos con promedio
    public Page<AvisoConPromedio> getAvisosPage(int page, int size) {
        return avisoRepository.findAvisosConPromedio(PageRequest.of(page, size));
    }

    //con listmap
    public List<Map<String, String>> getAvisosData(int page, int size) {
        Page<AvisoConPromedio> pagina = getAvisosPage(page, size);
        List<AvisoConPromedio> avisos = pagina.getContent();
        List<Map<String, String>> avisosData = new ArrayList<>();

        for (AvisoConPromedio a : avisos) {
            Map<String, String> data = new HashMap<>();
            data.put("id", a.getId().toString());
            data.put("fecha_ingreso", a.getFechaIngreso() != null ? a.getFechaIngreso().toString() : null);
            data.put("sector", a.getSector());
            data.put("cantidad", a.getCantidad() != null ? a.getCantidad().toString() : null);
            data.put("tipo", a.getTipo());
            data.put("edad", a.getEdad() != null ? a.getEdad().toString() : null);
            data.put("comuna", a.getComunaNombre());
            data.put("promedio_nota", a.getPromedioNota() != null ? a.getPromedioNota().toString() : "-");
            avisosData.add(data);
        }
        return avisosData;
    }

    //agrega nota subida y la retorna
    public Double agregarNota(Integer avisoId, Integer notaValor) {
        if (notaValor == null || notaValor < 1 || notaValor > 7) {
            throw new IllegalArgumentException("La nota debe estar entre 1 y 7");
        }

        Nota n = new Nota(avisoId, notaValor);
        notaRepository.save(n);

        return notaValor.doubleValue();
    }
}