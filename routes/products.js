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

    const {data:user, error:Error} = await supabase.auth.getUser(token);

    if(Error) {
        return res.status(401).json({
            message: 'invalid',
            success:false
        })
    }

    const {name, price ,image, description} = req.body;

    const{data, error: tableerror} = await supabase.from('productstable').insert([
        {
            name,
            price,
            image,
            description
        },
    ])
    
    if(Error){
        return res.status(500).json({
            message: 'invalid details',
            success:false
        });
    }

    res.json({
        message:"products created succesfully",
        products:   data,
        success: true
    });

});

module.exports = router;