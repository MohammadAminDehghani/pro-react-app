const controller = require('app/http/controllers/controller');
const Category = require('app/models/category');
class categoryController extends controller {
    async index(req, res, next) {
        let page = req.query.page || 1;
        const categories = await Category.paginate({}, { page, limit: 10, sort: { createAt: 1 }, populate : { path : 'parent'} });
        res.render('admin/category/index', { categories })

    }

    async create(req, res, next) {
        const categories = await Category.find({parent : null});
        res.render('admin/category/create', { categories });
    }

    async post(req, res, next) {
        let result = await this.validationForm(req);
        if (result) {
            this.storeProcess(req, res, next);
        } else {
            console.log('امکان ایجاد دسته بندی درحال حاظر وجود ندارد')
            this.back(req, res);
        }
    }

    async edit(req, res, next) {
        const category = await Category.findById(req.params.id);
        const categories = await Category.find({parent : null});
        res.render('admin/category/edit',  {  category, categories });
    }

    async update(req, res, next) {
        let result = await this.validationForm(req);
        if (result) {
            this.updateProcess(req, res, next);
        } else {
            console.log('امکان ویرایش دسته بندی درحال حاظر وجود ندارد')
            this.back(req, res);
        }
    }

    async destroy(req, res, next) {
        try {
            const categoryId = req.params.id;
      
            // Delete the categories related to the deleted Category
            await Category.deleteMany({ parent: categoryId });
      
            const deletedCategory = await Category.findByIdAndDelete(categoryId);
      
            if (!deletedCategory) {
              return res.status(404).json({ message: 'همچین دوره ای وجود ندارد' });
            }
    
            res.redirect('/admin/category');
          } catch (err) {
            res.status(500).json({ message: err.message });
          }
    }

    storeProcess(req, res, next) {
        let { name, parent } = req.body;
        const addcategory = new Category({
            name,
            slug: this.slug(name),
            parent : parent == 'none' ? null : parent
        })

        addcategory.save();
        res.redirect('/admin/category');
    }

    slug(title) {
        return title.replace(/([^۰-۹آ-یa-zA-Z0-9]|-)+/g, '-')
    }

    async updateProcess(req, res, next) {

        let { name , parent} = req.body;
        await Category.findByIdAndUpdate(req.params.id, { $set: { 
            name,
            parent : parent == 'none' ? null : parent,
            slug : this.slug(name)
         } });

        return res.redirect('/admin/category');
    }

}



module.exports = new categoryController();