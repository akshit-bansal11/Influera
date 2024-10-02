$(document).ready(function() {
    console.log("Script Start");

    let isValidEmail1 = false;
    let isValidEmail2 = false;
    let isValidPassword = false;

    $("#txtEmail_signup").on("input", function() {
        toggleSignupButton();
        validateEmail($(this).val(), "#emailValidMessage", function(isValid) {
            isValidEmail1 = isValid;
        });
    });

    $("#txtEmail_login").on("input", function() {
        validateEmail($(this).val(), "#emailValidMessageLogin", function(isValid) {
            isValidEmail2 = isValid;
        });
    });

    $("#txtPwd_signup").on("input", function() {
        validatePassword($(this).val(), "#passwordValidMessage", function(isValid) {
            isValidPassword = isValid;
        });
        toggleSignupButton();
    });

    $("#txtPwd_signup, #utype").on("blur", toggleSignupButton);

    $("#txtForget_login").on("blur", function() {
        toggleButtonState($(this).val(), "#btnForget");
    });

    $("#btnSignup").on("click", function() {
        if (isValidEmail1 && isValidPassword) {
            submitForm("/signup-details", {
                txtEmail: $("#txtEmail_signup").val(),
                txtPwd: $("#txtPwd_signup").val(),
                utype: $("#utype").val(),
                status: 1
            });

            function submitForm(url, data) {
                $.ajax({ type: "get", url, data })
                    .done(function(resp) {
                        alert(resp);
                        $('#signupModal').modal('hide');
                        $('#loginModal').modal('show');
                    })
                    .fail(function(err) {
                        alert(err.statusText);
                    });
            }
        } else {
            alert("Please enter a valid email address and password.");
        }
    });

    $("#btnLogin").on("click", function() {
        if (isValidEmail2) {
            submitLoginForm();
        } else {
            alert("Please enter a valid email address.");
        }
    });

    function toggleSignupButton() {
        const isDisabled =  $("#txtEmail_signup").val() === "" ||
                            $("#txtPwd_signup").val() === "" ||
                            $("#utype").val() === "none" ||
                            !isValidEmail1 ||
                            !isValidPassword;
        $("#btnSignup").prop("disabled", isDisabled);
    }

    function toggleButtonState(value, buttonId) {
        $(buttonId).prop("disabled", value === "");
    }

    function validateEmail(email, messageSelector, callback) {
        const isValid = email.includes("@") && email.includes(".");
        $(messageSelector).text(isValid ? "" : "!!!Please enter a valid email address!!!");
        callback(isValid);
    }

    function validatePassword(password, messageSelector, callback) {
        const hasEightChars = password.length >= 8;
        const hasNumber = /\d/.test(password);
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);

        const isValid = hasEightChars && hasNumber && hasUpperCase && hasLowerCase;

        if (password === "") {
            $(messageSelector).html("");
        } else {
            $(messageSelector).html(`
                Password must Include at least:<br>
                <span style="margin-left: 20px;">${hasEightChars ? '&#10003;' : '&#46;'} 8 Characters</span><br>
                <span style="margin-left: 20px;">${hasNumber ? '&#10003;' : '&#46;'} 1 Number</span><br>
                <span style="margin-left: 20px;">${hasUpperCase ? '&#10003;' : '&#46;'} 1 Capital Letter</span><br>
                <span style="margin-left: 20px;">${hasLowerCase ? '&#10003;' : '&#46;'} 1 Small Letter</span>
            `);
        }
        callback(isValid);
    }

    function submitForm(url, data) {
        $.ajax({ type: "get", url, data })
            .done(function(resp) { alert(resp); })
            .fail(function(err) { alert(err.statusText); });
    }

    function submitLoginForm() {
        const data = {
            txtEmail: $("#txtEmail_login").val(),
            txtPwd: $("#txtPwd_login").val()
        };

        $.ajax({ type: "get", url: "/check-login-details", data })
            .done(function(jsonAry) {
                handleLoginResponse(jsonAry);
            })
            .fail(function(err) {
                alert(err.statusText);
            });
    }

    function handleLoginResponse(jsonAry) {
        if ($.isEmptyObject(jsonAry)) {
            alert("Invalid User Credentials");
        } else {
            if (jsonAry[0].status === 1) {
                const redirectUrl = jsonAry[0].utype === "Influencer" ? "/Influencer/influencerDashboard.html" : "/Investor/investorDashboard.html";
                location.href = redirectUrl;
                localStorage.setItem("activeuser", $("#txtEmail_login").val());
            } else {
                alert("Blocked...");
            }
        }
    }
});