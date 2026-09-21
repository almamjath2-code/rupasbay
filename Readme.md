# 🍽️ Rupa's Bay Restaurant Web Application

A full-stack restaurant web application built to provide customers with an easy way to explore restaurant information while allowing administrators to manage restaurant operations through a dedicated **Admin Dashboard**.

## 🌐 Live Applications

### Customer Website

[Rupa's Bay Restaurant Website](http://rupas-bay-frontend.s3-website.ap-south-1.amazonaws.com/?utm_source=chatgpt.com)

### Admin Dashboard / Dashboard Assets

[Rupa's Bay Dashboard](http://rupas-bay-dashboard-images.s3-website.ap-south-1.amazonaws.com/?utm_source=chatgpt.com)

---

## 🚀 Project Overview

Rupa's Bay is an end-to-end full-stack restaurant management and customer-facing web application.

The system includes:

* Customer-facing restaurant website
* Admin Dashboard
* Restaurant menu management
* Reservation management
* Customer review management
* Restaurant event management
* Dashboard statistics
* Image upload and management
* Secure admin authentication
* RESTful API integration
* MySQL database
* AWS cloud deployment

---

## 🛠️ Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript
* REST API Integration
* Responsive Web Design

### Backend

* Python
* FastAPI
* SQLAlchemy
* RESTful APIs
* Pydantic
* Python-Multipart

### Database

* MySQL
* SQLAlchemy ORM

### Cloud & Deployment

* AWS Elastic Beanstalk
* Amazon S3
* Docker
* GitHub Actions
* CI/CD

### Development Tools

* Git
* GitHub
* VS Code
* Postman

---

# 👨‍💼 Admin Dashboard

A dedicated Admin Dashboard was developed to allow restaurant administrators to manage the application's data from a centralized interface.

### Dashboard Features

#### 📊 Dashboard Statistics

* View restaurant-related statistics
* Monitor application data from a centralized dashboard

#### 🍔 Menu Management

Administrators can:

* Add menu items
* Update menu items
* Delete menu items
* Manage prices
* Manage categories
* Set item availability
* Mark chef's picks
* Upload food images

#### 📅 Reservation Management

* View customer reservations
* Manage reservation information
* Access reservation data through the dashboard

#### ⭐ Review Management

* View customer reviews
* Manage customer feedback
* Access review information through the admin interface

#### 🎉 Event Management

* Create restaurant events
* Update event information
* Manage restaurant event data

#### 🖼️ Image Management

* Upload restaurant and menu images
* Store uploaded assets using cloud storage
* Connect uploaded images with menu data

#### 🔐 Admin Authentication

* Secure admin login
* Protected administrative endpoints
* API authentication and authorization

---

# 🔌 REST API

The backend provides RESTful API endpoints that connect the frontend and Admin Dashboard with the database.

The API handles functionality such as:

* Authentication
* Menu management
* Reservations
* Reviews
* Events
* Statistics
* Image uploads
* Database operations

The frontend communicates with the FastAPI backend through HTTP requests.

---

# 🗄️ Database

The application uses **MySQL** with **SQLAlchemy ORM**.

Main data entities include:

* Admins
* Admin API Keys
* Users
* Menu Items
* Reservations
* Reviews
* Events

The database provides persistent storage for restaurant and customer-related information.

---

# ☁️ AWS Deployment

The project was deployed using AWS services.

### Amazon S3

Used for hosting frontend/static website assets and storing web application resources.

### AWS Elastic Beanstalk

Used to deploy and run the FastAPI backend application.

### Docker

The backend application was containerized to provide a consistent deployment environment.

### GitHub Actions

CI/CD workflows were used to automate application deployment and streamline the development-to-deployment process.

---

# 🔄 Application Architecture

```text
                    ┌──────────────────────┐
                    │    Customer Website  │
                    │   HTML/CSS/JavaScript│
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │     FastAPI Backend  │
                    │      Python API      │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┼─────────────┐
                 │             │             │
                 ▼             ▼             ▼
          ┌───────────┐  ┌───────────┐  ┌───────────┐
          │   MySQL   │  │   Admin   │  │   Image   │
          │ Database  │  │ Dashboard │  │  Storage  │
          └───────────┘  └───────────┘  └───────────┘
                               │
                               ▼
                         ┌───────────┐
                         │   AWS     │
                         │ Services  │
                         └───────────┘
```

---

# 🔒 Security

The application includes:

* Admin authentication
* Protected API endpoints
* API key-based authorization
* Request validation
* CORS configuration
* Secure database interaction
* Error handling

---

# 📦 Key Features

| Feature            | Description                          |
| ------------------ | ------------------------------------ |
| Restaurant Website | Customer-facing restaurant interface |
| Admin Dashboard    | Centralized restaurant management    |
| Menu Management    | Create, update and manage menu items |
| Reservations       | Manage customer reservations         |
| Reviews            | Manage customer feedback             |
| Events             | Manage restaurant events             |
| Image Upload       | Upload and manage restaurant images  |
| Authentication     | Protected admin access               |
| REST API           | Backend communication                |
| MySQL              | Persistent database                  |
| AWS                | Cloud deployment                     |
| Docker             | Application containerization         |
| CI/CD              | Automated deployment                 |

---

# 🎯 Project Objectives

The main objectives of this project were to:

* Build a complete full-stack web application.
* Develop production-oriented REST APIs.
* Implement database-driven restaurant management.
* Create a practical Admin Dashboard.
* Deploy a web application to AWS.
* Implement containerization and CI/CD.
* Gain hands-on experience with cloud deployment and application debugging.

---

# 👨‍💻 Developer

**Ahamed Lebbe Mohamed Amjath**

Data Scientist | Full-Stack Web Developer

**Skills demonstrated:** Python, FastAPI, Django, SQL, MySQL, JavaScript, HTML, CSS, REST APIs, AWS, Docker, GitHub Actions, CI/CD.

---

## ⭐ Project Highlights

**Full-Stack Development • REST APIs • Admin Dashboard • MySQL • AWS • Docker • CI/CD**
