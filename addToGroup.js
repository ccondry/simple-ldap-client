'use strict'
const ldap = require('ldapjs')
const ldapChanges = require('./changes')
const utils = require('./utils')
const adminGetUser = require('./adminGetUser')

module.exports = function ({adminDn, adminPassword, username, upn, userDn, email, groupDn}) {
  return new Promise(async (resolve, reject) => {
    // validate input
    if (!adminDn || !adminPassword) {
      return reject('admin credentials are required for addToGroup LDAP operation.')
    }
    if (!username && !upn && !userDn && !email) {
      return reject('username, upn, userDn, or email are required parameters for addToGroup LDAP operation.')
    }
    if (!groupDn) {
      return reject('groupDn is a required parameter for addToGroup LDAP operation.')
    }
    // if we weren't provided userDn, get it first
    if (!userDn || !userDn.length) {
      // get the user details with DN
      try {
        const user = await adminGetUser.call(this, {
          adminDn, adminPassword, username, upn, userDn, email,
          attributes: ['distinguishedName']
        })
        // did we find any user?
        if (!user) return reject('User not found')
        userDn = user.distinguishedName
        // continue
      } catch (e) {
        // failed to get user DN
        return reject(e)
      }
    }
    // create client connection
    const client = this.getClient()
    // catch LDAP connection errors
    client.on('connectError', function (err) {
      console.log('Error connecting to LDAP:', err)
      reject(err)
    })
    // login to LDAP
    client.bind(adminDn, adminPassword, async (err) => {
      console.log('ldap client bind')
      if (err) {
        // failed
        // console.log(err)
        // destroy the client now
        client.destroy()
        return reject(err)
      }
      // set up changes to add userDn to the group
      const changes = [ldapChanges.addMember(userDn)]
      // console.log('changes', changes)
      client.modify(groupDn, changes, function(err, res) {
        console.log('in client.modify callback')
        // destroy the client first
        client.destroy()
        // check for error
        if (err) {
          // failed :(
          return reject(err)
        } else {
          // success :)
          return resolve(res)
        }
      })
    })
  })
}
