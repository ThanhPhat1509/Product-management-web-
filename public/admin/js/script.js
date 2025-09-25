console.log("script.js Loaded");
//Button Status
const buttonStatus = document.querySelectorAll("[button-status]");
if (buttonStatus.length > 0) {
    let url = new URL(window.location.href);
    buttonStatus.forEach(button => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");
            if (status) {
                url.searchParams.set("status", status);
            }
            else {
                url.searchParams.delete("status");
            }
            window.location.href = url.href;
        });
    });
}
// End Button Status
// Form Search  
const formSearch = document.querySelector("#form-search");
if (formSearch) {
    let url = new URL(window.location.href);
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        const keyword = e.target.elements.keyword.value;


        if (keyword) {
            url.searchParams.set("keyword", keyword);
        } else {
            url.searchParams.delete("keyword");
        }

        window.location.href = url.href;
    });
}
// End Form Search
// Pagination
const paginationButtons = document.querySelectorAll("[button-pagination]");
if (paginationButtons.length > 0) {
    paginationButtons.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination");
            if (page) {
                let url = new URL(window.location.href);
                url.searchParams.set("page", page);
                window.location.href = url.href;
            }
        });
    });
}
//End Pagination 
// Checkbox multiple
let checkboxMultiple = document.querySelector("[checkbox-multiple]");
if (checkboxMultiple) {
    let inputCheckboxAll = document.querySelector("input[name='check-all']");
    let inputItems = checkboxMultiple.querySelectorAll("input[name='check-item']");

    // Khi click vào check-all
    inputCheckboxAll.addEventListener("click", () => {
        if (inputCheckboxAll.checked) {
            inputItems.forEach(input => input.checked = true);
        } else {
            inputItems.forEach(input => input.checked = false);
        }
    });

    // Khi click vào từng item
    inputItems.forEach(input => {
        input.addEventListener("click", () => {
            let totalCheckbox = inputItems.length;
            let totalChecked = checkboxMultiple.querySelectorAll("input[name='check-item']:checked").length;
            inputCheckboxAll.checked = (totalCheckbox === totalChecked);
        });
    });
}

//End Checkbox multiple
// Form Change Multiple
let formChangeMultiple = document.querySelector("#form-change-multiple");
if (formChangeMultiple) {
    formChangeMultiple.addEventListener("submit", (e) => {
        e.preventDefault();

        // lấy đúng table
        let checkboxMultiple = document.querySelector("[checkbox-multiple]");
        let inputChecked = checkboxMultiple.querySelectorAll("input[name='check-item']:checked");

        const typeChange = e.target.elements.type.value;
        if (typeChange === "delete-all") {
            const isConfirmed = confirm("Bạn có chắc chắn muốn xóa các mục đã chọn không?");
            if (!isConfirmed) {
                return;
            }
        }


        if (inputChecked.length > 0) {
            let ids = [];
            let inputIds = formChangeMultiple.querySelector("input[name='ids']");
            inputChecked.forEach(input => {
                const id = input.value;
                if (typeChange === "change-position") {
                    const position = input
                        .closest("tr")
                        .querySelector("input[name='position']")
                        .value;
                    ids.push(`${id}-${position}`);
                }
                else {
                    ids.push(input.value);
                }
            });
            inputIds.value = ids.join(",");
            formChangeMultiple.submit();
        } else {
            alert("Vui lòng chọn ít nhất một mục");
        }
    });
}

// End Form Change Multiple

// Show Alert
const showElert = document.querySelector("[show-alert]");
if (showElert) {
    const closeAlert = showElert.querySelector("[close-alert]");
    const time = parseInt(showElert.getAttribute("data-time"));
    setTimeout(() => {
        showElert.classList.add("alert-hidden");
    }, time);
    closeAlert.addEventListener("click", () => {
        showElert.classList.add("alert-hidden");
    });
}
// End Show Alert