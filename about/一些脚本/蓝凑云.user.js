// ==UserScript==
// @name  酷安-蓝奏云 重定向
// @namespace  coolapk_lanzou_redirect
// @version  2.0
// @description  此脚本能够将酷安拦截页重定向至相应蓝奏云页面
// @icon  https://www.coolapk.com/favicon.ico
// @author  2943398@CoolApk
// @match  *://www.coolapk.com/link*
// @grant  none
// ==/UserScript==

(function () {

    // 引号内是最终打开的蓝奏云域名
    var target_lz_domain = "pan.lanzouq.com";
    // 若该域名失效可手动修改

    var current_url = window.location.href;

    if (current_url.match(/^https?:\/\/www\.coolapk.com\/link\?url=(https?((:\/\/)|(%3A%2F%2F)))?([\w-]+\.)?lanzou\w\.com(\/|%2F)\S+$/i)){
        var target_content = current_url.replace(/^https?:\/\/www\.coolapk\.com\/link\?url=[^.]*\.?lanzou\w\.com(\/|%2F)(\S+)$/i, '$2');
    };

    if ( target_content ) {
        var target_url = "https://" + target_lz_domain + "/" + target_content;
        //alert("Going to: " + target_url);
        window.location.href = target_url;
    };

})();

