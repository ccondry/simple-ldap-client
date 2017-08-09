'use strict'
// #NODE_EXTRA_CA_CERTS=/temp/dcloud-ad1-ca.crt
const ldapClient = require('../index.js')

describe(`Test LDAP operations`, () => {
  // init client
  let ldap = new ldapClient('ldaps://ad1.dcloud.cisco.com:636/', 'DC=dcloud,DC=cisco,DC=com')

  it('should successfully authenticate the test user', function(done) {
    // attempt authentication
    ldap.authenticate({
      upn: 'sjeffers@dcloud.cisco.com',
      password: 'C1sco12345'
    })
    .then(rsp => {
      done()
    })
    .catch(error => {
      done(error)
    })
  })

  it(`should successfully reset the test user's password by username`, function(done) {
    ldap.resetPassword({
      adminDn: 'administrator@dcloud.cisco.com',
      adminPassword: 'C1sco12345',
      username: 'sjeffers',
      newPassword: 'C1sco12345'
    })
    .then(rsp => {
      done()
    })
    .catch(error => {
      done(error)
    })
  })

  it(`should successfully change the test user's password`, function(done) {
    ldap.changePassword({
      upn: 'sjeffers@dcloud.cisco.com',
      currentPassword: 'C1sco12345',
      newPassword: 'C1sco12345'
    })
    .then(rsp => {
      done()
    })
    .catch(error => {
      done(error)
    })
  })
})
