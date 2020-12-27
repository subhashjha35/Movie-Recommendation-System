import pandas as pd
import numpy as np
import requests
from flask import Flask, request, jsonify
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

movies = pd.read_csv('Final_MovieData.csv')

# api= http://www.omdbapi.com/?apikey=fc796b50&i=tt0371746
# for iron man

def get_imdb_data(imdb_id):
    basic_url = "http://www.omdbapi.com/"
    api_key = "fc796b50"
    response_data = requests.get(f"{basic_url}?apikey={api_key}&i={imdb_id}").json()
    runtime = response_data['Runtime']
    if runtime == 'N/A':
        runtime = 'min N/A'
    plot = response_data['Plot']
    if plot == 'N/A':
        plot = 'Overview: Not Available'
    poster = response_data['Poster']
    if poster == 'N/A':
        poster = "https://i.postimg.cc/Vk6xs9K8/default.jpg"
    imdb_data = {
        'run_time': runtime,
        'overview': plot,
        'poster': poster
    }
    return imdb_data


def get_user_searched_movie(ind):
    title = movies.loc[ind, 'title']
    year = int(movies.loc[ind, 'year'])
    imdb_id = movies.loc[ind, 'tconst']
    rating = movies.loc[ind, 'rating']
    genres = movies.loc[ind, 'genres']
    imdb_data = get_imdb_data(imdb_id)
    runtime = imdb_data['run_time']
    overview = imdb_data['overview']
    poster = imdb_data['poster']
    searched_movie_data = {
        'id': 1,
        'title': title,
        'year': year,
        'genres': genres,
        'rating': rating,
        'runtime': runtime,
        'overview': overview,
        'poster': poster
    }
    return searched_movie_data


def update_matrix():
    try:
        cv = CountVectorizer(dtype=np.float32)
        movie_matrix = cv.fit_transform(movies['combined'])
        cos_similarity = cosine_similarity(movie_matrix)
        np.save('cosine_matrix.npy', cos_similarity)
    except:
        print("There was some error while updating the matrix")


cos_s = np.load('cosine_matrix.npy')


def get_cosine_scores(ind):
    similarity_scores = list(enumerate(cos_s[ind]))
    similarity_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)  # sort based on cosine score
    similarity_scores = similarity_scores[1:51]  # Take top 50 cosine scores
    return similarity_scores  # It returns list of index and its cosine score


def weight_average_cosineScore_rating(cos_scores):
    averages = []
    for i, score in cos_scores:
        rating = movies.loc[i, 'rating']
        average = (2 * score + (rating / 10)) / 3
        averages.append((i, average))
    averages = sorted(averages, key=lambda x: x[1], reverse=True)
    averages = averages[0:10]
    indexes = list(map(lambda item: item[0], averages))
    return indexes


def get_movies_data(ind):
    movies_data = []
    j = 1
    for i in ind:
        title = movies.loc[i, 'title']
        year = int(movies.loc[i, 'year'])
        imdb_id = movies.loc[i, 'tconst']
        poster = get_imdb_data(imdb_id)['poster']
        movies_data.append({'id': j, 'title': title, 'year': year, 'poster': poster})
        j = j + 1
    return movies_data


indexes = pd.Series(movies.index, index=movies['title'])


def recommendations(title):
    return_movies_data = []
    if title in movies['title'].unique():
        index = indexes[title]
        user_searched_movie = get_user_searched_movie(index)
        records = get_cosine_scores(index)
        records = weight_average_cosineScore_rating(records)
        records = get_movies_data(records)
        um = {
            'user_searched_movie_data': user_searched_movie
        }
        rm = {
            'recommended_movies': records
        }
        return_movies_data.append(um)
        return_movies_data.append(rm)
        return return_movies_data
    else:
        return [{'user_searched_movie_data': {'id': 0}}, {'recommended_movies': []}]



app = Flask(__name__)


@app.route('/recommend', methods=['POST'])
def recommend():
    if request.method == 'POST':
        data = request.get_json()
        movie_name = data['title']
        rec = recommendations(movie_name)
        return jsonify({'movies': rec})


@app.route('/clickRecommendations', methods=['POST'])
def clickRecommendations():
    if request.method == 'POST':
        data = request.get_json()
        movie_name = data
        rec = recommendations(movie_name)
        return jsonify({'clickedMovies': rec})


if __name__ == '__main__':
    app.run(debug=True)
