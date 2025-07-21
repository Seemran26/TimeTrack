# 🕒 Timesheet Management App 

This is a simple Timesheet Management web app built using **React** and **Tailwind CSS**. It simulates a SaaS-style dashboard for viewing and updating weekly timesheets.

## 🔧 Tech Stack

- ⚛️ React (Vite)
- 💨 Tailwind CSS
- 📦 React Router
- 🌐 LocalStorage (for mock auth & data persistence)
- 🔁 React Context (for global state)

---

## 🛠 Features

- 🔐 **Login Page**
  - Dummy authentication with hardcoded credentials
  - Redirects to dashboard on successful login
  - Stores session locally

- 📊 **Dashboard Page**
  - Displays list of timesheets (Week #, Date, Status, Actions)
  - Buttons to view/edit specific entries
  - Reflects updates from Weekly Table page
  - Logout functionality

- 📅 **Weekly Table Page**
  - Edit detailed timesheet entries for each day
  - Save and reflect changes on the Dashboard



---

## 🔐 Dummy Credentials

```txt
Email: test@tentwenty.com  
Password: password123
