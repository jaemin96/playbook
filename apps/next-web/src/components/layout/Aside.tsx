import Link from "next/link";

const sideMenuHeading = "side menu title";

const Aside = () => {
  return (
    <aside>
      <span>{sideMenuHeading}</span>
      <ul>
        <li>
          <Link href={"/dashboard"}>Dashboard</Link>
        </li>
        <li>
          <Link href={"/dashboard/settings"}>Settings</Link>
        </li>
      </ul>
    </aside>
  );
};

export default Aside;
