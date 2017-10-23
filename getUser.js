'use strict'
const utils = require('./utils')

function getUser ({ upn, password, attributes }) {
  return new Promise((resolve, reject) => {
    // validate input
    if (
      (!upn || upn === '') &&
      (!password || password === '')
    ) {
      // inform user the error of their ways
      reject('upn, and password are required')
    }
    // login to LDAP
    this.client.bind(upn, password, async (err) => {
      // console.log('ldap client bind')
      if (err) {
        // console.log(err)
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
        const user = await utils.getUser.call(this, this.baseDn, opts)
        // client.unbind()
        resolve(user)
      } catch (e) {
        // client.unbind()
        reject(e)
      }
    })
  })
}

module.exports = getUser
