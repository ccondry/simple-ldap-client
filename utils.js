function getUser(client, baseDn, opts) {
  return new Promise((resolve, reject) => {
    // find the user
    client.search(baseDn, opts, (err, search) => {
      if (err) {
        console.log(err)
        reject(err)
      }
      search.on('searchEntry', (entry) => {
        resolve(entry.object)
      })
      search.on('end', (result) => {
        // tell the client we didn't find anything in the search
        resolve()
      })
    })
  })
}

function applyChanges(client, baseDn, opts, changes) {
  return new Promise((resolve, reject) => {
    // find the user and modify their password
    client.search(baseDn, opts, (err, search) => {
      if (err) {
        console.log(err)
        reject(err)
      }
      search.on('searchEntry', (entry) => {
        var user = entry.object
        client.modify(user.dn, changes, (err) => {
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
  getUser,
  applyChanges,
  findByUsernameOptions,
  findByUpnOptions
}
