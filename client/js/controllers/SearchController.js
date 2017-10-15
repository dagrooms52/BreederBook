var app = angular.module("myApp", []);
    app.controller("HttpFilterController", function ($scope, $http) {

        $scope.SearchData = function () {

            var config = {
              params: {
//                "name.first": $scope.firstname,
//                "name.last": $scope.lastname,
                "city": $scope.city,
                "state": $scope.state
              }
            };
            

            $http.get('https://petsource-pethacks.herokuapp.com/breeders', config)
            .success(function (response) {
                $scope.PostDataResponse = response;
            })
            .error(function (response) {
                $scope.ResponseDetails = response
            });
        };

    });