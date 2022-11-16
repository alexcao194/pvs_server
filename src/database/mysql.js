sql = require('mysql2')
const debug = console.log.bind(console);
const valid = require("../helpers/valid")



const connecter = sql.createConnection({
    host: "localhost",
    user: "root",
    password: "admin",
    database: "pvs"
});

var createUserTable = "CREATE TABLE IF NOT EXISTS users ("
                + " id VARCHAR(12) NOT NULL,"
                + " display_name VARCHAR(100) NOT NULL,"
                + " birthday VARCHAR(25),"
                + " gender INT,"
                + " avatar VARCHAR(255),"
                + " email VARCHAR(255) NOT NULL,"
                + " group_class INT,"
                + " background VARCHAR(255),"
                + " phone_number VARCHAR(15) NOT NULL,"
                + " current_lesson INT NOT NULL,"
                + " total_lesson INT NOT NULL,"
                + " state INT NOT NULL,"
                + " PRIMARY KEY(id)) DEFAULT CHARSET=utf8;";
connecter.query(createUserTable, function(error, data) {
  if(error) debug(error);
  else debug('create users table successful');
});

var createAccountTable = "CREATE TABLE IF NOT EXISTS accounts ("
                + " id VARCHAR(12) NOT NULL,"
                + " pwd VARCHAR(25) NOT NULL,"
                + " recovery_email VARCHAR(255) NOT NULL,"
                + " auth INT NOT NULL,"
                + " PRIMARY KEY(id)) DEFAULT CHARSET=utf8;";
connecter.query(createAccountTable, function(error, data) {
  if(error) debug(error);
  else debug('create accounts table successful');
});

let checkAcount = (id, password) => {
  return new Promise((resolve, reject) => {
    var sql = `SELECT * FROM accounts WHERE id = '${id}' AND pwd = '${password}'`;
    connecter.query(sql, function(error, data) {
        if(error) reject(error)
        resolve(!(data.length === 0))
    })
  })
}

let login = (id, password) => {
  return new Promise((resolve, reject) => {
    var sql = `SELECT * FROM accounts WHERE id = '${id}' AND pwd = '${password}'`;
    connecter.query(sql, function(error, data) {
        if(error) reject(error)
        if(data.length == 0) {
          resolve('incorrect-account')
          return;
        } 
        if(data[0].auth == 0) {
          resolve('not-registry')
          return;
        }
        resolve('login-successful')
    })
  })
}

let signup = (id, password, email) => {
  return new Promise((resolve, reject) => {
    if(!valid.validAccount(id)) {
      resolve('invalid-id');
    } else if(!valid.validEmail(email)) {
      resolve('invalid-email');
    } else if(!valid.validPassword(password)) {
      resolve('invalid-password');
    } else {
      var sqlCheckId = `SELECT * FROM accounts WHERE id = '${id}'`;
      connecter.query(sqlCheckId, function(error, data) {
        if(error) reject(error);
        if(data.length != 0) {
          resolve('exists-account');
        } else {
          var sql = `INSERT INTO accounts (id, pwd, recovery_email, auth) VALUES ('${id}', '${password}', '${email}', '${0}');`;
          connecter.query(sql, function(error, data) {
            if(error) reject(error);
            resolve('signup-successful');
          });
        }
      });
    }
  })
}

let updateProfile = (birthday, gender, number, email, avatar, id) => {
  debug(birthday)
  debug(email)
  debug(number)
  debug(avatar)
  return new Promise((resolve, reject) => {
    if(!valid.validPhoneNumber(number)) {
      resolve('invalid-phone-number');
      return;
    }
    if(!valid.validEmail(email)) {
      resolve('invalid-email');
    }
    var sql = ''
    if(avatar != 'undefined') sql = `UPDATE users SET birthday = '${birthday}', gender = '${gender}', email = '${email}', phone_number = '${number}', avatar = 'users/${id}/avatar.jpg' WHERE id = '${id}'`
    else sql = `UPDATE users SET birthday = '${birthday}', gender = '${gender}', email = '${email}', phone_number = '${number}' WHERE id = '${id}'`
    connecter.query(sql, function(error, data) {
      if(error) reject(error)
      else {
        resolve(id)
      }
    })
  })
}

let updateLesson = (id, totalLesson) => {
  return new Promise((resolve, reject) => {
    var sql = `UPDATE users SET total_lesson = '${totalLesson}' WHERE id = '${id}'`
    connecter.query(sql, function(error) {
      if(error) reject(error)
      resolve('done')
    })
  })
}

let registry = (id, displayName, birthday, gender, avatar, email, groupClass, background, phoneNumber, currentLesson, totalLesson, state) => {
  return new Promise((resolve, reject) => {
    if(!valid.validPhoneNumber(phoneNumber)) {
      resolve('invalid-phone-number');
    }
    var sql = `SELECT * FROM accounts WHERE id = '${id}'`
    connecter.query(sql, function(error, data) {
      if(error) reject(error);
      else {
        if(data[0].auth == '1') resolve('exits-infor')
        var sql2 = `INSERT INTO users (id, display_name, birthday, gender, avatar, email, group_class, background, phone_number, current_lesson, total_lesson, state) VALUES ('${id}', '${displayName}', '${birthday}', '${gender}', '${avatar}', '${email}', '${groupClass}', '${background}', '${phoneNumber}', '${currentLesson}', '${totalLesson}', '${state}')`;
        connecter.query(sql2, function(error, data) {
          if(error) {
            reject(error);
          }
          var sql3 = `UPDATE accounts SET auth = '1' WHERE id = '${id}'`;
          connecter.query(sql3, function(error, data) {
            if(error) {
              reject(error);
            }
            else {
              resolve('registry-successful');
            }
          })
        })
      }
    })
  })
}

let getUser = (id) => {
  return new Promise((resolve, reject) => {
    var sql = `SELECT * FROM users WHERE id = '${id}'`
    connecter.query(sql, function(error, data) {
      if(error) reject(error);
      resolve(data[0])
    });
  })
}

let getAccount = (id) => {
  return new Promise((resolve, reject) => {
    var sql = `SELECT * FROM accounts WHERE id = '${id}'`
    connecter.query(sql, function(error, data) {
      if(error) reject(error)
      resolve(data[0])
    })
  })
}

module.exports = {
  checkAcount : checkAcount,
  getUser : getUser,
  login: login,
  getAccount, getAccount,
  signup: signup,
  updateProfile: updateProfile,
  registry: registry,
  updateLesson: updateLesson
}