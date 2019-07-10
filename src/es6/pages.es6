/**
 此处为各页面实际业务代码
 */
(() => {
  const {demo, pageRender} = window.sso
  demo.fetch()
    .then(data => {
      pageRender('demo', data.data)
    })
})()
