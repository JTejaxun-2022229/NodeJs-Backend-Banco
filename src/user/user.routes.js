import { Router } from 'express';
import { check } from 'express-validator';
import { getUsers, getUserEmail, userPost, updateUser, deleteUser } from './user.controller.js';
import { existeDPI, existeEmail, existNoAccount, existUsername } from '../helpers/db-validators.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';


const router = Router();

router.post(
  "/register",
  [
    check("name", "The name cannot be empty").not().isEmpty(),
    check('username', 'The username cannot be empty').not().isEmpty(),
    check('username').custom(existUsername),
    check('DPI', 'The DPI cannot be empty').not().isEmpty().isLength({ min: 13 }),
    check('DPI').custom(existeDPI),
    check('address', 'The address cannot be empty').not().isEmpty(),
    check('phone', 'The phone must be numeric and have at least 8 characters').isNumeric().isLength({ min: 8 }),
    check('email', 'The email must be a valid email').isEmail(),
    check('email').custom(existeEmail),
    check('password', 'The password cannot be empty').not().isEmpty().isLength({ min: 6 }),
    check('workPlace', 'The workPlace cannot be empty').not().isEmpty(),
    check('salary', 'The salary must be a number and at least 100').isFloat({ min: 100 }).not().isEmpty(),
    check('balance', 'The balance must be a number').isNumeric().not().isEmpty(),
    validarCampos
  ],
  userPost
);


router.get(
  '/', [validarJWT,], getUsers
)

router.get(
  "/email/",
  [validarJWT,],
  getUserEmail
);

router.put(
  "/updateUser/:id",
  [
    validarJWT,
  ],
  updateUser
);

router.delete(
  '/',
  [
    check('email', 'Do you want to delete this email?').isEmail(),
    check('password', 'Please enter the correct password to confirm the action'),
    validarCampos,
    validarJWT,
  ],
  deleteUser
)

export default router;