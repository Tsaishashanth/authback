const express = require('express');
const router = express.Router();
const User = require('../models/user');
const supabase = require('../supabase')

//sign up
router.post('/signup', async (req, res) => {
    const {email, password} = req.body;
    const{data,error} = await supabase.auth.signUp({email, password});

    if(error) return res.status(400).json({error: error.message, success:false});

  
    res.json({message: 'User signed up', user:data.user, acessToken: data.sessions?.acess_token,success:true});
});

//login in
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return res.status(400).json({ error: error.message,sucess: true });

  res.json({ message: 'Login successful',acessToken: data.session?.acess_token, user: data.user });
});

//token generation
 router.get('/user', async (req,res) => {
  const token = req.headers.authorization?.split(' ')[1]; 

  if(!token) return res.status(401).json({error: 'No token provided'});

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