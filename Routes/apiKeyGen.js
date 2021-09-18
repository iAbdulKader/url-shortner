const { nanoid } = require("nanoid");
const { api_keys } = require("../Model/database");

const apiKeyGen = async (req, res) => {
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
}

module.exports = apiKeyGen;