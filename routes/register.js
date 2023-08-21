const express=require('express')
const router=express.Router()
const collection = require('../mongodb')
const session = require('express-session')

router.get('/',(req,res)=>{
    const emailexist =req.session.emailexist
    req.session.emailexist=null

    const userregistered=req.session.userregistered
    req.session.userregistered=null
    res.render('register',{emailexist,userregistered})
})

router.post('/',async(req,res)=>{

    try{
        const check=await collection.findOne({email:req.body.email})
            if(check.email===req.body.email) {
                req.session.emailexist={
                    type:'danger',
                    message:'email already exist'
                }
                res.redirect('/register')
            }
    }

    catch{
        const data ={
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }

        await collection.insertMany([data]);
        req.session.userregistered={
            type:'success',
            message:'User Registered'
        } 
        res.redirect('/register')
    }  
})



module.exports=router