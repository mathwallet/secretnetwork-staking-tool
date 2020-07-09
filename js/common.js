var browser = {
  versions: function() {
    var u = navigator.userAgent,
      app = navigator.appVersion;
    return {
      trident: u.indexOf('Trident') > -1, //IE内核
      presto: u.indexOf('Presto') > -1, //opera内核
      webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
      android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
      iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
      iPad: u.indexOf('iPad') > -1, //是否iPad
      webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
      weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
      qq: u.match(/\sQQ/i) == " qq", //是否QQ
      mdsApp: u.indexOf('MdsApp') > -1, //是否MdsApp
      mdsVer: u.indexOf('MdsApp') > -1 ? u.match(/MdsApp\/[^\s]+\s?/)[0].trim().split('/')[1] : '0' //MdsApp版本
    };
  }()
}

function initLang(){
  var cookieLang = getCookie('userLanguage') ? getCookie('userLanguage') : getNavLanguage();
  setUserLanguage(cookieLang);
}

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return (false);
}

async function initMathExtension(){
  var tries = 10;
  for (var i = 0; i < tries; i++) {
    var loaded = await new Promise((resolve, reject) => {
      setTimeout(function(){
        resolve(typeof window.mathExtension != 'undefined');
      }, 100);
    });
    if(loaded) return window.mathExtension;
  }
  return false;
}

function sendTransaction(transaction, network, httpProvider, from) {
  return new Promise((resolve, reject) => {
    httpProvider.get(`/auth/accounts/` + from).then(response => {
      var result = response.result.result;
      transaction.account_number = result.value.account_number;
      transaction.sequence = result.value.sequence;
      // 请求插件签名
      mathExtension.requestSignature(transaction, network).then(signedTransaction => {
        let trx = {
          "tx": {
            "msg": transaction.msgs,
            "memo": transaction.memo,
            "fee": transaction.fee,
            "signatures": [{
              ...signedTransaction,
            }]
          },
          "mode": "block"
        };
        // 广播交易
        const opts = {
          data: trx,
          headers: {
            "Content-Type": "text/plain",
          }
        };
        httpProvider.post(`/txs`, null, opts).then(r => {
          console.log(r.result);
          resolve(r.result);
        }).catch(e => {
          console.log(e);
          reject(e);
        });
      }).catch(e => {
        console.log(e);
        reject(e);
      });
    });
  });
}
