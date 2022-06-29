const express = require('express')
const path = require('path')
const multer = require('multer')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookieParser = require("cookie-parser");
const User = require('../models/user')
const Points = require('../models/points')
const Coupons = require('../models/coupons')
const Price = require('../models/price')
const getAuth = require('../middleware/auth')
const router = new express.Router()
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ameen.dedoit@gmail.com',
      pass: 'rcssxzrjnroxdmdb'
    }
});

/** Decode Form URL Encoded data */
router.use(express.urlencoded())
router.use(cookieParser())

router.get('/superadmin', getAuth.adminAuth, (req, res) => {
    
    res.render('admin/index', {
        title: 'admin',
    })
})


router.get('/superadminlogin', async (req, res) => {

    const token = req.cookies.jwt
    if (!token) {
       
        res.render('admin/login', {
            title: 'login',

        })

    } else {

        const decoded = jwt.verify(token, 'blogadminlogin')
        const user = await User.findOne({ _id: decoded._id, 'role':'admin', 'tokens.token': token })

        if (!user) {
                
            res.render('admin/login', {
                title: 'login',
    
            })

        } else{
            res.redirect('/superadmin');
        }
    }

})


router.post('/superadminlogin/login', async (req, res) => {

    try {
         const user = await User.findByCredentials(req.body.email, req.body.password)
         const token = await user.generateAdminAuthToken()

         const maxAge = 3 * 60 * 60;
         res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000, // 3hrs in ms
          });
         
         if (!user) {
            res.redirect('/superadminlogin/');
         } else {
            res.redirect('/superadmin');
         }
         
     } catch (e) {
         res.redirect('/superadmin');
     }
 
})


router.get('/superadmin/logout', getAuth.adminAuth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token === req.token
        })
        await req.user.save()

        res.redirect('/superadminlogin/');
    } catch (e) {
        res.status(500).send()
    }
})


router.post('/superadminlogin/login', async (req, res) => {

    try {
         const user = await User.findByCredentials(req.body.email, req.body.password)
         const token = await user.generateAdminAuthToken()

         const maxAge = 3 * 60 * 60;
         res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000, // 3hrs in ms
          });
         
         if (!user) {
            res.redirect('/superadminlogin/');
         } else {
            res.redirect('/superadmin');
         }
         
     } catch (e) {
         res.redirect('/superadmin');
     }
 
})

router.post('/user/register', async (req, res) => {

    try {

        const getPassword = await bcrypt.hash(req.body.password, 8)

        const user = new User({
            name: req.body.username,
            email: req.body.email,
            password: getPassword,
            role: 'user'
        })

        user.save().then(() => res.send('success')).catch((e) => res.send(req.body.email + " email id already registered"))

        //send email
        let link = "http://" + req.headers.host + "/user/login";
        const mailOptions = {
            to: user.email,
            from: "athil@dedoit.com",
            //from: process.env.FROM_EMAIL,
            subject: "LuLu Registration",
            html: `<p>Hi ${user.name} </p> 
            <p>Registration completed successfully. <a href="${link}">Please login your account</a><p>`,
        };
        
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                //console.log(error);
            } else {
                //console.log('A reset email has been sent to ' + user.email + '.');
            }
        });
        
    } catch (e) {

        res.status(400).send(e)
    }

})

router.post('/users/login', async (req, res) => {

    try {
         const user = await User.findByCredentials(req.body.email, req.body.password)
         const token = await user.generateAuthToken()

         const maxAge = 3 * 60 * 60;
         res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000, // 3hrs in ms
          });
        
         //res.send({user, token})
 
        if (!user) {
            res.send('Something Went Wrong, Please Try Again')
        } else {
            res.send("success")
        }
         
     } catch (e) {
        res.send("Email and Password is mismatch")
     }
 
})

router.post('/users/forgot-password', async (req, res) => {

    try {

        const user = await User.findOne({email: req.body.email})

        if (!user) {
           res.send('The Email is not registered with us')
        } else {

            //Generate and set password reset token
            const token = await user.generatePasswordReset()
            
             // send email
            let link = "http://" + req.headers.host + "/users/reset-password/" + token;
            const mailOptions = {
                 to: user.email,
                 from: "athil@dedoit.com",
                 //from: process.env.FROM_EMAIL,
                 subject: "Password change request",
                 text: `Hi ${user.name} \n 
                 Please click on the following link ${link} to reset your password. \n\n
                 This link will valid 1 hour only. \n
                 If you did not request this, please ignore this email and your password will remain unchanged.\n`,
            };
            
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  res.send('A reset email has been sent to ' + user.email + '.');
                }
            });
        }
        
    } catch (e) {
       res.send("Something Went Wrong, Please Try Again")
    }
})

