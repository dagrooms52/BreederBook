app.controller('MainController', ['$scope', 'forecast', function ($scope, forecast, SearchService) {
  forecast.success(function(data) {
    $scope.fiveDay = data;
  });
    $scope.searchVars = SearchService.searchVars;
    $scope.newVar = {
        val: ""
    };
    SearchService.newVal = $scope.newVar;

}]);


app.controller('SearchController', function($scope, searchForm, SearchService) {
    $scope.searchVars = SearchService.searchVars; 
    $scope.anotherVar = SearchService.newVar;
});

app.service("SearchService", function() {
    return {
        searchVars: [{name: "dummy"}, {name: "dummy"}]
    }
});