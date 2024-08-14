var app = angular.module("eventManagerApp", []);

app.controller("eventController", function($scope, $http) {
    $scope.jsonArrayAll = [];

    $scope.fetchEvents = function() {
        let userEmail = localStorage.getItem("activeuser"); // Make sure this key is correct
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

    $scope.doDelete = function(email, timee, dob) {
        // Format the date to YYYY-MM-DD
        var formattedDate = new Date(dob).toISOString().split('T')[0];
        
        // Format the time to HH:MM:SS
        var formattedTime = timee.split(':').slice(0, 3).join(':');
        
        console.log("Deleting event:", email, formattedTime, formattedDate);
    
        $http.get("/delete-future-events", { 
            params: { 
                email: email, 
                timee: formattedTime, 
                dob: formattedDate 
            } 
        })
        .then(function(response) {
            console.log("Delete response:", response.data);
            $scope.fetchEvents();
        }, function(error) {
            console.error("Error deleting event:", error);
            if (error.data) {
                console.error("Error details:", error.data);
            }
        });
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