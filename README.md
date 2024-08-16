# ------------# Tech Tide #-----------#

My live link: 

- ## .................Here is the project setup, instructions, and necessary details....................##

  - #. You may check first- TechTide Backend
This is the backend of the TechTide application, built using Node.js, Express.js, and MongoDB.

#Project Setup-

#Prerequisites:
Node.js: Ensure you have Node.js installed on your machine.
npm: Node Package Manager, comes with Node.js.
MongoDB: Ensure MongoDB is installed and running.

#Installation-
Clone the Repository:

bash/cmd
cd/ projects
git clone <repository-url>
code .
Install Dependencies:

bash
npm install

#Create an Environment File:

Create a .env file in the root directory and add the following environment variables:

bash
PORT=5000
DB_USER=<your-mongodb-username>
DB_PASS=<your-mongodb-password>

#Run the Server:

bash
npm start
The backend server will be available at http://localhost:5000.


#Troubleshooting
Database Connection Issues: Ensure MongoDB is running and accessible with the credentials provided in the .env file.
CORS Issues: Ensure CORS is properly configured in the middleware.

#TERMINAL: 

nodemon index.js.
Pinged your deployment. You successfully connected to MongoDB!
Tech tide Server is running on port 5000