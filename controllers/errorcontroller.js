exports.customError = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.PSQLErrors = (err, req, res, next) => {
  console.log(err)
  if ((err.code = "22P02")) {
    res.status(400).send({ msg: "This is a bad request" });
  } else next(err);
};
