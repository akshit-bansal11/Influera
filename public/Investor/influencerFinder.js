console.log("Hello")

var module=angular.module("mymodule",[]);
var controller=module.controller("mycontroller",function($scope,$http)
{
    let active=localStorage.getItem("activeuser");
    $scope.selemail=active;
    $scope.jsonArrayCity;
    $scope.jsonArrayAll;
    $scope.jsonArrayName;
    $scope.jsonArrayMoreinfo;
    $scope.doShowSel=function()
    {
        let field=$scope.selfield;
        let url="/fetch-some-field?field="+field;
        $http.get(url).then(allIsWell,notWell);
        function allIsWell(response)
        {
            $scope.jsonArrayCity=response.data;
        }
        function notWell(err)
        {
            alert(err)
        }
    }
    $scope.doShowSelAll=function()
    {
        let city=$scope.selCity;
        let url="/fetch-all-details-selected-infl?city="+city;
        $http.get(url).then(allIsWell,notWell);
        function allIsWell(response)
        {
            $scope.jsonArrayAll=response.data;
        }
        function notWell(err)
        {
            alert(err)
        }
    }
    $scope.doShowName=function()
    {
                
        let name=$scope.name;
        let url="/fetch-some-name?name="+name;
        $http.get(url).then(allIsWell,notWell);
        function allIsWell(response)
        {
            $scope.jsonArrayAll=response.data;
        }
        function notWell(err)
        {
            alert(err)
        }
    }
    $scope.doShowMoreinfo=function(index)
    {
        $scope.jsonArrayMoreinfo =$scope.jsonArrayAll[index];
    }
    $scope.doSendEmail=function(email)
    {
        let cltemail=$scope.selemail;
        let url="/send-email-influencer?email="+email+"&cltemail="+cltemail;
        $http.get(url).then(allIsWell,notWell);
        function allIsWell(response)
        {
            alert(response.data);
        }
        function notWell(err)
        {
            alert(err);
        }
    }
});

function doLogout()
{
    localStorage.removeItem("activeuser");
    location.href="../index.html";
}

$(document).ready(function()
{
    if(localStorage.getItem("activeuser")==null)
    {
        location.href="../index.html";
        return;
    }
})

console.log("Hello")
