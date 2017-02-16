/**
 此处设置网站公共数据
 */
(($) => {
  window.sso = window.sso || {}
  let env, rootPath
  /* === API 主机信息设置 === */
  env = {
    'local': {
      webAPI: 'http://localhost:8084',
      ssoAPI: 'https://10.66.1.43:8443/sso'
    },
    'dev': {
      webAPI: 'http://10.66.1.133:8081/finance-web',
      ssoAPI: 'https://10.66.1.43:8443/sso'
    },
    'test': {
      webAPI: 'http://10.66.1.160:8087/finance-web',
      ssoAPI: 'https://10.66.1.161:8443/sso'
    },
    'pro': {
      webAPI: 'http://www.ebaoli.com/finance-web',
      ssoAPI: 'http://sso.9156.com'
    }
  }

  /* === 判断当前为开发环境 === */
  switch (window.location.host) {
    // local env
    case 'localhost:9000':
      rootPath = env.local
      break
    // dev env
    case '10.66.1.133:8081':
      rootPath = env.dev
      break
    // test env
    case '10.66.1.160:8087':
      rootPath = env.test
      break
    // production env
    case 'www.ebaoli.com':
      rootPath = env.pro
      break
    default:
      rootPath = env.test
  }

  /* === ajax 全局设置 === */
  $.ajaxSetup({
    beforeSend() {
      // global setting
    },
    success() {
      // global setting
    }
  })

  // export window.sso
  $.extend(window.sso, {
    rootPath, env
  })
})(jQuery)
