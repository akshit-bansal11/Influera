const express = require("express");
const fileUploader = require("express-fileupload");
const mysql2 = require("mysql2");
const nodemailer = require("nodemailer");
const cloudinary = require("cloudinary").v2;

const app = express();
const port = 2004;

app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(fileUploader());

cloudinary.config({
    cloud_name: 'dugsystpq',
    api_key: '522263183434765',
    api_secret: 't3W9EPPN8HztoHpbf7qYznYGpTM'
});

const dbConfig = "mysql://avnadmin:AVNS_os7vBHEJWtggW-K3zUD@mysql-2d75a1d9-influera.e.aivencloud.com:19893/defaultdb";
const mysql = mysql2.createConnection(dbConfig);

mysql.connect(err => {
    if (err) {
        console.error(`Database connection error: ${err.message}`);
    } else {
        console.log("Connected to database successfully.");
    }
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    port: 465,
    auth: {
        user: 'singlavanshpc@gmail.com',
        pass: 'hsnu pexg ddaa puds',
    },
});

app.get("/", (req, resp) => {
    resp.sendFile(__dirname + "/public/index.html");
});

app.get("/signup-details", (req, resp) => {
    const { txtEmail, txtPwd, utype, status } = req.query;
    mysql.query("INSERT INTO users VALUES(?,?,?,?)", [txtEmail, txtPwd, utype, status], err => {
        if (err) {
            resp.send(err.message);
        } else {
            resp.send("Sign Up Successful, You can now Log In");
        }
    });
});

app.get("/check-login-details", (req, resp) => {
    const { txtEmail, txtPwd } = req.query;
    mysql.query("SELECT * FROM users WHERE email=? AND pwd=?", [txtEmail, txtPwd], (err, resultJsonAry) => {
        if (err) {
            resp.send(err.message);
        } else {
            resp.send(resultJsonAry);
        }
    });
});

app.post("/influencer-save-details", async (req, resp) => {
    let fileName = "/Assets/Illustrations/60111.jpg";
    if (req.files) {
        const filePath = __dirname + "/public/uploads/" + req.files.ppic.name;
        req.files.ppic.mv(filePath);
        const result = await cloudinary.uploader.upload(filePath);
        fileName = result.url;
    }

    const txtDOB = req.body.txtDob.split("T")[0];
    const query = "INSERT INTO influencer VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)";
    const params = [
        req.body.txtEmail, fileName, req.body.txtName, req.body.txtGender,
        txtDOB, req.body.txtAdd, req.body.txtState, req.body.txtCity,
        req.body.txtContact, req.body.txtField.toString(), req.body.txtInsta,
        req.body.txtYt, req.body.txtOther
    ];

    mysql.query(query, params, err => {
        if (err) {
            resp.send(err.message);
        } else {
            resp.send(`<script>alert('Profile Saved');window.location.href='/Influencer/influencerDashboard.html';</script>`);
        }
    });
});

app.post("/influencer-update-details", async (req, resp) => {
    let fileName = "";
    if (req.files) {
        const filePath = __dirname + "/public/uploads/" + req.files.ppic.name;
        req.files.ppic.mv(filePath);
        const result = await cloudinary.uploader.upload(filePath);
        fileName = result.url;
    }

    if (!fileName) {
        mysql.query("SELECT picpath FROM influencer WHERE email=?", [req.body.txtEmail], (err, result) => {
            if (err || !result.length) {
                resp.send("Error retrieving existing profile picture.");
                return;
            }
            fileName = result[0].picpath || "/Assets/Illustrations/60111.jpg";
            updateProfile(fileName);
        });
    } else {
        updateProfile(fileName);
    }

    function updateProfile(fileName) {
        const txtDOB = req.body.txtDob.split("T")[0];
        const query = "UPDATE influencer SET picpath=?, iname=?, gender=?, dob=?, address=?, state=?, city=?, contact=?, field=?, insta=?, yt=?, other=? WHERE email=?";
        const params = [
            fileName, req.body.txtName, req.body.txtGender, txtDOB, req.body.txtAdd,
            req.body.txtState, req.body.txtCity, req.body.txtContact, req.body.txtField.toString(),
            req.body.txtInsta, req.body.txtYt, req.body.txtOther, req.body.txtEmail
        ];

        mysql.query(query, params, (err, result) => {
            if (err || result.affectedRows < 1) {
                resp.send("Invalid Email ID");
            } else {
                resp.send(`<script>alert('Changes Saved');window.location.href='/Influencer/influencerDashboard.html';</script>`);
            }
        });
    }
});

