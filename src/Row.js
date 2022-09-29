import React, { useEffect, useState } from "react";
import axios from "./axios";
import "./Row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original/"; //from the tmdb docs

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  // A snippet of code which runs based on a specific condition / variable
  useEffect(() => {
    //this runs as soon as the row loads.
    //if [], run once when the row loads, and don't run again
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  const handleClick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      movieTrailer(movie?.name || "")
        .then((url) => {
          //https://www.youtube.com/watch?v=hGEUCDmSAD0&ab_channel=JJOlatunji
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v")); //it will get you the value of v = hGEUCDmSAD0 from the url
        })
        .catch((err) => console.log(err));
    }
  };
  return (
    <div className="row">
      <h2>{title}</h2>

      <div className="row_posters">
        {movies.map((movie) => (
          //poster_path -> '/pIkRyD18kl4FhoCNQuWxWu5cBLM.jpg'. This not a url so not work simply including it
          <img
            key={movie.id}
            onClick={() => handleClick(movie)}
            className={
              isLargeRow ? "row_poster row_posterLarger" : "row_poster"
            }
            src={`${base_url}${
              isLargeRow
                ? movie.poster_path
                : movie.backdrop_path != null
                ? movie.backdrop_path
                : movie.poster_path
            }`}
            alt={movie.name}
          />
        ))}{" "}
        {/*go through the array that we get*/}
      </div>
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}

export default Row;
