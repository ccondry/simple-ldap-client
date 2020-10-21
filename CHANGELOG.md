# simple-ldap-client Change Log

Version numbers are semver-compatible dates in YYYY.MM.DD-X format, where
X is the revision number

# 2020.10.21

### Bug Fixes
* **Delete User:** Fix uncaught/unhandled exceptions thrown by client.del. They
will now be rejected from the promise.
