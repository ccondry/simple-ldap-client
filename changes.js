const ldap = require('ldapjs')

function encodePassword (password) {
  var newPassword = ''
  password = "\"" + password + "\""
  for(var i = 0; i < password.length; i++){
    newPassword += String.fromCharCode( password.charCodeAt(i) & 0xFF,(password.charCodeAt(i) >>> 8) & 0xFF)
  }
  return newPassword
}

//some useful constants from lmaccess.h used for setting LDAP user attributes
const UF_ACCOUNTDISABLE = 0x0002
const UF_PASSWD_NOTREQD = 0x0020
const UF_PASSWD_CANT_CHANGE = 0x0040
const UF_NORMAL_ACCOUNT = 0x0200
const UF_DONT_EXPIRE_PASSWD = 0x10000
const UF_PASSWORD_EXPIRED = 0x800000

module.exports = {
  constants: {
    disabled: UF_ACCOUNTDISABLE,
    passwordNotRequired: UF_PASSWD_NOTREQD,
    passwordCantChange: UF_PASSWD_CANT_CHANGE,
    normalAccount: UF_NORMAL_ACCOUNT,
    dontExpirePassword: UF_DONT_EXPIRE_PASSWD,
    passwordExpired: UF_PASSWORD_EXPIRED
  },
  // change the password of an LDAP account
  replacePassword (password) {
    return new ldap.Change({
      operation: 'replace',
      modification: {
        unicodePwd: encodePassword(password)
      }
    })
  },
  // remove the password from an LDAP account
  deletePassword (password) {
    return new ldap.Change({
      operation: 'delete',
      modification: {
        unicodePwd: encodePassword(password)
      }
    })
  },
  // set the password for an LDAP account
  addPassword (password) {
    return new ldap.Change({
      operation: 'add',
      modification: {
        unicodePwd: encodePassword(password)
      }
    })
  },
  // enable an LDAP account
  enableUser () {
    return new ldap.Change({
      operation: 'replace',
      modification: {
        userAccountControl: String(UF_NORMAL_ACCOUNT)
      }
    })
  },
  // disable an LDAP account
  disableUser () {
    return new ldap.Change({
      operation: 'replace',
      modification: {
        userAccountControl: String(UF_ACCOUNTDISABLE)
      }
    })
  },
  // add an LDAP member to an LDAP group
  addMember (dn) {
    return new ldap.Change({
      operation: 'add',
      modification: {
        member: dn
      }
    })
  },
  // set password does not expire
  setPasswordDoesNotExpire () {
    return new ldap.Change({
      operation: 'add',
      modification: {
        userAccountControl: String(UF_DONT_EXPIRE_PASSWD)
      }
    })
  },
  // set password can't be changed
  setPasswordCannotChange () {
    return new ldap.Change({
      operation: 'add',
      modification: {
        userAccountControl: String(UF_PASSWD_CANT_CHANGE)
      }
    })
  }
}
