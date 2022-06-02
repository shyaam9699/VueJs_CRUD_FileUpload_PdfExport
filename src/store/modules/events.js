import httpClient from "../../utils/interceptor";

const state = {
};

const mutations = {
};

const getters = {
};

const actions = {
    getAllEvents(_context, payload) {
        debugger
        return httpClient.get("events/getAllEvents", payload).then(response => {
            return Promise.resolve(response.data);
        });
    },
    getEventsById(_context, payload) {
        return httpClient.post("/events/getEventsById/"+payload).then(response => {
            return Promise.resolve(response.data);
        });
    },

    addEvents(_context, payload) {
        debugger;
        return httpClient.post("/events/addEvents",payload).then(response => {
            return Promise.resolve(response.data);
        });
    },

    updateEvents(_context, payload) {
        return httpClient.patch("/events/updateEvents",payload).then(response => {
            return Promise.resolve(response.data);
        });
    },
    deleteEvents(_context, payload) {
        return httpClient.delete("/events/deleteEvents/"+payload).then(response => {
            return Promise.resolve(response.data);
        });
    },

    deleteMultiEvents(_context, payload) {
        return httpClient.post("/events/deleteMultipleEvents",payload).then(response => {
            return Promise.resolve(response.data);
        });
    },

    uploadDocuments(_context, payload) {
        debugger;
        return httpClient.post("/events/uploadDocuments/"+payload.id,payload.file).then(response => {
            return Promise.resolve(response.data);
        });
    },
};

export default {
    state,
    getters,
    actions,
    mutations
};