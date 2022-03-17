import axios from 'axios'

export const getExchangeRatesApi = () =>
  axios.get('https://www.cbr-xml-daily.ru/daily_json.js')

export const getExchangeRatesOldApi = (prevUrl) => axios.get('https:' + prevUrl)
