export const fetcher = (url, data = undefined) =>
  fetch(window.location.origin + url, {
    method: data ? "POST" : "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const fetcherHF = (url, data) =>
  fetch(url, {
    headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_UAT}` },
    method: "POST",
    body: JSON.stringify(data),
  }).then((r) => r.json());
