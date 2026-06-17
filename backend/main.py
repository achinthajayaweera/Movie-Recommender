from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def root():
    return {"message": "Movie Recommender API is running"}
