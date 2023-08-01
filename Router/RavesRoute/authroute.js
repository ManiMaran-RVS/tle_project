const express = require("express");
const Router = express.Router();
const User = require('../../Controller/RavesController/user');
const Employee = require('../../Controller/RavesController/employee')
const Auth = require("../../Middleware/auth")
const Forgotpassword = require("../../Controller/RavesController/user")
const Menus = require("../../Controller/RavesController/menu")

//login 
Router.route('/login').post(User.login)
Router.route('/changepassword').post(Auth.auth, User.changePassword)
Router.route('/forgotpasswordmail/:uid').post(Forgotpassword.forgotpasswordmailsend)
Router.route("/forgotpasswordverify").put(Forgotpassword.forgotpasswordverify)

Router.route('/employees/:eid').get(Auth.auth, Employee.get)

//menus
Router.route('/menus').get( Menus.get)

 
module.exports = Router;
