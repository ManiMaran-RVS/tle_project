const db = require("../../Config/DB/tle.db");

exports.get = (req, res, error) => {
  // if (req.user) {
  const uid = 'vyuvaraj@rvsgroup.com'
  db.query(`select * from ${process.env.RAVES_DBNAME}.userpermissions where mid=20 and  uid='${uid}' and  active=1 `, async (userpermissionerr, userpermissiondata) => {
    if (userpermissionerr) {
      res.status(500).send(userpermissionerr)
    } else {
      if (userpermissiondata.length !== 0) {
        await db.query(`select * from ${process.env.RAVES_DBNAME}.menus where mid=20 and active=1`, (menuerr, menudata) => {
          if (menuerr) {
            res.status(500).send(menuerr)
          } else {
            var data = menudata
            data.forEach(v => {
              v.submenu = []
            });
            var parentmenudata = data.filter(v => v.parentmenuid === 0)

            parentmenudata.forEach((parentmenu, parentindex) => {
              return data.filter((value, dataindex) => {
                if (parentmenu.menuid === value.parentmenuid) {
                  parentmenu.submenu.push(value)
                }
              })
            })
            parentmenudata.sort((a, b) => { return a.orderid - b.orderid })

            // get inner child menu

            parentmenudata.forEach((parentmenu, parentindex) => {
              if (parentmenu.submenu.length !== 0) {
                return parentmenu.submenu.forEach((submenu, submenuindex) => {
                  return data.filter((value, dataindex) => {
                    if (submenu.menuid === value.parentmenuid) {
                      submenu.submenu.push(value)
                    }
                  })
                })
              }
            })

            res.status(200).json(parentmenudata)
          }
        })
      } else {
        res.status(404).send("User Not Found")
      }
    }
  });
  // } else {
  //   res.status(404).send(error);
  // }
};
