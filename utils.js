function applyChanges(baseDn, opts, changes) {
  return new Promise((resolve, reject) => {
    // find the user and modify their password
    this.client.search(baseDn, opts, (err, search) => {
      if (err) {
        console.log(err)
        reject(err)
      }
      search.on('searchEntry', (entry) => {
        var user = entry.object
        this.client.modify(user.dn, changes, (err) => {
          if (err) {
            // failed to change password
            console.log(err.code)
            console.log(err.name)
            console.log(err.message)
            reject(err)
          }
          else {
            resolve(user)
          }
        })
      })
      search.on('end', (result) => {
        // console.log('search.on end result = ', result)
        // resolve()
        // client.unbind()
      })
    })
  })
}

function findByUsernameOptions(username) {
  return {
    filter: '(sAMAccountName=' + username + ')',
    scope: 'sub',
    attributes: ['objectGUID']
  }
}

function findByUpnOptions(upn) {
  return {
    filter: '(userPrincipalName=' + upn + ')',
    scope: 'sub',
    attributes: ['objectGUID']
  }
}

module.exports = {
  applyChanges,
  findByUsernameOptions,
  findByUpnOptions
}
