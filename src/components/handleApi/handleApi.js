import React, { useEffect, useState } from "react"

const HandleApi = () => {
  const [rentman, setRentman] = useState()
  const [rentmanData, setRentmanData] = useState()
  

  let url = ""

  let data = []
  const requestData = (limit, offset) => {
    url =
      "https://corsproxy.io/?" +
      encodeURIComponent(
        `https://api.rentman.net/equipment?limit=${limit}&offset=${offset}`,
        // `https://api.rentman.net/equipment?limit=${limit}&offset=${offset}`,
      )

    var myHeaders = new Headers()
    myHeaders.append(
      "Authorization",
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZWRld2Vya2VyIjoyMzUsImFjY291bnQiOiJicmVudCIsImNsaWVudF90eXBlIjoib3BlbmFwaSIsImNsaWVudC5uYW1lIjoib3BlbmFwaSIsImV4cCI6MTg0NjIzNDEyNiwiaXNzIjoie1wibmFtZVwiOlwiYmFja2VuZFwiLFwidmVyc2lvblwiOlwiNC41NTIuMC4xXCJ9IiwiaWF0IjoxNjg4MzgxMzI2fQ.sR4UcLGBJY5h8CdknohgRcGBBMvukJA5tXeuM1YFeeg",
    )

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    }

    fetch(url, requestOptions)
      .then(response => response.json())
      .then(result => {
        // console.log(result)
        data.push(...result.data)
        if (result.itemCount == limit) {
          requestData(100, limit + offset)
        } else {
          setRentmanData(data)
        }
      })
      .catch(error => console.log("error", error))
  }
  // console.log(rentmanData)

  useEffect(() => {
    requestData(100, 0)
  }, [])

  return rentmanData
}

export default HandleApi
