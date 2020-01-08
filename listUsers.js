'use strict'
const utils = require('./utils')

module.exports = function ({ adminDn, adminPassword, filter, attributes, searchDn }) {
  return new Promise((resolve, reject) => {
    // validate input
    if (
      (!adminDn || adminDn === '') &&
      (!adminPassword || adminPassword === '')
    ) {
      // inform user the error of their ways
      return reject('adminDn, and adminPassword are required')
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
      // console.log('ldap client bind')
      if (err) {
        // console.log(err)
        client.destroy()
        reject(err)
      }
      // figure out which filter to use to identify the user
      // const filter = '(&(objectClass=user)(OU=CXDemo Users))'
      // find user by filter
      const opts = {
        filter,
        scope: 'sub',
        attributes
      }

      try {
        let users = []
        // find the users
        client.search(searchDn, opts, (err, search) => {
          if (err) {
            console.log(err)
            client.destroy()
            reject(err)
          }
          search.on('searchEntry', (entry) => {
            users.push(entry.object)
          })
          search.on('end', (result) => {
            // console.log('search.on end result = ', result)
            client.destroy()
            resolve(users)
          })
        })
      } catch (e) {
        client.destroy()
        reject(e)
      }
    })
  })
}
