const express = require('express');
const router = express.Router();
const User = require('../models/user');
const supabase = require('../supabase')

//sign up
router.post('/signup', async (req, res) => {
    const {email, password} = req.body;
    const{data,error} = await supabase.auth.signUp({email, password});

    if(error) return res.status(400).json({error: error.message, success:false});

  
    res.json({message: 'User signed up', user:data.user, accessToken: data.session?.access_token,success:true});
});

//login in
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return res.status(400).json({ error: error.message,success: false });

  res.json({ message: 'Login successful',accessToken: data.session?.access_token, user: data.user,success:true});
});

//user details
 router.get('/user', async (req,res) => {
  const token = req.headers.authorization?.split(' ')[1]; 

  if(!token) return res.status(401).json({error: 'token unavailable',message: unauthorized});

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

  const {newemail, newpassword } = req.body;

  if(!token) return res.status(401).json({error: 'no token provided'});

  const {data : {user}, error: userError} = await supabase.auth.getUser(token);
  if(userError) return res.status(401).json({error: userError.message});

  const updatedata = {};
  if(newemail) updatedata.email = newemail;
  if(newpassword) updatedata.password = newpassword;


  const {data, error} = await supabase.auth.updateUser(updatedata);
  if(error) return res.status(400).json({error: error.message});

  res.json({message: 'User updated succesfully', user:data.user});
});

//logout

router.post('/logout', async(req,res) =>{

  const token = req.headers.authorization?.split(' ')[1];

  if(!token) return res.status(401).json({error: 'no token provided'});

  const{data:{user}, error:userError} = await supabase.auth.getUser(token);
  if(userError) return res.status(401).json({error: userError.message});

  const{error} = await supabase.auth.signOut();
  if(error)
    return res.status(400).json({error:error.message});

  res.json({message: 'User logged out Successfully'});
});

