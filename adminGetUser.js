'use strict'
const utils = require('./utils')

module.exports = function ({ adminDn, adminPassword, upn, attributes }) {
  return new Promise((resolve, reject) => {
    // validate input
    if (
      (!upn || upn === '') &&
      (!adminDn || adminDn === '') &&
      (!adminPassword || adminPassword === '') &&
      (!attributes || attributes === '')
    ) {
      // inform user the error of their ways
      reject('adminDn, adminPassword, upn, and attributes are required')
    }
    const client = this.getClient()
    // login to LDAP
    client.bind(adminDn, adminPassword, async (err) => {
      // console.log('ldap client bind')
      if (err) {
        console.log(err)
        client.destroy(err)
        reject(err)
      }
      // figure out which filter to use to identify the user
      const filter = '(userPrincipalName=' + upn + ')'
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
