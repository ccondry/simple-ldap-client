const ldap = require('ldapjs')
const client = ldap.createClient({ url: process.env.ldap_url, reconnect: true })
client.on('error', (err) => {
    console.warn('LDAP connection terminated on far-end, but it should reconnect.', err);
})
// our ldap client
module.exports = client
