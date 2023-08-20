const express=require('express')
const router=express.Router()
const collection = require('../mongodb')

router.get('/',(req,res)=>{
    res.render('register')
})

router.post('/',async(req,res)=>{

    try{
        const check=await collection.findOne({email:req.body.email})
            if(check.email===req.body.email) {
                res.render('register',{err:true})
            }  
    }

    catch{
        const data ={
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }

        await collection.insertMany([data]);
        res.redirect('/')
    }  
})



module.exports=router