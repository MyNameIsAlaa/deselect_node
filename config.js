require("dotenv").config();

const config = {
  db_url: process.env.DB_URL || "mongodb://localhost:27017/deselect",
  port: process.env.PORT || 9090,
}

module.exports = config;