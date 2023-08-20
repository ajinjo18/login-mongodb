const mongoose=require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/registeration')
.then(()=>{
    console.log('mongodb connected');
})
.catch(()=>{
    console.log("connection failed");
})

const logInSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique: true
    },
    password:{
        type:String,
        required:true
    }
})

const collection=new mongoose.model('collection1',logInSchema)


module.exports=collection