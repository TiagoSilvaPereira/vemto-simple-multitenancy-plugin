<template>
    <div class="w-full">
        <label class="block text-sm font-bold">Tenant Field Name</label>
        <small class="mb-2">The field that identifies the relationship of a Model with the Tenant (authenticated user)</small>
        <input class="input" type="text" v-model="tenantFieldName" @input="save">
        
        <div class="mt-5">
            <label class="block text-sm font-bold mb-2">Models owned by Tenant</label>
            
            <div class="mb-2" v-for="model in models" :key="model.id">
                <label class="inline-flex items-center">
                    <input type="checkbox" class="form-checkbox" v-model="tenancyModels[model.id]" @change="save">
                    <span class="ml-2">{{ model.name }}</span>
                </label>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            models: [],
            tenantFieldName: '',
            tenancyModels: {},
        }
    },

    created() {
        let data = window.vemtoApi.getPluginData()

        this.tenantFieldName = data.tenantFieldName
        this.tenancyModels = data.tenancyModels || {}
        this.models = window.vemtoApi.getProjectModels()
    },

    methods: {
        save: window.vemtoApi.debounce(function() {
            window.vemtoApi.savePluginData({
                tenantFieldName: this.tenantFieldName,
                tenancyModels: this.tenancyModels
            })
        }, 300) 
    }
}
</script>