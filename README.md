# Online Complaint Management System (OCMS)

## Technology
Frontend: HTML5, CSS3, JavaScript
Backend: Node.js + Express
Database: MySQL

## Demo frontend
Open `index.html` in a browser. The pages work as a UI prototype even without the backend.

## Run the backend
1. Install Node.js and MySQL.
2. Create the database by importing `database/schema.sql` into MySQL.
3. Open a terminal inside `backend`.
4. Run:
   npm install
   npm start
5. API runs at http://localhost:3000

## Important
For a real deployment, passwords must be hashed (e.g. bcrypt), authentication should use sessions/JWT, and file uploads must be validated and stored securely.

## Main pages
- index.html: Landing page
- student.html: Student dashboard
- complaint.html: Submit complaint
- complaints.html: Track complaints
- admin.html: Admin dashboard
