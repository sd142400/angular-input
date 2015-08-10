/*
 * 老天，求个女友来拯救我
 */

var allInput = angular.module('allInput', []);

//这个是我们要用的枚举值
allInput.factory('$status', function(){
	var status = {
		"0" : '审核拒绝',
		"1" : '审核通过',  //我故意省略2
		"3" : '未审核',
		"4" : '重新提交审核',
		'hehe': '已封禁' //如果后端的枚举是hehe或者什么的我们应该也能应付
	};

	return status;
});

//这个地方是两个控件都要用到的公共配置
allInput.factory('$defaultOption', function($status){
	return {
		status: {
			data: $status
		},
		//这个下面还可以填充好多类似于上面的东西
		removeDiff: function(a, b){
			//这块的主要意思是b里面有的东西就要替换a
			if(a == null){
				return b;
			}

			if(b == null){
				return a;
			}

			//如果都没有空，就返回a配置
			for (i in a){
				if(i in b){
					a[i] = b[i];
				}
			}

			return a;
		}
	};
});

//我们在这个位置新建一个filter
allInput.filter('status', function($status){
	return function(input){
		return input in $status ? $status[input] : '未知';
	}
});

/*
 * 这块是要新建一个select的控件
 */

allInput.directive('selectInput', function($defaultOption){
	return {
		restrict: 'AE',
		replace: true,
		scope: {
			ngType: '@',  //这个地方是为了说明这个控件到底要显示哪个枚举（我们可能有多个枚举）
			myConfig: '='//这个地方可以传入一些我们自定义的配置，这样我们就可以不用局限于他自己的type了			
		},
		//我这里写到controller纯粹是因为他简单，第二一点，我也没有真正理解，为什么放入link是最佳实践
		//这里的$selectOption 是我们要为了自定义的方法而用的，看到这里不明白先不要着急
		controller: function($scope, $defaultOption){
			//这个地方是要把真实的值传给option做渲染
			$scope.option = $defaultOption.removeDiff($defaultOption[$scope.ngType], $scope.myConfig);
			console.log($scope.option);
		},
		templateUrl: 'select.html'
	};
});


//最后的最后再加一个模板，就完事儿了

allInput.run(function($templateCache){
	$templateCache.put('select.html',
		' \
		<select \
			ng-options = "key as value for (key, value) in option.data" >\
		</select> \
		'
	);
});

/*
 * 这块是建一个radio的控件
 */

//这个要提前写，写这个控件的时候，我真的遇到了不少麻烦，所以只能进行一丢丢的dom操作，还希望哪个厉害的大哥可以指点我一下
//然后开始撸代码
allInput.directive('radioInput', function($defaultOption){
	return {
		restrict: 'AE',
		replace: true,
		scope: {
			ngType: '@',  //这俩跟上面一样
			myConfig: '='
		},
		//这个地方因为是写demo，我是犯个懒，用之前select的
		controller: function($scope, $defaultOption){
			$scope.option = $defaultOption.removeDiff($defaultOption[$scope.ngType], $scope.myConfig);
		},
		templateUrl: 'radio.html'
	};
});

//这里也写一个模板
allInput.run(function($templateCache){
	//这个地方是我最头疼的，因为不能同步ng-model,所以我写了一个指令来进行dom操作
	$templateCache.put('radio.html', 
		'<input ng-repeat = "(key, value) in option.data" radio-to-name type = "radio" value = "{{key}}" radio-value = "{{value}}">'
	);
});

//这个地方就是重点，我目前为止还不知道怎么处理，所以只能写一个dom来操作，有大神可以指点我，呵呵
allInput.directive('radioToName', function(){
	return {
		restrict: 'A',
		terminal: true, //这个地方指定优先级最低，要让ng-repeat指令完成之后才可以执行
		link: function(scope, ele, attr){
			ele.after('' + attr.radioValue + '');
		}
	};
});

