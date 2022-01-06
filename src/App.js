import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useEffect, useState} from 'react';
import './App.css';


const accessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;

function App() {

  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery]=useState('');

  function getImages() {
    let apiUrl = `https://api.unsplash.com/photos/?`;
    if(query) apiUrl = `https://api.unsplash.com//search/photos/?query=${query}`;
    apiUrl+=`&page=${page}`;
    apiUrl+=`&client_id=${accessKey}`;
    console.log(apiUrl);
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const requestResult = data.results??data;
        setImages([...images,...requestResult])})
      .catch((err)=>alert(err));
  }

  function searchImages(){
    fetch(`https://api.unsplash.com//search/photos/?page=${page}&query=${query}&client_id=${accessKey}`)
      .then(response => response.json())
      .then(data => setImages([...images,...data.results]))
      .catch((err)=>alert(err));
  }

  useEffect(function () {
    getImages();
  }, [page]);

  function handleButtonClick(e){
    e.preventDefault();
    console.log('zzz');
    setImages([]);
    setPage(1);
  }

  if (!accessKey) return (
    <a href="https://unsplash.com/developers" className='error'>Create Your Unsplash Key</a>
  );

  return (
    <div className="app">
      <h1>Unsplash Image Gallery</h1>
      <form onSubmit={handleButtonClick}>
        <input type="text" onChange={(e)=>setQuery(e.target.value)} placeholder='Search Unsplash ...' />
        <button>Search</button>
      </form>
      <InfiniteScroll
        dataLength={images.length}
        next={()=>setPage(page+1)}
        hasMore={true}
        loader={<h4>Loading...</h4>}
      >
        <div className='grid-body'>
          {
            images.map((image, index) => (
              <div className='grid-item' key={index}>
                <img src={image.urls.regular} alt={image.alt_description} />
              </div>
            ))
          }
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default App;
