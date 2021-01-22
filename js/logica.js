/*************************************************************************************************************************/
/********************** VALIDACION DADA PARA SER UTILIZADA ***************************************************************/
/*************************************************************************************************************************/

function validarCedula(ci) {
    //Inicializo los coefcientes en el orden correcto
    var arrCoefs = new Array(2, 9, 8, 7, 6, 3, 4, 1);
    var suma = 0;
    //Para el caso en el que la CI tiene menos de 8 digitos
    //calculo cuantos coeficientes no voy a usar
    var difCoef = parseInt(arrCoefs.length - ci.length);
    //recorro cada digito empezando por el de más a la derecha
    //o sea, el digito verificador, el que tiene indice mayor en el array
    for (var i = ci.length - 1; i > -1; i--) {
        //Obtengo el digito correspondiente de la ci recibida
        var dig = ci.substring(i, i + 1);
        //Lo tenía como caracter, lo transformo a int para poder operar
        var digInt = parseInt(dig);
        //Obtengo el coeficiente correspondiente al ésta posición del digito
        var coef = arrCoefs[i + difCoef];
        //Multiplico dígito por coeficiente y lo acumulo a la suma total
        suma = suma + digInt * coef;
    }
    var result = false;
    // si la suma es múltiplo de 10 es una ci válida
    if ((suma % 10) === 0) {

        //**se agrega esta linea ya que cuando la suma era cero es multipo de diez y devolvia true, sin embargo la cedula no es válida**//
        if(suma !== 0) result = true;
    }
    return result;
}


/*************************************************************************************************************************/
/********************** VALIDACION PARA FORMULARIO ***********************************************************************/
/*************************************************************************************************************************/

const formulario = document.getElementById('formulario');
const inputs = document.querySelectorAll('#formulario input');

const expresiones = {
	nombre: /^[a-zA-ZÀ-ÿ\s]{2,40}$/, // Letras y espacios, pueden llevar acentos.
	apellido: /^[a-zA-ZÀ-ÿ\s]{2,40}$/, // Letras y espacios, pueden llevar acentos.
    correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    ci: /^[0-9]$/
}

const campos = {
	nombre: false,
	apellido: false,
    correo: false,
    departamento: false,
    localidad: false,
    ci: false
}

const validarFormulario = (e) => {
	switch (e.target.name) {
        case "nombre":
            validarCampo(expresiones.nombre, e.target, 'nombre');
            break;
        case "apellido":
            validarCampo(expresiones.apellido, e.target, 'apellido');
        break;
		case "correo":
			validarCampo(expresiones.correo, e.target, 'correo');
        break;
        case "departamento":
            validarCampo(expresiones.departamento, e.target, 'departamento');
        break;    
        case "localidad":
            validarCampo(expresiones.localidad, e.target, 'localidad');
        break; 
        case "ci":
            validarCampo(expresiones.ci, e.target, 'ci');
        break; 
	}
}

//elimina el error del campo, se llama cuando se pone foco en un input
const eliminarError = (e) => {
    var campo = e.target.id;
    document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.remove('formulario__input-error-activo');
    document.querySelector(`#grupo__${campo} i`).classList.remove('fa-times-circle');
    document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-incorrecto');
    document.querySelector(`#grupo__${campo} i`).classList.remove('fa-check-circle');
}

//pone en false todos los items del objeto campos
function resetCampos(){
    for(const campo in campos) {
        campos[campo] = false;
    }
}

//agrega clases css de input correcto
function inputCorrect(campo){
    document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-incorrecto');
    document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-correcto');
    if(campo != 'departamento' && campo != 'localidad'){
        document.querySelector(`#grupo__${campo} i`).classList.add('fa-check-circle');
        document.querySelector(`#grupo__${campo} i`).classList.remove('fa-times-circle');
    }
    document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.remove('formulario__input-error-activo');
    campos[campo] = true;
}

//agrega clases css de input incorrecto
function inputIncorrect(campo){
    document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-incorrecto');
    document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-correcto');
    if(campo != 'departamento' && campo != 'localidad'){
        document.querySelector(`#grupo__${campo} i`).classList.add('fa-times-circle');
        document.querySelector(`#grupo__${campo} i`).classList.remove('fa-check-circle');
    }
    document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.add('formulario__input-error-activo');
    campos[campo] = false;
}

//metodo encargado de validar los campos
const validarCampo = (expresion, input, campo) => {
    if(campo === 'ci') {
        if(validarCedula(input.value)){
            inputCorrect(campo);
        } else {
            inputIncorrect(campo);
        }
    } else {
            if(expresion.test(input.value)){
                inputCorrect(campo);
            } else {
                inputIncorrect(campo);
            }
    }
}


//agrego evento a los imputs para validar o eliminar errores
inputs.forEach((input) => {
	input.addEventListener('keyup', validarFormulario);
    input.addEventListener('blur', validarFormulario);
    input.addEventListener('focus', eliminarError);
});

//elimina los errores de los inputs, se llama cuando se envia el formulario
function deleteErrors(){
    for(const campo in campos){
        if(!campos[campo]) inputIncorrect(campo);
    }
}

