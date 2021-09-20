const { nanoid } = require("nanoid");
const { api_keys } = require("../Model/database");
const router = require("express").Router()

router.post("", async (req, res) => {
  try {
    const api_key = nanoid(16);
  
    const apiKey = {
      api_key
    };
    const createdApiKey = await api_keys.insert(apiKey);
  
    const createdApi = createdApiKey.api_key;
  
    res.end(createdApi);
  } catch (e) {
    res.end("Try Again")
  }
});

module.exports = router;