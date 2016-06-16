;;(function() {
	function flow(mh, mv) { 
		//参数mh和mv是定义数据块之间的间距，mh是水平距离，mv是垂直距离
		var w = 980; //计算页面宽度 
		var ul = document.getElementById("section-left");
		var li = ul.getElementsByClassName('link');
		var iw = li[0].offsetWidth + mh; //计算数据块的宽度 
		var c = Math.floor(w / iw); //计算列数 
		ul.style.width = iw * c - mh + "px"; //设置ul的宽度至适合便可以利用css定义的margin把所有内容居中 
		ul.style.display = 'block';
		var liLen = li.length;
		var lenArr = [];
		for (var i = 0; i < liLen; i++) { //遍历每一个数据块将高度记入数组 
			lenArr.push(li[i].offsetHeight);
		}
		
		var oArr = [];
		for (var i = 0; i < c; i++) { //把第一行排放好，并将每一列的高度记入数据oArr 
			li[i].style.top = "0";
			li[i].style.left = iw * i + "px";
			li[i].style.opacity = "1";
			li[i].style["-moz-opacity"] = "1";
			li[i].style["filter"] = "alpha(opacity=100)";
			oArr.push(lenArr[i]);
		}

		for (var i = c; i < liLen; i++) { //将其他数据块定位到最短的一列后面，然后再更新该列的高度 
			var x = _getMinKey(oArr); //获取最短的一列的索引值 
			li[i].style.top = oArr[x] + mv + "px";
			li[i].style.left = iw * x + "px";
			li[i].style.opacity = "1";
			li[i].style["-moz-opacity"] = "1";
			li[i].style["filter"] = "alpha(opacity=100)";
			oArr[x] = lenArr[i] + oArr[x] + mv; //更新该列的高度 
		}
		ul.style.height = _getMaxValue(oArr)+'px';
	}
	//图片加载完成后执行 
	window.onload = function() {
		flow(15, 15);
	};

	function _getMaxValue(arr) {
			var a = arr[0];
			for (var k in arr) {
				if (arr[k] > a) {
					a = arr[k];
				}
			}
			return a;
		}
		//获取数字数组最小值的索引 

	function _getMinKey(arr) {
		var a = arr[0];
		var b = 0;
		for (var k in arr) {
			if (arr[k] < a) {
				a = arr[k];
				b = k;
			}
		}
		return b;
	}
}());