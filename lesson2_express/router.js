/**
 * Created by PC160502 on 2017/8/6.
 */
const router = require('express').Router();

router.get('/simple_demo',(req,res,next)=>{
    res.end(`your simple demo here`);
});

module .exports = router;