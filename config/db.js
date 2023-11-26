
const mongoose = require("mongoose");

mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB connecté");
  } catch (err) {
    console.error("Erreur lors de la connexion à MongoDB :", err);
    process.exit(1);
  }
};

module.exports = connectDB;

