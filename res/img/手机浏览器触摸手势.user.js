// ==UserScript==
// @name		手机浏览器触摸手势
// @name:en		Mobile browser touch gestures
// @description	为手机浏览器添加触摸手势功能，例如↓↑回到顶部，↑↓回到底部，→←后退，←→前进，→↓关闭标签页，→↑恢复刚关闭的页面等。还有特殊的文字手势、图片手势和视频手势，还可自定义你的手势功能。推荐使用Kiwi浏览器、Yandex浏览器和狐猴浏览器。
// @description:en	Add touch gestures to mobile browsers. For example, ↓↑: go to the top, ↑↓: go to the bottom, →←: go back, ←→: go forward, →↓: closes the tab, →↑: restores just closed page, etc. There are also special text gestures, picture gestures and video gestures, and you can customize your gesture functions. Recommend using Kiwi browser, Yandex browser and Lemur Browser.
// @version		8.8.3
// @author		L.Xavier
// @namespace	https://greasyfork.org/zh-CN/users/128493
// @match		*://*/*
// @license		MIT
// @grant		window.close
// @grant		GM_setValue
// @grant		GM_getValue
// @grant		GM_openInTab
// @grant		GM_setClipboard
// @grant		GM_addValueChangeListener
// @run-at		document-body
// ==/UserScript==
// v8.8.3		2022-10-13 - 修复部分网站无法下载的问题
/*手势数据模块*/
let gesture={
	'↑→↓←':'打开设置',
	'◆◆':'视频全屏',
	'●':'手势穿透',
	'→←':'后退',
	'←→':'前进',
	'↓↑':'回到顶部',
	'↑↓':'回到底部',
	'←↓':'刷新页面',
	'←↑':'新建页面',
	'→↓':'关闭页面',
	'→↑':'恢复页面',
	'↓↑●':'新页面打开',
	'↑↓●':'隐藏元素',
	'↑→':'复制页面',
	'→←→':'半屏模式',
	'→↓↑←':'视频解析',
	'T→↑':'百度翻译',
	'T←↑':'有道翻译',
	'T◆◆':'双击搜索',
	'I↓↑●':'打开图片',
	'I→↑●':'百度搜图',
	'V→':'前进10s',
	'V←':'后退10s',
	'V↑':'增加倍速',
	'V↓':'减小倍速',
	'V→●':'快进播放',
	'V→○':'停止快进',
	'V←●':'快退播放',
	'V←○':'停止快退',
	'V↑●':'增加音量',
	'V↑○':'关闭增加音量',
	'V↓●':'减少音量',
	'V↓○':'关闭减少音量',
	'V→▼':'右滑进度',
	'V→▽':'关闭右滑进度',
	'V←▼':'左滑进度',
	'V←▽':'关闭左滑进度'
},
pathFn={
	'打开设置':'/*ONLY TOP*/openSet();',
	'视频全屏':'videoFullScreen();',
	'手势穿透':'setTimeout(()=>{if(/^[TIV]/.test(path)){path=(path.indexOf("I")>-1) ? "I" : "";return;}if(gestureData.touchEle.nodeName!=="IMG"){let imgs=gestureData.touchEle.parentNode.getElementsByTagName("img");for(let Ti=0,len=imgs.length;Ti<len;++Ti){let imgRect=imgs[Ti].getBoundingClientRect();if(gestureData.touchStart.clientX>imgRect.x && gestureData.touchStart.clientX<(imgRect.x+imgRect.width) && gestureData.touchStart.clientY>imgRect.y && gestureData.touchStart.clientY<(imgRect.y+imgRect.height)){gestureData.touchEle=imgs[Ti];break;}}}if(gestureData.touchEle.nodeName==="IMG" && settings["图片手势"]){path="I";}else if(gestureData.touchEle.style.backgroundImage && settings["图片手势"]){gestureData.touchEle.src=gestureData.touchEle.style.backgroundImage.split(\'"\')[1];path="I";}});',
	'后退':'/*ONLY TOP*/history.go(-1);gestureData.backTimer=setTimeout(()=>{window.close();},500);',
	'前进':'/*ONLY TOP*/history.go(1);',
	'回到顶部':'/*WITH TOP*/let boxNode=gestureData.touchEle.parentNode;while(boxNode.nodeName!=="#document"){boxNode.scrollTop=0;boxNode=boxNode.parentNode;}',
	'回到底部':'/*WITH TOP*/let boxNode=gestureData.touchEle.parentNode;while(boxNode.nodeName!=="#document"){if(getComputedStyle(boxNode).overflowY!=="hidden"){boxNode.scrollTop=boxNode.scrollHeight;}boxNode=boxNode.parentNode;}',
	'刷新页面':'/*ONLY TOP*/document.documentElement.style.cssText="filter:grayscale(100%)";history.go(0);',
	'新建页面':'/*ONLY TOP*/GM_openInTab("https://limestart.cn");',
	'关闭页面':'/*ONLY TOP*/window.close();',
	'恢复页面':'/*ONLY TOP*/GM_openInTab("chrome-native://recent-tabs");',
	'新页面打开':'let linkNode=gestureData.touchEle;while(true){if(linkNode.href){GM_openInTab(linkNode.href);break;}linkNode=linkNode.parentNode;if(linkNode.nodeName==="BODY"){gestureData.touchEle.click();break;}}',
	'隐藏元素':'let boxNode=gestureData.touchEle,area=boxNode.offsetWidth*boxNode.offsetHeight;if((area/document.body.offsetWidth/document.body.offsetHeight)<0.9){while(boxNode.nodeName!=="BODY" && (area/boxNode.parentNode.offsetWidth/boxNode.parentNode.offsetHeight)>0.25){boxNode=boxNode.parentNode;}}if(boxNode.nodeName!=="HTML"){boxNode.remove();}',
	'复制页面':'/*ONLY TOP*/GM_openInTab(location.href);',
	'半屏模式':'/*ONLY TOP*/if(gestureData.halfScreen){setTimeout(()=>{gestureData.halfScreen.remove();halfClose.remove();gestureData.halfScreen=null;document.documentElement.scrollTop=gestureData.scrollTop;},499);gestureData.scrollTop=document.body.scrollTop;let halfClose=addStyle("html{transform:translateY(0);}");}else{gestureData.scrollTop=document.documentElement.scrollTop;gestureData.halfScreen=addStyle("html,body{height:43vh !important;overflow-y:auto;}html{transform:translateY(50vh);transition:0.5s;overflow:hidden !important;}");document.body.scrollTop=gestureData.scrollTop;}',
	'视频解析':'/*ONLY TOP*/GM_openInTab("https://jx.bozrc.com:4433/player/?url="+location.href);',
	'百度翻译':'GM_openInTab("https://fanyi.baidu.com/#auto/auto/"+encodeURIComponent(gestureData.selectWords));',
	'有道翻译':'GM_openInTab("https://dict.youdao.com/w/eng/"+encodeURIComponent(gestureData.selectWords));',
	'双击搜索':'GM_setClipboard(gestureData.selectWords);let regURL=/^(https?:\\/\\/)?([\\w\\-]+\\.)+\\w{2,4}(\\/\\S*)?$/;if(!regURL.test(gestureData.selectWords.replace(/\\s+$/,""))){gestureData.selectWords="https://bing.com/search?q="+encodeURIComponent(gestureData.selectWords);}else if(!/^http/.test(gestureData.selectWords)){gestureData.selectWords="//"+gestureData.selectWords;}GM_openInTab(gestureData.selectWords);',
	'打开图片':'GM_openInTab(gestureData.touchEle.src);',
	'百度搜图':'GM_openInTab("https://graph.baidu.com/details?isfromtusoupc=1&tn=pc&carousel=0&promotion_name=pc_image_shituindex&extUiData%5bisLogoShow%5d=1&image="+gestureData.touchEle.src);',
	'前进10s':'videoPlayer.currentTime+=10;gestureData.tipBox.innerHTML="+10s ";gestureData.tipBox.style.display="block";setTimeout(()=>{gestureData.tipBox.style.display="none";},500);',
	'后退10s':'videoPlayer.currentTime-=10;gestureData.tipBox.innerHTML="-10s ";gestureData.tipBox.style.display="block";setTimeout(()=>{gestureData.tipBox.style.display="none";},500);',
	'增加倍速':'if(document.fullscreen){let playSpeed=videoPlayer.playbackRate;playSpeed+=(playSpeed<1.5) ? 0.25 : 0.5;gestureData.tipBox.innerHTML="×"+playSpeed+" ∞ ";gestureData.tipBox.style.display="block";videoPlayer.playbackRate=playSpeed;setTimeout(()=>{gestureData.tipBox.style.display="none";},500)}',
	'减小倍速':'if(document.fullscreen){let playSpeed=videoPlayer.playbackRate;playSpeed-=(playSpeed>1.5) ? 0.5 : (playSpeed>0.25 && 0.25);gestureData.tipBox.innerHTML="×"+playSpeed+" ∞ ";gestureData.tipBox.style.display="block";videoPlayer.playbackRate=playSpeed;setTimeout(()=>{gestureData.tipBox.style.display="none";},500)}',
	'快进播放':'gestureData.playSpeed=videoPlayer.playbackRate;videoPlayer.playbackRate=10;gestureData.tipBox.innerHTML="×10 ";gestureData.tipBox.style.display="block";',
	'停止快进':'videoPlayer.playbackRate=gestureData.playSpeed;gestureData.tipBox.style.display="none";',
	'快退播放':'gestureData.videoTimer=setInterval(()=>{videoPlayer.currentTime-=0.5;},50);gestureData.tipBox.innerHTML="- ×10 ";gestureData.tipBox.style.display="block";',
	'停止快退':'clearInterval(gestureData.videoTimer);gestureData.tipBox.style.display="none";',
	'增加音量':'if(document.fullscreen){videoPlayer.muted=false;gestureData.tipBox.innerHTML=(videoPlayer.volume*100|0)+"%";gestureData.tipBox.style.display="block";let lastY=gestureData.touchEnd.screenY;gestureData.videoTimer=setInterval(()=>{if(lastY-gestureData.touchEnd.screenY){let tempVolume=videoPlayer.volume+(lastY-gestureData.touchEnd.screenY)/100;videoPlayer.volume=+(tempVolume>1) || (+(tempVolume>0) && tempVolume);gestureData.tipBox.innerHTML=(videoPlayer.volume*100|0)+"%";lastY=gestureData.touchEnd.screenY;}},50);}',
	'关闭增加音量':'clearInterval(gestureData.videoTimer);gestureData.tipBox.style.display="none";',
	'减少音量':'if(document.fullscreen){videoPlayer.muted=false;gestureData.tipBox.innerHTML=(videoPlayer.volume*100|0)+"%";gestureData.tipBox.style.display="block";let lastY=gestureData.touchEnd.screenY;gestureData.videoTimer=setInterval(()=>{if(lastY-gestureData.touchEnd.screenY){let tempVolume=videoPlayer.volume+(lastY-gestureData.touchEnd.screenY)/100;videoPlayer.volume=+(tempVolume>1) || (+(tempVolume>0) && tempVolume);gestureData.tipBox.innerHTML=(videoPlayer.volume*100|0)+"%";lastY=gestureData.touchEnd.screenY;}},50);}',
	'关闭减少音量':'clearInterval(gestureData.videoTimer);gestureData.tipBox.style.display="none";',
	'右滑进度':'let lastX=gestureData.touchEnd.screenX,rem=videoPlayer.currentTime/60,mod=videoPlayer.currentTime%60;gestureData.tipBox.innerHTML=((rem<10) ? "0" : "")+(rem|0)+" : "+((mod<10) ? "0" : "")+(mod|0);gestureData.tipBox.style.display="block";gestureData.videoTimer=setInterval(()=>{if(gestureData.touchEnd.screenX-lastX){videoPlayer.currentTime+=(gestureData.touchEnd.screenX-lastX)*(1+Math.abs(gestureData.touchEnd.screenX-lastX)/5);lastX=gestureData.touchEnd.screenX;}rem=videoPlayer.currentTime/60;mod=videoPlayer.currentTime%60;gestureData.tipBox.innerHTML=((rem<10) ? "0" : "")+(rem|0)+" : "+((mod<10) ? "0" : "")+(mod|0);},50);',
	'关闭右滑进度':'clearInterval(gestureData.videoTimer);gestureData.tipBox.style.display="none";',
	'左滑进度':'let lastX=gestureData.touchEnd.screenX,rem=videoPlayer.currentTime/60,mod=videoPlayer.currentTime%60;gestureData.tipBox.innerHTML=((rem<10) ? "0" : "")+(rem|0)+" : "+((mod<10) ? "0" : "")+(mod|0);gestureData.tipBox.style.display="block";gestureData.videoTimer=setInterval(()=>{if(gestureData.touchEnd.screenX-lastX){videoPlayer.currentTime+=(gestureData.touchEnd.screenX-lastX)*(1+Math.abs(gestureData.touchEnd.screenX-lastX)/5);lastX=gestureData.touchEnd.screenX;}rem=videoPlayer.currentTime/60;mod=videoPlayer.currentTime%60;gestureData.tipBox.innerHTML=((rem<10) ? "0" : "")+(rem|0)+" : "+((mod<10) ? "0" : "")+(mod|0);},50);',
	'关闭左滑进度':'clearInterval(gestureData.videoTimer);gestureData.tipBox.style.display="none";'
},
settings={
	'滑动距离':0.5,
	'文字手势':true,
	'图片手势':true,
	'视频手势':true,
	'视频下载':false
};
//存储数据读取
gesture=GM_getValue('gesture',gesture);
pathFn=GM_getValue('pathFn',pathFn);
settings=GM_getValue('settings',settings);
//脚本常量
const gestureData={},minSide=(screen.width>screen.height) ? screen.height : screen.width,limit=(minSide/2*settings['滑动距离'])**2,limit_4=limit/4,limit_minSide=limit/(minSide*1.5),attachShadow=Element.prototype.attachShadow,observer=new MutationObserver(()=>{if(checkTimer){return;}checkTimer=setTimeout(loadCheck,200);});

