import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import authMobileController from '../controllers/authMobile.controller';
import { validateLogin, validateLoginRules } from '../middlewares/validateLogin';

const authRouter = Router();

/**
 * All the routes in this file are for the authentication process.
 */

// mobile login route
authRouter.post('/loginMobile', [...validateLoginRules, validateLogin], asyncHandler(authMobileController.login.bind(authMobileController)));

/**
 * end of router
 */

export default authRouter;