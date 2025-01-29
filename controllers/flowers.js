const express = require('express');
const router = express.Router();

const UserModel = require('../models/user.js');

router.get('/', async (req, res) => {
    try {
        const currentUser = await UserModel.findById(req.session.user._id)
        res.render('flowers/index.ejs', {
            flowerBed: currentUser.flowerBed

        });
    } catch (error) {
        console.log(error)
        res.redirect(`/`)
    }
});

router.get('/new', (req, res) => {
    res.render('flowers/new.ejs')
});

router.put('/:flowerId', async function (req, res) {
    try {
        const currentUser = await UserModel.findById(req.session.user._id)
        const flower = currentUser.flowerBed.id(req.params.flowerId)
        flower.set(req.body)

        await currentUser.save()
        res.redirect(`/users/${currentUser._id}/flowers/${flower._id}`)
    } catch (err) {
        console.log(err)
        res.send('error updating item, check terminal')
    }
});

router.get('/:flowerId/edit', async function (req, res) {
    try {
        const currentUser = await UserModel.findById(req.session.user._id)
        const flower = currentUser.flowerBed.id(req.params.flowerId)
        res.render('flowers/edit.ejs', {
            flower: flower
        })
    } catch (err) {
        console.log(err)
        res.send('error editing item, check terminal')
    }
});

router.delete('/:flowerId', async function (req, res) {
    try {
        const currentUser = await UserModel.findById(req.session.user._id)
        currentUser.flowerBed.id(req.params.flowerId).deleteOne();
        await currentUser.save()

        res.redirect(`/users/${currentUser._id}/flowers`)

    } catch (err) {
        console.log(err)
        res.send('Error deleting flowers, click terminal!')
    }
});

router.post('/', async (req, res) => {
    try {
        const currentUser = await UserModel.findById(req.session.user._id)
        currentUser.flowerBed.push(req.body)
        await currentUser.save()
        res.redirect(`/users/${currentUser._id}/flowers`)
    } catch (error) {
        console.log(error)
        res.redirect(`/`)
    }
});



module.exports = router;
