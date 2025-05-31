import { ref } from "vue";

export default function useFetchData() {
  const data = ref(null);
  const error = ref(null);
  const loading = ref(false);

  const fetchData = async (url, options = {}) => {
    const username = prompt("Please enter your username:");
    const password = prompt("Please enter your password:");
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(url, {
        method: options.method || "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + btoa(username + ":" + password),
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : null,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      data.value = await response.json();

      if (options.alertOnSuccess) {
        alert("Data fetched successfully!");
      }
    } catch (err) {
      error.value = err.message;

      if (options.alertOnError) {
        alert(`Error fetching data: ${err.message}`);
      }
    } finally {
      loading.value = false;
    }
  };

  return {
    data,
    error,
    loading,
    fetchData,
  };
}
