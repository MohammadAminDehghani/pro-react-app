const database = require('./database')
const layout = require('./layout')
const service = require('./service')
const session = require('./session')


module.exports = {
    database,
    layout,
    service,
    session,
    debug : true
}