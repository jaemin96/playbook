type User = {
  id: number;
  name: string;
  email: string;
  username: string;
};

const UserProfile = ({ user }: { user: User }) => {
  return (
    <div>
      <h3>{user.name}</h3>
      <p>{user.username}</p>
      <p>{user.email}</p>
    </div>
  );
};

export default UserProfile;
