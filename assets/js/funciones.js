//const personasSection = document.querySelector(".personas")
const mensajeError = document.querySelector(".error")
const btnBuscar = document.querySelector("#btn")
const resultado = document.querySelector("#resultado")
const chartDOM = document.getElementById("myChart");


// boton principal, agregar valor de monedas, seleccionar moneda a convertir
btnBuscar.addEventListener("click", () => {
    let pesosClp = document.querySelector("#monedaNac").value;
    var monedaExtra = document.getElementById("monedaExtra").value;
   if (pesosClp !== "") {
    //si clp es distinto de Vacio llama a la función getMoneda
    //por lo cual le pasaremos por argumento los valores capturados anteriomente
    getMonedas(pesosClp, monedaExtra);
    resultado.innerHTML = 'Calculando...'
    chartDOM.innerHTML = 'Cargando...'
    // JS - Destroy exiting Chart Instance to reuse <canvas> element
let chartStatus = Chart.getChart("myChart"); // <canvas> id
if (chartStatus != undefined) {
  chartStatus.destroy();
}
//-- End of chart destroy   
  } else {
    alert("Ingrese pesos");
  }
 
});



//conseguir datos de monedas desde el Endpoint
async function getMonedas(pesosClp, monedaExtra){
    try {
        //fetch hace un request al endpoint, se guarda la respuesta en res, se le pasa por interpolacion el codigo de la moneda
        const res = await fetch(`https://mindicador.cl/api/${monedaExtra}`);
        //res.josn transforma los resultados para poder leerlos como notacion de objeto JSON
        const monedas = await res.json()
        console.log(monedas)

  //Despues de tener la información:
  //al span "resultado" que capturamos anteriomente le inyectaremos con ayuda de la interpolacion ``
  //Un calculo que resulta de la division de clp (pesos capturados anteriomente)
  //divido por el valor obtenido a traves de la ruta del objeto data.serie[0].valor
  //(revisar ruta en consola el 0 es el ultimo valor, osea, el dia de hoy)
  //el parseFloat lo formatea con decimales y el .toFixed limita la cantidad de decimales a 5
  //finalmente se agrega el nombre del tipo de moneda.

  //se genera el cálculo de las monedas con el valor mas reciente de cada una, parseado a decimales, con tofixed para que sean dos decimales (se puede ajustar)
  resultado.innerHTML = `$${(pesosClp / parseFloat(monedas.serie[0].valor)).toFixed(
    2
  )} ${monedas.nombre}`;

//generamos un nuevo array con los valores de la moneda escogida, solamente
const monedasUltimosValores = monedas.serie.map((x)=>x.valor);

//generamos un nuevo array con los valores de los días para la moneda escogida, recortamos para que solo muestre el numero del mes y el día
const diasMonedas = monedas.serie.map((e) => e.fecha.slice(5, 10));







  prepararConfiguracionParaLaGrafica(diasMonedas,monedasUltimosValores);


  //se retorna el array
      return monedas;

      //en caso de que suceda un error, se despliega el mensaje
    } catch (e) {
        let error = "¡Algo salió mal! Error: " + (e.message);
        mensajeError.innerHTML = error;
    }
    
}
//hasta aqui funciona bien






//preparar el objeto de configuracion para la grafica
function prepararConfiguracionParaLaGrafica(param1, param2) {
    //Creamos las variables necesarios para el objeto de configuracion
    const tipoDeGrafica = "line";
    //nuevo arreglo guardado en "nombre de las monedas" a partir del key "codigo" del array original
    const titulo = "Valor de la moneda en los últimos 10 días";
    const colorDeLinea = "red";
  
    // a continuación crearemos y rellenaremos el grafico, para esto debemos capturar la información que necesitamos:

  let dias = param1.slice(0, 10).reverse();
  console.log(dias);
  // dentro de una variable "valores"
  let valores = param2.slice(0, 10).reverse();
  console.log(valores);

    //Creamos el objeto de configuración usando las variables anteriores
    const configMonedas = {
        type: tipoDeGrafica,
        data: {
            labels: dias,
            datasets: [
                {
                    label: titulo,
                    borderColor: colorDeLinea,
                    data: valores,
                }
            ]
        }
    };
  
//se genera el gráfico (esta vez sin una funcion rendergrafico, no es necesario que sea asincrona porque los datos ya los tenemos)
    const config = configMonedas;
    
    new Chart(chartDOM, config);
}




