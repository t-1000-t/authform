const getUser = (req, res) => {
  req.user.save()

  res.json({
    customeUserByIdFromToken: req.user.getPublicFields(),
  })
}

module.exports = getUser
