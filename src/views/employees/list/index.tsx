import { SharedTable } from "@/components/shared-table";
import React from "react";
import Form from "./form";

const tableData = {
  columnData: [
    { header: "ID", accessorKey: "id" },
    { header: "Name", accessorKey: "name" },
    { header: "Department", accessorKey: "department" },
    { header: "Email", accessorKey: "email" },
    { header: "Phone", accessorKey: "phone" },
    { header: "Team Size", accessorKey: "teamSize" },
    { header: "Status", accessorKey: "status" },
  ],
  data: [
    {
      id: "12",
      name: "Hafis",
      department: "Engineering",
      email: "hafis@gmail.com",
      phone: "123455677",
      teamSize: 5,
      status: "Active",
    },
  ],
};

const EmployeesList = () => {
  return (
    <div className="flex flex-col gap-4">
       <Form />
      <SharedTable tableData={tableData} />
    </div>
  );
};

export default EmployeesList;
