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
    const client = this.getClient()
    // catch LDAP connection errors
    client.on('connectError', function (err) {
      console.log('Error connecting to LDAP:', err)
      reject(err)
    })
    // wait for LDAP to connect
    client.on('setup', function (clt, cb) {
      // login to LDAP
      client.bind(upn, password, async (err) => {
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
  })
}

module.exports = getUser
