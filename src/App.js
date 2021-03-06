import "./App.css";

import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';

const data = [
  [
    "The Road to React",
    "Robin Wieruch",
    "English",
    "Independently published (September 14, 2018)",
    "$28.49",
  ],
  [
    "React and React Native",
    "Adam Boduch",
    "English",
    "Packt Publishing (April 30, 2020)",
    "$33.24",
  ],
  [
    "REACT.JS Programming in 8 Hours",
    "Ray Yao",
    "English",
    "Independently published (August 8, 2021)",
    "$13.99",
  ],
  [
    "Integrating D3.js with React",
    "Elad Elrom",
    "English",
    "Apress 1st ed. edition (June 4, 2021)",
    "$43.19",
  ],
  [
    "Learn React Hooks",
    "Daniel Bugl",
    "English",
    "Packt Publishing 1st edition (October 18, 2019)",
    "$20.63",
  ],
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
    data: data,
    searchdata: null,
    sortby: null,
    descending: false,
    edit: null, // [row index, cell index],
    search: false
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
    setState((prevState) => ({
      ...prevState,
      data: data,
      sortby: column,
      descending: descending,
    }));
  };

  const _showEditor = (e) => {
    setState((prevState) => ({
      ...prevState,
      edit: {
        row: parseInt(e.target.dataset.row, 10),
        cell: e.target.cellIndex,
      },
    }));
  };

  const _save = (e) => {
    e.preventDefault();
    // Copy state
    let data = [...state.data];
    data[state.edit.row][state.edit.cell] = e.target[0].value;
    //
    setState((prevState) => ({
      ...prevState,
      edit: null,
      data: data,
    }));
  };

  const _search = (e) => {
    let searchVal = e.target.value.toLowerCase();
    // If empty return old state
    if (!searchVal) {
      setState((prevState) => ({
        ...prevState,
        data: [...prevState.searchdata],
      }));
      return;
    }
    let id = e.target.dataset.id;
    // Filter data
    let filterData = state.searchdata.filter(row => {
      return row[id].toString().toLowerCase().indexOf(searchVal) > -1;
    });
    //
    setState((prevState) => ({
      ...prevState,
      data: filterData,
    }));
  };

  const _renderSearch = () => {
    if (!state.search) {
      return null;
    }
    return (
      <TableRow onChange={_search}>
        {headers.map(function (el, id) {
          return (
            <TableCell key={id}>
              <TextField
                label="Search"
                type="search"
                variant="standard"
                inputProps={{
                  'data-id': id
                }}
              />
            </TableCell>
          );
        })}
      </TableRow>
    );
  };

  const _toggleSearch = () => {
    if (state.search) {
      //
      setState((prevState) => ({
        ...prevState, // copy all other field/objects
        data: [...prevState.searchdata],
        search: false,
        searchdata: null
      }));
    } else {
      //
      setState((prevState) => ({
        ...prevState, // copy all other field/objects
        searchdata: [...prevState.data],
        search: true
      }));
    }
  };

  const _download = (e) => {
    switch (e.target.dataset.type) {
      case "json":
        _downloadHelper(JSON.stringify(state.data), "data.json", "application/json");
        break;
        case "csv":
        _downloadCSV("data.csv", "text/csv");
        break;
      default:
    }
  };

  const _downloadCSV = (fileName, contentType) => {
    let content = state.data.reduce(function(result, row) {
      return result
        + row.reduce(function(rowresult, cell, idx) {
            return rowresult 
              + '"' 
              + cell.replace(/"/g, '""')
              + '"'
              + (idx < row.length - 1 ? ',' : '');
          }, '')
        + "\n";
    }, '');
    _downloadHelper(content, fileName, contentType);
  }

  const _downloadHelper = (content, fileName, contentType) => {
    const a = document.createElement("a");
    const blob = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
  }

  const _renderToolbar = () => {
    return (
      <Stack spacing={2} my={2} direction="row">
        <Button startIcon={<SearchIcon/>} onClick={_toggleSearch} variant="contained">
          Search
        </Button>
        <Button data-type='json' onClick={_download} endIcon={<DownloadIcon />} variant="outlined">
          JSON
        </Button>
        <Button data-type='csv' onClick={_download} endIcon={<DownloadIcon />} variant="outlined">
          CSV
        </Button>
      </Stack>
    );
  };

  return (
    <div className="App">
      {_renderToolbar()}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead onClick={_sort}>
            <TableRow>
              {headers.map((title, id) => {
                if (state.sortby === id) {
                  title += state.descending ? " \u2191" : " \u2193";
                }
                return (
                  <TableCell key={id}>
                    {title}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody onDoubleClick={_showEditor}>
            {_renderSearch()}
            {state.data.map((row, rowId) => (
              <TableRow key={rowId}>
                {row.map(function (cell, cellId) {
                  let content = cell;
                  let edit = state.edit;
                  if (edit && edit.row === rowId && edit.cell === cellId) {
                    content = (
                      <Box onSubmit={_save} component="form">
                        <TextField variant="standard" defaultValue={cell} />
                      </Box>
                    );
                  }
                  return (
                    <TableCell key={cellId} data-row={rowId}>
                      {content}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default App;
