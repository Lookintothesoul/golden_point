import { useEffect, useState } from 'react'

import './ExchangeRates.css'
import {
  getExchangeRatesApi,
  getExchangeRatesOldApi,
} from './request/getExchangeRatesApi'

export const ExchangeRates = () => {
  const [exchangeRates, setExchangeRates] = useState(null)
  const [historyRates, setHistoryRates] = useState(null)

  useEffect(() => {
    getExchangeRatesApi().then((response) => {
      setExchangeRates(response.data)
    })
  }, [])

  if (!exchangeRates) {
    return <div>Not data :(</div>
  }

  function trend(current, previous) {
    if (current > previous)
      return (
        <span className="up">
          {(((current - previous) / previous) * 100).toFixed(4) + '% ▲'}
        </span>
      )
    if (current < previous)
      return (
        <span className="low">
          {(((current - previous) / previous) * 100).toFixed(4) + '% ▼'}
        </span>
      )
    return ' '
  }

  function handleClickValute(charCode) {
    if (!historyRates) {
      getHistoryRates(charCode).then((historyRates) =>
        setHistoryRates(historyRates),
      )
    } else {
      setHistoryRates(null)
    }
  }

  async function getHistoryRates(charCode) {
    let previousUrl = exchangeRates.PreviousURL
    const historyRates = { charCode, list: [] }

    for (let i = 0; i < 10; i++) {
      await getExchangeRatesOldApi(previousUrl)
        .then(({ data }) => {
          previousUrl = data.PreviousURL
          historyRates.list.push({
            date: data.Date,
            value: data.Valute[charCode].Value,
          })
        })
        .catch((e) => console.log('getExchangeRatesOldApi', e))
    }

    return historyRates
  }

  return (
    <div>
      <p className="curDate">
        Курсы валют на {exchangeRates.Date.slice(0, 10)}
      </p>

      <div>
        {Object.values(exchangeRates.Valute).map((valute) => (
          <div key={valute.ID} className="currentValute">
            <ul className="tableRate" type="none">
              <li
                className="Rate"
                onClick={() => handleClickValute(valute.CharCode)}
              >
                <span data-tooltip={valute.Name}>{valute.CharCode}</span>
                <span>{valute.Value.toFixed(4).replace('.', ',')} руб.</span>
                <span>{trend(valute.Value, valute.Previous)}</span>
              </li>

              {historyRates?.charCode === valute.CharCode && (
                <div>
                  {historyRates.list.map((rate) => (
                    <div key={rate.date} className="prevRates">
                      <span>{rate.date.slice(0, 10)}</span>
                      <span>
                        {rate.value.toFixed(4).replace('.', ',')} руб.
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
