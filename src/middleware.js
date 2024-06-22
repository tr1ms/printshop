const cors = (req, res, next) => {
  res.setHeader("access-control-allow-origin", req.headers.origin || "*");
  res.setHeader(
    "access-control-allow-methods",
    "get, post, put, delete, options, xmodify",
  );
  res.setHeader("access-control-allow-credentials", true);
  res.setHeader("access-control-max-age", "86400");
  res.setHeader(
    "access-control-allow-headers",
    "x-requested-with, x-http-method-override, content-type, accept",
  );
  next();
};

const notFound = (req, res) => {
  res.status(404).json({ error: "not found" });
};

const errHandler = (err, req, res, next) => {
  console.log(err);
  if (res.headersSent) return next(err);

  const statusCode = err.statusCode || 500;
  const errorMessage = err.message || "server error";
  res.status(statusCode).json({ error: errorMessage });
};

module.exports = {
  cors,
  notFound,
  errHandler,
};