/*手势功能模块*/
//手指功能变量
let path='',_touch=null,timeSpan=0,pressTime=0,raiseTime=0,slideTime=0,moveTime=0,lastTime=0,_sumXY=0,slideLimit=0,fingersNum=0,gestureTimer=0,isOK=0,isClick=0,isPushing=0;
//手势执行
function runCode(code){
	try{eval(code);}
	catch(error){
		if((error+'').indexOf('unsafe-eval')>-1){
			if(!window.evalTool){
				window.evalTool=(()=>{
					let script=document.createElement('script');
					function thisParams(){
						this.window.close=window.close;
						this.GM_setValue=GM_setValue;
						this.GM_getValue=GM_getValue;
						this.GM_openInTab=GM_openInTab;
						this.GM_setClipboard=GM_setClipboard;
						this.runCode=runCode;
						this.runFrame=runFrame;
						this.runGesture=runGesture;
						this.videoFullScreen=videoFullScreen;
						this.findVideoBox=findVideoBox;
						this.addStyle=addStyle;
						this.openSet=openSet;
						this.gestureData=gestureData;
						this.path=path;
						this.videoPlayer=videoPlayer;
					}
					return (js)=>{
						thisParams();
						script.remove();
						script=document.createElement('script');
						script.innerHTML='try{'+js+'}catch(error){alert("“"+path+"” 手势执行脚本错误：\\n"+error+" ！");}';
						document.body.append(script);
					}
				})();
				if(top===self){window.evalTool('window.addEventListener("popstate",()=>{clearTimeout(gestureData.backTimer);},true);window.addEventListener("beforeunload",()=>{clearTimeout(gestureData.backTimer);},true);');}
			}
			window.evalTool(code);
		}
		else{alert('“'+path+'” 手势执行脚本错误：\n'+error+' ！');}
	}
}
function runFrame(_path){
	let code=pathFn[gesture[_path]];
	if(top===self || /^[TIV]/.test(_path)){runCode(code);}
	else{
		if(code.indexOf('/*ONLY TOP*/')<0){runCode(code);}
		if(/\/\*(ONLY|WITH) TOP\*\//.test(code)){
			let _gestureData={};isPushing=1;
			_gestureData.touchStart=copyTouch(gestureData.touchStart);
			_gestureData.touchEnd=copyTouch(gestureData.touchEnd);
			top.postMessage({'type':'runPath','runPath':path,'gestureData':_gestureData},'*');
		}
	}
}
function runGesture(pathStr=''){
	if(gesture[path]){
		runFrame(path);
		if(gesture[pathStr]){path=pathStr;}
	}else if(gesture[path.slice(1)] && /^[TIV]/.test(path)){
		runFrame(path.slice(1));
		if(gesture[pathStr.slice(1)]){path=pathStr;}
	}
}
//长按执行
function longPress(){
	if(!/[●○▽]$/.test(path)){
		isOK=isClick=_sumXY=0;
		_touch=gestureData.touchEnd;
		let _path=path+'○';path+='●';
		runGesture(_path);
	}
}
//持续滑动执行
function slidingRun(){
	moveTime=0;
	let _path=path+'▽';path+='▼';
	runGesture(_path);
	path=path.replace('▼','');
}
//手指按下
function touchStart(e){
	clearTimeout(gestureTimer);
	if((fingersNum=e.touches.length)>1){return;}
	let calcX=(e.changedTouches[0].screenX-gestureData.touchEnd?.screenX)**2,calcY=(e.changedTouches[0].screenY-gestureData.touchEnd?.screenY)**2,
	sumXY=calcX+calcY,nowTime=Date.now();
	if((timeSpan=nowTime-raiseTime)>50 || sumXY>limit_4){//断触判断
		pressTime=slideTime=nowTime;
		isPushing=_sumXY=0;isOK=isClick=1;
		_touch=e.changedTouches[0];
		if(timeSpan>200 || sumXY>limit){
			path='';slideLimit=limit;
			gestureData.touchEle=e.target;
			gestureData.touchEnd=gestureData.touchStart=_touch;
			gestureData.selectWords=window.getSelection()+'';
			if(gestureData.selectWords && settings['文字手势']){path='T';}
			else if(videoPlayer && settings['视频手势']){
				let videoRect=videoPlayer.getBoundingClientRect(),offsetX=videoPlayer.offsetLeft,offsetY=videoPlayer.offsetTop-((fullsState>0) && videoRect.height/10);
				if(gestureData.touchStart.clientX>(videoRect.x-offsetX) && gestureData.touchStart.clientX<(videoRect.x+videoRect.width+offsetX) && gestureData.touchStart.clientY>(videoRect.y-offsetY) && gestureData.touchStart.clientY<(videoRect.y+videoRect.height+offsetY)){path='V';}
			}
		}else if(isClick){e.preventDefault();}
	}else if(isClick){path=path.slice(0,-1);}window.noClick?.remove();
	gestureTimer=setTimeout(longPress,300+slideTime-nowTime);
}
//手指滑动
function touchMove(e){
	let nowTime=Date.now();
	if((nowTime-lastTime)<16 || fingersNum>1){return;}
	clearTimeout(gestureTimer);
	gestureData.touchEnd=e.changedTouches[0];
	let calcX=(gestureData.touchEnd.screenX-_touch.screenX)**2,calcY=(gestureData.touchEnd.screenY-_touch.screenY)**2,
	sumXY=calcX+calcY,lastIcon=path.slice(-1),
	diffXY=(sumXY>_sumXY) ? sumXY-_sumXY : _sumXY-sumXY;
	lastTime=nowTime;_sumXY=sumXY;
	if(diffXY>limit_minSide && !/[○▽]/.test(lastIcon)){
		isOK=isClick=0;slideTime=nowTime;
		let direction=(calcX>calcY) ? ((gestureData.touchEnd.screenX>_touch.screenX) ? '→' : '←') : ((gestureData.touchEnd.screenY>_touch.screenY) ? '↓' : '↑');
		if(lastIcon===direction || sumXY>slideLimit){
			if(lastIcon!==direction && (timeSpan>200 || timeSpan<84 || 'TIV◆'.indexOf(lastIcon)>-1)){path+=direction;slideLimit*=(slideLimit<limit_4) || 0.49;timeSpan=201;moveTime=nowTime;}
			isOK=1;_sumXY=0;_touch=gestureData.touchEnd;
			if(moveTime && (nowTime-moveTime)>400){setTimeout(slidingRun);}
		}
	}
	gestureTimer=setTimeout(longPress,300+slideTime-nowTime);
	if(top!==self && isPushing){let _gestureData={};_gestureData.touchEnd=copyTouch(gestureData.touchEnd);top.postMessage({'type':'pushTouch','gestureData':_gestureData},'*');}
}
//手指抬起
function touchEnd(e){
	clearTimeout(gestureTimer);
	if(--fingersNum>0){raiseTime=0;return;}
	gestureData.touchEnd=e.changedTouches[0];
	if(/[○▽]$/.test(path)){raiseTime=0;setTimeout(runGesture);return;}
	if(isOK){gestureTimer=setTimeout(runGesture,199);}
	raiseTime=Date.now();setTimeout(iframeLock);
	if(isClick){path+='◆';if(/^V◆◆$|^T/.test(path)){e.stopPropagation();window.noClick=addStyle('*{pointer-events:none;}');}}
}

