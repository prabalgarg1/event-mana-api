# event-mana-api

# 🎉 Event Management API

A RESTful API built with **Node.js**, **Express**, and **PostgreSQL** to manage events and user registrations.

---

## 🚀 Features

- ✅ Create and list upcoming events
- 👤 User registration for events
- ❌ Cancel event registration
- 📊 Get statistics (capacity, registered users, etc.)

---

## 🔧 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **ORM**: node-postgres (pg)
- **Dev Tool**: Nodemon

---

## 📁 Project Structure

├── app.js
├── controllers/
│ └── eventController.js
├── models/
│ └── db.js
├── routes/
│ └── eventRoutes.js
├── .env
├── package.json
└── README.md

---

## ⚙️ Setup

## 🚀 CI/CD with GitHub Actions

Create a `.github/workflows/node.yml` file with the following content:

````yaml
name: CI
on: [push]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Run app
        run: npm run dev

DATABASE_URL=postgresql://your_user:your_password@localhost:5432/eventdb
PORT=3000


</details>

---

### ✅ Step 4: Save the File

- After editing, press `Ctrl + S` (or `Cmd + S` on Mac) to save changes.

---

### ✅ Step 5: Add Changes to Git

Open your terminal in the same folder, and run:
```bash
git add README.md
````
