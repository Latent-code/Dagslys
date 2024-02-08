import * as admin from 'firebase-admin';
import axios, { AxiosRequestConfig } from "axios"

const serviceAccount = JSON.parse(
  process.env.FIREBASE_ADMIN_API as string
);

admin.initializeApp({
  credential: admin.credential.cert(
    serviceAccount
  )
});

function checkAuth(token) {
  return admin.auth().verifyIdToken(token).then(decodedToken => {
    console.log("User authenticated!")
    return decodedToken
  }).catch(error => {
    return error
  })
}

async function get(endpoint, projectData) {
  const data = decodeURIComponent(projectData)
  const decodedEndpoint = decodeURI(endpoint)
  const token = process.env.RENTMAN_API
  const config: AxiosRequestConfig = {
    method: 'POST',
    maxBodyLength: Infinity,
    url: decodedEndpoint,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data
  }
  return axios
  .request(config)
  .then(response => {
    return {...response.data}
  })
  .catch(error => {
    return {...error.response}
  })
}
export default async function handler(request, response) {
  const headerToken = request.headers.authorization;
  try {
    const auth = await checkAuth(headerToken)
    if(auth.user_id) {
      try {
        const data = await get(request.query.endpoint, request.query.projectData)
        response.status(200).json({
          url: request.query.endpoint,
          limit: request.query.limit,
          offset: request.query.offset,
          body: data,
        });
      } catch (error) {
        console.log("Failed to POST data: ", error)
        response.status(500).json({ error: error.message });
      }
    }
  } catch (error) {
    console.log("Failed to authenticate", error)
    response.status(500).json(error);
  } 
}
