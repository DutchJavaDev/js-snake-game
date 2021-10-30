let apiUrl = 'http://localhost/debrand/api/'

export default {
    apiUrl,
    async postScore(score) {
        const data = new FormData();
        data.append('score', score)
        await fetch(apiUrl, {
            method: 'POST',
            body: data
        })
    },

    async getHighScore() {
        return await fetch(apiUrl, {
            method: 'GET',
        }).then(data => data.text()).then(function(data) {
            return data
        }).catch(function(error) {
            return "<h2>Failed to fecth</h2>";
        })
    }
}