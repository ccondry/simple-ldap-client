'use strict'
const utils = require('./utils')
const defaultAttributes = [
  'objectGUID',
  'name',
  'sAMAccountName',
  'memberOf',
  'primaryGroupID',
  'description',
  'physicalDeliveryOfficeName',
  'distinguishedName',
  'mail',
  'userPrincipalName',
  'whenChanged',
  'whenCreated',
  'givenName',
  'sn',
  'telephoneNumber',
  'userAccountControl'
]

module.exports = function ({ adminDn, adminPassword, userDn, upn, username, email, attributes = defaultAttributes }) {
  return new Promise((resolve, reject) => {
    // validate input
    if (
      (!adminDn || adminDn === '') &&
      (!adminPassword || adminPassword === '') &&
      (!attributes || attributes === '')
    ) {
      // inform user the error of their ways
      reject('adminDn, adminPassword, and attributes are required')
    }
    if (
      (!userDn || userDn === '') &&
      (!upn || upn === '') &&
      (!username || username === '') &&
      (!email || email === '')
    ) {
      // inform the user of the error of their ways
      return reject('userDn, upn, username, or email is required')
    }
    const client = this.getClient()
    // catch LDAP connection errors
    client.on('connectError', function (err) {
      console.log('Error connecting to LDAP:', err)
      reject(err)
    })
    // login to LDAP
    client.bind(adminDn, adminPassword, async (err) => {
      // console.log('ldap client bind')
      if (err) {
        console.log(err)
        client.destroy(err)
        reject(err)
      }
      // figure out which filter to use to identify the user
      let filter
      if (username) {
        filter = '(sAMAccountName=' + username + ')'
      } else if (email) {
        filter = '(mail=' + email + ')'
      } else if (upn) {
        filter = '(userPrincipalName=' + upn + ')'
      } else if (userDn) {
        filter = '(distinguishedName=' + userDn + ')'
      }
      // find user by filter
      const opts = {
        filter,
        scope: 'sub',
        attributes
      }

      try {
        const user = await utils.getUser.call(this, client, this.baseDn, opts)
        client.destroy()
        resolve(user)
      } catch (e) {
        client.destroy()
        reject(e)
      }
    })
  })
}
