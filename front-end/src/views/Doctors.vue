<template>
    <Navigation/>
    <br>
    <div class="container">
        <FormDisplay :page="'Doctor'" :fields="fields" :select="select" @new-handler="addDoctor" />
    <TableDisplay :listName="'Doctors'" :columns="cols" :rows="doctors" @modal-handler="openModal"
        @delete-handler="deleteDoctor" />

    <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Edit Doctor Info</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form class="none">
                        <h1>Name</h1>
                        <input class="form-control" type="text" v-model="edit.Name" required>
                        <p></p>
                        <h1>Last Name</h1>
                        <input class="form-control" type="text" v-model="edit.LastName" required>
                        <p></p>
                        <h1>Phone</h1>
                        <input class="form-control" type="tel" v-model="edit.Phone" required>
                        <p></p>
                        <div v-if="select.length > 0" v-for="(sel, i) in select" :key="i">
                            <h1>{{ sel.Field }}</h1>
                            <select class="form-control" v-model="edit[sel.Field]">
                                <option v-for="(opt) in sel.Data" :value="opt">{{ opt }}</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" @click="updateDoctor">Save changes</button>
                </div>
            </div>
        </div>
    </div>
    </div>
</template>

<script setup>
    import { ref, reactive, onMounted } from 'vue';
    import Navigation from '@/components/Navigation.vue';
    import FormDisplay from '@/components/FormDisplay.vue';
    import TableDisplay from '@/components/TableDisplay.vue'

    const baseURL = 'http://localhost:3000/doctors/';
    var modal = '';

    const fields = ref([
        {
            Title: "Name",
            Name: "Name",
            Type: "text"
        },
        {
            Title: "Last Name",
            Name: "LastName",
            Type: "text"
        },
        {
            Title: "Phone",
            Name: "Phone",
            Type: "tel"
        }
    ]);

    const select = ref([
        {
            Title: "Specialty",
            Field: "Specialty",
            Data: [
                "Pediatritian",
                "Dermatologist",
                "Surgeon"
            ]
        }
    ]);

    const cols = ref([
        "Doctor ID",
        "Name",
        "Last Name",
        "Phone",
        "Specialty",
        "Actions"
    ]);

    const doctors = ref([]);

    const edit = reactive({
        Name: "",
        LastName: "",
        Phone: "",
        Specialty: ""
    });

    const editID = ref('');

    function getAll() {
        $.ajax({
            type: 'GET',
            url: baseURL,
            success: (data, status) => {
                if (status === 'success')
                    doctors.value = data;
            }
        });
    }

    function addDoctor(item) {
        $.ajax({
            type: 'POST',
            url: baseURL + 'add',
            data: item,
            success: (data, status) => {
                if (status === 'success') {
                    swal({
                        title: "Well Done!",
                        icon: 'success'
                    });
                    getAll();
                }
            }
        });
    }

    function openModal(item) {
        editID.value = item._id;
        edit.Name = item.Name;
        edit.LastName = item.LastName;
        edit.Phone = item.Phone;
        edit.Specialty = item.Specialty;
        modal.show();
    }

    function updateDoctor() {
        $.ajax({
            type: 'PUT',
            url: baseURL + `update/${editID.value}`,
            data: edit,
            success: (data, status) => {
                if (status === 'success') {
                    getAll();
                    modal.hide();
                }
            }
        });
    }

    function deleteDoctor(id) {
        $.ajax({
            type: 'DELETE',
            url: baseURL + `delete/${id}`,
            success: (data, status) => {
                if (status === 'success')
                    getAll();
            }
        });
    }

    onMounted(() => {
        getAll();
        modal = new bootstrap.Modal($('#editModal'));
    });
</script>