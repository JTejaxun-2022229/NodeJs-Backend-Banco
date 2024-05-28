import {Router} from 'express';
import { check } from 'express-validator';

import { getUserEmail } from './user.controller.js';


const router= Router();

router.get(
    "/email/:correo",
    [
      //check("email", "Enter a email").not().isEmpty(),
      //check("email").custom(existingEmail),
      //validarCampos,
    ],
    getUserEmail
);

export default router;