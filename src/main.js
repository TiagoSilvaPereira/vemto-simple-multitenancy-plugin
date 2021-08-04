module.exports = (vemto) => {

    return {
        onInstall() {
            vemto.savePluginData({
                tenancyModels: {},
                tenantFieldName: 'user_id',
            })
        },

        copyableFiles() {
            return [{
                from: 'files/BelongsToTenant.php',
                to: 'app/Tenancy/BelongsToTenant.php',
            }]
        },

        beforeCodeGeneration() {
            let data = vemto.getPluginData(),
                models = vemto.getProjectModels()

            models.forEach(model => {
                let isOwnedByTenant = !! data.tenancyModels[model.id]
                
                if(isOwnedByTenant && !model.hasFieldByName(data.tenantFieldName)) {
                    vemto.log.error(`[TENANCY ERROR] Model ${model.name} does not have a field ${data.tenantFieldName}`)
                    vemto.generator.abort()
                }
            })
        }

    }

}