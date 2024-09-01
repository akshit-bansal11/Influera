$(document).ready(function()
{
    console.log("Script Start");


    $("#txtEmail_signup").blur(function()
    {
        if($(this).val()=="")
        {
            $("#btnSignup").prop("disabled",true);
        }
        if($(this).val()!="")
        {
            $("#btnSignup").prop("disabled",false);
        }
    });

    
    var isValidEmail1;
    $("#txtEmail_signup").on("input", function() {
        var email1 = $(this).val();
        if (email1 === "" || !email1.includes("@") || !email1.includes(".")) {
            $("#emailValidMessage").text("!!!Please enter a valid email address!!!");
            isValidEmail1 = false;
        } else {
            $("#emailValidMessage").text("");
            isValidEmail1 = true;
        }
    });

    var isValidEmail2;
    $("#txtEmail_login").on("input", function() {
        var email2 = $(this).val();
        if (email2 === "" || !email2.includes("@") || !email2.includes(".")) {
            $("#emailValidMessageLogin").text("!!!Please enter a valid email address!!!");
            isValidEmail2 = false;
        } else {
            $("#emailValidMessageLogin").text("");
            isValidEmail2 = true;
        }
    });
    

    $("#txtPwd_signup").blur(function()
    {
        if($(this).val()=="")
        {
            $("#btnSignup").prop("disabled",true);
        }
        if($(this).val()!="")
        {
            $("#btnSignup").prop("disabled",false);
        }
    });

    $("#utype").blur(function()
    {
        if($(this).val()=="none")
        {
            $("#btnSignup").prop("disabled",true);
        }
        if($(this).val()!="none")
        {
            $("#btnSignup").prop("disabled",false);
        }
        if($("#txtEmail_signup").val()=="" || $("#txtPwd_signup").val()=="")
        {
            $("#btnSignup").prop("disabled",true);
        }
    });

    $("#txtForget_login").blur(function()
    {
        if($(this).val()=="")
        {
            $("#btnForget").prop("disabled",true);
        }
        else
        {
            $("#btnForget").prop("disabled",false);
        }
    });

    $("#btnSignup").click(function()
    {
        if (!isValidEmail1) {
            alert("Please enter a valid email address.");
            return false;
        }
        else {
            let obj={
                type:"get",
                url:"/signup-details",
                data:{
                    txtEmail:$("#txtEmail_signup").val(),
                    txtPwd:$("#txtPwd_signup").val(),
                    utype:$("#utype").val(),
                    status:1
                }
            }
            $.ajax(obj).done(function(resp)
            {
                alert(resp);
            }).fail(function(err)
            {
                alert(err.statusText);
            })
        }
        

        
    });

    $("#btnLogin").click(function(){
        if (!isValidEmail2) {
            alert("Please enter a valid email address.");
            return false;
        }
        else {
            let obj={
                type:"get",
                url:"/check-login-details",
                data:{
                    txtEmail:$("#txtEmail_login").val(),
                    txtPwd:$("#txtPwd_login").val()
                }
            }
            $.ajax(obj).done(function(jsonAry)
            {
                if($.isEmptyObject(jsonAry))
                {
                    alert("Invalid User Cridentials");
                }
                else
                {
                    if(jsonAry[0].status==1)
                    {
                        if(jsonAry[0].utype==="Influencer")
                        {
                            location.href="/Influencer/influencerDashboard.html";
                            localStorage.setItem("activeuser",$("#txtEmail_login").val());
                        }
                        else if(jsonAry[0].utype==="Collaborator")
                        {
                            location.href="/Investor/investorDashboard.html"; 
                            localStorage.setItem("activeuser",$("#txtEmail_login").val());
                        }
                    }
                    else
                    {
                        alert("Blocked...");
                    }
                }
            }).fail(function(err)
            {
                alert(err.statusText);
            })
        }
        
    });

});