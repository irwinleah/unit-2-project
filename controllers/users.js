const express = require('express');
const router = express.Router();

const UserModel = require('../models/user.js');


router.get('/', async function (req, res) {
    const users = await UserModel.find({})
    res.render('users/index.ejs', {
        users: users
    })

})

router.get('/:userId', async function (req, res) {
    const user = await UserModel.findById(req.params.userId)
    res.render('users/show.ejs', {
        member: user
    })
})

router.get('/:userId/flowers/:flowerId', async function (req, res) {
    try {
        const member = await UserModel.findById(req.params.userId)
        const flower = member.flowerBed.id(req.params.flowerId)
        res.render('flowers/show.ejs', {
            item: flower,
            member: member
        })
    } catch (err) {
        console.log(err)
        res.send('error and show page check your terminal!')
    }
});

router.post('/:userId/flowers/:flowerId/like', async function(req, res) {
    try {
        const member = await UserModel.findById(req.params.userId)
        const flower = member.flowerBed.id(req.params.flowerId)

        if(!flower.likes.includes(req.session.user._id)) {
            flower.likes.push(req.session.user._id );
        } else {
            flower.likes.remove(req.session.user._id)
        }
        await member.save();
        res.redirect(`/users/${member._id}/flowers/${flower._id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('error liking flower!')
    }

})

router.post('/:userId/flowers/:flowerId/comment', async function(req, res) {
    try {
        const member = await UserModel.findById(req.params.userId)
        const flower = member.flowerBed.id(req.params.flowerId)

        if(!flower.comments.includes(req.body.user._id)) {
            console.log("blahhh")
            member.flower.comments.push(req.body.user._id);
        } else {
            flower.comments.remove(req.body.user._id)
        }
        await member.save();
        res.redirect(`/users/${member._id}/flowers/${flower._id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('error commenting on flower!')
    }

})

module.exports = router;