import { SharedTable } from "@/components/shared-table";
import React from "react";
import Form from "./form";
import { getDepartments } from "@/services/department";
import { getDesignations } from "@/services/designation";
import { getWorkLocations } from "@/services/work-location";
import Typography from "@/components/ui/typography";

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

const EmployeeList = async () => {
  const departments = await getDepartments()
  const designations = await getDesignations()
  const workLocations = await getWorkLocations()
  return (
    <div className="flex flex-col gap-6">
      <Typography variant="h5">
        Employees
      </Typography>
       <Form 
         departments={departments} 
         designations={designations} 
         workLocations={workLocations}
       />
      <SharedTable tableData={tableData} />
    </div>
  );
};

export default EmployeeList;
