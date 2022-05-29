<template>
    <div class="alert alert-danger">
        No {{ list }} detected, add some <RouterLink :to="'/' + link">here</RouterLink>
    </div>
</template>

<script setup>
    defineProps({
        list: String,
        link: String
    });
</script>