/*视频功能模块*/
//视频功能变量
let videoEle=document.getElementsByTagName('video'),_videoEle=[],videoPlayer=null,oriType='portrait-primary',lockOriType='landscape-primary',isLock=0,resizeTimer=0,fullsState=0;
//videoPlayer赋值
async function setVideo(player){
	videoPlayer=player.target || player;
	videoOriLock();
	videoPlayer.parentNode.append(gestureData.tipBox);
	if(settings['视频下载']){
		await findVideoBox()?.append(videoPlayer.downloadTip);
		if(window.urlObjects[videoPlayer.src]){
			videoPlayer.downloadTip.buffers=window.urlObjects[videoPlayer.src].sourceBuffers;
			window.urlObjects[videoPlayer.src].downloadTip=videoPlayer.downloadTip;
			delete window.urlObjects[videoPlayer.src];
		}else if(videoPlayer.downloadTip.innerHTML==='未加载'){
			if(!videoPlayer.src && videoPlayer.children.length){videoPlayer.src=videoPlayer.firstChild.src;}
			if(videoPlayer.src.indexOf('blob:') && videoPlayer.src){videoPlayer.downloadTip.innerHTML='可下载';}
		}
	}
}
//video方向锁定
function videoOriLock(){
	if(!videoPlayer.videoWidth){if(!videoPlayer.error && document.contains(videoPlayer)){setTimeout(videoOriLock,100);}return;}
	isLock=+(videoPlayer.videoWidth>videoPlayer.videoHeight);
	if(top!==self){GM_setValue('isLock',[isLock,Date.now()]);}
}
//video框架锁定
function iframeLock(){
	if(top!==self && videoPlayer && !window.isShow){GM_setValue('isLock',[isLock,Date.now()]);}
}
//video全屏/退出全屏
async function videoFullScreen(){
	if(resizeTimer){return;}
	if(document.fullscreen){await document.exitFullscreen()?.catch(Date);}
	else if(videoPlayer){await findVideoBox()?.requestFullscreen()?.catch(Date);}
	else if(iframeEle.length){GM_setValue('fullscreen',Date.now());}
}
//video播放事件绑定
async function videoBind(){
	for(let Ti=0,len=videoEle.length;Ti<len;++Ti){
		if(!videoEle[Ti].videoBox){
			videoEle[Ti].setAttribute('_videobox_','');
			await findVideoBox(videoEle[Ti]);
			if(settings['视频下载']){window.initDownload(videoEle[Ti]);}
			if(!videoEle[Ti].paused){setVideo(videoEle[Ti]);}
			videoEle[Ti].addEventListener('playing',setVideo,true);
		}
	}
	_videoEle=[...videoEle];
}
//获取video全屏样式容器
function findVideoBox(player=videoPlayer){
	if(!document.contains(player)){return null;}
	if(player.videoBox?.contains(player)){return player.videoBox;}
	let videoBox=player.parentNode,parentEle=videoBox.parentNode,
	videoStyle=getComputedStyle(player),childStyle=getComputedStyle(videoBox),
	childWidth=0,childHeight=0;
	videoBox.setAttribute('_videobox_','');videoBox.setAttribute('_videoparent_','');
	if(videoBox.offsetParent===parentEle){
		childWidth=Math.round(videoBox.offsetWidth+(+childStyle.marginLeft.slice(0,-2))+(+childStyle.marginRight.slice(0,-2))) || Math.round(player.offsetWidth+(+videoStyle.marginLeft.slice(0,-2))+(+videoStyle.marginRight.slice(0,-2)));
		childHeight=Math.round(videoBox.offsetHeight+(+childStyle.marginTop.slice(0,-2))+(+childStyle.marginBottom.slice(0,-2))) || Math.round(player.offsetHeight+(+videoStyle.marginTop.slice(0,-2))+(+videoStyle.marginBottom.slice(0,-2)));
	}else{
		childWidth=Math.round(videoBox.offsetLeft+videoBox.offsetWidth+(+childStyle.marginRight.slice(0,-2))+(+childStyle.right.slice(0,-2) || 0)) || Math.round(player.offsetLeft+player.offsetWidth+(+videoStyle.marginRight.slice(0,-2))+(+videoStyle.right.slice(0,-2) || 0));
		childHeight=Math.round(videoBox.offsetTop+videoBox.offsetHeight+(+childStyle.marginBottom.slice(0,-2))+(+childStyle.bottom.slice(0,-2) || 0)) || Math.round(player.offsetTop+player.offsetHeight+(+videoStyle.marginBottom.slice(0,-2))+(+videoStyle.bottom.slice(0,-2) || 0));
	}
	while(childWidth>=parentEle.clientWidth && childHeight>=parentEle.clientHeight){
		videoBox=parentEle;videoBox.setAttribute('_videobox_','');
		childStyle=getComputedStyle(parentEle);
		if(parentEle.offsetParent===parentEle.parentNode){
			childWidth=Math.round(parentEle.offsetWidth+(+childStyle.marginLeft.slice(0,-2))+(+childStyle.marginRight.slice(0,-2))) || childWidth;
			childHeight=Math.round(parentEle.offsetHeight+(+childStyle.marginTop.slice(0,-2))+(+childStyle.marginBottom.slice(0,-2))) || childHeight;
		}else{
			childWidth=Math.round(parentEle.offsetLeft+parentEle.offsetWidth+(+childStyle.marginRight.slice(0,-2))+(+childStyle.right.slice(0,-2) || 0)) || childWidth;
			childHeight=Math.round(parentEle.offsetTop+parentEle.offsetHeight+(+childStyle.marginBottom.slice(0,-2))+(+childStyle.bottom.slice(0,-2) || 0)) || childHeight;
		}
		parentEle=parentEle.parentNode;
	}
	player.videoBox=videoBox;
	return videoBox;
}
//陀螺仪事件
let regGYRO=()=>{
	let runTime=0;
	window.addEventListener('deviceorientation',async (e)=>{
		let nowTime=Date.now();
		if((nowTime-runTime)<500 || !isLock){return;}
		runTime=nowTime;
		let oriHgamma=e.gamma,
		oriHbeta=(e.beta>0) ? e.beta : -e.beta;
		if((oriHbeta<70 || oriHbeta>110) && (oriHgamma<-20 || oriHgamma>20)){
			lockOriType=((oriHbeta<70 && oriHgamma<-20) || (oriHbeta>110 && oriHgamma>20)) ? 'landscape-primary' : 'landscape-secondary';
		}
		if(fullsState>0 && oriType!==lockOriType){oriType=lockOriType;await screen.orientation.lock(lockOriType)?.catch(Date);}
	},true);
},
//全屏检测事件
regRESIZE=()=>{
	let videoCss=null,stopResize=()=>{resizeTimer=0;};
	window.addEventListener('resize',()=>{
		clearTimeout(resizeTimer);resizeTimer=setTimeout(stopResize,200);
		if(document.fullscreen && !fullsState){
			fullsState=document.fullscreenElement;
			if(fullsState.nodeName==='IFRAME'){fullsState=-1;return;}
			videoCss=addStyle('*[_videoparent_]{width:100% !important;height:100% !important;padding:0 !important;}');
			let srcFindVideo=fullsState.getElementsByTagName('video'),srcVideo=(fullsState.nodeName==='VIDEO') ? fullsState : srcFindVideo[0];
			if(!fullsState.hasAttribute('_videobox_') && (!srcVideo || srcFindVideo.length>1 || (srcVideo.parentNode.offsetWidth*srcVideo.parentNode.offsetHeight/fullsState.offsetWidth/fullsState.offsetHeight)<0.9)){fullsState=-1;videoCss.remove();top.postMessage({'type':'fullsState','fullsState':-1},'*');return;}
			videoCss.innerHTML='*[_videobox_]{width:100% !important;height:100% !important;inset:0 !important;margin:0 !important;padding:0 !important;transform:none !important;}video{position:fixed !important;object-fit:contain !important;}';
			if(srcVideo!==videoPlayer){videoPlayer?.pause();setVideo(srcVideo);}
			fullsState.setAttribute('_videobox_','');fullsState=1;top.postMessage({'type':'fullsState','fullsState':1},'*');
		}else if(fullsState && !document.fullscreen){fullsState=0;oriType='portrait-primary';videoCss?.remove();}
	},true);
};

