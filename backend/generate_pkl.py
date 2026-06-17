import pandas as pd
import numpy as np
import ast
import pickle
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

print("Loading datasets...")
credits = pd.read_csv('tmdb_5000_credits.csv')
movies = pd.read_csv('tmdb_5000_movies.csv')

movies = movies[['id', 'title', 'genres', 'keywords', 'overview', 'tagline', 'vote_average']]
movies = pd.merge(credits, movies, left_on='movie_id', right_on='id')
movies = movies.drop('id', axis=1)

for c in ['cast', 'crew', 'genres', 'keywords']:
    movies[c] = movies[c].apply(ast.literal_eval)

def get_top3_actors(cast):
    return [actor['name'] for actor in cast if actor['order'] in [0, 1, 2]]

def get_director(crew):
    return [role['name'] for role in crew if role['job'] == 'Director'][:1]

def get_names(col):
    return [c['name'].lower() for c in col]

movies['cast'] = movies['cast'].apply(get_top3_actors)
movies['crew'] = movies['crew'].apply(get_director)
movies['genres'] = movies['genres'].apply(get_names)
movies['keywords'] = movies['keywords'].apply(get_names)

movies['tags'] = movies['genres'] + movies['keywords'] + movies['cast'] + movies['crew']
movies['tags'] = movies['tags'].apply(lambda x: [i.replace(' ', '') for i in x])
movies['tags'] = movies['tags'].apply(lambda x: ' '.join(x))

print("Building model...")
vectorizer = CountVectorizer(max_features=5000, stop_words='english')
vectors = vectorizer.fit_transform(movies['tags']).toarray()
similarity = cosine_similarity(vectors)

# Keep only needed columns
movies = movies[['movie_id', 'title', 'tags']]

print("Saving pkl files...")
pickle.dump(movies, open('movies.pkl', 'wb'))
pickle.dump(similarity, open('model.pkl', 'wb'))
print("Done! movies.pkl and model.pkl saved.")
