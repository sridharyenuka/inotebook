const express=require('express');
const router=express.Router();
const fetchuser=require('../middleware/fetchuser')
const Notes=require('../models/Notes')
const { body, validationResult } = require('express-validator')


//CREATE A USER USING :POST "/api/auth/createuser"
router.get('/fetchallnotes',fetchuser,async (req,res)=>{
    try {
        const  notes=await Notes.find({user:req.user.id});
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error")
    }
    
})

//add a new note using :POST "/api/auth/addnote"
router.post('/addnote',fetchuser,[
    body('title','Enter a valid title').isLength({min:3}),
    body('description','description must be five chars').isLength({min:5}),
],async (req,res)=>{
    try {
        const {title,description,tag}=req.body;
    // ifthere are errors return bad request and errors
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }
        const note=new Notes({
            title,description,tag,user:req.user.id
        })
        const saveNote=await note.save()
        res.json(saveNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error")
    }
    
})

//add a new note using :Put "/api/notes/updatenote"
router.put('/updatenote/:id',fetchuser,async (req,res)=>{
    try {
        
       
        const {title,description,tag}=req.body;
        let newNote={};
        if(title){newNote.title=title};
        if(description){newNote.description=description}
        if(tag){newNote.tag=tag}

        //find note to be updated and update it
        let notes=await Notes.findById(req.params.id)
        if(!notes){
            return res.status(404).send("Not Found")
        }
        if(notes.user.toString()!==req.user.id){
            return res.status(401).send("Not Allowed");
        }
        notes=await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true});
        res.json({notes});
    }catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error")
    } 
        
    
    
})

//add a new note using :Put "/api/notes/updatenote"
router.delete('/deletenote/:id',fetchuser,async (req,res)=>{
    
    

    //find note to be updated and update it
    try {
    let notes=await Notes.findById(req.params.id)
    if(!notes){
        return res.status(404).send("Not Found")
    }
    if(notes.user.toString()!==req.user.id){
        return res.status(401).send("Not Allowed");
    }
    notes=await Notes.findByIdAndDelete(req.params.id);
    res.json({"success":"Note has been deleted",notes:notes});
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error")
}


})

module.exports=router