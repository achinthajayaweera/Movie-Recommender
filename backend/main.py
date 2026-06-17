from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pickle
import requests
from dotenv import load_dotenv
import os

load_dotenv()
API_KEY = os.getenv("TMDB_API_KEY")

app = FastAPI()

# CORS - allows React frontend to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the pre-trained model and movie data
movies = pickle.load(open("movies.pkl", "rb"))
similarity = pickle.load(open("model.pkl", "rb"))

movies["title"] = movies["title"].str.lower()


# Fetch poster URL from TMDB API
def fetch_poster(movie_title):
    try:
        url = f"https://api.themoviedb.org/3/search/movie?api_key={API_KEY}&query={movie_title}"
        data = requests.get(url, timeout=5).json()
        if data["results"]:
            poster_path = data["results"][0].get("poster_path")
            if poster_path:
                return f"https://image.tmdb.org/t/p/w500{poster_path}"
    except Exception:
        pass
    return ""


# Recommendation logic
def recommend(movie):
    movie = movie.lower()

    if movie not in movies["title"].values:
        return []

    index = movies[movies["title"] == movie].index[0]
    scores = similarity[index]

    movie_list = sorted(
        list(enumerate(scores)),
        reverse=True,
        key=lambda x: x[1]
    )[1:11]

    results = []
    for i in movie_list:
        title = movies.iloc[i[0]].title
        poster = fetch_poster(title)
        results.append({"title": title, "poster": poster})

    return results


@app.get("/")
def root():
    return {"message": "Movie Recommender API is running"}


@app.get("/search")
def search_movies(query: str):
    if not query or len(query) < 2:
        return {"results": []}
    query = query.lower()
    matches = movies[movies["title"].str.contains(query, na=False)]["title"].head(5)
    return {"results": matches.tolist()}


@app.get("/recommend")
def get_recommendation(movie: str):
    results = recommend(movie)
    if not results:
        raise HTTPException(status_code=404, detail=f"Movie '{movie}' not found")
    return {"recommendations": results}
