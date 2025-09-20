module.exports = (query) => {
    let searchObject = {
        keyword: "",
        regex: ""
    }
        if (query.keyword) {
            searchObject.keyword = query.keyword;
            const regex = new RegExp(searchObject.keyword, "i"); // 'i' for case-insensitive search
            searchObject.regex = regex;   
        }
        return searchObject;
}