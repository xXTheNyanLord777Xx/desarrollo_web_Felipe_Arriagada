package tarea4.real.feg.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import tarea4.real.feg.models.AvisoAdopcionRepository;
import tarea4.real.feg.models.AvisoConPromedio;
import tarea4.real.feg.models.Nota;
import tarea4.real.feg.models.NotaRepository;

@Service
public class ApiService {

    private final AvisoAdopcionRepository avisoRepository;
    private final NotaRepository notaRepository;

    public ApiService(AvisoAdopcionRepository avisoRepository,
                      NotaRepository notaRepository) {
        this.avisoRepository = avisoRepository;
        this.notaRepository = notaRepository;
    }

    //getter que entrega los avisos con su promedio
    public List<Map<String, Object>> getAvisosConPromedio(int page, int size) {
        var pagina = avisoRepository.findAvisosConPromedio(PageRequest.of(page, size));
        var avisos = pagina.getContent();

        List<Map<String, Object>> data = new ArrayList<>();
        for (AvisoConPromedio a : avisos) {
            Map<String, Object> m = new HashMap<>();
            m.put("id", a.getId());
            m.put("fecha_ingreso", a.getFechaIngreso());
            m.put("sector", a.getSector());
            m.put("cantidad", a.getCantidad());
            m.put("tipo", a.getTipo());
            m.put("edad", a.getEdad());
            m.put("comuna", a.getComunaNombre());
            m.put("promedio_nota", a.getPromedioNota());
            data.add(m);
        }
        return data;
    }

    //guarda la nota y devuelve el promedio, ojo es distinto al de appservice aunque
    //si son como gemelos y seria lowkey codigo duplicado, pero filo :v
    public Double guardarNota(Integer avisoId, Integer notaValor) {
        if (notaValor == null || notaValor < 1 || notaValor > 7) {
            throw new IllegalArgumentException("La nota debe estar entre 1 y 7");
        }

        Nota n = new Nota(avisoId, notaValor);
        notaRepository.save(n);

        Double promedio = notaRepository.promedioPorAviso(avisoId);
        if (promedio == null) {
            promedio = notaValor.doubleValue();
        }
        return promedio;
    }
}
