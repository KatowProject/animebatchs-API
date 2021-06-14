const Hapi = require('@hapi/hapi');

(async () => {
    const server = Hapi.server({
        port: 3002,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*']
            }
        }
    })

    server.route(require('./routes'))
    await server.start()

    console.log('Listening on port ' + server.info.port)
})()
