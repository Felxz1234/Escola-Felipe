const express = require("express")
const router = express.Router()
const controler = require('../RouterControler/controler')
const path = require('path')



router.post('/register',controler.register)
router.post('/login',controler.login)
router.post('/loginAdmin',controler.loginAdmin)
router.get('/allAlunos',controler.insertToken,controler.verifyToken,controler.verifyAdmin,controler.mostrar)
router.post('/UpdateNota',controler.update)
router.get('/logout',controler.logout)
router.post('/upload',controler.upload)
router.get('/showlinks',controler.insertToken,controler.verifyToken,controler.showLinks)
router.get('/chat',controler.insertToken,controler.verifyToken,controler.chatBr)
// router.get('/OneAluno',controler.showOne)

module.exports = router