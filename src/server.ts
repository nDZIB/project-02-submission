import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get('/filteredimage', async (req, res) => {
    const {image_url} = req.query;

    if(image_url && (image_url.startsWith('http://') || image_url.startsWith('https://'))) {
      const filteredImageUrl = await filterImageFromURL(image_url);
      await res.sendFile(filteredImageUrl);   
      
      res.on('finish', ()=> { //once the request finishes, delete the file
        deleteLocalFiles([filteredImageUrl]);
      })

    } else {
      res.status(422).send("Provide a valid image url.")
    }
    
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();