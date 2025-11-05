// Auto-update footer year
document.getElementById("year").textContent = new Date().getFullYear();

const form = document.getElementById("upload-form");
const uploadContainer = document.getElementById("upload-container");
const loader = document.getElementById("loader");
const result = document.getElementById("result");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Hide form and show loader with animations
  uploadContainer.style.opacity = "0";
  setTimeout(() => {
    uploadContainer.classList.add("hidden");
    loader.classList.remove("hidden");
    loader.classList.add("flex");
  }, 300); // Time for fade-out animation

  // Send form data to Flask server
  const formData = new FormData(form);
  let analysisResult = "";
  let errorOccurred = false;

  try {
    const response = await fetch("/predict", {
      method: "POST",
      body: formData, // FormData sets the correct headers automatically
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    // { "prediction": "Golden Retriever" }
    const data = await response.json();

    // Display the prediction result
    analysisResult = `I think this is a ${data.prediction}!`;
  } catch (error) {
    console.error("Error during analysis:", error);
    analysisResult = "Analysis failed. Please try again.";
    errorOccurred = true;
  }

  // Hide loader and show result with animations
  loader.classList.add("opacity-0");
  setTimeout(() => {
    loader.classList.add("hidden");

    // Display result
    result.textContent = analysisResult;

    if (errorOccurred) {
      result.classList.remove("text-teal-400");
      result.classList.add("text-red-500"); // Change text color to red on error
    }

    result.classList.remove("hidden");

    // Animate result appearance
    setTimeout(() => {
      result.classList.remove("opacity-0", "translate-y-4");
      result.classList.add("opacity-100", "translate-y-0");
    }, 50);
  }, 300); // Time for fade-out animation of loader
});
