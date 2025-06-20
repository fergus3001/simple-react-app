# My React App

This is a simple React application created to demonstrate the basic structure and functionality of a React project.

## Getting Started

To get started with this project, follow these steps:

1. **Clone the repository**:
   ```
   git clone <repository-url>
   ```

2. **Navigate into the project directory**:
   ```
   cd simple-react-app
   ```

3. **Install dependencies**:
   ```
   npm install --save react-scripts # first time install
   npm install
   ```

4. **Run the application**:
   ```
   npm start
   ```

The application will be available at `http://localhost:3000`.

## Project Structure

- `public/`: Contains static files such as `index.html` and `manifest.json`.
- `src/`: Contains the source code for the application.
  - `components/`: Contains React components.
  - `styles/`: Contains CSS files for styling the application.
  - `index.js`: The entry point of the application.
  - `index.css`: Global styles for the application.

## Built With

- React
- CSS
- Material UI


## Development steps
- Created the app (initial commit)
- Added materialUI 
` npm install @mui/material @mui/icons-material @emotion/react @emotion/styled @fontsource/roboto `
-- Imported roboto font, added App.js, modified index.js, upgraded app version from react 17 to 18 in order to get support for react-dom client

--

### Set up Google OAuth Credentials
Go to the Google Cloud Console
Create a new project or select an existing one
Navigate to "APIs & Services" > "Credentials"
Click "Create Credentials" > "OAuth client ID"
Configure the OAuth consent screen if prompted
Select "Web application" as application type
Add authorized JavaScript origins (e.g., http://localhost:3000)
Add authorized redirect URIs (e.g., http://localhost:3000)
Note your Client ID and Client Secret

Install required package:
npm install @react-oauth/google jwt-decode

Note that I added a .env file to contain the secret, actually just a dummy value in .env, with the real value in .env.local - hidden from source control