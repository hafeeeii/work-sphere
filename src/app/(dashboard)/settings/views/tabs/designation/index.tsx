import { SharedTable } from "@/components/shared-table";
import React from "react";
import Form from "./form";
import { getDesignations } from "@/services/designation";
import { Designation } from "@/generated/prisma";

  type TableData = {
    columnData: {
      header: string;
      accessorKey: keyof Designation;
    }[];
    data: Designation[];
  };

const DesignationTab = async () => {
  const designations = await getDesignations()
  const tableData:TableData = {
    columnData: [
      { header: "Name", accessorKey: "name" },
      { header: "Total Employees", accessorKey: "totalEmployees" },
    ],
    data: designations,
  };

  return (
    <div className="flex flex-col gap-6">
       <Form />
      <SharedTable tableData={tableData} />
    </div>
  );
};

export default DesignationTab;
