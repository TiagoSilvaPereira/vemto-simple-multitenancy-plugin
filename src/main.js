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
                if(this.isModelOwnedByTenant(model) && !model.hasFieldByName(data.tenantFieldName)) {
                    vemto.log.error(`[TENANCY ERROR] Model ${model.name} does not have a field ${data.tenantFieldName}`)
                    vemto.generator.abort()
                }
            })
        },

        beforeRenderModel(template, content) {
            let data = template.getData(),
                model = data.model

            if(!this.isModelOwnedByTenant(model)) return content

            return this.addTenancyTraitToModel(content, model)
        },

        addTenancyTraitToModel(content, model) {
            let phpFile = vemto.parsePhp(content)

            phpFile.addUseStatement('App\\Tenancy\\OwnedByTenant')
            phpFile.onClass(model.name).addTrait('OwnedByTenant')

            return phpFile.getCode()
        },

        isModelOwnedByTenant(model) {
            let data = vemto.getPluginData()

            return !! data.tenancyModels[model.id]
        }

    }

}