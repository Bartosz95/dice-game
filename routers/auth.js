import logger from "../libs/logger";

const express = require("express");
const router = express.Router();
const passport = require("passport");

const AUTH_HOST = process.env.AUTH_HOST
const NODE_ENV = process.env.NODE_ENV
const CLIENT_ID = process.env.AUTH_CLIENT_ID

router.get(
  "/login",
  passport.authenticate("auth0", {
    scope: "openid email profile"
  }),
  (req, res) => {
    res.redirect("/");
  }
);

router.get("/callback", (req, res, next) => {
  logger.info(req.user)
  passport.authenticate("auth0", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      const returnTo = req.session.returnTo;
      delete req.session.returnTo;
      res.redirect(returnTo || "/");
    });
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logOut();

  let returnTo = req.protocol + "://" + req.hostname;
  const port = req.socket.localPort;

  if (port !== undefined && port !== 80 && port !== 443) {
    returnTo =
      NODE_ENV === "production"
        ? `${returnTo}/`
        : `${returnTo}:${port}/`;
  }

  const logoutURL = new URL(
    `https://${AUTH_HOST}/v2/logout`
  );

  const searchString = JSON.stringify({
    client_id: CLIENT_ID,
    returnTo: returnTo
  });
  logoutURL.search = searchString;

  res.redirect(logoutURL);
});

export default router