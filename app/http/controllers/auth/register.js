const User = require('./../../../models/user');
const { validationResult } = require('express-validator');
const controller = require('./../controller');
const passport = require('passport');
//const autoBind = (...args) => import('auto-bind').then(({default: autoBind}) => autoBind(...args));

class RegisterController extends controller {

    get(req, res) {
        //const recaptcha = new Recaptcha('6Lf77BUnAAAAALeqaGqeEFyWMtntf9SocREluLuM', '6Lf77BUnAAAAAE655S7BwIGzjl-h2TQd5z0WuJwA', { 'hl': 'fa' });
        res.render('auth/register', { errors: req.flash('errors'), recaptcha: this.recaptcha.render() });
    }


    post(req, res, next) {
        //console.log(req)
        this.validationRecaptcha(req, res, next)
            .then( result => validationResult(req))
            .then( result => {
                if (!result.isEmpty()) {
                    const errors = result.errors;
                    const errorsForFront = [];

                    errors.forEach((error) => {
                        errorsForFront.push({
                            name: error.param,
                            message: error.msg
                        });
                    });

                    req.flash('errors', errorsForFront);
                    res.redirect('/auth/register');
                }else{
                    this.register(req, res, next)
                }
            })

        // this.recaptcha.verify(req, (error) => {
        //     if (error) {
        //         req.flash('errors', {
        //             name: 'recaptcha',
        //             message: 'تیک من ربات نیستم را بزنید '
        //         });
        //         res.redirect('/auth/register');
        //     } else {
        //         // Handle POST request to /my-route
        //         const result = validationResult(req);

        //         if (!result.isEmpty()) {
        //             const errors = result.errors;
        //             const errorsForFront = [];

        //             errors.forEach((error) => {
        //                 errorsForFront.push({
        //                     name: error.param,
        //                     message: error.msg
        //                 });
        //             });

        //             req.flash('errors', errorsForFront);
        //             res.redirect('/auth/register');
        //         } else {
        //             const data = {
        //                 name: req.body.name,
        //                 email: req.body.email,
        //                 password: req.body.password,
        //                 contractor: {
        //                     company: req.body.company,
        //                     licenseNumber: req.body.licenseNumber,
        //                     address: req.body.address,
        //                     phone: req.body.phone,
        //                     website: req.body.website
        //                 }
        //             };

        //             const myData = new User(data);

        //             myData.save().then(() => {
        //                 res.redirect('/auth/register');
        //             }).catch((error) => {
        //                 res.end('server error');
        //             });
        //         }
        //     }
        // });

    }

    register(req, res, next){
        passport.authenticate('local.register',{
            successRedirect : '/',
            failureRedirect : '/auth/register',
            failureFlash : true
        })(req, res, next)
    }

    // post(req, res) {

    //   this.recaptcha.verify(req, (error) => {
    //     if (error) {
    //       req.flash({
    //         name: 'recaptcha',
    //         message: 'تیک من ربات نیستم را بزنید '
    //       })
    //       res.redirect('/auth/register');
    //     } else {

    //       // Handle POST request to /my-route
    //       const result = validationResult(req);

    //       if (!result.isEmpty()) {
    //         const errors = result.errors
    //         const errorsForFront = [];

    //         errors.forEach((error) => {
    //           errorsForFront.push({
    //             name: error.param,
    //             message: error.msg
    //           })
    //         });

    //         req.flash('errors', errorsForFront);
    //         res.redirect('/auth/register')
    //       }

    //       const data = {
    //         name: req.body.name,
    //         email: req.body.email,
    //         password: req.body.password,
    //         contractor: {
    //           company: req.body.company,
    //           licenseNumber: req.body.licenseNumber,
    //           address: req.body.address,
    //           phone: req.body.phone,
    //           website: req.body.website
    //         }
    //       }

    //       const myData = new User(data);

    //       myData.save().then(() => {
    //         res.redirect('/auth/register');
    //       }).catch((error) => {
    //         res.end('server error');
    //       });


    //     }
    //   })

    //   // // Handle POST request to /my-route
    //   // const result = validationResult(req);

    //   // if (!result.isEmpty()) {
    //   //   const errors = result.errors
    //   //   const errorsForFront = [];

    //   //   errors.forEach((error) => {
    //   //     errorsForFront.push({
    //   //       name: error.path,
    //   //       message: error.msg
    //   //     })
    //   //   });

    //   //   req.flash('errors', errorsForFront);
    //   //   res.redirect('/auth/register')
    //   // }

    //   // const data = {
    //   //   name: req.body.name,
    //   //   email: req.body.email,
    //   //   password: req.body.password,
    //   //   contractor: {
    //   //     company: req.body.company,
    //   //     licenseNumber: req.body.licenseNumber,
    //   //     address: req.body.address,
    //   //     phone: req.body.phone,
    //   //     website: req.body.website
    //   //   }
    //   // }

    //   // const myData = new User(data);

    //   // myData.save().then(() => {
    //   //   res.redirect('/auth/register');
    //   // }).catch((error) => {
    //   //   res.end('server error');
    //   // });
    // }

    put(req, res) {
        // Handle PUT request to /my-route
    }

    delete(req, res) {
        // Handle DELETE request to /my-route
    }
}

module.exports = new RegisterController();