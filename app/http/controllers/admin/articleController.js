
const controller = require('app/http/controllers/controller');
const Article = require('app/models/article');
const fs = require('fs');
const faker = require('faker');
const { Console } = require('console');
const Episode = require('app/models/episode');


class ArticleController extends controller {
  async index(req, res) {

    //faker
    // for (let i = 0; i < 50; i++) {
    //   const addArticle = new Article({
    //     user: req.user._id,
    //     title: faker.name.title(),
    //     body: faker.lorem.text(),
    //     slug: faker.lorem.slug(),
    //     type: 'free',
    //     price: faker.commerce.price(),
    //     image: faker.image.imageUrl(),
    //     tags: faker.lorem.words()
    //   })

    //   addArticle.save();
    // }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
      //const articles = await Article.paginate(page, limit);
      const articles = await Article.paginate({}, { page, limit: 10, sort: { createAt: 1 } });
      //return res.json(articles);
      res.render('admin/article/index', { articles });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async show(req, res) {
    try {
      const article = await Article.findById(req.params.id);
      res.render('admin/article/show', { article });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  create(req, res) {
    try {
      res.render('admin/article/create');
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async post(req, res) {
    const validatedData = await this.validationForm(req, res)


    // اگر دیتاها معتبر بود
    if (validatedData) {
      req.body.image = req.body.path;
      req.body.user = req.user._id;
      const article = new Article(req.body);
      try {
        const newArticle = await article.save();
        res.redirect('/admin/article');
      } catch (err) {
        //console.log('err', err)
        this.back(req, res);
      }
    } else {
      var imageSizes = req.body.path;
      // اگر دیتای فرم معتبر نبود عکس آپلود شده مجددا حذف شود
      setTimeout(() => {
        if (imageSizes && imageSizes.original) {
          for (var key in imageSizes) {
            if (imageSizes.hasOwnProperty(key)) {
              // fs.unlinkSync('public' + imageSizes[key], (err) => {
              //   if (err) {
              //     console.error('Error deleting file:', err);
              //   } else {
              //     console.log('File deleted successfully');
              //   }
              // });

              var filePath = 'public' + imageSizes[key];
              if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath, err => {
                  if (err) {
                    console.error('Error deleting file:', err);
                  } else {
                    console.log('File deleted successfully');
                  }
                });
              }
            }
          }
        }
      }, 1000); // Delay of 1000 milliseconds
      //res.render('admin/article/create');
      this.back(req, res);
    }
  }

  async edit(req, res) {
    try {
      const article = await Article.findById(req.params.id);
      res.render('admin/article/edit', { article: article });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async update(req, res) {
    const validatedData = await this.validationForm(req, res);
    
    if (validatedData) {
      try {
        const deleteImagesUpdateArticle = await Article.findById(req.params.id);
        // Delete the associated image
        if (req.file && deleteImagesUpdateArticle.image) {
          // Remove the images file from the file system
          Object.keys(deleteImagesUpdateArticle.image).forEach(function (key, index) {
            var filePath = 'public' + deleteImagesUpdateArticle.image[key];
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          });
          req.body.image = req.body.path;
        }

        const updatedArticle = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.redirect('/admin/article');
      } catch (err) {
        //console.log(err);
        this.back(req, res);
      }
    } else {

      // اگر دیتای فرم معتبر نبود عکس آپلود شده مجددا حذف شود
      if (req.file) {
        var imageSizes = req.body.path;
        // اگر دیتای فرم معتبر نبود عکس آپلود شده مجددا حذف شود
        setTimeout(() => {
          if (imageSizes && imageSizes.original) {
            for (var key in imageSizes) {
              if (imageSizes.hasOwnProperty(key)) {

                var filePath = 'public' + deleteImagesUpdateArticle.image[key];
                if (fs.existsSync(filePath)) {
                  fs.unlinkSync(filePath, err => {
                    if (err) {
                      console.error('Error deleting file:', err);
                    } else {
                      console.log('File deleted successfully');
                    }
                  });
                }

                // fs.unlinkSync('public' + imageSizes[key], (err) => {
                //   if (err) {
                //     console.error('Error deleting file:', err);
                //   } else {
                //     console.log('File deleted successfully');
                //   }
                // });
              }
            }
          }
        }, 1000); // Delay of 1000 milliseconds
      }
      this.back(req, res);
    }

  }

  async delete(req, res) {
    try {
      const articleId = req.params.id;

      // Delete the episodes related to the article
      await Episode.deleteMany({ article: articleId });

      const deletedArticle = await Article.findByIdAndDelete(articleId);
      //const deletedArticle = await Article.findById(articleId).populate('episodes').exec();

      if (!deletedArticle) {
        return res.status(404).json({ message: 'همچین دوره ای وجود ندارد' });
      }
      //return res.json(deletedArticle)
      // Delete the article episodes
      //deletedArticle.episodes.forEach(episode => console.log(episode));
      //deletedArticle.remode();

      // Delete the associated image
      if (deletedArticle.image) {
        // Remove the images file from the file system
        // Remove the images file from the file system
        Object.keys(deletedArticle.image).forEach(function (key, index) {
          var filePath = 'public' + deletedArticle.image[key];
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });

      }
      res.redirect('/admin/article');
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async allArticles(req, res){
    let page = req.query.page || 1 ;
    let sort = -req.query.old || 1;

    let query = {}
    if (req.query.search)
      query.title = new RegExp(req.query.search, 'gi'); ;


    const articles = await Article.paginate({ ...query }, { page, limit: 9, sort: { createAt: sort } });
    res.render('home/page/articles', { articles });
  }

}

module.exports = new ArticleController();