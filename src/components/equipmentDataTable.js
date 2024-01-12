import * as React from "react"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"



function formatData(name, value) {
  // let addWhitespace = name.replace(/([A-Z])/g, " $1").trim()
  // let makeLowercase = addWhitespace.toLowerCase()
  // let makeFirstLetterUpprcase = makeLowercase.charAt(0).toUpperCase() + makeLowercase.slice(1)
  // name = makeFirstLetterUpprcase
  return { name, value }
}

export default function EquipmentDataTable(data) {

  let string = data.data[0][1]
  const stringResult = string?.split(/; (?=[^;]+:)/).map(s => s.split(':'))

  let formattedData = []
  stringResult?.map(data => {
    if (data[1] === null) {
      return
    } else {
      formattedData.push(formatData(data[0], data[1]))
    }
  })

  return (
    <span>
      {formattedData.length != 0 ? (
        <TableContainer component={"div"}>
          <Table sx={{ minWidth: 350 }} size="small" aria-label="a dense table">
            <TableBody>
              {formattedData.map(row => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : null}
    </span>
  )
}
