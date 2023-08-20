const express=require('express')
const router=express.Router()
const collection = require('../mongodb')

router.get('/add',(req,res)=>{
    var userexixt=req.session.userexixt
    req.session.userexixt=null
    res.render('adduser',{userexixt})
})

router.post('/add',async(req,res)=>{
    try{
        const check=await collection.findOne({email:req.body.email})
        
            if(check.email===req.body.email) {
                const userexixt=req.session.userexixt={
                    type:'danger',
                    message:'User Alredy Exist'
                }
                res.redirect('/adminadd/add')
            }  
    }

    catch{
        const data ={
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }

        await collection.insertMany([data]);

        req.session.useradded={
            type: 'success',
            message: 'User Added'
        }
        
        res.redirect('/admin/adminhome')
    }  
})



module.exports=router