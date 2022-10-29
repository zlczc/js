// ==UserScript==
// @name         移动百度优化
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  非百度系浏览器使用百度APP的ua时，会缺少搜索栏和控制栏。本脚本可以改善此情况。
// @author       tutu辣么可爱
// @include      *://*.baidu.com/s*
// @license      MIT
// ==/UserScript==

(function() {
	
	//用户设置
	var fixSearchBarFlag = false; //true:始终固定顶栏;false:不始终固定顶栏
	var doubleListFlag = true; //true:平板模式下始终双列显示;false:不双列显示
	
	//以下为js具体实现
	function longPress(target, eventFn) { //长按事件
		let timer = -1;
		target.addEventListener("touchstart", function() {
			timer = setTimeout(function() {
				eventFn();
			}, 400);
		})
		target.addEventListener("touchend", function() {
			clearTimeout(timer);
		})
	}

	function fixSearchBar(noAlert) { //固定/解除固定顶栏
		let head = $("#page-hd")[0];
		let page = $("#page")[0];
		let msg;
		if (head.style.position === "fixed") {
			head.style.position = "";
			page.style.marginTop = "";
			//storageData("set", "isFixed", false);
			msg = "顶栏：已解除固定";
		} else {
			head.style.position = "fixed";
			page.style.marginTop = getComputedStyle(head).height;
			//storageData("set", "isFixed", true);
			msg = "顶栏：已固定顶部";
		}
		console.log(msg);
		if (!noAlert) {
			alert(msg);
		}
		console.log(storageData("get", "isFixed"));
		console.log(head);
		console.log(page);
	}

	function getData(key) { //获取需要的数据
		if (key === "ua") {
			let ua = navigator.userAgent;
			let isMobile = /mobile/i.test(ua);
			let isBaidu = /baidu/i.test(ua);
			return isMobile && isBaidu;
		}
		if (key === "hn") {
			return location.hostname==="m.baidu.com";
		}
		let ls = location.search;
		if (key === "pd") {
			return !/pd=/i.test(ls);
		}
		if (key === "wd") {
			let searchWord = /word=/i.test(ls) ? ls.slice(ls.search("word=") + 5) : "";
			searchWord = !searchWord && /wd=/i.test(ls) ? ls.slice(ls.search("wd=") + 3) : searchWord;
			searchWord = searchWord ? decodeURIComponent(searchWord.split("&")[0].replace("+", " ")) : "";
			return searchWord
		}
		return false;
	}

	function storageData(type, key, value) { //本地存储相关功能
		let name = "mobileBaiduOptimizeSettingsData";
		let initData = {
			"isFixed": false
		}
		let data = localStorage.getItem(name);
		try {
			data = data ? JSON.parse(data) : {};
		} catch (e) {
			data = {};
		}
		data = {
			...initData,
			...data
		};
		if (type === "set") {
			data[key] = value;
			data = JSON.stringify(data);
			localStorage.setItem(name, data);
		} else if (type === "get") {
			return data[key];
		}
	}

	function createSearchBar() { //创建顶部搜索栏
		let extraSearchgBox = $(".searchboxtop.newsearch-white-style")[0];
		let tabLink = $(".se-head-tablink")[0];
		if (!extraSearchgBox && tabLink) {
			extraSearchgBox = document.createElement("div");
			extraSearchgBox.setAttribute("m-service", "searchbox");
			extraSearchgBox.setAttribute("class", "searchboxtop newsearch-white-style");
			extraSearchgBox.setAttribute("style", "padding-top:10px");
			extraSearchgBox.setAttribute("id", "extraSearchgBox");
			extraSearchgBox.innerHTML =
				"<form data-formposition='t' class='se-form' id='se-form' method='get' autocomplete='off' action='/s'><div><div class='suggest-back' style='display: none;'><i class='c-icon'></i></div><div class='con-wrap new-search-con'><div class='con-inner-left'><div><div class='se-bearicon' style='margin:11px'></div></div><input autocomplete='off' autocorrect='off' maxlength='64' id='kw' name='word' type='search' class='se-input adjust-input' placeholder='输入搜索词' value='" +
				getData("wd") +
				"' data-sug='1'><div id='cross' class='cross' style='display: none;'></div></div><button id='se-bn' class='se-bn' type='submit'><span>百度一下</span></button></div></div></form><div class='searchboxtop-bg-fade'></div>";
			longPress(extraSearchgBox.querySelector(".se-bearicon").parentElement, fixSearchBar);
			tabLink.parentElement.insertBefore(extraSearchgBox, tabLink);
			// if (storageData("get", "isFixed")) {
			// 	fixSearchBar(true);
			// }
			if (fixSearchBarFlag) {
				fixSearchBar(true);
			}
		}
	}

	function doubleList() { //搜索结果双列显示
		if (!doubleListFlag) {
			return false;
		}
		let list = $(".c-result.result");
		let classReg = new RegExp("doubleList-Item");
		for (let i = 0; i < list.length; i++) {
			if (!classReg.test(list[i].getAttribute("class"))) {
				let h = getComputedStyle(list[i]).height;
				if (h !== "auto" && h !== "0px") {
					list[i].style = "display:inline-block;vertical-align:middle;width: 50%;";
					list[i].setAttribute("class", list[i].classList["value"] + " doubleList-Item");
					list[i].setAttribute("doubleList-complete", false);
				}
			}
		}
		list = $(".c-result.result.doubleList-Item[doubleList-complete=false]");
		for (let i = 0; i < list.length; i++) {
			if ((i + 1) >= list.length) {
				break;
			}
			list[i].setAttribute("doubleList-complete", "left");
			list[(i + 1)].setAttribute("doubleList-complete", "right");
			let left = list[i].querySelector("article");
			let right = list[(i + 1)].querySelector("article");
			let leftH = parseFloat(getComputedStyle(left).height.replace("px", ""));
			let rightH = parseFloat(getComputedStyle(right).height.replace("px", ""));
			let max = leftH > rightH ? leftH : rightH;
			left.style.height = max + "px";
			right.style.height = max + "px";
			i += 1;
		}
	}

	function commonOptimize() { //通用设备优化
		setTimeout(function() {
			createSearchBar();
		}, 300);
	}

	function tabletOptimize() { //平板额外优化
		if (0.8 * screen.width > screen.height) {
			//pad宽高比一般为0.75（ipad）、0.625（matepad），以防万一取0.8
			setInterval(function() {
				doubleList();
			}, 500);
		}
	}
	if (getData("ua") && getData("hn") && getData("pd")) { //判断是否启动脚本
		$().ready(function() {
			commonOptimize();
			tabletOptimize();
		})
	}
})();
