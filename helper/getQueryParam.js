module.exports = (url, name) => {
  const params = new URL(url)
  return params.searchParams.get(name)
}
