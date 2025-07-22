const express = require('express');
const router = express.Router();
const User = require('../models/user');
const supabase = require('../supabase')


//sign up
//signup swagger route

/**
 * @swagger
 * /signup:
 *   post:
 *     tags:
 *       - Auth Routes
 *     summary: Create a new user account
 *     description: Signs up a new user using email, password, and username.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - username
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: mySecurePassword123
 *               username:
 *                 type: string
 *                 example: shashanth123
 *     responses:
 *       200:
 *         description: User signed up successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User signed up
 *                 username:
 *                   type: string
 *                   example: shashanth123
 *                 email:
 *                   type: string
 *                   example: shashanth@example.com
 *                 accessToken:
 *                   type: string
 *                   example: clv_1ABCXYZ9TOKEN12
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid input or user already exists
 */




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
//login swagger route

/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - Auth Routes
 *     summary: Login to an existing user account
 *     description: Authenticates a user using email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 example: mySecurePassword123
 *                 description: User's password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: Login successful
 *                 username: shashanth123
 *                 email: shashanth@example.com
 *                 accessToken: clv_1ABCXYZ9TOKEN12
 *                 success: true
 *       400:
 *         description: Invalid email or password
 */


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
//swagger logout 

/**
 * @swagger
 * /logout:
 *   post:
 *     tags:
 *       - Auth Routes
 *     summary: Logout the user
 *     description: Logs out the currently authenticated user using a bearer token in the Authorization header.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: User logged out Successfully
 *                 success: true
 *       401:
 *         description: Missing or invalid token
 *       400:
 *         description: Logout failed due to server error
 */



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

  res.json({message: 'User logged out Successfully',success:true});
});


module.exports = router;