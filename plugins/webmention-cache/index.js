module.exports = {
    // Restore a directory cached in previous builds.
    // Does not do anything if:
    //  - the directory already exists locally
    //  - the directory has not been cached yet
    async onPreBuild({ utils }) {
        await utils.cache.restore('./cache')
    },
    // Cache directory for future builds.
    // Does not do anything if:
    //  - the directory does not exist locally
    async onPostBuild({ utils }) {
        await utils.cache.save('./cache')
    }
}
