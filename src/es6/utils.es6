/**
 此处可放置各公共方法
 */
(($, template) => {
  const { rootPath } = window.sso

  /* 获取 url 上参数 */
  function request(key) {
    const reg = new RegExp(`(^|&)${key}=([^&]*)(&|$)`)
    const str = window.location.search.substr(1).match(reg)
    return str !== null ? decodeURI(str[2]) : null
  }

  /* === ajax 请求封装 === */
  function xhr(path, formData, method) {
    const mockParams = `?${$.param({
      seed: +new Date()
    })}`

    // ajax 参数设置
    const options = {
      type: method || 'get',
      url: rootPath.webAPI + path + mockParams,
      data: method === 'post' ? JSON.stringify(formData) : formData,
      dataType: 'json',
      contentType: 'application/json charset=utf-8'
      // xhrFields: { // 跨域允许带上 cookie
      //   withCredentials: ['localhost']
      // },
      // crossDomain: true
    }
    return $.ajax(options)
  }

  // page render function
  function pageRender(keyChart, data) {
    const container = $(`#${keyChart}`), tmplObj = `${keyChart}Tmpl`
    container && container.html(template(tmplObj, data))
    // 传入 true 参数不删除模板
    !arguments[2] && tmplObj.remove()
  }

  // export window.sso
  $.extend(window.sso, {
    request, xhr, pageRender
  })
})(jQuery, window.template)