/*视频下载模块*/
if(settings['视频下载']){
	//视频下载常量
	window.urlObjects={};
	const createObjectURL=URL.createObjectURL,addSourceBuffer=MediaSource.prototype.addSourceBuffer,appendBuffer=SourceBuffer.prototype.appendBuffer,endOfStream=MediaSource.prototype.endOfStream;
	//初始化视频下载
	window.initDownload=function(player){
		player.downloadTip=document.createElement('div');
		player.downloadTip.style.cssText='position:absolute;right:0;top:20px;background:#3498db;border-radius:20px 0 0 20px;text-align:center;padding:20px;line-height:0px;color:#fff;min-width:60px;font-size:16px;font-family:system-ui;z-index:2147483647;';
		player.downloadTip.video=player;
		player.downloadTip.innerHTML='未加载';
		if(!player.src && player.children.length){player.src=player.firstChild.src;}
		if(player.src.indexOf('blob:') && player.src){player.downloadTip.innerHTML='可下载';}
		else if(window.urlObjects[player.src]){
			player.downloadTip.buffers=window.urlObjects[player.src].sourceBuffers;
			window.urlObjects[player.src].downloadTip=player.downloadTip;
			delete window.urlObjects[player.src];
		}
		player.downloadTip.onclick=window.downloadVideo;
		player.videoBox.append(player.downloadTip);
	}
	//下载视频
	window.downloadVideo=function(data){
		if(this.innerHTML==='未加载'){return;}
		if(data.target){data=this;data.src=this.video.src;}
		let buffers=data.buffers;
		if(top!==self){
			let _buffers=[];
			for(let Ti=0,len=buffers.length;Ti<len;++Ti){
				_buffers.push({'mime':buffers[Ti].mime,'bufferList':buffers[Ti].bufferList});
			}
			top.postMessage({'type':'download','buffers':_buffers,'src':data.src},'*');
			return;
		}
		let a=document.createElement('a');a.download=document.title;a.style.display='none';document.body.append(a);
		if(data.src.indexOf('blob:') && data.src){a.href=data.src;a.click();}
		else if(buffers.length){
			for(let Ti=0,len=buffers.length;Ti<len;++Ti){
				a.href=URL.createObjectURL(new Blob(buffers[Ti].bufferList,{'type':buffers[Ti].mime}));
				a.click();
				URL.revokeObjectURL(a.href);
			}
		}
		a.remove();
	}
	//存储MediaSource
	URL.createObjectURL=function(obj){
		let url=createObjectURL(obj);
		if(obj.sourceBuffers){window.urlObjects[url]=obj;}
		return url;
	}
	//视频捕获
	MediaSource.prototype.addSourceBuffer=function(mime){
		let sourceBuffer=addSourceBuffer.call(this,mime);
		sourceBuffer.bufferList=[];sourceBuffer.mime=mime;
		const mediaSource=this;
		sourceBuffer.appendBuffer=function(buffer){
			this.bufferList.push(buffer);
			if(mediaSource.downloadTip){mediaSource.downloadTip.innerHTML='已捕获'+this.bufferList.length+'个片段';}
			appendBuffer.call(this,buffer);
		}
		return sourceBuffer;
	}
	//捕获完成
	MediaSource.prototype.endOfStream=function(){
		if(this.downloadTip){this.downloadTip.innerHTML='可下载';}
		endOfStream.call(this);
	}
}

