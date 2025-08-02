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

//userdetails swagger
/**
 * @swagger
 * https://authback-slfs.onrender.com/api/user/userdetails:
 *   get:
 *     tags:
 *       - User Routes
 *     summary: Get user details
 *     description: Returns the authenticated user's details using the bearer token.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: user details
 *                 username:
 *                   type: string
 *                   example: shashanth123
 *                 email:
 *                   type: string
 *                   example: user@example.com
 *                 accessToken:
 *                   type: string
 *                   example: clv_1TSTSSiDCAJ12FQ48D0KgBW
 *                 success:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Token missing or invalid
 *       500:
 *         description: Internal server error
 */



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

// updateuser swagger
/**
 * @swagger
 * https://authback-slfs.onrender.com/api/user/updateuser:
 *   put:
 *     tags:
 *       - User Routes
 *     summary: Update user details
 *     description: Updates the user's username and/or password. Requires old password for verification.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - oldpassword
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               oldpassword:
 *                 type: string
 *                 example: oldPassword123
 *               newpassword:
 *                 type: string
 *                 example: newSecurePassword456
 *               newusername:
 *                 type: string
 *                 example: newUsername123
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: username and password updated successfully
 *                 username:
 *                   type: string
 *                   example: newUsername123
 *                 email:
 *                   type: string
 *                   example: user@example.com
 *                 accessToken:
 *                   type: string
 *                   example: clv_1TSTSSiDCAJ12FQ48D0KgBW
 *                 success:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Unauthorized or invalid old password
 *       400:
 *         description: Bad request or update failed
 */



// add to cart
router.post('/addtocart', async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      message: 'error fetching body request',
      success: false,
    });
  }

  const { productid } = req.body;

  // Step 1: Check if product exists in productstable
  const { data: datacheck, error: checkingerror } = await supabase
    .from('productstable')
    .select('id')
    .eq('id', productid)
    .single();

  if (checkingerror) {
    return res.status(400).json({
      message: 'product not found',
      error: checkingerror.message,
      success: false,
    });
  }

  // Step 2: Check if the product is already in the cart
  const { data: existingProduct, error: checkError } = await supabase
    .from('carttable')
    .select('*')
    .eq('product_id', productid)
    .maybeSingle();

  if (checkError) {
    return res.status(400).json({
      message: 'error checking cart',
      error: checkError.message,
      success: false,
    });
  }

  // Step 3A: If it exists, increase quantity by 1
  if (existingProduct) {
    const { data: updatedCart, error: updateError } = await supabase
      .from('carttable')
      .update({ quantity: existingProduct.quantity + 1 })
      .eq('id', existingProduct.id)
      .select();

    if (updateError) {
      return res.status(400).json({
        message: 'error updating quantity',
        error: updateError.message,
        success: false,
      });
    }

    return res.json({
      message: 'quantity updated in cart',
      data: updatedCart,
      success: true,
    });
  }

  // Step 3B: If not exists, insert with quantity = 1
  const { data: newEntry, error: insertError } = await supabase
    .from('carttable')
    .insert([{ product_id: productid, quantity: 1 }])
    .select();

  if (insertError) {
    return res.status(400).json({
      message: 'error adding new product to cart',
      error: insertError.message,
      success: false,
    });
  }

  res.json({
    message: 'product added to cart with quantity 1',
    data: newEntry,
    success: true,
  });
});


// add to cart swagger
/**
 * @swagger
 * https://authback-slfs.onrender.com/api/user/addtocart:
 *   post:
 *     tags:
 *       - Cart Routes
 *     summary: Add a product to the cart
 *     description: Adds a product to the cart by product ID and quantity. Validates that the product exists.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productid
 *               - quantity
 *             properties:
 *               productid:
 *                 type: string
 *                 example: "prod123"
 *                 description: ID of the product to add
 *               quantity:
 *                 type: integer
 *                 example: 2
 *                 description: Quantity of the product to add
 *     responses:
 *       200:
 *         description: Product added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: added products to cart
 *                 dataadded:
 *                   type: array
 *                   items:
 *                     type: object
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Error fetching request body, product not found, or insert failed
 */



// deletefrom cart  

router.delete('/deletefromcart', async(req,res) => {

    const{productid} = req.body;  

    if(!req.body) {
        return res.status(400).json({
            message: 'error fecting from body',
            success: false
        });
    }

    const{data, error:deleteError} = await supabase.from('carttable').delete().eq('product_id',productid).select();

    if(deleteError) {
        return res.status(400).json({
            message: 'error deleting product from cart',
            error: deleteError.message,
            success:false
        });
    }

    if(data.length === 0) {
        return res.status(404).json({
            message: 'No product found with that ID in the cart',
            success: false
        });
    }
    res.json({
        message:'product deleted succesfull from cart',
        success:true
    }); 

});

// delete from cart swagger
/**
/**
 * @swagger
 * https://authback-slfs.onrender.com/api/user/deletefromcart:
 *   delete:
 *     tags:
 *       - Cart Routes
 *     summary: Delete a product from the cart
 *     description: Deletes a product from the cart using the product ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productid
 *             properties:
 *               productid:
 *                 type: string
 *                 example: "prod123"
 *                 description: ID of the product to be removed from the cart
 *     responses:
 *       200:
 *         description: Product deleted successfully from the cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: product deleted succesfull from cart
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Error deleting product or invalid request body
 *       404:
 *         description: No product found with that ID in the cart
 */

// get all cartproducts
router.get('/allcartproducts',async (req, res) => {

  const{data, error:dataerror} = await supabase.from('carttable').select('*');
  
  if(dataerror) {
    return res.status(400).json({
      message:'cannot retrieve data from the table',
      Error:dataerror.message,
      success:false
    });
  }

  res.json({
    message:'all products from the cart',
    data:data,
    success: true
  });
});

// get all cart products swagger
/**
 * @swagger
 * https://authback-slfs.onrender.com/api/user/allcartproducts:
 *   get:
 *     tags:
 *       - Cart Routes
 *     summary: Get all products in the cart
 *     description: Retrieves all products stored in the cart table.
 *     responses:
 *       200:
 *         description: All products fetched successfully from the cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: all products from the cart
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       product_id:
 *                         type: string
 *                         example: prod123
 *                       quantity:
 *                         type: integer
 *                         example: 2
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Failed to retrieve data from the table
 */
