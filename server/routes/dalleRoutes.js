import express from "express";
import * as dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const engineId = 'stable-diffusion-v1-5'
const apiHost ='https://api.stability.ai'
const apiKey = process.env.STABILITY_API_KEY

router.route('/').get((req,res) => {
    res.send('hello from DALLLL-E');
})

router.route('/').post(async (req,res) => {
    try {
        const {prompt} = req.body;
        (async () => {
          const response = await fetch(
            `${apiHost}/v1/generation/${engineId}/text-to-image`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${apiKey}`,
              },
              body: JSON.stringify({
                text_prompts: [
                  {
                    text: prompt,
                  },
                ],
                cfg_scale: 7,
                clip_guidance_preset: 'FAST_BLUE',
                height: 512,
                width: 512,
                samples: 1,
                steps: 30,
              }),
            }
          );
        
          if (!response.ok) {
            throw new Error(`Non-200 response: ${await response.text()}`);
          }
        
          const responseJSON = await response.json();
          const image = responseJSON.artifacts[0].base64;
          res.status(200).json({ photo: image });
        })();
    } catch (error) {
        console.log(error);
        res.status(500).send(error?.response.data.error.message);
    }
}
)

export default router;