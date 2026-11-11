import UserProfile from "@/components/common/UserProfile";

const getPost = async (id: string | number) => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  if (!res.ok) throw Error(`HTTP error: ${res.status}`);
  return res.json();
};

const getUser = async (id: string | number) => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  if (!res.ok) throw Error(`HTTP error: ${res.status}`);
  return res.json();
};

export default async function Page() {
  const [post, user] = await Promise.all([getPost(1), getUser(1)]);

  return (
    <>
      <h2>Hello, Dashboard</h2>
      <div>{post.title}</div>
      <UserProfile user={user} />
    </>
  );
}
