var express = require("express");
var fileuploader=require("express-fileupload");
let app=express();
var mysql2=require("mysql2");
var nodemailer = require('nodemailer');
var cloudinary = require('cloudinary').v2;

app.listen(2004,function()
{
    console.log("Server Started ....... at this host");
})

app.use(express.static("public"));
app.use(express.urlencoded("true"));
app.use(fileuploader());

cloudinary.config({ 
    cloud_name: 'dugsystpq', 
    api_key: '522263183434765', 
    api_secret: 't3W9EPPN8HztoHpbf7qYznYGpTM' 
});

let config = "mysql://avnadmin:AVNS_os7vBHEJWtggW-K3zUD@mysql-2d75a1d9-influera.e.aivencloud.com:19893/defaultdb";

var mysql = mysql2.createConnection(config);
mysql.connect(function(err)
{
    if(err==null)
        console.log("Connected to Database Successfully");
    else
    console.log(err.message+"  ########");
});

var transporter = nodemailer.createTransport({
    service: 'gmail',
    secure : true,
    port : 465,
    auth: {
        user: 'singlavanshpc@gmail.com',
        pass: 'hsnu pexg ddaa puds',
    },
});

app.get("/",function(req,resp)
{
    let path = __dirname+"/public/index.html";
    resp.sendFile(path);
})

// !index

app.get("/signup-details",function(req,resp)
{
    let txtEmail = req.query.txtEmail;
    let txtPwd = req.query.txtPwd;
    let utype=req.query.utype;
    let status=req.query.status;
    mysql.query("insert into users values(?,?,?,?)",[txtEmail,txtPwd,utype,status],function(err)
    {
        if(err==null)
            resp.send("Sign Up Successful, You can now Log In");
        else
            resp.send(err.message);
    })
})

app.get("/check-login-details",function(req,resp)
{
    let txtEmail= req.query.txtEmail;
    let txtPwd = req.query.txtPwd;
    console.log(txtEmail);
    console.log(txtPwd);
    mysql.query("select * from users where email=? and pwd=?",[txtEmail,txtPwd],function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;
            }
        console.log(resultJsonAry);
        resp.send(resultJsonAry); 
    })

})

// !influencerProfile
// app.post("/iprofile-save-details",async function(req,resp)
// {
//     let fileName="";
//     if(req.files!=null)
//     {
//         fileName=req.files.ppic.name;
//         let path=__dirname+"/public/uploads/"+fileName;
//         req.files.ppic.mv(path);
//         await cloudinary.uploader.upload(path)
//         .then(function(result) {
//             fileName = result.url;
//         })
//     }
//     else
//         fileName="/Assets/Illustrations/60111.jpg";

//     var txtDOB = (req.body.txtDob).split("T")[0];

//     mysql.query("insert into iprofile values(?,?,?,?,?,?,?,?,?,?,?,?,?)",[req.body.txtEmail,fileName,req.body.txtName,req.body.txtGender,txtDOB,req.body.txtAdd,req.body.txtState,req.body.txtCity,req.body.txtContact,req.body.txtField.toString(),req.body.txtInsta,req.body.txtYt,req.body.txtOther],function(err)
//     {
//         if(err==null)
//             resp.redirect("/Result/result.html");
//         else
//             resp.send(err.message);
//     })
// })

app.post("/iprofile-save-details", async function(req, resp) {
    let fileName = "";
    if (req.files != null) {
        fileName = req.files.ppic.name;
        let path = __dirname + "/public/uploads/" + fileName;
        req.files.ppic.mv(path);
        await cloudinary.uploader.upload(path)
        .then(function(result) {
            fileName = result.url;
        });
    } else {
        fileName = "/Assets/Illustrations/60111.jpg";
    }

    var txtDOB = (req.body.txtDob).split("T")[0];

    mysql.query("insert into iprofile values(?,?,?,?,?,?,?,?,?,?,?,?,?)", 
        [req.body.txtEmail, fileName, req.body.txtName, req.body.txtGender, txtDOB, req.body.txtAdd, req.body.txtState, req.body.txtCity, req.body.txtContact, req.body.txtField.toString(), req.body.txtInsta, req.body.txtYt, req.body.txtOther], 
        function(err) {
            if (err == null) {
                resp.send(`<script>
                            alert('Profile Saved');
                            window.location.href='/Influencer/influencerDashboard.html';
                            </script>`);
            } else {
                resp.send(err.message);
            }
        }
    );
});


