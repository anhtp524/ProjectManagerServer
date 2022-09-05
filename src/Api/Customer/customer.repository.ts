import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ProjectRepository } from "../Project/project.repository";
import { Customer, CustomerDocument } from "./customer.schema";
import { CreateCustomerDto, UpdateCustomerDto } from "./dto/customer.dto";


@Injectable()
export class CustomerRepository {
    constructor(
        @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
        private projectRepo: ProjectRepository    
    ) {}
    
    async create(newItem: CreateCustomerDto) {
        const newCustomer = new this.customerModel(newItem)
        return newCustomer.save()
    }

    async getAll(limit ?: number, page :number = 1) {
        const totalDocs = await this.customerModel.countDocuments()
        const totalPage = Math.ceil(totalDocs / limit)

        if(!limit) return this.customerModel.find()
        if(page > totalPage) throw new HttpException("Page is not exist", HttpStatus.NOT_FOUND)
        const docsView = await this.customerModel  
                                    .find({})
                                    .skip((page - 1) * limit) 
                                    .limit(limit)
        return {
                currentPage: page,
                totalPage: totalPage,
                data: docsView
            }

    }
    async getById(_id: string) {
        return this.customerModel.findById(_id)
    }

    async update(_id: string,item: UpdateCustomerDto) {
        return this.customerModel.findByIdAndUpdate({_id: _id}, item)
    }

    async delete(_id: string) {
        const findCustomer = await this.customerModel.find({_id: _id})
        if(!findCustomer || findCustomer.length === 0) throw new HttpException("Not found",HttpStatus.NOT_FOUND)
        const typeInProject = await this.projectRepo.findOne({type: _id})
        if(typeInProject && typeInProject.length !== 0) throw new HttpException("You can not delete", HttpStatus.NOT_ACCEPTABLE)
        await this.customerModel.findByIdAndDelete(_id)
        return "You have successfully deleted"
    }
}