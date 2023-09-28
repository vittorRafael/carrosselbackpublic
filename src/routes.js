const express = require('express')
const router = express.Router()

const uploadImage = require('./middlewares/uploadImage')
const checkToken = require('./middlewares/checkToken')

const CarrosselController = require('./controllers/CarrosselController')
const UserController = require('./controllers/UserController')

router.get('/', async (req, res) => {
  res.json({mensagem: 'Bem vindo!'})
})

router.post('/user', UserController.newUser)
router.post('/login', UserController.loginUser)
router.delete('/user/:id', checkToken, UserController.deleteUser)
router.get('/user', checkToken, UserController.listUsers)

router.get('/carrossel', checkToken, CarrosselController.listCarrossel)
router.post('/carrossel', checkToken, CarrosselController.newCarrossel);
router.post('/carrossel/:id/addImage', checkToken, uploadImage.single('file') ,CarrosselController.newImage);
router.delete('/carrossel/:id', checkToken, CarrosselController.deleteCarrossel)
router.delete('/carrossel/:id/:indexImage', checkToken, CarrosselController.deleteImage)
router.patch('/carrossel/:id', checkToken, CarrosselController.editCarrossel)


module.exports = router