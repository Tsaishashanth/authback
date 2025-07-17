const express = require('express');
const router = express.Router();
const User = require('../models/user');
const supabase = require('../supabase')


//sign up
router.post('/signup', async (req, res) => {
    const {email, password, username} = req.body;
    const{data,error} = await supabase.auth.signUp({
      email,
      password,
      options:{ 
        data: {
          username:username
        }
      }
    });

    if(error) return res.status(400).json({error: error.message, success:false});

    res.json({
      message: 'User signed up',
      username: username,
      email:email,
      accessToken: data.session?.access_token,
      success:true});
});


//login in
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });  

  // const username = data.user.user_metadata.username;

  if (error) return res.status(400).json({ error: error.message,messsage: 'invalid email or password',success: false });
  const username = data.user.user_metadata.username;

  res.json({ 
    message: 'Login successful',
    username:username,
    email:email,
    accessToken: data.session?.access_token, 
    success:true});
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

  if(loginError) res.status(401).json({
    message: "invalid credentials",
    error: loginError.message
  })

  const{error} = await supabase.auth.signOut();

  if(error)
    return res.status(400).json({error:error.message});

  res.json({message: 'User logged out Successfully'});
});


module.exports = router;