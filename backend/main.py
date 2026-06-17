from fastapi import FastAPI, HTTPException
import pickle
import pandas as pd

app = FastAPI()

# Load the pre-trained model and movie data
movies = pickle.load(open("movies.pkl", "rb"))
similarity = pickle.load(open("model.pkl", "rb"))


@app.get("/")
def root():
    return {"message": "Movie Recommender API is running"}


@app.get("/recommend/{movie_title}")
def recommend(movie_title: str):
    # Find the movie in the dataset (case-insensitive)
    match = movies[movies["title"].str.lower().str.strip() == movie_title.lower().strip()]

    if match.empty:
        raise HTTPException(status_code=404, detail=f"Movie '{movie_title}' not found")

    index = match.index[0]
    scores = similarity[index]

    # Sort by similarity score, skip index 0 (the movie itself)
    movie_list = sorted(list(enumerate(scores)), reverse=True, key=lambda x: x[1])[1:11]

    recommendations = []
    for i in movie_list:
        recommendations.append({
            "title": movies.iloc[i[0]]["title"],
            "score": round(float(i[1]), 4)
        })

    return {
        "movie": movie_title,
        "recommendations": recommendations
    }


@app.get("/movies")
def get_all_movies():
    # Return all movie titles for reference
    titles = movies["title"].tolist()
    return {"total": len(titles), "movies": titles}
