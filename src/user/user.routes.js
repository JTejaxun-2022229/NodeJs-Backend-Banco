import {Router} from 'express';
import { check } from 'express-validator';

import { getUserEmail, userPost } from './user.controller.js';


const router= Router();

router.post(
  "/register",
  [
      check("name","The name cannot be empty").not().isEmpty(),
      check('username','The username cannot be empty').not().isEmpty(),
      check('account','The account cannot be empty').not().isEmpty(),
      check('DPI','The DPI cannot be empty').not().isEmpty().isLength({min:13}),
      check('address','The address cannot be empty').not().isEmpty(),
      check('phone','The phone cannot be empty').not().isNumeric().isLength({min:8}),
      check('email','The email cannot be empty').isEmail(),
      check('password','The password cannot be empty').not().isLength({min:6}),
      check('workPlace','The workPlace cannot be empty').not().isEmpty(),
      check('salary','The salary cannot be empty').not().isNumeric(),
      check('balance','The balance cannot be empty').not().isNumeric()
      
  ], userPost
);  

router.get(
    "/email/:correo",
    [],
    getUserEmail
);

router.delete(
  '/',
  [
    check('email','Do you want to delete this email?').isEmail(),
    check('password','Please enter the correct password to confirm the action'),
  ],
  deleteUser
)

export default router;