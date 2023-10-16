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

router.use(checkToken)
router.delete('/user/:id', UserController.deleteUser)
router.get('/user', UserController.listUsers)

router.get('/carrossel', CarrosselController.listCarrossel)
router.post('/carrossel', CarrosselController.newCarrossel);
router.post('/carrossel/:id/addImage', uploadImage.single('file'), CarrosselController.newImage);
router.delete('/carrossel/:id', CarrosselController.deleteCarrossel)
router.delete('/carrossel/:id/:indexImage', CarrosselController.deleteImage)
router.patch('/carrossel/:id', CarrosselController.editCarrossel)


module.exports = router