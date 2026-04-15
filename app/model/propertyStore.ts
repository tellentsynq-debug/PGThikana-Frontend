export const getProperty = () => {
  const data = localStorage.getItem("property");
  return data ? JSON.parse(data) : {};
};

export const setProperty = (data: any) => {
  localStorage.setItem("property", JSON.stringify(data));
};