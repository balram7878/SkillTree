const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GithubStrategy = require("passport-github2").Strategy;
const User = require("../models/user.model");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // profile is what Google gives you
        const email = profile.emails[0].value;
        const name = profile.displayName;
        const googleId = profile.id;
        const profilePicture = profile.photos[0]?.value;

        // Check if user already exists
        let user =
          (await User.findOne({ googleId })) || (await User.findOne({ email }));

        if (user) {
          // User exists — just update their googleId if missing

          if (user.authProvider !== "google") {
            return done(null, false, {
              message: `This email is registered with ${user.authProvider}. Please login with that instead.`,
            });
          }

          if (!user.isEmailVerified) {
            user.isEmailVerified = true;
            await user.save();
          }

          return done(null, user);
        }

        // New user — create them
        user = await User.create({
          name,
          email,
          googleId,
          profilePicture,
          authProvider: "google",
          isEmailVerified: true, // Google already verified their email
          passwordHash: null, // required field, placeholder
        });

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

// GitHub Strategy
passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/api/auth/github/callback`,
      scope: ["user:email"], // GitHub needs explicit email scope
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // GitHub sometimes hides email — handle null case
        const email =
          profile.emails?.[0]?.value ||
          `${profile.username}@github-noemail.com`;
        const name = profile.displayName || profile.username;
        const githubId = profile.id.toString();
        const profilePicture = profile.photos[0]?.value;

        let user =
          (await User.findOne({ githubId })) || (await User.findOne({ email }));

        if (user) {
          if (user.authProvider !== "github") {
            return done(null, false, {
              message: `This email is registered with ${user.authProvider}. Please login with that instead.`,
            });
          }

          if (!user.isEmailVerified) {
            user.isEmailVerified = true;
            await user.save();
          }

          return done(null, user);
        }

        user = await User.create({
          name,
          email,
          githubId,
          profilePicture,
          authProvider: "github",
          isEmailVerified: true,
          passwordHash: null,
        });

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

module.exports = passport;
