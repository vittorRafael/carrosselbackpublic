const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()


function validEmail(email){
  let regex_validation = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi
  return regex_validation.test(email)
}

const listUsers = async (req,res) =>{
  try {
    const users = await User.find()

    const dataUsers = []

    users.map((user)=>{
      dataUsers.push({
        _id: user._id,
        name: user.name,
        email: user.email,
        admin: user.admin
      })
    })

    res.json(dataUsers)
  } catch (err) {
    console.log(err)
    return res.status(500).json({mensagem: 'Erro no servidor'})
  }
}

const newUser = async (req,res) => {
  try {
    const {name, email, password, confirmPassword, admin} = req.body

    if(!name || !password || !confirmPassword || name.trim() == '' || password.trim() == '') {
      return res.status(400).json({mensagem: 'Necessário preencher todos os campos.'})
    }

    if(!validEmail(email)) return res.status(400).json({mensagem: 'Necessário um email válido.'})

    if(password !== confirmPassword) return res.status(400).json({mensagem: 'Confirmação de senha inválida.'})

    const userExist = await User.findOne({email: email})
    if(userExist) return res.status(400).json({mensagem: 'Email já cadastrado.'})

    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    const user = new User({
      name,
      email,
      password: passwordHash,
      admin
    })

    await user.save()

    return res.status(201).json({mensagem: 'Usuário cadastrado com sucesso'})

  } catch(err){
      console.log(err)
      return res.status(500).json({mensagem: 'Erro no servidor'})
  }

}

const loginUser = async (req, res) =>{
  try {
    const {email, password} = req.body

    if(!password || password.trim() == '') {
      return res.status(400).json({mensagem: 'Necessário preencher todos os campos.'})
    }

    if(!validEmail(email)) return res.status(400).json({mensagem: 'Necessário um email válido.'})

    const user = await User.findOne({email: email})
    if(!user) return res.status(404).json({mensagem: 'Email incorreto. Por favor tente novamente!'})
    
    const checkPassword = await bcrypt.compare(password, user.password)
    if(!checkPassword) return res.status(400).json({mensagem: 'Senha incorreta. Por favor tente novamente!'})

    const secret = process.env.SECRET
    const token = jwt.sign({
      id: user._id
    }, secret)

    const dataUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      admin: user.admin
    }

    res.json({dataUser, mensagem: "Logado com sucesso!", token})
    
  } catch (err) {
    console.log(err)
    return res.status(500).json({mensagem: 'Erro no servidor'})
  }
}

const deleteUser = async (req,res) =>{
  try {
    const {id} = req.params
    const user = await User.findById(id)
    if(!user) return res.status(404).json({mensagem: 'Item não encontrado!'})

    await user.deleteOne()
    res.json({mensagem: 'Usuário removido com sucesso.'})
  } catch(err){
    console.log(err)
    return res.status(500).json({mensagem: 'Erro no servidor'})
  }

}

module.exports = {
  newUser,
  loginUser,
  deleteUser,
  listUsers
}