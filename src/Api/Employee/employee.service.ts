import { Injectable } from "@nestjs/common";
import mongoose from "mongoose";
import { CreateEmployeeDto, UpdateEmployeeDto } from "./dto/employee.dto";
import { EmployeeRepository } from "./employee.repository";
import { EmployeeDocument } from "./employee.schema";

@Injectable()
export class EmployeeService {
    constructor(private employeeRepo: EmployeeRepository) {}

    createEmployee(newEmployeeDto: CreateEmployeeDto) {
        let result: mongoose.Types.ObjectId[] = newEmployeeDto.technology.map(
            (value,index) => {
                return new mongoose.Types.ObjectId(value)
        })
        let {technology, ...rest} = newEmployeeDto
        const newEmployee = {...rest, technology: result}        

        return this.employeeRepo.create(<EmployeeDocument>newEmployee)
    }

    getAllEmployee(limit ?: number, page ?: number, search ?: string) {
        return this.employeeRepo.getAll(limit, page, search)
    }

    getEmployeeById(id: string) {
        return this.employeeRepo.getById(id)
    }

    updateEmployee(id: string, updateEmployee: UpdateEmployeeDto) {
        const result: mongoose.Types.ObjectId[] = updateEmployee.technology.map(
            (value, index) => {
                return new mongoose.Types.ObjectId(value)
            }
        )
        let {technology, ...rest} = updateEmployee
        const newUpdate = {... rest, technology: result}
        return this.employeeRepo.update(id, newUpdate )
    }

    deleteEmployee(id: string) {
        return this.employeeRepo.delete(id)
    }

    countEmployees(technology ?: string, project ?: string) {
        return this.employeeRepo.countEmployee(technology, project)
    }
}