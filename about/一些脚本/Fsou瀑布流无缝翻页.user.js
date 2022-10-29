// ==UserScript==
// @name         Fsou瀑布流无缝翻页
// @namespace    https://github.com/iMortRex
// @version      0.0.2
// @description  （手机网页端）简单好用的搜索引擎，简单好用的脚本~
// @author       Mort Rex
// @run-at       document-end
// @match        https://fsoufsou.com/search*
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @icon         https://cdn.fsofso.com/static/assets/favicon.ico
// @license      MIT
// ==/UserScript==

(function () {
    'use strict';

    clickLoop();
    function clickLoop() {
        if ($(".next-page-container.double-center").length) {
            //获取查看更多控件的顶点位置
            var seeMoreOffsetTop = $(".next-page-container.double-center").offset().top;
            //获取查看更多控件的高度
            var seeMoreOuterHeight = $(".next-page-container.double-center").outerHeight(true);
            //判断控件是否在显示范围内，+* 是提前*距离运行脚本，这样就不用等拖到底部再加载了
            if ($(window).scrollTop() + 1000 > seeMoreOffsetTop - $(window).height() && $(window).scrollTop() < seeMoreOffsetTop + seeMoreOuterHeight) {
                //模拟点击查看更多按钮
                $(".next-page-container.double-center").click();
            }
        }
        //每100毫秒循环判断一次
        setTimeout(clickLoop, 100);
    }
})();