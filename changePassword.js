const ldap = require('ldapjs')
const ldapChanges = require('./changes')
const utils = require('./utils')

function changePassword ({ upn, currentPassword, newPassword }) {
  return new Promise((resolve, reject) => {
    if (!upn || upn === '') reject('upn is required')
    if (!currentPassword || currentPassword === '') reject('currentPassword is required')
    if (!newPassword || newPassword === '') reject('newPassword is required')
    // our ldap client
    this.client.bind(upn, currentPassword, async (err) => {
      if (err) {
        console.log(err)
        reject(err)
      }

      // get the changes array for deleting current password and adding new password
      const changes = [
        ldapChanges.deletePassword(currentPassword),
        ldapChanges.addPassword(newPassword)
      ]

      // find user
      const opts = utils.findByUpnOptions(upn)

      try {
        const user = await utils.applyChanges.call(this, this.baseDn, opts, changes)
        // console.log('Password changed for ' + user.dn)
        // client.unbind()
        resolve(user)
      } catch (e) {
        // client.unbind()
        reject(e)
      }
    })
  })
}

module.exports = changePassword
