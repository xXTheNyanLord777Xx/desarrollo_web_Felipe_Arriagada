package tarea4.real.feg.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import tarea4.real.feg.services.ApiService;

@RestController
public class ApiController {

    private final ApiService apiService;

    public ApiController(ApiService apiService) {
        this.apiService = apiService;
    }

    //es como get-conf del aux
    @GetMapping("/get-avisos")
    public Map<String, List<Map<String, Object>>> getAvisosEndpoint(
            @RequestParam(name = "pag", defaultValue = "0") int pag,
            @RequestParam(name = "size", defaultValue = "5") int size) {

        List<Map<String, Object>> avisos = apiService.getAvisosConPromedio(pag, size);
        return Map.of("data", avisos);
    }

    //guardamos de manera asincrona
    @PostMapping("/set-nota/{avisoId}")
    public ResponseEntity<Map<String, Object>> setNotaEndpoint(
            @PathVariable("avisoId") Integer avisoId,
            @RequestParam("nota") Integer notaValor) {

        try {
            Double nuevoPromedio = apiService.guardarNota(avisoId, notaValor);

            return ResponseEntity.ok(
                    Map.of(
                        "ok", true,
                        "id", avisoId,
                        "promedio", nuevoPromedio
                    )
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    Map.of(
                        "ok", false,
                        "error", e.getMessage()
                    )
            );
        }
    }
}
