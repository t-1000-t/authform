// const url = "https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fgmail.readonly&response_type=code&client_id=841756865865-m62ghatv150lcegredj8gofkstufl33i.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fdevelopers.google.com%2Foauthplayground";

// Function to extract query parameters from a URL
module.exports = (url, name) => {
  const params = new URL(url)
  return params.searchParams.get(name)
}
