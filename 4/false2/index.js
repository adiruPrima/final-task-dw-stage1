const express = require("express");
const app = express();
const path = require("path");
const PORT = 8000;
const hbs = require("hbs");
const bcrypt = require("bcrypt");
const { where } = require("sequelize");
const config = require("./config/config.json");
const { Sequelize, QueryTypes } = require("sequelize");
const session = require("express-session");
const flash = require("express-flash");
const upload = require("./middlewares/upload-file");

const sequelize = new Sequelize(config.development);

const kabupatenModel = require("./models").kabupaten;
const provinsiModel = require("./models").provinsi;
const userModel = require("./models").user;

// handelbars (hbs) setup
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// to access the images
app.use("/images", express.static(path.join(__dirname, "images")));

// body parser permission
app.use(express.urlencoded({ extended: true }));

// configure session
app.use(
  session({
    name: "my-session",
    secret: "jasSD9j23Ljd",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// integrate flash
app.use(flash());

// PORT listener
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Routing
app.get("/", home);
app.get("/add-provinsi", addProvinsiView);
app.get("/edit-provinsi/:id", editProvinsiView);
app.get("/add-kabupaten", addKabupatenView);
app.get("/edit-kabupaten/:id", editKabupatenView);
app.get("/login", loginView);
app.get("/register", registerView);
app.get("/logout", logoutView);
app.get("/detail-provinsi/:id", detailProvinsi);
app.get("/detail-kabupaten/:id", detailKabupaten);
app.get("/not-found", notFound);

// Handler
app.post("/add-provinsi", addProvinsi);
app.post("/add-kabupaten", addKabupaten);
// app.get("/delete-kabupaten/:id", deleteKabupaten);
// app.get("/delete-provinsi/:id", deleteProvinsi);
// app.post("/edit-kabupaten/:id", editKabupaten);
// app.post("/edit-provinsi/:id", editProvinsi);
app.post("/register", register);
app.post("/login", login);
app.post("/logout", logout);

// Functions

// Router functions
async function home(req, res) {
  const { user } = req.session;

  const kabupatenQuery = `SELECT * FROM public.kabupatens`;
  const kabupaten = await sequelize.query(kabupatenQuery, {
    type: QueryTypes.SELECT,
  });
  const provinsiQuery = `SELECT * FROM public.provinsis`;
  const provinsi = await sequelize.query(provinsiQuery, {
    type: QueryTypes.SELECT,
  });

  console.log(kabupaten);
  console.log(provinsi);

  res.render("index", { kabupaten, provinsi, user });
}

function loginView(req, res) {
  const { user } = req.session;
  res.render("login", { user });
}

function registerView(req, res) {
  const { user } = req.session;
  res.render("register", { user });
}

function logoutView(req, res) {
  const { user } = req.session;
  res.render("logout", { user });
}

function addKabupatenView(req, res) {
  const { user } = req.session;
  res.render("add-kabupaten", { user });
}

function addProvinsiView(req, res) {
  const { user } = req.session;
  res.render("add-provinsi", { user });
}

async function editKabupatenView(req, res) {
  const { user } = req.session;
  const { id } = req.params;
  const kabupaten = await kabupatenModel.findOne({
    where: {
      id: id,
    },
  });
  if (!kabupaten) return res.render("not-found");
  res.render("edit-kabupaten", { kabupaten, user });
}

async function editProvinsiView(req, res) {
  const { user } = req.session;
  const { id } = req.params;
  const provinsi = await provinsiModel.findOne({
    where: {
      id: id,
    },
  });
  if (!provinsi) return res.render("not-found");
  res.render("edit-provinsi", { provinsi, user });
}

async function detailKabupaten(req, res) {
  const { user } = req.session;
  const { id } = req.params;
  const kabupaten = await kabupatenModel.findOne({
    where: {
      id: id,
    },
  });
  if (!kabupaten) return res.render("not-found");
  res.render("detail-kabupaten", { kabupaten, user });
}

async function detailProvinsi(req, res) {
  const { user } = req.session;
  const { id } = req.params;
  const provinsi = await provinsiModel.findOne({
    where: {
      id: id,
    },
  });
  if (!provinsi) return res.render("not-found");
  res.render("detail-provinsi", { provinsi, user });
}

function notFound(req, res) {
  const { user } = req.session;
  res.render("not-found", { user });
}

// Handler functions
async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    // set hashing parameter (higher: more complex and expensive)
    const saltRounds = 10;
    // auto-gen a salt and hash
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await userModel.create({
      username,
      email,
      password: hashedPassword,
    });

    req.flash("success", "Register successful");
    res.redirect("/");
  } catch (error) {
    req.flash("error", "Register failed, please try again");
    res.redirect("/register");
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    // check if email exist in db
    const user = await userModel.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      req.flash("error", "Email or password is invalid");
      return res.redirect("/login");
    }

    // check if password matches the hash value
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      req.flash("error", "Email or password is invalid");
      return res.redirect("/login");
    }

    req.session.user = user;
    req.flash("success", "Login successful!");
    res.redirect("/");
  } catch (error) {
    req.flash("error", "Something went wrong!");
    res.redirect("/login");
  }
}

function logout(req, res) {
  try {
    // destroy the session and redirect to login
    req.session.destroy((err) => {
      if (err) {
        console.error("Failed to destroy session:", err);
        return res.redirect("/");
      }
      res.redirect("/login");
    });
  } catch (error) {
    res.redirect("/");
  }
}

async function addProvinsi(req, res) {
  const { user } = req.session;
  let { nama, diresmikan, pulau } = req.body;

  // login error handling
  if (!user) {
    req.flash("error", "You must be logged in to add a province.");
    return res.redirect("/login");
  }

  // if req.file.path is undefined (cannot access), use placeholder
  const imagePath = req.file
    ? req.file.path
    : "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=";

  // Create new provinsi row in database
  try {
    await provinsiModel.create({
      nama,
      userId: user.id,
      diresmikan,
      pulau,
      photo: imagePath,
    });
  } catch (error) {
    req.flash("error", "Failed to add province");
    return res.redirect("/add-provinsi");
  }

  req.flash("success", "Provinsi added successfully!");
  res.redirect("/");
}

async function addKabupaten(req, res) {
  const { user } = req.session;
  const { nama, letakProvinsi, diresmikan } = req.body;

  // login error handling
  if (!user) {
    req.flash("error", "You must be logged in to add a province.");
    return res.redirect("/login");
  }

  // Find the provinsi by name (letakProvinsi)
  const provinsi = await provinsiModel.findOne({
    where: {
      nama: letakProvinsi, // Ensure you're matching the correct field name
    },
  });

  if (!provinsi) {
    req.flash("error", "Province not found");
    return res.redirect("/add-kabupaten");
  }

  // If no image is uploaded, use a placeholder
  const imagePath = req.file
    ? req.file.path
    : "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=";

  // Create new kabupaten row in database
  try {
    await kabupatenModel.create({
      nama,
      provinsiId: provinsi.id,
      diresmikan,
      photo: imagePath,
    });
  } catch (error) {
    req.flash("error", "Failed to add kabupaten");
    return res.redirect("/add-kabupaten");
  }

  req.flash("success", "Kabupaten added successfully!");
  res.redirect("/");
}
