const axios = require('./tools')
const cheerio = require('cheerio')
const baseURL = 'https://animebatchs.net/'
const url = require('url')

const getStatus = async (req, h) => {
    try {
        const res = await axios('/')
        return h.response({
            success: true,
            statusCode: res.status,
            statusMessage: res.statusText,
        })
    } catch (e) {
        return h.response({
            success: false,
            statusCode: res.status,
            statusMessage: e.message || res.statusText,
        })
    }
}

const getPage = async (req, h) => {
    try {
        const pagination = req.params.pagination
        if (!parseInt(pagination)) return h.response({
            success: false,
            message: 'Parameter must be a number!'
        })

        const res = await axios('/page/' + pagination)
        const $ = cheerio.load(res.data)
        const main = $('.container.wrapper')

        const animeList = []
        const rekomendasi = []
        const popularSeries = []
        const genreList = []
        const seasonList = []

        $(main).find('.fts .ft').each((i, a) => {
            const data = $(a).find('.tb')
            const anime = {
                title: data.find('a').attr('title'),
                url: data.find('a').attr('href'),
                endpoint: data.find('a').attr('href').replace(baseURL, ''),
                thumb: data.find('a > img').attr('data-lazy-src')
            }
            rekomendasi.push(anime)
        })

        $(main).find('.kiri .items').each((i, a) => {
            const genres = []
            $(a).find('.meta a').each((j, b) => {
                genres.push({ name: $(b).text(), url: $(b).attr('href'), endpoint: $(b).attr('href').replace(baseURL, '') })
            })

            const anime = {
                title: $(a).find('a').attr('title'),
                url: $(a).find('a').attr('href'),
                endpoint: $(a).find('a').attr('href').replace(baseURL, ''),
                thumb: $(a).find('a > img').attr('data-lazy-src'),
                genre: genres
            }
            animeList.push(anime)
        })

        $(main).find('.serieslist.pop > ul li').each((i, a) => {
            const genres = []
            $(a).find('.raik > em a').each((j, b) => {
                genres.push({ name: $(b).text(), url: $(b).attr('href'), endpoint: $(b).attr('href').replace(baseURL, '') })
            })
            const anime = {
                title: $(a).find('a').attr('alt'),
                url: $(a).find('a').attr('href'),
                endpoint: $(a).find('a').attr('href').replace(baseURL, ''),
                thumb: $(a).find('img').attr('data-lazy-src'),
                genre: genres
            }
            popularSeries.push(anime)
        })

        $(main).find('.widget .widget').each((i, a) => {
            $(a).find('ul li').each((j, b) => {
                const type = $(b).find('a').attr('href').includes('genre') ? 'genre' : 'season'
                const info = {
                    name: $(b).find('a').text(),
                    url: $(b).find('a').attr('href'),
                    endpoint: $(b).find('a').attr('href').replace(baseURL, '')
                }
                switch (type) {
                    case 'genre':
                        genreList.push(info)
                        break;

                    case 'season':
                        seasonList.push(info)
                        break;
                }
            })
        })

        return h.response({ success: true, timestamp: Date.now(), data: { rekomendasi, animeList, popularSeries, genreList, seasonList } })
    } catch (e) {
        return h.response({ success: false, statusCode: 504, statusMessage: e.message })
    }
}

const getDaftarNime = async (req, h) => {
    try {
        const res = await axios('/daftar-anime')
        const $ = cheerio.load(res.data)
        const main = $('.kiri')

        const genreList = []
        const animeList = []

        $(main).find('.genreslist > li').each((i, a) => {
            const length = $(a).text().match(/(\d+)/g)
            const info = {
                name: $(a).find('a').text(),
                url: $(a).find('a').attr('href'),
                endpoint: $(a).find('a').attr('href').replace(baseURL, ''),
                length: parseInt(length),
            }
            genreList.push(info)
        })

        $(main).find('.daftarkartun .letter-group').each((i, a) => {
            const tempAnimes = []
            $(a).find('.penzbar').each((j, b) => {
                const data = $(b).find('.jdlbar ul > li')
                const anime = {
                    name: data.find('a').attr('title'),
                    url: data.find('a').attr('href'),
                }

                if (!anime.name) return
                tempAnimes.push(anime)
            })
            animeList.push({ name: $(a).find('.letter-cell').find('a').attr('name'), data: tempAnimes })
        })

        return h.response({ success: true, timestamp: Date.now(), data: { genreList, animeList } })
    } catch (e) {
        return h.response({ success: false, statusCode: 504, statusMessage: e.message })
    }
}

