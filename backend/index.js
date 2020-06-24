<<<<<<< HEAD
const { GraphQLServer } = require("graphql-yoga");
const keys = require("./config/keys");
const mongoose = require("mongoose");

mongoose.connect(
  keys.databaseURI,
=======
const express = require("express");
const mongoose = require("mongoose");
const {
  configurePermissions
} = require("./models/authentication/permissions-model");
const keys = require("./config/keys");

const passport = require("passport");
const passportSetup = require("./config/passport-setup");

const authRoutes = require("./routes/auth-routes");
const apiRoutes = require("./routes/api-routes");

const app = express();
const path = require("path");
const port = 3000;

const serveIndex = require('serve-index');

//Initialize
app.use(passport.initialize());
//configurePermissions();

//Connect to DB
mongoose.connect(
  keys.database.devDatabaseURI,
>>>>>>> de123a4fe033ab9e4608bbf4ce000a83f210f05b
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
<<<<<<< HEAD
    useFindAndModify: false,
  },
  () => console.log("Connected to mongoDB")
);

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
  },
};

const server = new GraphQLServer({
  typeDefs: "./graphql/schema.graphql",
  resolvers,
});
server.start(() => console.log(`Server is running on http://localhost:4000`));
=======
    useFindAndModify: false
  },
  () => {
    console.log("Connected to mongoDB");
  }
);

//Routes
app.use("/auth", authRoutes);
app.use("/api", passport.authenticate("jwt", { session: false }), apiRoutes);

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"))
);

app.use(express.static(path.join(__dirname, "../frontend/build")));

app.use('/ftp', express.static('public'), serveIndex('public', {'icons': true}));

app.use('/about', express.static("../frontend/landing"));

//Catch GET requests to invalid URIs and redirect to home page
app.get("/*", (req, res) => {
 res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

app.listen(port, () => console.log(`Application running on port ${port}!`));
>>>>>>> de123a4fe033ab9e4608bbf4ce000a83f210f05b
