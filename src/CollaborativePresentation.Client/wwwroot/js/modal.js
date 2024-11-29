let modals = {};

window.openModal = (modalId) => {
  const modalElement = document.getElementById(modalId);
  if (!modalElement) {
    console.error(`Modal with ID "${modalId}" not found`);
    return;
  }

  if (!modals[modalId]) {
    modals[modalId] = new bootstrap.Modal(modalElement);
  }

  console.log(`Opening modal "${modalId}"...`);
  modals[modalId].show();
};

window.closeModal = (modalId) => {
  const modal = modals[modalId];
  if (!modal) {
    console.error(`Modal with ID "${modalId}" not initialized`);
    return;
  }

  console.log(`Closing modal "${modalId}"...`);
  modal.hide();
};
