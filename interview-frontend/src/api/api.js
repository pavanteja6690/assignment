const api_url = "http://localhost:10010";

export const startPlan = async () => {
  const url = `${api_url}/Plan`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  if (!response.ok) throw new Error("Failed to create plan");

  return await response.json();
};

export const addProcedureToPlan = async (planId, procedureId) => {
  const url = `${api_url}/Plan/AddProcedureToPlan`;
  var command = { planId: planId, procedureId: procedureId };
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });

  if (!response.ok) throw new Error("Failed to create plan");

  return true;
};

export const assignUsersToPlanProcedure = async (
  planId,
  procedureId,
  assignedUserID
) => {
  const url = `${api_url}/PlanProcedure/AssignUserToPlanProcedure`;
  var command = {
    planId: planId,
    procedureId: procedureId,
    assignedUser: assignedUserID,
  };
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });

  if (!response.ok) throw new Error("Failed to assign users to plan procedure");

  return true;
};

export const removeUserFromPlanProcedure = async (
  planId,
  procedureId,
  removedUserId
) => {
  const url = `${api_url}/PlanProcedure/RemoveUserFromPlanProcedure`;
  var command = {
    planId: planId,
    procedureId: procedureId,
    removedUser: removedUserId,
  };
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });

  if (!response.ok)
    throw new Error("Failed to remove user from plan procedure");

  return true;
};

export const getProcedures = async () => {
  const url = `${api_url}/Procedures`;
  const response = await fetch(url, {
    method: "GET",
  });

  if (!response.ok) throw new Error("Failed to get procedures");

  return await response.json();
};

export const getPlanProcedures = async (planId) => {
  const url = `${api_url}/PlanProcedure?$filter=planId eq ${planId}&$expand=assignedUsers,procedure`;
  const response = await fetch(url, {
    method: "GET",
  });

  if (!response.ok) throw new Error("Failed to get plan procedures");

  return await response.json();
};

export const getUsers = async () => {
  const url = `${api_url}/Users`;
  const response = await fetch(url, {
    method: "GET",
  });

  if (!response.ok) throw new Error("Failed to get users");

  return await response.json();
};
