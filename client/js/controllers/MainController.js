'use strict';

var app = angular.module('myApp', []);

app.controller('MainController', function ($scope, $http) {
    $http.get("http://localhost:3000/breeders/BJbW8c16b")
    .then(function(response) {
        //First function handles success
        $scope.content = response.data;
    }, function(err) {
        //Second function handles error
        $scope.content = err;
    });
    
});