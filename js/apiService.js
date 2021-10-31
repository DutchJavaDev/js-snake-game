let apiUrl = 'http://localhost/debrand/api/'

export default {
    apiUrl,
    async postScore(name, score) {
        const data = new FormData()
        data.append('name', name)
        data.append('score', score)
        await fetch(apiUrl, {
            method: 'POST',
            body: data
        })
    },

    // redo this, kinda messy
    async getHighScore() {
        return await fetch(apiUrl, {
            method: 'GET',
        }).then(function(data) {
            console.log(data)
            if (data != 'empty')
                return data.json()
            else
                return data.text()
        }).then(function(data) {
            return data
        }).catch(function(error) {
            return undefined;
        })
    }
}