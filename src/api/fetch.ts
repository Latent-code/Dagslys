import axios, { AxiosRequestConfig } from "axios"

async function get(endpoint, limit, offset) {
  const token = process.env.RENTMAN_API
  const decoded = decodeURI(endpoint)
  const config: AxiosRequestConfig = {
    method: 'GET',
    maxBodyLength: Infinity,
    url: `${decoded}?limit=${limit}&offset=${offset}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  return axios
  .request(config)
  .then(response => {
    console.log(response.data.data)
    return {...response.data}
  })
  .catch(error => {
    console.log(error)
  })
}
export default async function handler(request, response) {
  const data = await get(request.query.endpoint, request.query.limit, request.query.offset)
  response.status(200).json({
    // query: request.query,
    url: request.query.endpoint,
    limit: request.query.limit,
    offset: request.query.offset,
    body: data,
  
  });
}