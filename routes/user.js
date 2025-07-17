const express = require('express');
const router = express.Router();
const User = require('../models/user');
const supabase = require('../supabase');


//user details
 router.get('/userdetails', async (req,res) => {
  const token = req.headers.authorization?.split(' ')[1]; 

  if(!token) return res.status(401).json({error: 'token unavailable',message: 'unauthorized'});

  // const{email, password} = req.body; we cannot use this for get route


  try{
    const{ data, error} = await supabase.auth.getUser(token);

    if(error) return res.status(401).json({error: error.message});

    const username = data.user.user_metadata.username;
    const email = data.user.email;

    res.json({
      message:'user details',
      username:username,
      email:email,
      accessToken:token,
      success:true
    });
  }
  catch (err) {
    res.status(500).json({
      error: err.message,
      message: 'user not found',
      success : false
    });
  }
 });

module.exports = router;


//updateuser


router.put('/updateuser', async (req,res) => {
  const token = req.headers.authorization?.split(' ')[1];
  // email should be the same and password should be different


  const {email,newpassword, oldpassword,newusername} = req.body;  

  // pass old password if not send error

  if(!token) return res.status(401).json({error: 'no token provided'});

  const {data : {user}, error: userError} = await supabase.auth.getUser(token);
  if(userError) return res.status(401).json({error: userError.message});

  const username = user.user_metadata.username;


  const{data:sessionData, error:signInError} = await supabase.auth.signInWithPassword({
    email:user.email,
    password: oldpassword
  });

  if (signInError) {
    return res.status(401).json({
      message: "old password is incorrect",
      error: signInError.message
    });
  }

  // await supabase.auth.setSession({ access_token: token }); no need this because we are already using admin 

  const updatedata = {};
  // if(email) updatedata.email = email;
  if(newpassword) updatedata.password = newpassword;
  if(newusername){
    updatedata.data = {username: newusername};
  }


  const {data, error} = await supabase.auth.admin.updateUserById(user.id, updatedata);
  if(error) return res.status(400).json({error: error.message});

  let msg = "No changes provided"

  if(newusername && newpassword) {
    msg = 'username and password updated succesfully';
  }
  else if(newusername) {
    msg = 'username updated succesfully';
  }
  else if(newpassword) {
    msg = 'password updated succesfully';
  }

  res.json({
    message: msg ,
    username:newusername,
    email: email,
    accessToken: token,
    success:true
  });
});
