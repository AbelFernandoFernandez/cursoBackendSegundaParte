
import { Router } from 'express';
import productsRouter from './products.router.js';
import cartsRouter from './cart.router.js';
import sessionRouter from './session.router.js';
import sesssionViewRouter from './session.view.router.js';
import viewsRouter from './view.router.js';
import chatRouter from './chat.router.js';
import { passportCall } from '../utils.js';


const appRouter=Router()

appRouter.use('/', sesssionViewRouter);
appRouter.use('/api/products', productsRouter);
appRouter.use('/api/cart', cartsRouter);
appRouter.use('/api/sessions', sessionRouter);
appRouter.use('/session', sessionRouter);
appRouter.use('/products', passportCall('jwt'), viewsRouter);
appRouter.use('/carts', viewsRouter);
appRouter.use('/chat', chatRouter);

export default appRouter