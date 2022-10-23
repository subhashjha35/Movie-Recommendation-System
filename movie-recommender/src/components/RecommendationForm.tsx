import React, { useState } from "react";
import { Form, Input, Button } from "semantic-ui-react";
import { IRecommendedMovie, IUserCurrentMovie } from "../App";

export interface Props {
	onMovies: (movie: IRecommendedMovie[]) => void;
	onCurrentMovie: (movie: IUserCurrentMovie) => void;
}
export const RecommendationForm = ({ onMovies, onCurrentMovie }: Props) => {
	const [title, setTitle] = useState("");

	return (
		<Form className="movie-form">
			<Form.Field className="search-field">
				<Input id="inputfield"
					icon={{ name: "search", circular: true, link: true }}
					placeholder="Get Movie Recommendations. Search here..."
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
			</Form.Field>
			<Form.Field className="searchbt">
				<Button
					id="click-search"
					onClick={async () => {
						const movie = { title };
						fetch("/recommend", {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify(movie),
						})
							.then((response) => response.json())
							.then((data) => {
								onMovies(data.movies[1].recommended_movies);
								onCurrentMovie(data.movies[0].user_searched_movie_data);
								setTitle("");
							});
					}}
				>
					Search
				</Button>
			</Form.Field>
		</Form>
	);
};

