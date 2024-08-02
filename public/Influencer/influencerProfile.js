$(document).ready(function()
{
    let active=localStorage.getItem("activeuser");
    $("#txtEmail").val(active).prop("readonly",true);
    $(document).ajaxStart(function()
    {
        $("#bg").css("display","block");
        $("#wait").css("display","block");
    })
    $(document).ajaxStop(function(){
        $("#wait").css("display","none");
        $("#bg").css("display","none");
    })
})

$(document).ready(function()
{
    if(localStorage.getItem("activeuser")==null)
    {
        location.href="../index.html";
        return;
    }
})

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