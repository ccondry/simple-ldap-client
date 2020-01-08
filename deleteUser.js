const ldap = require('ldapjs')

module.exports = function ({adminDn, adminPassword, userDn}) {
  return new Promise((resolve, reject) => {
    // create client connection
    const client = this.getClient()
    // catch LDAP connection errors
    client.on('connectError', function (err) {
      console.log('Error connecting to LDAP:', err)
      reject(err)
    })
    // login to LDAP as admin
    client.bind(adminDn, adminPassword, async (err) => {
      if (err) {
        // error during bind as admin to LDAP
        console.log(err)
        client.destroy()
        reject(err)
      } else {
        // successfully bind as admin to LDAP
        // delete user by DN
        client.del(userDn, function (e) {
          if (e) {
            // error deleting user
            client.destroy()
            reject(e)
          } else {
            // successfully deleted user
            client.destroy()
            resolve()
          }
        })
      }
    })
  })
}
