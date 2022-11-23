//const personasSection = document.querySelector(".personas")
const mensajeError = document.querySelector(".error")
const btnBuscar = document.querySelector("#btn")
const resultado = document.querySelector("#resultado")


// boton principal, agregar valor de monedas, seleccionar moneda a convertir
btnBuscar.addEventListener("click", () => {
    let pesosClp = document.querySelector("#monedaNac").value;
    var monedaExtra = document.getElementById("monedaExtra").value;
   if (pesosClp !== "") {
    //si clp es distinto de Vacio llama a la función getMoneda
    //por lo cual le pasaremos por argumento los valores capturados anteriomente
    getMonedas(pesosClp, monedaExtra);
  } else {
    alert("Ingrese pesos");
  }
  renderGrafica();
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
  //(revisar ruta en consola el 0 es el ultimo valor al dia de hoy)
  //el parseFloat lo formatea con decimales y el .toFixed limita la cantidad de decimales a 5
  //finalmente se agrega el nombre del tipo de moneda.
  resultado.innerHTML = `${(pesosClp / parseFloat(monedas.serie[0].valor)).toFixed(
    2
  )} ${monedas.nombre}`;

      return monedas;
    } catch (e) {
        let error = "¡Algo salió mal! Error: " + (e.message);
        mensajeError.innerHTML = error;
    }
}
//hasta aqui funciona bien




//preparar el objeto de configuracion para la grafica
function prepararConfiguracionParaLaGrafica(monedas) {
    //Creamos las variables necesarios para el objeto de configuracion
    const tipoDeGrafica = "line";
    //nuevo arreglo guardado en "nombre de las monedas" a partir del key "codigo" del array original
    const titulo = "Monedas";
    const colorDeLinea = "red";
  
    // a continuación crearemos y rellenaremos el grafico, para esto debemos capturar la información que necesitamos:

  // para esto utilizaremos el metodo map() que guardara dentro de "dias"
  // todas las fechas y con slice corto el string de fechas para que solo me muestre el dia
  // En este ejemplo "2022-11-22T03:00:00.000Z" solo me guardaria 22
  // ya que descarta los primeros 8 caracteres hasta el numero 10
  // coincidiendo con el numero de dia
  let dias = monedas.serie.map((e) => e.fecha.slice(8, 10));
  console.log(dias);
  //La siguiente captura es de los valores, de la misma forma a traves del Map() guadaremos todos lo valores
  // dentro de una variable "valores"
  let valores = monedas.serie.map((e) => e.valor);
  console.log(valores);

    //Creamos el objeto de configuración usando las variables anteriores
    const config = {
        type: tipoDeGrafica,
        data: {
            labels: dias.slice(0, 10).reverse(),
            datasets: [
                {
                    label: titulo,
                    borderColor: colorDeLinea,
                    data: valores.slice(0, 10).reverse(),
                }
            ]
        }
    };
    return config;
}

async function renderGrafica() {
    const config = prepararConfiguracionParaLaGrafica(monedas);
    const chartDOM = document.getElementById("myChart");
    new Chart(chartDOM, config);
}


