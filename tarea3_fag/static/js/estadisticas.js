//los graficos generados por highchartgpt
//cada uno tendra la data vacia, de esta manera lo podremos poblar con fetch


//----------------------------------------lineas--------------------------------------------//
//grafico de líneas que muestra la cantidad de avisos de adopción agregados por día
Highcharts.chart('grafico-barras', {
    chart: {
        type: 'line'
    },
    title: {
        text: 'Cantidad de Avisos de Adopción por Día'
    },
    xAxis: {
        type: 'datetime',
        title: {
            text: 'Días'
        }
    },
    yAxis: {
        title: {
            text: 'Cantidad de Avisos'
        }
    },
    series: [{
        name: 'Avisos de Adopción',
        data: [] 
    }]
});
//queremos obtener los datos del backend, para ello usamos fetch

fetch("http://127.0.0.1:5000/get-stats-data")//vamos a la ruta que habiamos definido
  .then((response) => response.json())//si encontramos respuesta lo dejamos como json
  .then((data) => {//despues el response.json es atrapado por data
    let parsedData = data.map((item) => {//aca lo parseamos
      const [year, month, day] = item.date
        .split("-")
        .map((part) => parseInt(part, 10));
      return [//retornamos la fecha y el count
        Date.UTC(year, month - 1, day), // javascript month indices start from 0 !
        item.count,
      ];
    });

    // Get the chart by ID
    const chart = Highcharts.charts.find(
      (chart) => chart && chart.renderTo.id === "grafico-barras" //lo rendereamos, esto va al id del container en html
      //ahi dentro mete el grafico :333
    );

    //update
    chart.update({
      series: [
        {
          data: parsedData,//ahora poblamos con el data parseado que habiamos creado
        },
      ],
    });
  })
  .catch((error) => console.error("Error:", error));//a cualquier error muestra este



//----------------------------------------torta--------------------------------------------//
//gráfico de torta que muestra el total de avisos de adopción por tipo de mascota: perro o gato.
Highcharts.chart('grafico-torta', {
    chart: {
        type: 'pie'
    },
    title: {
        text: 'Total de Avisos de Adopción por Tipo de Mascota'
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    series: [{
        name: 'Tipo de Mascota',
        data: [],
        showInLegend: true,
        dataLabels: {
            enabled: true,
            format: '{point.name}: {point.y}'
        }
    }]
});

fetch("http://127.0.0.1:5000/get-stats-tipo") 
  .then((response) => response.json())
  .then((data) => {
    const chart = Highcharts.charts.find(
      (chart) => chart && chart.renderTo.id === "grafico-torta"
    );

    chart.update({
      series: [
        {
          data: data, 
        },
      ],
    });
  })
  .catch((error) => console.error("Error:", error));

//----------------------------------------barras--------------------------------------------//
//gráfico es uno de barras que muestra dos barras por cada 
//punto del eje X. El eje X son los meses y para cada mes muestra una barra con 
//la cantidad de avisos de adopción de gatos y otra barra con los que 
//corresponden a avisos de adopción de perros. El eje Y indica la cantidad.  

Highcharts.chart('grafico-columna', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Avisos de Adopción de Gatos y Perros por Mes'
    },
    xAxis: {
        categories: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        title: {
            text: 'Meses'
        }
    },
    yAxis: {
        title: {
            text: 'Cantidad de Avisos'
        }
    },
    series: [{
        name: 'Gatos',
        data: [] 
    }, {
        name: 'Perros',
        data: [] 
    }]
});


fetch("http://127.0.0.1:5000/get-stats-mestipo") //lo mismo que en app
  .then((response) => response.json()) //convertimos la respuesta a JSON
  .then((data) => {
    //buscamos grafico columna
    const chart = Highcharts.charts.find(
      (chart) => chart && chart.renderTo.id === "grafico-columna"
    );

    if (!chart || !Array.isArray(data)) return;

    //hacemos arrays vacios(12 posiciones para cada mes)
    const gatos = new Array(12).fill(0);
    const perros = new Array(12).fill(0);

    //ahora llenamos con los meses
    data.forEach((item) => {
      const mes = parseInt(item.month.slice(5, 7)) - 1;//psrseamos
      //OJO que tenemos valores que seran 0
      gatos[mes] = item.gato ?? 0;
      perros[mes] = item.perro ?? 0;
    });

    //actualizamos los gators y perros
    chart.update({
      series: [
        { name: "Gatos", data: gatos },
        { name: "Perros", data: perros }
      ]
    });
  })
  .catch((error) =>
    console.error("Error", error)
  );