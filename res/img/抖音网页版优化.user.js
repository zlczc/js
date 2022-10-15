// ==UserScript==
// @name 抖音网页版优化
// @description 抖音网页版推荐、直播优化，网页全屏，全黑，自动按浏览器窗口调整大小
// @namespace https://space.bilibili.com/482343
// @author 古海沉舟
// @license 古海沉舟
// @version 1.6.1
// @include https://www.douyin.com/recommend
// @include https://www.douyin.com/*
// @include https://www.douyin.com/?*
// @include https://www.douyin.com/follow
// @include https://live.douyin.com/*
// @require https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @run-at document-end
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_addValueChangeListener
// @noframes
// ==/UserScript==

var lastindex=0;

function keydown(event) {
    //console.log(event.keyCode);
    if(event.keyCode == 109 || event.keyCode == 189){ // 按-或者小键盘-
        pagefullscreen();
    }
}
document.addEventListener('keydown', keydown, false);

var haspagefullscreen=0;
function pagefullscreen(){
    var is=0;
    //$(`#slidelist > div > div.swiper-wrapper > div.swiper-slide-active xg-icon.xgplayer-page-full-screen > div.xgplayer-icon`).click();
    $(`#slidelist > div > div.swiper-wrapper > div.swiper-slide-active xg-icon.xgplayer-page-full-screen > div.xgplayer-icon`).each(function(){
        haspagefullscreen=1;
        $(this).click();
        is=1;
    })
    if (is){return}
        console.log("非推荐");
    $(`xg-controls xg-icon>div > div:nth-child(2)`).each(function(){
        if ($(this).parent().text().indexOf("网页全屏")<0)return;
        console.log("判断：",$(this).text(),"  ",$(this)[0]);
        haspagefullscreen=1;
        $(this).click();
    })

}
var firstfullscreen=setInterval(function(){
    if (haspagefullscreen){
        clearInterval(firstfullscreen);
        return;
    }
    pagefullscreen();
},1000);


function addCSS(){
    let wdstyle = document.createElement('style');
    wdstyle.classList.add("optimize");
    wdstyle.innerHTML = `
div.gNyVUu_s,.OaNxZqFU img,.iRX47Q8q img{display:none!important}
.qdcce5kG .VFMR0HAe{background:#0000 !important}
.vLt8mbfQ .y8iJbHin .mMOxHVzv,.vLt8mbfQ .y8iJbHin .rrKCA47Q,div.webcast-chatroom,.BasEuG5Q ._QjzkgP3,.OaNxZqFU{background:#000 !important}
.Npz7CPXj,div.webcast-chatroom .webcast-chatroom___input-container .webcast-chatroom___textarea{background:#111 !important}
div.JwGiJkkI,div.xgplayer-dynamic-bg,div.umOY7cDY,div.ruqvqPsH{display:none !important}
.pgQgzInF.hqONwptG .Jf1GlewW.Ox89VrU5,.ckEyweZa.AmXnh1GR .QICHGW7r.RosH2lNv,.SxCiQ8ip.V6Va18Np .EDvjMGPs.FKQqfehj{
    height: 100% !important;
}
div.immersive-player-switch-on-hide-interaction-area{opacity:0.4 !important}
.xgplayer-playswitch .xgplayer-playswitch-tab{opacity:0 !important}
div.xgplayer-playswitch-tab:hover,div.immersive-player-switch-on-hide-interaction-area:hover{opacity:1 !important}
`
    document.body.appendChild(wdstyle);
}
addCSS();