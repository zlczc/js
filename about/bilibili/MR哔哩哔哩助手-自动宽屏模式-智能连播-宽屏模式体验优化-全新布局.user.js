// ==UserScript==
// @name         MR哔哩哔哩助手-自动宽屏模式/智能连播/宽屏模式体验优化/全新布局
// @namespace    https://github.com/iMortRex
// @version      0.2.10
// @description  【宽屏模式支持视频/番剧/列表】此插件主要是为了兼容在宽屏模式下直接滚动至最上方会导致播放器不完整，所以把标题栏和头像移至视频下方，附赠一些其他功能
// @author       Mort Rex
// @run-at       document-end
// @match        *.bilibili.com/video/*
// @match        *.bilibili.com/bangumi/*
// @match        *.bilibili.com/medialist/*
// @include      *.bilibili.com/video/*
// @include      *.bilibili.com/bangumi/*
// @include      *.bilibili.com/medialist/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license      MIT
// ==/UserScript==

// 初始化全局变量
if (GM_getValue('autoWidescreenSwitch') == null) {
    // 默认打开自动宽屏模式
    GM_setValue('autoWidescreenSwitch', 0);
}
if (GM_getValue('smartNextPlaySwitch') == null) {
    // 默认打开智能连播
    GM_setValue('smartNextPlaySwitch', 0);
}
if (GM_getValue('MRLayoutPlayerInfoSwitch') == null) {
    // 默认开启MR布局模式播放器弹幕和观看信息
    GM_setValue('MRLayoutPlayerInfoSwitch', 0);
}

// 菜单按钮
GM_registerMenuCommand('切换宽屏模式/MR布局模式/默认模式', function () {
    autoWidescreenClick();
});
GM_registerMenuCommand('开关智能连播', function () {
    smartNextPlayClick();
});
GM_registerMenuCommand('开关MR布局模式播放器弹幕和观看信息', function () {
    MRLayoutPlayerInfoClick();
});

// 点击菜单按钮后触发事件
function autoWidescreenClick() {
    if (GM_getValue('autoWidescreenSwitch') == 0) {
        GM_setValue('autoWidescreenSwitch', 1);
        alert('已开启默认模式\n请刷新网页更新状态');
    } else if (GM_getValue('autoWidescreenSwitch') == 1) {
        GM_setValue('autoWidescreenSwitch', 2);
        alert('已开启MR布局模式\n请刷新网页更新状态');
    } else {
        GM_setValue('autoWidescreenSwitch', 0);
        alert('已开启自动宽屏模式\n请刷新网页更新状态');
    }
}
function smartNextPlayClick() {
    if (GM_getValue('smartNextPlaySwitch') == 0) {
        GM_setValue('smartNextPlaySwitch', 1);
        alert('已关闭智能连播\n请刷新网页更新状态');
    } else {
        GM_setValue('smartNextPlaySwitch', 0);
        alert('已开启智能连播\n分P/合集/列表/番剧页自动连播，单集不连播\n请刷新网页更新状态');
    }
}
function MRLayoutPlayerInfoClick() {
    if (GM_getValue('MRLayoutPlayerInfoSwitch') == 0) {
        GM_setValue('MRLayoutPlayerInfoSwitch', 1);
        alert('已关闭MR布局模式播放器弹幕和观看信息\n请刷新网页更新状态');
    } else {
        GM_setValue('MRLayoutPlayerInfoSwitch', 0);
        alert('已开启MR布局模式播放器弹幕和观看信息\n请刷新网页更新状态');
    }
}

