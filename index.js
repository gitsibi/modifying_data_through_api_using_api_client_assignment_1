const express = require('express');
const { resolve } = require('path');
const mongoose=require('mongoose');
const MenuItem = require('./schema.js');
require('dotenv').config();
const app = express();
const port = 3010;
app.use(express.json());
app.use(express.static('static'));

mongoose.connect(process.env.db_url)
.then((data)=>{
  console.log(`Connected to mongo atlas ${data.connection.host}`)
})
.catch((err)=>{
  console.log(`Error in the connection ${err}`)
})

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.get('/menu',async(req,res)=>{
  try{
    const menuItems= await MenuItem.find();
    res.status(200).json({
      success: true,
      data: menuItems,
    });
  }
  catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching menu items',
      error: error.message,
    });
  }
})

app.post('/menu',async (req,res)=>{
  try{
        const {name,description,price}=req.body;
        if((!name) || (!price))
        {
          res.status(400).json({
            sucess:false,
            message:"Name and price fileds are required."

          })
        }
        
        const newItem= new MenuItem({name,description,price})
        await newItem.save();
        res.status(201).json({
          sucess:true,
          message:"New Item created sucessfully",
          data:newItem
        })
      }
      catch(error){
        res.status(500).json({
          success: false,
          message: 'Error creating menu item',
          error: error.message,
        })
      }
})


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
