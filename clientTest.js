// init client
// let ldap = new ldapClient('ldaps://ad1.dcloud.cisco.com:636/', 'DC=dcloud,DC=cisco,DC=com')
try {
  let ldap = ldap.createClient({ "url": "ldaps://ad1.dcloud.cisco.com:636/", "bindDN": "sjeffers@dcloud.cisco.com", "bindCredentials": "C1sco123456" });
  process.exit()
} catch (e) {
  console.log(e)
  process.exit()
}
// ldap.authenticate({
//   upn: 'sjeffers@dcloud.cisco.com',
//   password: 'C1sco123456'
// }).then(function () {
//   console.log('done!!')
//   done()
// })
// .catch(function (error) {
//   done(error)
// })
