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
        }).then(data => data.json()).then(function(data) {
            return data
        }).catch(function(error) {
            return undefined;
        })
    },

    async nameExists(name) {
        return await fetch(`${apiUrl}?checkusername=${name}`, {
            method: 'POST',
        }).then(data => data.text()).then(function(data) {
            return data
        }).catch(function(error) {
            return undefined
        })
    }
}