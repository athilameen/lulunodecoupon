var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ameen.dedoit@gmail.com',
    //pass: 'dedoame2n@Dedo!t',
    pass: 'rcssxzrjnroxdmdb'
  }
});

var mailOptions = {
  from: 'athil@dedoit.com',
  to: 'athil@dedoit.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});