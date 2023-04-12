# ecommerce-project-frontend
This is the frontend component of our CPS630 e-commerce site project. This frontend is built off of HTML, CSS, and Javascript along with Vite as a build tool.

## Running the Project
To run the project, open your terminal in the project root directory and run `npm run dev`. Alternatively, you can build this project using `vite build` to build the production application in a new `dist` folder. This will take any configuration in a `/env/.env.production` file.

To properly connect to the backend, download the project [here](https://github.com/CPS630/ecommerce-project-backend), and run it using your prefered setup. However, I would recommend running it simply using the following command at the root of the backend repository: `php -S localhost:8080`. This will run the backend at http://localhost:8080 and live-reload the server upon update. If you choose to run the backend on a different port, however, be sure to set the environment appropriately to accommodate for this. I.e., you would need to update the project's environment variables to point to the URL your backend instance is running. Say you were running the backend at http://localhost:9000, you would need to create a new `/env/.env.development.local` file with the following contents:

```env
VITE_BACKEND=http://localhost:9000
```

This new `.env.development.local` file will override the development environment settings listed in `.env.development` and will be ignored by Git.
