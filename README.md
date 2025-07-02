# Paint Gallery

A Web API for show painting images, built with Node.js. The API provides endpoints to fetch painting records in batches, optionally filtered by classification.

**Live Preview:** [https://mammadnet.github.io/paint-gallery/api](https://mammadnet.github.io/paint-gallery/api)

## Repository Structure

```
paint-gallery/
├── API/               # Backend server code
│   ├── index.js       # HTTP server and MariaDB query logic
│   └── .env.example   # Sample environment variable definitions
└── public/            # Front-end static assets
    ├── index.html     # Main HTML page
    ├── styles.css     # Stylesheet
    └── app.js         # Client-side JS for fetching and rendering images
```

## Technologies Used

* **Backend**: Node.js (built-in `http`), MariaDB driver.
* **Database**: MariaDB / MySQL.
* **Client**: Simple HTTP requests (e.g., cURL, Postman) or integrated front-end.

## Database Schema

The `images` table stores painting metadata:

| Column           | Type             | Description                               |
| ---------------- | ---------------- | ----------------------------------------- |
| `numid`          | INT PK AUTO\_INC | Unique identifier for each image.         |
| `classification` | VARCHAR(64)      | Painting period or school (e.g., Gothic). |
| `medium`         | VARCHAR(128)     | Material used (e.g., Oil on canvas).      |
| `title`          | VARCHAR(256)     | Artwork title.                            |
| `style`          | VARCHAR(128)     | Artistic style (e.g., Portrait).          |
| `width`          | INT              | Width in centimeters.                     |
| `height`         | INT              | Height in centimeters.                    |
| `iiifurl`        | VARCHAR(512)     | URL to IIIF image endpoint.               |

## API Endpoints

* `GET /?lastNumid=<n>&number=<m>&classification=<c>`

  * **lastNumid** (optional): Return records with `numid >= n`. Default: `0`.
  * **number** (optional): Maximum records to return. Default: `6`.
  * **classification** (optional): Filter by classification.

*Response:*

```json
{
  "images": [ /* array of image objects */ ],
  "number": m,
  "lastNumid": <highest numid returned>
}
```

## Data Flow

1. **Request Handling**: `index.js` parses query parameters.
2. **Database Query**: A parametrized SQL query retrieves matching rows:

   ```sql
   SELECT * FROM images
   WHERE numid >= ?
   AND (? = '' OR classification = ?)
   ORDER BY numid ASC
   LIMIT ?;
   ```
3. **Response Generation**: Results are packaged into JSON with metadata fields plus pagination info.

## Repository Structure

```
paint-gallery/
├── API/
│   ├── index.js       # Main HTTP server: parameter parsing, DB query, JSON output.
│   └── .env.example   # Env var template (not used for deployment). 
└── public/            # Optional static front-end (not auto-deployed).
    ├── index.html     # Demo UI for API consumption.
    ├── styles.css     # Presentation styling.
    └── app.js         # JS demo client showing data pagination.
```

## Live Preview

[https://mammadnet.github.io/paint-gallery/api](https://mammadnet.github.io/paint-gallery/api)
