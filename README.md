# ldap-client
This is a simple wrapper library to make it easier to do basic LDAP operations
like changing a password, resetting a password, and authenticating.

## Usage
```js
const ldapClient = require('ldap-client')
const url = 'ldaps://ad1.dcloud.cisco.com:636/'
const baseDn = 'DC=dcloud,DC=cisco,DC=com'
const upn = 'sjeffers@dcloud.cisco.com'
const password = 'C1sco12345'

// init client
let ldap = new ldapClient(url, baseDn)

// attempt authentication
ldap.authenticate({ upn, password })
.then(() => {
  console.log('authentication successful')
})
.catch(error => {
  console.log(error)
})
```
