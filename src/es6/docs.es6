/**
 此处设置网站公共数据
 */
(($, template) => {
  window.sso = window.sso || {}
  /* 获取 url 上参数 */
  function request(key) {
    const reg = new RegExp(`(^|&)${key}=([^&]*)(&|$)`)
    const str = window.location.search.substr(1).match(reg)
    return str !== null ? decodeURI(str[2]) : null
  }

  // page render function
  function pageRender(keyChart, data) {
    const container = $(`#${keyChart}`)
    const tmplObj = `${keyChart}Tmpl`
    container && container.html(template(tmplObj, data))
    // 传入 true 参数不删除模板
    !arguments[2] && $(`#${tmplObj}`).remove()
  }

  // export window.sso
  $.extend(window.sso, {
    request, pageRender
  })
})(jQuery, window.template)
