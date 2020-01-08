const ldap = require('ldapjs')
const ldapChanges = require('./changes')
const utils = require('./utils')

function changePassword ({ upn, currentPassword, newPassword }) {
  return new Promise((resolve, reject) => {
    if (!upn || upn === '') reject('upn is required')
    if (!currentPassword || currentPassword === '') reject('currentPassword is required')
    if (!newPassword || newPassword === '') reject('newPassword is required')

    const client = this.getClient()
    // catch LDAP connection errors
    client.on('connectError', function (err) {
      console.log('Error connecting to LDAP:', err)
      reject(err)
    })
    // our ldap client
    client.bind(upn, currentPassword, async (err) => {
      if (err) {
        console.log(err)
        client.destroy()
        return reject(err)
      }

      // get the changes array for deleting current password and adding new password
      const changes = [
        ldapChanges.deletePassword(currentPassword),
        ldapChanges.addPassword(newPassword)
      ]

      // find user
      const opts = utils.findByUpnOptions(upn)

      try {
        const user = await utils.applyChanges.call(this, client, this.baseDn, opts, changes)
        // console.log('Password changed for ' + user.dn)
        // client.unbind()
        client.destroy()
        resolve(user)
      } catch (e) {
        // client.unbind()
        client.destroy()
        reject(e)
      }
    })
  })
}

module.exports = changePassword
