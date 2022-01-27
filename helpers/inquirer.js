const inquirer = require ('inquirer');

const preguntas = [
    {
        type: 'list',
        name: 'options',
        message:'Que desea hacer?',
        choices: [
            {
                value: 1,
                name: '1. Buscar Ciudad'
            },
            {
                value: 2,
                name: '2. Historial'
            },
            {
                value: 0,
                name: '0. Salir'
            },            
        ]
    }
];


const inquirerMenu = async () =>{

    console.clear();
    console.log('=========================');
    console.log( 'Seleccione una opcion' );
    console.log('=========================\n');

    const { options } = await inquirer.prompt(preguntas);
    return options;

}

const pausa = async() =>{

    const question = [
        {
            type: 'input',
            name: 'enter',
            message: '\n \nPresione enter para continuar'
        }
    ]

    await inquirer.prompt(question);
}

const leerInput = async( message ) =>{

    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate( value ){
                if( value.length === 0 ) {
                    return 'Ingrese un valor';
                }
                return true;

            }

        }
    ]

    const {desc}= await inquirer.prompt(question);
    return desc;

}

const listLugares = async ( lugares = [] ) =>{

    const choices = lugares.map( (lugar,i) =>{

        const idx = i + 1 ;
        return {
            value: lugar.id,
            name: `${idx} ${lugar.nombre}`
        }
    });

    choices.unshift({
        value: 0,
        name: '0. Cancelar'
    })

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar',
            choices
        }
    ]
    const { id } = await inquirer.prompt(preguntas);
    return id;

}

const confirmarB = async (message)=>{

    const question = [
        {
            type:'confirm',
            name: 'ok',
            message
        }
    ];
    const { ok } = await inquirer.prompt(question);
    return ok;
}

const listCompletarTarea = async ( tarea = [] ) =>{

    const choices = tarea.map( (tarea,i) =>{

        const idx = i + 1 ;
        return {
            value: tarea.id,
            name: `${idx} ${tarea.desc}`,
            checked: (tarea.completadoEn)? true : false
        }
    });

    const pregunta = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Selecciones',
            choices
        }
    ]
    const { ids } = await inquirer.prompt(pregunta);
    return ids;

}



module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    listLugares,
    confirmarB,
    listCompletarTarea
}
