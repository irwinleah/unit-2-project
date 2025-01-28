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
        console.log(member)
        res.render('flowers/show.ejs', {
            item: flower,
            member: member
        })
    } catch (err) {
        console.log(err)
        res.send('error and show page check your terminal!')
    }
});


module.exports = router;