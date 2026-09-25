# About
This project is about analyzing business ideas and providing the possibilites risks and possibilites about that business idea

## Architecture
This app is made of react+vite and Taildwindcss in frontend and node js + Express on backend and hosted using vercel and render for backend

1.App.jsx:                      
mission state             
loading state             
result state              
error state               
handleAnalyse()  

2.server.js :                 
receives mission          
validates input           
builds AI prompt          
calls Gemini              
handles errors 


## Localy use
change your server env to
VITE_API_URL=http://localhost:3001
GEMINI_API_KEY=your_actual_key
and run backed by node server.js 
and run frontend by using npm run dev

### Future Improvements
Add user login and accounts.
Save previous Mission Briefs.
Allow users to edit generated results.
Add PDF download.
Add a copy-to-clipboard option.
Improve the design and user experience.