// 执行代码
(function () {
    'use strict';

    // 自动宽屏模式
    if (GM_getValue('autoWidescreenSwitch') == 0) {
        // 当开启自动宽屏模式时再执行脚本
        var autoWidescreenEtime = 0;
        autoWidescreen();
        function autoWidescreen() {
            if (window.location.href.match('bilibili.com/bangumi/')) {
                console.log('哔哩哔哩宽屏优化-当前页面是：番剧');
                autoWidescreenBangumi();
                function autoWidescreenBangumi() {
                    if (document.getElementsByClassName('squirtle-video-widescreen squirtle-video-item')[0]) {
                        // 检测番剧页面宽屏模式相关元素是否加载完毕
                        if (!document.getElementsByClassName('squirtle-video-widescreen squirtle-video-item active')[0]) {
                            // 如果当前不是宽屏模式则点击宽屏模式按钮
                            document.getElementsByClassName('squirtle-video-widescreen squirtle-video-item')[0].click();
                        }
                    } else {
                        // 每100毫秒检测一次，8秒后不再执行
                        autoWidescreenEtime += 100;
                        if (autoWidescreenEtime < 8000) {
                            setTimeout(autoWidescreenBangumi, 100);
                        }
                    }
                }
            } else if (window.location.href.match('bilibili.com/video/')) {
                console.log('哔哩哔哩宽屏优化-当前页面是：视频');
                autoWidescreenVideo();
                function autoWidescreenVideo() {
                    if (document.getElementsByClassName('bpx-player-ctrl-btn bpx-player-ctrl-wide')[0]) {
                        // 检测视频页面宽屏模式相关元素是否加载完毕
                        if (!document.getElementsByClassName('bpx-player-ctrl-btn bpx-player-ctrl-wide bpx-state-entered')[0]) {
                            // 检测当前是否已是宽屏模式
                            document.getElementsByClassName('bpx-player-ctrl-btn bpx-player-ctrl-wide')[0].click();
                        }
                    } else {
                        // 每100毫秒检测一次，8秒后不再执行
                        autoWidescreenEtime += 100;
                        if (autoWidescreenEtime < 8000) {
                            setTimeout(autoWidescreenVideo, 100);
                        }
                    }
                }
            } else {
                console.log('哔哩哔哩宽屏优化-当前页面是：列表');
                autoWidescreenVideo();
                function autoWidescreenVideo() {
                    if (document.getElementsByClassName('bilibili-player-video-btn bilibili-player-video-btn-widescreen')[0]) {
                        // 检测视频页面宽屏模式相关元素是否加载完毕
                        if (!document.getElementsByClassName('bilibili-player-video-btn bilibili-player-video-btn-widescreen closed')[0]) {
                            // 检测当前是否已是宽屏模式
                            document.getElementsByClassName('bilibili-player-video-btn bilibili-player-video-btn-widescreen')[0].click();
                        }
                    } else {
                        // 每100毫秒检测一次，8秒后不再执行
                        autoWidescreenEtime += 100;
                        if (autoWidescreenEtime < 8000) {
                            setTimeout(autoWidescreenVideo, 100);
                        }
                    }
                }
            }
        }
    } else if (GM_getValue('autoWidescreenSwitch') == 2) {
        var autoWidescreenEtime = 0;
        autoWidescreen();
        function autoWidescreen() {
            if (window.location.href.match('bilibili.com/bangumi/')) {
                console.log('哔哩哔哩宽屏优化-当前页面是：番剧');
                autoWidescreenBangumi();
                function autoWidescreenBangumi() {
                    if (document.getElementsByClassName('squirtle-video-widescreen squirtle-video-item')[0]) {
                        // 检测番剧页面宽屏模式相关元素是否加载完毕
                        if (!document.getElementsByClassName('squirtle-video-widescreen squirtle-video-item active')[0]) {
                            // 如果当前不是宽屏模式则点击宽屏模式按钮
                            document.getElementsByClassName('squirtle-video-widescreen squirtle-video-item')[0].click();
                        }
                    } else {
                        // 每100毫秒检测一次，8秒后不再执行
                        autoWidescreenEtime += 100;
                        if (autoWidescreenEtime < 8000) {
                            setTimeout(autoWidescreenBangumi, 100);
                        }
                    }
                }
            } else if (window.location.href.match('bilibili.com/video/')) {
                console.log('哔哩哔哩宽屏优化-当前页面是：视频');
                if (document.getElementsByClassName('v-wrap')[0]) {
                    // 旧版界面
                    autoWidescreenVideo();
                    function autoWidescreenVideo() {
                        if (document.getElementsByClassName('bpx-player-ctrl-btn bpx-player-ctrl-wide')[0]) {
                            // 检测视频页面宽屏模式相关元素是否加载完毕
                            if (!document.getElementsByClassName('bpx-player-ctrl-btn bpx-player-ctrl-wide bpx-state-entered')[0]) {
                                // 检测当前是否已是宽屏模式
                                document.getElementsByClassName('bpx-player-ctrl-btn bpx-player-ctrl-wide')[0].click();
                            }
                        } else {
                            // 每100毫秒检测一次，8秒后不再执行
                            autoWidescreenEtime += 100;
                            if (autoWidescreenEtime < 8000) {
                                setTimeout(autoWidescreenVideo, 100);
                            }
                        }
                    }
                }
            } else {
                console.log('哔哩哔哩宽屏优化-当前页面是：列表');
                autoWidescreenVideo();
                function autoWidescreenVideo() {
                    if (document.getElementsByClassName('bilibili-player-video-btn bilibili-player-video-btn-widescreen')[0]) {
                        // 检测视频页面宽屏模式相关元素是否加载完毕
                        if (!document.getElementsByClassName('bilibili-player-video-btn bilibili-player-video-btn-widescreen closed')[0]) {
                            // 检测当前是否已是宽屏模式
                            document.getElementsByClassName('bilibili-player-video-btn bilibili-player-video-btn-widescreen')[0].click();
                        }
                    } else {
                        // 每100毫秒检测一次，8秒后不再执行
                        autoWidescreenEtime += 100;
                        if (autoWidescreenEtime < 8000) {
                            setTimeout(autoWidescreenVideo, 100);
                        }
                    }
                }
            }
        }
    }

    // 智能切集
    if (GM_getValue('smartNextPlaySwitch') == 0) {
        var smartNextPlayLock = 0;
        smartNextPlay();
        function smartNextPlay() {
            let smartNextPlayCurrentTime = '';
            let smartNextPlayDurationTime = '';
            let smartNextPlayNextBtn;
            // 如果集数大于1则连播，如果只有一集则不连播
            if (document.getElementById('multi_page') && document.getElementsByClassName('list-box')[0].childElementCount > 1) {
                // 分P
                if (document.getElementsByClassName('bpx-player-ctrl-time-current')[0]) {
                    smartNextPlayCurrentTime = document.getElementsByClassName('bpx-player-ctrl-time-current')[0].textContent;
                    smartNextPlayDurationTime = document.getElementsByClassName('bpx-player-ctrl-time-duration')[0].textContent;
                }
                if (document.getElementsByClassName('bpx-player-ctrl-btn bpx-player-ctrl-next')[0]) {
                    smartNextPlayNextBtn = document.getElementsByClassName('bpx-player-ctrl-btn bpx-player-ctrl-next')[0];
                }
                // 自动改成“播完暂停”
                if (document.getElementsByClassName('bui-radio-text')[1]) {
                    document.getElementsByClassName('bui-radio-text')[1].click();
                }
            } else if (document.getElementsByClassName('base-video-sections')[0] && document.getElementsByClassName('video-section-list section-0')[0].childElementCount > 1) {
                // 合集
                if (document.getElementsByClassName('bpx-player-ctrl-time-current')[0]) {
                    smartNextPlayCurrentTime = document.getElementsByClassName('bpx-player-ctrl-time-current')[0].textContent;
                    smartNextPlayDurationTime = document.getElementsByClassName('bpx-player-ctrl-time-duration')[0].textContent;
                }
                if (document.getElementsByClassName('bpx-player-ctrl-btn bpx-player-ctrl-next')[0]) {
                    smartNextPlayNextBtn = document.getElementsByClassName('bpx-player-ctrl-btn bpx-player-ctrl-next')[0];
                }
                // 自动改成“播完暂停”
                if (document.getElementsByClassName('bui-radio-text')[1]) {
                    document.getElementsByClassName('bui-radio-text')[1].click();
                }
            } else if (document.getElementsByClassName('player-auxiliary-collapse-playlist bui bui-collapse')[0] && document.getElementsByClassName('player-auxiliary-playlist-list')[0].childElementCount > 1) {
                // 列表
                if (document.getElementsByClassName('bilibili-player-video-time-now')[0]) {
                    smartNextPlayCurrentTime = document.getElementsByClassName('bilibili-player-video-time-now')[0].textContent;
                    smartNextPlayDurationTime = document.getElementsByClassName('bilibili-player-video-time-total')[0].textContent;
                }
                if (document.getElementsByClassName('bilibili-player-video-btn  bilibili-player-video-btn-next')[0]) {
                    smartNextPlayNextBtn = document.getElementsByClassName('bilibili-player-video-btn  bilibili-player-video-btn-next')[0];
                }
                // 自动改成“播完暂停”
                if (document.getElementsByClassName('bui-radio-text')[1]) {
                    document.getElementsByClassName('bui-radio-text')[1].click();
                }
            } else if (window.location.href.match('bilibili.com/bangumi/')) {
                // 番剧
                if (document.getElementsByClassName('squirtle-video-time-now')[0]) {
                    smartNextPlayCurrentTime = document.getElementsByClassName('squirtle-video-time-now')[0].textContent;
                    smartNextPlayDurationTime = document.getElementsByClassName('squirtle-video-time-total')[0].textContent;
                }
                if (document.getElementsByClassName('squirtle-iconfont squirtle-video-next squirtle-video-item')[0]) {
                    smartNextPlayNextBtn = document.getElementsByClassName('squirtle-iconfont squirtle-video-next squirtle-video-item')[0];
                }
                // 自动改成“播完暂停”
                if (document.getElementsByClassName('squirtle-single-setting-choice squirtle-aspect-handoff-choice squirtle-handoff-pause')[0]) {
                    document.getElementsByClassName('squirtle-single-setting-choice squirtle-aspect-handoff-choice squirtle-handoff-pause')[0].click();
                }
            }

            if ((smartNextPlayCurrentTime == smartNextPlayDurationTime) && smartNextPlayCurrentTime != '' && smartNextPlayDurationTime != '' && smartNextPlayLock == 0) {
                if (smartNextPlayNextBtn) {
                    smartNextPlayLock = 1;
                    smartNextPlayNextBtn.click();
                    console.log('哔哩哔哩宽屏优化-自动切换下一集');
                }
            }

            if (smartNextPlayCurrentTime != smartNextPlayDurationTime) {
                smartNextPlayLock = 0;
            }
            setTimeout(smartNextPlay, 100)
        }
    }

    var wideCheckEtime = 0;
    if (GM_getValue('autoWidescreenSwitch') == 0) {
        console.log('哔哩哔哩宽屏优化-正在检测宽屏模式');
        wideCheck();
        function wideCheck() {
            if (window.location.href.match('bilibili.com/bangumi/')) {
                // 当前为番剧页
                if (document.getElementsByClassName('squirtle-video-widescreen squirtle-video-item active')[0]) {
                    console.log('哔哩哔哩宽屏优化-宽屏模式已开启');
                    mainScript();
                } else {
                    wideCheckEtime += 100;
                    if (wideCheckEtime >= 8000) {
                        mainScript();
                    } else {
                        setTimeout(wideCheck, 100);
                    }
                }
            } else if (window.location.href.match('bilibili.com/video/')) {
                // 当前为视频页
                if (document.getElementsByClassName('bpx-player-ctrl-btn bpx-player-ctrl-wide bpx-state-entered')[0]) {
                    console.log('哔哩哔哩宽屏优化-宽屏模式已开启');
                    mainScript();
                } else {
                    wideCheckEtime += 100;
                    if (wideCheckEtime >= 8000) {
                        mainScript();
                    } else {
                        setTimeout(wideCheck, 100);
                    }
                }
            } else {
                // 当前为列表页
                if (document.getElementsByClassName('bilibili-player-video-btn bilibili-player-video-btn-widescreen closed')[0]) {
                    console.log('哔哩哔哩宽屏优化-宽屏模式已开启');
                    mainScript();
                } else {
                    wideCheckEtime += 100;
                    if (wideCheckEtime >= 8000) {
                        mainScript();
                    } else {
                        setTimeout(wideCheck, 100);
                    }
                }
            }
        }
    } else if (GM_getValue('autoWidescreenSwitch') == 2) {
        console.log('哔哩哔哩宽屏优化-正在开启MR布局模式');
        wideCheck();
        function wideCheck() {
            if (window.location.href.match('bilibili.com/bangumi/')) {
                // 当前为番剧页
                if (document.getElementsByClassName('squirtle-video-widescreen squirtle-video-item active')[0]) {
                    console.log('哔哩哔哩宽屏优化-宽屏模式已开启');
                    mainScript();
                } else {
                    wideCheckEtime += 100;
                    if (wideCheckEtime >= 8000) {
                        mainScript();
                    } else {
                        setTimeout(wideCheck, 100);
                    }
                }
            } else if (window.location.href.match('bilibili.com/video/')) {
                // 当前为视频页
                if (document.getElementsByClassName('bpx-player-ctrl-time-duration')[0] && document.getElementsByClassName('bpx-player-ctrl-time-duration')[0].textContent.match(':')) {
                    console.log('哔哩哔哩宽屏优化-MR布局模式已开启');
                    mainScript();
                } else {
                    wideCheckEtime += 100;
                    if (wideCheckEtime >= 8000) {
                        mainScript();
                    } else {
                        setTimeout(wideCheck, 100);
                    }
                }
            } else {
                // 当前为列表页
                if (document.getElementsByClassName('bilibili-player-video-btn bilibili-player-video-btn-widescreen closed')[0]) {
                    console.log('哔哩哔哩宽屏优化-宽屏模式已开启');
                    mainScript();
                } else {
                    wideCheckEtime += 100;
                    if (wideCheckEtime >= 8000) {
                        mainScript();
                    } else {
                        setTimeout(wideCheck, 100);
                    }
                }
            }
        }
    }

    function mainScript() {
        if (window.location.href.match('bilibili.com/bangumi/')) {
            // 当前为番剧页

        } else if (window.location.href.match('bilibili.com/video/')) {
            // 当前为视频页
            //
            if (document.getElementsByClassName('v-wrap')[0]) {
                // 旧版界面
                console.log('哔哩哔哩宽屏优化-当前为旧版界面');
                // 移动标题栏和头像栏
                var viewboxCheckEtime = 0;
                viewboxCheck();
                function viewboxCheck() {
                    if (document.getElementById('viewbox_report')) {
                        // 把标题栏移至视频下方
                        $('#viewbox_report').insertAfter('#playerWrap');
                    } else {
                        viewboxCheckEtime += 100;
                        if (viewboxCheckEtime >= 8000) {
                            $('#viewbox_report').insertAfter('#playerWrap');
                        } else {
                            setTimeout(viewboxCheck, 100);
                        }
                    }
                }
                //
                var upinfoCheckEtime = 0;
                upinfoCheck();
                function upinfoCheck() {
                    // 把头像栏移至标题栏下方
                    if (document.getElementById('v_upinfo')) {
                        // 检测头像栏是否加载完毕，如果是则继续运行
                        $('#v_upinfo').insertAfter('#viewbox_report');
                    } else {
                        upinfoCheckEtime += 100;
                        if (upinfoCheckEtime >= 8000) {
                            $('#v_upinfo').insertAfter('#viewbox_report');
                        } else {
                            setTimeout(upinfoCheck, 100);
                        }
                    }
                }
                //
                // 调整标题栏样式
                /*
                为标题栏添加底部横线:横线[border-bottom]
                调整标题栏高度和上下距离:高度[height]顶部间隙[padding-top]底部间隙[padding-bottom]
                */
                // 正常使用.css方法无法添加important后缀，使用cssText强行添加important后缀，想添加某个元素就用cssText，例如：$('a').css('cssText', 'b')，删除某个元素就把后方变量留空，例如：$('a').css('b', '');
                // 移除所有style样式:$('a').removeAttr('style');
                // 改变style样式:由于cssText每次设定都会清除所有style值，所以用document.querySelector('a').style.cssText += '; 1: 1;'
                document.getElementById('viewbox_report').style.cssText += 'border-bottom: 1px solid ' + window.getComputedStyle(document.getElementsByClassName('s_tag')[0], null)['border-bottom-color'] + ' !important; height: 80px !important; padding-top: 16px !important; padding-bottom: 12px !important;';
                //
                // 调整头像栏样式
                /*
                为头像栏添加底部横线:横线[border-bottom]
                调整头像栏高度与标题栏一致:高度[height]顶部间隙[padding-top]底部间隙[padding-bottom]
                */
                if (document.getElementsByClassName('members-info')[0]) {
                    // 联合投稿头像栏额外操作
                    $('.members-info').insertAfter('#viewbox_report');
                    document.getElementsByClassName('members-info')[0].style.cssText += 'border-bottom: 1px solid ' + window.getComputedStyle(document.getElementsByClassName('s_tag')[0], null)['border-bottom-color'] + ' !important; padding-top: 16px !important; padding-bottom: 12px !important;';
                    if (document.getElementsByClassName('members-info__header')[0]) {
                        document.getElementsByClassName('members-info__header')[0].style.cssText += 'margin-top: 0 !important;';
                    } else if (document.getElementsByClassName('wide-members__title')[0]) {
                        document.getElementsByClassName('wide-members__title')[0].style.cssText += 'margin-top: 0 !important;';
                    }
                } else {
                    document.getElementsByClassName('up-info report-wrap-module report-scroll-module')[0].style.cssText += 'border-bottom: 1px solid ' + window.getComputedStyle(document.getElementsByClassName('s_tag')[0], null)['border-bottom-color'] + ' !important; height: 80px !important; padding-top: 16px !important; padding-bottom: 12px !important;';
                    // 调整头像栏宽度
                    /*
                    宽度[width]位置布局[margin]
                    */
                    document.getElementsByClassName('up-info_right')[0].style.cssText += 'width: 100% !important; margin: 6px 0px 0px 62px !important;';
                    // 调整头像右边距离
                    /*
                    位置布局[margin]
                    */
                    document.getElementsByClassName('u-face')[0].style.cssText += 'margin: 2px -48px 0px 0px !important;';
                    // 调整名称
                    /*
                    调整名称高度:高度[line-height]
                    调整名称左边间距:位置布局[margin]
                    */
                    // document.getElementsByClassName('name')[0].style.cssText += 'line-height: 24px !important; margin: 4px 0px 0px 62px !important';
                    // 调整介绍
                    /*
                    调整介绍高度:顶部距离[margin-top]
                    调整介绍宽度:宽度[width]
                    */
                    // document.getElementsByClassName('desc')[0].style.cssText += 'width: 45% !important;';
                    // 调整充电和关注按钮
                    /*
                    调整充电和关注按钮与头像平齐:位置布局[margin]
                    调整充电和关注按钮高度和宽度:高度[height]位置布局[margin]
                    */
                    document.getElementsByClassName('default-btn follow-btn btn-transition b-gz')[0].style.cssText += 'height: 48px !important; margin: 0px 0px 0px auto !important;';
                    document.getElementsByClassName('btn-panel')[0].style.cssText += 'margin: -44px 6px 0px 0px !important;';
                    if (document.getElementsByClassName('default-btn charge-btn')[0]) {
                        document.getElementsByClassName('default-btn charge-btn btn-transition')[0].style.cssText += 'height: 48px !important;';
                        // 如果存在充电按钮则移除关注按钮的一个布局属性
                        document.getElementsByClassName('default-btn follow-btn btn-transition b-gz')[0].style.margin = '';
                    }
                }
                // 调整三连栏底部横线样式
                /*
                横线[border-bottom]
                */
                document.getElementsByClassName('video-toolbar report-wrap-module report-scroll-module')[0].style.cssText += 'border-bottom: 1px solid ' + window.getComputedStyle(document.getElementsByClassName('s_tag')[0], null)['border-bottom-color'] + ' !important;';
                // 额外循环判断底部横线颜色，快速循环8秒后进入缓慢循环判断模式
                var borderColorCheckEtime = 0;
                var borderColorCheckForeverSwitch = 0;
                borderColorCheck();
                function borderColorCheck() {
                    function borderColorCheckFunction() {
                        // 标题栏的横线颜色
                        document.getElementsByClassName('video-info report-wrap-module report-scroll-module')[0].style.cssText += 'border-bottom-color: ' + window.getComputedStyle(document.getElementsByClassName('s_tag')[0], null)['border-bottom-color'] + ' !important;';
                        // 头像栏的横线颜色
                        if (!document.getElementsByClassName('members-info')[0]) {
                            document.getElementsByClassName('up-info report-wrap-module report-scroll-module')[0].style.cssText += 'border-bottom-color: ' + window.getComputedStyle(document.getElementsByClassName('s_tag')[0], null)['border-bottom-color'] + ' !important;';
                        } else {
                            // 联合投稿头像栏额外操作
                            document.getElementsByClassName('members-info')[0].style.cssText += 'border-bottom-color: ' + window.getComputedStyle(document.getElementsByClassName('s_tag')[0], null)['border-bottom-color'] + ' !important;';
                            if (document.getElementsByClassName('members-info__header')[0]) {
                                document.getElementsByClassName('members-info__header')[0].style.cssText += 'margin-top: 0 !important;';
                            } else if (document.getElementsByClassName('wide-members__title')[0]) {
                                document.getElementsByClassName('wide-members__title')[0].style.cssText += 'margin-top: 0 !important;';
                            }
                        }
                        // 三连栏的横线颜色
                        document.getElementsByClassName('video-toolbar report-wrap-module report-scroll-module')[0].style.cssText += 'border-bottom-color: ' + window.getComputedStyle(document.getElementsByClassName('s_tag')[0], null)['border-bottom-color'] + ' !important;';
                    }
                    // 判断自定义的横线和标准横线的颜色是否一致，如果你想用JQ写可以用$('xxx').css('cssText', $('xxx').css('cssText') + 'XXX !important;');
                    if (document.getElementsByClassName('video-info report-wrap-module report-scroll-module')[0].style.borderBottomColor
                        != window.getComputedStyle(document.getElementsByClassName('s_tag')[0], null)['border-bottom-color']) {
                        borderColorCheckFunction();
                        // 开启永久循环判断
                        borderColorCheckForeverSwitch = 1;
                    } else {
                        borderColorCheckEtime += 100;
                        if (borderColorCheckEtime >= 8000) {
                            borderColorCheckFunction();
                            // 开启永久循环判断
                            borderColorCheckForeverSwitch = 1;
                        } else {
                            setTimeout(borderColorCheck, 100);
                        }
                    }
                    if (borderColorCheckForeverSwitch == 1) {
                        borderColorCheckFunction();
                        // 每隔一段时间判断一次
                        setTimeout(borderColorCheck, 1000);
                    }
                }
            } else {
                // 新版界面
                console.log('哔哩哔哩宽屏优化-当前为新版界面');
                // MR布局模式
                if (GM_getValue('autoWidescreenSwitch') == 2) {
                    // 移动标题栏和头像栏
                    var viewboxCheckEtime = 0;
                    viewboxCheck();
                    function viewboxCheck() {
                        if (document.getElementById('viewbox_report')) {
                            // 把标题栏移至视频下方
                            $('#viewbox_report').insertAfter('#playerWrap');
                        } else {
                            viewboxCheckEtime += 100;
                            if (viewboxCheckEtime >= 8000) {
                                $('#viewbox_report').insertAfter('#playerWrap');
                            } else {
                                setTimeout(viewboxCheck, 100);
                            }
                        }
                    }
                    //
                    var upinfoCheckEtime = 0;
                    upinfoCheck();
                    function upinfoCheck() {
                        // 把头像栏移至三连栏上方
                        if (document.getElementById('v_upinfo')) {
                            // 检测头像栏是否加载完毕，如果是则继续运行
                            $('#v_upinfo').insertBefore('#arc_toolbar_report');
                        } else {
                            upinfoCheckEtime += 100;
                            if (upinfoCheckEtime >= 8000) {
                                $('#v_upinfo').insertBefore('#arc_toolbar_report');
                            } else {
                                setTimeout(upinfoCheck, 100);
                            }
                        }
                    }
                    var MRLayoutLoopTimeout = 0;
                    MRLayoutLoop();
                    function MRLayoutLoop() {
                        // 把视频播放器移到最上面
                        if (document.getElementsByClassName('player-wrap')[0] && document.getElementById('biliMainHeader')) {
                            $('.player-wrap').insertBefore('#biliMainHeader');
                        }
                        // 在播放器中显示标题名
                        if (document.getElementsByClassName('bpx-player-top-left-title')[0]) {
                            GM_addStyle('.bpx-player-top-left-title {display: block !important;}');
                            // 上方阴影
                            document.getElementsByClassName('bpx-player-top-mask')[0].style.cssText += 'display: block !important;';
                        }
                        // 调整导航栏布局
                        if (document.getElementsByClassName('bili-header__bar mini-header')[0]) {
                            document.getElementsByClassName('bili-header__bar mini-header')[0].style.cssText += 'position: relative !important; padding: 0 24px !important; z-index: 10 !important;';
                            document.getElementById('biliMainHeader').style.cssText = 'z-index: 10 !important;';
                        }
                        // 隐藏哔哩哔哩导航栏左侧无用按钮
                        if (document.getElementsByClassName('left-entry')[0]) {
                            for (let index = 0; index < document.getElementsByClassName('left-entry')[0].children.length; index++) {
                                if (index != 0) {
                                    document.getElementsByClassName('left-entry')[0].children[index].style.cssText = 'display: none !important;';
                                }
                            }
                        }
                        // 调整导航栏左侧右边空隙
                        if (document.getElementsByClassName('left-entry')[0]) {
                            document.getElementsByClassName('left-entry')[0].style.cssText += 'margin: 0px 10px 0px 0px !important;';
                        }
                        // 调整搜索框布局
                        /*
                        1. 调整搜索框左右空隙
                        2. 调整搜索框最大和最小长度
                        */
                        if (document.getElementsByClassName('center-search-container offset-center-search')[0]) {
                            document.getElementsByClassName('center-search__bar')[0].style.cssText += 'margin: 0px 10px 0px 0px !important; max-width: 100% !important;';
                        }
                        // 调整弹幕控件顶部空隙
                        if (document.getElementsByClassName('danmaku-box')[0]) {
                            document.getElementsByClassName('danmaku-box')[0].style.cssText += 'padding: 16px 0px 0px 0px !important;';
                        }
                        // 调整下方布局
                        if (document.getElementsByClassName('video-container-v1')[0]) {
                            document.getElementsByClassName('video-container-v1')[0].style.cssText += 'justify-content: unset !important; padding: 0 24px !important;';
                        }
                        // 左侧
                        if (document.getElementsByClassName('left-container')[0]) {
                            document.getElementsByClassName('left-container')[0].style.cssText += 'width: 100% !important; overFlow: hidden !important;';
                        }
                        // 右侧
                        // if (document.getElementsByClassName('right-container')[0]) {
                        //     document.getElementsByClassName('right-container')[0].style.cssText += 'width: 500px !important;';
                        // }
                        // 调整播放器大小
                        if (document.getElementById('bilibili-player')) {
                            document.getElementById('bilibili-player').style.cssText += 'width: 100% !important; height: 100vh !important;';
                        }
                        // 调整播放器父类大小和z轴
                        if (document.getElementsByClassName('player-wrap')[0]) {
                            document.getElementsByClassName('player-wrap')[0].style.cssText += 'height: auto !important; z-index: 50 !important;';
                        }
                        // 调整播放器下方工具栏左右空隙
                        // if (document.getElementsByClassName('bpx-player-sending-bar')[0]) {
                        //     document.getElementsByClassName('bpx-player-sending-bar')[0].style.cssText += 'padding: 0 24px !important;';
                        // }
                        // 移动弹幕控件到播放器里
                        if (document.getElementsByClassName('bpx-player-control-bottom-center')[0] && document.getElementsByClassName('bpx-player-dm-root')[0]) {
                            $('.bpx-player-control-bottom-center').append($('.bpx-player-sending-area'));
                            // 调整播放器工具栏中间布局宽度为100%，并调整左右空隙
                            document.getElementsByClassName('bpx-player-control-bottom-center')[0].style.cssText = 'width: 100% !important; padding: 0 !important;';
                            // 播放器工具栏中间加背景
                            document.getElementsByClassName('bpx-player-dm-root')[0].style.cssText = 'background: rgba(0, 0, 0, 0.2) !important; border-radius: 10px !important; padding: 1px 2px 1px 6px !important;';
                            // 调整播放器工具栏高度
                            GM_addStyle('.bpx-player-sending-bar {height: 22px !important;}');
                            // 调整播放器工具栏左侧工具空隙
                            document.getElementsByClassName('bpx-player-control-bottom-left')[0].style.cssText = 'min-width: auto !important;';
                            // 隐藏信息栏
                            if (GM_getValue('MRLayoutPlayerInfoSwitch') == 0) {
                                document.getElementsByClassName('bpx-player-video-info')[0].style.cssText = 'fill: #fff !important; color: hsla(0,0%,100%,.8) !important; display: flex !important;';
                            } else {
                                document.getElementsByClassName('bpx-player-video-info')[0].style.cssText = 'display: none !important;';
                            }
                            // 弹幕发送栏背景改为透明，修改左右空隙，高度
                            document.getElementsByClassName('bpx-player-sending-bar')[0].style.cssText = 'background: transparent !important; padding: 0px 20px 0px 0px !important; max-width: none !important;';
                            // 删掉横线
                            GM_addStyle('.bpx-player-sending-area:before {display: none !important;}');
                            // 弹幕开关样式
                            document.getElementsByClassName('bpx-player-dm-switch bui bui-danmaku-switch')[0].style.cssText = 'fill: #fff !important; color: hsla(0,0%,100%,.8) !important;';
                            // 弹幕设置样式
                            document.getElementsByClassName('bpx-player-dm-setting')[0].style.cssText = 'fill: #fff !important; color: hsla(0,0%,100%,.8) !important;';
                            // 弹幕设置菜单修正
                            document.getElementsByClassName('bpx-player-dm-setting-box bui bui-panel bui-dark')[0].style.cssText = 'overflow: unset !important;';
                            // 调整发送弹幕背景色，大小
                            if (document.getElementsByClassName('bpx-player-video-inputbar focus bpx-player-checkBox-hide')[0]) {
                                document.getElementsByClassName('bpx-player-video-inputbar focus bpx-player-checkBox-hide')[0].style.cssText = 'width: 100% !important; 100% !important; background: hsla(0,0%,100%,.6) !important;';
                            }
                            // 调整字体设置按钮颜色
                            document.getElementsByClassName('bpx-player-video-btn-dm')[0].style.cssText = 'fill: #fff !important;';
                            // 调整发送弹幕提示文本颜色
                            document.getElementsByClassName('bpx-player-dm-wrap')[0].style.cssText = 'color: hsla(0,0%,100%,.6) !important; display: none !important;';
                            // 改掉输入框内文本
                            document.getElementsByClassName('bpx-player-dm-input')[0].style.cssText = 'color: hsla(0,0%,100%,.6) !important;';
                            // GM_addStyle('::-webkit-input-placeholder {color: hsla(0,0%,100%,.6) !important;}');
                            // 调整弹幕礼仪按钮样式
                            document.getElementsByClassName('bpx-player-dm-hint')[0].children[0].style.cssText = 'color: hsla(0,0%,100%,.6) !important; fill: hsla(0,0%,100%,.6) !important;';
                        }
                        // 显示选集按钮
                        if (document.getElementsByClassName('bpx-player-ctrl-btn bpx-player-ctrl-eplist')[0]) {
                            document.getElementsByClassName('bpx-player-ctrl-btn bpx-player-ctrl-eplist')[0].style.cssText += 'width: 54px !important; visibility: visible !important;';
                        }
                        //
                        if (!document.getElementsByClassName('center-search-container offset-center-search')[0] || MRLayoutLoopTimeout < 1000) {
                            MRLayoutLoopTimeout += 200;
                            setTimeout(MRLayoutLoop, 200);
                        } else {
                            // 调整新版反馈和回到旧版按钮到导航栏上
                            if (document.getElementsByClassName('fixed-nav')[0]) {
                                $('.fixed-nav').insertAfter('.left-entry');
                            }
                            // 新版反馈和旧版按钮样式调整
                            // 父类
                            if (document.getElementsByClassName('fixed-nav')[0]) {
                                document.getElementsByClassName('fixed-nav')[0].style.cssText += 'position: relative !important; right: 0 !important; bottom: 0 !important;';
                            }
                            // 子类
                            if (document.getElementsByClassName('nav-menu')[0]) {
                                document.getElementsByClassName('nav-menu')[0].style.cssText += 'display: flex !important; margin: 14px 0px 0px 0px !important;';
                            }
                            // 新版反馈按钮
                            if (document.getElementsByClassName('nav-menu')[0] && document.getElementsByClassName('nav-menu')[0].children[0]) {
                                document.getElementsByClassName('nav-menu')[0].children[0].style.cssText += 'margin: 0px 10px 0px 0px !important;';
                                document.getElementsByClassName('nav-menu')[0].children[1].style.cssText += 'margin: 0px 10px 12px 0px !important;';
                            }
                        }
                        // 去掉评论上方横线
                        GM_addStyle('.reply-box.fixed-box[data-v-3a2b3e5a] {border-top: 0 !important;}');
                    }
                } else {
                    // 移动标题栏和头像栏
                    var viewboxCheckEtime = 0;
                    viewboxCheck();
                    function viewboxCheck() {
                        if (document.getElementById('viewbox_report')) {
                            // 把标题栏移至视频下方
                            $('#viewbox_report').insertAfter('#playerWrap');
                        } else {
                            viewboxCheckEtime += 100;
                            if (viewboxCheckEtime >= 8000) {
                                $('#viewbox_report').insertAfter('#playerWrap');
                            } else {
                                setTimeout(viewboxCheck, 100);
                            }
                        }
                    }
                    //
                    var upinfoCheckEtime = 0;
                    upinfoCheck();
                    function upinfoCheck() {
                        // 把头像栏移至标题栏下方
                        if (document.getElementById('v_upinfo')) {
                            // 检测头像栏是否加载完毕，如果是则继续运行
                            $('#v_upinfo').insertAfter('#viewbox_report');
                        } else {
                            upinfoCheckEtime += 100;
                            if (upinfoCheckEtime >= 8000) {
                                $('#v_upinfo').insertAfter('#viewbox_report');
                            } else {
                                setTimeout(upinfoCheck, 100);
                            }
                        }
                    }
                }
                //
                // 调整标题栏样式
                /*
                为标题栏添加底部横线:横线[border-bottom]
                调整标题栏高度:高度[height]顶部间隙[padding-top]底部间隙[padding-bottom]
                */
                if (document.getElementsByClassName('video-info-v1')[0] && document.getElementsByClassName('s_tag-v1')[0]) {
                    document.getElementsByClassName('video-info-v1')[0].style.cssText += 'border-bottom: 1px solid ' + window.getComputedStyle(document.getElementsByClassName('s_tag-v1')[0], null)['border-bottom-color'] + ' !important; height: 86px !important; padding-top: 16px !important; padding-bottom: 12px !important;';
                }
                //
                // 调整头像栏样式
                /*
                为头像栏添加底部横线:横线[border-bottom]
                调整头像栏高度与标题栏一致:高度[height]顶部间隙[padding-top]底部间隙[padding-bottom]位置布局[margin]
                */
                if (document.getElementsByClassName('members-info-v1')[0]) {
                    // 联合投稿头像栏额外操作
                    $('.members-info-v1').insertAfter('#viewbox_report');
                    document.getElementsByClassName('members-info-v1')[0].style.cssText += 'border-bottom: 1px solid ' + window.getComputedStyle(document.getElementsByClassName('s_tag-v1')[0], null)['border-bottom-color'] + ' !important; padding-top: 16px !important; padding-bottom: 12px !important;';
                } else {
                    // 当不是联合投稿时
                    document.getElementsByClassName('up-info-v1')[0].style.cssText += 'border-bottom: 1px solid ' + window.getComputedStyle(document.getElementsByClassName('s_tag-v1')[0], null)['border-bottom-color'] + ' !important; height: 86px !important; padding-top: 16px !important; padding-bottom: 12px !important; margin: 0px 0px 0px 0px !important;';
                    // 调整头像右侧信息/关注宽度
                    /*
                    宽度[width]左侧距离[margin-left]
                    */
                    document.getElementsByClassName('up-info_right')[0].style.cssText += 'width: 100% !important; margin-left: 0px !important;';
                    // 调整头像位置
                    /*
                    位置布局[margin]
                    */
                    if (document.getElementsByClassName('u-face')[0]) {
                        document.getElementsByClassName('u-face')[0].style.cssText += 'margin: 4px 0px 0px 0px !important;';
                    }
                    // 调整头像栏有装饰时的位置
                    /*
                    宽度[width]高度[height]布局中位置[position]
                    */
                    if (document.getElementsByClassName('u-face has-pendant')[0] && document.getElementsByClassName('u-face__avatar avatar-loaded')[0]) {
                        // 存在头像装饰
                        document.getElementsByClassName('u-face has-pendant')[0].style.cssText += 'width: 48px !important; height: 48px !important;';
                        document.getElementsByClassName('u-face__avatar avatar-loaded')[0].style.cssText += 'width: 40px !important; height: 40px !important; position: unset !important;';
                    }
                    // 调整名称
                    /*
                    调整名称高度:位置布局[margin]
                    */
                    if (document.getElementsByClassName('desc')[0].getAttribute('title') != null) {
                        document.getElementsByClassName('up-info_right')[0].style.cssText += 'padding-top: 4px !important; margin: 0px 0px 0px 14px !important;';
                    } else {
                        document.getElementsByClassName('up-info_right')[0].style.cssText += 'padding-top: 16px !important; margin: 0px 0px 0px 14px !important;';
                    }
                    // 调整介绍
                    /*
                    调整介绍高度:位置布局[margin]
                    调整介绍宽度:宽度[width]顶部间隙[padding-top]
                    */
                    if (document.getElementsByClassName('desc')[0].getAttribute('title') != null) {
                        document.getElementsByClassName('desc')[0].style.cssText += 'margin: 0px 0px 0px 0px !important; width: 54% !important;';
                    }
                    // 调整充电和关注按钮
                    /*
                    调整充电和关注按钮与头像平齐:位置布局[margin]对其位置[float]
                    调整充电和关注按钮高度和宽度:高度[height]宽度[width]右侧距离[margin-right]
                    */
                    // 整体
                    if (document.getElementsByClassName('desc')[0].getAttribute('title') != null) {
                        document.getElementsByClassName('btn-panel')[0].style.cssText += 'margin: -42px 0px 0px 0px !important; float: right !important; height: 48px !important;';
                    } else {
                        document.getElementsByClassName('btn-panel')[0].style.cssText += 'margin: -38px 0px 0px 0px !important; float: right !important; height: 48px !important;';
                    }
                    // 关注按钮
                    document.getElementsByClassName('default-btn follow-btn btn-transition b-gz')[0].style.cssText += 'width: 120px !important; margin-right: 10px !important; height: 48px !important;';
                    // 充电按钮
                    GM_addStyle('.default-btn {width: 70px !important; height: 48px !important;}');
                    // if (document.getElementsByClassName('default-btn')[0]) {
                    //     document.getElementsByClassName('default-btn')[0].style.cssText += 'width: 70px !important; height: 48px !important;';
                    // }
                }
                //
                // 额外循环判断底部横线颜色
                var borderColorCheckEtime = 0;
                var borderColorCheckForeverSwitch = 0;
                borderColorCheck();
                function borderColorCheck() {
                    function borderColorCheckFunction() {
                        // 判断自定义的横线和标准横线的颜色是否一致，如果不一致则改为一致
                        // 标题栏的横线颜色
                        document.getElementsByClassName('video-info-v1')[0].style.cssText += 'border-bottom-color: ' + window.getComputedStyle(document.getElementsByClassName('s_tag-v1')[0], null)['border-bottom-color'] + ' !important;';
                        // 头像栏的横线颜色
                        if (!document.getElementsByClassName('members-info-v1')[0]) {
                            document.getElementsByClassName('up-info-v1')[0].style.cssText += 'border-bottom-color: ' + window.getComputedStyle(document.getElementsByClassName('s_tag-v1')[0], null)['border-bottom-color'] + ' !important;';
                        } else {
                            document.getElementsByClassName('members-info-v1')[0].style.cssText += 'border-bottom-color: ' + window.getComputedStyle(document.getElementsByClassName('s_tag-v1')[0], null)['border-bottom-color'] + ' !important;';
                        }
                    }
                    if (document.getElementsByClassName('video-info-v1')[0].style.borderBottomColor
                        != window.getComputedStyle(document.getElementsByClassName('s_tag-v1')[0], null)['border-bottom-color']) {
                        borderColorCheckFunction();
                        // 开启永久循环判断
                        borderColorCheckForeverSwitch = 1;
                    } else {
                        borderColorCheckEtime = borderColorCheckEtime + 100;
                        if (borderColorCheckEtime >= 8000) {
                            borderColorCheckFunction();
                            // 开启永久循环判断
                            borderColorCheckForeverSwitch = 1;
                        } else {
                            setTimeout(borderColorCheck, 100);
                        }
                        if (borderColorCheckForeverSwitch == 1) {
                            borderColorCheckFunction();
                            // 每隔一段时间判断一次
                            setTimeout(borderColorCheck, 1000);
                        }
                    }
                }
            }
        } else {
            // 当前为列表页
            console.log('哔哩哔哩宽屏优化-当前为列表界面');
            var viewboxCheckEtime = 0;
            viewboxCheck();
            function viewboxCheck() {
                if (document.getElementById('viewbox_report')) {
                    // 把标题栏移至视频下方
                    $('#viewbox_report').insertAfter('#video-player');
                } else {
                    viewboxCheckEtime += 100;
                    if (viewboxCheckEtime >= 8000) {
                        $('#viewbox_report').insertAfter('#video-player');
                    } else {
                        setTimeout(viewboxCheck, 100);
                    }
                }
                //
                // 调整标题栏样式
                /*
                为标题栏添加底部横线:横线颜色[border-bottom-color]横线粗细[border-bottom]
                调整标题栏高度和上下距离:高度[height]顶部间隙[padding-top]底部间隙[padding-bottom]
                */
                // 正常使用.css方法无法添加important后缀，使用cssText强行添加important后缀，想添加某个元素就用cssText，例如：$('a').css('cssText', 'b')，删除某个元素就把后方变量留空，例如：$('a').css('b', '');
                document.getElementsByClassName('video-info report-wrap-module report-scroll-module')[0].style.cssText += 'border-bottom: 1px solid ' + window.getComputedStyle(document.getElementsByClassName('s_tag')[0], null)['border-bottom-color'] + ' !important; height: 80px !important; padding-top: 16px !important; padding-bottom: 12px !important;';
            }
            //
            var upinfoCheckEtime = 0;
            upinfoCheck();
            function upinfoCheck() {
                // 把头像栏移至标题栏下方
                if (document.getElementById('v_upinfo')) {
                    // 检测头像栏是否加载完毕，如果是则继续运行
                    $('#v_upinfo').insertAfter('#viewbox_report');
                } else {
                    upinfoCheckEtime += 100;
                    if (upinfoCheckEtime >= 8000) {
                        $('#v_upinfo').insertAfter('#viewbox_report');
                    } else {
                        setTimeout(upinfoCheck, 100);
                    }
                }
                //
                // 调整头像栏样式
                /*
                为头像蓝添加底部横线:横线颜色[border-bottom-color]横线粗细[border-bottom]
                调整头像栏高度与标题栏一致:高度[height]顶部间隙[padding-top]底部间隙[padding-bottom]
                */
                if (document.getElementsByClassName('members-info')[0]) {
                    //联合投稿头像栏额外操作
                    $('.members-info').insertAfter('#viewbox_report');
                    document.getElementsByClassName('members-info')[0].style.cssText += 'border-bottom: 1px solid ' + window.getComputedStyle(document.getElementsByClassName('s_tag')[0], null)['border-bottom-color'] + ' !important; padding-top: 16px !important; padding-bottom: 12px !important;';
                    if (document.getElementsByClassName('members-info__header')[0]) {
                        document.getElementsByClassName('members-info__header')[0].style.cssText += 'margin-top: 0 !important;';
                    } else if (document.getElementsByClassName('wide-members__title')[0]) {
                        document.getElementsByClassName('wide-members__title')[0].style.cssText += 'margin-top: 0 !important;';
                    }
                } else if (document.getElementById('v_upinfo')) {
                    document.getElementsByClassName('up-info report-wrap-module report-scroll-module')[0].style.cssText += 'border-bottom: 1px solid ' + window.getComputedStyle(document.getElementsByClassName('s_tag')[0], null)['border-bottom-color'] + ' !important; height: 80px !important; padding-top: 16px !important; padding-bottom: 12px !important;';
                    // 调整头像栏宽度
                    /*
                    宽度[width]位置布局[margin]
                    */
                    document.getElementsByClassName('up-info_right')[0].style.cssText += 'width: 100% !important; margin: 6px 0px 0px 62px !important;';
                    // 调整头像右边距离
                    /*
                    位置布局[margin]
                    */
                    document.getElementsByClassName('u-face')[0].style.cssText += 'margin: 2px -48px 0px 0px !important;';
                    // 调整名称
                    /*
                    调整名称高度:高度[line-height]
                    调整名称左边间距:位置布局[margin]
                    */
                    // 调整介绍
                    /*
                    调整介绍高度:顶部距离[margin-top]
                    调整介绍宽度:宽度[width]
                    */
                    // document.getElementsByClassName('desc')[0].style.cssText += 'width: 45% !important;';
                    // $('.up-info.up-info_right.name').css('cssText', 'line-height: 24px !important; margin: 4px 0px 0px 62px !important');
                    // 调整充电和关注按钮
                    /*
                    调整充电和关注按钮与头像平齐:位置布局[margin]
                    调整充电和关注按钮高度和宽度:高度[height]位置布局[margin]
                    */
                    document.getElementsByClassName('default-btn follow-btn btn-transition b-gz')[0].style.cssText += 'height: 48px !important; margin: 0px 0px 0px auto !important;';
                    document.getElementsByClassName('btn-panel')[0].style.cssText += 'margin: -44px 6px 0px 0px !important;';
                    if (document.getElementsByClassName('default-btn charge-btn')[0]) {
                        document.getElementsByClassName('default-btn charge-btn btn-transition')[0].style.cssText += 'height: 48px !important;';
                        // 如果存在充电按钮则移除关注按钮的一个布局属性
                        document.getElementsByClassName('default-btn follow-btn btn-transition b-gz')[0].style.margin = '';
                    }
                }
            }
            //
            var mediaListCheckEtime = 0;
            mediaListScript();
            function mediaListScript() {
                if (document.getElementsByClassName('v-wrap')[0]) {
                    // 调整三连栏底部横线样式
                    /*
                    横线[border-bottom]
                    */
                    document.getElementsByClassName('video-toolbar report-wrap-module report-scroll-module')[0].style.cssText += 'border-bottom: 1px solid ' + window.getComputedStyle(document.getElementsByClassName('s_tag')[0], null)['border-bottom-color'] + ' !important;';
                    // 额外循环判断底部横线颜色
                    var borderColorCheckEtime = 0;
                    var borderColorCheckForeverSwitch = 0;
                    borderColorCheck();
                    function borderColorCheck() {
                        function borderColorCheckFunction() {
                            document.getElementsByClassName('video-info report-wrap-module report-scroll-module')[0].style.cssText += 'border-bottom-color: ' + window.getComputedStyle(document.getElementsByClassName('s_tag')[0], null)['border-bottom-color'] + ' !important;';
                            // 头像栏的横线颜色
                            if (document.getElementById('v_upinfo')) {
                                document.getElementsByClassName('up-info report-wrap-module report-scroll-module')[0].style.cssText += 'border-bottom-color: ' + window.getComputedStyle(document.getElementsByClassName('s_tag')[0], null)['border-bottom-color'] + ' !important;';
                            } else if (document.getElementsByClassName('members-info')[0]) {
                                //联合投稿头像栏额外操作
                                document.getElementsByClassName('members-info')[0].style.cssText += 'border-bottom-color: ' + window.getComputedStyle(document.getElementsByClassName('s_tag')[0], null)['border-bottom-color'] + ' !important;';
                                if (document.getElementsByClassName('members-info__header')[0]) {
                                    document.getElementsByClassName('members-info__header')[0].style.cssText += 'margin-top: 0 !important;';
                                } else if (document.getElementsByClassName('wide-members__title')[0]) {
                                    document.getElementsByClassName('wide-members__title')[0].style.cssText += 'margin-top: 0 !important;';
                                }
                            }
                            // 三连栏的横线颜色
                            document.getElementsByClassName('video-toolbar report-wrap-module report-scroll-module')[0].style.cssText += 'border-bottom-color: ' + window.getComputedStyle(document.getElementsByClassName('s_tag')[0], null)['border-bottom-color'] + ' !important;';
                        }
                        if (document.getElementsByClassName('video-info report-wrap-module report-scroll-module')[0].style.borderBottomColor
                            != window.getComputedStyle(document.getElementsByClassName('s_tag')[0], null)['border-bottom-color']) {
                            // 判断自定义的横线和标准横线的颜色是否一致，如果不一致则改为一致
                            // 标题栏的横线颜色
                            borderColorCheckFunction();
                            // 开启永久循环判断
                            borderColorCheckForeverSwitch = 1;
                        } else {
                            borderColorCheckEtime = borderColorCheckEtime + 100;
                            if (borderColorCheckEtime >= 8000) {
                                // 标题栏的横线颜色
                                borderColorCheckFunction();
                                // 开启永久循环判断
                                borderColorCheckForeverSwitch = 1;
                            } else {
                                setTimeout(borderColorCheck, 100);
                            }
                        }
                        if (borderColorCheckForeverSwitch == 1) {
                            borderColorCheckFunction();
                            // 每隔一段时间判断一次
                            setTimeout(borderColorCheck, 1000);
                        }
                    }
                } else {
                    mediaListCheckEtime = mediaListCheckEtime + 100;
                    if (mediaListCheckEtime < 5000) {
                        setTimeout(mediaListScript, 100);
                    }
                }
            }
        }
        window.scrollTo(0, 0);
    }
})();