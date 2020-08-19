# Finstagram - The Instagram Clone
***✨ A MERN Stack Clone of the social networking giant - Instagram***

<p>
<img src="https://img.shields.io/badge/Frontend-ReactJS-blue?logo=react">
<img src="https://img.shields.io/badge/Backend-NodeJS-green?logo=node.js">
<img src="https://img.shields.io/badge/DataBase-MongoDB-lightgreen?logo=mongoDB">
<img src="https://img.shields.io/badge/State--Manager-Redux-purple?logo=redux">
</p>

<div align="center">
  <img src="https://elit-altum.github.io/assets/Finstagram.jpg" width="250">
</div>


## Project Report & Engineering Choices 👨‍💻
>🌱 This project initially began as a way to completely flex & put my development skills to the test, so that I can confidently deliver real world projects. My prime focus was towards polishing the skills I had learnt than to venture into new ones.

### 01. Database : NoSQL vs SQL 🗄️
__TLDR__ : PostGreSQL would have been a better choice as the primary database for this project as the data model involves lot of relations across multiple collections / tables. However, MongoDB offers quick & native support for GeoSpatial queries, aggregations & JOIN counts which would not be possible with PostGreSQL. 

My reasons of choosing MongoDB as the primary database for this project are:
1. **GeoSpatial Queries & Aggregation**: I found MongoDB to have a more straightforward, faster & reliable support for geospatial queries. I have used them in my project for a post's location. PostGreSQL on the other hand would require an extender like [PostGIS](https://postgis.net/) or manually writing code for the [HaverSine](https://en.wikipedia.org/wiki/Haversine_formula) formula etc.
2. **Better count performance on joins**: The more common use case of this project is to show the number of likes on a post rather than the accounts who liked that post. MongoDB performs better in this usecase as PostGreSQL would have to individually first populate all fields & then count the number of likes.
3. **Easy, secure & free hosting**:  [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) allows me to host a free cluster of MongoDB for this app in production. It provided a 512MB space for a cluster in Mumbai hosted via AWS. The options to specify owners, whitelisting IP addresses allow me to secure the database.
4. **Misinformation about the NoSQL vs SQL comparison**: Some of the resources I followed while learning NodeJS & backend development introduced me to NoSQL databases as being somehow superior to SQL databases due to their flexibility, scalability and sharding support. This biased my thought process towards favoring NoSQL databases. I realized later that there is no winner & no comparison. The use cases of the databases differ a lot and they perform differently in various conditions.
   
The cons or tradeoffs made by using MongoDB:
1. **Increased time for JOINs**: MongoDB does not have query optimizers like PostGreSQL or other SQL databases for relational joins. Even though the counts are faster i.e. the number of likes / number of comments on posts,  but when it comes to fetching the account info of the people who liked a post the relational queries required would be faster with PostGreSQL.
2. **Slower & more complicated search amongst documents**: PostGreSQL would have implemented a faster and less cumbersome search on text fields like ```username``` & ```name``` of an account than MongoDB (not indexed). In Mongo I had to use RegExp for searching through all the documents which is much more cumbersome than the ```LIKE %query%``` in SQL.
3. **More Storage**: I have learnt that MongDB takes more space per document & index as compared to PostGreSQL as BSON seems to be heavier than SQL fields.


### 02. Rendering: Client Side Rendering vs Server Side Rendering 🖥️

__TLDR__: Client Side Rendering is the optimal choice in this case as there is not a continuous flow of dynamic data. The response/load time can be increased significantly using in-browser caching and it takes away the load of rendering from the server.

My reasons of choosing Client Side Rendering (further referred to as CSR) for this project are:
1. **Reduces Server Load**: Currently I am using a free tier of Heroku Hosting which sleeps after regular intervals. CSR takes away the load of rendering the JS to HTML files etc and pushes it onto the browser. I do recognize that this is an economic choice rather than an engineering choice & should be neglected while considering scaling of the product.
2. **Faster page rendering**: All the further loading of pages after the initial load become super quick as the page code has already been loaded. This effect coupled with state managers like Redux give an instant response for the most common pages - timeline & trending.
3. **In browser caching**: CSR enjoys faster rendering & loading using the in-browser caching for the website as compared to server side rendering apps.
4. **Native App like behavior**: CSR helped me create a native app like behavior across many mobiles. The website while being run on Chrome feels completely like a native app to provide enhanced experience for users.
  
The cons or tradeoffs made by choosing CSR:
1. **Increased Load Time**: The first page load time has been increased considerably by using CSR. SSR would have provided quicker first page loading but all future page load times would have increased as well.

### 03. State Management: Global State Management vs Individual State Management 💼

__TLDR__: Redux as a global state manager has greatly improved the time required for page rendering, helped in writing cleaner code and creating reusable/independent components.  

My reasons of choosing Redux as a global state manager for this project are:
1. **Faster page renders**: As I have fetched and stored data in the global state, the rendering time for pages using this data is extremely low. The global state coupled with CSR have created really fast render times for the timeline & trending pages.
2. **Cleaner & concise code**: I was able to write cleaner code as the passing down of props was taken away and I could directly subscribe to global state and get those values. 
3. **Separates UI & data management**: I was able to write reusable and independent components as the data & UI were separated by Redux using actions, reducers etc. My components were no longer concerned with data fetching just the data display.

The cons or tradeoffs made by choosing Redux:
1. **Tedious & heavy to setup**: Redux takes some time to setup along with a certain file structure, middleware setup etc. Redux & react-redux are heavy libraries as well so they also increase the bundle size of the production build.
2. **No encapsulation**: The global state is available for every component. Any component can access any state value & subscribe to it. This might create issues when multiple developers are working or when a component mistakenly subscribes to state that it shouldn't care about.
   
### 04. Redux Middleware: Redux Thunk vs Redux Saga 🧰

__TLDR__: A middleware was absolutely necessary for dispatching and performing asynchronous actions to communicate with the backend. Redux Saga avoids the callback syntax and maintains code consistency by dispatching actions only instead of functions.

My reasons of choosing [Redux-Saga](https://redux-saga.js.org/) as a global state manager for this project are:

1. **Code consistency for dispatching actions**: Redux Saga dispatches action objects only while [Redux-Thunk](https://github.com/reduxjs/redux-thunk) dispatches functions which changes the code style. 
2. **Introduction to ES6 generators**: Redux-Saga introduced me to ES6 generator functions and their uses. Using sagas helped me understand & learn more about these concepts. I had already used redux-thunk in a project before.

### 05. Other libraries & services used ⚙️
1. [Cloudinary](https://cloudinary.com/) ☁️: All images uploaded are stored on the cloud using the free tier of cloudinary. It helped in providing quick access to images via a URL. The images can also be manipulated (cropped, filters, saturation etc.) using their native driver. 
2. [Sendgrid](https://sendgrid.com/) ✉️: The welcome, password reset emails etc. are being sent via SendGrid. They provide a secure and easy to use API for this.
3. [MapBox](https://www.mapbox.com/) 🗺️: All geolocation data is encoded via MapBox API. Rendering of the map for posts near a location is done using the MapBox-GL library.