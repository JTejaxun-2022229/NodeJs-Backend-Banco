import {Router} from 'express';
import { check } from 'express-validator';

import { getUsers, getUserEmail, userPost, updateUser, deleteUser } from './user.controller.js';
import { existeDPI, existeEmail } from '../helpers/db-validators.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';


const router= Router();

router.post(
  "/register",
  [
      check("name","The name cannot be empty").not().isEmpty(),
      check('username','The username cannot be empty').not().isEmpty(),
      check('DPI','The DPI cannot be empty').not().isEmpty().isLength({min:13}),
      check('DPI').custom(existeDPI),
      check('address','The address cannot be empty').not().isEmpty(),
      check('phone','The phone must be numeric and have at least 8 characters').isNumeric().isLength({min:8}),
      check('email','The email must be a valid email').isEmail(),
      check('email').custom(existeEmail),
      check('password','The password cannot be empty').not().isEmpty().isLength({min:6}),
      check('workPlace','The workPlace cannot be empty').not().isEmpty(),
      check('salary', 'The salary must be a number and at least 100').isFloat({ min: 100 }).not().isEmpty(),
      check('balance','The balance must be a number').isNumeric().not().isEmpty(),
      validarCampos      
  ], 
  userPost
);
 

router.get(
  '/',[validarJWT,],getUsers
)

router.get(
    "/email/",
    [validarJWT,],
    getUserEmail
);

router.put(
  "/updateUser",
  [
    check('email', 'The email is mandatory and must be a valid email').isEmail(),
    check('currentPassword', 'The current password is required and must be at least 6 characters').isLength({ min: 6 }),
    check("name", "The name cannot be empty").optional().notEmpty(),
    check('username', 'The username cannot be empty').optional().notEmpty(),
    check('address', 'The address cannot be empty').optional().notEmpty(),
    check('phone', 'The phone cannot be empty and must be numeric').optional().isNumeric().isLength({ min: 8 }),
    check('newPassword', 'The new password must be at least 6 characters').optional().isLength({ min: 6 }),
    check('workPlace', 'The workplace cannot be empty').optional().notEmpty(),
    check('salary', 'The salary must be a number and at least 100').isFloat({ min: 100 }).not().isEmpty(),
    check('balance', 'The balance cannot be empty and must be numerical').optional().isNumeric(),
    validarCampos,
    validarJWT,
  ],
  updateUser
);

router.delete(
  '/',
  [
    check('email','Do you want to delete this email?').isEmail(),
    check('password','Please enter the correct password to confirm the action'),
    validarCampos,
    validarJWT,
  ],
  deleteUser
)

export default router;