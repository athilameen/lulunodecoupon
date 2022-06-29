(function($,W,D){
    
    var JQUERY4U = {};
          
    JQUERY4U.UTIL = {
           
      setupFormValidation: function(){

        // Change Password validation
        $("#changePassword").validate({
          
          rules: {
            currentPassword: "required",
            newPassword : {
              required: true,
              pwcheck: true,
              minlength : 6,
              maxlength : 25,
            },
            confirmNewPassword : {
              required: true,
              equalTo : "#newPassword"
            }
          },       
              
          messages: {
            currentPassword: "Enter current password",
            newPassword : {
              required: "Enter new password",
              pwcheck: "Use minimum 6 characters, and at least one letter and one number",
              minlength: "Use minimum 6 characters, and at least one letter and one number",
              maxlength: "Don't enter more than 25 characters",
            },
            confirmNewPassword : {
              required: "Repeat new password",
              equalTo: "The passwords do not match",
            },
          },         
                   
          submitHandler: function(form) {

            var currentPassword = $('#currentPassword').val();
            var confirmNewPassword = $('#confirmNewPassword').val();

            $.ajax({
                url: '/user/changepassword',
                method: 'POST',
                cache: false,
                data: {
                    oldpassword: currentPassword,
                    newpassword: confirmNewPassword
                },
                success: function(data){
                  $('#message').text(data);
                  $('#changePassword')[0].reset();
                }, 
                error: function(xhr) {
                  console.log("Error occured. please try again");
                }
            });

            return false;
            
          }

        });
        // Change Password validation

        $.validator.addMethod("pwcheck", function(value) {
          return /^[A-Za-z0-9\d=!\-@._*]*$/.test(value) // consists of only these
            && /[a-z]/.test(value) // has a lowercase letter
            && /\d/.test(value) // has a digit
        });

        // editProfile validation
        $("#editProfile").validate({
          
          rules: {
            username: "required"
          },       
              
          messages: {
            username: "Enter a username",
          },         
                   
          submitHandler: function(form) {

            var username = $('#username').val();

            $.ajax({
                url: '/user/editprofile',
                method: 'POST',
                cache: false,
                data: {
                  username: username
                },
                success: function(data){
                  $('#message').text(data);
                }, 
                error: function(xhr) {
                  console.log("Error occured. please try again");
                }
            });

            return false;
            
          }

        });
        // editProfile validation

        // Upload Form validation
        $("#uploadForm").validate({
          
          rules: {
            fileupload: "required"
          },       
              
          messages: {
            fileupload: "Upload a Reciept",
          },         
                   
          submitHandler: function(form) {

            var form = $('#uploadForm')[0];
            var data = new FormData(form);

            $.ajax({
              url: '/uploadProfilePicture',
              method: 'POST',
              enctype: 'multipart/form-data',
              processData: false, // Important!
              contentType: false,
              cache: false,
              data: data,
              success: function(data){
                $('#message').text(data);
                $('#uploadForm')[0].reset();
              }
            });
          }
        });
        // Upload Form validation

        // Register validation
        $("#registerForm").validate({
          
          rules: {
            username: "required",
            email : {
              required: true,
              email: true
            },
            password : {
              required: true,
              pwcheck: true,
              minlength : 6,
              maxlength : 25,
            },
          },       
              
          messages: {
            username: "Enter a Username",
            email : {
              required: "Enter Email address",
              email: "Email address is not valid"
            },
            password : {
              required: "Enter new password",
              pwcheck: "Use minimum 6 characters, and at least one letter and one number",
              minlength: "Use minimum 6 characters, and at least one letter and one number",
              maxlength: "Don't enter more than 25 characters",
            }
          },         
                   
          submitHandler: function(form) {
            //form.submit();

            var getUsername = $('#username').val();
            var getEmail = $('#email').val();
            var getPassword = $('#password').val();

            $.ajax({
              url: '/user/register',
              method: 'POST',
              cache: false,
              data: {
                username: getUsername,
                email: getEmail,
                password: getPassword
              },
              success: function(data){
                if(data == "success"){
                  window.location.href = '/user/login?register=true';
                } else {
                  $('#message').text(data);
                }
                
              }, 
              error: function(xhr) {
                console.log("Error occured. please try again");
              }
            });

            return false;

          }

        });
        // Register validation

        // Login validation
        $("#loginForm").validate({
          
          rules: {
            email : {
              required: true,
              email: true
            },
            password : {
              required: true,
              pwcheck: true,
              minlength : 6,
              maxlength : 25,
            },
          },       
              
          messages: {
            email: "Please give a valid email address",
            password: "Please give a valid password"
          },         
                   
          submitHandler: function(form) {

            var getEmail = $('#email').val();
            var getPassword = $('#password').val();

            $.ajax({
              url: '/users/login',
              method: 'POST',
              cache: false,
              data: {
                email: getEmail,
                password: getPassword
              },
              beforeSend: function() {
                $('#inmessage').remove();
              },
              success: function(data){
                if(data == "success"){
                  window.location.href = '/user/uploadreceipt';
                } else {
                  $('#message').text(data);
                }
                
              }, 
              error: function(xhr) {
                console.log("Error occured. please try again");
              }
            });

            return false;

          }

        });
        // Login validation

        // Forgot Password  validation
        $("#forgotPassForm").validate({
          
          rules: {
            email : {
              required: true,
              email: true
            },
          },       
              
          messages: {
            email: "Please give a valid email address",
          },         
                   
          submitHandler: function(form) {

            var getEmail = $('#email').val();

            $.ajax({
              url: '/users/forgot-password',
              method: 'POST',
              cache: false,
              data: {
                email: getEmail,
              },
              success: function(data){
                if(data == "success"){
                  $('#message').text("Password sent on mail. Go to login");
                } else {
                  $('#message').text(data);
                  $('#forgotPassForm')[0].reset();
                }
              }, 
              error: function(xhr) {
                console.log("Error occured. please try again");
              }
            });

            return false;

          }

        });
        // Forgot Password validation

        // Change Password validation
        $("#resetPassword").validate({
          
          rules: {
            newPassword : {
              required: true,
              pwcheck: true,
              minlength : 6,
              maxlength : 25,
            },
            confirmNewPassword : {
              required: true,
              equalTo : "#newPassword"
            }
          },       
              
          messages: {
            newPassword : {
              required: "Enter new password",
              pwcheck: "Use minimum 6 characters, and at least one letter and one number",
              minlength: "Use minimum 6 characters, and at least one letter and one number",
              maxlength: "Don't enter more than 25 characters",
            },
            confirmNewPassword : {
              required: "Repeat new password",
              equalTo: "The passwords do not match",
            },
          },         
                   
          submitHandler: function(form) {

            var confirmNewPassword = $('#confirmNewPassword').val();
            var userid = $('#userid').val();

            $.ajax({
                url: '/user/resetpassword',
                method: 'POST',
                cache: false,
                data: {
                  userid: userid,
                  newpassword: confirmNewPassword
                },
                success: function(data){
                  $('#resetPassword')[0].reset();
                  alert(data);
                  window.location.href = '/user/login';
                }, 
                error: function(xhr) {
                  console.log("Error occured. please try again");
                }
            });

            return false;
            
          }

        });
        // Change Password validation


      }
    }
          
    //when the dom has loaded setup form validation rules
    $(D).ready(function($) {
      JQUERY4U.UTIL.setupFormValidation();
    });

})(jQuery, window, document); 

  $('#coupenBox .buycoupen > a').click( function(){

    var pointId = $(this).prev('input').val();
    var pointIdName = $(this).attr('id');
    var buycoupenBox = $(this).parent('.buycoupen');

    $.ajax({
      url: '/user/couponupdate',
      method: 'POST',
      cache: false,
      data: {
        pointid: pointId,
      },
      success: function(data){
        //$('#message').text(pointIdName + " " + data);
        buycoupenBox.removeClass('buycoupen').addClass('purchased');
        alert(pointIdName + " " + data);
        window.location.reload();
      }, 
      error: function(xhr) {
        console.log("Error occured. please try again");
      }
    });

})