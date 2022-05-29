<template>
    <form class="bg-light" @submit.prevent="newHandler">
        <div v-for="(field, i) in fields" :key="i">
            <h1>{{ field.Title }}</h1>
            <input class="form-control" :type="field.Type" v-model="item[field.Name]" required>
            <br>
        </div>
        <div v-if="select.length > 0" v-for="(sel, i) in select" :key="i">
            <h1>{{ sel.Title }}</h1>
            <select class="form-control" v-model="item[sel.Field]" required>
                <option v-for="(opt) in sel.Data" :value="opt">{{ opt }}</option>
            </select>
            <br>
        </div>
        <hr>
        <div style="text-align: end;">
            <button class="btn btn-primary">Add {{ page }}</button>
        </div>
    </form>
</template>

<script setup>
    import { ref, reactive } from 'vue';

    defineProps({
        fields: Array,
        page: String,
        select: Array
    });

    const item = reactive({});

    const emit = defineEmits([
        'newHandler'
    ]);

    function newHandler() {
        emit('newHandler', item);
    }
</script>

<style scoped>
    form{
        border: solid 1px black;
        padding: 4%;
        border-radius: 15px;
    }
</style>