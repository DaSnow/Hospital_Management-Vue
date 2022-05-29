<template>
    <div v-if="rows.length > 0">
        <br>
        <h1 style="text-align: center;">{{ listName }} List</h1>
        <br>
        <table class="table table-hover table-striped">
            <thead>
                <th v-for="col in columns">{{ col }}</th>
            </thead>
            <tbody>
                <tr v-for="(row) in rows">
                    <td v-for="(item) in row">{{ item }}</td>
                    <td>
                        <button type="button" class="btn btn-outline-info" @click="modalHandler(row)"><i
                                class='far fa-edit'></i></button>
                        <button type="button" class="btn btn-outline-danger" @click="deleteHandler(row._id)"><i
                                class='fas fa-trash'></i></button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
    import { ref, reactive } from 'vue';

    defineProps({
        columns: Array,
        rows: Array,
        listName: String
    });

    const emit = defineEmits([
        'modalHandler',
        'deleteHandler'
    ]);

    function modalHandler(row) {
        emit('modalHandler', row)
    }

    function deleteHandler(row) {
        emit('deleteHandler', row);
    }
</script>