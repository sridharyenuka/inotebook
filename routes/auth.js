const express=require('express');
const mongoose = require('mongoose');
const User=require('../models/User')
const { body, validationResult } = require('express-validator')
const router=express.Router();
const bcrypt=require('bcryptjs');
var jwt=require('jsonwebtoken');
var fetchuser=require('../middleware/fetchuser')

const JWT_SECRET="sridharisagoodb$oy"

//CREATE A USER USING :POST "/api/auth/createuser"
router.post('/createuser',[
     body('name','Enter a valid name').isLength({min:3}),
     body('email','Enter a valid email').isEmail(),
     body('password','password must be five chars').isLength({min:5}),
],async(req,res)=>{
     let success=false;
     // ifthere are errors return bad request and errors
     const errors=validationResult(req);
     if(!errors.isEmpty()){
          return res.status(400).json({success,errors:errors.array()});
     }
     // check whether the user with this email exists already
     
     let user = await User.findOne({email:req.body.email}).exec()
     console.log(user) 
     if(user){
          return res.status(400).json({success,error:"sorry a user with this email already exists"})
     }
     const salt=await bcrypt.genSaltSync(10);
     const secPass=await bcrypt.hash(req.body.password,salt);
     try{
          user=await User.create({
               name:req.body.name,
               password:secPass,
               email:req.body.email,
          })
          const data={
               user:{
                    id:user.id
               }
          }
          const authtoken=jwt.sign(data,JWT_SECRET)
          // const jwtData=jwt.sign(data,JWT_SECRET)
          // console.log(jwtData);
          success=true
          res.json({success,authtoken})
     }catch(error){
          console.error(error.message);
          res.status(500).send("Internal server error")
     }
     
     // .then(user=>res.json(user))
     // .catch(err=>{console.log(err)
     // res.json({error:'Please enter a unique value for email',message:err.message})})
})
//authenticate a user using : POST "/api/auth/login" no login required
router.post('/login',[
     body('email','Enter a valid email').isEmail(),
     body('password','Password cannot be blank').exists(),
],async(req,res)=>{
     let success=false;
     const errors=validationResult(req);
     if(!errors.isEmpty()){
          return res.status(400).json({errors:errors.array()});
     }


const {email,password}=req.body;
try {
     let user = await User.findOne({email}).exec()
     //  console.log(user) 
     if(!user){
          return res.status(400).json({error:"Please try to login with correct credentials"})
     }

     const passwordCompare= await bcrypt.compare(password,user.password);
     if(!passwordCompare){
          success=false;
          return res.status(400).json({success,error:"Please try to login with correct credentials"})
     }
     const data={
          user:{
               id:user.id
          }
     }
     const authtoken=jwt.sign(data,JWT_SECRET)
     success=true;
     res.json({success,authtoken})
} catch (error) {
     console.error(error.message);
     res.status(500).send("Internal server error"); 
}
})
// route:3  get loggedin user details
router.post('/getuser',fetchuser,async(req,res)=>{
try {
     userId=req.user.id;
     const user=await User.findById(userId).select("-password");
     res.send(user);
} catch (error) {
     console.error(error.message);
     res.status(500).send("Internal server error"); 
}})
module.exports=router