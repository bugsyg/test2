const express = require('express');
const router = express.Router();
const Note = require("../models/Note") 
const { isAuthenticated } = require('../helpers/auth')

router.post('/notes/new-note', isAuthenticated, async (req,res)=>{
    const {title, fijo, cuando, duracion, limite, caracter, dia, date}=req.body
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
        const newNote = new Note({title, fijo, cuando, duracion, limite, caracter, dia, date})
        newNote.user = req.user.id; 
        await newNote.save()
        res.redirect('/notes')    
    }
})
router.post('/notes/new-note/cualquier', isAuthenticated, async (req,res)=>{
    const {title, fijo, cuando, duracion, limite, caracter, date}=req.body
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
        const newNote = new Note({title, fijo, cuando, duracion, limite, caracter, date, dia: null})
        newNote.user = req.user.id; 
        await newNote.save()
        res.redirect('/notes/cualquier')    
    }
})
router.post('/notes/new-note/hoy', isAuthenticated, async (req,res)=>{
    const {title, fijo, cuando, duracion, limite, caracter, date}=req.body
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
        const hoy = new Date("2021-10-25T00:00:00.000+00:00")
        const newNote = new Note({title, fijo, cuando, duracion, limite, caracter, date, dia: hoy})
        newNote.user = req.user.id; 
        await newNote.save()
        res.redirect('/notes/hoy')    
    }
})
router.post('/notes/new-note/semana', isAuthenticated, async (req,res)=>{
    const {title, fijo, cuando, duracion, limite, caracter, date}=req.body
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
        const hoy = new Date("2021-10-25T00:00:00.000+00:00")
        const newNote = new Note({title, fijo, cuando, duracion, limite, caracter, date, dia: hoy.getTime() + 1000 * 86400 * 7})
        newNote.user = req.user.id; 
        await newNote.save()
        res.redirect('/notes/semana')    
    }
})

router.delete('/notes/delete/:id', isAuthenticated, async (req,res) => {
    await Note.findByIdAndDelete(req.params.id);
    res.redirect('/notes')   
});

router.get('/notes', isAuthenticated, async (req,res)=>{
    const notes = await Note.find({user: req.user.id}).lean().sort({date:'desc'});
    res.render('notes/all-notes', { notes })
})
router.get('/notes/hoy', isAuthenticated, async (req,res)=>{
    const hoy = new Date("2021-10-25T00:00:00.000+00:00")
    const notes = await Note.find({user: req.user.id, dia: {$gt: new Date(hoy.getTime()) - 1000 * 86400 * 1, $lt:(hoy.getTime() + 1000 * 86300 * 1)}}).lean().sort({date:'desc'});
    res.render('notes/hoy', { notes })
})
router.get('/notes/semana', isAuthenticated, async (req,res)=>{
    const hoy = new Date("2021-10-25T00:00:00.000+00:00")
    const notes = await Note.find({user: req.user.id, dia: {$gt: new Date(hoy.getTime() + 1000), $lt:(hoy.getTime() + 1000 * 86400 * 8)}}).lean().sort({date:'desc'});
    res.render('notes/esta-semana', { notes })
})
router.get('/notes/cualquier', isAuthenticated, async (req,res)=>{
    const hoy = new Date("2021-10-25T00:00:00.000+00:00")
    const notes = await Note.find({user: req.user.id, dia: null}).lean().sort({date:'desc'});
    res.render('notes/sin-fecha', { notes })
})


module.exports = router;