const express = require("express");
const app = express();
const path = require("path");
const PORT = 8000;
const hbs = require("hbs");
const bcrypt = require("bcrypt");
const { where } = require("sequelize");
const session = require("express-session");
const flash = require("express-flash");

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
app.get("/add-kabupaten", addKabupatenView);
// app.get("/edit-kabupaten/:id", editKabupatenView);
app.get("/add-provinsi", addProvinsiView);
// app.get("/edit-provinsi/:id", editProvinsiView);
app.get("/login", loginView);
app.get("/register", registerView);
// app.get("/logout", logoutView);
app.get("/detail-kabupaten/:id", detailKabupaten);
app.get("/detail-provinsi/:id", detailProvinsi);
// app.get("/not-found", notFound);

// Handler
// app.post("/add-kabupaten", addKabupaten);
// app.post("/add-provinsi", addProvinsi);
// app.get("/delete-kabupaten/:id", deleteKabupaten);
// app.get("/delete-provinsi/:id", deleteProvinsi);
// app.post("/edit-kabupaten/:id", editKabupaten);
// app.post("/edit-provinsi/:id", editProvinsi);
// app.post("/register", register);
// app.post("/login", login);
// app.post("/logout", logout);

// Functions

// Router functions
// function home(req, res) {
//   res.render("index");
// }
// function loginView(req, res) {
//   res.render("login");
// }
// function registerView(req, res) {
//   res.render("register");
// }
// function addProvinsiView(req, res) {
//   res.render("add-provinsi");
// }
// function addKabupatenView(req, res) {
//   res.render("add-kabupaten");
// }
async function home(req, res) {
  const { user } = req.session;
  const kabupaten = await kabupatenModel.findAll();
  const provinsi = await provinsiModel.findAll();
  res.render("index", { cities: kabupaten, provinces: provinsi, user });
}

function loginView(req, res) {
  const { user } = req.session;
  res.render("login", { user });
}

function registerView(req, res) {
  const { user } = req.session;
  res.render("register", { user });
}

// function logoutView(req, res) {
//   const { user } = req.session;
//   res.render("logout", { user });
// }

function addKabupatenView(req, res) {
  const { user } = req.session;
  res.render("add-kabupaten", { user });
}

function addProvinsiView(req, res) {
  const { user } = req.session;
  res.render("add-provinsi", { user });
}

// async function editKabupatenView(req, res) {
//   const { user } = req.session;
//   const { id } = req.params;
//   const kabupaten = await kabupatenModel.findOne({
//     where: {
//       id: id,
//     },
//   });
//   if (!kabupaten) return res.render("not-found");
//   res.render("edit-kabupaten", { cities: kabupaten, user });
// }

// async function editProvinsiView(req, res) {
//   const { user } = req.session;
//   const { id } = req.params;
//   const provinsi = await provinsiModel.findOne({
//     where: {
//       id: id,
//     },
//   });
//   if (!provinsi) return res.render("not-found");
//   res.render("edit-provinsi", { provinces: provinsi, user });
// }

async function detailKabupaten(req, res) {
  const { user } = req.session;
  const { id } = req.params;
  const kabupaten = await kabupatenModel.findOne({
    where: {
      id: id,
    },
  });
  if (!kabupaten) return res.render("not-found");
  res.render("detail-kabupaten", { cities: kabupaten, user });
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
  res.render("detail-provinsi", { projects: provinsi, user });
}

function notFound(req, res) {
  const { user } = req.session;
  res.render("not-found", { user });
}
