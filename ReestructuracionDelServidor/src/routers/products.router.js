import { Router } from 'express';
import { getProductController, getProductByIdController, addProductController, updateProductController, deleteProductController} from '../controllers/products.controller.js';

const router = Router();


router.get('/', getProductController);

router.get('/:pid', getProductByIdController);

router.post('/', addProductController);

router.put('/:pid', updateProductController);

router.delete('/:pid', deleteProductController);

export default router