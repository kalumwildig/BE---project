exports.idExist = (rows, id) => {
  const results = rows[0];
  if (!results) {
    return Promise.reject({
      status: 404,
      msg: `No user found for user_id: ${id}`,
    });
  }
  return results;
};
