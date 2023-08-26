const Course = require('app/models/Course');
const controller = require('app/http/controllers/controller');
const fs = require('fs')


class CourseController extends controller {
  async index(req, res) {
    try {
      const courses = await Course.find();
      res.render('admin/course/index', { courses });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async show(req, res) {
    try {
      const course = await Course.findById(req.params.id);
      res.render('admin/course/show', { course });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  create(req, res) {
    try {
      res.render('admin/course/create', { errors: req.flash('errors') });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async post(req, res) {
    const validatedData = this.validationForm(req, res)

    // اگر عکس وجود داشت
    if(req.body.image){
      req.body.image = req.body.path.substr(6);
    }
    
    // اگر دیتاها معتبر بود
    if (validatedData) {
      const course = new Course(req.body);
      try {
        const newCourse = await course.save();
        res.redirect('/admin/course');
      } catch (err) {
        res.render('admin/course/create');
      }
    } else {

      // اگر دیتای فرم معتبر نبود عکس آپلود شده مجددا حذف شود
      if (req.file) {
        fs.unlinkSync(req.file.path)
      }
      this.back(req, res);
    }
  }

  async edit(req, res) {
    try {
      const course = await Course.findById(req.params.id);
      res.render('admin/course/edit', { errors: req.flash('errors'), course : course });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async update(req, res) {
    try {
      const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.redirect('/admin/course');
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async delete(req, res) {
    try {
      const courseId = req.params.id;
      const deletedCourse = await Course.findByIdAndDelete(courseId);
  
      if (!deletedCourse) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      // Delete the associated image
      const imagePath = 'public'+deletedCourse.image;
      if (imagePath) {
        // Remove the image file from the file system
        fs.unlinkSync(imagePath);
      }
      res.redirect('/admin/course');
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new CourseController();