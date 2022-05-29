<template>
    <Navigation/>
    <br>
    <div class="container">
        <FormDisplay :page="'Patient'" :fields="fields" :select="[]" @new-handler="addPatient" />
        <TableDisplay :listName="'Patients'" :columns="cols" :rows="patients" @modal-handler="openModal"
            @delete-handler="deletePatient" />

        <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Edit Patient Info</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form class="none">
                            <div v-for="(field, i) in fields" :key="i">
                                <h1>{{ field.Title }}</h1>
                                <input class="form-control" :type="field.Type" v-model="edit[field.Name]" required>
                                <br>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" @click="updatePatient">Save changes</button>
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

    const baseURL = 'http://localhost:3000/patients/';
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
            Title: "Sex",
            Name: "Sex",
            Type: "text"
        },
        {
            Title: "Address",
            Name: "Address",
            Type: "text"
        },
        {
            Title: "ZIP Code",
            Name: "ZIP",
            Type: "number"
        },
        {
            Title: "Phone",
            Name: "Phone",
            Type: "tel"
        },
        {
            Title: "Date of Birth",
            Name: "DoB",
            Type: "date"
        }
    ]);

    const cols = ref([
        "Patient ID",
        "Name",
        "Last Name",
        "Sex",
        "Address",
        "ZIP Code",
        "Phone",
        "Date of Birth",
        "Actions"
    ]);

    const patients = ref([]);

    const edit = reactive({
        Name: "",
        LastName: "",
        Sex: "",
        Address: "",
        ZIP: "",
        Phone: "",
        DoB: ""
    });

    const editID = ref('');

    function getAll() {
        $.ajax({
            type: 'GET',
            url: baseURL,
            success: (data, status) => {
                if (status === 'success')
                    patients.value = data;
            }
        });
    }

    function addPatient(item) {
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
        edit.Sex = item.Sex;
        edit.Address = item.Address;
        edit.ZIP = item.ZIP;
        edit.Phone = item.Phone;
        edit.DoB = item.DoB;
        modal.show();
    }

    function updatePatient() {
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

    function deletePatient(id) {
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