router.get('/users/reset-password/:token', getAuth.ifuserloggedin, async (req, res) => {

    const user = await User.findOne({'tokens.token': req.params.token, resetPasswordExpires: {$gt: Date.now()}})

    if(user){

        const userId = user._id
        
        var message = ""
        if(user){
            message = 'success';
        } else {
            message = 'Password reset token is invalid or has expired.';
        }

        res.render('reset-password', {
            title: 'Reset Password',
            layout: 'reset-password',
            userdata: req.user,
            msg: message,
            userid: userId
        })

    } else {

        res.render('reset-password', {
            title: 'Reset Password',
            layout: 'reset-password',
            userdata: req.user,
            msg: 'Password reset token is invalid or has expired.',
        })

    }
  
})

router.post('/user/resetpassword', getAuth.ifuserloggedin, async (req, res) => {
         
    try {

        const userId = req.body.userid
        const getNewPassword = await bcrypt.hash(req.body.newpassword, 8)

        const updateuser = await User.findByIdAndUpdate(userId, {password: getNewPassword,  resetPasswordExpires: Date.now()}, { new: true, runValidators: true })
       
        if (!updateuser) {
            res.send('Something Went Wrong, Please Try Again')
        } else {
            res.send('Password Changed Successfully')
        }

        //send email
        let link = "http://" + req.headers.host + "/user/login";
        const mailOptions = {
            to: updateuser.email,
            from: "athil@dedoit.com",
            //from: process.env.FROM_EMAIL,
            subject: "Password changed successfully",
            html: `<p>Hi ${updateuser.name} </p> 
            <p>Password changed successfully. <a href="${link}">Please login your account</a><p>`,
        };
        
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                //console.log(error);
            } else {
                //console.log('A reset email has been sent to ' + updateuser.email + '.');
            }
        });
        
    } catch (e) {
        res.send('Something Went Wrong, Please Try Again')
    }

})

router.post('/user/changepassword', getAuth.auth, async (req, res) => {
         
    try {

        const isMatch = await bcrypt.compare(req.body.oldpassword, req.user.password)

        if (!isMatch) {
            res.send('The Old Password You Have Entered Is Incorrect!')
        } else {

            const getNewPassword = await bcrypt.hash(req.body.newpassword, 8)
            req.user.password = getNewPassword
            await req.user.save()

            if (!req.user) {
                res.send('Something Went Wrong, Please Try Again')
            } else {
                res.send('Password Changed Successfully')
            }

        }
        
    } catch (e) {
        res.status(400).send(e)
    }

})

router.post('/user/editprofile', getAuth.auth, async (req, res) => {    
         
    try {

        req.user.name = req.body.username
        await req.user.save()

        if (!req.user) {
            res.send('Something Went Wrong, Please Try Again')
        } else {
            res.send('Profile Updated Successfully')
        }

    } catch (e) {
        res.status(400).send(e)
    }

})

router.post('/user/couponupdate', getAuth.auth, async (req, res) => {    
         
    try {

        const targetCoupon = await Price.findById(req.body.pointid)

        const couponData = new Coupons({
            name: targetCoupon.name,
            points: targetCoupon.point,
            couponid: targetCoupon.id,
            owner: req.user._id
        })
        await couponData.save()

        updateUserPoints = (req.user.points - targetCoupon.point)
        req.user.points = updateUserPoints
        await req.user.save()

        if (!req.user) {
            res.send('Something Went Wrong, Please Try Again')
        } else {
            res.send('Coupon Claimed Successfully')
        }
        
    } catch (e) {
        res.send('Something Went Wrong, Please Try Again')
    }

})

router.get('/user/profile', getAuth.auth, async (req, res) => {

    const getsiteurl = req.protocol + '://' + req.get('host')
    const totalPoint = req.user.points

    const username = req.user.name
    const email = req.user.email
    const profileName = req.user.name.charAt(0).toUpperCase()

    res.render('profile', {
        username: username,
        profilename: profileName,
        email: email,
        title: 'My Account',
        menu: 'profile',
        layout: 'profile',
        submenu: 'profile',
        points: totalPoint,
        siteurl: getsiteurl,
    })
 
})

router.get('/user/edit-profile', getAuth.auth, async (req, res) => {

    const getsiteurl = req.protocol + '://' + req.get('host')
    const totalPoint = req.user.points

    const username = req.user.name
    const email = req.user.email
    const profileName = req.user.name.charAt(0).toUpperCase()

    res.render('edit-profile', {
        username: username,
        profilename: profileName,
        email: email,
        title: 'Edit Profile',
        menu: 'profile',
        submenu: 'editprofile',
        layout: 'edit-profile',
        points: totalPoint,
        siteurl: getsiteurl,
    })
 
})

router.get('/user/change-password', getAuth.auth, async (req, res) => {

    const getsiteurl = req.protocol + '://' + req.get('host')
    const totalPoint = req.user.points

    const username = req.user.name
    const email = req.user.email
    const profileName = req.user.name.charAt(0).toUpperCase()
 
     res.render('change-password', {
        username: username,
        profilename: profileName,
        email: email,
        title: 'Change Password',
        menu: 'profile',
        submenu: 'changepassword',
        layout: 'change-password',
        points: totalPoint,
        siteurl: getsiteurl,
     })
  
})

