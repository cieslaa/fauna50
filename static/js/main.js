// Set current year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// DOM elements
const form = document.getElementById("upload-form");
const uploadContainer = document.getElementById("upload-container");
const loader = document.getElementById("loader");
const result = document.getElementById("result");
const retryButton = document.getElementById("retry-button");
const fileInput = document.getElementById("file-upload");
const uploadText = document.getElementById("upload-image");
const originalUploadText = uploadText.textContent;

// Listener for file input change
fileInput.addEventListener("change", () => {
  if (fileInput.files.length > 0) {
    const fileName = fileInput.files[0].name;
    uploadText.textContent = `${fileName}`;
  } else {
    uploadText.textContent = originalUploadText;
  }
});

// Main listener for form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  uploadContainer.style.opacity = "0";
  setTimeout(() => {
    uploadContainer.classList.add("hidden");
    loader.classList.remove("hidden");
    loader.classList.add("flex");
  }, 300);

  let analysisResult = "I think this is a Golden Retriever!"; // Dummy result
  let errorOccurred = false;

  // Fake 2-second delay to simulate analysis
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // TODO: Replace with actual API call

  if (errorOccurred) {
    retryButton.classList.remove("hidden");
    retryButton.classList.add("flex");
  } else {
    retryButton.classList.add("hidden");
    retryButton.classList.remove("flex");
  }

  // Hide loader and show result
  loader.classList.add("opacity-0");
  setTimeout(() => {
    loader.classList.add("hidden");
    result.textContent = analysisResult;

    if (errorOccurred) {
      result.classList.remove("text-teal-400");
      result.classList.add("text-red-500");
    } else {
      result.classList.remove("text-red-500");
      result.classList.add("text-teal-400");
    }

    result.classList.remove("hidden");

    setTimeout(() => {
      result.classList.remove("opacity-0", "translate-y-4");
      result.classList.add("opacity-100", "translate-y-0");
    }, 50);
  }, 300);
});

// Listener for retry button
retryButton.addEventListener("click", (e) => {
  e.preventDefault();

  result.classList.add("hidden");
  result.classList.remove("opacity-100", "translate-y-0");
  result.classList.add("opacity-0", "translate-y-4");

  retryButton.classList.add("hidden");
  retryButton.classList.remove("flex");

  form.reset();
  uploadText.textContent = originalUploadText;

  uploadContainer.classList.remove("hidden");
  setTimeout(() => {
    uploadContainer.style.opacity = "1";
  }, 50);
});
