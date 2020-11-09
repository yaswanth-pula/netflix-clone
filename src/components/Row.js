import { useState, useEffect } from "react";
import axios from "../utils/axiosFetch";
import { imageBaseUrl } from "../utils/request";
import "./row.css";
import Youtube from "react-youtube";
import movieTrailer from "movie-trailer";

function Row(props) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  useEffect(() => {
    async function fetchRow() {
      const response = await axios.get(props.fetchUrl);
      setMovies(response.data.results);
    }
    fetchRow();
  }, [props.fetchUrl]);

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  const showTrailer = (movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      movieTrailer(movie?.name || "")
        .then((url) => {
          const urlParams = new URLSearchParams(new URL(url).searchParams);
          setTrailerUrl(urlParams.get("v"));
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div className="row">
      <h2>{props.title}</h2>
      <div className="row-posters">
        {movies.map((movie) => {
          return (
            <img
              onClick={() => showTrailer(movie)}
              className={`row-poster ${props.isLargeRow && "row-poster-large"}`}
              key={movie.id}
              src={`${imageBaseUrl}${
                props.isLargeRow ? movie.poster_path : movie.backdrop_path
              }`}
              alt={movie.name}
            />
          );
        })}
      </div>
      {trailerUrl && <Youtube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}

export default Row;
