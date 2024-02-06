import { Router } from 'express';
import { createCartController, getCartByIdController, addProductToCartController, deleteProductToCart, addProductsToCartController, updateProductToCartController, deleteProductsFromCartController} from '../controllers/carts.controller.js';

const router = Router();

router.post('/', createCartController);

router.get('/:cid', getCartByIdController);

router.post('/:cid/product/:pid', addProductToCartController);

router.delete('/:cid/product/:pid', deleteProductToCart);

router.put('/:cid', addProductsToCartController);

router.put('/:cid/product/:pid', updateProductToCartController);

router.delete('/:cid', deleteProductsFromCartController);

export default router