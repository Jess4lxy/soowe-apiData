import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import authMobileController from '../controllers/authMobile.controller';
import { validateLogin, validateLoginRules } from '../middlewares/validateLogin';
import UserController from '../controllers/usuario.controller';
import { validateUsuario, validateUsuarioRules } from '../middlewares/validateUsuario';
import authAdminController from '../controllers/authAdmin.controller';

const authRouter = Router();

/**
 * All the routes in this file are for the authentication process.
 */

// mobile login route
authRouter.post('/registerMobile', [...validateUsuarioRules, validateUsuario], asyncHandler(UserController.createUser.bind(UserController)));
authRouter.post('/loginMobile', [...validateLoginRules, validateLogin], asyncHandler(authMobileController.login.bind(authMobileController)));

// admin login route

authRouter.post('/login', [...validateLoginRules, validateLogin], asyncHandler(authAdminController.loginAdmin.bind(authAdminController)));

/**
 * end of router
 */

export default authRouter;