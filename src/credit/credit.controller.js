import Credit from "./credit.model.js";
//import User from "../user/user.model.js"

export const CreditPost = async (req, res) => {
    //Pedimos que en el body vengan estas respuestas
    const { balance, fecha, description } = req.body;
    //En el validar-jwt Ya que al momento de un logueo se crea el token, para por el jwt que es donde lo obtiene la siguiente linea
    const client = req.user.email;

   //Buscamos el cliente para obtener su id para almacenarlo
    const clientVerified = await User.findOne({ email: client })

    try {
        //Mandamos todos los datos a  con la estructura del model0
        const creditRegister = new Credit ({ 
            idUser: clientVerified.uid, //Se guarda el id de usuario de tipo objeto
            balance, 
            fecha, 
            description });
            // se guardan el la base de datos
            await creditRegister.save();

            console.log(creditRegister.Date)
            res.status(201).json({
                msg: 'El crédito fue solicitado exitosamente',
                creditRegister,
            })
    } catch (e) {
        res.status(500).json({
            msg: 'No fue posible solicitar un credito comuniquese con su agencia'
        })
    }
}


// Funcion para Obtener los creditos esperando a ser aprobados
export const getCreditAll = async(req, res) =>{
    try {
        const getCredits = await Credit.find({estado: true});
        res.json({
            getCredits
        })
    } catch (error) {
        res.status(400).json({
            msg: 'No hay creditos disponibles a aprobar'
        })
    }
}

export const getCreditAllfalse = async(req, res) =>{
    try {
        const getCreditAllfalse = await Credit.find({estado: false});
        res.json({
            getCreditAllfalse
        })
    } catch (error) {
        res.status(400).json({
            msg: 'No hay creditos disponibles a aprobar'
        })
    }
}