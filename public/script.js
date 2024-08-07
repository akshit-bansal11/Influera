$(document).ready(function()
{
console.log("Hello");


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
    })

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
    })

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
    })

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
    })

    $("#btnSignup").click(function()
    {
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
    });
  /////////////////////////////////////////////////////
    $("#btnLogin").click(function(){
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
                        location.href="./Influencer/influencerDashboard.html";
                        localStorage.setItem("activeuser",$("#txtEmail_login").val());

                    }
                    else if(jsonAry[0].utype==="Collaborator")
                    {
                        location.href="./investor/investorDashboard.html"; 
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

    

});


$("#btnEmail_infl").click(function(){
    console.log("JS SUcks");
    let obj={
        type:"get",
        url:"/find-user-details",
        data:{
            txtEmail:$("#txtEmail").val()
        }
    }
    $.ajax(obj).done(function(jsonAry)
    {
        if(jsonAry.length==0)
        {
            alert("No Data Found");
            return;
        }
        // alert(JSON.stringify(jsonAry));
        $("#txtPwd").val(jsonAry[0].pwd);//table colu. wala
        $("#txtDob").val(jsonAry[0].dob.split("T")[0]);//table colu. wala
        $("#prev").prop("src",jsonAry[0].picpath);
        $("#prev").val(jsonAry[0].picpath);
        $("#txtName").val(jsonAry[0].iname);
        $("#txtGender").val(jsonAry[0].gender);
        $("#txtAdd").val(jsonAry[0].address);
        $("#txtCity").val(jsonAry[0].city);
        $("#txtContact").val(jsonAry[0].contact);
        $("#txtField").val(jsonAry[0].field.split(","));
        $("#txtInsta").val(jsonAry[0].insta);
        $("#txtYt").val(jsonAry[0].yt);
        $("#txtOther").val(jsonAry[0].other);
        $("#btnSave").prop("disabled",true);
        $("#btnUpdate").prop("disabled",false);
    }).fail(function(err)
    {
        alert(err.statusText);
    })

});
/////////////////////////////////////////////////////

/////////////////////////////////////////////////
$("#btnPostEvent").click(function(){
        
    let obj={
        type:"get",
        url:"/post-event-details",
        data:{
            txtEmail:$("#txtEmail_PostEvent").val(),
            txtPwd:$("#txtPwd_PostEvent").val(),
            txtEvent:$("#txtEvent_PostEvent").val(),
            txtDate:$("#txtDate_PostEvent").val(),
            txtTime:$("#txtTime_PostEvent").val(),
            txtVenue:$("#txtVenue_PostEvent").val()
        }
    }
    $.ajax(obj).done(function(resp)
    {
        alert(resp);

    }).fail(function(err)
    {
        alert(err.statusText);
    })

  });
//*****************************************************************************/
$("#btnSettings_update").click(function(){
        
    let obj={
        type:"get",
        url:"/update-login-details-settings",
        data:{
            txtEmail:$("#txtEmail_settings").val(),
            txtoldPwd:$("#txtPwd_old_settings").val(),
            txtnewPwd:$("#txtPwd_new_settings").val(),
            txtrepPwd:$("#txtPwd_rep_settings").val()
        }
    }
    $.ajax(obj).done(function(resp)
    {
        alert(resp);

    }).fail(function(err)
    {
        alert(err.statusText);
    })

 });
//  ////////////////////////////////////////////////////////////////////////////////

});
