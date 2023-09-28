const jwt = require('jsonwebtoken')

const checkToken = async (req, res, next) => {
  try{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(!token) return res.status(401).json({mensagem: 'Acesso Negado'})

    const secret = process.env.secret
    
    jwt.verify(token, secret)

    next()
  } catch (err) {
    console.log(err)
    res.status(500).json({mensagem: 'Erro no servidor'})
  }
}

module.exports = checkToken