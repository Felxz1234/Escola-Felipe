const mongoose = require('mongoose')


const loginShema = mongoose.Schema({
    nome: {type:String,required:true},
    sobrenome:{type:String, required:true},
    email: {type:String,required:true , min: 10 , max:100},
    senha: {type:String,required:true , min: 6},
    senha2: {type:String,required:true , min: 6},
    portugues:{type:Number , default:0},
    matematica:{type:Number, default:0},
    ciencias:{type:Number, default:0},
    filosofia:{type:Number, default:0},
    favorito:{type:String},
    admin:{type:Boolean,default:false}
})



module.exports =  mongoose.model('Login',loginShema)