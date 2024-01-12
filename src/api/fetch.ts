// import axios from "axios"

// export default async function handler(request, response) {

//   const data = await request()
//   response.status(200).json({
//     body: request.body,
//     query: request.query,
//     cookies: request.cookies,
//   });
// }

import axios from "axios"

async function get(endpoint, limit, offset) {
  let items = []
  const token = process.env.GATSBY_RENTMAN_API
  const decoded = decodeURI(endpoint)
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${decoded}?limit=${limit}&offset=${offset}`,
    // url: `https://api.rentman.net/equipment?limit=${limit}&offset=${offset}`,
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


// http://localhost:3000/api/fetch?url=www.reiel.com&limit=22&offset=3333

