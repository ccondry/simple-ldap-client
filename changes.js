const ldap = require('ldapjs')

function encodePassword (password) {
  var newPassword = ''
  password = "\"" + password + "\""
  for(var i = 0; i < password.length; i++){
    newPassword += String.fromCharCode( password.charCodeAt(i) & 0xFF,(password.charCodeAt(i) >>> 8) & 0xFF)
  }
  return newPassword
}

module.exports = {
  replacePassword (password) {
    return new ldap.Change({
      operation: 'replace',
      modification: {
        unicodePwd: encodePassword(password)
      }
    })
  },
  deletePassword(password) {
    return new ldap.Change({
      operation: 'delete',
      modification: {
        unicodePwd: encodePassword(password)
      }
    })
  },
  addPassword(password) {
    return new ldap.Change({
      operation: 'add',
      modification: {
        unicodePwd: encodePassword(password)
      }
    })
  }
}
