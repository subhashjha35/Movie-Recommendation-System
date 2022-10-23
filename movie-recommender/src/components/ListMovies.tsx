import { IRecommendedMovie, IUserCurrentMovie } from "../App";

interface Props {
	recommendedMovies: IRecommendedMovie[];
	currentMovie: IUserCurrentMovie;
	clickedRecommendedMovies: (movie: IRecommendedMovie[]) => void;
	clickedCurrentMovie: (movie: IUserCurrentMovie) => void;
	className?: string
}
const ListMovies = ({
	recommendedMovies,
	currentMovie,
	clickedRecommendedMovies,
	clickedCurrentMovie,
}: Props) => {
	return (
		<div className="movie-list">
			<div className={currentMovie?.id === undefined ? "unactive" : "active"}>
				<div className={currentMovie?.id === 0 ? "null-movie" : "current-movie-null"}>
					<h1>Ooops! The Movie you are trying to search is not in our database.
					Please recheck if you spelled it correctly or search for another movie.</h1>
				</div>
				<div className= {currentMovie?.id === 0 ? "current-movie-null" : "current-movie"}>
					<img className="poster" src={currentMovie?.poster} alt="poster"></img>
					<div className="movie-details">
						<span className="title">{currentMovie?.title}</span>
						<span>({currentMovie?.year})</span>
						<div className="runtime-genres">
							<span>
								{currentMovie?.runtime} | {currentMovie?.genres}
							</span>
						</div>
						<div className="rating">
							<span className="star">&#x2605;</span>
							<span>{currentMovie?.rating}/10</span>
						</div>
						<span className="overview">{currentMovie?.overview}</span>
					</div>
				</div>
				<div className={currentMovie?.id === 0 ? "current-movie-null" : "title-recommended-movies"}> Recommended Movies for you: </div>
			</div>
			<div className={currentMovie?.id === 0 ? "current-movie-null" : "list-of-movies"}>
				{!!recommendedMovies && recommendedMovies.map((movie) => {
					return (
						<div className="movies" key={movie.id}>
							<div
								onClick={async () => {
									fetch("/clickRecommendations", {
										method: "POST",
										headers: {
											"Content-Type": "application/json",
										},
										body: JSON.stringify(movie.title),
									})
										.then((response) => response.json())
										.then((data) => {
											clickedRecommendedMovies(data.clickedMovies[1].recommended_movies);
											clickedCurrentMovie(data.clickedMovies[0].user_searched_movie_data);
										});
								}}
							>
								<div className="recommended-movies">
									<img
										className="poster-recommend"
										src={movie.poster}
										alt="poster"
									></img>
									<div className="movie-details-recommended">
										<span className="title title-recommended">{movie.title}</span>
										<span>({movie.year})</span>
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default ListMovies;