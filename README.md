# Seattle Tracker

A modern, full-stack personal finance web application designed to track savings, expenses, and manage foreign currency exchange rates in real-time. Built specifically as a goal-oriented tracker.

## Features

* **Full CRUD Operations:** Create, Read, Update, and Delete financial records seamlessly.
* **Smart Currency Conversion:** Automatic calculation of effective exchange rates when registering expenses in USD with MXN.
* **Dynamic Dashboard:** Real-time summary of total balances and granular views by savings plans.
* **Modern UI:** Responsive, fast, and accessible interface built with Tailwind CSS.

## Tech Stack

* **Frontend:** React, Next.js (App Router), Tailwind CSS
* **Backend:** Next.js Server Actions, Node.js
* **Database:** Prisma ORM, SQLite
* **Deployment:** Local executable automation (.bat script for Windows)

## Screenshots


## Getting Started

To run this project locally, follow these steps:

1. Clone the repository:
   git clone https://github.com/Erik-MarLop/seattle-tracker.git
   
2. Install dependencies:
    npm install

3. Run database migrations to create the local SQLite file:
    npx prisma db push

4. Start the development server:
    npm run dev

5. Open http://localhost:3000 in your browser.

## What I Learned
Building this project solidified my understanding of the complete web development lifecycle. I learned how to manage database schemas using Prisma, handle server-side rendering and Server Actions with Next.js, and architect a secure, user-friendly interface.