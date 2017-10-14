//app.controller('MainController', ['$scope', 'forecast', function ($scope, forecast, SearchService) {
//  forecast.success(function(data) {
//    $scope.fiveDay = data;
//  });
//    $scope.searchVars = SearchService.searchVars;
//    $scope.newVar = {
//        val: ""
//    };
//    SearchService.newVal = $scope.newVar;
//
//}]);
// declare the app with no dependencies
var myApp = angular.module('myApp', []);

// Create the factory that share the Fact
myApp.factory('Fact', function(){
  return { Field: '' };
});

// Two controllers sharing an object that has a string in it
myApp.controller('FirstCtrl', function( $scope, Fact ){
  $scope.Alpha = Fact;
});

myApp.controller('SecondCtrl', function( $scope, Fact ){
  $scope.Beta = Fact;
});