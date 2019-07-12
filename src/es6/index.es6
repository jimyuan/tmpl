(() => {
  const { pageRender } = window.sso
  pageRender('demo', {
    info: { name: 'Jim', desc: 'description!' }
  })
})()
