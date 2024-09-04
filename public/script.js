$(document).ready(function() {
    console.log("Script Start");

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

    $("#txtPwd_signup, #utype").on("blur", toggleSignupButton);

    $("#txtForget_login").on("blur", function() {
        toggleButtonState($(this).val(), "#btnForget");
    });

    $("#btnSignup").on("click", function() {
        if (isValidEmail1) {
            submitForm("/signup-details", {
                txtEmail: $("#txtEmail_signup").val(),
                txtPwd: $("#txtPwd_signup").val(),
                utype: $("#utype").val(),
                status: 1
            });
        } else {
            alert("Please enter a valid email address.");
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
                            $("#utype").val() === "none";
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
