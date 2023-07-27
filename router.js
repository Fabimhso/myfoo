const express = require('express')
const router = express.Router()

const controller = require('../controllers/home.controller')

router.get('/', controller.gethome) // Página inicial
router.get('/signin', controller.getsignin) // Página de Login
router.get('/signup', controller.getsignup) // Página de Registro
router.get('/signout', controller.getsignout) // Página Logout

// post
router.post('/signin', controller.postsignin) // Post da Página de Login
router.post('/signup', controller.postsignup) // Post da Página de Login

module.exports = router