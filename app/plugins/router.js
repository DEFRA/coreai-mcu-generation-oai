const routes = [].concat(
  require('../routes/healthy'),
  require('../routes/healthz'),
  require('../routes/index')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, _) => {
      server.route(routes)
    }
  }
}
