/**
 * cookie操作
 */
var getCookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        var path = options.path ? '; path=' + options.path : '';
        var domain = options.domain ? '; domain=' + options.domain : '';
        var s = [cookie, expires, path, domain, secure].join('');
        var secure = options.secure ? '; secure' : '';
        var c = [name, '=', encodeURIComponent(value)].join('');
        var cookie = [c, expires, path, domain, secure].join('')
        document.cookie = cookie;
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};

/**
 * 获取浏览器语言类型
 * @return {string} 浏览器国家语言
 */
var getNavLanguage = function(){
  navLanguage = (navigator.browserLanguage || navigator.language).toLowerCase();
  switch(navLanguage)
  {
  case 'zh-cn' || 'zh-tw' || 'zh-hk':
    navLanguage = 'cn';
    break;
  case 'ko':
    navLanguage = 'ko'
    break;
  case 'vi':
    navLanguage = 'vi'
    break;
  default:
    navLanguage = 'en';
  }
  return navLanguage;
}

/**
 * 设置语言类型： 默认为中文
 */
var i18nLanguage = "en";

/*
设置一下网站支持的语言种类
 */
var webLanguage = ['cn', 'en' , 'ko','vi'];

/**
 * 执行页面i18n方法
 * @return
 */
var execI18n = function(){
    /*
    获取一下资源文件名
     */
    var optionEle = jQuery("#i18n_pagename");
    if (optionEle.length < 1) {
        console.log("未找到页面名称元素，请在页面写入\n <meta id=\"i18n_pagename\" content=\"页面名(对应语言包的语言文件名)\">");
        return false;
    };

    if (getCookie("userLanguage")) {
        var userLang = getCookie("userLanguage");
        // 判断是否在网站支持语言数组里
        if (jQuery.inArray(userLang, webLanguage) > -1) {
           i18nLanguage = userLang
        }else{
           i18nLanguage = 'en'
        }
    } else {
        // 获取浏览器语言
        var navLanguage = getNavLanguage();
        if (navLanguage) {
            // 判断是否在网站支持语言数组里
            var charSize = jQuery.inArray(navLanguage, webLanguage);
            if (charSize > -1) {
                i18nLanguage = navLanguage;
                // 存到缓存中
                getCookie("userLanguage",navLanguage);
            }
        } else{
            console.log("not navigator");
            return false;
        }
    }
    /* 需要引入 i18n 文件*/
    if (jQuery.i18n == undefined) {
        console.log("请引入i18n js 文件")
        return false;
    };

    /*
    这里需要进行i18n的翻译
     */
    jQuery.i18n.properties({
        name : 'i18n', //资源文件名称
        path : 'https://m.maiziqianbao.net/site/', //资源文件路径
        mode : 'map', //用Map的方式使用资源文件中的值 'both'
        language : i18nLanguage,
        callback : function() {//加载成功后设置显示内容

            var insertEle = jQuery(".i18n");
            insertEle.each(function() {
                var properties = jQuery.trim(jQuery(this).attr('data-properties'));
                if(properties){
                    var pType = jQuery(this).attr('data-ptype');
                    var pTypeArr = pType.split('/');
                    var propertiesArr = properties.split('/');

                    for(var i=0;i<pTypeArr.length;i++){

                        if(jQuery.trim(pTypeArr[i]) == 'html'){

                            jQuery(this).html(jQuery.i18n.prop(jQuery.trim(propertiesArr[i])));

                        }else if(jQuery.trim(pTypeArr[i]) == 'text'){

                            jQuery(this).text(jQuery.i18n.prop(jQuery.trim(propertiesArr[i])));

                        }else if(jQuery.trim(pTypeArr[i]) == 'title'){

                            jQuery(this).attr('title', jQuery.i18n.prop(jQuery.trim(propertiesArr[i])));

                        }else if(jQuery.trim(pTypeArr[i]) == 'alt'){

                            jQuery(this).attr('alt', jQuery.i18n.prop(jQuery.trim(propertiesArr[i])));

                        }else if(jQuery.trim(pTypeArr[i]) == 'placeholder'){

                            jQuery(this).attr('placeholder', jQuery.i18n.prop(jQuery.trim(propertiesArr[i])));

                        }else if(jQuery.trim(pTypeArr[i]) == 'value'){

                            jQuery(this).val(jQuery.i18n.prop(jQuery.trim(propertiesArr[i])));

                        }else if(jQuery.trim(pTypeArr[i]) == 'href'){

                            jQuery(this).attr('href', jQuery.i18n.prop(jQuery.trim(propertiesArr[i])));

                        };

                    };
                };
            });
        }
    });

}
var isJSON = function(str) {
    if (typeof str == 'string') {
        try {
            var obj=JSON.parse(str);
            if(typeof obj == 'object' && obj ){
                return true;
            }else{
                return false;
            }

        } catch(e) {
            return false;
        }
    }
    console.log('It is not a string!')
}

var setUserLanguage = function(lang){
    if(!lang){
        languageType = getCookie('userLanguage')?getCookie('userLanguage'):getNavLanguage();
    }else{
        if(isJSON(lang)){
            languageType = JSON.parse(lang).language;
        }else{
            languageType = lang;
        }
    }

    getCookie("userLanguage",languageType,{
        expires: 30,
        path:'/'
    });
    /*执行I18n翻译*/
    execI18n();
}

var cookieLang;
if(!browser.versions.mdsApp){
    cookieLang = getCookie('userLanguage')?getCookie('userLanguage'):getNavLanguage();
    setUserLanguage(cookieLang);
}else{
   //接收app提供的语言参数
    mathWallet.postMessage(JSON.stringify({
        "method":"getLanguage",
        "callback":"setUserLanguage"
    }));
}

