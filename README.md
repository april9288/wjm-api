# wjm-api
> Express.js server for https://www.woojoo-market.com

- [Please click it to see the front-end repo](https://github.com/april9288/woojoo-market.com)

- Secure Login System
    - The Express server generates a JSON web token and stores in two locations. One is stored in the database and the other one is delivered to the client's browser and will be stored in the cookie. It'll be safer than storing in the localstorage, which can be accessed by 3rd party code.
    - User's password is hashed with bcrypt. It's a one-way hash password, meaning there is no way guessing the original password with the hashed password. A salt is added to put more complexity into the hashing algorithm. 
    - UUID allows us to avoid exposing primary keys which should be secured all the time. Instread of using primary keys to route a specific page, UUID can be used here to let react-router-dom render corresponding pages. UUID is great because it is a random number that is universially unique. So later on, when it comes to DB sharding, each data row can have a unique ID number to ensure uniqueness. 
    - SendGrid API sends an email to users who forgot their password. The server generates a random password and the password will be sent via email. Later on, user should change their password in the settings page.

- Photo Upload System
    - Multer handles uploaded media files from the client. 
    - Sharp converts format of photos to .webp format, and resizes to 3 different sizes; 550px, 400px, 100px.
    - AWS SDK allows us to access to AWS S3 to store and serve photos.
    - The url of photos is stored in the database.

- Online Payment System
    - Stripe API allows users to sell and buy their items.

- Following/Follower System

## AWS for Scaling
> I'm a certified AWS Cloud Practitioner. I designed this architecture to scale up on the cloud.

![](aws.png)

For Front-end
- Registered a domain name on AWS Route 53 ( bought 'woojoo.com' domain )
- SSL Certified by AWS Certificate Manager ( enabled https to provide stronger security )
- Deployed React.js app on AWS S3
- Utilized AWS CloudFront's Edge Locations to reduce the latency

For Back-end
- Registered a domain with Godaddy ( bought 'woojoo.space' domain)
- SSL Certified by Let's Encrypt
- Set up Nginx on AWS EC2 for redirecting https requests to the back-end server
- Deployed Express.js server on AWS EC2
- Set up a AWS S3 bucket to store and server media files
- Set up Postgresql on AWS RDS 

## Unit Test
> Performed unit testing with Jest & Supertest

- [x] Sign Up, Log In, Log Out, User Authentication (with JWT)
- [x] Change Password, Create Profile, Edit Profile, Delete Account
- [x] Retrieve Following Data, Add Connection, Delete Connection
- [x] Upload Photo
- [x] Retrieve Feed, Create Post, Delete Post
- [ ] Pay with Stripe

## Todo List
- [x] Set up Redis on AWS Elasticache
- [ ] Connect with the Redis DB and test 
- [ ] Set up a CI/CD Pipeline on AWS

## Linting and Formatting
- ESLint
- Prettier
- Airbnb Style Guide

## Related Projects
- [React.js - Frontend](https://github.com/april9288/woojoo-market.com)

### How to Run
```
git clone https://github.com/april9288/wjm-api.git
cd wjm-api
npm install
npm start
```

### Requirements
You need to install Nodejs.
You need config files.

## Meta Data
Jong-Ho (James) Kim

- [Portfolio](https://april9288.github.io/) - It's my portfolio website
- [Github](https://github.com/april9288) - This is my Github page
- [Linkedin](https://www.linkedin.com/in/james-kim-teamplayer/) - This is my Linkedin page
- [Medium](https://medium.com/@april9288) - I'm a Medium blogger
- april9288@gmail.com
