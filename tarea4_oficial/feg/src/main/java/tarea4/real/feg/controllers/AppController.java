package tarea4.real.feg.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;


import tarea4.real.feg.models.AvisoConPromedio;
import tarea4.real.feg.services.AppService;

@Controller
public class AppController {

    private final AppService appService;

    public AppController(AppService appService) {
        this.appService = appService;
    }

    //esto mmuestra la primera pag de avisos
    @GetMapping("/")
    public String indexRoute(
            @RequestParam(name = "pag", defaultValue = "0") int pag,
            Model model) {

        int pageSize = 5; //con un total de 5 avisos
        Page<AvisoConPromedio> pagina = appService.getAvisosPage(pag, pageSize);

        model.addAttribute("pagina", pagina);
        model.addAttribute("avisos", pagina.getContent());
        model.addAttribute("pagActual", pag);
        model.addAttribute("totalPaginas", pagina.getTotalPages());

        //el nombre del template
        return "avisos_listado";
    }

}