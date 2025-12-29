document.getElementById("year").textContent = new Date().getFullYear();

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("upload-form");
  const fileInput = document.getElementById("file-upload");
  const result = document.getElementById("result");
  const loader = document.getElementById("loader");
  const retryButton = document.getElementById("retry-button");

  // Create gallery container if it doesn't exist
  let galleryContainer = document.getElementById("gallery-container");
  if (!galleryContainer) {
    galleryContainer = document.createElement("div");
    galleryContainer.id = "gallery-container";
    galleryContainer.className =
      "mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mx-auto";
    result.parentNode.insertBefore(galleryContainer, retryButton);
  }

  // Retry button event listener
  if (retryButton) {
    retryButton.addEventListener("click", () => {
      resetUI();
      form.classList.remove("hidden"); // Show form again
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const file = fileInput.files[0];
    if (!file) return;

    resetUI();

    // Show loader
    form.classList.add("hidden");
    loader.classList.remove("hidden");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      loader.classList.add("hidden");
      result.classList.remove("hidden");

      if (response.ok) {
        if (data.is_animal) {
          // If it is an animal
          result.textContent = `Animal recognized: ${data.name} (Score: ${data.score}%)`;
          result.className =
            "text-teal-300 text-2xl transition-all duration-700 text-center mb-4";

          // Generate gallery of images
          if (data.images && data.images.length > 0) {
            data.images.forEach((imgUrl) => {
              const imgElement = document.createElement("img");
              imgElement.src = imgUrl;
              imgElement.className =
                "w-32 h-32 object-cover rounded-md shadow-md hover:scale-105 transition-transform duration-300";
              galleryContainer.appendChild(imgElement);
            });
            const galleryTitle = document.createElement("p");
            galleryTitle.textContent = "Similar images from the web:";
            galleryContainer.className =
              "mt-6 flex flex-wrap justify-center gap-3 w-full max-w-4xl mx-auto";
            galleryContainer.prepend(galleryTitle);
          }
        } else {
          // If it is NOT an animal
          result.textContent = data.message;
          result.className =
            "text-yellow-400 text-xl font-bold transition-all duration-700 text-center";
        }
      } else {
        throw new Error(data.error || "Server error");
      }

      // Try again button
      if (retryButton) retryButton.classList.remove("hidden");
    } catch (error) {
      console.error("Error:", error);
      loader.classList.add("hidden");
      result.textContent = "An error occurred. Please try again.";
      result.className = "text-red-500 text-lg font-bold text-center";
      result.classList.remove("hidden");
      if (retryButton) retryButton.classList.remove("hidden");
    }
  });

  function resetUI() {
    result.classList.add("hidden");
    result.textContent = "";
    if (retryButton) retryButton.classList.add("hidden");
    galleryContainer.innerHTML = ""; // Clear previous gallery images
  }
});
