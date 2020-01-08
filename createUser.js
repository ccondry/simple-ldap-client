'use strict'
const ldap = require('ldapjs')
const ldapChanges = require('./changes')
const utils = require('./utils')

module.exports = createUser

function createUser (params) {
  return new Promise((resolve, reject) => {
    // console.log('starting LDAP password reset')
    // validate input
    // if (
    //   (!userDn || userDn === '') &&
    //   (!upn || upn === '') &&
    //   (!username || username === '') &&
    //   (!email || email === '')
    // ) {
    //   // inform the user of the error of their ways
    //   return reject('userDn, upn, username, or email is required')
    // }
    // // continue validating input
    // if (!newPassword || newPassword === '') {
    //   // inform the user of the error of their ways
    //   return reject('newPassword is required')
    // }
    // create client connection
    const client = this.getClient()
    // catch LDAP connection errors
    client.on('connectError', function (err) {
      console.log('Error connecting to LDAP:', err)
      reject(err)
    })
    // login to LDAP
    client.bind(params.adminDn, params.adminPassword, async (err) => {
      // console.log('ldap client bind')
      if (err) {
        console.log(err)
        client.destroy()
        return reject(err)
      }

      const commonName = params.commonName || `${params.firstName} ${params.lastName}`
      const userPrincipalName = `${params.username}@${params.domain}`
      const entryDN = `CN=${commonName},${params.usersDn}`
      const newUser = {
        samAccountName: params.username,
        name: commonName,
        cn: commonName,
        givenName: params.firstName,
        sn: params.lastName,
        displayName: commonName,
        physicalDeliveryOfficeName: params.physicalDeliveryOfficeName || String(params.userId) || '',
        userPassword: params.password,
        objectClass: ["top", "person", "organizationalPerson", "user"],
        userPrincipalName,
        telephoneNumber: params.telephoneNumber || ''
      }
      // set email address if it was sent
      if (params.email) {
        newUser.mail = params.email
      }
      // set memberOf if it was sent
      if (params.memberOf) {
        newUser.memberOf = params.memberOf
      }
      // create new user
      client.add(entryDN, newUser, (err2, user) => {
        client.destroy()
        if (err2) reject(err2)
        resolve(user)
      })

    })
  })
}
