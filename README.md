<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ReadMe</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            padding: 20px;
            background-color: #f4f4f4;
        }
        h1, h2 {
            color: #333;
        }
        pre {
            background-color: #eee;
            padding: 10px;
            border-radius: 5px;
            overflow-x: auto;
        }
        code {
            background-color: #f4f4f4;
            padding: 2px 4px;
            border-radius: 3px;
        }
        section {
            margin-bottom: 20px;
        }
    </style>
</head>
<body>

    <h1>Project Setup Instructions</h1>

    <section>
        <h2>1) Bootstrap (Frontend)</h2>
        <p>Instructions for download:</p>
        <ol>
            <li>Open VS Code terminal (command prompt)</li>
            <li>Navigate to the frontend folder</li>
            <li>Run the command: <code>npm install bootstrap bootstrap-icons</code></li>
            <li>Run the command: <code>npm install @types/bootstrap</code></li>
            <li>Modify the <code>frontend/angular.json</code> file:</li>
            <pre>
                "projects" -> "frontend" -> "architect" -> "build" -> "options" -> "styles" should look like:
                "styles": [
                    "node_modules/bootstrap/dist/css/bootstrap.min.css",
                    "node_modules/bootstrap-icons/font/bootstrap-icons.css",
                    "src/styles.css"
                ]
                
                "projects" -> "frontend" -> "architect" -> "build" -> "options" -> "scripts" should look like:
                "scripts": [
                    "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
                ]
            </pre>
        </ol>
    </section>

    <section>
        <h2>2) Icons for Cards (Frontend)</h2>
        <p>Instructions for download:</p>
        <ol>
            <li>Open VS Code terminal (command prompt)</li>
            <li>Navigate to the frontend folder</li>
            <li>Run the command: <code>npm install @fortawesome/fontawesome-free</code></li>
            <li>Modify the <code>frontend/angular.json</code> file:</li>
            <pre>
                "projects" -> "frontend" -> "architect" -> "build" -> "options" -> "styles" should look like:
                "styles": [
                    "node_modules/bootstrap/dist/css/bootstrap.min.css",
                    "node_modules/bootstrap-icons/font/bootstrap-icons.css",
                    "node_modules/@fortawesome/fontawesome-free/css/all.min.css",
                    "src/styles.css"
                ]
            </pre>
        </ol>
    </section>

    <section>
        <h2>3) Include Encryption Algorithm (Frontend)</h2>
        <p>Instructions for download:</p>
        <ol>
            <li>Run the command: <code>npm install @types/crypto-js</code></li>
            <li>Run the command: <code>npm install crypto-js</code></li>
        </ol>
    </section>

    <section>
        <h2>4) Include Multer for Reading Blobs from FormData Field (Backend)</h2>
        <p>Instructions for download:</p>
        <ol>
            <li>Run the command: <code>npm install @types/multer</code></li>
            <li>Run the command: <code>npm install multer</code></li>
        </ol>
    </section>

    <section>
        <h2>5) reCaptcha (Frontend)</h2>
        <p>Instructions for download:</p>
        <ol>
            <li>Run the command: <code>npm i ngx-captcha</code></li>
        </ol>
    </section>

    <section>
        <h2>6) Graphs (Frontend)</h2>
        <p>Instructions for download:</p>
        <ol>
            <li>Run the command: <code>npm install @types/chart.js</code></li>
            <li>Run the command: <code>npm install chart.js</code></li>
            <li>Run the command: <code>npm install chartjs-plugin-datalabels</code></li>
        </ol>
    </section>

</body>
</html>
