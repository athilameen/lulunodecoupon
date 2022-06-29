const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    
    try {
       
        //const token = req.header('Authorization').replace('Bearer ', '')
        const token = req.cookies.jwt
        const decoded = jwt.verify(token, 'bloguserlogin')
        const user = await User.findOne({ _id: decoded._id, 'role':'user', 'tokens.token': token })

        if (!user) {
            throw new Error()
        }
        req.user = user
        next()
    } catch (e) {
        res.redirect('/user/login');
        //res.status(401).send({ error: 'Please authenticate.' })
    }
}



const ifuserloggedin = async (req, res, next) => {
    
    try {
       
        const token = req.cookies.jwt
        const decoded = jwt.verify(token, 'bloguserlogin')
        const user = await User.findOne({ _id: decoded._id, 'role':'user', 'tokens.token': token })

        if (!user) {
            req.user = 'authenticatefail'
            next()
        } else {

            if(req.originalUrl == "/user/login" || req.originalUrl == "/user/register"){
                res.redirect('/user/profile')
            } else {
                req.user = user
                next()
            }            
        }
        
    } catch (e) {
        req.user = 'authenticatefail'
        next()
    }
}

const adminAuth = async (req, res, next) => {
    
    try {
       
        const token = req.cookies.jwt
        const decoded = jwt.verify(token, 'blogadminlogin')
        const user = await User.findOne({ _id: decoded._id, 'role':'admin', 'tokens.token': token })

        if (!user) {
            throw new Error()
        }

        req.user = user
        next()
    } catch (e) {
        res.redirect('/superadminlogin');
        //res.status(401).send({ error: 'Please authenticate.' })
    }
}

module.exports = {
    auth:auth,
    ifuserloggedin:ifuserloggedin,
    adminAuth:adminAuth
}