const getGenreAnimeList = async (req, h) => {
    try {
        const genre = req.params.genre
        const pagination = req.params.pagination
        if (!parseInt(pagination)) return h.response({ success: false, message: 'Parameter must be a number!' })

        const res = await axios('/genre/' + genre + '/page/' + pagination)
        const $ = cheerio.load(res.data)
        const main = $('.container.wrapper')

        const animeList = []

        $(main).find('.kiri .item2').each((i, a) => {
            const genres = []
            $(a).find('.meta a').each((j, b) => {
                genres.push({ name: $(b).text(), url: $(b).attr('href'), endpoint: $(b).attr('href').replace(baseURL, '') })
            })

            const anime = {
                title: $(a).find('a').attr('title'),
                url: $(a).find('a').attr('href'),
                endpoint: $(a).find('a').attr('href').replace(baseURL, ''),
                thumb: $(a).find('a > img').attr('data-lazy-src'),
                genre: genres
            }
            animeList.push(anime)
        })

        return h.response({ success: true, timestamp: Date.now(), data: animeList })
    } catch (e) {
        return h.response({ success: false, statusCode: 504, statusMessage: e.message })
    }
}

const getSeasonAnimeList = async (req, h) => {
    try {
        const season = req.params.season
        const pagination = req.params.pagination
        if (!parseInt(pagination)) return h.response({ success: false, message: 'Parameter must be a number!' })

        const res = await axios('/season/' + season + '/page/' + pagination)
        const $ = cheerio.load(res.data)
        const main = $('.container.wrapper')

        const animeList = []

        $(main).find('.kiri .item2').each((i, a) => {
            const genres = []
            $(a).find('.meta a').each((j, b) => {
                genres.push({ name: $(b).text(), url: $(b).attr('href'), endpoint: $(b).attr('href').replace(baseURL, '') })
            })

            const anime = {
                title: $(a).find('a').attr('title'),
                url: $(a).find('a').attr('href'),
                endpoint: $(a).find('a').attr('href').replace(baseURL, ''),
                thumb: $(a).find('a > img').attr('data-lazy-src'),
                genre: genres
            }
            animeList.push(anime)
        })

        return h.response({ success: true, timestamp: Date.now(), data: animeList })
    } catch (e) {
        return h.response({ success: false, statusCode: 504, statusMessage: e.message })
    }
}

const getGenreSeasonList = async (req, h) => {
    try {
        const res = await axios('/')
        const $ = cheerio.load(res.data)
        const main = $('.container.wrapper')

        const genreList = []
        const seasonList = []

        $(main).find('.widget .widget').each((i, a) => {
            $(a).find('ul li').each((j, b) => {
                const type = $(b).find('a').attr('href').includes('genre') ? 'genre' : 'season'
                const info = {
                    name: $(b).find('a').text(),
                    url: $(b).find('a').attr('href'),
                    endpoint: $(b).find('a').attr('href').replace(baseURL, '')
                }
                switch (type) {
                    case 'genre':
                        genreList.push(info)
                        break;

                    case 'season':
                        seasonList.push(info)
                        break;
                }
            })
        })
        return h.response({ success: true, timestamp: Date.now(), data: { genreList, seasonList } })
    } catch (e) {
        return h.response({ success: false, statusCode: 504, statusMessage: e.message })
    }
}

