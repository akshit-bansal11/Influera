$(document).ready(function()
    {
        if(localStorage.getItem("activeuser")==null)
        {
            location.href="index.html";
            return;
        }
});

function doLogout()
{
    localStorage.removeItem("activeuser");
    location.href="index.html";
}