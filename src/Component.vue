<template>
    <div class="w-full">
        <label class="block text-sm font-bold">Tenant Field Name</label>
        <small class="mb-2">The field that identifies the relationship of a Model with the Tenant (authenticated user)</small>
        <input class="input" type="text" v-model="tenantFieldName" @input="save">
        
        <div class="mt-5">
            <label class="block text-sm font-bold mb-2">Models owned by Tenant</label>
            
            <div class="mb-2" v-for="model in models" :key="model.id">
                <div>
                    <label class="inline-flex items-center">
                        <input type="checkbox" class="form-checkbox" v-model="tenancyModels[model.id]" @change="save">
                        <span class="ml-2">{{ model.name }}</span>
                    </label>
                </div>
                <small 
                    v-if="isModelOwnedByTenant(model) && !model.hasFieldByName(tenantFieldName)" 
                    class="text-red-500"
                >The model {{ model.name }} does not have a field <b>{{ tenantFieldName }}</b></small>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            models: [],
            pluginData: {},
            tenancyModels: {},
            tenantFieldName: '',
        }
    },

    created() {
        this.pluginData = window.vemtoApi.getPluginData()

        this.tenantFieldName = this.pluginData.tenantFieldName
        this.tenancyModels = this.pluginData.tenancyModels || {}
        this.models = window.vemtoApi.getProjectModels()
    },

    methods: {
        isModelOwnedByTenant(model) {
            return !! this.tenancyModels[model.id]
        },

        save: window.vemtoApi.debounce(function() {
            window.vemtoApi.savePluginData({
                tenantFieldName: this.tenantFieldName,
                tenancyModels: this.tenancyModels
            })
        }, 300)
    }
}
</script>