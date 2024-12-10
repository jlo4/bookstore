import { useCallback, useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddBook from './AddBook';

import './App.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';

const FIREBASE_BOOKS_URL = 'https://bookstore-8f712-default-rtdb.firebaseio.com/books/';

function App() {
  const [books, setBooks] = useState([]);

  const columnDefs = [
    { field: 'title', sortable: true, filter: true},
    { field: 'author', sortable: true, filter: true},
    { field: 'year', sortable: true, filter: true},
    { field: 'isbn', sortable: true, filter: true},
    { field: 'price', sortable: true, filter: true},
    { 
      headerName: '',
      field: 'id',
      width: 90,
      cellRenderer: params => 
      <IconButton onClick={() => deleteBook(params.value)} size="small" color="error">
        <DeleteIcon />
      </IconButton> 
    }
  ]

  const fetchBooks = useCallback(async () => {
    try {
      const books = await fetch(`${FIREBASE_BOOKS_URL}.json`);
      const data = await books.json();
      addKeys(data);
    } catch (err) {
      console.error(err);
    }    
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const addKeys = (data) => {
    const keys = Object.keys(data);
    const valueKeys = Object.values(data).map((item, index) => 
      Object.defineProperty(item, 'id', {value: keys[index]}));    
    setBooks(valueKeys);
  };

  const addBook = async (book) => {
    try {
      await fetch(`${FIREBASE_BOOKS_URL}.json`, {
        method: 'POST',        
        body: JSON.stringify(book)
      });
      fetchBooks();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteBook = async (id) => {
    try {
      await fetch(`${FIREBASE_BOOKS_URL}${id}.json`, {
        method: 'DELETE'
      });
      fetchBooks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">
            Bookstore
          </Typography>
        </Toolbar>
      </AppBar>
      <AddBook addBook={addBook} />
      <div className="ag-theme-material" style={{ height: 400, width: 1200 }}>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={books}>
        </AgGridReact>
      </div>
    </>
  );
}

export default App;
