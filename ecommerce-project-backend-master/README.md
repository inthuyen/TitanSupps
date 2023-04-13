# ecommerce-project-backend

This is the backend component of our CPS630 e-commerce site project, built with pure PHP. See the [frontend repo's readme](https://github.com/CPS630/ecommerce-project-frontend) for info on running the project as a whole.

# Setting Up the Back End

These are the steps required to set up the back end of this project:

1. Open XAMPP as administrator.
2. Click the Config button on Apache and open phpMyAdmin(config.inc.php).
3. Paste the contents of `configuration.txt` located in the setup folder and paste that in.
4. Click the Config button on MySQL and open my.ini.
5. Paste the contents of `my.ini` located in the setup folder and save.
6. Start Apache and MySQL processes in XAMPP.
7. Click Admin on MySQL.
8. Take the `final.sql` file in the sql_dumps folder and import it into phpMyAdmin as the database named final.

# Setting Up the Front End

These are the steps required to set up the front end of this project:

1. Make sure you have NPM installed.
   - If not, download and install node.js from https://nodejs.org/en/download.
   - Then run `npm install` in your terminal.
2. In the env folder in the frontend, create a new file called `.env.development.local`.
3. Paste `VITE_BACKEND=http://localhost:8070` into that file and save.

# Running the Application

These are the steps required to run the application:

1. Run `run_server.bat` in the backend root to start the backend.
2. Run `run_frontend.bat` in the frontend root to start the frontend.
3. Check the terminal window of the `run_frontend.bat` to get the site address.
