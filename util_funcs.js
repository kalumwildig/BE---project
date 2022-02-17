exports.doRowsExist = (rows, id) => {
    if (rows.length == 0) {
    return Promise.reject({
        status: 404,
        msg: `Article ID does not exist for: ${id}`,
      });}
    return rows[0]
}