router.get('/user/receipt-history', getAuth.auth, async (req, res) => {

    const getsiteurl = req.protocol + '://' + req.get('host')
    const pointsHistory = await Points.find({ owner: req.user._id}, null, {sort: {_id: -1}})
    const totalPoint = req.user.points
   
    const username = req.user.name
    const email = req.user.email
    const profileName = req.user.name.charAt(0).toUpperCase()
 
    res.render('receipt-history', {
        username: username,
        profilename: profileName,
        email: email,
        pointshistory: pointsHistory,
        points: totalPoint,
        title: 'Receipt History',
        menu: 'profile',
        submenu: 'receipthistory',
        layout: 'receipt-history',
        siteurl: getsiteurl,
    })
  
})

router.get('/user/coupon-history', getAuth.auth, async (req, res) => {

    const getsiteurl = req.protocol + '://' + req.get('host')
    const couponHistory = await Coupons.find({ owner: req.user._id}, null, {sort: {_id: -1}})
    const totalPoint = req.user.points
   
    const username = req.user.name
    const email = req.user.email
    const profileName = req.user.name.charAt(0).toUpperCase()
 
    res.render('coupon-history', {
        username: username,
        profilename: profileName,
        email: email,
        couponhistory: couponHistory,
        points: totalPoint,
        title: 'Coupon History',
        menu: 'profile',
        submenu: 'couponhistory',
        layout: 'coupon-history',
        siteurl: getsiteurl,
    })
  
})

router.get('/user/uploadreceipt', getAuth.auth, async (req, res) => {

    const getsiteurl = req.protocol + '://' + req.get('host')
    const totalPoint = req.user.points

    const username = req.user.name
    const profileName = req.user.name.charAt(0).toUpperCase()

    res.render('uploadreceipt', {
        username: username,
        profilename: profileName,
        title: 'Upload Receipt',
        menu: 'profile',
        submenu: 'uploadreceipt',
        layout: 'uploadreceipt',
        points: totalPoint,
        siteurl: getsiteurl,
    })
})

// var upload = multer({ dest: "upload" })
// If you do not want to use diskStorage then uncomment it
    
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
  
        // Uploads is the public/uploads
        cb(null, "public/uploads")
    },
    filename: async function (req, file, cb) {

        const pointsHistory = await Points.find({ owner: req.user._id})
        var totalPoint = 0;
        pointsHistory.forEach(function(getPoint) {
            totalPoint += getPoint.points
        })

        var imgName = file.originalname.split(".");
        var imgFullName = imgName[0] + "-" + Date.now()+".jpg"
        cb(null, imgFullName)

        const updateuserpoints = 35

        req.user.points = totalPoint+updateuserpoints;
        await req.user.save()

        const pointsData = new Points({
            reciept: imgFullName,
            points: updateuserpoints,
            ocr_status: true,
            owner: req.user._id
        })
    
        await pointsData.save()

    }
})
       
// Define the maximum size for uploading
// picture i.e. 1 MB. it is optional
const maxSize = 1 * 1000 * 1000;
    
var upload = multer({ 
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function (req, file, cb){
    
        // Set the filetypes, it is optional
        var filetypes = /jpeg|jpg|png/;
        var mimetype = filetypes.test(file.mimetype);
  
        var extname = filetypes.test(path.extname(
                    file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
      
        cb("Error: File upload only supports the "+ "following filetypes - " + filetypes);
    } 
  
// fileupload is the name of file attribute
}).single("fileupload"); 

router.post("/uploadProfilePicture", getAuth.auth, async (req, res, next) => {
        
    // Error MiddleWare for multer file upload, so if any
    // error occurs, the image would not be uploaded!
    upload(req,res,function(err) {
  
        if(err) {
            // ERROR occured (here it can be occured due
            // to uploading image of size greater than
            // 1MB or uploading different file type)
            if(err.message){
                res.send(err.message)
            } else {
                res.send(err)
            }
        } else {
            // SUCCESS, image successfully uploaded
            res.send("Success, Receipt uploaded!")
        }
    })
})

router.get('/user/logout', getAuth.auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token === req.token
        })
        await req.user.save()

        res.redirect('/');
    } catch (e) {
        res.status(500).send()
    }
})

/*
router.get('/users/:id',  async (req, res) => {

    const _id = req.params.id

    try {
        const user = await User.findById(_id)

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/signup', async (req, res) => {

    const getPassword = await bcrypt.hash('1234567', 8)

    const user = new User({
        name: '   athil  ',
        email: 'athil1@dedoit.com   ',
        password: getPassword,
        role: 'admin'
    })

    user.save().then((doc) => res.status(201).send(doc));

})

router.get('/set', async (req, res) => {

    const price = new Price({
        name: 'Platinum',
        point: 20,
        status: true
    })

    price.save().then((doc) => res.status(201).send(doc));

})

router.get('/users/me', getAuth.auth, async (req, res) => {
    try {
        ///const user = await User.findByIdAndDelete(req.user._id)

        //if (!user) {
           // return res.status(404).send()
        //}
        await req.user.remove()
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

*/


module.exports = router