// app.post("/iprofile-update-details", async function(req, resp) {
//     let fileName = "";
//     if (req.files != null) {
//         fileName = req.files.ppic.name;
//         let path = __dirname + "/public/uploads/" + fileName;
//         req.files.ppic.mv(path);
//         await cloudinary.uploader.upload(path)
//         .then(function(result) {
//             fileName = result.url;
//         });
//     }

//     if (fileName === "") {
//         // Preserve existing picture path if no new file is uploaded
//         mysql.query("SELECT picpath FROM iprofile WHERE email=?", [req.body.txtEmail], function(err, result) {
//             if (err == null && result.length > 0) {
//                 fileName = result[0].picpath || "/Assets/Illustrations/60111.jpg";

//                 // Proceed with the update after ensuring the correct picpath is used
//                 var txtDOB = (req.body.txtDob).split("T")[0];
//                 mysql.query("update iprofile set picpath=?, iname=?, gender=?, dob=?, address=?, state=?, city=?, contact=?, field=?, insta=?, yt=?, other=? where email=?",
//                 [fileName, req.body.txtName, req.body.txtGender, txtDOB, req.body.txtAdd, req.body.txtState, req.body.txtCity, req.body.txtContact, req.body.txtField.toString(), req.body.txtInsta, req.body.txtYt, req.body.txtOther, req.body.txtEmail],
//                 function(err, result) {
//                     if (err == null) {
//                         if (result.affectedRows >= 1) {
//                             console.log("Profile updated successfully with image path: ", fileName);
//                             resp.redirect("/Result/result.html");
//                         } else {
//                             resp.send("Invalid Email ID");
//                         }
//                     } else {
//                         console.error("Error during update: ", err.message);
//                         resp.send(err.message);
//                     }
//                 });
//             } else {
//                 resp.send("Error retrieving existing profile picture.");
//             }
//         });
//     } else {
//         // If fileName is set (new image uploaded), proceed with update directly
//         var txtDOB = (req.body.txtDob).split("T")[0];
//         mysql.query("update iprofile set picpath=?, iname=?, gender=?, dob=?, address=?, state=?, city=?, contact=?, field=?, insta=?, yt=?, other=? where email=?",
//         [fileName, req.body.txtName, req.body.txtGender, txtDOB, req.body.txtAdd, req.body.txtState, req.body.txtCity, req.body.txtContact, req.body.txtField.toString(), req.body.txtInsta, req.body.txtYt, req.body.txtOther, req.body.txtEmail],
//         function(err, result) {
//             if (err == null) {
//                 if (result.affectedRows >= 1) {
//                     console.log("Profile updated successfully with image path: ", fileName);
//                     resp.redirect("/Result/result.html");
//                 } else {
//                     resp.send("Invalid Email ID");
//                 }
//             } else {
//                 console.error("Error during update: ", err.message);
//                 resp.send(err.message);
//             }
//         });
//     }
// });

app.post("/iprofile-update-details", async function(req, resp) {
    let fileName = "";
    if (req.files != null) {
        fileName = req.files.ppic.name;
        let path = __dirname + "/public/uploads/" + fileName;
        req.files.ppic.mv(path);
        await cloudinary.uploader.upload(path)
        .then(function(result) {
            fileName = result.url;
        });
    }

    if (fileName === "") {
        mysql.query("SELECT picpath FROM iprofile WHERE email=?", [req.body.txtEmail], function(err, result) {
            if (err == null && result.length > 0) {
                fileName = result[0].picpath || "/Assets/Illustrations/60111.jpg";
                var txtDOB = (req.body.txtDob).split("T")[0];
                mysql.query("update iprofile set picpath=?, iname=?, gender=?, dob=?, address=?, state=?, city=?, contact=?, field=?, insta=?, yt=?, other=? where email=?", 
                    [fileName, req.body.txtName, req.body.txtGender, txtDOB, req.body.txtAdd, req.body.txtState, req.body.txtCity, req.body.txtContact, req.body.txtField.toString(), req.body.txtInsta, req.body.txtYt, req.body.txtOther, req.body.txtEmail], 
                    function(err, result) {
                        if (err == null && result.affectedRows >= 1) {
                            resp.send(`<script>
                                        alert('Changes Saved');
                                        window.location.href='/Influencer/influencerDashboard.html';
                                        </script>`);
                        } else {
                            resp.send("Invalid Email ID");
                        }
                    }
                );
            } else {
                resp.send("Error retrieving existing profile picture.");
            }
        });
    } else {
        var txtDOB = (req.body.txtDob).split("T")[0];
        mysql.query("update iprofile set picpath=?, iname=?, gender=?, dob=?, address=?, state=?, city=?, contact=?, field=?, insta=?, yt=?, other=? where email=?", 
            [fileName, req.body.txtName, req.body.txtGender, txtDOB, req.body.txtAdd, req.body.txtState, req.body.txtCity, req.body.txtContact, req.body.txtField.toString(), req.body.txtInsta, req.body.txtYt, req.body.txtOther, req.body.txtEmail], 
            function(err, result) {
                if (err == null && result.affectedRows >= 1) {
                    resp.send(`<script>
                                alert('Changes Saved');
                                window.location.href='/Influencer/influencerDashboard.html';
                                </script>`);
                } else {
                    resp.send("Invalid Email ID");
                }
            }
        );
    }
});

