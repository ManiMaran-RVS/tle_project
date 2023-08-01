const db = require("../../Config/DB/tle.db");
const jwt = require("../../Utils/RavesUtils/jwt");
const SendMail = require("../../Config/Mail/mail");
const Constants = require("../../Utils/RavesUtils/constant");
const sha1 = require("sha1");
const tokengenerate=require("jsonwebtoken")


exports.login = async (req, res, next) => {
  const uid = req.body.username;
  const password = req.body.password;
  db.query(`select * from ${process.env.RAVES_DBNAME}.users where uid='${uid}'`, async function (error, user) {
    if (error) {
      res.status(500).send(error);
    } else {
      if (user.length > 0) {
        var comparision = sha1(password) === user[0].password;
        if (comparision) {
          const payload = user[0].uid;
          const token = jwt.generateToken(payload);
          await db.query(`select * from ${process.env.RAVES_DBNAME}.userpermissions where uid='${uid}'`, async (userpermssionerr, userpermssiondata) => {
            if (userpermssionerr) {
              res.status(500).send(userpermssionerr)
            } else {
              if (userpermssiondata.length !== 0) {
                await db.query(`select * from ${process.env.RAVES_DBNAME}.roles where mid=20 and rid='${userpermssiondata[0]['rid']}'`, (roleerr, rolesdata) => {
                  if (roleerr) {
                    res.status(500).send(roleerr)
                  } else {
                    res.status(200).send({ eid: user[0].eid, role: rolesdata[0]['name'], token });
                  }
                })
              } else {
                res.status(404).send("User not found")
              }
            }
          })
        } else {
          res.status(500).send("Email and password does not match");
        }
      } else {
        res.status(500).send("Email does not exits");
      }
    }
  }
  );
};

exports.changePassword = (req, res, err) => {

  const uid = req.body.uid;
  const password = req.body.password;
  // console.log(uid),
  // console.log(password)
  try {

    if (uid && password) {
      const newpassword = sha1(password)
      db.query(`UPDATE ${process.env.RAVES_DBNAME}.users SET password='${newpassword}' WHERE uid='${uid}'`, (err) => {
        if (err) {
          res.send(err)
        } else {
          res.send("Password Updated")
        }
      })

    } else {
      res.status(400).send("Password Required")
    }
  } catch (err) {
    console.error(err.message);
  }


};

//forgot passwords

exports.forgotpasswordmailsend = (req, res) => {

  const uid = req.params.uid;
  // console.log(uid)
  db.query(`select * From ${process.env.RAVES_DBNAME}.users where uid='${uid}'`,  async function (error, result) {
    if (error) {
      res.status(500).send({
        failed: "error ocurred",
      });
    } else {
      if (result.length > 0) {
        const token = tokengenerate.sign({ uid: result[0].uid }, process.env.SECRET, {
          expiresIn: "30m",
        });

        let templateData = {
          verificationLink: `http://${process.env.HOST}/updatepassword?resetpassword=${token}`,
        };
        await SendMail(
          process.env.TEMPLATE_ID,
          Constants.fromEmail,
          result[0].uid,
          templateData
        ).then((response) => {
          if (response[0]['statusCode'] >= 200 || response[0]['statusCode'] <= 299) {
            res.status(200).send("Reset Password Mail Sended")
          }
        })
          .catch((mailerror) => {
            res.status(500).send(mailerror)
          })
        
      } else {
        res.status(404).send("Email does not exits");
      }
    }
  });
};

exports.forgotpasswordverify = (req, res) => {
  const token = req.body.token;
  const password = req.body.password;
  if (token) {
    tokengenerate.verify(token, process.env.SECRET, function (error, decode) {
      if (error) {
        res.status(404).send("Link expired or invalid user");
      } else {
        const newpassword = sha1(password);
        db.query(`UPDATE ${process.env.RAVES_DBNAME}.users SET password='${newpassword}' WHERE uid='${decode.uid}'`,(err) => {
            if (err) {
              res.status(400).send(err);
            } else {
              res.status(200).send("your password has been changed");
            }
          }
        );
      }
    });
  } else {
    res.status(404).send("Authenticaton error");
  }
};
