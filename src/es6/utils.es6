/**
 此处可放置各公共方法
 */
(($, template) => {
  const {env, rootPath} = window.sso

  /* 获取 url 上参数 */
  function request(key) {
    const reg = new RegExp(`(^|&)${key}=([^&]*)(&|$)`),
      str = window.location.search.substr(1).match(reg)
    return str !== null ? decodeURI(str[2]) : null
  }

  /* === ajax 请求封装 === */
  function xhr(path, formData, method) {
    let mockParams, options
    // 本地 mock 服务需要 mockBody 参数
    rootPath.webAPI === env.local.webAPI ?
      mockParams = `?${$.param({
        local: 1,
        mock: 1,
        enforce: Math.random() * 10 | 0
      })}`
      // 添加随机数，防止 IE 缓存
      :
      mockParams = `?${$.param({
        seed: +new Date()
      })}`

    // ajax 参数设置
    options = {
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
    let container, key, tmplObj, render
    if ($.isArray(keyChart)) {
      key = keyChart[0]
      container = $(`#${keyChart.join('')}`)
    } else {
      key = keyChart
      container = $(`#${keyChart}`)
    }
    if (container.length > 0) {
      tmplObj = $(`#${key}Tmpl`)
      render = template.compile(tmplObj.html())
      // 传入 true 参数不删除模板
      !arguments[2] && tmplObj.remove()
      container.html(render(data))
    }
    return container
  }

  // export window.sso
  $.extend(window.sso, {
    request, xhr, pageRender
  })
})(jQuery, window.template)
