const ldap = require('ldapjs')
const ldapChanges = require('./changes')
const utils = require('./utils')

function authenticate ({ upn, password }) {
  return new Promise((resolve, reject) => {
    // console.log('attempthing LDAP authentication...')
    if (!upn || upn === '') reject('upn is required')
    if (!password || password === '') reject('password is required')

    // bind LDAP client
    this.client.bind(upn, password, (err) => {
      // console.log('bind complete')
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

module.exports = authenticate
