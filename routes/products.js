const express = require('express');
const router = express.Router(); 
const supabase = require ('../supabase');


// get all products 
router.get('/getallproducts',async(req,res)=> {

    const {data,error} = await supabase.from('productstable').select('*');

    if(error) {
        return res.status(500).json({
            error:error.message,
            message: 'failed to fetch table details',   
            success:false
        })
    }

    res.json({
        data,
        message: 'data retrived from the table',
        sucess:true
    });
}); 

module.exports =  router;

// get all products swagger
/**
 * @swagger
 * https://authback-slfs.onrender.com/api/products/getallproducts:
 *   get:
 *     tags:
 *       - Product Routes
 *     summary: Get all products
 *     description: Fetches all products from the productstable.
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "prod123"
 *                       name:
 *                         type: string
 *                         example: Helmet
 *                       price:
 *                         type: number
 *                         example: 1999
 *                       image:
 *                         type: string
 *                         example: "https://example.com/image.jpg"
 *                       description:
 *                         type: string
 *                         example: "Premium motorcycle helmet"
 *                       category:
 *                         type: string
 *                         example: "Accessories"
 *                 message:
 *                   type: string
 *                   example: data retrieved from the table
 *                 sucess:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Failed to fetch table details
 */


// create product

router.post('/createproduct',async(req,res) => {

    const token = req.headers.authorization?.split(' ')[1];

    if(!token) {
        return res.status(400).json({
            message: 'token is missing',
            success: false
        })
    }

    const {data:user, error:userError} = await supabase.auth.getUser(token);

    if(userError) {
        return res.status(401).json({
            message: 'invalid user',
            error: userError.message,
            success:false
        })
    }

    const {id, name, price ,image, description, category} = req.body;

    const{data, error: tableerror} = await supabase.from('productstable').insert([
        {
            id,
            name,
            price,
            image,
            description,
            category
        },
    ]).select();
    
    if(tableerror){
        return res.status(500).json({
            message: 'invalid details',
            error: tableerror.message,
            success:false
        });
    }

    res.json({
        message:"products created succesfully",
        products:data,
        success: true
    });

});
//create product swagger
/**
 * @swagger
 * https://authback-slfs.onrender.com/api/products/createproduct:
 *   post:
 *     tags:
 *       - Product Routes
 *     summary: Create a new product
 *     description: Adds a new product to the productstable. Requires a valid user token in the Authorization header.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *               - price
 *               - image
 *               - description
 *               - category
 *             properties:
 *               id:
 *                 type: string
 *                 example: "prod123"
 *               name:
 *                 type: string
 *                 example: "Helmet"
 *               price:
 *                 type: number
 *                 example: 1999
 *               image:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
 *               description:
 *                 type: string
 *                 example: "Premium motorcycle helmet"
 *               category:
 *                 type: string
 *                 example: "Accessories"
 *     responses:
 *       200:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: products created successfully
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Token is missing or invalid
 *       500:
 *         description: Invalid product details or insertion failed
 */



// update product

router.put('/updateproduct', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(400).json({
      message: 'Token is missing',
      success: false
    });
  }

  const { data: user, error: authError } = await supabase.auth.getUser(token);

  if (authError) {
    return res.status(400).json({
      message: 'Invalid user',
      error: authError.message,
      success: false
    });
  }

  const { id, newname, newprice, newimage, newdescription } = req.body;

  const updateddata = {};
  if (newname) updateddata.name = newname;
  if (newimage) updateddata.image = newimage;
  if (newprice) updateddata.price = newprice;
  if (newdescription) updateddata.description = newdescription;

  const { data: newdata, error: reserror } = await supabase
    .from('productstable')
    .update(updateddata)
    .eq('id', id)
    .select();

  if (reserror) {
    return res.status(500).json({
      message: 'Failed to update product',
      error: reserror.message,
      success: false
    });
  }

  res.json({
    message: 'Product updated successfully',
    updated: newdata,
    success: true
  });
});

// update products swagger
/**
 * @swagger
 * https://authback-slfs.onrender.com/api/products/updateproduct:
 *   put:
 *     tags:
 *       - Product Routes
 *     summary: Update a product
 *     description: Updates an existing product's name, price, image, or description. Requires a valid token.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 example: "prod123"
 *               newname:
 *                 type: string
 *                 example: "Updated Helmet"
 *               newprice:
 *                 type: number
 *                 example: 1499
 *               newimage:
 *                 type: string
 *                 example: "https://example.com/new-image.jpg"
 *               newdescription:
 *                 type: string
 *                 example: "Updated premium helmet with more comfort"
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product updated successfully
 *                 updated:
 *                   type: array
 *                   items:
 *                     type: object
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Token missing or invalid user
 *       500:
 *         description: Failed to update product
 */


// get products by catogery name

router.get('/productsbycategory', async(req, res) =>{
    //get products may not require token


    if(!req.body){
        return res.status(400).json({
            message: "request body is missing ",
            success: false
        })
    }

    const {category} = req.body;

    // const search = {};
    // if(catogery) search.name = catogery;

    const{data, error:productsError} = await supabase.from('productstable').select('*').eq('category', category);

    if(productsError){
        return res.status(400).json({
            message:'unsuccesfull',
            error: productsError.message,
            success:false
        });
    }

    res.json({
        message:'fetched data according to catogery',
        details: data,
        success: true
    })
});

// get product by category swagger
/**
 * @swagger
 * https://authback-slfs.onrender.com/api/products/productsbycategory:
 *   get:
 *     tags:
 *       - Product Routes
 *     summary: Get products by category
 *     description: Fetches all products matching a specific category from the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category
 *             properties:
 *               category:
 *                 type: string
 *                 example: Accessories
 *     responses:
 *       200:
 *         description: Products fetched successfully by category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: fetched data according to category
 *                 details:
 *                   type: array
 *                   items:
 *                     type: object
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Request body missing or error while fetching
 */



// delete product

router.delete('/deleteproduct', async(req, res) => {

    
    if(!req.body) {
        return res.status(400).json({
            message: 'request is missing',
            success: false
        });
    }

    const {id} = req.body;

    const{data, error} = await supabase.from('productstable').delete().eq('id', id);

    if(error){
        return res.status(400).json({
            message: 'unsuccessfull deletion',
            error: error.message,
            success:false
        });
    }

    res.json({
        message: 'product deleted succesfully',
        success: true
    });

});

// delete a produt swagger
/**
 * @swagger
 * https://authback-slfs.onrender.com/api/products/deleteproduct:
 *   delete:
 *     tags:
 *       - Product Routes
 *     summary: Delete a product
 *     description: Deletes a product from the database by its ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 example: "prod123"
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: product deleted successfully
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Request missing or product not deleted
 */