/*功能补充模块*/
//功能补充变量
let iframeEle=document.getElementsByTagName('iframe'),checkTimer=0;
//修改Trusted-Types策略
window.trustedTypes?.createPolicy('default',{createHTML:string=>string,createScript:string=>string,createScriptURL:string=>string});
//页面重写时注册事件
document.docWrite=document.write;
document.write=function(content){document.docWrite(content);if(getComputedStyle(document.documentElement).userSelect!=='text'){regEvent();}}
//设置shadow-root (open)
Element.prototype.attachShadow=function(){
	if(!window.shadowList){window.shadowList=[];}
	let shadowRoot=attachShadow.call(this,{mode:'open'});
	window.shadowList.push(shadowRoot);
	return shadowRoot;
}
//页面加载检测
function loadCheck(){
	if(window.shadowList){//检测shadowRoot中的视频
		videoEle=[...document.getElementsByTagName('video')];
		for(let Ti=0,len=window.shadowList.length;Ti<len;++Ti){
			videoEle=[...videoEle,...window.shadowList[Ti].querySelectorAll('video')];
		}
	}
	if(videoEle.length===_videoEle.length){
		for(let Ti=0,len=_videoEle.length;Ti<len;++Ti){
			if(!document.contains(_videoEle[Ti])){videoBind();break;}
		}
	}else if(videoEle.length!==_videoEle.length){
		if(!gestureData.tipBox){
			//启动重力感应
			if(regGYRO && top===self){regGYRO();regGYRO=null;}
			//启动全屏检测
			if(regRESIZE){regRESIZE();regRESIZE=null;}
			window.addEventListener('fullscreenchange',()=>{resizeTimer=-1;},true);
			//tip操作提示
			gestureData.tipBox=document.createElement('div');
			gestureData.tipBox.style.cssText='width:100px;height:50px;position:absolute;text-align:center;top:calc(50% - 25px);left:calc(50% - 50px);display:none;color:#1e87f0;font-size:22px;line-height:50px;background-color:#fff;border-radius:20px;font-family:system-ui;z-index:2147483647;';
		}
		videoBind();
	}
	checkTimer=0;
}
//添加样式表
function addStyle(css){
	let style=document.createElement('style');
	style.innerHTML=css;
	document.head.append(style);
	return style;
}
//复制坐标对象
function copyTouch(oldObj){
	let newObj={};
	for(let Ti in oldObj){
		if(Ti==='target'){continue;}
		newObj[Ti]=oldObj[Ti];
	}
	return newObj;
}
//手势功能设置UI
function openSet(){
	let gestureName='',gesturePath='',gestureBox=document.createElement('div'),pathEle=null,clickTimer=0;
	//页面生成
	addStyle('*{overflow:hidden !important;}'+
				'#gestureBox{background-color:#fff;width:100%;height:100%;position:fixed;padding:0;margin:0;inset:0;overflow-y:auto !important;z-index:2147483647;}'+
				'#gestureBox *{font-family:system-ui;margin:0;padding:0;text-align:center;font-size:5vmin;line-height:12vmin;user-select:none !important;transform:none;text-indent:0;}'+
				'#gestureBox ::placeholder{color:#999;font-size:2.5vmin;line-height:6vmin;}'+
				'#gestureBox h1{width:60%;height:12vmin;color:#0074d9;background-color:#dee6ef;margin:3vmin auto;border-radius:12vmin;box-shadow:0.9vmin 0.9vmin 3vmin #dfdfdf;}'+
				'#gestureBox #addGesture{width:14vmin;height:14vmin;margin:3vmin auto;line-height:14vmin;background-color:#dee6ef;color:#032e58;font-size:7.5vmin;border-radius:15vmin;box-shadow:0.3vmin 0.3vmin 1.5vmin #dfdfdf;}'+
				'#gestureBox .gestureLi{height:18vmin;width:100%;border-bottom:0.3vmin solid #dfdfdf;}'+
				'#gestureBox .gestureLi p{margin:3vmin 0 0 1%;width:38%;height:12vmin;border-left:1.8vmin solid;color:#ffb400;background-color:#fff1cf;float:left;white-space:nowrap;text-overflow:ellipsis;text-shadow:0.3vmin 0.3vmin 3vmin #ffcb56;}'+
				'#gestureBox .gestureLi .gesturePath{margin:3vmin 0 0 3%;float:left;width:38%;height:12vmin;background-color:#f3f3f3;color:#000;box-shadow:0.3vmin 0.3vmin 1.5vmin #ccc9c9;border-radius:3vmin;white-space:nowrap;text-overflow:ellipsis;}'+
				'#gestureBox .gestureLi .delGesture{margin:3vmin 2% 0 0;width:15vmin;height:12vmin;float:right;color:#f00;text-decoration:line-through;}'+
				'#gestureBox #revisePath{background-color:rgba(0,0,0,0.7);width:100%;height:100%;position:fixed;inset:0;display:none;color:#000;}'+
				'#gestureBox #revisePath span{width:15vmin;height:15vmin;font-size:12.5vmin;line-height:15vmin;position:absolute;}'+
				'#gestureBox #revisePath div{color:#3339f9;position:absolute;width:30%;height:12vmin;font-size:10vmin;bottom:15%;}'+
				'#gestureBox #revisePath p{color:#3ba5d8;position:absolute;top:15%;font-size:10vmin;height:12vmin;width:100%;}'+
				'#gestureBox #revisePath #path{top:40%;color:#ffee03;height:100%;word-wrap:break-word;font-size:15vmin;line-height:18vmin;}'+
				'#gestureBox #editGesture{overflow-y:auto !important;background-color:#fff;width:100%;height:100%;position:fixed;inset:0;display:none;color:#000;}'+
				'#gestureBox #editGesture p{color:#3339f9;font-size:7.5vmin;text-align:left;margin:6vmin 0 0 9vmin;width:100%;height:9vmin;line-height:9vmin;}'+
				'#gestureBox #editGesture #gestureName{margin-top:6vmin;width:80%;height:12vmin;color:#000;border:0.3vmin solid #dadada;border-radius:3vmin;text-align:left;padding:0 3vmin;}'+
				'#gestureBox #editGesture .label_box>label{display:inline-block;margin-top:6vmin;position:relative;}'+
				'#gestureBox #editGesture .label_box>label>input{position:absolute;top:0;left:-6vmin;}'+
				'#gestureBox #editGesture .label_box>label>div{width:20vw;border:#ddd solid 0.3vmin;height:12vmin;color:#666;position:relative;}'+
				'#gestureBox #editGesture .label_box>label>input:checked + div{border:#d51917 solid 0.3vmin;color:#d51917;}'+
				'#gestureBox #editGesture .label_box>label>input + div:after{top:auto;left:auto;bottom:-3vmin;right:0;transition:none;}'+
				'#gestureBox #editGesture .label_box>label>input:checked + div:after{content:"";display:block;border:none;width:6vmin;height:6vmin;background-color:#d51917;transform:skewY(-45deg);position:absolute;}'+
				'#gestureBox #editGesture .label_box>label>input:checked + div:before{content:"";display:block;width:0.9vmin;height:2.4vmin;border-right:#fff solid 0.6vmin;border-bottom:#fff solid 0.6vmin;transform:rotate(35deg);position:absolute;bottom:0.6vmin;right:1.2vmin;}'+
				'#gestureBox #editGesture #pathFn{overflow-y:auto !important;width:80%;margin-top:6vmin;height:40%;text-align:left;line-height:6vmin;padding:3vmin;border:0.3vmin solid #dadada;border-radius:3vmin;}'+
				'#gestureBox #editGesture button{width:30vmin;height:15vmin;font-size:7.5vmin;line-height:15vmin;display:inline-block;color:#fff;background-color:#2866bd;margin:6vmin 3vmin 0 3vmin;border:none;}'+
				'#gestureBox #settingsBox{overflow-y:auto !important;background-color:#fff;width:100%;height:100%;position:fixed;inset:0;display:none;color:#000;}'+
				'#gestureBox #settingsBox p{color:#3339f9;text-align:left;margin:9vmin 0 0 9vmin;float:left;height:6vmin;line-height:6vmin;clear:both;}'+
				'#gestureBox #settingsBox .slideRail{overflow:initial !important;width:55%;background-color:#a8a8a8;float:left;margin:12vmin 0 0 3vmin;height:0.6vmin;position:relative;}'+
				'#gestureBox #settingsBox .slideRail .slideButton{line-height:9vmin;color:#fff;background-color:#2196f3;width:9vmin;height:9vmin;border-radius:9vmin;font-size:4vmin;position:absolute;top:-4.5vmin;left:-4.5vmin;box-shadow:0.3vmin 0.3vmin 1.8vmin #5e8aee;}'+
				'#gestureBox #settingsBox .switch{position:relative;display:inline-block;width:18vmin;height:9vmin;float:left;margin:7.5vmin 42% 0 3vmin;}'+
				'#gestureBox #settingsBox .switch input{display:none;}'+
				'#gestureBox #settingsBox .slider{border-radius:9vmin;position:absolute;cursor:pointer;inset:0;background-color:#ccc;transition:0.4s;}'+
				'#gestureBox #settingsBox .slider:before{border-radius:50%;position:absolute;content:"";height:7.5vmin;width:7.5vmin;left:0.6vmin;bottom:0.6vmin;background-color:white;transition:0.4s;}'+
				'#gestureBox #settingsBox input:checked + .slider{background-color:#2196F3;}'+
				'#gestureBox #settingsBox input:checked + .slider:before{transform:translateX(9vmin);}'+
				'#gestureBox #settingsBox #saveSettings{display:block;clear:both;width:30vmin;height:15vmin;font-size:7.5vmin;line-height:15vmin;color:#fff;background-color:#2866bd;border:none;margin:12vmin 0 0 calc(50% - 15vmin);float:left;}');
	gestureBox.id='gestureBox';
	document.body.append(gestureBox);
	gestureBox.innerHTML='<h1 id="openSettings">手势轨迹设置</h1><div id="addGesture">+</div><div id="gestureUL"></div>'+
					'<div id="revisePath"><span style="top:0;left:0;text-align:left;">┌</span><span style="top:0;right:0;text-align:right;">┐</span><span style="bottom:0;left:0;text-align:left;">└</span><span style="bottom:0;right:0;text-align:right;">┘</span>'+
					'<p>请滑动手指</p><p id="path"></p><div id="clearPath" style="left:10%;">清除</div><div id="cancleRevise" style="right:10%;">保存</div></div>'+
					'<div id="editGesture"><p>手势名称：</p><input type="text" id="gestureName" maxlength="12" placeholder="最大输入12个字符">'+
					'<p>手势类型：</p><div class="label_box"><label><input type="radio" id="GG" name="gestureType" value=""><div>一般</div></label><label><input type="radio" id="T" name="gestureType" value="T"><div>文字</div></label><label><input type="radio" id="I" name="gestureType" value="I"><div>图片</div></label><label><input type="radio" id="V" name="gestureType" value="V"><div>视频</div></label></div>'+
					'<p>手势执行脚本：</p><textarea id="pathFn" placeholder="可用变量说明↓\n 	gestureData：手势数据常量,如果你需要在不同手势间传递变量,你可以赋值gestureData.变量名=变量值；\n	gestureData.touchEle：手指触摸的源元素；\n	gestureData.selectWords：选中的文字；\n	gestureData.touchStart：触摸开始坐标对象；\n	gestureData.touchEnd：触摸最新坐标对象；\n	path：滑动的路径；\n	videoPlayer：正在播放的视频元素。'+
					'\n\n可用方法说明↓\n	addStyle(CSS样式)：将CSS样式添加到网页上；\n	runGesture()：以path为路径执行手势,你可以修改path后执行此方法；\n	GM_openInTab(链接)：打开链接；\n	GM_setClipboard(文本)：复制文本到剪切板；\n	GM_setValue(变量名,变量值)：在油猴中存储数据；\n	GM_getValue(变量名,默认值)：从油猴中取出数据,没有则使用默认值。'+
					'\n\n可识别代码注释说明(仅对一般手势生效)↓\n	默认情况：存在iframe时，所有手势只会在触发手势的页面对象执行！\n 	添加/*ONLY TOP*/：手势只在顶级页面对象执行；\n	添加/*WITH TOP*/：手势同时在当前页面对象和顶级页面对象执行。"></textarea>'+
					'<div style="width:100%;height:0.3vmin;"></div><button id="saveGesture">保存</button><button id="closeEdit">关闭</button></div>'+
					'<div id="settingsBox"><h1>功能开关设置</h1><span id="settingList"></span><button id="saveSettings">保存</button></div>';
	pathEle=document.getElementById('path');

	//编辑手势
	function editGesture(){
		gestureName=this.parentNode.getAttribute('name');
		if(['打开设置','视频全屏','手势穿透'].indexOf(gestureName)>-1){alert('该手势脚本无法修改！');return;}
		gesturePath=this.parentNode.getAttribute('path');
		let selectType=(/^[TIV]/.test(gesturePath)) ? gesturePath.slice(0,1) : 'GG';
		document.getElementById(selectType).click();
		document.getElementById('gestureName').value=gestureName;
		document.getElementById('pathFn').value=pathFn[gestureName];
		document.getElementById('editGesture').style.display='block';
	}
	//修改路径
	function revisePath(){
		gestureName=this.parentNode.getAttribute('name');
		gesturePath=this.parentNode.getAttribute('path');
		pathEle.innerHTML='';
		window.removeEventListener('touchmove',touchMove,true);
		window.removeEventListener('touchend',touchEnd,true);
		document.getElementById('revisePath').style.display='block';
	}
	//删除手势
	function delGesture(){
		gestureName=this.parentNode.getAttribute('name');
		if(['打开设置','视频全屏','手势穿透'].indexOf(gestureName)>-1){alert('该手势无法删除！');return;}
		gesturePath=this.parentNode.getAttribute('path');
		delete pathFn[gestureName];
		delete gesture[gesturePath];
		GM_setValue('pathFn',pathFn);
		GM_setValue('gesture',gesture);
		init();
	}
	//滑动条
	function silideBar(e){
		fingersNum=2;
		let diffX=e.changedTouches[0].clientX-gestureData.touchStart.clientX,
		leftPX=(+this.style.left.slice(0,-2))+diffX,vmin=this.offsetWidth/2;
		leftPX=(leftPX<-vmin) ? -vmin : ((leftPX>(this.parentNode.offsetWidth-vmin)) ? (this.parentNode.offsetWidth-vmin) : leftPX);
		this.style.left=leftPX+'px';
		this.innerHTML=Math.round((leftPX+vmin)/this.parentNode.offsetWidth+'e+2')/100;
		gestureData.touchStart=e.changedTouches[0];
	}
	//长按执行
	function _longPress(){if(!/[●○▼▽]$/.test(pathEle.innerHTML)){isClick=_sumXY=0;_touch=gestureData.touchEnd;pathEle.innerHTML+='●';}}
	//持续滑动执行
	function _slidingRun(){moveTime=0;pathEle.innerHTML+='▼';}
	//点击执行
	function _clickRun(){if(!/[○▼▽]$/.test(pathEle.innerHTML)){pathEle.innerHTML+='◆';}}
	//界面初始化
	function init(){
		document.getElementById('gestureUL').innerHTML='';
		for(gestureName in pathFn){
			gesturePath='';
			for(let Ti in gesture){
				if(gesture[Ti]===gestureName){gesturePath=Ti;break;}
			}
			document.getElementById('gestureUL').innerHTML+='<div class="gestureLi" name="'+gestureName+'" path="'+gesturePath+'"><p>'+gestureName+'</p><div class="gesturePath">'+gesturePath+'</div><div class="delGesture">删除</div></div>';
		}
		//操作绑定
		let gestureEle=document.querySelectorAll('#gestureBox .gestureLi p');
		for(let Ti=0,len=gestureEle.length;Ti<len;++Ti){
			gestureEle[Ti].addEventListener('click',editGesture,true);
		}
		gestureEle=document.querySelectorAll('#gestureBox .gestureLi .gesturePath');
		for(let Ti=0,len=gestureEle.length;Ti<len;++Ti){
			gestureEle[Ti].addEventListener('click',revisePath,true);
		}
		gestureEle=document.querySelectorAll('#gestureBox .gestureLi .delGesture');
		for(let Ti=0,len=gestureEle.length;Ti<len;++Ti){
			gestureEle[Ti].addEventListener('click',delGesture,true);
		}
	}
	init();

	//.新建手势
	document.getElementById('addGesture').addEventListener('click',()=>{
		gestureName=gesturePath='';
		document.getElementById('GG').click();
		document.getElementById('gestureName').value='';
		document.getElementById('pathFn').value='';
		document.getElementById('editGesture').style.display='block';
	},true);
	//保存手势
	document.getElementById('saveGesture').addEventListener('click',()=>{
		if(!document.getElementById('gestureName').value){alert('请输入手势名称！');return;}
		if(pathFn[document.getElementById('gestureName').value] && gestureName!==document.getElementById('gestureName').value){alert('该手势名称已被占用！');return;}
		delete pathFn[gestureName];
		delete gesture[gesturePath];
		let typeEle=document.getElementsByName('gestureType');
		for(let Ti=0,len=typeEle.length;Ti<len;++Ti){
			if(typeEle[Ti].checked){
				gesturePath=typeEle[Ti].value+((gestureName && gesturePath.indexOf('[')<0) ? ((/^[TIV]/.test(gesturePath)) ? gesturePath.slice(1) : gesturePath) : ('['+document.getElementById('gestureName').value+']'));
				break;
			}
		}
		gesture[gesturePath]=document.getElementById('gestureName').value;
		pathFn[document.getElementById('gestureName').value]=document.getElementById('pathFn').value;
		GM_setValue('pathFn',pathFn);
		GM_setValue('gesture',gesture);
		init();
		document.getElementById('editGesture').style.display='none';
	},true);
	//关闭编辑
	document.getElementById('closeEdit').addEventListener('click',()=>{
		document.getElementById('editGesture').style.display='none';
	},true);
	//路径修改事件
	document.getElementById('revisePath').addEventListener('touchstart',()=>{
		if(fingersNum>1){return;}
		clearTimeout(gestureTimer);
		gestureTimer=setTimeout(_longPress,300+slideTime-Date.now());
	},true);
	document.getElementById('revisePath').addEventListener('touchmove',(e)=>{
		let nowTime=Date.now();
		if((nowTime-lastTime)<16 || fingersNum>1){return;}
		clearTimeout(gestureTimer);
		gestureData.touchEnd=e.changedTouches[0];
		let calcX=(gestureData.touchEnd.screenX-_touch.screenX)**2,calcY=(gestureData.touchEnd.screenY-_touch.screenY)**2,
		sumXY=calcX+calcY,lastIcon=pathEle.innerHTML.slice(-1),
		diffXY=(sumXY>_sumXY) ? sumXY-_sumXY : _sumXY-sumXY;
		lastTime=nowTime;_sumXY=sumXY;
		if(diffXY>limit_minSide && !/[○▼▽]/.test(lastIcon)){
			isClick=0;slideTime=nowTime;
			let direction=(calcX>calcY) ? ((gestureData.touchEnd.screenX>_touch.screenX) ? '→' : '←') : ((gestureData.touchEnd.screenY>_touch.screenY) ? '↓' : '↑');
			if(lastIcon===direction || sumXY>limit){
				if(lastIcon!==direction){pathEle.innerHTML+=direction;moveTime=nowTime;}
				_sumXY=0;_touch=gestureData.touchEnd;
				if(moveTime && (nowTime-moveTime)>400){setTimeout(_slidingRun);}
			}
		}
		gestureTimer=setTimeout(_longPress,300+slideTime-nowTime);
	},true);
	document.getElementById('revisePath').addEventListener('touchend',(e)=>{
		clearTimeout(gestureTimer);
		if(!isClick || fingersNum>1){return;}
		let lastIcon=pathEle.innerHTML.slice(-1);
		if((pressTime-raiseTime)<200){
			raiseTime=0;
			switch(lastIcon){
				case '●':{clearTimeout(clickTimer);pathEle.innerHTML=pathEle.innerHTML.slice(0,-1)+'○';break;}
				case '○':{clearTimeout(clickTimer);pathEle.innerHTML=pathEle.innerHTML.slice(0,-1)+'●';break;}
				case '▼':{clearTimeout(clickTimer);pathEle.innerHTML=pathEle.innerHTML.slice(0,-1)+'▽';break;}
				case '▽':{clearTimeout(clickTimer);pathEle.innerHTML=pathEle.innerHTML.slice(0,-1)+'▼';break;}
				default:{pathEle.innerHTML+='◆';break;}
			}
		}else{
			raiseTime=Date.now();
			clickTimer=setTimeout(_clickRun,400);
		}
	});
	//清除路径
	document.getElementById('clearPath').addEventListener('touchend',(e)=>{
		e.stopPropagation();e.preventDefault();
		clearTimeout(gestureTimer);
		if(!isClick || fingersNum>1){return;}
		if((pressTime-raiseTime)<200){
			raiseTime=0;
			pathEle.innerHTML='';
		}else{
			raiseTime=Date.now();
			pathEle.innerHTML=pathEle.innerHTML.slice(0,-1);
		}
	});
	//保存修改路径
	document.getElementById('cancleRevise').addEventListener('touchend',(e)=>{
		e.stopPropagation();e.preventDefault();
		clearTimeout(gestureTimer);
		if(!isClick || fingersNum>1){return;}
		if(pathEle.innerHTML){
			if(gestureName==='视频全屏' && pathEle.innerHTML.slice(-1)!=='◆'){alert('视频全屏需要以◆结尾！');return;}
			if(gesture[pathEle.innerHTML]==='手势穿透'){alert('路径与"手势穿透"功能冲突！');return;}
			if(/^[TIV]/.test(gesturePath)){pathEle.innerHTML=gesturePath.slice(0,1)+pathEle.innerHTML;}
			delete gesture[gesturePath];
			if(gesture[pathEle.innerHTML]){
				let pathTXT=((/^[TIV]/.test(gesturePath)) ? gesturePath.slice(0,1) : '')+'['+gesture[pathEle.innerHTML]+']';
				gesture[pathTXT]=gesture[pathEle.innerHTML];
			}
			gesture[pathEle.innerHTML]=gestureName;
			GM_setValue('gesture',gesture);
			init();
		}
		window.addEventListener('touchmove',touchMove,{capture:true,passive:true});
		window.addEventListener('touchend',touchEnd,{capture:true,passive:true});
		document.getElementById('revisePath').style.display='none';
	});
	//打开功能开关设置
	document.getElementById('openSettings').addEventListener('click',()=>{
		gestureBox.style.cssText='overflow-y:hidden !important';
		document.getElementById('settingsBox').style.display='block';
		let settingList=document.getElementById('settingList');
		settingList.innerHTML='';
		for(let Ti in settings){
			settingList.innerHTML+='<p>'+Ti+'：</p>';
			if(typeof(settings[Ti])==='boolean'){
				settingList.innerHTML+='<label class="switch"><input type="checkbox" id="'+Ti+'" '+((settings[Ti]) ? 'checked' : '')+'><div class="slider"></div></label>';
			}else if(typeof(settings[Ti])==='number'){
				settingList.innerHTML+='<div class="slideRail"><div class="slideButton" id="'+Ti+'"></div></div>';
				let slideButton=document.getElementById(Ti),
				leftPX=slideButton.parentNode.offsetWidth*settings[Ti]-slideButton.offsetWidth/2;
				slideButton.style.left=leftPX+'px';
				slideButton.innerHTML=settings[Ti];
			}
		}
		let slideList=document.getElementsByClassName('slideButton');
		for(let Ti=0,len=slideList.length;Ti<len;++Ti){
			slideList[Ti].addEventListener('touchmove',silideBar,true);
		}
	},true);
	//保存功能开关设置
	document.getElementById('saveSettings').addEventListener('click',()=>{
		gestureBox.style.cssText='';
		for(let Ti in settings){
			if(typeof(settings[Ti])==='boolean'){
				settings[Ti]=document.getElementById(Ti).checked;
			}else if(typeof(settings[Ti])==='number'){
				settings[Ti]=+document.getElementById(Ti).innerHTML;
			}
		}
		GM_setValue('settings',settings);
		document.getElementById('settingsBox').style.display='none';
	},true);
}

