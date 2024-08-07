document.addEventListener('DOMContentLoaded', function () {
    const selectElement = document.getElementById('country-select');

    for (const option of selectElement.options) {
        const flagIcon = option.querySelector('.flag-icon');
        const country = option.getAttribute('data-country');
        const code = option.getAttribute('data-code');

        option.innerHTML = `<img src="${flagIcon.src}" class="flag-icon"> ${country} (${code})`;
    }
});

$(document).ready(function()
{
    let active=localStorage.getItem("activeuser");
    $("#txtEmail").val(active).prop("readonly",true);
    if(localStorage.getItem("activeuser")==null)
    {
        location.href="index.html";
        return;
    }

    $("#btnEmail_client").click(function(){
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
            $("#txtMob").val(jsonAry[0].contact);
            $("#txtType").val(jsonAry[0].type);
            $("#btnSave").prop("disabled",true);
            $("#btnUpdate").prop("disabled",false);
        }).fail(function(err)
        {
            alert(err.statusText);
        })
    
    });
});

function doLogout()
{
    localStorage.removeItem("activeuser");
    location.href="../index.html";
}