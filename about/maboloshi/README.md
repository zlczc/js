# [仓库主页](https://github.com/maboloshi/github-chinese)
# [GitHub 中文化插件][project-url]

> 本项目源自: [52cik/github-hans](https://github.com/52cik/github-hans)

  [![GitHub issues][issues-image]][issues-url]
  [![GitHub stars][stars-image]][stars-url]
  [![GitHub forks][forks-image]][forks-url]
  [![license GPL-3.0][license-image]][license-url]
  [![GreasyFork installs][greasyFork-image]][greasyFork-url]

## 💖星标历史

<!-- [![Star History Chart](https://api.star-history.com/svg?repos=maboloshi/github-chinese&type=Timeline)](https://star-history.com/#maboloshi/github-chinese&Timeline) -->
<img src="https://camo.githubusercontent.com/8039feea33a30dd2eeea51c9e46365f9e35b60f84e6b424d5244e83a4707c530/68747470733a2f2f6170692e737461722d686973746f72792e636f6d2f7376673f7265706f733d6d61626f6c6f7368692f6769746875622d6368696e65736526747970653d54696d656c696e65" alt="Star History Chart" data-canonical-src="https://api.star-history.com/svg?repos=maboloshi/github-chinese&amp;type=Timeline" width="75%">

## 🚩功能

- 中文化 GitHub 菜单栏，标题，按钮等公共组件
- 保留、完善正则功能
- 除基础组件中文化外，还支持对 “项目描述” 进行人机翻译 (参考: [k1995/github-i18n-plugin](https://github.com/k1995/github-i18n-plugin))

## 💽 安装

1. 请先安装用户脚本管理器如: [Tampermonkey][Tampermonkey], [violentmonkey][violentmonkey] 等，支持的浏览器：Chrome, Microsoft Edge, Safari, Opera Next, 和 Firefox。
1. 然后再点击链接之一，安装脚本即可。
    - [GitHub 中文化插件 - github 托管【开发版】（相对及时更新）][main.user.js]
        > 注意: 当版本号未更新的情况下, 即使内容已更新, 用户脚本管理器依然会忽略, 需要手动安装获取更新
    - [GitHub 中文化插件 - greasyfork 托管【发布版】（仅大版本更新）][main(greasyfork).user.js]
1. 刷新下页面，即可发现网站已中文化。

> 测试平台: Win10 + Chrome + Tampermonkey, violentmonkey

## 📝 更新说明

### 2022-07-17 14:04:44

更新至 1.7.9

GitHub 的 ajax 载入方式逐步从 [defunkt/jquery-pjax](https://github.com/defunkt/jquery-pjax) 切换到 [hotwired/turbo](turbo.hotwired.dev), 导致已有的动态监测方式逐步失效

目前, 通过以下修复:

1. 新增 `BODY` 元素新增监视
1. 解析 `TURBO-FRAME` 框架, 获取对应的 `page`
1. 修复 github 新动态加载模式, 导致`翻译描述`返回值无法插入
1. 修复 github 新动态加载模式, 导致`chrome`浏览器自带翻译功能卡死页面

其他更新:

1. 修复`rePagePath`,`rePagePathRepo`,`rePagePathOrg`匹配规则，限制路径匹配层次，排除干扰
1. 直接使用网页URL`document.URL`变化触发`标题翻译`和`JS 筛选器`翻译
1. 修复`关闭正则`无法生效, 需要刷新页面才生效
1. 日常更新词库和忽略规则
1. 更新`JS 筛选器`规则

### 2022-06-29 13:27:12

更新至 1.7.8

1. 紧急修复: GitHub 变更了`document.body`和`title`更新机制, 导致原有的`监测更新`规则部分失效, 目前使用`document.documentElement`监视整个页面 DOM 的变更
2. 跳过`<HEAD>`标签
3. `标题翻译`和`JS 筛选器`翻译, 依据 URL变化更新

### 2022-06-26 16:41:58

更新至 1.7.7

1. 新增`时间元素翻译`功能
2. 重写`页面标题翻译`函数
3. 梳理`遍历节点`函数逻辑
4. 优化`transPage`函数，默认翻译公共部分
5. 调整`getPage`函数, 使`ClassName匹配规则`优先
6. 优化`translate`函数, 跳过`不存在英文字母和符号,.`, 保留首尾空白部分等
7. 部分函数重命名，使用`es6`新语法
8. 日常更新词库和忽略规则，修复一个`JS 选择器规则`

### 2022-05-12 13:53:46

更新至 1.7.6

1. 日常更新词库和忽略规则
2. 添加手动开启/禁用正则翻译，添加切换菜单
3. 优化翻译文本函数：避免已翻译词汇二次匹配，提高效率；局部翻译优先于全局

### 2022-02-26 12:36:14

更新至 1.7.5

### 2022-01-21 13:34:06

更新至 1.7.4

### 2021-12-26 12:01:11

更新至 1.7.3

### 2021-12-01 09:04:58

更新至 1.7.2

### 2021-11-23 10:51:22

更新许可证为 [GPL-3.0][license-url] 希望大家依据许可证使用

### 2021-10-31 21:49:00

正式发布 1.7.0 版本

### 2021-10-07 13:16:16

原作者[楼教主](https://github.com/52cik/github-hans)已停止维护多年，且近年来 GitHub 页面结构的变化，导致原有的脚本无法正常工作。

虽然 GitHub 在被微软售收购比较重视国际化，启动并基本完成了GitHub 文档的中文化。但是，关于 GitHub 页面的中文化暂时还没启动。

对于，新手使用和高阶使用仍会存在一定的障碍。故，本人依据个人兴趣暂时进行了一定的修复和维护。

本次维护基本恢复和保留大部分功能如：页面正则翻译（含日期的正则）。页面词条可能被我切得太碎不方便后期维护（先这样吧！）

## ✔待办 (TODO)

1. 添加 GitHub 名词解释，新手可能不太理解部分名词具体表达的意思，比如 `pull request`。
2. 整理部分 git & [GitHub](https://github.com/) 学习资料, 帮助新手**更快**上手。
3. **本人英文渣渣，翻译非常困难，急需大家 pr 共同翻译**

## ✨贡献

目前，已翻译大部分常用页面，欢迎补充完善，中文词条在`locals.js`中。大家在补充完善的过程，请遵循以下文档对相关术语进行翻译：

相关概念及资料文档:

1. [Pro Git 第二版 简体中文](https://www.gitbook.com/book/bingohuang/progit2/details)
2. [Pro Git: 翻译约定](https://github.com/progit/progit2-zh/blob/master/TRANSLATION_NOTES.asc)
3. [Git官方软件包的简体中文翻译](https://github.com/git/git/blob/master/po/zh_CN.po)
4. [GitHub 词汇表官方译本](https://docs.github.com/cn/get-started/quickstart/github-glossary)

## 🎨 预览

  ![github-chinese][github-chinese]

[project-url]: https://github.com/maboloshi/github-chinese "GitHub 中文化插件"

[issues-url]: https://github.com/maboloshi/github-chinese/issues "议题"
[issues-image]: https://img.shields.io/github/issues/maboloshi/github-chinese?style=flat-square&logo=github&label=Issue

[stars-url]: https://github.com/maboloshi/github-chinese/stargazers "星标"
[stars-image]: https://img.shields.io/github/stars/maboloshi/github-chinese?style=flat-square&logo=github&label=Star

[forks-url]: https://github.com/maboloshi/github-chinese/network "复刻"
[forks-image]: https://img.shields.io/github/forks/maboloshi/github-chinese?style=flat-square&logo=github&label=Fork

[license-url]: https://opensource.org/licenses/GPL-3.0  "许可证"
[license-image]: https://img.shields.io/github/license/maboloshi/github-chinese?style=flat-square&logo=github&label=License

[greasyFork-url]: https://greasyfork.org/scripts/435208  "GreasyFork - GitHub 中文化插件"
[greasyFork-image]: https://img.shields.io/badge/dynamic/json?style=flat-square&label=GreasyFork&query=total_installs&suffix=%20installs&url=https://greasyfork.org/scripts/435208.json

[Tampermonkey]: http://tampermonkey.net/ "Tampermonkey"
[violentmonkey]: https://violentmonkey.github.io/ "暴力猴"

[main.user.js]: https://maboloshi.github.io/github-chinese/main.user.js "GitHub 中文化插件 - GitHub 托管"
[main(greasyfork).user.js]: https://greasyfork.org/scripts/435208-github-%E4%B8%AD%E6%96%87%E5%8C%96%E6%8F%92%E4%BB%B6/code/GitHub%20%E4%B8%AD%E6%96%87%E5%8C%96%E6%8F%92%E4%BB%B6.user.js "GitHub 中文化插件 - GreasyFork 托管"

[github-chinese]: https://raw.githubusercontent.com/maboloshi/github-chinese/gh-pages/preview/github-chinese.webp

## 🎁 打赏

<img src="https://cdn.staticaly.com/gh/maboloshi/maboloshi/main/img/weixin.jpg" alt="微信赞赏" width="35%">  <img src="https://cdn.staticaly.com/gh/maboloshi/maboloshi/main/img/alipay.jpg" alt="支付宝赞赏" width="35%">

