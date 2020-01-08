'use strict'
const ldap = require('ldapjs')
const ldapChanges = require('./changes')
const utils = require('./utils')

module.exports = function ({adminDn, adminPassword, username, upn, userDn, email, changes}) {
  return new Promise((resolve, reject) => {
    // create client connection
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
        client.destroy()
        return reject(err)
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
        attributes: ['objectGUID']
      }

      try {
        const user = await utils.applyChanges.call(this, client, this.baseDn, opts, changes)
        // console.log('Password reset for ' + user.dn)
        client.destroy()
        resolve(user)
      } catch (e) {
        client.destroy()
        reject(e)
      }
    })
  })
}
