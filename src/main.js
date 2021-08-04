module.exports = (vemto) => {

    return {
        onInstall() {
            console.log('installed')

            vemto.savePluginData({
                'message': 'Hello World!! Hehehehehe'
            })
        },

        beforeCodeGeneration() {
            let data = vemto.getPluginData()

            vemto.log.info(data.message)
            vemto.log.warning(`That's awesome!!!`)
        },

        onUninstall() {
            console.log('plugin uninstalled')
        }
    }

}