const mongoose = require('mongoose')

const tarefaShema = mongoose.Schema({
    link: {type:String , required:true}
})

module.exports = mongoose.model("links",tarefaShema)