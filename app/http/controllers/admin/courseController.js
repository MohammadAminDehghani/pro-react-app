const Course = require('app/models/Course');
const controller = require('app/http/controllers/controller');


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
      res.render('admin/course/create');
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async post(req, res) {
    const course = new Course(req.body);
    try {
      const newCourse = await course.save();
      res.redirect('/admin/course');
    } catch (err) {
      res.status(400).json({ message: err.message });
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