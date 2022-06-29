//const expressApp = express();

const url = require('url');
const express = require('express')
const async = require('hbs/lib/async')
const router = new express.Router()
const getAuth = require('../middleware/auth')
const Points = require('../models/points')
const Coupons = require('../models/coupons')
const Price = require('../models/price')


var catalyst = require('zcatalyst-sdk-node');

/*router.get('/app', (req, res) => {

    console.log(catalyst)
    var app = catalyst.initialize(req);
    console.log(app)
   /* const zia = expressApp(req)

    zia.extractOpticalCharacters(fs.createReadStream('/Users/amelia-421/Desktop/MyDoc.jpg'), {language: 'eng', modelType: 'OCR'}) //Pass the input file with optional languages and model type
	.then((result) => {
		console.log(result);
	})
	.catch((err) => console.log(err.toString())); //Push errors to Catalyst Logs


    //var app = catalyst.initializeApp(); // initialize SDK

   // var app = catalyst.initialize(req); 
  

})*/


router.get('', getAuth.ifuserloggedin, async (req, res) => {

    const getsiteurl = req.protocol + '://' + req.get('host')

    res.render('index', {
        title: 'Home',
        layout: 'home',
        menu: 'home',
        siteurl: getsiteurl,
        userdata: req.user
    })
})

router.get('/user/register', getAuth.ifuserloggedin, (req, res) => {

    const getsiteurl = req.protocol + '://' + req.get('host')

    res.render('register', {
        title: 'Signup',
        layout: 'register',
        menu: 'login',
        siteurl: getsiteurl,
        userdata: req.user
    })
})

router.get('/user/login', getAuth.ifuserloggedin, (req, res) => {

    const registerdNow = req.query.register;
    const getsiteurl = req.protocol + '://' + req.get('host')

    res.render('login', {
        title: 'Signin',
        layout: 'login',
        menu: 'login',
        siteurl: getsiteurl,
        userdata: req.user,
        registernow: registerdNow
    })
})

router.get('/user/forgot-password', getAuth.ifuserloggedin, (req, res) => {

    const getsiteurl = req.protocol + '://' + req.get('host')

    res.render('forgot-password', {
        title: 'Forgot Password',
        layout: 'forgot-password',
        siteurl: getsiteurl,
        userdata: req.user
    })
})

router.get('/faq', getAuth.ifuserloggedin, async (req, res) => {

    const getsiteurl = req.protocol + '://' + req.get('host')

    res.render('faq', {
        title: 'FAQ',
        layout: 'faq',
        menu: 'faq',
        siteurl: getsiteurl,
        userdata: req.user
    })
})

router.get('/terms-and-conditions', getAuth.ifuserloggedin, async (req, res) => {

    const getsiteurl = req.protocol + '://' + req.get('host')

    res.render('terms-conditions', {
        title: 'Terms and Contiditons',
        layout: 'terms-conditions',
        menu: 'terms-conditions',
        siteurl: getsiteurl,
        userdata: req.user
    })
})

router.get('/user/pricing', getAuth.auth, async (req, res) => {

    const getsiteurl = req.protocol + '://' + req.get('host')
    const totalPoint = req.user.points

    const couponHistory = await Coupons.find({ owner: req.user._id})
    const couponData = await Price.find({ status: true})
    const couponMinPrice = await Price.findOne().sort({point : +1})
    const minCoupon = couponMinPrice.point

    const couponHistoryArray = []
    couponHistory.forEach(history => {
        couponHistoryArray.push(history.couponid);
    })

    res.render('pricing', {
         title: 'Pricing',
         layout: 'pricing',
         menu: 'pricing',
         siteurl: getsiteurl,
         userpoints: totalPoint,
         mincoupon: minCoupon,
         couponhistory: couponHistoryArray,
         coupondata: couponData
    })
  
})

router.get('/*', getAuth.ifuserloggedin, async (req, res) => {

    const getsiteurl = req.protocol + '://' + req.get('host')
    
    res.render('404', {
        title: '404',
        layout: '404',
        siteurl: getsiteurl,
        userdata: req.user
    })
})

module.exports = router