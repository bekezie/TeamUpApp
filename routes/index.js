const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const myDB = require("../db/MyDB.js");
var path = require("path");
const saltRounds = 10;

//testing ground, please don't delete, sean will delete when needed.
router.get("/data", function (req, res) {
  res.send(["Sean", "Tan", "Testing"]);
});

router.post("/createPost", async (req, res) => {
  try {
    console.log(new Date());
    const postObj = {
      user: req.user._id,
      title: req.body.title,
      content: req.body.content,
      createdAt: new Date(),
    };
    const dbRes = await myDB.createPost(postObj);
    if (dbRes == null) {
      res.redirect("/");
    } else {
      res.redirect("/post/:id");
    }
  } catch (e) {
    console.log("Error", e);
    res.status(400).send({ err: e });
  }
});

//get
router.get("/getPosts", async (req, res) => {
  try {
    const nPerPage = 20;
    const page = +req.query.page || 0;
    const dbRes = await myDB.getPosts(req.query);
    res.send({
      posts: dbRes.slice(page * nPerPage, (page + 1) * nPerPage),
      total: dbRes.length,
    });
  } catch (e) {
    console.log("Error", e);
    res.status(400).send({ err: e });
  }
});

router.post("/getPostById", async (req, res) => {
  try {
    const postId = req.body.id;
    const dbRes = await myDB.getPostById(postId);
    res.send(dbRes);
  } catch (e) {
    console.log("Error", e);
    res.status(400).send({ err: e });
  }
});

//testing ground, please don't delete, sean will delete when needed.

//This is the key GET route to work with react
router.get("*", (req, res) =>
  res.sendFile(path.resolve("front", "build", "index.html"))
);

//middle function to check login status before show profile page
function loggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect("/login");
  }
}

router.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/../public/profile.html"));
});

//index GET
router.get("/", function (req, res) {
  res.sendFile(path.resolve(__dirname), "front/build", "index.html");
});

//login POST
router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  function (req, res) {
    console.log("successful login");
    res.redirect("/");
  }
);

//logout GET
router.get("/logout", loggedIn, function (req, res) {
  req.logout();
  res.redirect("/");
});

//check same user name before register
router.post("/checkSameUserName", async (req, res, next) => {
  try {
    console.log("query", req.body);
    const result = await myDB.findSameUserName(req.body);
    res.send({ same: result });
  } catch (e) {
    console.log("Error", e);
    res.status(400).send({ err: e });
  }
});

//register POST
router.post("/register", async (req, res) => {
  try {
    console.log("user register info", req.body);
    const hashedPwd = await bcrypt.hash(req.body.password, saltRounds);
    const userObj = {
      username: req.body.username,
      password: hashedPwd,
      posted: [],
      teamuped: [],
    };

    const dbRes = await myDB.createUser(userObj);
    if (dbRes == null) {
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/");
      });
    }
  } catch (e) {
    console.log("Error", e);
    res.status(400).send({ err: e });
  }
});

//route to get user info
router.get("/getUser", (req, res) =>
  res.send({
    username: req.user ? req.user.username : null,
    posted: req.user ? req.user.posted : null,
    teamuped: req.user ? req.user.teamuped : null,
  })
);

router.get("*", (req, res) =>
  res.sendFile(path.resolve("front", "build", "index.html"))
);

//profile GET
router.get("/profile", loggedIn, function (req, res) {
  res.sendFile(path.join(__dirname + "/../public/profile.html"));
});

/*index routs*/
// get puzzle by size
router.get("/getPuzzlesPlay", async (req, res) => {
  try {
    console.log("Getting puzzles by size");
    const puzzles = await myDB.getPuzzleBySize();
    res.send({ puzzles: puzzles });
  } catch (e) {
    console.log("Error", e);
    res.status(400).send({ err: e });
  }
});

/*leader board routes*/
// get boards of popular puzzles
router.get("/getPuzzles", async (req, res) => {
  try {
    console.log("Getting polular puzzles");
    const puzzles = await myDB.getPuzzles();
    res.send({ puzzles: puzzles });
  } catch (e) {
    console.log("Error", e);
    res.status(400).send({ err: e });
  }
});

//get board by searching puzzle id
router.post("/searchBoard", async (req, res) => {
  console.log("Search a puzzle", req.body);
  try {
    const puzzleId = req.body.puzzleid;
    const puzzle = await myDB.getPuzzleById(puzzleId);
    let leaderBoard = {
      success: false,
    };
    if (puzzle == null) {
      console.log("No leaderboard found");
    } else {
      leaderBoard = {
        code: puzzle.code,
        leaderBoard: puzzle.leaderBoard,
        info: puzzle.info,
        success: true,
      };
    }
    res.send(leaderBoard);
  } catch (e) {
    console.log("Error", e);
    res.status(400).send({ err: e });
  }
});

//route to save solved puzzle to user collection
router.post("/saveTimeToUser", async (req, res) => {
  console.log("save time", req.body);
  try {
    const saveTime = await myDB.saveTimeToUser(req.body);
    res.send(saveTime);
  } catch (e) {
    console.log("Error", e);
    res.status(400).send({ err: e });
  }
});

//route to save solved puzzle to puzzle collection
router.post("/saveToLeaderBoard", async (req, res) => {
  console.log("save to leaderboard", req.body);
  try {
    const saveLB = await myDB.saveToLeaderBoard(req.body);
    res.send(saveLB);
  } catch (e) {
    console.log("Error", e);
    res.status(400).send({ err: e });
  }
});

module.exports = router;
