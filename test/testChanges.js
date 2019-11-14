'use strict'
const ldapClient = require('../index.js')
const config = require('./test.config.js')
const ldapChanges = require('../changes')

// init client
let ldap = new ldapClient(config.url, config.baseDn)

// normal account where password does not expire and cannot be changed
const myUac = ldapChanges.constants.normalAccount |
  ldapChanges.constants.passwordCantChange |
  ldapChanges.constants.dontExpirePassword

// replace user account control bits
const replaceUac = new ldap.Change({
  operation: 'replace',
  modification: {
    userAccountControl: String(myUac)
  }
})
// set up changes we want to make to the user
const changes = [replaceUac]

// ldapChanges.constants.disabled: UF_ACCOUNTDISABLE,
  // passwordNotRequired: UF_PASSWD_NOTREQD,
  // passwordCantChange: UF_PASSWD_CANT_CHANGE,
  // normalAccount: UF_NORMAL_ACCOUNT,
  // dontExpirePassword: UF_DONT_EXPIRE_PASSWD,
  // passwordExpired: UF_PASSWORD_EXPIRED

// go
ldap.changeUser({
  adminDn: config.adminDn,
  adminPassword: config.adminPassword,
  username: 'jopeters0325',
  changes
})
.then(rsp => {
  console.log('done', rsp)
})
.catch(error => {
  console.log('error', error)
})
