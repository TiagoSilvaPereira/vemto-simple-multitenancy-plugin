module.exports = (vemto) => {

    return {

        canInstall() {
            if(vemto.projectHasMultiTenancy()) {
                vemto.addBlockReason('You already have a multitenancy plugin installed')
                return false
            }
            
            return true
        },

        onInstall() {
            vemto.savePluginData({
                tenancyModels: {},
                tenantFieldName: 'user_id',
            })

            vemto.setMultiTenancyStrategy('login')
        },

        addEntityMarkers() {
            let models = vemto.getProjectModels()

            models.forEach(model => {
                if(!this.isModelOwnedByTenant(model)) return

                vemto.addEntityMarker(model, 'Belongs to Tenant', '#ECC94B')
            })
        },

        beforeCodeGenerationStart() {
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

            phpFile.addUseStatement('App\\Tenancy\\BelongsToTenant')
            phpFile.onClass(model.name).addTrait('BelongsToTenant')

            return phpFile.getCode()
        },

        isModelOwnedByTenant(model) {
            let data = vemto.getPluginData()

            return !! data.tenancyModels[model.id]
        },

        beforeCodeGenerationEnd() {
            let options = {
                formatAs: 'php'
            }

            vemto.log.message('[PLUGIN] Generating tenancy files...')
            
            vemto.renderTemplate('files/TenantScope.vemtl', 'app/Tenancy/TenantScope.php', options)
            vemto.renderTemplate('files/BelongsToTenant.vemtl', 'app/Tenancy/BelongsToTenant.php', options)
        }

    }

}