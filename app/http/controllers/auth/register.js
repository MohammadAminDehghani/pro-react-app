const User = require('./../../../models/user');
const { validationResult } = require('express-validator');
const Recaptcha = require('express-recaptcha').RecaptchaV2;

class RegisterController {
  constructor() {
    // You can define any properties you need for the controller here
    this.setRecaptcha()
  }

  setRecaptcha(){
    this.recaptcha = new Recaptcha('6LcV-wEnAAAAAHqcOs2qJ-zHFHDk-azMlQFwnz4h','6LcV-wEnAAAAADydSnZj42I7jrjY6CHwOMr0EVSO',{'hl':'fa'})
  }

  get(req, res) {
    // Handle GET request to /my-route
    res.render('auth/register', { errors: req.flash('errors') });
  }

  post(req, res) {
    // Handle POST request to /my-route
    const result = validationResult(req);

    if (!result.isEmpty()) {
      const errors = result.errors
      const errorsForFront = [];

      errors.forEach((error) => {
        errorsForFront.push({
          name: error.path,
          message: error.msg
        })
      });

      req.flash('errors', errorsForFront);
      res.redirect('/auth/register')
    }

    const data = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      contractor: {
        company: req.body.company,
        licenseNumber: req.body.licenseNumber,
        address: req.body.address,
        phone: req.body.phone,
        website: req.body.website
      }
    }

    const myData = new User(data);

    myData.save().then(() => {
      res.redirect('/auth/register');
    }).catch((error) => {
      res.end('server error');
    });
  }

  put(req, res) {
    // Handle PUT request to /my-route
  }

  delete(req, res) {
    // Handle DELETE request to /my-route
  }
}

module.exports = new RegisterController();