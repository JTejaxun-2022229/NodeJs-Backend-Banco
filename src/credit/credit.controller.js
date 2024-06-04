import Credit from "./credit.model.js";
import User from "../user/user.model.js"

export const CreditPost = async (req, res) => {
    //Pedimos que en el body vengan estas respuestas
    const { balance, description } = req.body;
    //En el validar-jwt Ya que al momento de un logueo se crea el token, para por el jwt que es donde lo obtiene la siguiente linea
    const client = req.user;

    try {
        //Buscamos el cliente para obtener su id para almacenarlo
        const clientVerified = await User.findOne({ email: client.email })
        if (!clientVerified) {
            return res.status(400).json({
                msg: `The user ${clientVerified.username} do not is autoriced`
            })
        }

        const CreditExist = await Credit.findOne({ idUser: clientVerified._id })

        if (CreditExist) {
            return res.status(400).json({
                msg: `The user ${clientVerified.username} already has a credit modo diablo >:)`
            })
        }
        //Mandamos todos los datos a  con la estructura del model0
        const creditRegister = new Credit({
            idUser: clientVerified._id, //Se guarda el id de usuario de tipo objeto
            balance,
            date: new Date(),
            description,
        });
        // se guardan el la base de datos
        await creditRegister.save();

        console.log(creditRegister.date)
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
export const getCreditAll = async (req, res) => {
    try {
        const getCredits = await Credit.find({ status: true });
        res.json({
            getCredits
        })

    } catch (error) {
        res.status(400).json({
            msg: 'No hay creditos disponibles a aprobar'
        })
    }
}

//Historial de las personas que se les ha autorizado un credito
export const getCreditAllfalse = async (req, res) => {
    try {
        const getCreditAllfalse = await Credit.find({ status: false });
        res.json({
            getCreditAllfalse
        })
    } catch (error) {
        res.status(400).json({
            msg: 'No hay creditos disponibles a aprobar ' + error
        })
    }
}

//Autorizacion a personas con espera de solicitud
export const ApproveCredit = async (req, res) => {
    const { idUser } = req.params;

    const { balance } = req.body
    try {
        const credit = await Credit.findOne({ idUser: idUser });
        if (!credit) {
            return res.status(400).json({
                msg: 'No fue posible encontrar un credito'
            });
        }

        const ultimaAprobacion = credit.fechaUltimaAprobacion;
        if (ultimaAprobacion && new Date() - ultimaAprobacion < 24 * 60 * 60 * 1000) {
            return res.status(400).json({
                msg: 'Ya se ha aprobado un crédito para este usuario en las últimas 24 horas'
            });
        }

        const ApprovedCreditPut = await Credit.findByIdAndUpdate(credit._id, {
            status: false,
            fechaUltimaAprobacion: new Date() 
        });

        if (!ApprovedCreditPut) {
            return res.status(400).json({
                msg: 'No fue posible actualizar el credito'
            });
        }

        const user = await User.findById(idUser);
        if (!user) {
            return res.status(404).json({
                msg: "Usuario no encontrado"
            });
        }

        user.balance += balance;
        await user.save();

        res.status(200).json(
            user
        );
    } catch (error) {
        res.status(404).json({
            msg: "No fue posible aprobar el credito",

        })
    }
}