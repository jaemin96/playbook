const getData = async (id: string | number) => {
  if (!id) throw Error("Please, Check pressed ID");

  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  if (!res.ok) throw Error(`HTTP error: ${res.status}`);

  const data = await res.json();

  if (!data) throw Error("No data");

  return data;
};

export default async function Page() {
  const data = await getData(1);

  return (
    <>
      <h2>Hello, Dashboard</h2>
      <div>{data.title}</div>
    </>
  );
}
