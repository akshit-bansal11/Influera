$(document).ready(function()
{
    let active=localStorage.getItem("activeuser");
    if(localStorage.getItem("activeuser")==null)
    {
        location.href="../index.html";
        return;
    }

    $("#txtEmail").val(active).prop("readonly",true);
    $(document).ajaxStart(function()
    {
        $("#bg").css("display","block");
        $("#wait").css("display","block");
    });
    $(document).ajaxStop(function(){
        $("#wait").css("display","none");
        $("#bg").css("display","none");
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
            $("#txtPwd").val(jsonAry[0].pwd);
            $("#txtDob").val(jsonAry[0].dob.split("T")[0]);
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

    
});

function doPrev(fileCtrl,imgPrev)
{
    let [file] = fileCtrl.files
    if (file) {
        imgPrev.src = URL.createObjectURL(file)
    }
}

function doLogout()
{
    localStorage.removeItem("activeuser");
    location.href="index.html";
}