app.get("/find-user-details", (req, resp) => {
    const { txtEmail } = req.query;
    mysql.query("SELECT * FROM influencer WHERE email=?", [txtEmail], (err, resultJsonAry) => {
        if (err) {
            resp.send(err.message);
        } else {
            resp.send(resultJsonAry);
        }
    });
});

app.get("/post-event-details", (req, resp) => {
    const { txtEmail, txtEvent, txtDate, txtTime, txtVenue } = req.query;
    const query = "INSERT INTO events VALUES(NULL,?,?,?,?,?)";
    const params = [txtEmail, txtEvent, txtDate, txtTime, txtVenue];

    mysql.query(query, params, err => {
        if (err) {
            resp.send(err.message);
        } else {
            resp.send("Your Record is Successfully Saved");
        }
    });
});

app.get("/fetch-future-events", (req, resp) => {
    const { email } = req.query;
    const query = "SELECT * FROM events WHERE email = ? ORDER BY date ASC";

    mysql.query(query, [email], (err, resultJsonAry) => {
        if (err) {
            resp.status(500).send(err.message);
        } else {
            resp.send(resultJsonAry);
        }
    });
});

app.get("/delete-future-events", (req, resp) => {
    const { email } = req.query;
    const query = "DELETE FROM events WHERE email = ?";

    mysql.query(query, [email], (err, result) => {
        if (err) {
            resp.status(500).send(err.message);
        } else if (result.affectedRows > 0) {
            resp.send("Event deleted successfully");
        } else {
            resp.status(404).send("Event not found");
        }
    });
});

app.get("/update-login-details-settings", (req, resp) => {
    const { txtEmail, txtoldPwd, txtnewPwd, txtrepPwd } = req.query;

    if (txtnewPwd === txtrepPwd) {
        mysql.query("UPDATE users SET pwd=? WHERE email=? AND pwd=?", [txtnewPwd, txtEmail, txtoldPwd], (err, result) => {
            if (err || result.affectedRows < 1) {
                resp.send("Invalid Email ID");
            } else {
                resp.send("Updated Successfully");
            }
        });
    } else {
        resp.send("Passwords do not match.");
    }
});

app.post("/login-forget-password", (req, resp) => {
    const { txtEmail_login, txtForget_login } = req.body;

    mysql.query("SELECT pwd FROM users WHERE email=?", [txtEmail_login], (err, resultJsonAry) => {
        if (err || !resultJsonAry.length) {
            resp.send(err ? err.message : "Email not found");
            return;
        }

        const txtPwd_forget = resultJsonAry[0].pwd;

        const mailOptions = {
            from: 'singlavanshpc@gmail.com',
            to: txtForget_login,
            subject: 'Sending Email using Node.js',
            text: txtPwd_forget
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                resp.send(error.message);
            } else {
                resp.redirect("result2.html");
            }
        });
    });
});

app.get("/fetch-all", (req, resp) => {
    mysql.query("SELECT * FROM users", (err, resultJsonAry) => {
        if (err) {
            resp.send(err.message);
        } else {
            resp.send(resultJsonAry);
        }
    });
});

app.get("/del-one", (req, resp) => {
    mysql.query("DELETE FROM users WHERE email=?", [req.query.email], (err) => {
        if (err) {
            resp.send(err.message);
        } else {
            resp.send("Deleted");
        }
    });
});

