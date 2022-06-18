const User = require('../models/model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const path = require('path')
const express = require('express')
const Link = require('../models/model2')
var nome  = ''
var token = ''



const chatBr = (req,res)=>{
    res.render('chat',{nome:nome})
}

const showLinks = async (req,res)=>{
    try{
        let links = await Link.find({})
        res.render('atividades',{links:links})
    }catch(error){
        res.send(error)
    }
}

let upload = async (req,res)=>{
    const link = new Link({
        link: req.body.link
    })
    try {
        const savedLink = await link.save()
        res.render('areaProfessor',)
    } catch (error) {
        res.send(error)
    }
}



let register = async (req,res)=>{
    const EmailUser = await User.findOne({email:req.body.email})
    if(EmailUser){
       return res.status('400').render('registerAluno',{error:'email já existente'})
    }
    const user = new User({
        nome: req.body.nome,
        sobrenome:req.body.sobrenome,
        email:req.body.email,
        senha: bcrypt.hashSync(req.body.senha),
        senha2: bcrypt.hashSync(req.body.senha2)
    })
    if(req.body.senha == req.body.senha2){
        try {
            let SavedUser = await user.save()
            res.render('areaProfessor')
        } catch (error) {
            res.status(400).render('registerAluno',{error:'insira todos os campos'})
        }
    }else{
        res.status(400).render('registerAluno',{error:'coloque a mesma senha '})
    }
   
}

let login = async (req,res)=>{
    const EmailUser = await User.findOne({email:req.body.email})
    if(!EmailUser){
      return res.status(400).render('loginAluno',{error:'email ou senha incorreto'})
    } 

    if(EmailUser.admin == true){
        return res.status(401).render('loginAluno',{error:'professores não podem entrar na area dos alunos'})
    }

    const match = bcrypt.compareSync(req.body.senha,EmailUser.senha)
    

    if(!match){
        return res.status(400).render('loginAluno',{error:'email ou senha incoreto'})
    } 
    
    
    
    

    token = jwt.sign({_id:EmailUser._id,admin:EmailUser.admin},process.env.SECRET)
    nome = EmailUser.nome
    res.header('authentication',token)

    res.render('logged',{aluno:EmailUser})
   

}


let loginAdmin = async (req,res)=>{
    const EmailUser = await User.findOne({email:req.body.email})
    if(!EmailUser){
        return res.status(400).render('loginProfe',{error:'email ou senha incorreto'})
    } 

    if(EmailUser.admin == false){
        return res.status(400).render('loginProfe',{error:'alunos não podem entrar na area do professor'})
    }

    const match = bcrypt.compareSync(req.body.senha,EmailUser.senha)

    if(!match){
        return res.status(400).render('loginProfe',{error:'email ou senha incorreto'})
    } 
    

    
    token = jwt.sign({_id:EmailUser._id,admin:EmailUser.admin},process.env.SECRET)
    nome = EmailUser.nome

    res.header('authentication',token)

    res.render('areaProfessor',{})
    

}

let mostrar = async (req,res)=>{
    try {
        let alunos = await User.find({})
        res.render('mostrar',{alunos:alunos})
       
    } catch (error) {
        res.send(error)
    }
}

let update = async (req,res)=>{

    let aluno = {}
    aluno.portugues = req.body.portugues
    aluno.matematica = req.body.matematica
    aluno.ciencias = req.body.ciencias
    aluno.filosofia = req.body.filosofia

    if(!aluno) return res.status(400).send('erro')

    try {
        let Aluno = await User.updateOne({nome:req.body.nome},aluno)
        res.redirect('/allAlunos')
    } catch (error) {
        return res.status(400).send(error)
    }
}

const insertToken = (req,res,next)=>{
    try {
        if (token == '') return res.status(401).send('Acesso Negado, faça o login')
        res.header('authentication',token)
        next()
    } catch (error) {
        console.log(error)
    }
    
}


let verifyToken = (req,res,next)=>{
    // const token = req.header('authentication')
    if(!token) return res.status(400).send("logue com sua conta do professor")

    try {
        const userVerified = jwt.verify(token,process.env.SECRET)
        req.user = userVerified
        next()
    } catch (error) {
        response.status(401).send('access denied')
    }
}

let verifyAdmin = async (req,res,next)=>{
    if(req.user.admin == false){
        res.send('esse dado só pode ser visto pelo professor')
    }
    next()
}

let logout = (req,res)=>{
    try {
        token = ''
        res.redirect('/')
    } catch (error) {
        res.send(error)
    }
}

module.exports = {register,upload,login,showLinks,loginAdmin,mostrar,update, chatBr,verifyToken,insertToken,verifyAdmin,logout,}