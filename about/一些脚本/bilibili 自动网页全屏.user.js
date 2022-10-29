// ==UserScript==
// @name        bilibili 自动网页全屏
// @author      sangkuanji
// @license MIT
// @namespace   nana_vao_script
// @description 自动网页全屏
// @version     1.33
// @include     http://www.bilibili.com/video/BV*
// @include     https://www.bilibili.com/video/BV*
// @include     https://www.bilibili.com/video/av*
// @include     http://bangumi.bilibili.com/anime/v/*
// @include     https://bangumi.bilibili.com/anime/v/*
// @include     https://www.bilibili.com/bangumi/play/*
// @include     https://www.bilibili.com/medialist/*
// @include     https://tv.cctv.com/live/*
// @run-at      document-start
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// ==/UserScript==

(function () {
    let url = GM_getValue('url');
    GM_deleteValue('url');
    if (location.hostname == 'bangumi.bilibili.com') {
        if(url === location.href){
            return;
        }
        GM_setValue('url', location.href);
        document.addEventListener('DOMContentLoaded', function () {
            window.stop();
            location.href = document.querySelector('.v-av-link').href;
        });
    } else {
        try{
            //localStorage.setItem('bilibililover', 'YESYESYES');
            //localStorage.setItem('defaulth5', '1');
        }catch(e){}
        window.addEventListener('load', function () {
            console.log("load success");
            this.$ = unsafeWindow.jQuery;
            let elementNames = ["bpx-player-ctrl-web-enter", "bilibili-player-iconfont-web-fullscreen-off", "player_pagefullscreen_player", "squirtle-pagefullscreen-inactive"];
            for(var i = 0; i < elementNames.length; i++) {
                 waitElement(elementNames[i]);
            }
        });
    }

    function waitElement(elementName) {
        this.$ = unsafeWindow.jQuery;
        var _times = 20,
            _interval = 1000,
            _self = document.getElementsByClassName(elementName)[0],
            _iIntervalID;
        if( _self != undefined){
            _self.click();
        } else {
            _iIntervalID = setInterval(function() {
                if(!_times) {
                    clearInterval(_iIntervalID);
                }
                _times <= 0 || _times--;
                _self = document.getElementsByClassName(elementName)[0];
                if(_self == undefined) {
                   _self = document.getElementById(elementName);
                }
                if(_self != undefined){
                    _self.click();
                    clearInterval(_iIntervalID);
                }
            }, _interval);
        }
        return this;
    }
}) ();