app.get("/block-one", (req, resp) => {
    mysql.query("UPDATE users SET status=0 WHERE email=?", [req.query.email], (err) => {
        if (err) {
            resp.send(err.message);
        } else {
            resp.send("Blocked");
        }
    });
});

app.get("/resume-one", (req, resp) => {
    mysql.query("UPDATE users SET status=1 WHERE email=?", [req.query.email], (err) => {
        if (err) {
            resp.send(err.message);
        } else {
            resp.send("Resumed");
        }
    });
});

app.get("/fetch-all-influencers", (req, resp) => {
    mysql.query("SELECT * FROM influencer", (err, resultJsonAry) => {
        if (err) {
            resp.send(err.message);
        } else {
            resp.send(resultJsonAry);
        }
    });
});

app.get("/fetch-all-fields", (req, resp) => {
    mysql.query("SELECT DISTINCT field FROM influencer", (err, resultJsonAry) => {
        if (err) {
            resp.send(err.message);
        } else {
            resp.send(resultJsonAry);
        }
    });
});

app.get("/fetch-some-field", (req, resp) => {
    const { field } = req.query;
    mysql.query("SELECT DISTINCT city FROM influencer WHERE field=?", [field], (err, resultJsonAry) => {
        if (err) {
            resp.send(err.message);
        } else {
            resp.send(resultJsonAry);
        }
    });
});

app.get("/fetch-all-details-selected-infl", (req, resp) => {
    const { city } = req.query;
    mysql.query("SELECT * FROM influencer WHERE city=?", [city], (err, resultJsonAry) => {
        if (err) {
            resp.send(err.message);
        } else {
            resp.send(resultJsonAry);
        }
    });
});

app.get("/fetch-some-name", (req, resp) => {
    const { name } = req.query;
    mysql.query("SELECT * FROM influencer WHERE iname LIKE ?", [`%${name}%`], (err, resultJsonAry) => {
        if (err) {
            resp.send(err.message);
        } else {
            resp.send(resultJsonAry);
        }
    });
});

app.post("/investor-save-details", (req, resp) => {
    console.log("jello")
    const { txtEmail, txtName, txtMob, txtType, txtState, txtCity, txtGender } = req.body;
    const query = "INSERT INTO investor VALUES(?,?,?,?,?,?,?)";

    mysql.query(query, [txtEmail, txtName, txtMob, txtType, txtState, txtCity, txtGender], err => {
        if (err) {
            resp.send(err.message);
        } else {
            resp.redirect("/Result/result.html");
        }
    });
});

app.post("/investor-update-details", (req, resp) => {
    const { txtEmail, txtName, txtMob, txtType, txtState, txtCity, txtGender } = req.body;
    const query = "UPDATE investor SET iname=?, contact=?, type=?, state=?, city=?, gender=? WHERE email=?";

    mysql.query(query, [txtName, txtMob, txtType, txtState, txtCity, txtGender, txtEmail], (err, result) => {
        if (err || result.affectedRows < 1) {
            resp.send("Invalid Email ID");
        } else {
            resp.redirect("result.html");
        }
    });
});

app.get("/find-user-details-client", (req, resp) => {
    const { txtEmail } = req.query;
    mysql.query("SELECT * FROM investor WHERE email=?", [txtEmail], (err, resultJsonAry) => {
        if (err) {
            resp.send(err.message);
        } else {
            resp.send(resultJsonAry);
        }
    });
});

app.get("/send-email-influencer", (req, resp) => {
    const { cltemail, email } = req.query;

    const mailOptions = {
        from: 'singlavanshpc@gmail.com',
        to: email,
        subject: 'NEW BOOKING',
        text: `CLIENT INFORMATION: ${cltemail}`
    };

    transporter.sendMail(mailOptions, (err) => {
        if (err) {
            resp.send(err.message);
        } else {
            resp.send("Email Sent Successfully...");
        }
    });
});
