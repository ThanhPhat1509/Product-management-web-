// Change status
// Change status (submit form để server redirect and show flash)
document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll('[button-change-status]');
    const form = document.querySelector('#change-status-form');
    if (buttons.length > 0 && form) {
        const path = form.getAttribute('data-path'); // ex: /admin/products/change-status
        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                const currentStatus = button.getAttribute("data-status");
                const id = button.getAttribute("data-id");

                // set action và submit form => server nhận POST + method-override => xử lý PATCH và redirect
                form.action = `${path}/${currentStatus}/${id}?_method=PATCH`;
                form.submit();
            });
        });
    }
});

// End change status
// Delete product
document.addEventListener("DOMContentLoaded", function () {
    const deleteButtons = document.querySelectorAll('[button-delete]');
    if (deleteButtons.length > 0) {
        const formDeleteItem = document.querySelector('#delete-item-form');
        const path = formDeleteItem.getAttribute('data-path');
        deleteButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const isConfirmed = confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?");
                if (isConfirmed) {
                    const id = button.getAttribute("data-id");
                    const action = `${path}/${id}?_method=DELETE`;
                    formDeleteItem.action = action;
                    formDeleteItem.submit();
                }
            })
        })
    }
})
// End delete product