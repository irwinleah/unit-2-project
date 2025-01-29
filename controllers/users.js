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
        const member = await UserModel.findById(req.params.userId).populate({path: 'flowerBed', populate: {path: 'commentBox', populate: {path: 'user'}}})
        const flower = member.flowerBed.id(req.params.flowerId)
        const comments = flower.commentBox
        
        res.render('flowers/show.ejs', {
            item: flower,
            member: member,
            comments: comments
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
        const flower = member.flowerBed.id(req.params.flowerId) //commentBox was flowerbed
        const comment = req.body
        comment.user = req.session.user._id
        console.log(comment)
        flower.commentBox.push(comment)
        await member.save();
        res.redirect(`/users/${member._id}/flowers/${flower._id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('error commenting on flower!')
    }

})

router.delete('/:userId/flowers/:flowerId/comment/:commentId', async function (req, res){
    try {
        const member = await UserModel.findById(req.params.userId)
        const flower = member.flowerBed.id(req.params.flowerId)
        console.log(flower)
        flower.commentBox.id(req.params.commentId).deleteOne()
        await member.save()
        res.redirect(`/users/${member._id}/flowers/${flower._id}`);

    } catch (err) {
        console.log(err)
        res.status(500).send('error deleting comment on flower!')
    }
})

module.exports = router;