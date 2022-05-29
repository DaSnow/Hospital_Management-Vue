<template>
    <Navigation />
    <br>
    <div class="container">
        <form class="bg-light" @submit.prevent="addUser">
            <div v-for="(field, i) in fields" :key="i">
                <h1>{{ field.Title }}</h1>
                <input class="form-control" :type="field.Type" v-model="user[field.Name]" required>
                <br>
            </div>
            <h1>Admin Status</h1>
            <input type="radio" name="admin" id="adtru" value="true" v-model="user.Admin">
            <label for="adtru" style="margin-right: 5%;">True</label>
            <input type="radio" name="admin" id="adfalse" value="false" v-model="user.Admin">
            <label for="adfalse">False</label>
            <hr>
            <div style="text-align: end;">
                <button class="btn btn-primary">Add User</button>
            </div>
        </form>
        <TableDisplay :listName="'Users'" :columns="cols" :rows="users" @modal-handler="openModal"
            @delete-handler="deleteUser" />

        <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Edit User Info</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form class="none">
                            <div v-for="(field, i) in fields" :key="i">
                                <h1>{{ field.Title }}</h1>
                                <input class="form-control" :type="field.Type" v-model="edit[field.Name]" required>
                                <br>
                            </div>
                            <h1>Admin Status</h1>
                            <input type="radio" name="admin" id="adtru1" value="true" v-model="edit.Admin">
                            <label for="adtru1" style="margin-right: 5%;">True</label>
                            <input type="radio" name="admin" id="adfalse1" value="false" v-model="edit.Admin">
                            <label for="adfalse1">False</label>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" @click="updateUser">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, reactive, onMounted, onCreated } from 'vue';
    import { useRouter } from 'vue-router';
    import Navigation from '@/components/Navigation.vue';
    import TableDisplay from '@/components/TableDisplay.vue';

    const baseURL = 'http://localhost:3000/users/';
    const router = useRouter();
    var modal = '';

    const fields = ref([
        {
            Title: "User Name",
            Name: "Username",
            Type: "text"
        },
        {
            Title: "Password",
            Name: "Password",
            Type: "password"
        }
    ]);

    const cols = ref([
        "User ID",
        "User Name",
        "Password",
        "Admin",
        "Actions"
    ]);

    const users = ref([]);

    const user = reactive({
        Username: "",
        Password: "",
        Admin: false
    });

    const edit = reactive({
        Username: "",
        Password: "",
        Admin: false
    });

    const editID = ref('');

    function getUsers() {
        $.ajax({
            type: 'GET',
            url: baseURL,
            success: (data, status) => {
                if (status === 'success') { }
                users.value = data;
            }
        });
    }

    function addUser() {
        if (!users.value.some(list => {
            return list.Username == user.Username
        })) {
            $.ajax({
                type: 'POST',
                url: baseURL + 'add',
                data: user,
                success: (data, status) => {
                    if (status === 'success') {
                        swal({
                            title: "Well Done!",
                            icon: 'success'
                        });
                        getUsers();
                    }
                }
            });
        } else {
            swal({
                title: "STOP",
                text: "Cannot Repeat Username",
                icon: 'error'
            });
        }
    }

    function openModal(item) {
        editID.value = item._id;
        edit.Username = item.Username;
        edit.Password = item.Password;
        edit.Admin = item.Admin;
        modal.show();
    }

    function updateUser() {
        if (!users.value.some(list => {
            return list.Username == edit.Username
        })) {
            $.ajax({
                type: 'PUT',
                url: baseURL + `update/${editID.value}`,
                data: edit,
                success: (data, status) => {
                    if (status === 'success') {
                        getUsers();
                        modal.hide();
                    }
                }
            });
        } else {
            swal({
                title: "STOP",
                text: "Cannot Repeat Username",
                icon: 'error'
            });
        }
    }

    function deleteUser(id) {
        $.ajax({
            type: 'DELETE',
            url: baseURL + `delete/${id}`,
            success: (data, status) => {
                if (status === 'success')
                    getUsers();
            }
        });
    }

    onMounted(() => {
        let currentUser = JSON.parse(localStorage.getItem('User'));
        if (currentUser === null)
            return router.push('/');
        if (!currentUser.Admin)
            return router.push('/appointments');
        getUsers();
        modal = new bootstrap.Modal($('#editModal'));
    });
</script>

<style scoped>
    form {
        border: solid 1px black;
        border-radius: 15px;
        padding: 5%;
    }
</style>