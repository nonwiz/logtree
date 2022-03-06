import useSWR from "swr";

export const fetcher = (url, data = undefined) =>
  fetch(
    String(url).indexOf("http") == -1 ? window.location.origin + url : url,
    {
      method: data ? "POST" : "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  ).then((r) => r.json());

export const fetcherHF = (url, data) =>
  fetch(url, {
    headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_UAT}` },
    method: "POST",
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const getFieldsValues = (event, fields) => {
  const data = {};
  fields.forEach((item) => {
    data[item] = event.target.querySelector(`[name=${item}]`).value;
  });
  return data;
};

// Below here is for SWR library
export const getFetcher = (...args) => fetch(...args).then((res) => res.json());

export const useCategories = () => {
  const { data, error } = useSWR("/api/logtree", getFetcher);
  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};
