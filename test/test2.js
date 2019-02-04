'use strict'
const ldapClient = require('../index.js')
const config = require('./test.config.js')

// init client
let ldap = new ldapClient(config.url, config.baseDn)

ldap.createUser({
  adminDn: config.adminDn,
  adminPassword: config.adminPassword,
  firstName: 'Josh 0002',
  lastName: 'Peterson',
  username: 'jopeters0002',
  domain: 'dcloud.cisco.com',
  physicalDeliveryOfficeName: '0002',
  telephoneNumber: '10820002',
  userId: '0002',
  mail: 'jopeters0002' + '@' + 'dcloud.cisco.com',
  usersDn: 'OU=Demo Users,DC=dcloud,DC=cisco,DC=com',
  // memberOf: 'CN=Demo Users,OU=Demo Users,DC=dcloud,DC=cisco,DC=com'
})
.then(rsp => {
  console.log('done', rsp)
})
.catch(error => {
  console.log('error', error)
})
