// Change status
document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll('[button-change-status]');
    if (buttons) {
        const path = document.querySelector('#change-status-form').getAttribute('data-path');

        buttons.forEach((button) => {
            button.addEventListener('click', async () => {
                const currentStatus = button.getAttribute("data-status");
                const id = button.getAttribute("data-id");

                try {
                    const response = await fetch(`${path}/${currentStatus}/${id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" }
                    });
                    const data = await response.json();

                    // cập nhật lại data-status
                    button.setAttribute("data-status", data.status);

                    // mapping status -> text tiếng Việt
                    const statusText = data.status === "active" ? "Còn hàng" : "Hết hàng";
                    button.textContent = statusText;

                    // đổi màu badge
                    if (data.status === "active") {
                        button.classList.remove("badge-danger");
                        button.classList.add("badge-success");
                    } else {
                        button.classList.remove("badge-success");
                        button.classList.add("badge-danger");
                    }

                } catch (err) {
                    console.error(err);
                }
            });
        });
    }
});
// End change status
// Delete product
document.addEventListener("DOMContentLoaded", function () {
    const deleteButtons = document.querySelectorAll('[button-delete]');
    if (deleteButtons.length > 0) {
        deleteButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const isConfirmed = confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?");
                if (isConfirmed) {

                    const id = button.getAttribute("data-id");
                }
            })
        })
    }

})
// End delete product