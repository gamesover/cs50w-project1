import $ from 'jquery'
import { getToken } from './Token'

const token = getToken()

export function getApi(url, params) {
  // const token = getToken()
  const targetUrl = params ? `${url}?${$.params(params)}` : url
  const getParams = {
    headers: {
      'Authorization': `Bearer ${token}`
    },
  }

  return fetch(targetUrl, getParams)
    .then(response => response.json())
}

export function postApi(url, params = {}) {

  const postParams = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(params)
  }
  return fetch(url, postParams)
    .then(response => response.json())
}