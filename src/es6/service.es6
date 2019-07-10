/**
 此处设置网站所有请求 service
 */
(($) => {
  const {xhr} = window.sso

  // 演示请求块
  class DemoService {
    fetch() {
      return xhr('/info')
    }
  }

  // export window.sso
  $.extend(window.sso, {
    demo: new DemoService()
  })
})(jQuery)
