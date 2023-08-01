const express = require("express");
const Router = express.Router();
const MasterRoute=require('./RavesRoute/masterRoute')
const AuthRouter=require("./RavesRoute/authroute")
const Staff=require('../Controller/RavesController/employee')

//TLE

const Attedence= require("../Controller/TleController/studentattendance/attendance")
const DayWise=require('../Controller/TleController/studentattendance/daywise')
const Mlod=require("../Controller/TleController/studentattendance/mlod")
const Longabsent=require('../Controller/TleController/studentattendance/longabsent')
const monthwise=require('../Controller/TleController/studentattendance/monthwise')
const semesterwise=require('../Controller/TleController/studentattendance/semesterwise')
const attendanceBoostrap=require('../Controller/TleController/studentattendance/attendanceBoostrap')
const Proforma=require('../Controller/TleController/studentattendance/proformaGenerate')
const upload=require("../Config/TLE/multer");
const auth  = require("../Middleware/auth");
const subject=require("../Controller/TleController/subject/subject")
const staff=require("../Controller/TleController/staffattendance/staff_attendance")
const subjectStudent=require("../Controller/TleController/subject/subjectStudentMapping")
const subjectstaff=require('../Controller/TleController/subject/subjectstaffallocation')


//auth Route
Router.use("/auth",AuthRouter)


// master Route
Router.use('/masters',MasterRoute)

Router.route('/staffattendance/getattendanceday/:instid/:ayid/:deptid/:date').get(Staff.getattendancedaytype)
Router.route('/staffattendance/getstaffdetails/:instid/:deptid').get(Staff.staffDetails)

//TLE



Router.route('/studentattendance/attendances').post(Attedence.saveattendance)
Router.route('/studentattendance/attendances/:bid/:section/:date').get(Attedence.findAttendance)
Router.route('/studentattendance/attendances/dashboard/:semestertype/:bid/:section/:date').get(auth.auth,Attedence.findAttendanceByMaster)
Router.route('/studentattendance/daywise/:bid/:section/:date').get(DayWise.dayWiseAttendance).post(DayWise.saveDaywiseReport)
Router.route('/studentattendance/attendancerecord').post(Attedence.saveattendancerecord)


//MLOD 
// Router.route('/studentattendance/checkattedence/bid/')
Router.route('/studentattendance/mlods').post(Mlod.SaveMlod)
Router.route('/studentattendance/mlods/:bid').get(Mlod.getMlodData)
//longabsent&discontinue
Router.route('/studentattendance/discontinue').post(Longabsent.saveLongabsent)
Router.route('/studentattendance/discontinue/:bid').get(Longabsent.getLADAData) 

//month wise attedence
Router.route('/studentattendance/monthwise/:bid/:section/:fromdate/:todate').get(monthwise.getMonthwiseReport).post(monthwise.saveMonthReport)

//semester wise attedence
Router
.route('/studentattendance/semesterwise/:cid/:bid/:section/:semesternumber')
.get(semesterwise.getSemesterWiseReport)
.post(semesterwise.saveSemesterReport)


Router.route('/studentattendance/boostup/approveboostup').post(attendanceBoostrap.getboostupforapproval)
Router.route("/studentattendance/boostup/reqboostup").post(attendanceBoostrap.reqBoostup)
Router.route("/studentattendance/boostup/saveboostup").post(attendanceBoostrap.saveBoostupRecord)



// proforma generate api

Router.route("/studentattendance/proformagenerate").post(Proforma.proformaGenerate)
Router.route("/studentattendance/getproforma").post(Proforma.getAllProformaData)
Router.route('/studentattendance/filterproforma').post(Proforma.getFilterProformaData)
  

//subject
Router.route("/subjectentry/createsubject").post(subject.subjectEntry)
Router.route("/subjectentry/getsubjects/:instid/:deptid").get(subject.getallsubject)
Router.route("/subjectentry/deletesubject/:id").delete(subject.deleteonesubject)
Router.route("/subjectentry/getfiltersubject").post(subject.getfilteredsubject)
 
//Staff Attendance
Router.route("/staffattendance/:ayid/:instid/:deptid/:date").get(staff.findattendance)
Router.route("/staffattendance/saverecord").post(staff.savestaffattendance)

//subject student mapping
Router.route("/subjectstudentmap/student").post(subjectStudent.getStudentData)
Router.route("/subjectstudentmap/savedata").post(subjectStudent.saveSubjectStudentMapping)

//subjectstaffallocation
Router.route('/subjectstaffallocation/:instid/:deptid/:cid/:bid/:section/:semesternumber').get(subjectstaff.getSubjectStaff)
Router.route('/subjectstaffallocation').post(subjectstaff.saveSubjectStaffAllocation)
Router.route('/subjectstaffallocation/updatesubjectstaffallocation').put(subjectstaff.updateSubjectStaffAllocation)
Router.route('/subjectstaffallocation/deletesubjectstaffallocation/:staffallocationid').delete(subjectstaff.deleteSubjectStaffAllocation)


module.exports = Router;
