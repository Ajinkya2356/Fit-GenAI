# Fitness App

Fitness Application with generative AI features, with various use cases, which will drive your fitness journey easily regardless of any difficulty.
Tech Stack Used : React.js, Redux.js, Material UI, Node.js, Express.js, MongoDB, Zod, Google Generative AI

## Features

- **AI Integration**: Users can generate plans and steps for particular exercises using generative AI.
- **Workouts**: Users can view and manage their workouts.
- **Exercises**: Users can view and manage their exercises.
- **Challenges**: Users can view and manage their challenges.
- **Plans**: Users can view and manage their plans.

## Components

- **MyChallenges**: This component displays the challenges of the user. It fetches the challenges from the Redux store and displays them in a Material-UI Card component. Each card has an Edit and Delete button.
- **MyExercises**: This component displays the exercises of the user. It fetches the exercises from the Redux store and displays them in a Material-UI Card component. Each card has an Edit and Delete button.
- **Footer**: This component displays a footer with a quick menu, a subscription message, and social media links. It uses Material-UI's Grid for layout, List for the menu, and IconButton for the social media links.

## Installation

To install the project, follow these steps:

1. Clone the repository: `git clone https://github.com/username/fitness-app.git`
2. Start Backend
   1. Navigate to backend directory : `cd backend`
   2. Specify all the environment variables in `.env` file
      PORT --> `Port for running application`
      MONGODB_URI --> `Database URL`
      DATABASE_NAME --> `Name of Database`
      JWT_SECRET 
      JWT_EXPIRES_IN --> `Duration of expiry time for access Token`
      JWT_REFRESH_SECRET
      JWT_REFRESH_EXPIRES_IN --> `Duration of expiry time for access Token`
      CLOUDINARY_API_NAME --> `Cloudinary Name`
      CLOUDINARY_API_KEY --> `Cloudinary API key`
      CLOUDINARY_API_SECRET --> `Cloudinary Secret`
      RESET_PASSWORD_SECRET --> `JWT secret for reset password jwt`
      SMTP_HOST --> `Email protocol`
      SMTP_PORT 
      SMTP_SERVICE --> `Service Provider`
      SMTP_EMAIL --> `Host Email Address`
      SMTP_PASSWORD --> `Host Email Account password`
      FRONTEND_URL --> `URL of frontend`
      LLM_KEY --> `Gemini's Pro vision key`
   3. Install all the dependencies : `npm install`
   4. Start the backend server : `npm run dev`
3. Start Frontend
   1. Navigate to the Directory : `cd frontend`
   2. Install the dependencies: `npm install`
   3. Start the frontend : `npm run dev`

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
Please Pull Request to the master branch with corresponding suitable message.