/*事件注册模块*/
function regEvent(){
	if(top===self){
		//清除后退定时器
		window.addEventListener('popstate',()=>{clearTimeout(gestureData.backTimer);},true);
		window.addEventListener('beforeunload',()=>{clearTimeout(gestureData.backTimer);},true);
		//接收iframe数据
		window.addEventListener('message',async (e)=>{
			let data=e.data;
			switch(data.type){
				case 'fullsState':{//iframe全屏状态
					fullsState=data.fullsState;
					if(isLock && fullsState>0){oriType=lockOriType;await screen.orientation.lock(lockOriType)?.catch(Date);}
				break;}
				case 'runPath':{//iframe顶级页面执行
					let _gestureData=data.gestureData,iframe=iframeEle[0];
					for(let Ti=0,len=iframeEle.length;Ti<len;++Ti){
						if(iframeEle[Ti].contentWindow===e.source){iframe=iframeEle[Ti];break;}
					}
					let ifrRect=iframe.getBoundingClientRect();
					gestureData.touchStart=_gestureData.touchStart;gestureData.touchEnd=_gestureData.touchEnd;
					gestureData.touchStart.target=gestureData.touchEnd.target=gestureData.touchEle=iframe;
					gestureData.touchStart.pageX=gestureData.touchStart.clientX+=ifrRect.x;
					gestureData.touchStart.pageY=gestureData.touchStart.clientY+=ifrRect.y;
					gestureData.touchEnd.pageX=gestureData.touchEnd.clientX+=ifrRect.x;
					gestureData.touchEnd.pageY=gestureData.touchEnd.clientY+=ifrRect.y;
					path=data.runPath;setTimeout(runGesture);
				break;}
				case 'pushTouch':{//iframe坐标传递
					let _gestureData=data.gestureData,ifrRect=gestureData.touchEle.getBoundingClientRect();
					gestureData.touchEnd=_gestureData.touchEnd;
					gestureData.touchEnd.target=gestureData.touchEle;
					gestureData.touchEnd.pageX=gestureData.touchEnd.clientX+=ifrRect.x;
					gestureData.touchEnd.pageY=gestureData.touchEnd.clientY+=ifrRect.y;
				break;}
				case 'download':{//iframe视频下载
					window.downloadVideo(data);
				break;}
			}
		},true);
	}else{
		//iframe视频全屏
		GM_addValueChangeListener('fullscreen',async (name,old_value,new_value,remote)=>{
			if(!document.hidden && window.isShow){
				await findVideoBox()?.requestFullscreen()?.catch(Date);
			}
		});
	}
	//iframe锁定
	GM_addValueChangeListener('isLock',(name,old_value,new_value,remote)=>{
		if(!document.hidden){
			if(top===self){
				if(regGYRO){regGYRO();regGYRO=null;}
				if(regRESIZE){regRESIZE();regRESIZE=null;}
				isLock=new_value[0];
			}else{window.isShow=!remote;}
		}
	});
	//解除选中限制
	addStyle('*{user-select:text !important;touch-action:manipulation;}');
	//加载检测
	checkTimer=setTimeout(loadCheck,200);
	observer.observe(document,{childList:true,subtree:true});
	//手势事件注册
	window.addEventListener('touchstart',touchStart,{capture:true,passive:false});
	window.addEventListener('touchmove',touchMove,{capture:true,passive:true});
	window.addEventListener('touchend',touchEnd,{capture:true,passive:true});
}
regEvent();