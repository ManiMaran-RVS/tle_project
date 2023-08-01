module.exports.changePassword = (user, callback) => {
    db.query(`SELECT password FROM ${process.env.RAVES_DBNAME}.users WHERE id='${user.id}'`, (error, result) => {
        if (error) throw error;
        bcrypt.compare(user.current, result[0].password, (err, match) => {
            if (match){
                bcrypt.hash(user.new, saltRounds, function (er, hash) {
                    db.query(`UPDATE ${process.env.RAVES_DBNAME}.users SET password='${hash}' WHERE id='${user.id}'`, callback);
                });
            }else {
             
            }
        });
    });

};