app.get("/find-user-details",function(req,resp)
{
    let email= req.query.txtEmail;
    mysql.query("select * from iprofile where email=?",[email],function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
        console.log(resultJsonAry);
            resp.send(resultJsonAry);//sending array of json object 0-1
    })

})

app.get("/post-event-details", function(req, resp) {
    let txtEMAIL = req.query.txtEmail;
    let txtEVENT = req.query.txtEvent;
    let txtDATE = req.query.txtDate;
    let txtTIME = req.query.txtTime;
    let txtVENUE = req.query.txtVenue;
    mysql.query("insert into events values(null,?,?,?,?,?)", [txtEMAIL, txtEVENT, txtDATE, txtTIME, txtVENUE], function(err) {
        if (err == null) {
            console.log(txtEMAIL, txtEVENT, txtDATE, txtTIME, txtVENUE); 
            resp.send("Your Record is Successfully Saved");
        } else {
            resp.send(err.message);
        }
    })
})

// !eventsManager

app.get("/fetch-future-events", function(req, resp) {
    let userEmail = req.query.email;
    let query = "SELECT * FROM events WHERE email = ? ORDER BY date ASC";
    
    mysql.query(query, [userEmail], function(err, resultJsonAry) {
        if (err) {
            resp.status(500).send(err.message);
            return;
        }
        resp.send(resultJsonAry);
    });
});

app.get("/delete-future-events", function(req, resp) {
    let userEmail = req.query.email;

    let query = "DELETE FROM events WHERE email = ?";

    mysql.query(query, [userEmail], function(err, result) {
        if (err) {
            console.error("Delete error:", err);
            resp.status(500).send(err.message);
            return;
        }
        console.log("Delete result:", result);
        if (result.affectedRows > 0) {
            resp.send("Event deleted successfully");
        } else {
            resp.status(404).send("Event not found");
        }
    });
});

app.get("/update-login-details-settings",function(req,resp)
{
    let txtEmail = req.query.txtEmail;
    let txtPWD = req.query.txtPwd;
    let txtnewPwd = req.query.txtnewPwd;
    let txtrepPwd = req.query.txtrepPwd;
    if(txtnewPwd===txtrepPwd)
    {
        mysql.query("update users set pwd=? where email=? and pwd=?",[txtnewPwd,txtEmail,txtPWD],function(err,result)
        {
            if(err==null)//no error
            {
                if(result.affectedRows>=1) 
                    resp.send("Updated  Successfulllyyyy....");
                else
                    resp.send("Invalid Email ID");
            }
            else
                resp.send(err.message);
        })
    }
    else
    {
        resp.send("Invalid user Cridentials...");
    }
})

