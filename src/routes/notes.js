const express = require('express');
const router = express.Router();
const Note = require("../models/Note") 
const { isAuthenticated } = require('../helpers/auth')

router.get('/notes/add', isAuthenticated, (req,res)=>{
    res.render('notes/new-note');
})

router.post('/notes/new-note', isAuthenticated, async (req,res)=>{
    const {title}=req.body
    const errors= [];
    if(!title){
        errors.push({text: 'escribir titulo'})
    }
    if(errors.length>0){
        res.render('notes/new-note', {
            errors, 
            title
        });
    }else{
        const newNote = new Note({title})
        await newNote.save()
        res.redirect('/notes')    
    }
    
})

router.delete('/notes/delete/:id', isAuthenticated, async (req,res) => {
    await Note.findByIdAndDelete(req.params.id);
    res.redirect('/notes')   
});

router.get('/notes', isAuthenticated, async (req,res)=>{
    const notes = await Note.find().lean().sort({date:'desc'});
    res.render('notes/all-notes', { notes })
})


module.exports = router;