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
    //console.log('inja')
    if (validatedData) {
      const course = new Course(req.body);




      // const newCourse = await course.save();
      // res.redirect('/admin/course');
      // res.render('admin/course/create');


      try {
        const newCourse = await course.save();
        res.redirect('/admin/course');
      } catch (err) {
        res.render('admin/course/create');
      }





    }else{
      //console.log(555555555666)
      if(req.file){
        fs.unlink(req.file.path, (err) => console.log(err) )
      }
      this.back(req, res);
    }


  }

  async edit(req, res) {
    try {
      const course = await Course.findById(req.params.id);
      res.render('admin/course/edit', { course });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async update(req, res) {
    try {
      const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.redirect('/admin/courses');
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async delete(req, res) {
    try {
      const deletedCourse = await Course.findByIdAndDelete(req.params.id);
      res.redirect('/admin/courses');
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new CourseController();