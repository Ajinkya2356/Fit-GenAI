# FitFusion App

Fitness Application with generative AI features, with various use cases, which will drive your fitness journey easily regardless of any difficulty.
Tech Stack Used : React.js, Redux.js, Material UI, Node.js, Express.js, MongoDB, Zod, Google Generative AI

## Features

- **AI Integration**: Users can generate plans and steps for particular exercises using generative AI.
- **Workouts**: Users can view and manage their workouts.
- **Exercises**: Users can view and manage their exercises.
- **Challenges**: Users can view and manage their challenges.
- **Plans**: Users can view and manage their plans.

## Installation

To install the project, follow these steps:

1. Clone the repository: `git clone https://github.com/username/fitness-app.git`
2. Start Backend
   1. Navigate to backend directory : `cd backend`
   2. Specify all the environment variables in `.env` file
      1. PORT --> `Port for running application`
      2. MONGODB_URI --> `Database URL`
      3. DATABASE_NAME --> `Name of Database`
      4. JWT_SECRET 
      5. JWT_EXPIRES_IN --> `Duration of expiry time for access Token`
      6. JWT_REFRESH_SECRET
      7. JWT_REFRESH_EXPIRES_IN --> `Duration of expiry time for access Token`
      8. CLOUDINARY_API_NAME --> `Cloudinary Name`
      9. CLOUDINARY_API_KEY --> `Cloudinary API key`
      10. CLOUDINARY_API_SECRET --> `Cloudinary Secret`
      11. RESET_PASSWORD_SECRET --> `JWT secret for reset password jwt`
      12. SMTP_HOST --> `Email protocol`
      13. SMTP_PORT 
      14. SMTP_SERVICE --> `Service Provider`
      15. SMTP_EMAIL --> `Host Email Address`
      16. SMTP_PASSWORD --> `Host Email Account password`
      17. FRONTEND_URL --> `URL of frontend`
      18. LLM_KEY --> `Gemini's Pro vision key`
   3. Install all the dependencies : `npm install`
   4. Start the backend server : `npm run dev`
3. Start Frontend
   1. Navigate to the Directory : `cd frontend`
   2. Install the dependencies: `npm install`
   3. Start the frontend : `npm run dev`

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
Please Pull Request to the master branch with corresponding suitable message.

## Contributer : Ajinkya Jagtap
