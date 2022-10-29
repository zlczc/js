// ==UserScript==
// @name         返回顶部小助手
// @name         HeiGoBackTop
// @icon         https://z3.ax1x.com/2021/05/13/gBJiXF.png
// @version      1.0.1
// @namespace    https://hei-jack.github.io/heigobacktop/
// @description  可能是最漂亮的返回顶部插件。可以用来返回页面顶部，或者跳转底部，也可以用来自动化滑动页面。更多用法等你探索。
// @author       hei-jack
// @match        *
// @include      *
// @require      https://greasyfork.org/scripts/426407-heigobacktop-js/code/HeiGoBackTopjs.js?version=954372
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_log
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// ==/UserScript==

(function() {
    //开启严格模式
    "use strict";
    //初始化 如果没有传入或更改参数 一般都是默认的主题和尺寸大小等
    var hello = new HeiGoBackTop();
    
    /* 示例代码 详情请查看文档https://hei-jack.github.io/heigobacktop/

   //推荐使用下面这种方式切换主题和其他参数
   hello.onBeforeCreate(function(){
    //切换为2号主题
    this.themes = 2;

    //修改按钮尺寸
    this.width = '200px'; //修改按钮宽度为200px 默认宽度为150px
    
    this.height = '50px'; //修改按钮高度为50px 默认高度是40px

    //修改按钮文本和文本颜色
    this.text = '你好';
    this.text_color = '#000';
    
    //修改按钮位置
    this.top = '80%';
    this.right = '10%';

    //修改按钮颜色
    this.color = '#000';
    this.shadow = '0 4px 15px 0 rgba(462, 358, 123,0.75)'; //阴影
    
    //更改模式为跳转底部
    this.mode = 2;
   });
    */

})();