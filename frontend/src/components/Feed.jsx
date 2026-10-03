import { useSelector } from "react-redux";

const Feed = () => {
  const user = useSelector((store) => store.user);

  return (
    <div className="min-h-screen bg-base-200 flex justify-center items-center">
      <h1 className="font-display text-3xl font-extrabold">
        Hello, {user?.firstname}
      </h1>
    </div>
  );
};

export default Feed;