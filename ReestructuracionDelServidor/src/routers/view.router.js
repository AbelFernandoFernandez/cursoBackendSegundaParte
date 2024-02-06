import { Router } from 'express';
import passport from "passport";
import { viewProductsController, realTimeProductsController, viewCartController } from '../controllers/view.router.controller.js';

const router = Router();

router.get('/' , passport.authenticate('current', { session: false }), viewProductsController)

router.get('/realTimeProducts', realTimeProductsController)

router.get('/:cid', viewCartController)


export default router