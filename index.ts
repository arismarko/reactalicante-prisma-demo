import bodyParser from 'body-parser';
import express from "express";
import { PrismaClient } from '@prisma/client'

const apiKey = 'r_BR8xTS0Mn64OakIXhjKVnd1QHH7LoOXNBct4_LqXIgb6vYV-cy7Qk6200CbwJvcGQurHxWsQbqmwY4eoGBJcEFuctLs69uKdLucZrTh0dYnce0zyL7RTd8AkTiZnYx';

const app = express();
const port = 3000; // default port to listen

const yelp = require('yelp-fusion')


app.use(bodyParser.json());

const prisma = new PrismaClient();

app.post('/api/stores', async (req, res) => {    
  const { body } = req;

  console.log("ALOHA", body);

  const dataToAdd = {
      storename: body?.storename,
      location: body?.location,
      coordinates: body?.coordinates,
      date: new Date(),
      Item: {
          create: body.items,
      },
  };

  const store =   await prisma.store.create({ data: dataToAdd});

  console.log(store);

  res.status(200).json(store);
}); 

app.get('/api/items',   (req, res) => {
  prisma.item.findMany().then(results => {
      res.status(200).json({ results });
  })
})

app.get('/api/stores',  async (req, res) => {
  const {
      query: {missing, date },
      method,
  } = req

  // const fulldate = new Date(Number(date));

  console.log(missing);
  
  const stores = await prisma.store.findMany(
    {
      include: {
          StoresOnItems: true,
          Item: true
      },
      where:
      {
          // date: fulldate,
          Item: {
              some:
              { item: missing as string }
          }
      }
    })

    console.log(stores);

    res.status(200).json({ stores });
})

app.put('/api/stores/:id',  async (req, res) => {

  const reqid = req.params.id;
  const storename=  req.body.storename;

  const updatedStore = await prisma.store.update({
      data: { storename: storename },
      where: { id: Number(reqid) },
  })

  res.status(200).json({ updatedStore });
})

app.delete('/api/stores/:id', async (req, res) => {

  const reqid = req.params.id;

  const deletedStore  = await prisma.store.delete({
      where: { id: Number(reqid) },
  });

  res.status(200).json({ deletedStore });
})

app.get('/api/points',  async (req, res) => {
  const {
      query: {missing, lat, long },
      method,
  } = req


  const searchRequest = {
    term:missing,
    latitude: lat,
    longitude: long,
    offset: 20
  };
  const client = yelp.client(apiKey);

  const response: Response = await client.search(searchRequest);

 console.log(response);

  res.status(200).json(response);

});


app.listen(port, function () {
  console.log(`Example app listening on port ${process.env.PORT}!`);
});