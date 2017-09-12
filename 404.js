import { dom, env, article } from '/app/index.js'


article.ready.then(() => {

  setTimeout(() => {

    dom('form').on('submit', e => {
      e.preventDefault()
      const email = dom.first(e.target, 'input[name="email"]').value
      const password = dom.first(e.target, 'input[name="password"]').value
      console.log({ email, password })
    })

  }, 1000)

})


