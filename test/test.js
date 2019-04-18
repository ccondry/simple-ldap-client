'use strict'
// #NODE_EXTRA_CA_CERTS=/temp/dcloud-ad1-ca.crt
const ldapClient = require('../index.js')
const config = require('./test.config.js')

describe(`Test LDAP operations`, () => {
  // init client
  let ldap = new ldapClient(config.url, config.baseDn)

  // it('should successfully authenticate the test user', function(done) {
  //   // attempt authentication
  //   ldap.authenticate({
  //     upn: config.upn,
  //     password: config.password
  //   })
  //   .then(rsp => {
  //     done()
  //   })
  //   .catch(error => {
  //     done(error)
  //   })
  // })
  //
  // it(`should successfully reset the test user's password by username`, function(done) {
  //   ldap.resetPassword({
  //     adminDn: config.adminDn,
  //     adminPassword: config.adminPassword,
  //     username: config.username,
  //     newPassword: config.password
  //   })
  //   .then(rsp => {
  //     done()
  //   })
  //   .catch(error => {
  //     done(error)
  //   })
  // })
  //
  // it(`should successfully change the test user's password`, function(done) {
  //   ldap.changePassword({
  //     upn: config.upn,
  //     currentPassword: config.password,
  //     newPassword: config.password
  //   })
  //   .then(rsp => {
  //     done()
  //   })
  //   .catch(error => {
  //     done(error)
  //   })
  // })

  it(`should create the test user`, function(done) {
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
      done()
    })
    .catch(error => {
      done(error)
    })
  })

  it(`should add the test user to the "Demo Admins" group`, function(done) {
    ldap.addToGroup({
      adminDn: config.adminDn,
      adminPassword: config.adminPassword,
      username: 'jopeters0002',
      // upn: '',
      // userDn: '',
      // email: '',
      groupDn: 'CN=Demo Admins,CN=Users,DC=dcloud,DC=cisco,DC=com'
    })
    .then(rsp => {
      done()
    })
    .catch(error => {
      done(error)
    })
  })
})
