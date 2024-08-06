const express=require('express');
const mongoose = require('mongoose');
const User=require('../models/User')
const { body, validationResult } = require('express-validator')
const router=express.Router();

//CREATE A USER USING :POST "/api/auth/createuser"
router.post('/createuser',[
     body('name','Enter a valid name').isLength({min:3}),
     body('email','Enter a valid email').isEmail(),
     body('password','password must be five chars').isLength({min:5}),
],async(req,res)=>{
     // ifhtere are errors return bad request and errors
     const errors=validationResult(req);
     if(!errors.isEmpty()){
          return res.status(400).json({errors:errors.array()});
     }
     // check whether the user with this email exists already
     const body=await req.body
     let user = await User.findOne({email:body.email})
     console.log(user) 
     if(user){
          return res.status(400).json({error:"sorry a user with this email already exists"})
     }
     user=await User.create({
          name:req.body.name,
          password:req.body.password,
          email:req.body.email,
     })
     res.json({"Nice":"nice"})
     
     // .then(user=>res.json(user))
     // .catch(err=>{console.log(err)
     // res.json({error:'Please enter a unique value for email',message:err.message})})
})

module.exports=router