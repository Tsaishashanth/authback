const express = require('express');
const router = express.Router();
const User = require('../models/user');
const supabase = require('../supabase')


//sign up
router.post('/signup', async (req, res) => {
    const {email, password} = req.body;
    const{data,error} = await supabase.auth.signUp({email, password});

    if(error) return res.status(400).json({error: error.message, success:false});

    res.json({message: 'User signed up', user:{id:user.id,email:email}, accessToken: data.session?.access_token,success:true});
});


//login in
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return res.status(400).json({ error: error.message,success: false });

  res.json({ message: 'Login successful',user:{id:user.id, email:email},accessToken: data.session?.access_token, success:true});
});


//user details
 router.post('/userdetails', async (req,res) => {
  const token = req.headers.authorization?.split(' ')[1]; 

  if(!token) return res.status(401).json({error: 'token unavailable',message: 'unauthorized'});

  const{email, password} = req.body;

  const{data, error:loginError} = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if(loginError) return res.status(400).json({error: "invalid credentials"});

  try{
    const{ data: {user}, error} = await supabase.auth.getUser(token);

    if(error) return res.status(401).json({error: error.message});

    res.json({user});
  }
  catch (err) {
    res.status(500).json({error: err.message});
  }
 });

module.exports = router;


//updateuser


router.put('/updateuser', async (req,res) => {
  const token = req.headers.authorization?.split(' ')[1];
  // email should be the same and password should be different


  const {email,newpassword, oldpassword } = req.body;  

  // pass old password if not send error

  if(!token) return res.status(401).json({error: 'no token provided'});

  const {data : {user}, error: userError} = await supabase.auth.getUser(token);
  if(userError) return res.status(401).json({error: userError.message});

  const{data:sessionData, error:signInError} = await supabase.auth.signInWithPassword({
    email:user.email,
    password: oldpassword
  });

  if (signInError) {
    return res.status(401).json({error: "old password is incorrect"
    });
  }

  // await supabase.auth.setSession({ access_token: token }); no need this because we are already using admin 

  const updatedata = {};
  if(email) updatedata.email = email;
  if(newpassword) updatedata.password = newpassword;


  const {data, error} = await supabase.auth.admin.updateUserById(user.id, updatedata);
  if(error) return res.status(400).json({error: error.message});

  res.json({message: 'User updated succesfully', user:data.user});
});


//logout


router.post('/logout', async(req,res) =>{

  const token = req.headers.authorization?.split(' ')[1];

  if(!token) return res.status(401).json({error: 'no token provided'});

  const{email, password} = req.body;

  const{data, error:loginError} = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if(loginError) res.status(401).json({error: "invalid credentials"})

  const{error} = await supabase.auth.signOut();

  if(error)
    return res.status(400).json({error:error.message});

  res.json({message: 'User logged out Successfully'});
});