const getAnime = async (req, h) => {
    try {
        const reqAnime = req.params.anim
        const URL = encodeURI(reqAnime)
        const res = await axios(URL)
        const $ = cheerio.load(res.data)
        const main = $('.container.wrapper')

        const anim = {}
        const info = $(main).find('.meta tbody')

        const cover = $('.cover').find('noscript').text().split(" ")
        const coverURL = cover.filter(a => a.includes('https://'))[0].split('"')[1]

        const genreList = []
        info.find('tr:nth-child(8) > td:nth-child(2) a').each((i, a) => {
            genreList.push({ name: $(a).text(), url: $(a).attr('href'), endpoint: $(a).attr('href').replace(baseURL, '') })
        })

        let listDownload = []
        const oldThread = $(main).find('.download .downloadx')
        const newThread = $(main).find('.download')
        const data = oldThread.length >= 1 ? true : false

        if (data) {

            //chapter name
            $(oldThread).find('h5').each((i, a) => {
                listDownload.push({ name: $(a).text() });
            });

            //chapter linkDownload
            $(oldThread).find('ul').each((i, a) => {
                const tempres = []
                $(a).find('li').each((j, b) => {
                    const dl = {};
                    dl.reso = $(b).find('strong').text().trim()

                    const tempdl = []
                    $(b).find('a').each((k, c) => {
                        tempdl.push({ name: $(c).text().trim(), url: $(c).attr('href') })
                    })
                    dl.linkDownload = tempdl
                    tempres.push(dl)
                })
                listDownload[i].data = tempres
            })
        } else {
            $(newThread).find('.download-content').each((i, a) => {
                const tempres = []

                $(a).find('.item').each((j, b) => {
                    const tempdl = []

                    $(b).find('a').each((k, c) => {
                        //const parseURL = url.parse($(c).attr('href'), true).query
                        tempdl.push({ name: $(c).text(), url: $(c).attr('href') })
                    })

                    tempres.push({ reso: $(b).find('b').text(), linkDownload: tempdl })
                })
                listDownload.push({ name: $(newThread).find('h3 ').text(), data: tempres })
            })
        }

        anim.judul = info.find('tr:nth-child(1) > td:nth-child(2)').text()
        anim.alter = info.find('tr:nth-child(2) > td:nth-child(2)').text()
        anim.tipe = info.find('tr:nth-child(3) > td:nth-child(2)').text()
        anim.totalEps = info.find('tr:nth-child(4) > td:nth-child(2)').text()
        anim.status = info.find('tr:nth-child(5) > td:nth-child(2)').text()
        anim.studio = info.find('tr:nth-child(6) > td:nth-child(2)').text()
        anim.musim = info.find('tr:nth-child(7) > td:nth-child(2)').text()
        anim.genre = genreList
        anim.durasi = info.find('tr:nth-child(9) > td:nth-child(2)').text()
        anim.score = info.find('tr:nth-child(10) > td:nth-child(2)').text()
        anim.thumb = coverURL
        anim.listDownload = listDownload

        return h.response({ success: true, timestamp: Date.now(), data: anim })
    } catch (e) {
        console.log(e);
        return h.response({ success: false, statusCode: 504, statusMessage: e.message })
    }
}

const getBySearch = async (req, h) => {
    try {
        const query = req.params.query
        const res = await axios('/?s=' + query)
        const $ = cheerio.load(res.data)
        const main = $('.container.wrapper')

        const animeList = []

        $(main).find('.kiri .item2').each((i, a) => {
            const genres = []
            $(a).find('.meta a').each((j, b) => {
                genres.push({ name: $(b).text(), url: $(b).attr('href'), endpoint: $(b).attr('href').replace(baseURL, '') })
            })

            const anime = {
                title: $(a).find('a').attr('title'),
                url: $(a).find('a').attr('href'),
                endpoint: $(a).find('a').attr('href').replace(baseURL, ''),
                thumb: $(a).find('a > img').attr('data-lazy-src'),
                genre: genres
            }
            animeList.push(anime)
        })

        return h.response({ success: true, timestamp: Date.now(), data: animeList })
    } catch (e) {
        return h.response({ success: false, statusCode: 504, statusMessage: e.message })
    }
}

module.exports = { getStatus, getPage, getDaftarNime, getGenreAnimeList, getSeasonAnimeList, getGenreSeasonList, getAnime, getBySearch }