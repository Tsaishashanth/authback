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

    const {id, name, price ,image, description} = req.body;

    const{data, error: tableerror} = await supabase.from('productstable').insert([
        {
            id,
            name,
            price,
            image,
            description
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

// module.exports = router; once is enough 

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

    const{data, error:productsError} = await supabase.from('productstable').select('*').eq('name', category);

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