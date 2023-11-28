﻿using MediatR;
using Microsoft.EntityFrameworkCore;
using RL.Backend.Exceptions;
using RL.Backend.Models;
using RL.Data;
using RL.Data.DataModels;

namespace RL.Backend.Commands.Handlers.Plans;

public class RemoveUserFromPlanProcedureCommandHandler : IRequestHandler<RemoveUserFromPlanProcedureCommand, ApiResponse<Unit>>
{
    private readonly RLContext _context;

    public RemoveUserFromPlanProcedureCommandHandler(RLContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<Unit>> Handle(RemoveUserFromPlanProcedureCommand request, CancellationToken cancellationToken)
    {
        try
        {
            if (request.PlanId < 1)
                return ApiResponse<Unit>.Fail(new BadRequestException("Invalid PlanId"));
            if (request.ProcedureId < 1)
                return ApiResponse<Unit>.Fail(new BadRequestException("Invalid ProcedureId"));

            var planProcedure = await _context.PlanProcedures
                   .Include(p => p.AssignedUsers)
                   .FirstOrDefaultAsync(p => p.PlanId == request.PlanId && p.ProcedureId == request.ProcedureId);

            if (planProcedure is null)
                return ApiResponse<Unit>.Fail(new NotFoundException($"PlanId: {request.PlanId} and ProcedureId: {request.ProcedureId} not found"));

            var userId = request.RemovedUser;

            var existingUsers = planProcedure.AssignedUsers.Select(x => x.UserId);

            if (userId < 1)
                return ApiResponse<Unit>.Fail(new BadRequestException("Invalid User Id in the request"));

            if (!existingUsers.Any(x => x == userId))
            {
                return ApiResponse<Unit>.Fail(new BadRequestException($"This user is not assigned to PlanId: {request.PlanId} and ProcedureId: {request.ProcedureId}"));
            }

            var user = await _context.Users
                    .FirstOrDefaultAsync(p => p.UserId == userId);

            if (user is null)
                return ApiResponse<Unit>.Fail(new NotFoundException($"UserId: {userId} not found"));

            planProcedure.AssignedUsers.Remove(user);

            await _context.SaveChangesAsync();

            return ApiResponse<Unit>.Succeed(new Unit());
        }
        catch (Exception e)
        {
            return ApiResponse<Unit>.Fail(e);
        }
    }
}