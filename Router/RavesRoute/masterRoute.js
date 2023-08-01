const express = require("express");
const Router = express.Router();
const Auth = require("../../Middleware/auth")
const Batch =require('../../Controller/RavesController/batch');
const Programmes =require('../../Controller/RavesController/programmes');
const Calendars = require("../../Controller/RavesController/calendar");
const Semester = require('../../Controller/RavesController/semester');
const Student =require('../../Controller/RavesController/student')
const MlodLongAbsent=require('../../Controller/RavesController/mlodcalender')
const AcedamicYear=require('../../Controller/RavesController/academicyear')
const Institution =require('../../Controller/RavesController/institution')
const department=require('../../Controller/RavesController/department');
const Employees = require("../../Controller/RavesController/employee");

// Batch
Router.route("/batches/namelist/:cid/:ayname").get(Auth.auth,Batch.getCid)
Router.route('/batches/:bid').get(Auth.auth,Batch.getBid)
Router.route('/batches/getsection/:bid').get(Auth.auth,Batch.getSectionByBid)

//programmes
Router.route('/programmes').get(Programmes.findAllProgrammes)
Router.route('/programmes/:deptid').get(Auth.auth,Programmes.findByDepartmentId)

//Calendar

Router.route('/calendars/:bid/:section/:date').get(Auth.auth,Calendars. findCalendarsByDate)
Router.route("/mlodcalendars/:bid/:section").get(Auth.auth,Calendars.mlodcalender)
Router.route('/getcurrenttime').get(Auth.auth,Calendars.getCurrentTime)
Router.route('/getcaldate/:instid/:ayid/:semestertype').get(Auth.auth,Calendars.getCalendarConfigDates)
//Semester 
Router.route('/semesters/:bid/:instid').get(Auth.auth,Semester.findByBid)
Router.route('/semesterrecord/:instid/:bid').get(Semester.findSemesterByBid)
Router.route('/semesterrecord/:instid/:cid/:bid/:semesternumber').get(Auth.auth,Semester.findOneSemesterRecord)


//Student

Router.route('/students/getregno/:instid/:deptid/:regno').get(Auth.auth,Student.findByRegno)
Router.route('/students/batch/:bid/:section').get(Auth.auth,Student.findByBidSection)
Router.route('/students/:cid/:bid/:section').get(Student.findByCidBidSection)
Router.route("/students/getallstudents").get(Student.getAllStudents)



// Academic Year 

Router.route('/getacademicyear/:instid').get(Auth.auth,AcedamicYear.getAllAcademicYear)


// Institution 

Router.route('/getinstitution/:instid').get(Auth.auth,Institution.getInstitution)
Router.route('/getallinstitution').get(Auth.auth,Institution.getAllInstitution)



//department
Router.route("/department/getdepartment").get(department.getallDepartmennt)
Router.route("/department/getdepartment/:instid").get(department.getDepartmentbyinstid)
Router.route("/department/getonedepartment/:deptid").get(department.getOneDepartmentbyDeptid)
Router.route("/getdepartmentnames").post(department.getDepartmentName)

// employyess

Router.route("/getemployeenames").post(Employees.getEmployeeName)


module.exports = Router;

