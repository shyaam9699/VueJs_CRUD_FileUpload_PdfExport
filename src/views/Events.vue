<template>
  <v-container>
    <h1>Event List</h1>
    <div style="height: 100vh">
      <!-- user data table -->
      <v-data-table
      v-model="selectedEvents"
        :headers="headers"
        :search="search"
        :items="events"
        style="width: 100%"
        :items-per-page="5"
        :single-select="singleSelect"
        item-key="Id"
        show-select
        class="elevation-1 card-border"
      >
        <template v-slot:top>

          <v-switch
        v-model="singleSelect"
        label="Single select"
        class="pa-3"
      ></v-switch>


          <v-btn
            color="#05486a"
            class="mx-4 mt-2"
            v-bind="attrs"
            dark
            v-on="on"
            style="float: right"
            @click="createEventPopUp = true"
          >
            Create
          </v-btn>
          <v-btn
            color="success"
            class="mx-4 mt-2"
            v-bind="attrs"
            dark
            v-on="on"
            style="float: right"
            @click="generateReport()"
          >
            Export as Pdf
          </v-btn>
           <v-btn
            color="error"
            class="mt-2"
            v-if="selectedEvents.length>0"
            dark
            style="float: right"
            @click="deleteEventPopUp=true"
          >
            Delete Multiple Events
          </v-btn>
          <v-text-field
            v-model="search"
            label="Search"
            class="mx-4 search-fieald"
          ></v-text-field>
        </template>
        <template v-slot:[`item.actions`]="{item}">
          <v-icon small class="mr-2" @click="openEditEventPopUp(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="openDeleteEventPopup(item.Id)" class="mr-2">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
      
    </div>
    <!-- Create Event Popup -->
    <v-dialog
      transition="dialog-bottom-transition"
      persistent
      v-model="createEventPopUp"
      width="1000"
    >
     <v-card elevation="10">
        <v-toolbar color="#05486a" dark><v-toolbar-title>{{eventForm.id?'Event':'Create Event'}}</v-toolbar-title>
         <v-btn
          style="background-color:transparent"
          small
          absolute
          top
          right
          @click="closeDialog"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        </v-toolbar>
        <v-card-text class="mt-5">
          <form class="mx-5">
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="eventForm.name"
                  label="Event Name"
                  outlined
                  dense
                   @input="$v.eventForm.name.$touch()"
              @blur="$v.eventForm.name.$touch()"
              :error-messages="
                requiredError('name', 'Name', $v.eventForm)
              "
                >
                </v-text-field>
              </v-col>
              <v-col cols="4">
                 <!-- <input type="file" @change="onFileChange" /> -->
                <v-file-input
                  accept="image/*"
                  dense
                  label="Upload Banner"
                  @change="onFileChange"
                  prepend-inner-icon="mdi-paperclip"
                  v-model="eventForm.fileName"
                  outlined
                  prepend-icon=""
                ></v-file-input>
              </v-col>
              <v-col cols="2" v-if="!selectedFile&&eventForm.id&&eventForm.filePath">
                <a :href="eventForm.filePath" target="_blank" >View</a>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                        type="date"
                        outlined
                        label="Start Date"
                        v-model="eventForm.startDate"
                        required
                       @input="$v.eventForm.startDate.$touch()"
                      @blur="$v.eventForm.startDate.$touch()"
                        :error-messages="
                requiredError('startDate', 'Start Date', $v.eventForm)
              "
                      >
                      </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                        type="date"
                        outlined
                        label="End Date"
                        v-model="eventForm.endDate"
                        required
                       @input="$v.eventForm.endDate.$touch()"
                      @blur="$v.eventForm.endDate.$touch()"
                        :error-messages="
                requiredError('endDate', 'End Date', $v.eventForm)
              "
                      >
                      </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="eventForm.location"
                  label="Location"
                  outlined
                  dense
                  rows="3"
                  @input="$v.eventForm.location.$touch()"
              @blur="$v.eventForm.location.$touch()"
              :error-messages="
                requiredError('location', 'Location', $v.eventForm)
              "
                >
                </v-textarea>
              </v-col>
            </v-row>
          </form>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn
          v-if="!eventForm.id"
            color="#05486a"
            class="text-white mb-5"
            @click="addEvent"
            >Create</v-btn
          >
          <v-btn
          v-else
            color="#05486a"
            class="text-white mb-5"
            @click="updateEvent"
            >Update</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Delete Event PopUp -->
    <v-dialog
      transition="dialog-bottom-transition"
      v-model="deleteEventPopUp"
      persistent
      width="40%"
    >
      <v-card>
        <v-toolbar color="#05486a" dark>Delete Event</v-toolbar>
        <v-card-text class="my-5">
          <h6>Are you sure, do you want to delete the selected event?</h6>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn
            color="red"
            class="text-white"
            @click="closeDeleteDialog"
            >No</v-btn
          >
          <v-btn
            color="#05486a"
            class="text-white"
            @click="selectedEvents.length==0?deleteEvent():deleteMultipleEvents()"
            >Yes</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
      <!-- Export Pdf -->

     <vue-html2pdf
      :show-layout="false"
      :float-layout="true"
      :enable-download="true"
      :preview-modal="false"
      :paginate-elements-by-height="1100"
      :filename="frozentitle"
      :pdf-quality="2"
      :manual-pagination="false"
      pdf-format="a3"
      pdf-orientation="landscape"
      pdf-content-width="auto"
      @progress="onProgress($event)"
      @hasStartedGeneration="hasStartedGeneration()"
      @hasGenerated="hasGenerated($event)"
      ref="html2Pdf"
      
    >
      <section class="container-fluid" slot="pdf-content">
        <table class="table table-bordered"  CELLSPACING='0' cellpadding='2'>
          <thead>
            <tr>
              <th style="color: #134785">Event Name</th>
              <th style="color: #134785">Start Date</th>
              <th style="color: #134785">End Date</th>
              <th style="color: #134785">Location</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in events" :key="item">
              <!-- {{key}}:{{value}} -->
              <td>{{ item.Name }}</td>
              <td>{{ item.StartDate }}</td>
              <td>{{ item.EndDate }}</td>
              <td>{{ item.Location }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </vue-html2pdf>
  </v-container>

  
</template>
<script>
import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";
import { mapActions } from "vuex";
import {imageUrl} from '../utils/config'
import VueHtml2pdf from "vue-html2pdf";

export default {
  components: {
    VueHtml2pdf,
  },
  data() {
    const defaultForm = Object.freeze({
      id:null,
      name: "",
      location: "",
      startDate: null,
      endDate: null,
      fileName: null,
      filePath:null
    });
    return {
      search: "",
      selectedFile:"",
      selectedId:"",
      singleSelect: false,
      selectedEvents: [],
      createEventPopUp: false,
      editEventPopUp: false,
      viewEventPopUp: false,
      deleteEventPopUp: false,
      eventForm: Object.assign({}, defaultForm),
      fromDateMenu: false,
      toDateMenu: false,
      headers: [
        { text: "Event Name", value: "Name" },
        { text: "Start Date", value: "StartDate" },
        { text: "End Date", value: "EndDate" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      events: [],
    };
  },
   mixins: [validationMixin],
  validations() {
    return {
      eventForm: {
        name: { required },
      location: { required,minLength: minLength(5) },
      startDate: { required },
      endDate: { required }
      },
    };
  },
  methods: {
    ...mapActions(['OpenSnackbar','getAllEvents','getEventsById','addEvents','updateEvents','deleteEvents','uploadDocuments','deleteMultiEvents']),
    onFileChange(e) {
      debugger;
      const selectedFile = e; // accessing file
      this.selectedFile = selectedFile;
    },
    onUploadFile() {
      const formData = new FormData();
      formData.append("file", this.selectedFile); // appending file// sending file to the backend
    },

    getEventsList(){
      this.getAllEvents().then((res)=>{
        if(res.responseStatus) this.events=res.data;
        else this.displaySnackbar("Error", res.responseStatus, "error");
      },
        (err) => {
          this.displaySnackbar("Error", err, "error");
        });
    },

    addEvent(){
      debugger;
      //check for the validation
      if(!this.$v.eventForm.$invalid){
        //creating the event
      this.addEvents(this.$v.eventForm.$model).then((res)=>{
        if(res.responseStatus){
        //check if selectedFile,and upload the file to the server by calling upload documents api
          if(this.selectedFile){
           const formData = new FormData();
      formData.append("file", this.selectedFile);
      let payload = {
        id:res.id,
        file:formData
      }
      debugger;
      this.uploadDocuments(payload).then((res)=>{
        //on success
        if(res.responseStatus) this.displaySnackbar("Success", res.responseMessage, "success");
        //on fail
        else this.displaySnackbar("Error", res.responseStatus, "error");
      },(err) => {
        //on err
          this.displaySnackbar("Error", err, "error");
        })
          }
          //display the success Message on create api response
          this.displaySnackbar("Success", res.responseMessage, "success");
          setTimeout(()=>{location.reload();},1000);
        }
        // display the error message on create api fail
        else this.displaySnackbar("Error", res.responseStatus, "error");
      },
        (err) => {
          this.displaySnackbar("Error", err, "error");
        });
      }else{
        // if the fields are not valid show textbox errors
        this.$v.eventForm.$touch();
      }
    },

    updateEvent(){
      debugger;
      //check for the validation
      if(!this.$v.eventForm.$invalid){
        //updating the event
      this.updateEvents(this.$v.eventForm.$model).then((res)=>{
        debugger;
        if(res.responseStatus){
          //check if selectedFile,and upload the file to the server by calling upload documents api
          if(this.selectedFile){
           const formData = new FormData();
      formData.append("file", this.selectedFile);
      let payload = {
        id:res.id,
        file:formData
      }
      debugger;
      this.uploadDocuments(payload).then((res)=>{
        //on success
        if(res.responseStatus) this.displaySnackbar("Success", res.responseMessage, "success");
        //on fail
        else this.displaySnackbar("Error", res.responseStatus, "error");
      },(err) => {
        //on err
          this.displaySnackbar("Error", err, "error");
        })
          }
            //display the success Message on update api response
          this.displaySnackbar("Success", res.responseMessage, "success");
          setTimeout(()=>{location.reload();},1000);
        }
        // display the error message on update api fail
        else this.displaySnackbar("Error", res.responseStatus, "error");
      },
        (err) => {
          this.displaySnackbar("Error", err, "error");
        });
      }else{
        // if the fields are not valid show textbox errors
        this.$v.eventForm.$touch();
      }
    },

    deleteEvent(){
      debugger;
      //call delete api
      this.deleteEvents(this.selectedId).then(res=>{
        debugger;
        //on success
        if(res.responseStatus){
          this.displaySnackbar("Success", res.responseMessage, "success");
          setTimeout(()=>{location.reload();},1000);
        }
        //on fail
        else this.displaySnackbar("Error", res.responseStatus, "error");
      },(err) => {
        //on err
          this.displaySnackbar("Error", err, "error");
        })
    },

     deleteMultipleEvents(){
      debugger;

     let selectedEventsIds= this.selectedEvents.map(e =>(e.Id));

     let request={
       selectedEvents:selectedEventsIds
     }
     debugger;
      //call delete api
      this.deleteMultiEvents(request).then(res=>{
        debugger;
        //on success
        if(res.responseStatus){
          this.displaySnackbar("Success", res.responseMessage, "success");
          setTimeout(()=>{location.reload();},1000);
        }
        //on fail
        else this.displaySnackbar("Error", res.responseStatus, "error");
      },(err) => {
        //on err
          this.displaySnackbar("Error", err, "error");
        })
    },

    openEditEventPopUp(item){
      debugger;
      this.eventForm.id=item.Id;
      this.eventForm.name=item.Name;
      this.eventForm.startDate=item.StartDate;
      this.eventForm.endDate=item.EndDate;
      this.eventForm.location=item.Location;
      //this.selectedFile=item.FilePath;
      this.eventForm.fileName=item.FilePath;
      if(item.FilePath) this.eventForm.filePath=`${imageUrl}${item.FilePath}`;
      this.createEventPopUp=true;
    },
    
    closeDialog(){
      this.eventForm.id=null;
      this.eventForm.name='';
      this.eventForm.startDate='';
      this.eventForm.endDate='';
      this.eventForm.location='';
      this.selectedFile='';
      this.eventForm.fileName=null;
      this.eventForm.filePath=null;
      this.createEventPopUp=false;
    },

     openDeleteEventPopup(id){
       debugger;
      this.selectedId=id;
      this.deleteEventPopUp = true;
    },

    closeDeleteDialog(){
      this.selectedId='';
      this.deleteEventPopUp = false;
    },

    generateReport() {
      this.$refs.html2Pdf.generatePdf();
    },
     requiredError(fieldName, label, form) {
       const errors = [];
      const field = form[fieldName];
      if (field && !field.$dirty) return errors;
      if (field.required == true || field.required == false) {
        field && !field.required && errors.push(label + " is required");
        if (errors.length > 1) {
          return errors;
        }
      }

      if (field.minLength == true || field.minLength == false) {
        field &&
          !field.minLength &&
          field.required &&
          errors.push(
            `${label} should be minimum ${field.$params.minLength.min} characters`
          );
        if (errors.length > 1) {
          return errors;
        }
      }

      if (
        (field.maxLength == true || field.maxLength == false) &&
        (field.minLength == true || field.minLength == false)
      ) {
        field &&
          !field.maxLength &&
          field.required &&
          field.minLength &&
          errors.push(
            `${label} should be maximum ${field.$params.maxLength.max} characters`
          );
        if (errors.length > 1) {
          return errors;
        }
      }

      if (field.maxLength == true || field.maxLength == false) {
        field &&
          !field.maxLength &&
          field.required &&
          errors.push(
            `${label} should be maximum ${field.$params.maxLength.max} characters`
          );
        if (errors.length > 1) {
          return errors;
        }
      }
      return errors;
    },
     displaySnackbar(type, msg, color) {
      this.OpenSnackbar({
        message: { type: type, msg: msg },
        color: color,
        timeout: 5000,
      });
    },
  },
  mounted(){
    this.getEventsList();
  },
  computed: {
    frozentitle() {
      const title = "Report";
      return title.concat(Date.now());
    },
  
    fromDateDisp() {
      return this.eventForm.startDate;
    },
    toDateDisp() {
      return this.eventForm.endDate;
    },
    fromEditDateDisp() {
      return this.editForm.fromDateVal;
    },
    toEditDateDisp() {
      return this.editForm.toDateVal;
    },
  },
};
</script>
<style lang="scss">
.link:hover {
  color: #3e7bfa !important;
}
</style>
