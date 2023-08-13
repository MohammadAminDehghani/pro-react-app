const middleware = require('app/http/middleware/middleware')

class attachFileToFormData extends middleware {
    handle(req, res, next){
        if(!req.file){
            req.body.images = undefined
        }else{
            req.body.images = req.file.originalname
        }
        next();
    }
    
}

module.exports = new attachFileToFormData();