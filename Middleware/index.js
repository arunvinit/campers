const express=require('express');
const path=require('path');
const app=express();
const morgan=require('morgan');
const AppError=require('./AppError')
app.use(morgan('common'));
app.use((req,res,next)=>{
    req.requestTime=Date.now();
    console.log(req.method);
    next();
})
// app.use('/dogs',(req,res,next)=>{
//     console.log('i love dogs');
//     next();
// })
// app.use((req,res,next)=>{
//     console.log('First Middleware');
//     return next();
//     console.log('First Middleware After calling');
// })
// app.use((req,res,next)=>{
//     console.log('second Middleware');
//     return next();
// })

const verify=((req,res,next)=>{
    const {password}=req.query;
    if(password==='arun'){
        next();
    }
    throw new AppError('Password required',401)
    // res.send('you need to enter password');
    // throw new Error('Password required...')
})
app.get('/error',(req,res)=>{
    chicken.fly();
})

app.get('/',(req,res)=>{
    console.log(`reqest time: ${req.requestTime}`)
    res.send("Home Page");
})
app.get('/dogs',(req,res)=>{
    console.log(`reqest time: ${req.requestTime}`)
    res.send("Dogs Page");
})
app.get('/secret',verify,(req,res,next)=>{
    res.send('i oddddddddddddkkkk')
})
// app.use((err,req,res,next)=>{
//     console.log(500);
//     console.log('*******************************************ERROR*********************************************')
//     next(err);
// })
app.get('/admin',(req,res)=>{
    throw  new AppError('You are not an Admin',403);
})
app.use((err,req,res,next)=>{
    const {status=500}= err;
    const {message='Something Went Wrong'}=err;
    res.status(status).send(message)
})
app.listen(3000,()=>{
    console.log('Connected');
})
