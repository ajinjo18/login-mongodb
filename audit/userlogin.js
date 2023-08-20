const express=require('express')
const router=express.Router()
const collection = require('../mongodb')
var name;

router.get('/',(req,res)=>{
    if(req.session.user){
        res.render('userhome',{name})
    }
    else{
        const invaliduser=req.session.invaliduser
        req.session.invaliduser= null;
        res.render('userlogin',{invaliduser})
    }
    
})

router.post('/',async(req,res)=>{
    try{
        const check=await collection.findOne({email:req.body.email})
            if(check.password===req.body.password) {
                name=check.name
                req.session.user=req.body.email
                res.redirect('/')
            }
            else{
                req.session.invaliduser={
                    type:'danger',
                    message:'invalid user'
                }
                res.redirect('/')
            }
    }

    catch{
        req.session.invaliduser={
            type:'danger',
            message:"Fields Can't Be Empty"
        }
        res.redirect('/')
    }
})



module.exports=router