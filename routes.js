const handler = require('./handler')

module.exports = [
    {
        method: 'GET',
        path: '/api',
        handler: handler.getStatus
    },
    {
        method: 'GET',
        path: '/api/page/{pagination}',
        handler: handler.getPage
    },
    {
        method: 'GET',
        path: '/api/daftar-anime',
        handler: handler.getDaftarNime
    },
    {
        method: 'GET',
        path: '/api/genre/{genre}/page/{pagination}',
        handler: handler.getGenreAnimeList
    },
    {
        method: 'GET',
        path: '/api/season/{season}/page/{pagination}',
        handler: handler.getSeasonAnimeList
    },
    {
        method: 'GET',
        path: '/api/genre-season-list',
        handler: handler.getGenreSeasonList
    },
    {
        method: 'GET',
        path: '/api/anime/{anim}/',
        handler: handler.getAnime
    },
    {
        method: 'GET',
        path: '/api/search/{query}',
        handler: handler.getBySearch
    }
]