import axios from 'axios'

export const base = import.meta.env.BASE_URL

export const publicApi = axios.create({
    baseURL: import.meta.env.VITE_API_DOMAIN,
    timeout: 5000
})

export const musicApi = axios.create({
    baseURL: 'https://api.spotify.com',
    timeout: 5000
})