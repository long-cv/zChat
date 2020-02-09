module.exports = {
  jwtSignOption: {
    algorithm: "RS256",
    expiresIn: "12h",
    issuer: "zChat Corp",
    audience: "client identity",
    subject: "user auth"
  },
  jwtVerifyOption: {
    algorithms: ["RS256"],
    issuer: "zChat Corp",
    audience: "client identity",
    subject: "user auth"
  }
}