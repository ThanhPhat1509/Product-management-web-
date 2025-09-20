module.exports = (query) =>{
            let filterStatus = [
            {
                name: "All",
                status: "",
                class :""
            },
            {
                name:"Work",
                status: "active",
                class :""
            },
            {
                name:" Not Work",
                status: "not active",
                class :""
            }
        ]
        if (query.status){
            const index = filterStatus.findIndex(item => item.status === query.status);
            filterStatus[index].class = "active";
        }
        else{
            const index = filterStatus.findIndex(item => item.status === "");
            filterStatus[index].class = "active";
        }
        return filterStatus;
}