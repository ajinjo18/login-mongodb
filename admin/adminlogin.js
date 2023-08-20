const express=require('express')
const router=express.Router()
const collection = require('../mongodb')

const email1='ajinjo18@gmail.com'
const password1='123'

router.get('/adminhome', async (req, res) => {
  try {
    const user = await collection.find({}, 'name email _id');
    if(req.session.admin){

      const update = req.session.update;
      req.session.update = null;

      const useradded= req.session.useradded
      req.session.useradded = null;

      const deleted= req.session.deleted
      req.session.deleted=null

      res.render('adminhome', { user, email1, update, useradded,deleted});

    }
    else{
       res.redirect('/admin/adminlogin')
    }
  }
  catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/adminlogin',(req,res)=>{
  if(req.session.admin){
    console.log(req.session.admin);
    res.redirect('/admin/adminhome')
  }
  else{
    const adminmessage=req.session.adminmessage
    req.session.adminmessage=null;
    res.render('adminlogin',{adminmessage})
  }
})

router.post('/login',(req,res)=>{
  const{password,email}=req.body
  if(password==password1 && email==email1){
    req.session.admin=email
    res.redirect('/admin/adminhome')
  }
  else{
    req.session.adminmessage={
      type:'danger',
      message:'Invalid Admin'
    }
    res.redirect('/admin/adminlogin')
  }    
})



module.exports=router