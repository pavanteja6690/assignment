import React, { useState, useEffect } from "react";
import ReactSelect from "react-select";
import {
  assignUsersToPlanProcedure,
  removeUserFromPlanProcedure,
} from "../../../api/api";
import { useParams } from "react-router-dom";

const PlanProcedureItem = ({ procedure, users, assignedUsers }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    let assignedUserOptions = [];
    if (assignedUsers) {
      assignedUsers.map((u) =>
        assignedUserOptions.push({ label: u.name, value: u.userId })
      );
      setSelectedUsers(assignedUserOptions);
    }
  }, [assignedUsers]);
  const handleAssignUserToProcedure = async (e) => {
    setSelectedUsers([...selectedUsers, e]);
    await assignUsersToPlanProcedure(
      Number(id),
      Number(procedure.procedureId),
      Number(e.value)
    );
  };

  const handleRemoveUserFromProcedure = async (e) => {
    let updatedUsersList = structuredClone(selectedUsers);
    console.log(updatedUsersList);
    updatedUsersList = updatedUsersList.filter(
      (user) => Number(user.value) !== Number(e.value)
    );
    setSelectedUsers(updatedUsersList);
    await removeUserFromPlanProcedure(
      Number(id),
      Number(procedure.procedureId),
      Number(e.value)
    );
  };

  const handleUserChange = async (users) => {
    const beforeSet = new Set(selectedUsers);
    const afterSet = new Set(users);

    const addedUsers = [...afterSet].filter((user) => !beforeSet.has(user));
    const removedUsers = [...beforeSet].filter((user) => !afterSet.has(user));

    if (addedUsers.length > 0) {
      handleAssignUserToProcedure(addedUsers[0]);
    } else {
      handleRemoveUserFromProcedure(removedUsers[0]);
    }
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
        onChange={(e) => handleUserChange(e)}
      />
    </div>
  );
};

export default PlanProcedureItem;
