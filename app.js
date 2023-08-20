const express=require('express')
const app=express()
const path=require('path')
const session=require('express-session')

const adminRouter=require('./admin/adminlogin')
const auditRouter=require('./audit/userlogin')
const registerRouter=require('./routes/register')
const adduserRouter=require('./admin/adminregister')

const collection = require('./mongodb')

app.set('view engine','ejs')
app.set('views','views')

app.use(session({
  secret:['vggrth','whfueurhu','hfjrgrgjj','rhhrgu','ggftyfytty','gbtrhrt','rgerg'],
  saveUninitialized:true,
  resave:false
}))

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:false}))

app.use((req, res, next)=>{
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  next()
})

app.use('/',auditRouter)
app.use('/admin',adminRouter)
app.use('/adminadd',adduserRouter)
app.use('/audit/login',auditRouter)
app.use('/register',registerRouter)


// -------------logout----------------

app.get('/logout', (req,res)=>{
    req.session.destroy((err)=> {
        if (err) {
            res.send(err.message)
        } else {
            res.redirect('/')
        }
    })
});

app.get('/logoutadmin', (req,res)=>{
  req.session.destroy((err)=> {
      if (err) {
          res.send(err.message)
      } else {
          res.redirect('/admin/adminlogin')
      }
  })
});


// ----------------update-----------------


app.get('/update/:userId', async (req, res) => {
  try {
    const userId=req.params.userId
    const user = await collection.findById(userId);
    if(user){ 
    res.render('update', { user:[user] }); 
    } 
    else{
      res.redirect('/admin/adminhome')
    }
  }
    
  catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.post('/update', async (req, res) => {
 
  const userId = req.body.id;
  try {
    const updateData = {
      name: req.body.name,
      email: req.body.email
    };

    await collection.updateOne( {_id:userId} ,{$set: updateData});

    req.session.update={
      type: 'success',
      message: 'updated'
    }      
    res.redirect('/admin/adminhome')
  }
  catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
      
});


// -------------------delete-------------------------


app.get('/delete/:userId', async (req, res) => {
  const userId=req.params.userId
    try {
      await collection.deleteOne( {_id:userId});
      req.session.deleted={
        type: 'success',
        message: 'Successfully Deleted'
      }      
      res.redirect('/admin/adminhome')        
    }
    catch (err) {
      console.error('Error updating user:', err);
      res.status(500).json({ error: 'Internal server error' });
    }      
});


// ------------------------search------------------------


app.post('/search', async (req, res) => {
  try {
    const username=req.body.name
    const user= await collection.find({ name: username },{name:1,email:1,_id:0})
    if(user){ 
      res.render('search', { user:user }); 
    }
    else{
      res.redirect('/')
    }
  }
  catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.listen(3000,()=>{
    console.log('Listening to port http://localhost:3000');
});