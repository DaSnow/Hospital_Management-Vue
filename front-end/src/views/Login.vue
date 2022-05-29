<template>
    <form class="container" @submit.prevent="checkUser">
        <h1>Username</h1>
        <input class="form-control" type="text" v-model="user.Username" required>
        <br>
        <h1>Password</h1>
        <input class="form-control" type="password" v-model="user.Password" required>
        <br>
        <div>
            <button class="btn btn-primary">Login</button>
        </div>
    </form>
</template>

<script setup>
    import { ref, reactive, onMounted } from 'vue';
    import { useRouter } from 'vue-router';

    const router = useRouter();

    const baseURL = 'http://localhost:3000/users/';

    const users = ref([]);

    const user = reactive({
        Username: "",
        Password: ""
    });

    function getUsers() {
        $.ajax({
            type: 'GET',
            url: baseURL,
            success: (data, status) => {
                if (status === 'success') {
                    users.value = data;
                }
            }
        });
    }

    function checkUser() {
        if (users.value.some(list => {
            return list.Username == user.Username
        }) &&
            users.value.some(list => {
                return list.Password == user.Password
            })) {
            let arr = [];
            users.value.filter(val => {
                arr.push(val.Username);
            });
            let index = arr.indexOf(user.Username)
            localStorage.setItem('User', (JSON.stringify(users.value[index])));
            router.push('/appointments');
        }
    }

    function checkAdmin() {
        $.ajax({
            type: 'GET',
            url: baseURL + 'findAdmin',
            success: (data, status) => {
                if (data) {
                    addAdmin();
                }
            }
        });
    }

    function addAdmin() {
        $.ajax({
            type: 'POST',
            url: baseURL + 'addAdmin'
        });
    }

    onMounted(() => {
        getUsers();
        checkAdmin();
    });
</script>