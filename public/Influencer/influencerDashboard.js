$(document).ready(function()
{
    $("#postEvent").click(function(){
        
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

    $("#update").click(function(){
        
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

    if(localStorage.getItem("activeuser")==null)
    {
        location.href="/index.html";
        return;
    }

    let active=localStorage.getItem("activeuser");
    $("#txtEmail_PostEvent").val(active).prop("readonly",true);
    $("#txtEmail_settings").val(active).prop("readonly",true);

})

function doLogout()
{

    localStorage.removeItem("activeuser");
    location.href="/index.html";

}