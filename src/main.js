module.exports = (vemto) => {

    return {
        onInstall() {
            vemto.savePluginData({
                'tenantFieldName': 'user_id'
            })
        },

        copyableFiles() {
            return [{
                from: 'files/BelongsToTenant.php',
                to: 'app/Tenancy/BelongsToTenant.php',
            }]
        },

    }

}