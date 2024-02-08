var admin = require("firebase-admin");
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
    console.log("USER AUTHENTICATED")
    return decodedToken
  }).catch(error => {
    return error
  })
}

async function deleteProject(endpoint) {
  const token = process.env.RENTMAN_API
  const decoded = decodeURI(endpoint)
  const config: AxiosRequestConfig = {
    method: 'DELETE',
    maxBodyLength: Infinity,
    url: decoded,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  return axios
  .request(config)
  .then(response => {
      console.log("Success: ",response.data)
      return {...response.data}
  })

  .catch(error => {
    console.log("Error object:", error); // Log the error object to inspect its properties
    return {error}
  })
}

export default async function handler(request, response) {
  const headerToken = request.headers.authorization;
  try {
    const auth = await checkAuth(headerToken)
    if(auth.user_id) {
      try {
        const data = await deleteProject(request.query.endpoint);
        response.status(200).json({
          body: data,
          query: request.query,
          cookies: request.cookies,
        });
      } catch (error) {
        console.log("Failed to DELETE data: ", error)
        response.status(500).json({ error: error.message });
      }
    }
  } catch (error) {
    console.log("Failed to authenticate", error)
    response.status(500).json(error);
  } 
}