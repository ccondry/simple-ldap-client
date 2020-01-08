const ldap = require('ldapjs')
const ldapChanges = require('./changes')
const utils = require('./utils')

function authenticate ({ upn, password }) {
  return new Promise((resolve, reject) => {
    // console.log('attempthing LDAP authentication...')
    if (!upn || upn === '') reject('upn is required')
    if (!password || password === '') reject('password is required')

    const client = this.getClient()
    // catch LDAP connection errors
    client.on('connectError', function (err) {
      console.log('Error connecting to LDAP:', err)
      reject(err)
    })
    // bind LDAP client
    client.bind(upn, password, (err) => {
      // console.log('bind complete')
      if (err) {
        client.destroy()
        reject(err)
      } else {
        client.destroy()
        resolve()
      }
    })
  })
}

module.exports = authenticate
