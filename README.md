# 🎬 Movie Recommender - Full Stack ML App

A modern full-stack machine learning web application that recommends movies based on similarity and user search input. Built with **FastAPI (backend)**, **React (frontend)**, and **Scikit-learn (ML model)**.

---

## 🚀 Live Demo

![Movie Recommender Demo](backend/demo.gif)

---

## 🧠 Project Overview

This project is a **content-based movie recommendation system** that:

- Suggests movies similar to the selected title
- Provides real-time search autocomplete suggestions
- Fetches movie posters from TMDB API
- Uses cosine similarity for recommendations

---

## 🏗️ Architecture

```
Frontend (React)
      |
      | HTTP Requests
      v
Backend (FastAPI)
      |
      | Loads ML Model
      v
Scikit-learn (Cosine Similarity)
      |
      v
Movie Dataset + TMDB API
```

---

## ⚙️ Tech Stack

### Frontend
- React.js
- JavaScript (ES6)
- Fetch API
- CSS (Inline Styling)

### Backend
- FastAPI
- Python
- Scikit-learn
- Pandas
- Pickle

### Machine Learning
- CountVectorizer
- Cosine Similarity
- Content-based filtering

---

## 📂 Project Structure

```
Movie-Recommender/
│
├── backend/
│   ├── main.py
│   ├── movie_recommendation.ipynb
│   ├── requirements.txt
│   ├── .env.example
│   ├── tmdb_5000_movies.csv
│   └── tmdb_5000_credits.csv
│
├── frontend/
│   └── src/
│       ├── App.js
│       └── index.js
│
├── .gitignore
└── README.md
```

---

## 🔥 Features

- 🔎 Real-time movie search suggestions
- 🎬 Top 10 movie recommendations
- 🖼️ Movie poster integration via TMDB API
- ⚡ FastAPI backend
- 🧠 ML-powered recommendation engine
- 🌐 Full-stack React + FastAPI integration

---

## 🧪 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/search?query=batman` | Search movie titles |
| GET | `/recommend?movie=inception` | Get top 10 recommendations |

---

## 🔐 Environment Variables

Create a `.env` file inside the `backend/` folder:

```
TMDB_API_KEY=your_api_key_here
```

Get a free API key at [themoviedb.org](https://www.themoviedb.org/settings/api)

⚠️ Never commit your `.env` file to GitHub.

---

## 🚀 Run Locally

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm start
```

---

## 👨‍💻 Author

Built by Achintha Jayaweera 🚀
