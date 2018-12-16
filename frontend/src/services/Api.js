import { getToken } from './Token'

export function getApi(url, params) {
  const token = getToken()
  const targetUrl = params ? `${url}?${objToParams(params)}` : url
  const getParams = {
    headers: {
      'Authorization': `Bearer ${token}`
    },
  }

  return fetch(targetUrl, getParams)
    .then(response => response.json())
}

function objToParams(params) {
  return Object.entries(params).map(([key, val]) => `${key}=${encodeURIComponent(val)}`).join('&')
}

export function postApi(url, params = {}) {
  const token = getToken()
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