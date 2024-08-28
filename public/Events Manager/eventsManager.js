var app = angular.module("eventManagerApp", []);

app.controller("eventController", function($scope, $http) {
    $scope.jsonArrayAll = [];

    $scope.fetchEvents = function() {
        let userEmail = localStorage.getItem("activeuser");
        if (!userEmail) {
            console.error("User email is not set.");
            return;
        }
    
        $http.get("/fetch-future-events", { params: { email: userEmail } })
            .then(function(response) {
                console.log("Received data:", response.data);
                $scope.jsonArrayAll = response.data;
            }, function(error) {
                console.error("Error fetching events:", error);
            });
    };

    $scope.fetchEvents();

    $scope.doDelete = function() {
        let userEmail = localStorage.getItem("activeuser");
        // Parse the date string
        if (!userEmail) {
            console.error("User email is not set.");
            return;
        }
    
        $http.get("/delete-future-events", { params: { email: userEmail } })
        location.reload();
    };
});

$(document).ready(function()
{
    if(localStorage.getItem("activeuser")==null)
    {
        location.href="index.html";
        return;
    }
    let active=localStorage.getItem("activeuser");
    $("#txtEmail_PostEvent").val(active).prop("readonly",true);
    $("#txtEmail_settings").val(active).prop("readonly",true);
});

function doLogout()
{
    localStorage.removeItem("activeuser");
    location.href="../index.html";
}