app.post("/login-forget-password",function(req,resp)
{
    let email=req.body.txtEmail_login;
    let txtPwd_forget="hello";
    mysql.query("select pwd from users where email=?",[email],function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;
            }
      //  console.log(resultJsonAry);
            // resp.send(resultJsonAry);
            txtPwd_forget = resultJsonAry[0].pwd;
            console.log(txtPwd_forget);
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                secure : true,
                port : 465,
                auth: {
                  user: 'singlavanshpc@gmail.com',
                  pass: 'hsnu pexg ddaa puds',
                },
              });
   
              console.log(txtPwd_forget)
              var mailOptions = {
                  from: 'singlavanshpc@gmail.com',
                  to: req.body.txtForget_login,
                  subject: 'Sending Email using Node.js',
                  
                  text: txtPwd_forget
                };
                transporter.sendMail(mailOptions, function(error, info){
                  if (error) {
                    console.log(error);
                  } else {
                    console.log('Email sent: ' + info.response);
                    resp.redirect("result2.html");
                  }
                });
    })
})
app.get("/fetch-all",function(req,resp)
{
    mysql.query("select * from users",function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
            console.log(resultJsonAry);
            resp.send(resultJsonAry);//sending array of json object 0-1
    })

})
app.get("/del-one",function(req,resp)
{
    mysql.query("delete from users where email=?",[req.query.email],function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
            resp.send("Deleted");
       
    })

})
app.get("/block-one",function(req,resp)
{
    let status = 0;
    mysql.query("update users set status=? where email=?",[status,req.query.email],function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
            resp.send("Blocked");
       
    })
})
app.get("/resume-one",function(req,resp)
{
    let status = 1;
    mysql.query("update users set status=? where email=?",[status,req.query.email],function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
            resp.send("Resumed");
       
    })
})
app.get("/fetch-all-influencers",function(req,resp)
{
    mysql.query("select * from iprofile",function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
          //  console.log(resultJsonAry);
            resp.send(resultJsonAry);//sending array of json object 0-1
    })

})
//()()()()()()()()()()()()()()()()()()()()()()()()()()()()()()()()()()()()()()()()()
app.get("/fetch-all-fields",function(req,resp)
{
    mysql.query("select distinct field from iprofile",function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
       resp.send(resultJsonAry);//sending array of json object 0-1
    })

})
app.get("/fetch-some-field",function(req,resp)
{
    let field=req.query.field;
    mysql.query("select city from iprofile where field=?",[field],function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
       resp.send(resultJsonAry);//sending array of json object 0-1
    })

})
app.get("/fetch-all-details-selected-infl",function(req,resp)
{
    let city=req.query.city;
    mysql.query("select * from iprofile where city=?",[city],function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
       resp.send(resultJsonAry);//sending array of json object 0-1
    })

})
app.get("/fetch-some-name",function(req,resp)
{
    let name=req.query.name;
    mysql.query("select * from iprofile where iname like ?",["%"+name+"%"],function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
       resp.send(resultJsonAry);//sending array of json object 0-1
    })

})

// *************************************************************************************************
app.post("/cprofile-save-details",function(req,resp)
{
   // console.log(req.body.txtEmail,req.body.txtName,req.body.txtMob,req.body.txtType.toString(),req.body.txtState.toString(),req.body.txtCity,req.body.txtGender);
    mysql.query("insert into cprofile values(?,?,?,?,?,?,?)",[req.body.txtEmail,req.body.txtName,req.body.txtMob,req.body.txtType,req.body.txtState,req.body.txtCity,req.body.txtGender],function(err)
    {
            if(err==null)
                
                resp.redirect("result.html");
                else
                    resp.send(err.message);
    })
})
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
app.post("/cprofile-update-details",function(req,resp)
{
    mysql.query("update cprofile set iname=? , contact=?, type=? ,state=? ,city=? ,gender=? where email=?",[req.body.txtName,req.body.txtMob,req.body.txtType,req.body.txtState,req.body.txtCity,req.body.txtGender,req.body.txtEmail],function(err,result)
    {
        if(err==null)//no error
        {
               if(result.affectedRows>=1) 
                resp.redirect("result.html");
                else
                    resp.send("Invalid Email ID");
        }
    else
        resp.send(err.message);
    })

})
//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&7&&&&&&&&&&&&&&&&&&&&&&&&&&&
app.get("/find-user-details-client",function(req,resp)
{
    let email= req.query.txtEmail;
   
    mysql.query("select * from cprofile where email=?",[email],function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
        console.log(resultJsonAry);
            resp.send(resultJsonAry);//sending array of json object 0-1
    })

})
app.get("/send-email-influencer",function(req,resp){

    let cltemail=req.query.cltemail;
    let email=req.query.email;
    console.log(email);
    console.log(cltemail);
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'singlavanshpc@gmail.com',
        pass: 'hsnu pexg ddaa puds'
      }
    });
    
    
    var mailOptions = {
      from: 'singlavanshpc@gmail.com',
      to: email,
      subject: 'NEW BOOKING ',
      text: 'CLIENT INFORMATION '+cltemail
    };
    
    transporter.sendMail(mailOptions, function(err, info){
      if(err!=null){
        resp.send(err.message);
      } else {
        resp.send("Email Send Successfully...");
      }
    });
    
    })