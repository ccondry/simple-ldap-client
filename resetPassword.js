'use strict'
const ldap = require('ldapjs')
const ldapChanges = require('./changes')
const utils = require('./utils')

function resetPassword ({ adminDn, adminPassword, newPassword, userDn, upn, username, email }) {
  return new Promise((resolve, reject) => {
    // console.log('starting LDAP password reset')
    // validate input
    if (
      (!userDn || userDn === '') &&
      (!upn || upn === '') &&
      (!username || username === '') &&
      (!email || email === '')
    ) {
      // inform the user of the error of their ways
      reject('userDn, upn, username, or email is required')
    }
    // continue validating input
    if (!newPassword || newPassword === '') {
      // inform the user of the error of their ways
      reject('newPassword is required')
    }
    // console.log('attempting LDAP bind...')
    // login to LDAP
    this.client.bind(adminDn, adminPassword, async (err) => {
      // console.log('ldap client bind')
      if (err) {
        // console.log(err)
        reject(err)
      }
      // set up changes to replace user password
      const changes = [ldapChanges.replacePassword(newPassword)]
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
        const user = await utils.applyChanges.call(this, this.baseDn, opts, changes)
        // console.log('Password reset for ' + user.dn)
        // client.unbind()
        resolve(user)
      } catch (e) {
        // client.unbind()
        reject(e)
      }
    })
  })
}

module.exports = resetPassword
