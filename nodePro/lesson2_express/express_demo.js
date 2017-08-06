/**
 * Created by PC160502 on 2017/8/2.
 */
const express = require('express');
const app = express();

const Router=express.Router();
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));

//在浏览器输入http://127.0.0.1:8081/?username=yxr&gender=female&birth=19940221#7sh899101
//app.get('/',(req,res)=>{

//    console.log(`method:${req.method}`);
//    console.log(`query:${JSON.stringify(req.query)}`);
//    console.log(req.query.username);
//    return res.json({code:0});
//})

//在浏览器输入http://127.0.0.1:8081/yxr/23/female
//app.get('/:username/:age/:gender',(req,res)=>{
//    console.log(`method:${req.method}`);
//    console.log(req.params.username);
//    console.log(req.params.age);
//    console.log(req.params.gender);
//    console.log(req.get('Accept'));
//    return res.json({code:0});
//});

//在浏览器输入http://127.0.0.1:8081/yxr
//app.get('/:username',(req,res)=>{
//    res.set('Content-Type','application/json; charset=utf-8');
//    res.status(404);
//    return res.send(JSON.stringify({code:1}));
//    //return res.json({code:0});
//});
//app.post('/',(req,res)=>{
//    console.log(req.body);
//    return res.send({code:0,msg:"done"});
//})

//http://localhost:8081/?name=yxr&age=23
app.use('/',mw1,mw2);
function mw1(req,res,next){
    console.log(JSON.stringify(req.body));
    req.user='hahaha';
    console.log("mw1 is called");
    console.log(JSON.stringify(req.query));
    next(new Error('something wrong'));//除了next里面传route，否则一定会进入到错误回调里面
}
function mw2(req,res,next){
    console.log("mw2 is called");
    console.log(JSON.stringify(req.query));
    console.log(JSON.stringify(req.user));
    res.json({code:200,msg:"done!"});
}
app.get('/',(req,res)=>{
    res.json({code:200,msg:"get"});
});
app.post('/',(req,res)=>{
    res.json({code:200,msg:"post"});
});
//用来处理错误,4个参数
app.use((err,req,res,next)=>{
    res.status(401);
    //console.log(err.stack);//打印出错误抛出的地方
    res.json({code:-1,msg:err.message});
    next(err);
});
app.use((err,req,res,next)=>{
    console.log(`second err middleware callde,msg:${err.message}`);
});
app.listen('8081',()=>{
    console.log('listening port 8081');
})
