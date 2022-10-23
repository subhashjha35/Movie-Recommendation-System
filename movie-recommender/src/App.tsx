import React, { useState, useEffect } from "react";
import "./App.css";
import ListMovies from "./components/ListMovies";
import { RecommendationForm } from "./components/RecommendationForm";

export interface IRecommendedMovie {
	id: number;
	poster: string;
	title: string;
	year: number;
}

export interface IUserCurrentMovie {
	genres: string;
	id: number;
	overview: string;
	poster: string;
	rating: number;
	runtime: string;
	title: string;
	year: number;
}

const App: React.FC = () => {
	const [recommendedMovies, setRecommendedMovies] = useState<IRecommendedMovie[]>([]);
	const [currentMovie, setCurrentMovie] = useState<IUserCurrentMovie>(
		{} as any
	);
	const [url, setUrl] = useState(["", "/static/media/857752.7ac2bde8.png"]);

	useEffect(() => {
		function pictures(p: any): any {
			return p.keys().map(p);
		}
		const pics = pictures(
			require.context("./images", false, /\.(png|jpe?g|svg)$/)
		);
		let pictureArray: any[] = [];

		pics.forEach((e: any) => {
			pictureArray.push(e.default);
		});

		let iterator = pictureArray.entries();
		let j = 0;

		const interval = setInterval(() => {
			if (j <= 16) {
				setUrl(iterator.next().value);
				j++;
			} else if (j === 17) {
				pics.forEach((e: any) => {
					pictureArray.push(e.default);
				});
				iterator = pictureArray.entries();
				j = 0;
			}
		}, 10000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div>
			<div
				style={{
					backgroundImage: "url(" + url[1] + ")",
					backgroundPosition: "center",
					backgroundColor: "black",
					backgroundSize: "cover",
					backgroundRepeat: "no-repeat",
					filter: "opacity(" + 70 + "%)",
					transition: "0.80s ease-in-out",
					
				}}
				className="container"
			></div>
			<h1 className="project-title">Movie Recommendation System</h1>
			<RecommendationForm onMovies={(movie: IRecommendedMovie[]) => setRecommendedMovies(movie)} onCurrentMovie={(movie: IUserCurrentMovie) => setCurrentMovie(movie)} />
			<ListMovies
				className="movie-component"
				recommendedMovies={recommendedMovies}
				currentMovie = {currentMovie}
				clickedRecommendedMovies={(movie: IRecommendedMovie[]) => setRecommendedMovies(movie)}
				clickedCurrentMovie ={(movie: IUserCurrentMovie) => setCurrentMovie(movie)}
			/>
			<footer className="footer">&#169; 2020 Movie Recommendation System</footer>
		</div>
	);
}

export default App;