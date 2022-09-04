const openModal = () => {
  document.querySelector(".modal").classList.add("visible");
  document.querySelector(".modal-backdrop").classList.add("visible");
};

const closeModal = () => {
  document.querySelector(".modal").classList.remove("visible");
  resetExample();
  const container = document.querySelector(".modal-content-container");
  removeScrollLock(container);
};

const openAnotherModalTsScrollLock = () => {
  const container = document.querySelector(".modal-content-container-nested");
  document.querySelector(".modal-nested").classList.add("visible");
  useBodyScrollLock("another", container);
};

const resetExample = () => {
  document.querySelector(".modal-content-long").classList.add("visible");
  document.querySelector(".modal-backdrop").classList.remove("visible");

  document.querySelector(".modal-content-short").classList.remove("visible");
};

const useSmallContentExample = () => {
  document.querySelector(".modal-content-long").classList.remove("visible");
  document.querySelector(".modal-content-short").classList.add("visible");
};
