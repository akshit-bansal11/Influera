$(document).ready(function()
{
    let active=localStorage.getItem("activeuser");
    $("#txtEmail").val(active).prop("readonly",true);
    if(localStorage.getItem("activeuser")==null)
    {
        location.href="index.html";
        return;
    }

    $("#searchByEmail").click(function(){
        let obj={
            type:"get",
            url:"/find-user-details-client",
            data:{
                txtEmail:$("#txtEmail").val()
            }
        }
        $.ajax(obj).done(function(jsonAry)
        {
            if(jsonAry.length==0)
            {
                alert("Invalid ID");
                return;
            }
            $("#txtName").val(jsonAry[0].iname);
            $("#txtGender").val(jsonAry[0].gender);
            $("#txtCity").val(jsonAry[0].city);
            $("#txtState").val(jsonAry[0].state);
            $("#txtContact").val(jsonAry[0].contact);
            $("#txtType").val(jsonAry[0].type);
            $("#btnSave").prop("disabled",true);
            $("#btnUpdate").prop("disabled",false);
        }).fail(function(err)
        {
            alert(err.statusText);
        })
    
    });

    $('#txtContact').on('input', function() {
        let value = $(this).val();
        // Allow only numbers and '+' at the beginning
        if (!/^\+?[0-9]*$/.test(value)) {
            $(this).val(value.slice(0, -1)); // Remove last entered character
        }
    });

});

function doLogout()
{
    localStorage.removeItem("activeuser");
    location.href="../index.html";
}

function goBack() {
    location.href="investorDashboard.html"
}