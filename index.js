'use strict'
// ldap library
const ldap = require('ldapjs')
const ldapChanges = require('./changes')
const _resetPassword = require('./resetPassword')
const _changePassword = require('./changePassword')
const _authenticate = require ('./authenticate')

module.exports = class ldapClient {
  constructor (url, baseDn) {
    // console.log('creating LDAP client')
    // client connection
    this.client = ldap.createClient({ url, reconnect: true })
    this.client.on('error', (err) => {
      console.warn('LDAP connection terminated on far-end, but it should reconnect.', err);
    })
    this.baseDn = baseDn
    // console.log('LDAP client created.')
  }

  resetPassword (params) {
    return _resetPassword.call(this, params)
  }

  changePassword (params) {
    return _changePassword.call(this, params)
  }

  authenticate (params) {
    return _authenticate.call(this, params)
  }
}
