import "./App.css";

import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

/**
 * 
 * @param {*} book 
 * @param {*} author 
 * @param {*} language 
 * @param {*} publisher 
 * @param {*} price 
 * @returns 
 */
function createData(book, author, language, publisher, price) {
  return { book, author, language, publisher, price };
}

const rows = [
  createData(
    "The Road to React",
    "Robin Wieruch",
    "English",
    "Independently published (September 14, 2018)",
    "$28.49"
  ),
  createData(
    "React and React Native",
    "Adam Boduch",
    "English",
    "Packt Publishing (April 30, 2020)",
    "$33.24"
  ),
  createData(
    "REACT.JS Programming in 8 Hours",
    "Ray Yao",
    "English",
    "Independently published (August 8, 2021)",
    "$13.99"
  ),
  createData(
    "Integrating D3.js with React",
    "Elad Elrom",
    "English",
    "Apress; 1st ed. edition (June 4, 2021)",
    "$43.19"
  ),
  createData(
    "Learn React Hooks",
    "Daniel Bugl",
    "English",
    "Packt Publishing; 1st edition (October 18, 2019)",
    "$20.63"
  ),
];

const headers = [
  'Book',
  'Author',
  'Language',
  'Publisher',
  'Price'
]

function App() {
  const [state, setState] = useState({
    data: rows,
    sortby: null,
    descending: false,
  });
  const _sort = function (e) {
    let column = e.target.cellIndex;
    let data = state.data.slice();
    let descending = state.sortby === column && !state.descending;
    // Sort data
    data.sort(function (a, b) {
      return descending
        ? a[column] < b[column]
          ? 1
          : -1
        : a[column] > b[column]
        ? 1
        : -1;
    });
    //
    setState({
      data: data,
      sortby: column,
      descending: descending,
    });
  };

  return (
    <div className="App">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead onClick={_sort}>
            <TableRow>
              {headers.map((title, id) => {
                if (state.sortby === id) {
                  title += state.descending ? " \u2191" : " \u2193";
                }
                return (
                  <TableCell key={id} align="center">
                    {title}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {state.data.map((row, rowId) => (
              <TableRow
                key={rowId}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.book}
                </TableCell>
                <TableCell align="center">{row.author}</TableCell>
                <TableCell align="center">{row.language}</TableCell>
                <TableCell align="center">{row.publisher}</TableCell>
                <TableCell align="center">{row.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default App;
