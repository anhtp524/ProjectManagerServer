import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TeamRepository } from "../Team/team.repository";
import { Project, ProjectDocument } from "./project.schema";
;

@Injectable()
export class ProjectRepository {
    constructor(
        @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
        private teamRepo: TeamRepository) {}
    
    async create(newItem: any) {
        const newProject = new this.projectModel(newItem)
        return newProject.save()
    }

    async getAll(limit ?: number, page :number = 1) {
        const totalDocs = await this.projectModel.countDocuments()
        const totalPage = Math.ceil(totalDocs / limit)
        if(!limit) return await this.projectModel.find({})
                                                .populate('typeProject' ,'name')
                                                .populate('status', 'name')
                                                .populate('technology', 'name')
                                                .populate('member', 'name')
                                                .populate('customer', 'name')
                                                .exec()
        if(page > totalPage) throw new HttpException("Page is not exis", HttpStatus.NOT_FOUND)
        const docsView = await this.projectModel  
                                    .find({})
                                    .skip((page - 1) * limit) 
                                    .limit(limit)
                                    .populate('typeProject' ,'name')
                                    .populate('status', 'name')
                                    .populate('technology', 'name')
                                    .populate('member', 'name')
                                    .populate('customer', 'name')
                                    .exec()
        return {
                currentPage: page,
                totalPage: totalPage,
                data: docsView
            }
    }

    async getById(_id: string) {
        return this.projectModel
                    .findById(_id)
                    .populate('typeProject' ,'name')
                    .populate('status', 'name')
                    .populate('technology', 'name')
                    .populate('member','name')
                    .populate('customer', 'name')
    }

    async findOne(condition: any) {
        return await this.projectModel.find(condition)
    }

    async findMember(_id: string, technology ?: string) {
        if(technology) {
            const result = await this.projectModel.findById({_id: _id}, "member").populate({
                path: 'member',
                match: {technology: technology} 
            })
            return result.member
        }

        const result = await this.projectModel.findById({_id: _id}).populate("member")
        return result.member
        
    }
 
    async update(_id: string,item: any) {
        return this.projectModel.findByIdAndUpdate({_id: _id}, {$set:item})
    }

    async delete(_id: string) {
        const findProject = await this.projectModel.find({_id: _id})
        if(!findProject || findProject.length === 0) throw new HttpException("Not found",HttpStatus.NOT_FOUND)
        const projectInTeam = await this.teamRepo.findOne({project: _id})
        if (projectInTeam && projectInTeam.length !== 0) throw new HttpException("You can not delete", HttpStatus.NOT_ACCEPTABLE)
        await this.projectModel.findByIdAndDelete(_id)
        return "You have successfully deleted"
    }

    async getMemberInProject(nameProject: string) {
        return this.projectModel.find({name: nameProject}, "member").populate('member', 'name')
    }

    async countProjectWithCondition(status ?: string, type ?: string, technology ?: string, customer ?: string, date ?: string) {
        let filter : any = {
            status: status,
            typeProject: type,
            technology: technology,
            customer: customer
        }
        try {
            if(date) {
                filter = {
                    ...filter,
                    startDate: new Date(date)
                }
            }
            let query = {}
            for (let [key,value] of Object.entries(filter)) {
                if (value) {
                    query[key] = value
                }
            }
            const dataOfQuery = await this.projectModel.find(query)
            
                return {
                    filter: query,
                    amount: dataOfQuery.length,
                    data: dataOfQuery
                }
        }
        catch(err) {
            return new HttpException("Not count", HttpStatus.NOT_FOUND)
        }
    }
}