import UserTableTemplate from "./AdminUserTableTemplate";
import { useState, useEffect } from "react";

function EditUsers() {
  const [users, setUsers] = useState([]);

  const UserFields = [
    "Username",
    "First Name",
    "Last Name",
    "Email",
    "Approval",
    "Admin",
  ];

  useEffect(() => {
    fetch("/api/getUsers")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
    console.log(users);
  }, []);

  return <UserTableTemplate fields={UserFields} data={users} />;
}

export default EditUsers;
