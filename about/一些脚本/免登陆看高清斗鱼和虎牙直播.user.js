// ==UserScript==
// @name         免登陆看高清斗鱼和虎牙直播
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  免登陆看高清斗鱼和虎牙直播。
// @author       xxboy
// @include      *www.douyu.com/*
// @include      *www.huya.com/*
// @grant        none
// ==/UserScript==
 
(function() {
    'use strict';
    // Your code here...
    if(top.window.location.href.indexOf("douyu.com") > -1){
            var a = JSON.parse(localStorage.getItem('rateRecordTime_h5p_room'));
            a.v = "v";
            localStorage.setItem('rateRecordTime_h5p_room',JSON.stringify(a));
    }
    if(top.window.location.href.indexOf("huya.com") > -1){
            localStorage.setItem("loginTipsCount","v");
    }
 
})();