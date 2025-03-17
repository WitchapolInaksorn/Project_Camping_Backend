import express from "express"

import * as productController from "../controllers/productController.js"

const router = express.Router()

router.get('/products' , productController.getAllProduct)
router.get('/products/ten',productController.getTenProduct)
router.get('/products/:id',productController.getProductById)
router.get('/products/search/:id',productController.getSearchProduct)
router.get('/products/brands/:id',productController.getProductByBrandId)
router.post('/products',productController.postProduct)
router.put('/products/:id',productController.putAllProduct)
router.delete('/products/:id',productController.deleteProduct)

export default router