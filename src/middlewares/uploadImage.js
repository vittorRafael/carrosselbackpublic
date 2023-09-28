const multer = require('multer')

const path = require('path')


module.exports = (multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/uploads/')
    },
    filename: (req, file, cb) => {
      cb(null, Date.now().toString() + path.extname(file.originalname))
    }
  }),
  fileFilter: (req, file, cb) => {
    const extensaoImg = ['image/png', 'image/jpg', 'image/jpeg'].find(formatoAceito =>  formatoAceito == file.mimetype)

    if(extensaoImg){
      return cb(null, true)
    }

    return cb(null, false)
  }
}))