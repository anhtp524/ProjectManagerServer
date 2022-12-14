import { Injectable } from "@nestjs/common";
import mongoose from "mongoose";
import { CreateTeamDto, UpdateTeamDto } from "./dto/team.dto";
import { TeamRepository } from "./team.repository";
import { TeamDocument } from "./team.schema";

@Injectable()
export class TeamService {
    constructor(private teamRepo: TeamRepository) {}

    createTeam(newTeamDto: CreateTeamDto) {
        const managerId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(newTeamDto.manager)
        const memberId: mongoose.Types.ObjectId[] = newTeamDto.member.map(
            (value,index) => {
                return new mongoose.Types.ObjectId(value)
        }) 
        const projectId: mongoose.Types.ObjectId[] = newTeamDto.project.map(
            (value,index) => {
                return new mongoose.Types.ObjectId(value)
        })
        let {manager, member, project, ...rest} = newTeamDto
        const newTeam = {
            ...rest, 
            manager: managerId,
            member: memberId,
            project: projectId
        }        

        return this.teamRepo.create(<TeamDocument>newTeam)
    }

    getAllTeam(limit ?: number, page ?: number, search ?: string) {
        return this.teamRepo.getAll(limit, page, search)
    }

    getTeamById(id: string) {
        return this.teamRepo.getById(id)
    }

    updateTeam(id: string, updateTeam: UpdateTeamDto) {
        const managerId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(updateTeam.manager)
        const memberId: mongoose.Types.ObjectId[] = updateTeam.member.map(
            (value,index) => {
                return new mongoose.Types.ObjectId(value)
        }) 
        const projectId: mongoose.Types.ObjectId[] = updateTeam.project.map(
            (value,index) => {
                return new mongoose.Types.ObjectId(value)
        })
        let {manager, member, project, ...rest} = updateTeam
        const newUpdate = {
            ...rest, 
            manager: managerId,
            member: memberId,
            project: projectId
        }        
        return this.teamRepo.update(id, newUpdate )
    }

    deleteTeam(id: string) {
        return this.teamRepo.delete(id)
    }

    getMember(nameTeam: string) {
        return this.teamRepo.getMemberInTeam(nameTeam)
    }

    getProject(nameTeam: string) {
        return this.teamRepo.getProjectInTeam(nameTeam)
    }
}