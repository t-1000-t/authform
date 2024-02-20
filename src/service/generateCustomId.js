const generateCustomId = () => {
    let id = '';
    const characters = 'abcdef0123456789';
    const length = 20; // Adjust the length as needed

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        id += characters[randomIndex];
    }

    return id;
}

module.exports = generateCustomId