//proceso los resultados del formulario al dar click en enviar
formulario.addEventListener('submit', (e) => {
	e.preventDefault();

	const terminos = document.getElementById('terminos');
	if(campos.nombre && campos.apellido && campos.correo && terminos.checked && campos.departamento && campos.localidad){
        printSendForm();
        formulario.reset();
        resetCampos();

		document.getElementById('formulario__mensaje-exito').classList.add('formulario__mensaje-exito-activo');
		setTimeout(() => {
			document.getElementById('formulario__mensaje-exito').classList.remove('formulario__mensaje-exito-activo');
		}, 5000);

		document.querySelectorAll('.formulario__grupo-correcto').forEach((icono) => {
			icono.classList.remove('formulario__grupo-correcto');
		});
	} else {
        deleteErrors();
        if(!campos.departamento) {
            document.querySelector(`#grupo__${'departamento'} .formulario__input-error`).classList.add('formulario__input-error-activo');
            document.getElementById(`grupo__${'departamento'}`).classList.add('formulario__grupo-incorrecto');
		    document.getElementById(`grupo__${'departamento'}`).classList.remove('formulario__grupo-correcto');
        }
        if(!campos.localidad) {
            document.querySelector(`#grupo__${'localidad'} .formulario__input-error`).classList.add('formulario__input-error-activo');
            document.getElementById(`grupo__${'localidad'}`).classList.add('formulario__grupo-incorrecto');
		    document.getElementById(`grupo__${'localidad'}`).classList.remove('formulario__grupo-correcto');
        }
	}
});

//imprimo en consola los datos del formulario enviado
function printSendForm() {
    var result = {
        "nombre": document.getElementById('nombre').value,
        "apellido": document.getElementById('apellido').value,
        "ci": document.getElementById('ci').value,
        "correo": document.getElementById('correo').value,
        "departamento": document.getElementById('departamento').value,
        "localidad": document.getElementById('localidad').value
    }

    console.log(result)
}



/*************************************************************************************************************************/
/********************** FUNCIONES PARA CARGAR DEPARTAMENTOS Y LOCALIDADES*************************************************/
/*************************************************************************************************************************/


//Codigo a Ejecutar al Cargar la Pagina
function myOnLoad() {
    cargar_departamentos()
   }

// funcion para Cargar Departamentos al campo <select>
function cargar_departamentos() {
    
    //array de departamentos
    var array = Object.keys(dptosLocs);
   
    //Los ordenamos
    array.sort();

    //agrega los departamentos a las opciones del select departamento
    addOptions("departamento", array);
}

// Rutina para agregar opciones a un <select>
function addOptions(domElement, array) {
    var select = document.getElementsByName(domElement)[0];
   
    for (value in array) {
     var option = document.createElement("option");
     option.text = array[value];
     select.add(option);
    }
}

// funcion para cargar Localidades al campo <select>
function cargarLocalidades(){
    
    //limpio el combo localidades
    limpiarSelectLocalidades();

    //obtengo el select departamento
    var select = document.getElementById("departamento");
    console.log(select.value);

    //validacion select departamento
    if(select.value) {
        campos.departamento = true;
        document.getElementById(`grupo__${'departamento'}`).classList.remove('formulario__grupo-incorrecto');
        document.getElementById(`grupo__${'departamento'}`).classList.add('formulario__grupo-correcto');
        document.querySelector(`#grupo__${'departamento'} .formulario__input-error`).classList.remove('formulario__input-error-activo');
    } else {
        campos.departamento = false;
        document.getElementById(`grupo__${'departamento'}`).classList.add('formulario__grupo-incorrecto');
        document.getElementById(`grupo__${'departamento'}`).classList.remove('formulario__grupo-correcto');
        document.querySelector(`#grupo__${'departamento'} .formulario__input-error`).classList.add('formulario__input-error-activo');
    } 

    //obtengo el departamento seleccionado
    var selDep = select.value;

    //obtengo las localidades de ese departamento
    var localidades = dptosLocs[selDep];

    //ordeno
    localidades.sort();

    //agrego las localidades a las opciones del select localidades
    addOptions("localidad", localidades);

}


function selectLocalidad(){
     //obtengo el select de la localidad
     var select = document.getElementById("localidad");
     console.log(select.value);

     //validacion select localidad
     if(select.value) {
         campos.localidad = true;
         document.getElementById(`grupo__${'localidad'}`).classList.remove('formulario__grupo-incorrecto');
         document.getElementById(`grupo__${'localidad'}`).classList.add('formulario__grupo-correcto');
         document.querySelector(`#grupo__${'localidad'} .formulario__input-error`).classList.remove('formulario__input-error-activo');
     } else  {
        campos.localidad = false;
        document.getElementById(`grupo__${'localidad'}`).classList.add('formulario__grupo-incorrecto');
        document.getElementById(`grupo__${'localidad'}`).classList.remove('formulario__grupo-correcto');
        document.querySelector(`#grupo__${'localidad'} .formulario__input-error`).classList.add('formulario__input-error-activo');
    } 
}

function limpiarSelectLocalidades(){
    var select = document.getElementById("localidad");
    for (let i = select.options.length; i >= 0; i--) {
        select.remove(i);
      }
      addOptions("localidad", ['Seleccione una Localidad...']);  

}

