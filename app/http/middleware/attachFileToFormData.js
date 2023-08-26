const middleware = require('app/http/middleware/middleware')

class attachFileToFormData extends middleware {
    handle(req, res, next){
        if(!req.file){
            req.body.image = undefined
        }else{
            req.body.image = req.file.originalname
        }
        next();
    }
    
}

module.exports = new attachFileToFormData();