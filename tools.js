const axios = require('axios').default
const tough = require('tough-cookie')
const BaseURL = 'https://animebatchs.net/'
const cookieJar = new tough.CookieJar()

axios.defaults.baseURL = BaseURL
axios.defaults.jar = cookieJar

const Axios = async (url, options = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await axios.get(url, options)
            if (res.status === 200) return resolve(res)
            else reject(res)
        } catch (err) {
            return reject({ success: false, message: err.message })
        }
    })
}

module.exports = Axios