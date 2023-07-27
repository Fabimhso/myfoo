const db = require('../utils/database')

module.exports = {
  // Controlador Inicial
  gethome: (req, res) => {
    if (req.session.login) { // Verifica se usuário está logado
      res.render('home', { // Renderiza a página home
        login: req.session.login // Passa as informações de login do Usuário
      })
    } else { // Caso o login nãoo exista
      res.redirect('/signin') // Redirectiona o usuário para a página de login
    }
  },

  // Controlador de Log In
  getsignin: (req, res) => {
    if (req.query.loginerror === 'usernotfound') { // Verifica se existe um erro no login (na URL)
      res.render('signin', { // Renderiza a página de login
        error: true, // Passa o parâmetro de erro 
        type: 'usernotfound' // Passa o tipo do erro
      })
    } else { // Caso não exista nenhum erro no login
      if (req.session.login) { // Verifica se o usuário está logado
        res.redirect('/') // Redireciona o usuário para a página inicial
      } else { // Caso o login não exista
        res.render('signin', { // Renderiza a página de login
          error: false // Passa o parâmetro de erro
        })
      }
    }
  },

  // Controlador de Registro
  getsignup: (req, res) => {
    if (req.query.signuperror === 'noname') { // Verifica se existe um erro no registro (na URL)
      res.render('signup', { // Renderiza a página de registro
        error: true, // Passa o parâmetro de erro 
        type: 'noname' // Passa o tipo do erro
      })
    } else if (req.query.signuperror === 'noemail') { // Verifica se existe um erro no registro (na URL)
      res.render('signup', { // Renderiza a página de registro
        error: true, // Passa o parâmetro de erro 
        type: 'noemail'
      })
    } else if (req.query.signuperror === 'nopasswd') { // Verifica se existe um erro no registro (na URL)
      res.render('signup', { // Renderiza a página de registro
        error: true, // Passa o parâmetro de erro 
        type: 'nopasswd' // Passa o tipo do erro
      })
    } else { // Caso não exista nenhum erro no registro
      if (req.session.login) {  // Verifica se o usuário está logado
        res.redirect('/') // Redireciona o usuário para a página inicial
      } else { // Caso o login não exista
        res.render('signup', { // Renderiza a página de login
          error: false // Passa o parâmetro de erro
        })
      }
    }
  },

  // Controlador de Logout
  getsignout: (req, res) => {
    req.session.login = undefined // Atribui o valor 'undefined' à sessão "login"
    res.redirect('/') // Redireciona o usuário para a página inicial
  },

  // POSTS
  // Controlador de Login (POST)
  postsignin: (req, res) => {
    postInfo = { // Objeto com informações passadas no formulário
      email: req.body.userEmailSI, // Email passado no formulário
      passwd: req.body.userPasswdSI // Senha passada no formulário
    }

    db.query(
      'SELECT * FROM users WHERE email = ? AND passwd = ?', // Seleciona todos os usuários de 'users'
      [postInfo.email, postInfo.passwd], // Parâmetros de email e senha, do objeto 'postInfo'
      (err, rows) => {
        if (!rows.length) { // Caso nenhum registro tenha sido encontrado
          res.redirect('/signin?loginerror=usernotfound') // Redirectiona o usuário para a página de login passando o erro 'usernotfound' => usuário não encontrado
        } else { // Caso exista um registro
          req.session.login = { // Define a sessão de login do usuário
            name: rows[0].name, // 'name' é igual a coluna 'nome' encontrada no regsitro
            email: rows[0].email, // 'email' é igual a coluna 'email' encontrada no regsitro
            password: rows[0].passwd, // 'password' é igual a coluna 'passwd' encontrada no regsitro
          }
          res.redirect('/') // Redireciona o usuário para a pagina inicial
        }
      }
    )
  },

  // Controlador de Registro (POST)
  postsignup: (req, res) => {
    postInfo = { // Objeto com informações passadas no formulário
      name: req.body.userNameSU, // Nome passado no formulário
      email: req.body.userEmailSU, // Email passado no formulário
      password: req.body.userPasswdSU, // Senha passada no formulário
    }

    if (postInfo.name === '') { // Caso o 'nome' esteja vazio
      res.redirect('/signup?signuperror=noname') // Redirectiona o usuário para a página de registro passando o erro 'noname' => sem nome
    } else if (postInfo.email === '') { // Caso o 'email' esteja vazio
      res.redirect('/signup?signuperror=noemail') // Redirectiona o usuário para a página de registro passando o erro 'noemail' => sem email
    } else if (postInfo.password === '') { // Caso a 'senha' esteja vazia
      res.redirect('/signup?signuperror=nopasswd') // Redirectiona o usuário para a página de registro passando o erro 'nonpassword' => sem senha
    } else { // Caso todos os campos estejam preenchidos
      
      // Substituição de serviço de email
      let splitedEmail = postInfo.email.split('@') // Separa o email do usuario pelo @ => ['email.exemplo', 'gmail.com']
      let emailAddress = splitedEmail[0] // Primeira parte do email do usuário => 'email.exemplo'
      let emailService = splitedEmail[1] // Segunda parte do email do usuário => 'gmail.com'
      if (emailService != 'myfoo.com') emailService = 'myfoo.com' // Caso o email que o usuário digite não termine com 'myfoo.com' ele é substituído
      postInfo.email = `${emailAddress}@${emailService}` // Define o email do usuário para 'email.exemplo@myfoo.com'

      db.query(
        'SELECT * FROM users WHERE email = ? AND passwd = ?', // Seleciona todos os usuários de 'users'
        [postInfo.email, postInfo.password], // Passa os parâmetros email e senha de postInfo
        (err, rows) => {
          if (!rows.length) { // Caso nenhum registro tenha sido encontrado
            db.query(
              'INSERT INTO users (name, email, passwd) VALUES (?, ?, ?)', // Insere um novo usuário com os valores passados em postInfo
              [postInfo.name, postInfo.email, postInfo.password], // Parâmetros de email e senha, do objeto 'postInfo'
              (err, rows) => {
                if (!rows.affectedRows) { // Caso nenhum registro tenha sido alterado (adicionado)
                  res.redirect('/signup?signuperror=unknownerror') // Redireciona o usuário para a página de registro passando o erro 'unknowerror' => erro desconhecido
                } else { // Caso algum registro tenha sido alterado (adicionado)
                  req.session.login = {  // Define a sessão de login do usuário
                    name: postInfo.name, // 'name' é igual a 'name' do objeto 'postInfo'
                    email: postInfo.email, // 'email' é igual a 'email' do objeto 'postInfo'
                    password: postInfo.password // 'password' é igual a 'password' do objeto 'postInfo'
                  }
                  res.redirect('/') // Redireciona o usuário para a página incial
                }
              }
            )
          } else { // Caso exista algum registro
            res.redirect('/signup?signuperror=useralreadyexists') // redireciona o usuário para a página de registro passando o erro 'useralreadyexists' => usuário já existe
          }
        }
      )
    }
  }
}