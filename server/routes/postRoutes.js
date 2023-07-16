import express from 'express';
import * as dotenv from 'dotenv';

import Post from '../mongodb/models/post.js';

dotenv.config();
const IMGBB_API_KEY = process.env.IMGBB_API_KEY;
const router = express.Router();
function isValidBase64(str) {
    // Regular expression to match base64 format
    const base64Regex = /^data:image\/[a-z]+;base64,([A-Za-z0-9+/=])+$/;
    return base64Regex.test(str);
  }

async function uploadImage(base64Image) {
    console.log(isValidBase64(base64Image))
    const url = `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`;
  
    const form = new FormData()
    form.append('key',IMGBB_API_KEY)
    form.append('image', base64Image)
  
    const response = await fetch(url, {
      method: 'POST',
      body: form,
    });
  
    const data = await response.json();
    console.log(data);
    return data
  }

router.route('/').get(async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Fetching posts failed, please try again' });
  }
});

router.route('/').post( async (req,res) => {
    try {
    const { name, prompt, photo } = req.body;
    const imageUrl = uploadImage(photo)
        .catch((error) => {
      console.log(error);
    })
        const newPost = await Post.create({
            name,
            prompt,
            photo: imageUrl,
          });
    res.status(200).json({ success: true, data: newPost });
    } catch (error) {console.log(error)};
}
)

export default router;