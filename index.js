'use strict'
// ldap library
const ldap = require('ldapjs')
const ldapChanges = require('./changes')
const _resetPassword = require('./resetPassword')
const _changePassword = require('./changePassword')
const _authenticate = require ('./authenticate')
const _getUser = require ('./getUser')
const _adminGetUser = require ('./adminGetUser')
const _listUsers = require ('./listUsers')
const _createUser = require ('./createUser')
const _disableUser = require ('./disableUser')
const _enableUser = require ('./enableUser')

module.exports = class ldapClient {
  constructor (url, baseDn) {
    // console.log('creating LDAP client')
    this.url = url
    this.baseDn = baseDn
    // console.log('LDAP client created.')
  }

  getClient () {
    // create client connection
    const url = this.url
    const client = ldap.createClient({ url, reconnect: true })
    client.on('error', (err) => {
      console.warn('LDAP connection terminated on far-end, but it should reconnect.', err);
    })
    return client
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

  getUser (params) {
    return _getUser.call(this, params)
  }

  adminGetUser (params) {
    return _adminGetUser.call(this, params)
  }

  listUsers (params) {
    return _listUsers.call(this, params)
  }

  createUser (params) {
    return _createUser.call(this, params)
  }

  enableUser (params) {
    return _enableUser.call(this, params)
  }

  disableUser (params) {
    return _disableUser.call(this, params)
  }
}
