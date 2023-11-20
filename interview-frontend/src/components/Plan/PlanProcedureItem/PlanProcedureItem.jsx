import React, { useState, useEffect } from "react";
import ReactSelect from "react-select";
import { assignUsersToPlanProcedure } from "../../../api/api";
import { useParams } from "react-router-dom";

const PlanProcedureItem = ({ procedure, users, assignedUsers }) => {
  const [selectedUsers, setSelectedUsers] = useState(null);
  const { id } = useParams();
  useEffect(() => {
    let assignedUserOptions = [];
    if (assignedUsers) {
      assignedUsers.map((u) =>
        assignedUserOptions.push({ label: u.name, value: u.userId })
      );
      setSelectedUsers(assignedUserOptions);
    }
  }, []);
  const handleAssignUserToProcedure = async (e) => {
    setSelectedUsers(e);
    await assignUsersToPlanProcedure(
      Number(id),
      Number(procedure.procedureId),
      e ? e.map((x) => Number(x.value)) : []
    );
  };

  return (
    <div className="py-2">
      <div>{procedure.procedureTitle}</div>

      <ReactSelect
        className="mt-2"
        placeholder="Select User to Assign"
        isMulti={true}
        options={users}
        value={selectedUsers}
        onChange={(e) => handleAssignUserToProcedure(e)}
      />
    </div>
  );
};

export default PlanProcedureItem;
