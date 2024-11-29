let modalElement;
let modal;

window.openModal = () => {
  modalElement = document.getElementById("nicknameModal");
  if (!modalElement) {
    console.error("Modal element not found");
    return;
  }

  if (!modal) {
    modal = new bootstrap.Modal(modalElement);
  }

  console.log("Opening modal...");
  modal.show();
};

window.closeModal = () => {
  if (!modal) {
    console.error("Modal is not initialized");
    return;
  }

  console.log("Closing modal...");
  modal.hide();
};
