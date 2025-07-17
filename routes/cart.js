const supabase = require('supabase');
const express = require ('express');
const router = express.Router;

router.post('/addtocart', async(req,res) => {
    

    if(!req.body) {
        return res.status(400).json({
            message:'error fetching body request',
            success:false
        });
    }

    const {reqid , userid, quantity} = req.body;
    

    const{data: datacheck, error:checkingerror} = await supabase.from('productstable').select('id').eq('id', reqid).single();

    if(checkingerror) {
        return res.status(400).json({
            messsage: 'product not found',
            success: false
        });
    }

    const{data:entrydata, error:Error} = await supabase.from('carttable').insert([{
        product_id: reqid,
        user_id: userid,
        quantity: quantity
    }]);

    if(Error){
        return res.status(400).json({
            message: 'error adding to cart',
            success:false
        });
    }

    res.json({
        message:'added products to cart',
        dataadded: entrydata,
        success:true
    });
});

// deletefrom cart

router.delete('/deletefromcart', async(req,res) => {

    const{product_id, user_id} = req.body;

    if(!req.body) {
        return res.status(400).json({
            message: 'error fecting from body',
            success: false
        });
    }

    const{data, error:Error} = await supabase.from('carttable').delete().eq('product_id',product_id, ).eq('user_id',user_id);

    if(Error) {
        return res.status(400).json({
            message: 'error deleting product from cart',
            success:false
        });
    }

    res.json({
        message:'product deleted succesfull from cart',
        success:true
    });

});


module.exports = router;