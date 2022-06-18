const express = require("express")
const router = express.Router()
const User = require('../models/model')


router.get('/loginProfe',(req,res)=>{
    res.render('loginProfe',{error:false})
})




module.exports = router