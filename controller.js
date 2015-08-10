var test = angular.module('test', ['allInput']);

test.controller('index', function($scope){
	$scope.a = '0';
	$scope.b = '1';
	$scope.c = '2';
	$scope.d = '3';
	$scope.e = '4';
	$scope.f = 'hehe';
	$scope.g = 'haha';
	
	
	$scope.model = {
			a: 0
	};
	$scope.option = {
			data : {
				0 : '我知道',
				1 : '我不知道',
				2 : '打我',
				3 : '不打我'
			}
	}
});