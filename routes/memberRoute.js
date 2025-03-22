import express from "express"

import * as memberController from "../controllers/memberController.js"

const router = express.Router()

router.get('/member' , memberController.getAllMember)
router.get('/logout' , memberController.logoutMember)
router.post('/regist' , memberController.registMember)
router.post('/login' , memberController.loginMember)
router.post('/members/uploadimg',memberController.uploadMember)

export default router