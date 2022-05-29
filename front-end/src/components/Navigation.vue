<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <RouterLink class="navbar-brand" to="/appointments">Navbar</RouterLink>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/appointments">Appointments</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/doctors">Doctors</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/patients">Patients</RouterLink>
                    </li>
                    <li class="nav-item" v-if="user.Admin">
                        <RouterLink class="nav-link" to="/users">Users</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/" @click="removeUser">Sign Out</RouterLink>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script setup>
    import { ref, reactive, onMounted } from 'vue';
    import { useRouter } from 'vue-router';

    const router = useRouter();

    const user = reactive({
        Username: "",
        Password: "",
        Admin: false
    });

    function checkUser() {
        if (JSON.parse(localStorage.getItem('User')) === null)
            return router.push('/');
        let u = JSON.parse(localStorage.getItem('User'));
        user.Username = u.Username;
        user.Password = u.Password;
        user.Admin = (u.Admin === 'true') ? true : false;
    }

    function removeUser() {
        localStorage.removeItem('User');
    }

    onMounted(() => {
        checkUser();
    });
</script>