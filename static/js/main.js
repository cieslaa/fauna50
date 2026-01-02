document.getElementById("year").textContent = new Date().getFullYear();

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("upload-form");
  const fileInput = document.getElementById("file-upload");
  const uploadText = document.getElementById("upload-image");

  const stageUpload = document.getElementById("stage-upload");
  const stageLoading = document.getElementById("stage-loading");
  const stageResult = document.getElementById("stage-result");

  const resultText = document.getElementById("result-text");
  const gallery = document.getElementById("gallery-container");
  const retryButton = document.getElementById("retry-button");

  function showStage(stage) {
    [stageUpload, stageLoading, stageResult].forEach((el) =>
      el.classList.add("hidden")
    );
    stage.classList.remove("hidden");
  }

  function resetUI() {
    showStage(stageUpload);
    gallery.innerHTML = "";
    resultText.textContent = "";
    fileInput.value = "";
    uploadText.textContent = "Upload an image of an animal";
    uploadText.className =
      "text-xl text-gray-400 font-satoshi group-hover:text-teal-400 transition-colors";
  }

  retryButton.addEventListener("click", resetUI);

  fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
      uploadText.textContent = fileInput.files[0].name;
      uploadText.classList.remove("text-gray-400");
      uploadText.classList.add("text-teal-400", "font-semibold");
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const file = fileInput.files[0];
    if (!file) return;

    showStage(stageLoading);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      showStage(stageResult);

      if (!response.ok) {
        throw new Error(data.error || "Server error");
      }

      if (data.is_animal) {
        resultText.textContent = `Animal recognized: ${data.name} (${data.score}%)`;

        data.images?.forEach((url) => {
          const img = document.createElement("img");
          img.src = url;
          img.className =
            "w-full aspect-square object-cover rounded-xl shadow-md hover:scale-[1.03] transition-transform";
          gallery.appendChild(img);
        });
      } else {
        resultText.textContent = data.message;
      }
    } catch (err) {
      showStage(stageResult);
      resultText.textContent = "Something went wrong. Please try again.";
      resultText.classList.remove("text-teal-400");
      resultText.classList.add("text-red-400");
    }
  });
});
