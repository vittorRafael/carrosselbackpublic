const Carrossel = require('../models/Carrossel')
const fs = require('fs')
const {bucket, getStorage, getDownloadURL} = require('../firebase')



const listCarrossel = async (req,res) => {
  try {
    const carrosseis = await Carrossel.find()
    res.json(carrosseis)
  } catch (err) {
    console.log(err)
    return res.status(500).json({mensagem: 'Erro no servidor'})
  }
}

const newCarrossel = async (req, res) => {
  try {
    const {title} = req.body
    
    if(!title || title.trim() == '') {
      return res.status(400).json({mensagem: 'Necessário um título para criar o carrossel'})
    }


    const carrossel = new Carrossel({
      title,
      imgs: []
    })

    await carrossel.save()
    return res.status(201).json({mensagem: 'Carrossel criado com sucesso'})
  } catch (err) {
    console.log(err)
    return res.status(500).json({mensagem: 'Erro no servidor'})
  }
}

const newImage = async (req, res) => {
  try {
    const {id} = req.params
    const {desc} = req.body

    if(!desc) return res.status(400).json({mensagem: 'Necessário uma descrição para imagem.'})
    

    const file = req.file
    if(!file) return res.status(400).json({mensagem: 'Selecione uma imagem.'})
    
    await bucket.upload(file.path)
    const fileRef = getStorage().bucket(bucket.name).file(file.filename);
    const downloadURL= await getDownloadURL(fileRef);

    const carrossel = await Carrossel.findOne({ _id: id });
    if(!carrossel) return res.status(404).json({mensagem: 'Item não encontrado!'})
    


    carrossel.imgs.push({
      src: downloadURL,
      desc,
    })

    await carrossel.save()
    res.status(201).json({imagens: carrossel.imgs, mensagem: 'Imagem adicionada com sucesso'})

  } catch (err) {
    console.log(err)
    res.status(500).json({mensagem: 'Erro no servidor'})
  }
}

const deleteImage = async (req,res) => {
  try {
    const {id, indexImage} = req.params
    const carrossel = await Carrossel.findById(id)
    if(!carrossel) return res.status(404).json({mensagem: 'Item não encontrado!'})

    fs.unlinkSync(carrossel.imgs[Number(indexImage)].src)

    carrossel.imgs.splice(Number(indexImage), 1)
    carrossel.save()

    res.json({mensagem: 'Imagem removida com sucesso.'})

  } catch (err) {
    console.log(err)
    return res.status(500).json({mensagem: 'Erro no servidor'})
  }
}

const deleteCarrossel = async (req,res) => {
  try {
    const {id} = req.params
    const carrossel = await Carrossel.findById(id)
    if(!carrossel) return res.status(404).json({mensagem: 'Item não encontrado!'})

    for(let img of carrossel.imgs){
      fs.unlinkSync(img.src)
    }

    await carrossel.deleteOne()
    res.json({mensagem: 'Carrossel removido com sucesso.'})
  } catch (err) {
    console.log(err)
    return res.status(500).json({mensagem: 'Erro no servidor'})
  }
}

const editCarrossel = async (req,res) =>{
  try {
    const {id} = req.params
    const {title} = req.body
    if(!title || title.trim() == '') {
      return res.status(400).json({mensagem: 'Necessário um título para editar o carrossel'})
    }

    const carrossel = await Carrossel.findById(id)
    if(!carrossel) return res.status(404).json({mensagem: 'Item não encontrado!'})

    carrossel.title = title

    carrossel.save()
    res.json({mensagem: 'Carrossel editado com sucesso.'})
  } catch (err) {
    console.log(err)
    return res.status(500).json({mensagem: 'Erro no servidor'})
  }
}

module.exports = {
  newCarrossel,
  newImage,
  listCarrossel,
  deleteImage,
  deleteCarrossel,
  editCarrossel
}