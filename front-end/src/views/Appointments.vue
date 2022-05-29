<template>
    <Navigation />
    <br>
    <div class="container">
        <FormDisplay v-if="state" :page="'Appointment'" :fields="fields" :select="select"
            @new-handler="addAppointment" />
        <TableDisplay :listName="'Appointments'" :columns="cols" :rows="appointments" @modal-handler="openModal"
            @delete-handler="deleteAppointment" />

        <Alert v-if="doctors.length === 0" :list="'Doctors'" :link="'doctors'" />
        <Alert v-if="patients.length === 0" :list="'Patients'" :link="'patients'" />

        <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Edit Appointment Info</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form class="none">
                            <div v-for="(field, i) in fields" :key="i">
                                <h1>{{ field.Title }}</h1>
                                <input class="form-control" :type="field.Type" v-model="edit[field.Name]" required>
                                <br>
                            </div>
                            <div v-if="select.length > 0" v-for="(sel, i) in select" :key="i">
                                <h1>{{ sel.Title }}</h1>
                                <select class="form-control" v-model="edit[sel.Field]" required>
                                    <option v-for="(opt) in sel.Data" :value="opt">{{ opt }}</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" @click="updateAppointment">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, reactive, onMounted, onCreated, onUpdated } from 'vue';
    import Navigation from '@/components/Navigation.vue';
    import FormDisplay from '@/components/FormDisplay.vue';
    import TableDisplay from '@/components/TableDisplay.vue';
    import Alert from '@/components/AlertData.vue';

    const baseURL = 'http://localhost:3000/appointments/';
    var modal = '';
    const state = ref(true);

    const fields = ref([
        {
            Title: "Appointment Date",
            Name: "Date",
            Type: "date"
        },
        {
            Title: "Appointment Time",
            Name: "Time",
            Type: "time"
        }
    ]);

    const cols = ref([
        "Appointment ID",
        "Status",
        "Doctor",
        "Patient",
        "Location",
        "Date",
        "Time",
        "Actions"
    ]);

    const select = ref([
        {
            Title: "Appointment Status",
            Field: "Status",
            Data: [
                "Open",
                "Closed",
                "Delayed",
                "Missed",
                "Cancelled"
            ]
        },
        {
            Title: "Office Location",
            Field: "Location",
            Data: [
                "Naples",
                "Ft. Myers",
                "Miami"
            ]
        },
        {
            Title: "Doctors",
            Field: "Doctor",
            Data: []
        },
        {
            Title: "Patients",
            Field: "Patient",
            Data: []
        }
    ]);

    const appointments = ref([]);
    const patients = ref([]);
    const doctors = ref([]);

    const edit = reactive({
        Status: "",
        Location: "",
        Doctor: "",
        Patient: "",
        Date: "",
        Time: ""
    });

    const editID = ref('');

    function getDoctors() {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:3000/doctors/',
            success: (data, status) => {
                if (status === 'success') {
                    doctors.value = data
                    let newArr = []
                    data.filter((value) => {
                        newArr.push(value.LastName)
                    });
                    select.value[2].Data = newArr;
                }
            }
        });
    }

    function getPatients() {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:3000/patients/',
            success: (data, status) => {
                if (status === 'success') {
                    patients.value = data;
                    let newArr = []
                    data.filter((value) => {
                        newArr.push(value.LastName)
                    });
                    select.value[3].Data = newArr;
                }
            }
        });
    }

    function getAppointments() {
        $.ajax({
            type: 'GET',
            url: baseURL,
            success: (data, status) => {
                if (status === 'success') { }
                appointments.value = data;
            }
        });
    }

    function addAppointment(item) {
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
                    getAppointments();
                }
            }
        });
    }

    function openModal(item) {
        editID.value = item._id;
        edit.Status = item.Status;
        edit.Location = item.Location;
        edit.Doctor = item.Doctor;
        edit.Patient = item.Patient;
        edit.Date = item.Date;
        edit.Time = item.Time;
        modal.show();
    }

    function updateAppointment() {
        $.ajax({
            type: 'PUT',
            url: baseURL + `update/${editID.value}`,
            data: edit,
            success: (data, status) => {
                if (status === 'success') {
                    getAppointments();
                    modal.hide();
                }
            }
        });
    }

    function deleteAppointment(id) {
        $.ajax({
            type: 'DELETE',
            url: baseURL + `delete/${id}`,
            success: (data, status) => {
                if (status === 'success')
                    getAppointments();
            }
        });
    }

    onMounted(() => {
        getAppointments();
        getDoctors();
        getPatients();
        modal = new bootstrap.Modal($('#editModal'));
    });

    onUpdated(() => {
        if (doctors.value.length == 0 || patients.value.length == 0) {
            state.value = false;
        } else {
            state.value = true;
        }
    });
</script>