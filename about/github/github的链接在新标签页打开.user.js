// ==UserScript==
// @name         github的链接在新标签页打开
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  让github的链接默认是在新标签页中打开而不是当前页打开
// @author       xiaolaji
// @match        https://github.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// ==/UserScript==

(function() {
    'use strict';

    // 网上百度一直就说href改为_blank就可以了，但是目录页面移入是会在当前页打开。网上找的几个脚步都没有解决这个问题。于是又换了一种思路
    // 我把默认href禁用，给a标签加一个点击事件。在js中使用window.open的方式打开
    // 关于不跳转我猜测是用了hash路由或者单页面应用。希望有懂的可以帮忙解答下困惑
    setTimeout(() => {
        let links = document.getElementsByTagName('a')
        for(let i=0;i< links.length;i++){
            // 拿到每一个url
            let url = links[i].href;
            links[i].href = "javascript:void(0);";
            links[i].onclick = function(){
               window.open(url)
            }
        }
    },2000)

})();